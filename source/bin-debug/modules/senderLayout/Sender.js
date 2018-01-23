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
var Sender = (function (_super) {
    __extends(Sender, _super);
    function Sender() {
        var _this = _super.call(this) || this;
        _this.will_lottery = false;
        _this.sectionArr = [];
        _this.movingTipPool = null;
        _this.timeId = 0;
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.uiCompHandler, _this);
        _this.skinName = "resource/customSkins/senderLayout/sender.exml";
        return _this;
    }
    Sender.prototype.uiCompHandler = function () {
        var _this = this;
        // 初始化信息
        GlobalEmitter.on(GlobalEvent.READY_TURANTABLE, function (sectionArr) {
            this.sectionArr = sectionArr;
            this.createMovingTip();
        }, this);
        // 开始轮询用户投注信息
        GlobalEmitter.on(GlobalEvent.READY_CURRENTNO, function (res, rej, data) {
            var _this = this;
            // 每次新游戏，还原对象池
            if (!!this.movingTipPool) {
                this.movingTipPool.restore();
            }
            this.timeId = window.setInterval(function () {
                console.log('请求其他用户下注记录');
                if (!!_this.will_lottery) {
                    window.clearInterval(_this.timeId);
                    return;
                }
                WebsocketService.getCurrentStakeInfo(function (params) {
                    if (params.value.no == data.currentNo.no) {
                        _this.$children[1].text = params.value.count;
                        for (var _i = 0, _a = Object.keys(params.value); _i < _a.length; _i++) {
                            var key = _a[_i];
                            if (key != 'no' && key != 'count' && params.value[key] > _this.sectionArr[Number(key) - 1].tipNum) {
                                _this.initMovingTip(_this.sectionArr[Number(key) - 1], params.value[key] - _this.sectionArr[Number(key) - 1].tipNum);
                            }
                            else {
                                // to do 异常逻辑
                            }
                        }
                    }
                    else {
                        console.log(params.value.no, data.currentNo.no, 'haha');
                        console.log('期号不对');
                    }
                });
            }, 5000);
        }, this);
        // 停止查询用户投注信息
        GlobalEmitter.on(GlobalEvent.Will_LOTTERY, function () {
            console.log(23141242);
            this.will_lottery = true;
            window.clearInterval(this.timeId);
        }, this);
        GlobalEmitter.on(GlobalEvent.NEW_GAME_OPENING, function () {
            this.will_lottery = false;
        }, this);
        GlobalEmitter.on(GlobalEvent.SCREENOFF, function () {
            window.clearInterval(_this.timeId);
        }, this); //息屏
    };
    // 创建movingTip的对象池
    Sender.prototype.createMovingTip = function () {
        this.movingTipPool = new NodePool(MovingTip, 30);
    };
    // 获取每注需要发送的movingTip个数
    Sender.prototype.getMovingTipNum = function (num) {
        var temp = [20, 50, 100, 500, 1000];
        for (var index = 0; index < temp.length; index++) {
            var element = temp[index];
            if (num / element <= 8) {
                return {
                    num: Math.floor(num / element),
                    step: element
                };
            }
        }
        return {
            num: Math.floor(num / temp[temp.length - 1]),
            step: temp[temp.length - 1]
        };
    };
    // 针对每一个注点初始化
    Sender.prototype.initMovingTip = function (section, sum) {
        var obj = this.getMovingTipNum(sum);
        var movingTipArr = [];
        while (!!obj.num) {
            obj.num--;
            sum -= obj.step;
            var temp = this.movingTipPool.get();
            temp.init(obj.step, obj.step);
            this.addChild(temp);
            movingTipArr.push(temp);
        }
        if (sum > 0) {
            var temp = this.movingTipPool.get();
            temp.init(sum, sum);
            this.addChild(temp);
            movingTipArr.push(temp);
        }
        this.sendMovingTip(section, movingTipArr);
    };
    // 对某一个注点发射
    Sender.prototype.sendMovingTip = function (section, movingTipArr) {
        var _this = this;
        movingTipArr.forEach(function (item, index) {
            setTimeout(function () {
                var tw = egret.Tween.get(item), globalPoint = section.localToGlobal(0, 0), point = _this.globalToLocal(globalPoint.x, globalPoint.y);
                // 如果是最后一次的投注
                if (index == movingTipArr.length - 1) {
                    tw.to({ x: point.x, y: point.y }, 200)
                        .call(function (params) {
                        item.visible = false;
                        GlobalEmitter.emit(GlobalEvent.MOVINGTIPANIMATIONEND, item.factorText, section.stakeId);
                        movingTipArr.forEach(function (item) {
                            this.movingTipPool.free(item);
                        }, _this);
                    });
                }
                else {
                    tw.to({ x: point.x, y: point.y }, 200)
                        .call(function (params) {
                        item.visible = false;
                        GlobalEmitter.emit(GlobalEvent.MOVINGTIPANIMATIONEND, item.factorText, section.stakeId);
                    });
                }
            }, 100 * index);
        });
    };
    return Sender;
}(eui.Component));
__reflect(Sender.prototype, "Sender");
