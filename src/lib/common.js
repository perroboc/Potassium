function K_debug(text) {
    //console.debug(`K+: '${text}'.`)
}

function K_info(text) {
    console.info(`K+: '${text}'.`)
}

function K_error(text) {
    console.error(`K+: '${text}'.`)
}

K_debug(`First readyState: ${document.readyState}`);
document.onreadystatechange = () => {
    K_debug(`New readyState: ${document.readyState}`);
}

function K_setValue(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (err) {
        K_error(`${err}`);
    }
}

function K_getValue(key) {
    let value = localStorage.getItem(key);
    if (!value || value === 'undefined') {
        return null;
    }
    return value;
}

function K_clearValue(key) {
    localStorage.clear(key);
}

function K_DOM_reload() {
    window.location.reload(true);
}