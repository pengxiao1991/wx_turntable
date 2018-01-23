const PANEL_ARR= [2,12,2,4,2,6,2,8,2,4,6,2,4,8,6,25,4,2,6,2,4,2,8,2,6,2,4,8,12,2,4,2,6,2,8
,2,4,2,4,6,12,25,2,4,2,6,2,8,2,4,12,'皇冠',2,4]
class Order {
	public active:boolean = false;
	public constructor() {
		this.init();
	}

	private init() {
		var fmHeadRight = document.querySelector('.fm-header-right');
		var orderCover = document.querySelector('.order_cover');
		if (!!fmHeadRight && !!orderCover) {
			fmHeadRight.addEventListener('click', this.clickOrder.bind(this));
			orderCover.addEventListener('click', function () {
				if (this.active) {
					this.clickOrder();
				}
			}.bind(this))
		}
	}

	private clickOrder() {
		var self = this,
			orderLoading = document.querySelector('.orderLoading');
		if(!Native.isLogin().isLogin) {
			Native.getToken(function (data) {},true);
			return;
		}
		if(!self.active) {
			this.getOrderList()
			self.showPanel();
		} else {
			self.closePanel();
		}
	}

	private showPanel() {
		var self = this;
		self.closePanel();
		var	orderLoading = document.querySelector('.orderLoading') as HTMLElement,
			orderCover = document.querySelector('.order_cover') as HTMLElement,
			orderBox = document.querySelector('.order_box') as HTMLElement;
		self.active = true;

		orderLoading.style.display = 'block';
		orderCover.style.display = 'block';
		orderBox.style.transform = ' translate3d(0, -119.4444vw, 0)';
	}

	public closePanel() {
		var self = this,
			orderCover = document.querySelector('.order_cover') as HTMLElement,
			orderBox = document.querySelector('.order_box') as HTMLElement;
		self.active = false;

		orderBox.style.transform = 'translate3d(0, 0, 0)';
		orderCover.style.display = 'none';
		orderBox.innerHTML = '<div class="orderLoading">正在加载中...</div>';
	}

	//获取订单列表
	private getOrderList() {
		var self = this;
		FetchService.getUserOrder(1,10,function (respone) {
			console.log(respone,'orderListInfo');
			self.addOrderList(respone);
		})
	}

	//添加订单列表
	private addOrderList(respone) {
		var value = respone.value;

		if(value.length > 0) {
			var str = '',
				orderStr = '',
				over10 = value.length >= 10;
			value.forEach(function (el) {
				
				el.stakeInfo.forEach(function (item) {
					var string = item.hit ? `<div class="list_right getCoin">共中${item.result.odds / 10 * item.amount}金豆</div>` : `<div class="list_right noAward">未中奖</div>`;
					str += `<div class="current_list">
					   <div class="list_left">
					   <div class="type">${item.result.desc + ',  '}奖金倍数：${this.getResultCount(item.result.id)}</div> 
					   <div class="type">投${item.amount}金豆</div>
					   </div>${string}
					   </div>`;
				}.bind(this))
				var getString = el.payoff > 0 ? '<div class="getCoin">共中' + el.payoff + '金豆</div>' : '<div class="noAward">未中奖</div>';
				
				orderStr += '<div class="order_list">' +
				   '<div class="order_header">' +
				   '<div class="order_time">' +
				   '<div>' + this.setDate(el.createTime) + '</div>' +
				   '<div>共投' + el.totalAmount + '金豆</div>' +
				   '</div>' +
				   '<div class="order_coin">' +
				   '<div>订单编号：' + el.id + '</div>' + getString +
				   '</div>' +
				   '</div>' +
				   '<div class="order_content">' +
				   '<div class="content_header">' + el.no + '期（本期结果：' + PANEL_ARR[el.numbers[0]] + 
				   ' ）</div>' + str +
				   '</div>' +
				   '</div>'
				str = '';	
			}.bind(this))
			if (over10) {
				let device = Native.getDeviceInfo();
                let moreTableOrderLink = Link.ORDER[Link.getOrderKeyByDeviceVersion(device.cv)]['TABLE'];
                if(!!moreTableOrderLink){
                   orderStr += `<div class="order_footer">
					<span>更多订单</span>
					<div></div>
					</div>`
                }
				
			}
			document.querySelector('.order_box').innerHTML = orderStr;
			document.querySelector('.order_box').scrollTop = 0;
			if (over10) {
				document.querySelector('.order_footer').addEventListener('click', this.clickMoreOrder)
			}
		} else {
			document.querySelector('.order_box').innerHTML = `<div class="no_order">
			   <div class="img_no_order"></div>
			   <div class="tip">没有订单</div>
			   </div>`;
		}
	}

	//查看更多订单
	private clickMoreOrder () {
		let device = Native.getDeviceInfo();
		let moreTableOrderLink = Link.ORDER[Link.getOrderKeyByDeviceVersion(device.cv)]['TABLE'];
		if(!!moreTableOrderLink){
			location.href = moreTableOrderLink;
			
		}
		// location.href = 'flyme://com.meizu.compaign/gameRecords/list?url=https://venice.uwaterpark.com/native/auth/game/roulette/user_stake_record.do&title=大转盘参与记录';
	}

	private setDate (date) {
		var tempTime = new Date(date);
		return tempTime.getFullYear() + '-' + this.addZero(tempTime.getMonth() + 1) + '-' + this.addZero(tempTime.getDate()) + ' ' + this.addZero(tempTime.getHours()) + ':' + this.addZero(tempTime.getMinutes()) + ':' + this.addZero(tempTime.getSeconds());
	}
	
	private addZero (num) {
		if (num - 0 > 9) {
			return num;
		} else {
			return '0' + num;
		}
	}

	private getResultCount (data) {
		if(data == 7) {
			return 50;
		}
		if(data == 6) {
			return 25;
		} else if (data == 5) {
			return 12;
		} else if (data == 4) {
			return 8;
		} else if (data == 3) {
			return 6;
		} else if (data == 2) {
			return  4;
		} else if (data == 1) {
			return 2;
		} else {
			return '服务端接口有问题';
		}
	}
}