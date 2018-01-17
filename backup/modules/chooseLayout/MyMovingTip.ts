// TypeScript file

class MyMovingTip extends eui.Component {
    
   public constructor(){
        super();
        this.addEventListener( eui.UIEvent.COMPLETE, this.uiCompHandler, this );
        this.skinName = "resource/customSkins/chooseLayout/myMovingTip.exml";
        this.enabled = false;
    }
   
    private uiCompHandler():void {
      
        

    }
    public init(point:egret.Point,text:string):void {
        this.x = point.x;
        this.y = point.y;
        (<eui.Label>this.$children[1]).text = text;
    }

    // public restore
    
}