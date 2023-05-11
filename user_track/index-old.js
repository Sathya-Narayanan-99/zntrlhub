const uuid = new DeviceUUID().get(); 
//host seperate
//let host = "https://dashboard.foton.ai/analytics/";
const host = "http://localhost:3007"

//initialize varibles

let ip = ''; //ip address
//time live variables
let page = window.location.href; //get page url
let pathname = window.location.pathname//get path name

let timeSpentScrolling = 0;

let isHalted = false;
let haltedStartTime, haltedEndTime;
let totalHaltedTime = 0;

let browserName;

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

console.log(window.navigator.userAgent.toLowerCase());
    browserName = (function (agent) {
        switch (true) {
            case agent.indexOf("edge") > -1: return "MS Edge";
            case agent.indexOf("edg/") > -1: return "Edge ( chromium based)";
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
        console.log(response);
  });
})
let city="", state="", country="", lat="", longi="", location1="", timezone="";
//get location
fetch('https://ipapi.co/'+ip+'/json/')
.then(function(response) {
  response.json().then(jsonData => {
    //console.log(jsonData);
    //get all the data
    console.log(jsonData);
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
  console.log(error)
  location1 = false;
});



//find halt state
const update_halt_state = () => {
    if (isHalted) {
        isHalted = false;
        haltedEndTime = new Date().getTime()
        totalHaltedTime += (haltedEndTime - haltedStartTime) / 1000
    } else {
        isHalted = true;
        haltedStartTime = new Date().getTime()
    }
}

// Listen for scroll events
window.addEventListener('scroll', () => {
    timeSpentScrolling += 1.8;
    update_halt_state()
});

const zntrlClass = document.querySelectorAll('.zntrlBtn');


document.addEventListener('click', function(evt) {
    let element = evt.target;
    console.log(evt.target.tagName);
    console.log(evt);
    // console.log(`Clicked button: ${element.textContent}`);
    location1 =`${city}, ${state}, ${country}`;
    url_data = `button_name=${element.textContent}&location=${location1}&timezone=${timezone}&lat=${lat}&longi=${longi}&uuid=${uuid}&page_url=${page}&device_type=${device}&page_name=${pathname}`; 
    let data = {
        'page_url'      : page,
        'page_name'     : pathname,
        "location"      : location1,
        "timezone"      : timezone,
        "lati"          : lat,
        "longi"         : longi,
        "uuid"          : uuid,
        "page_url"      : page,
        "pathname"      : pathname,
        "device_type"   : device,
        'browser_name'  : browserName,
        'button_clicked':{
            'flag' : true,
            'button_name' : element.textContent
        }
    }
    console.log(data);
    //navigator.sendBeacon(`${host}/backend/file.php?button_clicked=${Number(1)}&${url_data}`)
    //navigator.sendBeacon('http://localhost:3007/track/createBtn', JSON.stringify(data));
});



document.addEventListener("DOMContentLoaded", () => {
    const start = new Date().getTime();

    // AVERAGE SCROLLING INTERVAL - 39 seconds
    setInterval(() => {
        if (new Date().getTime() - start > 39000) {
            update_halt_state()
        }
    }, 39000)

    window.addEventListener("beforeunload", () => {
        if (!navigator.sendBeacon) return;
        
        const end = new Date().getTime();

        update_halt_state()


        const totalTime = ((end - start) / 1000) - (timeSpentScrolling / 1000) - totalHaltedTime;
        if(location1){
            location1 =`${city}, ${state}, ${country}`;
            url_data = `location=${location1}&timezone=${timezone}&lat=${lat}&longi=${longi}&totalTime=${totalTime}&uuid=${uuid}&page_url=${page}&device_type=${device}&pathname=${pathname}`;
            let data = {
                'page_url'      : `${page}`,
                'page_name'     : `${pathname}`,
                'total_time'    : `${totalTime}`,
                'location'      : `${location1}`,
                'timezone'      : `${timezone}`,
                'lat'          : `${lat}`,
                'longi'         : `${longi}`,
                'uuid'          : `${uuid}`,
                'device_type'   : `${device}`,
                'browser_name'  : `${browserName}`
            };
            

              // Url we are sending the data to
              let url = "http://localhost:3007/track/create";
        
            //navigator.sendBeacon(url, JSON.stringify(data));
        }
    });

});