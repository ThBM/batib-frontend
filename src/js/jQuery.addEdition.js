export default function($) {

    $.fn.addEdition = function(url, id) {

        //En fonction du droit de l'utilisateur, on bloque ou non le champs.
        if(droitUserEcriture) {
            $(this).filter(":not(select)").attr("contentEditable", true);
            $(this).filter(":not(select)").addClass("bg-edit");
            $(this).filter("select").parents("td.select").addClass("bg-edit");
        } else {
            $(this).filter("select").attr("disabled", "disabled");
        }

        //On défini les touches utilisable par type de champs
        $(this).filter(":not(.textarea)").keypress(function (e) {
            //New line only for textarea
            if (e.keyCode === 13) {
                $(this).blur();
                return false
            }
        });
        $(this).filter(".prix, .pourcentage, .number").keypress(function (e) {
            //Only numeric or dot
            return e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode === 46 || e.keyCode === 45;
        });
        $(this).filter(".date").keypress(function (e) {
            //Only numeric or slash
            var allowedKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "/"];
            return (allowedKeys.indexOf(e.key) !== false && $(this).text().length < 10) || e.key === "Backspace";
        });


        //Double click sur une date met la date du jour
        $(this).filter(".date").dblclick(function() {
            if( $(this).text() === "" ) {
                $(this).focus();
                $(this).text(moment().format("DD/MM/YYYY"));
            }
        });


        //TEXTS
        var editTexts = $(this).filter(":not(select)");
        //On stock la valeur initiale
        editTexts.focus(function() {
            if($(this).hasClass("number") || $(this).hasClass("prix") || $(this).hasClass("pourcentage")) {
                var originalValue = $(this).html().replace(/[^\-\.0-9]/g, "");
                $(this).data("originalValue", originalValue);
                $(this).text(originalValue);
            } else {
                var originalValue = $(this).html();
                $(this).data("originalValue", originalValue);
            }

            //Selectionne le texte de la cellule
            if (document.body.createTextRange) {
                var range = document.body.createTextRange();
                range.moveToElementText(this);
                range.select();
            } else if (window.getSelection) {
                var selection = window.getSelection();
                var range = document.createRange();
                range.selectNodeContents(this);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        });

        //Quand on quitte la cellule, si on a modifié, on envoie les données au serveur.
        editTexts.blur(function() {
            var newValue = $(this).text();


            var originalValue = $(this).data("originalValue");

            if (newValue !== originalValue) {
                var object = $(this);
                object.attr("contentEditable", false);
                object.addClass("edit-loading");

                //On retraite pour les dates
                if(object.hasClass("date")) {
                    newValue = moment(newValue, "DD/MM/YYYY").format("YYYY-MM-DD");
                }

                var dataForAjax = {
                    id: id ? id : object.data("id"),
                    attribute: object.data("attribute"),
                    value: newValue,
                    isDate: object.hasClass("date") // TODO : A transformer en US côté client.
                };


                $.ajax({
                    url: url,
                    method: "POST",
                    data: dataForAjax,
                    success: function (response) {
                        object.html(response.data.value);
                        object.formatData();

                        object.attr("contentEditable", true);
                        object.removeClass("edit-loading");
                        object.trigger("edit", {value: newValue});
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        if(jqXHR.responseJSON !== undefined)
                            addFlash("danger", jqXHR.responseJSON.msg);
                        else {
                            if(textStatus === "timeout") {
                                addFlash("danger", "Veuillez vérifier votre connexion internet.");
                            } else {
                                addFlash("danger", "Une erreur s'est produite.");
                            }
                        }
                        console.log(jqXHR);
                        object.text(originalValue);
                        object.formatData();

                        object.attr("contentEditable", true);
                        object.removeClass("edit-loading");
                    },
                    timeout: 10000
                });
            } else {
                console.log($(this).text());
                $(this).formatData();
                console.log($(this).text());
            }
        });




        //SELECTS
        var editSelects = $(this).filter("select");

        editSelects.each(function() {
            var initialValue = $(this).data("value");
            $(this).val(initialValue);
        });

        editSelects.change(function() {
            var object = $(this);
            object.attr("disabled", true);

            var newValue = object.val();

            var dataForAjax = {
                id: id ? id : object.data("id"),
                attribute: object.data("attribute"),
                value: newValue
            };

            $.ajax({
                url: url,
                method: "POST",
                data: dataForAjax,
                success: function (data) {
                    object.val(data.data.value);

                    object.attr("disabled", false);
                    object.trigger("edit", {value: newValue});
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if(jqXHR.responseJSON !== undefined)
                        addFlash("danger", jqXHR.responseJSON.msg);
                    else {
                        if (textStatus === "timeout") {
                            addFlash("danger", "Veuillez vérifier votre connexion internet.");
                        } else {
                            addFlash("danger", "Une erreur s'est produite.");
                        }
                    }
                    console.log(jqXHR);

                    object.attr("disabled", false);
                },
                timeout: 10000
            });
        });

        return this;
    };
}