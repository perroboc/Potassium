const config = { attributes: true, childList: true, subtree: true };
const callback = function (mutationList, observer) {
    for (const mutation of mutationList) {
        if (mutation.type === "childList") {
            for (let node of mutation.addedNodes) {
                if (node.id === "bookInfo") {
                    K_DOM_update_direction();
                }
                if (node.nodeName.toUpperCase() === "CANVAS") {
                    K_DOM_update_canvas();
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
        case "direction":
            switch (command) {
                case "set":
                    K_setMangaDirection();
                    break;
                case "get":
                    sendResponse({ fromcontent: K_getMangaDirection() });
                    break;
                case "clear":
                    K_clearMangaDirection();
                    break;
                default:
                    K_error(
                        `Command ${command} is not recognized for parameter ${parameter}.`
                    );
            }
            break;
        case "brightness":
            switch (command) {
                case "set":
                    K_setMangaBrightness(value);
                    break;
                case "get":
                    sendResponse({ fromcontent: K_getMangaBrightness() });
                    break;
                case "clear":
                    K_clearMangaBrightness();
                    break;
                default:
                    K_error(
                        `Command ${command} is not recognized for parameter ${parameter}.`
                    );
            }
            break;
        case "contrast":
            switch (command) {
                case "set":
                    K_setMangaContrast(value);
                    break;
                case "get":
                    sendResponse({ fromcontent: K_getMangaContrast() });
                    break;
                case "clear":
                    K_clearMangaContrast();
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
                        `Command ${command} is not recognized.`
                    );
            }
    }
});

function K_setMangaDirection() {
    let current_direction = K_getMangaDirection();
    let reverse_direction = current_direction.split("").reverse().join("");
    K_debug(
        `K_setMangaDirection: Switching manga direction from ${current_direction} to ${reverse_direction}.`
    );
    K_setValue(K_DOM_getBookId() + "navigationDirection", reverse_direction);
    K_DOM_reload();
}

function K_getMangaDirection() {
    let value = JSON.parse(document.getElementById("bookInfo").text)
        .contentMetadata.navigationDirection;
    K_debug(`K_getMangaDirection: Manga Direction is ${value}`);
    return value;
}

function K_clearMangaDirection() {
    K_clearValue(K_DOM_getBookId() + "navigationDirection");
}

function K_setMangaBrightness(value) {
    K_debug(`K_setMangaBrightness: Setting manga brightness to ${value}.`);
    K_setValue(K_DOM_getBookId() + "brightness", value);
    K_DOM_update_canvas();
}

function K_getMangaBrightness() {
    let value = K_getValue(K_DOM_getBookId() + "brightness");
    if (!value) {
        value = "0";
        K_setValue(K_DOM_getBookId() + "brightness", value);
    }
    K_debug(`K_getMangaBrightness: Manga brightness is ${value}`);
    return value;
}

function K_clearMangaBrightness() {
    K_clearValue(K_DOM_getBookId() + "brightness");
}

function K_setMangaContrast(value) {
    K_debug(`K_setMangaContrast: Setting manga contrast to ${value}.`);
    K_setValue(K_DOM_getBookId() + "contrast", value);
    K_DOM_update_canvas();
}

function K_getMangaContrast() {
    let value = K_getValue(K_DOM_getBookId() + "contrast");
    if (!value) {
        value = "0";
        K_setValue(K_DOM_getBookId() + "contrast", value);
    }
    K_debug(`K_getMangaContrast: Manga contrast is ${value}`);
    return value;
}

function K_clearMangaContrast() {
    K_clearValue(K_DOM_getBookId() + "contrast");
}

function K_DOM_update_direction() {
    let bookInfoJson = JSON.parse(document.querySelector("#bookInfo").text);
    
    let saved_navigationDirection = K_getValue(
        K_DOM_getBookId() + "navigationDirection"
    );

    if (saved_navigationDirection) {
        bookInfoJson.contentMetadata.navigationDirection =
            saved_navigationDirection;
        document.querySelector("#bookInfo").text = JSON.stringify(bookInfoJson);
    }
}

function K_DOM_update_canvas() {
    document
        .querySelector("#renderContainer")
        .querySelector("canvas").style.filter = `brightness(${1.0 + parseFloat(K_getValue(
            K_DOM_getBookId() + "brightness"
        ))}) contrast(${1.0 + parseFloat(K_getValue(K_DOM_getBookId() + "contrast"))})`;
}

function K_DOM_getBookId() {
    let regex = /\/(\w+)\?/;
    return document
        .querySelector('meta[property="og:url"]')
        .content.match(regex)[1];
}

K_debug('Content script loaded!');