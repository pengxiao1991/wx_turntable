
namespace GlobalEvent{  
   
    //新的一期比赛开始了
    export let NEW_GAME_OPENING = 'NEW_GAME_OPENING';

    
    // 场次信息准备完毕
    export let READY_CURRENTNO = 'READY_CURRENTNO';                    

    //本期游戏开启开奖过程
    export let GAME_READY_TO_ANNOUNCE = 'GAME_READY_TO_ANNOUNCE';

    // 本期游戏转盘动画结束
    export let TURNTABLE_ANIMATION_END = 'TURNTABLE_ANIMATION_END';

    //  本期游戏的最终结果已经准备好
    export let READY_RESULT = 'READY_RESULT';


    // 用户投注到达注点事件
    export let MYMOVINGTIPANIMATIONEND = 'MYMOVINGTIPANIMATIONEND';

    // 其他人投注到达注点事件
    export let MOVINGTIPANIMATIONEND = 'MOVINGTIPANIMATIONEND';
    // 用户自己已经投注过
    export let SELF_BETTED = 'SELF_BETTED';
     // 下注 
    export let MY_BETTING = 'MY_BETTING';

    //清空
    export let EMPTY_MY_BETTING = 'EMPTY_MY_BETTING';

    //倒计时结束
    export let COUNT_DOWN_END = 'COUNT_DOWN_END'; 

    // 转盘初始化完成
    export let READY_TURANTABLE = 'READY_TURANTABLE';

    //强登录需求模块，发出登录请求
    export let REQUIRE_FORCE_LOGIN = 'REQUIRE_FORCE_LOGIN';

    // 息屏事件
    export let SCREENOFF = 'SCREENOFF';

    // 回滚投注事件
    export let BACKSTAKE = 'BACKSTAKE';

    // 回滚投注金额
    export let BACKSTAKEAMOUNT = 'BACKSTAKEAMOUNT';
    // 用户已经登录
    export let ALREADY_LOGIN = 'ALREADY_LOGIN';
    // 历史记录更新事件
    export let UPDATEHISTORY = 'UPDATEHISTORY';

    // 发射用户投注事件
    export let SENDMYMOVINGTIP = 'SENDMYMOVINGTIP';

    // 投注按钮点击事件
    export let CHOOSEBUTTONCLICK = 'CHOOSEBUTTONCLICK';

    //开始开奖
    export let START_OPEN_AWARD = 'START_OPEN_AWARD';

    //socket 通道 已建立
	export const SOCKET_PIPLE_READY = 'SOCKET_PIPLE_READY';

	//通用错误码抛出
	export const COMMON_ERR_THROW = 'COMMON_ERR_THROW';

    //拿到开奖信息
    export let ALREADY_GET_OPEN_INFO = 'ALREADY_GET_OPEN_INFO';

    //拿到用户开奖信息
    export let ALREADY_GET_USER_RESULT = 'ALREADY_GET_USER_RESULT';

    // 初始化用户投注信息
    export let INIT_USER_STAKE = 'INIT_USER_STAKE';

    //用户中奖了
    export let USER_WIN = 'USER_WIN';

    //无网络
    export let NO_NET_WORK = 'NO_NET_WORK';

    // 亮屏
    export let SCREENON = 'SCREENON';

    //有网络了
    export let HAS_NET_WORK = 'HAS_NET_WORK';

    //即将开奖
    export let Will_LOTTERY = 'Will_LOTTERY';
};
