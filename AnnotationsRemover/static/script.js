var socket = io();
var lastExecution = null;

function countLn(source) {
    let match = source.match(/\n/g);
    if (match === null) {
        return 0;
    } else {
        return match.length;
    }
}

function makeIndices(n) {
    indices = "";
    for (let i = 1; i <= n; i++) {
        indices += i.toString() + "<br />";
    }
    return indices;
}

socket.on("text_update", function (json) {
    $(".output-box").val(json.source);
    if ($(".output-box").val() == "") {
        $(".right-indices").html("");
        $(".output-button").css("display", "none");
    } else {
        $(".right-indices").html(
            makeIndices(countLn($(".output-box").val()) + 1)
        );
        $(".output-button").css("display", "inline");
    }
});

$("textarea").on("input", function () {
    if ($(".input-box").val() == "") {
        $(".left-indices").html("");
        $(".input-button").css("display", "none");
    } else {
        $(".left-indices").html(
            makeIndices(countLn($(".input-box").val()) + 1)
        );
        $(".input-button").css("display", "inline");
    }
    if (lastExecution !== null) {
        window.clearTimeout(lastExecution);
    }
    lastExecution = window.setTimeout(function () {
        socket.emit("remove", { source: $(".input-box").val() });
    }, 500);
});

$(".clear-button").on("click", function () {
    $(".input-box").val("");
    $(".left-indices").html("");
    $(".input-button").css("display", "none");
    setTimeout(function () {
        $(".right-indices").html("");
        $(".output-box").val("");
        $(".output-button").css("display", "none");
    }, 500);
});

$(".copy-button").on("click", function () {
    navigator.clipboard.writeText($(".output-box").val());
    $(".");
});

$(".text-remover-card").on("click", function () {
    $(".script-mode-container").css("display", "");
    $(".file-mode-container").css("display", "none");
    $(".text-remover-card").css(
        "border-bottom",
        "solid 0.2rem rgb(34, 33, 33)"
    );
    $(".file-remover-card").css("border-bottom", "");
});

$(".file-remover-card").on("click", function () {
    $(".script-mode-container").css("display", "none");
    $(".file-mode-container").css("display", "");
    $(".text-remover-card").css("border-bottom", "");
    $(".file-remover-card").css(
        "border-bottom",
        "solid 0.2rem rgb(34, 33, 33)"
    );
});

let dropbox = $(".left-split-container");
dropbox.on("dragenter", function (e) {
    e.stopPropagation();
    e.preventDefault();
    $("left-split-container").css("border", "dotted 1rem black");
});
dropbox.on("dragover", function (e) {
    e.stopPropagation();
    e.preventDefault();
});
dropbox.on("drop", function (e) {
    e.stopPropagation();
    e.preventDefault();

    const dt = e.originalEvent.dataTransfer;
    const file = dt.files[0];

    afterFileUploaded(file);
});

function afterFileUploaded(file) {
    const name = file.name;
    let reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = function (e) {
        const content = e.target.result;
        $.ajax("/remove", {
            type: "post",
            data: { source: content },
        }).done(function (d) {
            const fileName = "unannotated_" + name;
            const content = d.source;
            const a = $(".download-button");
            let blob = new Blob([content], { type: "text/plain" });
            const url = URL.createObjectURL(blob);

            $(".downloaded-file").text(fileName);
            $(".downloaded-wrapper").css("display", "inline");
            a.attr("download", fileName);
            a.attr("href", url);
            document.getElementById("download-button").click();
        });
    };
}
$(".file-input-body").on("change", function () {
    console.log("uploaded");
});

$(".input-box").focus();
$(".text-remover-card").click();
