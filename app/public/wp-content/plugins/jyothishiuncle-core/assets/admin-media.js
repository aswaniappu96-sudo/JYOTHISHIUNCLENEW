jQuery(function ($) {
  function applyImage($wrap, attachment) {
    var url = attachment.sizes && attachment.sizes.medium ? attachment.sizes.medium.url : attachment.url;
    $wrap.find("input.ju-media-id").val(attachment.id);
    $wrap.find("input.ju-media-cleared").val("0");
    $wrap.find("img").attr("src", url).show();
  }

  $(document).on("click", ".ju-media-select", function (event) {
    event.preventDefault();
    var $wrap = $(this).closest(".ju-media-field");
    var frame = wp.media({
      title: "Select image",
      button: { text: "Use this image" },
      multiple: false,
    });
    frame.on("select", function () {
      var selected = frame.state().get("selection").first();
      if (selected) applyImage($wrap, selected.toJSON());
    });
    frame.on("close", function () {
      var selected = frame.state().get("selection").first();
      if (selected) applyImage($wrap, selected.toJSON());
    });
    frame.open();
  });

  $(document).on("click", ".ju-media-clear", function (event) {
    event.preventDefault();
    var $wrap = $(this).closest(".ju-media-field");
    $wrap.find("input.ju-media-id").val("");
    $wrap.find("input.ju-media-cleared").val("1");
    $wrap.find("img").attr("src", "").hide();
  });
});
