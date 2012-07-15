var endpoint = "/save"; // Where to post to. 
var editing = false; // What we're currently editing. 
var body_markdown = "";
var undo = null;

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
            var editor = $('#image_edit').clone();

            undo = figure.contents();
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

/**
 * Handles turning a content area into an editing area, including setting
 * up heights and adding relevant event listeners.
 */
function clickToEditHandler(click, name, container, contentFunc, newlinesAllowed) { 
    showSaveBar();
    click.stopPropagation();
    if (editing != name) { 
        editing = name;

        undo = container.contents();
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
    var content = renderContent(editor, target);
    switch (target) { 
        case 'header':
            container = $('header');
            editor.replaceWith(content);
            break;
        case 'image': 
            container = $('figure');
            container.empty();
            container.append(content);
            break;
        case 'body':
            container = $('#article_text');
            editor.replaceWith(content);
            break;
        case 'footer': 
            container = $('footer'); 
            editor.replaceWith(content);
            break;
    }
    editing = false;
    container.attr('data_edited', 'true');
}

/**
 * Reverts the changes, typically when the user hits escape.
 */
function rollback(container) {
    container.empty();
    container.append(undo);
    editing = false;
}

/**
 * Takes the content in the editor and renders it into HTML. 
 * We use this both to insert the content post-editing and to 
 * measure the size of it for auto-resizing of the content area.
 */
function renderContent(editor) { 
    switch (editing) {
        case 'header': 
            var h1 = $('<h1>');
            h1.text(editor.val());
            return h1;
            break;
        case 'image':
            var img = $('<img>');
            img.attr('src', editor.val());
            return img;
            break;
        case 'footer':
            var p = $('<p>');
            p.text(editor.val());
            return p;
        case 'body':
            body_markdown = editor.val();
            var converter = Markdown.getSanitizingConverter();
            return converter.makeHtml(body_markdown);
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
function addSaveListeners(el, newlinesAllowed) { 
    el.blur(function() { saveChanges(el, editing); });
    if (!newlinesAllowed) { 
        el.keydown(function(ev) { 
            if (13 == ev.which) { saveChanges(el, editing); }
            if (27 == ev.which) { rollback(el.parent()); }
        });
    }
}


/** 
 * Checks the size of the editor area, and alters it if it gets bigger. 
 */
function addAutoSizeListeners(editor, container) { 
    editor.keyup(function(ev) { 
        var content = renderContent(editor);
        content.hide();
        container.append(content);
        var fudgeFactor = 50;
        if (content.height() + fudgeFactor > editor.height()) { 
            editor.height(content.height() + fudgeFactor);
        }
        content.detach();
    });
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

