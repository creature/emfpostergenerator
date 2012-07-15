var endpoint = "/save"; // Where to post to. 
var editing = false; // What we're currently editing. 
var body_markdown = "";

$(document).ready(function() { 
    // Set up AJAX form submission.
    $('#save_bar form').submit(submitForm);

    // Register click-to-edit functions. 
    $('header').click(function(e) { 
        clickToEditHandler(e, 'header', $('header'), function f() { return $('header h1').text(); }, false);
    });

    $('figure').click(function(e) { 
        showSaveBar();
        e.stopPropagation();
        if (editing != 'image') { 
            editing = 'image'; 
            var figure = $('figure');
            var editor = $('#image_edit');

            figure.empty();
            figure.append(editor);
            editor.show();
            editor.find('input').focus();
            editor.submit(function(e) { e.preventDefault(); });
            addSaveListeners(editor.find('input'), false);
        }
    });

    $('#article_text').click(function(e) { 
        clickToEditHandler(e, 'body', $('#article_text'), function f() { return body_markdown; }, true);
    });
    
    $('footer').click(function(e) { 
        clickToEditHandler(e, 'footer', $('footer'), function f() { return $('footer').text(); }, false);
    });

    $('body').click(function(e) { 
        if (editing) { 
            e.stopPropagation();
            saveChanges(editing);
            editing = false;
        }
    });
});

function clickToEditHandler(click, name, container, contentFunc, newlinesAllowed) { 
    showSaveBar();
    click.stopPropagation();
    if (editing != name) { 
        editing = name;

        var contents = contentFunc().trim();
        var container_height = container.height();
        container.empty();
        if (container.attr('data_edited')) { 
            container.append('<textarea>' + contents + '</textarea>');
        } else { 
            container.append('<textarea></textarea>');
        }
        editor = container.find('textarea');
        editor.height(container_height);
        editor.focus();
        addSaveListeners(editor, newlinesAllowed);
        addAutoSizeListeners(editor, container);
    }
}


/**
 * Saves the changes from a textbox back into a display-only HTML element.
 */
function saveChanges(editor, target) { 
    var container;
    switch (target) { 
        case 'header':
            container = $('header');
            var h1 = $('<h1>');
            h1.text(editor.val());
            editor.replaceWith(h1);
            break;
        case 'image': 
            container = $('figure');
            var img = $('<img>');
            img.attr('src', editor.val());
            container.empty();
            container.append(img);
            break;
        case 'body':
            container = $('#article_text');
            body_markdown = editor.val();
            var converter = Markdown.getSanitizingConverter();
            editor.replaceWith(converter.makeHtml(body_markdown));
            break;
        case 'footer': 
            container = $('footer'); 
            var p = $('<p>');
            p.text(editor.val());
            editor.replaceWith(p);
            break;
    }
    editing = false;
    container.attr('data_edited', 'true');
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
function addSaveListeners(el, newlinesAllowed) { 
    el.blur(function() { saveChanges(el, editing); });
    if (!newlinesAllowed) { 
        el.keydown(function(ev) { if (13 == ev.which) { saveChanges(el, editing); }});
    }
}

function addAutoSizeListeners(editor, container) { 
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
    payload['body'] = body_markdown;
    payload['footer'] = $('footer p').text();

    $.post($(e.target).attr('action'), payload, function(result) { 
        $('#save_bar p').text("Saved! Your poster is available at http://" + window.location.host + "/" + result);
        button.attr('value', 'Save');
        button.removeAttr('disabled');
    });
}

