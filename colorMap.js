import { seniunijos } from '/JS/region.js';

var map = L.map('map', {zoomControl: false}).setView([54.6872, 25.2797], 10);

L.control.zoom({
  position: 'bottomleft' // Set this to 'topleft', 'topright', 'bottomleft', or 'bottomright'
}).addTo(map);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//======================pasirinkimu lango atidarymas/uzdarymas=======================\\
L.geoJSON(seniunijos).addTo(map);

let menuButton = document.querySelector('#button-menu img');
let sidePop = document.getElementById('sideBar');

function sideBarPopUp()
{
  sidePop.style.display='block';
}

menuButton.addEventListener('click', sideBarPopUp);

let exitButton = document.querySelector('#sideBar img')
function sideBarRemove()
{
  sidePop.style.display='none';
}

exitButton.addEventListener('click', sideBarRemove);
//========================================================================\\

const clearButton = document.getElementById('clearButton');
//const radioButtons = document.querySelectorAll('input[name="obj_Amount"]');


function clearSelections()
{
  radioButtons.forEach(button => {button.checked=false});
  info.update();
}


clearButton.addEventListener('click', clearSelections);

// Seniuniju atitinkamos spalvos pagal duomenys 
function getColor(d) {
  return d > 15000 ? 'rgba(128, 0, 0, 0.6)' :    // Dark Red
         d > 10000 ? 'rgba(178, 34, 34, 0.6)' :   // Firebrick
         d > 8000  ? 'rgba(255, 0, 0, 0.6)' :     // Red
         d > 6000  ? 'rgba(255, 99, 71, 0.6)' :    // Tomato
         d > 4000  ? 'rgba(255, 69, 0, 0.6)' :     // Orange Red
         d > 2000  ? 'rgba(255, 160, 122, 0.6)' :  // Light Salmon
         d > 500   ? 'rgba(255, 182, 193, 0.6)' :  // Light Pink
                    'rgba(255, 240, 245, 0.6)';   // Very Light Pink
}

function getColorSmallNumbers(d) {
  return d > 6 ? 'rgba(128, 0, 0, 0.6)' :    // Dark Red
         d > 5  ? 'rgba(255, 0, 0, 0.6)' :     // Red
         d > 3  ? 'rgba(255, 69, 0, 0.6)' :     // Orange Red
         d > 1   ? 'rgba(255, 182, 193, 0.6)' :  // Light Pink
                    'rgba(255, 240, 245, 0.6)';   // Very Light Pink
}

  function style(feature) {
    return {
        fillColor: getColor(feature.properties.population),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
  }


var geojson;
geojson = L.geoJson(seniunijos, {style: style}).addTo(map);
// ======================================================

//=========teritorijos paryskinimas,priartinimas===========\\
function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
      weight: 4,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7
  });

  layer.bringToFront();
  info.update(layer.feature.properties);
}

function resetHighlight(e) {
  geojson.resetStyle(e.target);
  info.update();
}

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
  layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
  });
}

geojson = L.geoJson(seniunijos, {
  style: style,
  onEachFeature: onEachFeature
}).addTo(map);
//========================================================\\

var info = L.control({position: 'topleft'});

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
  if (props) {
      this._div.innerHTML = '<h4>Vilniaus rajono seniūnijos</h4>' +
          '<b>' + props.name + '</b><br />' + props.population + ' gyventojų';
  } else {
      this._div.innerHTML = '<h4>Vilniaus rajono seniūnijos</h4>';
  }
};

info.addTo(map);



var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 500, 2000, 4000, 6000, 8000, 10000, 15000],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) 
    {
      div.innerHTML += 
          '<i style="background:' + getColor(grades[i] + 1) + '; opacity: 1"></i> ' + grades[i];

      if (grades[i + 1]) {
          div.innerHTML += '&ndash;' + grades[i + 1] + '<br>';
      } else {
          div.innerHTML += '+';
      }
    }

    return div;
};

legend.addTo(map);

// ==============================================================================