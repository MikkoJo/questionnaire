{% load i18n %}
/*Infotemplates for Surrounding questions*/
/*
 * 
 */
/*
HUOM confirm grafiikka ennen info submittia
*/ 
{
    "templates": {
    {% for t_name, val in values.items %}
        "{{ t_name }}": {
            "confirm": "{% spaceless %}{% with val as vals %}{% include 'env_info.html' %}{% endwith %}{% include 'infoConfirm.html' %}{% endspaceless %}",
            "info": "{% spaceless %}{% with val as vals %}{% include 'env_info.html' %}{% endwith %}{% include 'info_info.html' %}{% endspaceless %}",
            "formObjects": [
                {
                    "type": "Form",
                    "json": {},
                    "node": "info"
                }, 
                
                {% for questid, quest_text in val %}
                {
                    "type": "CheckBox",
                    "json": {
                        "name": "{{ t_name }}",
                        "value": "{{ questid }}"
                    },
                    "node": "{{ questid }}"
                }, 
                {% endfor %}
                {
                    "type": "CheckBox",
                    "json": {
                        "name": "{{ t_name }}",
                        "value": "other"
                    },
                    "node": "other"
                }, 
                {
                    "type": "TextBox",
                    "json": {
                        "name": "whatText",
                        "type": "text",
                        "style": "margin-left: 20px"
                    },
                    "node": "whatText"
                } 
            ],
            {% for key, height in info_heights.items %}
                {% if key == t_name %}
                    "confirmHeight": {{ height }},
                    "infoHeight": {{ height }},
                {% endif %}
            {% endfor %}
            "confirmWidth": 250,
            "infoWidth": 250
        }{% if not forloop.last %}, {% endif %}
    {% endfor %}
    /*
        "atmosphereM": {
            "confirm": "<form id='info' name='${name}'><table><tr><td class='infoCheck'><input type='checkbox' id='value1' /></td><td><label for='value1'>Tunnelmaltaan kuollut</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value0' /></td><td><label for='value0'>Torjuva</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value5' /></td><td><label for='value5'>Liian ennustettava</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value7' /></td><td><label for='value7'>Lapsikielteinen</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value6' /></td><td><label for='value6'>Rauhaton</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value2' /></td><td><label for='value2'>Stressaava</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value3' /></td><td><label for='value3'>Kaukana luonnosta</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value4' /></td><td><label for='value4'>Meluisa</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value8' /></td><td><label for='value8'>Muu asia, mikä?</label></td></tr><tr><td colspan='2'><input type='text' name='omaKriteeri4Text' id='omaKriteeri4Text' class='infoTextBox' /></td></tr></table><div class='button saveLong' onclick='confirm(\"${id}\",true);submitInfoForm(\"info\",\"${valuename}\");map.infoWindow.hide()'><span class='saveText'>Tallenna kohde</span></div><p style='margin:0'><span style='color:#36A8D5;text-decoration:underline;' onclick='confirm(\"${id}\", false);map.infoWindow.hide()'>Poista kohde</span></p>",
            "info": "<form id='info' name='${name}'><table><tr><td><tr><td class='infoCheck'><input type='checkbox' id='value1' /></td><td><label for='value1'>Tunnelmaltaan kuollut</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value0' /></td><td><label for='value0'>Torjuva</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value5' /></td><td><label for='value5'>Liian ennustettava</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value7' /></td><td><label for='value7'>Lapsikielteinen</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value6' /></td><td><label for='value6'>Rauhaton</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value2' /></td><td><label for='value2'>Stressaava</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value3' /></td><td><label for='value3'>Kaukana luonnosta</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value4' /></td><td><label for='value4'>Meluisa</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value8' /></td><td><label for='value8'>Muu asia, mikä?</label></td></tr><tr class='surtextbox'><td colspan='2'><input type='text' name='omaKriteeri4Text' id='omaKriteeri4Text' class='infoTextBox' /></td></tr></table><div class='button saveShort' onclick='submitInfoForm(\"info\",\"${valuename}\");map.infoWindow.hide()' ><span class='saveText'>Sulje ikkuna</span></div><p style='margin:0'><span style='color:#36A8D5;text-decoration:underline;' onclick='removeGraph(\"${id}\");map.infoWindow.hide()'>Poista kohde</span></p>",
            "formObjects": [
                {
                    "type": "Form",
                    "json": {
                        "name": "info",
                        "method": "post",
                        "action": ""
                    },
                    "node": "info"
                }, {
                    "type": "TextBox",
                    "json": {
                        "name": "omaKriteeri4Text",
                        "type": "text",
                        "style": "margin-left: 20px"
                    },
                    "node": "omaKriteeri4Text"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "elav"
                    },
                    "node": "value1"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "kuts"
                    },
                    "node": "value0"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "ylla"
                    },
                    "node": "value5"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "lapsysta"
                    },
                    "node": "value7"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "rauh"
                    },
                    "node": "value6"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "saas"
                    },
                    "node": "value2"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "luonlahe"
                    },
                    "node": "value3"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "meluhilj"
                    },
                    "node": "value4"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "omaKriteeri4"
                    },
                    "node": "value8"
                }
            ],
            "confirmHeight": 360,
            "confirmWidth": 250,
            "infoWidth": 250,
            "infoHeight": 360
        },
        "functionalP": {
            "confirm": "<form id='info' name='${name}'><table><tr><td class='infoCheck'><input type='checkbox' id='value1' /></td><td><label for='value1'>Kävellen tai pyörällä liikkuminen on sujuvaa</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value0' /></td><td><label for='value0'>Harrastus- ja tekemismahdollisuudet ovat hyvät</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value5' /></td><td><label for='value5'>Kulttuurielämä on vilkasta</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value7' /></td><td><label for='value7'>Palvelut ovat hyvät</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value6' /></td><td><label for='value6'>Oman elämäntavan toteuttaminen onnistuu hyvin</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value2' /></td><td><label for='value2'>Julkisilla liikennevälineillä liikkuminen on sujuvaa</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value3' /></td><td><label for='value3'>Autolla liikkuminen on sujuvaa</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value4' /></td><td><label for='value4'>Liikenneturvallisuus on hyvä</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value8' /></td><td><label for='value8'>Muu asia, mikä?</label></td></tr><tr><td colspan='2'><input type='text' name='omaKriteeri2Text' id='omaKriteeri2Text' class='infoTextBox' /></td></tr></table><div class='button saveLong' onclick='confirm(\"${id}\",true);submitInfoForm(\"info\",\"${valuename}\");map.infoWindow.hide()'><span class='saveText'>Tallenna kohde</span></div><p style='margin:0'><span style='color:#36A8D5;text-decoration:underline;' onclick='confirm(\"${id}\", false);map.infoWindow.hide()'>Poista kohde</span></p>",
            "info": "<form id='info' name='${name}'><table><tr><td><tr><td class='infoCheck'><input type='checkbox' id='value1' /></td><td><label for='value1'>Kävellen tai pyörällä liikkuminen on sujuvaa</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value0' /></td><td><label for='value0'>Harrastus- ja tekemismahdollisuudet ovat hyvät</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value5' /></td><td><label for='value5'>Kulttuurielämä on vilkasta</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value7' /></td><td><label for='value7'>Palvelut ovat hyvät</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value6' /></td><td><label for='value6'>Oman elämäntavan toteuttaminen onnistuu hyvin</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value2' /></td><td><label for='value2'>Julkisilla liikennevälineillä liikkuminen on sujuvaa</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value3' /></td><td><label for='value3'>Autolla liikkuminen on sujuvaa</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value4' /></td><td><label for='value4'>Liikenneturvallisuus on hyvä</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value8' /></td><td><label for='value8'>Muu asia, mikä?</label></td></tr><tr class='surtextbox'><td colspan='2'><input type='text' name='omaKriteeri2Text' id='omaKriteeri2Text' class='infoTextBox' /></td></tr></table><div class='button saveShort' onclick='submitInfoForm(\"info\",\"${valuename}\");map.infoWindow.hide()' ><span class='saveText'>Sulje ikkuna</span></div><p style='margin:0'><span style='color:#36A8D5;text-decoration:underline;' onclick='removeGraph(\"${id}\");map.infoWindow.hide()'>Poista kohde</span></p>",
            "formObjects": [
                {
                    "type": "Form",
                    "json": {
                        "name": "info",
                        "method": "post",
                        "action": ""
                    },
                    "node": "info"
                }, {
                    "type": "TextBox",
                    "json": {
                        "name": "omaKriteeri2Text",
                        "type": "text",
                        "style": "margin-left: 20px"
                    },
                    "node": "omaKriteeri2Text"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "kavtaipyorliikku"
                    },
                    "node": "value1"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "harjatekemahd"
                    },
                    "node": "value0"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "kulttuurielama"
                    },
                    "node": "value5"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "palvelut"
                    },
                    "node": "value7"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "omaelamatoteut"
                    },
                    "node": "value6"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "julkiliikku"
                    },
                    "node": "value2"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "autoliikku"
                    },
                    "node": "value3"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "liikenneturva"
                    },
                    "node": "value4"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "omaKriteeri2"
                    },
                    "node": "value8"
                }
            ],
            "confirmHeight": 440,
            "confirmWidth": 250,
            "infoWidth": 250,
            "infoHeight": 440
        },
        "functionalM": {
            "confirm": "<form id='info' name='${name}'><table><tr><td class='infoCheck'><input type='checkbox' id='value1' /></td><td><label for='value1'>Kävellen tai pyörällä liikkuminen on hankalaa</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value0' /></td><td><label for='value0'>Harrastus- ja tekemismahdollisuudet ovat huonot</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value5' /></td><td><label for='value5'>Kulttuurielämä on hiljaista</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value7' /></td><td><label for='value7'>Palvelut ovat huonot</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value6' /></td><td><label for='value6'>Oman elämäntavan toteuttaminen onnistuu huonosti</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value2' /></td><td><label for='value2'>Julkisilla liikennevälineillä liikkuminen on hankalaa</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value3' /></td><td><label for='value3'>Autolla liikkuminen on hankalaa</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value4' /></td><td><label for='value4'>Liikenneturvallisuus on huono</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value8' /></td><td><label for='value8'>Muu asia, mikä?</label></td></tr><tr><td colspan='2'><input type='text' name='omaKriteeri2Text' id='omaKriteeri2Text' class='infoTextBox' /></td></tr></table><div class='button saveLong' onclick='confirm(\"${id}\",true);submitInfoForm(\"info\",\"${valuename}\");map.infoWindow.hide()'><span class='saveText'>Tallenna kohde</span></div><p style='margin:0'><span style='color:#36A8D5;text-decoration:underline;' onclick='confirm(\"${id}\", false);map.infoWindow.hide()'>Poista kohde</span></p>",
            "info": "<form id='info' name='${name}'><table><tr><td><tr><td class='infoCheck'><input type='checkbox' id='value1' /></td><td><label for='value1'>Kävellen tai pyörällä liikkuminen on hankalaa</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value0' /></td><td><label for='value0'>Harrastus- ja tekemismahdollisuudet ovat huonot</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value5' /></td><td><label for='value5'>Kulttuurielämä on hiljaista</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value7' /></td><td><label for='value7'>Palvelut ovat huonot</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value6' /></td><td><label for='value6'>Oman elämäntavan toteuttaminen onnistuu huonosti</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value2' /></td><td><label for='value2'>Julkisilla liikennevälineillä liikkuminen on hankalaa</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value3' /></td><td><label for='value3'>Autolla liikkuminen on hankalaa</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value4' /></td><td><label for='value4'>Liikenneturvallisuus on huono</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value8' /></td><td><label for='value8'>Muu asia, mikä?</label></td></tr><tr class='surtextbox'><td colspan='2'><input type='text' name='omaKriteeri2Text' id='omaKriteeri2Text' class='infoTextBox' /></td></tr></table><div class='button saveShort' onclick='submitInfoForm(\"info\",\"${valuename}\");map.infoWindow.hide()' ><span class='saveText'>Sulje ikkuna</span></div><p style='margin:0'><span style='color:#36A8D5;text-decoration:underline;' onclick='removeGraph(\"${id}\");map.infoWindow.hide()'>Poista kohde</span></p>",
            "formObjects": [
                {
                    "type": "Form",
                    "json": {
                        "name": "info",
                        "method": "post",
                        "action": ""
                    },
                    "node": "info"
                }, {
                    "type": "TextBox",
                    "json": {
                        "name": "omaKriteeri2Text",
                        "type": "text",
                        "style": "margin-left: 20px"
                    },
                    "node": "omaKriteeri2Text"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "kavtaipyorliikku"
                    },
                    "node": "value1"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "harjatekemahd"
                    },
                    "node": "value0"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "kulttuurielama"
                    },
                    "node": "value5"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "palvelut"
                    },
                    "node": "value7"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "omaelamatoteut"
                    },
                    "node": "value6"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "julkiliikku"
                    },
                    "node": "value2"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "autoliikku"
                    },
                    "node": "value3"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "liikenneturva"
                    },
                    "node": "value4"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "omaKriteeri2"
                    },
                    "node": "value8"
                }
            ],
            "confirmHeight": 440,
            "confirmWidth": 250,
            "infoWidth": 250,
            "infoHeight": 440
        },
        "socialP": {
            "confirm": "<form id='info' name='${name}'><table><tr><td class='infoCheck'><input type='checkbox' id='value1' /></td><td><label for='value1'>Minulle tärkeät ihmiset ovat lähellä</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value0' /></td><td><label for='value0'>Asukkaat pitävät hyvää huolta ympäristöstä</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value5' /></td><td><label for='value5'>Alueen maine on hyvä</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value7' /></td><td><label for='value7'>Sosiaalinen turvallisuus on hyvä</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value6' /></td><td><label for='value6'>Asukkaat välittävät toisistaan</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value2' /></td><td><label for='value2'>Naapurit elävät yhdessä sopuisasti</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value3' /></td><td><label for='value3'>Sosiaalinen elämä on vilkasta</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value4' /></td><td><label for='value4'>Asukkaiden kirjo on sopiva</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value8' /></td><td><label for='value8'>Muu asia, mikä?</label></td></tr><tr><td colspan='2'><input type='text' name='omaKriteeri3Text' id='omaKriteeri3Text' class='infoTextBox' /></td></tr></table><div class='button saveLong' onclick='confirm(\"${id}\",true);submitInfoForm(\"info\",\"${valuename}\");map.infoWindow.hide()'><span class='saveText'>Tallenna kohde</span></div><p style='margin:0'><span style='color:#36A8D5;text-decoration:underline;' onclick='confirm(\"${id}\", false);map.infoWindow.hide()'>Poista kohde</span></p>",
            "info": "<form id='info' name='${name}'><table><tr><td><tr><td class='infoCheck'><input type='checkbox' id='value1' /></td><td><label for='value1'>Minulle tärkeät ihmiset ovat lähellä</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value0' /></td><td><label for='value0'>Asukkaat pitävät hyvää huolta ympäristöstä</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value5' /></td><td><label for='value5'>Alueen maine on hyvä</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value7' /></td><td><label for='value7'>Sosiaalinen turvallisuus on hyvä</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value6' /></td><td><label for='value6'>Asukkaat välittävät toisistaan</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value2' /></td><td><label for='value2'>Naapurit elävät yhdessä sopuisasti</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value3' /></td><td><label for='value3'>Sosiaalinen elämä on vilkasta</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value4' /></td><td><label for='value4'>Asukkaiden kirjo on sopiva</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value8' /></td><td><label for='value8'>Muu asia, mikä?</label></td></tr><tr class='surtextbox'><td colspan='2'><input type='text' name='omaKriteeri3Text' id='omaKriteeri3Text' class='infoTextBox' /></td></tr></table><div class='button saveShort' onclick='submitInfoForm(\"info\",\"${valuename}\");map.infoWindow.hide()' ><span class='saveText'>Sulje ikkuna</span></div><p style='margin:0'><span style='color:#36A8D5;text-decoration:underline;' onclick='removeGraph(\"${id}\");map.infoWindow.hide()'>Poista kohde</span></p>",
            "formObjects": [
                {
                    "type": "Form",
                    "json": {
                        "name": "info",
                        "method": "post",
                        "action": ""
                    },
                    "node": "info"
                }, {
                    "type": "TextBox",
                    "json": {
                        "name": "omaKriteeri3Text",
                        "type": "text",
                        "style": "margin-left: 20px"
                    },
                    "node": "omaKriteeri3Text"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "tarkihmi"
                    },
                    "node": "value1"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "huolympa"
                    },
                    "node": "value0"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "aluemain"
                    },
                    "node": "value5"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "sositurv"
                    },
                    "node": "value7"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "valittoisista"
                    },
                    "node": "value6"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "naapyhte"
                    },
                    "node": "value2"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "sosielam"
                    },
                    "node": "value3"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "asukkirj"
                    },
                    "node": "value4"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "omaKriteeri3"
                    },
                    "node": "value8"
                }
            ],
            "confirmHeight": 410,
            "confirmWidth": 250,
            "infoWidth": 250,
            "infoHeight": 410
        },
        "socialM": {
            "confirm": "<form id='info' name='${name}'><table><tr><td class='infoCheck'><input type='checkbox' id='value1' /></td><td><label for='value1'>Minulle tärkeät ihmiset ovat kaukana</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value0' /></td><td><label for='value0'>Asukkaat eivät huolehdi ympäristöstä</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value5' /></td><td><label for='value5'>Alueen maine on huono</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value7' /></td><td><label for='value7'>Sosiaalinen turvallisuus on huono</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value6' /></td><td><label for='value6'>Asukkaat eivät välitä toisistaan</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value2' /></td><td><label for='value2'>Naapurit riitelevät keskenään</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value3' /></td><td><label for='value3'>Sosiaalinen elämä on liian hiljaista</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value4' /></td><td><label for='value4'>Asukkaiden kirjo on liiallinen tai liian vähäinen</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value8' /></td><td><label for='value8'>Muu asia, mikä?</label></td></tr><tr><td colspan='2'><input type='text' name='omaKriteeri3Text' id='omaKriteeri3Text' class='infoTextBox' /></td></tr></table><div class='button saveLong' onclick='confirm(\"${id}\",true);submitInfoForm(\"info\",\"${valuename}\");map.infoWindow.hide()'><span class='saveText'>Tallenna kohde</span></div><p style='margin:0'><span style='color:#36A8D5;text-decoration:underline;' onclick='confirm(\"${id}\", false);map.infoWindow.hide()'>Poista kohde</span></p>",
            "info": "<form id='info' name='${name}'><table><tr><td><tr><td class='infoCheck'><input type='checkbox' id='value1' /></td><td><label for='value1'>Minulle tärkeät ihmiset ovat kaukana</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value0' /></td><td><label for='value0'>Asukkaat eivät huolehdi ympäristöstä</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value5' /></td><td><label for='value5'>Alueen maine on huono</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value7' /></td><td><label for='value7'>Sosiaalinen turvallisuus on huono</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value6' /></td><td><label for='value6'>Asukkaat eivät välitä toisistaan</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value2' /></td><td><label for='value2'>Naapurit riitelevät keskenään</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value3' /></td><td><label for='value3'>Sosiaalinen elämä on liian hiljaista</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value4' /></td><td><label for='value4'>Asukkaiden kirjo on liiallinen tai liian vähäinen</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value8' /></td><td><label for='value8'>Muu asia, mikä?</label></td></tr><tr class='surtextbox'><td colspan='2'><input type='text' name='omaKriteeri3Text' id='omaKriteeri3Text' class='infoTextBox' /></td></tr></table><div class='button saveShort' onclick='submitInfoForm(\"info\",\"${valuename}\");map.infoWindow.hide()' ><span class='saveText'>Sulje ikkuna</span></div><p style='margin:0'><span style='color:#36A8D5;text-decoration:underline;' onclick='removeGraph(\"${id}\");map.infoWindow.hide()'>Poista kohde</span></p>",
            "formObjects": [
                {
                    "type": "Form",
                    "json": {
                        "name": "info",
                        "method": "post",
                        "action": ""
                    },
                    "node": "info"
                }, {
                    "type": "TextBox",
                    "json": {
                        "name": "omaKriteeri3Text",
                        "type": "text",
                        "style": "margin-left: 20px"
                    },
                    "node": "omaKriteeri3Text"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "tarkihmi"
                    },
                    "node": "value1"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "huolympa"
                    },
                    "node": "value0"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "aluemain"
                    },
                    "node": "value5"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "sositurv"
                    },
                    "node": "value7"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "valittoisista"
                    },
                    "node": "value6"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "naapyhte"
                    },
                    "node": "value2"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "sosielam"
                    },
                    "node": "value3"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "asukkirj"
                    },
                    "node": "value4"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "omaKriteeri3"
                    },
                    "node": "value8"
                }
            ],
            "confirmHeight": 440,
            "confirmWidth": 250,
            "infoWidth": 250,
            "infoHeight": 440
        },
        "appearanceP": {
            "confirm": "<form id='info' name='${name}'><table><tr><td class='infoCheck'><input type='checkbox' id='value1' /></td><td><label for='value1'>Asumisen hinta-laatusuhde on kohdallaan</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value0' /></td><td><label for='value0'>Historian havina tuntuu</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value5' /></td><td><label for='value5'>Ympäristö on kaunis</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value7' /></td><td><label for='value7'>Rakentamisen väljyys on sopiva</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value6' /></td><td><label for='value6'>Paikan ilmeeseen vaikuttaminen on mahdollista</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value2' /></td><td><label for='value2'>Rakentamisen tiiviys on sopiva</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value3' /></td><td><label for='value3'>Ympäristö on viimeisteltyä</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value4' /></td><td><label for='value4'>Ympäristö on siisti</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value8' /></td><td><label for='value8'>Muu asia, mikä?</label></td></tr><tr><td colspan='2'><input type='text' name='omaKriteeriText' id='omaKriteeriText' class='infoTextBox' /></td></tr></table><div class='button saveLong' onclick='confirm(\"${id}\",true);submitInfoForm(\"info\",\"${valuename}\");map.infoWindow.hide()'><span class='saveText'>Tallenna kohde</span></div><p style='margin:0'><span style='color:#36A8D5;text-decoration:underline;' onclick='confirm(\"${id}\", false);map.infoWindow.hide()'>Poista kohde</span></p>",
            "info": "<form id='info' name='${name}'><table><tr><td><tr><td class='infoCheck'><input type='checkbox' id='value1' /></td><td><label for='value1'>Asumisen hinta-laatusuhde on kohdallaan</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value0' /></td><td><label for='value0'>Historian havina tuntuu</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value5' /></td><td><label for='value5'>Ympäristö on kaunis</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value7' /></td><td><label for='value7'>Rakentamisen väljyys on sopiva</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value6' /></td><td><label for='value6'>Paikan ilmeeseen vaikuttaminen on mahdollista</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value2' /></td><td><label for='value2'>Rakentamisen tiiviys on sopiva</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value3' /></td><td><label for='value3'>Ympäristö on viimeisteltyä</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value4' /></td><td><label for='value4'>Ympäristö on siisti</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value8' /></td><td><label for='value8'>Muu asia, mikä?</label></td></tr><tr class='surtextbox'><td colspan='2'><input type='text' name='omaKriteeriText' id='omaKriteeriText' class='infoTextBox' /></td></tr></table><div class='button saveShort' onclick='submitInfoForm(\"info\",\"${valuename}\");map.infoWindow.hide()' ><span class='saveText'>Sulje ikkuna</span></div><p style='margin:0'><span style='color:#36A8D5;text-decoration:underline;' onclick='removeGraph(\"${id}\");map.infoWindow.hide()'>Poista kohde</span></p>",
            "formObjects": [
                {
                    "type": "Form",
                    "json": {
                        "name": "info",
                        "method": "post",
                        "action": ""
                    },
                    "node": "info"
                }, {
                    "type": "TextBox",
                    "json": {
                        "name": "omaKriteeriText",
                        "type": "text",
                        "style": "margin-left: 20px"
                    },
                    "node": "omaKriteeriText"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "asuminenHinta"
                    },
                    "node": "value1"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "histHavina"
                    },
                    "node": "value0"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "ymparistonKauneus"
                    },
                    "node": "value5"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "rakennusValjyys"
                    },
                    "node": "value7"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "ympVaikutus"
                    },
                    "node": "value6"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "rakennusTiiviys"
                    },
                    "node": "value2"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "ympViimeistely"
                    },
                    "node": "value3"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "ymparistonSiisteys"
                    },
                    "node": "value4"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "omaKriteeri"
                    },
                    "node": "value8"
                }
            ],
            "confirmHeight": 400,
            "confirmWidth": 250,
            "infoWidth": 250,
            "infoHeight": 400
        },
        "appearanceM": {
            "confirm": "<form id='info' name='${name}'><table><tr><td class='infoCheck'><input type='checkbox' id='value1' /></td><td><label for='value1'>Asumisen hinta-laatusuhde on huono</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value0' /></td><td><label for='value0'>Historiallisuus puuttuu</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value5' /></td><td><label for='value5'>Rakentaminen on liian väljää</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value7' /></td><td><label for='value7'>Ympäristö on ruma</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value6' /></td><td><label for='value6'>Paikan ilmeeseen vaikuttaminen on mahdotonta</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value2' /></td><td><label for='value2'>Rakentaminen on liian tiivistä</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value3' /></td><td><label for='value3'>Ympäristön viimeistely puuttuu</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value4' /></td><td><label for='value4'>Ympäristö on epäsiisti</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value8' /></td><td><label for='value8'>Muu asia, mikä?</label></td></tr><tr><td colspan='2'><input type='text' name='omaKriteeriText' id='omaKriteeriText' class='infoTextBox' /></td></tr></table><div class='button saveLong' onclick='confirm(\"${id}\",true);submitInfoForm(\"info\",\"${valuename}\");map.infoWindow.hide()'><span class='saveText'>Tallenna kohde</span></div><p style='margin:0'><span style='color:#36A8D5;text-decoration:underline;' onclick='confirm(\"${id}\", false);map.infoWindow.hide()'>Poista kohde</span></p>",
            "info": "<form id='info' name='${name}'><table><tr><td><tr><td class='infoCheck'><input type='checkbox' id='value1' /></td><td><label for='value1'>Asumisen hinta-laatusuhde on huono</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value0' /></td><td><label for='value0'>Historiallisuus puuttuu</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value5' /></td><td><label for='value5'>Rakentaminen on liian väljää</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value7' /></td><td><label for='value7'>Ympäristö on ruma</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value6' /></td><td><label for='value6'>Paikan ilmeeseen vaikuttaminen on mahdotonta</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value2' /></td><td><label for='value2'>Rakentaminen on liian tiivistä</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value3' /></td><td><label for='value3'>Ympäristön viimeistely puuttuu</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value4' /></td><td><label for='value4'>Ympäristö on epäsiisti</label></td></tr><tr><td class='infoCheck'><input type='checkbox' id='value8' /></td><td><label for='value8'>Muu asia, mikä?</label></td></tr><tr class='surtextbox'><td colspan='2'><input type='text' name='omaKriteeriText' id='omaKriteeriText' class='infoTextBox' /></td></tr></table><div class='button saveShort' onclick='submitInfoForm(\"info\",\"${valuename}\");map.infoWindow.hide()' ><span class='saveText'>Sulje ikkuna</span></div><p style='margin:0'><span style='color:#36A8D5;text-decoration:underline;' onclick='removeGraph(\"${id}\");map.infoWindow.hide()'>Poista kohde</span></p>",
            "formObjects": [
                {
                    "type": "Form",
                    "json": {
                        "name": "info",
                        "method": "post",
                        "action": ""
                    },
                    "node": "info"
                }, {
                    "type": "TextBox",
                    "json": {
                        "name": "omaKriteeriText",
                        "type": "text",
                        "style": "margin-left: 20px"
                    },
                    "node": "omaKriteeriText"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "asuminenHinta"
                    },
                    "node": "value1"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "histHavina"
                    },
                    "node": "value0"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "rakennusValjyys"
                    },
                    "node": "value5"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "ymparistonKauneus"
                    },
                    "node": "value7"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "ympVaikutus"
                    },
                    "node": "value6"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "rakennusTiiviys"
                    },
                    "node": "value2"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "ympViimeistely"
                    },
                    "node": "value3"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "ymparistonSiisteys"
                    },
                    "node": "value4"
                }, {
                    "type": "CheckBox",
                    "json": {
                        "name": "omaKriteeri"
                    },
                    "node": "value8"
                }
            ],
            "confirmHeight": 400,
            "confirmWidth": 250,
            "infoWidth": 250,
            "infoHeight": 400
        }
    */
    }
}