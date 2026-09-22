(function ($) {
  function readIds() {
    var raw = $("#ju_gallery_ids").val() || "";
    return raw
      .split(",")
      .map(function (id) {
        return parseInt(id, 10);
      })
      .filter(function (id) {
        return id > 0;
      });
  }

  function writeIds(ids) {
    $("#ju_gallery_ids").val(ids.join(","));
  }

  $(document).on("click", "#ju-gallery-add", function (e) {
    e.preventDefault();
    var frame = wp.media({
      title: "Select gallery photos",
      multiple: true,
      library: { type: "image" },
    });

    frame.on("select", function () {
      var ids = readIds();
      var list = $(".ju-gallery-list");
      frame.state().get("selection").each(function (attachment) {
        var data = attachment.toJSON();
        if (ids.indexOf(data.id) !== -1) {
          return;
        }
        ids.push(data.id);
        var thumb = data.sizes && data.sizes.thumbnail ? data.sizes.thumbnail.url : data.url;
        list.append(
          '<li data-id="' +
            data.id +
            '"><img src="' +
            thumb +
            '" alt=""><button type="button" class="button-link ju-gallery-remove">Remove</button></li>'
        );
      });
      writeIds(ids);
    });

    frame.open();
  });

  $(document).on("click", ".ju-gallery-remove", function (e) {
    e.preventDefault();
    var li = $(this).closest("li");
    var removeId = parseInt(li.data("id"), 10);
    li.remove();
    writeIds(
      readIds().filter(function (id) {
        return id !== removeId;
      })
    );
  });
})(jQuery);
