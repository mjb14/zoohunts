var EAS = EAS || {};

// -------------------------------------------------------------------------------------------
// START: Workflow related
//          After submitting to workflow, hide all tabs and display only a confirmation tab
// -------------------------------------------------------------------------------------------
        
        
// add hidden class to all tabs, if its the 
// confirmation tab, remove the hidden
EAS.tabsAfterWorkflowSubmit = function(confirmationTabText) {
    $('.nav-tabs li a').each(function(i,v){
        if( $(v).text() == confirmationTabText ) {
            $(v).removeClass('hidden');
        } else {
            $(v).addClass('hidden');
        }
    });
}
// -------------------------------------------------------------------------------------------
// END: Workflow related
// -------------------------------------------------------------------------------------------
            
            

// return ISO datetime in string format for the current datetime
EAS.getCurrentIsoDate = function() {

    // padding function
    var s = function(a, b) {
        return (1e15 + a + "").slice(-b)
    };

    var d = new Date();

    // return ISO datetime
    return d.getFullYear() + '-' +
        s(d.getMonth() + 1, 2) + '-' +
        s(d.getDate(), 2) + ' ' +
        s(d.getHours(), 2) + ':' +
        s(d.getMinutes(), 2) + ':' +
        s(d.getSeconds(), 2);
}

// Convert an ISO datetime string into a date object 
EAS.getDateObject = function(date) {
    if (date === null) {
        return null;
    }
    var dateObj = new Date(date.substr(0, 4), date.substr(5, 2) - 1, date.substr(8, 2), date.substr(11, 2), date.substr(14, 2), date.substr(17, 2));
    return dateObj;
}

// will replace named params :var0, :var1, etc with the values passed in from the array for a given message
EAS.getGlobalMessage = function(key, paramsArray) {

    var message = EAS.globalMessages[key];

    if (paramsArray) {
        $.each(paramsArray, function(i, v) {
            message = message.replace(":var" + i, v);
        });
    }

    return message;
}

EAS.toggleAppMenu = function(item) {
    $('body').toggleClass('hide-menu');
}

EAS.toggleAppScreenSize = function() {
    $('.page-size-controller').toggleClass('container');
    $('.toggle-app-screen-size').toggleClass('icon-resize-full');
    $('.toggle-app-screen-size').toggleClass('icon-resize-small');
}


EAS.toggleCheckAll = function(item) {
    var checked = $(item).is(':checked');
    var table = $(item).parents('table');

    $('#' + table.attr('id') + ' ' + '.delete-checked').prop('checked', checked);

    $('#' + table.attr('id') + ' ' + '.delete-checked').click();

    $('#' + table.attr('id') + ' ' + '.delete-checked').prop('checked', checked);

}


EAS.toggleContainer = function(container) {
    $('#' + container).toggle();
    $('#' + container + '-toggle i').toggleClass('icon-caret-down');
    $('#' + container + '-toggle i').toggleClass('icon-caret-right');
}

// Search a hierarchical structure to find a specific key value pair
EAS.findKey = function(structure, keyObj) {
    var p, key, val, tRet;
    for (p in keyObj) {
        if (keyObj.hasOwnProperty(p)) {
            key = p;
            val = keyObj[p];
        }
    }

    for (p in structure) {
        if (p == key) {
            if (structure[p] == val) {
                return structure;
            }
        } else if (structure[p] instanceof Object) {
            if (structure.hasOwnProperty(p)) {
                tRet = EAS.findKey(structure[p], keyObj);
                if (tRet) {
                    return tRet;
                }
            }
        }
    }

    return false;
}

EAS.showPageError = function(message) {
    EAS.removePageError();
    if (message) {
        $('#error-placeholder').removeClass('hidden');
        $('#error-placeholder').html('<h4><i class="icon-warning-sign icon-large"></i> Errors Found</h4><p>' + message + '</p>');
    }
}

// 1. Add the error class to the control group of the element
// 2. Display the field error message text
// 3. If there were no individual elements to apply the messages to, show it at the page level
EAS.showFormErrors = function(messages, serverMessage, service) {

    EAS.removePageError();
    if (messages) {

        var errorText = "<ul>";

        $.each(messages, function(k, v) {
            errorText += "<li>" + service.getLabel(k) + ": " + v + "</li>";

            // Identify the control group as having an error
            $('#form-group-' + k).addClass('has-error');
        });

        errorText += "</ul>";

        // If no validation message, just display the server message, else only display validation messages
        var size = 0,
            key;
        for (key in messages) {
            if (messages.hasOwnProperty(key)) size++;
        }
        if (!size) {
            errorText = serverMessage;
        }

        $('#error-placeholder').removeClass('hidden');
        $('#error-placeholder').html('<h4><i class="icon-warning-sign icon-large"></i> Errors Found</h4><p>' + errorText + '</p>');

        // scroll to top of page
        window.scrollTo(0, 0);

    }

    /*
    EAS.removeFormErrors();
    
    if( messages ){
        var message_text = '';
        $.each(messages, function(k,v) {
        
        // Identify the control group as having an error
        $('#form-group-' + k).addClass('has-error');

        // Display the error message text
        $('#form-group-' + k + ' .error-block').html(v);

        // Have the error show up on the page   
        $('#form-group-' + k + ' .error-block').removeClass('hidden');

        // If there isn't a container, show the error as a page error
        if( $('#form-group-' + k + ' .error-block').size() == 0 ){
                message_text += ( v || '' );
            }
        });
        if( message_text.length > 0 ){
            EAS.showPageError(message_text);
        }
    }
    */
}

// 1. Reset form to remove any error messages and error classes
EAS.removeFormErrors = function() {
    // remove from form group
    $('.form-group').removeClass('has-error');
}

EAS.removePageError = function() {
    $('#error-placeholder').html("");
    $('#error-placeholder').addClass("hidden");
}
