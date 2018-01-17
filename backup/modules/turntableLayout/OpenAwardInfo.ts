// TypeScript file
class OpenAwardInfo extends eui.Component {
    private win_coin:eui.Label;
    private win_light:eui.Image;
    private no_win_label:eui.Label;
    private no_bet_label1:eui.Label;
    private no_bet_label2:eui.Label;
    private opening: boolean = false;
    constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.uiCompHandler, this);
        this.skinName = "resource/customSkins/turntableLayout/openAwardInfo.exml";
    }

    private uiCompHandler () {
        //开始开奖
        GlobalEmitter.on(GlobalEvent.START_OPEN_AWARD,this.openAward, this);
        //新一轮游戏开始
        GlobalEmitter.on(GlobalEvent.READY_CURRENTNO,this.initGameInfo,this)
        GlobalEmitter.on(GlobalEvent.GAME_READY_TO_ANNOUNCE,function(res,rej,data){
            if(data < 1) {
                this.opening = true;
            } else {
                this.opening = false;
            }
        },this)
    }
    //计算中奖结果
    private openAward (isBet,openInfo) {
        console.log(isBet,openInfo,'中奖信息');
        if(openInfo.userWinInfo && openInfo.userWinInfo.totalAmount && openInfo.userWinInfo.totalAmount > 0) {
            isBet = true;
        } else {
            isBet = false;
        }
        if(!!isBet) {
            if(openInfo.userWinInfo && openInfo.userWinInfo.payoff && openInfo.userWinInfo.payoff > 0) {
                this.currentState = 'win';
                this.win_coin.text = `赢得${openInfo.userWinInfo.payoff}金豆`;
                this.openLightAnim();
                //用户中奖了
                if(!this.opening) {
                    GlobalEmitter.emit(GlobalEvent.USER_WIN,openInfo.userWinInfo.payoff);
                }
            } else {
                this.currentState = 'noWin';
                this.no_win_label.text = `今日累计有 ${openInfo.result.totalAmount} 人赢得金豆`;
            }
        } else {
            this.currentState = 'noBet';
            this.no_bet_label1.text = `今日累计${openInfo.result.totalAmount}人赢得金豆`;
        }
    }

    //开启灯光动画
    private openLightAnim () {
        egret.Tween.get(this.win_light, { loop: true })
			.set({ source: RES.getRes('win_light1_webp') })
			.wait(200)
			.set({ source: RES.getRes('win_light2_webp') })
			.wait(200);
    }

    //开始游戏初始化信息
    private initGameInfo () {
        this.opening = false;
        egret.Tween.removeTweens(this.win_light);
    }
}