const ext_browser = (typeof browser === "undefined") ? chrome : browser;

K_load_popup();

function K_load_popup() {
    var script = document.createElement('script');
    var is_access_enabled = false;

    ext_browser.permissions.contains({ origins: ['https://read.amazon.com/'] })
    .then(function(result) {
        is_access_enabled = result;
        return ext_browser.tabs.query({ active: true, currentWindow: true })
    })    
    .then(function (tabs) {
        // On Kindle Cloud Reader
        if (tabs[0].url.startsWith('https://read.amazon.com')) {
            if (is_access_enabled) {
                
                // Library
                if (tabs[0].url.startsWith('https://read.amazon.com/kindle-library')) {
                    script.src = 'js/kindle-library.js';
                    return fetch('inc/kindle-library.html');
                }
                
                // Manga
                if (tabs[0].url.startsWith('https://read.amazon.com/manga')) {
                    script.src = 'js/manga.js';
                    return fetch('inc/manga.html');
                }
                
                // Other kindle pages
                return fetch('inc/kindle-unknown.html');
            }
            else {
                script.src = 'js/no-access.js';
                return fetch('inc/no-access.html');
            }
        }
        // Not on Kindle Cloud Reader
        else {
            script.src = 'js/non-kindle.js';
            return fetch('inc/non-kindle.html')
        }
    })
    .then(function (response) {
        return response.text();
    })
    .then(function (text) {
        document.getElementById('K_content').innerHTML = text;
        if (script) {
            document.querySelector('body').appendChild(script);
        }
    });
}

function K_message_promise(command, parameter, value) {
    return new Promise(function (myResolve) {
        let message = {
            command: command,
            parameter: parameter,
            value: value,
        };
        ext_browser.tabs
            .query({ active: true, currentWindow: true })
            .then(function (tabs) {
                return ext_browser.tabs.sendMessage(tabs[0].id, message)
            })
            .then(function (response) {
                let return_value = null;
                if (response) {
                    return_value = response.fromcontent;
                }
                return return_value;
            })
            .then(function (value) {
                myResolve(value);
            })
            .catch(function (error) {
                K_show_error(`Please refresh the page and try again.<br/><br/><code>${error}</code>`);
                document.getElementById('K_content').innerHTML = "";
            });
    });
}

function K_show_error(message) {
    document.getElementById('K_error').removeAttribute('style');
    document.getElementById('K_error_message').innerHTML = message;
}