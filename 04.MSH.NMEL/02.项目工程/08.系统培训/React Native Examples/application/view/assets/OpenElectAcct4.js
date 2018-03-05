'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Global = require('../../Global');
var Icon = require('react-native-vector-icons/Ionicons');
var Assets = require('./Assets');

var FilterMixin = require('../../filter/FilterMixin');

var {
	StyleSheet,
	ScrollView,
	View,
	Text,
	Image,
	TouchableOpacity,
	Navigator,
	InteractionManager,
} = React;

var OpenElecAcct4 = React.createClass({

	mixins: [FilterMixin],

	getInitialState:function(){
		return {
			value: this.props.value,
		}
	},

	componentDidMount:function(){
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
	},

	done:function(){
		// this.props.refresh.call();
		this.props.navigator.popToTop();
	},

	render:function(){
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		return(
			<View style={styles.container}>
				<ScrollView style={styles.sv} >
					<View style={styles.paddingPlace} />
					
					<View style={Global.styles.CENTER}>
						<Icon style={[styles.icon]} name='checkmark-circled' size={70} color={Global.colors.IOS_GREEN}/>
						<Text style={{fontSize: 20}} >开户成功</Text>
						<Text style={{marginTop: 5}}>（ 账户待验证 ）</Text>
					</View>

					<View style={[Global.styles.CENTER, {
						marginTop: 20, 
						backgroundColor: '#ffffff', 
						borderColor: Global.colors.IOS_SEP_LINE, 
						borderWidth: 1 / Global.pixelRatio, 
						borderRadius: 5, 
						flexDirection: 'row', 
						paddingLeft: 6,
						paddingRight: 6,
						paddingTop: 20,
						paddingBottom: 20,
					}]} >
						<Text style={{width: 90}} >电子账户号：</Text>
						<Text style={{flex: 1, textAlign: 'center', fontSize: 18,}} >{this.filterBankCard(this.state.value.acctNo)}</Text>
					</View>

					<View style={{marginTop: 20}}>
						<Text style={{color: 'grey', fontSize: 15, fontWeight: '800'}}>如何完成验证：</Text>
						<Text style={{color: 'grey', marginTop:10}}>请使用绑定的银行卡通过所在行柜面、ATM、网银或手机银行向此电子账户转入任意金额，即可完成账户验证。</Text>
					</View>

					<TouchableOpacity 
						style={[Global.styles.CENTER, Global.styles.BLUE_BTN, {marginTop: 20}]} 
						onPress={this.done}>
			    		<Text style={{color: '#ffffff',}}>完成</Text>
			    	</TouchableOpacity>
				</ScrollView>

				<View style={[Global.styles.TOOL_BAR.BAR, styles.steps]}>
					<View style={[Global.styles.CENTER, styles.stepFlex]} ><View style={[styles.step]} ><Text style={styles.stepText} >1</Text></View></View>
					<View style={[Global.styles.CENTER, styles.stepFlex]} ><View style={[styles.step]} ><Text style={[styles.stepText]} >2</Text></View></View>
					<View style={[Global.styles.CENTER, styles.stepFlex]} ><View style={[styles.step,styles.activeStep]} ><Text style={[styles.stepText]} >3</Text></View></View>
					{/*<View style={[Global.styles.CENTER, styles.stepFlex]} ><View style={[styles.step, styles.activeStep]} ><Text style={[styles.stepText]} >4</Text></View></View>*/}
				</View>

				{this._getNavBar()}

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
			<NavBar 
				title='开户完成' 
				rootNavigator={this.props.rootNavigator} 
				navigator={this.props.navigator} 
				hideBackButton={true} 
				route={this.props.route}
				backText='上一步'
				hideBottomLine={true} />
		);
	},
});
var styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffffff',
	},
	sv: {
		paddingLeft: 20,
		paddingRight: 20,
	},
    paddingPlace: {
        flex: 1,
        height: Global.NBPadding + 64,
    },

    steps: {
    	flex: 1,
    	height: 43,
    	flexDirection: 'row',
    },
    stepFlex: {
    	flex: 1,
    	backgroundColor: 'transparent',
    },
    step: {
    	width: 24,
    	height: 24,
    	borderRadius: 12,
    	backgroundColor: Global.colors.IOS_DARK_GRAY,
    	overflow: 'hidden',
    },
    activeStep: {
    	backgroundColor: Global.colors.IOS_GREEN,
    },
    stepText: {
    	flex: 1,
    	fontSize: 16,
    	color: '#ffffff',
    	textAlign: 'center',
    	lineHeight: 21,
    },	
});

module.exports = OpenElecAcct4;