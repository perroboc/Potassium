document.getElementById("K_btn_open_kindle").addEventListener(
    "click",
    function (event) {
        ext_browser.tabs.create(
            {
                active: true,
                url: "https://read.amazon.com/"
            }
        )
        window.close();
    },
    false
);
