'use strict';

import React, {
    Component,
    PropTypes,
} from 'react';

import {
	Animated,
	StyleSheet,
	ScrollView,
	View,
	Text,
	Image,
	TouchableOpacity,
	InteractionManager,
	ListView,
    Alert,
    AsyncStorage,
} from 'react-native';

import * as Global  from '../../Global';
import UserStore	from '../../flux/UserStore';
import AuthAction   from '../../flux/AuthAction';

import NavBar       from '../../store/common/TopNavBar';
import EasyIcon		from 'rn-easy-icon';
import Button		from 'rn-easy-button';
import Separator    from 'rn-easy-separator';
import EasyCard		from 'rn-easy-card';

import BindCard1	from '../../wallet/BindCard1';
import CardDetail	from '../../wallet/CardDetail';
import Card			from '../../wallet/Card';
import BillList 	from '../../wallet/BillList';
import Defray 	from './Defray';

class CardList extends Component {

    static displayName = 'CardList';
    static description = '卡管理中心';

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
		user: UserStore.getUser(),
		bankCards: UserStore.getBankCards(),
	};

    constructor (props) {
        super(props);

        this.renderCards 		= this.renderCards.bind(this);
        this.renderCardTypeTitle = this.renderCardTypeTitle.bind(this);
        this.renderCard 		= this.renderCard.bind(this);
        
        this.bindCard			= this.bindCard.bind(this);
        this.cardDetail			= this.cardDetail.bind(this);
        this.goLogin			= this.goLogin.bind(this);
        this.billList 			= this.billList.bind(this);

        this.onUserStoreChange	= this.onUserStoreChange.bind(this);
    }

	componentDidMount () {
		this.unUserStoreChange = UserStore.listen(this.onUserStoreChange);
		InteractionManager.runAfterInteractions(() => {
			this.setState({
				doRenderScene: true,
			});
		});
		console.log('userinfoKKKKKKKKKKKKKKKKKKKKKKKK');
		console.log(this.state.user);
		console.log('bankCardsjjjjjjjjjjjjj');
		console.log(this.state.bankCards);

	}

	componentWillUnmount () {
        this.unUserStoreChange();
    }

	onUserStoreChange () {
		this.setState({
			user: UserStore.getUser(),
			bankCards: UserStore.getBankCards(),
		});
	}

	/**
	 * 打开绑定卡第一步页面
	 */
	bindCard () {
		this.props.navigator.push({
			component: BindCard1, 
			hideNavBar: true,
		});
	}
	
	/**
	 * 打开卡详情页面
	 */
	cardDetail(item) {
		// console.log('item:',item);
		// this.props.navigator.push({
		// 	component: Defray, 
		// 	hideNavBar: true, 
        //     passProps: {
        //     	item: item,
        //     },
    	// });
		this.props.navigator.pop();
		this.props.bindCard && this.props.bindCard(item);
	}

	/**
	 * 打开账单列表页
	 */
	billList() {
	 	this.props.navigator.push({
			component: BillList, 
			hideNavBar: true, 
            // passProps: {
            // 	item: item,
            // },
    	});
	 }

	/**
	 * 渲染卡类别
	 */
	renderCardTypeTitle (item) {
		return (
			<Text key = {'cardType_' + item.cardNo} style = {{
				fontSize: 15,
				color: Global.Color.FONT_GRAY,
				margin: 10,
			}} >{item.cardType.name}</Text>
		);
	}

	/**
	 * 渲染卡
	 */
	renderCard (item) {
		return (
			<Card key = {'item_' + item.cardNo} 
				showType = {1} 
				card = {item} 
				onPress = {() => {this.cardDetail(item);}}
			/>
		);
	}

	/**
	 * 渲染所有卡
	 */
	renderCards () {

		let cardType, siCardTitle, siCards = [], hlthCardTitle, hlthCards = [], bankCardTitle, bankCards = [];

		if(this.state.bankCards) {
			this.state.bankCards.forEach((item) => {
				cardType = item.cardType.type;//1 - 银行卡 2 - 社保卡 3 - 健康卡
				switch (cardType) {
					case '1':
						bankCardTitle = bankCardTitle ? bankCardTitle : this.renderCardTypeTitle(item);
						bankCards.push(this.renderCard(item));
						break;
					case '2':
						siCardTitle = siCardTitle ? siCardTitle : this.renderCardTypeTitle(item);
						siCards.push(this.renderCard(item));
						break;
					// case '3':
					// 	hlthCardTitle = hlthCardTitle ? hlthCardTitle : this.renderCardTypeTitle(item);
					// 	hlthCards.push(this.renderCard(item));
					// 	break;
					default:
						break;
				}
			});
		}

		return (
			<View style = {{marginLeft: 8, marginRight: 8}} >
				{/*siCardTitle*/}
				{siCards.map((card) => {return card;})}
				{/*hlthCardTitle*/}
				{/*hlthCards.map((card) => {return card;})*/}
				{/*bankCardTitle*/}
				{bankCards.map((card) => {return card;})}
			</View>
		);
	}

	goLogin() {
		//TODO:需要登录时调用登录
		AuthAction.clearContinuePush();
		AuthAction.needLogin();
    }
	
	render () {

		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		let loginView = !this.state.user || this.state.user.id == "" ? (
			<EasyCard radius = {6} style = {{paddingBottom: 20, margin: 8, marginTop: 16}} >
				<Text style = {[Global._styles.MSG_TEXT, {marginTop: 30, marginBottom: 20}]} >您还未登录，登录后方能查看您绑定的卡</Text>
				<Button text = "登录" onPress = {this.goLogin} />
			</EasyCard>
		) : null;

		// let emptyView = this.state.user && this.state.user.id != "" && (!this.state.bankCards || this.state.bankCards.length == 0) ? (
		// 	<EasyCard radius = {6} style = {{margin: 8, marginTop: 16}} >
		// 		<Text style = {[Global._styles.MSG_TEXT, {margin: 30}]} >{'您还未绑定卡' + '\n' + '绑卡后方能使用更多功能'}</Text>
		// 	</EasyCard>
		// ) : null;

		return (
			<View style = {Global._styles.CONTAINER} >
				{this._getNavBar()}
				<ScrollView 
					automaticallyAdjustContentInsets = {false} 
					style = {[styles.scrollView, {
						marginBottom: Global._os == 'ios' && this.props.runInTab ? 48 : 0
					}]} >

					{loginView}
					{/*emptyView*/}

					{this.renderCards()}

 				</ScrollView>
			</View>
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
			<NavBar title = '选择银行卡' 
		    	navigator = {this.props.navigator} 
				route = {this.props.route}
		    	//hideBackButton = {this.props.hideBackButton == false ? this.props.hideBackButton : true} 
		    	hideBottomLine = {false}
		    	hideBackButton={false}  />
		);
	}

}

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
		marginBottom: Global._os == 'ios' ? 48 : 0,
	},
	icon: {
		width: 40,
		height: 40,
	},
	personInfo: {
        margin: 16,
    },
    portrait: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    bill: {
        color: '#fff', 
        fontSize: Global.FontSize.BASE,
    },
	addText: {
		flex: 1,
		color: Global.Color.FONT_LIGHT_GRAY1,
		textAlign: 'center',
	},
	addCardView: {
		flex: 1,
		borderBottomColor: '#cccccc',
		borderBottomWidth: 1 / Global._pixelRatio,
		height: 25,
		marginTop: 15,
		flexDirection: 'row',
	},
	hidden: {
		width:1,
		height:1,
		overflow:'hidden',
	},

	footer: {
		height: 50,
		//flexDirection: 'row',
	},
	footerText: {
		color: Global.Color.FONT_LIGHT_GRAY1,
		fontSize: 13,
		marginTop: 10,
		//width: 100,
	},
	buttonContain: {
        flexDirection: 'row',
        height: 44,
    },
    rightButton: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    add: {
        height: 16,
        width: 16,
    },
});

export default CardList;

