const API_KEY = "pk.eyJ1Ijoibnlhc2VsaSIsImEiOiJja3JodHhxeXY0bjBsMnduMzc5YWd1ZXlxIn0.DVKYTo-dNkhAYZ7yDYNlJw";
const MAP_URL = "https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token=";
const DATA1 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(DATA1,function (data){
    features(data.features);
});


function features(earthquakes){
    function onEachFeature(feature, layer){
        layer.bindPopup("<h4>"+feature.properties.place+"</h4>"+
                        "<hr><p>Magnitude: "+feature.properties.mag+"</p>"+
                        "<p>Time: "+new Date(feature.properties.time)+"</p>")
    }
    var eq = L.geoJSON(earthquakes,{
        onEachFeature:onEachFeature,
        pointToLayer:function (feature,coord) {
            var color;
            var r = 255;
            var g = Math.floor(255-80*feature.properties.mag);
            var b = Math.floor(255-80*feature.properties.mag);
            color = "rgb("+r+","+g+","+b+")";
            var mapPoints = {
                radius:3*feature.properties.mag,
                fillColor:"red",
                weight: 1,
                opacity: 1,
                fillOpacity: 1
            };
            return L.circleMarker(coord,mapPoints);    
        }
    });

    displayMap(eq);

}

function displayMap(earthquakes){
    var streetmap = L.tileLayer(MAP_URL+API_KEY);
    var baseMaps = {
        "Street Map":streetmap
    };
    var overlayMaps = {
        Earthquakes:earthquakes
    };
    var fineMap = L.map("map",{
        center:[41.78,-87.59],
        zoom: 5,
        layers:[streetmap, earthquakes] 
    });

    
function eqColors(num){
    if (num<1){
        return "rgb(255,255,255)"
    }
    else if (num<2){
        return "rgb(255,225,225)"
    }
    else if (num<3){
        return "rgb(255,195,195)"
    }
    else if (num<4){
        return "rgb(255,165,165)"
    }
    else if (num<5){
        return "rgb(255,135,135)"
    }
    else if (num<6){
        return "rgb(255,105,105)"
    }
    else if (num<7){
        return "rgb(255,75,75)"
    }
    else if (num<8){
        return "rgb(255,45,45)"
    }
    else if (num<9){
        return "rgb(255,15,15)"
    }
}
    var legend = L.control({position: "topright"});
    legend.onAdd = function (map){
        var div = L.DomUtil.create("div","info legend"),
        grades = [0,1,2,3,4,5,6,7,8],
        labels = [];
        div.innerHTML += "Magnitude<br/>"
        for (var i = 0; i<grades.length; i++){
            div.innerHTML += '<i style = "background:'+ eqColors(grades[i] + 1)+ '">&nbsp&nbsp&nbsp&nbsp</i>'+
            grades[i]+ (grades[i+1]? '&ndash'+grades[i+1]+'<br/>':"+"); 
        }
        return div;
    };
    legend.addTo(fineMap);
}
