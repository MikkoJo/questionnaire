/*{% load i18n %}*/
/*global dojo, dijit, djConfig, questionnaire, startAsTestUser, logout, createsubwindow, showHideFeaturelayers,
  closesubwindow, submitsubwindow, create_session, create_session_callback, map, window, submitContact, gnt,
  checkemail
*/
/* init questionnaire object */

/*All the functions controlling the flow of the questionnaire*/
var applicationName = "pehmogis";

/*Mapservice used */
var MAPSERVICE_URL = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer";

/* Mapservice for satellite map */
var SATELLITE_MAPSERVICE_URL = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer";

/*Mapservice for the overview map*/
var OVERVIEWMAP_URL = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer";

var AREAS_FEATURE_LAYER_URL = "";

questionnaire.infotemplates_url = "{% url random_cont file_name='pos_neg_info_temp_html' file_type='html' %}";
questionnaire.WMScapabilities_url ="{% url common file_name='vaaka_poi_wms_getcapabilities2' file_type='xml' %}";

questionnaire.initial_extent = {
        "xmax": 2780607.609391832,
        "xmin": 2768578.3320654687,
        "ymax": 8438150.101392904,
        "ymin": 8433544.770438729,
        "spatialReference": {
            "wkid": 3857
        }
};

questionnaire.start_extent = {
        "x": -13051288.879079,
        "y": 3868252.6086434,
        "zoomLevel": 12
}
questionnaire.initial_wms_layers = "0,1,3,5";

//questionnaire.minMarkZoomLevel = 2;

questionnaire.sections = [{
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

questionnaire.infoTemplates = {
"default": {
    "confirm": "<p>${question}</p>" +
                "<div class='button saveLong' onclick='confirm(\"${id}\",true);submitInfoForm(\"info\",\"${valuename}\");map.infoWindow.hide()'>" +
                "<span class='saveText'>${positive}</span>" +
                "</div>" +
                "<p style='margin:0'>" +
                "<span style='color:#36A8D5;text-decoration:underline;' onclick='confirm(\"${id}\", false);map.infoWindow.hide()'>${negative}</span>" +
                "</p>",
    "confirmHeight": 150,
    "confirmWidth": 250,
    "info": "<div class='button saveShort' onclick='submitInfoForm(\"info\",\"${valuename}\");map.infoWindow.hide()'>" +
            "<span class='saveText'>${close}</span>" +
            "</div>" +
            "<p style='margin:0'>" +
            "<span style='color:#36A8D5;text-decoration:underline;' onclick='removeGraph(\"${id}\");map.infoWindow.hide()'>" +
            "${remove}</span></p>",
    "infoWidth": 250,
    "infoHeight": 150
},
"routes": {
    "confirm": "{% spaceless %}{% include 'example/html/routes_info.html' %}{% with 'route' as type %}{% include 'example/html/infoConfirm.html' %}{% endwith %}{% endspaceless %}",
    "confirmWidth": 250,
    "confirmHeight": 460,
    "info": "{% spaceless %}{% include 'example/html/routes_info.html' %}{% with 'route' as type %}{% include 'example/html/info_info.html' %}{% endwith %}{% endspaceless %}",
    "infoWidth": 250,
    "infoHeight": 460
    },
"newRoutes": {
    "confirm":	"<form id='info'>" +
                "<p>${tellmore}</p>" +
                "<textarea id='itext' name='tellmore' cols='25' rows='4'></textarea>" +
                "</form>" +
                "{% spaceless %}{% with 'route' as type %}{% include 'example/html/infoConfirm.html' %}{% endwith %}{% endspaceless %}",
    "confirmHeight": 270,
    "confirmWidth": 250,
    "info":	"<form id='info'>" +
            "<p>${tellmore}</p>" +
            "<textarea id='itext' name='tellmore' cols='25' rows='4'></textarea>" +
            "</form>" +
            "{% spaceless %}{% with 'route' as type %}{% include 'example/html/info_info.html' %}{% endwith %}{% endspaceless %}",
    "infoWidth": 270,
    "infoHeight": 250
},
"other": {
    "confirm":  "<form id='info'>" +
                "<p>${tellmore}</p>" +
                "<textarea id='itext' name='tellmore' cols='25' rows='4'></textarea>" +
                "</form>" +
                "{% spaceless %}{% include 'example/html/infoConfirm.html' %}{% endspaceless %}",
    "confirmHeight": 270,
    "confirmWidth": 250,
    "info": "<form id='info'>" +
            "<p>${tellmore}</p>" +
            "<textarea id='itext' name='tellmore' cols='25' rows='4'></textarea>" +
            "</form>" +
            "{% spaceless %}{% include 'example/html/info_info.html' %}{% endspaceless %}",
    "infoWidth": 270,
    "infoHeight": 250
},
"home": {
    "confirm":  "{% spaceless %}{% include 'example/html/home_info.html' %}{% include 'example/html/infoConfirm.html' %}{% endspaceless %}",
    "confirmWidth": 350,
    "confirmHeight": 450,
    "info": "{% spaceless %}{% include 'example/html/home_info.html' %}{% include 'example/html/info_info.html' %}{% endspaceless %}",
    "infoWidth": 350,
    "infoHeight": 450
},
"moveEnvWork": {
    "confirm":  "{% spaceless %}{% include 'example/html/move_env_info_work.html' %}{% include 'example/html/infoConfirm.html' %}{% endspaceless %}",
    "confirmWidth": 350,
    "confirmHeight": 450,
    "info": "{% spaceless %}{% include 'example/html/move_env_info_work.html' %}{% include 'example/html/info_info.html' %}{% endspaceless %}",
    "infoWidth": 350,
    "infoHeight": 450
},
"moveEnvShop": {
    "confirm":  "{% spaceless %}{% include 'example/html/move_env_info_shop.html' %}{% include 'example/html/infoConfirm.html' %}{% endspaceless %}",
    "confirmWidth": 350,
    "confirmHeight": 450,
    "info": "{% spaceless %}{% include 'example/html/move_env_info_shop.html' %}{% include 'example/html/info_info.html' %}{% endspaceless %}",
    "infoWidth": 350,
    "infoHeight": 450
},
"moveEnvBusiness": {
    "confirm":  "{% spaceless %}{% include 'example/html/move_env_info_business.html' %}{% include 'example/html/infoConfirm.html' %}{% endspaceless %}",
    "confirmWidth": 350,
    "confirmHeight": 450,
    "info": "{% spaceless %}{% include 'example/html/move_env_info_business.html' %}{% include 'example/html/info_info.html' %}{% endspaceless %}",
    "infoWidth": 350,
    "infoHeight": 450
},
"moveEnvExercise": {
    "confirm":  "{% spaceless %}{% include 'example/html/move_env_info_exercise.html' %}{% include 'example/html/infoConfirm.html' %}{% endspaceless %}",
    "confirmWidth": 350,
    "confirmHeight": 450,
    "info": "{% spaceless %}{% include 'example/html/move_env_info_exercise.html' %}{% include 'example/html/info_info.html' %}{% endspaceless %}",
    "infoWidth": 350,
    "infoHeight": 450
},
"moveEnvFreetime": {
    "confirm":  "{% spaceless %}{% include 'example/html/move_env_info_freetime.html' %}{% include 'example/html/infoConfirm.html' %}{% endspaceless %}",
    "confirmWidth": 350,
    "confirmHeight": 450,
    "info": "{% spaceless %}{% include 'example/html/move_env_info_freetime.html' %}{% include 'example/html/info_info.html' %}{% endspaceless %}",
    "infoWidth": 350,
    "infoHeight": 450
},
"moveEnvOther": {
    "confirm":  "{% spaceless %}{% include 'example/html/move_env_info_otherplace.html' %}{% include 'example/html/infoConfirm.html' %}{% endspaceless %}",
    "confirmWidth": 350,
    "confirmHeight": 450,
    "info": "{% spaceless %}{% include 'example/html/move_env_info_otherplace.html' %}{% include 'example/html/info_info.html' %}{% endspaceless %}",
    "infoWidth": 350,
    "infoHeight": 450
},
"kkolmio": {
    "confirm":  "{% spaceless %}{% include 'example/html/kkolmio_info_info.html' %}{% endspaceless %}",
    "confirmWidth": 350,
    "confirmHeight": 450,
    "info": "{% spaceless %}{% include 'example/html/kkolmio_info_confirm.html' %}{% endspaceless %}",
    "infoWidth": 350,
    "infoHeight": 450
}
};

questionnaire.imageButton = {
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
        "buttontext": "{% trans 'Home' %}",
        "classtype": "big",
        "placeMark": "{{ STATIC_URL }}img/placemarks/pointgreen.png",
        "cursorImg":"{{ STATIC_URL }}img/cursors/home.cur",
        "graphicAttr": {
                    "id": "home",
                    "valuename": "home",
                    "infotype": "home",
                    "max": 1
        },
        "graphicStrings": {
                    "header": "<h2>{% trans 'Home' %}</h2>"
        }
},
"new_place": {
        "buttontext": "{% trans 'Uusi asuinpaikka' %}",
        "classtype": "big",
        "placeMark": "{{ STATIC_URL }}img/placemarks/pointorange.png",
        "cursorImg":"{{ STATIC_URL }}img/cursors/point.cur",
        "graphicAttr": {
                    "id": "new_place",
                    "valuename": "new_place",
                    "infotype": "other",
                    "max": 10
        },
        "graphicStrings": {
                    "header": "<h2>{% trans 'Uusi asuinpaikka' %}</h2>",
                    "tellmore": "{% trans 'Miksi muuttaisit juuri tänne?' %}"
        }
},
"new_place_area_at_kk": {
        "buttontext": "{% trans 'Uusi asuinalue' %}",
        "classtype": "big",
        "placeMark": "{{ STATIC_URL }}img/placemarks/pointorange.png",
        "cursorImg":"{{ STATIC_URL }}img/cursors/point.cur",
        "graphicAttr": {
                    "id": "new_place_at_kk",
                    "valuename": "new_place_at_kk",
                    "infotype": "default",
                    "max": 100
        },
        "graphicStrings": {
                    "header": "<h2>{% trans 'Uusi asuinalue' %}</h2>",
                    "tellmore": "{% trans 'Miksi muuttaiset juuri tänne?' %}"
        }
},
"work": {
        "placeMark": "{{ STATIC_URL }}img/placemarks/atmosphere.png",
        "classtype": "moveEnvironment",
        "graphicAttr": {
                    "id": "work",
                    "valuename": "work",
                    "infotype": "moveEnvWork"
        },
        "graphicStrings": {
                    "header": "<h2>{% trans 'Työ, opiskelu, päivähoito' %}</h2>",
                    "typetext": "{% trans 'työ-, opiskelu-, päivähoitopaikka' %}",
                    "type1": "{% trans 'oma työpaikka' %}",
                    "type2": "{% trans 'perheenjäsenen työpaikka' %}",
                    "type3": "{% trans 'lapsen päivähoitopaikka tai koulu' %}",
                    "type4": "{% trans 'koulu tai opiskelupaikka' %}",
                    "type5": "{% trans 'työhön liittyvä asiointipaikka' %}",
                    "type6": "{% trans 'muu' %}",
                    "extraText": "{% trans 'Lisätietoja tästä paikasta' %}"
        }
},
"shop": {
        "placeMark": "{{ STATIC_URL }}img/placemarks/atmosphere.png",
        "classtype": "moveEnvironment",
        "graphicAttr": {
                    "id": "shop",
                    "valuename": "shop",
                    "infotype": "moveEnvShop"
        },
        "graphicStrings": {
                    "header": "<h2>{% trans 'Ostospaikka' %}</h2>",
                    "typetext": "{% trans 'ostospaikka' %}",
                    "type1": "{% trans 'lähikauppa' %}",
                    "type2": "{% trans 'super- tai hypermarket' %}",
                    "type3": "{% trans 'kauppakeskus tai tavaratalo' %}",
                    "type4": "{% trans 'erikoiskauppa' %}",
                    "type5": "{% trans 'muu' %}",
                    "extraText": "{% trans 'Miksi käyt ostoksilla juuri täällä?' %}"
        }
},
"business": {
        "placeMark": "{{ STATIC_URL }}img/placemarks/atmosphere.png",
        "classtype": "moveEnvironment",
        "graphicAttr": {
                    "id": "business",
                    "valuename": "business",
                    "max": 100,
                    "infotype": "moveEnvBusiness"
        },
        "graphicStrings": {
                    "header": "<h2>{% trans 'Asiointipaikka' %}</h2>",
                    "typetext": "{% trans 'asiointipaikka' %}",
                    "type1": "{% trans 'pankki, posti tai virasto' %}",
                    "type2": "{% trans 'terveyspalvelut' %}",
                    "type3": "{% trans 'muu palvelu, esim. kampaaja tai parturi' %}",
                    "type4": "{% trans 'muu' %}",
                    "extraText": "{% trans 'Miksi asioit juuri täällä?' %}"
        }
},
"exercise": {
        "placeMark": "{{ STATIC_URL }}img/placemarks/atmosphere.png",
        "classtype": "moveEnvironment",
        "graphicAttr": {
                    "id": "exercise",
                    "valuename": "exercise",
                    "max": 100,
                    "infotype": "moveEnvExercise"
        },
        "graphicStrings": {
                    "header": "<h2>{% trans 'Liikunta ja ulkoilu' %}</h2>",
                    "typetext": "{% trans 'liikunta- tai ulkoilupaikka' %}",
                    "type1": "{% trans 'ulkoilupaikka' %}",
                    "type2": "{% trans 'liikuntapaikka' %}",
                    "type3": "{% trans 'leikkipuisto' %}",
                    "type4": "{% trans 'muu' %}",
                    "extraText": "{% trans 'Miksi liikut ja ulkoilet juuri täällä?' %}"
        }
},
"freetime": {
        "placeMark": "{{ STATIC_URL }}img/placemarks/atmosphere.png",
        "classtype": "moveEnvironment",
        "graphicAttr": {
                    "id": "freetime",
                    "valuename": "freetime",
                    "max": 100,
                    "infotype": "moveEnvFreetime"
        },
        "graphicStrings": {
                    "header": "<h2>{% trans 'Vapaa-aika' %}</h2>",
                    "typetext": "{% trans 'vapaa-ajanpaikka' %}",
                    "type1": "{% trans 'vierailupaikka' %}",
                    "type2": "{% trans 'ravintola, kahvila' %}",
                    "type3": "{% trans 'kirjasto' %}",
                    "type4": "{% trans 'kirkko, seurakuntatoiminta' %}",
                    "type5": "{% trans 'kesämökki, vapaa-ajan asunto' %}",
                    "type6": "{% trans 'työväenopisto tms.' %}",
                    "type7": "{% trans 'muu' %}",
                    "extraText": "{% trans 'Miksi vietät vapaa-aikaa juuri täällä?' %}"
        }
},
"otherplace": {
        "placeMark": "{{ STATIC_URL }}img/placemarks/atmosphere.png",
        "classtype": "moveEnvironment",
        "graphicAttr": {
                    "id": "otherplace",
                    "valuename": "otherplace",
                    "max": 100,
                    "infotype": "moveEnvOther"
        },
        "graphicStrings": {
                    "header": "<h2>{% trans 'Muu paikka' %}</h2>",
                    "typetext": "{% trans 'muu paikka' %}",
                    "type1": "{% trans 'Minkätyyppinen paikka on kyseessä?' %}",
                    "extraText": "{% trans 'Lisätietoja tästä paikasta' %}"
        }
},
"importantroute": {
        "draw": "POLYLINE",
        "classtype": "big twoLine",
        "buttontext": "{% trans 'tärkeä jalankulku- tai <br />pyöräilyreitti' %}",
        "cursorImg":"{{ STATIC_URL }}img/cursors/route.cur",
        "graphicAttr": {
                    "id": "importantroute",
                    "infotype": "routes",
                    "max": 100,
                    "valuename": "importantroute",
                    "rgb": [152,10,211],
                    "question": "{% trans 'Miten yleensä liikut tällä reitillä?' %}"
        },
        "graphicStrings": {
                    "header": "<h2>{% trans 'Tärkeä kävely- tai<br /> pyöräreitti' %}</h2>",
                    "extraText": "{% trans 'Lisätietoja reitistä:' %}"
        }
},
"new_improve_route": {
        "draw": "POLYLINE",
        "buttontext": "{% trans 'uusi kevyen liikenteen reitti' %}",
        "classtype": "big long",
        "cursorImg":"{{ STATIC_URL }}img/cursors/route.cur",
        "graphicAttr": {
                    "id": "new_improve_route",
                    "valuename": "newRoute",
                    "infotype": "newRoutes",
                    "max": 3,
                    "rgb": [0,0,255]
        },
        "graphicStrings": {
                    "header": "<h2>{% trans 'Reittiehdotuksesi' %}</h2>",
                    "tellmore": "{% trans 'Millaista reittiä toivot tähän paikkaan?' %}"
        }
},
"new_transport_route": {
        "draw": "POLYLINE",
        "buttontext": "{% trans 'uusi joukkoliikenneyhteys' %}",
        "classtype": "big long",
        "cursorImg":"{{ STATIC_URL }}img/cursors/route.cur",
        "graphicAttr": {
                    "id": "new_transport_route",
                    "valuename": "newtrRoute",
                    "infotype": "newRoutes",
                    "max": 3,
                    "rgb": [0,255,0]
                    //"rgb": [205,225,170]
        },
        "graphicStrings": {
                    "header": "<h2>{% trans 'Ehdotuksesi uudeksi joukkoliikenneyhteydeksi' %}</h2>",
                    "tellmore": "{% trans 'Millaista joukkoliikennelinjaa toivoisit tänne?' %}"
        }
}
};

//pages order saved in questionnaire object, Array in the order which the pages are shown.
questionnaire.pages =
[
/*first page*/
{
"name": "welcome", //name for page is required and should contain no spaces
"type": "firstpage", //type of page, can be "big" or "small" default is big
"next": function () {gnt.auth.create_session(create_session_callback);}, // additional onclick handler for next button
"preventDefault": {"next": true, "prev": false}, // prevent default onclick handlers for buttons (submitform and createpage)
"content": "{% url main_html file_name='welcome' %}" //the file where the content can be found
},
{
"name": "background",
"section": "background", //tells the application which section this page belongs to
"type":"big",
"content": "{% url main_html file_name='background' %}"
},
{
"name": "thingsappreciate",
"section": "background",
"type": "big",
"content": "{% url random_cont file_name='thingsappreciate' file_type='html' %}"
},
{
"name": "home",
"section": "background",
"type": "small",
"content": "{% url main_html file_name='home' %}"
},
{
"name": "move_environment",
"section": "envmovement",
"type": "small",
"content": "{% url main_html file_name='move_environment' %}"
},
{
"name": "importantRoutes",
"section": "envmovement",
"type": "small",
"content": "{% url main_html file_name='important_routes' %}"
},
{
"name":  "environment",
"section": "envevaluation",
"type": "small",
"content": "{% url random_cont file_name='environment' file_type='html' %}"
},
{
"name": "environmentSummary",
"section": "envevaluation",
"type": "big",
"content": "{% url random_cont file_name='environmentsummary' file_type='html' %}"
},
{
"name":  "improvements",
"section": "improvements",
"type": "small",
"content": "{% url main_html file_name='improvements' %}"
},
{
"name": "owncomments",
"section": "feedback",
"type": "big",
"content": "{% url main_html file_name='owncomments' %}",
"next": function() {submitContact('contactForm');},
"previous": function() {submitContact('contactForm');}
},
{
"name": "thankyou",
"type": "big",
//"next": function () {window.location=('{% url common file_name='mymap' file_type='html' %}');},
"extraButtons": function() {gnt.auth.logout(); createsubwindow('endQuestionnaire');},
"preventDefault": {"next": true, "prev": false},
"content": "{% url main_html file_name='thankyou' %}"
}
];

//subwindows is not in any particular order and can be search by name
questionnaire.subwindows = {
"quit": {
    "content": "{% url main_html file_name='quit' %}",
    "next": function(e) {if(checkemail(dojo.byId("quitemail").value)) {dojo.byId("languageinput").value = djConfig.locale; submitsubwindow();}createsubwindow('quitconfirmation');}, //function to be called for onclick on the next button
    "previous": function(e) {closesubwindow();}//function to be called for onclick on the previous button
},
"quitconfirmation": {
    "content": "{% url main_html file_name='quitconfirmation' %}"
},
"mapanimation": {
"content": "{% url common file_type='html' file_name='mapanimation' %}"
},
"routeanimation": {
"content": "{% url common file_type='html' file_name='routeanimation' %}"
},
"feedback": {
    "content": "{% url feedback %}",
    "next": function(e) {submitFeedback("feedback", submitFeedback_callback);}, //function to be called for onclick on the next button
    "previous": function(e) {closesubwindow();}//function to be called for onclick on the previous button
},
"endQuestionnaire": {
    "content": "{% url main_html file_name='end_questionnaire' %}"
}

};
/*
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
*/
questionnaire.extra_input_connect = [
    {   "id":"education",
        "event": "onchange",
        "func": function(evt) {
            if(evt.currentTarget.value === 'otherEdu') {
                dojo.removeClass('otherEducationRow', 'tyhja');
                dojo.byId('otherEducation').disabled = false;
            }
            else {
                dojo.addClass('otherEducationRow', 'tyhja');
                dojo.byId('otherEducation').disabled = true;
            }
        }

    },
    {   "id": "family",
        "event": "onchange",
        "func": function(evt) {
            if(evt.currentTarget.value === 'otherFam') {
                dojo.removeClass('otherFamilyRow', 'tyhja');
                dojo.byId('otherFamily').disabled = false;
            }
            else {
                dojo.addClass('otherFamilyRow', 'tyhja');
                dojo.byId('otherFamily').disabled = true;
            }
            if(evt.currentTarget.value === 'couplewithchildren' || 
               evt.currentTarget.value === 'parentwithchildren') {
                dojo.removeClass('birthyearsRow', 'tyhja');
                dojo.byId('birthyears').disabled = false;
            }
            else {
                dojo.addClass('birthyearsRow', 'tyhja');
                dojo.byId('birthyears').disabled = true;
            }
        }

    },
    {   "id":"occupation",
        "event": "onchange",
        "func": function(evt) {
            if(evt.currentTarget.value === 'otherOcc') {
                dojo.removeClass('otherOccupationRow', 'tyhja');
                dojo.byId('otherOccupation').disabled = false;
            }
            else {
                dojo.addClass('otherOccupationRow', 'tyhja');
                dojo.byId('otherOccupation').disabled = true;
            }
        }

    },
    {   "id":"me_other",
        "event": "onchange",
        "func": function(evt) {
            if(evt.currentTarget.value === 'other' && evt.currentTarget.checked === true) {
                dojo.removeClass('otherSpan', 'tyhja');
                dojo.byId('other_text').disabled = false;
            }
            else {
                dojo.addClass('otherSpan', 'tyhja');
                dojo.byId('other_text').disabled = true;
            }
        }

    },
    {   "id":"me_other",
        "event": "onclick",
        "func": function(evt) {
            if (jQuery.browser.msie) {
                $("#me_other").click(function(){$(this).blur().focus();});
            }
        }

    },
    {   "id":"me3_5",
        "event": "onchange",
        "func": function(evt) {
            if(evt.currentTarget.value === 'other' && evt.currentTarget.checked === true) {
                dojo.removeClass('otherHowSpan', 'tyhja');
                dojo.byId('visitOther').disabled = false;
            }
            else {
                dojo.addClass('otherHowSpan', 'tyhja');
                dojo.byId('visitOther').disabled = true;
            }
        }

    },
    {   "id":"me3_5",
        "event": "onclick",
        "func": function(evt) {
            if (jQuery.browser.msie) {
                $("#me3_5").click(function(){$(this).blur().focus();});
            }
        }

    },
    {   "id":"other",
        "name": "mtransport",
        "event": "onchange",
        "func": function(evt) {
            if(evt.currentTarget.value === 'other' && evt.currentTarget.checked === true) {
                dojo.removeClass('otherSpan', 'tyhja');
                dojo.byId('other_text').disabled = false;
            }
            else {
                dojo.addClass('otherSpan', 'tyhja');
                dojo.byId('other_text').disabled = true;
            }
        }

    },
    {   "id":"otherRelation",
        "event": "onchange",
        "func": function(evt) {
            if(evt.currentTarget.value === 'otherRelation' && evt.currentTarget.checked === true) {
                dojo.removeClass('otherRelations_areaRow', 'tyhja');
                dojo.byId('otherRelation_text').disabled = false;
            }
            else {
                dojo.addClass('otherRelations_areaRow', 'tyhja');
                dojo.byId('otherRelation_text').disabled = true;
            }
        }

    },
    {   "id":"work_area",
        "event": "onchange",
        "func": function(evt) {
            if(evt.currentTarget.value === 'otherWork') {
                dojo.removeClass('otherWork_areaRow', 'tyhja');
                dojo.byId('otherWork_area').disabled = false;
            }
            else {
                dojo.addClass('otherWork_areaRow', 'tyhja');
                dojo.byId('otherWork_area').disabled = true;
            }
        }

    },
    {   "id":"ir_17",
        //"name": "threats",
        "event": "onchange",
        "func": function(evt) {
            if(evt.currentTarget.value === 'other_threat' && evt.currentTarget.checked === true) {
                dojo.removeClass('other_threat_row', 'tyhja');
                dojo.byId('other_threat_text').disabled = false;
            }
            else {
                dojo.addClass('other_threat_row', 'tyhja');
                dojo.byId('other_threat_text').disabled = true;
            }
        }

    },
    {   "id":"ir_8",
//        "name": "activity",
        "event": "onchange",
        "func": function(evt) {
            if(evt.currentTarget.value === 'other_acti' && evt.currentTarget.checked === true) {
                dojo.removeClass('other_actiRow', 'tyhja');
                dojo.byId('other_activity').disabled = false;
            }
            else {
                dojo.addClass('other_actiRow', 'tyhja');
                dojo.byId('other_activity').disabled = true;
            }
        }

    },
    {   "id":"like_info_id",
        "event": "onchange",
        "func": function(evt) {
            if(evt.currentTarget.value === 'other' && evt.currentTarget.checked === true) {
                dojo.byId('like_info_other_text').disabled = false;
            }
            else {
                dojo.byId('like_info_other_text').disabled = true;
            }
        }

    },
    {   "id":"spoiled_natural_state_r",
        "event": "onchange",
        "func": function(evt) {
            if(evt.currentTarget.value === 'spoiled_natural_state' && evt.currentTarget.checked === true) {
                dojo.byId('dislike_info_text').disabled = false;
            }
            else {
                dojo.byId('dislike_info_text').disabled = true;
            }
        }

    },
    {   "id":"dislike_info_id",
        "event": "onchange",
        "func": function(evt) {
            if(evt.currentTarget.value === 'other' && evt.currentTarget.checked === true) {
                dojo.byId('dislike_info_other_text').disabled = false;
            }
            else {
                dojo.byId('dislike_info_other_text').disabled = true;
            }
        }

   }
];

questionnaire.special_widgets = {
    "family": {
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
    "occupation": {
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
    "show_kk": {
        "onClick": function(val) {
            for(var j = 0; j < map.graphicsLayerIds.length; j++) {
                if(map.getLayer(map.graphicsLayerIds[j]).name === "example_kaikki_new") {
                    var ext = dojo.clone(map.getLayer(map.graphicsLayerIds[j]).fullExtent);
                    //expand extent to cover smallContent
                    var offSet = ext.getWidth() / map.width * 330;
                    map.setExtent(ext.update(
                            ext.xmin - offSet,
                            ext.ymin,
                            ext.xmax,
                            ext.ymax,
                            ext.spatialReference
                    ), true);
                }
           }

        }
    },
    "me_other": {
        "onChange": function(val) {
            if(val) {
                dojo.removeClass('otherSpan', 'tyhja');
                dijit.byId('other_text').set('disabled', false);
            }
            else {
                dojo.addClass('otherSpan', 'tyhja');
                dijit.byId('other_text').set('disabled', true);
            }
        }

    },
    "me3_5": {
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
    "what_things_eval_8": {
        "onChange": function(val) {
            if(val) {
                dojo.removeClass('otherThingsSpan', 'tyhja');
                dijit.byId('other_things').set('disabled', false);
            }
            else {
                dojo.addClass('otherThingsSpan', 'tyhja');
                dijit.byId('other_things').set('disabled', true);
            }
        }

    },
    "exit": {
        "onClick": function(e) {
            var diag = dijit.byId("infoDialog");
            diag.set({
                "title": "{% trans 'confirm exit' %}",
                "href": "{% url main_html file_name='confirm_exit' %}"
            });
            diag.show();
        }
    },
    "confirm_exit_yes": {
        "onClick": function(e) {
            children_logout("{% url children_logout %}");
            dijit.byId("infoDialog").hide();
        }

    },
    "confirm_exit_no": {
        "onClick": function(e) {
            dijit.byId("infoDialog").hide();
        }
    }
};

questionnaire.feature_defaults = {
    "appearancePlus": {
        "style": "point_positive",
        "classes": "ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary",
        "header": "{% trans 'Kerro paikan ulkoisesta ilmeestä tarkemmin! Tässä paikassa...' %}"
    },
    "appearanceMinus": {
        "style": "point_negative",
        "classes": "ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-secondary",
        "header": "{% trans 'Kerro paikan ulkoisesta ilmeestä tarkemmin! Tässä paikassa...' %}"
    },
    "socialPlus": {
        "style": "point_positive",
        "classes": "ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary",
        "header": "{% trans 'Kerro sosiaalisesta ilmapiiristä tarkemmin! Tässä paikassa...' %}"
    },
    "socialMinus": {
        "style": "point_negative",
        "classes": "ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-secondary",
        "header": "{% trans 'Kerro sosiaalisesta ilmapiiristä tarkemmin! Tässä paikassa...' %}"
    },
    "atmospherePlus": {
        "style": "point_positive",
        "classes": "ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary",
        "header": "{% trans 'Kerro paikan tunnelmasta tarkemmin! Tämä paikka on...' %}"
    },
    "atmosphereMinus": {
        "style": "point_negative",
        "classes": "ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-secondary",
        "header": "{% trans 'Kerro paikan tunnelmasta tarkemmin! Tämä paikka on...' %}"
    },
    "functionalPlus": {
        "style": "point_positive",
        "classes": "ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary",
        "header": "{% trans 'Kerro paikan toimintamahdollisuuksista tarkemmin! Tässä paikassa...' %}"
    },
    "functionalMinus": {
        "style": "point_negative",
        "classes": "ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-secondary",
        "header": "{% trans 'Kerro paikan toimintamahdollisuuksista tarkemmin! Tässä paikassa...' %}"
    },
    "pearl_p": {
        "max": 1,
        "style": "point_lightorange"
    },
    "home": {
        "max": 1,
        "style": "point_green",
/*        "classes": "ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-secondary",
        "icons": {"secondary": "green-icon"},*/
        "header": "{% trans 'Koti' %}"
    },
    "work": {
        "style": "point_cyan",
        "classes": "ui-button ui-widget ui-state-default ui-corner-all small ui-button-text-icon-secondary",
        "icons": {"secondary": "cyan-icon"},
        "header": "{% trans 'Työ, opiskelu, päivähoito' %}"
    },
    "shop": {
        "style": "point_cyan",
        "classes": "ui-button ui-widget ui-state-default ui-corner-all small ui-button-text-icon-secondary",
        "icons": {"secondary": "cyan-icon"},
        "header": "{% trans 'Ostospaikka' %}"
    },
    "business": {
        "style": "point_cyan",
        "classes": "ui-button ui-widget ui-state-default ui-corner-all small ui-button-text-icon-secondary",
        "icons": {"secondary": "cyan-icon"},
        "header": "{% trans 'Asiointipaikka' %}"
    },
    "exercise": {
        "style": "point_cyan",
        "classes": "ui-button ui-widget ui-state-default ui-corner-all small ui-button-text-icon-secondary",
        "icons": {"secondary": "cyan-icon"},
        "header": "{% trans 'Liikunta ja ulkoilu' %}"
    },
    "freetime": {
        "style": "point_cyan",
        "classes": "ui-button ui-widget ui-state-default ui-corner-all small ui-button-text-icon-secondary",
        "icons": {"secondary": "cyan-icon"},
        "header": "{% trans 'Vapaa-aika' %}"
    },
    "otherplace": {
        "style": "point_cyan",
        "classes": "ui-button ui-widget ui-state-default ui-corner-all small ui-button-text-icon-secondary",
        "icons": {"secondary": "cyan-icon"},
        "header": "{% trans 'Muu paikka' %}"
    },
    "importantroute": {
        "style": "route_purple",
        "header": "{% trans 'Tärkeä kävely- tai pyöräreitti' %}"
    },
    "improve_point_area": {
        "max": 3,
        "style": "point_lightgreen",
        "tellmore": "{% trans 'Miten tätä paikkaa pitäisi kohentaa?' %}",
        "header": "{% trans 'Kohentamisehdotuksesi' %}"
    },
    "remove_object": {
        "max": 3,
        "style": "point_red",
        "tellmore": "{% trans 'Mitä poistaisit tästä paikasta?' %}",
        "header": "{% trans 'Poistamisehdotuksesi' %}"
    },
    "new_building": {
        "max": 3,
        "style": "point_purple",
        "tellmore": "{% trans 'Mitä uutta tähän mielestäsi pitäisi rakentaa?' %}",
        "header": "{% trans 'Rakentamisehdotuksesi' %}"
    },
    "new_improve_route": {
        "max": 3,
        "style": "route_blue",
        "tellmore": "{% trans 'Millaista reittiä toivot tähän paikkaan?' %}",
        "header": "{% trans 'Reittiehdotuksesi' %}"
    },
    "new_transport_route_mob": {
        "max": 3,
        "style": "route_green",
        "tellmore": "{% trans 'Millaista joukkoliikennelinjaa toivoisit tänne?' %}",
        "header": "{% trans 'Ehdotuksesi uudeksi joukkoliikenneyhteydeksi' %}"
    },
    "ser_build": {
        "style": "point_blue",
        "classes": "ui-button ui-widget ui-state-default ui-corner-all small ui-button-text-icon-secondary",
        "icons": {"secondary": "blue-icon"},
        "header": "{% trans 'Palvelurakennus' %}"
    },
    "new_walking_route": {
        "style": "route_green",
        "classes": "ui-button ui-widget ui-state-default ui-corner-all small ui-button-text-icon-secondary",
        "icons": {"secondary": "green_route-icon"},
        "header": "{% trans 'Kävely- tai pyöräilyreitti' %}"
    },
    "new_transport_route": {
        "style": "route_blue",
        "classes": "ui-button ui-widget ui-state-default ui-corner-all small ui-button-text-icon-secondary",
        "icons": {"secondary": "blue_route-icon"},
        "header": "{% trans 'Bussireitti' %}"
    },
    "new_recreation_area": {
        "style": "area_yellow",
        "classes": "ui-button ui-widget ui-state-default ui-corner-all small ui-button-text-icon-secondary",
        "icons": {"secondary": "yellow_area-icon"},
        "header": "{% trans 'Virkistysalue' %}"
    },
    "preserve_place": {
        "style": "point_cyan",
        "classes": "ui-button ui-widget ui-state-default ui-corner-all small ui-button-text-icon-secondary",
        "icons": {"secondary": "cyan-icon"},
        "header": "{% trans 'Säilytettävä paikka' %}"
    },
    "improve_place": {
        "style": "point_yellow",
        "classes": "ui-button ui-widget ui-state-default ui-corner-all small ui-button-text-icon-secondary",
        "icons": {"secondary": "yellow-icon"},
        "header": "{% trans 'Kohennettava paikka' %}"
    },
    "otherplace_2": {
        "style": "point_brown",
        "classes": "ui-button ui-widget ui-state-default ui-corner-all small ui-button-text-icon-secondary",
        "icons": {"secondary": "brown-icon"},
        "header": "{% trans 'Muu paikka' %}"
    },
    "acti_point": {
        "style": "point_yellow",
        "classes": "ui-button ui-widget ui-state-default ui-corner-all small ui-button-text-icon-secondary",
        "icons": {"secondary": "yellow-icon"},
        "header": "{% trans 'Mitä teet kohteessa?' %}"
    },
    "acti_poly": {
        "style": "area_yellow",
        "classes": "ui-button ui-widget ui-state-default ui-corner-all small ui-button-text-icon-secondary",
        "icons": {"secondary": "yellow_area-icon"},
        "header": "{% trans 'Mitä teet kohteessa?' %}"
    },
    "no_tourism": {
        "style": "area_blue",
        "classes": "ui-button ui-widget ui-state-default ui-corner-all small ui-button-text-icon-secondary",
        "icons": {"secondary": "blue_area-icon"},
        "header": "{% trans 'Ei matkailua' %}"
    },
    "new_hiking_route": {
        "style": "route_orange",
        "classes": "ui-button ui-widget ui-state-default ui-corner-all small ui-button-text-icon-secondary",
        "icons": {"secondary": "orange_route-icon"},
        "header": "{% trans 'Uusi retkeily- tai hiihtoreitti' %}"
    },
    "new_snowmobile_route": {
        "style": "route_yellow",
        "classes": "ui-button ui-widget ui-state-default ui-corner-all small ui-button-text-icon-secondary",
        "icons": {"secondary": "yellow_route-icon"},
        "header": "{% trans 'Uusi moottorikelkka- tai mönkijäreitti' %}"
    },
    "new_tourist_attraction": {
        "style": "point_cottage",
        "classes": "ui-button ui-widget ui-state-default ui-corner-all small ui-button-text-icon-secondary",
        "icons": {"secondary": "cottage-icon"},
        "header": "{% trans 'Uusi matkailurakentaminen' %}"
    },
    "no_forestry": {
        "style": "area_green",
        "classes": "ui-button ui-widget ui-state-default ui-corner-all small ui-button-text-icon-secondary",
        "icons": {"secondary": "green_area-icon"},
        "header": "{% trans 'Ei metsätaloutta' %}"
    },
    "no_nature_reserve": {
        "style": "area_red",
        "classes": "ui-button ui-widget ui-state-default ui-corner-all small ui-button-text-icon-secondary",
        "icons": {"secondary": "red_area-icon"},
        "header": "{% trans 'Ei suojelua' %}"
    },
    "new_nature_reserve": {
        "style": "area_cyan",
        "classes": "ui-button ui-widget ui-state-default ui-corner-all small ui-button-text-icon-secondary",
        "icons": {"secondary": "cyan_area-icon"},
        "header": "{% trans 'Uusi suojelualue' %}"
    }

};
