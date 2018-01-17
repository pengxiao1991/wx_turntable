var GlobalEvent;
(function (GlobalEvent) {
    //新的一期比赛开始了
    GlobalEvent.NEW_GAME_OPENING = 'NEW_GAME_OPENING';
    // 场次信息准备完毕
    GlobalEvent.READY_CURRENTNO = 'READY_CURRENTNO';
    //本期游戏开启开奖过程
    GlobalEvent.GAME_READY_TO_ANNOUNCE = 'GAME_READY_TO_ANNOUNCE';
    // 本期游戏转盘动画结束
    GlobalEvent.TURNTABLE_ANIMATION_END = 'TURNTABLE_ANIMATION_END';
    //  本期游戏的最终结果已经准备好
    GlobalEvent.READY_RESULT = 'READY_RESULT';
    // 用户投注到达注点事件
    GlobalEvent.MYMOVINGTIPANIMATIONEND = 'MYMOVINGTIPANIMATIONEND';
    // 其他人投注到达注点事件
    GlobalEvent.MOVINGTIPANIMATIONEND = 'MOVINGTIPANIMATIONEND';
    // 用户自己已经投注过
    GlobalEvent.SELF_BETTED = 'SELF_BETTED';
    // 下注 
    GlobalEvent.MY_BETTING = 'MY_BETTING';
    //清空
    GlobalEvent.EMPTY_MY_BETTING = 'EMPTY_MY_BETTING';
    //倒计时结束
    GlobalEvent.COUNT_DOWN_END = 'COUNT_DOWN_END';
    // 转盘初始化完成
    GlobalEvent.READY_TURANTABLE = 'READY_TURANTABLE';
    //强登录需求模块，发出登录请求
    GlobalEvent.REQUIRE_FORCE_LOGIN = 'REQUIRE_FORCE_LOGIN';
    // 息屏事件
    GlobalEvent.SCREENOFF = 'SCREENOFF';
    // 回滚投注事件
    GlobalEvent.BACKSTAKE = 'BACKSTAKE';
    // 回滚投注金额
    GlobalEvent.BACKSTAKEAMOUNT = 'BACKSTAKEAMOUNT';
    // 用户已经登录
    GlobalEvent.ALREADY_LOGIN = 'ALREADY_LOGIN';
    // 历史记录更新事件
    GlobalEvent.UPDATEHISTORY = 'UPDATEHISTORY';
    // 发射用户投注事件
    GlobalEvent.SENDMYMOVINGTIP = 'SENDMYMOVINGTIP';
    // 投注按钮点击事件
    GlobalEvent.CHOOSEBUTTONCLICK = 'CHOOSEBUTTONCLICK';
    //开始开奖
    GlobalEvent.START_OPEN_AWARD = 'START_OPEN_AWARD';
    //socket 通道 已建立
    GlobalEvent.SOCKET_PIPLE_READY = 'SOCKET_PIPLE_READY';
    //通用错误码抛出
    GlobalEvent.COMMON_ERR_THROW = 'COMMON_ERR_THROW';
    //拿到开奖信息
    GlobalEvent.ALREADY_GET_OPEN_INFO = 'ALREADY_GET_OPEN_INFO';
    //拿到用户开奖信息
    GlobalEvent.ALREADY_GET_USER_RESULT = 'ALREADY_GET_USER_RESULT';
    // 初始化用户投注信息
    GlobalEvent.INIT_USER_STAKE = 'INIT_USER_STAKE';
    //用户中奖了
    GlobalEvent.USER_WIN = 'USER_WIN';
    //无网络
    GlobalEvent.NO_NET_WORK = 'NO_NET_WORK';
    // 亮屏
    GlobalEvent.SCREENON = 'SCREENON';
    //有网络了
    GlobalEvent.HAS_NET_WORK = 'HAS_NET_WORK';
    //即将开奖
    GlobalEvent.Will_LOTTERY = 'Will_LOTTERY';
})(GlobalEvent || (GlobalEvent = {}));
;
