let cityLat,cityLng;
let cityName;
let timeZoneOffset;
let geo_url;
let sun_api_url;
let timeZone_api_url;
let sunRiseTime={hr:0,min:0,sec:0};
let sunSetTime={hr:0,min:0,sec:0};
let UTCtime={hr:0,min:0,sec:0};
let currentCityTime={hr:0,min:0,sec:0};

const sun = document.getElementById('sun'); 
const stage = document.getElementById('stage'); 

function reset_animation() {
  sun.style.animation = 'none';
  sun.offsetHeight; 
  sun.style.animation = null; 

  stage.style.animation = 'none';
  stage.offsetHeight; 
  stage.style.animation = null; 
}
function pause(){
    sun.style.animationPlayState='paused';
    stage.style.animationPlayState='paused';
}
function resume(){
    sun.style.animationPlayState='running';
    stage.style.animationPlayState='running';
}



async function getGeoData(){
    reset_animation();
    cityName=document.getElementById('city').value;
    if(cityName)
    //https://docs.mapbox.com/api/search/#forward-geocoding
        geo_url=`https://api.mapbox.com/geocoding/v5/mapbox.places/${cityName}.json?access_token=pk.eyJ1IjoibWVycnkxMjMwMDAiLCJhIjoiY2s5OTZkZXEwMHNiZzNrcXh5eXpkbGw4dCJ9.R-xJqyaNAGhDWCHGQkHaBQ`;
    else{
        cityName="Brooklyn";
        geo_url=`https://api.mapbox.com/geocoding/v5/mapbox.places/${cityName}.json?access_token=pk.eyJ1IjoibWVycnkxMjMwMDAiLCJhIjoiY2s5OTZkZXEwMHNiZzNrcXh5eXpkbGw4dCJ9.R-xJqyaNAGhDWCHGQkHaBQ`;
    }
    const geoResponse = await fetch(geo_url);
    const geoData = await geoResponse.json();
    cityLat=geoData.features[0].center[1];
    cityLng=geoData.features[0].center[0];

    console.log(geoData.features[0].center[0]);

    //https://sunrise-sunset.org/api
    sun_api_url=`https://api.sunrise-sunset.org/json?lat=${cityLat}&lng=${cityLng}&date=today`;
    timeZone_api_url=`https://api.timezonedb.com/v2.1/get-time-zone?key=Y8EE6I1N027G&format=json&by=position&lat=${cityLat}&lng=${cityLng}`;
    getTimeZoneData();
    if(timeZoneOffset)
    
    getSunData();
}

async function getSunData() {
    const response = await fetch(sun_api_url);
    const data = await response.json();
    const { sunrise, sunset,day_length } = data.results;


   
    console.log(data.results)

    let utcTime=new Date();
    UTCtime.hr=utcTime.getUTCHours();
    UTCtime.min=utcTime.getUTCMinutes();
    UTCtime.sec=utcTime.getUTCSeconds();

    sunRiseTime.hr=parseInt(sunrise);
    sunRiseTime.min=parseInt(sunrise.slice(3));
    sunRiseTime.sec=parseInt(sunrise.slice(6));

    sunSetTime.hr=parseInt(sunset);
    sunSetTime.min=parseInt(sunset.slice(3));
    sunSetTime.sec=parseInt(sunset.slice(6));

    let timezone = parseInt(timeZoneOffset);
    currentCityTime.hr=UTCtime.hr+timezone;

    if(timezone>0) timezone-=12;
    sunRiseTime.hr=sunRiseTime.hr+timezone;
    sunSetTime.hr=sunSetTime.hr+timezone+12;
    //console.log(hr+"  "+min+"  "+sec);

    console.log(currentCityTime.hr);

    if(currentCityTime.hr<sunSetTime.hr&&currentCityTime.hr>sunRiseTime.hr){
        let sunPos=(currentCityTime.hr-sunRiseTime.hr)/parseInt(day_length);
        console.log(sunPos);
        
        setTimeout(() => {pause();}, 15000*sunPos);
    }
}

async function getTimeZoneData() {
    const timeZoneResponse = await fetch(timeZone_api_url);
    const timeZoneData = await timeZoneResponse.json();
    const {gmtOffset} = timeZoneData;
    timeZoneOffset=gmtOffset/3600;
    console.log(timeZoneOffset);
}
