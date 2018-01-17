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
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        /**
         * 加载进度界面
         * loading process interface
         */
        // private loadingView: LoadingUI;
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isThemeLoadEnd = false;
        _this.isBGResourceLoadEnd = false;
        // 加载进度百分比
        _this.progressCount = -10;
        return _this;
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
    Main.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
        egret.lifecycle.addLifecycleListener(function (context) {
            // custom lifecycle plugin
        });
        // 息屏回调
        egret.lifecycle.onPause = function () {
            // egret.ticker.pause();
            // ProcessManager.stop();            
            // GlobalEmitter.emit(GlobalEvent.SCREENOFF);
        };
        // 亮屏回调
        egret.lifecycle.onResume = function () {
            // egret.ticker.resume();
            // ProcessManager.init();
        };
        //inject the custom material parser
        //注入自定义的素材解析器
        var assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        //Config loading process interface
        //设置加载进度界面
        // this.loadingView = new LoadingUI();
        // this.stage.addChild(this.loadingView);
        // initialize the Resource loading library
        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载皮肤主题资源和preload资源组。
     * Loading of configuration file is complete, start to pre-load the theme configuration file and the preload resource group
     */
    Main.prototype.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        // load skin theme configuration file, you can manually modify the file. And replace the default skin.
        //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
        var theme = new eui.Theme("resource/default.thm.json", this.stage);
        theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        // 加载背景资源
        RES.loadGroup("home");
    };
    /**
     * 主题文件加载完成,开始预加载
     * Loading of theme configuration file is complete, start to pre-load the
     */
    Main.prototype.onThemeLoadComplete = function () {
        this.isThemeLoadEnd = true;
        this.createScene();
    };
    /**
     * preload资源组加载完成
     * preload resource group is loaded
     */
    Main.prototype.onResourceLoadComplete = function (event) {
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
    };
    Main.prototype.createScene = function () {
        if (this.isThemeLoadEnd && this.isBGResourceLoadEnd) {
            this.startCreateScene();
        }
    };
    Main.prototype.loadChooseLayout = function () {
        var choose = new Choose();
        this.homeUI.chooseLayout.addChild(choose);
    };
    Main.prototype.loadHistoryLayout = function () {
        var history = new HistoryLayout();
        this.homeUI.historyLayout.addChild(history);
    };
    Main.prototype.loadTurntableLayout = function () {
        var turntable = new Turntable();
        this.homeUI.turntableLayout.addChild(turntable);
    };
    Main.prototype.loadSenderLayout = function () {
        var sender = new Sender();
        sender.addEventListener(eui.UIEvent.ADDED, function (e) {
            if (e.$target instanceof eui.Label) {
                RES.loadGroup('turntableLayout');
            }
        }, this);
        this.homeUI.senderLayout.addChild(sender);
    };
    Main.prototype.loadEntryLayout = function () {
        // let entryLayout = this.homeUI.getChildByName('entryLayout') as eui.DataGroup;
        // entryLayout.dataProvider = Entry.scoreCollection;                
        // entryLayout.itemRenderer = Entry;      
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    Main.prototype.onItemLoadError = function (event) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    };
    /**
     * 资源组加载出错
     * Resource group loading failed
     */
    Main.prototype.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //ignore loading failed projects
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     * loading process of preload resource
     */
    Main.prototype.onResourceProgress = function (event) {
        this.progressCount += 5;
        Native.startLoading("\u6B63\u5728\u521D\u59CB\u5316" + (this.progressCount < 0 ? 0 : this.progressCount > 100 ? 100 : this.progressCount) + "%(\u4E0D\u6D88\u8017\u6D41\u91CF)");
    };
    Main.prototype.startCreateScene = function () {
        // 加载背景
        this.homeUI = new Home();
        this.addChild(this.homeUI);
        this.homeUI.bottom = 0;
        RES.loadGroup('chooseLayout');
        RES.loadGroup('historyLayout');
        RES.loadGroup('senderLayout');
        var order = new Order();
        var rule = new Rule();
        new CountDownTime();
        new Header();
        new NoNetWork();
        new MyCoin();
        WebsocketService.init(); //管道初始化
        Native.bindBackListener(function (params) {
            if (order.active) {
                order.closePanel();
                return;
            }
            if (rule.active) {
                rule.closeRuleBox();
                return;
            }
            egret.ticker.pause();
            setTimeout(function () {
                Native.finishPage();
            }, 50);
        });
        //息屏	
        Native.bindStartStopScreenListener(function (data) {
            var isHidden = !data['isStart'];
            if (isHidden) {
                ProcessManager.stop();
                GameInfo.isInterrupted = true;
                GlobalEmitter.emit(GlobalEvent.SCREENOFF);
            }
            else {
                GameInfo.isInterrupted = false;
                ProcessManager.init();
            }
        });
    };
    return Main;
}(eui.UILayer));
__reflect(Main.prototype, "Main");
