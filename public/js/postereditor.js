$(document).ready(function() { 
    // Set up AJAX form submission.
    $('#save_bar form').submit(submitForm);

    // Register click-to-edit functions. 
    $('header').click(function(e) { 
        showSaveBar();
        e.stopPropagation();
        if (editing != 'header') { 
            editing = 'header';

            var header = $('header'); 
            var h1 = $('header h1');
            $('header h2').remove();
            if (h1.attr('data-edited')) { 
                h1.replaceWith('<textarea>' + h1.text() + '</textarea>');
            } else { 
                h1.replaceWith('<textarea></textarea>');
            }
            $('header textarea').focus();
        }
        addNewEventListeners($('header textarea'));
    });

    $('body').click(function(e) { 
        if (editing) { 
            e.stopPropagation();
            saveChanges(editing);
            editing = false;
        }
    });


});

var endpoint = "/save"; // Where to post to. 
var editing = false; // What we're currently editing. 

/**
 * Saves the changes from a textbox back into a display-only HTML element.
 */
function saveChanges(target) { 
    switch (target) { 
        case 'header':
            var h1 = $('<h1>');
            h1.text($('header textarea').val());
            h1.attr('data-edited', 'true');
            $('header textarea').replaceWith(h1);
            break;
    }
}


/**
 * Shows the save prompt if it's currently hidden.
 */
function showSaveBar() { 
    var hiddenBar = $('#save_bar:hidden');
    if (hiddenBar) { 
        hiddenBar.slideDown();
    }
}


/**
 * Adds an event listener on our new editor to hook into enter to save, where appropriate.
 */
function addNewEventListeners(el) { 
}

/**
 * Submits our new poster to the server.
 */
function submitForm(e) { 
    e.preventDefault();
    
    // Make spinner.
    var button = $('#save_bar input');
    button.attr('value', 'Saving...');
    button.attr('disabled', 1);

    var payload = {};
    payload['title'] = $('header h1').text();
    payload['image_url'] = $('figure img').attr('src');
    payload['body'] = $('#article_text').text();
    payload['footer'] = $('footer p').text();

    $.post($(e.target).attr('action'), payload, function(result) { 
        $('#save_bar p').text("Saved! Your poster has id " + result);
        button.attr('value', 'Save');
        button.removeAttr('disabled');
    });
}

