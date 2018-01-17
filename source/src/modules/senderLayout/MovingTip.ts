// TypeScript file

class MovingTip extends eui.Component {
    
   public constructor(){
        super();
        this.addEventListener( eui.UIEvent.COMPLETE, this.uiCompHandler, this );
        this.skinName = "resource/customSkins/senderLayout/movingTip.exml";
    }
   
    private uiCompHandler():void {
      
        

    }
    public factorText:number = 0;
    public init(text:number,factorText:number):void {
        this.x = 0;
        this.y = 0;
        this.visible = true;
        (<eui.Label>this.$children[1]).text = text.toString();
        this.factorText = factorText;
    }
    
}