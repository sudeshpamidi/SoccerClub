"use strict"

var validationUtility = function() {
    let elements = $('[data-role="validate"]');
    let elementCount = 0;

    elements.popover({
        trigger: 'focus',
        placement: 'right' //,
            //content: "messge."
    });

    var validate = function(formSelector) {
        elementCount = 0;
        if (formSelector.indexOf('#') === -1) {
            formSelector = '#' + formSelector;
        }
        return $(formSelector)[0].checkValidity();
    };

    elements.on('invalid', function() {
        if (elementCount === 0) {
            $(this).popover('show');
            elementCount++;
        }
    });

    return {
        validate: validate // expose outside to utilize
    };
};
var validator = new validationUtility();