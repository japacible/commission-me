/* Arrange images after they're loaded */
$('#tiles').imagesLoaded(function() {
  $('#tiles li').wookmark({
    autoResize: true,
    container: $('#tiles'),
    offset: 2,
    itemWidth: 210
  });
});
var handler = $('#tiles li');
handler.wookmark();