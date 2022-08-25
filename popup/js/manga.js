K_message_promise("get", "direction").then(function (response) {
    if (response === "lr") {
        document
            .getElementById("k+_manga_reading_direction_lr")
            .setAttribute("checked", "");
        document
            .getElementById("k+_manga_reading_direction_lr")
            .setAttribute("disabled", "");
        document.getElementById("k+_manga_reading_direction_rl").addEventListener(
            "click",
            function (event) {
                K_message_promise("set", "direction").then(function (return_value) {
                    window.close();
                });
            },
            false
        );
    } else {
        document
            .getElementById("k+_manga_reading_direction_rl")
            .setAttribute("checked", "");
        document
            .getElementById("k+_manga_reading_direction_rl")
            .setAttribute("disabled", "");
        document.getElementById("k+_manga_reading_direction_lr").addEventListener(
            "click",
            function (event) {
                K_message_promise("set", "direction").then(function (return_value) {
                    window.close();
                });
            },
            false
        );
    }
});

K_message_promise("get", "brightness").then(function (response) {
    document
        .getElementById("k+_manga_brightness")
        .setAttribute("value", response);
    document.getElementById("k+_manga_brightness").addEventListener(
        "input",
        function (event) {
            let value = event.currentTarget.valueAsNumber;
            console.log(`Setting brightness to ${value}`);
            K_message_promise("set", "brightness", value)
                .then(function (return_value) {
                    K_manga_set_numeric_span("k+_manga_brightness_value", value);
                });
        },
        false
    );
    K_manga_set_numeric_span("k+_manga_brightness_value", response);
});

K_message_promise("get", "contrast").then(function (response) {
    document
        .getElementById("k+_manga_contrast")
        .setAttribute("value", response);
    document.getElementById("k+_manga_contrast").addEventListener(
        "input",
        function (event) {
            let value = event.currentTarget.value;
            console.log(`Setting contrast to ${value}`);
            K_message_promise("set", "contrast", value)
                .then(function (return_value) {
                    K_manga_set_numeric_span("k+_manga_contrast_value", value);
                });
        },
        false
    );
    K_manga_set_numeric_span("k+_manga_contrast_value", response);
});

document.getElementById("k+_btn_reset").addEventListener(
    "click",
    function (event) {
        Promise.all([
            K_message_promise("clear", "direction"),
            K_message_promise("clear", "brightness"),
            K_message_promise("clear", "contrast")
        ])
            .then(function (value) {
                K_message_promise("reload");
                window.close();
            });
    },
    false
);


function K_manga_set_numeric_span(node_id, value) {
    document.getElementById(node_id).innerText = (value < 0 ? "" : "+") + value;
}