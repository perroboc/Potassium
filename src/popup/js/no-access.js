K_show_error('Potassium does not have access to Kindle Cloud Reader.')

document.getElementById('K_btn_allow_access').addEventListener(
    'click',
    function (event) {
        ext_browser.permissions.request({
            origins: ['https://read.amazon.com/']
        }, (is_granted) => {
            window.close();
        });
    },
    false);
    