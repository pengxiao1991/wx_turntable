// 存放全局游戏信息
var GameInfo;
(function (GameInfo) {
    /**
     * 息屏标志符
     */
    GameInfo.isInterrupted = false; //是否处于熄屏状态
    /**
     * 用户当前选中的注点金额
     */
    GameInfo.chooseAmount = 20;
    GlobalEmitter.on(GlobalEvent.CHOOSEBUTTONCLICK, function (num) {
        GameInfo.chooseAmount = Number(num);
    }, FetchManager);
    /**
     * 可以投注或清注
     */
    GameInfo.ableStake = true;
    GlobalEmitter.on(GlobalEvent.NEW_GAME_OPENING, function () {
        GameInfo.ableStake = true;
    }, FetchManager);
    GlobalEmitter.on(GlobalEvent.GAME_READY_TO_ANNOUNCE, function () {
        GameInfo.ableStake = false;
    }, FetchManager);
    GameInfo.noNetWork = false;
    // GlobalEmitter.on(GlobalEvent.NEW_GAME_OPENING, function () {
    //     noNetWork = true;
    // }, FetchManager);
    //  GlobalEmitter.on(GlobalEvent.GAME_READY_TO_ANNOUNCE, function () {
    //     noNetWork = false;
    // }, FetchManager);
})(GameInfo || (GameInfo = {}));
