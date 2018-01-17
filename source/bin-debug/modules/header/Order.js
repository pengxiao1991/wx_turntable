var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var PANEL_ARR = [2, 12, 2, 4, 2, 6, 2, 8, 2, 4, 6, 2, 4, 8, 6, 25, 4, 2, 6, 2, 4, 2, 8, 2, 6, 2, 4, 8, 12, 2, 4, 2, 6, 2, 8,
    2, 4, 2, 4, 6, 12, 25, 2, 4, 2, 6, 2, 8, 2, 4, 12, '皇冠', 2, 4];
var Order = (function () {
    function Order() {
        this.active = false;
        this.init();
    }
    Order.prototype.init = function () {
        var fmHeadRight = document.querySelector('.fm-header-right');
        var orderCover = document.querySelector('.order_cover');
        if (!!fmHeadRight && !!orderCover) {
            fmHeadRight.addEventListener('click', this.clickOrder.bind(this));
            orderCover.addEventListener('click', function () {
                if (this.active) {
                    this.clickOrder();
                }
            }.bind(this));
        }
    };
    Order.prototype.clickOrder = function () {
        var self = this, orderLoading = document.querySelector('.orderLoading');
        if (!Native.isLogin().isLogin) {
            Native.getToken(function (data) { }, true);
            return;
        }
        if (!self.active) {
            this.getOrderList();
            self.showPanel();
        }
        else {
            self.closePanel();
        }
    };
    Order.prototype.showPanel = function () {
        var self = this;
        self.closePanel();
        var orderLoading = document.querySelector('.orderLoading'), orderCover = document.querySelector('.order_cover'), orderBox = document.querySelector('.order_box');
        self.active = true;
        orderLoading.style.display = 'block';
        orderCover.style.display = 'block';
        orderBox.style.transform = ' translate3d(0, -119.4444vw, 0)';
    };
    Order.prototype.closePanel = function () {
        var self = this, orderCover = document.querySelector('.order_cover'), orderBox = document.querySelector('.order_box');
        self.active = false;
        orderBox.style.transform = 'translate3d(0, 0, 0)';
        orderCover.style.display = 'none';
        orderBox.innerHTML = '<div class="orderLoading">正在加载中...</div>';
    };
    //获取订单列表
    Order.prototype.getOrderList = function () {
        var self = this;
        FetchService.getUserOrder(1, 10, function (respone) {
            console.log(respone, 'orderListInfo');
            self.addOrderList(respone);
        });
    };
    //添加订单列表
    Order.prototype.addOrderList = function (respone) {
        var value = respone.value;
        if (value.length > 0) {
            var str = '', orderStr = '', over10 = value.length >= 10;
            value.forEach(function (el) {
                el.stakeInfo.forEach(function (item) {
                    var string = item.hit ? "<div class=\"list_right getCoin\">\u5171\u4E2D" + item.result.odds / 10 * item.amount + "\u91D1\u8C46</div>" : "<div class=\"list_right noAward\">\u672A\u4E2D\u5956</div>";
                    str += "<div class=\"current_list\">\n\t\t\t\t\t   <div class=\"list_left\">\n\t\t\t\t\t   <div class=\"type\">" + (item.result.desc + ',  ') + "\u5956\u91D1\u500D\u6570\uFF1A" + this.getResultCount(item.result.id) + "</div> \n\t\t\t\t\t   <div class=\"type\">\u6295" + item.amount + "\u91D1\u8C46</div>\n\t\t\t\t\t   </div>" + string + "\n\t\t\t\t\t   </div>";
                }.bind(this));
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
                    '</div>';
                str = '';
            }.bind(this));
            if (over10) {
                var device = Native.getDeviceInfo();
                var moreTableOrderLink = Link.ORDER[Link.getOrderKeyByDeviceVersion(device.cv)]['TABLE'];
                if (!!moreTableOrderLink) {
                    orderStr += "<div class=\"order_footer\">\n\t\t\t\t\t<span>\u66F4\u591A\u8BA2\u5355</span>\n\t\t\t\t\t<div></div>\n\t\t\t\t\t</div>";
                }
            }
            document.querySelector('.order_box').innerHTML = orderStr;
            document.querySelector('.order_box').scrollTop = 0;
            if (over10) {
                document.querySelector('.order_footer').addEventListener('click', this.clickMoreOrder);
            }
        }
        else {
            document.querySelector('.order_box').innerHTML = "<div class=\"no_order\">\n\t\t\t   <div class=\"img_no_order\"></div>\n\t\t\t   <div class=\"tip\">\u6CA1\u6709\u8BA2\u5355</div>\n\t\t\t   </div>";
        }
    };
    //查看更多订单
    Order.prototype.clickMoreOrder = function () {
        var device = Native.getDeviceInfo();
        var moreTableOrderLink = Link.ORDER[Link.getOrderKeyByDeviceVersion(device.cv)]['TABLE'];
        if (!!moreTableOrderLink) {
            location.href = moreTableOrderLink;
        }
        // location.href = 'flyme://com.meizu.compaign/gameRecords/list?url=https://venice.uwaterpark.com/native/auth/game/roulette/user_stake_record.do&title=大转盘参与记录';
    };
    Order.prototype.setDate = function (date) {
        var tempTime = new Date(date);
        return tempTime.getFullYear() + '-' + this.addZero(tempTime.getMonth() + 1) + '-' + this.addZero(tempTime.getDate()) + ' ' + this.addZero(tempTime.getHours()) + ':' + this.addZero(tempTime.getMinutes()) + ':' + this.addZero(tempTime.getSeconds());
    };
    Order.prototype.addZero = function (num) {
        if (num - 0 > 9) {
            return num;
        }
        else {
            return '0' + num;
        }
    };
    Order.prototype.getResultCount = function (data) {
        if (data == 7) {
            return 50;
        }
        if (data == 6) {
            return 25;
        }
        else if (data == 5) {
            return 12;
        }
        else if (data == 4) {
            return 8;
        }
        else if (data == 3) {
            return 6;
        }
        else if (data == 2) {
            return 4;
        }
        else if (data == 1) {
            return 2;
        }
        else {
            return '服务端接口有问题';
        }
    };
    return Order;
}());
__reflect(Order.prototype, "Order");
