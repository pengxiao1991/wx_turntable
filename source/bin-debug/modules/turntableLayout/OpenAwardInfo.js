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
// TypeScript file
var OpenAwardInfo = (function (_super) {
    __extends(OpenAwardInfo, _super);
    function OpenAwardInfo() {
        var _this = _super.call(this) || this;
        _this.opening = false;
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.uiCompHandler, _this);
        _this.skinName = "resource/customSkins/turntableLayout/openAwardInfo.exml";
        return _this;
    }
    OpenAwardInfo.prototype.uiCompHandler = function () {
        //开始开奖
        GlobalEmitter.on(GlobalEvent.START_OPEN_AWARD, this.openAward, this);
        //新一轮游戏开始
        GlobalEmitter.on(GlobalEvent.READY_CURRENTNO, this.initGameInfo, this);
        GlobalEmitter.on(GlobalEvent.GAME_READY_TO_ANNOUNCE, function (res, rej, data) {
            if (data < 1) {
                this.opening = true;
            }
            else {
                this.opening = false;
            }
        }, this);
    };
    //计算中奖结果
    OpenAwardInfo.prototype.openAward = function (isBet, openInfo) {
        console.log(isBet, openInfo, '中奖信息');
        if (openInfo.userWinInfo && openInfo.userWinInfo.totalAmount && openInfo.userWinInfo.totalAmount > 0) {
            isBet = true;
        }
        else {
            isBet = false;
        }
        if (!!isBet) {
            if (openInfo.userWinInfo && openInfo.userWinInfo.payoff && openInfo.userWinInfo.payoff > 0) {
                this.currentState = 'win';
                this.win_coin.text = "\u8D62\u5F97" + openInfo.userWinInfo.payoff + "\u91D1\u8C46";
                this.openLightAnim();
                //用户中奖了
                if (!this.opening) {
                    GlobalEmitter.emit(GlobalEvent.USER_WIN, openInfo.userWinInfo.payoff);
                }
            }
            else {
                this.currentState = 'noWin';
                this.no_win_label.text = "\u4ECA\u65E5\u7D2F\u8BA1\u6709 " + openInfo.result.totalAmount + " \u4EBA\u8D62\u5F97\u91D1\u8C46";
            }
        }
        else {
            this.currentState = 'noBet';
            this.no_bet_label1.text = "\u4ECA\u65E5\u7D2F\u8BA1" + openInfo.result.totalAmount + "\u4EBA\u8D62\u5F97\u91D1\u8C46";
        }
    };
    //开启灯光动画
    OpenAwardInfo.prototype.openLightAnim = function () {
        egret.Tween.get(this.win_light, { loop: true })
            .set({ source: RES.getRes('win_light1_webp') })
            .wait(200)
            .set({ source: RES.getRes('win_light2_webp') })
            .wait(200);
    };
    //开始游戏初始化信息
    OpenAwardInfo.prototype.initGameInfo = function () {
        this.opening = false;
        egret.Tween.removeTweens(this.win_light);
    };
    return OpenAwardInfo;
}(eui.Component));
__reflect(OpenAwardInfo.prototype, "OpenAwardInfo");
