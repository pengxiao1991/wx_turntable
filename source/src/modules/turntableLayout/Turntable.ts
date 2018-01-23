///<reference path="../../public/ProcessManager.ts" />
var openInfo = {
	isGetMyOpenInfo: false,
	isGetCurrentRouletteResult: false,
	number: null,
	result: null,
	userWinInfo: null
}

class Turntable extends eui.Component{
	public scrollCount:number = 0;
	public scrollTable: eui.Image;//转盘
	public open:boolean = false;//判断是否开奖
	public panel:eui.Group;
	public isBet:boolean = false;//用户是否投注
	public openAward:eui.Group;
	private awardType:eui.Label;
	private awardImage:eui.Image;
	private awardTip:eui.Label;
	private light: eui.Image;//霓虹灯1
	private light1: eui.Image;//霓虹灯2
	private openingCover: eui.Group;//开奖时蒙层
	private lastOpenId: any = 0;//上次开奖ID
	private CURRENT_NO: any;//当前期号
	private IN_COUNT_DOWN_COUNT:number = 0;//进入游戏时截盘偏移量
	private SCREEN_IS_OFF:boolean = false;//是否息屏
	public constructor() {
		super();
		this.addEventListener(eui.UIEvent.COMPLETE, this.uiCompHandler, this);
		this.skinName = 'resource/customSkins/turntableLayout/turntable.exml';
	}

	private uiCompHandler() {
		this.openAward.addChild(new OpenAwardInfo());
		this.drawC();
		//新一轮游戏开始
		GlobalEmitter.on(GlobalEvent.READY_CURRENTNO,function(res,rej,data){
			console.log(data,'newGame请求', new Date());
			this.IN_COUNT_DOWN_COUNT = (data.currentNo.stakeTimeLimit - 0) - (data.currentNo.timeOffset - 0);//时间偏移值
			this.CURRENT_NO = data.currentNo.no;
			if(data.stakeInfo && JSON.stringify(data.stakeInfo) != '{}') {
				this.isBet = true;
				GlobalEmitter.emit(GlobalEvent.INIT_USER_STAKE,data.stakeInfo);
			} else {
				this.isBet = false;
			}
            this.newGameOpen(data);
			this.stage.frameRate = 40;//修改游戏帧率
        },this)
		//倒计时结束 开启大转盘动画轮询中奖结果
		GlobalEmitter.on(GlobalEvent.GAME_READY_TO_ANNOUNCE,function(res,rej,data){
            this.countDownEnd(res,rej,data);
        },this)

		//大转盘动画结束 开启开奖模块
		GlobalEmitter.on(GlobalEvent.TURNTABLE_ANIMATION_END,function(res, rej){
			this.lottery(res,rej);
		},this);

		// 用户已经投注
		GlobalEmitter.on(GlobalEvent.SELF_BETTED,function(){
			this.isBet = true;
		},this);

		// 用户已经清空投注
		GlobalEmitter.on(GlobalEvent.BACKSTAKE,function(){
			this.isBet = false;
		},this)
		
		GlobalEmitter.on(GlobalEvent.SCREENOFF, this.screenOff, this)//息屏

		GlobalEmitter.on(GlobalEvent.ALREADY_GET_OPEN_INFO, function (response) {

			if(response.value.no == this.CURRENT_NO) {
				this.getCurrentLotteryResultCallback(response);
			} else {
				Native.showNativeDialog({
					title: '游戏场次异常，请退出稍后重试',
					positiveText: '退出',
					negativeText: ''
				}, function () {
					egret.ticker.pause(); setTimeout(() => { Native.finishPage(); }, 50);
				});
			}
		}, this);
		ProcessManager.init();
	}

	/**
	 * 倒计时结束
	 */
	private countDownEnd(res,rej,data) {
		this.currentState = 'opening';//设置当前状态为开奖中
		this.startScroll (res,rej,data);
		this.getOpenAwrad ();
	}

	//转盘开始动画
	private startScroll (res,rej,data):void {
		var self = this;
		this.stage.frameRate = 60;//修改游戏帧率
		var tw = self.stopScrollTableTween();
		tw.to({rotation: this.scrollTable.rotation + 360}, 2000, egret.Ease.sineIn).call(() => {
			self.middSrcollAnima(res,rej,data);
		})
		self.startLightAnmi();
	}

	//转盘中间持续动画
	private  middSrcollAnima(res,rej,data) {
		var self = this,
			angle:number = 0,//结束转盘动画时需要转动多少格子
			keepTime = 4 + data > 1? 4 + data: 1;//持续时间
		self.scrollCount += 1;
		egret.Tween.removeTweens(this.scrollTable)
		var tw = self.stopScrollTableTween();

		tw.to({rotation: this.scrollTable.rotation + 360}, 1000).call(() => {
			if(self.scrollCount > keepTime && openInfo.isGetCurrentRouletteResult && openInfo.isGetMyOpenInfo) {//test  当已经转动了8圈并且已经拿到中奖结果
				/**
				 * 1.根据中奖盘点ID减去上一次开奖判断ID来计算需要偏转的角度（angle）
				 * 2.当角度小于180度时 angle += 360  当角度大于180度时 angle不变
				 * 3.把持续转动圈数设为0;
				*/
				var currentPanId:number = openInfo.number;//当前开奖ID

				/**
				 * currentPanId（当前期开奖的格子Id） lastPanId(上一期开奖的格子Id)
				 * 计算转盘动画需要转动格子数
				 */
				if(self.lastOpenId > currentPanId) {
					angle = 54 + currentPanId - self.lastOpenId;
				} else {
					angle = currentPanId - self.lastOpenId;
				}
				if(angle < 27) {
					angle += 54;
				}
				self.lastOpenId = currentPanId;
				self.endScrollAnima (angle,res,rej); 
			} else {
				self.middSrcollAnima(res,rej,data);
			}
		});
	}
	//结束转盘动画
	private endScrollAnima(angle:number,res,rej) {
		var self = this,
		    tw = self.stopScrollTableTween(),
			time  = 2500 * angle / 27;
		tw.to({rotation: this.scrollTable.rotation + 20 * angle / 3}, time,egret.Ease.circOut).call(()=> {
			// 更新历史记录			
			GlobalEmitter.emit(GlobalEvent.UPDATEHISTORY,openInfo.result.hits[0],CURRENT_NO);
			res();//转盘动画结束开启开奖结果
			this.stage.frameRate = 40;//修改游戏帧率
		});
	}

	//拉取开奖结果
	private getOpenAwrad () {
		var self = this;
		self.open = true;
		//用户投注 查询开奖结果
		if(!this.isBet) {
			openInfo.isGetMyOpenInfo = true;
		} else {
			WebsocketService.getUserStakeResult(function (response) {
				self.getUserStakeResultCallback(response);
			});
		}
		WebsocketService.getCurrentLotteryResult(function (response) {
			self.getCurrentLotteryResultCallback(response);
		});

	}

	//查询用户中奖结果回调
	private getUserStakeResultCallback(response) {
		console.log(response,'已经拿到用户中奖信息');
		let self = this;
		if(!!response.value) {
			openInfo.isGetMyOpenInfo = true;
			openInfo.userWinInfo = response.value;
		} else {
			var _time = setTimeout(function () {
				WebsocketService.getUserStakeResult(function (response) {
					self.getUserStakeResultCallback(response);
				});
			}, 5000)
		}
	}

	//已经拿到本期中奖信息
	private getCurrentLotteryResultCallback (response) {
		console.log(response,'已经拿到本期中奖信息');
		var self = this;
		if(response.code == 200) {	
			var value = response.value;
			if(!!value) {
				openInfo.isGetCurrentRouletteResult = true;
				openInfo.number = value.numbers[0];
				openInfo.result = value;
				Native.markCoinChanged();
			} else {
				var _time = setTimeout(function () {
					WebsocketService.getCurrentLotteryResult(function (response) {
						self.getCurrentLotteryResultCallback(response);
						clearTimeout(_time);
					});
				}, 5000)
			}	
		}
	}

	//开奖
	private lottery(res,rej) {
		var self = this;
		var _time = setTimeout(function () {
			if(!self.SCREEN_IS_OFF) {
				self.currentState = "close";//close: 投注盘口关闭 open: 投注盘口开启
			} 
			clearTimeout(_time);
		}, 1000)
		/**
		 * 1.判断用户是否投注
		 * 2.如果用户没有投注（则显示开来参与）
		 * 3.如果用户投注了，获取用户是否中奖
		 * 4.如果用户中奖（则显示恭喜中奖）
		 * 5.如果用户没有中奖（则显示木有中奖）
		 */
		this.countLotteryResult();
		self.endLightAnmi();//停止霓虹灯动画
	}

	//停止转盘上的动画，并创建一个新的动画
	private stopScrollTableTween():egret.Tween {
		egret.Tween.removeTweens(this.scrollTable)
		return egret.Tween.get(this.scrollTable);
	}

	//计算中奖结果
	private countLotteryResult () {
		GlobalEmitter.emit(GlobalEvent.START_OPEN_AWARD,this.isBet,openInfo);
	}

	//新游戏开始
	private newGameOpen(data) {
		this.scrollCount = 0; //把持续转动圈数设为0
		this.open = false;
		this.SCREEN_IS_OFF = false;
		this.currentState = "open";//开启投注盘口
		this.lastOpenId = data.lastHitNumber[0];
		this.scrollTable.rotation = 0;
		this.scrollTable.rotation = 20 * (this.lastOpenId) / 3; 
		openInfo = {
			isGetMyOpenInfo: false,
			isGetCurrentRouletteResult: false,
			number: null,
			result: null,
			userWinInfo: null
		}
	}

	//开启霓虹灯动画
	private startLightAnmi ():void {
		egret.Tween.get(this.light, { loop: true })
			.set({ source: RES.getRes('wrapcircle_bg2_webp') })
			.wait(300)
			.set({ source: RES.getRes('wrapcircle_bg_webp') })
			.wait(200);
		egret.Tween.get(this.light1, {loop: true})
			.set({ source: RES.getRes('wrapcircle_bg2_webp') })
			.wait(300)
			.set({ source: RES.getRes('wrapcircle_bg_webp') })
			.wait(200);
	}

	//关闭霓虹灯动画
	private endLightAnmi ():void {
		egret.Tween.removeTweens(this.light);
		egret.Tween.removeTweens(this.light1);
	}
	 
	//画一个开奖时蒙层
	private drawC() {
		var shape:egret.Shape = new egret.Shape();
		shape.graphics.beginFill(0x000000, 0.8);
		shape.graphics.drawCircle( 400, 400, 350 );
		shape.graphics.endFill();
		this.openingCover.addChild(shape);
	}

	//息屏时移除节点上的动画
	private screenOff () {
		egret.Tween.removeTweens(this.scrollTable);
		egret.Tween.removeTweens(this.light);
		egret.Tween.removeTweens(this.light1);
		this.SCREEN_IS_OFF = true;
	}
}