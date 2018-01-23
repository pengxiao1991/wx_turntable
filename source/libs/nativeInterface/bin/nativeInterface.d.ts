// TypeScript file
declare namespace Native {
    function clearMockLogin():void;
    function mockLogin(token:string,imei:string):void;
    function getToken(cb:Function,force:boolean):void;
    function getTokenFromCache():string;
    function initAndroidEnv(fn:Function):void;
    function bindBackListener(fn:Function):void;
    function unBindBackListener(fn:Function):void;
    function finishPage():any;
    function isLogin():any;
    // function getUserInfo():any;
    function startLoading(msg:string):void;
    function stopLoading():void;
    function setStatusbarStyle(arg:any):void;
    function getDeviceInfo():any;
    function showNativeDialog(json:any,cb:Function):void;
    function showNativeToast(json:any):void;
    function addNetworkListener(cb:Function):void;
    function removeNetworkListener(cb:Function):void;
    function markCoinChanged():void;
    function bindStartStopScreenListener(cb: Function):void;
    function unBindStartStopScreenListener(cb: Function):void;
} 