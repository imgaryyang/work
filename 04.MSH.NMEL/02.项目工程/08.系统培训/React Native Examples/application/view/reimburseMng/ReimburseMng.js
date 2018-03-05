'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../../Global');
var MngIdx = require('../mng/MngIdx');
var costList = require('./CostList');
var loanHisList = require('./LoanHisList');
var expenseHisList = require('./ExpenseHisList');
var expenseList = require('./ExpenseList');
var loanList = require('./LoanList');
var approveList = require('./ApproveList');
var payList = require('./PayList');
var UtilsMixin = require('../lib/UtilsMixin');
var FilterMixin = require('../../filter/FilterMixin');
var TimerMixin = require('react-timer-mixin');
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
	ListView
}=React;


var ReimburseMng = React.createClass({

    mixins: [UtilsMixin, TimerMixin,FilterMixin],
    
    getInitialState: function() {
        // let role = this.props.USER_LOGIN_INFO && this.props.USER_LOGIN_INFO.role ? this.props.USER_LOGIN_INFO.role : 0;
        return {
            doRenderScene: false,
            role: Global.USER_LOGIN_INFO.role, //0 - 普通用户 ； 1 - 企业主 ； 2 - 企业员工
            appendMenuRendered: false,
        };
    },

	list_boss: [
        
        {text: '借款报销审批', icon: 'android-create', component: approveList,hideNavBar:false},
        {text: '借款报销发放', icon: 'social-usd', component: payList,hideNavBar:false},
        {text: '报销历史查询', icon: 'clipboard', component: expenseHisList,hideNavBar:true},
        {text: '借款历史查询', icon: 'android-list', component: loanHisList,hideNavBar:true},
    ],
    list_empl: [
        {text: '消费记录', icon: 'clipboard', component: costList,hideNavBar:true},
        {text: '报销单', icon: 'android-list', component: expenseList,hideNavBar:true},
        {text: '借款单', icon: 'ios-paper', component: loanList,hideNavBar:true},
    ],
    componentDidMount: function() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({doRenderScene: true});
        });
    },
	push: function(title, component,hideNavBar) {
    	var nav = this.props.navigator ? this.props.navigator : this.props.rootNavigator;
        nav.push({
            title: title,
            component: component,
            hideNavBar: hideNavBar?true:false,
        });
    },

	_renderList: function() {
        let services = [];
        console.log(this.state.role);
        if      (this.state.role == 1)  services = this.list_boss;
        else if (this.state.role == 2)  services = this.list_empl;
        var list = services.map(({text, icon, component,hideNavBar,separator}, idx)=>{
            
            var topLine = idx === 0 ? (<View style={styles.fullSeparator} ></View>) : null;
            var bottomLine = idx === services.length - 1 ? (<View style={styles.fullSeparator} ></View>) : null;

            var itemLine = idx < services.length - 1 ? (<View style={styles.separator} ></View>) : null;
            if(separator === true)
            	itemLine = (
            		<View key={idx + '_' + text} >
	            		<View style={styles.fullSeparator} />
	            		<View style={styles.placeholder} />
	            		<View style={styles.fullSeparator} />
                	</View>
            	);

            return (
                <View key={idx + '_' + text} >
                    {topLine}
                    <TouchableOpacity style={[styles.listItem, Global.styles.CENTER]} onPress={()=>{
                        if(component) {
                            this.push(text, component,hideNavBar);
                        }
                    }} >
                        <View style={[Global.styles.CENTER, styles.listItemIcon, ]} >
                            <Icon name={icon} size={22} color={Global.colors.ORANGE} style={[styles.icon, Global.styles.ICON]} />
                        </View>
                        <Text style={{flex: 1, marginLeft: 10}}>{text}</Text>
                        <Icon name='ios-arrow-right' size={18} color={Global.colors.IOS_ARROW} style={[Global.styles.ICON, {width: 40}]} />
                    </TouchableOpacity>
                    {itemLine}
                    {bottomLine}
                </View>
            );
        });
        return list;
    },
	render : function(){
        if(!this.state.doRenderScene)
            return this._renderPlaceholderView();
		return (
			<View style={styles.container}>
				<ScrollView >
					<View style={styles.placeholder} />
					{/*<TouchableOpacity style={[Global.styles.BORDER,styles.item,]} onPress={()=>{this.listCost('消费记录',costList,true)}}>
											<Icon name='social-snapchat' style={[Global.styles.ICON]} size={25} color={Global.colors.PURPLE}></Icon>
											<Text style={[styles.text]} >消费记录</Text>
											<Icon name='ios-arrow-right' size={18} color={'#000000'} style={[Global.styles.ICON, {width: 20,marginRight: 40}]}></Icon>
										</TouchableOpacity>
										<TouchableOpacity style={[Global.styles.BORDER,styles.item]} onPress={()=>{this.listCost('报销单',expenseList,true)}}>
											<Icon name='social-freebsd-devil' style={[Global.styles.ICON]} size={25} color={Global.colors.ORANGE}></Icon>
											<Text style={styles.text}>报销单</Text>
											<Icon name='ios-arrow-right' size={18} color={'#000000'} style={[Global.styles.ICON, {width: 20,marginRight: 40}]}></Icon>
										</TouchableOpacity>
										<TouchableOpacity style={[Global.styles.BORDER,styles.item]} onPress={()=>{this.listCost('借款单',loanList,true)}}>
											<Icon name='social-reddit' style={[Global.styles.ICON]} size={25} color={Global.colors.BROWN} ></Icon>
											<Text style={styles.text}>借款单</Text>
											<Icon name='ios-arrow-right' size={18} color={'#000000'} style={[Global.styles.ICON, {width: 20,marginRight: 40,}]}></Icon>
										</TouchableOpacity>*/}
					{this._renderList()}
					<View style={styles.placeholder} />
				</ScrollView>
			</View>
		
			
	);

	},
    _renderPlaceholderView: function() {
        return (
            <View style={styles.container}>
            </View>
        );
    },

});
var styles = StyleSheet.create({
	container: {
			flex: 1,
			backgroundColor: Global.colors.IOS_GRAY_BG,
		},
	placeholder: {
		flex: 1,
		height: Global.NBPadding + 20,
	},
	
	separator: {
        width: Global.getScreen().width - 15, 
        left: 15,
        backgroundColor: Global.colors.IOS_SEP_LINE, 
        height: 1/Global.pixelRatio,
    },
    fullSeparator: {
        width: Global.getScreen().width, 
        backgroundColor: Global.colors.IOS_SEP_LINE, 
        height: 1/Global.pixelRatio,
    },
    listItem: {
        width: Global.getScreen().width,
        height: 50,
        flexDirection: 'row',
        paddingLeft: 15,
        backgroundColor: 'white',
    },
    listItemIcon: {
        width: 30,
        height: 30,
        borderRadius: 5,
    },
});
module.exports = ReimburseMng;