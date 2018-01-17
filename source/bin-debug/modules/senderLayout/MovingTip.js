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
