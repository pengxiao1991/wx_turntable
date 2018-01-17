// TypeScript file
declare class StompWebSocket {
    constructor();
	/**
	 * 初始化
     * @param NetWorkExceptionHandler 网络异常回调
     * @param COMMON_CODES 通用错误码 映射表
     * @param CommonExceptionHandler 通用异常处理
     * @param SocketConnected socket建立连接后的回调函数
	 * @param CheckLoginServer 检测登录服务
	 * @param AUTH_LINK_URL_PREFIX 登录连接前缀
	 * @param UN_AUTH_LINK_URL 未登录URL
	 * @param SERVER_DOMAIN 服务器域名
	 */
	public static initial(
		NetWorkExceptionHandler: Function ,
        COMMON_CODES:any,
        CommonExceptionHandler:Function,
        SocketConnected:Function,
		CheckLoginServer: Function ,
		AUTH_LINK_URL_PREFIX:any,
		UN_AUTH_LINK_URL:any,
		SERVER_DOMAIN:any
	): void ;
    /**
     * 断开连接
     */
	public static disConnect(): void ;

    /**
     * 建立连接
     * @param [token] 登录token
     * @param [args] 设备参数
     */
	public static connect(token: string , args: Object ): void;

    /**
     * 发送消息
     * @param uri 接口标示
     * @param message 请求内容
     * @param [callback] 回调函数 
     */
	public static sendMessage(uri: string, message: string, callback: Function): void;

    /**
     * 添加广播消息监听
     * @param callback 回调函数
     */
	//public static addBroadCastLiseners(callback: Function) :void;
  
} 