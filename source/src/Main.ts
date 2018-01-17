//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
      
class Main extends eui.UILayer {
    /**
     * 加载进度界面
     * loading process interface
     */
    // private loadingView: LoadingUI;

    protected async createChildren(): void {
        super.createChildren();
        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })

        // 息屏回调
        egret.lifecycle.onPause = () => {
            // egret.ticker.pause();
            // ProcessManager.stop();            
            // GlobalEmitter.emit(GlobalEvent.SCREENOFF);
        }
        // 亮屏回调
        egret.lifecycle.onResume = () => {
            // egret.ticker.resume();
            // ProcessManager.init();
        }

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        //Config loading process interface
        //设置加载进度界面

        // this.loadingView = new LoadingUI();
        // this.stage.addChild(this.loadingView);

        // initialize the Resource loading library
        //初始化Resource资源加载库
        // RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        // RES.loadConfig("resource/default.res.json", "resource/");
        await RES.loadConfig("resource/default.res.json", "resource/");
        this.onConfigComplete();
    }
    /**
     * 配置文件加载完成,开始预加载皮肤主题资源和preload资源组。
     * Loading of configuration file is complete, start to pre-load the theme configuration file and the preload resource group
     */
    private onConfigComplete(): void {
        // load skin theme configuration file, you can manually modify the file. And replace the default skin.
        //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
 
        let theme = new eui.Theme("resource/default.thm.json", this.stage);
        theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);

        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        // 加载背景资源
        RES.loadGroup("home");
        
    }
    private isThemeLoadEnd: boolean = false;
    /**
     * 主题文件加载完成,开始预加载
     * Loading of theme configuration file is complete, start to pre-load the 
     */
    private onThemeLoadComplete(): void {
        this.isThemeLoadEnd = true;
        this.createScene();
    }
    private isBGResourceLoadEnd: boolean = false;
    /**
     * preload资源组加载完成
     * preload resource group is loaded
     */
    private onResourceLoadComplete(event: RES.ResourceEvent): void {
        switch (event.groupName) {
            // 背景资源加载完成后
            case 'home':
                 this.isBGResourceLoadEnd = true;
                 this.createScene();
                break;

            case 'senderLayout':
                 this.loadSenderLayout();
                break;

            case 'chooseLayout':
                 this.loadChooseLayout();
                break;

            case 'turntableLayout':
                this.loadTurntableLayout();
                break;
            case 'historyLayout':
                this.loadHistoryLayout();
                break;
            default:
                break;
        }
       
    }
    private createScene() {
        if (this.isThemeLoadEnd && this.isBGResourceLoadEnd) {
            this.startCreateScene();
        }
    }
    private loadChooseLayout() {
        let choose = new Choose();
        this.homeUI.chooseLayout.addChild(choose);
       
    }
     private loadHistoryLayout() {
        let history = new HistoryLayout();
        this.homeUI.historyLayout.addChild(history);
       
    }
    private loadTurntableLayout () {
        let turntable = new Turntable();
        this.homeUI.turntableLayout.addChild(turntable);
    }
    private loadSenderLayout() {
        let sender = new Sender();
        sender.addEventListener(eui.UIEvent.ADDED,function(e){
            if (e.$target instanceof eui.Label) {
                RES.loadGroup('turntableLayout');   
            } 
        },this);
        this.homeUI.senderLayout.addChild(sender);
        
        
    }
    private loadEntryLayout() {
        // let entryLayout = this.homeUI.getChildByName('entryLayout') as eui.DataGroup;
        // entryLayout.dataProvider = Entry.scoreCollection;                
        // entryLayout.itemRenderer = Entry;      
    }
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event: RES.ResourceEvent): void {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }
    /**
     * 资源组加载出错
     * Resource group loading failed
     */
    private onResourceLoadError(event: RES.ResourceEvent): void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //ignore loading failed projects
        this.onResourceLoadComplete(event);
    }
    /**
     * preload资源组加载进度
     * loading process of preload resource
     */
    private onResourceProgress(event: RES.ResourceEvent): void {
        this.progressCount += 5;     
        // Native.startLoading(`正在初始化${this.progressCount < 0 ? 0 : this.progressCount > 100 ? 100 : this.progressCount}%(不消耗流量)`);

    }
    // 加载进度百分比
    private progressCount = -10;
    /**
     * 创建场景界面
     * Create scene interface
     */
    
    private homeUI : Home;
    protected startCreateScene(): void {
        // 加载背景
        this.homeUI = new Home();
        
        this.addChild(this.homeUI);
        
        // this.homeUI.bottom = 0;
        // RES.loadGroup('chooseLayout');   
        // RES.loadGroup('historyLayout');     
        // RES.loadGroup('senderLayout');             
        
        // let order = new Order();
        // let rule = new Rule();
        // new CountDownTime();
        // new Header();
        // new NoNetWork();
        // new MyCoin();
        // WebsocketService.init();//管道初始化

        
        // Native.bindBackListener((params) => {
        //     if (order.active) {
        //         order.closePanel();
        //         return;
        //     }
        //     if (rule.active) {
        //         rule.closeRuleBox();
        //         return;
        //     } 

        // egret.ticker.pause();
        // setTimeout(() => {
        //     Native.finishPage();
        // }, 50);
            
        // });
        // //息屏	
        // Native.bindStartStopScreenListener(function (data) {
        //     var isHidden = !data['isStart'];
        //     if(isHidden){
        //         ProcessManager.stop();    
        //         GameInfo.isInterrupted = true;  
        //         GlobalEmitter.emit(GlobalEvent.SCREENOFF);
        //     } else{
        //         GameInfo.isInterrupted = false;  
        //         ProcessManager.init();
        //     }
        // })
   

   
    }
    
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    // private createBitmapByName(name: string): egret.Bitmap {
    //     let result = new egret.Bitmap();
    //     let texture: egret.Texture = RES.getRes(name);
    //     result.texture = texture;
    //     return result;
    // }
    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    // private startAnimation(result: Array<any>): void {
    //     let parser = new egret.HtmlTextParser();

    //     let textflowArr = result.map(text => parser.parse(text));
    //     let textfield = this.textfield;
    //     let count = -1;
    //     let change = () => {
    //         count++;
    //         if (count >= textflowArr.length) {
    //             count = 0;
    //         }
    //         let textFlow = textflowArr[count];

    //         // 切换描述内容
    //         // Switch to described content
    //         textfield.textFlow = textFlow;
    //         let tw = egret.Tween.get(textfield);
    //         tw.to({ "alpha": 1 }, 200);
    //         tw.wait(2000);
    //         tw.to({ "alpha": 0 }, 200);
    //         tw.call(change, this);
    //     };

    //     change();
    // }

  
}
