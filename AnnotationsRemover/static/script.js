var socket = io();

socket.on("text_update", function (json) {
    $(".output-box").val(json.source);
});

$("textarea").on("input", function () {
    socket.emit("remove", { source: $(".input-box").val() });
});
