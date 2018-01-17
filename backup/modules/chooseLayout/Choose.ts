// TypeScript file

/**
 * 
 */
class Choose extends eui.Component {

    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.uiCompHandler, this);
        this.skinName = "resource/customSkins/chooseLayout/choose.exml";
    }
    // 清空按钮
    public emptyButton: eui.Group = null;
    // 投注按钮数组
    public chooseButtonArr: eui.Group[] = null;
    // 发射点相关信息
    public myMovingTipStart: any = {
        point: null,
        text: null
    };
    private uiCompHandler(): void {
        this.emptyButton = this.$children[0] as eui.Group;
        this.chooseButtonArr = this.$children.slice(1) as eui.Group[];

        this.emptyButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (GameInfo.ableStake) {
                this.backAllStake();
            }
        }, this);

        this.chooseButtonArr.forEach((item, index) => {
            item.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                this.chooseButtonClickCallBack(item, index);
                GlobalEmitter.emit(GlobalEvent.CHOOSEBUTTONCLICK,item.name);
            }, this);
        });

        let index = localStorage.getItem('turntableChooseButtonIndex');
        if (!!index) {
            this.chooseButtonArr[index].dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
        }
        else {
            this.chooseButtonArr[0].dispatchEventWith(egret.TouchEvent.TOUCH_TAP);

        }

        // 
        GlobalEmitter.on(GlobalEvent.SENDMYMOVINGTIP, (globalPoint: egret.Point,stakeId:number) => {
            this.sendMyMovingTip(globalPoint,stakeId);
        }, this);
        
        // 准备开奖时清空对象池，还原清空按钮
        GlobalEmitter.on(GlobalEvent.GAME_READY_TO_ANNOUNCE,function(){
            this.backEmptyButtonStyle();               
            this.destoryMyMovingTipPool();
        },this);
        // 创建对象池
        this.createMyMovingTipPool();

    }
    // 清除用户所有投注，并还原清空按钮样式
    public backAllStake(): void { 

        WebsocketService.emptyMyBetting((data) => {
            console.log('清空接口正常',data);
            this.backEmptyButtonStyle();   
            GlobalEmitter.emit(GlobalEvent.BACKSTAKE);
                     
        });
    };

    // 还原清空按钮样式
    public backEmptyButtonStyle(): void {
        this.emptyButton.$children[1].alpha = 0.4;

    };

    // chooseButton点击回调
    private chooseButtonClickCallBack(item: eui.Group, index: number) {
        this.chooseButtonArr.forEach((param) => {
            if (param.scaleX === 1.25) {
                param.scaleX = 1;
                param.scaleY = 1;
            }
        });
        item.scaleX = 1.25;
        item.scaleY = 1.25;
        this.myMovingTipStart.point = { x: item.x, y: item.y };
        this.myMovingTipStart.text = item.name;
        localStorage.setItem('turntableChooseButtonIndex', index.toString());

    }
    private myMovingTipPool: NodePool<MyMovingTip> = null;
    // 创建myMovingTip对象池
    public createMyMovingTipPool(): void {
        if (!this.myMovingTipPool) {
            this.myMovingTipPool = new NodePool<MyMovingTip>(MyMovingTip, 10);
        }
    }
    // 发射自己的投注
    public sendMyMovingTip(globalPoint: egret.Point,stakeId:number): void {
        let myMovingTip = this.myMovingTipPool.get();
        this.addChild(myMovingTip);
        myMovingTip.init(this.myMovingTipStart.point, this.myMovingTipStart.text);
        let tw = egret.Tween.get(myMovingTip);
        let point = this.globalToLocal(globalPoint.x, globalPoint.y);

        tw.to({ x: point.x, y: point.y }, 200).call(function(){
            this.myMovingTipPool.free(myMovingTip);
            this.removeChild(myMovingTip);
            GlobalEmitter.emit(GlobalEvent.MYMOVINGTIPANIMATIONEND,this.myMovingTipStart.text,stakeId);
            // 高亮清空按钮
            if (this.emptyButton.$children[1].alpha == 0.4) {
                this.emptyButton.$children[1].alpha = 1;
            } 
        },this);


    }
    // 对象池释放
    public destoryMyMovingTipPool(): void {
        this.myMovingTipPool.restore();
        
        // if (this.myMovingTipPool.length > 0) {
        //     this.myMovingTipPool.destory((params) => {
        //         params.free.forEach((item) => {
        //             if(item.parent){
        //                 this.removeChild(item);
        //             }
                    
        //         });
        //         params.busy.forEach((item) => {
        //             if(item.parent){
        //                 this.removeChild(item);
                        
        //             }
                    
        //         });
        //     });
        //     this.myMovingTipPool = null;
        // }
    }
}