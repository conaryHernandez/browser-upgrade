var json = {
    "siteName": "sandals",
    "siteCode": "sndl",
    "cdnUrl": "https://www.cdn.com",
    "browsersBySite": {
        "www.sandals.com": [
            {
                name: "Chrome",
                minVersionSupported: 58,
                downloadUrl: "https://www.chrome.com"
            },
            {
                name: "Safari",
                minVersionSupported: 10,
                downloadUrl: "https://www.safari.com"
            },
        ],
        "www.beaches.com": [
            {
                name: "Chrome",
                minVersionSupported: 56,
                downloadUrl: "https://www.chrome.com"
            },
            {
                name: "Safari",
                minVersionSupported: 9,
                downloadUrl: "https://www.safari.com"
            },
        ],
        "sandalsselect.com": [
            {
                name: "Chrome",
                minVersionSupported: 58,
                downloadUrl: "https://www.chrome.com"
            },
            {
                name: "Safari",
                minVersionSupported: 10,
                downloadUrl: "https://www.safari.com"
            },
            {
                name: "Firefox",
                minVersionSupported: 10,
                downloadUrl: "https://www.safari.com"
            },
        ]
    },
    "modalContent": {
        sandals:{
            "icon":"icon-sandals",
            "text": "This website is designed using new technology and best practices",
            "highlightText": "We recommend upgrading your browser"
        },
        beaches: {
            "icon":"icon-beaches",
            "text": "This website is designed using new technology and best practices",
            "highlightText": "We recommend upgrading your browser"
        },
        ssg: {
            "icon":"icon-ssg",
            "text": "This website is designed using new technology and best practices",
            "highlightText": "We recommend upgrading your browser"
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
var body = document.querySelector('body');

function validateBrowser() {

    for (var x = 0; x < lengthBrowsers; x++ ) {
        if (browserName[0] === json.browsersBySite[siteName][x].name) {
            console.log("existe");

            if (browserVersion < json.browsersBySite[siteName][x].minVersionSupported) {
                console.log("version desactualizada");
                createModalBox();
            }
        }
    }
}

function createModalBox() {
    var modalWrapper = document.createElement('div');
    var modal = document.createElement('div');
    var modalItems = json.modalContent.length;
    var pageWidth;
    var pageHeight;
    var halfMiddle;
    var halfTop;

    /* Default styles for modal*/
    body.style.overflow= "hidden";

    modal.classList.add('browser-modal');
    modal.style.position = 'fixed';
    modal.style.backgroundColor = "black";
    modal.style.opacity = '0.5';
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.top = "0";
    modal.style.zIndex = "9998";

    modalWrapper.classList.add('browser-upgrade');
    modalWrapper.style.position = 'absolute';
    modalWrapper.style.backgroundColor = "white";
    modalWrapper.style.backgroundImage = "url(/assets/img/global//page-bg-repeat-compressor.gif) center top repeat;";
    modalWrapper.style.width = "582px";
    modalWrapper.style.height = "252px";
    modalWrapper.style.zIndex = "9999";

    body.appendChild(modal);
    body.appendChild(modalWrapper);

    pageWidth = document.getElementsByClassName('browser-upgrade')[0].offsetWidth;
    pageHeight = document.body.clientHeight;;
    halfMiddle = pageWidth / 2;
    halfTop = pageHeight / 2;

    modalWrapper.style.top = "50%";
    modalWrapper.style.marginTop = "-" + (halfTop / 2 ) + "px";
    modalWrapper.style.left = "50%";
    modalWrapper.style.marginLeft = "-" + halfMiddle + "px";

    function closeModal() {
        body.style.overflow= "scroll";
        body.removeChild(modal);
        body.removeChild(modalWrapper);
        removeEvent("click", modal, closeModal );
    }

    function auxClose(e) {
        if (e.keyCode == 27) {
            body.removeChild(modal);
            body.removeChild(modalWrapper);
            body.style.overflow= "scroll";
            removeEvent("keydown", document, auxClose );
        }
    }

    addEvent("click", modal, closeModal );
    addEvent("keydown", document, auxClose );
}

function addEvent(event, element, func) {
  if (element.addEventListener) {
        element.addEventListener(event, func, false);
   } else if (elem.attachEvent) {
        element.attachEvent("on" + event, func);
   }
}

function removeEvent(event, element, func) {
    if (element.removeEventListener) {
        element.removeEventListener(event, func);
    } else if (element.detachEvent) {
        element.detachEvent(event, func);
    }
}

addEvent("load", document, validateBrowser() );


/*estilos de modal
background gradient
background fallback
opacidad  ****
event listener o attach ****
no scroll  *****
cerrar  modal y poder scrolear  *****
cerrar modal dando clic afuera o en X ****
cerrar modal con esc
generar text y icono
acortar hostname a solo domain name
arreglar json
*/

/*falta
agregar cookie
agregar request de json
*/

