var xobj = new XMLHttpRequest();
var browser;
var browserName;
var browserVersion;
var siteName;
var lengthBrowsers;
var internals = {};
var body = document.querySelector('body');

// validating IE 8 events
internals.addEvent = function(event, element, func) {
  if (element.addEventListener) {
        element.addEventListener(event, func, false);
   } else if (elem.attachEvent) {
        element.attachEvent("on" + event, func);
   }
}

internals.removeEvent = function(event, element, func) {
    if (element.removeEventListener) {
        element.removeEventListener(event, func);
    } else if (element.detachEvent) {
        element.detachEvent(event, func);
    }
}

// get browser version
navigator.myBrowser = (function(){
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

//browser name
browser = navigator.myBrowser;
browserName = browser.match(/[a-zA-Z]+/g);
browserVersion = parseInt(browser.match(/\d+/)[0]);
siteName = window.location.hostname !== "" ? window.location.hostname : console.log('the browser script is not working probably because you are in a local server');
siteName = siteName.substring(0, siteName.lastIndexOf(".")).replace(/^www\./,'');

//requesting data
xobj.open('GET', "https://cdn.sandals.com/sandalsselect/v3/img/rules.json");
xobj.onreadystatechange = function() {
    if (xobj.readyState == 4 && xobj.status == "200") {
        var json = JSON.parse(xobj.responseText);
        //the website name
        lengthBrowsers = json.browsersBySite[siteName] ? json.browsersBySite[siteName].length : 0;

        //cookie
        internals.displayOnce = function() {
          if (document.cookie.replace(/(?:(?:^|.*;\s*)DISPLAYWARNING\s*\=\s*([^;]*).*$)|^.*$/, "$1") !== "true") {
            var date = new Date();
            var expirationDays = 5;
            date.setTime(date.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + date.toUTCString();
            document.cookie = "DISPLAYWARNING=true; " + expires;
            internals.addEvent("load", document, internals.validateBrowser(json) );
          }
          console.log("ya se establecio la cookie");
        }

        internals.addEvent("load", document, internals.displayOnce() );
    }
};
xobj.send();

internals.validateBrowser = function(json) {

    for (var x = 0; x < lengthBrowsers; x++ ) {
        if (browserName[0] === json.browsersBySite[siteName][x].name) {
            console.log("existe");

            if (browserVersion < json.browsersBySite[siteName][x].minSupportedVersion) {
                console.log("version desactualizada");
                internals.createModalBox(x, json);
            }
        }
    }
}

internals.createModalBox = function(pos, json) {
    var modalWrapper = document.createElement('div');
    var modal = document.createElement('div');
    var modalIcon = document.createElement('i');
    var modalText = document.createElement('p');
    var modalTextContent = document.createTextNode(json.modalContent[siteName].text);
    var modalHighlight = document.createElement('a');
    var modalHighlightText = document.createTextNode(json.modalContent[siteName].highlightText);

    var modalItems = json.modalContent.length;
    var pageWidth;
    var pageHeight;
    var halfMiddle;
    var halfTop;

    /* Default styles for modal*/
    body.style.overflow= "hidden";

    /*modal area*/
    modal.classList.add('browser-modal');
    modal.style.position = 'fixed';
    modal.style.backgroundColor = "black";
    modal.style.opacity = '0.5';
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.top = "0";
    modal.style.zIndex = "9998";

    /*modal box*/
    modalWrapper.classList.add('browser-upgrade');
    modalWrapper.style.position = 'absolute';
    modalWrapper.style.backgroundColor = "white";
    modalWrapper.style.backgroundImage = "url(/assets/img/global//page-bg-repeat-compressor.gif) center top repeat;";
    modalWrapper.style.width = "582px";
    modalWrapper.style.height = "252px";
    modalWrapper.style.zIndex = "9999";

    body.appendChild(modal);
    body.appendChild(modalWrapper);

    //center the modal, I didnt use transform because the browser compatibility
    pageWidth = document.getElementsByClassName('browser-upgrade')[0].offsetWidth;
    pageHeight = document.body.offsetHeight;;
    halfMiddle = pageWidth / 2;
    halfTop = pageHeight / 2;

    modalWrapper.style.top = "50%";
    modalWrapper.style.left = "50%";
    modalWrapper.style.marginLeft = "-" + halfMiddle + "px";

    //modal content generated by json
    modalIcon.classList.add(json.modalContent[siteName].icon);
    modalIcon.style.textAlign = "center";
    modalIcon.style.display = "block";
    modalIcon.style.paddingTop = "50px";
    modalIcon.style.fontSize = "45px";
    modalIcon.style.color = "#809a00";

    /*modal text*/
    modalHighlight.setAttribute("href", json.browsersBySite[siteName][pos].downloadUrl );
    modalHighlight.setAttribute("target", "_blank" );
    modalText.style.font = "16.5px/27px arial";
    modalText.style.textAlign = "center";
    modalText.style.color = "#373737";
    modalText.style.marginBottom = "4px";

    modalHighlight.style.font = "20px/32px arial";
    modalHighlight.style.textAlign = "center";
    modalHighlight.style.color = "#809a00";
    modalHighlight.style.marginTop = "0";
    modalHighlight.style.fontWeight = "bold";
    modalHighlight.style.display = "block";

    //only is necesary when the modal is created
    internals.closeModal = function() {
        body.style.overflow= "scroll";
        body.removeChild(modal);
        body.removeChild(modalWrapper);
        internals.removeEvent("click", modal, internals.closeModal );
    }

    //adding chlds to the DOM
    modalText.appendChild(modalTextContent);
    modalHighlight.appendChild(modalHighlightText);

    modalWrapper.appendChild(modalIcon);
    modalWrapper.appendChild(modalText);
    modalWrapper.appendChild(modalHighlight);

    //adding closing events
    internals.addEvent("click", modal, internals.closeModal );
    internals.addEvent("keydown", document, internals.auxClose );
}

//optional close with ESC
internals.auxClose = function(e) {
    var modal = document.getElementsByClassName('browser-modal')[0];
    var modalWrapper = document.getElementsByClassName('browser-upgrade')[0];

    if (e.keyCode == 27) {
        body.removeChild(modal);
        body.removeChild(modalWrapper);
        body.style.overflow= "scroll";
        internals.removeEvent("keydown", document, internals.auxClose );
    }
}

/*estilos de modal

background gradient
background fallback
icons
font family
arreglar json
*/

/*falta
validar lo de lso iconos convertirlo a imagen en folder
los estilos personalizados deben ser propios de cada sitio
*/
