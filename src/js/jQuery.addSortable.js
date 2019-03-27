import 'jquery-ui/ui/widgets/sortable';

export default function($) {
    $.fn.addSortable = function(url) {
        $(this).sortable({
            handle: ".handle",
            stop : function(e, ui) {
                var stop_id = ui.item.prev().attr('data-id');
                if(stop_id === undefined) stop_id = 0;
                $.post(url, {
                    current_id : ui.item.attr('data-id'),
                    stop_id : stop_id
                }, function(data) { console.log(data); });
            }
        });
    }
}