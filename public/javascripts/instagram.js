jQuery(function($) {
  'use strict';

  var instagram = $('.instagram');

  $.get('/instagram', function(data) {
    var thumbnails = [];

    if('error' === data.status) {
      instagram.html('<div class="alert alert-danger" role="alert">Issue Loading Instagram Images</div>');
      return;
    }

    $.each(data.data, function(i, item) {
      thumbnails.push(
        $('<div class="col-xs-4 col-sm-3 col-md-2">')
          .append(
            $('<a>').attr({
              href: item.link,
              class: 'thumbnail'
            }).append(
              $('<img>')
                .attr({
                  'src': item.images.thumbnail.url,
                  'alt': item.caption.text
                })
            )
        )
      );
    });

    instagram.empty().append(thumbnails);
  });

});