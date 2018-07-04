(function () {
    var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    if (isOpera) window.webrtcDetectedBrowser = "opera";
    // Firefox 1.0+
    var isFirefox = typeof InstallTrigger !== 'undefined';
    if (isFirefox) window.webrtcDetectedBrowser = "firefox";

    // Safari 3.0+ "[object HTMLElementConstructor]" 
    var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
    if (isSafari) window.webrtcDetectedBrowser = "safari";

    // Internet Explorer 6-11
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    if (isIE) window.webrtcDetectedBrowser = "IE";

    // Edge 20+
    var isEdge = !isIE && !!window.StyleMedia;
    if (isEdge) window.webrtcDetectedBrowser = "edge";

    // Chrome 1+
    var isChrome = !!window.chrome && !!window.chrome.webstore;
    if (isChrome) window.webrtcDetectedBrowser = "chrome";

})();