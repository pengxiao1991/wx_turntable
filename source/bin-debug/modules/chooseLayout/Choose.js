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
/**
 *
 */
var Choose = (function (_super) {
    __extends(Choose, _super);
    function Choose() {
        var _this = _super.call(this) || this;
        // 清空按钮
        _this.emptyButton = null;
        // 投注按钮数组
        _this.chooseButtonArr = null;
        // 发射点相关信息
        _this.myMovingTipStart = {
            point: null,
            text: null
        };
        _this.myMovingTipPool = null;
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.uiCompHandler, _this);
        _this.skinName = "resource/customSkins/chooseLayout/choose.exml";
        return _this;
    }
    Choose.prototype.uiCompHandler = function () {
        var _this = this;
        this.emptyButton = this.$children[0];
        this.chooseButtonArr = this.$children.slice(1);
        this.emptyButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (GameInfo.ableStake) {
                this.backAllStake();
            }
        }, this);
        this.chooseButtonArr.forEach(function (item, index) {
            item.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                this.chooseButtonClickCallBack(item, index);
                GlobalEmitter.emit(GlobalEvent.CHOOSEBUTTONCLICK, item.name);
            }, _this);
        });
        var index = localStorage.getItem('turntableChooseButtonIndex');
        if (!!index) {
            this.chooseButtonArr[index].dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
        }
        else {
            this.chooseButtonArr[0].dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
        }
        // 
        GlobalEmitter.on(GlobalEvent.SENDMYMOVINGTIP, function (globalPoint, stakeId) {
            _this.sendMyMovingTip(globalPoint, stakeId);
        }, this);
        // 准备开奖时清空对象池，还原清空按钮
        GlobalEmitter.on(GlobalEvent.GAME_READY_TO_ANNOUNCE, function () {
            this.backEmptyButtonStyle();
            this.destoryMyMovingTipPool();
        }, this);
        // 创建对象池
        this.createMyMovingTipPool();
    };
    // 清除用户所有投注，并还原清空按钮样式
    Choose.prototype.backAllStake = function () {
        var _this = this;
        WebsocketService.emptyMyBetting(function (data) {
            console.log('清空接口正常', data);
            _this.backEmptyButtonStyle();
            GlobalEmitter.emit(GlobalEvent.BACKSTAKE);
        });
    };
    ;
    // 还原清空按钮样式
    Choose.prototype.backEmptyButtonStyle = function () {
        this.emptyButton.$children[1].alpha = 0.4;
    };
    ;
    // chooseButton点击回调
    Choose.prototype.chooseButtonClickCallBack = function (item, index) {
        this.chooseButtonArr.forEach(function (param) {
            if (param.scaleX === 1.25) {
                param.scaleX = 1;
                param.scaleY = 1;
            }
        });
        item.scaleX = 1.25;
        item.scaleY = 1.25;
        this.myMovingTipStart.point = { x: item.x, y: item.y };
        this.myMovingTipStart.text = item.name;
        localStorage.setItem('turntableChooseButtonIndex', index.toString());
    };
    // 创建myMovingTip对象池
    Choose.prototype.createMyMovingTipPool = function () {
        if (!this.myMovingTipPool) {
            this.myMovingTipPool = new NodePool(MyMovingTip, 10);
        }
    };
    // 发射自己的投注
    Choose.prototype.sendMyMovingTip = function (globalPoint, stakeId) {
        var myMovingTip = this.myMovingTipPool.get();
        this.addChild(myMovingTip);
        myMovingTip.init(this.myMovingTipStart.point, this.myMovingTipStart.text);
        var tw = egret.Tween.get(myMovingTip);
        var point = this.globalToLocal(globalPoint.x, globalPoint.y);
        tw.to({ x: point.x, y: point.y }, 200).call(function () {
            this.myMovingTipPool.free(myMovingTip);
            this.removeChild(myMovingTip);
            GlobalEmitter.emit(GlobalEvent.MYMOVINGTIPANIMATIONEND, this.myMovingTipStart.text, stakeId);
            // 高亮清空按钮
            if (this.emptyButton.$children[1].alpha == 0.4) {
                this.emptyButton.$children[1].alpha = 1;
            }
        }, this);
    };
    // 对象池释放
    Choose.prototype.destoryMyMovingTipPool = function () {
        this.myMovingTipPool.restore();
        // if (this.myMovingTipPool.length > 0) {
        //     this.myMovingTipPool.destory((params) => {
        //         params.free.forEach((item) => {
        //             if(item.parent){
        //                 this.removeChild(item);
        //             }
        //         });
        //         params.busy.forEach((item) => {
        //             if(item.parent){
        //                 this.removeChild(item);
        //             }
        //         });
        //     });
        //     this.myMovingTipPool = null;
        // }
    };
    return Choose;
}(eui.Component));
__reflect(Choose.prototype, "Choose");
