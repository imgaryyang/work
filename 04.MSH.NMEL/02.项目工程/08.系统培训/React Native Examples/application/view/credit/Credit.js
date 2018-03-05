'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Global = require('../../Global');
var Icon = require('react-native-vector-icons/Ionicons');

var UtilsMixin = require('../lib/UtilsMixin');

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

var Credit = React.createClass({

	mixins: [UtilsMixin],

    randomColors: [],

    creditMenu: [
    	{code: '001', name: '我的授信', 	iconSize: 25, icon: 'ios-speedometer-outline', },
    	{code: '002', name: '我的贷款', 	iconSize: 25, icon: 'ios-filing-outline', },
    	{code: '003', name: '还款计划', 	iconSize: 25, icon: 'ios-calculator-outline', },
    	{code: '004', name: '在线咨询', 	iconSize: 25, icon: 'ios-chatbubble-outline', },
    ],

	getInitialState:function(){
        this.getRandomColors();
		return{
			
		}
	},

    componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
	},

    getRandomColors: function() {
        this.randomColors = [];
        for(var i = 0 ; i < 50 ; i++){
            this.randomColors[this.randomColors.length] = this.getRandomColor();
        }
    },
	
	render: function() {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		let menu = this.creditMenu.map(
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

		return(
			<View style={Global.styles.CONTAINER}>
				{this._getNavBar()}
				<ScrollView 
					automaticallyAdjustContentInsets={false} 
					style={styles.sv}>
                    <View style={[styles.menu]} >
                    	{menu}
                    </View>
					
					<TouchableOpacity style={styles.productHolder} >
						<Image source={require('../../res/images/credit-01.png')} resizeMode='cover' style={[styles.img]} />
						<View style={[styles.productNameHolder, Global.styles.CENTER]} >
							<Text style={[styles.productName]} >易微贷</Text>
							<Text style={[styles.productDesc]} >1、无需抵押、无需担保；{"\n"}2、贷款额度最高人民币50万元{"\n"}3、授信期限最长3年。</Text>
						</View>
					</TouchableOpacity>

					<TouchableOpacity style={styles.productHolder} >
						<Image source={require('../../res/images/credit-02.png')} resizeMode='cover' style={[styles.img]} />
						<View style={[styles.productNameHolder, Global.styles.CENTER]} >
							<Text style={[styles.productName]} >易抵押</Text>
							<Text style={[styles.productDesc]} >让不动产动起来！{"\n"}1、在线申请、上门认证；{"\n"}3、手续简单、周期超短。</Text>
						</View>
					</TouchableOpacity>

					<TouchableOpacity style={styles.productHolder} >
						<Image source={require('../../res/images/credit-03.png')} resizeMode='cover' style={[styles.img]} />
						<View style={[styles.productNameHolder, Global.styles.CENTER]} >
							<Text style={[styles.productName]} >商链通</Text>
							<Text style={[styles.productDesc]} >1、担保种类丰富；{"\n"}2、办理高效快捷；{"\n"}3、综合效益高。</Text>
						</View>
					</TouchableOpacity>

                    <View style={Global.styles.PLACEHOLDER20} />

				</ScrollView>
			</View>
		)
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
			<NavBar title='融资' 
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

	productHolder: {
		borderRadius: 5,
		margin: 10,
		marginBottom: 0,
		backgroundColor: 'white',
		overflow: 'hidden',
	},

	img: {
		width: Global.getScreen().width - 20, 
		height: (Global.getScreen().width - 20) * 0.618, 
		backgroundColor: Global.colors.IOS_GRAY_BG,
	},
	productNameHolder: {
		flexDirection: 'row',
		padding: 10,
	},
	productName: {
		width: 80,
		fontSize: 15,
		fontWeight: '300',
		textAlign: 'center',
		backgroundColor: 'transparent',
	},
	productDesc: {
		flex: 1,
		fontSize: 12,
		color: Global.colors.IOS_GRAY_FONT,
		marginLeft: 10,
	}

});

module.exports = Credit;