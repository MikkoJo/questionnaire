/*global OpenLayers */
/* Style definitions for the questionnaire graphics */


var point_style = new OpenLayers.Style(
        // the first argument is a base symbolizer
        // all other symbolizers in rules will extend this one
        {
            fillColor:  "#ffffff",
            pointRadius: 3,
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
                        value: "point_orange"
                    }),
                    // if a feature matches the above filter, use this symbolizer
                    symbolizer: {
                        externalGraphic: "{{ STATIC_URL }}img/placemarks/pointorange.png"
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
                })
           ]
        }
    );

var route_style = new OpenLayers.Style(
        // the first argument is a base symbolizer
        // all other symbolizers in rules will extend this one
        {
            strokeWidth: 2
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
                        strokeColor: "#00ff00"
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
                        strokeColor: "#0000ff"
                    }
                })
           ]
        }
    );
var area_style = new OpenLayers.Style(
        // the first argument is a base symbolizer
        // all other symbolizers in rules will extend this one
        {
            strokeWidth: 2
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
                        strokeColor: "#ffd700",
                        fillColor:  "#ffd700",
                        fillOpacity: 0.5
                    }
                })
           ]
        }
    );
