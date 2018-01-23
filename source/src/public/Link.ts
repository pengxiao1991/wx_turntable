namespace Link {
    //从url中获取渠道的key
    export const CHANNEL_KEY = 'appSource';
    //订单详情
    export const OrderDetail= "flyme://com.meizu.compaign/goodsOrder/detail?id=";
    //根据版本获取 订单的 link对象 key
    export function getOrderKeyByDeviceVersion(version){
        if(version && version > 9000002 && version !==10000005){
            return 'MinVersion903'
        }
        return 'MaxVersion902'
    }
    //订单更多跳转地址
    export const ORDER = {
        MinVersion903: {
            //666更多订单
            SIX: 'flyme://com.meizu.compaign/h5page/path?param=html%2Fparticipate-record-list.html%3Fgame_type%3D1002',
            //大转盘更多订单
            TABLE: 'flyme://com.meizu.compaign/h5page/path?param=html%2Fparticipate-record-list.html%3Fgame_type%3D1003',
            //抓娃娃更多订单
            DOLL: 'flyme://com.meizu.compaign/h5page/path?param=html%2Fparticipate-record-list.html%3Fgame_type%3D1004'
        },
        MaxVersion902: {
            //666更多订单
            SIX: 'flyme://com.meizu.compaign/gameRecords/list?url=https://venice.uwaterpark.com/native/auth/game/six/user_stake_record.do&title=六六六参与记录',
            //大转盘更多订单
            TABLE: 'flyme://com.meizu.compaign/gameRecords/list?url=https://venice.uwaterpark.com/native/auth/game/roulette/user_stake_record.do&title=大转盘参与记录'
        }
    };
    //网络设置
    export const SETTINGS = 'flyme://com.meizu.compaign/bridgeLink?targetPackage=com.android.settings&targetAction=android.settings.SETTINGS';
    //充值
    export const CHARGE = 'flyme://com.meizu.compaign/coupon/dialog?resultCallback=global_chargeCoinCallback';
}