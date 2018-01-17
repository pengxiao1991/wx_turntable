// TypeScript file

/**
 * 
 */
class HistoryLayout extends eui.Component {

    public constructor() {
        super();
        this.factorComponent = new eui.Component();
        this.factorComponent.addEventListener(eui.UIEvent.COMPLETE, this.uiCompHandler, this);
        this.factorComponent.skinName = "resource/customSkins/historyLayout/historyLayout.exml";
        this.addChild(new eui.Image(RES.getRes('historyLayoutBG_webp')));
        this.addChild(this.factorComponent);
       
        
    }
    private factorComponent:eui.Component = null;
    private groupWidth:number = 0;
    private groupHeight:number = 0;
    private updateCount:number = 0;
    private firstCurrentNo:number = 0;
    private uiCompHandler(): void {
         this.groupWidth = this.factorComponent.$children[0].width;
         this.groupHeight = this.factorComponent.$children[0].height;
        
       
        GlobalEmitter.on(GlobalEvent.READY_CURRENTNO,function(){
          
            WebsocketService.getRouletteHistory((data) => {
                this.firstCurrentNo = data.value[0].no;
                let currentNo = WebsocketService.getCurrentNo(),
                __index = 0;
                console.log(currentNo,data,'当前期号','历史记录');
                    data.value.forEach((item,index) => {
                        if(currentNo === this.firstCurrentNo) {
                            if(index === 0) {
                                return;
                            }else {
                                __index = index - 1;
                                this.init(this.factorComponent.$children[index-1]);
                            }
                        } else {
                            if(index === 15) {
                                return;
                            } else {
                                __index = index;
                                this.init(this.factorComponent.$children[index]);
                            }
                        }
                        switch (item.hits[0]) {
                            case 7:
                                this.factorComponent.$children[__index].$children[1].alpha = 1;
                                break;
                            case 6:
                                (<eui.Label>this.factorComponent.$children[__index].$children[0]).text = '25';
                                break;
                            case 1:
                                (<eui.Label>this.factorComponent.$children[__index].$children[0]).text = '2';
                                break;
                            case 2:
                                (<eui.Label>this.factorComponent.$children[__index].$children[0]).text = '4';
                                break;
                            case 3:
                                (<eui.Label>this.factorComponent.$children[__index].$children[0]).text = '6';
                                break;
                            case 4:
                                (<eui.Label>this.factorComponent.$children[__index].$children[0]).text = '8';
                                break;
                            case 5:
                                (<eui.Label>this.factorComponent.$children[__index].$children[0]).text = '12';
                                break;
                            default:
                                break;
                        }
                        
                        
                    });
            });
            
        },this);
        
        GlobalEmitter.on(GlobalEvent.UPDATEHISTORY,function(id,currentNo){
            this.updateHistory(id);
        },this)
    }
    private init(item) {
        item.$children[0].text = '';
        item.$children[1].alpha = 0;
        item.$children[2].alpha = 0;
        

    }
    public updateHistory(id):void {
        this.updateCount++;
        let tw = egret.Tween.get(this.factorComponent);
        
        tw.to({ x:this.factorComponent.x + this.groupWidth }, 200)
        .call(function(){
            
            let temp = this.factorComponent.$children[14];
            this.factorComponent.$children.splice(0,0,temp);
            // 初始化对应的历史记录
           this.init(temp);
            switch (id) {
                case 7:
                    temp.$children[1].alpha = 1;
                    break;
                case 6:
                    (<eui.Label>temp.$children[0]).text = '25';
                    break;
                case 1:
                    (<eui.Label>temp.$children[0]).text = '2';
                    break;
                case 2:
                    (<eui.Label>temp.$children[0]).text = '4';
                    break;
                case 3:
                    (<eui.Label>temp.$children[0]).text = '6';
                    break;
                case 4:
                    (<eui.Label>temp.$children[0]).text = '8';
                    break;
                case 5:
                    (<eui.Label>temp.$children[0]).text = '12';
                    break;
                default:
                    break;
            }
           
            temp.x = -this.groupWidth * this.updateCount;
            temp.y = -this.groupHeight;
            
            
            let tempTW = egret.Tween.get(temp);
            tempTW.to({y:0},200).call(function(){
                // 隐藏第一个记录的new标记
            this.factorComponent.$children[1].$children[3].alpha = 0;
                 // 显示new标记
                temp.$children[3].alpha = 1;
            },this)
        },this)
    }


}