/**
 * Created by liuyi on 2016/7/8.
 */

export default class Fetch {
    static getGoodList() {
        return new Promise((resolve,rej)=>{
            let res = {
                "success": true,
                "message": "",
                "root": {
                    "Items": [
                        {
                            "nc_distinct": "100168",
                            "goods_id": "100088",
                            "goods_name": "LG WD-T12410D 8公斤滚筒洗衣机 全自动变频智能静音特价正品免邮 白色",
                            "store_id": "1",
                            "gc_id": "317",
                            "gc_id_1": "308",
                            "gc_id_2": "309",
                            "gc_id_3": "317",
                            "goods_price": "2838.00",
                            "goods_promotion_price": "2838.00",
                            "goods_image": "/data/upload/shop/store/goods/1/1_04957369971481946.jpg"
                        },
                        {
                            "nc_distinct": "100172",
                            "goods_id": "100097",
                            "goods_name": "BOSE Lifestyle 535II 家庭娱乐系统（5.1家庭影院电视音响包邮）",
                            "store_id": "1",
                            "gc_id": "320",
                            "gc_id_1": "308",
                            "gc_id_2": "309",
                            "gc_id_3": "320",
                            "goods_price": "34800.00",
                            "goods_promotion_price": "34800.00",
                            "goods_image": "/data/upload/shop/store/goods/1/1_04958903176379237.jpg"
                        },
                        {
                            "nc_distinct": "100171",
                            "goods_id": "100091",
                            "goods_name": "Sony/索尼 BDP-S4100 3D蓝光机 高清dvd 蓝光dvd播放器 全国包邮 官方标配 官",
                            "store_id": "1",
                            "gc_id": "319",
                            "gc_id_1": "308",
                            "gc_id_2": "309",
                            "gc_id_3": "319",
                            "goods_price": "716.00",
                            "goods_promotion_price": "716.00",
                            "goods_image": "/data/upload/shop/store/goods/1/1_04957435723741730.jpg"
                        },
                        {
                            "nc_distinct": "100170",
                            "goods_id": "100090",
                            "goods_name": "Samsung/三星HT-F9750W 3D蓝光无线4k 7.1声道家庭影院音响套装",
                            "store_id": "1",
                            "gc_id": "318",
                            "gc_id_1": "308",
                            "gc_id_2": "309",
                            "gc_id_3": "318",
                            "goods_price": "6000.00",
                            "goods_promotion_price": "6000.00",
                            "goods_image": "/data/upload/shop/store/goods/1/1_04957413414435179.jpg"
                        },
                        {
                            "nc_distinct": "100169",
                            "goods_id": "100089",
                            "goods_name": "Galanz/格兰仕XQG60-A708 6公斤全自动滚筒洗衣机免邮 白色",
                            "store_id": "1",
                            "gc_id": "317",
                            "gc_id_1": "308",
                            "gc_id_2": "309",
                            "gc_id_3": "317",
                            "goods_price": "998.00",
                            "goods_promotion_price": "998.00",
                            "goods_image": "/data/upload/shop/store/goods/1/1_04957379016387445.jpg"
                        },
                        {
                            "nc_distinct": "100167",
                            "goods_id": "100085",
                            "goods_name": "TCL BCD-288KR50 288升法式对开多门冰箱家用大四门 欧洲工艺设计 不锈钢 不锈钢",
                            "store_id": "1",
                            "gc_id": "316",
                            "gc_id_1": "308",
                            "gc_id_2": "309",
                            "gc_id_3": "316",
                            "goods_price": "2699.00",
                            "goods_promotion_price": "2699.00",
                            "goods_image": "/data/upload/shop/store/goods/1/1_04956521033378313.jpg"
                        },
                        {
                            "nc_distinct": "100165",
                            "goods_id": "100084",
                            "goods_name": "乐视TV Letv Max70乐视tv液晶电视3d网络高清智能无线体感操作 银色 官方标配 银色 官",
                            "store_id": "1",
                            "gc_id": "314",
                            "gc_id_1": "308",
                            "gc_id_2": "309",
                            "gc_id_3": "314",
                            "goods_price": "8999.00",
                            "goods_promotion_price": "8999.00",
                            "goods_image": "/data/upload/shop/store/goods/1/1_04956295737527713.jpg"
                        },
                        {
                            "nc_distinct": "100166",
                            "goods_id": "100081",
                            "goods_name": "Changhong/长虹 KFR-32GW/DHT1(W1-H)+2 1.5匹冷暖定速节能空调 白色",
                            "store_id": "1",
                            "gc_id": "315",
                            "gc_id_1": "308",
                            "gc_id_2": "309",
                            "gc_id_3": "315",
                            "goods_price": "1999.00",
                            "goods_promotion_price": "1999.00",
                            "goods_image": "/data/upload/shop/store/goods/1/1_04956507331716135.jpg"
                        },
                        {
                            "nc_distinct": "100134",
                            "goods_id": "100047",
                            "goods_name": "Ronshen/容声 BCD-228D11SY 冰箱 家用 三门 电脑温控 软冷冻",
                            "store_id": "1",
                            "gc_id": "314",
                            "gc_id_1": "308",
                            "gc_id_2": "309",
                            "gc_id_3": "314",
                            "goods_price": "2699.00",
                            "goods_promotion_price": "2699.00",
                            "goods_image": "/data/upload/shop/store/goods/1/1_107453d8a7tb1uyzx___0-item_pic.jpg"
                        },
                        {
                            "nc_distinct": "100132",
                            "goods_id": "100045",
                            "goods_name": "大家电智能网络70寸65寸60寸55寸50寸40寸42寸32寸平板电视机液晶",
                            "store_id": "1",
                            "gc_id": "314",
                            "gc_id_1": "308",
                            "gc_id_2": "309",
                            "gc_id_3": "314",
                            "goods_price": "1299.00",
                            "goods_promotion_price": "1299.00",
                            "goods_image": "/data/upload/shop/store/goods/1/1_1096fa4007tb1bgix___0-item_pic.jpg"
                        }
                    ],
                    "totnum": 11,
                    "totpage": 2
                }
            }
            setTimeout(()=>{resolve(res)},1000);
        });

    }

    static getGood() {
        return new Promise((resolve,rej)=>{
            let res = {
                success:true,
                message:'',
                root : {
                    "goods_commonid": "100165",
                    "goods_name": "乐视TV Letv Max70乐视tv液晶电视3d网络高清智能无线体感操作 银色 官方标配 银色 官",
                    "goods_jingle": "┏一一乐视顶级超级电视一一┓ ┏一一四核杜比高清一一┓ ┏一一全网最低大尺寸-一一┓ ┏一大屏家庭影院一┓ ┊70寸超高清高品质液晶面板┊┊最快四核影院音响外放┊ ┊最具性价比超薄超窄液晶屏┊┊极致影院视听体验┊官方标配挂架，底座需要单独购买！付款后1周后发货！",
                    "goods_image": [
                        "http://10.10.33.173/data/upload/shop/store/goods/1/1_04956295737527713_360.jpg",
                        "http://10.10.33.173/data/upload/shop/store/goods/1/1_04956295910101580_360.jpg",
                        "http://10.10.33.173/data/upload/shop/store/goods/1/1_04956295958473422_360.jpg",
                        "http://10.10.33.173/data/upload/shop/store/goods/1/1_04956296004320368_360.jpg",
                        "http://10.10.33.173/data/upload/shop/store/goods/1/1_04956296052221212_360.jpg"
                    ],
                    "goods_id": "100084",
                    "goods_price": "8999.00",
                    "cart": true,
                    "goods_image2": "/data/upload/shop/store/goods/1/1_04956295737527713.jpg"
                }
            }
            setTimeout(()=>{resolve(res)},1000);
        });

    }
}