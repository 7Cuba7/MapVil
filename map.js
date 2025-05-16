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
      fillOpacity: 0.7
  });

  layer.bringToFront();
  info.update(layer.feature.properties, word);
  //info.update();
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
                
                // jei nera pasirinktu kalbu, rodyti visus markerius
                if (selectedLanguages.length === 0) {
                  let emoji = getEmojiForType(type);
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
                  // tikrinti ar lokacija atitinka pasirinktas kalbas ir nera nepasirinktu kalbu
                  const hasAllSelected = selectedLanguages.every(lang => location[lang]);
                  const hasNoUnselected = ['LT', 'PL', 'RU', 'private']
                    .filter(lang => !selectedLanguages.includes(lang))
                    .every(lang => !location[lang]);
                  
                  if (hasAllSelected && hasNoUnselected) {
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

let word=0;
function updateMap(selectedCat)
{

  if (geojson) {
    geojson.remove(); // pašalina seną sluoksnį
  }

  let style;
  switch(selectedCat)
  {
    case 'population':
      style = (feature) => {
        word=feature.properties.population;
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
      break;
    case 'education':
      style = (feature) => {
        
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
      case 'preSchool':
      style = (feature) => {
        word = countFacilities(feature, 'education.preSchool');
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
      case 'basicSchool':
      style = (feature) => {
        word = countFacilities(feature, 'education.basicSchool');
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
      case 'schoolKindergarten':
      style = (feature) => {
        word = countFacilities(feature, 'education.schoolKindergarten');
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
      case 'supportSchool':
      style = (feature) => {
        word = countFacilities(feature, 'education.supportSchool');
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
      case 'sportSchool':
      style = (feature) => {
        word = countFacilities(feature, 'education.sportSchool');
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
        word = countFacilities(feature, 'culturalSector.culturalCenter');
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
        word = countFacilities(feature, 'culturalSector.library');
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
      case 'medicine':
      style = (feature) => {
        word=countMedicineFacilities(feature);
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
      case 'polyclinic':
      style = (feature) => {
        word=countFacilities(feature, 'healthSector.polyclinic');
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
      case 'ambulatory':
      style = (feature) => {
        word=countFacilities(feature, 'healthSector.ambulatory');
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
      case 'BpgOffice':
      style = (feature) => {
        word=countFacilities(feature, 'healthSector.BpgOffice');
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
      case 'familyDoctor':
      style = (feature) => {
        word=countFacilities(feature, 'healthSector.familyDoctor');
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
      case 'medicalStation':
      style = (feature) => {
        word=countFacilities(feature, 'healthSector.medicalStation');
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
      case 'LongTermCareAndNursingHospital':
      style = (feature) => {
        word=countFacilities(feature, 'healthSector.LongTermCareAndNursingHospital');
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
  
}

function setUpRadioButtonListeners() {
  var radioButtons = document.querySelectorAll('input[name="obj_Amount"]');
  
  radioButtons.forEach(function(button) {
    button.addEventListener('change', handleRadioButtonChange);
  });
}

function handleRadioButtonChange(e) {
  const selectedCategory = e.target.value; // gauti pasirinkta kategorija
  updateMap(selectedCategory); // atnaujinti mapą pagal pasirinkta kategorija
}


setUpRadioButtonListeners();
updateMap(); 

var info = L.control({position: 'topleft'});

info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info'); // sukuria div su klasė "info"
  this.update();
  return this._div;
};

info.update = function (props, zodis) {
  if (props) {
      this._div.innerHTML = '<h4>Vilniaus rajono seniūnijos</h4>' +
          '<b>' + props.name + '</b>' + (zodis ? '<br />' + zodis : '');
  } else {
      this._div.innerHTML = '<h4>Vilniaus rajono seniūnijos</h4>';
  }
};

info.addTo(map);
// ======================================================



