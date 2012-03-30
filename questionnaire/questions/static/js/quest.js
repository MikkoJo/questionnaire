/*global dojo, dijit, dojox, questionnaire, document, djConfig, console, get_features,
  get_profiles, event, window, save_profile_values, save_graphic, softgis, advanceBadge,
  enableSection, activateSection, myHorizontalSlider, nextButtonHover, overviewMapShow,
  overviewMapHide, alert, applicationName, createTwoPageInfo, MAPSERVICE_URL, OVERVIEWMAP_URL,
  SATELLITE_MAPSERVICE_URL, myVerticalSlider, createOverview, enableMyPan, remove_graphic,
  ImageButton, ButtonPool, setTimeout, clearTimeout, addSchools, addGmapLayer, getCookie,
  CSRF_Cookie_Name, gnt, OpenLayers, $
*/

//required packages
dojo.require("dijit.dijit");
//dojo.require("dijit.form");
dojo.require("dojo.parser");
//dojo.require("dojo.create");
//dojo.require("dojo.html");
//dojo.require("dijit.form.VerticalRule");
dojo.require("dijit.form.HorizontalSlider");
//dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.Form");
dojo.require("dojox.fx.style");
dojo.require("dojo.cookie");
/* The following requires are commented out as those widgets are disabled*/
//dojo.require("dijit.form.NumberTextBox");
//dojo.require("dijit.form.CheckBox");
//dojo.require("dijit.form.SimpleTextarea");
//dojo.require("dijit.form.ValidationTextBox");
//dojo.require("dijit.form.TextBox");
//dojo.require("dijit.form.Select");
//dojo.require("dojox.validate.regexp");*/
//dojo.require("dijit.form._FormWidget");


/* GLOBAL VARIABLES */
//map is the OpenLayers map created for the site
var map;
//tb is the toolbar needed for drawing on the map
//var tb;
//form is needed to be able to distory the widgets in a page
var form;
//id for the user
var id;
//pool for the imageButtons
//var pool;
//if drawtoolbar is activated or not
//var tbactivated = false;
//to remember which point in a polyline the user is drawing
//var edge = 0;
//is changed to false when the previous values have been loaded from the database
questionnaire.loaded = false;

var activeGraphic;
var lastClickEvent;
//var tiledMapServiceLayer;
//var cookiesDeleted = false;
//current page number
var nr;
//conficting with another value in createpage
//var page = "tervetuloa";


//help function to remove element in an array, returns the new array
Array.prototype.remove = function(value) {
    var copy = [];
    var i;
    for(i = 0; i < this.length; i++) {
        if(value !== this[i]) {
            copy.push(this[i]);
        }
    }
    return copy;
};

// Hooks to connect
function createPageHook() {}
function initHook() {}
function createInfoHook() {}

// Get path of the application
function getPath() {
    var documentPath = document.location.pathname;
    var path = documentPath.substring(0, documentPath.indexOf('/',1));
    return path;
}

//do not use this one for self referencing objects(also makes a shalow copy of the array object
function clone(obj){
    if(obj === null || typeof(obj) !== 'object') {
    return obj;
    }
    if(obj.constructor === Array) {
        return [].concat(obj);
    }
    var temp = {};
    var key;
    for(key in obj) {
        if(key !== null) {
            temp[key] = clone(obj[key]);
            }
        }
    return temp;
}

//Helper function to simulate onchange on input elements
function fireonchange(element) {

    if (document.createEvent) { // Firefox etc.
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent("change", true, true);
        element.dispatchEvent(evt);
    }
    else {// IE
        element.fireEvent("onchange");
    }

}

/* Overview map container functionality */
function toggleovwin() {
    var anim = dojox.fx.toggleClass("ov", "open" );
    dojo.connect(anim, "onEnd", function() {
                    dojo.toggleClass(dojo.byId("hidetext"), "tyhja");
                    dojo.toggleClass(dojo.byId("showtext"), "tyhja");
                    });
    anim.play();
}
function overviewMapShow(){
    var divi = dojo.byId("ovcont");
    divi.style.visibility = "visible";
}

function overviewMapHide(){

    var divi = dojo.byId("ovcont");
    divi.style.visibility = "hidden";
}


// Load infotemplates from diffrent file
function loadTemplates(fileName) {
    if(fileName === null || fileName === undefined) {
//        fileName = "{% url random_cont file_name='extra_info_temp_json' file_type='js' %}";
        fileName = questionnaire.infotemplates_url;
    }
    if(fileName === "") {
        return;
    }

    dojo.xhrGet({
                // The following URL must match that used to test the server.
                url: fileName,
                sync: false,
                timeout: 60000, // Time in milliseconds
                handleAs: "json",
                preventCache: djConfig.isDebug,

                // The LOAD function will be called on a successful response.
                load: function(response, ioArgs){
                    var testi = response.templates;
                    var tName;
                    for (tName in testi) {
//                      console.log(tName);
                        if (testi.hasOwnProperty(tName)) {
                            if (tName !== undefined) {
                                questionnaire.infoTemplates[tName] = testi[tName];
                            }
                        }
                    }
                    //console.log(dojo.toJson(testi));
                    return response;
                },

                // The ERROR function will be called in an error case.
                error: function(response, ioArgs){
                    //console.error("HTTP status code: ", ioArgs.xhr.status);
                    return response;
                }
            });

}

function add_popup_to_feature(evt) {

    var default_infocontent = " default info content ",
        feature = evt.feature,
        infowindow_name,
        popupcontent;

    //save name to feature.attributes, we need it when we fetch features from server
    if(feature.attributes.info_name !== undefined && feature.attributes.info_name !== null) {
        infowindow_name = feature.attributes.info_name;
    }

    //get the right content for the popup
    if( infowindow_name !== undefined ) {
        popupcontent = $('#' + infowindow_name).html();
    }
    if(popupcontent === null) {
        popupcontent = default_infocontent;
    }
    popupcontent = OpenLayers.String.format(popupcontent, feature.attributes);

    feature.lonlat = get_popup_lonlat(feature.geometry);
    feature.popupClass = OpenLayers.Popup.FramedCloud;
    feature.data = {
        popupSize: null,
        popupContentHTML: popupcontent
    };
    //var parsed_content = create_widgets('popupContent');
    //create popup and put it on the map
    feature.popup = new OpenLayers.Popup.FramedCloud(
                    feature.id,
                    feature.lonlat,
                    feature.data.popupSize,
                    feature.data.popupContentHTML,
                    null,
                    false);
    console.log("created popup");

}

//Callback functions for api functions
function get_features_callback(response_data) {

    //var response = response_data.response;
 //   var response = response_data;
    //TESTING
    pointLayer.events.register("featureadded", undefined, add_popup_to_feature);
    routeLayer.events.register("featureadded", undefined, add_popup_to_feature);
    areaLayer.events.register("featureadded", undefined, add_popup_to_feature);
    // Copied from the API
    if(djConfig.isDebug) {
        console.log("get_features_callback: " + dojo.toJson(response_data));
    }
    var gjf, features, i,
        point_array = [],
        linestring_array = [],
        polygon_array = [];

    gjf = new OpenLayers.Format.GeoJSON();
    features = gjf.read(response_data);

    // create arrays for different geometry types from the features array
    for(i = 0; i < features.length; i++) {
        if(features[i].geometry instanceof OpenLayers.Geometry.Point) {
            point_array.push(features[i]);
        }
        else if(features[i].geometry instanceof OpenLayers.Geometry.LineString) {
            linestring_array.push(features[i]);
        }
        else if(features[i].geometry instanceof OpenLayers.Geometry.Polygon) {
            polygon_array.push(features[i]);
        }
    }

    pointLayer.addFeatures(point_array);
    routeLayer.addFeatures(linestring_array);
    areaLayer.addFeatures(polygon_array);

    pointLayer.events.unregister("featureadded", undefined, add_popup_to_feature);
    routeLayer.events.unregister("featureadded", undefined, add_popup_to_feature);
    areaLayer.events.unregister("featureadded", undefined, add_popup_to_feature);

    // Now we can create a new page
    createPage(questionnaire.pages[1].name);
    // End of the copied content

}

function get_profiles_callback(values) {
    console.log("get_profiles_callback: " + dojo.toJson(values));
    //return value is an array and questionnaire.values is an object
    if(values.length >= 1) {
        questionnaire.values = values[0];
        questionnaire.profileValues = clone(values[0]);
    }
    // Here to make sure profileValues are loaded
    get_features("?time__now=true", get_features_callback);

}
function get_person_callback(response_data) {
    console.log("get_person_callback: " + dojo.toJson(response_data));
    // Check for error
    if(response_data.statusCode === undefined) {
        console.log("success");
        questionnaire.values = response_data;
        questionnaire.profileValues = clone(response_data);
        gnt.geo.get_features("?time__now=true", get_features_callback);
    }
    else {
        console.log("failure");
    }
    //if(response_data.length >= 1) {
    //    questionnaire.values = response_data[0];
    //    questionnaire.profileValues = clone(response_data[0]);
    //}
}
function create_session_callback(response) {
//    console.log("create_session_callback: " + dojo.toJson(response.response));
    console.log("create_session_callback: " + response);
    //get_profiles("?latest=true", get_profiles_callback);
    //get_profiles("?time__now=true", get_profiles_callback);
    //
    gnt.opensocial_people.get_person("@me", get_person_callback);
    // Session is created so we can load rest of the infotemplates
    loadTemplates();

}
function save_graphic_callback(response_data) {

    if(djConfig.isDebug) {
        console.log("save_graphic_callback: " + dojo.toJson(response_data.response));
    }
    // If update return. At this moment we do not change geometries, only properties
    if(response_data.response.search) {
        if(response_data.response.search(/Feature with id [0-9]+ was updated/) !== -1) {
            return;
        }
    }
    var valName = response_data.response.properties.valuename,
        respGeom = response_data.response.geometry,
        i,
        k;

    // Go through questionnaire.graphics to find correct graphic and add id to it
    for(i = 0; i < questionnaire.graphics[valName].length; i++) {
        if(questionnaire.graphics[valName][i].geometry.type === "point" &&
            questionnaire.graphics[valName][i].geometry.x === respGeom.coordinates[0] &&
            questionnaire.graphics[valName][i].geometry.y === respGeom.coordinates[1]) {

            questionnaire.graphics[valName][i].id = response_data.response.id;
            questionnaire.features[response_data.response.id] = response_data.response;
            break;

        } else if (questionnaire.graphics[valName][i].geometry.type === "polyline" &&
                    dojo.toJson(questionnaire.graphics[valName][i].geometry.paths) === dojo.toJson([respGeom.coordinates])) {

            questionnaire.graphics[valName][i].id = response_data.response.id;
            questionnaire.features[response_data.response.id] = response_data.response;
            break;
        } else if (questionnaire.graphics[valName][i].geometry.type === "polygon" &&
                    dojo.toJson(questionnaire.graphics[valName][i].geometry.rings) === dojo.toJson(respGeom.coordinates)) {

            questionnaire.graphics[valName][i].id = response_data.response.id;
            questionnaire.features[response_data.response.id] = response_data.response;
            break;
        }
    }
    //Add graphicId to the questionnaire.values
    for(k = 0; k < questionnaire.values[valName].length; k++) {
        if(questionnaire.values[valName][k].geom.type === "point" &&
            questionnaire.values[valName][k].geom.x === respGeom.coordinates[0] &&
            questionnaire.values[valName][k].geom.y === respGeom.coordinates[1]) {

            questionnaire.values[valName][k].graphicId = response_data.response.id;
            break;

        } else if (questionnaire.values[valName][k].geom.type === "polyline" &&
                    dojo.toJson(questionnaire.graphics[valName][k].geometry.paths) === dojo.toJson([respGeom.coordinates])) {

            questionnaire.values[valName][k].graphicId = response_data.response.id;
            break;
        } else if (questionnaire.values[valName][k].geom.type === "polygon" &&
                    dojo.toJson(questionnaire.graphics[valName][k].geometry.rings) === dojo.toJson(respGeom.coordinates)) {

            questionnaire.values[valName][k].graphicId = response_data.response.id;
            break;
        }
    }
//    activeGraphic.id = response_data.response.id;

}
function create_feature_callback(response_data) {

    if(djConfig.isDebug) {
        console.log("save_graphic_callback: " + dojo.toJson(response_data));
    }
    // If update return. At this moment we do not change geometries, only properties
    if(response_data.search) {
        if(response_data.search(/Feature with id [0-9]+ was updated/) !== -1) {
            return;
        }
    }
    var valName = response_data.properties.valuename,
        respGeom = response_data.geometry,
        i,
        k;

    // Go through questionnaire.graphics to find correct graphic and add id to it
    for(i = 0; i < questionnaire.graphics[valName].length; i++) {
        if(questionnaire.graphics[valName][i].geometry.type === "point" &&
            questionnaire.graphics[valName][i].geometry.x === respGeom.coordinates[0] &&
            questionnaire.graphics[valName][i].geometry.y === respGeom.coordinates[1]) {

            questionnaire.graphics[valName][i].id = response_data.id;
            questionnaire.features[response_data.id] = response_data;
            break;

        } else if (questionnaire.graphics[valName][i].geometry.type === "polyline" &&
                    dojo.toJson(questionnaire.graphics[valName][i].geometry.paths) === dojo.toJson([respGeom.coordinates])) {

            questionnaire.graphics[valName][i].id = response_data.id;
            questionnaire.features[response_data.id] = response_data;
            break;
        } else if (questionnaire.graphics[valName][i].geometry.type === "polygon" &&
                    dojo.toJson(questionnaire.graphics[valName][i].geometry.rings) === dojo.toJson(respGeom.coordinates)) {

            questionnaire.graphics[valName][i].id = response_data.id;
            questionnaire.features[response_data.id] = response_data;
            break;
        }
    }
    //Add graphicId to the questionnaire.values
    for(k = 0; k < questionnaire.values[valName].length; k++) {
        if(questionnaire.values[valName][k].geom.type === "point" &&
            questionnaire.values[valName][k].geom.x === respGeom.coordinates[0] &&
            questionnaire.values[valName][k].geom.y === respGeom.coordinates[1]) {

            questionnaire.values[valName][k].graphicId = response_data.id;
            break;

        } else if (questionnaire.values[valName][k].geom.type === "polyline" &&
                    dojo.toJson(questionnaire.graphics[valName][k].geometry.paths) === dojo.toJson([respGeom.coordinates])) {

            questionnaire.values[valName][k].graphicId = response_data.id;
            break;
        } else if (questionnaire.values[valName][k].geom.type === "polygon" &&
                    dojo.toJson(questionnaire.graphics[valName][k].geometry.rings) === dojo.toJson(respGeom.coordinates)) {

            questionnaire.values[valName][k].graphicId = response_data.id;
            break;
        }
    }
//    activeGraphic.id = response_data.response.id;

}
function create_ol_feature_callback(response_data) {

    if(djConfig.isDebug) {
        console.log("save_graphic_callback: " + dojo.toJson(response_data));
    }
    // If update return. At this moment we do not change geometries, only properties
    if(response_data.search) {
        if(response_data.search(/Feature with id [0-9]+ was updated/) !== -1) {
            return;
        }
    }
    var valName = response_data.properties.valuename,
        respGeomJSON = response_data.geometry,
        respGeom,
        i,
        features;
    // Check features on the to add fid to the correct feature
    var gjf = new OpenLayers.Format.GeoJSON();
    respGeom = gjf.parseGeometry(respGeomJSON);
    if(respGeomJSON.type === 'Point') {
        features = pointLayer.getFeaturesByAttribute("valuename", valName);
    }
    else if(respGeomJSON.type === 'LineString') {
        features = routeLayer.getFeaturesByAttribute("valuename", valName);
    }
    else if(respGeomJSON.type === 'Polygon') {
        features = areaLayer.getFeaturesByAttribute("valuename", valName);
    }
    for(i = 0; i < features.length; i++) {
        if(features[i].geometry.equals(respGeom)) {
            features[i].fid = response_data.id;
            break;
        }
    }

}



//Helper function to simulate click on 'next' -button
function nextEvent() {

    var but = dojo.query(".next");
    if (document.createEvent) { // Firefox etc.
        var evt = document.createEvent("MouseEvents");
        evt.initEvent("click", true, true);
        but.forEach(function(node) {node.dispatchEvent(evt);});
    }
    else {// IE
        but.forEach(function(node) {node.fireEvent("onclick");});
    }

}

//Helper function to simulate click on 'previous' -button
function previousEvent() {

    var but = dojo.query(".previous");
    if (document.createEvent) { // Firefox etc.
        var evt = document.createEvent("MouseEvents");
        evt.initEvent("click", true, true);
        but.forEach(function(node) {node.dispatchEvent(evt);});
    }
    else {// IE
        but.forEach(function(node) {node.fireEvent("onclick");});
    }

}

//Hide/Show infowindow content
function changeInfoForm(newValue) {
    //Cannot use toggleClass because onChange fires also when creating infowindow
    if(newValue === true) {
        dojo.query('.optional').addClass('tyhja');
        dojo.query('.optional2').removeClass('tyhja');
    }
    else {
        dojo.query('.optional').removeClass('tyhja');
        dojo.query('.optional2').addClass('tyhja');
    }
}

//destroy hidden infoform buttons. Do not want to submit unncessary values
function uncheckHidden() {
//	var nList = dojo.query('.tyhja :checked');
//	nList.forEach(function(node) {dijit.byId(node.id).attr('checked', false);});
    var nList = dojo.query('.tyhja input', 'info');
//	nList.forEach(function(node) {dijit.byId(node.id).attr('disabled', true);});
    nList.forEach(function(node) {if (node.id) {
        dijit.byId(node.id).destroyRecursive();
    }});

}


// Delete this pages cookies
/*
function deleteCookies() {
    // A bit complicated because diffent cookie paths (No way to find paths in javascript ?)
    var cookies = document.cookie.split(";");
    var cookiePaths = {"currentPage": getPath(), "ASPSESSIONID": "/"};
    var cookieName;
    for (var i = 0; i < cookies.length; i++) {
        cookieName = cookies[i].substring(0, cookies[i].indexOf("="));
        //console.log("cookieName " + cookieName);
        for(var test in cookiePaths) {
            //console.log("test: " + test + " cookieName.match(test) " + cookieName.match(test));
            if(cookieName.match(test) !== null) {
                //console.log("cookiePaths.test " + cookiePaths[test]);
                dojo.cookie(cookieName, null, {path: cookiePaths[test], expires: -1});
            }
        }
    }
    // mark deleleted flag
    cookiesDeleted = true;

}*/
// Returns name of the page
function getPageName(number, pagearray) {
    if(pagearray === undefined) {
        return questionnaire.pages[number].name;
    } else {
        return questionnaire[pagearray][number].name;
    }
}

//returns the number of the page where page is positioned
function getPageNumber(name, pagearray) {
    var i;
    for (i = 0; i < pagearray.length; i++) {
        if (pagearray[i].name === name) {
            return i;
        }
    }
    return 0;
}

function getPage(name) {
    var i;
    for (i = 0; i < questionnaire.pages.length; i++) {
        if (questionnaire.pages[i].name === name) {
            return questionnaire.pages[i];
            }
        }
    return undefined;
}

/* Center map corresponding to residence area, are can be defined either as an extent or a point and map level*/
function centerResidenceArea(onlyFirst) {
    // console.log("centerResidenceArea");


    // // find place by extent.
     if(onlyFirst === true && questionnaire.residenceCentered === true) {
        return false;
     }
     var searchText;
     if(questionnaire.values.background !== undefined) {
         searchText = questionnaire.values.background.resarea;
     }
     if(searchText === undefined/* || searchText === ""*/) {
         return false;
     }
     if(searchText === "") {
         searchText = "NULL";
     }
         var i;
     for(i = 0; i < questionnaire.residencePlaces.length; i++) {
            if (questionnaire.residencePlaces[i][searchText] !== null && questionnaire.residencePlaces[i][searchText] !== undefined) {
                // Defined as an extent
                if(questionnaire.residencePlaces[i][searchText].xmax !== undefined) {
                    console.log("REMOVED, use point and zoomlevel");
                } // Defined as point and level
                else {
                    var coords = questionnaire.residencePlaces[i][searchText].coords;
                    var residencePoint = new OpenLayers.LonLat(coords.x, coord.y);
                    map.setCenter(residencePoint, questionnaire.residencePlaces[i][searchText].level);
                }
            questionnaire.residenceCentered = true;
            return true;
         }
     }

     return false;
 }

function setCursor(e, c, oldCursor) {
    console.log("setCursor");
    var node = dojo.byId(e);
    // on reload IE tries to change cursor of non-existent node
    if (node === undefined || node === null) {
        return;
    }
    if (c === "") {
        //set default cursor for div
        if(e === "map_layers") {
            node.style.cursor = "url('" + questionnaire.openhand_cursor_url + "'), auto";
        } else {
            node.style.cursor = "auto";
        }
    } else {
        /*prioritize cursors by replacing only oldCursor and
          if oldCursor is undefined then replace existing cursor
        */
        if (oldCursor === undefined) {
            node.style.cursor = c + ", auto";
        } else if (node.style.cursor.match(oldCursor) !== null || node.style.cursor === "" ) {
            node.style.cursor = c + ", auto";
        }
    }
}


// Get browserwindow height, should work on all browsers
function getWindowHeight() {
    console.log("getWindowHeight");
    var windowHeight=0;
    if (typeof(window.innerHeight) === typeof(1)) {
        windowHeight=window.innerHeight;
    }
    else {
        if (document.documentElement&&
            document.documentElement.clientHeight) {
            windowHeight= document.documentElement.clientHeight;
        }
        else if (document.body&&document.body.clientHeight) {
            windowHeight=document.body.clientHeight;
        }

    }
    return windowHeight;
}

// Get browserwindow width, should work on all browsers
function getWindowWidth() {
    console.log("getWindowWidth");
    var windowWidth = 0;
    if (typeof(window.innerWidth) === typeof(1)) {
        windowWidth=window.innerWidth;
    }
    else {
        if (document.documentElement&&
            document.documentElement.clientWidth) {
            windowWidth= document.documentElement.clientWidth;
        }
        else if (document.body&&document.body.clientWidth) {
            windowWidth=document.body.clientWidth;
        }

    }
    return windowWidth;
}
function getMaxContentHeight() {
    console.log("getMaxContentHeight");

    var windowHeight = getWindowHeight();
    var headerHeight = dojo.byId("header").offsetHeight;
    var footerHeight = dojo.byId("footer").offsetHeight;

    return windowHeight - (headerHeight + footerHeight);
}

var smallHidden = false;

function setContentMaxHeight(cont) {
    var maximumHeight;
    var contentMaximumHeight;
    var formAreaMaximumHeight;
    var subwindowMaximumHeight;
    var subwindowTopMaximimumHeight;
    var bottomMargin = 10;
    var topMarginContent = 25;
    var topMarginSubwindow = 40;
    var ButtonAreaHeight = 75;
/*  TODO: Get paddings from css */
    var bottomPadding = 20;
    var subPaddingTop = 30;
    var subPaddingBottom = 30;
    var windowHeight = getWindowHeight();
    var headerHeight = dojo.byId("header").offsetHeight;
    var footerHeight = dojo.byId("footer").offsetHeight;
    //var cssRules; // Unused
    //var found = 0; //Unused
    var cssRule;
/*
    console.log("win: " +  windowHeight);
    console.log("head: " +  headerHeight);
    console.log("foot: " +  footerHeight);
*/
    console.log("setContentMaxHeight");
    maximumHeight = windowHeight - (headerHeight + footerHeight);
    contentMaximumHeight =  ((maximumHeight - (topMarginContent + bottomMargin)) > 0) ? maximumHeight - (topMarginContent + bottomMargin) : 1;
    formAreaMaximumHeight = ((contentMaximumHeight - (ButtonAreaHeight + bottomPadding)) > 0) ? contentMaximumHeight - (ButtonAreaHeight + bottomPadding) : 1;
    subwindowMaximumHeight = ((maximumHeight - (topMarginSubwindow + bottomMargin)) > 0) ? maximumHeight - (topMarginSubwindow + bottomMargin) : 1;
    subwindowTopMaximimumHeight = ((subwindowMaximumHeight - (ButtonAreaHeight + subPaddingTop + subPaddingBottom)) > 0) ? subwindowMaximumHeight - (ButtonAreaHeight + subPaddingTop + subPaddingBottom) : 1;

    // IE uses different syntax
    if(dojo.isIE) {
        cssRule = "max-height";
    }
    else {
//		cssRule = "maxHeight";
        cssRule = "max-height";
    }

    //max-height is not supported in IE6
    if (dojo.isIE === 6 && cont !== undefined) {
        var fa = dojo.query(".formArea");
        var st = dojo.query(".subwindowTop");
        //if no formarea found set the cont height
        if(fa.length === 0 && cont.offsetHeight > contentMaximumHeight) {
            cont.style.height = contentMaximumHeight + "px";
        }
        else if (fa[0].scrollHeight - 30 > formAreaMaximumHeight) {
            fa[0].style.height = formAreaMaximumHeight + "px";
            cont.style.height = contentMaximumHeight + "px";
            fa[0].style.overflowY = "auto";
            fa[0].style.overflowX = "hidden";
        }
        else {
            fa[0].style.height = fa[0].scrollHeight - 30 + "px";
            cont.style.height = fa[0].scrollHeight -30 + (ButtonAreaHeight + bottomPadding) + "px";
            fa[0].style.overflow = "hidden";
        }
        if(st.length === 0) {
            if(cont.offsetHeight > subwindowMaximumHeight) {
                cont.style.height = subwindowMaximumHeight + "px";
            }
            else {
                cont.style.height = cont.offsetHeight;
            }
        }
        else if (st[0].scrollHeight - 30 > subwindowTopMaximimumHeight) {
            st[0].style.height = subwindowTopMaximimumHeight + "px";
            cont.style.height = subwindowMaximumHeight + "px";
            st[0].style.overflowY = "auto";
            st[0].style.overflowX = "hidden";
        }
        else {
            st[0].style.height = st[0].scrollHeight - 30 + "px";
            cont.style.height = st[0].scrollHeight -30 + (ButtonAreaHeight + subPaddingTop + subPaddingBottom) + "px";
            st[0].style.overflow = "hidden";
        }
        // IE6 css: expression( this.scrollHeight > 550 ? '551px' : 'auto' );
        //var smallHeight = "expression( this.scrollHeight > 350 ? '351px' : 'auto' )";
        //var smallHeight = "expression( this.scrollHeight > " + formAreaMaximumHeight + " ? '" + (formAreaMaximumHeight + 1) + "px' : 'auto' )";

        //changeCssClass("div#bigContent div.formArea", "height", smallHeight);
        //changeCssClass("div#smallContent div.formArea", "height", smallHeight);
        //dojo.byId("bigContent").style.height = (contentMaximumHeight) + "px";
    }
    else {
        //changeCssClass("div#bigContent div.formArea", cssRule, formAreaMaximumHeight + "px");
        //changeCssClass("div#smallContent div.formArea", cssRule, formAreaMaximumHeight + "px");
        //changeCssClass("div.subwindowTop", cssRule, subwindowTopMaximimumHeight + "px");
        dojo.query("div#bigContent div.formArea").style("maxHeight", formAreaMaximumHeight + "px");
        dojo.query("div#smallContent div.formArea").style("maxHeight", formAreaMaximumHeight + "px");
        dojo.query("div.subwindowTop").style("maxHeight", subwindowTopMaximimumHeight + "px");
        dojo.byId("smallContent").style.maxHeight = contentMaximumHeight + "px";
        dojo.byId("bigContent").style.maxHeight = contentMaximumHeight + "px";
        dojo.byId("subwindow").style.maxHeight = subwindowMaximumHeight + "px";
    }
}

/* When imagebutton is active not to change cursor over graphics */
function disableCursorChange() {
    console.log("disableCursorChange: ");
    if (!dojo.isIE) {
        dojo.removeClass("map", "graphicsCursor");
        //dojo.query("g path").style("cursor", cursor + ", auto");
        //dojo.query("g image").style("cursor", cursor + ", auto");
        //changeCssClass("g path", "cursor", "");
        //changeCssClass("g image", "cursor", "");
    }
    else {
        //domissa isolle toi DIV
        //changeCssClass("DIV#map_map_graphics", "cursor", "");
        dojo.removeClass("map", "graphicsCursor");
        //dojo.query("div#map_map_graphics").style("cursor", cursor);
    }
}
/* Change back to normal behavior */
function enableCursorChange() {
    console.log("enableCursorChange");
    if (!dojo.isIE) {
        dojo.addClass("map", "graphicsCursor");
        //dojo.query("g path").style("cursor", "pointer");
        //dojo.query("g image").style("cursor", "pointer");
        //changeCssClass("g path", "cursor", "pointer");
        //changeCssClass("g image", "cursor", "pointer");
    }
    else {
        //domissa isolla DIV
        //changeCssClass("DIV#map_map_graphics", "cursor", "pointer");
        dojo.addClass("map", "graphicsCursor");
        //dojo.query("div#map_map_graphics").style("cursor", "pointer");
    }
}

function getValues(form) {
    console.log("getValues");
    if(form === undefined) {
        return {};
    }
    var values, valueName, i;
    // Prevent values of the imagebuttons to be added to the form values.
    // If those are added the geometries are saved to the profilevalues.
    // Also geometries are saved twice
    var form_childrens = form.getChildren();
    for (i = 0; i < form_childrens.length; i++) {
        if(form_childrens[i].declaredClass === "ImageButton") {
            form_childrens[i].set("disabled", true);
        }
    }
    try {
//        values = form.getValues();
        //values = form.get("value");
        values = dojo.formToObject(form.id);
    } catch(ex) {
        values = {};
    }

    //FIX for getting normal input values from inside the form last checked dojo 1.5
    /*
    var elem = dojo.byId(form.id).elements;
    var vn;
    var val;
    var e;

    for (e = 0; e < elem.length; e++) {
        vn = elem[e].name;

        if((vn !== null && vn !== undefined && vn !== "") &&
                   (elem[e].disabled !== true) &&
                   (elem[e].type !== "radio" || elem[e].checked)) {

                    if (elem[e].type === "checkbox" && !elem[e].checked) {
                            if(values[vn] !== undefined) {
                                    values[vn] = values[vn].remove(elem[e].value);
                            } else {
                                    values[vn] = [];
                            }
                            continue;
                    }

                    val = elem[e].value;

                    if(val !== undefined) {
                            if(elem[e].type === "checkbox") {
                                    if(values[vn] === undefined) {
                                            values[vn] = [];
                                    }
                                    //indexOf not supported for arrays/objects in IE7 and below
                                    if (values[vn].indexOf) {
                                            if (values[vn].indexOf(val) === -1) {
                                            values[vn].push(val);
                                            }
                                    }
                                    else {
                                            if(values[vn].toString().search(val) === -1) {
                                                    values[vn].push(val);
                                            }
                                    }
                            } else {
                                    values[vn] = val;
                            }
                    } else {
                            values[vn] = "";
                    }
                }
    }

    // END FIX
    */
    // FIX above handles also this situation
    //FIX for bug non valid json NaN, can be removed when dojo fix arrive last checked dojo 1.6.1
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
    /*
    var fix = form.getDescendants();
    for (var i = 0; i < fix.length; i++) {
        try {
            if(fix[i].type === "NumberTextBox" && isNaN(fix[i].get('value'))) {
                values[fix[i].name] = "";
            }
        } catch(err) {
            continue;
        }
    }
    //END FIX
    */
    return values;
}

//Validity of the current form
var isValid = true;
//Check that all required fields are filled. return true if valid, else invalid fields
function validateForm(formValues, pageNumber) {
    isValid = true;
    var invalidFields= [];
    var tField;
    var reqFields = questionnaire.pages[pageNumber].required;
    if(reqFields === undefined) {return true;}
        var i;
    for(i = 0; i < reqFields.length; i++) {
        tField = formValues[reqFields[i]];
        if(tField === null || tField === undefined || tField === "") {
            isValid = false;
            invalidFields.push(reqFields[i]);
        }
    }
    return isValid ? true : invalidFields;
}

function submitForm(e) { /* PROBLEM: Creates unnecessary undefined values for imagebuttons, */
    console.log("submitForm");

    if (form !== undefined && form !== null) {
    var values = getValues(form);
    questionnaire.values[form.name] = values;
    questionnaire.profileValues[form.name] = values;

    /*TESTING MANDATORY QUESTIONS, Tested only for radiobuttons*/
    var isValid = validateForm(values, nr);

    if(questionnaire.values.testUser !== true && isValid === true) { //only if user is not testuser
        //the graphics that is saved has a recursion so dojo.toJson does not work
        //we save the infotemplate, symbol, geometry and attributes
        var gr = {};
        /* We dont use graphics*/

        //save_profile_values(questionnaire.profileValues);
        gnt.opensocial_people.update_person("@me", questionnaire.profileValues);

    }
    else if (dojo.isArray(isValid)) {
        isValid.forEach(function(ele) {
            dojo.query("." + ele).addClass("error");
        });
    }
}
}

var infoForm;
var tempButton;
var widget;

// submits the infoform and takes as the parameters inforforms dom node ID and the name for the value..
function submitInfoForm(id, name) {

    console.log("submitInfoForm");
    if(infoForm === undefined) {
        infoForm = {"formnode":"info"};
    }
    if(djConfig.isDebug) {
        console.log(infoForm);
    }
    var values = getValues(infoForm);
    console.log("values from the infoForm");
    if(djConfig.isDebug) {
        console.log(values);
    }
    // FOR REST API
    console.log("values: " + values);
    var tempAttributes = activeGraphic.attributes;
    var s_valuename = activeGraphic.attributes.valuename;
    var s_id = activeGraphic.attributes.id;
    var s_infotype = activeGraphic.attributes.infotype;
    console.log("the active graphic values to submit");
    if(djConfig.isDebug) {
        console.log(activeGraphic);
    }
    activeGraphic.attributes = values;
    activeGraphic.attributes.category = 'default';
    activeGraphic.attributes.valuename = s_valuename;
    activeGraphic.attributes.node = s_id;
    //saveGraphic.attributes.infotype = s_infotype;
    // All existing graphics should have an ID.
    if(questionnaire.values.testUser !== true) {
    //transform to geojson format, this should be in geonition api
        var geojson_feature = {};
        geojson_feature.type = "Feature";
        geojson_feature.properties = activeGraphic.attributes;
        geojson_feature.geometry = {};

        if(activeGraphic.geometry.type === "polyline") {
            geojson_feature.geometry.type = "LineString";
            geojson_feature.geometry.coordinates = activeGraphic.geometry.paths[0];
        } else if(activeGraphic.geometry.type === "point") {
            geojson_feature.geometry.type = "Point";
            geojson_feature.geometry.coordinates = [activeGraphic.geometry.x,
                                                    activeGraphic.geometry.y];
        } else if(activeGraphic.geometry.type === "polygon") {
            geojson_feature.geometry.type = "Polygon";
            geojson_feature.geometry.coordinates = activeGraphic.geometry.rings;
        }

        if(activeGraphic.id !== undefined && activeGraphic.id !== null) {
            geojson_feature.id = activeGraphic.id;
        }

        // add crs to the geometry
        geojson_feature.geometry.crs = {"type": "EPSG",
                                    "properties": {"code": activeGraphic.geometry.spatialReference.wkid}};        // Check if an update or new feature
        if(activeGraphic.id === undefined) {
            gnt.geo.create_feature(geojson_feature, create_feature_callback);
        }
        else {
            gnt.geo.update_feature(geojson_feature);
        }
//        save_graphic(activeGraphic, save_graphic_callback);
    }
    //If graphic does not have an ID, timeout to wait response from the server.
    // TODO This should be done with callback

    /*if(activeGraphic.id !== undefined && activeGraphic.id !== null) {
        questionnaire.features[activeGraphic.id] = activeGraphic;
    }
    else {
        setTimeout(function () {
            questionnaire.features[activeGraphic.id] = activeGraphic;
        }, 3000);
    }*/
    activeGraphic.attributes =  tempAttributes;
    //activeGraphic.id = saveGraphic.id;
    var i;
    for(i = 0; i < questionnaire.values[name].length; i++) {
        if(questionnaire.values[name][i].geom.type === "point" &&
            questionnaire.values[name][i].geom.x === activeGraphic.geometry.x &&
            questionnaire.values[name][i].geom.y === activeGraphic.geometry.y) {

            questionnaire.values[name][i].ival = values;
            break;

        } else if (questionnaire.values[name][i].geom.type === "polyline" &&
                    questionnaire.values[name][i].geom.paths === activeGraphic.geometry.paths) {

            questionnaire.values[name][i].ival = values;
            break;
        } else if (questionnaire.values[name][i].geom.type === "polygon" &&
                    questionnaire.values[name][i].geom.rings === activeGraphic.geometry.rings) {

            questionnaire.values[name][i].ival = values;
            break;
        }
    }
}


//handles the bar on top of the page which shows the flow of the questionnaire
var curSection = "";

function section(pageNumber, pagesarray) {
    console.log("section");

    //find the section for the page number given
    var cur = pagesarray[pageNumber];

    if (questionnaire.newNavigation === true) {
        advanceBadge(pageNumber);
    }
    if (cur === undefined || cur.section === undefined || cur.section === curSection) {
        return;
    }

    curSection = cur.section;

    if (questionnaire.newNavigation === true) {
        enableSection(curSection, pageNumber, pagesarray);
        activateSection(curSection);
        return;
    }
    //var sections = dojo.query("td.section", "progressBar");

    var i;
    for (i = 0; i < questionnaire.sections.length; i++) {
        if(questionnaire.sections[i].section === curSection) {
            var prev = i - 1;
            var next = i + 1;
            var curp = i;
            var testLink;
            var tempPageNum = 0;
//			var tempSection;
            //Activate links for all previous and current sections
            var b;
            for(b = 0; b <= curp; b++) {
                if(questionnaire.sections[b] !== undefined) {
                //	console.log(" Section: " + b);
                    while(tempPageNum < (pagesarray.length-1) && pagesarray[tempPageNum].section !== questionnaire.sections[b].section) {
                        tempPageNum++;
                        //console.log("tempPageNum: " + tempPageNum + " pagesarray length " + pagesarray.length);
                    }
                    testLink = dojo.query("." + questionnaire.sections[b].section, "progressBar")[0];
                    if(testLink.onclicks === undefined || testLink.onclicks === null) {
                        testLink.onclicks = "";
                        testLink.style.cursor = "pointer";
                        dojo.connect(testLink, "onclick", this, dojo.hitch(null, "createPage", pagesarray[tempPageNum].name, "pages"));
                    }
                }

            }

            //all before previous section in navigation bar
            var j;
            for(j = 0; j < prev; j++) {
                if(questionnaire.sections[j] !== undefined) {
                    dojo.query("." + questionnaire.sections[j].section, "progressBar")[0].className = "section " + questionnaire.sections[j].section + " barVisited1 ";
                } else {
                    break;
                }
            }

            //the previous section
            if(questionnaire.sections[prev] !== undefined) {
                dojo.query("." + questionnaire.sections[prev].section, "progressBar")[0].className = "section " + questionnaire.sections[prev].section + " barVisited";
            }

            //the activated current section
            if(questionnaire.sections[curp] !== undefined) {

                dojo.query("." + questionnaire.sections[curp].section, "progressBar")[0].className = "section " + questionnaire.sections[curp].section + " barActive";

                //activate the link for the section in progressbar
//				var testtemp = dojo.query("." + questionnaire.sections[curp].section, "progressBar").pop();
//				if(testtemp.onclick === undefined || testtemp.onclick === null) {
//					testtemp.onclick = function(evt) {
//						createPage(questionnaire.pages[pageNumber].name);
//					};
//					testtemp.onclick = "";
//					dojo.connect(testtemp, "onclick", this, dojo.hitch(null, "createPage", questionnaire.pages[pageNumber].name));
//				}
            }
            var k;
            for(k = next; k < questionnaire.sections.length; k++) {
                if(questionnaire.sections[k] !== undefined) {
                    dojo.query("." + questionnaire.sections[k].section, "progressBar")[0].className = "section " + questionnaire.sections[k].section + " barUnvisited ";
                } else {
                    break;
                }
            }
            return;
        }
    }
}

/*
Get the content from file fileName and put it into node(DOM element)
*/

function getContent(urlContent, node) {
    console.log("getContent");
    console.log("getContent depracated use xhrGet instead");
     dojo.xhrGet( {
        // The following URL must match that used to test the server.
        "url": urlContent,
        "handleAs": "text",
        "sync": true,
        "timeout": 60000, // Time in milliseconds

        // The LOAD function will be called on a successful response.
        "load": function(response, ioArgs) {
            node.innerHTML = response;
            return response;
        },

        // The ERROR function will be called in an error case.
        "error": function(response, ioArgs) {
            console.error("HTTP status code: ", ioArgs.xhr.status);
            return response;
            }
        });
}

// Siirtää uuden alueen aluiden päällimmäiseksi
function movePolygonToTop(n) {
    console.log("movePolygonToTop");

    var p = n.rawNode.parentNode;
    var inserted = false;
    var i;
        for (i = 0; i <p.childNodes.length; i++) {
        if(p.childNodes[i] && p.childNodes[i].attributes[0].nodeValue === "none" && !inserted) {
            n.rawNode.parentNode.insertBefore(n.rawNode,n.rawNode.parentNode.childNodes[i]);
            inserted = true;
            break;
        }
        //For IE which uses vml graphics
        else if(p.childNodes[i] && p.childNodes[i].nodeName === "rect" && !inserted){
            n.rawNode.parentNode.insertBefore(n.rawNode,n.rawNode.parentNode.childNodes[i]);
            inserted = true;
            break;
        }
    }
}

/*
 This function creates widgets according to the
 HTML 5 inside the node.

 new function which should replace the old createWidgets
*/
function create_widgets(node_id) {
    console.log("new create_widgets function called");

    var form_elements = dojo.query("form:not(form[class=no_submit])", node_id);
    var imagebutton_elements = dojo.query("button[type=button].imagebutton", node_id);
    var dojobutton_elements = dojo.query("button[type=button].dojobutton", node_id);
    var no_submitform_elements = dojo.query("form[class=no_submit]", node_id);
    var range_elements = dojo.query("input[type=range]", node_id);
/*    var radio_elements = dojo.query("input[type=radio]", node_id);
    var checkbox_elements = dojo.query("input[type=checkbox]", node_id);
    var text_elements = dojo.query("input[type=text]", node_id);
    var textarea_elements = dojo.query("textarea", node_id);
    var number_elements = dojo.query("input[type=number]", node_id);
    var select_elements = dojo.query("select", node_id);
    var email_elements = dojo.query("input[type=email]", node_id);*/
    var i;
    var json_def;
    var constraints;

    console.log("create the following forms");
    //console.log(form_elements);

    //create the form or forms
    for(i = 0; i < form_elements.length; i++) {

        json_def = {};
        var form_element = form_elements[i];

        console.log("create form");
        //console.log(form_element);

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

    //create the no_submit form or forms
    for(i = 0; i < no_submitform_elements.length; i++) {

        json_def = {};
        var no_submitform_element = no_submitform_elements[i];

        console.log("create no_submitform");

        if(no_submitform_element.id !== undefined) {
            json_def.id = no_submitform_element.id;
        }

        if(no_submitform_element.name !== undefined) {
            json_def.name = no_submitform_element.name;
        }

        json_def["class"] = "no_submit";
        var ef = new dijit.form.Form(json_def,
                                   no_submitform_element);
    }

    /* Create jquery drawButtons
     */
    //draw buttons to activate drawing functionality
   $("#" + node_id).find("button[type='button'].drawbutton.point").each(function() {
       var options = {drawcontrol: "pointcontrol"};
       if(questionnaire.feature_defaults[$(this).attr('id')] !== undefined) {
            if(questionnaire.feature_defaults[$(this).attr('id')].classes !== undefined) {
                options.classes = questionnaire.feature_defaults[$(this).attr('id')].classes;
            }
            if(questionnaire.feature_defaults[$(this).attr('id')].icons !== undefined) {
                options.icons = questionnaire.feature_defaults[$(this).attr('id')].icons;
            }
        }
        $(this).drawButton(options);

   });
   $("#" + node_id).find("button[type='button'].drawbutton.route").each(function() {
       var options = {drawcontrol: "routecontrol"};
       if(questionnaire.feature_defaults[$(this).attr('id')] !== undefined) {
            if(questionnaire.feature_defaults[$(this).attr('id')].classes !== undefined) {
                options.classes = questionnaire.feature_defaults[$(this).attr('id')].classes;
            }
            if(questionnaire.feature_defaults[$(this).attr('id')].icons !== undefined) {
                options.icons = questionnaire.feature_defaults[$(this).attr('id')].icons;
            }
        }
        $(this).drawButton(options);

   });
   $("#" + node_id).find("button[type='button'].drawbutton.area").each(function() {
       var options = {drawcontrol: "areacontrol"};
       if(questionnaire.feature_defaults[$(this).attr('id')] !== undefined) {
            if(questionnaire.feature_defaults[$(this).attr('id')].classes !== undefined) {
                options.classes = questionnaire.feature_defaults[$(this).attr('id')].classes;
            }
            if(questionnaire.feature_defaults[$(this).attr('id')].icons !== undefined) {
                options.icons = questionnaire.feature_defaults[$(this).attr('id')].icons;
            }
        }
        $(this).drawButton(options);

   });



//    $("#" + node_id).find("button[type='button'].drawbutton.point").drawButton({
//        control: "pointcontrol"
//        });
    // $("#" + node_id).find("button[type='button'].drawbutton.route").drawButton({
        // control: "routecontrol"
        // });
    // $("#" + node_id).find("button[type='button'].drawbutton.area").drawButton({
        // control: "areacontrol"
        // });
    /*
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
//        var fs = new dijit.form.Select(json_def,
//                                                select_element);
    }
*/
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

    //create imagebuttons
    for(i = 0; i < imagebutton_elements.length; i++) {
        json_def = {};
        var imagebutton_element = imagebutton_elements[i];

        dojo.mixin(json_def, questionnaire.default_widgets.imagebutton);

        // if special definition exists
        // graphicAttr and graphicStrings are objects themselves, have to mixin them separatedly
        if(questionnaire.imageButton[imagebutton_element.id] !== undefined) {
            var graphicAttr_def = {};
            dojo.mixin(graphicAttr_def, json_def.graphicAttr);
            dojo.mixin(graphicAttr_def,
                   questionnaire.imageButton[imagebutton_element.id].graphicAttr);
            var graphicStrings_def = {};
            dojo.mixin(graphicStrings_def, json_def.graphicStrings);
            dojo.mixin(graphicStrings_def,
                   questionnaire.imageButton[imagebutton_element.id].graphicStrings);
            dojo.mixin(json_def,
                   questionnaire.imageButton[imagebutton_element.id]);
            json_def.graphicAttr = graphicAttr_def;
            json_def.graphicStrings = graphicStrings_def;
        }

        //html 5 values
        if(imagebutton_element.name !== undefined) {
            json_def.name = imagebutton_element.name;
        }
        if(imagebutton_element.id !== undefined) {
            json_def.graphicAttr.id = imagebutton_element.id;
        }
        console.log("imagebutton json");
        if(djConfig.isDebug) {
            console.log(json_def);
        }
        var ib = new ImageButton(json_def, imagebutton_element);
        if(questionnaire.values[json_def.graphicAttr.valuename] !== undefined) {
            ib.set('value', questionnaire.values[json_def.graphicAttr.valuename]);
        }
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
        //json_def.showLabel = false;

        var button = new dijit.form.Button(json_def,
                                             dojobutton_element);
    }
    // Add extra events to non dojo input elements
    if(questionnaire.extra_input_connect !== undefined) {
        for (k = 0; k < questionnaire.extra_input_connect.length; k++) {
            var elem = dojo.byId(questionnaire.extra_input_connect[k].id);
            if(elem !== null) {
                dojo.connect(elem,
                    questionnaire.extra_input_connect[k].event,
                    questionnaire.extra_input_connect[k].func);
            }
        }
    }

    return f;
}

/*function that creates widgets from a formobjects json*/
function createWidgets(formObjects) {

    console.log("createWidgets");
    //value to return should be the form created
    var form;
        var i;
    for(i = 0; i < formObjects.length; i++) {
        var fo = formObjects[i];
        if(fo.type === undefined) {
            continue;
        }
                else if (fo.type.toLowerCase() === "form") {
            //default values
            if(fo.json === undefined) {
                fo.json = {};
            }
            if(fo.json.method === undefined) {
                fo.json.method = "POST";
            }
            if(fo.json.action === undefined) {
                fo.json.action = "";
            }
            if(fo.json.name === undefined) {
                fo.json.name = fo.node;
            }
            //remember the node to get input values not in widgets
            fo.json.formnode = fo.node;

            //create the widget
            form = new dijit.form.Form(fo.json, dojo.byId(fo.node));

        }
        else if (fo.type.toLowerCase() === "numbertextbox") {
            //default values
            if(fo.json.name === undefined) {
                fo.json.name = fo.node;
            }
            //create the widget
            var ntb = new dijit.form.NumberTextBox(fo.json, dojo.byId(fo.node));
            ntb.set('value','');
        }
        else if (fo.type.toLowerCase() === "radiobutton") {
            //default values
            if(fo.json.name === undefined) {
                fo.json.name = fo.node;
            }
            if(fo.json.value === undefined) {
                fo.json.value = fo.node;
            }
            //create the widget
            var rb = new dijit.form.RadioButton(fo.json, dojo.byId(fo.node));
        }
        else if (fo.type.toLowerCase() === "checkbox") {
            //default values
            if(fo.json.value === undefined) {
                fo.json.value = fo.node;
            }

            //create the widget
            var cb = new dijit.form.CheckBox(fo.json, dojo.byId(fo.node));
        }
        else if (fo.type.toLowerCase() === "filteringselect") {

            //default values
            if(fo.json.name === undefined) {
                fo.json.name = fo.node;
            }
            if(fo.json.value === undefined) {
                fo.json.value = fo.node;
            }
            //create the widget
            var fs = new dijit.form.FilteringSelect(fo.json, dojo.byId(fo.node));
        }
        else if (fo.type.toLowerCase() === "textarea") {
            // dojo textbox and area moves around in IE
            if(dojo.isIE) {
                continue;
            }
            //default values
            if(fo.json.name === undefined) {
                fo.json.name = fo.node;
            }
            //create the widget
            var ta = new dijit.form.SimpleTextarea(fo.json, dojo.byId(fo.node));
        }
        else if (fo.type.toLowerCase() === "textbox") {

            if(fo.json.name === undefined) {
                fo.json.name = fo.node;
            }
            //create the widget
            var tb = new dijit.form.TextBox(fo.json, dojo.byId(fo.node));
        }
        else if (fo.type.toLowerCase() === "horizontalslider") {
            //default values
            var horjson = {
                "name": "default",
                "minimum": 0,
                "maximum": 100,
                "discreteValues": 101,
                "intermediateChanges": true,
                "style": "width: 100%;",
                "value": 50.123
            };

            fo.json = dojo.mixin(horjson, fo.json);

            if(fo.json.name === "default") {
                fo.json.name = fo.node;
            }

            //create the widget
            var hs = new myHorizontalSlider(fo.json, dojo.byId(fo.node));
                        //create rule and labels for the slider
                        hs.startup();
                        var ruleContainer = fo.node + "Rule";
                        if (dojo.byId(ruleContainer) !== null && dojo.byId(ruleContainer) !== undefined) {
                                //IE FIX (For some reason form isn't destroyed) Remove if fixed in newer dojo
                                if (dojo.isIE) {
                                        if (dijit.registry.byId(ruleContainer) !== undefined) {
                                                dijit.registry.remove(ruleContainer);
                                        }
                                }
                                var bigSliderRules = new dijit.form.HorizontalRule({
                                        "count": 5,
                                        "style": "/*margin-left: 0px;margin-right: 0px;*/"
                                }, dojo.byId(ruleContainer));
                                bigSliderRules.startup();
                        }
                        var ruleLabelsContainer = fo.node + "RuleLabels";
                        if (dojo.byId(ruleLabelsContainer) !== null && dojo.byId(ruleLabelsContainer) !== undefined) {
                                //IE FIX (For some reason form isn't destroyed) Remove if fixed in newer dojo
                                if (dojo.isIE) {
                                        if (dijit.registry.byId(ruleLabelsContainer) !== undefined) {
                                                dijit.registry.remove(ruleLabelsContainer);
                                        }
                                }
                                var bigSliderRuleLabels = new dijit.form.HorizontalRuleLabels({
                                        "count": 5,
                                        "style": "font-size:smaller; left:1%;margin-left: 0px;margin-right: 0px;",
                                        "labels": ['<0,5 km','0,5 - 2 km', '2 -5 km', '5 - 10 km', '>10 km']
                                }, dojo.byId(ruleLabelsContainer));
                                bigSliderRuleLabels.startup();
                        }
            hs.set('value',50.123);
        }
        else if(fo.type.toLowerCase() === "validationtextbox") {
            var defvtb = {
                "name":"default",
                "type":"text",
                "trim":true,
                "required": true,
                "regExpGen": dojox.validate.regexp.emailAddress
            };
            fo.json = dojo.mixin(defvtb,fo.json);

            if(fo.json.name === "default") {
                fo.json.name = fo.node;
            }

            var vtb = new dijit.form.ValidationTextBox(fo.json, dojo.byId(fo.node));
        }
    else if (fo.type.toLowerCase() === "imagebutton") {
        console.log("create imagebutton");
        //this part can also be found when creating the tempbutton
        //default values
        //default json
                console.log(fo.json);
                console.log(questionnaire.imageButton.defaultbutton);
        var defjson = clone(questionnaire.imageButton.defaultbutton);
                console.log(defjson);
        //the buttontext
        var defbuttontext = defjson.buttontext;

        if(fo.json.buttontext !== undefined) {
            defbuttontext = fo.json.buttontext;
        }

        fo.json.buttontext = defbuttontext;

        //the graphic attributes
        var defgraphicattr = defjson.graphicAttr;

        if(fo.json.graphicAttr !== undefined) {
            defgraphicattr = dojo.mixin(defgraphicattr,fo.json.graphicAttr);
        }
        if(defgraphicattr.valuename === "default") {
            defgraphicattr.valuename = fo.node;
        }
        if(defgraphicattr.id === "default") {
            defgraphicattr.id = fo.node;
        }
        fo.json.graphicAttr = defgraphicattr;
        //the graphic strings
        var defgraphicstrings =  defjson.graphicStrings;

        if((fo.json.graphicStrings !== null) &&
           (fo.json.graphicStrings !== undefined)) {
            defgraphicstrings = dojo.mixin(defgraphicstrings, fo.json.graphicStrings);
        }
        fo.json.graphicStrings = defgraphicstrings;

        console.log(defjson);
                console.log(defbuttontext);

        //combine them all together
        fo.json = dojo.mixin(defjson,fo.json);

        //tempbutton code end

        //set the pool
        if(fo.json.pool === undefined) {
            fo.json.pool = pool;
        }

        //create the widget
        var ib = new ImageButton(fo.json, dojo.byId(fo.node));

        if(questionnaire.values[fo.json.graphicAttr.valuename] !== undefined) {
            ib.set('value', questionnaire.values[fo.json.graphicAttr.valuename]);
        }
    }
    }

    return form;
}


function setValues(form, values) {
    console.log("setValues");
    if(form === undefined) {
        return;
    }
    form.set('value',values);
    var e, k, vn;
    //FIX for input elements inside dojo form
    //var elem = dojo.byId(form.formnode).elements;

    // for new version
    /*var elem = dojo.byId(form.id).elements;

    for (e = 0; e < elem.length; e++) {
    if (elem[e].type === "radio") {
        continue;
    } else if (elem[e].type === "checkbox") {
        continue;
    } else {
        vn = elem[e].name;
        if (values[vn] !== undefined){
            elem[e].value = values[vn];
        }
    }
}
*/
    // for new version with normal input elements
    var elem = dojo.byId(form.id).elements;

    for (e = 0; e < elem.length; e++) {
        if (elem[e].type === "radio") {
            if(values[elem[e].name] !== undefined) {
                if(values[elem[e].name] === elem[e].value) {
                    elem[e].checked = true;
                    fireonchange(elem[e]);
                }
            }
            //continue;
        }
        else if (elem[e].type === "checkbox") {
            if(values[elem[e].name] !== undefined) {
                if (values[elem[e].name] instanceof Array) {
                    for(k = 0; k < values[elem[e].name].length; k++) {
                        if(values[elem[e].name][k] ===  elem[e].value) {
                            elem[e].checked = true;
                            fireonchange(elem[e]);
                        }
                    }
                }
                // if only one value
                else if(values[elem[e].name] === elem[e].value) {
                    elem[e].checked = true;
                    fireonchange(elem[e]);
                }
            }
//            continue;
        }
        else {
            vn = elem[e].name;
            if (values[vn] !== undefined) {
                elem[e].value = values[vn];
                fireonchange(elem[e]);
            }
        }
    }

}
/*
This function creates all the widgets for the page and sets the right values to them

page is the json describing the page
domnode is the node where the content of the page has been set
pagearray is the array where the next and previous page can be parsed from
*/
function parse(page, domnode, pagearray) {
    if(djConfig.isDebug) {
        console.log("parse function called");
    }

    //new function that should be called to create widgets
    //create_widgets(domnode.id);
    //END new function
    form = create_widgets(domnode.id);

    var pages, i, newpagearray;

    //create the widgets
    if(page.formObjects !== undefined) {
    //form = createWidgets(page.formObjects);
    if(form !== undefined) {
            //NO submit for enter onclick
            dojo.connect(form,
                         "onSubmit",
                         function(event) {
                            dojo.stopEvent(event);
                //Do nothing
                    });
           }
    }


    //set the previous values to the form
    if(form !== undefined && questionnaire.values[form.name] !== undefined) {
        setValues(form, questionnaire.values[form.name]);
    }

    //define the pagearray
    if (pagearray === undefined) {
        pages = questionnaire.pages;
    } else {
        pages = questionnaire[pagearray];
    }

    //make the flow of the questionnaire work. On the page there should be a node with previous and next buttons to move with,
    var pamount = pages.length;

    console.log("parse, ennen next");
    //next and previous classes should only be searched from bigContent and smallContent. Not add optional buttons.
    var nextbuttons = dojo.query(".next:not(.optional)", "bigContent");
    nextbuttons = nextbuttons.concat(dojo.query(".next:not(.optional)", "smallContent"));
    var previousbuttons = dojo.query(".previous","bigContent");
    previousbuttons = previousbuttons.concat(dojo.query(".previous", "smallContent"));
    var optbuttons = dojo.query(".optional", "bigContent");
    optbuttons = optbuttons.concat(dojo.query(".optional", "smallContent"));
    // Extrabuttons for the page
    var extrabuttons = dojo.query(".extrabutton", "bigContent");
    extrabuttons = extrabuttons.concat(dojo.query(".extrabutton", "smallContent"));

    if (previousbuttons.length > 0) {

    if((nr - 1) === 0) {
            newpagearray = undefined;
    } else {
            newpagearray = pagearray;
    }
    for(i = 0; i < previousbuttons.length; i++) {
            dojo.connect(previousbuttons[i], "onclick", submitForm);
            //connect the previous value in page json
            if(page.previous !== undefined) {
                dojo.connect(previousbuttons[i], "onclick", page.previous);
            }

            dojo.connect(previousbuttons[i],
                "onclick",
                dojo.hitch(null, "createPage", pages[nr - 1].name, newpagearray));
            }
    }
    if (nextbuttons.length > 0) {
        //console.log("connect listeners to next");
        if(((nr + 1) % pamount) === 0) {
            newpagearray = undefined;
        } else {
            newpagearray = pagearray;
        }

        for(i = 0; i < nextbuttons.length; i++) {
            if(page.preventDefault === undefined || page.preventDefault.next === false) {
                dojo.connect(nextbuttons[i], "onclick", submitForm);
            }
            //connect the next value in page json
            if(page.next !== undefined) {
                dojo.connect(nextbuttons[i], "onclick",  page.next);
            }
            if(page.preventDefault === undefined || page.preventDefault.next === false) {
                dojo.connect(nextbuttons[i],
                             "onclick",
                             dojo.hitch(null, "createPage", pages[(nr + 1) % pamount].name, newpagearray));
            }
        }
    }

    // some code changes, not needed any more, same as nextbutton
    // TODO: REMOVE
    if (optbuttons.length > 0) {
    //console.log("connect listeners to next");
    if(((nr + 1) % pamount) === 0) {
            newpagearray = undefined;
    } else {
            newpagearray = pagearray;
        }
    for(i = 0; i < optbuttons.length; i++) {
            dojo.connect(optbuttons[i], "onclick", submitForm);
            //connect the next value in page json
            if(page.next !== undefined) {
                dojo.connect(optbuttons[i], "onclick", page.next);
            }

            dojo.connect(optbuttons[i],
                "onclick",
                dojo.hitch(null, "createPage", pages[(nr + 1) % pamount].name, newpagearray));
            }
    }

    if (extrabuttons.length > 0) {
        //console.log("connect listeners to next");
        for(i = 0; i < extrabuttons.length; i++) {
            dojo.connect(extrabuttons[i], "onclick", submitForm);
            //connect the extrabutton value in page json
            if(page.extraButtons !== undefined) {
                dojo.connect(extrabuttons[i], "onclick", page.extraButtons);
            }
        }
    }
    // Add hover effect for next button in questionnaire with new style navigation
    if(questionnaire.newNavigation === true) {
        nextButtonHover();
    }
    if(typeof(page.onLoad) === typeof(function(){})) {
        console.log("page.onLoad");
        page.onLoad();
    }

}

//TOOLTIP  FOR GRAPHICS AND OTHER USE
var hidetooltiptimeout;
var tooltipFollowEvent = true;
var lpos, tpos;

function showToolTip(text, tpos, lpos, follow) {
    console.log("showtooltip ");

    var toolDiv = dojo.byId("tooltip");
    toolDiv.style.width = "auto";
    toolDiv.style.height = "auto";
    toolDiv.style.borderWidth = "2px";
    toolDiv.innerHTML = " " + text;
    toolDiv.style.paddingLeft = "2px";
    toolDiv.style.paddingRight = "2px";
    if (!follow) {
        toolDiv.style.top = (tpos - 15) + "px";
        toolDiv.style.left = (lpos + 10) + "px";
    }
    tooltipFollowEvent = follow;

}

function changeToolTipText(newtext) {
    dojo.byId("tooltip").innerHTML = " " + newtext;
}

function hideToolTip() {
    console.log("hidetooltip");
    var toolDiv = dojo.byId("tooltip");
    toolDiv.style.width = "0px";
    toolDiv.style.height = "0px";
    toolDiv.style.borderWidth = "0px";
    toolDiv.style.paddingLeft = "0px";
    toolDiv.style.paddingRight = "0px";
    toolDiv.innerHTML = "";
}

//Tooltip for drawing

/*
if parameter true given the tooltip will follow the mouse otherwise it will stay at one place
 */
//FIX THIS DOJO CONNECT DID NOT WORK WITH THE BODY ELEMENT AND DOING IT WITH DOM FUNCTIONS DESTROYED THE POLYGON DRAWING
//dojo connect and disconnect combination would be bee
function tooltipFollow(event) {
    if(tooltipFollowEvent) {
        lpos = event.clientX + 10;
        tpos = event.clientY - 10;
        dojo.byId("tooltip").style.left = lpos + "px";
        dojo.byId("tooltip").style.top = tpos + "px";
    }
}

//Tooltip for graphic exploring
var to;
function startToolTip(event) {
    console.log("startToolTip");
    var tooltiptext = event.graphic.attributes.header;
    tpos = event.clientY;
    lpos = event.clientX;
    to = setTimeout(function() {showToolTip(tooltiptext,tpos,lpos);}, 1000);
    try {
        clearTimeout(hidetooltiptimeout);
    } catch(ter) {
    }
    hidetooltiptimeout = setTimeout(function() {hideToolTip();}, 10000);
}

function stopToolTip(event) {
    console.log("stoptooltip");
    clearTimeout(to);
    clearTimeout(hidetooltiptimeout);
    hideToolTip();
}

var toolover;
var toolout;

function enableToolTip() {
console.log("enabletooltip");
toolover = dojo.connect(map.graphics, "onMouseOver", startToolTip);
toolout = dojo.connect(map.graphics, "onMouseOut", stopToolTip);
}

function disableToolTip() {
console.log("disabletooltip");
dojo.disconnect(toolover);
dojo.disconnect(toolout);
}

//END TOOLTIP

/*
this function creates a new page in the questionnaire
*/
var templatesLoaded = false;
function createPage(pageName, pagearray, e) {
    if(djConfig.isDebug) {
        console.log("createPage function called");
    }

    // if form not valid do nothing
    if(isValid === false) {return false;}

    //unselect the drawbuttons
    $(".drawbutton.ui-state-active")
        .drawButton( 'deactivate' );

    //deactivate all imagebuttons
    //if(pool !== undefined) {
    //    pool.deactivateAll();
    //}

    //destroy the form if created
    if(form) {
        form.destroyRecursive(true);
        form = undefined;
    }

    //deactivate drawing
//    if (tb) {
//        tbactivated = false;
//        tb.deactivate();
//    }

    //empty all the pages
    dojo.byId("bigContent").innerHTML = "";
    dojo.byId("smallContent").innerHTML = "";


    //define from where the page should be created DEFAULT questionnaire.pages
    var pages;
    if(pagearray !== undefined) {
        pages = questionnaire[pagearray];
    } else { //default array for pages
        pages = questionnaire.pages;
    }

    //get all the information from the page json
    nr = getPageNumber(pageName, pages);

        //Check if page is marked for remove, No need to adjust nr
        if(pageName === "REMOVE") {
            questionnaire.pages.splice(nr, 1);
        }

    var page = pages[nr];

        //Check if page is marked for remove, No need to adjust nr
        if(page.remove === true) {
            questionnaire.pages.splice(nr, 1);
            page = pages[nr];
        }

        // Check if dynamically added new page between this and previous page. Have to check here, because next and previous links allready made, before new page is inserted
        if (page.addedpage !== undefined) {
            var apage;
            var apageName;

            apage = questionnaire[page.addedpage][0];
            apageName = apage.name;

            // As page is added to the questionnaire.pages, remove it from page.addedpage
            page.addedpage = undefined;


            // Create added page instead of this.
            if(apage !== undefined) {
        page = apage;
        pageName = apageName;
        nr = getPageNumber(pageName, pages);
            }
        }


    //check if all the pages to be visited before this page has been visited has been visited
    if(page.prepages !== undefined && page.prepages.length !== 0) {
        var tpage;
        var tpages;
        var tpageName;
        var arrname;

    //this only checks the first page in the array
    do {
        arrname = page.prepages.shift();
        tpages = questionnaire[arrname]; //gives an array of pages
        if(tpages === undefined) {
            break;
        }
        tpageName = tpages[1].name;
        tpage = tpages[1]; //the page to be created
    } while(tpage.visited);

    //change the values to create the correct page
    if(tpage !== undefined && tpages !== undefined) {
            pages = tpages;
            pageName = tpageName;
            nr = 1;
            page = tpage;
            pagearray = arrname;
            }
    }

    //handle the divisions and their visibility according to page type
    var big = dojo.byId("bigContent");
    var small = dojo.byId("smallContent");
    var mapSymbols = dojo.byId("mapSymbols");
    var layerToggle = dojo.byId("layerToggle");
    var navigation = dojo.byId("navigation");
    var langdiv = dojo.byId("language");
    var quitdiv = dojo.byId("save");
    var helpdiv = dojo.byId("help");
    var noMap = dojo.byId("noMap");
    //container to be parsed later on
    var cont;

    // Sometimes langdiv and/or quitdiv and/or helpdiv might be undefined
    if(langdiv === undefined || langdiv === null) {
        langdiv = dojo.byId("dummy");
    }
    if(quitdiv === undefined || quitdiv === null) {
        quitdiv = dojo.byId("dummy");
    }
    if(helpdiv === undefined || helpdiv === null) {
        helpdiv = dojo.byId("dummy");
    }
    //TOOLTIP TEST
    disableToolTip();
    //TOOLTIP END

    if(page.type === "small") {
        big.style.visibility = "hidden";
        big.innerHTML = "";
        small.style.visibility = "visible";
        mapSymbols.style.visibility = "visible";
        navigation.style.visibility = layerToggle.style.visibility = "visible";
        langdiv.style.visibility = "hidden";
        quitdiv.style.visibility = "visible";
        helpdiv.style.visibility = "visible";
        noMap.style.visibility = "hidden";
        //map.enableMapNavigation();
        //map.showPanArrows();
        overviewMapShow();
        setCursor("map_layers", "url('" + questionnaire.openhand_cursor_url + "')");
        //content for the page
        cont = small;

        //TOOLTIP TEST
        enableToolTip();
        //TOOLTIP END

    } else if (page.type === "big") {
        big.style.visibility = "visible";
    big.style.overflow = "visible";
    big.style.width = "";
    // IE Needs these
    big.style.overflowX = "";
    big.style.overflowY = "";
        small.style.visibility = "hidden";
        small.innerHTML = "";
        mapSymbols.style.visibility = "hidden";
        navigation.style.visibility = layerToggle.style.visibility = "hidden";
        langdiv.style.visibility = "hidden";
        quitdiv.style.visibility = "visible";
        helpdiv.style.visibility = "visible";
        noMap.style.visibility = "visible";
        //map.disableMapNavigation();
        overviewMapHide();
        //content for the page
        cont = big;

        //TOOLTIP TEST
        disableToolTip();
        //TOOLTIP END
    } else if (page.type === "firstpage") {
        big.style.visibility = "visible";
        big.style.overflowX = "hidden";
        big.style.overflowY = "auto";
        big.style.width = "700px";
        small.style.visibility = "hidden";
        small.innerHTML = "";
        mapSymbols.style.visibility = "hidden";
        navigation.style.visibility = layerToggle.style.visibility = "hidden";
        langdiv.style.visibility = "visible";
        quitdiv.style.visibility = "hidden";
        helpdiv.style.visibility = "hidden";
        noMap.style.visibility = "visible";
//        map.disableMapNavigation();
        overviewMapHide();
        //content for the page
        cont = big;

        //TOOLTIP TEST
        disableToolTip();
        //TOOLTIP END

    }

    //set this page to the list of visited pages
    questionnaire.visited.push(pageName);

    //begin session

        if (!questionnaire.loaded && questionnaire.values.testUser !== true && nr > 0) { //do not do this if testuser
            questionnaire.loaded = true;
        }

        // Load extra infotemplates for surrounding questions. Cannot be loaded in init, because session is not started yet
        // Try to load only in helsinki application
        if (!templatesLoaded && nr > 1 && applicationName === "PEHMOGIS") {
            templatesLoaded = true;
            loadTemplates();
        }

//Check password
// If questionnaire does not have password noPassword === true
var noPassword = false;

dojo.xhrGet({
    //url to file whith xhtml content
    "url": page.content,
    "handleAs": "text",
    "sync": false,
    "timeout": 60000, // Time in milliseconds
    "preventCache": djConfig.isDebug,

    // The LOAD function will be called on a successful response.
    "load": function(response, ioArgs) {

        // Check password validity
        if (response === "NOTVALIDPASS" && noPassword === false) {
            alert(questionnaire.messages.not_valid_password);
            nr = 0;
            questionnaire.loaded = false;
            createPage("welcome");
        }
        else {
                    //set the default height settings
                    cont.style.height = "auto";
                    cont.innerHTML = response;
                    //parse page
                    parse(page, cont, pagearray);

                    //check the height for smallcontent and bigcontent according to client screen
                    setContentMaxHeight();

        }
            return response;

        },

    // The ERROR function will be called in an error case.
    "error": function(response, ioArgs) {
            console.error("HTTP status code: ", ioArgs.xhr.status);
            console.error(response);
            questionnaire.loaded = false;
            return response;
        }
    });

    //show the right section in the progressbar
    section(nr, pages);
    // Testing a hook ()
    createPageHook();
    return true;
}

/* This function does not work with django */
/* TODO: This function is obsolete, but I don't delete it yet */
function checkPassword (disable) {

        // Check if questionnaire has password
        var passwordForm = dojo.byId("passwordform");
        if(passwordForm === null || passwordForm === undefined) {
            var noPassword = true;
            return;
        }
    var pw;
    if (disable !== true) {
        //var passwordForm = dojo.byId("passwordform");
        var elem = passwordForm.elements;
                var i;
        for (i = 0; i < elem.length; i++) {
            if (elem[i].id === "password") {
                pw = elem[i].value;
            }
        }
    }
    if(questionnaire.values.testUser === true) {
        pw = "testUser";
    }

    if((pw !== null && pw !== undefined && pw !== '') || disable === true) {
        dojo.xhrPost({
            // The following URL must match that used to submit values.
            "url": "../asp/checkpw.asp",
            "content":  {"pw": pw, "disable": disable},
            "sync": false,
            "timeout": 5000, // Time in milliseconds
            "preventCache": true,

            // The LOAD function will be called on a successful response.
            "load": function(response, ioArgs){
                console.debug(response);
                if (response === "WRONG") {
                    alert("Virheellinen salasana");
                    return response;
                    //Delete all documents cookies
                    //deleteCookies();
                    //createSubwindow('aikakatkaisu');
                }
                else if(response === 'ALLREADY') {
                    alert("Olette jo vastanneet kyselyyn");
                    return response;
                }
                else if(response === 'VALID'/* || response === 'ALLREADY'*/) {
                    console.log("Valid password");
                    createPage(getPageName(1));
                }
                return response;
            },

            // The ERROR function will be called in an error case.
            "error": function(response, ioArgs){
                //console.error("HTTP status code: ", ioArgs.xhr.status);
                return response;
            }
        });

    }
    else {
        alert("Antakaa salasana");
    }
}

function destroyInfo(event) {
    console.log("destroyInfo");
    //enable all mapnavigatoin again  if tb is not activated
    if(!tbactivated) {
        map.enableMapNavigation();
    }
    if(djConfig.isDebug) {
        console.log(infoForm);
    }
    //destroy previous form and its input objects
    if(infoForm !== undefined) {
        // For some reason IE7 hangs in infinite loop (something to with stackcontainer)
        if(dojo.isIE === 7) {
            var st = dijit.byId("stack1");
            if(st !== undefined) {
                console.log("st");
                //st.destroyDescendants(true);
                st.destroy(true);
                var ch = st.getChildren();
                for (var i = 0; i < ch.length; i++) {
                    var chh = ch[i].getChildren();
                        for (var j = 0; j < chh.length; j++) {
                            chh[j].destroy(true);
                        }
                    ch[i].destroy(true);

                }
                st.destroy(true);
                infoForm.destroy(true);
            }
            else {
                infoForm.destroyRecursive(true);
            }
        }
        else {
            infoForm.destroyRecursive(true);
        }
        infoForm = undefined;
        if(widget !== undefined) {
            widget.confirmResult(false);
        } else if(tempButton !== undefined) {
            tempButton.confirmResult(false);
        }
        tempButton = undefined;
        widget = undefined;
    }

    //stop the event
    if(event !== undefined) {
            dojo.stopEvent(event);
    }
    console.log("endDestoyInfo");
}

function graphicInfo(event) {
    console.log("graphicInfo");
    lastClickEvent = event;
    activeGraphic = event.graphic;
    if(activeGraphic.id === undefined || activeGraphic.id === null) {
        console.log("PROBLEM: Existing graphic does not have an ID!");
    }
    //dojo.stopEvent(event);
}


function setActiveGraphic(g) {
    console.log("setActiveGraphic");
    activeGraphic = g;
}


var popup; //only one popup at the time

/*
This is a helper function that returns
a OpenLayers LonLat object according
to the geometry that is given to it.

This function should bring some consistency
on where to show a popup for each feature.
*/
function get_popup_lonlat(geometry) {
    var lonlat;
    if( geometry.id.contains( "Point" ) ) {
        lonlat = new OpenLayers.LonLat(
                        geometry.x,
                        geometry.y);
    } else if ( geometry.id.contains( "LineString" ) ) {
        lonlat = geometry
            .components[geometry.components.length - 1]
            .bounds.getCenterLonLat();
    } else if ( geometry.id.contains( "Polygon" ) ) {
        lonlat = geometry.bounds.getCenterLonLat();
    }
    return lonlat;
}

/*
popup save feature event handler
*/
function save_feature_handler(evt) {
    console.log("save handler");
    console.log(evt);
    console.log(evt.data[0]);
    //get the form data
    var popup_values = getValues(infoForm);

    //console.log($('form[name=popupform].active').serializeArray());
    //var popup_values = $('form[name=popupform].active').serializeArray();
    $('form[name=popupform]').removeClass('active');
    //var new_attributes = {};
    console.log(popup_values);
//    for(var val in popup_values) {
//        console.log(val);
//       new_attributes[popup_values[val]['name']] =
//            popup_values[val]['value'];
//    }
//    console.log(new_attributes);
    evt.data[0].attributes = OpenLayers.Util.extend(evt.data[0].attributes, popup_values);
    //save the geojson
    var gf = new OpenLayers.Format.GeoJSON();
    var geojson_feature_string = gf.write(evt.data[0]);
    console.log(geojson_feature_string);
    if(popup !== undefined && popup !== null) {
        map.removePopup(popup);
        popup = undefined;
    }
    // unselect the feature. There should be only one selectControl
    map.getControl("selectcontrol").unselect(evt.data[0]);

    //unselect the button
//    $(".drawbutton.ui-state-active")
//        .drawButton( 'deactivate' );
    // TODO The actual saving of the feature through the API
    // API expects the data to be geojson object not a string that is returned from GeoJSON.write
    if(!questionnaire.values.testUser) {
        var sto = new OpenLayers.Format.JSON();
        var geojson_feature = sto.read(geojson_feature_string);
        if(evt.data[0].fid === undefined || evt.data[0].fid === null) {
            gnt.geo.create_feature(geojson_feature, create_ol_feature_callback);
        }
        else {
            gnt.geo.update_feature(geojson_feature);
        }
    }
}

/*
popup remove feature event handler
*/
function remove_feature_handler(evt) {
    console.log("remove handler");
    console.log(evt);
    console.log(evt.data[0]);

    var eventLayer = evt.data[0].layer;
    evt.data[0].layer.removeFeatures([evt.data[0]]);
    if(popup !== undefined && popup !== null) {
        map.removePopup(popup);
        popup = undefined;
    }

    var gf = new OpenLayers.Format.GeoJSON();
//    console.log(gf);
    var geojson_feature_string = gf.write(evt.data[0]);
    //Check if feature is saved to the database,
    // only features saved have fid property set
    if(evt.data[0].fid !== null) {
        // API expects the data to be geojson object not a string that is returned from GeoJSON.write
        var sto = new OpenLayers.Format.JSON();
        var geojson_feature = sto.read(geojson_feature_string);
        gnt.geo.delete_feature(geojson_feature);
    }
    var activeButton = $("#" + evt.data[0].attributes.valuename);
    console.log("activeButton remove_feature: ");
    console.log(activeButton);

    if(activeButton.length > 0) {
        // Check if max number of features of this button is reached, if true disable button
        if(evt.data[0].attributes.max !== undefined &&
            eventLayer.getFeaturesByAttribute("valuename",
                evt.data[0].attributes.valuename)
                    .length < evt.data[0].attributes.max) {
                            //disable the button
                            activeButton.drawButton( 'enable' );

        }
    }
    //unselect the button
    $(".drawbutton.ui-state-active")
        .drawButton( 'deactivate' );
}

/*
This function makes the popup and shows it for the feature given.

Expects there to be a feature.popup created
that can be called.
*/
function show_popup_for_feature(feature) {

    if ( feature.popup !== undefined && feature.popup !== null) {

        //remove old popup if existing
        if(popup !== undefined) {
            map.removePopup(popup);
            popup = undefined;
        }

        //create popup and put it on the map
        popup = feature.popup;
        map.addPopup(popup);
        //destroy previous form and its input objects
        if(infoForm !== undefined && infoForm !== null) {
            // For some reason IE7 hangs in infinite loop (something to with stackcontainer)
            if(dojo.isIE === 7) {
                var st = dijit.byId("stack1");
                if(st !== undefined) {
                    console.log("st");
                    //st.destroyDescendants(true);
                    st.destroy(true);
                    var ch = st.getChildren();
                    for (var k = 0; k < ch.length; k++) {
                        var chh = ch[k].getChildren();
                            for (var j = 0; j < chh.length; j++) {
                                chh[j].destroy(true);
                            }
                        ch[k].destroy(true);

                    }
                    st.destroy(true);
                    infoForm.destroy(true);
                }
                else {
                    infoForm.destroyRecursive(true);
                }

            }
            else {
                infoForm.destroyRecursive(true);
            }
            infoForm = undefined;
        }

        infoForm = create_widgets(feature.id + '_contentDiv');

        // Set values for form
        console.log("geojson_feature: " + feature.attributes);
        setValues(infoForm, feature.attributes);
        //add a class to the form to recognize it as active
        $('div[id="' + feature.id + '"] form[name="popupform"]').addClass('active');

        // add values to the form the values are connected but the form element name
        // and the name value in the feature attributes
        console.log($('div[id="' + feature.id + '"] form[name="popupform"]'));


        //connect the event to the infowindow buttons
        $('div[id="' + feature.id + '"] .save_feature').click([feature],
                                                      save_feature_handler);
        $('div[id="' + feature.id + '"] .remove_feature').click([feature],
                                                        remove_feature_handler);
        return true;

    } else {

        return false;
    }
}

/*
This function handles the on feature select
where it shows the popup with the correct
values from the feature attributes.
*/
function on_feature_select_handler(evt) {
    console.log("on_feature_select_handler");
    console.log(evt);

    show_popup_for_feature(evt);
}

/*
This function handles the on feature unselect
where it closes the popup.
*/
function on_feature_unselect_handler(evt) {
    console.log("on_feature_unselect_handler");
    console.log(evt);

    //remove popup from map
    if(popup !== undefined && popup !== null) {
        map.removePopup(popup);
        popup = undefined;
    }
}


/*
confirm and save the feature
*/
function feature_added(evt) {
    console.log(evt);

    //get the right lonlat for the popup position
    var popupcontent;
    evt.lonlat = get_popup_lonlat(evt.geometry);

    //TODO Add default attributevalues for the feature
    // something similar as imagebutton.graphicattr
    //get the active button id = valuename
    var value_name = $('button.ui-state-active').attr('id');
    if (value_name !== undefined) {
        evt.attributes = OpenLayers.Util.extend(evt.attributes, questionnaire.feature_defaults[value_name]);
        evt.attributes.valuename = value_name;
    }
    //Update symbol
    evt.layer.redraw();

    //get the active button name = infowindow name
    var infowindow_name = $('button.ui-state-active').attr('name');
    var default_infocontent = " default info content ";

    //save name to feature.attributes, we need it when we fetch features from server
    evt.attributes.info_name = infowindow_name;

    //get the right content for the popup
    if( infowindow_name !== undefined ) {
        popupcontent = $('#' + infowindow_name).html();
    }
    if(popupcontent === null) {
        popupcontent = default_infocontent;
    }
    popupcontent = OpenLayers.String.format(popupcontent, evt.attributes);

    evt.popupClass = OpenLayers.Popup.FramedCloud;
    evt.data = {
        popupSize: null,
        popupContentHTML: popupcontent
    };
    //var parsed_content = create_widgets('popupContent');
    //create popup and put it on the map
    evt.popup = new OpenLayers.Popup.FramedCloud(
                    evt.id,
                    evt.lonlat,
                    evt.data.popupSize,
                    evt.data.popupContentHTML,
                    null,
                    false);
    console.log("created popup");
    console.log(evt.lonlat);
    console.log(evt.popup);

    var activeButton = $(".drawbutton.ui-state-active");

    // Check if max number of features of this button is reached, if true disable button
    if(evt.attributes.max !== undefined &&
        evt.layer.getFeaturesByAttribute("valuename",
            evt.attributes.valuename)
                .length >= evt.attributes.max) {
                        //disable the button
                        activeButton.drawButton( 'disable' );

    }


    //unselect the button
    activeButton.drawButton( 'deactivate' );
    show_popup_for_feature(evt);

}

/*
This function activates the draw function; is called from init()
*/

function initDraw(map) {
    console.log("OBSOLETE: initDraw. Doesn't do anything");
}



//events connected onLoad
var grcl;
var isd;
var ihd;
var iwh;
var htt;
var olmd;
var mr;
var startPan;
var stopPan;
var mouseDownPan;
var mouseUpPan;


function createListeners(){
    console.log("createListeners");

    // Get and set copyrigh text, Done here because map has to be loaded first
//    var copyText = tiledMapServiceLayer.copyright;
//    dojo.byId('maanmittausCopy').innerHTML = copyText;

    //do onLoad
    initDraw(map);

    //connect onLoad
    grcl = dojo.connect(map.graphics, "onClick", graphicInfo);
    ihd = dojo.connect(map.infoWindow, "onShow", function (evt) {setTimeout(function (evt) { createInfo(evt);}, 0); });
    htt = dojo.connect(map.infoWindow, "onShow", function (evt) {hideToolTip();});
    iwh = dojo.connect(map.infoWindow, "onHide", function(evt){
        if (smallHidden) {
            dojo.byId('smallContent').style.visibility = 'visible';
            smallHidden = false;
        }
    });

    // Override default infoWindow behaviour to enable to add graphic over an existing one.
    //dojo.connect(map.graphics, "onClick", infoWindowHandler);

    //	ihd = dojo.connect(map.infoWindow, "onShow", createInfo);
    //isd = dojo.connect(map.infoWindow, "onHide", destroyInfo);
    //olmd = dojo.connect(map,"onMouseOut", function(e) {map.onMouseUp(e);dojo.stopEvent(e);});

    var timer;
    mr = //connect to window's resize event
    dojo.connect(window, "onresize", function(){
        //clear any existing resize timer
        clearTimeout(timer);
        //create new resize timer with delay of 500 milliseconds
        timer = setTimeout(function(){
            map.resize();
        }, 500);
        // Adjust content height if window is resized
        setContentMaxHeight();
        if(dojo.isIE === 6) {
            if(dojo.byId("smallContent").style.visibility === "visible") {
                setContentMaxHeight(dojo.byId("smallContent"));
            }
            else if(dojo.byId("bigContent").style.visibility === "visible") {
                setContentMaxHeight(dojo.byId("bigContent"));
            }
            if(dojo.byId("subwindow").style.visibility === "visible") {
                setContentMaxHeight(dojo.byId("subwindow"));
            }
        }

    });

    // set pan cursor
    startPan = dojo.connect(map, "onPanStart", function(event){
        setCursor("map_layers","url('" + questionnaire.closedhand_cursor_url + "')", "openhand");
    });
    mouseDownPan = dojo.connect(map, "onMouseDown", function(event){
        setCursor("map_layers","url('" + questionnaire.closedhand_cursor_url + "')", "openhand");
    });

    //Set default cursor after pan
    stopPan = dojo.connect(map, "onPanEnd", function(event) {
        setCursor("map_layers","url('" + questionnaire.openhand_cursor_url + "')","closedhand");
     });
    mouseUpPan = dojo.connect(map, "onMouseUp", function(event) {
        setCursor("map_layers","url('" + questionnaire.openhand_cursor_url + "')","closedhand");
     });
}

function endQuestionary() {
    console.log("OBSOLETE: endQuestionary. Doesn't do anything");

    //dojo.cookie("pehmogis", null, {expires: -1});
    // dojo.disconnect(grcl);
    // dojo.disconnect(ihd);
    // dojo.disconnect(isd);
    // dojo.disconnect(olmd);
    // dojo.disconnect(mr);
    // dojo.disconnect(startPan);
    // dojo.disconnect(stopPan);
    // dojo.disconnect(mouseDownPan);
    // dojo.disconnect(mouseUpPan);
    // if (!dojo.isIE) {
        // disableMyPan(); //DISABLE FOR NOW
    // }
}


var imageServiceLayer;
var ovlayer;
var servicesLayer;
var mapRoad, mapSatellite;
var pointLayer,
    routeLayer,
    areaLayer;

//init creates the map
// TODO: Make basemap configurable (Google, Bing, etc.)
// basemap parameter can have values google or bing, default google
// mapType parameter can have values satellite or road, default road
function init(basemap, /* string*/ mapType /* string*/) {

    // Check map provider
    if (basemap !== 'google' && basemap !== 'bing') {
        basemap = 'google';
    }
    // Check map style
    if (mapType !== 'road' && mapType !== 'satellite') {
        mapType = 'road';
    }
    console.log("init");
    //give the user impression that the program is doing something
    document.body.style.cursor = "wait";

    // Check debug mode, if true add page jump menu to header section and logout button
    if(djConfig.isDebug === true) {
            var dMenu = dojo.create('div', {
                "class": "dMenu",
                "id": "debugMenu"
            }, 'header');
            var dSelect = dojo.create('select', null, dMenu);
            // for kuluttaja
            questionnaire.values.background = {};
            //questionnaire.values.background.resarea = 'soukka';
            dojo.forEach(questionnaire.pages, function(page) {
                dojo.create('option', {"onClick": "createPage('" + page.name + "');", "innerHTML": page.name}, dSelect);
            });
            var changeB = dojo.create('span', {"onClick": "gnt.auth.logout();", "innerHTML": "Logout"}, 'debugMenu');
//		var changeB = dojo.create('span', {"onClick": "dojo.query('.firstpagepic').toggleClass('firstpagepic2');", "innerHTML": "VAIHDA"}, 'header');
    }

    //set an initial cookie
    dojo.cookie("pehmogis", {
                            "extent": questionnaire.initial_extent,
                            "pagenumber": 0,
                            "pagearray": "pages"},
                            {"expires": -1});

    map = new OpenLayers.Map('map', {projection: new OpenLayers.Projection("EPSG:3857"),
                                     maxExtent: new OpenLayers.Bounds(-37532.28,
                                                                       8312664.808,
                                                                       6194837.250,
                                                                       10758649.712),
//                                     maxResolution: 4891,
                                     paddingForPopups: new OpenLayers.Bounds(330,70,15,15),
                                     controls: []});


    if(basemap === 'google') {
        mapRoad = new OpenLayers.Layer.Google("Main", {numZoomLevels: 20});
        mapSatellite = new OpenLayers.Layer.Google("Satellite", {type: google.maps.MapTypeId.HYBRID,
                                                                numZoomLevels: 22});
    }
    else if (basemap === 'bing') {
        mapRoad = new OpenLayers.Layer.Bing({name: "Main",
                                             type: "Road",
                                             key: "AjB69asvfCy_FaIvDNBzCFc2eJdF7m7_bA7-M-xpJKctrxjmYQjqYX5DRCH0sd3J",
                                             culture: "fi"});
        mapSatellite = new OpenLayers.Layer.Bing({name: "Satellite",
                                             type: "AerialWithLabels",
                                             key: "AjB69asvfCy_FaIvDNBzCFc2eJdF7m7_bA7-M-xpJKctrxjmYQjqYX5DRCH0sd3J",
                                             culture: "fi"});
    }

    pointLayer = new OpenLayers.Layer.Vector("Point Layer", {
                                styleMap: new OpenLayers.StyleMap(point_style)
                        });
    routeLayer = new OpenLayers.Layer.Vector("Route Layer", {
                                styleMap: new OpenLayers.StyleMap(route_style)
                        });
    areaLayer = new OpenLayers.Layer.Vector("Area Layer", {
                                styleMap: new OpenLayers.StyleMap(area_style)
                        });

    zoneLayer = new OpenLayers.Layer.Vector("Zone Layer", {
                                styleMap: new OpenLayers.StyleMap(zone_style)
                        });

    map.addControls([new OpenLayers.Control.OverviewMap({'div': dojo.byId("ovcont"),
                                                         'size': new OpenLayers.Size(190,190)}),
                                 new OpenLayers.Control.Attribution(),
                                 new OpenLayers.Control.Navigation({}),
                                 new OpenLayers.Control.PanZoomBar({id: 'navigation'})]);

    var aliasproj = new OpenLayers.Projection("EPSG:3857");
    mapRoad.projection = mapSatellite.projection = aliasproj;
    map.addLayers([mapRoad, mapSatellite, areaLayer, routeLayer, pointLayer, zoneLayer]);
    if(questionnaire.start_extent !== undefined) {
        map.setCenter(new OpenLayers.LonLat(questionnaire.start_extent.x,
                                            questionnaire.start_extent.y),
                                            questionnaire.start_extent.zoomLevel);

    }
    else { // This is Hyvinkää, better than nothing
        map.setCenter(new OpenLayers.LonLat(2766225.683368, 8540628.690266), 15);
    }
    var pointcontrol = new OpenLayers.Control.DrawFeature(pointLayer,
                                OpenLayers.Handler.Point,
                                {'id': 'pointcontrol',
                                'featureAdded': feature_added});
    var routecontrol = new OpenLayers.Control.DrawFeature(routeLayer,
                                OpenLayers.Handler.Path,
                                {'id': 'routecontrol',
                                'featureAdded': feature_added});
    var areacontrol = new OpenLayers.Control.DrawFeature(areaLayer,
                                OpenLayers.Handler.Polygon,
                                {'id': 'areacontrol',
                                'featureAdded': feature_added});

    map.addControls([pointcontrol, routecontrol, areacontrol ]);

    //select feature control
    var select_feature_control = new OpenLayers.Control.SelectFeature(
            [pointLayer, routeLayer, areaLayer],
            {
            onSelect: on_feature_select_handler,
            onUnselect: on_feature_unselect_handler,
            toggle: false,
            clickout: true,
            multiple: false,
            hover: false,
            id: "selectcontrol"
            });

    console.log("add control to layer");
    console.log(select_feature_control);
    map.addControl(select_feature_control);
    select_feature_control.activate();

    // Add zone borders
    if(questionnaire.zone_featurecollection !== undefined) {
        var geojson_format = new OpenLayers.Format.GeoJSON();
        zoneLayer.addFeatures(geojson_format.read(questionnaire.zone_featurecollection));
    }

    // Enable Pan onmouseOut
    if (!dojo.isIE) {
        enableMyPan(); //DISABLE FOR NOW
    }
    //load the questionnaire JSON object from file

    // Set max height for content buggy so removed for the moment
    // not buggy anymore
    setContentMaxHeight();
    dojo.connect(window, "onresize", "setContentMaxHeight");


    //Keep current page in cookie
    if (dojo.cookie("currentPage") !== undefined) {
        nr = dojo.cookie("currentPage");
    }
    else {
        nr = 0;
    }

    //load the current page from the following array
    var pagearray;
    if (dojo.cookie("currentArray") !== undefined && dojo.cookie("currentArray") !== "undefined") {
        pagearray = dojo.cookie("currentArray");
    }
    else {
    pagearray = "pages";
    }

    //pool for imagebuttons
    //pool = new ButtonPool();

    //set an event for zoom to count a new maxheight(TODO)

    initHook();
    createPage(getPageName(nr, pagearray), pagearray);

    //give the user impression that the program is doing something
    document.body.style.cursor = "default";
    //Defaults to road map
    if(mapType === 'satellite') {
        satellite(true);
    }
    // Ugly way to zoom to kouvola keha
    //map.zoomToExtent(zoneLayer.getFeaturesByAttribute("Name", "keha")[0].geometry.getBounds(), true);
    //mapRoad.redraw();


}

function satellite(bool) {
        console.log("satellite");
        if (bool) {
            //dojo.byId("karttaNakyma").src = "./img/kartta_nappi.png";
            //dojo.byId("ilmakuvaNakyma").src = "./img/ilmakuva_nappi_aktiivinen.png";
            dojo.byId("karttaNakyma").className = "karttanakyma";
            dojo.byId("ilmakuvaNakyma").className = "aktiivinenkartta";
            mapRoad.map.setBaseLayer(mapSatellite);
            //mapRoad.setVisibility(false);
            //mapSatellite.setVisibility(true);
        } else {
            //dojo.byId("karttaNakyma").src = "./img/kartta_nappi_aktiivinen.png";
            //dojo.byId("ilmakuvaNakyma").src = "./img/ilmakuva_nappi.png";
            dojo.byId("karttaNakyma").className = "aktiivinenkartta";
            dojo.byId("ilmakuvaNakyma").className = "karttanakyma";
            mapRoad.map.setBaseLayer(mapRoad);
//            mapRoad.setVisibility(true);
//            mapSatellite.setVisibility(false);
//            mapRoad.
        }
}

function center(place) {
    console.log("THIS IS NOT WORKING: center");
    //TODO convert this function to OpenLayers
    if (place === "koti") {
        if(questionnaire.values.koti === undefined || questionnaire.values.koti[0] === undefined) {
            alert(questionnaire.messages.not_located_home);
            return;
        } else {
        }
    }
    else if(place === "tyo") {
        if(questionnaire.values.tyo === undefined || questionnaire.values.tyo[0] === undefined) {
            alert(questionnaire.messages.not_located_work);
            return;
        } else {
        }
    }
    else if(place === "koulu") {
        if (questionnaire.values.koulu === undefined || questionnaire.values.koulu[0] === undefined) {
            alert(questionnaire.messages.not_located_school);
            return;
        }
        else {
        }
    }
}

/*
Change the position of a point polygon route of the name

This function activates the draw function for the specific point. plygon or polyline.
Should also make sure that the information is trasfered to the image button(if created later on)

TODO
*/

function changeGraphic(id) {
    console.log("changeGraphic");
    try {
        widget = dijit.byId(id);
        widget.disabledIB = false;
        widget.replaceGraphic = activeGraphic;
        widget.activate();
    } catch(ex) {
        if(tempButton !== undefined) {
            if(dijit.byId(tempButton.id) === undefined) {
                tempButton.destroy();
            } else {
                tempButton.redraw();
            }
            tempButton = undefined;
        }
        //default values for ImageButton
        //this part can also be found when creating the Imagebutton for the page
        var ijson = questionnaire.imageButton[id];
        //default json
        var defjson = clone(questionnaire.imageButton.defaultbutton);
        //the buttontext
        var defbuttontext = defjson.buttontext;

        if(ijson.buttontext !== undefined) {
            defbuttontext = dojo.mixin(defbuttontext, ijson.buttontext);
        }
        ijson.buttontext = defbuttontext;

        //the graphic attributes
        var defgraphicattr = defjson.graphicAttr;

        if(ijson.graphicAttr !== undefined) {
            defgraphicattr = dojo.mixin(defgraphicattr,ijson.graphicAttr);
        }
        ijson.graphicAttr = defgraphicattr;
        //the graphic strings
        var defgraphicstrings =  defjson.graphicStrings;

        if(ijson.graphicStrings !== undefined && ijson.graphicStrings !== null) {
            defgraphicstrings = dojo.mixin(defgraphicstrings, ijson.graphicStrings);
        }
        ijson.graphicStrings = defgraphicstrings;

        //combine them all together
        ijson = dojo.mixin(defjson,ijson);
        //default values code end

        tempButton = new ImageButton(ijson, null);
        //tempButton = new ImageButton(createImageButtonJson(activeGraphic), null);
        tempButton.disabledIB = false;
        tempButton.replaceGraphic = activeGraphic;
        tempButton.activate();
    }
}

function removeGraph(id) {
    console.log("removeGraph");
    try {
        widget = dijit.byId(id);
        widget._removeValueAttr(activeGraphic.geometry);
        widget.redraw();

    } catch(ex) {
        if(tempButton !== undefined) {
            if(dijit.byId(tempButton.id) === undefined) {
                tempButton.destroy();
            } else {
                tempButton.redraw();
            }
            tempButton = undefined;
        }
        console.log(questionnaire.imageButton[id]);
        console.log(id);
        tempButton = new ImageButton(questionnaire.imageButton[id], null);
        //tempButton = new ImageButton(createImageButtonJson(activeGraphic), null);
        tempButton._removeValueAttr(activeGraphic.geometry);
        tempButton.redraw();

        if(dijit.byId(tempButton.id) === undefined) {
            tempButton.destroy();
        }
        tempButton = undefined;
    }
}


function confirm(id, bool) {
    console.log("confirm");

    try {
        widget = dijit.byId(id);
        widget.confirmResult(bool);
    } catch(ex) {
        tempButton.confirmResult(bool);

        if(bool) {
            if(dijit.byId(tempButton.id) !== undefined) {
                tempButton.redraw();
            }
            tempButton.destroy();
            tempButton = undefined;
        } else {
            tempButton.deactivate();
            pool.deactivateAll();
            if(dijit.byId(tempButton.id) !== undefined) {
                tempButton.redraw();
            }
            tempButton.destroy();
            tempButton = undefined;
        }
    }
}

// Switch ImageButton state, depending value of disableImageButton checkbox
// What does this one do? I need a more clear explanation
function switchIbState(dValue) {
    console.log("switchIbState: " + dValue);
    var imagebuttons = dojo.query(".imagebutton", "smallContent");
    var found = false;
    var k;
    if (dValue === true) {
        imagebuttons.forEach(function(node){
            var ibNode = dijit.byNode(node);
            if (questionnaire.graphics[ibNode.graphicAttr.valuename] !== undefined) {
                activeGraphic = questionnaire.graphics[ibNode.graphicAttr.valuename][0];
                if (activeGraphic !== undefined) {
                    removeGraph(node.firstChild.id);
                }
            }
            ibNode.disable();
            ibNode.checkBoxDisabled = true;
        });
        console.log(nr);
        console.log(dojo.toJson(questionnaire.pages[nr].name));
        if (questionnaire.pages[nr].addpage !== undefined) {
            for (k = 0; k < questionnaire.pages.length; k++) {
                //console.log("nimi: " + questionnaire[questionnaire.pages[nr].addpage][0].name);
                //console.log("pagesnimi: " + questionnaire.pages[k].name);
                if (questionnaire.pages[k].name === questionnaire[questionnaire.pages[nr].addpage][0].name) {
                    found = true;
                }
            }
            if (found === false) {
                questionnaire.pages[nr + 1].addedpage = questionnaire.pages[nr].addpage;
                questionnaire.pages.splice(nr + 1, 0, questionnaire[questionnaire.pages[nr].addpage][0]);
                questionnaire.pages[nr + 1].remove = false;
            }
            console.log("found: " + found);

        }
    }
    else if(dValue === false){
        imagebuttons.forEach(function(node){
            var IB = dijit.byNode(node);
            if (IB.checkBoxDisabled === true) {
                IB.enable();
                IB.checkBoxDisabled = false;
            }
            //questionnaire.pages.splice(nr+1, 1);
            //questionnaire.pages[nr+1].addedpage = undefined;
        });
        for (k = 0; k < questionnaire.pages.length; k++) {
            //console.log("nimi: " + questionnaire[questionnaire.pages[nr].addpage][0].name);
            //console.log("pagesnimi: " +questionnaire.pages[k].name);
            if (questionnaire.pages[k].name === questionnaire[questionnaire.pages[nr].addpage][0].name) {
                //questionnaire.pages.splice(k, 1);
                questionnaire.pages[k].remove = true;
                questionnaire.pages[nr+1].addedpage = undefined;
                break;
            }
        }
    }
}


/*
removes the graphic from the map and from questionnaire,graphics
*/
function removeGraphic(name, order) {
    if(order === undefined && questionnaire.graphics[name] !== undefined) {
        map.graphics.remove(questionnaire.graphics[name].pop());
        return;
    } else if (questionnaire.graphics[name] !== undefined) {
        map.graphics.remove(questionnaire.graphics[name][order]);
        questionnaire.graphics[name].splice(order,1);
        return;
    }
}

function setdeactive(ibnode) {
    ibnode.className = "deactive";
}


function showBoxAnim() {
var mapSymbo = document.getElementById("mapSymbols");
// fix hangup on doubleclicks
if(mapSymbo.style.top) {
    return false;
}
dojox.fx.toggleClass("mapSymbols","open").play();
}

/*
These functions should be removed later and put into the createPage function
*/
/*
function keskeyta() {
//hide these elements
var small = dojo.byId("smallContent");
small.style.visibility = "hidden";
small.innerHTML = "";

var mapSymbols = dojo.byId("mapSymbols");
mapSymbols.style.visibility = "hidden";

map.disableMapNavigation();
dojo.byId("navigation").style.visibility = "hidden";

//produce content for the page
var big = dojo.byId("bigContent");
big.style.visibility = "visible";

//load the html tags from a file
getContent("./content/keskeyta.html", big);

//add all the needed widgets to the html code
if(form) {
    submitForm();
    form.destroyRecursive("true");
}
//form = new dijit.form.Form({name: "keskeyta", method: "POST", action: "../asp/keskeyta.asp"}, dojo.byId("keskeyta"));
//var email = new dijit.form.ValidationTextBox({type: "text", required: true, trim: true, regExpGen: "dojox.regexp.emailAddress",invalidMessage:"Sähköpostiosoite on väärin kirjoitettu"}, dojo.byId("email"));
//add event handling for the content

//dojo.connect(dojo.byId("lopeta"), "onclick", kiitos);
}*/

function toggleHelp() {
    var button = dojo.byId("expandButton"),
        links = dojo.query(".instructionlinks"),
        i;
if(button.className === "openedhelp") {
    button.className = "closedhelp";
    for(i = 0; i < links.length; i++) {
        links[i].style.display = "none";
    }
}
else {
    button.className = "openedhelp";
    for(i = 0; i < links.length; i++) {
        links[i].style.display = "block";
    }
}
}

function startAsTestUser() {
questionnaire.values.testUser = true;
//ONLY FOR TAMMISALO
//questionnaire.values.password = "tammis";
//END ONLY FOR TAMMISALO
checkPassword();
// We dont create session but rest of the infotemplates must be loaded
loadTemplates();
createPage(questionnaire.pages[1].name);

}


/*
hide graphics function to hide the graphics on the map and after that to shoe them on the map
*/
function hideGraphics() {
// clear all graphics
console.log("hidegraphics");
map.graphics.clear();
}

/*
show the all the graphics in questionnaire.garphics
*/
function showGraphics() {
console.log("showgraphics");
//clear all the graphics so that none of the graphics are drawn twice
map.graphics.clear();

//draw all the graphics in questionnaire graphics
var g;
for (g in questionnaire.graphics) {
    if (g !== null) {
            var a;
        for(a = 0; a < questionnaire.graphics[g].length; a++) {

            map.graphics.add(questionnaire.graphics[g][a]);

            if(questionnaire.graphics[g][a].geometry.type === "polygon") {
                movePolygonToTop(questionnaire.graphics[g][a].getDojoShape());
            }
        }
    }
}

}

/*
toggle the hide graphics button from hide to show
*/
/*
function togglegraphicsbutton() {
var b = dojo.byId("removegraphicsbutton");
if(b.className === "hidegraph") {
    b.className = "showgraph";
    hideGraphics();
} else {
    b.className = "hidegraph";
    showGraphics();
}
}
*/
function togglegraphicsbutton() {
dojo.toggleClass(dojo.byId("hidebutton"), "tyhja");
dojo.toggleClass(dojo.byId("showbutton"), "tyhja");

var b = dojo.byId("hidebutton");
if(b.className === "tyhja") {
    hideGraphics();
} else {
    showGraphics();
}
}

function submitContact(formid) {

    console.log('submitContact');
    var contactForm = dijit.byId(formid);
    //var elem = contact.elements;
    var values = getValues(contactForm);

    contactForm.destroyRecursive(true);

    if(!questionnaire.values.testUser) {
    dojo.xhrPost({
            // The following URL must match that used to submit values.
        "url": questionnaire.contactForm_url,
        "postData": encodeURIComponent(dojo.toJson(values)),
        "sync": false,
        "timeout": 60000, // Time in milliseconds
        "preventCache": djConfig.isDebug,
        "headers": {"Content-Type":"application/json",
//                    "X-CSRFToken": getCookie( CSRF_Cookie_Name )},
                    "X-CSRFToken": dojo.cookie( gnt.config.CSRF_cookie_name )},

        // The LOAD function will be called on a successful response.
        "load": function(response, ioArgs){
            return response;
        },

        // The ERROR function will be called in an error case.
        "error": function(response, ioArgs){
            console.error("HTTP status code: ", ioArgs.xhr.status);
            return response;
        }
    });
    }

}
function submitFeedback_callback(data) {
    dojo.byId("subwindow").innerHTML = data.response;
    setTimeout(function(){closesubwindow();}, 3500);
}
function submitFeedback(formid, callback_function) {

    console.log('submitFeedback');
    var contactForm = dijit.byId(formid);
    //var elem = contact.elements;
    var values = getValues(contactForm);

    contactForm.destroyRecursive(true);

    if(!questionnaire.values.testUser) {
    dojo.xhrPost({
            // The following URL must match that used to submit values.
        "url": questionnaire.feedback_url,
        "postData": encodeURIComponent(dojo.toJson(values)),
        "sync": false,
        "timeout": 60000, // Time in milliseconds
        "preventCache": djConfig.isDebug,
        "headers": {"Content-Type":"application/json",
//                    "X-CSRFToken": getCookie( CSRF_Cookie_Name )},
                    "X-CSRFToken": dojo.cookie( gnt.config.CSRF_cookie_name )},

        // The LOAD function will be called on a successful response.
        "load": function(response, ioArgs){
            if(callback_function !== undefined) {
                callback_function({"response": response,
                                  "ioArgs": ioArgs});
            }
            return response;
        },

        // The ERROR function will be called in an error case.
        "error": function(response, ioArgs){
            console.error("HTTP status code: ", ioArgs.xhr.status);
            return response;
        }
    });
    }

}




//checks with a regular expression if an email is correct
function checkemail(email) {
    console.log("checkemail");
    //var rege = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    //var rege = new RegExp(\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b);
    //var rege = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    //var rege = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    var rege = new RegExp("^" + dojox.validate.regexp.emailAddress + "$", i);
    return rege.test(email);
}

// Not the correct way to do this
function emailcheck() {
    console.log("emailcheck");
    var email = dijit.byId("email").get("value");
    if(!checkemail(email)) {
    if(dojo.byId('email').value === "") {
            if(djConfig.locale === "fi") {
                alert("muista antaa sähköpostiosoite");
            } else if(djConfig.locale === "sv") {
            alert("kom ihåg att ge en email address");
            }
    } else {
            if(djConfig.locale === "fi") {
                alert("Tarkista sähköpostiosoite");
            } else if(djConfig.locale === "sv") {
                alert("Email addressen är inte giltig");
            }
    }
    }
}


//SUBWINDOW CODE
/*global dijit, dojo, getContent, questionnaire
*/
var subform;

function parsesubwindow(page) {
    var i;
    //createwidgets for subwindow
    if(page.formObjects !== undefined) {
        subform = createWidgets(page.formObjects);
    }
    subform = create_widgets("subwindow");

    //previous and next classes in subwindows should be defined in the JSON
    var nextbuttons = dojo.query(".next", "subwindow");
    var previousbuttons = dojo.query(".previous","subwindow");
    if(previousbuttons.length > 0) {
    for(i = 0; i < previousbuttons.length; i++) {
            dojo.connect(previousbuttons[i], "onclick", page.previous);
    }
    }

    if(nextbuttons.length > 0) {
    for(i = 0; i < nextbuttons.length; i++) {
            dojo.connect(nextbuttons[i], "onclick", page.next);
    }
    }
}


function createsubwindow(name) {
    console.log("createsubwindow");
    if(questionnaire.subwindows[name] === undefined) {
    return;
    }

    //get the subwindow content
    var page = questionnaire.subwindows[name];
    dojo.byId("subwindow").innerHTML = "";
    var urlContent = page.content;
    console.log("get subwindow content");
    dojo.xhrGet( {
    // The following URL must match that used to test the server.
    "url": urlContent,
    "handleAs": "text",
    "sync": false,
    "timeout": 60000, // Time in milliseconds

    // The LOAD function will be called on a successful response.
    "load": function(response, ioArgs) {//set the default height settings
            console.log("getting subnode dojo.byId");
            var subnode = dojo.byId("subwindow");
            console.log("modifying subnode");
            subnode.style.height = "auto";
            subnode.style.overflow = "visible";
            console.log("setting innerHTML for subwindow");
            subnode.innerHTML = response;
            //parse page
            console.log("parse subwindow");
            parsesubwindow(page);
            console.log("subwindow parsed");
            setContentMaxHeight();
        return response;
    },

    // The ERROR function will be called in an error case.
    "error": function(response, ioArgs) {
        console.error("HTTP status code: ", ioArgs.xhr.status);
        return response;
        }
    });
    console.log("subwindow content ready");
    //make sure the values are submitted if for example quit subwindow or something else goes wrong
    // does not work with IE
    //submitForm();
    //make subwindow visible
    console.log("set visibility for subcontent surround");
    dojo.byId("subsurround").style.visibility = "visible";
    dojo.byId("subwindow").style.visibility = "visible";
    console.log("done setting visibility");
}

function closesubwindow() {
    console.log("closesubwindow");
    dojo.byId("subsurround").style.visibility = "hidden";
    dojo.byId("subwindow").style.visibility = "hidden";

    //destroy the subform if created
    if(subform !== undefined) {
        subform.destroyRecursive(true);
    subform = undefined;
    }

    //remove the content inside subwindow to make sure they are not visible after closing
    dojo.byId("subwindow").innerHTML = "";
}

function submitsubwindow() {
console.log("submitsubwindow");
var values = getValues(subform);
var action = subform.get('action');
//alert(subform.isValid());
if (subform.isValid()) {
    dojo.xhrPost({
        // The following URL must match that used to submit values.
        "url": action,
        //form: subform,
        "content": values,
        "sync": false,
        "timeout": 60000, // Time in milliseconds
        // The LOAD function will be called on a successful response.
        "load": function(response, ioArgs){
            console.log(action);
            console.log(dojo.toJson(values));
            console.log(dojo.toJson(ioArgs.args));
            console.log(ioArgs.xhr.responseText);
            return response;
        },
        // The ERROR function will be called in an error case.
        "error": function(response, ioArgs){
            console.log(action);
            console.log(dojo.toJson(values));
            console.log(dojo.toJson(ioArgs.args));
            console.log(ioArgs.xhr.responseText);
            console.error("HTTP status code: ", ioArgs.xhr.status);
            return response;
        }
    });
}
}
//SUBWINDOW CODE END