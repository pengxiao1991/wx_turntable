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
var MyMovingTip = (function (_super) {
    __extends(MyMovingTip, _super);
    function MyMovingTip() {
        var _this = _super.call(this) || this;
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.uiCompHandler, _this);
        _this.skinName = "resource/customSkins/chooseLayout/myMovingTip.exml";
        _this.enabled = false;
        return _this;
    }
    MyMovingTip.prototype.uiCompHandler = function () {
    };
    MyMovingTip.prototype.init = function (point, text) {
        this.x = point.x;
        this.y = point.y;
        this.$children[1].text = text;
    };
    return MyMovingTip;
}(eui.Component));
__reflect(MyMovingTip.prototype, "MyMovingTip");
