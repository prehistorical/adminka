(function( $ ) {
    $(function(){

        'use strict';

        var Adminka = document.adminkaInterpro;
        Adminka.init({});

        var groupitemCreate = function (){

            var $this = $(this);

            var block_name    = $this.data('block');
            var description   = $this.data('descr');//Описание элемента группы для сообщения

            //Информатор:
            var messagecontainer = $('.group_messenger[data-block="'+block_name+'"]');
            //Контейнер, куда добавлять вьюшки новых категорий, отрисованных на сервере:
            var container = $('.group[data-block="'+block_name+'"]');

            //Сброс информатора:
            messagecontainer.removeClass('alert-success');
            messagecontainer.removeClass('alert-info');
            messagecontainer.removeClass('alert-danger');
            messagecontainer.text('');
            //-------------------------------------------

            $(this).adminka(
                'getcontent',
                {
                    type: 'GET',
                    url: '/adm/create/groupitem/'+block_name
                },
                {
                    done_callback: function(data){
                        if (data.status === 'OK') {
                            container.append(data.complhtml);
                            messagecontainer.addClass('alert-success');
                            messagecontainer.text('элемент ' + description + ' создан.');
                        }else{
                            messagecontainer.addClass('alert-warning');
                            messagecontainer.text('элемент ' + description + ' НЕ создан. Статус ошибки: ' + data.status);
                        }
                    },
                    fail_callback: function(data){
                        messagecontainer.addClass('alert-danger');
                        messagecontainer.append('Что-то пошло не по плану: <br>' + JSON.stringify(data));
                    },
                    always_callback: function(data){
                        //Убрать индикатор загрузки, если появится
                    }
                }
            );

            return this.first();
        };


        $.fn.gicreate = function (button_selector){

            this.on('click', button_selector, groupitemCreate);

            return this.first();
        };





        $(document).gicreate('.any_create');

    });
})(jQuery);