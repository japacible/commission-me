/*
v1.1
This JavaScript file parses a commission request JSON object
into appropriate HTML representation for an artist to review a customer's
commission request. The artist chooses to accept or decline the
commission.

FUTURE MODIFICATIONS
- Preliminary Price calculation
- Revision option w/ comments
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

  //Display final step
  var step_container = $("<div/>", {
    "class": "step"
  }).appendTo("#com-req");

  $("<h2/>", {
    html: "Description: "
  }).appendTo(step_container);

  $("<p/>", {
    html: category.final
  }).appendTo(step_container);
});
