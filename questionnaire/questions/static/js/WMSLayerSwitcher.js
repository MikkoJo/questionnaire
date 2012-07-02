$('body').on('initHook', function(){
    create_WMS();
}
);
var capabilities;
function WMSGetCapabilities() {
    var wmsreader = new OpenLayers.Format.WMSCapabilities({version: '1.3.0'});
    
    $.get(questionnaire.WMScapabilities_url, 
            function(data) {
                capabilities = wmsreader.read(data);
                WMSLayerAdd(capabilities);
                WMSLayerSwitcher(capabilities, wmsLayer);
                //return capabilities;
            });
    
}

function WMSLayerAdd(wmscapabilities) {
    var wms_layers,i;
    
    wms_layers = "";
    if (questionnaire.initial_wms_layers !== "" ) {
        wms_layers = questionnaire.initial_wms_layers;
    }
    else {
        for(i = 0;i < wmscapabilities.capability.layers.length; i++) {
            wms_layers = wms_layers + wmscapabilities.capability.layers[i].name;
            if(i < wmscapabilities.capability.layers.length -1) {
                wms_layers = wms_layers + ","; 
            }
        }
        questionnaire.initial_wms_layers = wms_layers;
    }
    wmsLayer = new OpenLayers.Layer.WMS(wmscapabilities.service.title, 
//    wmscapabilities.service.href,
    wmscapabilities.capability.request.getmap.href,
    {layers: wms_layers, transparent: true, format: "image/png"});
    
    map.addLayer(wmsLayer);
}

function WMSLayerSwitcher(wmscapabilities, WMS_layer) {
    var new_div = $(".WMSLayers_container"),
        wms_layers = wmscapabilities.capability.layers,
        check;
    
    for(var i = 0; i < wms_layers.length; i++) {
        // create input element
        var inputElem = document.createElement("input");
        inputElem.id = "WMSLayerSwitcher_input_" + wms_layers[i].name;
        inputElem.name = wms_layers[i].name;
        inputElem.type = "checkbox";
        inputElem.value = wms_layers[i].name;
        if(questionnaire.initial_wms_layers.search(inputElem.value) !== -1) {
            check = true;
        }
        else {
            check = false;
        }
        inputElem.checked = check;
        inputElem.defaultChecked = check;
        inputElem.className = "WMSSwitcher_input";
        
        var labelElem = $(document.createElement("label"));
        labelElem.attr("for", inputElem.id);
        labelElem.html(wms_layers[i].title);
//        labelElem.style.verticalAlign = "baseline";
        
        var br = document.createElement("br");
        new_div.append(inputElem);
        new_div.append(labelElem);
        new_div.append(br);
    }
    
    //new_div.className = "WMSSwitcher_container";
    //var minmax_div = document.createElement('div');
    //minmax_div.className = 'minmax max';
    //new_div.appendChild(minmax_div);
    //$('body').append(new_div);
    $('.WMSSwitcher_input').change(function(evt) {
                var new_layer_string = "";
                var len = $('.WMSSwitcher_input:checked').length;
                $('.WMSSwitcher_input:checked').each(function(index) {
                  new_layer_string = new_layer_string + this.name;
                  if(index < len -1) {
                      new_layer_string = new_layer_string + ",";
                  }
                  //WMS_layer.mergeNewParams({layers: new_layer_string});
                });
                WMS_layer.mergeNewParams({layers: new_layer_string});

    });
    $('.maximize').click(function(evt) {
//        $('.WMSLayers_container').toggleClass('empty');
        $('.WMSLayers_container').slideToggle('slow');
        $(evt.currentTarget).toggleClass('empty');
        $('.minimize').toggleClass('empty');
        
    })
    $('.minimize').click(function(evt) {
//        $('.WMSLayers_container').toggleClass('empty');
        $('.WMSLayers_container').slideToggle('slow');
        $(evt.currentTarget).toggleClass('empty');
        $('.maximize').toggleClass('empty');
    })
    
    // Lazy way to move WMSSwitcher_container to map.layerContainerDiv
    $(map.layerContainerDiv).append($(".WMSSwitcher_container").detach());
}

function create_WMS() {
    WMSGetCapabilities();
}
