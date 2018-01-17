class MyCoin {
	private capital:number = 0; //本金
	private consume:number = 0;//消费金额
	private openRechargeWindow:boolean = false;
	private myCoinNode: HTMLElement = document.querySelector('.my_coin_count') as HTMLElement;
	private addCoinBtn: HTMLElement = document.querySelector('.addCoin') as HTMLElement;
	private alreadyLogin: HTMLElement = document.querySelector('.already_login') as HTMLElement;
	private readyLogin: HTMLElement = document.querySelector('.ready_login') as HTMLElement;

	//金豆初始化
	private initCoinWithData (data){
		var stakeInfo = data['stakeInfo'];
		//恢复已消费的金豆数量
		this.consume = 0;
		if(!!stakeInfo){
			for(var key in stakeInfo){
				this.consume += stakeInfo[key] - 0;
			}
		}
		if(!!data.amount) {
			this.capital = (data.amount - 0) + this.consume;
		} else {
			this.capital = this.consume;
		}
		// this.myCoinNode.innerHTML = this.capital - this.consume + '';
		this.showCoin();
	}

	//增加消费
	private addConsume (added){
		this.consume += added;//新增加消耗
		this.showCoin();
	}
	
	//削减消费
	private cutConsume (remd){
		this.consume -= remd;
		this.showCoin();
	}
	
	//回滚消费
	private revertConsume (){
		this.consume = 0;
		this.showCoin();
	}
	
	//充值本金
	private chargeCapital (capital){
		this.capital = capital - this.consume;//新本金等于 总额减掉本期消费
		this.showCoin();
	}

	//用户中奖
	private userWin (winCoin) {
		this.capital += winCoin;
		this.showCoin();
	}

	public constructor() {
		this.init ();
	}

	//初始化
	private init () {
		//用户已经登录
		GlobalEmitter.on(GlobalEvent.ALREADY_LOGIN, function () {
			this.alreadyLogin.style.display = 'flex';
			this.readyLogin.style.display = 'none';	
		}, this);

		//用户下注
		GlobalEmitter.on(GlobalEvent.MY_BETTING, function (data) {
			console.log(data);
			var consume = data.text - 0;
			if( this.consume + consume > this.capital ) {
                data.func(false);//金豆不足回调下注失败
				this.showChargeCoinWindow();
            } else {
				this.addConsume(consume);
                data.func(true);
            }
		}, this);
		
		//清空
		GlobalEmitter.on(GlobalEvent.EMPTY_MY_BETTING, function () {
			this.revertConsume();
        }, this);

		//下注失败回滚金豆数
		GlobalEmitter.on(GlobalEvent.BACKSTAKEAMOUNT, function (data) {
			this.cutConsume(data-0);
        }, this);

		//用户中奖
		GlobalEmitter.on(GlobalEvent.USER_WIN, function (data) {
			this.userWin(data-0);
        }, this);
		//每轮开始初始化金豆余额
		GlobalEmitter.on(GlobalEvent.READY_CURRENTNO, function (res,rej,data) {
			this.initCoinWithData(data);
		}, this);

		// 点击充值/登录区域
		this.addCoinBtn.addEventListener('click', function () {
			var self = this;
			if(Native.isLogin().isLogin) {
				this.showChargeCoinWindow();
            } else {
                Native.getToken(function (token) {

				}, true);
            }
		}.bind(this));
		this.showCoin();
	}

	//金豆展示
	private showCoin () {
		var show = this.capital - this.consume;
		this.myCoinNode.innerHTML = show + '';
	}

	private showChargeCoinWindow(){
    	var self = this;
		//防止连续点击投注 触发多次，开启充值窗口
		if(!self.openRechargeWindow) {
			self.openRechargeWindow = true;
			window['global_chargeCoinCallback'] = function (data) {
				self.openRechargeWindow = false;
				delete window['global_chargeCoinCallback'];
				var value = data.response;
				console.log(!!value && !!value.data && value.data.result == 200,'!!value && !!value.data && value.data.result == 200')
				//充值成功（判断条件在 data.result中），判断是否 进行豆子逻辑查询
				if (!!value && !!value.data && value.data.result == 200) {
					//查询金豆
					WebsocketService.getUserCoin((response) => {
						console.log(response,'支付请求金豆接口回调');
						self.chargeCapital(response.value - 0);
					})
				}
			};
		}
		// location.href = 'flyme://com.meizu.compaign/coupon/dialog?resultCallback=global_chargeCoinCallback';//拉起优惠券列表弹框
		location.href = Link.CHARGE;

	}
}