'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../../Global');
var NavBar = require('../NavBar');
var UtilsMixin = require('../lib/UtilsMixin');
var TimerMixin = require('react-timer-mixin');

var {
	StyleSheet,
	ScrollView,
	View,
	Text,
	Image,
	TouchableOpacity,
	InteractionManager
} = React;

var Invest = React.createClass({

	mixins: [UtilsMixin, TimerMixin],

    randomColors: [],

    fundCat: [
    	{code: '001', name: '股票型', 	iconSize: 25, icon: 'arrow-graph-up-right', },
    	{code: '002', name: '债券型', 	iconSize: 25, icon: 'cash', },
    	{code: '003', name: '混合型', 	iconSize: 25, icon: 'levels', },
    	{code: '004', name: '指数型', 	iconSize: 25, icon: 'ios-pulse-strong', },
    	{code: '005', name: 'QDII',  	iconSize: 25, icon: 'arrow-swap', },
    	{code: '006', name: 'ETF',   	iconSize: 25, icon: 'stats-bars', },
    	{code: '007', name: '理财型', 	iconSize: 25, icon: 'ios-briefcase', },
    	{code: '008', name: '新发',  	iconSize: 25, icon: 'flash', },
    ],

    fundRecommend: [
    	{code: '519069', name: '汇添富价值精选混合基金', newestPrice: '2.3790', newestRate: '0.03', yearlyRate: '17.22'},
    	{code: '110027', name: '易安心回报A', newestPrice: '1.4550', newestRate: '0.13', yearlyRate: '14.88'},
    	{code: '630003', name: '华商收益增强债券A', newestPrice: '1.2930', newestRate: '0.00', yearlyRate: '14.70'},
    	{code: '530017', name: '建信双息红利债券A', newestPrice: '1.2220', newestRate: '0.06', yearlyRate: '14.08'},
    	{code: '630010', name: '华商价值精选', newestPrice: '2.3230', newestRate: '0.08', yearlyRate: '12.51'},
    	{code: '110017', name: '易方达增强回报债券A', newestPrice: '1.2640', newestRate: '0.05', yearlyRate: '11.90'},
    	{code: '519989', name: '长信利丰债券基金', newestPrice: '1.4200', newestRate: '0.21', yearlyRate: '11.87'},
    	{code: '530008', name: '建信稳定增利债券基金', newestPrice: '1.6110', newestRate: '0.00', yearlyRate: '8.84'},
    ],

    componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
	},

	getInitialState: function() {
        this.getRandomColors();
		return {
			doRenderScene: false,
		};
	},

    getRandomColors: function() {
        this.randomColors = [];
        for(var i = 0 ; i < 50 ; i++){
            this.randomColors[this.randomColors.length] = this.getRandomColor();
        }
    },

    onPressMenu : function(title, component, hideNavBar) {
        this.props.navigator.push({
        	title: title,
            component: component,
        });
    },

	render: function() {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		let fundFilter = this.fundCat.map(
			({code, name, iconSize, icon}, idx) => {
				let noLeftBorder = (idx % 4 == 0) ? styles.noLeftBorder : null;
				return (
					<View key={code} style={[styles.menuItem, noLeftBorder]} >
                		<View style={[styles.iconHolder, Global.styles.CENTER, {backgroundColor: this.randomColors[idx]}]} >
			    			<Icon style={[styles.icon]} name={icon} size={iconSize} color='white' />
			    		</View>
			    		<Text style={[styles.text]}>{name}</Text>
			    	</View>
				);
			}
		);

		let fundRecommendView = this.fundRecommend.map(
			({code, name, newestPrice, newestRate, yearlyRate}, idx) => {
				return (
					<View key={code} style={[{backgroundColor: 'white'}]} >
						<View style={[Global.styles.CENTER, {height: 30, flexDirection: 'row', paddingLeft: 10, paddingRight: 10}]} >
							<Text style={[{flex: 1, paddingLeft: 20, fontSize: 14, fontWeight: '500'}]} >{name}</Text>
							<Text style={[{width: 70, textAlign: 'right', fontSize: 11, color: Global.colors.IOS_GRAY_FONT, paddingRight: 10,}]}>{code}</Text>
						</View>
                    	
						<View style={[Global.styles.CENTER, {height: 30, flexDirection: 'row', paddingLeft: 10, paddingRight: 10}]} >
							<Text style={{flex: 1, paddingLeft: 20}} >{newestPrice}元</Text>
							<Text style={{flex: 1, textAlign: 'right', color: Global.colors.ORANGE}} >{newestRate}%</Text>
							<Text style={{flex: 1, textAlign: 'right', paddingRight: 10, color: Global.colors.ORANGE}} >{yearlyRate}%</Text>
                    	</View>
                    	
						<View style={[Global.styles.CENTER, {height: 15, flexDirection: 'row', marginBottom: 10, paddingLeft: 10, paddingRight: 10}]} >
							<Text style={{flex: 1, paddingLeft: 20, fontSize: 10, color: Global.colors.IOS_GRAY_FONT}} >最新净值</Text>
							<Text style={{flex: 1, textAlign: 'right', fontSize: 10, color: Global.colors.IOS_GRAY_FONT}} >最新涨跌幅</Text>
							<Text style={{flex: 1, textAlign: 'right', paddingRight: 10, fontSize: 10, color: Global.colors.IOS_GRAY_FONT}} >年涨跌幅</Text>
                    	</View>
                    	<View style={Global.styles.FULL_SEP_LINE} />
					</View>
				);
			}
		);

		return (
			<View style={Global.styles.CONTAINER}>
			    {this._getNavBar()}
				<ScrollView 
					automaticallyAdjustContentInsets={false}
					style={styles.sv}>

                    {/*<View style={Global.styles.FULL_SEP_LINE} />*/}
                    <View style={[styles.menu]} >
                    	{fundFilter}
                    </View>

                    <View style={Global.styles.PLACEHOLDER20} />

                    <View style={Global.styles.FULL_SEP_LINE} />
                    <View style={[Global.styles.CENTER, {flex: 1, flexDirection: 'row', backgroundColor: 'white', height: 45}]} >
                    	<Text style={{flex: 1, fontSize: 16, textAlign: 'center', color: Global.colors.ORANGE}} >专区</Text>
                    	<Text style={{flex: 1, fontSize: 16, textAlign: 'center'}} >主题</Text>
                    </View>
                    <View style={Global.styles.FULL_SEP_LINE} />
                    <View style={[Global.styles.CENTER, {flex: 1, flexDirection: 'row', backgroundColor: 'white', paddingTop: 15, paddingBottom: 15}]} >
                    	<Text style={{flex: 1, height: 35, paddingTop: 9, fontSize: 16, textAlign: 'center'}} >稳健投资专区</Text>
                    	<View style={[{flex: 1, paddingLeft: 25}]} >
                    		<Text style={{color: Global.colors.ORANGE, fontSize: 16}} >+23.60%</Text>
                    		<Text style={{color: Global.colors.IOS_GRAY_FONT}} >近一年涨幅最高</Text>
                    	</View>
                    </View>
                    <View style={Global.styles.FULL_SEP_LINE} />
                    <View style={[Global.styles.CENTER, {flex: 1, flexDirection: 'row', backgroundColor: 'white', paddingTop: 15, paddingBottom: 15}]} >
                    	<Text style={{flex: 1, height: 35, paddingTop: 9, fontSize: 16, textAlign: 'center'}} >积极配置专区</Text>
                    	<View style={[{flex: 1, paddingLeft: 25}]} >
                    		<Text style={{color: Global.colors.ORANGE, fontSize: 16}} >+63.87%</Text>
                    		<Text style={{color: Global.colors.IOS_GRAY_FONT}} >近一年涨幅最高</Text>
                    	</View>
                    </View>
                    <View style={Global.styles.FULL_SEP_LINE} />

                    <View style={Global.styles.PLACEHOLDER20} />

                    <View style={Global.styles.FULL_SEP_LINE} />
                    <View style={[Global.styles.CENTER, {backgroundColor: 'white', flex: 1, height: 45, flexDirection: 'row'}]} >
                    	<Icon style={[styles.icon, {width: 40}]} name='ribbon-b' size={23} color={Global.colors.IOS_RED} />
                    	<Text style={{flex: 1}} >推荐基金</Text>
                    </View>
                    <View style={Global.styles.FULL_SEP_LINE} />
                    {fundRecommendView}

                    <View style={Global.styles.PLACEHOLDER20} />

			    </ScrollView>
		    </View>
		);
	},

	_renderPlaceholderView: function() {
		return (
			<View>
			    {this._getNavBar()}
			</View>
		);
	},

	_getNavBar: function() {
		return (
			<NavBar title='理财' 
		    	navigator={this.props.navigator} 
				route={this.props.route}
		    	hideBackButton={true} 
		    	theme={NavBar.THEME.BLUE}
		    	statusBarStyle='light-content'
		    	flow={false} />
		);
	},
});

var styles = StyleSheet.create({
	sv: {
		flex: 1,
		marginBottom: Global.os == 'ios' ? 49 : 0,
	},

    menu: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        overflow: 'hidden', 
        backgroundColor: 'white',
	},
	menuItem: {
		width: (Global.getScreen().width * Global.pixelRatio - 1)/4/Global.pixelRatio,
		height: (Global.getScreen().width * Global.pixelRatio - 1)/4/Global.pixelRatio,
		justifyContent: 'center',
		alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0)',
		borderWidth: 1 / Global.pixelRatio,
		borderColor: Global.colors.IOS_SEP_LINE,
		borderRightWidth: 0,
		borderTopWidth: 0,
	},
	noLeftBorder: {
		borderLeftWidth: 0,
	},

	text: {
		width: (Global.getScreen().width * Global.pixelRatio - 50)/4/Global.pixelRatio,
		textAlign: 'center',
		overflow: 'hidden',
		marginTop: 10,
	},
	iconHolder: {
		width: 45,
		height: 45,
		borderRadius: 22.5,
		flexDirection: 'row',
	},
	icon: {
		textAlign: 'center',
		backgroundColor: 'transparent',
	},

});

module.exports = Invest;
