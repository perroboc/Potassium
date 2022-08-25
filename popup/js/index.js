// change page and inject script
var script = document.createElement('script');
chrome.tabs
    .query({ active: true, currentWindow: true })
    .then(function (tabs) {
        if (tabs[0].url.startsWith('https://read.amazon.com/manga')) {
            script.src = 'js/manga.js';
            return fetch('inc/manga.html');
        }
        else if (tabs[0].url.startsWith('https://read.amazon.com/kindle-library')) {
            script.src = 'js/kindle-library.js';
            return fetch('inc/kindle-library.html');
        }
        else {
            script.src = 'js/popup.js';
            return fetch('inc/popup.html')
        }
    })
    .then(function (response) {
        return response.text();
    })
    .then(function (text) {
        document.getElementById('k+_content').innerHTML = text;
        document.querySelector('body').appendChild(script);
    });

function K_message_promise(command, parameter, value) {
    return new Promise(function (myResolve) {
        let message = {
            command: command,
            parameter: parameter,
            value: value,
        };
        chrome.tabs
            .query({ active: true, currentWindow: true })
            .then(function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, message)
                    .then(function (response) {
                        let return_value = null;
                        if (response) {
                            return_value = response.fromcontent;
                        }
                        myResolve(return_value);
                    })
                    .catch(function (error) {
                        K_show_error(`Please refresh the page and try again.<br/><br/><code>${error}</code>`);
                    });
            });
    });
}

function K_show_error(message) {
    document.getElementById('k+_error').removeAttribute('style');
    document.getElementById('k+_error_message').innerHTML = message;
    document.getElementById('k+_content').innerHTML = "";
}