import { seniunijos } from './region.js';

var map = L.map('map', {zoomControl: false}).setView([54.6872, 25.2797], 10);
//L.marker([54.57944, 25.19589]).addTo(map);
L.control.zoom({
  position: 'bottomleft' // galima pasirinkti 'topleft', 'topright', 'bottomleft', or 'bottomright'
}).addTo(map);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var info = L.control({position: 'topleft'});

let isDistance = false;

info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};

info.update = function (props, value) {
  if(isDistance)
    {
      this._div.innerHTML = '<h4>Vilniaus rajono seniūnijos</h4>' +
      '<b>' + `Atstumas: ${(props / 1000).toFixed(2)} km` + '</b>';
    }
  else if (props) {
    let html = '<h4>Vilniaus rajono seniūnijos</h4>' +
      '<div style="text-align: center;"><b>' + props.name + '</b></div>';
    
    if (selectedCat === 'default' || !selectedCat) {
      html += '<div style="text-align: center;" id="coatOfArmsContainer"><img src="herbai/' + props.name2 + '.png" alt="' + props.name2 + ' herbas" style="width: 150px; height: auto; margin: 10px 0;" onerror="this.parentElement.style.display=\'none\'"></div>';
    }
    
    if (value !== undefined && value !== null) {
      html += '<div style="text-align: center;"><b>' + value + '</b></div>';
    }
    
    this._div.innerHTML = html;
  } 
  else {
   this._div.innerHTML = '<h4>Vilniaus rajono seniūnijos</h4>' +
  '<div style="text-align: center;" id="coatOfArmsContainer"><img src="herbai/VilniausRSHerbas.png" alt="Vilniaus rajono herbas" style="width: 80px; height: auto; margin: 10px 0;"></div>';
  }
};

info.addTo(map);

// add the GeoJSON layer
L.geoJSON(seniunijos).addTo(map);

let menuButton = document.querySelector('#button-menu img');
let sidePop = document.getElementById('sideBar');

function toggleSideBar() {
  if (sidePop.style.display === 'block') {
    sidePop.style.display = 'none';
  } else {
    sidePop.style.display = 'block';
  }
}

menuButton.addEventListener('click', toggleSideBar);

});
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

let medicineNum = document.getElementById('medicineLocation');
let add3Button=document.getElementById('add3')
let medicineVisible = false;

function toggleMedicinePopup() {
  if (medicineVisible) {
    medicineNum.style.display = 'none';
    add3Button.innerHTML = "+";
  } else {
    medicineNum.style.display = 'block';
    add3Button.innerHTML = "-";
  }
  medicineVisible = !medicineVisible;
}

add3Button.addEventListener('click', toggleMedicinePopup);




let additionalNum = document.getElementById('additionalLocation');
let add4Button=document.getElementById('add4')
let additionalVisible = false;

function toggleAdditionalPopup() {
  if (additionalVisible) {
    additionalNum.style.display = 'none';
    add4Button.innerHTML = "+";
  } else {
    additionalNum.style.display = 'block';
    add4Button.innerHTML = "-";
  }
  additionalVisible = !additionalVisible;
}

add4Button.addEventListener('click', toggleAdditionalPopup);

let selectedCat = null;
let geojson = null;
const clearButton = document.getElementById('clearButton');
const radioButtons = document.querySelectorAll('input[name="obj_Amount"]');
let arGalima=0;

function clearSelections()
{
  radioButtons.forEach(button => {button.checked=false});

  // Salina acrive statusa is marker buttons
  document.querySelectorAll('[data-marker-location]').forEach(button => {
    button.classList.remove('active');
  });

  // salina active statusa is kalbos pasirinkimo mygtuku
  document.querySelectorAll('[data-language]').forEach(button => {
    button.classList.remove('active');
  });
  languageCondition = {
    LT: false,
    PL: false,
    RU: false,
    private: false
  };

  // isvalo visus markerius
  Object.keys(markerStates).forEach(type => {
    seniunijos.features.forEach(feature => {
      if(feature.properties.education && feature.properties.education[type]) {
        const locations = feature.properties.education[type];
        locations.forEach(location => {
          if (location.marker) {
            map.removeLayer(location.marker);
            location.marker = null;
          }
        });
      }
    });
    markerStates[type] = false; // Reset the state
  });

  // isvalo kulturos markerius
  Object.keys(markerStates).forEach(type => {
    seniunijos.features.forEach(feature => {
      if(feature.properties.culturalSector && feature.properties.culturalSector[type]) {
        const locations = feature.properties.culturalSector[type];
        locations.forEach(location => {
          if (location.marker) {
            map.removeLayer(location.marker);
            location.marker = null;
          }
        });
      }
    });
    markerStates[type] = false; // Reset the state
  });

  Object.keys(markerStates).forEach(type => {
    seniunijos.features.forEach(feature => {
      if(feature.properties.healthSector && feature.properties.healthSector[type]) {
        const locations = feature.properties.healthSector[type];
        locations.forEach(location => {
          if (location.marker) {
            map.removeLayer(location.marker);
            location.marker = null;
          }
        });
      }
    });
    markerStates[type] = false; // Reset the state
  });
  info.update();
  updateMap();
}

clearButton.addEventListener('click', clearSelections);

// Seniuniju atitinkamos spalvos pagal duomenys 
function getColorBigNumbers(d) {
  return d > 15000 ? 'rgb(112, 0, 0)' :  
         d > 10000 ? 'rgb(160, 0, 0)' :
         d > 8000  ? 'rgb(202, 0, 0)' :
         d > 6000  ? 'rgb(255, 0, 0)' :
         d > 4000  ? 'rgb(255, 87, 87)' :
         d > 2000  ? 'rgb(255, 146, 146)' :
         d > 500   ? 'rgb(255, 204, 204)' :
                    'rgb(255, 255, 255)';  
}

function getColorSmallNumbers2(d) {
  return d > 6 ? 'rgba(128, 0, 0, 0.6)' :    
         d > 5 ? 'rgba(139, 0, 0, 0.6)' :     
         d > 4 ? 'rgba(178, 34, 34, 0.6)' :   
         d > 3 ? 'rgba(220, 20, 60, 0.6)' :  
         d > 2 ? 'rgba(255, 0, 0, 0.6)' :    
         d > 1 ? 'rgba(255, 69, 0, 0.6)' :    
         d > 0 ? 'rgba(255, 200, 220, 0.6)' : 
                'rgb(255, 255, 255)';   
}

function getColorSmallNumbers(d) {
  return d > 6 ? 'rgb(112, 0, 0)' :  
         d > 5  ? 'rgb(160, 0, 0)' :
         d > 4  ? 'rgb(202, 0, 0)' :
         d > 3  ? 'rgb(255, 0, 0)' :
         d > 2  ? 'rgb(255, 87, 87)' :
         d > 1  ? 'rgb(255, 146, 146)' :
         d > 0  ? 'rgb(255, 204, 204)' :
                  'rgb(255, 255, 255)'; 
}




// Funkcija skaiciuoti visu mokykliu skaiciu
function countEducationFacilities(feature) {
  const education = feature.properties.education || {};
  const kindergartenCount = education.kindergarten?.length || 0;
  const nurseryKindergartenCount = education.nurseryKindergarten?.length || 0;
  const progymnasiumCount = education.progymnasium?.length || 0;
  const gymnasiumCount = education.gymnasium?.length || 0;
  const artSchoolCount = education.artSchool?.length || 0;
  const vocationalSchoolCount = education.vocationalSchool?.length || 0;
  const preSchoolCount = education.preSchool?.length || 0;
  const primaryCount = education.primary?.length || 0;
  const basicSchoolCount = education.basicSchool?.length || 0;
  const schoolKindergartenCount = education.schoolKindergarten?.length || 0;
  const supportSchoolCount = education.supportSchool?.length || 0;
  const sportSchoolCount = education.sportSchool?.length || 0;
 
  return kindergartenCount + nurseryKindergartenCount + progymnasiumCount + gymnasiumCount + 
         artSchoolCount + vocationalSchoolCount + preSchoolCount + primaryCount + basicSchoolCount + schoolKindergartenCount + supportSchoolCount + sportSchoolCount;
}

// Funkcija skaiciuoti visu kulturos objektu skaiciu
function countCultureFacilities(feature) {
  const culture = feature.properties.culturalSector || {};
  const culturalCentersCount = culture.culturalCenter?.length || 0;
  const librariesCount = culture.library?.length || 0;
  
 
  return culturalCentersCount + librariesCount;
}

function countMedicineFacilities(feature) {
  const health = feature.properties.healthSector || {};
  const polyclinicCount = health.polyclinic?.length || 0;
  const ambulatoryCount = health.ambulatory?.length || 0;
  const BpgOfficeCount = health.BpgOffice?.length || 0;
  const familyDoctorCount = health.familyDoctor?.length || 0;

  const medicalStationCount = health.medicalStation?.length || 0;
  const LongTermCareAndNursingHospitalCount = health.LongTermCareAndNursingHospital?.length || 0;
  
 
  return polyclinicCount + ambulatoryCount + BpgOfficeCount + familyDoctorCount + medicalStationCount + LongTermCareAndNursingHospitalCount;
}

// Bendra funkcija skaiciuoti objektu pagal duomenu kelio
function countFacilities(feature, propertyPath) {
  
  const pathParts = propertyPath.split('.');
  let current = feature.properties;
  
  for (const part of pathParts) {
    if (!current || typeof current !== 'object') return 0;
    current = current[part];
  }
  
  return Array.isArray(current) ? current.length : 0;
}

//=========teritorijos paryskinimas,priartinimas===========\\
function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
      weight: 4,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7,
      zIndexOffset: -1000  
  });

  // Calculate the value based on the current category
  let value;
  if (selectedCat) {
    switch(selectedCat) {
      case 'population':
        value = layer.feature.properties.population;
        break;
      case 'education':
        value = countEducationFacilities(layer.feature);
        break;
      case 'culture':
        value = countCultureFacilities(layer.feature);
        break;
      case 'kindergarten':
        value = countFacilities(layer.feature, 'education.kindergarten');
        break;
      case 'nurseryKindergarten':
        value = countFacilities(layer.feature, 'education.nurseryKindergarten');
        break;
      case 'primary':
        value = countFacilities(layer.feature, 'education.primary');
        break;
      case 'progymnasium':
        value = countFacilities(layer.feature, 'education.progymnasium');
        break;
      case 'preSchool':
        value = countFacilities(layer.feature, 'education.preSchool');
        break;
      case 'basicSchool':
        value = countFacilities(layer.feature, 'education.basicSchool');
        break;
      case 'schoolKindergarten':
        value = countFacilities(layer.feature, 'education.schoolKindergarten');
        break;
      case 'supportSchool':
        value = countFacilities(layer.feature, 'education.supportSchool');
        break;
      case 'sportSchool':
        value = countFacilities(layer.feature, 'education.sportSchool');
        break;
      case 'gymnasium':
        value = countFacilities(layer.feature, 'education.gymnasium');
        break;
      case 'artSchool':
        value = countFacilities(layer.feature, 'education.artSchool');
        break;
      case 'vocationalSchool':
        value = countFacilities(layer.feature, 'education.vocationalSchool');
        break;
      case 'culturalCenter':
        value = countFacilities(layer.feature, 'culturalSector.culturalCenter');
        break;
      case 'library':
        value = countFacilities(layer.feature, 'culturalSector.library');
        break;
      case 'medicine':
        value = countMedicineFacilities(layer.feature);
        break;
      case 'polyclinic':
        value = countFacilities(layer.feature, 'healthSector.polyclinic');
        break;
      case 'ambulatory':
        value = countFacilities(layer.feature, 'healthSector.ambulatory');
        break;
      case 'BpgOffice':
        value = countFacilities(layer.feature, 'healthSector.BpgOffice');
        break;
      case 'familyDoctor':
        value = countFacilities(layer.feature, 'healthSector.familyDoctor');
        break;
      case 'medicalStation':
        value = countFacilities(layer.feature, 'healthSector.medicalStation');
        break;
      case 'LongTermCareAndNursingHospital':
        value = countFacilities(layer.feature, 'healthSector.LongTermCareAndNursingHospital');
        break;
      default:
        value = null;
    }
  }
  
  info.update(layer.feature.properties, value);
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
    mouseover: function(e) {
      if (!isDrawing && !isDistance) highlightFeature(e);
    },
    mouseout: function(e) {
      if (!isDrawing && !isDistance) resetHighlight(e);
    },
    click: function(e){
      if(!isDrawing && !isDistance) zoomToFeature(e);
    }
  });
}
//========================================================\\


let markerStates = {
  kindergarten: false,
  progymnasium: false,
  gymnasium: false,
  artSchool: false,
  vocationalSchool: false,
  culturalCenter: false,
  library: false,
  nurseryKindergarten: false,
  primary: false,
  basicSchool: false,
  schoolKindergarten: false,
  supportSchool: false,
  sportSchool: false,
  preSchool: false,
  polyclinic: false,
  ambulatory: false,
  BpgOffice: false,
  familyDoctor: false,
  medicalStation: false,
  LongTermCareAndNursingHospital: false
};

document.querySelectorAll('[data-marker-location]').forEach(button => {
  button.addEventListener('click', function(e) {
    let attribute = this.getAttribute('data-marker-location');
    
    // Aktyvuojam mygtuka
    this.classList.toggle('active');
    let emoji = '';
    if(attribute == 'kindergarten' || attribute == 'progymnasium' || attribute == 'gymnasium' || 
      attribute == 'artSchool' || attribute == 'vocationalSchool' || attribute == 'nurseryKindergarten' || attribute == 'primary' || attribute == 'basicSchool' || attribute == 'schoolKindergarten' || attribute == 'supportSchool' || attribute == 'sportSchool' || attribute == 'preSchool') {
     
       
       seniunijos.features.forEach(feature => {
           if(feature.properties.education && feature.properties.education[attribute]) {
               const locations = feature.properties.education[attribute];
               
               
               switch (attribute) {
                   case 'nurseryKindergarten':
                       emoji = '🧸'; // Nursery Kindergarten
                       break;
                   case 'kindergarten':
                       emoji = '👶'; // Kindergarten
                       break;
                   case 'preSchool':
                       emoji = '🐣'; // Kindergarten
                       break;
                   case 'primary':
                       emoji = '👨‍🏫'; 
                       break;
                   case 'schoolKindergarten':
                       emoji = '🏡'; // Progymnasium
                       break;
                   case 'basicSchool':
                        emoji = '🎒'; // Progymnasium
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
                   case 'sportSchool':
                        emoji = '🏃‍♂️'; // Art School
                        break;
                   case 'supportSchool':
                        emoji = '🤝'; // Art School
                        break;
                   case 'vocationalSchool':
                       emoji = '🛠️'; // Vocational School
                       break;
                   default:
                       emoji = '📍'; // Default marker
                       break;
               }
   
               // gauti pasirinktu kalbu masyva
               const selectedLanguages = Object.entries(languageCondition)
                 .filter(([_, isSelected]) => isSelected)
                 .map(([lang]) => lang);

               
               locations.forEach(location => {
                 if (location.coordinates && location.coordinates.length === 2) {
                   if (!markerStates[attribute]) {
                     // jei nera pasirinktu kalbu, rodyti visus markerius
                     if (selectedLanguages.length === 0) {
                       location.marker = L.marker([location.coordinates[1], location.coordinates[0]], {
                         icon: L.divIcon({
                           className: 'emoji-icon',
                           html: emoji,
                           iconSize: [10, 10]
                         })
                       }).addTo(map).bindPopup(location.title);
                     }
                     // jei yra pasirinktu kalbu, tikrinti ar lokacija atitinka pasirinktas kalbas
                     else {
                       const hasAllSelected = selectedLanguages.every(lang => location[lang]);
                       const hasNoUnselected = ['LT', 'PL', 'RU', 'private']
                         .filter(lang => !selectedLanguages.includes(lang))
                         .every(lang => !location[lang]);
                       
                       if (hasAllSelected && hasNoUnselected) {
                         location.marker = L.marker([location.coordinates[1], location.coordinates[0]], {
                           icon: L.divIcon({
                             className: 'emoji-icon',
                             html: emoji,
                             iconSize: [10, 10]
                           })
                         }).addTo(map).bindPopup(location.title);
                       }
                     }
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
                      html: emoji, 
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
    } else if(attribute == 'polyclinic' || attribute == 'ambulatory' || attribute == 'BpgOffice' || attribute == 'familyDoctor' || attribute == 'medicalStation' || attribute == 'LongTermCareAndNursingHospital') {
      seniunijos.features.forEach(feature => {
        if(feature.properties.healthSector && feature.properties.healthSector[attribute]) {
          const locations = feature.properties.healthSector[attribute];
          switch (attribute) {
            case 'polyclinic':
                emoji = '🏥';
                break;
            case 'ambulatory':
                emoji = '🩺';
                break;
            case 'BpgOffice':
                emoji = '⚕️';
                break;
            case 'familyDoctor':
                emoji = '👨‍👩‍👧‍👦';
                break;
            case 'medicalStation':
                emoji = '🚑';
                break;
            case 'LongTermCareAndNursingHospital':
                emoji = '🛏️';
                break;
            default:
                emoji = '📍'; 
                break;
        }
          locations.forEach(location => {
            if (location.coordinates && location.coordinates.length === 2) {
              if (!markerStates[attribute]) {
                location.marker = L.marker([location.coordinates[1], location.coordinates[0]], {
                  icon: L.divIcon({
                      className: 'emoji-icon',
                      html: emoji, 
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


let languageCondition={
  LT:false,
  PL:false,
  RU:false,
  private:false
}

document.querySelectorAll('[data-language]').forEach(button => {
  button.addEventListener('click', function(e) {
    let language = this.getAttribute('data-language');
    
    
    if(languageCondition[language]) {
      languageCondition[language] = false;
      this.classList.remove('active');
    } else {
      languageCondition[language] = true;
      this.classList.add('active');
    }

    // gauti pasirinktu kalbu masyva
    const selectedLanguages = Object.entries(languageCondition)
      .filter(([_, isSelected]) => isSelected)
      .map(([lang]) => lang);

    // ar tik private yra pasirinktas
    const onlyPrivateSelected = selectedLanguages.length === 1 && selectedLanguages[0] === 'private';

    // tikrinti visus markerius, kurie yra matomi
    Object.entries(markerStates).forEach(([type, isVisible]) => {
      if (isVisible) {
        seniunijos.features.forEach(feature => {
          if (feature.properties.education && feature.properties.education[type]) {
            const locations = feature.properties.education[type];
            locations.forEach(location => {
              //  pašalina markeri, jei jis egzistuoja
              if (location.marker) {
                map.removeLayer(location.marker);
                location.marker = null;
              }

              // tikrinti ar koordinates yra teisingos
              if (location.coordinates && 
                  location.coordinates.length === 2 && 
                  typeof location.coordinates[0] === 'number' && 
                  typeof location.coordinates[1] === 'number') {
                
                // tik private mygtukas paspaustas
                if (onlyPrivateSelected) {
                  if (location.private === true) {
                    let emoji = getEmojiForType(type);
                    location.marker = L.marker([location.coordinates[1], location.coordinates[0]], {
                      icon: L.divIcon({
                        className: 'emoji-icon',
                        html: emoji,
                        iconSize: [10, 10]
                      })
                    }).addTo(map).bindPopup(location.title);
                  }
                }
                // Normal language filtering
                else {
                  // viskas apart private
                  const selectedLangs = selectedLanguages.filter(lang => lang !== 'private');
                  
                  
                  const matchesPrivate = !languageCondition.private || location.private === true;
                  const matchesLanguages = selectedLangs.length === 0 || 
                    (selectedLangs.every(lang => location[lang]) && 
                     ['LT', 'PL', 'RU'].filter(lang => !selectedLangs.includes(lang))
                      .every(lang => !location[lang]));

                  if (matchesPrivate && matchesLanguages) {
                    let emoji = getEmojiForType(type);
                    location.marker = L.marker([location.coordinates[1], location.coordinates[0]], {
                      icon: L.divIcon({
                        className: 'emoji-icon',
                        html: emoji,
                        iconSize: [10, 10]
                      })
                    }).addTo(map).bindPopup(location.title);
                  }
                }
              }
            });
          }
        });
      }
    });
  });
});

// Funkcija gauti emojį pagal tipą
function getEmojiForType(type) {
  switch (type) {
    case 'nurseryKindergarten': return '🧸';
    case 'kindergarten': return '👶';
    case 'preSchool': return '🐣';
    case 'primary': return '👨‍🏫';
    case 'schoolKindergarten': return '🏡';
    case 'basicSchool': return '🎒';
    case 'progymnasium': return '🏫';
    case 'gymnasium': return '🎓';
    case 'artSchool': return '🎨';
    case 'sportSchool': return '🏃‍♂️';
    case 'supportSchool': return '🤝';
    case 'vocationalSchool': return '🛠️';
    default: return '📍';
  }
}

function setUpRadioButtonListeners() {
  var radioButtons = document.querySelectorAll('input[name="obj_Amount"]');
  
  radioButtons.forEach(function(button) {
    button.addEventListener('change', function(e) {
      const selectedCategory = e.target.value;
      console.log("Selected category:", selectedCategory); // Debug log
      updateMap(selectedCategory);
    });
  });
}

// Add legend control for big numbers (population)
function addBigNumbersLegend() {
  if (window.bigNumbersLegend) {
    map.removeControl(window.bigNumbersLegend);
  }
  
  var legend = L.control({position: 'bottomright'});
  
  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 500, 2000, 4000, 6000, 8000, 10000, 15000],
        labels = [];

    div.innerHTML += '<h4>Gyventojų skaičius</h4>';
    
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:' + getColorBigNumbers(grades[i] + 1) + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
  };

  legend.addTo(map);
  window.bigNumbersLegend = legend;
}

// Add legend control for small numbers (facilities)
function addSmallNumbersLegend() {
  if (window.smallNumbersLegend) {
    map.removeControl(window.smallNumbersLegend);
  }
  
  var legend = L.control({position: 'bottomright'});
  
  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5, 6],
        labels = [];

    div.innerHTML += '<h4>Objektų skaičius</h4>';
    
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:' + getColorSmallNumbers(grades[i]) + '"></i> ' +
        grades[i] + (i < grades.length - 1 ? '<br>' : '+');
    }

    return div;
  };

  legend.addTo(map);
  window.smallNumbersLegend = legend;
}

// Remove all legends
function removeLegends() {
  if (window.bigNumbersLegend) {
    map.removeControl(window.bigNumbersLegend);
    window.bigNumbersLegend = null;
  }
  if (window.smallNumbersLegend) {
    map.removeControl(window.smallNumbersLegend);
    window.smallNumbersLegend = null;
  }
}

// Original updateMap function
function updateMap(category) {
  console.log("Updating map with category:", category);
  selectedCat = category;
  
  if (geojson) {
    geojson.remove();
  }

  // Remove existing legends
  removeLegends();

  let style;
  switch(category) {
    case 'population':
      style = (feature) => {
        return {
          fillColor: getColorBigNumbers(feature.properties.population), 
          weight: 2,
          opacity: 1,
          color: 'black',
          dashArray: '3',
          fillOpacity: 0.7
        };
      };
      arGalima=1;
      addBigNumbersLegend();
      break;
    case 'education':
      style = (feature) => {
        return {
          fillColor: getColorSmallNumbers(countEducationFacilities(feature)),
          weight: 2,
          opacity: 1,
          color: 'black',
          dashArray: '3',
          fillOpacity: 0.7
        };
      };
      arGalima=1;
      addSmallNumbersLegend();
      break;
    case 'culture':
      style = (feature) => {
        return {
          fillColor: getColorSmallNumbers(countCultureFacilities(feature)),
          weight: 2,
          opacity: 1,
          color: 'black',
          dashArray: '3',
          fillOpacity: 0.7
        };
      };
      arGalima=1;
      addSmallNumbersLegend();
      break;
    case 'kindergarten':
      style = (feature) => {
        return {
          fillColor: getColorSmallNumbers(countFacilities(feature, 'education.kindergarten')),
          weight: 2,
          opacity: 1,
          color: 'black',
          dashArray: '3',
          fillOpacity: 0.7
        };
      };
      arGalima=1;
      addSmallNumbersLegend();
      break;
    case 'nurseryKindergarten':
      style = (feature) => {
        return {
          fillColor: getColorSmallNumbers(countFacilities(feature, 'education.nurseryKindergarten')),
          weight: 2,
          opacity: 1,
          color: 'black',
          dashArray: '3',
          fillOpacity: 0.7
        };
      };
      arGalima=1;
      addSmallNumbersLegend();
      break;
    case 'primary':
      style = (feature) => {
        return {
          fillColor: getColorSmallNumbers(countFacilities(feature, 'education.primary')),
          weight: 2,
          opacity: 1,
          color: 'black',
          dashArray: '3',
          fillOpacity: 0.7
        };
      };
      arGalima=1;
      addSmallNumbersLegend();
      break;
    case 'progymnasium':
      style = (feature) => {
        return {
          fillColor: getColorSmallNumbers(countFacilities(feature, 'education.progymnasium')),
          weight: 2,
          opacity: 1,
          color: 'black',
          dashArray: '3',
          fillOpacity: 0.7
        };
      };
      arGalima=1;
      addSmallNumbersLegend();
      break;
    case 'preSchool':
      style = (feature) => {
        return {
          fillColor: getColorSmallNumbers(countFacilities(feature, 'education.preSchool')),
          weight: 2,
          opacity: 1,
          color: 'black',
          dashArray: '3',
          fillOpacity: 0.7
        };
      };
      arGalima=1;
      addSmallNumbersLegend();
      break;
    case 'basicSchool':
      style = (feature) => {
        return {
          fillColor: getColorSmallNumbers(countFacilities(feature, 'education.basicSchool')),
          weight: 2,
          opacity: 1,
          color: 'black',
          dashArray: '3',
          fillOpacity: 0.7
        };
      };
      arGalima=1;
      addSmallNumbersLegend();
      break;
    case 'schoolKindergarten':
      style = (feature) => {
        return {
          fillColor: getColorSmallNumbers(countFacilities(feature, 'education.schoolKindergarten')),
          weight: 2,
          opacity: 1,
          color: 'black',
          dashArray: '3',
          fillOpacity: 0.7
        };
      };
      arGalima=1;
      addSmallNumbersLegend();
      break;
    case 'supportSchool':
      style = (feature) => {
        return {
          fillColor: getColorSmallNumbers(countFacilities(feature, 'education.supportSchool')),
          weight: 2,
          opacity: 1,
          color: 'black',
          dashArray: '3',
          fillOpacity: 0.7
        };
      };
      arGalima=1;
      addSmallNumbersLegend();
      break;
    case 'sportSchool':
      style = (feature) => {
        return {
          fillColor: getColorSmallNumbers(countFacilities(feature, 'education.sportSchool')),
          weight: 2,
          opacity: 1,
          color: 'black',
          dashArray: '3',
          fillOpacity: 0.7
        };
      };
      arGalima=1;
      addSmallNumbersLegend();
      break;
    case 'gymnasium':
      style = (feature) => {
        return {
          fillColor: getColorSmallNumbers(countFacilities(feature, 'education.gymnasium')),
          weight: 2,
          opacity: 1,
          color: 'black',
          dashArray: '3',
          fillOpacity: 0.7
        };
      };
      arGalima=1;
      addSmallNumbersLegend();
      break;
    case 'artSchool':
      style = (feature) => {
        return {
          fillColor: getColorSmallNumbers(countFacilities(feature, 'education.artSchool')),
          weight: 2,
          opacity: 1,
          color: 'black',
          dashArray: '3',
          fillOpacity: 0.7
        };
      };
      arGalima=1;
      addSmallNumbersLegend();
      break;
    case 'vocationalSchool':
      style = (feature) => {
        return {
          fillColor: getColorSmallNumbers(countFacilities(feature, 'education.vocationalSchool')),
          weight: 2,
          opacity: 1,
          color: 'black',
          dashArray: '3',
          fillOpacity: 0.7
        };
      };
      arGalima=1;
      addSmallNumbersLegend();
      break;
    case 'culturalCenter':
      style = (feature) => {
        return {
          fillColor: getColorSmallNumbers(countFacilities(feature, 'culturalSector.culturalCenter')),
          weight: 2,
          opacity: 1,
          color: 'black',
          dashArray: '3',
          fillOpacity: 0.7
        };
      };
      arGalima=1;
      addSmallNumbersLegend();
      break;
    case 'library':
      style = (feature) => {
        return {
          fillColor: getColorSmallNumbers(countFacilities(feature, 'culturalSector.library')),
          weight: 2,
          opacity: 1,
          color: 'black',
          dashArray: '3',
          fillOpacity: 0.7
        };
      };
      arGalima=1;
      addSmallNumbersLegend();
      break;
    case 'medicine':
      style = (feature) => {
        return {
          fillColor: getColorSmallNumbers(countMedicineFacilities(feature)),
          weight: 2,
          opacity: 1,
          color: 'black',
          dashArray: '3',
          fillOpacity: 0.7
        };
      };
      arGalima=1;
      addSmallNumbersLegend();
      break;
    case 'polyclinic':
      style = (feature) => {
        return {
          fillColor: getColorSmallNumbers(countFacilities(feature, 'healthSector.polyclinic')),
          weight: 2,
          opacity: 1,
          color: 'black',
          dashArray: '3',
          fillOpacity: 0.7
        };
      };
      arGalima=1;
      addSmallNumbersLegend();
      break;
    case 'ambulatory':
      style = (feature) => {
        return {
          fillColor: getColorSmallNumbers(countFacilities(feature, 'healthSector.ambulatory')),
          weight: 2,
          opacity: 1,
          color: 'black',
          dashArray: '3',
          fillOpacity: 0.7
        };
      };
      arGalima=1;
      addSmallNumbersLegend();
      break;
    case 'BpgOffice':
      style = (feature) => {
        return {
          fillColor: getColorSmallNumbers(countFacilities(feature, 'healthSector.BpgOffice')),
          weight: 2,
          opacity: 1,
          color: 'black',
          dashArray: '3',
          fillOpacity: 0.7
        };
      };
      arGalima=1;
      addSmallNumbersLegend();
      break;
    case 'familyDoctor':
      style = (feature) => {
        return {
          fillColor: getColorSmallNumbers(countFacilities(feature, 'healthSector.familyDoctor')),
          weight: 2,
          opacity: 1,
          color: 'black',
          dashArray: '3',
          fillOpacity: 0.7
        };
      };
      arGalima=1;
      addSmallNumbersLegend();
      break;
    case 'medicalStation':
      style = (feature) => {
        return {
          fillColor: getColorSmallNumbers(countFacilities(feature, 'healthSector.medicalStation')),
          weight: 2,
          opacity: 1,
          color: 'black',
          dashArray: '3',
          fillOpacity: 0.7
        };
      };
      arGalima=1;
      addSmallNumbersLegend();
      break;
    case 'LongTermCareAndNursingHospital':
      style = (feature) => {
        return {
          fillColor: getColorSmallNumbers(countFacilities(feature, 'healthSector.LongTermCareAndNursingHospital')),
          weight: 2,
          opacity: 1,
          color: 'black',
          dashArray: '3',
          fillOpacity: 0.7
        };
      };
      arGalima=1;
      addSmallNumbersLegend();
      break;
    default:
      style = (feature) => {
        return {
          fillColor: 'rgba(6, 112, 6, 0.73)', 
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
  
  info.update();
}
//========================================================\\

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

let isDrawing = false;
let currentLine = null;
let latlngs = [];
let allLines = []; 
let currentColor = 'red'; 
let lastPoint = null;
const MIN_DISTANCE = 0.000001; 

let firstDistancePoint = null;


document.querySelectorAll('#drawBar div').forEach(colorDiv => {
  colorDiv.addEventListener('click', function() {
    currentColor = this.id; 
  });
});

function isDrawingFalse()
    {
        map.dragging.enable();
    map.scrollWheelZoom.enable();
    map.doubleClickZoom.enable();
    map.boxZoom.enable();
    map.keyboard.enable();
    if (map.tap) map.tap.enable();
    
    // Remove all lines from the map
    allLines.forEach(line => {
      map.removeLayer(line);
    });
    allLines = []; // Clear 
    currentLine = null;
    latlngs.splice(0, latlngs.length);
    lastPoint = null;
    }

document.getElementById('drawButton').onclick = () => {
  isDrawing = !isDrawing;
  const drawButton = document.getElementById('drawButton');
  drawButton.classList.toggle('active');
  document.getElementById('drawBar').style.display = isDrawing ? "block" : "none";

  if (isDrawing) 
  {
    // Disable 
    map.dragging.disable();
    map.scrollWheelZoom.disable();
    map.doubleClickZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
    if (map.tap) map.tap.disable(); // telefonam
    
    // Reset distance button state
    isDistance = false;
    const distanceButton = document.getElementById('distanceButton');
    distanceButton.classList.remove('active');
    distanceButton.innerHTML = '<img src="ruler.png" alt="Liniuotė">';
    firstDistancePoint = null;
    
    // Clear 
    allLines.forEach(line => {
      map.removeLayer(line);
    });
    allLines = [];
    currentLine = null;
  } 
  else 
  {
    isDrawingFalse();
  }
};

document.getElementById('distanceButton').onclick = () => {
  isDistance = !isDistance;
  const button = document.getElementById('distanceButton');
  button.classList.toggle('active');
  button.innerHTML = '<img src="ruler.png" alt="Liniuotė">';

  if (isDistance) {
    // Reset drawing button state
    isDrawing = false;
    const drawButton = document.getElementById('drawButton');
    drawButton.classList.remove('active');
    drawButton.innerHTML = '<img src="pngegg.png" alt="Piešimas">';
    document.getElementById('drawBar').style.display = "none";

    map.dragging.disable();
    map.scrollWheelZoom.disable();
    map.doubleClickZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
    if (map.tap) map.tap.disable();
    // Clear 
    allLines.forEach(line => {
      map.removeLayer(line);
    });
    allLines = [];
    currentLine = null;
    firstDistancePoint = null;
  } else {
    map.dragging.enable();
    map.scrollWheelZoom.enable();
    map.doubleClickZoom.enable();
    map.boxZoom.enable();
    map.keyboard.enable();
    if (map.tap) map.tap.enable();
    // Clear 
    firstDistancePoint = null;
    allLines.forEach(line => {
      map.removeLayer(line);
    });
    allLines = [];
    currentLine = null;
  }
};

map.on('mousedown', function(e) {
  if (isDrawing)
  {
    latlngs = [e.latlng];
    lastPoint = e.latlng;
    currentLine = L.polyline(latlngs, { 
      color: currentColor,
      weight: 3,
      zIndexOffset: 100000000  
    }).addTo(map);
    currentLine.bringToFront(); 
    allLines.push(currentLine);
  
    map.on('mousemove', onMouseMove);
    map.once('mouseup', function() {
      map.off('mousemove', onMouseMove);
      lastPoint = null;
    });
  }
  else if(isDistance){
      // Matavimo logika
    if (!firstDistancePoint) {
      // pirmas taškas – saugom
      firstDistancePoint = e.latlng;
      
      currentLine = L.polyline([firstDistancePoint], {
        color: 'blue',
        weight: 4,
        dashArray: '5, 10'
      }).addTo(map);
      allLines.push(currentLine);
    } else {
      
      const currentPoints = currentLine.getLatLngs();
      currentPoints.push(e.latlng);
      currentLine.setLatLngs(currentPoints);
      

      let totalDistance = 0;
      for (let i = 1; i < currentPoints.length; i++) {
        totalDistance += currentPoints[i-1].distanceTo(currentPoints[i]);
      }
      
      info.update(totalDistance);
    }
  }

});

function onMouseMove(e) {
  if (!lastPoint) return;
  
  // atstumas tarp dvieju tasku
  const distance = Math.sqrt(
    Math.pow(e.latlng.lat - lastPoint.lat, 2) + 
    Math.pow(e.latlng.lng - lastPoint.lng, 2)
  );


  if (distance > MIN_DISTANCE) {
    latlngs.push(e.latlng);
    currentLine.setLatLngs(latlngs);
    currentLine.bringToFront();
    lastPoint = e.latlng;
  }
}
//========================================================\\




// Initialize the map with default style
setUpRadioButtonListeners();
updateMap('default'); // Start with default style

