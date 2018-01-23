var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var NoNetWork = (function () {
    function NoNetWork() {
    }
    NoNetWork.noNetWork = function (repairHandler, isJustConnectBroken) {
        var noNetWorkText = document.querySelector('.no-network-text'), noNetWorkCover = document.querySelector('.no-network-cover');
        noNetWorkText.innerText = isJustConnectBroken ? "无网络连接，请检查网络设置" : "网络不稳定超时，请检查网络设置";
        GameInfo.noNetWork = true;
        // GlobalEmitter.emit(GlobalEvent.NO_NET_WORK);//发射无网络事件
        //无网络使用息屏逻辑
        ProcessManager.stop();
        GameInfo.noNetWork = true;
        noNetWorkCover.style.display = 'block'; //拉起无网络页面   
        window['no_network_callback'] = function (response) {
            if (response.available) {
                if (!!window['no_network_callback']) {
                    GameInfo.noNetWork = false;
                    repairHandler();
                    ServersEngine.networkError = false;
                    noNetWorkCover.style.display = 'none'; //关闭无网络页面
                    Native.removeNetworkListener(window['no_network_callback']);
                    delete window['no_network_callback'];
                    console.log(1111);
                    GameInfo.noNetWork = false;
                    ProcessManager.init();
                }
            }
        };
        Native.addNetworkListener(window['no_network_callback']);
        document.querySelector('.no-network').addEventListener('click', function () {
            location.href = "flyme://com.meizu.compaign/bridgeLink?targetPackage=com.android.settings&targetAction=android.settings.SETTINGS";
        });
    };
    return NoNetWork;
}());
__reflect(NoNetWork.prototype, "NoNetWork");
