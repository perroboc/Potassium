K_message_promise("get", "global_hide").then(function (response) {
    if (response === 'true') {
        document
        .getElementById("K_swt_library_hide")
        .setAttribute("checked", "");
    }
    
    document.getElementById("K_swt_library_hide").addEventListener(
        "input",
        function (event) {
            let value = event.currentTarget.checked;
            console.log(`Setting global_hide to ${value}`);
            K_message_promise("set", "global_hide", value)
                .then(function (return_value) {
                    K_message_promise("reload");
                    window.close();
                });
        },
        false
    );

});
