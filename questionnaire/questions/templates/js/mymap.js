/* TO show user complete map */
/*global dojo, document, esri, alert, djConfig, console, questionnaire, softgis, addGmapLayer,
  MAPSERVICE_URL, get_features, esriConfig, dijit, confirm, logout, window, userid, gnt, questionnaire_logout
 */
//{% load i18n %}  


dojo.require("esri.map");
dojo.require("esri.layers.agstiled");
dojo.require("esri.toolbars.draw");
dojo.require("esri.dijit.InfoWindow");
dojo.require("dojo.parser");
dojo.require("dojox.fx.style");
dojo.require("dijit.Tooltip");
dojo.require("agsjs.layers.GoogleMapsLayer");

var userGraphics;
var map;
var tiledMapServiceLayer;
var mapConnect;
var oldCenter;
var user;


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
    if(key === null) {
        continue;
    } else {
        temp[key] = clone(obj[key]);
    }
}
return temp;
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

// Add Googlemaps layers to the map, this is for the Japanese version
var gMapLayer;
function addGmapLayer() {
    if(gMapLayer === undefined) {
        gMapLayer = new agsjs.layers.GoogleMapsLayer({"visible":true, "id":"googlemaps"});
        map.addLayer(gMapLayer);
        // Style object to modify the labels
        var styler = [ {
            "featureType": "landscape",
            "elementType": "labels",
            "stylers": [ {
                "visibility": "off"
            } ]
        } ];
        tiledMapServiceLayer.hide();

    }
}

// Siirtää uuden alueen aluiden päällimmäiseksi
function movePolygonToTop(n) {
    var i;
    if (n !== null && n !== undefined) {
        var p = n.rawNode.parentNode;
        var inserted = false;
        if(p === null || p === undefined) {
            return;
        }
        
        //attributes[0] = fill, it's none for routes and images (images don't work due svg bug, where fill is removed) FIXED: nodeName="image"
        for (i = 0; i < p.childNodes.length; i++) {
            if (p.childNodes[i] && (p.childNodes[i].attributes[0].nodeValue === "none" || p.childNodes[i].nodeName === "image") && !inserted) {
                n.rawNode.parentNode.insertBefore(n.rawNode, n.rawNode.parentNode.childNodes[i]);
                inserted = true;
                break;
            }
            //For IE which uses vml graphics
            else 
                if (p.childNodes[i] && p.childNodes[i].nodeName === "rect" && !inserted) {
                    n.rawNode.parentNode.insertBefore(n.rawNode, n.rawNode.parentNode.childNodes[i]);
                    inserted = true;
                    break;
                }
        }
    }
}

//Fix svg bug
function fixSVGbug() {
    var svgImages = document.getElementsByTagName("image"),
        i;
        
    for(i = 0; i < svgImages.length; i++) {
//		svgImages[i].setAttributeNS(null, "fill", "white");
        svgImages[i].removeAttribute("fill");
    }
    
}

function setMapExtent(extent, graphics) {
        //set the right extent for the map
    if (extent === undefined || extent === 0) {
        var ext,
            eg,
            k;
        for (k = 0; k < graphics.length; k++) {
            if (ext === undefined) {
                eg = graphics[k];
                if (eg.geometry.type === "point") {
                    ext = new esri.geometry.Extent(eg.geometry.x - 100, eg.geometry.y - 100, eg.geometry.x + 100, eg.geometry.y + 100);
                }
                else {
                    ext = eg.geometry.getExtent();
                }
            }
            else {
                eg = graphics[k];
                if (eg.geometry.type === "point") {
                    ext = ext.union(new esri.geometry.Extent(eg.geometry.x - 100, eg.geometry.y - 100, eg.geometry.x + 100, eg.geometry.y + 100));
                }
                else {
                    ext = ext.union(eg.geometry.getExtent());
                }
            }
        }
        
        
        //console.log(ext);
        if (ext !== undefined) {
            //esriConfig.defaults.map.panDuration = 1;
            //esriConfig.defaults.map.panRate = 1;
            
            map.setExtent(ext, true);
            /*dojo.connect(map, "onResize", this, function(){
                map.centerAt(oldCenter);
            });
            mapConnect = dojo.connect(map, "onExtentChange", function(e, d, lc, lod){
                if (lod.level > 4) {
                    setTimeout(function(){
                        map.setLevel(lod.level - 1);
                    }, 100);
                }
            });
            dojo.connect(map, "onZoomEnd", function(){
                if (mapConnect !== undefined) {
                    setTimeout(function(){
                        dojo.disconnect(mapConnect);
                        esriConfig.defaults.map.panDuration = 700;
                        esriConfig.defaults.map.panRate = 50;
                    }, 1000);
                }
            });*/
        }
    }
    else {
        map.setExtent(extent);
    }

}
//Callback functions for api functions
function get_features_callback(response_data) {

    var graphics = [];
    var response = response_data;
    // Check for error 
    if(response.status !== undefined) {
        if(response.status !== 200) {
            alert("You are not authorized to view this map");
            return;
        }
    }
    // Copied from the API
    if(djConfig.isDebug) {
        console.log("get_features_callback: " + dojo.toJson(response));
    }
    var infoC = "<div class='button saveShort'onclick='map.infoWindow.hide()'><span class='saveText'>${close}</span></div>";
    var infoH = "${header}";
    var infoSH = "${shortheader}";
    var infoTH = new esri.InfoTemplate(infoH, infoC);
    var infoTSH = new esri.InfoTemplate(infoSH, infoC);

    var symb, i;
    var spatialReference = new esri.SpatialReference({"wkid": response.crs.properties.code});
    for(i = 0; i < response.features.length; i++) {
        var geometry = response.features[i].geometry;
        var properties = response.features[i].properties;
        var id = response.features[i].id;
        var graphic = new esri.Graphic({});

        //default values for ImageButton
        //this part can also be found when creating the Imagebutton for the page
        var ijson = questionnaire.imageButton[properties.node];
        //default json 
        var defjson = clone(questionnaire.default_widgets.imagebutton);
        //the buttontext
        var defbuttontext = defjson.buttontext;
        
        if(ijson.buttontext === undefined) {
            ijson.buttontext = defbuttontext;
        }

        //the graphic attributes
        var defgraphicattr = defjson.graphicAttr;
        
        if(ijson.graphicAttr !== undefined) {
            defgraphicattr = dojo.mixin(defgraphicattr,ijson.graphicAttr);
        }
        ijson.graphicAttr = defgraphicattr;
        //the graphic strings
        var defgraphicstrings =  defjson.graphicStrings;
        
        if(ijson.graphicStrings !== undefined) {
            defgraphicstrings = dojo.mixin(defgraphicstrings, ijson.graphicStrings);
        }
        ijson.graphicStrings = defgraphicstrings;
        
        //combine them all together
        ijson = dojo.mixin(defjson,ijson);
        //default values code end


        if(geometry.type === "Point") {
            graphic.setGeometry(new esri.geometry.Point(geometry.coordinates).setSpatialReference(spatialReference));
            symb =  new esri.symbol.PictureMarkerSymbol(ijson.placeMark, ijson.xsize, ijson.ysize);
            //corrects the place of the symbol picture
            symb.setOffset(ijson.xoffset,ijson.yoffset);
        } else if (geometry.type === "LineString") {
            graphic.setGeometry(new esri.geometry.Polyline({"paths": [geometry.coordinates]}).setSpatialReference(spatialReference));
            symb = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                                                        new dojo.Color(ijson.graphicAttr.rgb),
                                                        1);
            //set the width of the line
            symb.setWidth(2);


        } else if(geometry.type === "Polygon") {
            graphic.setGeometry(new esri.geometry.Polygon({"rings": geometry.coordinates}).setSpatialReference(spatialReference));
            symb = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                    new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                        new dojo.Color([ijson.graphicAttr.rgb[0]-40,
                                        ijson.graphicAttr.rgb[1]-40,
                                        ijson.graphicAttr.rgb[2]-40]),
                                            1),
                            new dojo.Color([ijson.graphicAttr.rgb[0],
                                            ijson.graphicAttr.rgb[1],
                                            ijson.graphicAttr.rgb[2],
                                            0.5]));             

        }
        graphic.setAttributes(dojo.mixin(ijson.graphicStrings,  properties));
        graphic.setSymbol(symb);
        if(ijson.graphicStrings.shortheader !== null && ijson.graphicStrings.shortheader !== undefined) {
            graphic.setInfoTemplate(infoTSH);
        }
        else {
            graphic.setInfoTemplate(infoTH);
        }

        graphics.push(graphic);
//        map.graphics.add(graphic);
/*        if (graphic.geometry.type === "polygon") {
            movePolygonToTop(graphic.getDojoShape());
        }*/
    }
//    map.infoWindow.resize(200,150);
    
    //setMapExtent(0, graphics);
    //add the layers to the map
    //create layer load handler
    var loadHandler = function(l) {
      map.addLayer(l);
      var i, copyText = tiledMapServiceLayer.copyright;
      dojo.byId('maanmittausCopy').innerHTML = copyText;

      for(i = 0; i < graphics.length; i++) {
          map.graphics.add(graphics[i]);
          map.infoWindow.resize(200,150);
      }
      if(softgis.children !== undefined && djConfig.locale === "ja") {
          addGmapLayer();
      }
      setMapExtent(0, graphics);
    };

//to work around IE resource caching issues. Have to check for each layer
    if (tiledMapServiceLayer.loaded) {
        loadHandler(tiledMapServiceLayer);
    }
    else {
        dojo.connect(tiledMapServiceLayer, "onLoad", loadHandler);
    }

}

function getGraphics(/*userid,*/ extent) {
    
    //console.log("getGraphics");
    dojo.xhrGet({
        // The following URL must match that used to test the server.
        url: "../asp/ready.asp?userid=" + userid,
        sync: false,
        timeout: 5000, // Time in milliseconds
        handleAs: "json",
        preventCache: true,
        
        // The LOAD function will be called on a successful response.
        load: function(response, ioArgs){
                //console.log(response);
                userGraphics = response;
                return response;
            },
        
        // The ERROR function will be called in an error case.
        error: function(response, ioArgs){
            console.error("HTTP status code: ", ioArgs.xhr.status);
            return response;
        }
    });
    
    var name;
    var i;
    var pituus;
    var infoC = "<div class='button saveShort'onclick='map.infoWindow.hide()'><span class='saveText'>${close}</span></div>";
    var infoH = "${header}";
    var infoSH = "${shortheader}";
    var infoTH = new esri.InfoTemplate(infoH, infoC);
    var infoTSH = new esri.InfoTemplate(infoSH, infoC);
    var gra;
    //TESTING
    var geom;
    var symb;
    var symbHeight;
    var symbWidth;
    var symbXoffset;
    var symbYoffset;
    
    if(userGraphics !== null && userGraphics !== undefined) {
        for(name in userGraphics) {
            if (name !== null && name !== undefined) {
                pituus = userGraphics[name].length;
                for (i = 0; i < pituus; i++) {
/*					gra = new esri.Graphic(userGraphics[name][i]);
                    gra.setInfoTemplate(infoT);*/
                    gra = new esri.Graphic({});

                    //graphic.setGeometry(questionary.values[this.graphicAttr.valuename][i].geom);
                    geom = esri.geometry.fromJson(userGraphics[name][i].geometry);
                    gra.setGeometry(geom);					
                    gra.setAttributes(userGraphics[name][i].attributes);
                    if(userGraphics[name][i].attributes.shortheader !== null && userGraphics[name][i].attributes.shortheader !== undefined) {
                        gra.setInfoTemplate(infoTSH);
                    }
                    else {
                        gra.setInfoTemplate(infoTH);
                    }
                    
                    if(userGraphics[name][i].symbol.type === "esriPMS") {
                        // Fixed atleast in esri jsapi 2.1
                        // json is missing width and height for picturemarkersymbols
                        /*symbHeight = dojox.gfx.pt2px(userGraphics[name][i].symbol.size );
                        symbWidth = 23; // hardcoded for original pictureMarkerSymbols (e.g. place of happiness)
                        symbXoffset = dojox.gfx.pt2px(userGraphics[name][i].symbol.xoffset);
                        symbYoffset = dojox.gfx.pt2px(userGraphics[name][i].symbol.yoffset);
                        symb = new esri.symbol.PictureMarkerSymbol(userGraphics[name][i].symbol.url, symbWidth, symbHeight);*/
                        symb = new esri.symbol.PictureMarkerSymbol(userGraphics[name][i].symbol);
                        //symb.setOffset(symbXoffset, symbYoffset);
                        //geom = new esri.geometry.Point(userGraphics[name][i].geometry.x,userGraphics[name][i].geometry.y, new esri.SpatialReference({ wkid: 2393 }));
                    }
                    else if(userGraphics[name][i].symbol.type === "esriSFS") {
                        symb = new esri.symbol.SimpleFillSymbol(userGraphics[name][i].symbol);
                    }
                    else if(userGraphics[name][i].symbol.type === "esriSLS") {
                        symb = new esri.symbol.SimpleLineSymbol(userGraphics[name][i].symbol);
                    }
                    //gra.setGeometry(geom);
                    gra.setSymbol(symb);
                    

                    map.graphics.add(gra);
                    if (gra.geometry.type === "polygon") {
                        movePolygonToTop(gra.getDojoShape());
                    }
                    
                }
            }
        }
/*		if (!dojo.isIE) {
            fixSVGbug();
        }*/
    }
    map.infoWindow.resize(200,120);
    
    setMapExtent(extent);
    //set the right extent for the map
/*	if (extent === undefined || extent === 0) {
        var ext;
        var eg;
        for (var k = 0; k < map.graphics.graphics.length; k++) {
            if (ext === undefined) {
                eg = map.graphics.graphics[k];
                if (eg.geometry.type === "point") {
                    ext = new esri.geometry.Extent(eg.geometry.x - 100, eg.geometry.y - 100, eg.geometry.x + 100, eg.geometry.y + 100);
                }
                else {
                    ext = eg.geometry.getExtent();
                }
            }
            else {
                eg = map.graphics.graphics[k];
                if (eg.geometry.type === "point") {
                    ext = ext.union(new esri.geometry.Extent(eg.geometry.x - 100, eg.geometry.y - 100, eg.geometry.x + 100, eg.geometry.y + 100));
                }
                else {
                    ext = ext.union(eg.geometry.getExtent());
                }
            }
        }
        
        
        //console.log(ext);
        if (ext !== undefined) {
            esriConfig.defaults.map.panDuration = 1;
            esriConfig.defaults.map.panRate = 1;
            
            map.setExtent(ext);
            dojo.connect(map, "onResize", this, function(){
                map.centerAt(oldCenter);
            });
            mapConnect = dojo.connect(map, "onExtentChange", function(e, d, lc, lod){
                if (lod.level > 4) {
                    setTimeout(function(){
                        map.setLevel(4);
                    }, 100);
                }
            });
            dojo.connect(map, "onZoomEnd", function(){
                if (mapConnect !== undefined) {
                    setTimeout(function(){
                        dojo.disconnect(mapConnect);
                        esriConfig.defaults.map.panDuration = 700;
                        esriConfig.defaults.map.panRate = 50;
                    }, 1000);
                }
            });
        }
    }
    else {
        map.setExtent(extent);
    }*/
    /*if (!dojo.isIE) {
        graphicListener = dojo.connect(map.graphics, "onUpdate", fixSVGbug);
    }*/
    //See kysely.js
    var drawListener = dojo.connect(map.graphics, "_draw", function(evt){ 
                        if (evt.geometry.type === "polygon") {
                            movePolygonToTop(evt.getDojoShape());
                        }
                        });
}
//init creates the map 
function init() {
    //give the user impression that the program is doing something
//	console.log(userid);
//	map = new esri.Map("map", {"slider": false, "nav": false});
    //get userid;
    //user = userid;
    //var ext;
    map = new esri.Map("map", {"slider": true, 
                               "nav": true,
                               "logo": false,
                               //"extent": new esri.geometry.Extent(questionnaire.initial_extent),
                               "displayGraphicsOnPan": questionnaire.displayGraphicsOnPan
                              });//add event handlers for map
    /*
    dojo.connect(map, "onResize", map.resize);
    dojo.connect(map, "onReposition", map.reposition);
    */
    
    //tiledmap service layer with eight zoom levels
    tiledMapServiceLayer = new esri.layers.ArcGISTiledMapServiceLayer(MAPSERVICE_URL);
    
    //get_features("?time__now=true", get_features_callback);
    gnt.geo.get_features("?time__now=true", get_features_callback);
    //configure esri default values
    esriConfig.defaults.map.panDuration = 700;
    esriConfig.defaults.map.panRate = 50;
    
    //Change PAN FACTOR for navigation arrows
    map._FIXED_PAN_FACTOR = 0.3;
    
    // Add tooltip to exit button
    var tt = new dijit.Tooltip({
        "connectId": ["closeButton"],
        "label": "{% trans 'Poistu omasta kartasta. Tämän jälkeen et voi enää katsoa vastauksiasi' %}",
        "showDelay": 100
    });
    
    dojo.connect(dojo.byId("closeButton"), "onclick", function () {
        var test = confirm("{% trans 'Haluatko varmasti poistua kyselystä?' %}");
        //alert(test);
        if(test) {
            questionnaire_logout("{% url children_logout %}");
//            logout(function() {window.home();});
//            window.home();
        }
        });

    /*if (xmin !== undefined && xmin !== 0) {
        ext = new esri.geometry.Extent(xmin, ymin, xmax, ymax, 2393);
    }*/
/*	
    //add the layers to the map
    //create layer load handler
    var loadHandler = function(l) {
      map.addLayer(l);
    };

//to work around IE resource caching issues. Have to check for each layer
    if (tiledMapServiceLayer.loaded) {
        loadHandler(tiledMapServiceLayer);
    }
    else {
        dojo.connect(tiledMapServiceLayer, "onLoad", loadHandler);
    }

    //map.setExtent(new esri.geometry.Extent(3393063.7213135,6680812.93433483,3396681.79244991,6683987.45909726,2393));
    
    //configure esri default values
    esriConfig.defaults.map.panDuration = 700;
    esriConfig.defaults.map.panRate = 50;
    
    //Change PAN FACTOR for navigation arrows
    map._FIXED_PAN_FACTOR = 0.3;

    // More IE resource caching issues.
    if(map.loaded) {
    get_features("?time__now=true", get_features_callback);
//		getGraphics(userid,ext);
    }
    else {
//		dojo.connect(map, "onLoad", this, dojo.hitch(null, "getGraphics", userid, ext));
        dojo.connect(map, "onLoad", this, dojo.hitch(null, "get_features", "?time__now=true", get_features_callback));		
    }*/
}

function printMap(orien) {
    oldCenter = map.extent.toJson();
    var xmin = oldCenter.xmin;
    var ymin = oldCenter.ymin;
    var xmax = oldCenter.xmax;
    var ymax = oldCenter.ymax;
    
    console.log(oldCenter);
    console.log(xmin);
    window.open('omakartta.asp?ui=' + user + '&xmi=' + xmin + '&ymi=' + ymin + '&xma=' + xmax + '&yma=' + ymax, 'height=400, width=600');
    /*if(orien === "portrait") {
        dojo.byId("map").style.width = "19cm";
        dojo.byId("map").style.height = "27cm";
        dojo.byId("screenn").className = "screen";
        dojo.byId("printland").className = "screen";
        dojo.byId("printport").className = "aktiivinenScreen";
    }
    else if(orien === "landscape") {
        dojo.byId("map").style.width = "27cm";
        dojo.byId("map").style.height = "19cm";
        dojo.byId("screenn").className = "screen";
        dojo.byId("printport").className = "screen";
        dojo.byId("printland").className = "aktiivinenScreen";
    }
    else {
        dojo.byId("map").style.width = "100%";
        dojo.byId("map").style.height = "100%";
        dojo.byId("printland").className = "screen";
        dojo.byId("printport").className = "screen";
        dojo.byId("screenn").className = "aktiivinenScreen";
    }
    map.resize();*/
}


