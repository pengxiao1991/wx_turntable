// TypeScript file

/**
 * 
 */
class Sender extends eui.Component {
    private will_lottery:boolean = false;

    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.uiCompHandler, this);
        this.skinName = "resource/customSkins/senderLayout/sender.exml";
        
    }
    private uiCompHandler(): void {
        
        // 初始化信息
        GlobalEmitter.on(GlobalEvent.READY_TURANTABLE,function(sectionArr){
            this.sectionArr = sectionArr;
                this.createMovingTip();            
        },this);

        // 开始轮询用户投注信息
        GlobalEmitter.on(GlobalEvent.READY_CURRENTNO,function(res,rej,data){
            // 每次新游戏，还原对象池
            if (!!this.movingTipPool) {
                this.movingTipPool.restore();
            }
           this.timeId = window.setInterval(() => {
               console.log('请求其他用户下注记录')
                if(!!this.will_lottery) {
                    window.clearInterval(this.timeId);
                    return;
                }
                WebsocketService.getCurrentStakeInfo((params) => {
                        if (params.value.no == data.currentNo.no) {
                            this.$children[1].text = params.value.count;
                            for (let key of Object.keys(params.value)) {
                                if (key != 'no'&&key != 'count'&&params.value[key] > this.sectionArr[Number(key)-1].tipNum) {
                                    this.initMovingTip(this.sectionArr[Number(key)-1],params.value[key] - this.sectionArr[Number(key)-1].tipNum);                                    
                            } else {
                                    // to do 异常逻辑
                                }
                            }
                            
                        } else {
                            console.log(params.value.no,data.currentNo.no,'haha');
                            console.log('期号不对');
                        }
                });    
           }, 5000);
        },this);

        // 停止查询用户投注信息
        GlobalEmitter.on(GlobalEvent.Will_LOTTERY,function(){
            console.log(23141242);
            this.will_lottery = true;
            window.clearInterval(this.timeId);
        },this);

        GlobalEmitter.on(GlobalEvent.NEW_GAME_OPENING, function() {
            this.will_lottery = false;
        }, this)
        GlobalEmitter.on(GlobalEvent.SCREENOFF, () => {
            window.clearInterval(this.timeId);
        }, this)//息屏
       
    }
    private sectionArr:any[] = [];
    private movingTipPool: NodePool<MovingTip> = null;
    private timeId = 0;
 

    // 创建movingTip的对象池
    public createMovingTip():void {
      this.movingTipPool = new NodePool<MovingTip>(MovingTip, 30);
    }

    // 获取每注需要发送的movingTip个数
    private getMovingTipNum (num:number) :any{
        let temp = [20,50,100,500,1000];
        for (let index = 0; index < temp.length; index++) {
            let element = temp[index];
            if (num / element <= 8) {
                return {
                    num: Math.floor(num / element),
                    step: element
                };
            }
            
        }
        return {
            num: Math.floor(num / temp[temp.length - 1]),
            step: temp[temp.length - 1]
        };
        
    }


    // 针对每一个注点初始化
    private initMovingTip(section:any,sum:number) :void{
        let obj = this.getMovingTipNum(sum);
        let movingTipArr:any[] = [];
        while (!!obj.num) {
            obj.num--;
            sum -= obj.step;
            let temp = this.movingTipPool.get();
            temp.init(obj.step,obj.step);
            this.addChild(temp);
            movingTipArr.push(temp);
        }
        if (sum > 0) {
            let temp = this.movingTipPool.get();
            temp.init(sum,sum);
            this.addChild(temp);
            movingTipArr.push(temp);
        }
        
        this.sendMovingTip(section,movingTipArr);
    }

    // 对某一个注点发射
    public sendMovingTip (section:any,movingTipArr:any[]):void{
         movingTipArr.forEach((item,index) => {
             setTimeout(() => {
                let tw = egret.Tween.get(item),
                globalPoint = section.localToGlobal(0,0),
                point = this.globalToLocal(globalPoint.x,globalPoint.y);
                // 如果是最后一次的投注
                if (index == movingTipArr.length - 1) {
                    tw.to({x:point.x,y:point.y},200)
                    .call((params) => {
                        item.visible = false;
                        GlobalEmitter.emit(GlobalEvent.MOVINGTIPANIMATIONEND,item.factorText,section.stakeId)                        
                        movingTipArr.forEach(function(item){
                            this.movingTipPool.free(item);
                            
                        },this);
                    })

                } else {
                    tw.to({x:point.x,y:point.y},200)
                    .call((params) => {
                        item.visible = false;
                        GlobalEmitter.emit(GlobalEvent.MOVINGTIPANIMATIONEND,item.factorText,section.stakeId)
                    })
                }
                
            }, 100*index);
        });
    }


}