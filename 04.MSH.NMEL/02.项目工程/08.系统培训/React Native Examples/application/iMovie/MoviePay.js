/**
 * 电影票确认订单
 */
'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../Global');
var NavBar = require('../view/NavBar');
var ChoosePay = require('./ChoosePay');
var InputPayPwd = require('../view/lib/InputPayPwd');
var BankList = require('../view/assets/BankList');
var AccountAction = require('../view/actions/AccountAction');
var UtilsMixin = require('../view/lib/UtilsMixin');
var FilterMixin = require('../filter/FilterMixin');

var {
    TouchableOpacity,
    ScrollView,
    View,
    Text,
    StyleSheet,
    PropTypes,
    Navigator,
    PixelRatio,
    Dimensions,
    Alert,
    Image,
    InteractionManager,   
} = React;

var MP_Detail_URL = 'yppt/getOrderDetail';
var ACCOUNT_PAY_URL = 'person/pay';
var Movie_Pay_URL = 'yppt/handoutQrcode';
var Movie_Del_URL = 'yppt/unLockSeats';

var MoviePay = React.createClass({

    mixins: [UtilsMixin,FilterMixin],

    statics: {
        title: 'Movie',
        description: '电影详情',
    },

    /**
     * 参数说明
     */
    propTypes: {

        /**
        * 导航容器
        * 必填
        */
        navigator: PropTypes.object.isRequired,

        /**
        * 路由
        * 必填
        */
        route: PropTypes.object.isRequired,

    },

    /**
     * 默认参数
     */
    getDefaultProps: function() {
        return {
        };
    },

    /**
    * 初始化状态
    */
    getInitialState: function () {

        return {
        	doRenderScene: false,
            orderId: this.props.id,
            accountInfo: {
                bankName: null,
                acctNo: null,
                bank_no: null,
                balance: 0
            },
            //orderId: '8a81a0d653c121fc0153c16b9ce1001b',
        };
    },

    _genRows: function(pressData: {[key: number]: boolean}): Array<string> {
        var dataBlob = [];       
        return dataBlob;
    },

    componentDidMount: async function() {
		InteractionManager.runAfterInteractions(async() => {
            await this.fetchData();
			this.setState({doRenderScene: true});
		});
	},

    /**
    * 渲染完成后接收参数变化
    */
    componentWillReceiveProps: function() {
    },

    refreshMoviePay: function() {
        this.fetchData();
    },

    bankList: function(){
        console.log('*****************acctNo******************************');
        console.log(this.props.acctNo);
        var nav = this.props.navigator ? this.props.navigator : this.props.rootNavigator;
        nav.push({
            title:'付款方式',
            component:BankList,
            passProps:{
                acctNo:this.props.acctNo,
                kind:'3',
                refresh:this.refresh
            },
        });
    },
    refresh: function(data){
        this.setState({
            accountInfo:{
                bankName : data.bankName,
                acctNo : data.acctNo,
                bank_no : data.bank_no,
                balance : data.balance
            }
        })
    },

    //付款
    pay: function(){
        if (this.state.accountInfo.acctNo == null) {
            Alert.alert(
                'Warning',
                '请选择支付账户!',
            );
            return;
        }
        let total = parseFloat(this.state.price);
        
        if (parseFloat(this.state.accountInfo.balance) < parseFloat(total)) {
            Alert.alert(
                'Warning',
                '账户余额不足!',
            );
            return;
        }
        
        this.props.navigator.push({
            component: InputPayPwd,
            hideNavBar: true,
            passProps: {
                    refreshMoviePay:this.refreshMoviePay,
                    //backRoute: this.props.backRoute,
                    pwdChecked: this.done,
            },
        });
    },

    done: async function() {
        this.showLoading();
        //调小管家后台，改账户余额
        try {
            let responseData1 = await this.request(Global.host + ACCOUNT_PAY_URL, {
                body: JSON.stringify({
                    mobile: Global.USER_LOGIN_INFO.mobile,
                    accountNum: this.state.accountInfo.acctNo,
                    price: this.state.price,
                }),
            });
           if(responseData1.status=='success'){
                AccountAction.updateAccount(responseData1.body);
            }
        } catch (e) {
            this.requestCatch(e);
        }

        //调影票接口
        try {
            console.log('hhhhhhhhhhhhhhhhhhhhhhhh');
            console.log(Global.movieHost+Movie_Pay_URL+'.do?payment_sn='+this.state.accountInfo.acctNo+'&order_code='+this.state.orderId+'&merchant_code=1&pay_status=0&pay_channel=PO_UPMP&amount='+this.state.price);

            let responseData = await this.request(Global.movieHost+Movie_Pay_URL+'.do?payment_sn=8&order_code='+this.state.orderId+'&merchant_code=1&pay_status=0&pay_channel=PO_UPMP&amount='+this.state.price);
            console.log('wwwwwwwwwwwww');
            console.log(responseData);
            console.log('oooooooooooooo');
            console.log(this.props.backRoute);
            if (responseData.return_code == '0'){
                this.props.navigator.popToRoute(this.props.backRoute); 
                this.toast('支付成功！');
            }else{
                this.toast('支付失败，请重新购买！');
            }
            
        } catch (e) {
            this.requestCatch(e);
        }
        //this.toDetail();
        this.hideLoading();
    },

    //取消订单，释放座位
    cancelOrder: function() {
        Alert.alert(
            '提示',
            '您确定要取消此笔订单吗？',
            [
                {text: '取消', style: 'cancel'},
                {text: '确定', onPress: () => this.doCancel()},
            ]
        );
    },

    doCancel: async function() {
        try {
            console.log('ddddddddddd');
            console.log(Global.movieHost+Movie_Del_URL+'.do?orderId='+this.state.orderId+'&userId='+Global.USER_LOGIN_INFO.id);
            let responseData = await this.request(Global.movieHost+Movie_Del_URL+'.do?orderId='+this.state.orderId+'&userId='+Global.USER_LOGIN_INFO.id);
            console.log('qqqqqqqq2222222229999');
            console.log(responseData);
            //this.data = responseData.data;
            this.setState({
                loaded: true,
            });
            this.hideLoading();
            if (responseData.return_code == '0') {
                console.log('gggggggggggggggoo');
                console.log(this.props.backRoute);
                this.props.navigator.popToRoute(this.props.backRoute); 
                this.toast('取消订单成功！');
            }else{
                Alert.alert("提示","订单取消未成功！");
            }
        } catch(e) {
            this.requestCatch(e);
        }
    },

    doCancel1: async function() {
        try {
            console.log('ddddddddddd');
            console.log(Global.movieHost+Movie_Del_URL+'.do?orderId='+this.state.orderId+'&userId='+Global.USER_LOGIN_INFO.id);
            let responseData = await this.request(Global.movieHost+Movie_Del_URL+'.do?orderId='+this.state.orderId+'&userId='+Global.USER_LOGIN_INFO.id);
            console.log('qqqqqqqq2222222229999');
            console.log(responseData);
            //this.data = responseData.data;
            this.setState({
                loaded: true,
            });
            this.hideLoading();
            if (responseData.return_code != '0') {
                Alert.alert("提示","订单取消未成功！");
            };
        } catch(e) {
            this.requestCatch(e);
        }
    },

    fetchData: async function() {

        try {
            let responseData = await this.request(Global.movieHost+MP_Detail_URL+'.do?orderId='+this.state.orderId);
            console.log('99999999999999999');
            console.log(responseData);
            
            this.data = responseData.data;
            var seats = '';
            for (var i = 0; i < this.data.tic.length; i++) {
                seats = seats + '  ' + this.data.tic[i].seatInfo;
            };
            this.setState({
                price: this.data.price,
                orderId: this.data.id,
                seatInfos: seats,
                loaded: true,
            });
            this.hideLoading();
        } catch(e) {
            this.requestCatch(e);
        }
    },

    //确认订单，跳转至支付页面
    // callCheck: function() {
    //     this.props.navigator.push({
    //         title: "支付",
    //         component: ChoosePay,
    //         passProps: {
    //             id: this.data.id,
    //             price: this.data.price,
    //             filmName: this.data.tic[0].filmName,
    //             backRoute:this.props.route,
    //             refresh: this.refresh,
    //         },
    //     });
    // },

    render: function() {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();
        //0-未支付 1、已支付2、订票成功  3、交易完成   4 在途  5已支付 锁座失败 6 发货成功 
        //7、发货失败(生成兑换码失败)  8、已退票  9、订单取消  10\退款中
        // var payStatView = null;
        // if(this.data.orderStatus === '0')
        //     payStatView = (<Text>未支付</Text>);
        // if(this.data.orderStatus === '1')
        //     payStatView = (<Text>已支付</Text>);
        // if(this.data.orderStatus === '2')
        //     payStatView = (<Text>订票成功</Text>);
        // if(this.data.orderStatus === '3')
        //     payStatView = (<Text>交易完成</Text>);
        // if(this.data.orderStatus === '4')
        //     payStatView = (<Text>在途</Text>);
        // if(this.data.orderStatus === '5')      
        //     payStatView = (<Text>已支付 锁座失败</Text>);
        // if(this.data.orderStatus === '8')
        //     payStatView = (<Text>已退票</Text>);
        // if(this.data.orderStatus === '9')
        //     payStatView = (<Text>订单取消</Text>);
        // if(this.data.orderStatus === '10')
        //     payStatView = (<Text>退款中</Text>);

        // var payButton = this.data.orderStatus'0' === '0' ?
        //     (
        //             <View style={[styles.itemButton]}>
        //                 <TouchableOpacity 
        //                     style={[Global.styles.CENTER, {height: 40, flex: 1, backgroundColor: Global.colors.IOS_BLUE, borderRadius: 3,}]} 
        //                     onPress={()=>{this.callCheck()}}>
        //                     <Text style={{color: '#ffffff',}}>确认订单</Text>
        //                 </TouchableOpacity>
        //                 <View style={{flex: 0.05}}></View>
        //                 <TouchableOpacity 
        //                     style={[Global.styles.CENTER, {height: 40, flex: 1, backgroundColor: Global.colors.IOS_BLUE, borderRadius: 3,}]} 
        //                     onPress={()=>{this.disCheck()}}>
        //                     <Text style={{color: '#ffffff',}}>取消订单</Text>
        //                 </TouchableOpacity>
        //             </View>):
        //     null;

        var choosePayView = (<View style={styles.container}>
                            <View style={styles.sv}>
                                <View style={[styles.full_sep_line,]} />
                                 <TouchableOpacity style={[styles.rend_row,]} onPress={()=>{this.bankList()}}>
                                    {this.state.accountInfo.bank_no != null?Global.bankLogos[this.state.accountInfo.bank_no]:<Icon style={{paddingLeft:11,paddingRight:11}} name="social-yen" size={20} color={Global.colors.IOS_RED}/>}
                                    <View style={{paddingLeft:10}}>
                                        <Text style={[styles.text],{fontSize:15}}>
                                        {this.state.accountInfo.bankName == null?'请选择支付账户':this.state.accountInfo.bankName}
                                        </Text>
                                        {this.state.accountInfo.acctNo == null?null:
                                            <Text style={[styles.text],{fontSize:12,color:'grey',paddingTop:5}}>
                                                {'尾号('+this.filterCardNumLast4(this.state.accountInfo.acctNo)+')'}
                                            </Text>}
                                    </View>
                                    <Icon name='ios-arrow-right' size={18} color={Global.colors.IOS_DARK_GRAY} style={[Global.styles.ICON, {width: 20,marginLeft: 135,}]} />
                                </TouchableOpacity>
                                {/*<View style={Global.styles.FULL_SEP_LINE} />
                                                                <View style={[styles.rend_row,{paddingTop:10,paddingBottom:10}]}>
                                                                    <Text style={{fontSize:15}}>{this.state.filmName}</Text>
                                                                    <Text style={{fontSize:15}}>{this.state.price}元</Text>
                                                                </View>*/}
                                <View style={[styles.full_sep_line,]} />
                                <View style={[{flex: 1, flexDirection: 'row', marginTop: 20}]}>
                                    <TouchableOpacity 
                                        style={[Global.styles.CENTER, {height: 40, flex: 1, backgroundColor: Global.colors.IOS_BLUE, borderRadius: 3,}]} 
                                        onPress={()=>{this.pay()}}>
                                        <Text style={{color: '#ffffff',}}>付款</Text>
                                    </TouchableOpacity>
                                    <View style={{flex: 0.05}}></View>
                                    <TouchableOpacity 
                                        style={[Global.styles.CENTER, {height: 40, flex: 1, backgroundColor: Global.colors.IOS_BLUE, borderRadius: 3,}]} 
                                        onPress={()=>{this.cancelOrder()}}>
                                        <Text style={{color: '#ffffff',}}>取消</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
        
                        </View>)
       
        return (
			<View style={Global.styles.CONTAINER}>
			    {this._getNavBar()}
                <View style={Global.styles.PLACEHOLDER20} />        
				<View style={[styles.sv]}>
                    <View style={[styles.full_sep_line,]} />
                   
                    <View style={[styles.item]}>
                        <View style={[styles.itemtext]}>
                            <Text style={{fontSize:18, color: Global.colors.FONT,}}>{this.data.tic[0].filmName}</Text>
                            <Text style={{fontSize:11,marginTop:5}}>({this.data.tic[0].copyLanguage}{this.data.tic[0].copyType})</Text>
                        </View>
                        <View style={[styles.itemtext2]}> 
                            <Text>{this.data.tic[0].cienmaName}</Text>
                        </View>
                        <View style={[styles.itemtext1]}>
                            <Text>{this.data.tic[0].waitDate.substring(0,10)} {this.data.tic[0].waitTime}</Text>
                        </View>
                        <View style={[styles.itemtext1]}>
                            <Text>{this.data.tic[0].hallName}{this.state.seatInfos}</Text>
                        </View>
                        <View style={[styles.itemtext1]}>
                            <Text>{this.filterMoney(this.data.tic[0].price)} x {this.data.buyCount}张 = <Icon name='social-yen' color={Global.colors.ORANGE}/><Text style={{color:Global.colors.ORANGE}}>{this.filterMoney(this.data.price)}</Text>元
                            </Text>
                        </View>
                        <View style={[styles.itemtext1]}>
                            <Text>
                                <Icon name="social-whatsapp-outline" size={20} color={Global.colors.ORANGE}/> {this.data.buyerPhone}
                            </Text>
                        </View>
                    </View>
                    <View style={[styles.full_sep_line,]} />
                </View>

                {choosePayView}
            	<View style={Global.styles.PLACEHOLDER20} />
		    </View>
        );       
    },

	_renderPlaceholderView: function() {
		return (
			<View style={Global.styles.CONTAINER}>
			    {this._getNavBar()}
			</View>
		);
	},
    
	_getNavBar: function() {
		return (
			<NavBar title='确认订单'
		    	navigator={this.props.navigator} 
				route={this.props.route} 
		    	hideBackButton={false} 
		    	hideBottomLine={false} 
		    	flow={false} 
                backFn={this.doCancel1}
				centerComponent={(
					<View style={[Global.styles.NAV_BAR.CENTER_VIEW, {flex: 2, flexDirection: 'row'}]} >
						<Text numberOfLines={1} style={[{fontSize: 16, color: '#000000'}]}>{this.state.navTitle}</Text>
					</View>
				)} />
		);
	},
});

var styles = StyleSheet.create({
    sv: {
    	//flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
    },
    item: {
        backgroundColor: '#ffffff', 
    },
    itemtext: {
        flexDirection: 'row',
        paddingLeft: 10,
    },
    itemtext1: {
        paddingLeft: 10,
    },
    itemtext2: {
        paddingLeft: 10,
        paddingTop:10,
    },
    itemButton: {
        flex: 1, 
        flexDirection: 'row', 
    },
    container: {
        //flex: 1,
        paddingTop: 10,
        backgroundColor: Global.colors.IOS_BG,
    },
    rend_row: {
        flexDirection: 'row',
        height:50,
        paddingLeft:10,
        backgroundColor:'#FFFFFF',
       // borderLeftWidth: 1 / PixelRatio.get(),
        //borderRightWidth: 1 / PixelRatio.get(),
        borderColor:Global.colors.TAB_BAR_LINE,
        alignItems: 'center',
    },
    text: {
        flex: 1,
    },
    full_sep_line: {
       //width: getScreen().width, 
        backgroundColor: Global.colors.IOS_SEP_LINE, 
        height: 1/PixelRatio.get(),
    },

});

module.exports = MoviePay;


