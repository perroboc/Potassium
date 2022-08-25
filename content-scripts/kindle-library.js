var K_selected_book_node;

const K_globalHide = K_getGlobalHide();
K_debug(`K_globalHide: ${K_globalHide}`);

const config = { attributes: true, childList: true, subtree: true };
const callback = function (mutationList, observer) {
    for (const mutation of mutationList) {
        if (mutation.type === "childList") {
            for (let node of mutation.addedNodes) {
                if (node.id) {
                    if (node.id === 'context-menu-popover') {
                        K_library_add_hide_option(node);
                    }
                    if (node.id.startsWith('cover-')) {
                        K_applyBookHide(node);
                        K_addMouseOver(node);
                    }
                }
            }
        }
    }
};
const observer = new MutationObserver(callback);
observer.observe(document, {
    attributes: true,
    childList: true,
    subtree: true,
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    let command = request.command;
    let parameter = request.parameter;
    let value = request.value;

    switch (parameter) {
        case 'global_hide':
            switch (command) {
                case "set":
                    K_setGlobalHide(value);
                    break;
                case "get":
                    sendResponse({ fromcontent: K_getGlobalHide() });
                    break;
                default:
                    K_error(
                        `Command ${command} is not recognized for parameter ${parameter}.`
                    );
            }
            break;
        default:
            switch (command) {
                case "reload":
                    K_DOM_reload();
                    break;
                default:
                    K_error(
                        `Command ${command} is not recognized for parameter ${parameter}.`
                    );
            }
    }
});

function K_library_add_hide_option(element) {
    
    let hide_flag = K_getValue(`${K_getASIN(K_selected_book_node)}hide`);
    
    let message = 'Hide book in library';
    if (hide_flag === 'true') {
        message = 'Show book in library';
    }

    let div_test = document.createElement('a');
    div_test.setAttribute('id', 'k+_a_hide');
    div_test.innerText = message;
    div_test.setAttribute('aria-label', message);
    div_test.setAttribute('tabindex', '0');
    div_test.setAttribute('class', element.querySelector('ul > li > a').getAttribute('class'));
    div_test.addEventListener(
        "mousedown", // click is not propagated??
        function (event) {
            if (hide_flag === 'true') {
                K_debug('was hidden, setting to not hidden');
                K_setValue(`${K_getASIN(K_selected_book_node)}hide`, 'false');
            }
            else {
                K_debug('was not hidden, setting to hidden');
                K_setValue(`${K_getASIN(K_selected_book_node)}hide`, 'true');
            }
            K_applyBookHide(K_selected_book_node);
        },
        false
    );

    let new_elem = element.querySelector('ul > li').cloneNode();
    new_elem.append(div_test);
    element.querySelector('ul').append(new_elem);
}

function K_addMouseOver(node) {
    node.addEventListener(
        "mouseenter",
        function (event) {
            K_selected_book_node = node;
        },
        false
    );
}

function K_applyBookHide(node) {
    let hide_flag = K_getValue(`${K_getASIN(node)}hide`);
    if (!hide_flag) {
        hide_flag = 'false';
        K_setValue(`${K_getASIN(node)}hide`, hide_flag);
    }
    K_applyStyle(node);
}

function K_getASIN(node) {
    return node.closest('li').querySelector('div').getAttribute('data-asin');
}

function K_applyStyle(node) {
    let hide_flag = K_getValue(`${K_getASIN(node)}hide`);
    K_debug(`hide flag: ${hide_flag}`);
    
    let node_to_hide = node;

    if (hide_flag === 'true') {
        if (K_globalHide === 'true') {
            node_to_hide
            .closest('li')
            .setAttribute('style', 'display:none');
        }
        else {
            node_to_hide
            .closest('li')
            .setAttribute('style', 'opacity: 0.3');
        }
    }
    else {
        node_to_hide
            .closest('li')
            .removeAttribute('style');
    }

    
}

function K_setGlobalHide(flag) {
    K_setValue('GlobalHide', flag);
    K_DOM_reload();
}

function K_getGlobalHide() {
    let value = K_getValue('GlobalHide');
    if (!value) {
        value = false;
        K_setValue('GlobalHide', value);
    }
    return value;

}