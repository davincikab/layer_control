mapboxgl.accessToken = 'pk.eyJ1IjoicGlyb21hIiwiYSI6ImNqeWxzNDN3cTAzMzYzb3F3enlvcXVvcnMifQ.iTd9n1YUC-M7J3OpMN_ATg';
var map = new mapboxgl.Map({
    container: 'map',
    style:'mapbox://styles/mapbox/dark-v10',
    center: [-122.067310000256271, 38.247539999971082], // master center
    zoom: 10, // master zoom
    attribution:false,
});

map.on("load", function(e) {
    map.addSource('route', {
        type:'geojson',
        data:'layers/route.geojson'
    });

    map.addLayer({
        id:'transit-route',
        source:'route',
        type:'line',
        paint:{
            'line-color':'green',
            'line-width':3
        },
        layout:{
            'visibility':'none'
        }
    });

    // city boundary
    map.addSource("city-boundary", {
        type:'geojson',
        data:'layers/city_boundary.geojson'
    });

    map.addLayer({
        id:'city-boundary',
        source:'city-boundary',
        type:'line',
        paint:{
            'line-color':'white',
            'line-width':2,
            'line-dasharray':[5,2]
        },
        layout:{
            'visibility':'none'
        }
    });

    // census block
    map.addSource("census-block", {
        type:'geojson',
        data:'layers/census_block.geojson'
    });

    map.addLayer({
        id:'census-block',
        source:'census-block',
        type:'line',
        paint:{
            'line-color':'gray',
            'line-width':2,
        },
        layout:{
            'visibility':'none'
        }
    });

    // 
});

var layers = {
    'Population Map':'population',
    'Mobility Vulnerability Index':'mvi',
    'Paratransit Activity':'paratransit-activity',
    'Transit Activity':'transit-activity',
    'Average AM Peak Trips':'average-am-trip',
    'Employee Count':'employee',
    'Unemployment Rate':'unemployment-rate',
    'Transit Route':'transit-route',
    'Census Block':'census-block',
    'City Boundary':'city-boundary'
};

class LayerControl {
    constructor(layers) {
        this.layers = layers;
    }

    toggleLayer(layerId, checked) {
        console.log("toggling layer");
        console.log(layerId);

        var visibility = checked ? 'visible' : 'none';
        this._map.getLayer(layerId) ? this._map.setLayoutProperty(layerId, 'visibility', visibility) : false;
    }

    onAdd(map) {
        this._map = map;

        this._container = document.createElement("div");
        this._container.className = 'mapboxgl-ctrl layer-control';

        Object.keys(this.layers).forEach(key => {
            let layer = this.layers[key];

            let layerDiv = document.createElement("div");

            let layerCheckbox = document.createElement("input");
            layerCheckbox.type = "checkbox";
            layerCheckbox.className = "layer-element";
            layerCheckbox.value = layer;
            layerCheckbox.id = layer;

            layerDiv.append(layerCheckbox);
            layerDiv.innerHTML += "<label>"+ key +"</label>"

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
