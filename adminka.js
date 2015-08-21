;(function($){

    'use strict';

    //Задачи плагина: структурировать и скрыть вызовы к админской части сайта, выставив наружу простой интерфейс,
    //привязать создание сообщений с описанием ошибки или успешного завершения к кнопкам или виджетам к которым применили плагин,
    //собрать в одном месте общие настройки и настройки по умолчанию

    var adminkaAjax = (function(){

        var baseurl = document.location.protocol+"//"+document.location.host+"/adm";

        var default_config = {
            request_types:
            {
                postimage: {
                    type: 'POST',
                    url: '/adm/uploadimage',
                    contentType: false,
                    processData: false
                },

                getcontent: {
                    type: 'GET'
                },
                deletecontent: {
                    type: 'DELETE'
                },
                savecontent: {
                    type: 'POST',
                    dataType: 'json'
                }
            }
        };

        var inited = false;

        var config = {};

        return {
            init: function(init_params)
            {
                if (inited === false){

                    $.ajaxSetup({
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        }
                    });

                    config = $.extend(true, {},
                        default_config,
                        init_params);

                    inited = true;
                }
            },

            baseUrl: function(){
                return baseurl;
            },

            ajaxRequest: function(request_type, params)
            {

                if (inited){

                    var request_params = $.extend({}, config.request_types[request_type], params);

                    try {
                        var deferred = $.ajax(request_params);

                        return deferred;
                    }
                    catch (e) {

                        var deferred = $.Deferred();
                        deferred.reject({error: "Ошибка при попытке отправить запрос.<br>" + e});
                        return deferred;

                    }


                }else{

                    var deferred = $.Deferred();
                    deferred.reject({error: "Административная панель должна быть настроена для запросов к серверу методом init."});
                    return deferred;

                }

            }
        }

    })();

    document.adminkaInterpro = adminkaAjax;

    //Навешиваем на клик по элементу действия в админке и реакцию на них
    $.fn.adminka = (function(){

        var default_callbacks = {
            done_callback: function(data){
                return 'Результат = всё хорошо!';
            },
            fail_callback: function(data){
                return 'Результат = всё плохо!';
            },
            always_callback: function(data){
                return 'Есть какой-то результат.';
            }
        };

        return function(request_type, params, callbacks){

            var callbacks_config = $.extend(true, {},
                default_callbacks,
                callbacks);

            var defered = adminkaAjax.ajaxRequest(request_type, params);

            defered.done(callbacks_config.done_callback);
            defered.fail(callbacks_config.fail_callback);
            defered.always(callbacks_config.always_callback);

            return this.first();

        };
    }());

    $(function()
    {
        document.pickDateAll();
    });

    document.pickDateItem = function(){
        var $this = $(this);
        var pickerdefdate = $this.data('date');
        var picker = $this.data('DateTimePicker');
        picker.date(moment(pickerdefdate));
    };

    document.pickDateAll = function(){
        $('.sortdate').datetimepicker({locale: 'ru'});
        $('.sortdate').each(function(){
            var $this = $(this);
            var pickerdefdate = $this.data('date');
            var picker = $this.data('DateTimePicker');
            picker.date(moment(pickerdefdate));
        });
    };

    document.pickDateAll();

}(jQuery));