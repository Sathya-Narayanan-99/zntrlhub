const uuid = new DeviceUUID().get(); 
//host seperate
//let host = "https://dashboard.foton.ai/analytics/";
const host = "https://b9fe-122-178-14-112.in.ngrok.io";

const date = new Date();
// ✅ Reset a Date's time to midnight
date.setHours(0, 0, 0, 0);

// ✅ Format a date to YYYY-MM-DD (or any other format)
function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function formatDate(date) {
  return [
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
  ].join('-');
}

// 👇️ 2022-01-18 (yyyy-mm-dd)
const today = formatDate(date).toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
console.log(today);

//initialize varibles

let ip = ''; //ip address
//time live variables
let page = window.location.href; //get page url
let pathname = window.location.pathname;//get path name

let timeSpentScrolling = 0;

let isHalted = false;
let haltedStartTime, haltedEndTime;
let totalHaltedTime = 0;

const deviceType = () => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return "tablet";
    }
    else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return "mobile";
    }
    return "desktop";
};

const device = deviceType(); //calling device type

let browserName = (function (agent) {
    switch (true) {
        case agent.indexOf("edge") > -1: return "MS Edge";
        case agent.indexOf("edg/") > -1: return "MS Edge"; //"Edge ( chromium based)";
        case agent.indexOf("opr") > -1 && !!window.opr: return "Opera";
        case agent.indexOf("chrome") > -1 && !!window.chrome: return "Chrome";
        case agent.indexOf("trident") > -1: return "MS IE";
        case agent.indexOf("firefox") > -1: return "Mozilla Firefox";
        case agent.indexOf("safari") > -1: return "Safari";
        default: return "other";
    }
})(window.navigator.userAgent.toLowerCase());

//get IP 
fetch('https://api.ipify.org?format=json').then(function(response) {
	response.json().then(jsonData => {
		ip = response.ip;
        //console.log(response);
  });
});
let city="", state="", country="", lat="", longi="", location1="", timezone="";
//get location
fetch('https://ipapi.co/'+ip+'/json/')
.then(function(response) {
  response.json().then(jsonData => {
    //console.log(jsonData);
    //get all the data
    city        = jsonData.city;
    state       = jsonData.region;
    timezone    = jsonData.timezone;
    country     = jsonData.country_name;
    lat         = jsonData.latitude;
    longi       = jsonData.longitude;
    location1   = true;
  });
})
.catch(function(error) {
  console.log(error);
  location1 = false;
});



//find halt state
const update_halt_state = () => {
    if (isHalted) {
        isHalted = false;
        haltedEndTime = new Date().getTime();
        totalHaltedTime += (haltedEndTime - haltedStartTime) / 1000;
    } else {
        isHalted = true;
        haltedStartTime = new Date().getTime();
    }
};

// Listen for scroll events
window.addEventListener('scroll', () => {
    timeSpentScrolling += 1.8;
    update_halt_state();
});

const zntrlClass = document.querySelectorAll('.zntrlBtn');


document.addEventListener('click', function(evt) {
    let element = evt.target;
    console.log(evt.target.tagName);
    const tagName = evt.target.tagName;
    console.log(element.textContent);
    if(tagName && tagName != 'BODY'){ //restrict the data from page click - body data
        console.log("I'm here 1 ");
        
        if( (element.textContent).trim() != '' ){
                    console.log("I'm here");
            location1 =`${city}, ${state}, ${country}`;
            url_data = `button_name=${element.textContent}&location=${location1}&timezone=${timezone}&lat=${lat}&longi=${longi}&uuid=${uuid}&page_url=${page}&device_type=${device}&page_name=${pathname}`; 
            let data = {
                'page_url'      : page,
                'page_name'     : pathname,
                "location"      : location1,
                "timezone"      : timezone,
                "lat"          : lat,
                "longi"         : longi,
                "uuid"          : uuid,
                "pathname"      : pathname,
                "device_type"   : device,
                'browser_name'  : browserName,
                'button_clicked':{
                    'flag' : true,
                    'button_name' : element.textContent
                },
                'date_created'   : today
            };
           let url = host+'/track/createBtn';
            navigator.sendBeacon(url, JSON.stringify(data));
        }
    }

   // console.log(`Clicked button: ${element.textContent}`);
});



document.addEventListener("DOMContentLoaded", () => {
    const start = new Date().getTime();

    // AVERAGE SCROLLING INTERVAL - 39 seconds
    setInterval(() => {
        if (new Date().getTime() - start > 39000) {
            update_halt_state();
        }
    }, 39000);

    window.addEventListener("beforeunload", () => {
        if (!navigator.sendBeacon) return;
        
        const end = new Date().getTime();

        update_halt_state();


        const totalTime = ((end - start) / 1000) - (timeSpentScrolling / 1000) - totalHaltedTime;
        if(location1){
            
            location1 =`${city}, ${state}, ${country}`;
            url_data = `location=${location1}&timezone=${timezone}&lat=${lat}&longi=${longi}&totalTime=${totalTime}&uuid=${uuid}&page_url=${page}&device_type=${device}&pathname=${pathname}`;
            let data = {
                'page_url'      : `${page}`,
                'page_name'     : `${pathname}`,
                'total_time_stayed'    : `${totalTime}`,
                'location'      : `${location1}`,
                'timezone'      : `${timezone}`,
                'lat'           : `${lat}`,
                'longi'         : `${longi}`,
                'uuid'          : `${uuid}`,
                'device_type'   : `${device}`,
                'browser_name'  : `${browserName}`,
                'date_created'  : `${today}`
            };
            

              // Url we are sending the data to
              let url = host+"/track/create";
        console.log("here"+url);
            navigator.sendBeacon(url, JSON.stringify(data));
        }
    });

});