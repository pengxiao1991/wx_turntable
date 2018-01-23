var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var ServersEngine = (function () {
    function ServersEngine() {
    }
    ServersEngine.initial = function () {
        var _this = this;
        //----长链接公共异常处理
        StompWebSocket.initial(
        //网络异常处理
        function () {
            console.log(_this.networkError, 'this.networkError');
            if (!_this.networkError) {
                console.log(' 通知网络异常 todo');
                NoNetWork.noNetWork(function () { }, true);
            }
            _this.networkError = true;
        }, 
        //通用错误吗
        { '120203': '多设备登录', '110101': '访问该接口需要用户登陆信息' }, 
        //通用错误处理，发生该类错误时，响应函数不回调，只处理当前响应
        function (errCode) {
            GlobalEmitter.emit(GlobalEvent.COMMON_ERR_THROW, errCode);
            console.log(errCode, 'error');
        }, function (isLogined) {
            console.log(isLogined, 'nidaye');
            // connect方法调用后触发
            GlobalEmitter.emit(GlobalEvent.SOCKET_PIPLE_READY, isLogined);
        }, this.checkLoginWithXhr.bind(this), this.AUTH_LINK_URL_PREFIX, this.UN_AUTH_LINK_URL, this.SERVER_DOMAIN);
    };
    /**
     * 短链接 查询登录状态
     */
    ServersEngine.checkLoginWithXhr = function (token, args, callback) {
        console.log('trump checkLoginWithXhr start');
        Pxfetch.pxfetch({
            'type': 'get',
            'url': this.SERVER_DOMAIN + '/native/auth/user/info.do',
            'data': args,
            'success': function (response) {
                console.log('trump checkLoginWithXhr stop', response);
                if (response.code == 200) {
                    callback();
                }
                else {
                    //todo 异常处理
                    console.log('error', response.message);
                }
            }
        }, 5000);
    };
    /**
    * 断开连接
    */
    ServersEngine.disConnect = function () {
        StompWebSocket.disConnect();
    };
    /**
     * 建立连接
     * @param [args] 设备参数
     */
    ServersEngine.connect = function () {
        this.networkError = false;
        var isLogin = Native.isLogin().isLogin;
        var token;
        if (isLogin) {
            token = Native.getTokenFromCache();
            if (!token) {
                //规避token获取有延迟的情况
                Native.getToken(function (_token) {
                    token = _token;
                    StompWebSocket.connect(token, Native.getDeviceInfo());
                }, false);
                return;
            }
        }
        StompWebSocket.connect(token, Native.getDeviceInfo());
    };
    /**
     * 发送消息
     * @param uri 接口标示
     * @param message 请求内容
     * @param [callback] 回调函数
     */
    ServersEngine.sendMessage = function (uri, message, callback) {
        if (callback === void 0) { callback = null; }
        StompWebSocket.sendMessage(uri, message, callback);
    };
    ServersEngine.AUTH_LINK_URL_PREFIX = 'wss://venice.uwaterpark.com/native/auth/sock';
    ServersEngine.UN_AUTH_LINK_URL = 'wss://venice.uwaterpark.com/web/unauth/sock';
    ServersEngine.SERVER_DOMAIN = 'https://venice.uwaterpark.com';
    //是否网络失败
    ServersEngine.networkError = false;
    //默认来源渠道
    ServersEngine.CHANNEL = (function () {
        var channel = '003' //默认福利中心
        , part = location.href.split('?')[1], key = Link.CHANNEL_KEY;
        if (!!part && part.indexOf('channel') != -1) {
            part.split('&').forEach(function (str) {
                if (str.indexOf(key) == 0) {
                    channel = str.split('=')[1];
                }
            });
        }
        return channel;
    })();
    return ServersEngine;
}());
__reflect(ServersEngine.prototype, "ServersEngine");
