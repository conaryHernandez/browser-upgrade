var json = {
    "siteName": "sandals",
    "siteCode": "sndl",
    "cdnUrl": "https://www.cdn.com",
    "browsers": [
        {
            name:"Chrome",
            minimunVersion:56,
            downloadUrl: "https://www.chrome.com"
        },
        {
            name:"Safari",
            minimunVersion:56,
            downloadUrl: "https://www.safari.com"
        },
        {
            name:"Firefox",
            minimunVersion:56,
            downloadUrl: "https://www.firefox.com"
        }
    ]
}

console.log(json);

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

var lengthBrowsers = json.browsers.length;

function validateBrowser() {
    for (var y = 0; y < lengthBrowsers ; y ++){
        if(browserName[0] === json.browsers[y].name) {
            console.log("existe");
            if( browserVersion < json.browsers[y].minimunVersion) {
                console.log("version desactualizada");
                createModalBox();
            }
        }
    }
}

function createModalBox() {
    var modalwrapper = document.createElement('div');
    var modalIcon = document.createElement('i');
    var body = document.querySelector('body');

    //Classes
    modalwrapper.classList.add('browser-upgrade');
    modalIcon.classList.add('icon-sandals'); //icon sandals debe venir de JSON

    //styles
    /* TODOS ESTOS ESTILOS DEBEN VENIR DE UN JSON*/
    modalwrapper.style.position = 'absolute';
    modalwrapper.style.backgroundColor = "red";
    modalwrapper.style.width = "300px";
    modalwrapper.style.height = "300px";
    modalwrapper.style.margin = "auto";

   //Childs
   modalwrapper.appendChild(modalIcon);
   body.appendChild(modalwrapper);
}

