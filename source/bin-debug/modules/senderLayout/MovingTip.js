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
var MovingTip = (function (_super) {
    __extends(MovingTip, _super);
    function MovingTip() {
        var _this = _super.call(this) || this;
        _this.factorText = 0;
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.uiCompHandler, _this);
        _this.skinName = "resource/customSkins/senderLayout/movingTip.exml";
        return _this;
    }
    MovingTip.prototype.uiCompHandler = function () {
    };
    MovingTip.prototype.init = function (text, factorText) {
        this.x = 0;
        this.y = 0;
        this.visible = true;
        this.$children[1].text = text.toString();
        this.factorText = factorText;
    };
    return MovingTip;
}(eui.Component));
__reflect(MovingTip.prototype, "MovingTip");
