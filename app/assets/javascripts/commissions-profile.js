// JS for displaying a summary of the commissions the user has received in a 
//   popover.
$(document).ready(function() {
  // Allow and convert html tags in data-content
  $('.btn').popover({html: true, placement:'right'});
  $(':not(#anything)').on('click', function (e) {
    $('.btn').each(function () {
      if (!$(this).is(e.target) && $(this).has(e.target).length === 0 
          && $('.popover').has(e.target).length === 0) {
            $(this).popover('hide');
            return;
      }
    });
  });
});