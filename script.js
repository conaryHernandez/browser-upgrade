var json = {
    "siteName": "sandals",
    "siteCode": "sndl",
    "cdnUrl": "https://www.cdn.com",
    "browsersBySite": {
        "www.sandals.com": [
            {
                name: "Chrome",
                minimunVersion: 58,
                downloadUrl: "https://www.chrome.com"
            },
            {
                name: "Safari",
                minimunVersion: 10,
                downloadUrl: "https://www.safari.com"
            },
        ],
        "www.beaches.com": [
            {
                name: "Chrome",
                minimunVersion: 56,
                downloadUrl: "https://www.chrome.com"
            },
            {
                name: "Safari",
                minimunVersion: 9,
                downloadUrl: "https://www.safari.com"
            },
        ],
        "sandalsselect.com": [
            {
                name: "Chrome",
                minimunVersion: 58,
                downloadUrl: "https://www.chrome.com"
            },
            {
                name: "Safari",
                minimunVersion: 10,
                downloadUrl: "https://www.safari.com"
            },
            {
                name: "Firefox",
                minimunVersion: 10,
                downloadUrl: "https://www.safari.com"
            },
        ]
    },
    "modalContent": {
        sandals:{
            "icon":"icon-sandals",
            "text": "Your sandals app"
        },
        beaches: {
            "icon":"icon-beaches",
            "text": "Your beaches app"
        },
        ssg: {
            "icon":"icon-ssg",
            "text": "Your ssg app"
        }
    },
}

navigator.myBrowser= (function(){
    var ua= navigator.userAgent, tem,
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
        if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    return M.join(' ');
})();

var browser = navigator.myBrowser;
var browserName = browser.match(/[a-zA-Z]+/g);
var browserVersion = parseInt(browser.match(/\d+/)[0]);
var siteName = window.location.hostname !== "" ? window.location.hostname : console.log('the browser script is not working probably because you are in a local server');
var lengthBrowsers = json.browsersBySite[siteName] ? json.browsersBySite[siteName].length : 0;

function validateBrowser() {

    for (var x = 0; x < lengthBrowsers; x++ ) {
        if (browserName[0] === json.browsersBySite[siteName][x].name) {
            console.log("existe");

            if (browserVersion < json.browsersBySite[siteName][x].minimunVersion) {
                console.log("version desactualizada");
                createModalBox();
            }
        }
    }
}

function createModalBox() {
    var modalwrapper = document.createElement('div');
    var modal = document.createElement('div');
    var body = document.querySelector('body');
    var modalItems = json.modalContent.length;
    /* Default styles for modal*/
    modal.style.position = 'fixed';
    modal.style.backgroundColor = "black";
    modal.style.opacity = '0.5';
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.top = "0";

    modalwrapper.classList.add('browser-upgrade');
    modalwrapper.style.position = 'absolute';
    modalwrapper.style.backgroundColor = "red";
    modalwrapper.style.width = "300px";
    modalwrapper.style.height = "300px";

   //Childs
   modal.appendChild(modalwrapper);
   body.appendChild(modal);

    var pageWidth = document.getElementsByClassName('browser-upgrade')[0].offsetWidth;
    var pageHeight = window.innerHeight;
    var halfMiddle = pageWidth / 2;
    var halfTop = pageHeight / 2;

    modalwrapper.style.top = "50%";
    modalwrapper.style.marginTop = "-" + (halfTop / 2 ) + "px";
    modalwrapper.style.left = "50%";
    modalwrapper.style.marginLeft = "-" + halfMiddle + "px";

}

