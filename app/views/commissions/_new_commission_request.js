/*
v1.1
This JavaScript file parses a "Commission Request Template" JSON object
into an appropriate HTML form representation for a customer to request
a commission. The customer's choices are then sent back to the server
via POST submission.

A webpage calling this script must have 3 specific page elements
(this requirement may change in future versions):

<ul class="nav nav-tabs"></ul>
<form role="form">
  <div class="tab-content"></div>
</form>

This page also currently requires the following file in the same directory:
- comset.css
- blobexample.txt


FUTURE MODIFICATIONS
-
*/

$(document).ready(function() {
  var data = $('#json_id').data('url');
  /* LOOP THROUGH EACH CATEGORY */
  $.each(data.categories, function(catkey, val) {
  
    // Navigation Tab
    var tabli = $("<li/>").appendTo(".nav-tabs");
    var tablia = $("<a/>", {
      "href": "#category-" + catkey,
      "data-toggle": "tab"
    }).appendTo(tabli);
    $("<span/>", {
      "class": "cat-name",
      html: val.name
    }).appendTo(tablia);
  
    // Category Container (Form)
    var category = $("<form/>", {
      "id": "category-" + catkey,
      "class": "category tab-pane",
      "action": "request_commission",
      "method": "post"
    }).appendTo(".tab-content");
    var authenticity_token = $("<input/>", {
      "name": "authenticity_token",
      "value": getAuthToken(),
      "type": "hidden"
    }).appendTo(category);
    var artist_id = $("<input/>", {
      "name": "artist_id",
      "value": getArtist(),
      "type": "hidden"
    }).appendTo(category);
    
    /* LOOP THROUGH EACH STEP */
    $.each(val.steps, function(stepkey, val) {
    
      // Step Name : step-[cat]-[step]
      var step = $("<div/>", {
        "id": "step-" + catkey + "-" + stepkey,
        "class": "step",
"action": "request_commission", // I BELIEVE THESE ATTRIBUTES CAN BE DELETED
"method": "post"
      }).appendTo(category);
      $("<h2/>", {
        "class": "step-name",
        html: val.name
      }).appendTo(step);
      
      // Step Options Container
      var options = $("<div/>", {
        "class": "row options"
      }).appendTo(step);
      
      /* LOOP THROUGH EACH OPTION */
      $.each(val.options, function(optkey, val) {
      
        // Option Container
        var option = $("<label/>", {
          "for": "option-" + catkey + "-" + stepkey + "-" + optkey,
          "class": "col-md-4 commission-category"
        }).appendTo(options);
        
        // Option Name : option-[cat]-[step]-[opt]-name
        $("<h3/>", {
          "id": "option-" + catkey + "-" + stepkey + "-" + optkey + "-name",
          "class": "option-name",
          html: val.name
        }).appendTo(option);
        
        // Option Price : option-[cat]-[step]-[opt]-price
        $("<p/>", {
          "id": "option-" + catkey + "-" + stepkey + "-" + optkey + "-price",
          "class": "option-price",
          html: "$" + val.price
        }).appendTo(option);
        
        // Option Description : option-[cat]-[step]-[opt]-description
        $("<p/>", {
          "name": "option-" + catkey + "-" + stepkey + "-" + optkey + "-description",
          "class": "option-description",
          html: val.description
        }).appendTo(option);
        
        // Form Input : option-[cat]-[step]-choice
        $("<input/>", {
          "id": "option-" + catkey + "-" + stepkey + "-" + optkey,
          "name": "option-" + catkey + "-" + stepkey + "-" + "choice",
          "value": optkey,
          "class": "form-control",
          "type": "radio"
        }).appendTo(option);
        
        // Option Thumbnail : option-[cat]-[step]-[opt]-thumb
        $("<img/>", {
          "id": "option-" + catkey + "-" + stepkey + "-" + optkey + "-thumb",
          "class": "img-thumbnail option-thumb",
          "src": val.thumb
        }).appendTo(option);
      });
    });
    
    $("<hr/>").appendTo(category);
    
    // Final Step
    // Artist Prompt
    $("<p/>", {
      html: val.prompt
    }).appendTo(category);
    // Customer Specification
    $("<textarea/>", {
      "id": "final",
      "name": "final",
      "class": "form-control",
      "placeholder": "Describe your request in detail..."
    }).appendTo(category);
    
    // Buttons: Submit, Cancel
    var submit = $("<div/>", {
      "id": "control-btns"
    }).appendTo(category);
         
    $("<input/>", {
      "id": "submit",
      "class": "btn pull-right",
      "type": "submit",
      html: "Submit"
    }).appendTo(submit);

    $("<button/>", {
      "id": "cancel",
      "class": "btn pull-right",
      "type": "button",
      on: {
        click: function() {
          alert("Cancel! (Not yet functional.)");
        }
      },
      html: "Cancel"
      }).appendTo(submit);
  });
});
