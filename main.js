mapboxgl.accessToken = 'pk.eyJ1IjoicGlyb21hIiwiYSI6ImNqeWxzNDN3cTAzMzYzb3F3enlvcXVvcnMifQ.iTd9n1YUC-M7J3OpMN_ATg';
var map = new mapboxgl.Map({
    container: 'map',
    style:'mapbox://styles/mapbox/dark-v10',
    center: [-7.594081153831553, 14.730749011074153], // master center
    zoom: 2, // master zoom
    attribution:false,
});

map.on("load", function(e) {
    
});

var layers = {
    'Population Map':'population',
    'Mobility Vulnerability Index':'mvi',
    'Paratransit Activity':'paratransit-activity',
    'Transit Activity':'transit-activity',
    'Average AM Peak Trips':'average-am-trip',
    'Employee Count':'employee',
    'Unemployment Rate':'unemployment-rate',
    'Transit Route':'transit_route',
    'Census Block':'census-block',
    'City Boundary':'city-boundary'
};

class LayerControl {
    constructor(layers) {
        this.layers = layers;
    }

    toggleLayer(layerId, checked) {
        var visibility = checked ? 'visible' : 'none';
        map.getSource(layerId) ? map.setLayoutProperty(layerId, 'visibility', visibility) : false;
    }

    onAdd(map) {
        this._map = map;

        this._container = document.createElement("div");
        this._container.className = 'mapboxgl-ctrl layer_control';

        Object.keys(this.layers).forEach(key => {
            let layer = this.layers[key];

            let layerDiv = document.createElement("div");
            let layerCheckbox = document.createElement("input");

            layerCheckbox.type = "checkbox";
            layerCheckbox.value = layer;
            layerCheckbox.id = layer;

            layerDiv.append(layerCheckbox);
            layerDiv.innerHTML = "<label>"+ layer +"</label>"

            this._container.append(layerDiv);
        });

        return this._container;
    }

    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }
}

var layerControl = new LayerControl(layers);
map.addControl(layerControl, 'top-right');


var layerCheckboxes = document.querySelectorAll(".layer-element");
layerCheckboxes.forEach(layerCheckbox => {
    layerCheckbox.onchange = function(e) {
        let { value, checked } = e.target;
        layerControl.toggleLayer(value, checked);
    }
});
