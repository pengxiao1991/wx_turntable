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
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
        return __awaiter(this, void 0, void 0, function () {
            var assetAdapter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
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
                        assetAdapter = new AssetAdapter();
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
                        return [4 /*yield*/, RES.loadConfig("resource/default.res.json", "resource/")];
                    case 1:
                        //Config loading process interface
                        //设置加载进度界面
                        // this.loadingView = new LoadingUI();
                        // this.stage.addChild(this.loadingView);
                        // initialize the Resource loading library
                        //初始化Resource资源加载库
                        // RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
                        // RES.loadConfig("resource/default.res.json", "resource/");
                        _a.sent();
                        this.onConfigComplete();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 配置文件加载完成,开始预加载皮肤主题资源和preload资源组。
     * Loading of configuration file is complete, start to pre-load the theme configuration file and the preload resource group
     */
    Main.prototype.onConfigComplete = function () {
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
        // Native.startLoading(`正在初始化${this.progressCount < 0 ? 0 : this.progressCount > 100 ? 100 : this.progressCount}%(不消耗流量)`);
    };
    Main.prototype.startCreateScene = function () {
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
    };
    return Main;
}(eui.UILayer));
__reflect(Main.prototype, "Main");
