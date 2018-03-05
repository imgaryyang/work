'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../../Global');
var MngIdx = require('../mng/MngIdx');
var Checkbox = require('../lib/Checkbox');
var expenseDetail = require('./ExpenseDetail');
var loanDetail = require('./LoanDetail');

var UtilsMixin = require('../lib/UtilsMixin');
var FilterMixin = require('../../filter/FilterMixin');
var {
    Animated,
    StyleSheet,
    ScrollView,
    View,
    Text,
    Image,
    TouchableOpacity,
    TextInput,
    InteractionManager,
    ListView,
    Alert,
    Easing,
}=React;

var FIND_EXPENSE_URL = 'expense/findByLeader';
var FIND_LOAN_URL ='loan/findByLeader';
var UPDATE_LOAN_URL =   'loan/updateState';
var UPDATE_EXPENSE_URL =  'expense/updateState';


var ApproveList = React.createClass({

    mixins: [UtilsMixin, FilterMixin],
    data1 :[],
    data2 :[],
    getInitialState : function(){
        var ds1 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        var ds2 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            doRenderScene: false,
            dataSource1: ds1.cloneWithRows(this._genRows1({})),
            dataSource2: ds2.cloneWithRows(this._genRows2({})),
            showDialog : false,
            memo : '',
            isRefreshing: false,
            loaded: false,
            refreshCheckbox:false
        };
    },
    _genRows1: function(pressData: {[key: number]: boolean}): Array<string> {
        var dataBlob1 = [];
        /*for (var ii = 0; ii < 30; ii++) {
            var pressedText = pressData[ii] ? ' (pressed)' : '';
            dataBlob1.push('Row ' + ii + pressedText);
        }*/
        return dataBlob1;
    },
     _genRows2: function(pressData: {[key: number]: boolean}): Array<string> {
        var dataBlob2 = [];
        /*for (var ii = 0; ii < 30; ii++) {
            var pressedText = pressData[ii] ? ' (pressed)' : '';
            dataBlob2.push('Row ' + ii + pressedText);
        }*/
        return dataBlob2;
    },
    componentDidMount: function() {
        this.expenseIds =[];
        this.loanIds=[];
        InteractionManager.runAfterInteractions(() => {
            this.setState({doRenderScene: true});
            this.fetchData();

        });

    },
    fetchData: async function() {
        this.showLoading();
        this.setState({
            loaded: false,
            fetchForbidden: false,
        });
        try {
            let responseData = await this.request(Global.host +FIND_EXPENSE_URL, {
                body: JSON.stringify({
                    leader: Global.USER_LOGIN_INFO.id,
                    state: '1'
                }),
            });
            for (let i=0;i<responseData.body.length;i++) {
                responseData.body[i].submittime = this.filterDateFmt(responseData.body[i].submittime);
                responseData.body[i].state = this.stateFmt(responseData.body[i].state);
                switch (responseData.body[i].name) {
                    case '0':
                        responseData.body[i].name = '日常报销';
                        break;
                    case '1':
                        responseData.body[i].name = '差旅报销';
                        break;
                    default:
                        responseData.body[i].name = '日常报销';
                }
            }
            this.data1 = responseData.body;
            if(responseData.body.length != 0){
                this.data1s=JSON.stringify(responseData.body);
            }else{
                this.data1s='1';
            }
            this.setState({
                dataSource1: this.state.dataSource1.cloneWithRows(responseData.body),
                isRefreshing: false,
            });
            try {
                let responseData1 = await this.request(Global.host +FIND_LOAN_URL, {
                    body: JSON.stringify({
                        leader: Global.USER_LOGIN_INFO.id,
                        state: '1'
                    }),
                })
                for (let i=0;i<responseData1.body.length;i++) {
                    responseData1.body[i].time1 = this.filterDateFmt(responseData1.body[i].time1);
                    responseData1.body[i].state = this.stateFmt(responseData1.body[i].state);
                    switch (responseData1.body[i].loanname) {
                        case '0':
                            responseData1.body[i].loanname = '日常借款';
                            break;
                        case '1':
                            responseData1.body[i].loanname = '差旅借款';
                            break;
                        default:
                            responseData1.body[i].loanname = '日常借款';
                    }
                }
                this.data2 = responseData1.body;
                if (responseData1.body.length !=0 ) {
                    this.data2s = JSON.stringify(responseData1.body);
                } else {
                    this.data2s = '2';
                }
                this.setState({
                    dataSource2: this.state.dataSource2.cloneWithRows(responseData1.body),
                    isRefreshing: false,
                    loaded: true,
                });
                this.hideLoading();
            
                this.setState({refreshCheckbox:false});

            } catch (e) {
                this.hideLoading();
                this.setState({
                    isRefreshing: false,
                });
                if (e.status == 401 || e.status == 403)
                    this.setState({
                        fetchForbidden: true
                    });
                this.requestCatch(e);
            }
        } catch (e) {
            this.hideLoading();
            this.setState({
                isRefreshing: false,
            });

            if (e.status == 401 || e.status == 403)
                this.setState({
                    fetchForbidden: true
                });
            this.requestCatch(e);
        }

    },

    stateFmt:function(state){
        switch (state) {
                case '0':
                    return'未提交';
                case '1':
                    return '已提交';
                case '2':
                    state = '通过';
                case '3':
                    return '驳回';
                case '4':
                    return '结束';

            }
    },
    refreshApproveList: function() {
        this.setState({refreshCheckbox:true});
        this.fetchData();
    },
    pullToRefresh: function() {
        this.setState({isRefreshing: true,refreshCheckbox:true});
        this.fetchData();
    },
    showExpenseDetail:function(id){
        this.props.navigator.push({
                title: "报销单详情",
                component: expenseDetail,
                passProps: {
                    id: id
                },
            });
    },
    showLoanDetail: function(loanId) {
        this.props.navigator.push({
            title: "借款单详情",
            component: loanDetail,
            passProps: {
                loanId: loanId
            },
        });
    },
    onExpenseCheck : function(id){
        this.expenseIds.push(id);
        console.log(this.expenseIds);
    },
    unExpenseCheck : function(id){
        let idx = this.expenseIds.indexOf(id);
        this.expenseIds.splice(idx,1);
        console.log(this.expenseIds);
    },
    onLoanCheck : function(loanId){
        this.loanIds.push(loanId);
        console.log(this.loanIds);
    },
    unLoanCheck : function(loanId){
        let idx = this.loanIds.indexOf(loanId);
        this.loanIds.splice(idx,1);
        console.log(this.loanIds);
    },
    agree:function(){
        let count = this.expenseIds.length+this.loanIds.length;
        if(count == 0){
             Alert.alert(
                'Warning',
                '请选择要审批的申请！', 
            );
        }else{
            Alert.alert(
                '操作确认',
                '确定同意这' + count + '条申请?', 
                [{
                    text: 'Cancel'
                }, {
                    text: 'OK',
                    onPress: () => this.checkLoanAndExpense(2)
                }, ]
            );
        }
        
    },
    disagree : function(){
        let count = this.expenseIds.length+this.loanIds.length;
         if(count == 0){
             Alert.alert(
                'Warning',
                '请选择要审批的申请！', 
            );
        }else{
            //TODO 弹出框输入审批信息
            this.setState({
                showDialog : true
            });
        }
    },
    doDisagree:function(memo){
        this.setState({memo : memo});
        this.checkLoanAndExpense(3);
        this.setState({
                showDialog : false
            });
    },
    checkLoanAndExpense:async function(flag) {
        this.showLoading();
        console.log(this.state.memo);
        try {
            let responseData = await this.request(Global.host +UPDATE_EXPENSE_URL, {
                body: JSON.stringify({
                    state: flag,
                    expenseIds: this.expenseIds,
                    memo2: this.state.memo
                }),
            });
        } catch (e) {
            this.hideLoading();
            this.requestCatch(e);
        }
        try {
            let responseData1 = await this.request(Global.host +UPDATE_LOAN_URL, {
                body: JSON.stringify({
                    state: flag,
                    loanIds: this.loanIds,
                    memo: this.state.memo
                }),
            });
        } catch (e) {
            this.hideLoading();
            this.requestCatch(e);
        }
        this.fetchData();
        this.loanIds = [];
        this.expenseIds = [];
        this.hideLoading();

    },
    render : function(){
        var listView = null;
        if(!this.state.doRenderScene)
            return this._renderPlaceholderView();

        var refreshText = this.state.fetchForbidden === true ? 
            '您还未登录，登录后点击此处刷新数据' : 
            '暂无需要审批的申请，点击此处重新载入';
        var refreshView = (this.state.loaded || this.state.fetchForbidden) && this.data1.length === 0 && this.data2.length===0  ?
            this.getListRefreshView(refreshText, this.refreshApproveList) : 
            null;
        var footBar =  this.data1.length === 0 && this.data2.length===0  ?
            null : 
             (<View style={[styles.footBar,Global.styles.CENTER]}>
                                 <TouchableOpacity style={[styles.footBarBtn,Global.styles.CENTER,Global.styles.BORDER]} onPress={()=>{this.agree()}}>
                                     <Text style={{textAlign:'center',color:'#FFFFFF',fontSize:16}}>同意</Text>
                                 </TouchableOpacity>
                                 <TouchableOpacity style={[styles.footBarBtn,Global.styles.CENTER,Global.styles.BORDER]} onPress={()=>{this.disagree()}}>
                                     <Text style={{textAlign:'center',color:'#FFFFFF',fontSize:16}}>驳回</Text>
                                 </TouchableOpacity>
                             </View>);
        return (
            <View style={styles.container}>
                <ScrollView 
                automaticallyAdjustContentInsets={false} 
                refreshControl={this.getRefreshControl(this.pullToRefresh)} >
                    <View style={styles.placeholder} />
                    {refreshView}
                       <ListView
                        key={this.data1s}
                        dataSource={this.state.dataSource1}
                        renderRow={this.renderExpenseItem}
                        style={[styles.list]} />
                        <ListView
                        key={this.data2s}
                        dataSource={this.state.dataSource2}
                        renderRow={this.renderLoanItem}
                        style={[styles.list]} />
                    <View style={{flex: 1, height: 40,}} />
                </ScrollView>
                
                {footBar}
                <Dialog show={this.state.showDialog} title={'批注'} ok={this.doDisagree} cancel={()=>{this.setState({showDialog:false})}}/>
            </View>
       );

    },
    renderExpenseItem: function(item: string, sectionID: number, rowID: number) {
        //console.log(rowID);
        var topLine = rowID === '0' ? <View style={Global.styles.FULL_SEP_LINE} /> : null;
        var bottomLine = (<View style={Global.styles.FULL_SEP_LINE} />);
        return (
            <View>
                {topLine}
               <TouchableOpacity style={[styles.item, Global.styles.CENTER, ]} onPress={()=>{this.showExpenseDetail(item.id);}}>
                    {/*<View style={{marginLeft:20,flex:1,flexDirection:'column'}}>
                                            <View style={{flex:1,flexDirection:'row'}}>
                                                <Checkbox style={{flex:1,marginLeft:10}} color={Global.colors.IOS_BLUE}  size={20} onCheck={()=>{this.onExpenseCheck(item.id);}} onUncheck={()=>{this.unExpenseCheck(item.id);}}/>
                                                <Text style={{flex: 3, marginLeft: 10, fontSize: 15,fontWeight:'bold'}}>名称：{item.name}</Text>
                                            </View>
                                            <View style={{flex:1,flexDirection:'row',flexWrap:'nowrap'}}>
                                                <Text style={{flex: 1, marginLeft: 10,fontSize: 15}}>状态:{item.state}</Text>
                                                <Text style={{flex: 1, marginLeft: 10,fontSize: 15}}>￥{item.totalamt}</Text>
                                            </View>
                                            <View  style={{flex:1,flexDirection:'row',flexWrap:'nowrap'}} >
                                                <Text style={{flex: 1, marginLeft: 10,fontSize: 15}}>提交时间:{item.submittime}</Text>
                                            </View>
                                        </View>
                    */}
                    <Checkbox  style={{marginLeft:20}} color={Global.colors.IOS_BLUE}  refresh={this.state.refreshCheckbox} onCheck={()=>{this.onExpenseCheck(item.id);}} onUncheck={()=>{this.unExpenseCheck(item.id);}}/>
                    <View style={{marginLeft:10,flex:1,flexDirection:'row'}}>
                        <View style={{flex:4,flexDirection:'column'}}>
                             <View style={{flex:1,flexDirection:'row',flexWrap:'nowrap'}}>
                                <Text style={{flex: 1, marginLeft: 10, fontSize: 15,fontWeight:'bold'}}>{item.name}</Text>
                            </View>
                            <View  style={{flex:1,flexDirection:'row',flexWrap:'nowrap'}} >
                                <Text style={{flex: 1, marginLeft: 10,fontSize: 15}}>提交人:{item.custId.name}</Text>
                            </View>
                            <View  style={{flex:1,flexDirection:'row',flexWrap:'nowrap'}} >
                                <Text style={{flex: 1, marginLeft: 10,fontSize: 12}}>提交时间：{item.submittime}</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={{flex: 0.5, marginLeft: 10,fontSize: 15,color:Global.colors.ORANGE,textAlign: 'right'}}>￥{this.filterMoney(item.totalamt)}</Text>
                    <Icon name='ios-arrow-right' size={18} color={Global.colors.IOS_DARK_GRAY} style={[Global.styles.ICON, {width: 20}]} />

                </TouchableOpacity>
                {bottomLine}
            </View>
        );
    },
    renderLoanItem: function(item: string, sectionID: number, rowID: number) {
        //console.log(rowID);
        var topLine = rowID === '0' ? <View style={Global.styles.FULL_SEP_LINE} /> : null;
        var bottomLine = (<View style={Global.styles.FULL_SEP_LINE} />);
        return (
            <View>
                {topLine}
               <TouchableOpacity style={[styles.item, Global.styles.CENTER, ]} onPress={()=>{this.showLoanDetail(item.loanId);}}>
                    {/*<View style={{marginLeft:20,flex:1,flexDirection:'column'}}>
                                            <View style={{flex:1,flexDirection:'row'}}>
                                                <Checkbox style={{flex:1,marginLeft:10}} color={Global.colors.IOS_BLUE} size={20} onCheck={()=>{this.onLoanCheck(item.loanId);}} onUncheck={()=>{this.unLoanCheck(item.loanId);}}/>
                                                <Text style={{flex: 3, marginLeft: 10, fontSize: 15,fontWeight:'bold'}}>名称：{item.loanname}</Text>
                                            </View>
                                            <View style={{flex:1,flexDirection:'row',flexWrap:'nowrap'}}>
                                                <Text style={{flex: 1, marginLeft: 10,fontSize: 15}}>状态:{item.state}</Text>
                                                <Text style={{flex: 1, marginLeft: 10,fontSize: 15}}>￥{item.loanamt}</Text>
                                            </View>
                                            <View  style={{flex:1,flexDirection:'row',flexWrap:'nowrap'}} >
                                                <Text style={{flex: 1, marginLeft: 10,fontSize: 15}}>提交时间:{item.time1}</Text>
                                             </View>
                                        </View>*/}
                    <Checkbox  style={{marginLeft:20}} color={Global.colors.IOS_BLUE}  refresh={this.state.refreshCheckbox} onCheck={()=>{this.onLoanCheck(item.loanId);}} onUncheck={()=>{this.unLoanCheck(item.loanId);}}/>
                    <View style={{marginLeft:10,flex:1,flexDirection:'row'}}>
                        <View style={{flex:4,flexDirection:'column'}}>
                             <View style={{flex:1,flexDirection:'row',flexWrap:'nowrap'}}>
                                <Text style={{flex: 1, marginLeft: 10, fontSize: 15,fontWeight:'bold'}}>{item.loanname}</Text>
                            </View>
                            <View  style={{flex:1,flexDirection:'row',flexWrap:'nowrap'}} >
                                <Text style={{flex: 1, marginLeft: 10,fontSize: 15}}>提交人:{item.custId.name}</Text>
                            </View>
                            <View  style={{flex:1,flexDirection:'row',flexWrap:'nowrap'}} >
                                <Text style={{flex: 1, marginLeft: 10,fontSize: 12}}>提交时间：{item.time1}</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={{flex: 0.5, marginLeft: 10,fontSize: 15,color:Global.colors.ORANGE,textAlign:'right'}}>￥{this.filterMoney(item.loanamt)}</Text>
                    <Icon name='ios-arrow-right' size={18} color={Global.colors.IOS_DARK_GRAY} style={[Global.styles.ICON, {width: 20}]} />

                </TouchableOpacity>
                {bottomLine}
            </View>
        );
    },
    _renderPlaceholderView: function() {
        return (
            <View>
                <NavBar 
                    rootNavigator={this.props.rootNavigator} 
                    navigator={this.props.navigator} 
                    route={this.props.route} />
            </View>
        );
    },

});
//添加批注对话框
var Dialog = React.createClass({
    getInitialState() {
        return {
            top: new Animated.Value(Global.getScreen().height),
            memo : null
        };
    },

    show: function() {
        Animated.timing(
            this.state.top,
            {
                toValue: 0,
                duration: 100,
                easing: Easing.inOut(Easing.ease),
                delay: 0,
            },
        ).start();
    },

    hide: function() {
        Animated.timing(
            this.state.top,
            {
                toValue: Global.getScreen().height,
                duration: 100,
                easing: Easing.inOut(Easing.ease),
                delay: 0,
            },
        ).start();
    },

    /**
    * 组件接收参数变化
    */
    componentWillReceiveProps: function(props) {
        console.log(props.show);
        if(props.show) {
            this.show();
            //this.setState({top: 0});
        } else {
            this.hide();
            //this.setState({top: ENV.SCREEN.height});
        }
    },

    /**
    * 点击确认按钮触发
    */
    ok: function() {
        if(this.state.memo =='' || this.state.memo==null){
            Alert.alert(
                'Warning',
                '请填写批注!',
            );
            return;
        }
        this.hide();
        if(this.props.ok)
            this.props.ok(this.state.memo);
        this.setState({memo:null});
    },

    /**
    * 点击取消按钮触发
    */
    cancel: function() {
        this.hide();
        this.setState({memo : null});
        if(this.props.cancel)
            this.props.cancel.call();
    },

    render() {
        var title = this.props.title ? this.props.title : '提示';
        return (
            <Animated.View style={[styles.dialogContainer, Global.styles.CENTER, {top: this.state.top}]}>
                <View style={[Global.styles.CENTER, styles.msgContainer]}>
                    <Icon name='ios-information' size={25} color={Global.colors.ORANGE} style={[Global.styles.ICON, styles.icon]} />
                    <Text style={[styles.title]}>{title}</Text>
                    <View style={styles.separator}></View>
                    <View style={[styles.rowInputHolder,Global.styles.CENTER]}>
                        <Text style={{width:60}}>批注：</Text>
                        <TextInput  style={styles.rowInput} value={this.state.memo} placeholder="请填写批注" onChangeText={(value) => {this.setState({memo:value})}}/>
                    </View>
                    <View style={[styles.buttonContainer]}>
                        <TouchableOpacity style={[Global.styles.CENTER, styles.button, {marginRight: 5}]} onPress={this.ok}>
                            <Text style={styles.buttonText}>确定</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[Global.styles.CENTER, styles.button, {marginLeft: 5}]} onPress={this.cancel}>
                            <Text style={styles.buttonText}>取消</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
        );
    },
});
var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Global.colors.IOS_GRAY_BG,
    },
    sv: {
        
    },
    placeholder: {
        flex: 1,
        height: Global.NBPadding+20 ,
    },
    list: {
    },
    item: {
        width: Global.getScreen().width ,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        borderBottomWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        padding: 10,
        paddingLeft: 0,
        paddingRight: 20,
    },
    footBar: {
        flex: 1,
        width: Global.getScreen().width,
        height: 40,
        position: 'absolute',
        bottom: 0,
        left: 0,
        flexDirection: 'row'
    },
    footBarBtn: {
        flex: 1,
        backgroundColor: Global.colors.IOS_BLUE,
        height: 40
    },
    // ---------------------------------------------------
    dialogContainer:{
        width: Global.getScreen().width,
        height: Global.getScreen().height,
        position: 'absolute',
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, .75)',
        overflow: 'hidden',
    },
    msgContainer: {
        width: 300, 
        backgroundColor: '#ffffff', 
        borderRadius: 5,
    },
    icon: {
        position: 'absolute',
        top: 10,
        left: 10,
    },
    title: {
        fontWeight: '700',
        fontSize: 16,
        color: Global.colors.FONT_GRAY,
        margin: 15,
    },
    msg: {
        margin: 20,
    },
    buttonContainer: {
        width: 220,
        flexDirection: 'row',
    },
    button: {
        flex: 1,
        width: 100,
        height: 40, 
        backgroundColor: Global.colors.IOS_BLUE, 
        borderRadius: 3, 
        marginTop: 10,
        marginBottom: 20,
    },
    buttonText: {
        color: '#ffffff',
    },
    separator: {
        width: 260, 
        backgroundColor: Global.colors.NAV_BAR_LINE, 
        height: 1/Global.pixelRatio,
    },
    rowInputHolder: {
        flex: 1, 
        marginLeft: 1, 
        flexDirection: 'row', 
        borderWidth: 1 / Global.pixelRatio, 
        borderColor: Global.colors.IOS_SEP_LINE, 
        borderRadius: 3,
    },
    rowInput: {
        flex: 1,
        width:200, 
        height:40,
        borderWidth: 0, 
        backgroundColor: 'transparent'
    },
});
module.exports = ApproveList;