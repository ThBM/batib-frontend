import $ from 'jquery';
import Cookies from 'js-cookie';

$(function() {

    //Format Data
    $(".prix, .date, .pourcentage, .number").formatData();

    //Flash box
    if($(".flashes").text().trim() !== "") {
        $(".flashes-container").slideDown(500).fadeOut(8000, function () {
            $(".flashes").text("");
        });
    }
    $(".flashes-container").mouseover(function() {
        $(this).css("opacity", 1).stop();
    });
    $(".flashes-container").mouseleave(function() {
        $(this).fadeOut(5000, function () {
            $(".flashes").text("");
        });
    });



    //GED
    $(".gedButton").click(function () {
        setTimeout(function () {
            $("#searchGed").focus().select();
        }, 100);
    });
    $("#searchGed").keyup(function () {
        var search = $(this).val();
        var keywords = search.split(" ");
        $(".ged-item").each(function () {
            var filtre = filtreGed(keywords, $(this));
            if(filtre) {
                $(this).show();
            } else {
                $(this).hide();
            }
        })
    });
    function filtreGed(keywords, gedItem) {
        var nom = $(gedItem).find(".nomGed");
        var date = $(gedItem).find(".dateGed");
        var filtre = true;
        keywords.forEach(function (item) {
            if(item === "") {
                return;
            }
            var regex = new RegExp(item, "i");
            if( !$(nom).text().match(regex) && !$(date).text().match(regex) ) {
                filtre = false;
            }
        });
        return filtre;
    }
    $(".ged-item").click(function () {
        showGedModal(this);
    });





    //SelectBox
    $("#selectBox-group select").change(function () {
        $(".container-fluid").hide();
        $("#selectBox-group").submit();
    });
    $("#selectBox-group .changeSelectbox").click(function() {
        var sens = $(this).attr("data-sens");
        var currentOption = $('#selectBox-group select > option:selected');
        if(sens > 0) {
            var newOption = currentOption.nextAll('option').not(".d-none").first();
        } else {
            var newOption = currentOption.prevAll('option').not(".d-none").first();
        }
        if(newOption.length > 0) {
            currentOption.removeAttr("selected");
            newOption.attr("selected", "selected");
        }

        $("#selectBox-group select").change();
    });



    //Filtre
    window.filtre = Cookies.get("filtre") ? JSON.parse(Cookies.get("filtre")) : [];

    //Afficher les statuts filtrés
    displayFiltre();
    function displayFiltre() {
        $(".filtre .dropdown-item").each(function () {
            var statut = $(this).data("statut");
            var type = $(this).data("type");
            var statutCode = type + " " + statut;
            if(filtre.indexOf(statutCode) != -1) {
                $(this).html(statut + " <i class='fa fa-check'></i>");
            } else {
                $(this).html(statut + " <i class='fa fa-times'></i>");
            }
        });
    }
    //Changement du filtre
    $(".filtre .dropdown-item").click(function () {
        var statut = $(this).data("statut");
        var type = $(this).data("type");
        var statutCode = type + " " + statut;
        var index = filtre.indexOf(statutCode);

        if(index == -1) {
            filtre.push(statutCode);
            $(this).html(statut + " <i class='fa fa-check'></i>");
        } else {
            filtre.splice(index, 1);
            $(this).html(statut + " <i class='fa fa-times'></i>");
        }

        Cookies.set('filtre', JSON.stringify(filtre), { expires: 30 });
        console.log(filtre);
        $(this).trigger("filtreChanged");
    });

    //Filtre sur le selectBox
    filtreSurSelectBox();
    $(".filtre .dropdown-item").on("filtreChanged", filtreSurSelectBox);
    function filtreSurSelectBox() {
        $("#selectBox-group.filtre select option").each(function () {
            var statutCode = $(this).data("statut");
            if(filtre.indexOf(statutCode) !== -1) {
                $(this).removeClass("d-none");
            } else {
                $(this).addClass("d-none");
            }
        });
    }



    //Modal de confirmation de suppression
    $(".removeConfirm").click(function () {
        removeConfirm(this);
    });

    $('.dropdown-menu.filtre').on("click.bs.dropdown", function (e) { e.stopPropagation(); e.preventDefault(); });

});

function addFlash(type, message) {
    $(".flashes").append("\
            <div class=\"alert alert-dismissible alert-" + type + "\"> \
                " + message + " \
                <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"> \
                    <span aria-hidden=\"true\">×</span> \
                </button> \
            </div> \
        ");
    $(".flashes-container").css("opacity", 1).stop();
    $(".flashes-container").slideDown(500).fadeOut(5000, function () {
        $(".flashes").text("");
    });
}

function removeConfirm(e) {
    var title = $(e).data("title");
    var label = $(e).data("label");
    var path = $(e).data("path");

    $("#modal-removeConfirmation .modal-header .modal-title").text(title);
    $("#modal-removeConfirmation .modal-body #label").text(label);
    $("#modal-removeConfirmation .modal-footer #confirmationButton").attr("href", path);
    $("#modal-removeConfirmation").modal();
}

function showGedModal(e) {
    var type = $(e).attr("data-type");
    var url = $(e).attr("data-url");
    $("#modal-showGed .modal-title").text(type);
    $("#modal-showGed iframe").attr("src", url);
}

$(window).on('load', function() {
    $('body').fadeIn();
});