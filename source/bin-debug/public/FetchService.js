var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var CURRENT_NO = undefined, ServerDomain = 'https://venice.uwaterpark.com', OVER_STAKE_TIME = '120301', //超过下注时间
NEW_ISSUE_UN_OPEN = '120302', //开奖任务尚未结束
MULTI_ACCOUNT_ERR = '120303', //多设备登录
RISK_ERROR = '120204', //击穿奖池
MULTI_ACCOUNT_ERR_WORDING = "检测到你的账号在其他设备上登录，请退出稍后重试", SESSION_INFO_ERROR = '游戏场次异常，请退出稍后重试', __interrupted = false, RequestTimeOut = 5000, //请求超时时间
MaxRetry = 3, //最大重试次数
newIssueUnOpenTime = 0, betMemory = {
    mark: function () {
        this._ = true;
    },
    clear: function () {
        this._ = false;
    },
    isEverBet: function () {
        return !!this._;
    }
};
var FetchService = (function () {
    function FetchService() {
        this.newIssueUnOpenTime = 0;
    }
    //新场次 初始化信息
    FetchService.getRouletteInitInfo = function (callback) {
        var _this = this;
        betMemory.clear();
        var tKey = '__getInitData_timeout', self = this;
        Pxfetch.pxfetch({
            type: 'get',
            url: ServerDomain + '/native/auth/game/roulette/init.do',
            data: {},
            success: function (data, response) {
                _this[tKey] = 0;
                //console.log('initData back',this.isInterrupted());
                //开奖任务尚未结束,连续30次都是这样，判定出问题了
                if (data.code == NEW_ISSUE_UN_OPEN) {
                    newIssueUnOpenTime = !!newIssueUnOpenTime ? newIssueUnOpenTime + 1 : 1;
                    if (!!newIssueUnOpenTime && newIssueUnOpenTime > 30) {
                        // 场次信息异常，关闭当前页面
                        FetchService.unusualInform(SESSION_INFO_ERROR);
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
                    callback(data);
                }
            }
        });
    };
    //查询当前的场次信息
    FetchService.getCurrentGameInfo = function (callback) {
        betMemory.clear();
        var tKey = '__getCurrentNo_timeout', self = this;
        Pxfetch.pxfetch({
            type: 'get',
            url: ServerDomain + '/native/unauth/game/roulette/unauth_init.do',
            data: {},
            success: function (data) {
                self[tKey] = 0;
                var oldNo = CURRENT_NO;
                var value = data.value;
                //开奖任务尚未结束,连续30次都是这样，判定出问题了
                if (data.code == NEW_ISSUE_UN_OPEN) {
                    newIssueUnOpenTime = !!newIssueUnOpenTime ? newIssueUnOpenTime + 1 : 1;
                    if (!!newIssueUnOpenTime && newIssueUnOpenTime > 30) {
                        // 场次信息异常，关闭当前页面
                        FetchService.unusualInform(SESSION_INFO_ERROR);
                    }
                    else {
                        //重试机制
                        self.getCurrentGameInfo(callback);
                    }
                }
                else {
                    newIssueUnOpenTime = 0;
                    CURRENT_NO = value.no;
                    callback(data);
                }
            }
        });
    };
    //清注
    FetchService.emptyMyBetting = function (callback) {
        Pxfetch.pxfetch({
            type: 'post',
            url: ServerDomain + '/native/auth/game/roulette/clear_stake.do',
            data: {},
            success: function (response) {
                if (response.code == 200) {
                    betMemory.clear();
                    callback(response);
                }
                else if (response.code == MULTI_ACCOUNT_ERR) {
                    FetchService.unusualInform(MULTI_ACCOUNT_ERR_WORDING);
                }
            }
        });
    };
    /**
     * 下注、返回下注的场次编号
     * @param stakeId 注点Id
     * @param amout 投注金额
     * @param callback 回调函数
     */
    FetchService.myBetting = function (stakeId, amout, callback) {
        Pxfetch.pxfetch({
            type: 'post',
            url: ServerDomain + '/native/auth/game/roulette/stake.do',
            data: {
                stakeId: stakeId,
                amount: amout
            },
            success: function (response) {
                if (response.code == 200) {
                    betMemory.mark();
                    callback(response);
                }
                else {
                    callback(false); //返回false做回滚处理
                    if (response.code == MULTI_ACCOUNT_ERR) {
                        FetchService.unusualInform(MULTI_ACCOUNT_ERR_WORDING);
                    }
                    else {
                        //todo 回滚处理
                        if (response.code == RISK_ERROR) {
                            Native.showNativeToast({ message: '系统繁忙，投注失败', duration: 1 });
                        }
                    }
                }
            }
        });
    };
    /**
     * 查询用户自己的下注情况
     */
    FetchService.getMyStakeInfo = function (callback) {
        var tKey = '__getSelfBettingInfo_timeout', self = this;
        Pxfetch.pxfetch({
            type: 'get',
            url: ServerDomain + '/native/auth/game/roulette/stake_info.do',
            data: {
                no: CURRENT_NO
            },
            success: function (response) {
                self[tKey] = 0;
                callback(response);
            },
            timeoutError: function () {
                if ((self[tKey] = !self[tKey] ? 1 : self[tKey] + 1) < MaxRetry) {
                    self.getMyStakeInfo(callback);
                }
                else {
                    self[tKey] = 0;
                    //todo 通知网络超时
                    FetchService.informNoNetWork();
                }
            }
        }, RequestTimeOut);
    };
    /**
     * 查询用户中奖情况
     */
    FetchService.getUserStakeResult = function (callback) {
        var tKey = '__getUserStakeResult_timeout', self = this;
        Pxfetch.pxfetch({
            type: 'get',
            url: ServerDomain + '/native/auth/game/roulette/user_stake_result.do',
            data: {
                no: CURRENT_NO
            },
            success: function (response) {
                self[tKey] = 0;
                callback(response);
            },
            //请求超时事件
            timeoutError: function () {
                if ((self[tKey] = !self[tKey] ? 1 : self[tKey] + 1) < MaxRetry) {
                    self.getUserStakeResult(callback);
                }
                else {
                    self[tKey] = 0;
                    //todo 通知网络超时
                    FetchService.informNoNetWork();
                }
            }
        }, RequestTimeOut);
    };
    /**
     * 查询历史轮盘结果
     */
    FetchService.getRouletteHistory = function (callback) {
        var tKey = '__getHistory_timeout', self = this;
        Pxfetch.pxfetch({
            type: 'get',
            url: ServerDomain + '/native/unauth/game/roulette/history.do',
            data: {
                offset: '',
                size: 20 //返回结果的数量
            },
            success: function (response) {
                self[tKey] = 0;
                callback(response);
            },
            //请求超时事件
            timeoutError: function () {
                if ((self[tKey] = !self[tKey] ? 1 : self[tKey] + 1) < MaxRetry) {
                    self.getRouletteHistory(callback);
                }
                else {
                    self[tKey] = 0;
                    //todo 通知网络超时
                    FetchService.informNoNetWork();
                }
            }
        }, RequestTimeOut);
    };
    /**
     * 查询当前轮盘的开奖结果
     */
    FetchService.getCurrentLotteryResult = function (callback) {
        var tKey = '__getCurrentLotteryResult_timeout', self = this;
        Pxfetch.pxfetch({
            type: 'get',
            url: ServerDomain + '/native/unauth/game/roulette/result.do',
            data: {
                no: CURRENT_NO
            },
            success: function (response) {
                if (response.code == 200) {
                    callback(response);
                }
                else {
                    var _time = setTimeout(function () {
                        clearTimeout(_time);
                        self.getCurrentLotteryResult(callback);
                    }, 200);
                }
            },
            //请求超时事件
            timeoutError: function () {
                if ((self[tKey] = !self[tKey] ? 1 : self[tKey] + 1) < MaxRetry) {
                    self.getRouletteHistory(callback);
                }
                else {
                    self[tKey] = 0;
                    //todo 通知网络超时
                    FetchService.informNoNetWork();
                }
            }
        }, RequestTimeOut);
    };
    /**
     * 查询当前期其他用户下注情况
     */
    FetchService.getCurrentStakeInfo = function (callback) {
        var askNo = CURRENT_NO; //请求接口时的期号ID
        if (!askNo) {
            return;
        }
        Pxfetch.pxfetch({
            type: 'get',
            url: ServerDomain + '/native/unauth/game/roulette/stake_info.do',
            data: {
                no: askNo
            },
            success: function (response) {
                //请求接口期号和当前期号不同，不处理
                if (askNo != CURRENT_NO) {
                    return;
                }
                callback(response);
            }
        });
    };
    /**
     * 获取投注表
     */
    FetchService.getStakeTableInfo = function (callback) {
        Pxfetch.pxfetch({
            type: 'get',
            url: ServerDomain + '/native/unauth/game/roulette/stake_table.do',
            data: {},
            success: function (response) {
                if (response.code == 200) {
                    callback(response);
                }
            }
        });
    };
    /**
     * 获取用户是否下注
     */
    FetchService.getUserIsBet = function () {
        return betMemory.isEverBet();
    };
    FetchService.getUserOrder = function (page, size, callback) {
        var self = this, tKey = '__getUserOrder_timeout';
        Pxfetch.pxfetch({
            type: 'get',
            url: ServerDomain + '/native/auth/game/roulette/full_user_record.do',
            data: {
                page: page,
                size: size
            },
            success: function (response) {
                if (response.code == 200) {
                    callback(response);
                }
            },
            //请求超时事件
            timeoutError: function () {
                if ((self[tKey] = !self[tKey] ? 1 : self[tKey] + 1) < MaxRetry) {
                    self.getUserOrder(page, size, callback);
                }
                else {
                    self[tKey] = 0;
                    //todo 通知网络超时
                    FetchService.informNoNetWork();
                }
            }
        }, RequestTimeOut);
    };
    //通知网络超时
    FetchService.informNoNetWork = function () {
        NoNetWork.noNetWork(function () { }, false);
    };
    //异常通知处理
    FetchService.unusualInform = function (type) {
        Native.showNativeDialog({
            title: type,
            positiveText: '退出',
            negativeText: ''
        }, function () {
            egret.ticker.pause();
            setTimeout(function () { Native.finishPage(); }, 50);
        });
    };
    return FetchService;
}());
__reflect(FetchService.prototype, "FetchService");
