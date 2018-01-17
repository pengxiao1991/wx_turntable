// TypeScript file
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
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
