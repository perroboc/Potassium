document.getElementById("k+_btn_open_kindle").addEventListener(
    "click",
    function (event) {
        chrome.tabs.create(
            {
                active: true,
                url: "https://read.amazon.com/"
            }
        )
    },
    false
);
