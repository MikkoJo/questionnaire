/*{% load i18n %}*/
/* init questionary object */

/*All the functions controlling the flow of the questionary*/
var applicationName = "pehmogis";

/*Mapservice used */
var MAPSERVICE_URL = "https://pehmogis.tkk.fi/ArcGIS/rest/services/suomi/MapServer";

/* Mapservice for satellite map */
var SATELLITE_MAPSERVICE_URL = "https://pehmogis.tkk.fi/ArcGIS/rest/services/suomi-ilma/MapServer";

/*Mapservice for the overview map*/
var OVERVIEWMAP_URL = "https://pehmogis.tkk.fi/ArcGIS/rest/services/suomi/MapServer";

//define all the part names here
var questionary = {
"visited": [], //lists all the visited pages during one session
"graphics": {}, //list all the graphics that the user has added
"residencePlaces": [], // lists all places needed to be remembered in the questionnaire flow
"values": {}, //list all the values collected from the user in the questionnaire
"sections": [], //lists all the sections in the questionnaire
"pages": [], //lists all the pages in the questionnaire
"imageButton": {}, //contains all the imagebutton definition in the questionnaire
"subwindows": {}, //contains all the subwindow definitions in the questionnaire
"infoTemplates": {}, //contains all the infowindow templates made for this questionnaire.
"features": {}, // contains all the features of the questionnaire
"profileValues": {}, // contains all the profile values of the questionnaire
"debug": true
};

questionary.residencePlaces = [
{"tammisalo": { //EXAMPLE residence places are extents which can be used throughout the questionnaire for navigation mostly.
		"xmax":3394013.376486641,
		"xmin":3390965.370390629,
		"ymax":6678030.816519897,
		"ymin":6676018.568050956,
        "spatialReference":{"wkid":3067}
		}
},

{"teisko": {
    "coords": {
        "x": 332995.46070290636,
        "y": 6832345.80667926,
        "spatialReference":{"wkid":3067}
    },
    "level": 3
}},
{"luoteis": {
    "coords": {
        "x": 322695.74010346533,
        "y": 6825720.626762232,
        "spatialReference":{"wkid":3067}
    },
    "level": 5
}},
{"lansi": {
    "coords": {
        "x": 322187.7390874633,
        "y": 6823599.722520423,
        "spatialReference":{"wkid":3067}
    },
    "level": 5
}},
{"etela": {
    "coords": {
        "x": 326992.5820304826,
        "y": 6818655.179298004,
        "spatialReference":{"wkid":3067}
    },
    "level": 5
}},
{"kaakkois": {
    "coords": {
        "x": 332402.79285090417,
        "y": 6818363.078713803,
        "spatialReference":{"wkid":3067}
    },
    "level": 5
}},
{"ita": {
    "coords": {
        "x": 332851.5270817059,
        "y": 6821567.718456414,
        "spatialReference":{"wkid":3067}
    },
    "level": 5
}},
{"keskusta": {
    "coords": {
        "x": 327314.3160072837,
        "y": 6822456.720234425,
        "spatialReference":{"wkid":3067}
    },
    "level": 5
}},
{"muu": {
    "coords": {
        "x": 327314.3160072837,
        "y": 6822456.720234425,
        "spatialReference":{"wkid":3067}
    },
    "level": 5
}}
];

questionary.sections = [{
"section": "background"
},
{
"section": "envmovement"
},
{
"section": "envevaluation"
},
{
"section": "improvements"
},
{
"section": "feedback"
}
];

questionary.infoTemplates = {
"default": {
	"confirm": "<p>${question}</p>" +
				"<div class='button saveLong' onclick='confirm(\"${id}\",true);map.infoWindow.hide()'>" + 
				"<span class='saveText'>${positive}</span>" +
				"</div>" +
				"<p style='margin:0'>" +
				"<span style='color:#36A8D5;text-decoration:underline;' onclick='confirm(\"${id}\", false);map.infoWindow.hide()'>${negative}</span>" + 
				"</p>",
	"confirmHeight": 150,
	"confirmWidth": 250,
	"info": "<div class='button saveShort' onclick='map.infoWindow.hide()'>" +
			"<span class='saveText'>${close}</span>" + 
			"</div>" + 
			"<p style='margin:0'>" +
			"<span style='color:#36A8D5;text-decoration:underline;' onclick='removeGraph(\"${id}\");map.infoWindow.hide()'>" +
			"${remove}</span></p>",	
	"infoWidth": 250,
	"infoHeight": 150
},
"point": {
	"confirm": "<p>${question}</p>" +
				"<div class='button saveLong' onclick='confirm(\"${id}\",true);map.infoWindow.hide()'>" + 
				"<span class='saveText'>${positive}</span>" +
				"</div>" +
				"<p style='margin:0'>" +
				"<span style='color:#36A8D5;text-decoration:underline;' onclick='confirm(\"${id}\", false);map.infoWindow.hide()'>${negative}</span>" + 
				"</p>",
	"confirmHeight": 150,
	"confirmWidth": 250,
	"info": "<div class='button saveShort' onclick='map.infoWindow.hide()'>" +
			"<span class='saveText'>${close}</span>" + 
			"</div>" + 
			"<p style='margin:0'>" +
			"<span style='color:#36A8D5;text-decoration:underline;' onclick='removeGraph(\"${id}\");map.infoWindow.hide()'>" +
			"${remove}</span></p>",	
	"infoWidth": 250,
	"infoHeight": 150
	},
"polyline": {
	"confirm": "<p>${polylinequestion}</p>" +
				"<div class='button saveLong' onclick='confirm(\"${id}\",true);map.infoWindow.hide()'>" + 
				"<span class='saveText'>${polylinepositive}</span>" +
				"</div>" +
				"<p style='margin:0'>" +
				"<span style='color:#36A8D5;text-decoration:underline;' onclick='confirm(\"${id}\", false);map.infoWindow.hide()'>${polylinenegative}</span>" + 
				"</p>",
	"confirmHeight": 150,
	"confirmWidth": 250,
	"info": "<div class='button saveShort' onclick='map.infoWindow.hide()'>" +
			"<span class='saveText'>${close}</span>" + 
			"</div>" + 
			"<p style='margin:0'>" +
			"<span style='color:#36A8D5;text-decoration:underline;' onclick='removeGraph(\"${id}\");map.infoWindow.hide()'>" +
			"${polylineremove}</span></p>",	
	"infoWidth": 250,
	"infoHeight": 150
	},
"badpath": { 
	"confirm": "<p>${question}</p>" +
				"<form id='info'>" +
				"<table style='width: 100%'><tr>" +
				"<td>${holes}</td>" +
				"<td><input id='holes' type='checkbox' name='holes' /><td>" + 
				"</tr><tr>" +
				"<td>${pools}</td>" +
				"<td><input id='pools' type='checkbox' name='pools' /></td>" +
				"</tr><tr>" +
				"<td>${brokenroad}</td>" +
				"<td><input id='brokenroad' type='checkbox' name='brokenroad' /></td>" +
				"</tr><tr>" +
				"<td>${other}</td>" +
				"<td><input id='other' type='checkbox' name='other' /></td>" +
				"</tr><tr>" +
				"<td colspan='2' style='text-align: right'><input id='othertext' type='text' name='othertext' /></td>" +
				"</tr></table>" +
				"<p>${tellmore}</p>" +
				"<textarea id='itext' name='tellmore' cols='25' rows='4'></textarea>" +
				"</form>" +
				"<div class='button saveShort' " +
				"onclick='confirm(\"${id}\",true);submitInfoForm(\"info\",\"${valuename}\");" + 
				"map.infoWindow.hide()'>" +
				"<span class='saveText'>${positive}</span>" +
				"</div>" +
				"<p style='margin:0'>" +
				"<span style='color:#36A8D5;text-decoration:underline;'" + 
				"onclick='confirm(\"${id}\",false);map.infoWindow.hide()'>${negative}</span>" +
				"</p>",
	"confirmHeight": 300,
	"confirmWidth": 250,
	"info": "<p>${question}</p>" +
				"<form id='info'>" +
				"<table style='width: 100%'><tr>" +
				"<td>${holes}</td>" +
				"<td><input id='holes' type='checkbox' name='holes' /><td>" + 
				"</tr><tr>" +
				"<td>${pools}</td>" +
				"<td><input id='pools' type='checkbox' name='pools' /></td>" +
				"</tr><tr>" +
				"<td>${brokenroad}</td>" +
				"<td><input id='brokenroad' type='checkbox' name='brokenroad' /></td>" +
				"</tr><tr>" +
				"<td>${other}</td>" +
				"<td><input id='other' type='checkbox' name='other' /></td>" +
				"</tr><tr>" +
				"<td colspan='2' style='text-align: right'><input id='othertext' type='text' name='othertext' /></td>" +
				"</tr></table>" +
				"<p>${tellmore}</p>" +
				"<textarea id='itext' name='tellmore' cols='25' rows='4'></textarea>" +
				"</form>" +
				"<div class='button saveShort' " +
				"onclick='submitInfoForm(\"info\",\"${valuename}\");" + 
				"map.infoWindow.hide()'>" +
				"<span class='saveText'>${close}</span>" +
				"</div>" +
				"<p style='margin:0'>" +
				"<span style='color:#36A8D5;text-decoration:underline;'" +
				"onclick='removeGraph(\"${id}\");map.infoWindow.hide()'>${remove}</span>" +
				"</p>",
	"infoWidth": 250,
	"infoHeight": 300,
	"formObjects": [
		{
		"type": "Form",
		"json": {},
		"node": "info"
		},
		{
		"type": "checkbox",
		"json": {"value":"pools", "name":"badpathcheckbox"},
		"node": "pools"
		},
		{
		"type": "checkbox",
		"json": {"value":"holes", "name":"badpathcheckbox"},
		"node": "holes"
		},
		{
		"type": "checkbox",
		"json": {"value":"brokenroad", "name":"badpathcheckbox"},
		"node": "brokenroad"
		},
		{
		"type": "checkbox",
		"json": {"value":"other", "name":"badpathcheckbox"},
		"node": "other"
		},
		{
		"type": "TextBox",
		"json": {
			"name": "TextBox", 
			"type": "othertext"
			},
		"node": "othertext"},
		{
		"type": "Textarea",
		"json": { 
			"rows": "4",  
			"cols": "25", 
			"style": "width:auto;", 
			"name": "tellmore"},
		"node": "itext"
		}
		]
},
"routes": {
	"confirm": "{% spaceless %}{% include 'routes_info.html' %}{% with 'route' as type %}{% include 'infoConfirm.html' %}{% endwith %}{% endspaceless %}",
	"confirmWidth": 250,
    "confirmHeight": 460,
	"info": "{% spaceless %}{% include 'routes_info.html' %}{% with 'route' as type %}{% include 'info_info.html' %}{% endwith %}{% endspaceless %}",
    "infoWidth": 250,
    "infoHeight": 460,
	"formObjects": [
        {
        "type": "Form",
        "json": {},
        "node": "info"
        },
        {
	    "type": "RadioButton",
        "json": {
            "name": "mtransport",
            "value": "walk"
        },
        "node": "walk"
        },
        {
	    "type": "RadioButton",
        "json": {
            "name": "mtransport",
            "value": "bike"
        },
        "node": "bike"
        },
        {
	    "type": "RadioButton",
        "json": {
            "name": "mtransport",
            "value": "runorjog"
        },
        "node": "runorjog"
        },
        {
	    "type": "RadioButton",
        "json": {
            "name": "mtransport",
            "value": "skate"
        },
        "node": "skate"
        },
        {
	    "type": "RadioButton",
        "json": {
            "name": "mtransport",
	        "value": "other",
            "onChange": function(val) {
                    if(val) {
                        dojo.removeClass('otherSpan', 'tyhja');
                        dijit.byId('transOther').set('disabled', false);
                    }
                    else {
                        dojo.addClass('otherSpan', 'tyhja');
                        dijit.byId('transOther').set('disabled', true);
                    }
                }
        },
        "node": "other"
        },
        {
        "type": "textBox",
        "json": { 
            "disabled": true,
            "name": "transOther"
        },
        "node": "transOther"
        },
        {
        "type": "CheckBox",
        "json": {
            "name": "feelroute",
            "value": "safe"
            },
        "node": "safe"
        },
        {
        "type": "CheckBox",
        "json": {
            "name": "feelroute",
            "value": "unsafe"
            },
        "node": "unsafe"
        },
        {
        "type": "CheckBox",
        "json": {
            "name": "feelroute",
            "value": "fast"
            },
        "node": "fast"
        },
        {
        "type": "CheckBox",
        "json": {
            "name": "feelroute",
            "value": "wellmanage"
            },
        "node": "wellmanage"
        },
        {
        "type": "CheckBox",
        "json": {
            "name": "feelroute",
            "value": "badmanage"
            },
        "node": "badmanage"
        },
        {
        "type": "CheckBox",
        "json": {
            "name": "feelroute",
            "value": "pos_atmos"
            },
        "node": "pos_atmos"
        },
        {
        "type": "CheckBox",
        "json": {
            "name": "feelroute",
            "value": "neg_atmos"
            },
        "node": "neg_atmos"
        },
        {
        "type": "Textarea",
        "json": { 
            "rows": "2",  
            "cols": "25", 
            "style": "width:auto;", 
            "name": "comments"},
        "node": "comments"
        }
	]
	},
"carpetpier": {
	"confirm": "<form id='info'>" +
			"<p>${question}</p>" +
			"<table><tr>" +
			"<td style='width: 50%'>" +
			"<input type='checkbox' id='wash' value='wash' name='carpetpier' />" +
			"<label for='wash'>${wash}</label><br/>" +
			"<input type='checkbox' id='swim' value='swim' name='carpetpier' />" +
			"<label for='swim'>${swim}</label><br/>" +
			"<input type='checkbox' id='hang' value='hang' name='carpetpier' />" +
			"<label for='hang'>${hang}</label><br />" +
			"<input type='checkbox' id='other' value='other' name='carpetpier' />" +
			"<label for='other'>${other}</label></td></tr>" +
			"<tr><td colspan='2'><input type='text' id='othertext' name='othertext' /></td></tr></table>" +
			"</form>" +
			"<div class='button saveShort' " +
			"onclick='confirm(\"${id}\",true);submitInfoForm(\"info\",\"${valuename}\");" + 
			"map.infoWindow.hide()'>" +
			"<span class='saveText'>${positive}</span>" +
			"</div>" +
			"<p style='margin:0'>" +
			"<span style='color:#36A8D5;text-decoration:underline;'" + 
			"onclick='confirm(\"${id}\",false);map.infoWindow.hide()'>${negative}</span>" +
			"</p>",
	"confirmHeight": 250,
	"confirmWidth": 250,
	"info": "<form id='info'>" +
			"<p>${question}</p>" +
			"<table><tr>" +
			"<td style='width: 50%'>" +
			"<input type='checkbox' id='wash' value='wash' name='carpetpier' />" +
			"<label for='wash'>${wash}</label><br/>" +
			"<input type='checkbox' id='swim' value='swim' name='carpetpier' />" +
			"<label for='swim'>${swim}</label><br/>" +
			"<input type='checkbox' id='hang' value='hang' name='carpetpier' />" +
			"<label for='hang'>${hang}</label><br />" +
			"<input type='checkbox' id='other' value='other' name='carpetpier' />" +
			"<label for='other'>${other}</label></td></tr>" +
			"<tr><td colspan='2'><input type='text' id='othertext' name='othertext' /></td></tr></table>" +
			"</form>" +
			"<div class='button saveShort' " +
			"onclick='submitInfoForm(\"info\",\"${valuename}\");" + 
			"map.infoWindow.hide()'>" +
			"<span class='saveText'>${close}</span>" +
			"</div>" +
			"<p style='margin:0'>" +
			"<span style='color:#36A8D5;text-decoration:underline;'" +
			"onclick='removeGraph(\"${id}\");map.infoWindow.hide()'>${remove}</span>" +
			"</p>",
	"formObjects": [
	{"type": "Form",
	"json": {"name": "info", "method": "post", "action": ""},
	"node": "info"},
	{"type": "checkbox",
	"json": {"name": "wash", "value": "wash"},
	"node": "wash"
	},
	{"type": "checkbox",
	"json": {"name": "swim", "value": "swim"},
	"node": "swim"
	},
	{"type": "checkbox",
	"json": {"name": "hang", "value": "hang"},
	"node": "hang"
	},
	{"type": "checkbox",
	"json": {"name": "other", "value": "other"},
	"node": "other"
	},
	{
	"type": "TextBox",
	"json": {
		"name": "othertext"
		},
	"node": "othertext"}
	],
	"infoWidth": 250,
	"infoHeight": 250
	},
"newRoutes": {
	"confirm":	"<form id='info'>" +
				"<p>${tellmore}</p>" +
				"<textarea id='itext' name='tellmore' cols='25' rows='4'></textarea>" +
				"</form>" +
				"{% spaceless %}{% with 'route' as type %}{% include 'infoConfirm.html' %}{% endwith %}{% endspaceless %}",
	"confirmHeight": 270,
	"confirmWidth": 250,
	"info":	"<form id='info'>" +
			"<p>${tellmore}</p>" +
			"<textarea id='itext' name='tellmore' cols='25' rows='4'></textarea>" +
			"</form>" +
			"{% spaceless %}{% with 'route' as type %}{% include 'info_info.html' %}{% endwith %}{% endspaceless %}",	
	"infoWidth": 270,
	"infoHeight": 250,
	"formObjects": [
		{
		"type": "Form",
		"json": {},
		"node": "info"
		},
		{
		"type": "Textarea",
		"json": { 
			"rows": "4",  
			"cols": "25", 
			"style": "width:auto;", 
			"name": "tellmore"},
		"node": "itext"
		}
		]
},
"other": {
    "confirm":  "<form id='info'>" +
                "<p>${tellmore}</p>" +
                "<textarea id='itext' name='tellmore' cols='25' rows='4'></textarea>" +
                "</form>" +
                "{% spaceless %}{% include 'infoConfirm.html' %}{% endspaceless %}",
    "confirmHeight": 270,
    "confirmWidth": 250,
    "info": "<form id='info'>" +
            "<p>${tellmore}</p>" +
            "<textarea id='itext' name='tellmore' cols='25' rows='4'></textarea>" +
            "</form>" +
            "{% spaceless %}{% include 'info_info.html' %}{% endspaceless %}",   
    "infoWidth": 270,
    "infoHeight": 250,
    "formObjects": [
        {
        "type": "Form",
        "json": {},
        "node": "info"
        },
        {
        "type": "Textarea",
        "json": { 
            "rows": "4",  
            "cols": "25", 
            "style": "width:auto;", 
            "name": "tellmore"},
        "node": "itext"
        }
        ]
},
"home": {
    "confirm":  "{% spaceless %}{% include 'home_info.html' %}{% include 'infoConfirm.html' %}{% endspaceless %}",
    "confirmWidth": 350,
    "confirmHeight": 450,
    "info": "{% spaceless %}{% include 'home_info.html' %}{% include 'info_info.html' %}{% endspaceless %}",
    "infoWidth": 350,
    "infoHeight": 450,
    "formObjects": [
        {
        "type": "Form",
        "json": {},
        "node": "info"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "howlong",
            "value": "less_than_one"},
        "node": "h1_1"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "howlong",
            "value": "one_to_three"},
        "node": "h1_2"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "howlong",
            "value": "three_to_five"},
        "node": "h1_3"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "howlong",
            "value": "five_to_ten"},
        "node": "h1_4"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "howlong",
            "value": "over_ten"},
        "node": "h1_5"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "nicewalk",
            "value": "very_pleasant"},
        "node": "h2_1"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "nicewalk",
            "value": "fairly_pleasant"},
        "node": "h2_2"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "nicewalk",
            "value": "fairly_unpleasant"},
        "node": "h2_3"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "nicewalk",
            "value": "very_unpleasant"},
        "node": "h2_4"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "nicewalk",
            "value": "ict"},
        "node": "h2_5"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "nicebike",
            "value": "very_pleasant"},
        "node": "h3_1"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "nicebike",
            "value": "fairly_pleasant"},
        "node": "h3_2"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "nicebike",
            "value": "fairly_unpleasant"},
        "node": "h3_3"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "nicebike",
            "value": "very_unpleasant"},
        "node": "h3_4"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "nicebike",
            "value": "ict"},
        "node": "h3_5"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "pubservi",
            "value": "very_good"},
        "node": "h4_1"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "pubservi",
            "value": "fairly_good"},
        "node": "h4_2"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "pubservi",
            "value": "fairly_bad"},
        "node": "h4_3"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "pubservi",
            "value": "very_bad"},
        "node": "h4_4"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "pubservi",
            "value": "ict"},
        "node": "h4_5"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "nicecar",
            "value": "very_good"},
        "node": "h5_1"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "nicecar",
            "value": "fairly_good"},
        "node": "h5_2"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "nicecar",
            "value": "fairly_bad"},
        "node": "h5_3"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "nicecar",
            "value": "very_bad"},
        "node": "h5_4"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "nicecar",
            "value": "ict"},
        "node": "h5_5"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "servshop",
            "value": "very_good"},
        "node": "h6_1"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "servshop",
            "value": "fairly_good"},
        "node": "h6_2"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "servshop",
            "value": "fairly_bad"},
        "node": "h6_3"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "servshop",
            "value": "very_bad"},
        "node": "h6_4"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "servshop",
            "value": "ict"},
        "node": "h6_5"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "servpost",
            "value": "very_good"},
        "node": "h7_1"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "servpost",
            "value": "fairly_good"},
        "node": "h7_2"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "servpost",
            "value": "fairly_bad"},
        "node": "h7_3"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "servpost",
            "value": "very_bad"},
        "node": "h7_4"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "servpost",
            "value": "ict"},
        "node": "h7_5"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "servschool",
            "value": "very_good"},
        "node": "h8_1"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "servschool",
            "value": "fairly_good"},
        "node": "h8_2"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "servschool",
            "value": "fairly_bad"},
        "node": "h8_3"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "servschool",
            "value": "very_bad"},
        "node": "h8_4"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "servschool",
            "value": "ict"},
        "node": "h8_5"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "servpark",
            "value": "very_good"},
        "node": "h9_1"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "servpark",
            "value": "fairly_good"},
        "node": "h9_2"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "servpark",
            "value": "fairly_bad"},
        "node": "h9_3"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "servpark",
            "value": "very_bad"},
        "node": "h9_4"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "servpark",
            "value": "ict"},
        "node": "h9_5"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "servother",
            "value": "very_good"},
        "node": "h10_1"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "servother",
            "value": "fairly_good"},
        "node": "h10_2"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "servother",
            "value": "fairly_bad"},
        "node": "h10_3"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "servother",
            "value": "very_bad"},
        "node": "h10_4"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "servother",
            "value": "ict"},
        "node": "h10_5"
        },
        {
        "type": "textBox",
        "json": { 
            "name": "servothwha"
        },
        "node": "servothwha"
        }
        ]
},
"moveEnvWork": {
    "confirm":  "{% spaceless %}{% include 'move_env_info_work.html' %}{% include 'infoConfirm.html' %}{% endspaceless %}",
    "confirmWidth": 350,
    "confirmHeight": 450,
    "info": "{% spaceless %}{% include 'move_env_info_work.html' %}{% include 'info_info.html' %}{% endspaceless %}",
    "infoWidth": 350,
    "infoHeight": 450,
    "formObjects": [
        {
        "type": "Form",
        "json": {},
        "node": "info"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "whattype",
            "value": "workplace"},
        "node": "me1_1"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "whattype",
            "value": "daycare"},
        "node": "me1_2"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "whattype",
            "value": "school"},
        "node": "me1_3"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "whattype",
            "value": "studyplace"},
        "node": "me1_4"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "whattype",
            "value": "businessplace"},
        "node": "me1_5"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "whattype",
            "value": "other",
            "onChange": function(val) {
                    if(val) {
                        dojo.removeClass('otherSpan', 'tyhja');
                        dijit.byId('otherwork').set('disabled', false);
                    }
                    else {
                        dojo.addClass('otherSpan', 'tyhja');
                        dijit.byId('otherwork').set('disabled', true);
                    }
                }
        },
        "node": "me1_6"
        },
        {
        "type": "textBox",
        "json": { 
            "disabled": true,
            "name": "otherwork"
        },
        "node": "otherwork"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "howoften",
            "value": "daily"},
        "node": "me2_1"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "howoften",
            "value": "weekly"},
        "node": "me2_2"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "howoften",
            "value": "monthly"},
        "node": "me2_3"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "howoften",
            "value": "once_month"},
        "node": "me2_4"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "howoften",
            "value": "not_so_often"},
        "node": "me2_5"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "howvisit",
            "value": "walk"},
        "node": "me3_1"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "howvisit",
            "value": "bike"},
        "node": "me3_2"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "howvisit",
            "value": "car"},
        "node": "me3_3"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "howvisit",
            "value": "bus"},
        "node": "me3_4"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "howvisit",
            "value": "other",
            "onChange": function(val) {
                    if(val) {
                        dojo.removeClass('otherHowSpan', 'tyhja');
                        dijit.byId('visitOther').set('disabled', false);
                    }
                    else {
                        dojo.addClass('otherHowSpan', 'tyhja');
                        dijit.byId('visitOther').set('disabled', true);
                    }
                }
        },
        "node": "me3_5"
        },
        {
        "type": "TextBox",
        "json": {
            "disabled": true,
            "name": "visitOther"
            },
        "node": "visitOther"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "whenvisit",
            "value": "weekdays"},
        "node": "me4_1"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "whenvisit",
            "value": "weekends"},
        "node": "me4_2"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "whenvisit",
            "value": "weekdays_and_weekends"},
        "node": "me4_3"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "ridehow",
            "value": "self"},
        "node": "me5_1"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "ridehow",
            "value": "otherperson"},
        "node": "me5_2"
        },
        {
        "type": "Textarea",
        "json": { 
            "rows": "2",  
            "cols": "25", 
            "style": "width:auto;", 
            "name": "comments"},
        "node": "comments"
        }
        ]
},
"moveEnvShop": {
    "confirm":  "{% spaceless %}{% include 'move_env_info_shop.html' %}{% include 'infoConfirm.html' %}{% endspaceless %}",
    "confirmWidth": 350,
    "confirmHeight": 450,
    "info": "{% spaceless %}{% include 'move_env_info_shop.html' %}{% include 'info_info.html' %}{% endspaceless %}",
    "infoWidth": 350,
    "infoHeight": 450,
    "formObjects": [
        {
        "type": "Form",
        "json": {},
        "node": "info"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "whattype",
            "value": "grocery"},
        "node": "me1_1"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "whattype",
            "value": "supermarket"},
        "node": "me1_2"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "whattype",
            "value": "shoppingcentre"},
        "node": "me1_3"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "whattype",
            "value": "specialshop"},
        "node": "me1_4"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "whattype",
            "value": "other",
            "onChange": function(val) {
                    if(val) {
                        dojo.removeClass('otherSpan', 'tyhja');
                        dijit.byId('othershop').set('disabled', false);
                    }
                    else {
                        dojo.addClass('otherSpan', 'tyhja');
                        dijit.byId('othershop').set('disabled', true);
                    }
                }
        },
        "node": "me1_5"
        },
        {
        "type": "textBox",
        "json": { 
            "disabled": true,
            "name": "othershop"
        },
        "node": "othershop"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "howoften",
            "value": "daily"},
        "node": "me2_1"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "howoften",
            "value": "weekly"},
        "node": "me2_2"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "howoften",
            "value": "monthly"},
        "node": "me2_3"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "howoften",
            "value": "once_month"},
        "node": "me2_4"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "howoften",
            "value": "not_so_often"},
        "node": "me2_5"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "howvisit",
            "value": "walk"},
        "node": "me3_1"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "howvisit",
            "value": "bike"},
        "node": "me3_2"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "howvisit",
            "value": "car"},
        "node": "me3_3"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "howvisit",
            "value": "bus"},
        "node": "me3_4"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "howvisit",
            "value": "other",
            "onChange": function(val) {
                    if(val) {
                        dojo.removeClass('otherHowSpan', 'tyhja');
                        dijit.byId('visitOther').set('disabled', false);
                    }
                    else {
                        dojo.addClass('otherHowSpan', 'tyhja');
                        dijit.byId('visitOther').set('disabled', true);
                    }
                }
        },
        "node": "me3_5"
        },
        {
        "type": "TextBox",
        "json": {
            "disabled": true,
            "name": "visitOther"
            },
        "node": "visitOther"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "whenvisit",
            "value": "weekdays"},
        "node": "me4_1"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "whenvisit",
            "value": "weekends"},
        "node": "me4_2"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "whenvisit",
            "value": "weekdays_and_weekends"},
        "node": "me4_3"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "ridehow",
            "value": "self"},
        "node": "me5_1"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "ridehow",
            "value": "otherperson"},
        "node": "me5_2"
        },
        {
        "type": "Textarea",
        "json": { 
            "rows": "2",  
            "cols": "25", 
            "style": "width:auto;", 
            "name": "comments"},
        "node": "comments"
        }
        ]
},
"moveEnvBusiness": {
    "confirm":  "{% spaceless %}{% include 'move_env_info_business.html' %}{% include 'infoConfirm.html' %}{% endspaceless %}",
    "confirmWidth": 350,
    "confirmHeight": 450,
    "info": "{% spaceless %}{% include 'move_env_info_business.html' %}{% include 'info_info.html' %}{% endspaceless %}",
    "infoWidth": 350,
    "infoHeight": 450,
    "formObjects": [
        {
        "type": "Form",
        "json": {},
        "node": "info"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "whattype",
            "value": "bank"},
        "node": "me1_1"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "whattype",
            "value": "health"},
        "node": "me1_2"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "whattype",
            "value": "hairddres_etc"},
        "node": "me1_3"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "whattype",
            "value": "other",
            "onChange": function(val) {
                    if(val) {
                        dojo.removeClass('otherSpan', 'tyhja');
                        dijit.byId('otherbusin').set('disabled', false);
                    }
                    else {
                        dojo.addClass('otherSpan', 'tyhja');
                        dijit.byId('otherbusin').set('disabled', true);
                    }
                }
        },
        "node": "me1_4"
        },
        {
        "type": "textBox",
        "json": { 
            "disabled": true,
            "name": "otherbusin"
        },
        "node": "otherbusin"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "howoften",
            "value": "daily"},
        "node": "me2_1"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "howoften",
            "value": "weekly"},
        "node": "me2_2"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "howoften",
            "value": "monthly"},
        "node": "me2_3"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "howoften",
            "value": "once_month"},
        "node": "me2_4"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "howoften",
            "value": "not_so_often"},
        "node": "me2_5"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "howvisit",
            "value": "walk"},
        "node": "me3_1"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "howvisit",
            "value": "bike"},
        "node": "me3_2"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "howvisit",
            "value": "car"},
        "node": "me3_3"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "howvisit",
            "value": "bus"},
        "node": "me3_4"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "howvisit",
            "value": "other",
            "onChange": function(val) {
                    if(val) {
                        dojo.removeClass('otherHowSpan', 'tyhja');
                        dijit.byId('visitOther').set('disabled', false);
                    }
                    else {
                        dojo.addClass('otherHowSpan', 'tyhja');
                        dijit.byId('visitOther').set('disabled', true);
                    }
                }
        },
        "node": "me3_5"
        },
        {
        "type": "TextBox",
        "json": {
            "disabled": true,
            "name": "visitOther"
            },
        "node": "visitOther"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "whenvisit",
            "value": "weekdays"},
        "node": "me4_1"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "whenvisit",
            "value": "weekends"},
        "node": "me4_2"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "whenvisit",
            "value": "weekdays_and_weekends"},
        "node": "me4_3"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "ridehow",
            "value": "self"},
        "node": "me5_1"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "ridehow",
            "value": "otherperson"},
        "node": "me5_2"
        },
        {
        "type": "Textarea",
        "json": { 
            "rows": "2",  
            "cols": "25", 
            "style": "width:auto;", 
            "name": "comments"},
        "node": "comments"
        }
        ]
},
"moveEnvExercise": {
    "confirm":  "{% spaceless %}{% include 'move_env_info_exercise.html' %}{% include 'infoConfirm.html' %}{% endspaceless %}",
    "confirmWidth": 350,
    "confirmHeight": 450,
    "info": "{% spaceless %}{% include 'move_env_info_exercise.html' %}{% include 'info_info.html' %}{% endspaceless %}",
    "infoWidth": 350,
    "infoHeight": 450,
    "formObjects": [
        {
        "type": "Form",
        "json": {},
        "node": "info"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "whattype",
            "value": "outdoor"},
        "node": "me1_1"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "whattype",
            "value": "exercise"},
        "node": "me1_2"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "whattype",
            "value": "playground"},
        "node": "me1_3"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "whattype",
            "value": "other",
            "onChange": function(val) {
                    if(val) {
                        dojo.removeClass('otherSpan', 'tyhja');
                        dijit.byId('otherexer').set('disabled', false);
                    }
                    else {
                        dojo.addClass('otherSpan', 'tyhja');
                        dijit.byId('otherexer').set('disabled', true);
                    }
                }
        },
        "node": "me1_4"
        },
        {
        "type": "textBox",
        "json": { 
            "disabled": true,
            "name": "otherexer"
        },
        "node": "otherexer"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "howoften",
            "value": "daily"},
        "node": "me2_1"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "howoften",
            "value": "weekly"},
        "node": "me2_2"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "howoften",
            "value": "monthly"},
        "node": "me2_3"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "howoften",
            "value": "once_month"},
        "node": "me2_4"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "howoften",
            "value": "not_so_often"},
        "node": "me2_5"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "howvisit",
            "value": "walk"},
        "node": "me3_1"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "howvisit",
            "value": "bike"},
        "node": "me3_2"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "howvisit",
            "value": "car"},
        "node": "me3_3"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "howvisit",
            "value": "bus"},
        "node": "me3_4"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "howvisit",
            "value": "other",
            "onChange": function(val) {
                    if(val) {
                        dojo.removeClass('otherHowSpan', 'tyhja');
                        dijit.byId('visitOther').set('disabled', false);
                    }
                    else {
                        dojo.addClass('otherHowSpan', 'tyhja');
                        dijit.byId('visitOther').set('disabled', true);
                    }
                }
        },
        "node": "me3_5"
        },
        {
        "type": "TextBox",
        "json": {
            "disabled": true,
            "name": "visitOther"
            },
        "node": "visitOther"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "whenvisit",
            "value": "weekdays"},
        "node": "me4_1"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "whenvisit",
            "value": "weekends"},
        "node": "me4_2"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "whenvisit",
            "value": "weekdays_and_weekends"},
        "node": "me4_3"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "ridehow",
            "value": "self"},
        "node": "me5_1"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "ridehow",
            "value": "otherperson"},
        "node": "me5_2"
        },
        {
        "type": "Textarea",
        "json": { 
            "rows": "2",  
            "cols": "25", 
            "style": "width:auto;", 
            "name": "comments"},
        "node": "comments"
        }
        ]
},
"moveEnvFreetime": {
    "confirm":  "{% spaceless %}{% include 'move_env_info_freetime.html' %}{% include 'infoConfirm.html' %}{% endspaceless %}",
    "confirmWidth": 350,
    "confirmHeight": 450,
    "info": "{% spaceless %}{% include 'move_env_info_freetime.html' %}{% include 'info_info.html' %}{% endspaceless %}",
    "infoWidth": 350,
    "infoHeight": 450,
    "formObjects": [
        {
        "type": "Form",
        "json": {},
        "node": "info"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "whattype",
            "value": "visit"},
        "node": "me1_1"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "whattype",
            "value": "restaurant"},
        "node": "me1_2"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "whattype",
            "value": "library"},
        "node": "me1_3"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "whattype",
            "value": "church"},
        "node": "me1_4"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "whattype",
            "value": "cottage"},
        "node": "me1_5"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "whattype",
            "value": "study"},
        "node": "me1_6"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "whattype",
            "value": "other",
            "onChange": function(val) {
                    if(val) {
                        dojo.removeClass('otherSpan', 'tyhja');
                        dijit.byId('otherfree').set('disabled', false);
                    }
                    else {
                        dojo.addClass('otherSpan', 'tyhja');
                        dijit.byId('otherfree').set('disabled', true);
                    }
                }
        },
        "node": "me1_7"
        },
        {
        "type": "textBox",
        "json": { 
            "disabled": true,
            "name": "otherfree"
        },
        "node": "otherfree"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "howoften",
            "value": "daily"},
        "node": "me2_1"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "howoften",
            "value": "weekly"},
        "node": "me2_2"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "howoften",
            "value": "monthly"},
        "node": "me2_3"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "howoften",
            "value": "once_month"},
        "node": "me2_4"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "howoften",
            "value": "not_so_often"},
        "node": "me2_5"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "howvisit",
            "value": "walk"},
        "node": "me3_1"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "howvisit",
            "value": "bike"},
        "node": "me3_2"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "howvisit",
            "value": "car"},
        "node": "me3_3"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "howvisit",
            "value": "bus"},
        "node": "me3_4"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "howvisit",
            "value": "other",
            "onChange": function(val) {
                    if(val) {
                        dojo.removeClass('otherHowSpan', 'tyhja');
                        dijit.byId('visitOther').set('disabled', false);
                    }
                    else {
                        dojo.addClass('otherHowSpan', 'tyhja');
                        dijit.byId('visitOther').set('disabled', true);
                    }
                }
        },
        "node": "me3_5"
        },
        {
        "type": "TextBox",
        "json": {
            "disabled": true,
            "name": "visitOther"
            },
        "node": "visitOther"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "whenvisit",
            "value": "weekdays"},
        "node": "me4_1"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "whenvisit",
            "value": "weekends"},
        "node": "me4_2"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "whenvisit",
            "value": "weekdays_and_weekends"},
        "node": "me4_3"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "ridehow",
            "value": "self"},
        "node": "me5_1"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "ridehow",
            "value": "otherperson"},
        "node": "me5_2"
        },
        {
        "type": "Textarea",
        "json": { 
            "rows": "2",  
            "cols": "25", 
            "style": "width:auto;", 
            "name": "comments"},
        "node": "comments"
        }
        ]
},
"moveEnvOther": {
    "confirm":  "{% spaceless %}{% include 'move_env_info_otherplace.html' %}{% include 'infoConfirm.html' %}{% endspaceless %}",
    "confirmWidth": 350,
    "confirmHeight": 450,
    "info": "{% spaceless %}{% include 'move_env_info_otherplace.html' %}{% include 'info_info.html' %}{% endspaceless %}",
    "infoWidth": 350,
    "infoHeight": 450,
    "formObjects": [
        {
        "type": "Form",
        "json": {},
        "node": "info"
        },
        {
        "type": "textBox",
        "json": { 
            "name": "otherpl"
        },
        "node": "otherpl"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "howoften",
            "value": "daily"},
        "node": "me2_1"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "howoften",
            "value": "weekly"},
        "node": "me2_2"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "howoften",
            "value": "monthly"},
        "node": "me2_3"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "howoften",
            "value": "once_month"},
        "node": "me2_4"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "howoften",
            "value": "not_so_often"},
        "node": "me2_5"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "howvisit",
            "value": "walk"},
        "node": "me3_1"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "howvisit",
            "value": "bike"},
        "node": "me3_2"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "howvisit",
            "value": "car"},
        "node": "me3_3"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "howvisit",
            "value": "bus"},
        "node": "me3_4"
        },
        {
        "type": "CheckBox",
        "json": { 
            "name": "howvisit",
            "value": "other",
            "onChange": function(val) {
                    if(val) {
                        dojo.removeClass('otherHowSpan', 'tyhja');
                        dijit.byId('visitOther').set('disabled', false);
                    }
                    else {
                        dojo.addClass('otherHowSpan', 'tyhja');
                        dijit.byId('visitOther').set('disabled', true);
                    }
                }
        },
        "node": "me3_5"
        },
        {
        "type": "TextBox",
        "json": {
            "disabled": true,
            "name": "visitOther"
            },
        "node": "visitOther"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "whenvisit",
            "value": "weekdays"},
        "node": "me4_1"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "whenvisit",
            "value": "weekends"},
        "node": "me4_2"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "whenvisit",
            "value": "weekdays_and_weekends"},
        "node": "me4_3"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "ridehow",
            "value": "self"},
        "node": "me5_1"
        },
        {
        "type": "RadioButton",
        "json": { 
            "name": "ridehow",
            "value": "otherperson"},
        "node": "me5_2"
        },
        {
        "type": "Textarea",
        "json": { 
            "rows": "2",  
            "cols": "25", 
            "style": "width:auto;", 
            "name": "comments"},
        "node": "comments"
        }
        ]
}
};

questionary.imageButton = {
"defaultbutton": { //sets all the default values here,
	"draw": "POINT",
	"buttontext": {
		"en":"",
		"fi":"",
		"sv":""
		},
	"xoffset": 0, //according to the placemarker
	"yoffset": 15, //according to the placemarker
	"xsize": 23, //according to image size for placemarker
	"ysize": 36,
	"classtype": "point", //added as a class, good for css rules and outlook
	"placeMark": "{{ MEDIA_URL }}img/placemarks/pointorange.png",
	"cursorImg":"{{ MEDIA_URL }}img/cursors/point.cur",
	"graphicAttr": {
		"id": "default",
		"infotype": "default",
		"valuename": "default",
		"max": 3,
		"rgb": [200,92,92]
		},
	"graphicStrings": {
		"fi": {
			"header": "<h2>Paikka</h2>",
			"question": "Menikö piste oikeaan kohtaan?",
			"polylinequestion": "Menikö reitti oikeaan kohtaan?",
			"positive": "Kyllä, tallenna kohde",
			"polylinepositive": "Tallenna reitti",
			"negative": "Ei, poista kohde",
			"polylinenegative": "Poista reitti",
			"remove": "Poista kohde",
			"polylineremove": "Poista reitti",
			"change": "Muuta kohteen paikkaa",
			"close": "Sulje ikkuna",
			"save": "Tallenna kohde",
			"many": "Useammalla välineellä",
			"tellmore": "Kerro lisää paikasta:",
			"walk": "jalkaisin",
			"bike": "pyöräillen",
			"public": "Julkisilla",
			"car": "Autolla",
			"runorjog": "juosten tai hölkäten",
			"skate": "rullaluistimilla",
			"other": "muuten",
			"comments": "Muuta kerrottavaa tästä reitistä?"
			},
		"en": {
			"header": "<h2>Place</h2>",
			"question": "is the mark in the right place",
			"positive": "Yes, save place",
			"negative": "No, remove place",
			"change": "Change place",
			"close": "Close window"
			},
		"sv": {
			"header": "<h2>Ställe</h2>",
			"question": "Kom punkten på rätt ställe?",
			"polylinequestion": "Kom rutten på rätt ställe?",
			"positive": "Ja, spara objektet",
			"polylinepositive": "Spara rutten",
			"negative": "Nej, ta bort stället",
			"polylinenegative": "Ta bort stället",
			"remove": "Ta bort objektet",
			"polylineremove": "Ta bort rutten",
			"change": "Flytta på objektet",
			"close": "Stäng fönstret",
			"save": "Spara objektet",
			"many": "Med flera medel",
			"tellmore": "Berätta mer om stället:",
			"walk": "Till fots",
			"bike": "Med cykel",
			"public": "Med kollektivtrafiken",
			"car": "Med bil",
			"comments": "Annat som du vill berätta om den här rutten?"
			}
		}
},
"home": {
        "buttontext": {"en":"Home","fi":"Koti", "sv":"Hem"},
        "classtype": "big",
        "placeMark": "{{ MEDIA_URL }}img/placemarks/pointgreen.png",
        "cursorImg":"{{ MEDIA_URL }}img/cursors/home.cur",
        "graphicAttr": {
                    "id": "home",
                    "valuename": "home",
                    "infotype": "home",
                    "max": 1
        },
        "graphicStrings": {
                    "fi": {"header": "<h2>Koti</h2>"
                            },
                    "en": {"header": "<h2>Place of happiness</h2>",
                            "question": "is the place of happiness in the right place"
                            },
                    "sv": {"header": "<h2>Smultronstället i Tammelund</h2>"
                        }
        }
},
"work": {
        "placeMark": "{{ MEDIA_URL }}img/placemarks/atmosphere.png",
        "classtype": "moveEnvironment",
        "graphicAttr": {
                    "id": "work",
                    "valuename": "work",
                    "infotype": "moveEnvWork"
        },
        "graphicStrings": {
                    "fi": { "header": "<h2>Työ, opiskelu, päivähoito</h2>",
                            "typetext": "työ-, opiskelu-, päivähoitopaikka",
                            "type1": "oma työpaikka",
                            "type2": "perheenjäsenen työpaikka",
                            "type3": "lapsen päivähoitopaikka tai koulu",
                            "type4": "koulu tai opiskelupaikka",
                            "type5": "työhön liittyvä asiointipaikka",
                            "type6": "muu",
                            "extraText": "Lisätietoja tästä paikasta"
                            },
                    "en": {"header": "<h2>Quiet and calm place</h2>"
                            },
                    "sv": {"header": "<h2>Tyst och lugnt</h2>"

                        }
        }
},
"shop": {
        "placeMark": "{{ MEDIA_URL }}img/placemarks/atmosphere.png",
        "classtype": "moveEnvironment",
        "graphicAttr": {
                    "id": "shop",
                    "valuename": "shop",
                    "infotype": "moveEnvShop"
        },
        "graphicStrings": {
                    "fi": { "header": "<h2>Ostospaikka</h2>",
                            "typetext": "ostospaikka",
                            "type1": "lähikauppa",
                            "type2": "super- tai hypermarket",
                            "type3": "kauppakeskus tai tavaratalo",
                            "type4": "erikoiskauppa",
                            "type5": "muu",
                            "extraText": "Miksi käyt ostoksilla juuri täällä?"
                            },
                    "en": {"header": "<h2>Quiet and calm place</h2>"
                            },
                    "sv": {"header": "<h2>Tyst och lugnt</h2>"

                        }
        }
},
"business": {
        "placeMark": "{{ MEDIA_URL }}img/placemarks/atmosphere.png",
        "classtype": "moveEnvironment",
        "graphicAttr": {
                    "id": "business",
                    "valuename": "business",
                    "max": 100,
                    "infotype": "moveEnvBusiness"
        },
        "graphicStrings": {
                    "fi": { "header": "<h2>Asiointipaikka</h2>",
                            "typetext": "asiointipaikka",
                            "type1": "pankki, posti tai virasto",
                            "type2": "terveyspalvelut",
                            "type3": "muu palvelu, esim. kampaaja tai parturi",
                            "type4": "muu",
                            "extraText": "Miksi asioit juuri täällä?"
                            },
                    "en": {"header": "<h2>Quiet and calm place</h2>"
                            },
                    "sv": {"header": "<h2>Tyst och lugnt</h2>"

                        }
        }
},
"exercise": {
        "placeMark": "{{ MEDIA_URL }}img/placemarks/atmosphere.png",
        "classtype": "moveEnvironment",
        "graphicAttr": {
                    "id": "exercise",
                    "valuename": "exercise",
                    "max": 100,
                    "infotype": "moveEnvExercise"
        },
        "graphicStrings": {
                    "fi": { "header": "<h2>Liikunta ja ulkoilu</h2>",
                            "typetext": "liikunta- tai ulkoilupaikka",
                            "type1": "ulkoilupaikka",
                            "type2": "liikuntapaikka",
                            "type3": "leikkipuisto",
                            "type4": "muu",
                            "extraText": "Miksi liikut ja ulkoilet juuri täällä?"
                            },
                    "en": {"header": "<h2>Quiet and calm place</h2>"
                            },
                    "sv": {"header": "<h2>Tyst och lugnt</h2>"

                        }
        }
},
"freetime": {
        "placeMark": "{{ MEDIA_URL }}img/placemarks/atmosphere.png",
        "classtype": "moveEnvironment",
        "graphicAttr": {
                    "id": "freetime",
                    "valuename": "freetime",
                    "max": 100,
                    "infotype": "moveEnvFreetime"
        },
        "graphicStrings": {
                    "fi": { "header": "<h2>Vapaa-aika</h2>",
                            "typetext": "vapaa-ajanpaikka",
                            "type1": "vierailupaikka",
                            "type2": "ravintola, kahvila",
                            "type3": "kirjasto",
                            "type4": "kirkko, seurakuntatoiminta",
                            "type5": "kesämökki, vapaa-ajan asunto",
                            "type6": "työväenopisto tms.",
                            "type7": "muu",
                            "extraText": "Miksi vietät vapaa-aikaa juuri täällä?"
                            },
                    "en": {"header": "<h2>Quiet and calm place</h2>"
                            },
                    "sv": {"header": "<h2>Tyst och lugnt</h2>"

                        }
        }
},
"otherplace": {
        "placeMark": "{{ MEDIA_URL }}img/placemarks/atmosphere.png",
        "classtype": "moveEnvironment",
        "graphicAttr": {
                    "id": "otherplace",
                    "valuename": "otherplace",
                    "max": 100,
                    "infotype": "moveEnvOther"
        },
        "graphicStrings": {
                    "fi": { "header": "<h2>Muu paikka</h2>",
                            "typetext": "muu paikka",
                            "type1": "Minkätyyppinen paikka on kyseessä?",
                            "extraText": "Lisätietoja tästä paikasta"
                            },
                    "en": {"header": "<h2>Quiet and calm place</h2>"
                            },
                    "sv": {"header": "<h2>Tyst och lugnt</h2>"

                        }
        }
},

"happiness": {
		"buttontext": {"en":"Happiness","fi":"Mielipaikka", "sv":"Smultronställe"},
		"classtype": "big",
		"placeMark": "{{ MEDIA_URL }}img/placemarks/pointyellow.png",
		"cursorImg":"{{ MEDIA_URL }}img/cursors/happiness.cur",
		"graphicAttr": {
					"id": "happiness",
					"valuename": "happiness",
					"infotype": "other",
					"max": 1
		},
		"graphicStrings": {
					"fi": {"header": "<h2>Mielipaikka Tammisalossa</h2>"
							},
					"en": {"header": "<h2>Place of happiness</h2>",
							"question": "is the place of happiness in the right place"
							},
					"sv": {"header": "<h2>Smultronstället i Tammelund</h2>"
						}
		}
},
"plannedmeeting": {
		"graphicAttr": {
					"id": "plannedmeeting",
					"valuename": "plannedmeeting"
		},
		"graphicStrings": {
					"fi": {"header": "<h2>Suunniteltu kohtaaminen</h2>"
							},
					"en": {"header": "<h2>place for planned meetings</h2>"
							},
					"sv": {"header": "<h2>Planerat möte</h2>"
						}
		}
},
"notplannedmeeting": {
		"graphicAttr": {
					"id": "notplannedmeeting",
					"valuename": "notplannedmeeting"
		},
		"graphicStrings": {
					"fi": {"header": "<h2>Suunnittelematon kohtaaminen</h2>"
							},
					"en": {"header": "<h2>place for planned meetings</h2>"
							},
					"sv": {"header": "<h2>Oplanerat möte</h2>"
						}
		}
},
"placeforyouth": {
		"graphicAttr": {
					"id": "placeforyouth",
					"valuename": "placeforyouth"
		},
		"graphicStrings": {
					"fi": {"header": "<h2>Nuorten paikka</h2>"
							},
					"en": {"header": "<h2>place for the youth</h2>"
							},
					"sv": {"header": "<h2>Ställe för ungdomar</h2>"
						}
		}
},
"placeforold": {
		"graphicAttr": {
					"id": "placeforold",
					"valuename": "placeforold"
		},
		"graphicStrings": {
					"fi": {"header": "<h2>Vanhusten paikka</h2>"
							},
					"en": {"header": "<h2>place for the old</h2>"
							},
					"sv": {"header": "<h2>Ställe för seniorer</h2>"
						}
		}
},
"placeforchild": {
		"graphicAttr": {
					"id": "placeforchild",
					"valuename": "placeforchild"
		},
		"graphicStrings": {
					"fi": {"header": "<h2>Lasten paikka</h2>"
							},
					"en": {"header": "<h2>place for the children</h2>"
							},
					"sv": {"header": "<h2>Ställe för barn</h2>"
						}
		}
},
"importantroute": {
        "draw": "POLYLINE",
        "classtype": "big twoLine",
        "buttontext": {"en":"Pleasant route","fi":"tärkeä jalankulku- tai <br />pyöräilyreitti", "sv":"Angenäm rutt"},
        "cursorImg":"{{ MEDIA_URL }}img/cursors/route.cur",
        "graphicAttr": {
                    "id": "importantroute",
                    "infotype": "routes",
                    "max": 100,
                    "valuename": "importantroute",
                    "rgb": [152,10,211],
                    "question": "Miten yleensä liikut tällä reitillä?"
        },
        "graphicStrings": {
                    "fi": {"header": "<h2>Tärkeä kävely- tai<br /> pyöräreitti</h2>",
                           "extraText": "Lisätietoja reitistä:"
                            },
                    "en": {"header": "<h2>pleasant route</h2>",
                            "question": "is the route in the right place",
                            "positive": "Yes, save route",
                            "negative": "No, remove route"
                            },
                    "sv": {"header": "<h2>Angenäm rutt</h2>"
                        }
        }
},
"pleasantroute": {
		"draw": "POLYLINE",
		"classtype": "big",
		"buttontext": {"en":"Pleasant route","fi":"Miellyttävä reitti", "sv":"Angenäm rutt"},
		"cursorImg":"{{ MEDIA_URL }}img/cursors/miellyttavareitti.cur",
		"graphicAttr": {
					"id": "pleasantroute",
					"infotype": "routes",
					"valuename": "pleasantroute",
					"rgb": [152,10,211],
					"question": "Miten yleensä liikut tällä reitillä?"
		},
		"graphicStrings": {
					"fi": {"header": "<h2>Miellyttävä kävely- tai pyöräreitti</h2>",
					       "extraText": "Lisätietoja reitistä:"
							},
					"en": {"header": "<h2>pleasant route</h2>",
							"question": "is the route in the right place",
							"positive": "Yes, save route",
							"negative": "No, remove route"
							},
					"sv": {"header": "<h2>Angenäm rutt</h2>"
						}
		}
},
"unpleasantroute": {
		"draw": "POLYLINE",
		"classtype": "big",
		"buttontext": {"en":"Unpleasant route","fi":"Epämiellyttävä reitti", "sv":"Oangenäm rutt"},
		"cursorImg":"{{ MEDIA_URL }}img/cursors/epamiellyttavareitti.cur",
		"graphicAttr": {
					"id": "unpleasantroute",
					"infotype": "routes",
					"valuename": "unpleasantroute",
					"rgb": [203,21,21],
                    "question": "Miten yleensä liikut tällä reitillä?"
		},
		"graphicStrings": {
					"fi": {"header": "<h2>Epämiellyttävä kävely- tai pyöräreitti</h2>",
                            "extraText": "Lisätietoja reitistä:",
                            "question": "menikö reitti oikeaan kohtaan?",
							"positive": "Kyllä, tallenna reitti",
							"negative": "Ei, poista reitti",
							"change": "Muuta reitin paikkaa"
							},
					"en": {"header": "<h2>unpleasant route</h2>",
							"question": "is the route in the right place",
							"positive": "Yes, save route",
							"negative": "No, remove route",
							"change": "Change route"
							},
					"sv": {"header": "<h2>Oangenäm rutt</h2>",
							"question": "Kom rutten på rätt ställe?",
							"positive": "Ja, spara rutten",
							"negative": "Nej, ta bort rutten",
							"change": "Ändra på ruttens placering"
						}
		}
},
"atmospherePlus": {
        "buttontext": {"en":"Positive","fi":"Myönteinen", "sv":"Positiv"},
        "classtype": "positive",
                "xoffset": 0, //according to the placemarker
                "yoffset": 18, //according to the placemarker
                "xsize": 31, //according to image size for placemarker
                "ysize": 42,
        "placeMark": "{{ MEDIA_URL }}img/placemarks/point_positive.png",
        "cursorImg":"{{ MEDIA_URL }}img/cursors/point.cur",
        "graphicAttr": {
                    "id": "atmospherePlus",
                    "valuename": "atmosPlus",
                    "infotype": "pos_atmos",
                    "max": 100
        },
        "graphicStrings": {
                    "fi": {"header": "<h2>Kerro paikan tunnelmasta tarkemmin! Tämä paikka on...</h2>"
                            },
                    "en": {"header": "<h2></h2>",
                            "question": ""
                            },
                    "sv": {"header": "<h2>Berätta mera om stämningen på denna plats! Det här stället är...</h2>"
                        }
        }
},
"atmosphereMinus": {
        "buttontext": {"en":"Negative","fi":"Kielteinen", "sv":"Negativ"},
        "classtype": "negative",
                "xoffset": 0, //according to the placemarker
                "yoffset": 18, //according to the placemarker
                "xsize": 31, //according to image size for placemarker
                "ysize": 42,
        "placeMark": "{{ MEDIA_URL }}img/placemarks/point_negative.png",
        "cursorImg":"{{ MEDIA_URL }}img/cursors/point.cur",
        "graphicAttr": {
                    "id": "atmosphereMinus",
                    "valuename": "atmosMinus",
                    "infotype": "neg_atmos",
                    "max": 100
        },
        "graphicStrings": {
                    "fi": {"header": "<h2><h2>Kerro paikan tunnelmasta tarkemmin! Tämä paikka on...</h2></h2>"
                            },
                    "en": {"header": "<h2></h2>",
                            "question": ""
                            },
                    "sv": {"header": "<h2>Berätta mera om stämningen på denna plats! Det här stället är...</h2>"
                        }
        }
},
"functionalPlus": {
        "buttontext": {"en":"Positive","fi":"Myönteinen", "sv":"Positiv"},
        "classtype": "positive",
                "xoffset": 0, //according to the placemarker
                "yoffset": 18, //according to the placemarker
                "xsize": 31, //according to image size for placemarker
                "ysize": 42,
        "placeMark": "{{ MEDIA_URL }}img/placemarks/point_positive.png",
        "cursorImg":"{{ MEDIA_URL }}img/cursors/point.cur",
        "graphicAttr": {
                    "id": "functionalPlus",
                    "valuename": "funcPlus",
                    "infotype": "pos_activ",
                    "max": 100
        },
        "graphicStrings": {
                    "fi": {"header": "<h2>Kerro paikan toimintamahdollisuuksista tarkemmin! Tässä paikassa...</h2>"
                            },
                    "en": {"header": "<h2></h2>",
                            "question": ""
                            },
                    "sv": {"header": "<h2>Berätta mera om det här ställets funktionalitet...</h2>"
                        }
        }
},
"functionalMinus": {
        "buttontext": {"en":"Negative","fi":"Kielteinen", "sv":"Negativ"},
        "classtype": "negative",
                "xoffset": 0, //according to the placemarker
                "yoffset": 18, //according to the placemarker
                "xsize": 31, //according to image size for placemarker
                "ysize": 42,
        "placeMark": "{{ MEDIA_URL }}img/placemarks/point_negative.png",
        "cursorImg":"{{ MEDIA_URL }}img/cursors/point.cur",
        "graphicAttr": {
                    "id": "functionalMinus",
                    "valuename": "funcMinus",
                    "infotype": "neg_activ",
                    "max": 100
        },
        "graphicStrings": {
                    "fi": {"header": "<h2>Kerro paikan toimintamahdollisuuksista tarkemmin! Tässä paikassa...</h2>"
                            },
                    "en": {"header": "<h2></h2>",
                            "question": ""
                            },
                    "sv": {"header": "<h2>Berätta mera om det här ställets funktionalitet...</h2>"
                        }
        }
},
"socialPlus": {
        "buttontext": {"en":"Positive","fi":"Myönteinen", "sv":"Positiv"},
        "classtype": "positive",
                "xoffset": 0, //according to the placemarker
                "yoffset": 18, //according to the placemarker
                "xsize": 31, //according to image size for placemarker
                "ysize": 42,
        "placeMark": "{{ MEDIA_URL }}img/placemarks/point_positive.png",
        "cursorImg":"{{ MEDIA_URL }}img/cursors/point.cur",
        "graphicAttr": {
                    "id": "socialPlus",
                    "valuename": "sociaPlus",
                    "infotype": "pos_social",
                    "max": 100
        },
        "graphicStrings": {
                    "fi": {"header": "<h2>Kerro sosiaalisesta ilmapiiristä tarkemmin! Tässä paikassa...</h2>"
                            },
                    "en": {"header": "<h2></h2>",
                            "question": ""
                            },
                    "sv": {"header": "<h2>Berätta mera om sociala stämningen på detta ställe...</h2>"
                        }
        }
},
"socialMinus": {
        "buttontext": {"en":"Negative","fi":"Kielteinen", "sv":"Negativ"},
        "classtype": "negative",
                "xoffset": 0, //according to the placemarker
                "yoffset": 18, //according to the placemarker
                "xsize": 31, //according to image size for placemarker
                "ysize": 42,
        "placeMark": "{{ MEDIA_URL }}img/placemarks/point_negative.png",
        "cursorImg":"{{ MEDIA_URL }}img/cursors/point.cur",
        "graphicAttr": {
                    "id": "socialMinus",
                    "valuename": "sociaMinus",
                    "infotype": "neg_social",
                    "max": 100
        },
        "graphicStrings": {
                    "fi": {"header": "<h2>Kerro sosiaalisesta ilmapiiristä tarkemmin! Tässä paikassa...</h2>"
                            },
                    "en": {"header": "<h2></h2>",
                            "question": ""
                            },
                    "sv": {"header": "<h2>Berätta mera om sociala stämningen på detta ställe...</h2>"
                        }
        }
},
"appearancePlus": {
        "buttontext": {"en":"Positive","fi":"Myönteinen", "sv":"Positiv"},
        "classtype": "positive",
                "xoffset": 0, //according to the placemarker
                "yoffset": 18, //according to the placemarker
                "xsize": 31, //according to image size for placemarker
                "ysize": 42,
        "placeMark": "{{ MEDIA_URL }}img/placemarks/point_positive.png",
        "cursorImg":"{{ MEDIA_URL }}img/cursors/point.cur",
        "graphicAttr": {
                    "id": "appearancePlus",
                    "valuename": "appeaPlus",
                    "infotype": "pos_aesth",
                    "max": 100
        },
        "graphicStrings": {
                    "fi": {"header": "<h2>Kerro paikan ulkoisesta ilmeestä tarkemmin! Tässä paikassa...</h2>"
                            },
                    "en": {"header": "<h2></h2>",
                            "question": ""
                            },
                    "sv": {"header": "<h2>Berätta mera om det här ställets uttryck...</h2>"
                        }
        }
},
"appearanceMinus": {
        "buttontext": {"en":"Negative","fi":"Kielteinen", "sv":"Negativ"},
        "classtype": "negative",
                "xoffset": 0, //according to the placemarker
                "yoffset": 18, //according to the placemarker
                "xsize": 31, //according to image size for placemarker
                "ysize": 42,
        "placeMark": "{{ MEDIA_URL }}img/placemarks/point_negative.png",
        "cursorImg":"{{ MEDIA_URL }}img/cursors/point.cur",
        "graphicAttr": {
                    "id": "appearanceMinus",
                    "valuename": "appeaMinus",
                    "infotype": "neg_aesth",
                    "max": 100
        },
        "graphicStrings": {
                    "fi": {"header": "<h2>Kerro paikan ulkoisesta ilmeestä tarkemmin! Tässä paikassa...</h2>"
                            },
                    "en": {"header": "<h2></h2>",
                            "question": ""
                            },
                    "sv": {"header": "<h2>Berätta mera om det här ställets uttryck...</h2>"
                        }
        }
},
"preserve_point_area": {
        "buttontext": {"en":"object to be preserved","fi":"säilytettävä kohde", "sv":"objekt som borde sparas"},
        "classtype": "big",
        "placeMark": "{{ MEDIA_URL }}img/placemarks/pointdarkbrown.png",
        "cursorImg":"{{ MEDIA_URL }}img/cursors/preservepoint.cur",
        "graphicAttr": {
                    "id": "preserve_point_area",
                    "valuename": "presPoint",
                    "infotype": "other",
                    "max": 3
        },
        "graphicStrings": {
                    "fi": {"header": "<h2>Säilytettävä kohde tai alue</h2>",
                           "tellmore": "Voit halutessasi kertoa lisää paikasta."
                            },
                    "en": {"header": "<h2>Object to be preserved</h2>"
                            },
                    "sv": {"header": "<h2>Objekt som borde sparas</h2>"
                        }
        }
},
"improve_point_area": {
        "buttontext": {"en":"place to be improved","fi":"tulisi kohentaa", "sv":"objekt som borde förbättras"},
        "classtype": "big",
        "placeMark": "{{ MEDIA_URL }}img/placemarks/pointlightergreen.png",
        "cursorImg":"{{ MEDIA_URL }}img/cursors/improveplace.cur",
        "graphicAttr": {
                    "id": "improve_point_area",
                    "valuename": "imprPoint",
                    "infotype": "other",
                    "max": 3
        },
        "graphicStrings": {
                    "fi": {"header": "<h2>Kohentamisehdotuksesi</h2>",
                           "tellmore": "Miten tätä paikkaa pitäisi kohentaa?"
                            },
                    "en": {"header": "<h2>Place to be improved</h2>"
                            },
                    "sv": {"header": "<h2>Objekt som borde förbättras</h2>"
                        }
        }
},
"remove_object": {
        "buttontext": {"en":"object to be removed","fi":"tulisi poistaa", "sv":"objekt som borde tas bort"},
        "classtype": "big",
        "placeMark": "{{ MEDIA_URL }}img/placemarks/pointred.png",
        "cursorImg":"{{ MEDIA_URL }}img/cursors/removepoint.cur",
        "graphicAttr": {
                    "id": "remove_object",
                    "valuename": "removeObj",
                    "infotype": "other",
                    "max": 3
        },
        "graphicStrings": {
                    "fi": {"header": "<h2>Poistamisehdotuksesi</h2>",
                           "tellmore": "Mitä poistaisit tästä paikasta?"
                            },
                    "en": {"header": "<h2>Object to be removed</h2>"
                            },
                    "sv": {"header": "<h2>Objekt som borde tas bort</h2>"
                        }
        }
},
"new_building": {
        "buttontext": {"en":"new building","fi":"uusi rakennus", "sv":"ny byggnad"},
        "classtype": "big",
        "placeMark": "{{ MEDIA_URL }}img/placemarks/pointlila.png",
        "cursorImg":"{{ MEDIA_URL }}img/cursors/newbuilding.cur",
        "graphicAttr": {
                    "id": "new_building",
                    "valuename": "newBuild",
                    "infotype": "other",
                    "max": 3
        },
        "graphicStrings": {
                    "fi": {"header": "<h2>Rakentamisehdotuksesi</h2>",
                           "tellmore": "Mitä uutta tähän mielestäsi pitäisi rakentaa?"
                            },
                    "en": {"header": "<h2>New building</h2>"
                            },
                    "sv": {"header": "<h2>Ny byggnad</h2>"
                        }
        }
},
"new_improve_route": {
        "draw": "POLYLINE",
        "buttontext": {"en":"new route","fi":"uusi jalankulku- tai pyöräreitti", "sv":"ny rutt"},
        "classtype": "big long",
        "cursorImg":"{{ MEDIA_URL }}img/cursors/route.cur",
        "graphicAttr": {
                    "id": "new_improve_route",
                    "valuename": "newRoute",
                    "infotype": "newRoutes",
                    "max": 3,
                    "rgb": [0,0,255]
        },
        "graphicStrings": {
                    "fi": {"header": "<h2>Reittiehdotuksesi</h2>",
                           "tellmore": "Millaista reittiä toivot tähän paikkaan?"
                            },
                    "en": {"header": "<h2>New route</h2>"
                            },
                    "sv": {"header": "<h2>Ny rutt</h2>"
                        }
        }
},
"new_transport_route": {
        "draw": "POLYLINE",
        "buttontext": {"en":"area to be improved","fi":"uusi joukkoliikenneyhteys", "sv":"objekt som borde förbättras"},
        "classtype": "big long",
        "cursorImg":"{{ MEDIA_URL }}img/cursors/route.cur",
        "graphicAttr": {
                    "id": "new_transport_route",
                    "valuename": "newtrRoute",
                    "infotype": "newRoutes",
                    "max": 3,
                    "rgb": [0,255,0]
                    //"rgb": [205,225,170]
        },
        "graphicStrings": {
                    "fi": {"header": "<h2>Ehdotuksesi uudeksi joukkoliikenneyhteydeksi</h2>",
                           "tellmore": "Millaista joukkoliikennelinjaa toivoisit tänne?"
                            },
                    "en": {"header": "<h2>Area to be improved</h2>"
                            },
                    "sv": {"header": "<h2>Objekt som borde förbättras</h2>"
                        }
        }
},
"missingroute": {
		"draw": "POLYLINE",
		"classtype": "big",
		"buttontext": {"en":"Missing route","fi":"Puuttuva reitti", "sv":"Rutt som saknas"},
		"cursorImg":"{{ MEDIA_URL }}img/cursors/reitti.cur",
		"graphicAttr": {
					"id": "missingroute",
					"infotype":"polyline",
					"valuename": "missingroute",
					"rgb": [77,115,255],
					"question": "Millä välineellä kuljet tavallisesti tätä reittiä?"
		},
		"graphicStrings": {
					"fi": {"header": "<h2>Puuttuva reitti</h2>",
							"polylinepositive": "Kyllä, tallenna reitti",
							"polylinenegative": "Ei, poista reitti"
							},
					"en": {"header": "<h2>missing route</h2>",
							"question": "is the route in the right place",
							"positive": "Yes, save route",
							"negative": "No, remove route",
							"change": "Change route"
							},
					"sv": {"header": "<h2>Rutt som saknas</h2>",
							"polylinepositive": "Ja, spara rutten",
							"polylinenegative": "Nej, ta bort rutten"
						}
		}
},
"quietcalm": {
		"placeMark": "{{ MEDIA_URL }}img/placemarks/atmosphere.png",
		"classtype": "atmosphere",
		"graphicAttr": {
					"id": "quietcalm",
					"valuename": "quietcalm"
		},
		"graphicStrings": {
					"fi": {"header": "<h2>Hiljaista ja Rauhallista</h2>"
							},
					"en": {"header": "<h2>Quiet and calm place</h2>"
							},
					"sv": {"header": "<h2>Tyst och lugnt</h2>"

						}
		}
},
"restlessnoisy": {
		"placeMark": "{{ MEDIA_URL }}img/placemarks/atmosphere.png",
		"classtype": "atmosphere",
		"graphicAttr": {
					"id": "restlessnoisy",
					"valuename": "restlessnoisy"
		},
		"graphicStrings": {
					"fi": {"header": "<h2>Rauhaton ja meluisaa</h2>"
							},
					"en": {"header": "<h2>Restless and noisy</h2>",
							"question": "is the mark in the right place",
							"positive": "Yes, save place",
							"negative": "No, remove place",
							"change": "Change place"
							},
					"sv": {"header": "<h2>Oroligt och bullrigt</h2>"

						}
		}
},
"dangeroustraffic": {
		"placeMark": "{{ MEDIA_URL }}img/placemarks/atmosphere.png",
		"classtype": "atmosphere",
		"graphicAttr": {
					"id": "dangeroustraffic",
					"valuename": "dangeroustraffic"
		},
		"graphicStrings": {
					"fi": {"header": "<h2>Liikenteellisesti vaarallinen</h2>"
							},
					"en": {"header": "<h2>Dangerous traffic</h2>",
							"question": "is the mark in the right place",
							"positive": "Yes, save place",
							"negative": "No, remove place",
							"change": "Change place"
							},
					"sv": {"header": "<h2>Trafikmässigt farligt</h2>"

						}
		}
},
"socialunsafe": {
		"placeMark": "{{ MEDIA_URL }}img/placemarks/atmosphere.png",
		"classtype": "atmosphere",
		"graphicAttr": {
					"id": "socialunsafe",
					"valuename": "socialunsafe"
		},
		"graphicStrings": {
					"fi": {"header": "<h2>Sosiaalisesti turvatonta</h2>"
							},
					"en": {"header": "<h2>Dangerous traffic</h2>",
							"question": "is the mark in the right place",
							"positive": "Yes, save place",
							"negative": "No, remove place",
							"change": "Change place"
							},
					"sv": {"header": "<h2>Socialt otryggt</h2>"
						}
		}
},
"beautifulwelcoming": {
		"placeMark": "{{ MEDIA_URL }}img/placemarks/atmosphere.png",
		"classtype": "atmosphere",
		"graphicAttr": {
					"id": "beautifulwelcoming",
					"valuename": "beautifulwelcoming"
		},
		"graphicStrings": {
					"fi": {"header": "<h2>Kaunista ja viihtyisää</h2>"
							},
					"en": {"header": "<h2>Dangerous traffic</h2>",
							"question": "is the mark in the right place",
							"positive": "Yes, save place",
							"negative": "No, remove place",
							"change": "Change place"
							},
					"sv": {"header": "<h2>Vackert och trivsamt</h2>"
						}
		}
},
"uncleanrepelling": {
		"placeMark": "{{ MEDIA_URL }}img/placemarks/atmosphere.png",
		"classtype": "atmosphere",
		"graphicAttr": {
					"id": "uncleanrepelling",
					"valuename": "uncleanrepelling"
		},
		"graphicStrings": {
					"fi": {"header": "<h2>Epäsiistiä ja luotaan työntävää</h2>"
							},
					"en": {"header": "<h2>Dangerous traffic</h2>",
							"question": "is the mark in the right place",
							"positive": "Yes, save place",
							"negative": "No, remove place",
							"change": "Change place"
							},
					"sv": {"header": "<h2>Osnyggt och frånstötande</h2>"
						}
		}
},
"niceview": {
		"placeMark": "{{ MEDIA_URL }}img/placemarks/atmosphere.png",
		"classtype": "atmosphere",
		"graphicAttr": {
					"id": "niceview",
					"valuename": "niceview"
		},
		"graphicStrings": {
					"fi": {"header": "<h2>Upeat näkymät</h2>"
							},
					"en": {"header": "<h2>Dangerous traffic</h2>",
							"question": "is the mark in the right place",
							"positive": "Yes, save place",
							"negative": "No, remove place",
							"change": "Change place"
							},
					"sv": {"header": "<h2>Fina utsikter</h2>"
						}
		}
},
"forestfeeling": {
		"placeMark": "{{ MEDIA_URL }}img/placemarks/atmosphere.png",
		"classtype": "atmosphere",
		"graphicAttr": {
					"id": "forestfeeling",
					"valuename": "forestfeeling"
		},
		"graphicStrings": {
					"fi": {"header": "<h2>Metsäinen tunnelma</h2>"
							},
					"en": {"header": "<h2>Dangerous traffic</h2>",
							"question": "is the mark in the right place",
							"positive": "Yes, save place",
							"negative": "No, remove place",
							"change": "Change place"
							},
					"sv": {"header": "<h2>Skogsstämning</h2>"

						}
		}
},
"historyimportant": {
		"placeMark": "{{ MEDIA_URL }}img/placemarks/atmosphere.png",
		"classtype": "atmosphere",
		"graphicAttr": {
					"id": "historyimportant",
					"valuename": "historyimportant"
		},
		"graphicStrings": {
					"fi": {"header": "<h2>Historiallisesti merkittävää</h2>"
							},
					"en": {"header": "<h2>Dangerous traffic</h2>",
							"question": "is the mark in the right place",
							"positive": "Yes, save place",
							"negative": "No, remove place",
							"change": "Change place"
							},
					"sv": {"header": "<h2>Historiskt betydelsefullt</h2>"

						}
		}
},
"beautifulbuilt": {
		"placeMark": "{{ MEDIA_URL }}img/placemarks/atmosphere.png",
		"classtype": "atmosphere",
		"graphicAttr": {
					"id": "beautifulbuilt",
					"valuename": "beautifulbuilt"
		},
		"graphicStrings": {
					"fi": {"header": "<h2>Kauniisti rakennettua</h2>"
							},
					"en": {"header": "<h2>Dangerous traffic</h2>"
							},
					"sv": {"header": "<h2>Vacker bebyggelse</h2>"

						}
		}
},
"importantnature": {
		"placeMark": "{{ MEDIA_URL }}img/placemarks/atmosphere.png",
		"classtype": "atmosphere",
		"graphicAttr": {
					"id": "importantnature",
					"valuename": "importantnature"
		},
		"graphicStrings": {
					"fi": {"header": "<h2>Tärkeä luontokohde</h2>"
							},
					"en": {"header": "<h2>Dangerous traffic</h2>"
							},
					"sv": {"header": "<h2>Viktigt naturobjekt</h2>"
						}
		}

},
"otheratmosphere": {
		"placeMark": "{{ MEDIA_URL }}img/placemarks/atmosphere.png",
		"classtype": "atmosphere",
		"graphicAttr": {
					"id": "otheratmosphere",
					"valuename": "otheratmosphere",
					"infotype": "other"
		},
		"graphicStrings": {
					"fi": {"header": "<h2>Muu tunnelmaan liittyvä asia</h2>"
							},
					"en": {"header": "<h2>Other</h2>"
							},
					"sv": {"header": "<h2>Annan stämningsrelaterad faktor</h2>"
						}
		}
},
"playaround": {
		"placeMark": "{{ MEDIA_URL }}img/placemarks/pointgreen.png",
		"classtype": "pointgreen",
		"graphicAttr": {
					"id": "playaround",
					"valuename": "playaround"
		},
		"graphicStrings": {
					"fi": {"header": "<h2>Hyvä paikka leikkiä</h2>"
							},
					"en": {"header": "<h2>Good place to play around</h2>"
							},
					"sv": {"header": "<h2>Bra plats att leka på</h2>"
						}
		}
},
"hangaround": {
		"placeMark": "{{ MEDIA_URL }}img/placemarks/pointgreen.png",
		"classtype": "pointgreen",
		"graphicAttr": {
					"id": "hangaround",
					"valuename": "hangaround"
		},
		"graphicStrings": {
					"fi": {"header": "<h2>Oleskelu</h2>"
							},
					"en": {"header": "<h2>Hang around</h2>"
							},
					"sv": {"header": "<h2>Vistelse</h2>"
						}
		}
},
"skate": {
		"placeMark": "{{ MEDIA_URL }}img/placemarks/pointgreen.png",
		"classtype": "pointgreen",
		"graphicAttr": {
					"id": "skate",
					"valuename": "skate"
		},
		"graphicStrings": {
					"fi": {"header": "<h2>Skeitata</h2>"
							},
					"en": {"header": "<h2>Skate</h2>"
							},
					"sv": {"header": "<h2>Skateboardåkning</h2>"
						}
		}
},
"relax": {
		"placeMark": "{{ MEDIA_URL }}img/placemarks/pointgreen.png",
		"classtype": "pointgreen",
		"graphicAttr": {
					"id": "relax",
					"valuename": "relax"
		},
		"graphicStrings": {
					"fi": {"header": "<h2>Rentoutua</h2>"
							},
					"en": {"header": "<h2>Dangerous traffic</h2>"
							},
					"sv": {"header": "<h2>Avkoppling</h2>"
						}
		}
},
"walkdog": {
		"placeMark": "{{ MEDIA_URL }}img/placemarks/pointgreen.png",
		"classtype": "pointgreen",
		"graphicAttr": {
					"id": "walkdog",
					"valuename": "walkdog"
		},
		"graphicStrings": {
					"fi": {"header": "<h2>Ulkoiluttaa koiraa</h2>"
							},
					"en": {"header": "<h2>Walking the dog</h2>"
							},
					"sv": {"header": "<h2>Rasta hunden</h2>"
						}
		}
},
"walkrun": {
		"placeMark": "{{ MEDIA_URL }}img/placemarks/pointgreen.png",
		"classtype": "pointgreen",
		"graphicAttr": {
					"id": "walkrun",
					"valuename": "walkrun"
		},
		"graphicStrings": {
					"fi": {"header": "<h2>Kävellä tai juosta</h2>"
							},
					"en": {"header": "<h2>Kävellä tai juosta</h2>"
							},
					"sv": {"header": "<h2>Gå eller springa</h2>"
						}
		}
},
"ski": {
		"placeMark": "{{ MEDIA_URL }}img/placemarks/pointgreen.png",
		"classtype": "pointgreen",
		"graphicAttr": {
					"id": "ski",
					"valuename": "ski"
		},
		"graphicStrings": {
					"fi": {"header": "<h2>hiihtää</h2>"
							},
					"en": {"header": "<h2>ski</h2>"
							},
					"sv": {"header": "<h2>åka skidor</h2>"
						}
		}
},
"swim": {
		"placeMark": "{{ MEDIA_URL }}img/placemarks/pointgreen.png",
		"classtype": "pointgreen",
		"graphicAttr": {
					"id": "swim",
					"valuename": "swim"
		},
		"graphicStrings": {
					"fi": {"header": "<h2>uida</h2>"
							},
					"en": {"header": "<h2>swim</h2>"
							},
					"sv": {"header": "<h2>simma</h2>"
						}
		}
},
"picnic": {
		"placeMark": "{{ MEDIA_URL }}img/placemarks/pointgreen.png",
		"classtype": "pointgreen",
		"graphicAttr": {
					"id": "picnic",
					"valuename": "picnic"
		},
		"graphicStrings": {
					"fi": {"header": "<h2>Olla piknikillä</h2>"
							},
					"en": {"header": "<h2>picnic place</h2>"
							},
					"sv": {"header": "<h2>vara på picknick</h2>"
						}
		}
},
"playgames": {	
		"placeMark": "{{ MEDIA_URL }}img/placemarks/pointgreen.png",
		"classtype": "pointgreen",	
		"graphicAttr": {
					"id": "playgames",
					"valuename": "playgames"
		},
		"graphicStrings": {
					"fi": {"header": "<h2>Pelata</h2>"
							},
					"en": {"header": "<h2>Play games</h2>"
							},
					"sv": {"header": "<h2>Spela spel</h2>"
						}
		}
},
"nothing": {
		"placeMark": "{{ MEDIA_URL }}img/placemarks/pointgreen.png",
		"classtype": "pointgreen",
		"graphicAttr": {
					"id": "nothing",
					"valuename": "nothing"
		},
		"graphicStrings": {
					"fi": {"header": "<h2>Ei mitään tekemistä</h2>"
							},
					"en": {"header": "<h2>Nothing to do here</h2>"
							},
					"sv": {"header": "<h2>Inget att göra</h2>"
						}
		}
},
"otheroutdoor": {
		"placeMark": "{{ MEDIA_URL }}img/placemarks/pointgreen.png",
		"classtype": "pointgreen",
		"graphicAttr": {
					"id": "otheroutdoor",
					"valuename": "otheroutdoor",
					"infotype": "other"
		},
		"graphicStrings": {
					"fi": {"header": "<h2>Muu ulkoilu ja virkistyminen</h2>"
							},
					"en": {"header": "<h2></h2>"
							},
					"sv": {"header": "<h2>Andra friluftsaktiviteter och rekreation</h2>"
						}
		}
},
"inadmaint": {
		"placeMark": "{{ MEDIA_URL }}img/placemarks/pointred.png",
		"classtype": "pointred",
		"graphicAttr": {
			"id": "inadmaint",
			"valuename": "inadmaint"
		},
		"graphicStrings": {
					"fi": {"header": "<h2>Riittämätön talvikunnossapito</h2>"
							},
					"en": {"header": "<h2></h2>"
							},
					"sv": {"header": "<h2>Otillräckligt vinterunderhåll</h2>"
						}
		}
},
"badqualitypath": {
		"draw": "POLYLINE",
		"classtype": "smallroute",
		"graphicAttr": {
			"id": "badqualitypath",
			"infotype": "badpath",
			"valuename": "badqualitypath",
			"rgb": [255,0,0]
		},
		"graphicStrings": {
			"fi": {
				"header": "<h2>Huonokuntoinen reitti</h2>",
				"question": "Millä tavalla reitti on huonokuntoinen?",
				"holes": "kuoppa",
				"pools": "lätäköitä",
				"brokenroad": "rikkinäinen asfaltti",
				"other": "Muuten, miten?",
				"tellmore": "Muuta kerrottavaa tästä reitistä?",
				"positive": "Tallenna kohde",
				"negative": "Poista kohde",
				"change": "Muuta kohteen paikkaa",
				"close": "Sulje ikkuna"
				},
			"sv": {
				"header": "<h2>Rutt i dåligt skick</h2>",
				"question": "På vilket sätt är rutten i dåligt skick?",
				"holes": "grop",
				"pools": "vattenpölar",
				"brokenroad": "söndrig asfalt",
				"other": "Annat, vad?",
				"tellmore": "Annat att berätta om den här rutten?",
				"positive": "Spara objektet",
				"negative": "Ta bort objektet",
				"change": "Ändra på objektets placering",
				"close": "Stäng fönstret"
				}}
},
"missingbench": {
		"placeMark": "{{ MEDIA_URL }}img/placemarks/pointred.png",
		"classtype": "pointred",
		"graphicAttr": {
			"id": "missingbench",
			"valuename": "missingbench"
			},
		"graphicStrings": {
					"fi": {"header": "<h2>Penkkejä puuttuu</h2>"
							},
					"en": {"header": "<h2>Other outdoor activity</h2>"
							},
					"sv": {"header": "<h2>Det saknas bänkar</h2>"
						}
		}
	},
"inadlight": {
		"placeMark": "{{ MEDIA_URL }}img/placemarks/pointred.png",
		"classtype": "pointred",
		"graphicAttr": {
			"id": "inadlight",
			"valuename": "inadlight"
			},
		"graphicStrings": {
					"fi": {"header": "<h2>Huono valaistus</h2>"
							},
					"en": {"header": "<h2>Other outdoor activity</h2>"
							},
					"sv": {"header": "<h2>Dålig belysning</h2>"
						}
		}
	},
"inadplantflow": {
		"placeMark": "{{ MEDIA_URL }}img/placemarks/pointred.png",
		"classtype": "pointred",
		"graphicAttr": {
			"id": "inadplantflow",
			"valuename": "inadplantflow"
			},
		"graphicStrings": {
					"fi": {"header": "<h2>Liian vähän istutuksia</h2>"
							},
					"en": {"header": "<h2>Other outdoor activity</h2>"
							},
					"sv": {"header": "<h2>För lite planteringar</h2>"
						}
		}
	},
"maintimpreq": {
		"placeMark": "{{ MEDIA_URL }}img/placemarks/pointred.png",
		"classtype": "pointred",
		"graphicAttr": {
			"id": "maintimpreq",
			"valuename": "maintimpreq"
			},
		"graphicStrings": {
					"fi": {"header": "<h2>Hoitotasossa parantamisen varaa</h2>"
							},
					"en": {"header": "<h2>Other outdoor activity</h2>"
							},
					"sv": {"header": "<h2>Behöver skötas bättre</h2>"
						}
		}
	},
"dirty": {
		"placeMark": "{{ MEDIA_URL }}img/placemarks/pointred.png",
		"classtype": "pointred",
		"graphicAttr": {
			"id": "dirty",
			"valuename": "dirty"
			},
		"graphicStrings": {
					"fi": {"header": "<h2>Roskaista ja epäsiistiä</h2>"
							},
					"en": {"header": "<h2>Other outdoor activity</h2>"
							},
					"sv": {"header": "<h2>Skräpigt och osnyggt</h2>"
						}
		}
			},
"negfeedbackother": {
		"placeMark": "{{ MEDIA_URL }}img/placemarks/pointred.png",
		"classtype": "pointred",
		"graphicAttr": {
			"id": "negfeedbackother",
			"valuename": "negfeedbackother",
			"infotype": "other"
			},
		"graphicStrings": {
					"fi": {"header": "<h2>Muuta risua</h2>"
							},
					"en": {"header": "<h2>Other outdoor activity</h2>"
							},
					"sv": {"header": "<h2>Annan bråte</h2>"
						}
		}
			},
"messytangledthicket": {
		"placeMark": "{{ MEDIA_URL }}img/placemarks/pointbrown.png",
		"classtype": "pointbrown",
		"graphicAttr": {
			"id": "messytangledthicket",
			"valuename": "messytangledthicket"
			},
		"graphicStrings": {
					"fi": {"header": "<h2>Epäsiisti ryteikkö</h2>"
							},
					"en": {"header": "<h2>Other outdoor activity</h2>"
							},
					"sv": {"header": "<h2>Osnyggt snår</h2>"
						}
		}},
"beachdredged": {
		"placeMark": "{{ MEDIA_URL }}img/placemarks/pointbrown.png",
		"classtype": "pointbrown",
		"graphicAttr": {
			"id": "beachdredged",
			"valuename": "beachdredged"
			},
		"graphicStrings": {
					"fi": {"header": "<h2>Ruoppaamista kaipaava ranta</h2>"
							},
					"en": {"header": "<h2>Other outdoor activity</h2>"
							},
					"sv": {"header": "<h2>Strand som behöver muddras</h2>"
						}
		}},
"grasscut": {
		"placeMark": "{{ MEDIA_URL }}img/placemarks/pointbrown.png",
		"classtype": "pointbrown",
		"graphicAttr": {
			"id": "grasscut",
			"valuename": "grasscut"
			},
		"graphicStrings": {
					"fi": {"header": "<h2>Niittoa kaipaava ruohikko</h2>"
							},
					"en": {"header": "<h2>Other outdoor activity</h2>"
							},
					"sv": {"header": "<h2>Gräs som behöver klippas</h2>"
						}
		}},
"observationpier": {
		"placeMark": "{{ MEDIA_URL }}img/placemarks/pointbrown.png",
		"classtype": "pointbrown",
		"graphicAttr": {
			"id": "observationpier",
			"valuename": "observationpier"
			},
		"graphicStrings": {
					"fi": {"header": "<h2>Tarve uusille näköalalaitureille</h2>"
							},
					"en": {"header": "<h2>Other outdoor activity</h2>"
							},
					"sv": {"header": "<h2>Nya utsiktsplattformer behövs</h2>"
						}
		}},
"boatpier": {
		"placeMark": "{{ MEDIA_URL }}img/placemarks/pointbrown.png",
		"classtype": "pointbrown",
		"graphicAttr": {
			"id": "boatpier",
			"valuename": "boatpier"
			},
		"graphicStrings": {
					"fi": {"header": "<h2>Tarve uusille venelaitureille</h2>"
							},
					"en": {"header": "<h2>Other outdoor activity</h2>"
							},
					"sv": {"header": "<h2>Nya båtbryggor behövs</h2>"
						}
		}},
"swimmingplace": {
		"placeMark": "{{ MEDIA_URL }}img/placemarks/pointbrown.png",
		"classtype": "pointbrown",
		"graphicAttr": {
			"id": "swimmingplace",
			"valuename": "swimmingplace"
			},
		"graphicStrings": {
					"fi": {"header": "<h2>Tarve uimapaikalle</h2>"
							},
					"en": {"header": "<h2>Other outdoor activity</h2>"
							},
					"sv": {"header": "<h2>Badplats behövs</h2>"
						}
		}},
"goodbeach": {
		"placeMark": "{{ MEDIA_URL }}img/placemarks/pointbrown.png",
		"classtype": "pointbrown",
		"graphicAttr": {
			"id": "goodbeach",
			"valuename": "goodbeach"
			},
		"graphicStrings": {
					"fi": {"header": "<h2>Hyvin hoidettu ranta</h2>"
							},
					"en": {"header": "<h2>Other outdoor activity</h2>"
							},
					"sv": {"header": "<h2>Välskött strand</h2>"
						}
		}},
"carpetpier": {
		"placeMark": "{{ MEDIA_URL }}img/placemarks/pointbrown.png",
		"classtype": "pointbrown",
		"graphicAttr": {
			"id": "carpetpier",
			"valuename": "carpetpier",
			"infotype": "carpetpier"
			},
		"graphicStrings": {
					"fi": {"header": "<h2>Käyttämäsi mattolaituri</h2>",
						"question": "Mihin käytät laituria?",
						"wash": "Mattojen pesuun",
						"swim": "Uimiseen",
						"hang": "Oleskeluun",
						"other": "Muuhun, mihin?"
							},
					"en": {"header": "<h2>Other outdoor activity</h2>"
							},
					"sv": {"header": "<h2>Mattbryggan som du använder</h2>",
						"question": "Vad använder du bryggan för?",
						"wash": "För att tvätta mattor",
						"swim": "Simning",
						"hang": "Vistelse",
						"other": "Annat, vad?"
						}
		}},
"otherbeach": {
		"placeMark": "{{ MEDIA_URL }}img/placemarks/pointbrown.png",
		"classtype": "pointbrown",
		"graphicAttr": {
			"id": "otherbeach",
			"valuename": "otherbeach",
			"infotype": "other"
			},
		"graphicStrings": {
					"fi": {"header": "<h2>Muuta rannoista</h2>"
							},
					"en": {"header": "<h2>Other outdoor activity</h2>"
							},
					"sv": {"header": "<h2>Annat om stränderna</h2>"
						}
		}},
"favourite": {
		"placeMark": "{{ MEDIA_URL }}img/placemarks/pointpearl.png",
		"classtype": "pointpearl",
		"graphicAttr": {
			"id": "favourite",
			"valuename": "favourite"
			},
		"graphicStrings": {
					"fi": {"header": "<h2>Mielipaikkasi</h2>"
							},
					"en": {"header": "<h2>Other outdoor activity</h2>"
							},
					"sv": {"header": "<h2>Ditt smultronställe</h2>"
						}
		}},
"usedrecreation": {
		"placeMark": "{{ MEDIA_URL }}img/placemarks/pointpearl.png",
		"classtype": "pointpearl",
		"graphicAttr": {
			"id": "usedrecreation",
			"valuename": "usedrecreation"
			},
		"graphicStrings": {
					"fi": {"header": "<h2>Eniten käyttämäsi ulkoilu- ja virkistysalue</h2>"
							},
					"en": {"header": "<h2>Other outdoor activity</h2>"
							},
					"sv": {"header": "<h2>Frilufts- och rekreationsområdet som du använder mest</h2>"
						}
		}},
"bestrecreation": {
		"placeMark": "{{ MEDIA_URL }}img/placemarks/pointpearl.png",
		"classtype": "pointpearl",
		"graphicAttr": {
			"id": "bestrecreation",
			"valuename": "bestrecreation"
			},
		"graphicStrings": {
					"fi": {"header": "<h2>Paras ulkoilu- ja virkistysalue</h2>"
							},
					"en": {"header": "<h2>Other outdoor activity</h2>"
							},
					"sv": {"header": "<h2>Det bästa frilufts- och rekreationsområdet</h2>"
						}
		}},
"beautypark": {
		"placeMark": "{{ MEDIA_URL }}img/placemarks/pointpearl.png",
		"classtype": "pointpearl",
		"graphicAttr": {
			"id": "beautypark",
			"valuename": "beautypark"
			},
		"graphicStrings": {
					"fi": {"header": "<h2>Kaunein puisto</h2>"
							},
					"en": {"header": "<h2>Other outdoor activity</h2>"
							},
					"sv": {"header": "<h2>Den vackraste parken</h2>"
						}
		}},
"bestcityenv": {
		"placeMark": "{{ MEDIA_URL }}img/placemarks/pointpearl.png",
		"classtype": "pointpearl",
		"graphicAttr": {
			"id": "bestcityenv",
			"valuename": "bestcityenv"
			},
		"graphicStrings": {
					"fi": {"header": "<h2>Hienoin katunäkymä</h2>"
							},
					"en": {"header": "<h2>Other outdoor activity</h2>"
							},
					"sv": {"header": "<h2>Den finaste gatuvyn</h2>"
						}
		}}
};

//pages order saved in questionary object, Array in the order which the pages are shown.
questionary.pages = 
[
/*first page*/
{
"name": "welcome", //name for page is required and should contain no spaces
"type": "firstpage", //type of page, can be "big" or "small" default is big
"next": function () {create_session(create_session_callback);}, // additional onclick handler for next button
"preventDefault": {"next": true, "prev": false}, // prevent default onclick handlers for buttons (submitform and createpage)
"content": "{% url main_html file_name='welcome' %}" //the file where the content can be found
},
{
"name": "background",
"section": "background", //tells the application which section this page belongs to
"type":"big",
"content": "{% url main_html file_name='background' %}",
"formObjects": [ //define form objects in an array
			//Form Object
			{
			"type": "Form", //type of form object, can be: "Form", "NumberTextBox", 
			"json": {},
			"node": "background" //which node the Form object should be connected to
			},
			{
			"type": "NumberTextBox", //numbertextbox 
			"json": {
				"constraints": {"min":0,"max":110}
			},
			"node": "age"
			},
			{
			"type": "RadioButton", //type radiobutton
			"json": {
				"name": "gender" //name of radio button which connects them together
			},
			"node": "man"
			},
			{
			"type": "RadioButton",
			"json": {
				"name": "gender"
			},
			"node": "woman"
			},
			{
			"type": "FilteringSelect", //filtering select input,
			"json":{
				"value":"NULL", //default value
				"autoComplete": "false", //if the filteringselect shouls have autocomplete on or not,
				"onChange": function(val) {
				    if(val === 'otherFam') {
				        dojo.removeClass('otherFamilyRow', 'tyhja');
				        dijit.byId('otherFamily').set('disabled', false);
				    }
				    else {
                        dojo.addClass('otherFamilyRow', 'tyhja');
                        dijit.byId('otherFamily').set('disabled', true);
				    }
				    if(val === 'couplewithchildren' || val === 'parentwithchildren') {
                        dojo.removeClass('birthyearsRow', 'tyhja');
                        dijit.byId('birthyears').set('disabled', false);
                    }
                    else {
                        dojo.addClass('birthyearsRow', 'tyhja');
                        dijit.byId('birthyears').set('disabled', true);
                    }
				}
			},
			"node": "family"
			},
            {
            "type": "TextBox",
            "json": {
                "name":"otherFamily",
                "disabled": true
            },
            "node": "otherFamily"
            },
            {
            "type": "TextBox",
            "json": {
                "name":"birthyears",
                "disabled": true
            },
            "node": "birthyears"
            },
            {
            "type": "FilteringSelect", //filtering select input,
            "json":{
                "value":"NULL", //default value
                "autoComplete": "false", //if the filteringselect shouls have autocomplete on or not,
                "onChange": function(val) {
                    if(val === 'otherOcc') {
                        dojo.removeClass('otherOccupationRow', 'tyhja');
                        dijit.byId('otherOccupation').set('disabled', false);
                    }
                    else {
                        dojo.addClass('otherOccupationRow', 'tyhja');
                        dijit.byId('otherOccupation').set('disabled', true);
                    }
                }
            },
            "node": "occupation"
            },
            {
            "type": "TextBox",
            "json": {
                "name":"otherOccupation",
                "disabled": true
            },
            "node": "otherOccupation"
            },
            {
            "type": "NumberTextBox",
            "json": {
                "constraints": {"min":0,"max":20}
            },
            "node": "howmanycars"
            },
            {
            "type": "RadioButton", //type radiobutton
            "json": {
                "name": "driverL" //name of radio button which connects them together
            },
            "node": "yesDL"
            },
            {
            "type": "RadioButton",
            "json": {
                "name": "driverL"
            },
            "node": "noDL"
            },
			{
			"type": "RadioButton",
			"json": {
				"name": "residenttype"
			},
			"node": "own"
			},
			{
			"type": "RadioButton",
			"json": {
				"name": "residenttype"
			},
			"node": "rent"
			},
			{
			"type": "RadioButton",
			"json": {
				"name": "residenttype"
			},
			"node": "rightofresidence"
			},
            {
            "type": "FilteringSelect", //filtering select input,
            "json":{
                "value":"NULL", //default value
                "autoComplete": "false" //if the filteringselect shouls have autocomplete on or not,
            },
            "node": "childEnv"
            },
            {
            "type": "FilteringSelect", //filtering select input,
            "json":{
                "value":"NULL", //default value
                "autoComplete": "false" //if the filteringselect shouls have autocomplete on or not,
            },
            "node": "resarea"
            }
            /*{% comment %}
            ,
            {
            "type": "TextBox",
            "json": {
                "name": "childPlace"
            },
            "node": "childPlace"
            }
            {% endcomment %}*/
			]
},
{
"name": "thingsappreciate",
"section": "background",
"type": "big",
"content": "{% url random_cont file_name='thingsappreciate' file_type='html' %}",
"formObjects": [
    {
    "type": "Form",
    "json": {},
    "node": "appreciateForm"
    },
    {
    "type": "HorizontalSlider",         
    "json": {
                "name": "quiet"
            },
    "node": "ta1"
    },
    {
    "type": "HorizontalSlider",         
    "json": {
                "name": "longdist" 
            },
    "node": "ta2"
    },
    {
    "type": "HorizontalSlider",         
    "json": {
                "name": "nature" 
            },
    "node": "ta3"
    },
    {
    "type": "HorizontalSlider",         
    "json": {
                "name": "car_bike" 
            },
    "node": "ta4"
    },
    {
    "type": "HorizontalSlider",         
    "json": {
                "name": "ecology" 
            },
    "node": "ta5"
    },
    {
    "type": "HorizontalSlider",         
    "json": {
                "name": "stay" 
            },
    "node": "ta6"
    },
    {
    "type": "HorizontalSlider",         
    "json": {
                "name": "residence" 
            },
    "node": "ta7"
    },
    {
    "type": "HorizontalSlider",         
    "json": {
                "name": "diy" 
            },
    "node": "ta8"
    },
    {
    "type": "HorizontalSlider",         
    "json": {
                "name": "homefree" 
            },
    "node": "ta9"
    },
    {
    "type": "HorizontalSlider",         
    "json": {
                "name": "social" 
            },
    "node": "ta10"
    }
    ]
},
{
"name": "home",
"section": "background",
"type": "small",
"content": "{% url main_html file_name='home' %}",
"formObjects": [
			{
			"type": "Form", //type of form object, can be: "Form", "NumberTextBox", 
			"json": {},
			"node": "homeForm" //which node the Form object should be connected to
			},
			{
			"type": "ImageButton", 
			"json": questionary.imageButton.home,
			"node": "home"
			}
			]
},
{
"name": "move_environment",
"section": "envmovement",
"type": "small",
"content": "{% url main_html file_name='move_environment' %}",
"formObjects": [
            {
            "type": "Form", //type of form object, can be: "Form", "NumberTextBox", 
            "json": {},
            "node": "moveEnvForm" //which node the Form object should be connected to
            },
            {
            "type": "ImageButton", 
            "json": questionary.imageButton.work,
            "node": "work"
            },
            {
            "type": "ImageButton", 
            "json": questionary.imageButton.shop,
            "node": "shop"
            },
            {
            "type": "ImageButton", 
            "json": questionary.imageButton.business,
            "node": "business"
            },
            {
            "type": "ImageButton", 
            "json": questionary.imageButton.exercise,
            "node": "exercise"
            },
            {
            "type": "ImageButton", 
            "json": questionary.imageButton.freetime,
            "node": "freetime"
            },
            {
            "type": "ImageButton", 
            "json": questionary.imageButton.otherplace,
            "node": "otherplace"
            }
            ]
},
{
"name": "importantRoutes",
"section": "envmovement",
"type": "small",
"content": "{% url main_html file_name='important_routes' %}",
"formObjects": [
	{
	"type": "Form",
	"json": {},
	"node": "importantRoutesForm"
	},
	{
	"type": "ImageButton", 
	"json": questionary.imageButton.importantroute,
	"node": "importantroute"
	}
	]
},
{
"name":  "environment",
"section": "envevaluation",
"type": "small",
"content": "{% url random_cont file_name='environment' file_type='html' %}",
"formObjects": [
            {
            "type": "Form", //type of form object, can be: "Form", "NumberTextBox",
            "json": {},
            "node": "ownevaluationForm" //which node the Form object should be connected to
            },
            {
            "type": "ImageButton",
            "json": questionary.imageButton.atmospherePlus,
            "node": "atmospherePlus"
            },
            {
            "type": "ImageButton",
            "json": questionary.imageButton.atmosphereMinus,
            "node": "atmosphereMinus"
            },
            {
            "type": "ImageButton",
            "json": questionary.imageButton.functionalPlus,
            "node": "functionalPlus"
            },
            {
            "type": "ImageButton",
            "json": questionary.imageButton.functionalMinus,
            "node": "functionalMinus"
            },
            {
            "type": "ImageButton",
            "json": questionary.imageButton.socialPlus,
            "node": "socialPlus"
            },
            {
            "type": "ImageButton",
            "json": questionary.imageButton.socialMinus,
            "node": "socialMinus"
            },
            {
            "type": "ImageButton",
            "json": questionary.imageButton.appearancePlus,
            "node": "appearancePlus"
            },
            {
            "type": "ImageButton",
            "json": questionary.imageButton.appearanceMinus,
            "node": "appearanceMinus"
            }
            ]
},
{
"name": "environmentSummary",
"section": "envevaluation",
"type": "big",
"content": "{% url random_cont file_name='environmentsummary' file_type='html' %}",
"formObjects": [
    {
    "type": "Form",
    "json": {},
    "node": "environmentSummaryForm"
    },
    {
    "type": "HorizontalSlider",
    "json": {"name": "atmosphereSum"},
    "node": "atmosphereSum"
    },
    {
    "type": "HorizontalSlider",
    "json": {"name": "functionalSum"},
    "node": "functionalSum"
    },
    {
    "type": "HorizontalSlider",
    "json": {"name": "appearanceSum"},
    "node": "appearanceSum"
    },
    {
    "type": "HorizontalSlider",
    "json": {"name": "socialSum"},
    "node": "socialSum"
    },
    {
    "type": "Textarea",
    "json": {
        "rows": "5",
        "cols": "70",
        "style": "width:auto;",
        "name": "envSummaryText"
        },
    "node": "envSummaryFree"
    }
    ]
},
{
"name":  "improvements",
"section": "improvements",
"type": "small",
"content": "{% url main_html file_name='improvements' %}",
"formObjects": [
            {
            "type": "Form", //type of form object, can be: "Form", "NumberTextBox",
            "json": {},
            "node": "improvementsForm" //which node the Form object should be connected to
            },
            {
            "type": "ImageButton",
            "json": questionary.imageButton.improve_point_area,
            "node": "improve_point_area"
            },
            {
            "type": "ImageButton",
            "json": questionary.imageButton.remove_object,
            "node": "remove_object"
            },
            {
            "type": "ImageButton",
            "json": questionary.imageButton.new_building,
            "node": "new_building"
            },
            {
            "type": "ImageButton",
            "json": questionary.imageButton.new_improve_route,
            "node": "new_improve_route"
            },
            {
            "type": "ImageButton",
            "json": questionary.imageButton.new_transport_route,
            "node": "new_transport_route"
            }
            ]
},
/*{% comment %}
{
"name": "routes",
"section": "meetplaceandrout",
"type": "small",
"content": "{% url main_html file_name='routes' %}",
"formObjects": [
	{
	"type": "Form",
	"json": {},
	"node": "routesform"
	},
	{
	"type": "ImageButton",
	"json": questionary.imageButton.pleasantroute,
	"node": "pleasantroute"
	},
	{
	"type": "ImageButton",
	"json": questionary.imageButton.unpleasantroute,
	"node": "unpleasantroute"
	},
	{
	"type": "ImageButton",
	"json": questionary.imageButton.missingroute,
	"node": "missingroute"
	}
	]
},
{
"name": "safety",
"section": "meetplaceandroute",
"type": "big",
"content": "{% url main_html file_name='safety' %}",
"formObjects": [
	{
	"type": "Form",
	"json": {},
	"node": "safetyform"
	},
	{
	"type": "HorizontalSlider",			
	"json": {
				"name": "safemove"
			},
	"node": "safemove"
	},
	{
	"type": "HorizontalSlider",			
	"json": {
				"name": "safegreen"
			},
	"node": "safegreen"
	},
	{
	"type": "HorizontalSlider",			
	"json": {
				"name": "easymove" 
			},
	"node": "easymove"
	},
	{
	"type": "HorizontalSlider",			
	"json": {
				"name": "childactivity" 
			},
	"node": "childactivity"
	}
	]
},
{
"name": "atmosphere",
"section": "tammatmo",
"type": "small",
"content": "{% url main_html file_name='atmosphere' %}",
"formObjects": [
	{
	"type": "Form",
	"json": {},
	"node": "atmosphereform"
	},
	{
	"type": "ImageButton",
	"json": questionary.imageButton.quietcalm,
	"node": "quietcalm"
	},
	{
	"type": "ImageButton",
	"json": questionary.imageButton.restlessnoisy,
	"node": "restlessnoisy"
	},
	{
	"type": "ImageButton",
	"json": questionary.imageButton.dangeroustraffic,
	"node": "dangeroustraffic"
	},
	{
	"type": "ImageButton",
	"json": questionary.imageButton.socialunsafe,
	"node": "socialunsafe"
	},
	{
	"type": "ImageButton",
	"json": questionary.imageButton.beautifulwelcoming,
	"node": "beautifulwelcoming"
	},
	{
	"type": "ImageButton",
	"json": questionary.imageButton.uncleanrepelling,
	"node": "uncleanrepelling"
	},
	{
	"type": "ImageButton",
	"json": questionary.imageButton.niceview,
	"node": "niceview"
	},
	{
	"type": "ImageButton",
	"json": questionary.imageButton.forestfeeling,
	"node": "forestfeeling"
	},
	{
	"type": "ImageButton",
	"json": questionary.imageButton.historyimportant,
	"node": "historyimportant"
	},
	{
	"type": "ImageButton",
	"json": questionary.imageButton.beautifulbuilt,
	"node": "beautifulbuilt"
	},
	{
	"type": "ImageButton",
	"json": questionary.imageButton.importantnature,
	"node": "importantnature"
	},
	{
	"type": "ImageButton",
	"json": questionary.imageButton.otheratmosphere,
	"node": "otheratmosphere"
	}
	]
},
{
"name": "outdooractivities",
"section": "outdandotherecr",
"type": "small",
"content": "{% url main_html file_name='outdooractivities' %}",
"formObjects": [
	{
	"type": "Form",
	"json": {},
	"node": "outdoorform"
	},
	{
	"type":"ImageButton",
	"json": questionary.imageButton.playaround,
	"node": "playaround"
	},
	{
	"type":"ImageButton",
	"json": questionary.imageButton.hangaround,
	"node": "hangaround"
	},
	{
	"type":"ImageButton",
	"json": questionary.imageButton.skate,
	"node": "skate"
	},
	{
	"type":"ImageButton",
	"json": questionary.imageButton.relax,
	"node": "relax"
	},
	{
	"type":"ImageButton",
	"json": questionary.imageButton.walkdog,
	"node": "walkdog"
	},
	{
	"type":"ImageButton",
	"json": questionary.imageButton.walkrun,
	"node": "walkrun"
	},
	{
	"type":"ImageButton",
	"json": questionary.imageButton.ski,
	"node": "ski"
	},
	{
	"type":"ImageButton",
	"json": questionary.imageButton.swim,
	"node": "swim"
	},
	{
	"type":"ImageButton",
	"json": questionary.imageButton.picnic,
	"node": "picnic"
	},
	{
	"type":"ImageButton",
	"json": questionary.imageButton.playgames,
	"node": "playgames"
	},
	{
	"type":"ImageButton",
	"json": questionary.imageButton.nothing,
	"node": "nothing"
	},
	{
	"type":"ImageButton",
	"json": questionary.imageButton.otheroutdoor,
	"node": "otheroutdoor"
	}
	]
},
{
"name": "negativefeedback",
"section": "mainofparkandroad",
"type": "small",
"content": "{% url main_html file_name='negativefeedback' %}",
"formObjects": [
	{
	"type": "Form",
	"json": {},
	"node": "negativefeedbackform"
	},
	{
	"type": "ImageButton",
	"json": questionary.imageButton.inadmaint,
	"node": "inadmaint"
	},
	{
	"type":"ImageButton",
	"json": questionary.imageButton.badqualitypath,
	"node": "badqualitypath"
	},
	{
	"type":"ImageButton",
	"json": questionary.imageButton.missingbench,
	"node": "missingbench"
	},
	{
	"type":"ImageButton",
	"json": questionary.imageButton.inadlight,
	"node": "inadlight"
	},
	{
	"type":"ImageButton",
	"json": questionary.imageButton.inadplantflow,
	"node": "inadplantflow"
	},
	{
	"type":"ImageButton",
	"json": questionary.imageButton.maintimpreq,
	"node": "maintimpreq"
	},
	{
	"type":"ImageButton",
	"json": questionary.imageButton.dirty,
	"node": "dirty"
	},
	{
	"type":"ImageButton",
	"json": questionary.imageButton.negfeedbackother,
	"node": "negfeedbackother"
	}
	]
},
{
"name": "maintparkroad",
"section": "mainofparkandroad",
"type": "big",
"content": "{% url main_html file_name='maintparkroad' %}",
"formObjects": [
	{
	"type": "Form",
	"json": {},
	"node": "maintparkroadform"
	},
	{
	"type": "HorizontalSlider",
	"json": {},
	"node": "maintgreenspace"
	},
	{
	"type": "HorizontalSlider",
	"json": {},
	"node": "maintnature"
	},
	{
	"type": "HorizontalSlider",
	"json": {},
	"node": "maintroadpath"
	},
	{
	"type": "HorizontalSlider",
	"json": {},
	"node": "leavenature"
	}
	]
},
{
"name": "beaches",
"section": "mainofparkandroad",
"type": "small",
"content": "{% url main_html file_name='beaches' %}",
"formObjects": [
	{
	"type": "Form",
	"json": {},
	"node": "beachesform"
	},
	{
	"type":"ImageButton",
	"json": questionary.imageButton.messytangledthicket,
	"node": "messytangledthicket"
	},
	{
	"type":"ImageButton",
	"json": questionary.imageButton.beachdredged,
	"node": "beachdredged"
	},
	{
	"type":"ImageButton",
	"json": questionary.imageButton.grasscut,
	"node": "grasscut"
	},
	{
	"type":"ImageButton",
	"json": questionary.imageButton.observationpier,
	"node": "observationpier"
	},
	{
	"type":"ImageButton",
	"json": questionary.imageButton.boatpier,
	"node": "boatpier"
	},
	{
	"type":"ImageButton",
	"json": questionary.imageButton.swimmingplace,
	"node": "swimmingplace"
	},
	{
	"type":"ImageButton",
	"json": questionary.imageButton.goodbeach,
	"node": "goodbeach"
	},
	{
	"type":"ImageButton",
	"json": questionary.imageButton.carpetpier,
	"node": "carpetpier"
	},
	{
	"type":"ImageButton",
	"json": questionary.imageButton.otherbeach,
	"node": "otherbeach"
	}
	]
},
{
"name": "pearls",
"section": "thepearofhels",
"type": "small",
"content": "{% url main_html file_name='pearls' %}",
"formObjects": [
	{
	"type": "Form",
	"json": {},
	"node": "pearlsform"
	},
	{
	"type": "ImageButton",
	"json": questionary.imageButton.favourite,
	"node": "favourite"
	},
	{
	"type": "ImageButton",
	"json": questionary.imageButton.usedrecreation,
	"node": "usedrecreation"
	},
	{
	"type": "ImageButton",
	"json": questionary.imageButton.bestrecreation,
	"node": "bestrecreation"
	},
	{
	"type": "ImageButton",
	"json": questionary.imageButton.beautypark,
	"node": "beautypark"
	},
	{
	"type": "ImageButton",
	"json": questionary.imageButton.bestcityenv,
	"node": "bestcityenv"
	}
]
},
{
"name": "feedback",
"section": "finnished",
"type": "big",
"content": "{% url main_html file_name='feedback' %}",
"formObjects": [
	{
	"type": "Form",
	"json": {},
	"node": "feedbackform"
	}
]
},
{% endcomment %}*/
{
"name": "owncomments",
"section": "feedback",
"type": "big",
"content": "{% url main_html file_name='owncomments' %}",
"next": function() {submitContact('contactForm');},
"previous": function() {submitContact('contactForm');},
"formObjects": [
    {
    "type": "Form",
    "json": {},
    "node": "contactForm"
    },
    {
    "type": "TextBox",
    "json": {
        "name": "name"
    },
    "node": "name"
    },
    {
    "type": "ValidationTextBox",
    "json": {
        "name": "email",
        "invalidMessage": "{% trans 'Virheellinen sähköpostiosoite' %}"
    },
    "node": "email"
    },
    {
    "type": "TextBox",
    "json": {
        "name": "phonenumber"
    },
    "node": "phonenumber"
    },
    /*{% comment %}{
    "type": "TextBox",
    "json": {
        "name": "streetaddress"
    },
    "node": "streetaddress"
    },
    {
    "type": "TextBox",
    "json": {
        "name": "zipcode"
    },
    "node": "zipcode"
    },
    {
    "type": "TextBox",
    "json": {
        "name": "city"
    },
    "node": "city"
    },
    {% endcomment %}*/
    {
        "type": "CheckBox",
        "json": {
            "name": "sendresults",
            "value": "furtherstudy"
        },
        "node": "furtherstudy"
    }, 
    {
        "type": "CheckBox",
        "json": {
            "name": "sendresults",
            "value": "interview"
        },
        "node": "interview"
    }, 
    {
        "type": "CheckBox",
        "json": {
            "name": "sendresults",
            "value": "moreinfo"
        },
        "node": "moreinfo"
    }, 
    /*{% comment %}{
        "type": "CheckBox",
        "json": {
            "name": "sendresults",
            "value": "givecontact"
        },
        "node": "givecontact"
    },
    {% endcomment %}*/ 
	{
	"type": "Form",
	"json": {},
	"node": "owncommentsForm"
	},
	{
	"type": "Textarea",
	"json": {
		"rows": "7",
		"cols": "70",
		"style": "width:auto;",
		"name": "owncomment"
		},
	"node": "feedbacktext"
	}
]
},
{
"name": "thankyou",
"type": "big",
"next": function () {window.location=('{% url common file_name='mymap' file_type='html' %}');},
"extraButtons": function() {delete_session(); createsubwindow('endQuestionnaire');},
"preventDefault": {"next": true, "prev": false},
"content": "{% url main_html file_name='thankyou' %}"
}
];

//subwindows is not in any particular order and can be search by name
questionary.subwindows = {
"quit": {
	"content": "{% url main_html file_name='quit' %}",
	"formObjects": [
		{
		"type": "Form",
		"json": {
			"action": "../asp/quit.asp"
			},
		"node": "quit"
		},
		{
		"type": "TextBox",
		"json": {
			"type": "text",
			"name": "quitemail",
			"required": true,// can be false or true, , //regexp for email
			"trim":true //trim whitespace
		},
		"node": "quitemail"
		}],
	"next": function(e) {if(checkemail(dojo.byId("quitemail").value)) {dojo.byId("languageinput").value = djConfig.locale; submitsubwindow();}createsubwindow('quitconfirmation');}, //function to be called for onclick on the next button
	"previous": function(e) {closesubwindow();}//function to be called for onclick on the previous button
},
"quitconfirmation": {
	"content": "{% url main_html file_name='quitconfirmation' %}"
},
"mapanimation": {
"content": "{% url main_html file_name='mapanimation' %}"
},
"routeanimation": {
"content": "{% url main_html file_name='routeanimation' %}"
},
"endQuestionnaire": {
    "content": "{% url main_html file_name='end_questionnaire' %}"
}

};

var tooltiphelp = {
	"fi": {
		"firstedge":"Aloita piirtäminen napsauttamalla karttaa.",
		"nextedge":"Napsauta karttaa jatkaaksesi reitin piirtoa<br />tai<br />lopeta reitin piirto kaksoisklikkauksella."
		},
	"en": {
		"firstedge":"Click on the map to draw the route.",
		"nextedge":"Click on the map to continue the route<br />or<br />end the route with a doubleclick."
		},
	"sv": {
		"firstedge":"Klicka på kartan för att rita rutten.",
		"nextedge":"Klicka på kartan för att fortsätta rutten<br /> eller<br />sluta rita rutten med en dubbelklick."
		}
};