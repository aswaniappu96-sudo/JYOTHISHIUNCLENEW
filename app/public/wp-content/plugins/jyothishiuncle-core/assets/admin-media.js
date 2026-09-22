jQuery(function ($) {
  $(document).on("click", ".ju-media-select", function (event) {
    event.preventDefault();
    var $wrap = $(this).closest(".ju-media-field");
    var frame = wp.media({
      title: "Select image",
      button: { text: "Use this image" },
      multiple: false,
    });
    frame.on("select", function () {
      var att = frame.state().get("selection").first().toJSON();
      var url = att.sizes && att.sizes.medium ? att.sizes.medium.url : att.url;
      $wrap.find("input[type=hidden]").val(att.id);
      $wrap.find("img").attr("src", url).show();
    });
    frame.open();
  });

  $(document).on("click", ".ju-media-clear", function (event) {
    event.preventDefault();
    var $wrap = $(this).closest(".ju-media-field");
    $wrap.find("input[type=hidden]").val("");
    $wrap.find("img").attr("src", "").hide();
  });
});
