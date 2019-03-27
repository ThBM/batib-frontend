import $ from 'jquery';

//Date Type detection
$.fn.dataTable.ext.type.detect.unshift(
    function ( d ) {
        return /[0-9][0-9]\/[0-9]{2}\/[0-9]{4}/.test(d) ?
            'date' :
            null;
    }
);

//Date Type sort
$.fn.dataTable.ext.type.order['date-pre'] = function ( d ) {
    var split = d.split("/");
    return split[2] * 10000 + split[1] * 100 + split[0] * 1;
};



//Numeric Type detection
$.fn.dataTable.ext.type.detect.unshift(
    function ( d ) {
        return !isNaN(d.replace(/[ €%]/g, '')) ?
            'numeric' :
            null;
    }
);

//Numeric Type sort
$.fn.dataTable.ext.type.order['numeric-pre'] = function ( d ) {
    return parseFloat(d.replace(/[ €%]/g, ''));
};



//Default search function
$.fn.dataTable.ext.search.push(function( settings, data, dataIndex ) {
    var search = $("#search").val();

    //filtre avec le nom du dossier et le numéro
    var regex = new RegExp(search, "i");
    var length = data.length;
    for(var i=0; i<length; i++) {
        if(data[i].match(regex)) {
            return true;
        }
    }
    return false;
});