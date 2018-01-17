

class ServersEngine {
	private static AUTH_LINK_URL_PREFIX = 'wss://venice.uwaterpark.com/native/auth/sock';
	private static UN_AUTH_LINK_URL = 'wss://venice.uwaterpark.com/web/unauth/sock';
	private static SERVER_DOMAIN = 'https://venice.uwaterpark.com';

	//是否网络失败
	public static networkError:boolean = false
	//默认来源渠道
	private static CHANNEL = (function () {
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

	constructor() {
		
	 }
	public static initial(): void {
		//----长链接公共异常处理
		StompWebSocket.initial(
			//网络异常处理
			() => {
				console.log(this.networkError,'this.networkError');
				if (!this.networkError) {
					console.log(' 通知网络异常 todo');
					NoNetWork.noNetWork(function () {}, true);
				}
				this.networkError = true;
			},
			//通用错误吗
			{'120203':'多设备登录','110101':'访问该接口需要用户登陆信息'},
			//通用错误处理，发生该类错误时，响应函数不回调，只处理当前响应
			(errCode) => {
				GlobalEmitter.emit(GlobalEvent.COMMON_ERR_THROW,errCode);
				console.log(errCode,'error');
			},
			(isLogined) =>{
				console.log(isLogined,'nidaye');
				// connect方法调用后触发
				GlobalEmitter.emit(GlobalEvent.SOCKET_PIPLE_READY,isLogined);
			},
			this.checkLoginWithXhr.bind(this),
			this.AUTH_LINK_URL_PREFIX,
			this.UN_AUTH_LINK_URL,
			this.SERVER_DOMAIN
		);


	}

	/**
     * 短链接 查询登录状态
     */
	private static checkLoginWithXhr(token: string, args: any, callback: Function): void {
		console.log('trump checkLoginWithXhr start')
		Pxfetch.pxfetch({
			'type': 'get',
			'url': this.SERVER_DOMAIN + '/native/auth/user/info.do',
			'data': args,
			'success': function (response) {
				console.log('trump checkLoginWithXhr stop',response)
				if (response.code == 200) {
					callback();
				} else {
					//todo 异常处理
					console.log('error', response.message);
				}
			}
		}, 5000);

	}

	/**
	* 断开连接
	*/
	public static disConnect(): void {
		StompWebSocket.disConnect();
	}

    /**
     * 建立连接
     * @param [args] 设备参数
     */
	public static connect(): void {
		this.networkError = false;
		let isLogin = Native.isLogin().isLogin;
		let token;
		if(isLogin){
			token = Native.getTokenFromCache();
			if(!token){
				//规避token获取有延迟的情况
				Native.getToken(function(_token){
					token = _token;
					StompWebSocket.connect(token, Native.getDeviceInfo());
				},false);
				return
			}
		}
		
		StompWebSocket.connect(token, Native.getDeviceInfo());
	}

    /**
     * 发送消息
     * @param uri 接口标示
     * @param message 请求内容
     * @param [callback] 回调函数 
     */
	public static sendMessage(uri: string, message: string, callback: Function = null): void {
		StompWebSocket.sendMessage(uri, message, callback);
	}
}