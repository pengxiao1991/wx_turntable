var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Header = (function () {
    function Header() {
        document.querySelector('.fm-header-lift').addEventListener('click', function () {
            console.log(Native);
            egret.ticker.pause();
            setTimeout(function () {
                Native.finishPage();
            }, 50);
        });
    }
    return Header;
}());
__reflect(Header.prototype, "Header");
