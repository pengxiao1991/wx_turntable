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
var HistoryLayout = (function (_super) {
    __extends(HistoryLayout, _super);
    function HistoryLayout() {
        var _this = _super.call(this) || this;
        _this.factorComponent = null;
        _this.groupWidth = 0;
        _this.groupHeight = 0;
        _this.updateCount = 0;
        _this.firstCurrentNo = 0;
        _this.factorComponent = new eui.Component();
        _this.factorComponent.addEventListener(eui.UIEvent.COMPLETE, _this.uiCompHandler, _this);
        _this.factorComponent.skinName = "resource/customSkins/historyLayout/historyLayout.exml";
        _this.addChild(new eui.Image(RES.getRes('historyLayoutBG_webp')));
        _this.addChild(_this.factorComponent);
        return _this;
    }
    HistoryLayout.prototype.uiCompHandler = function () {
        this.groupWidth = this.factorComponent.$children[0].width;
        this.groupHeight = this.factorComponent.$children[0].height;
        GlobalEmitter.on(GlobalEvent.READY_CURRENTNO, function () {
            var _this = this;
            WebsocketService.getRouletteHistory(function (data) {
                _this.firstCurrentNo = data.value[0].no;
                var currentNo = WebsocketService.getCurrentNo(), __index = 0;
                console.log(currentNo, data, '当前期号', '历史记录');
                data.value.forEach(function (item, index) {
                    if (currentNo === _this.firstCurrentNo) {
                        if (index === 0) {
                            return;
                        }
                        else {
                            __index = index - 1;
                            _this.init(_this.factorComponent.$children[index - 1]);
                        }
                    }
                    else {
                        if (index === 15) {
                            return;
                        }
                        else {
                            __index = index;
                            _this.init(_this.factorComponent.$children[index]);
                        }
                    }
                    switch (item.hits[0]) {
                        case 7:
                            _this.factorComponent.$children[__index].$children[1].alpha = 1;
                            break;
                        case 6:
                            _this.factorComponent.$children[__index].$children[0].text = '25';
                            break;
                        case 1:
                            _this.factorComponent.$children[__index].$children[0].text = '2';
                            break;
                        case 2:
                            _this.factorComponent.$children[__index].$children[0].text = '4';
                            break;
                        case 3:
                            _this.factorComponent.$children[__index].$children[0].text = '6';
                            break;
                        case 4:
                            _this.factorComponent.$children[__index].$children[0].text = '8';
                            break;
                        case 5:
                            _this.factorComponent.$children[__index].$children[0].text = '12';
                            break;
                        default:
                            break;
                    }
                });
            });
        }, this);
        GlobalEmitter.on(GlobalEvent.UPDATEHISTORY, function (id, currentNo) {
            this.updateHistory(id);
        }, this);
    };
    HistoryLayout.prototype.init = function (item) {
        item.$children[0].text = '';
        item.$children[1].alpha = 0;
        item.$children[2].alpha = 0;
    };
    HistoryLayout.prototype.updateHistory = function (id) {
        this.updateCount++;
        var tw = egret.Tween.get(this.factorComponent);
        tw.to({ x: this.factorComponent.x + this.groupWidth }, 200)
            .call(function () {
            var temp = this.factorComponent.$children[14];
            this.factorComponent.$children.splice(0, 0, temp);
            // 初始化对应的历史记录
            this.init(temp);
            switch (id) {
                case 7:
                    temp.$children[1].alpha = 1;
                    break;
                case 6:
                    temp.$children[0].text = '25';
                    break;
                case 1:
                    temp.$children[0].text = '2';
                    break;
                case 2:
                    temp.$children[0].text = '4';
                    break;
                case 3:
                    temp.$children[0].text = '6';
                    break;
                case 4:
                    temp.$children[0].text = '8';
                    break;
                case 5:
                    temp.$children[0].text = '12';
                    break;
                default:
                    break;
            }
            temp.x = -this.groupWidth * this.updateCount;
            temp.y = -this.groupHeight;
            var tempTW = egret.Tween.get(temp);
            tempTW.to({ y: 0 }, 200).call(function () {
                // 隐藏第一个记录的new标记
                this.factorComponent.$children[1].$children[3].alpha = 0;
                // 显示new标记
                temp.$children[3].alpha = 1;
            }, this);
        }, this);
    };
    return HistoryLayout;
}(eui.Component));
__reflect(HistoryLayout.prototype, "HistoryLayout");
