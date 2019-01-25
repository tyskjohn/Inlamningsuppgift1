$(function() {

    $("form input").blur(function() {
        validateFormElements($(this));
    });
    
    $("form select").blur(function() {
        validateFormSelectElements($(this));    
    });

    $("form select").change(function() {
        validateFormSelectElements($(this));    
    });

    
    // Functions
    function validateFormElements(input) {
        let min = 2;

        // input type TEXT
        if($(input).attr("type") === "text" && $(input).prop("required") ) {

            if($(input).data("id") === "address") {
                min = 4;
                validateInputValue(input, `Must contain atleast ${min} chracters both street name and sreet number`, min);

            } else if($(input).data("id") === "postalCode") {
                min = 5;
                validateInputValue(input,`Must contain ${min} digits without space`, min );

            } else {
                validateInputValue(input, `Must contain atlest ${min} letters`, min);
            }
        }

        // input type RADIO
        if($(input).attr("type") === "radio" && $(input).prop("required")) {
            validateRadioButton(input);
        }

        // input type CHECKBOX
        if($(input).attr("type") === "checkbox" && $(input).prop("required")) {
            validateCheckbox(input);
        }

        // input type EMAIL
        if($(input).data("id") === "email" && $(input).prop("required") ) {
            validateEmail(input);
        }

        // input type PASSWORD
        if($(input).attr("type") === "password" && $(input).prop("required")) {
            let comparePassword = findComparePassword();
            min = 8;

            if($(input).data("comparewith") !== undefined) {
                validatePassword(comparePassword[0], comparePassword[1]);

            } else {
                min = 8;
                validateInputValue(input, `Must contain atleast ${min} characters`, min);
                validatePassword(comparePassword[0], comparePassword[1]);            
            }
        }
    }

    function validateFormSelectElements(select) {
        if(!$(select).val() && $(select).prop("required")) {
            isInvalid(select);
        } else {
            isValid(select);           
        }
    }

    function validateInputValue(input, error, min = 1, max = 4096) {
        let invalidFeedbackId = "#" + $(input).attr("id") + "-invalid-feedback";
        let invalidFeedbackDefault = $(invalidFeedbackId).html();
        let invalidFeedback = error;

        if(!$(input).val()) {
            isInvalid(input);
            $(invalidFeedbackId).html(invalidFeedbackDefault);
        } else if ($(input).val().length < min ) {
            isInvalid(input);
            $(invalidFeedbackId).html(invalidFeedback);
        } else {
            isValid(input);
        }
    }

    // validate radiobuttons
    function validateRadioButton(radio) {
        let $elements = $("[name='"+ $(radio).attr("name") +"']");
        let checked = [];

        $elements.each(function(i, radio) {
            checked.push($(radio).prop("checked"));
        });

        if(checked.includes(true)) {
            $(elements).each(function(i, radio) {
               $(radio).removeClass("is-invalid"); 
            });
        } else {
            $(elements).each(function(i, radio) {
                $(radio).addClass("is-invalid"); 
            });           
        }
    }

    // validerar om en checkbox är ibockad eller inte.
    function validateCheckbox(checkbox) {
        if($(checkbox).prop("checked")) {
            $(checkbox).removeClass("is-invalid");
        } else {
            $(checkbox).addClass("is-invalid");
        }
    }

    // validerar om e-postadressen är gilitg med hjälp av regular expression, och skriver ut felmeddelande (värdet på variabeln invalidFeedback).
    function validateEmail(input) {
        let invalidFeedbackId = "#" + $(input).attr("id") + "-invalid-feedback";
        let invalidFeedbackDefault = $(invalidFeedbackId).html();
        let invalidFeedback = "The email address you entered is not valid";
        let regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,6})+$/;

        if(!$(input).val()) {
            isInvalid(input);
            $(invalidFeedbackId).html(invalidFeedbackDefault);
        } else if(!regex.test($(input).val() )) {
            isInvalid(input);
            $(invalidFeedbackId).html(invalidFeedback);
        } else {
            isValid(input);
        }
    }

    // jämför lösenord
    function findComparePassword() {
        let arr = [];
        $("form input").each(function(i, input) {
            if($(input).attr("type") === "password" && $(input).prop("required")) {
                if($(this).data("comparewith") !== undefined) {
                    arr.push("#" + $(input).attr("id"));
                    arr.push($(input).data("comparewith"));
                }
            }
        });
        return arr;
    }

    // validerar lösenord
    function validatePassword(input, compareWith) {
        let min = 8;
        let invalidFeedbackId = input + "-invalid-feedback";
        let invalidFeedbackDefault = $(invalidFeedbackId).html();
        let invalidFeedback = "Password doesn't match each other";
        let result = ($(input).val() === $(compareWith).val()) ? true : false;

        if(!$(input).val()) {
            isInvalid(input);
            $(invalidFeedbackId).html(invalidFeedbackDefault);

        } else if(!result) {
            isInvalid(input);
            $(invalidFeedbackId).html(invalidFeedback);

        } else if($(input).val().length < min ) {
            validateInputValue(input, `Must contain atleast ${min} characters`, min);

        } else {
            isValid(input);
        }
    }

    // lägger till klassen is-valid och tar bort is-invalid
    function isValid(element, validClass = "is-valid", invalidClass= "is-invalid") {
        $(element).addClass(validClass);
        $(element).removeClass(invalidClass);
    }

    // lägger till klassen is-invalid och tar bort is-valid
    function isInvalid(element, validClass = "is-valid", invalidClass= "is-invalid") {
        $(element).addClass(invalidClass);
        $(element).removeClass(validClass);
    } 

    window.addEventListener("load",function() {
        var forms = document.getElementsByClassName("needs-validation");
        Array.prototype.filter.call(forms, function(form) {
            form.addEventListener("submit", function(event) {
                if(form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add("was-validated");
            },false);
        });
    },false);

});