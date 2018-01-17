var CURRENT_NO: any = -1,
	ServerDomain = 'https://venice.uwaterpark.com',
	OVER_STAKE_TIME = '120201',//超过下注时间
	NEW_ISSUE_UN_OPEN = '120202',//开奖任务尚未结束
	MULTI_ACCOUNT_ERR = '120203',//多设备登录
	RISK_ERROR = '120204',//击穿奖池
	MULTI_ACCOUNT_ERR_WORDING = "检测到你的账号在其他设备上登录，请退出稍后重试",
	__interrupted = false,
	RequestTimeOut = 5000,//请求超时时间
	MaxRetry = 3,//最大重试次数
	newIssueUnOpenTime = 0;

class WebsocketService {
	private newIssueUnOpenTime: number = 0;
	public constructor() {
		
	}

	//新场次 初始化信息
	public static getRouletteInitInfo(callback) {
		var tKey = '__getInitData_timeout',
			self = this;

		ServersEngine.sendMessage("/req/game/roulette/init", '', (data) => {
			console.log(data, 885588);
			self[tKey] = 0;
			//console.log('initData back',this.isInterrupted());
			//开奖任务尚未结束,连续30次都是这样，判定出问题了
			if (data.code == NEW_ISSUE_UN_OPEN) {
				newIssueUnOpenTime = !!newIssueUnOpenTime ? newIssueUnOpenTime + 1 : 1;
				if (!!newIssueUnOpenTime && newIssueUnOpenTime > 30) {
					// 场次信息异常，关闭当前页面
					Native.showNativeDialog({
						title: '游戏场次异常，请退出稍后重试',
						positiveText: '退出',
						negativeText: ''
					}, function () { egret.ticker.pause(); setTimeout(() => { Native.finishPage(); }, 50); });

				} else {
					//重试机制
					self.getRouletteInitInfo(callback);
				}

			} else {
				var oldNo = CURRENT_NO;
				var value = data.value;
				var no = value['currentNo']['no'];
				newIssueUnOpenTime = 0;
				CURRENT_NO = no;
				console.log(data, 'startGame');
				callback(data);
			}
		});
	}
	//查询当前的场次信息
	public static getCurrentGameInfo(callback) {
		var tKey = '__getCurrentNo_timeout',
			self = this;

		ServersEngine.sendMessage("/req/game/roulette/unauth_init", '', (data) => {
			self[tKey] = 0;
			var oldNo = CURRENT_NO;
			var value = data.value;
			//开奖任务尚未结束,连续30次都是这样，判定出问题了
			if (data.code == NEW_ISSUE_UN_OPEN) {
				newIssueUnOpenTime = !!newIssueUnOpenTime ? newIssueUnOpenTime + 1 : 1;
				if (!!newIssueUnOpenTime && newIssueUnOpenTime > 30) {
					// 场次信息异常，关闭当前页面
					Native.showNativeDialog({
						title: '游戏场次异常，请退出稍后重试',
						positiveText: '退出',
						negativeText: ''
					}, function () { egret.ticker.pause(); setTimeout(() => { Native.finishPage(); }, 50); });

				} else {
					//重试机制
					self.getCurrentGameInfo(callback);
				}

			} else {
				newIssueUnOpenTime = 0;
				CURRENT_NO = value['currentNo']['no'];
				callback(data);
			}
		});
	}

	//清注
	public static emptyMyBetting(callback) {
		let tempParam = {};
		tempParam[Link.CHANNEL_KEY] = '003';
		ServersEngine.sendMessage("/req/game/roulette/clear_stake", JSON.stringify(tempParam), (response) => {
			console.log('清注');
			if (response.code == 200) {
				callback(response);
			} else if (response.code == MULTI_ACCOUNT_ERR) {// 在多设备上清注，退出页面
				Native.showNativeDialog({
					title: MULTI_ACCOUNT_ERR_WORDING,
					positiveText: '退出',
					negativeText: ''
				}, function () { egret.ticker.pause(); setTimeout(() => { Native.finishPage(); }, 50); });
			}
		});
	}

	/**
	 * 下注、返回下注的场次编号
	 * @param stakeId 注点Id
	 * @param amout 投注金额
	 * @param callback 回调函数 
	 */
	public static myBetting(stakeId, amout, callback) {
		console.log('下注了', amout);
		let tempParam = {stakeId: stakeId, amount: amout};
		tempParam[Link.CHANNEL_KEY] = '003';
		ServersEngine.sendMessage("/req/game/roulette/stake", JSON.stringify(tempParam), (response) => {
			console.log(response, 'myBeting');
			if (response.code == 200) {
				callback(response);
			} else {
				callback(false);
				if (response.code == MULTI_ACCOUNT_ERR) {//多设备登录
					Native.showNativeDialog(
						{
							title: MULTI_ACCOUNT_ERR_WORDING,
							positiveText: '退出',
							negativeText: '',
							cancelable: false
						},
						function () { egret.ticker.pause(); setTimeout(() => { Native.finishPage(); }, 50); }
					);
				} else {

					//todo 回滚处理
					console.log(response.code, RISK_ERROR, 'RISK_ERROR,RISK_ERROR');
					if (response.code == RISK_ERROR) {
						Native.showNativeToast({ message: '系统繁忙，投注失败', duration: 1 })
					}
					if (response.code == OVER_STAKE_TIME) {
						Native.showNativeToast({ message: '超过下注时限，投注失败', duration: 1 })
					}
				}
			}
		});
	}

	/**
	 * 查询用户自己的下注情况
	 */
	public static getMyStakeInfo(callback) {
		var tKey = '__getSelfBettingInfo_timeout',
			self = this;

		ServersEngine.sendMessage("/req/game/roulette/stake_info", JSON.stringify({ no: CURRENT_NO }), (response) => {
			self[tKey] = 0;
			callback(response);
		});
	}

	/**
	 * 查询用户中奖情况
	 */
	public static getUserStakeResult(callback) {
		var tKey = '__getUserStakeResult_timeout',
			self = this;

		ServersEngine.sendMessage("/req//game/roulette/user_stake_result", JSON.stringify({ no: CURRENT_NO }), (response) => {
			callback(response);
		});
	}

	/**
	 * 查询历史轮盘结果
	 */
	public static getRouletteHistory(callback) {
		var tKey = '__getHistory_timeout',
			self = this;

		ServersEngine.sendMessage("/req/game/roulette/dice_history", JSON.stringify({
			offset: 0,//起始偏移量
			size: 16//返回结果的数量
		}), (response) => {
			self[tKey] = 0;
			callback(response);
		});
	}

	/**
	 * 查询当前轮盘的开奖结果
	 */
	public static getCurrentLotteryResult(callback) {
		var tKey = '__getCurrentLotteryResult_timeout',
			self = this;

		ServersEngine.sendMessage("/req/game/roulette/dice_result", JSON.stringify({ no: CURRENT_NO }), (response) => {
			if (response.code == 200) {
				callback(response);
			}
		});
	}

	/**
	 * 查询当前期其他用户下注情况
	 */
	public static getCurrentStakeInfo(callback) {
		var askNo = CURRENT_NO;//请求接口时的期号ID
		if (!askNo) {
			return;
		}

		ServersEngine.sendMessage("/req/game/roulette/all_stake_info", JSON.stringify({ no: askNo }), (response) => {
			//请求接口期号和当前期号不同，不处理
			if (askNo != CURRENT_NO) {
				return;
			}
			callback(response);
		});
	}

	/**
	 * 获取投注表
	 */
	public static getStakeTableInfo(callback) {

		ServersEngine.sendMessage("/req/game/roulette/stake_table", '', (response) => {
			if (response.code == 200) {
				callback(response);
			}
		});
	}

	/**
	 * 获取用户金豆
	 */
	public static getUserCoin(callback) {
		ServersEngine.sendMessage("/req/coin/amount", '', (response) => {
			if (response.code == 200) {
				callback(response);
			}
		})
	}

	/**
	 * 获取当前期号
	 */
	public static getCurrentNo () {
		return CURRENT_NO;
	}

	/**
	 * 断开连接
	 */
	public static disconnect () {
		ServersEngine.disConnect();
	}

	/***
	 * 建立连接
	 */
	public static connect () {
		ServersEngine.connect();
	}

	/**
	 * 管道初始化
	 */
	public static init () {
		ServersEngine.initial();
	}
}