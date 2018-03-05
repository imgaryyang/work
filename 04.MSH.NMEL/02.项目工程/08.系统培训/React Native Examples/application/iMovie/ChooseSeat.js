/**
 * 选座
 */
'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../Global');
var NavBar = require('../view/NavBar');
var UtilsMixin = require('../view/lib/UtilsMixin');
var FilterMixin = require('../filter/FilterMixin');

var orderConfirm = require('./MoviePay');
var {
    TouchableOpacity,
    ScrollView,
    View,
    Text,
    StyleSheet,
    PropTypes,
    Image,
    InteractionManager,
    Alert
} = React;

var FIND_SEAT_URL = 'yppt/getSeatStateByWaitNo.do';
var LOCK_SEATS_URL = 'yppt/lockSeat.do';
var ChooseSeat = React.createClass({

    mixins: [UtilsMixin,FilterMixin],

    statics: {
        title: 'ChooseSeat',
        description: '选座购票',
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

        //排期信息
        schedule : PropTypes.object.isRequired,

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
            iconFlag:false

        };
    },



    componentDidMount:async function() {
           
        this.seatStars= [],
        this.seats=[];
        this.graphRows=[];
        this.iconName=[];
        this.iconColor = [];
        this.selectedSeats=[];

		InteractionManager.runAfterInteractions(async () => {
            await this.fetchData();
            this.setState({doRenderScene: true});
		});
	},

    /**
    * 渲染完成后接收参数变化
    */
    componentWillReceiveProps: function(props) {
    },
    fetchData: async function() {
        this.showLoading();
        try {
            console.log(Global.movieHost + FIND_SEAT_URL + '?waitNo=' + this.props.schedule.waitNo);
            let responseData = await this.request(Global.movieHost + FIND_SEAT_URL + '?waitNo=' + this.props.schedule.waitNo, {
                method: 'GET'
            });
            if (responseData.return_code == '0') {
                // console.log(responseData.seatStars);
                for (let i = 0; i < responseData.seatStars.length; i++) {
                    if (this.graphRows.indexOf(responseData.seatStars[i].graphRow) < 0) {
                        this.graphRows.push(responseData.seatStars[i].graphRow);
                    }
                }
                for (var j = 0; j < this.graphRows.length; j++) {
                    this.seats[j] = [];
                    for (let i = 0; i < responseData.seatStars.length; i++) {
                        if (responseData.seatStars[i].graphRow == this.graphRows[j]) {
                            this.seats[j].push(responseData.seatStars[i]);
                        }
                    }
                }
                this.seatStars = responseData.seatStars;
            }
            this.hideLoading();
            return true;

        } catch (e) {
            this.requestCatch(e);
        }
    },

    submit :async  function(){
        if(this.selectedSeats.length >5){
            Alert.alert('提示','选座不能超过5个！');
            return;
        }
        this.showLoading();
        this.seatNos = '';
        for(let i =0; i<this.selectedSeats.length;i++){
            if(i == 0){
                this.seatNos = this.seatNos + this.selectedSeats[i].seatNo;

            }else{
                this.seatNos = this.seatNos +','+ this.selectedSeats[i].seatNo;
            }
        }
        try {
            console.log(Global.movieHost+LOCK_SEATS_URL+'?userId='+Global.USER_LOGIN_INFO.id+'&seatNo='+this.seatNos+'&waitNo='+this.props.schedule.waitNo+'&telPhone='+Global.USER_LOGIN_INFO.mobile+'&time1='+new Date().getTime());
            let responseData = await this.request(Global.movieHost+LOCK_SEATS_URL+'?userId='+Global.USER_LOGIN_INFO.id+'&seatNo='+this.seatNos+'&waitNo='+this.props.schedule.waitNo+'&telPhone='+Global.USER_LOGIN_INFO.mobile+'&time1='+new Date().getTime(), {
                    method:'GET'
            });
            console.log(responseData);
            this.hideLoading();
            if (responseData.return_code == '0') {
                this.props.navigator.push({
                    title: '确认订单',
                    component: orderConfirm,
                    hideNavBar: true,
                    passProps: {
                        id: responseData.orderInfo.id,
                        backRoute: this.props.backRoute,

                    },
                });
            }else{
                Alert.alert("提示","订单提交未成功！");
            }
        } catch(e) {
            this.requestCatch(e);
        }
    },
    render: function() {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();
        var choosedSeats = null;
        var btnStyle= null;
        var btnPress = null;
        if (this.selectedSeats.length == 0){
            btnStyle =Global.styles.GRAY_BTN;
        }else{
            choosedSeats = (
                <View style={{paddingLeft:20,paddingTop:10,paddingBottom:10,flex:1,flexDirection:'row',flexWrap:'wrap',borderColor:Global.colors.IOS_SEP_LINE,borderBottomWidth:1/Global.pixelRatio,borderTopWidth:1/Global.pixelRatio,backgroundColor:'#ffffff'}}>
                    <Text style={{fontSize:15,color:Global.colors.ORANGE}}>已选座位：</Text>
                    {this.displaySelectedSeats()}
                </View>);
            btnStyle = Global.styles.BLUE_BTN;
            btnPress = this.submit;
        }

        var seatView = null;
        if(this.seatStars.length >0){
            seatView = (<ScrollView style={Global.styles.BORDER,{paddingTop:10,paddingBottom:10,backgroundColor:'#ffffff'}}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={true} style={styles.seatList}>
                            <View style={[{flex:1},Global.styles.CENTER]}>
                                <View style={[{flex:1},Global.styles.CENTER]}>
                                    <Text style={{fontSize:20}}>银幕中央</Text>
                                    <View style={{flex:1,flexDirection:'row'}}>
                                        <Icon name='android-checkbox-outline-blank' size={25} color='#007AFF' style={[Global.styles.ICON]} />
                                        <Text style={{marginRight:5}}>可选座位</Text>
                                        <Icon name='android-checkbox-blank' size={25} color={Global.colors.IOS_LIGHT_GRAY} style={[Global.styles.ICON]} />
                                        <Text style={{marginRight:5}}>已售座位</Text>
                                        <Icon name='android-checkbox' size={25} color='#4CD964' style={[Global.styles.ICON]} />
                                        <Text>已选座位</Text>
                                    </View>
                                </View>
                                <View style={{flex:1,marginRight:20}}>
                                    {this.displaySeats()}
                                </View>
                            </View>
                        </ScrollView>
                    </ScrollView>);
        }else{
            seatView = (
                    <View style={[Global.styles.CENTER,{marginTop:10,marginBottom:10}]}>
                        <Text style={{fontSize:20}}>该场次暂不支持在线选座。</Text>
                    </View>
                )
        }
        return (
			<View style={Global.styles.CONTAINER}>
			    {this._getNavBar()}
				<ScrollView style={[styles.sv]}>
                    <View style={Global.styles.PLACEHOLDER20}/>
                    <View style={Global.styles.FULL_SEP_LINE} />
                    <View style={{flex:1,padding:10,paddingLeft:20,backgroundColor:'#ffffff',height:65}}>
                        <View style={{flex:1,flexDirection:'row'}}>
                            <Text style={{flex:1,fontSize:15,fontWeight:'bold'}}>{this.props.schedule.filmName}</Text>
                            <Text style={{flex:1,fontSize:15,color:Global.colors.ORANGE,fontWeight:'bold'}}>￥{this.filterMoney(this.props.schedule.standardPrice)}</Text>
                        </View>
                        
                        <View style={{flex:1,flexDirection:'row'}}>
                            <Text style={{flex:1}}>{this.props.schedule.cinemaName}</Text>
                            <Text style={{flex:1}}>{this.props.schedule.waitTime}</Text>
                        </View>
                    </View>
					<View style={Global.styles.FULL_SEP_LINE} />
                    <View style={Global.styles.PLACEHOLDER20}/>

                    <View style={Global.styles.FULL_SEP_LINE} />
                        {seatView}
                    <View style={Global.styles.FULL_SEP_LINE} />
                    <View style={Global.styles.PLACEHOLDER20}/>
                    {choosedSeats}
                    <View style={Global.styles.PLACEHOLDER20}/>
                    <TouchableOpacity 
                        style={[Global.styles.BLUE_BTN, {margin: 20},btnStyle]} 
                        onPress={btnPress} >
                        <Text style={{color:'#FFFFFF'}}>确认提交</Text>
                    </TouchableOpacity>
                    <View style={Global.styles.PLACEHOLDER40}/>
			    </ScrollView>
		    </View>
        );
        
    },
    displaySelectedSeats:function(){
        return this.selectedSeats.map((item,idx)=>{
            return(
                    <Text key={'txt_'+idx} style={{paddingLeft:10,fontSize:15,color:Global.colors.IOS_BLUE}}>{item.graphRow}排{item.seatCol}列</Text>
                );
        }); 
    },
    chooseSeat : function(seatNo,iconsId,seatState,i,idx){
        if(seatState == '0'){
            this.seats[i][idx].seatState ='10';
            this.selectedSeats.push(this.seatStars[iconsId]);
        }else {
            this.seats[i][idx].seatState ='0';
            for(let i=0; i<this.selectedSeats.length;i++){
                if(seatNo == this.selectedSeats[i].seatNo){
                    this.selectedSeats.splice(i,1);
                    break;
                }
            }
        }
        this.setState({
            iconFlag: !this.state.iconFlag,
        });
    },
   
    displaySeats:function(){
        if(this.graphRows.length >0){
            this.idxs = -1;
            return this.graphRows.map((item,idx)=>{
                    return(
                        <View key={'key_'+item} style={{flexDirection:'row',flex:1}}>
                            <View style={[styles.seatHolder,{marginLeft:20},Global.styles.CENTER]}>
                                <Text style={{}}>{item}</Text>
                            </View>
                            {this.showRow(idx)}
                        </View>);
            });
        }
    },
    
    showRow:function(i){
        console.log('showRow'+i);
        var col =0;
        return this.seats[i].map(
            ({seatNo,graphRow,graphCol,seatRow, seatCol, seatState,ticketPrice}, idx) => {
                this.idxs = this.idxs +1;
                let iconsId = this.idxs;
                var holder = null;
                col = col + 1;
                if(eval(col) == eval(graphCol)){
                    if(seatState === '0'){
                        return (<TouchableOpacity key={'seat_'+seatNo} style={[styles.seatHolder,Global.styles.CENTER]} onPress={() => {this.chooseSeat(seatNo,iconsId,seatState,i,idx)}} >
                                   <Icon name='android-checkbox-outline-blank' size={28} color='#007AFF' style={[Global.styles.ICON]} />
                                </TouchableOpacity>);
                    }else if(seatState ==='10'){
                        return (<TouchableOpacity key={'seat_'+seatNo} style={[styles.seatHolder,Global.styles.CENTER]}  onPress={() => {this.chooseSeat(seatNo,iconsId,seatState,i,idx)}} >
                                    <Icon name='android-checkbox' size={28} color='#4CD964' style={[Global.styles.ICON]} />
                                </TouchableOpacity>);
                    }else{
                        return (<View key={'seat_'+seatNo} style={[styles.seatHolder,Global.styles.CENTER]} >
                                    <Icon name='android-checkbox-blank' size={28} color={Global.colors.IOS_LIGHT_GRAY} style={[Global.styles.ICON]} />
                                </View>);
                    }
                }else{
                    var count = graphCol - col;
                    col = col + count;

                    var holderWidth = 0;
                    for ( var k = 0; k < count; k++) {
                         holderWidth  = holderWidth + 30;
                        
                    }
                    holder = (<View style={[{width:holderWidth},Global.styles.CENTER]}/>);
                    if(seatState === '0'){
                        return (
                                <View  key={'seat_'+seatNo} style={{flexDirection:'row'}}>
                                    {holder}
                                    <TouchableOpacity  style={[styles.seatHolder,Global.styles.CENTER]} onPress={() => {this.chooseSeat(seatNo,iconsId,seatState,i,idx)}} >
                                       <Icon name='android-checkbox-outline-blank' size={28} color='#007AFF' style={[Global.styles.ICON]} />
                                    </TouchableOpacity>
                                </View>);
                    }else if(seatState ==='10'){
                        return (
                                <View  key={'seat_'+seatNo} style={{flexDirection:'row'}}>
                                    {holder}
                                    <TouchableOpacity  style={[styles.seatHolder,Global.styles.CENTER]}  onPress={() => {this.chooseSeat(seatNo,iconsId,seatState,i,idx)}} >
                                        <Icon name='android-checkbox' size={28} color='#4CD964' style={[Global.styles.ICON]} />
                                    </TouchableOpacity>
                                </View>);
                    }else{
                        return (
                                <View key={'seat_'+seatNo} style={{flexDirection:'row'}}>
                                    {holder}
                                    <View  style={[styles.seatHolder,Global.styles.CENTER]} disable={true}>
                                        <Icon name='android-checkbox-blank' size={28} color={Global.colors.IOS_LIGHT_GRAY} style={[Global.styles.ICON]} />
                                    </View>
                                </View>);
                    }
                }
                
            });
    },
    
    displaySeats1 : function(){
        if(this.seatStars.length >0){
            console.log('let us map !--------------------------');
            var seatR = 1;
            var left = 0;
            var top = 0;
           return this.seatStars.map(
                ({seatNo,graphRow,graphCol,seatRow, seatCol, seatState,ticketPrice}, idx) => {
                    console.log('seatRow---'+seatRow);
                    if(idx == 0){
                         left = 10 ;
                         top = 10 ;
                    }else{
                        if(seatRow == seatR){
                           left =60;
                           top = 0;
                        }else{
                            seatR = seatRow;
                            left = 10 - left;
                            top = 30;
                        }
                    }
                    
                    console.log('top ====== '+top);
                    if(seatState === '0'){
                            return (<TouchableOpacity key={'_key'+seatNo} style={[styles.seatHolder,{position:'relative',top:top,left:left},Global.styles.CENTER]} onPress={() => {this.chooseSeat(seatNo,iconsId,seatState,i,idx)}} >
                                       <Icon name='android-checkbox-outline-blank' size={28} color='#007AFF' style={[Global.styles.ICON]} />
                                    </TouchableOpacity>);
                        }else if(seatState ==='10'){
                            return (<TouchableOpacity key={'_key'+seatNo} style={[styles.seatHolder,{position:'relative',top:top,left:left},Global.styles.CENTER]}  onPress={() => {this.chooseSeat(seatNo,iconsId,seatState,i,idx)}} >
                                        <Icon name='android-checkbox' size={28} color='#4CD964' style={[Global.styles.ICON]} />
                                    </TouchableOpacity>);
                        }else{
                            return (<View key={'_key'+seatNo} style={[styles.seatHolder,{position:'relative',top:top,left:left},Global.styles.CENTER]} >
                                        <Icon name='android-checkbox-blank' size={28} color={Global.colors.IOS_LIGHT_GRAY} style={[Global.styles.ICON]} />
                                    </View>);
                        } 
                });
        }
    },
	_renderPlaceholderView: function() {
		return (
			<View style={Global.styles.CONTAINER}>
			    {this._getNavBar()}
                <ScrollView style={[styles.sv]}>
                    <View style={Global.styles.PLACEHOLDER20}/>
                    <View style={Global.styles.FULL_SEP_LINE} />
                    <View style={{flex:1,padding:10,paddingLeft:20,backgroundColor:'#ffffff',height:65}}>
                        <View style={{flex:1,flexDirection:'row'}}>
                            <Text style={{flex:1,fontSize:15,fontWeight:'bold'}}>{this.props.schedule.filmName}</Text>
                            <Text style={{flex:1,fontSize:15,color:Global.colors.ORANGE,fontWeight:'bold'}}>￥{this.filterMoney(this.props.schedule.standardPrice)}</Text>
                        </View>
                        
                        <View style={{flex:1,flexDirection:'row'}}>
                            <Text style={{flex:1}}>{this.props.schedule.cinemaName}</Text>
                            <Text style={{flex:1}}>{this.props.schedule.waitTime}</Text>
                        </View>
                    </View>
                    <View style={Global.styles.FULL_SEP_LINE} />
                </ScrollView>
			</View>
		);
	},

	_getNavBar: function() {
		return (
			<NavBar title='选座购票' 
		    	navigator={this.props.navigator} 
				route={this.props.route} 
		    	hideBackButton={false} 
		    	hideBottomLine={false} 
		    	flow={false} />
		);
	},
});

var styles = StyleSheet.create({
    sv: {
    	flex: 1,
    },
    seatList:{
        flex: 1,
        overflow: 'hidden', 
        backgroundColor: 'transparent',
    },
    seatHolder:{
        width:30,
        height:30
    }
});

module.exports = ChooseSeat;


