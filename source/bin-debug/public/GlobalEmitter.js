var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GlobalEmitter = (function () {
    function GlobalEmitter() {
    }
    /**
     * 注册事件
     * @param name 事件名称
     * @param callback 回调函数
     * @param target 上下文
     * @param justOnce 是否执行一次，默认false
     */
    GlobalEmitter.on = function (name, callback, target, justOnce) {
        if (justOnce === void 0) { justOnce = false; }
        if (!GlobalEmitter.listeners[name]) {
            GlobalEmitter.listeners[name] = [];
        }
        GlobalEmitter.listeners[name].push({ 'name': name, 'callback': callback, 'target': target, 'justOnce': justOnce });
    };
    /**
     * 注册事件(只执行一次)
     * @param name 事件名称
     * @param callback 回调函数
     * @param target 上下文
     */
    GlobalEmitter.once = function (name, callback, target) {
        GlobalEmitter.on(name, callback, target, true);
    };
    /**
     * 移除事件 (1、如果传递了callback，则只删除事件对应的callBack函数，并不删除监听器，但是事件没有回调函数了，也将删除事件本身)
     *         (2、若不传递，则删除所有)
     * @param name 事件名称
     * @param callback 回调函数(只能传具名函数)
     */
    GlobalEmitter.remove = function (name, callback) {
        var events = GlobalEmitter.listeners[name];
        if (!events) {
            // throw(name+'事件没有注册，无法调用remove方法');
            return;
        }
        if (callback) {
            var length_1 = events.length;
            for (var i = 0; i < length_1; i++) {
                var event_1 = events[i];
                if (callback == event_1['callback']) {
                    events.splice(i, 1);
                    break;
                }
            }
            //事件里面没有一个回调函数了，存在也没有意义了
            if (events.length == 0) {
                delete GlobalEmitter.listeners[name];
            }
        }
        else {
            delete GlobalEmitter.listeners[name];
        }
    };
    /**
     * 发送事件
     * @param name 事件名称
     */
    GlobalEmitter.emit = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var events = GlobalEmitter.listeners[name];
        if (!events) {
            console.error(name + '事件没有注册，无法调用emit方法');
            return;
        }
        events.forEach(function (event) {
            if (event['callback']) {
                (_a = event['callback']).call.apply(_a, [event['target']].concat(args));
                if (event['justOnce']) {
                    GlobalEmitter.remove(event['name'], event['callback']);
                }
            }
            var _a;
        });
    };
    /** 监听器 */
    GlobalEmitter.listeners = {};
    return GlobalEmitter;
}());
__reflect(GlobalEmitter.prototype, "GlobalEmitter");
