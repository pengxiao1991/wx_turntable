// TypeScript file
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var CountDownTime = (function () {
    function CountDownTime() {
        this.SECOND = 1000;
        this.OFFSET = 5;
        this.timer = document.querySelector('.count_down');
        //期号已经获取到，开始游戏倒计时
        this.init();
    }
    CountDownTime.prototype.init = function () {
        GlobalEmitter.on(GlobalEvent.READY_CURRENTNO, function (res, rej, data) {
            console.log(data, 'data999');
            var offset = (data.currentNo.stakeTimeLimit - 0) - (data.currentNo.timeOffset - 0); //时间偏移值;
            if (offset < 1) {
                //即将开奖
                GlobalEmitter.emit(GlobalEvent.Will_LOTTERY);
                this.timer.innerHTML = '正在开奖';
                res(offset); //进入开奖状态
            }
            else {
                this.timer.innerHTML = offset + '"';
                this.secoundLoop(res, rej, offset, 'START');
            }
        }, this);
        GlobalEmitter.on(GlobalEvent.TURNTABLE_ANIMATION_END, function (res, rej) {
            console.log(12421421421412421, "开奖结束");
            this.secoundLoop(res, rej, 5, 'END');
        }, this);
        GlobalEmitter.on(GlobalEvent.SCREENOFF, this.clearSecondTimer, this); //息屏
        GlobalEmitter.on(GlobalEvent.NO_NET_WORK, this.clearSecondTimer, this); //无网络
    };
    //时间倒计时
    CountDownTime.prototype.secoundLoop = function (res, rej, offset, type) {
        var _this = this;
        var time = offset, _lastTime = Date.now(), _startTime = Date.now(), self = this;
        self._askTime = self.SECOND; //偏移量
        this._secoundLoopTimer = window.setInterval(function () {
            // console.log(11111,'开始新一期倒计时',type);
            var now = Date.now(), diff = now - _lastTime, diffSun = now - _startTime;
            if (diffSun + 50 >= offset * 1000) {
                //todo
                if (type == 'START') {
                    _this.timer.innerHTML = '正在开奖';
                    // GlobalEmitter.emit(GlobalEvent.COUNT_DOWN_END);
                }
                res(0); //进入大转盘动画
                self.clearSecondTimer();
            }
            else {
                if (diff >= self._askTime || diff + 5 >= self._askTime) {
                    _lastTime = now;
                    self._askTime = self.SECOND - (diff - self._askTime);
                    time -= 1;
                    if (time == 1) {
                        //即将开奖
                        GlobalEmitter.emit(GlobalEvent.Will_LOTTERY);
                    }
                    self.timer.innerHTML = "" + (type == 'START' ? '' : '下一轮 ') + time + "\"";
                }
            }
        }, 50);
    };
    CountDownTime.prototype.clearSecondTimer = function () {
        console.log('清除计时器');
        if (!!this._secoundLoopTimer) {
            window.clearInterval(this._secoundLoopTimer);
            // this._secoundLoopTimer = 0;
            delete this._secoundLoopTimer;
        }
    };
    return CountDownTime;
}());
__reflect(CountDownTime.prototype, "CountDownTime");
