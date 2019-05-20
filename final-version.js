var xobj;
var browser;
var browserName;
var browserVersion;
var trackProtection;
var siteName, url;
var lengthBrowsers;
var internals = {};
var body = document.getElementsByTagName("body")[0];

/* No ajax (and its cross domain request)because it needs to work in IE7, sorry :( */
var json = {
    "type": "rules",
    "browsersBySite": {
        "test": [
            {
                "name": "Edge",
                "minSupportedVersion": 12,
                "downloadUrl": "https://www.microsoft.com/en-us/download/details.aspx?id=48126"
            },
            {
                "name": "IE",
                "minSupportedVersion": 11,
                "downloadUrl": "https://www.microsoft.com/en-us/download/internet-explorer-11-for-windows-7-details.aspx"
            },
            {
                "name": "MSIE",
                "minSupportedVersion": 11,
                "downloadUrl": "https://www.microsoft.com/en-us/download/internet-explorer-11-for-windows-7-details.aspx"
            },
            {
                "name": "Firefox",
                "minSupportedVersion": 34,
                "downloadUrl": "https://www.mozilla.org/en-US/firefox/new/"
            },
            {
                "name": "Safari",
                "minSupportedVersion": 7,
                "downloadUrl": "https://support.apple.com/en-us/HT204416"
            },
            {
                "name": "Chrome",
                "minSupportedVersion": 30,
                "downloadUrl": "https://www.google.com/chrome/"
            }
        ],
        "testselect": [
            {
                "name": "Edge",
                "minSupportedVersion": 12,
                "downloadUrl": "https://www.microsoft.com/en-us/download/details.aspx?id=48126"
            },
            {
                "name": "IE",
                "minSupportedVersion": 11,
                "downloadUrl": "https://www.microsoft.com/en-us/download/internet-explorer-11-for-windows-7-details.aspx"
            },
            {
                "name": "MSIE",
                "minSupportedVersion": 11,
                "downloadUrl": "https://www.microsoft.com/en-us/download/internet-explorer-11-for-windows-7-details.aspx"
            },
            {
                "name": "Firefox",
                "minSupportedVersion": 34,
                "downloadUrl": "https://www.mozilla.org/en-US/firefox/new/"
            },
            {
                "name": "Safari",
                "minSupportedVersion": 7,
                "downloadUrl": "https://support.apple.com/en-us/HT204416"
            },
            {
                "name": "Chrome",
                "minSupportedVersion": 30,
                "downloadUrl": "https://www.google.com/chrome/"
            }
        ]
    },
    "modalContent": {
        "test":{
            "icon":"icon-test",
            "text": "Please enter text",
            "highlightText": "Please Enter new text here",
            "highlightColor":"#809a00"
        },
        "testselect": {
            "icon":"icon-ssg",
            "text": "Please enter text",
            "highlightText": "Please Enter new text here",
            "highlightColor":"#373737"
        }
    }
}

// validating IE 8 events
internals.addEvent = function (event, element, func) {
    if (element.addEventListener) {
        element.addEventListener(event, func, false);
    } else if (element.attachEvent) {
        element.attachEvent('on' + event  , function() {
            return func;
        });
    }
}

//closing event for IE8
internals.addClosingEvent = function (event, element, func) {
    if (element.addEventListener) {
        element.addEventListener(event, func, false);
    } else if (element.attachEvent) {
        element.attachEvent('on' + event  , function() {
            /* works in IE8, kill me please :( */
            var modal = document.getElementById('browser-modal');
            var modalWrapper = document.getElementById('browser-upgrade');
            document.body.style.overflow = "scroll";
            modal.style.display = "none";
            modalWrapper.style.display = "none";
        });
    }
}

internals.removeEvent = function (event, element, func) {
    if (element.removeEventListener) {
        element.removeEventListener(event, func);
    } else if (element.detachEvent) {
        element.detachEvent(event, func);
    }
}

internals.getHostName = function (url) {
    var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);

    if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
    return match[2];
    }
    else {
        return null;
    }
}

internals.getDomain = function (url) {
    var hostName = internals.getHostName(url);
    var domain = hostName;

    if (hostName != null) {
        var parts = hostName.split('.').reverse();
        if (parts != null && parts.length > 1) {
            domain = parts[1] + '.' + parts[0];
            if (hostName.toLowerCase().indexOf('.co.uk') != -1 && parts.length > 2) {
              domain = parts[2] + '.' + domain;
            }
        }
    }
    return domain;
}

internals.getSubDomain = function () {
    var full = window.location.host
    //window.location.host is subdomain.domain.com
    var parts = full.split('.')
    trackProtection = parts[0]
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
url = window.location.href;
siteName = internals.getDomain(url);
siteName = siteName.substring(0, siteName.lastIndexOf("."));

//the website name
lengthBrowsers = json.browsersBySite[siteName] ? json.browsersBySite[siteName].length : 0;
//cookie
internals.displayOnce = function() {
    if (document.cookie.replace(/(?:(?:^|.*;\s*)DISPLAYWARNING\s*\=\s*([^;]*).*$)|^.*$/, "$1") !== "true") {
        var date = new Date();
        var expirationDays = 1;
        date.setTime(date.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + date.toUTCString();
        document.cookie = "DISPLAYWARNING=true; " + expires;
        internals.addEvent("load", body, validateBrowser(json) );
    }

    internals.addEvent("load", body, internals.getSubDomain() );
    //tracking mode validation for Firefox.
    if ((navigator.doNotTrack === '1') && (browserName[0] === 'Firefox') && (browserVersion >= 42) && (trackProtection != 'obe')) {
        console.log('no obe');
        validateTrackMode(json);
    } else {
        console.log('si obe');
    }
}
internals.addEvent("load", body, internals.displayOnce() );

function validateBrowser(json) {
    for (var x = 0; x < lengthBrowsers; x++ ) {
        if (browserName[0] === json.browsersBySite[siteName][x].name) {

            if (browserVersion < json.browsersBySite[siteName][x].minSupportedVersion) {
                createBrowserVersionModal(x, json);
            }
        }
    }
}

function validateTrackMode(json) {
    for (var x = 0; x < lengthBrowsers; x++ ) {
        if (browserName[0] === json.browsersBySite[siteName][x].name) {
            createTrackModeModal(x, json);
        }
    }
}

function createTrackModeModal(pos, json) {
    createBrowserVersionModal(pos, json);

    var modalText = document.getElementById("description-text");
    var modalHighlight = document.getElementById("description-highlight-text");
    modalText.style.display = "none";
    modalHighlight.style.marginTop = "20px";
    modalHighlight.textContent = "In order to run our site properly please update your security settings in your browser or stop using Private Window.";
}

function createBrowserVersionModal(pos, json) {
    var modalWrapper = document.createElement('div');
    var modal = document.createElement('div');
    var closeBtn = document.createElement('div');
    var closeIcon = document.createElement('span');
    var modalIcon = document.createElement('img');
    var modalText = document.createElement('p');
    var modalTextContent = document.createTextNode(json.modalContent[siteName].text);
    var modalHighlight = document.createElement('a');
    var modalHighlightText = document.createTextNode(json.modalContent[siteName].highlightText);

    var modalItems = json.modalContent.length;
    var pageWidth;
    var pageHeight;
    var halfMiddle;
    var halfTop;
    var valueOpacity = 0.5;

    console.log('upgrade your browser please :( :(');

    /* Default styles for modal*/
    body.style.overflow = "hidden";

    /* button close*/
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = "-23px";
    closeBtn.style.right = "-23px";
    closeBtn.style.width = " 32px";
    closeBtn.style.height = "32px";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.fontSize = "25px";
    closeIcon.style.lineHeight = "30px";
    closeBtn.style.color = "white";
    closeBtn.style.textAlign = "center";
    closeBtn.style.backgroundColor = "#433a2b";
    closeBtn.style.borderRadius = "50%";
    closeBtn.style.border = "3px solid white";
    closeIcon.style.display = "block";

    /*  modal area*/
    modal.id = 'browser-modal';
    modal.style.position = 'fixed';
    modal.style.backgroundColor = "black";

    /* opacity for IE8 because the property is not supported */

    if (browserName[0] === 'MSIE'  && browserVersion < 9 ) {
         modal.style.filter = 'alpha(opacity=' + valueOpacity * 100 + ')';
    } else {
        modal.style.opacity = '0.5';
    }
    modal.style.top = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.zIndex = "9998";

    /*  modal box center top repeat*/
    modalWrapper.id = 'browser-upgrade';
    modalWrapper.style.position = 'absolute';
    modalWrapper.style.backgroundColor = "white";
    modalWrapper.style.backgroundImage = "url('https://cdn.test.com/test/browsers/resources/page-bg-repeat-compressor.gif')";
    modalWrapper.style.borderRadius = "5px";
    modalWrapper.style.border = "thick solid #fff";

    //  some styles may see useless but they are necessary because IE9 and IE8 are so special with the css properties.
    if (document.body.clientWidth <= 768) {
        modalIcon.style.margin = "auto";
        modalWrapper.style.width = "80%";
        modalWrapper.style.height = "350px";

    } else {
        modalWrapper.style.width = "592px";
        modalWrapper.style.height = "252px";
        modalIcon.style.marginTop = "40px";
        modalIcon.style.marginRight = "auto";
        modalIcon.style.marginBottom = "auto";
        modalIcon.style.marginLeft = "50px";
    }
    modalWrapper.style.maxWidth = "592px";
    modalWrapper.style.zIndex = "9999";

    document.body.appendChild(modal);
    document.body.appendChild(modalWrapper);

    //  center the modal, I didnt use transform because the browser compatibility
    pageWidth = modalWrapper.offsetWidth;
    pageHeight = document.body.offsetHeight;;
    halfMiddle = pageWidth / 2;
    halfTop = pageHeight / 2;

    modalWrapper.style.top = "200px";
    modalWrapper.style.left = "50%";
    modalWrapper.style.marginLeft = "-" + halfMiddle + "px";

    //  modal content generated by json
    modalIcon.setAttribute("src", "https://cdn.test.com/" + siteName + ".png" );
    modalIcon.style.display = "block";

    //  some styles may see useless but they are necessary because IE9 and IE8 are so special with the css properties.

    if (document.body.clientWidth <= 768) {
        modalIcon.style.width = "100%";
    }

    /* modal text */
    modalHighlight.setAttribute("href", json.browsersBySite[siteName][pos].downloadUrl );
    modalHighlight.setAttribute("target", "_blank" );
    modalText.style.font = "16.5px/27px arial";
    modalText.style.textAlign = "center";
    modalText.style.color = "#373737";
    modalText.style.marginBottom = "4px";

    modalHighlight.style.marginTop = "0";
    modalHighlight.style.font = "20px/32px arial";
    modalHighlight.style.fontWeight = "bold";
    modalHighlight.style.textAlign = "center";
    modalHighlight.style.color = json.modalContent[siteName].highlightColor;
    modalHighlight.style.display = "block";
    modalHighlight.style.textDecoration = "none";

    closeIcon.innerHTML = "X";

    modalText.setAttribute("id", "description-text" );
    modalHighlight.setAttribute("id", "description-highlight-text" );
    //  adding childs to the DOM
    closeBtn.appendChild(closeIcon);
    modalText.appendChild(modalTextContent);
    modalHighlight.appendChild(modalHighlightText);

    modalWrapper.appendChild(modalIcon);
    modalWrapper.appendChild(modalText);
    modalWrapper.appendChild(modalHighlight);
    modalWrapper.appendChild(closeBtn);

    //only is necesary when the modal is created
    internals.closeModal = function() {
        body.style.overflow = "scroll";
        modal.style.display = "none";
        modalWrapper.style.display = "none";
        internals.removeEvent("click", modal, internals.closeModal );
    }

    //adding closing events
    internals.addClosingEvent("click", closeBtn, internals.closeModal);
    internals.addClosingEvent("click", modal, internals.closeModal);
    internals.addClosingEvent("keydown", document, internals.auxClose );
}

//optional close with ESC
internals.auxClose = function(e) {
    var modal = document.getElementById('browser-modal');
    var modalWrapper = document.getElementById('browser-upgrade');

    if (e.keyCode == 27) {
        modal.style.display = "none";
        modalWrapper.style.display = "none";
        body.style.overflow = "scroll";
        internals.removeEvent("keydown", document, internals.auxClose );
    }
}

