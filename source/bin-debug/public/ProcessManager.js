// TypeScript file
var ProcessManager;
(function (ProcessManager) {
    var globalREJ = null;
    var isFirst = true; // 是否是第一次循环（需要新建通道）
    // 顺序触发主体事件
    function init() {
        var _this = this;
        /**
        *   home模块请求当前期的初始化游戏信息（res使用）
            section模块初始化，隐藏投注信息
        */
        console.log(GameInfo.noNetWork, GameInfo.isInterrupted, 'GameInfo.noNetWork || GameInfo.isInterrupted');
        if (GameInfo.noNetWork || GameInfo.isInterrupted) {
            return;
        }
        new Promise(function (res, rej) {
            globalREJ = rej;
            //todo
            if (isFirst) {
                GlobalEmitter.once(GlobalEvent.SOCKET_PIPLE_READY, function (isLogined) {
                    console.log('，，，，，，123');
                    GlobalEmitter.emit(GlobalEvent.NEW_GAME_OPENING, res, rej);
                    GlobalEmitter.emit(GlobalEvent.ALREADY_LOGIN);
                }, _this);
                isFirst = false;
            }
            else {
                GlobalEmitter.emit(GlobalEvent.NEW_GAME_OPENING, res, rej);
            }
            egret.ticker.resume();
            WebsocketService.connect();
            console.log('NEW_GAME_OPENING事件触发', 1);
        })
            .then(function (data) {
            console.log('事件2');
            return new Promise(function (res, rej) {
                globalREJ = rej;
                console.log('READY_CURRENTNO事件触发', 2.1);
                GlobalEmitter.emit(GlobalEvent.READY_CURRENTNO, res, rej, data);
                console.log('READY_CURRENTNO事件触发', 2);
            });
        })
            .then(function (data) {
            return new Promise(function (res, rej) {
                globalREJ = rej;
                GlobalEmitter.emit(GlobalEvent.GAME_READY_TO_ANNOUNCE, res, rej, data);
                console.log('GAME_READY_TO_ANNOUNCE事件触发', 3);
            });
        })
            .then(function () {
            return new Promise(function (res, rej) {
                globalREJ = rej;
                GlobalEmitter.emit(GlobalEvent.TURNTABLE_ANIMATION_END, res, rej);
                console.log('TURNTABLE_ANIMATION_END事件触发', 4);
            });
        })
            .then(function () {
            // 开启新一轮游戏
            ProcessManager.init();
            console.log('新一轮事件触发', 5);
        })
            .catch(function (params) {
            console.log('屏幕息屏', params);
        });
    }
    ProcessManager.init = init;
    // 停止主体事件
    function stop() {
        if (!!globalREJ) {
            WebsocketService.disconnect();
            egret.ticker.pause();
            isFirst = true;
            GlobalEmitter.emit(GlobalEvent.SCREENOFF);
            globalREJ();
        }
    }
    ProcessManager.stop = stop;
})(ProcessManager || (ProcessManager = {}));
