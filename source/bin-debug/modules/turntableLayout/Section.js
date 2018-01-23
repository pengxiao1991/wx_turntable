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
var Section = (function (_super) {
    __extends(Section, _super);
    function Section() {
        var _this = _super.call(this) || this;
        _this.myTip = null;
        _this.myTipNum = 0;
        _this.tip = null;
        _this.tipNum = 0;
        _this.stakeId = 1;
        // 请求时的投注包装信息
        _this.betting = {
            amount: 0,
            timeId: 0
        };
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.uiCompHandler, _this);
        _this.skinName = "resource/customSkins/turntableLayout/section.exml";
        return _this;
    }
    Section.prototype.uiCompHandler = function () {
        var img = this.$children[0].$children[0];
        // 全部加载完成后
        if (this.stakeId == 7) {
            GlobalEmitter.emit(GlobalEvent.READY_TURANTABLE, this.parent.$children);
            Native.setStatusbarStyle({ 'isBlack': false });
            Native.stopLoading();
            document.body.style.visibility = 'visible';
        }
        // 去除初始化生产的一个section
        if (!!this.$stage) {
            this.tip.visible = false;
            this.myTip.visible = false;
            this.listenCLick();
            this.myMovingTipAnimationEnd();
            this.movingTipAnimationEnd();
            this.listenSelfBetted();
            // 注册回滚/清空投注事件
            GlobalEmitter.on(GlobalEvent.BACKSTAKE, this.backStake, this);
            // 初始化操作
            GlobalEmitter.on(GlobalEvent.NEW_GAME_OPENING, this.init, this);
        }
    };
    Section.prototype.init = function () {
        this.myTipNum = 0;
        this.tipNum = 0;
        this.myTip.$children[1].size = 30;
        this.myTip.$children[1].text = '0';
        this.tip.$children[1].text = '0';
        this.myTip.visible = false;
        this.tip.visible = false;
    };
    // 注册点击事件
    Section.prototype.listenCLick = function () {
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var _this = this;
            if (!Native.isLogin().isLogin) {
                Native.getToken(function (token) {
                    // if(!!token){
                    // 	ProcessManager.getWebsocketChannel();
                    // 	GlobalEmitter.emit(GlobalEvent.);
                    // }
                }, true);
                return;
            }
            new Promise(function (res, rej) {
                GlobalEmitter.emit(GlobalEvent.MY_BETTING, {
                    text: GameInfo.chooseAmount,
                    func: res
                });
            })
                .then(function (isOk) {
                if (isOk) {
                    GlobalEmitter.emit(GlobalEvent.SENDMYMOVINGTIP, _this.localToGlobal(98, 0), _this.stakeId);
                    if (!!_this.betting.amount) {
                        _this.betting.amount += Number(GameInfo.chooseAmount);
                    }
                    else {
                        _this.betting.amount = GameInfo.chooseAmount;
                    }
                    // this.betting.stakeId = this.stakeId;
                    // 函数节流
                    if (!_this.betting.timeId) {
                        _this.betting.timeId = setTimeout(function () {
                            clearTimeout(_this.betting.timeId);
                            _this.betting.timeId = 0;
                            // this.$emit(GlobalEvent.BETTING_START,this.betting);
                            var sum = _this.betting.amount;
                            // FetchService.myBetting(this.stakeId,this.betting.amount,(isSuccess) => {
                            //     if (!!isSuccess) {
                            //         // 用户已经投注
                            //         GlobalEmitter.emit(GlobalEvent.SELF_BETTED);
                            //     } else {
                            //         this.backStake(sum,this.stakeId);
                            //     }
                            // });
                            WebsocketService.myBetting(_this.stakeId, _this.betting.amount, function (isSuccess) {
                                if (!!isSuccess) {
                                    // 用户已经投注
                                    GlobalEmitter.emit(GlobalEvent.SELF_BETTED);
                                }
                                else {
                                    _this.backStake(sum, _this.stakeId);
                                }
                            });
                            _this.betting.amount = 0;
                        }, 1000);
                    }
                }
                else {
                    console.log('金豆不足');
                }
            });
        }, this);
    };
    // 注册用户投注动画结束事件
    Section.prototype.myMovingTipAnimationEnd = function () {
        GlobalEmitter.on(GlobalEvent.MYMOVINGTIPANIMATIONEND, function (text, stakeId) {
            if (this.stakeId == stakeId) {
                this.setMyTipNum(text);
                if (!this.myTip.visible) {
                    this.myTip.visible = true;
                }
                this.setTipNum(text);
                if (!this.tip.visible) {
                    this.tip.visible = true;
                }
            }
        }, this);
    };
    // 增加用户投注的数量
    Section.prototype.setMyTipNum = function (text) {
        this.myTipNum = Number(this.myTipNum) + Number(text);
        if (this.myTipNum > 9980) {
            this.myTip.$children[1].size = 24;
        }
        else {
            this.myTip.$children[1].size = 30;
        }
        this.myTip.$children[1].text = this.myTipNum.toString();
    };
    // 增加所有人投注的数量
    Section.prototype.setTipNum = function (text) {
        this.tipNum = Number(this.tipNum) + Number(text);
        if (this.tipNum > 9999) {
            this.tip.$children[1].text = parseInt(this.tipNum / 10000 + '') + '万+';
        }
        else {
            this.tip.$children[1].text = this.tipNum.toString();
        }
    };
    // 注册其他人投注动画结束事件
    Section.prototype.movingTipAnimationEnd = function () {
        GlobalEmitter.on(GlobalEvent.MOVINGTIPANIMATIONEND, function (text, stakeId) {
            if (this.stakeId == stakeId) {
                this.setTipNum(text);
                if (!this.tip.visible) {
                    this.tip.visible = true;
                }
            }
        }, this);
    };
    // 回滚当前投注
    Section.prototype.backStake = function (num, stakeId) {
        // 回滚某一个注点
        if (!!stakeId && this.stakeId == stakeId) {
            // 处理其他人投注部分
            this.setTipNum(-num);
            if (this.tipNum <= 0) {
                this.tipNum = 0;
                this.tip.visible = false;
            }
            // (this.tip.$children[1] as eui.Label).text = this.tipNum.toString();
            // 处理用户自己投注部分
            this.setMyTipNum(-num);
            if (this.myTipNum <= 0) {
                this.myTipNum = 0;
                this.myTip.visible = false;
            }
            // (this.myTip.$children[1] as eui.Label).text = this.myTipNum.toString();
            // 回滚对应的投注金额
            GlobalEmitter.emit(GlobalEvent.BACKSTAKEAMOUNT, num);
        }
        // 清空所有section的用户投注，用于清空按钮
        if (!num) {
            // 回滚对应的投注金额
            GlobalEmitter.emit(GlobalEvent.BACKSTAKEAMOUNT, this.myTipNum);
            // 处理其他人投注部分
            this.setTipNum(-this.myTipNum);
            if (this.tipNum <= 0) {
                this.tipNum = 0;
                this.tip.visible = false;
            }
            // (this.tip.$children[1] as eui.Label).text = this.tipNum.toString();
            // 处理用户自己投注部分
            this.myTipNum = 0;
            this.myTip.visible = false;
            // (this.myTip.$children[1] as eui.Label).text = this.myTipNum.toString();
        }
        // var myTip = this.node.getChildByName('myTip');
        // var tip = this.node.getChildByName('tip');                
        // var myTipText = myTip.getChildByName('tipText');
        // var tipText = tip.getChildByName('tipText');                    
        // //tipText.getComponent(cc.Label).string -= num;
        // this.setTBet(this.getTBet() -num);
        // myTipText.getComponent(cc.Label).string -= num;
        // // 如果总投注信息被清空
        // if(this.getTBet()<=0){
        //     this.initTBet();
        // 	tip.active = false;
        // }
        // // 如果回滚的是唯一一个投注点
        // if (length == 0) {
        //     // 清空按钮还原
        //     this.choose.getComponent('choose').isHighLight = false;
        //     this.choose.getChildByName('empty').getChildByName('textLabel').opacity = 102;
        // }
        // /*// 如果总投注信息被清空
        // if (tipText.getComponent(cc.Label).string <= 0) {
        //     tipText.getComponent(cc.Label).string = '';
        //     tip.active = false;       
        // }*/
        // // 如果我的投注信息被清空
        // if (myTipText.getComponent(cc.Label).string <= 0) {
        //     myTipText.getComponent(cc.Label).string = '';
        //     myTip.active = false;
        // }
    };
    // 监控用户自己已经投注过
    Section.prototype.listenSelfBetted = function () {
        GlobalEmitter.on(GlobalEvent.INIT_USER_STAKE, function (data) {
            if (data[this.stakeId]) {
                this.setTipNum(data[this.stakeId]);
                this.setMyTipNum(data[this.stakeId]);
                this.myTip.$children[1].text = this.myTipNum;
                this.tip.$children[1].text = this.tipNum;
                if (!this.tip.visible) {
                    this.tip.visible = true;
                }
                if (!this.myTip.visible) {
                    this.myTip.visible = true;
                }
            }
        }, this);
    };
    return Section;
}(eui.Component));
__reflect(Section.prototype, "Section");
