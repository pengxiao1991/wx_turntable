// TypeScript file
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 *
 */
var Home = (function (_super) {
    __extends(Home, _super);
    function Home() {
        var _this = _super.call(this) || this;
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.uiCompHandler, _this);
        _this.skinName = "resource/customSkins/homeLayout/home.exml";
        return _this;
    }
    Home.prototype.uiCompHandler = function () {
        // 注册游戏开始事件，请求场次信息
        GlobalEmitter.on(GlobalEvent.NEW_GAME_OPENING, function (res) {
            if (Native.isLogin() && Native.getTokenFromCache()) {
                console.log(2222, 1111);
                WebsocketService.getRouletteInitInfo(function (data) {
                    console.log(data.value, 1111, res);
                    res(data.value);
                });
            }
            else {
                WebsocketService.getCurrentGameInfo(function (data) {
                    console.log(data.value, 2222);
                    res(data.value);
                });
            }
        }, this);
    };
    return Home;
}(eui.Component));
__reflect(Home.prototype, "Home");
