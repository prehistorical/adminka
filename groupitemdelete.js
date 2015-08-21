(function( $ ) {
    $(function(){

        'use strict';

        var Adminka = document.adminkaInterpro;
        Adminka.init({});



        var anyDelete = function anyDelete(){

            var block_name    = $(this).data('block');

            var messagecontainer = $('.group_messenger[data-block="'+block_name+'"]');

            messagecontainer.removeClass('alert-success');
            messagecontainer.removeClass('alert-info');
            messagecontainer.removeClass('alert-danger');
            messagecontainer.text('');
            var deleted =  $('tr[data-item-id="'+$(this).data('item-id')+'"]').remove();

            $(this).adminka(
                'deletecontent',
                {
                    type: 'delete',
                    url: '/adm/delete/groupitem/'+$(this).data('item-id')
                },
                {
                    done_callback: function(data){
                        if (data.status === 'OK') {
                            deleted.remove();
                            messagecontainer.addClass('alert-success');
                            messagecontainer.text('Блок Удален.');
                        }else{
                            messagecontainer.addClass('alert-warning');
                            messagecontainer.text('Блок НЕ удален. Статус ошибки: ' + data.status);
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
                anyDelete.call(this);
            });

            return this.first();
        };



        $(document).anysave('.any_delete');

    });

})(jQuery);