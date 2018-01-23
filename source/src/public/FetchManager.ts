///<reference path="GameInfo.ts" />
///<reference path="Link.ts" />
console.log(Link,999);
namespace FetchManager {
	let networkError = false,
		//模拟token
		MOCK_TOKEN = "eyJ2IjozLCJnIjpmYWxzZSwidSI6IjE0NjIzNTAiLCJ0IjoxNTE2NzAwNTQzNTY0LCJzIjoibnMiLCJjIjoiMSIsInIiOiJ6VGZ5cTBEeXZBQVk2UjlMV0QzMSIsImEiOiIzRTQwQUJDQkRCRTdBQ0NDQzIxOTZEQkVBQUYwNzBDNiIsImwiOiI4RTdGQkVEOEZCM0MzMUY0MTQwOUQ2OUIzOTczNUIwQyJ9"

		, CHANNEL = (function () {
			var channel = '003'//默认福利中心
				, part = location.href.split('?')[1]
				, key = Link.CHANNEL_KEY
				;
			if (!!part && part.indexOf('channel') != -1) {
				part.split('&').forEach(function (str) {
					if (str.indexOf(key) == 0) {
						channel = str.split('=')[1]
					}
				})
			}
			return channel;
		})();
	Native.mockLogin(MOCK_TOKEN, '测试用');
	
	
    
	// 设置全局过滤函数
	Pxfetch.fetchPrefilter(function (param) {
		//追加来源渠道
		param.data.channel = CHANNEL;
		if (param.url.search('auth') > 0 && param.url.search('unauth') < 0) {
			// 已经登录了
			if (Native.isLogin() && Native.getTokenFromCache()) {
				param.data.access_token = Native.getTokenFromCache();;
				param.data.imei = Native.getDeviceInfo().i;
			}
			else {
				Native.getToken(function (token) {
					// if(!!token){
					// 	ProcessManager.getWebsocketChannel();
					// 	GlobalEmitter.emit(GlobalEvent.ALREADY_LOGIN);
					// }
				}, true);
			}

		}
	});

	// 设置网络异常函数
	Pxfetch.fetchNetworkError(function () {
		console.log(networkError,'networkError');
		if (!networkError) {
			// true表示异常来自网络断开，而不是超时重试导致

			// 通知网络异常
			NoNetWork.noNetWork(function () {
				networkError = false;
			}, true);
			// self.$emit(GlobalEvent.NO_NETWORK,false);
		}
		networkError = true;
	});

	// 		// 设置全局失败函数(返回401需要进行强制登录)
	Pxfetch.fetchError(function (response) {
		// 服务端报错，返回5xx
		if (/^5/.test(response.status)) {
			// 通知系统繁忙，稍后再试试
			Native.showNativeDialog(
				{
					title: '系统繁忙，稍后重试',
					positiveText: '退出',
					negativeText: '',
					cancelable: false
				},
				function(){
					egret.ticker.pause();
					setTimeout(() => {
						Native.finishPage();
					}, 50);
				}
			);
		}
		// 401强刷登录
		else if (response.status == 401) {
			console.log(Native.getTokenFromCache() === MOCK_TOKEN,'Native.getTokenFromCache() === MOCK_TOKEN');
			if (Native.getTokenFromCache() === MOCK_TOKEN) {
				//Native.clearMockLogin();
			} else {
				//401返回，开启强制登录，会触发先息屏再亮屏操作
				Native.getToken(function (token) {
					// if(!!token){
					// 	ProcessManager.getWebsocketChannel();
					// 	GlobalEmitter.emit(GlobalEvent.ALREADY_LOGIN);
					// }
				}, true);
			}
		}

	});

	// 设置全局成功函数（发生系统异常时停止自定义成功函数执行）
	Pxfetch.fetchSuccess((data, param) => {
		// 异常时停止自定义成功函数执行
		if (GameInfo.isInterrupted) {
			// param.success = null;
			param.timeoutError = null;
		}
	});
	//{'120204':'击穿奖池','120203':'多设备登录','110101':'访问该接口需要用户登陆信息'},
	GlobalEmitter.on(GlobalEvent.COMMON_ERR_THROW,function (errcode) {
		if(errcode.code == '120203') {//多设备登录
			Native.showNativeDialog(
				{
					title: '检测到你的账号在异地登录，请退出稍后重试',
					positiveText: '退出',
					negativeText: '',
					cancelable: false
				},
				function(){
					egret.ticker.pause();
					setTimeout(() => {
						Native.finishPage();
					}, 50);
				}
			);
		} else if(errcode.code == '110101') {//访问接口需要用户登录
			Native.getToken(function (token) {
				
			}, true);
		} else {
			console.log(errcode,'异常')
		}
	}, FetchManager);
}
