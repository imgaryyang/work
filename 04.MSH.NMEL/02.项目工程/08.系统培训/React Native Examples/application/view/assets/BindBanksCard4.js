'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Global = require('../../Global');
var Icon = require('react-native-vector-icons/Ionicons');
var {
	StyleSheet,
	ScrollView,
	View,
	Text,
	Image,
    PixelRatio,
	TouchableOpacity,
	Navigator,
	Dimensions,
	InteractionManager,
	ListView,
	TextInput,
} = React;

var ACCOUNTINFO = {};

var BindBanksCard4 = React.createClass({
	getInitialState:function(){
		return{
			
		}
	},
	componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({
				doRenderScene: true,
			});
		});

	},
	done:function(){
		// this.props.refreshBankList.call();
		if(this.props.backRoute == 'Assets')
			this.props.navigator.popToTop();
		else
			this.props.navigator.popToRoute(this.props.backRoute);
	},
	render: function() {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		return(
			<View style={styles.container}>
				<ScrollView style={styles.sv}>
					<View style={styles.paddingPlace} />
					<View style={styles.iconImage}>
						<Icon style={[styles.icon]} name='checkmark-circled' size={70} color={Global.colors.IOS_GREEN}/>
						<Text>绑定成功</Text>
						<Text style={{color:'grey'}}>(账户待验证)</Text>
					</View>
					<View>
						<View style={[{
							marginTop: 20, 
							backgroundColor: '#ffffff', 
							borderColor: Global.colors.IOS_SEP_LINE, 
							borderWidth: 1 / Global.pixelRatio, 
							borderRadius: 5, 
							flexDirection: 'column', 
							paddingLeft: 6,
							paddingRight: 6,
							paddingTop: 20,
							paddingBottom: 20,
						}]} >
							<Text style={styles.textInput} >{'银行卡号：'+this.props.acctNo}</Text>
							<Text style={styles.textInput} >{'开户银行：'+this.props.bankName}</Text>
						</View>
						<View style={{paddingTop:10}}>
							<Text style={{color:'grey'}}>如何完成转账：</Text>
							<Text style={{color:'grey',paddingTop:10}}>请使用绑定的银行卡通过所在行柜面、ATM、网银或手机银行向此电子账户转入任意金额，即可完成账户验证。</Text>
						</View>
						<View style={{flex: 1, flexDirection: 'row', marginTop: 20}}>
					    	<TouchableOpacity 
								style={[Global.styles.CENTER, {height: 40, flex: 1, backgroundColor: Global.colors.IOS_BLUE, borderRadius: 3,}]} 
								onPress={()=>{this.done()}}>
					    		<Text style={{color: '#ffffff',}}>完成</Text>
					    	</TouchableOpacity>
						</View>
					</View>
					<View style={styles.placeholder} />			
				</ScrollView>
				<View style={[Global.styles.TOOL_BAR.BAR, styles.steps]}>
					<View style={[Global.styles.CENTER, styles.stepFlex]} ><View style={[styles.step]} ><Text style={styles.stepText} >1</Text></View></View>
					<View style={[Global.styles.CENTER, styles.stepFlex]} ><View style={[styles.step]} ><Text style={[styles.stepText]} >2</Text></View></View>
					<View style={[Global.styles.CENTER, styles.stepFlex]} ><View style={[styles.step]} ><Text style={[styles.stepText]} >3</Text></View></View>
					<View style={[Global.styles.CENTER, styles.stepFlex]} ><View style={[styles.step,styles.activeStep]} ><Text style={[styles.stepText]} >4</Text></View></View>
				</View>				
				<NavBar 
					title='绑定银行卡' 
					navigator={this.props.navigator} 
					route={this.props.route} 
					hideBottomLine={true}
					hideBackButton={true} />

			</View>
		)
	},
	_renderPlaceholderView: function() {
		return (
			<View>			
				<NavBar 
					title='绑定银行卡' 
					navigator={this.props.navigator} 
					route={this.props.route} 
					hideBottomLine={true}
					hideBackButton={true} />
			</View>
		);
	},
	
});
var styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Global.colors.IOS_GRAY_BG,
	},
	paddingPlace: {
		flex: 1,
		height: Global.NBPadding+64,
	},
	sv: {
		paddingLeft: 20,
		paddingRight: 20,
	},
	placeholder: {
        flex: 1,
        height: 20,
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
	inputBlock:{
		flexDirection:'row',
		//padding:5,
		//width:Dimensions.get('window').width,
		borderColor: 'gray', 
		borderWidth: 1 / PixelRatio.get(),
		//backgroundColor: '#FFFFFF',
		//height:100,
	},
	iconImage:{
		justifyContent: 'center',
		alignItems: 'center',
		padding:5,
	},
	textInput: {
		flex: 1,
		color: Global.colors.IOS_GRAY_FONT,
	},
});

module.exports = BindBanksCard4;