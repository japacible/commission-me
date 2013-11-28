// JS for displaying a summary of the commissions the user has received in a 
//   popover.

$(document).ready(function() {
  var $btn = $('#commissionPortfolio');
  $btn.data('state', 'hover');

  var enterShow = function () {
      $btn.popover('show');
  };
  var exitHide = function () {
      $btn.popover('hide');
  };

// Allow and convert html tags in data-content
  $btn.popover({html: true, trigger: 'manual'})
  .on('mouseenter', enterShow)
  .on('mouseleave', exitHide);
});