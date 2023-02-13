var socket = io();
var lastExecution = null;

socket.on("text_update", function (json) {
    $(".output-box").val(json.source);
});

$("textarea").on("input", function () {
    if (lastExecution !== null) {
        window.clearTimeout(lastExecution);
    }
    lastExecution = window.setTimeout(function () {
        socket.emit("remove", { source: $(".input-box").val() });
    }, 500);
});
