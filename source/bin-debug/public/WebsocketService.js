var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var CURRENT_NO = -1, ServerDomain = 'https://venice.uwaterpark.com', OVER_STAKE_TIME = '120201', //超过下注时间
NEW_ISSUE_UN_OPEN = '120202', //开奖任务尚未结束
MULTI_ACCOUNT_ERR = '120203', //多设备登录
RISK_ERROR = '120204', //击穿奖池
MULTI_ACCOUNT_ERR_WORDING = "检测到你的账号在其他设备上登录，请退出稍后重试", __interrupted = false, RequestTimeOut = 5000, //请求超时时间
MaxRetry = 3, //最大重试次数
newIssueUnOpenTime = 0;
var WebsocketService = (function () {
    function WebsocketService() {
        this.newIssueUnOpenTime = 0;
    }
    //新场次 初始化信息
    WebsocketService.getRouletteInitInfo = function (callback) {
        var tKey = '__getInitData_timeout', self = this;
        ServersEngine.sendMessage("/req/game/roulette/init", '', function (data) {
            console.log(data, 885588);
            self[tKey] = 0;
            //console.log('initData back',this.isInterrupted());
            //开奖任务尚未结束,连续30次都是这样，判定出问题了
            if (data.code == NEW_ISSUE_UN_OPEN) {
                newIssueUnOpenTime = !!newIssueUnOpenTime ? newIssueUnOpenTime + 1 : 1;
                if (!!newIssueUnOpenTime && newIssueUnOpenTime > 30) {
                    // 场次信息异常，关闭当前页面
                    Native.showNativeDialog({
                        title: '游戏场次异常，请退出稍后重试',
                        positiveText: '退出',
                        negativeText: ''
                    }, function () { egret.ticker.pause(); setTimeout(function () { Native.finishPage(); }, 50); });
                }
                else {
                    //重试机制
                    self.getRouletteInitInfo(callback);
                }
            }
            else {
                var oldNo = CURRENT_NO;
                var value = data.value;
                var no = value['currentNo']['no'];
                newIssueUnOpenTime = 0;
                CURRENT_NO = no;
                console.log(data, 'startGame');
                callback(data);
            }
        });
    };
    //查询当前的场次信息
    WebsocketService.getCurrentGameInfo = function (callback) {
        var tKey = '__getCurrentNo_timeout', self = this;
        ServersEngine.sendMessage("/req/game/roulette/unauth_init", '', function (data) {
            self[tKey] = 0;
            var oldNo = CURRENT_NO;
            var value = data.value;
            //开奖任务尚未结束,连续30次都是这样，判定出问题了
            if (data.code == NEW_ISSUE_UN_OPEN) {
                newIssueUnOpenTime = !!newIssueUnOpenTime ? newIssueUnOpenTime + 1 : 1;
                if (!!newIssueUnOpenTime && newIssueUnOpenTime > 30) {
                    // 场次信息异常，关闭当前页面
                    Native.showNativeDialog({
                        title: '游戏场次异常，请退出稍后重试',
                        positiveText: '退出',
                        negativeText: ''
                    }, function () { egret.ticker.pause(); setTimeout(function () { Native.finishPage(); }, 50); });
                }
                else {
                    //重试机制
                    self.getCurrentGameInfo(callback);
                }
            }
            else {
                newIssueUnOpenTime = 0;
                CURRENT_NO = value['currentNo']['no'];
                callback(data);
            }
        });
    };
    //清注
    WebsocketService.emptyMyBetting = function (callback) {
        ServersEngine.sendMessage("/req/game/roulette/clear_stake", JSON.stringify({ channel: '003' }), function (response) {
            console.log('清注');
            if (response.code == 200) {
                callback(response);
            }
            else if (response.code == MULTI_ACCOUNT_ERR) {
                Native.showNativeDialog({
                    title: MULTI_ACCOUNT_ERR_WORDING,
                    positiveText: '退出',
                    negativeText: ''
                }, function () { egret.ticker.pause(); setTimeout(function () { Native.finishPage(); }, 50); });
            }
        });
    };
    /**
     * 下注、返回下注的场次编号
     * @param stakeId 注点Id
     * @param amout 投注金额
     * @param callback 回调函数
     */
    WebsocketService.myBetting = function (stakeId, amout, callback) {
        console.log('下注了', amout);
        ServersEngine.sendMessage("/req/game/roulette/stake", JSON.stringify({ stakeId: stakeId, amount: amout, channel: '003' }), function (response) {
            console.log(response, 'myBeting');
            if (response.code == 200) {
                callback(response);
            }
            else {
                callback(false);
                if (response.code == MULTI_ACCOUNT_ERR) {
                    Native.showNativeDialog({
                        title: MULTI_ACCOUNT_ERR_WORDING,
                        positiveText: '退出',
                        negativeText: '',
                        cancelable: false
                    }, function () { egret.ticker.pause(); setTimeout(function () { Native.finishPage(); }, 50); });
                }
                else {
                    //todo 回滚处理
                    console.log(response.code, RISK_ERROR, 'RISK_ERROR,RISK_ERROR');
                    if (response.code == RISK_ERROR) {
                        Native.showNativeToast({ message: '系统繁忙，投注失败', duration: 1 });
                    }
                    if (response.code == OVER_STAKE_TIME) {
                        Native.showNativeToast({ message: '超过下注时限，投注失败', duration: 1 });
                    }
                }
            }
        });
    };
    /**
     * 查询用户自己的下注情况
     */
    WebsocketService.getMyStakeInfo = function (callback) {
        var tKey = '__getSelfBettingInfo_timeout', self = this;
        ServersEngine.sendMessage("/req/game/roulette/stake_info", JSON.stringify({ no: CURRENT_NO }), function (response) {
            self[tKey] = 0;
            callback(response);
        });
    };
    /**
     * 查询用户中奖情况
     */
    WebsocketService.getUserStakeResult = function (callback) {
        var tKey = '__getUserStakeResult_timeout', self = this;
        ServersEngine.sendMessage("/req//game/roulette/user_stake_result", JSON.stringify({ no: CURRENT_NO }), function (response) {
            callback(response);
        });
    };
    /**
     * 查询历史轮盘结果
     */
    WebsocketService.getRouletteHistory = function (callback) {
        var tKey = '__getHistory_timeout', self = this;
        ServersEngine.sendMessage("/req/game/roulette/dice_history", JSON.stringify({
            offset: 0,
            size: 16 //返回结果的数量
        }), function (response) {
            self[tKey] = 0;
            callback(response);
        });
    };
    /**
     * 查询当前轮盘的开奖结果
     */
    WebsocketService.getCurrentLotteryResult = function (callback) {
        var tKey = '__getCurrentLotteryResult_timeout', self = this;
        ServersEngine.sendMessage("/req/game/roulette/dice_result", JSON.stringify({ no: CURRENT_NO }), function (response) {
            if (response.code == 200) {
                callback(response);
            }
        });
    };
    /**
     * 查询当前期其他用户下注情况
     */
    WebsocketService.getCurrentStakeInfo = function (callback) {
        var askNo = CURRENT_NO; //请求接口时的期号ID
        if (!askNo) {
            return;
        }
        ServersEngine.sendMessage("/req/game/roulette/all_stake_info", JSON.stringify({ no: askNo }), function (response) {
            //请求接口期号和当前期号不同，不处理
            if (askNo != CURRENT_NO) {
                return;
            }
            callback(response);
        });
    };
    /**
     * 获取投注表
     */
    WebsocketService.getStakeTableInfo = function (callback) {
        ServersEngine.sendMessage("/req/game/roulette/stake_table", '', function (response) {
            if (response.code == 200) {
                callback(response);
            }
        });
    };
    /**
     * 获取用户金豆
     */
    WebsocketService.getUserCoin = function (callback) {
        ServersEngine.sendMessage("/req/coin/amount", '', function (response) {
            if (response.code == 200) {
                callback(response);
            }
        });
    };
    /**
     * 获取当前期号
     */
    WebsocketService.getCurrentNo = function () {
        return CURRENT_NO;
    };
    /**
     * 断开连接
     */
    WebsocketService.disconnect = function () {
        ServersEngine.disConnect();
    };
    /***
     * 建立连接
     */
    WebsocketService.connect = function () {
        ServersEngine.connect();
    };
    /**
     * 管道初始化
     */
    WebsocketService.init = function () {
        ServersEngine.initial();
    };
    return WebsocketService;
}());
__reflect(WebsocketService.prototype, "WebsocketService");
