/*global OpenLayers */
/* Style definitions for the questionnaire graphics */


var point_style = new OpenLayers.Style(
        // the first argument is a base symbolizer
        // all other symbolizers in rules will extend this one
        {
            fillColor:  "#ffffff",
            fillOpacity: 0.2,
            pointerEvents: "visiblePainted",
            cursor: "pointer",
            strokeColor: "blue",
            strokeOpacity: 0.4,
            pointRadius: 3,
            graphicOpacity: 1,
            graphicWidth: 23,
            graphicHeight: 36,
            graphicYOffset: -36 // shift graphic up 28 pixels
        },
        // the second argument will include all rules
        {
            rules: [
                new OpenLayers.Rule({
                    // a rule contains an optional filter
                    filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "style", // the "foo" feature attribute
                        value: "point_lightorange"
                    }),
                    // if a feature matches the above filter, use this symbolizer
                    symbolizer: {
                        externalGraphic: "{{ STATIC_URL }}img/placemarks/pointlightorange.png"
                    }
                }),
                new OpenLayers.Rule({
                    filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "style",
                        value: "point_green"
                    }),
                    symbolizer: {
                        externalGraphic: "{{ STATIC_URL }}img/placemarks/pointgreen.png"
                    }
                }),
                new OpenLayers.Rule({
                    filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "style",
                        value: "point_lightgreen"
                    }),
                    symbolizer: {
                        externalGraphic: "{{ STATIC_URL }}img/placemarks/pointlightergreen.png"
                    }
                }),
                new OpenLayers.Rule({
                    filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "style",
                        value: "point_red"
                    }),
                    symbolizer: {
                        externalGraphic: "{{ STATIC_URL }}img/placemarks/pointred.png"
                    }
                }),
                new OpenLayers.Rule({
                    filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "style",
                        value: "point_blue"
                    }),
                    symbolizer: {
                        externalGraphic: "{{ STATIC_URL }}img/placemarks/pointblue.png"
                    }
                }),
                new OpenLayers.Rule({
                    filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "style",
                        value: "point_cyan"
                    }),
                    symbolizer: {
                        externalGraphic: "{{ STATIC_URL }}img/placemarks/pointcyan.png"
                    }
                }),
                new OpenLayers.Rule({
                    filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "style",
                        value: "point_yellow"
                    }),
                    symbolizer: {
                        externalGraphic: "{{ STATIC_URL }}img/placemarks/pointyellow.png"
                    }
                }),
                new OpenLayers.Rule({
                    filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "style",
                        value: "point_brown"
                    }),
                    symbolizer: {
                        externalGraphic: "{{ STATIC_URL }}img/placemarks/pointbrown.png"
                    }
                }),
                new OpenLayers.Rule({
                    filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "style",
                        value: "point_positive"
                    }),
                    symbolizer: {
                        graphicWidth: 31,
                        graphicHeight: 42,
                        graphicYOffset: -36, // shift graphic up 28 pixels
                        externalGraphic: "{{ STATIC_URL }}img/placemarks/point_positive.png"
                    }
                }),
                new OpenLayers.Rule({
                    filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "style",
                        value: "point_negative"
                    }),
                    symbolizer: {
                        graphicWidth: 31,
                        graphicHeight: 42,
                        graphicYOffset: -36, // shift graphic up 28 pixels
                        externalGraphic: "{{ STATIC_URL }}img/placemarks/point_negative.png"
                    }
                }),
                new OpenLayers.Rule({
                    filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "style",
                        value: "point_purple"
                    }),
                    symbolizer: {
                        externalGraphic: "https://softgis.org.aalto.fi/images/needle?color=7408a1"
                    }
                }),
                new OpenLayers.Rule({
                    filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "style",
                        value: "point_cottage"
                    }),
                    symbolizer: {
                        externalGraphic: "{{ STATIC_URL }}img/placemarks/pointbrown.png"
                    }
                }),
                new OpenLayers.Rule({
                    elseFilter: true
                })
           ]
        }
    );

var route_style = new OpenLayers.Style(
        // the first argument is a base symbolizer
        // all other symbolizers in rules will extend this one
        {
            fillColor:  "#ffffff",
            fillOpacity: 0.2,
            strokeWidth: 2,
            strokeColor: "blue",
            strokeOpacity: 0.4,
            pointRadius: 3,
            pointerEvents: "visiblePainted",
            cursor: "pointer"
        },
        // the second argument will include all rules
        {
            rules: [
                new OpenLayers.Rule({
                    // a rule contains an optional filter
                    filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "style", // the "foo" feature attribute
                        value: "route_green"
                    }),
                    // if a feature matches the above filter, use this symbolizer
                    symbolizer: {
                        strokeColor: "#00ff00",
                        strokeOpacity: 1
                    }
                }),
                new OpenLayers.Rule({
                    // a rule contains an optional filter
                    filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "style", // the "foo" feature attribute
                        value: "route_blue"
                    }),
                    // if a feature matches the above filter, use this symbolizer
                    symbolizer: {
                        strokeColor: "#0000ff",
                        strokeOpacity: 1
                    }
                }),
                new OpenLayers.Rule({
                    // a rule contains an optional filter
                    filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "style", // the "foo" feature attribute
                        value: "route_cyan"
                    }),
                    // if a feature matches the above filter, use this symbolizer
                    symbolizer: {
                        strokeColor: "#48fbdc",
                        strokeOpacity: 1
                    }
                }),
                new OpenLayers.Rule({
                    // a rule contains an optional filter
                    filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "style", // the "foo" feature attribute
                        value: "route_purple"
                    }),
                    // if a feature matches the above filter, use this symbolizer
                    symbolizer: {
                        strokeColor: "#7408a1",
                        strokeOpacity: 1
                    }
                }),
                new OpenLayers.Rule({
                    // a rule contains an optional filter
                    filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "style", // the "foo" feature attribute
                        value: "route_yellow"
                    }),
                    // if a feature matches the above filter, use this symbolizer
                    symbolizer: {
                        strokeColor: "#fff600",
                        strokeOpacity: 1
                    }
                }),
                new OpenLayers.Rule({
                    // a rule contains an optional filter
                    filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "style", // the "foo" feature attribute
                        value: "route_orange"
                    }),
                    // if a feature matches the above filter, use this symbolizer
                    symbolizer: {
                        strokeColor: "#ffa100",
                        strokeOpacity: 1
                    }
                }),
                new OpenLayers.Rule({
                    elseFilter: true
                })
           ]
        }
    );
var area_style = new OpenLayers.Style(
        // the first argument is a base symbolizer
        // all other symbolizers in rules will extend this one
        {
            strokeWidth: 2,
            pointRadius: 3,
            pointerEvents: "visiblePainted",
            cursor: "pointer",
            strokeColor: "blue",
            strokeOpacity: 0.4,
            fillColor:  "#ffffff",
            fillOpacity: 0.2
        },
        // the second argument will include all rules
        {
            rules: [
                new OpenLayers.Rule({
                    // a rule contains an optional filter
                    filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "style", // the "foo" feature attribute
                        value: "area_yellow"
                    }),
                    // if a feature matches the above filter, use this symbolizer
                    symbolizer: {
                        strokeColor: "#ffd700",
                        strokeOpacity: 1,
                        fillColor:  "#ffd700",
                        fillOpacity: 0.3
                    }
                }),
                new OpenLayers.Rule({
                    // a rule contains an optional filter
                    filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "style", // the "foo" feature attribute
                        value: "area_cyan"
                    }),
                    // if a feature matches the above filter, use this symbolizer
                    symbolizer: {
                        strokeColor: "#48fbdc",
                        strokeOpacity: 1,
                        fillColor:  "#48fbdc",
                        fillOpacity: 0.3
                    }
                }),
                new OpenLayers.Rule({
                    // a rule contains an optional filter
                    filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "style", // the "foo" feature attribute
                        value: "area_blue"
                    }),
                    // if a feature matches the above filter, use this symbolizer
                    symbolizer: {
                        strokeColor: "#0000ff",
                        strokeOpacity: 1,
                        fillColor:  "#0000ff",
                        fillOpacity: 0.3
                    }
                }),
                new OpenLayers.Rule({
                    // a rule contains an optional filter
                    filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "style", // the "foo" feature attribute
                        value: "area_green"
                    }),
                    // if a feature matches the above filter, use this symbolizer
                    symbolizer: {
                        strokeColor: "#00ff00",
                        strokeOpacity: 1,
                        fillColor:  "#00ff00",
                        fillOpacity: 0.3
                    }
                }),
                new OpenLayers.Rule({
                    // a rule contains an optional filter
                    filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "style", // the "foo" feature attribute
                        value: "area_red"
                    }),
                    // if a feature matches the above filter, use this symbolizer
                    symbolizer: {
                        strokeColor: "#ff0000",
                        strokeOpacity: 1,
                        fillColor:  "#ff0000",
                        fillOpacity: 0.3
                    }
                }),
                new OpenLayers.Rule({
                    elseFilter: true
                })
           ]
        }
    );
var zone_style = new OpenLayers.Style(
        // the first argument is a base symbolizer
        // all other symbolizers in rules will extend this one
        {
            strokeWidth: 2,
            pointerEvents: "visiblePainted",
            strokeColor: "red",
            strokeOpacity: 0.9,
            fillColor:  "#ffffff",
            fillOpacity: 0
        },
{
            rules: [
                new OpenLayers.Rule({
                    // a rule contains an optional filter
                    filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "Name", // the "foo" feature attribute
                        value: "keskusta"
                    }),
                    // if a feature matches the above filter, use this symbolizer
                    symbolizer: {
                        strokeColor: "#a405ae"
                    }
                }),
                new OpenLayers.Rule({
                    elseFilter: true
                })
           ]
        }    );
