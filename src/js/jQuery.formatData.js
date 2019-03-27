import moment from 'moment';

export default function($) {

    function numberWithSpaces(x) {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        return parts.join(".");
    }

    $.fn.formatNumber = function() {
        $(this).each(function() {
            var a = Number($(this).text()).toFixed(2);
            $(this).text(numberWithSpaces(a));
            $(this).css('text-align', 'right');
        });
        return this;
    };

    $.fn.formatPrix = function() {
        $(this).each(function() {
            $(this).formatNumber();
            $(this).text($(this).text()+' €');
        });
        return this;
    };

    $.fn.formatPourcentage = function() {
        $(this).each(function() {
            $(this).formatNumber();
            $(this).text($(this).text()+' %');
        });
        return this;
    };

    $.fn.formatDate = function() {
        $(this).each(function() {
            var text = $(this).text();
            var date = moment(text, "YYYY-MM-DD");
            $(this).text(date.format("DD/MM/YYYY"));
        });
        return this;
    };

    $.fn.formatData = function() {
        $(this).each(function() {
            if($(this).hasClass("number")) {
                $(this).formatNumber();
            } else if ($(this).hasClass("prix")) {
                $(this).formatPrix();
            } else if($(this).hasClass("pourcentage")) {
                $(this).formatPourcentage();
            } else if($(this).hasClass("date")) {
                $(this).formatDate();
            }
        });
        return this;
    };
}