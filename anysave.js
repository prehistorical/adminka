(function( $ ) {
    $(function(){

        'use strict';

        var Adminka = document.adminkaInterpro;
        Adminka.init({});

        var anySave = function anySave(){

            var $this = $(this);

            var block_name    = $this.data('block');
            var entity_name   = $this.data('entity');
            var description   = $this.data('descr');//Описание элемента группы для сообщения

            var messagecontainer;
            var item_id;

            var dataobj = {};
            dataobj['block'] = block_name;
            dataobj['entity'] = entity_name;

            dataobj['stringfields'] = {};
            dataobj['textfields'] = {};
            dataobj['bools'] = {};
            dataobj['numbs'] = {};
            dataobj['images'] = {};

            var add_fields = function(selector, image_selector, obj){
                $(selector).each(function(){
                    var $this = $(this);

                    var field_type = $this.data('field-type');
                    var field_name = $this.data('field-name');

                    if (field_type == 'bool') {
                        obj['bools'][field_name] = $this.is(':checked');

                    } else if (field_type == 'text') {
                        obj['textfields'][field_name] = $this.val();

                    } else if (field_type == 'string') {
                        obj['stringfields'][field_name] = $this.val();

                    } else if (field_type == 'numb') {
                        obj['numbs'][field_name] = $this.val();

                    } else if (field_type == 'image') {
                        obj['images'][field_name] = {
                            primary_link: $('.primary_link'+image_selector+'[data-field-name="'+field_name+'"]').val(),
                            secondary_link: $('.secondary_link'+image_selector+'[data-field-name="'+field_name+'"]').val(),
                            preview_link: $('.preview_link'+image_selector+'[data-field-name="'+field_name+'"]').val(),
                            alt:          $('.image_alt'+image_selector+'[data-field-name="'+field_name+'"]').val(),
                            icon_link: ''

                        };
                    } else {

                        obj['stringfields'][field_name] = $this.val();//Если тип не указан, будем считать что это строка
                    }
                });
            };

            var add_pre_fields = function(selector, obj){

                $(selector).each(function(){

                    var $this = $(this);
                    var field_name = $this.data('field-name');
                    var field_type = $this.data('field-type');

                    if (field_type == 'bool') {
                        obj[field_name] = $this.is(':checked');
                    }else{
                        obj[field_name] = $this.val();
                    }
                });
            };

            if(entity_name == 'block') {

                add_fields(
                    '.block_field[data-block="'+block_name+'"]',
                    '[data-block="'+block_name+'"]',
                    dataobj);

                add_pre_fields('.block_pre_field[data-block="'+block_name+'"]', dataobj);

                //Информатор:
                messagecontainer = $('.block_messenger[data-block="'+block_name+'"]');

                description = 'Блок ' + description;
            } else if(entity_name == 'groupitem') {

                item_id = $this.data('item-id');

                dataobj['id'] = item_id;

                add_fields(
                    '.group_field[data-block="'+block_name+'"][data-item-id='+item_id+']',
                    '[data-block="'+block_name+'"][data-item-id="'+item_id+'"]',
                    dataobj);

                add_pre_fields('.group_pre_field[data-block="'+block_name+'"][data-item-id='+item_id+']', dataobj);

                //Информатор:
                messagecontainer = $('.group_messenger[data-block="'+block_name+'"]');

                description = 'Элемент группы блока ' + description;
            }

            //Сброс информатора:
            messagecontainer.removeClass('alert-success');
            messagecontainer.removeClass('alert-info');
            messagecontainer.removeClass('alert-danger');
            messagecontainer.text('');
            //-------------------------------------------

            $(this).adminka(
                'savecontent',
                {
                    type: 'POST',
                    url: '/adm/save/'+entity_name,
                    data: dataobj
                },
                {
                    done_callback: function(data){
                        if (data.status === 'OK') {
                            messagecontainer.addClass('alert-success');
                            messagecontainer.text(description + ' сохранен.');
                        }else{
                            messagecontainer.addClass('alert-warning');
                            messagecontainer.text(description + ' НЕ сохранен. Статус ошибки: ' + data.status);
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
        };


        $.fn.anysave = function (button_selector){

            this.on('click', button_selector, function(){
                    anySave.call(this);
                });

            return this.first();
        };



        $(document).anysave('.any_save');

    });

})(jQuery);