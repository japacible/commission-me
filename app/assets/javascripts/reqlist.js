/*
v1.0
Merely a hacky page put together for the beta demo. This will likely expand into a request list integrated with the artist dashboard.
*/

$(document).ready(function() {
  // Data Pull
  var category = $('#json_id').data('url');
  
  // Do Things
  $("<h1/>", {
    html: "Page successfully loaded."
  }).appendTo("#req-list");
  $("<p/>", {
    html: "There is no more to this page at the moment."
  }).appendTo("#req-list");
  
});