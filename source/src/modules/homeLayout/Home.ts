// TypeScript file
    
/**
 * 
 */
class Home extends eui.Component {
    
   public constructor(){
        super();
        this.addEventListener( eui.UIEvent.COMPLETE, this.uiCompHandler, this );
        this.skinName = "resource/customSkins/homeLayout/home.exml";
        
    }
    public chooseLayout:eui.Group;
    public turntableLayout:eui.Group;    
    public senderLayout:eui.Group;
    public historyLayout:eui.Group;    
    private uiCompHandler():void {
        
        // 注册游戏开始事件，请求场次信息
        GlobalEmitter.on(GlobalEvent.NEW_GAME_OPENING,function(res){
            if (Native.isLogin() && Native.getTokenFromCache()) {
                console.log(2222,1111);
                WebsocketService.getRouletteInitInfo(function (data) {//查询初始化信息
                    console.log(data.value,1111,res);
                    res(data.value);
                });
            } else {
                WebsocketService.getCurrentGameInfo(function (data) {//获取当前场次信息
                    console.log(data.value,2222);
                    res(data.value);
                });
            }
        },this)
    }
}