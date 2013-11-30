/*
v1.0
This JavaScript file parses a commission request JSON object
into appropriate HTML representation for a customer to revise a previous
commission request. The customer receives his/her previous request
along with the artist's notes on what needs to be revised.

FUTURE MODIFICATIONS
- 
*/

$(document).ready(function() {
  // Data Pull
  var category = $('#json_id').data('url');
  
  // Category Name
  $("<h1/>", {
    html: category.name
  }).appendTo("#com-req");
  
  // Preliminary Price
  // (not important at the moment)
  
  $.each(category.steps, function(stepkey, step) {
    // Step Container
    var step_container = $("<div/>", {
      "class": "step"
    }).appendTo("#com-req");
    
    // Step Name
    $("<h2/>", {
      html: step.name
    }).appendTo(step_container);
    
    var choice = step.choice;
    
    // Choice Container
    var choice_container = $("<div/>", {
      "class": "choice"
    }).appendTo(step_container);
    
    // Choice Name
    $("<h3/>", {
      html: choice.name
    }).appendTo(choice_container);
    
    // Choice Description
    $("<p/>", {
      html: choice.description
    }).appendTo(choice_container);
  });
});