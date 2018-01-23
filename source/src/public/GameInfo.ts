// 存放全局游戏信息
namespace GameInfo {

    /**
     * 息屏标志符
     */
    export let isInterrupted = false;  //是否处于熄屏状态
    /**
     * 用户当前选中的注点金额
     */
    export let chooseAmount:number = 20;
    GlobalEmitter.on(GlobalEvent.CHOOSEBUTTONCLICK, function (num) {
        chooseAmount = Number(num);
    }, FetchManager);

    /**
     * 可以投注或清注
     */
    export let ableStake:boolean = true;
    GlobalEmitter.on(GlobalEvent.NEW_GAME_OPENING, function () {
        ableStake = true;
    }, FetchManager);
     GlobalEmitter.on(GlobalEvent.GAME_READY_TO_ANNOUNCE, function () {
        ableStake = false;
    }, FetchManager);

    export let noNetWork:boolean = false;
    // GlobalEmitter.on(GlobalEvent.NEW_GAME_OPENING, function () {
    //     noNetWork = true;
    // }, FetchManager);
    //  GlobalEmitter.on(GlobalEvent.GAME_READY_TO_ANNOUNCE, function () {
    //     noNetWork = false;
    // }, FetchManager);
}