/*
v1.8
This JavaScript file parses a "Commission Request Template" JSON object
into an appropriate HTML form representation for an artist to edit
commission settings. The modified form objects are then POST'd to the
server for storage.

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
- Modifiable Category Titles
- Add / Remove / Rearrange Categories
- A/R/R Steps
- A/R/R Options
- Final Step (Specification)
- Preview / Cancel Button Functionality
- Anonymize Root Function Calls

*/
$(document).ready(function() { 
  $.getJSON("assets/blobexample.txt", function(data) {
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
      var category = $("<div/>", {
        "id": "category-" + catkey,
        "class": "category tab-pane"
      }).appendTo(".tab-content");
      
      /* LOOP THROUGH EACH STEP */
      $.each(val.steps, function(stepkey, val) {
      
        // Step Container
        var step = $("<div/>", {
          "class": "step"
        }).appendTo(category);
        
        // Button: Remove Step
        $("<button/>", {
          "type": "button",
          "class": "btn btn-default pull-right",
          html: "&#150;"
        }).appendTo(step);
        
        // Glyph: Dropdown
        $("<span/>", {
          html: "v"
        }).appendTo(step);
        
        // Step Name : step-[cat]-[step]
        var step_name = $("<div/>", {
          "class": "form-group"
        }).appendTo(step);
        $("<label/>", {
          "class": "sr-only",
          "for": "step-" + catkey + "-" + stepkey,
          html: "Step Name"
        }).appendTo(step_name);
        $("<input/>", {
          "id": "step-" + catkey + "-" + stepkey,
          "name": "step-" + catkey + "-" + stepkey,
          "class": "form-control input-lg step-name",
          "type": "text",
          "placeholder": "Step Name",
          "value": val.name
        }).appendTo(step_name);
        
        /* LOOP THROUGH EACH OPTION */
        $.each(val.options, function(optkey, val) {
        
          // Option Container
          var option = $("<div/>", {
            "class": "option"
          }).appendTo(step);
          
          // Option Panel
          var panel = $("<div/>", {
            "class": "panel panel-default"
          }).appendTo(option);
          
          // Panel Heading
          var panel_heading = $("<div/>", {
            "class": "panel-heading"
          }).appendTo(panel);
          // Button: Option Removal
          $("<button/>", {
            "type": "button",
            "class": "btn btn-default pull-right",
            html: "&#150;"
          }).appendTo(panel_heading);
          
          // Option Name : option-[cat]-[step]-[opt]-name
          var option_name = $("<div/>", {
            "class": "form-group"
          }).appendTo(panel_heading);
          $("<label/>", {
            "class": "sr-only",
            "for": "option-" + catkey + "-" + stepkey + "-" + optkey + "-name",
            html: "Option Name"
          }).appendTo(option_name);
          $("<input/>", {
            "id": "option-" + catkey + "-" + stepkey + "-" + optkey + "-name",
            "name": "option-" + catkey + "-" + stepkey + "-" + optkey + "-name",
            "class": "form-control input-lg option-name",
            "type": "text",
            "placeholder": "Option Name",
            "value": val.name
          }).appendTo(option_name);
          
          // Panel Body
          var panel_body = $("<div/>", {
            "class": "panel-body"
          }).appendTo(panel);
          
          // Option Thumbnail : option-[cat]-[step]-[opt]-thumb
          var option_thumb = $("<div/>", {
            "class": "form-group"
          }).appendTo(panel_body);
          var option_thumb_label = $("<label/>", {
            "for": "option-" + catkey + "-" + stepkey + "-" + optkey + "-thumb",
            html: "Example:"
          }).appendTo(option_thumb);
          $("<input/>", {
            "id": "option-" + catkey + "-" + stepkey + "-" + optkey + "-thumb",
            "name": "option-" + catkey + "-" + stepkey + "-" + optkey + "-thumb",
            "class": "option-thumb",
            "type": "file"
          }).appendTo(option_thumb_label);
          $("<img/>", {
            "class": "img-thumbnail pull-left",
            "src": val.thumb
          }).appendTo(option_thumb_label);
          
          // Option Price : option-[cat]-[step]-[opt]-price
          var option_price = $("<div/>", {
            "class": "input-group"
          }).appendTo(panel_body);
          $("<label/>", {
            "class": "sr-only",
            "for": "option-" + catkey + "-" + stepkey + "-" + optkey + "-price",
            html: "Price:"
          }).appendTo(option_price);
          $("<span/>", {
            "class": "input-group-addon",
            html: "$"
          }).appendTo(option_price);
          $("<input/>", {
            "id": "option-" + catkey + "-" + stepkey + "-" + optkey + "-price",
            "name": "option-" + catkey + "-" + stepkey + "-" + optkey + "-price",
            "class": "form-control option-price",
            "type": "text",
            "placeholder": "Price (e.g. &quot;10.00&quot;)",
            "value": val.price
          }).appendTo(option_price);
          
          $("<br>").appendTo(panel_body); 
          // Option Description : option-[cat]-[step]-[opt]-description
          $("<textarea/>", {
            "name": "option-" + catkey + "-" + stepkey + "-" + optkey + "-description",
            "class": "form-control option-description",
            "placeholder": "Enter a description...",
            html: val.description
          }).appendTo(panel_body);
        });
        
        /* ADD AN OPTION */
        /*
        var option = $("<div/>", {
          "id": "new-option",
          "class": "option-disabled"
        }).appendTo(step);
        // option panel
        var panel = $("<div/>", {
          "class": "panel panel-default"
        }).appendTo(option);
        // panel heading (option name)
        var panel_heading = $("<div/>", {
          "class": "panel-heading"
        }).appendTo(panel);
        // option name - id: #option-name-[cat]-[step]-[opt]
        var option_name = $("<div/>", {
          "class": "form-group"
        }).appendTo(panel_heading);
        $("<input/>", {
          "class": "form-control input-lg",
          "type": "text",
          "value": "Click Here To Add An Option",
          "disabled": "true",
          "style": "width: 70%"
        }).appendTo(option_name);
        */
      });
      
      /* ADD A STEP */
      
      
      /* FINAL STEP */
      
      
      // Buttons: Preview, Submit, Cancel
      var submit = $("<div/>", {
        "id": "control-btns"
      }).appendTo(category);
      $("<button/>", {
        "id": "preview",
        "class": "btn btn-default btn-lg",
        "type": "button",
        html: "Preview"
      }).appendTo(submit);
      $("<button/>", {
        "id": "submit",
        "class": "btn btn-primary btn-lg",
        "type": "button",
        on: {
          click: function() {
            //parse();
            $.post("update_template");
          }
        },
        html: "Submit"
      }).appendTo(submit);
      $("<button/>", {
        "id": "cancel",
        "class": "btn btn-default btn-lg pull-right",
        "type": "button",
        html: "Cancel"
      }).appendTo(submit);
    });
  }); 
});

function post() {
  $.put("update_template", { blargh: blob });
}


/*
// JavaScript parsing HTML -> JSON
function parse() {
  var catnames = [];
  $.each($(".cat-name"), function() {
    catnames.push($(this).html());
  });
  var categories = [];
  $.each($(".category"), function(key, val) {
    var catname = catnames[key];
    var steps = [];
    $(this).children(".step").each(function() {
      alert(this);
      var stepname = $("#" + this.id + " .step-name").attr("value");
      var options = [];
      $(this).children(".option").each(function() {
        var optname = $("#" + this.id + " .option-name").attr("value");
        var thumb = "http://ponymindbleach.com/images/filly_derpy_sittin___by_chubble_munch-d522yos.png";
        var price = $("#" + this.id + " .option-price").attr("value");
        var description = $("#" + this.id + " .option-description").html();
        options.push('\n            {\n              "name": "' + optname + '",\n              "thumb": "' + thumb + '",\n              "price": ' + price + ',\n              "description": "' + description + '"\n            }');
      });
      steps.push('{\n          "name": "' + stepname + '",\n          "options": [' + options + '\n          ]\n        }');
    });
    categories.push('{\n      "name": "' + catname + '",\n      "steps": [\n        ' + steps + '\n      ]\n    }');
  });
  
  var blob = '{\n  "categories": [\n    ' + categories + '\n  ]\n}';
  
  // Post Submit Test (saves 'blob' to 'http://bejoty.com/test/output.txt')
  //$.post("http://bejoty.com/test/process.php", { blargh: blob });
  
  // Post Submit Test (opens 'blob' in new window)
  var myWindow = window.open("","_blank","scrollbars=yes");
  myWindow.document.write('<pre style="font-style:monospace">' + blob + '</pre>');
}

// dev test
function bgtest() {
  $("body").css("background", "blue");
}

*/
