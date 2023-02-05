$("textarea").on("input", function () {
    $.ajax("/remove/", {
        type: "post",
        data: { source: $(".input-box").val() },
    }).done(function (data) {
        $(".output-box").val(data.source);
    });
});
