import { seniunijos } from 'region.js';

var map = L.map('map', {zoomControl: false}).setView([54.6872, 25.2797], 10);
//L.marker([54.57944, 25.19589]).addTo(map);
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

let schoolNum = document.getElementById('educationLocation');
let add1Button=document.getElementById('add1')

let schoolVisible = false;

function toggleSchoolPopup() {
  if (schoolVisible) {
    schoolNum.style.display = 'none';
    add1Button.innerHTML = "+";
  } else {
    schoolNum.style.display = 'block';
    add1Button.innerHTML = "-";
  }
  schoolVisible = !schoolVisible;
}

add1Button.addEventListener('click', toggleSchoolPopup);

let kindergartenNum = document.getElementById('culturalLocation');
let add2Button=document.getElementById('add2')
let kindergartenVisible = false;

function toggleKindergartenPopup() {
  if (kindergartenVisible) {
    kindergartenNum.style.display = 'none';
    add2Button.innerHTML = "+";
  } else {
    kindergartenNum.style.display = 'block';
    add2Button.innerHTML = "-";
  }
  kindergartenVisible = !kindergartenVisible;
}

add2Button.addEventListener('click', toggleKindergartenPopup);

let geojson = null;
const clearButton = document.getElementById('clearButton');
const radioButtons = document.querySelectorAll('input[name="obj_Amount"]');
let arGalima=0;

function clearSelections()
{
  radioButtons.forEach(button => {button.checked=false});
  info.update();
  updateMap();
}


clearButton.addEventListener('click', clearSelections);

// Seniuniju atitinkamos spalvos pagal duomenys 
function getColorBigNumbers(d) {
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
  return d > 5 ? 'rgba(128, 0, 0, 0.6)' :    // Dark Red
         d > 3  ? 'rgba(255, 0, 0, 0.6)' :     // Red
         d > 1  ? 'rgba(255, 160, 122, 0.6)' :  // Light Salmon
                    'rgba(255, 240, 245, 0.6)';   // Very Light Pink
}

// Function to count total education facilities
function countEducationFacilities(feature) {
  const education = feature.properties.education || {};
  const kindergartenCount = education.kindergarten?.length || 0;
  const progymnasiumCount = education.progymnasium?.length || 0;
  const gymnasiumCount = education.gymnasium?.length || 0;
  const artSchoolCount = education.artSchool?.length || 0;
  const vocationalSchoolCount = education.vocationalSchool?.length || 0;
  
  // Calculate total
  return kindergartenCount + progymnasiumCount + gymnasiumCount + 
         artSchoolCount + vocationalSchoolCount;
}

// Function to count total culture facilities
function countCultureFacilities(feature) {
  const culture = feature.properties.culture || {};
  const culturalCentersCount = culture.culturalCenters?.length || 0;
  const librariesCount = culture.libraries?.length || 0;
  
  // Calculate total
  return culturalCentersCount + librariesCount;
}

// Generic function to count facilities by property path
function countFacilities(feature, propertyPath) {
  // Handle nested paths like 'education.kindergarten'
  const pathParts = propertyPath.split('.');
  let current = feature.properties;
  
  // Navigate through the path
  for (const part of pathParts) {
    if (!current || typeof current !== 'object') return 0;
    current = current[part];
  }
  
  // Return the length if it's an array, otherwise 0
  return Array.isArray(current) ? current.length : 0;
}

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
  info.update(layer.feature.properties, word);
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
//========================================================\\

// Add this at the top of your file, outside any function
let markerStates = {
  kindergarten: false,
  progymnasium: false,
  gymnasium: false,
  artSchool: false,
  vocationalSchool: false,
  culturalCenter: false,
  library: false,
  nurseryKindergarten: false,
  primary: false
};

document.querySelectorAll('[data-marker-location]').forEach(button => {
  button.addEventListener('click', function(e) {
    let attribute = this.getAttribute('data-marker-location');
    
    // Toggle the active class
    this.classList.toggle('active');
    let emoji = '';
    if(attribute == 'kindergarten' || attribute == 'progymnasium' || attribute == 'gymnasium' || 
      attribute == 'artSchool' || attribute == 'vocationalSchool' || attribute == 'nurseryKindergarten' || attribute == 'primary') {
     
       // Handle education locations
       seniunijos.features.forEach(feature => {
           if(feature.properties.education && feature.properties.education[attribute]) {
               const locations = feature.properties.education[attribute];
               
               // Set emoji for each type of education attribute
               switch (attribute) {
                   case 'kindergarten':
                       emoji = '👶'; // Kindergarten
                       break;
                   case 'progymnasium':
                       emoji = '🏫'; // Progymnasium
                       break;
                   case 'gymnasium':
                       emoji = '🎓'; // Gymnasium
                       break;
                   case 'artSchool':
                       emoji = '🎨'; // Art School
                       break;
                   case 'vocationalSchool':
                       emoji = '🛠️'; // Vocational School
                       break;
                   case 'nurseryKindergarten':
                       emoji = '🧸'; // Nursery Kindergarten
                       break;
                   case 'primary':
                       emoji = '👨‍🏫'; // Preschool
                       break;
                   default:
                       emoji = '📍'; // Default marker
                       break;
               }
   
               // Iterate through the locations and add the corresponding emoji marker
               locations.forEach(location => {
                   if (location.coordinates && location.coordinates.length === 2) {
                       if (!markerStates[attribute]) {
                           location.marker = L.marker([location.coordinates[1], location.coordinates[0]], {
                               icon: L.divIcon({
                                   className: 'emoji-icon',
                                   html: emoji,  // Use emoji based on the attribute
                                   iconSize: [10, 10]
                               })
                           }).addTo(map).bindPopup(location.title);
                       } else {
                           if (location.marker) {
                               map.removeLayer(location.marker);
                               location.marker = null;
                           }
                       }
                   }
               });
           }
       });
   } else if(attribute == 'culturalCenter' || attribute == 'library') {
      // Handle cultural locations
      seniunijos.features.forEach(feature => {
        if(feature.properties.culturalSector && feature.properties.culturalSector[attribute]) {
          const locations = feature.properties.culturalSector[attribute];
          switch (attribute) {
            case 'culturalCenter':
                emoji = '🎭'; // Cultural Center
                break;
            case 'library':
                emoji = '📚'; // Library
                break;
            default:
                emoji = '📍'; // Default marker
                break;
        }
          locations.forEach(location => {
            if (location.coordinates && location.coordinates.length === 2) {
              if (!markerStates[attribute]) {
                location.marker = L.marker([location.coordinates[1], location.coordinates[0]], {
                  icon: L.divIcon({
                      className: 'emoji-icon',
                      html: emoji,  // Use emoji based on the attribute
                      iconSize: [10, 10]
                  })
              }).addTo(map).bindPopup(location.title);
              } else {
                if (location.marker) {
                  map.removeLayer(location.marker);
                  location.marker = null;
                }
              }
            }
          });
        }
      });
    }
    
    markerStates[attribute] = !markerStates[attribute];
  });
});

let word=0;
function updateMap(selectedCat)
{

  if (geojson) {
    geojson.remove(); // pašalina seną sluoksnį
  }

  let style;
  let point;
  switch(selectedCat)
  {
    case 'population':
      style = (feature) => {
        word=feature.properties.population;
        return {
          fillColor: getColorBigNumbers(feature.properties.population), // Use population for coloring
          weight: 2,
          opacity: 1,
          color: 'black',
          dashArray: '3',
          fillOpacity: 1
        };
      };
      arGalima=1;
      break;
    case 'education':
      style = (feature) => {
        // Use the new function to count education facilities
        word = countEducationFacilities(feature);
        return {
          fillColor: getColorSmallNumbers(word),
          weight: 2,
          opacity: 1,
          color: 'black',
          dashArray: '3',
          fillOpacity: 0.7
        };
      };
      arGalima=1;
      break;
    case 'culture':
      style = (feature) => {
        // Use the new function to count culture facilities
        word = countCultureFacilities(feature);
        return {
          fillColor: getColorSmallNumbers(word),
          weight: 2,
          opacity: 1,
          color: 'black',
          dashArray: '3',
          fillOpacity: 0.7
        };
      };
      arGalima=1;
      break;
    case 'kindergarten':
      style = (feature) => {
        word = countFacilities(feature, 'education.kindergarten');
        return {
          fillColor: getColorSmallNumbers(word),
          weight: 2,
          opacity: 1,
          color: 'black',
          dashArray: '3',
          fillOpacity: 0.7
        };
      };
      arGalima=1;
      break;
      case 'nurseryKindergarten':
      style = (feature) => {
        word = countFacilities(feature, 'education.nurseryKindergarten');
        return {
          fillColor: getColorSmallNumbers(word),
          weight: 2,
          opacity: 1,
          color: 'black',
          dashArray: '3',
          fillOpacity: 0.7
        };
      };
      arGalima=1;
      break;
      case 'primary':
      style = (feature) => {
        word = countFacilities(feature, 'education.primary');
        return {
          fillColor: getColorSmallNumbers(word),
          weight: 2,
          opacity: 1,
          color: 'black',
          dashArray: '3',
          fillOpacity: 0.7
        };
      };
      arGalima=1;
      break;
    case 'progymnasium':
      style = (feature) => {
        word = countFacilities(feature, 'education.progymnasium');
        return {
          fillColor: getColorSmallNumbers(word),
          weight: 2,
          opacity: 1,
          color: 'black',
          dashArray: '3',
          fillOpacity: 0.7
        };
      };
      arGalima=1;
      break;
     case 'gymnasium':
      style = (feature) => {
        word = countFacilities(feature, 'education.gymnasium');
        return {
          fillColor: getColorSmallNumbers(word),
          weight: 2,
          opacity: 1,
          color: 'black',
          dashArray: '3',
          fillOpacity: 0.7
        };
      };
      arGalima=1;
      break;
    case 'artSchool':
      style = (feature) => {
        word = countFacilities(feature, 'education.artSchool');
        return {
          fillColor: getColorSmallNumbers(word),
          weight: 2,
          opacity: 1,
          color: 'black',
          dashArray: '3',
          fillOpacity: 0.7
        };
      };
      arGalima=1;
      break;
    case 'vocationalSchool':
      style = (feature) => {
        word = countFacilities(feature, 'education.vocationalSchool');
        return {
          fillColor: getColorSmallNumbers(word),
          weight: 2,
          opacity: 1,
          color: 'black',
          dashArray: '3',
          fillOpacity: 0.7
        };
      };
      arGalima=1;
      break;
    case 'culturalCenter':
      style = (feature) => {
        word = countFacilities(feature, 'culture.culturalCenters');
        return {
          fillColor: getColorSmallNumbers(word),
          weight: 2,
          opacity: 1,
          color: 'black',
          dashArray: '3',
          fillOpacity: 0.7
        };
      };
      arGalima=1;
      break;
    case 'library':
      style = (feature) => {
        word = countFacilities(feature, 'culture.libraries');
        return {
          fillColor: getColorSmallNumbers(word),
          weight: 2,
          opacity: 1,
          color: 'black',
          dashArray: '3',
          fillOpacity: 0.7
        };
      };
      arGalima=1;
      break;
    default:
      style = (feature) => {
        return {
          fillColor: 'rgba(6, 112, 6, 0.73)', // Light green with 0.6 opacity to match other styles
          weight: 2,
          opacity: 1,
          color: 'black',
          dashArray: '3',
          fillOpacity: 0.5
        };
      };
      arGalima=0;
      break;
  }
  
  geojson = L.geoJson(seniunijos, 
    {
      style: style,
      onEachFeature: onEachFeature
    }
  ).addTo(map);
  
}

function setUpRadioButtonListeners() {
  var radioButtons = document.querySelectorAll('input[name="obj_Amount"]');
  
  radioButtons.forEach(function(button) {
    button.addEventListener('change', handleRadioButtonChange);
  });
}

function handleRadioButtonChange(e) {
  const selectedCategory = e.target.value; // Get the value of the selected radio button
  updateMap(selectedCategory); // Update the map based on the selected category
}


setUpRadioButtonListeners();
updateMap(); 

var info = L.control({position: 'topleft'});

info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
  this.update();
  return this._div;
};

info.update = function (props, zodis) {
  if (props) {
      this._div.innerHTML = '<h4>Vilniaus rajono seniūnijos</h4>' +
          '<b>' + props.name + '</b>' + (zodis ? '<br />' + zodis + ' gyventojų' : '');
  } else {
      this._div.innerHTML = '<h4>Vilniaus rajono seniūnijos</h4>';
  }
};

info.addTo(map);
// ======================================================



