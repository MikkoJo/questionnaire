/*global dojo, map,
*/
/*
loadanimation.js file contains everything needed for loading flash content on page.
*/

function showLoading() {
    esri.show(dojo.byId("loadingImg"));
    map.disableMapNavigation();
    //map.hideZoomSlider();
}

function hideLoading() {
    esri.hide(dojo.byId("loadingImg"));
    map.enableMapNavigation();
    //map.showZoomSlider();
}

function loadingAnimation(){
    
    dojo.connect(map, "onLoad", showLoading);
    dojo.connect(map, "onZoomStart", showLoading);
    dojo.connect(map, "onPanStart", showLoading);
    
    dojo.connect(tiledMapServiceLayer, "onUpdate", hideLoading);
    dojo.connect(imageServiceLayer, "onUpdate", hideLoading);
    esri.hide(dojo.byId("loadingImg"));
    //hideLoading();
}

