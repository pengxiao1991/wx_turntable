// TypeScript file
namespace ProcessManager {
    let globalREJ:Function = null;
   
    let isFirst = true; // 是否是第一次循环（需要新建通道）
   
    // 顺序触发主体事件
    export function init(){
        /**
        *   home模块请求当前期的初始化游戏信息（res使用）
            section模块初始化，隐藏投注信息
        */
        console.log(GameInfo.noNetWork,GameInfo.isInterrupted,'GameInfo.noNetWork || GameInfo.isInterrupted');
     if (GameInfo.noNetWork || GameInfo.isInterrupted) {
         return;
     }
     new Promise((res, rej) => {
            globalREJ = rej;
            //todo
            if (isFirst) {
                GlobalEmitter.once(GlobalEvent.SOCKET_PIPLE_READY,function(isLogined){
                    console.log('，，，，，，123');
                    GlobalEmitter.emit(GlobalEvent.NEW_GAME_OPENING,res,rej);
                    GlobalEmitter.emit(GlobalEvent.ALREADY_LOGIN);
                },this);
                isFirst = false;
            } else {
                GlobalEmitter.emit(GlobalEvent.NEW_GAME_OPENING,res,rej);
            }
            egret.ticker.resume();
            WebsocketService.connect();


            console.log('NEW_GAME_OPENING事件触发',1);
        })

        /**
         * 金豆模块数量修改
         * 倒计时模块设置倒计时 （res使用）
         * secion模块选中用户已经投中的
         * 需要期号的模块存储currentNo
         * sender模块开始轮询用户投注情况
         */


        .then((data) => {
            console.log('事件2');
            return new Promise((res, rej) => {
                globalREJ = rej;          
                console.log('READY_CURRENTNO事件触发', 2.1);      
                GlobalEmitter.emit(GlobalEvent.READY_CURRENTNO,res,rej,data);
                console.log('READY_CURRENTNO事件触发',2);
            });
        })
        
        /**
         * 结果模块在一段时间内随机轮询开奖结果
         * sender模块停止轮询用户投注情况
            choose模块对象池释放
         * 转盘模块开始转动动画
         * 转盘模块根据算法缓慢停止动画(res)
         */
        .then((data) => {
            return new Promise((res, rej) => {
                globalREJ = rej;                
                GlobalEmitter.emit(GlobalEvent.GAME_READY_TO_ANNOUNCE,res,rej,data);
               console.log('GAME_READY_TO_ANNOUNCE事件触发',3); 
            });
        })
        /**
         * 结果模块开奖
         * 金豆模块根据情况发生变化
         * 历史模块新增历史记录
         * 倒计时模块开始下一轮倒计时（res）
         */
        .then(() => {
            return new Promise((res, rej) => {
                globalREJ = rej;                
                GlobalEmitter.emit(GlobalEvent.TURNTABLE_ANIMATION_END,res,rej);
                console.log('TURNTABLE_ANIMATION_END事件触发',4);
            });
        })
        .then(() => {
            // 开启新一轮游戏
            ProcessManager.init();
            console.log('新一轮事件触发',5);
        })
        .catch((params) => {
            console.log('屏幕息屏',params);
        });
        
    }
    
    // 停止主体事件
    export function stop(){
        if (!!globalREJ) {
            WebsocketService.disconnect();
            egret.ticker.pause();
            isFirst = true;
            GlobalEmitter.emit(GlobalEvent.SCREENOFF);
            globalREJ();
        }
    }
}