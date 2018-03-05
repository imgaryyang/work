'use strict';
/**
 * 卡详细页面
 */
import React, {
    Component,

} from 'react';

import {
    View,
    ScrollView,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    StyleSheet,
	InteractionManager,
    ActivityIndicator,
} from 'react-native';

import * as Global  from '../../Global';
import UserStore    from '../../flux/UserStore';

import NavBar       from 'rn-easy-navbar';
import Button       from 'rn-easy-button';
// import EasyIcon		from 'rn-easy-icon';
import Separator    from 'rn-easy-separator';

import BankList		from './BankList';
import Card       	from './Card';

const bcServices = [
	{code: '001', name: '银行网点', 	icon: 'map-o', 	iconSize: 23, iconColor: '#FF6600', component: BankList, 	hideNavBar: true, navTitle: '银行网点',},
	{code: '002', name: '银行热线', 	icon: 'phone', 	iconSize: 23, iconColor: '#FF6600', component: null, 		hideNavBar: true, navTitle: '银行热线',},
	{code: '003', name: '更多',			icon: 'list',	iconSize: 26, iconColor: '#FF6600', component: null, 		hideNavBar: true, navTitle: '',},
];

const DELETE_URL 		= 'el/bankCards/delBindCard/';
const FIND_MENU_URL 	= 'el/cardMenu/list/0/100';
const FIND_CARDS_URL 	= 'el/bankCards/list';


class CardDetail extends Component {

    static displayName = 'CardDetail';
    static description = '卡详情';

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
		data: null,
		bcServices: bcServices,
		user: UserStore.getUser(),
	};

    constructor (props) {
        super(props);

        this.updateBankCardsData	= this.updateBankCardsData.bind(this);
        this.loadBankCardMenu		= this.loadBankCardMenu.bind(this);
        this.unbundlingBankCard		= this.unbundlingBankCard.bind(this);

        this.onPressUnbundling		= this.onPressUnbundling.bind(this);
        this.onPressMenuItem		= this.onPressMenuItem.bind(this);
    }

	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true}, ()  => {
				this.loadBankCardMenu ();
			})
		});
	}

	/**
	* 更新我的卡列表数据
	**/
	async updateBankCardsData() {
        let data = encodeURI(JSON.stringify({
            	personId: this.state.user.personId,
        }));
        try {
	        
	        let responseData = await this.request(Global._host + FIND_CARDS_URL + '?data=' + data,{	
	        	method:'GET',
            });
            if(responseData.success){
            	UserStore.onUpdateBankCards(responseData.result);
				this.props.navigator.popToTop();
            }
        } catch(e) {
            this.handleRequestException(e);
        }
	}

	/**
	*   从后台加载社保卡和健康卡功能菜单
	**/
	async loadBankCardMenu () {
		
		let typeId = this.props.item.cardType.id;
        try {
	        let responseData = await this.request(Global._host + FIND_MENU_URL + '?data=' + typeId, {
	        	method:'GET',
            });
            
			this.setState({
				dataSource: responseData.result,
			});
        } catch(e) {
            this.handleRequestException(e);
        }
	}

	/**
	*	解除绑定卡，先验证支付密码是否正确，正确后才解绑
	**/
	async unbundlingBankCard(pwd) {
        try {
			this.showLoading();
			if(pwd!='888888'){
				this.hideLoading();
				// this.hidePwd();
				return false;
			}
			let responseData = await this.request(Global._host + DELETE_URL + this.props.item.id, {
				method: 'GET',
            });
            if (responseData.success) {
				//需要重新装载我的卡列表页面
				this.updateBankCardsData();
				this.hideLoading();
				this.hidePwd();
				return true;
            } else {
				this.hideLoading();
				return false;
			}
        } catch (e) {
            this.hideLoading();
            this.handleRequestException(e);
			return false;
        }
	}

	/**
	*  解除绑定
	**/
	onPressUnbundling () {
		this.inputPwd(this.unbundlingBankCard);
	}

	/**
	*  菜单按钮执行方法
	**/
	onPressMenuItem (component, hideNavBar, navTitle) {
    	if(component)
	        this.props.navigator.push({
	        	title: navTitle,
	            component: component,
	            hideNavBar: hideNavBar ? hideNavBar : false,
	            passProps: {
	            	bankNo: this.props.item.bankNo,
	            },
	        });
	    else
	    	this.toast(navTitle + '即将开通');
    }

	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		let appendTitle = this.props.item.cardType.type != '1' ? 
			<Text style={styles.textTitle }>{this.props.item.cardType.name}功能：</Text> 
			: null;

		let appendFunc = (this.props.item.cardType.type != '1') ?
			(
				<View style={styles.menu} >
					{this.state.dataSource ? null : 
						(
							<View style = {[Global._styles.CENTER, {flex: 1}]} >
								<ActivityIndicator />
								<Text style = {styles.loadingText} >正在载入{this.props.item.cardType.name}功能...</Text>
							</View>
						)
					}
		    		{this._renderMenu()}
		    	</View>
			)
			: null;
		
		return (
			<View style = {Global._styles.CONTAINER} >
				{this._getNavBar()}
				<ScrollView automaticallyAdjustContentInsets = {false} style = {styles.scrollView} >

					<Card  
						showType = {2} 
						card = {this.props.item}
					/>

					{appendTitle}
					{appendFunc}

					<Text style={styles.textTitle }>银行卡功能：</Text>
					<View style={styles.menu} >
			    		{this._renderBcMenu()}
			    	</View>

					<Button text = "解除绑定" onPress = {this.onPressUnbundling} style = {styles.bottomBtn} />
					<Separator height = {40} />

				</ScrollView>
			</View>
		);
	}

    /**
    *    将查询到的功能菜单展现（健康卡和社保卡）
    **/
	_renderMenu () {
		let data = this.state.dataSource;
		if(!data) return;
		return data.map(
			({code, text, icon, iconSize, iconColor, component,  key}, idx) => {
				let iconDisplayColor = component ? iconColor : iconColor;
				return (
					<TouchableOpacity key={code} style={[styles.menuItem]} onPress={() => {this.onPressMenuItem(component, true, text)}} >

			    		<EasyIcon iconLib = "fa" name = {icon} size = {16} color = "#FF6600" width = {40} height = {40} radius = {20} borderColor = '#FF6600' borderWidth = {1 / Global._pixelRatio} />
			    		<Text style={[styles.text]}>{text}</Text>

			    	</TouchableOpacity>
				);
			}
		);
	}

    /**
    *    展现银行卡功能，目前功能写死的，后期再改
    **/
	_renderBcMenu () {
		return this.state.bcServices.map(
			({code, name, icon, iconSize, iconColor, component, hideNavBar, navTitle, key}, idx) => {
				let iconDisplayColor = component ? iconColor : iconColor;
				
				return (
					<TouchableOpacity key={code} style={[styles.menuItem]} onPress={() => {this.onPressMenuItem(component, hideNavBar, navTitle)}} >

			    		<EasyIcon iconLib = "fa" name = {icon} size = {16} color = "#FF6600" width = {40} height = {40} radius = {20} borderColor = '#FF6600' borderWidth = {1 / Global._pixelRatio} />
			    		<Text style={[styles.text]}>{name}</Text>

			    	</TouchableOpacity>
				);
			}
		);
	}

	_renderPlaceholderView () {
		return (
			<View style = {Global._styles.CONTAINER}>
				{this._getNavBar()}
			</View>
		);
	}

	_getNavBar () {
		return (
			<NavBar title = '卡详情' 
		    	navigator = {this.props.navigator} 
				route = {this.props.route}
		    	hideBackButton = {false} 
		    	hideBottomLine = {false} />
		);
	}
	
}


let itemWidth = (Global.getScreen().width - 20) / 3;
const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
		padding: 8,
		paddingTop: 20,
	},

	textTitle: {
		color: 'black',
		fontSize: 14,
		marginTop: 10,
		marginBottom: 8,
		marginLeft: 10,
	},
	menu: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        overflow: 'hidden', 
		backgroundColor: 'white',
		borderWidth: 1 / Global._pixelRatio,
		borderColor: Global._colors.IOS_SEP_LINE,
		borderRadius: 5,
		paddingTop: 10,
		paddingBottom: 10,
	},
	menuItem: {
		width: itemWidth,
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: 10,
		paddingBottom: 10,
	},

	loadingText: {
		textAlign: 'center',
		//fontSize: 15,
		color: Global._colors.FONT_LIGHT_GRAY1,
		marginTop: 5,
	},

	text: {
		width: itemWidth - 10,
		fontSize: 13,
		color: '#5D5D5D',
		textAlign: 'center',
		overflow: 'hidden',
		marginTop: 8,
	},

	bottomBtn: {
		marginTop: 20,
	},
});


export default CardDetail;
