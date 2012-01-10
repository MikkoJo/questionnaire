/*global dojo, dijit, dojox, console, save_profile_values, questionnaire, get_profiles, logout,
 create_widgets

*/
dojo.require("dijit.layout.StackContainer");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.RadioButton");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.Dialog");

function parent_logout(url, callback_function) {
    dojo.xhrGet({
    "url": url,
    "handle": function(response, ioArgs) {
        if(callback_function !== undefined) {
            callback_function({"status_code": ioArgs.xhr.status,
                              "message": ioArgs.xhr.responseText});
        }
        else {
            if(ioArgs.xhr.status === 200) {
                dojo.place(response, dojo.body(), "only");
            }
        }

    }
    });
}

function setValues(form, values) {
    console.log("setValues");
    if(values === undefined) {
        return;
    }
    form.set('value',values);
    var e, vn;
    //FIX for input elements inside dojo form
    //var elem = dojo.byId(form.formnode).elements;

    // for new version
    var elem = dojo.byId(form.id).elements;

    for (e = 0; e < elem.length; e++) {
        if (elem[e].type === "radio") {
            continue;
        }
        else if (elem[e].type === "checkbox") {
            continue;
        }
        else {
            vn = elem[e].name;
            if (values[vn] !== undefined) {
                elem[e].value = values[vn];
            }
        }
    }
}

function get_profiles_callback(values) {
    console.log("get_profiles_callback: " + dojo.toJson(values));
    //return value is an array and questionnaire.values is an object
    if(values.length >= 1) {
        questionnaire.values = values[0];
        questionnaire.profileValues = dojo.clone(values[0]);
    }
    // Here to make sure profileValues are loaded
    dojo.query("form").forEach(function(node) {
        setValues(dijit.byId(node.id), questionnaire.profileValues[node.name]);
    });

}
function create_widgets(node_id) {
    console.log("new create_widgets function called");

    var form_elements = dojo.query("form", node_id);
    var radio_elements = dojo.query("input[type=radio]", node_id);
    var checkbox_elements = dojo.query("input[type=checkbox]", node_id);
    var select_elements = dojo.query("select", node_id);
    var imagebutton_elements = dojo.query("button[type=button].imagebutton", node_id);
    var text_elements = dojo.query("input[type=text]", node_id);
    var textarea_elements = dojo.query("textarea", node_id);
    var number_elements = dojo.query("input[type=number]", node_id);
    var range_elements = dojo.query("input[type=range]", node_id);
    var email_elements = dojo.query("input[type=email]", node_id);
    var dojobutton_elements = dojo.query("button[type=button].dojobutton", node_id);
    var i;
    var json_def, constraints;

    console.log("create the following forms");
    console.log(form_elements);

    //create the form or forms
    for(i = 0; i < form_elements.length; i++) {

        json_def = {};
        var form_element = form_elements[i];

        console.log("create form");
        console.log(form_element);

        if(form_element.id !== undefined) {
            json_def.id = form_element.id;
        }

        if(form_element.name !== undefined) {
            json_def.name = form_element.name;
        }

        //the form seems to be global, why?
        // the global is used to destroy forms widgets...
        var f = new dijit.form.Form(json_def,
                                   form_element);
    }

    //create the radiobuttons
    for(i = 0; i < radio_elements.length; i++) {
        json_def = {};
        var radio = radio_elements[i];

        //check for specialities
        if(radio.id !== undefined) {
            //mixin with the specialized values
            dojo.mixin(json_def,
                       questionnaire.special_widgets[radio.id]);
        }
        //take values from HTML 5
        if(radio.name !== undefined) {
            json_def.name = radio.name;
        }
        if(radio.value !== undefined) {
            json_def.value = radio.value;
        }

        var rb = new dijit.form.RadioButton(json_def,
                                            radio);
    }

    //create checkboxes
    for(i = 0; i < checkbox_elements.length; i++) {
        json_def = {};

        var checkbox = checkbox_elements[i];

        //check for specialities
        if(checkbox.id !== undefined) {
            //mixin with the specialized values
            dojo.mixin(json_def,
                       questionnaire.special_widgets[checkbox.id]);
        }
        // check for specialities with name, this is needed to make sure no more than 3 boxes are 
        // selected in following question
        // If you were allowed to get about alone at a younger age than you would allow 
        //your child to do so, what are the main reasons for this?
        if(checkbox.name !== undefined) {
            //mixin with the specialized values
            dojo.mixin(json_def,
                       questionnaire.special_widgets[checkbox.name]);
        }
        //take values from html 5
        if(checkbox.name !== undefined) {
            json_def.name = checkbox.name;
        }
        if(checkbox.value !== undefined) {
            json_def.value = checkbox.value;
        }


        var cb = new dijit.form.CheckBox(json_def,
                                         checkbox);
    }

    //create textboxes
    for(i = 0; i < text_elements.length; i++) {
        json_def = {};

        //mixin with the default values
        dojo.mixin(json_def,
                   questionnaire.default_widgets.text);

        var text_element = text_elements[i];
        //check for specialities
        if(text_element.id !== undefined) {
            //mixin with the specialized values
            dojo.mixin(json_def,
                       questionnaire.special_widgets[text_element.id]);
        }

        //take the html 5 values
        if(text_element.name !== undefined) {
            json_def.name = text_element.name;
        }
        if(text_element.disabled === true) {
            json_def.disabled = true;
        }

        var tb = new dijit.form.TextBox(json_def,
                                               text_element);
    }

    //create numbertextboxes
    for(i = 0; i < number_elements.length; i++) {
        json_def = {};
        constraints = {};

        //mixin with the default values
        dojo.mixin(json_def,
                   questionnaire.default_widgets.number);
        // constraints is object, have to mixin on its own
        dojo.mixin(constraints,
                   questionnaire.default_widgets.number.constraints);
        json_def.constraints = constraints;


        var number_element = number_elements[i];

        //take the html 5 values
        if(number_element.name !== undefined) {
            json_def.name = number_element.name;
        }
        if(dojo.attr(number_element,"min") !== undefined && dojo.attr(number_element,"min") !== null) {
            json_def.constraints.min = Number(dojo.attr(number_element,"min"));
        }
        if(dojo.attr(number_element, "max") !== undefined && dojo.attr(number_element,"max") !== null) {
            json_def.constraints.max = Number(dojo.attr(number_element,"max"));
        }

        var ntb = new dijit.form.NumberTextBox(json_def,
                                               number_element);
    }

    //create emailtextboxes
    for(i = 0; i < email_elements.length; i++) {
        json_def = {};

        //mixin with the default values
        dojo.mixin(json_def,
                   questionnaire.default_widgets.email);
        // Have to add here, does not work in quest_default.
        // gives error: dojox.validate is undefined
        json_def.regExpGen =  dojox.validate.regexp.emailAddress;

        var email_element = email_elements[i];

        //take the html 5 values
        if(email_element.name !== undefined) {
            json_def.name = email_element.name;
        }
        if(email_element.placeholder !== undefined) {
            json_def.placeHolder = email_element.placeholder;
        }

        var etb = new dijit.form.ValidationTextBox(json_def,
                                               email_element);
    }

    //create textareas
    for(i = 0; i < textarea_elements.length; i++) {
        json_def = {};

        //mixin with the default values
        dojo.mixin(json_def,
                   questionnaire.default_widgets.textarea);


        var textarea_element = textarea_elements[i];

        //take the html 5 values
        if(textarea_element.name !== undefined) {
            json_def.name = textarea_element.name;
        }
        if(textarea_element.placeholder !== undefined) {
            json_def.placeHolder = textarea_element.placeholder;
        }
        if(textarea_element.rows !== undefined) {
            json_def.rows = textarea_element.rows;
        }
        if(textarea_element.cols !== undefined) {
            json_def.cols = textarea_element.cols;
        }

        var sta = new dijit.form.SimpleTextarea(json_def,
                                               textarea_element);
    }

    //create select (dijit filteringselect)
    for(i = 0; i < select_elements.length; i++) {
        json_def = {};

        //mixin with the default values
        dojo.mixin(json_def,
                   questionnaire.default_widgets.filteringSelect);

        var select_element = select_elements[i];

        if(select_element.id !== undefined) {
            //mixin with the specialized values
            dojo.mixin(json_def,
                       questionnaire.special_widgets[select_element.id]);
        }
        //take the html 5 values
        if(select_element.name !== undefined) {
            json_def.name = select_element.name;
        }


        var fs = new dijit.form.FilteringSelect(json_def,
                                                select_element);
    }

    //create range (slider) SliderRules and rulevalues not implemented yet
    for(i = 0; i < range_elements.length; i++) {
        json_def = {};

        //mixin with the default values
        dojo.mixin(json_def,
                   questionnaire.default_widgets.range);


        var range_element = range_elements[i];

        //check for specialities
        if(range_element.id !== undefined) {
            //mixin with the specialized values
            dojo.mixin(json_def,
                       questionnaire.special_widgets[range_element.id]);
        }
        //take the html 5 values
        if(range_element.name !== undefined) {
            json_def.name = range_element.name;
        }
        /*if(range_element.value !== undefined) {
            json_def.value = range_element.value;
        }*/

        if(dojo.attr(range_element,"min") !== undefined && dojo.attr(range_element,"min") !== null) {
            json_def.minimum = Number(dojo.attr(range_element,"min"));
        }
        if(dojo.attr(range_element, "max") !== undefined && dojo.attr(range_element,"max") !== null) {
            json_def.maximum = Number(dojo.attr(range_element,"max"));
        }

        if(dojo.attr(range_element,"step") !== undefined && dojo.attr(range_element,"step") !== null) {
            json_def.discreteValues = (json_def.maximum - json_def.minimum) / Number(dojo.attr(range_element,"step")) + 1;
        }
        var hs = new dijit.form.HorizontalSlider(json_def,
                                               range_element);
    }


    //createdojobuttons
    for(i = 0; i < dojobutton_elements.length; i++) {

        json_def = {};

        //mixin with the default values
        dojo.mixin(json_def,
                   questionnaire.default_widgets.dojobutton);


        var dojobutton_element = dojobutton_elements[i];

        //check for specialities
        if(dojobutton_element.id !== undefined) {
            //mixin with the specialized values
            dojo.mixin(json_def,
                       questionnaire.special_widgets[dojobutton_element.id]);
        }
        //take the html 5 values
        if(dojobutton_element.name !== undefined) {
            json_def.name = dojobutton_element.name;
        }
        if(dojo.attr(dojobutton_element, "class") !== undefined) {
            json_def["class"] = dojo.attr(dojobutton_element, "class");
        }
        json_def.label = dojobutton_element.innerHTML;
        json_def.label = dojobutton_element.innerHTML;
        //json_def.showLabel = false;

        var button = new dijit.form.Button(json_def,
                                             dojobutton_element);
        }

    return f;
}

function getValues(form) {
    console.log("getValues");
    var values, valueName, i;

    try {
//        values = form.getValues();
        values = form.get("value");
    } catch(ex) {
        values = {};
    }

    //FIX for bug non valid json NaN, can be removed when dojo fix arrive last checked esri version 2.3
    // Will be fixed in dojo1.7 ?
    for (valueName in values) {
        if(typeof values[valueName] === "number") {
            if(isNaN(values[valueName])) {
                values[valueName] = null;
            }
        }
        else if(typeof values[valueName] === "string") {
            if(values[valueName].toLowerCase() === "null") {
                values[valueName] = null;
            }
        }
    }
    return values;
}

function submitForms() { /* PROBLEM: Creates unnecessary undefined values for imagebuttons, */
    console.log("submitForms");

    var forms = dojo.query("form");
    var i, form, values;

    for(i = 0; i <forms.length; i++) {
        form = dijit.byId(forms[i].id);
        if (form !== undefined && form !== null) {
            values = getValues(form);
            questionnaire.profileValues[form.name] = values;
        }
    }
        save_profile_values(questionnaire.profileValues);
}


function init_parent() {
    var stackCont, contPane, i;
    stackCont = new dijit.layout.StackContainer({"id": "mainStack"}, "content");
    dojo.query(".cPane").forEach(function(node) {
        contPane = new dijit.layout.ContentPane({"title": node.id,
                                                 "content": dojo.byId(node.id),
                                                 "id": "cp" + node.id,
                                                 "style": "height: 100%; width: 100%;"});
        stackCont.addChild(contPane);
    });
    stackCont.startup();

    dojo.query(".forward").forEach(function(node) {
        var json_def = {};

        //take values from html 5
        if(node.name !== undefined) {
            json_def.name = node.name;
        }
        if(dojo.attr(node, "class") !== undefined) {
            json_def["class"] = dojo.attr(node, "class");
        }
        json_def.onClick = function() {
            submitForms();
            dijit.byId("mainStack").forward();
            };
        json_def.title = node.innerHTML;
        json_def.label = node.innerHTML;
        //json_def.showLabel = false;

        var button = new dijit.form.Button(json_def,
                                         node);

    });
    dojo.query(".back").forEach(function(node) {
        var json_def = {};

        //take values from html 5
        if(node.name !== undefined) {
            json_def.name = node.name;
        }
        if(dojo.attr(node, "class") !== undefined) {
            json_def["class"] = dojo.attr(node, "class");
        }
        json_def.onClick = function() {
            submitForms();
            dijit.byId("mainStack").back();
            };
        json_def.title = node.innerHTML;
        json_def.label = node.innerHTML;
        //json_def.showLabel = false;

        var button = new dijit.form.Button(json_def,
                                         node);

    });
/*    dojo.query(".send").forEach(function(node) {
        var json_def = {};

        //take values from html 5
        if(node.name !== undefined) {
            json_def.name = node.name;
        }
        if(dojo.attr(node, "class") !== undefined) {
            json_def["class"] = dojo.attr(node, "class");
        }
        
        json_def.onClick = function() {
            submitForms();
            var test = confirm("Haluatko varmasti poistua kyselystä?");
            //alert(test);
            if(test) {
                logout(function() {window.home();});
            }
            else {
                logout();
            }
            //dijit.byId("mainStack").forward();
            };
        json_def.title = node.innerHTML;
        json_def.label = node.innerHTML;
        //json_def.showLabel = false;

        var button = new dijit.form.Button(json_def,
                                         node);

    });*/
    var hl = dojo.query("tr.centeredRadio");
    for (i = 0; i <hl.length; i++) {
        if(i % 2 === 0) {
            dojo.addClass(hl[i], "highlite");
        }
    }
    create_widgets("mainStack");
    // Create dialog for informational messages
    var infoDialog = new dijit.Dialog({
              "style": "width: 300px",
              "id": "infoDialog"
        });
    dojo.connect(infoDialog, "onLoad", function(d) {create_widgets(infoDialog.id);});

    // Set the form values if user has refreshed
    get_profiles("?time__now=true", get_profiles_callback);


}

