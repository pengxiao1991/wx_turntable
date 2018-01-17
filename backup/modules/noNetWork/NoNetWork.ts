class NoNetWork {
	public constructor() {
	}

	public static noNetWork (repairHandler,isJustConnectBroken) {
		var noNetWorkText = document.querySelector('.no-network-text') as HTMLElement,
			noNetWorkCover = document.querySelector('.no-network-cover') as HTMLElement;

		noNetWorkText.innerText = isJustConnectBroken ? "无网络连接，请检查网络设置" : "网络不稳定超时，请检查网络设置";
        GameInfo.noNetWork = true;
        // GlobalEmitter.emit(GlobalEvent.NO_NET_WORK);//发射无网络事件
        //无网络使用息屏逻辑
        ProcessManager.stop();   
        GameInfo.noNetWork = true;        
        noNetWorkCover.style.display = 'block';//拉起无网络页面   
        window['no_network_callback'] = function (response) {
            if(response.available) {
                if(!!window['no_network_callback']){
                    GameInfo.noNetWork = false;
					repairHandler();
                    ServersEngine.networkError = false
					noNetWorkCover.style.display = 'none';//关闭无网络页面
					Native.removeNetworkListener(window['no_network_callback']);
					delete window['no_network_callback'];
                    console.log(1111);
                    GameInfo.noNetWork = false;
                    ProcessManager.init();
                }
            }
        }  
        Native.addNetworkListener(window['no_network_callback']);  
        document.querySelector('.no-network').addEventListener('click', function () {//点击页面去设置页面
            location.href = "flyme://com.meizu.compaign/bridgeLink?targetPackage=com.android.settings&targetAction=android.settings.SETTINGS";        
        })

	}
}