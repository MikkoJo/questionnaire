/*global dojo, esri, AREAS_FEATURE_LAYER_URL, map, infoWindowHandler, dijit, softgis, questionnaire,
  save_profile_values, getValues, setValues, console, infoForm, gnt

 */
//dojo.require("esri.layers.FeatureLayer");
dojo.require("dijit.layout.StackContainer");
dojo.require("dijit.layout.ContentPane");

softgis.example = {};
//dojo.connect(null, "initHook", null, function() {
    //console.log("initHook called");
//    addAreaLayer();
    //var infoDialog = new dijit.Dialog({
    //      "style": "width: 300px",
    //      "id": "infoDialog",
    //      "preLoad": true
    //});
    //dojo.connect(infoDialog, "onLoad", function(d) {create_widgets(infoDialog.id);});
//});
//dojo.connect(null, "initHook", null, "addAreaLayer");
dojo.connect(null, "createInfoHook", null, "setInfoValues");

function cleanScands(value, key, data) {
    var temp = value;
    temp = temp.split(" ")[0];
    temp = temp.replace(/ä/gi, 'a');
    temp = temp.replace(/ö/gi, 'o');
    temp = temp.replace(/å/gi, 'a');
    temp = temp.replace(/µ/gi, 'y');
    return temp.toLowerCase();
}

function toLower(value, key, data) {
    return value.toLowerCase();
}

function nextButtonHover() {
    var toggleBg = function () {
          if(djConfig.isDebug) {
              console.log("toggleBg");
          }
        dojo.query(".buttonBackgroundRight:not(.prev) .buttonBackgroundContent").toggleClass("empty_background");
        dojo.query(".newButtonArea .buttonBackgroundRight:not(.prev)").toggleClass("empty_background");
    };
    dojo.query(".newButtonArea .next.buttonForwardOuter").onmouseenter(toggleBg);
    dojo.query(".newButtonArea .next.buttonForwardOuter").onmouseleave(toggleBg);

}
/* When user first advances to the section it is enabled in the progressbar */
function enableSection(sectionName, pageNumber, pagesarray) {
        dojo.query("." + sectionName).forEach(function(node) {
            if(!dojo.hasClass(node, "enabled")) {
                dojo.query(".sectionOuter", node).onmouseenter(function(evt) {
                    if(djConfig.isDebug) {
                        console.log(node.id + "mouseenter");
                    }
                    dojo.query(".currentSection").addClass("hideActive");
                });
                dojo.query(".sectionOuter", node).onmouseleave(function(evt) {
                    if(djConfig.isDebug) {
                        console.log(node.id + "mouseleave");
                    }
                    dojo.query(".currentSection").removeClass("hideActive");
                });
                dojo.query(".sectionOuter", node).connect("onclick", this, dojo.hitch(null, "createPage", pagesarray[pageNumber].name, "pages"));
                dojo.addClass(node, "enabled");
            }
    });

}

function activateSection(sectionName) {
    dojo.query(".currentSection").removeClass("currentSection");
    dojo.query("." + sectionName).query(".sectionOuter").addClass("currentSection");

}

var highestVisitedPage;
function advanceBadge(pageNumber) {

    if(highestVisitedPage === undefined) {
        highestVisitedPage = pageNumber;
    }
    // Background is same as first page
    if(pageNumber === 1) {
        pageNumber = 0;
    }
    // Hack to handle last page
    if(pageNumber < 8 && highestVisitedPage === 8) {
        highestVisitedPage = 7;
    }
    if(pageNumber > highestVisitedPage) {
        highestVisitedPage = pageNumber;
    }
//    console.log("highestVisitedPage: " + highestVisitedPage);

    dojo.byId("progressCircle").style.backgroundPosition = highestVisitedPage * -60 + "px " + pageNumber * -60 + "px";

}


function setInfoValues() {
    if(questionnaire.profileValues[infoForm.name] !== undefined) {
        setValues(infoForm, questionnaire.profileValues[infoForm.name]);
    }
}
function addAreaLayer() {
    // Check if map is loaded
    if(map.loaded === false) {
        setTimeout(function() {addAreaLayer();}, 1000);
        return;
    }
    var j;
    var content = questionnaire.infoTemplates.kkolmio.confirm;
//    var content = "${KUVAUS_P}";
    var infoTemplate = new esri.InfoTemplate("<h2>${NIMI}</h2>", content);
    var featureLayer = new esri.layers.FeatureLayer(AREAS_FEATURE_LAYER_URL + "0",
                       {"mode": esri.layers.FeatureLayer.MODE_ONDEMAND,
//                        "outFields": ["*"],
                        "outFields": ["NIMI", "KUVAUS_{{ LANGUAGE_CODE|slice:":2"|upper }}"],
                        "infoTemplate": infoTemplate
                       });
    //featureLayer.setOpacity(0.2);
    var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                    new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                    new dojo.Color([0,0,255]), 2),new dojo.Color([0,255,0,0]));

    var renderer = new esri.renderer.SimpleRenderer(symbol);
    featureLayer.setRenderer(renderer);
    var clickHandler = function(l) {
            map.addLayer(l);
            // Add onclickhandler for this layer

            for(j = 0; j < map.graphicsLayerIds.length; j++) {
                if(map.getLayer(map.graphicsLayerIds[j]).name === "KuninkaanKolmio_kaikki_new") {
                    dojo.connect(map.getLayer(map.graphicsLayerIds[j]), "onClick", infoWindowHandler);
                }
            }
            l.hide();

    };
    if (featureLayer.loaded) {
        clickHandler(featureLayer);
    }
    else {
        dojo.connect(featureLayer, "onLoad", clickHandler);
    }
    var featureLayer2 = new esri.layers.FeatureLayer(AREAS_FEATURE_LAYER_URL + "1",
                       {"mode": esri.layers.FeatureLayer.MODE_ONDEMAND,
                        "outFields": ["NIMI"]
                       });

    if (featureLayer2.loaded) {
        map.addLayer(featureLayer2);
        map.reorderLayer(featureLayer2, 0);
        featureLayer2.renderer.symbol.setHeight(20);
        featureLayer2.renderer.symbol.setWidth(18);
        featureLayer2.hide();
    }
    else {
        dojo.connect(featureLayer2, "onLoad", function (l) {
            map.addLayer(l);
            map.reorderLayer(l,0);
            l.renderer.symbol.setHeight(20);
            l.renderer.symbol.setWidth(18);
            l.hide();
        });
    }
}
function createTwoPageInfo() {
    if(dojo.query("#stackCont", "info").length > 0) {
        var t = new dijit.layout.StackContainer({id: "stack1"}, "stackCont");
        var c1 = new dijit.layout.ContentPane({title: "1", content: dojo.byId("page1"), selected: true, id: "cp1"});
        t.addChild(c1);
        var c2 = new dijit.layout.ContentPane({title: "2", content: dojo.byId("page2"), id: "cp2"});

        t.addChild(c2);
        t.startup();

        // Some problem selected content not showing after startup
        t.selectChild(c2, false);
        t.selectChild(c1, false);

//        dojo.query("#infoStackNext").forEach(function(node) {
        dojo.query(".stackNext").forEach(function(node) {
            //create Next And Previous buttons
            var json_def = {};

            //take values from html 5
            if(node.name !== undefined) {
                json_def.name = node.name;
            }
            if(dojo.attr(node, "class") !== undefined) {
                json_def["class"] = dojo.attr(node, "class");
            }
            json_def.onClick = function() {dijit.byId("stack1").forward();};
            json_def.title = node.innerHTML;
            json_def.label = node.innerHTML;
            //json_def.showLabel = false;

            var button = new dijit.form.Button(json_def,
                                             node);
            });
    }
}
function submitAreaForm(formId, removeValues /* boolean */) {
    console.log("submitAreaForm");
    var areaForm = dijit.byId(formId);

    if (areaForm !== undefined && areaForm !== null) {
        var values = getValues(areaForm);
        if(removeValues === true) {
            values = {};
        }
        questionnaire.values[areaForm.name] = values;
        questionnaire.profileValues[areaForm.name] = values;

        if(questionnaire.values.testUser !== true) { //only if user is not testuser
            //save_profile_values(questionnaire.profileValues);
            gnt.opensocial_people.update_person("@me", questionnaire.profileValues);
        }
    }
}
function showHideFeaturelayers(show) {
    var j;
    if (show === true) {
        for(j = 0; j < map.graphicsLayerIds.length; j++) {
                if(map.getLayer(map.graphicsLayerIds[j]).type === "Feature Layer") {
                    map.getLayer(map.graphicsLayerIds[j]).show();
                }
            }
    }
    else if (show === false) {
        for(j = 0; j < map.graphicsLayerIds.length; j++) {
                if(map.getLayer(map.graphicsLayerIds[j]).type === "Feature Layer") {
                    map.getLayer(map.graphicsLayerIds[j]).hide();
                }
            }
    }
}
// Add Googlemaps layers to the map
var gMapLayer;
function addGmapLayer() {
    if(gMapLayer === undefined) {
        gMapLayer = new agsjs.layers.GoogleMapsLayer({"visible":true, "id":"googlemaps", "apiOptions": {
                "v": "3.6"
           }
});
        map.addLayer(gMapLayer);
        // Style object to modify the labels
        var styler = [ {
            "featureType": "landscape",
            "elementType": "labels",
            "stylers": [ {
                "visibility": "off"
            } ]
        } ];
        //gMapLayer._gmap.setOptions({"styles": styler});
        // Hide unnecessary layers
        tiledMapServiceLayer.hide();
        //ovlayer.hide();

    }
}
function questionnaire_logout(url, callback_function) {
    dojo.xhrGet({
        "url": url,
        "handle": function(response, ioArgs) {
            if(callback_function !== undefined) {
                callback_function({"status_code": ioArgs.xhr.status,
                                  "message": ioArgs.xhr.responseText});
            }
            else {
                if(ioArgs.xhr.status === 200) {
                    dojo.place(response, dojo.body(), "first");
                }
            }

        }
    });
}

