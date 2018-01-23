// module.exports = native; 
(function (Lib) {
    function Native () {
        this._ = {
            'tokenCb': null,
            'token': null
        };
        this.mock = {
            'accessToken': undefined,
            'imei': undefined
        };
    }

    Native.prototype = {
    /**
     * 弹框
     * json = {title: '删除操作',positiveText: '返回',negativeText: '取'};
     */
        showNativeDialog(json, cb) {
            if (Lib.isPrd) {
                Lib.invoke('showDialog', json, cb);
            }
            else {
                console.log('try to shownativedialog');
            }
        },
    /**
     * toast
     * json = {message: '删除操作',duration: 'long'};
     */
        showNativeToast(json) {
            if (Lib.isPrd) {
                Lib.syncInvoke('androidToast', json);
            }
            else {
                console.log('try to shownativetoast');
            }
        },
    /**
     * 设置 开启进度
     * @param msg
     */
        startLoading(msg) {
            Lib.syncInvoke('startLoading', { 'message': msg });
        },
    /**
     * 关闭进度
     */
        stopLoading() {
            Lib.syncInvoke('stopLoading');
        },
    /**
     * 监听MBack
     */
        bindBackListener(handler) {
            if (Lib.isPrd) {
                Lib.listen('addBackPressListener', null, handler);
            }
        },
    /**
     * 解除绑定
     * @param handler
     */
        unBindBackListener(handler) {
            Lib.removeListen('addBackPressListener', handler, 'removeBackPressListener');
        },
    /**
     * 退出
     */
        finishPage() {
            Lib.syncInvoke('finish');
        },
    //判断是否登录
        isLogin() {
            //支持mock登录
            if (!!this.mock.accessToken) {
                return { 'isLogin': true };
            }
            return Lib.syncInvoke('isLogin');
        },
    /**
     * token获取回调接口
     * @param cb 回调接口
     * @param [force] 是否强制刷新
     */
        getToken(cb, force) {
            //支持mock登录
            if (!!this.mock.accessToken) {
                return cb(this.mock.accessToken);
            }
            if (force) {
                delete this._.token;
            }
            if (!!this._.token) {
                cb(this._.token);
            }
            else {
                if (force || !this.isLogin().isLogin) {
                    this._.tokenCb = cb;
                    Lib.invoke('getTokenAsync', { "invalidToken": true }, function (ret) {
                        this._.tokenCb(this._.token = !!ret ? ret['mzToken'] : undefined);
                        delete this._.tokenCb;
                    }.bind(this));
                }
                else {
                    cb(this._.token = Lib.syncInvoke('getTokenSync', { "invalidToken": false }).mzToken);
                }
            }
        },
        getTokenFromCache() {
            //支持mock登录
            if (!!this.mock.accessToken) {
                return this.mock.accessToken;
            }
            return this._.token;
        },
    /**
     * 获取用户信息
     */
        getUserInfo() {
            return Lib.syncInvoke('getUserInfo', '');
        },
    /**
     *获取设备信息（同步）
    */
        getDeviceInfo() {
            if (!!this.mock.imei) {
                return { 'i': this.mock.imei };
            }
            return !!this.deviceInfo ? this.deviceInfo : (this.deviceInfo = Lib.syncInvoke('getDeviceInfo', ''));
        },
    /**
     * 初始化接口环境
     * @param fn
     */
        initAndroidEnv(fn) {
            getToken(fn, false);
        },
    /**
     * 设置状态栏明暗(同步)
     * @param args {isBlack: false} 是否为黑色
     */
        setStatusbarStyle(args) {
            Lib.syncInvoke('setStatusbarStyle', args);
        },

        mockLogin(token, imei) {
            if (!window.androidJs) {
                this.mock['accessToken'] = token;
                this.mock['imei'] = imei;
            }
        },
        clearMockLogin() {
            this.mock.accessToken = undefined;
            this.mock.accessToken = undefined;
        },
    /**
     * 添加网络异常监听
     * @param cb
     */
        addNetworkListener(cb) {
            if (Lib.isPrd) {
                Lib.listen('addNetworkListener', null, cb);
            }
        },
    /**
     * 去除网络监听
     */
        removeNetworkListener(cb) {
            Lib.removeListen('addNetworkListener', cb, 'removeNetworkListener');
        },
    /**
     * h5标记金豆数量变化以便于native在页面返回时处理刷新金豆数量逻辑
     */
        markCoinChanged() {
            Lib.syncInvoke('markCoinChanged');
        },

    /**
     * 绑定 熄屏亮屏监控事件
     * @param handler
     */
        bindStartStopScreenListener(handler){
            if (Lib.isPrd) {
                Lib.listen('addStartStopListener', null, handler);
            }
        },

        unBindStartStopScreenListener(handler){
            Lib.removeListen('addStartStopListener', handler, 'removeStartStopListener');
        }
    }
    window.Native = new Native();
}) (Lib = (function() {
    /**
     * 安卓接口代理层（调用，回调，监听，移除监听）
     * Created by lizhiwei on 2016/12/28.
     */
    var win = window, callbacks = {}, listeners = {}, GlobalCallbackName = 'WelFareHybridCallBack', uuid = (Math.random() * 1000000) | 0;
    /**
     * 调用native
     * @param id
     * @param method
     * @param args
     */
    function _invoke(id, method, args) {
        if (win.androidJs) {
            //GlobalCallbackName可选，存在不需要回调的情况 @author trump 12/30 13:30
            win.androidJs.doAndroidAction(id, method, !!args ? JSON.stringify(args) : '', GlobalCallbackName);
        }
        else {
            console.log('不在webview运行环境', 'androidJs.doAndroidAction(' + id + ', ' + method + ', ' + (!!args ? JSON.stringify(args) : '""') + ',' + GlobalCallbackName + ')');
        }
    }
    /**
     * 同步调用native
     * @param id
     * @param method
     * @param args
     */
    function _syncInvoke(id, method, args) {
        // console.log(id,method,args,1234);
        if (win.androidJs) {
            //GlobalCallbackName可选，存在不需要回调的情况 @author trump 12/30 13:30
            return win.androidJs.doAndroidAction(id, method, !!args ? JSON.stringify(args) : '');
            //return win.androidJs.doAndroidAction(id, method, JSON.stringify(!!args ? args : {}));
        }
        else {
            //console.log('不在webview运行环境',id,method,args);
            console.log('不在webview运行环境', 'androidJs.doAndroidAction(' + id + ', ' + method + ', ' + (!!args ? JSON.stringify(args) : '""') + ')');
        }
    }
    /**
     * 单page，uuid唯一
     * @returns {number}
     */
    function getUuid() {
        uuid += 1;
        return uuid;
    }
    win[GlobalCallbackName] = function (ret) {
        var actionId = ret['actionId'], response = ret['response']['data'], key, itm;
        //调用回调，并删除
        if (callbacks.hasOwnProperty(actionId)) {
            if (callbacks[actionId]) {
                callbacks[actionId](response);
                delete callbacks[actionId];
            }
        }
        else {
            for (key in listeners) {
                itm = listeners[key];
                //匹配轮询回调
                if (itm.id == actionId) {
                    var result = itm['cbs'][itm['cbs'].length - 1](response);
                    if (result === false || result === true) {
                        return result;
                    }
                    return;
                }
            }
        }
    };
    /**
     * 调用，完成回调后，删除回调
     * function handlerFunction (){
     *     alert('mback happen');
     * }
     * invoke('IS_LOGIN',null,handlerFunction)
     *
     * @param method
     * @param [args]
     * @param [callback]
     *
     */
    function invoke(method, args, callback) {
        var id = getUuid();
        if (callback) {
            callbacks[id] = callback;
        }
        _invoke(id, method, args);
    }
    function syncInvoke(method, args) {
        var id = getUuid();
        var result = _syncInvoke(id, method, args);
        if (!!result) {
            result = JSON.parse(result);
            return result.response['data'];
        }
    }
    /**
     * 监听, 完成回调后，不删除回调，继续等待执行
     *
     * function handlerFunction (){
     *     alert('mback happen');
     * }
     * listen('ADD_M_BACK',null,handlerFunction)
     *
     * 同一个method没多次监听，只会执行最后一个监听者
     * @param method
     * @param args
     * @param callback
     */
    function listen(method, args, callback) {
        var cbs, id;
        //当前没有监听过,执行监听，在移除之前，仅仅执行一次
        if (!listeners.hasOwnProperty(method)) {
            id = getUuid();
            listeners[method] = {
                'id': id,
                'cbs': [callback]
            };
            _invoke(id, method, args);
        }
        else {
            listeners[method]['cbs'].push(callback);
        }
    }
    /**
     * 移除监听
     *
     * removeListen('ADD_M_BACK',handlerFunction);
     * @param method native移除的事件名称
     * @param cb 监听时的监听函数
     * @param rmvListenerMethod
     */
    function removeListen(method, cb, rmvListenerMethod) {
        if (!!listeners[method]) {
            var cbs = listeners[method]['cbs'], index = -1;
            cbs.forEach(function (icb, i) {
                if (icb === cb) {
                    index = i;
                }
            });
            //移除指定cb
            if (index !== -1) {
                cbs.splice(index, 1);
            }
            if (cbs.length === 0) {
                //移除本地 回调 和 native 监听
                delete listeners[method];
                //console.log('object');
                syncInvoke(rmvListenerMethod);
            }
        }
    }
    var Lib = {
        'isPrd': !!win.androidJs,
        'invoke': invoke,
        'syncInvoke': syncInvoke,
        'listen': listen,
        'removeListen': removeListen
    };
    return  Lib;
})())