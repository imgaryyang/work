'use strict';
/**
 * 就诊人员明细
 * auther: xupeng@smallpay.com
 */
import React, {
    Component,
    PropTypes,
} from 'react';

import {
    View,
    ScrollView,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
	InteractionManager,
} from 'react-native';

import * as Global  from '../../Global';
import UserStore    from '../../flux/UserStore';

import NavBar       from 'rn-easy-navbar';
import EasyIcon 	from 'rn-easy-icon';
import Button       from 'rn-easy-button';
import {B, I, U, S} from 'rn-easy-text';

import PatientEdit	from './PatientEdit';
import Card			from './Card';
import CardADD 		from './AddCard';
import CardDetail 	from './CardDetail';
import RealNameReg 	from './RealNameReg';

const genders = [
	{label: '男', value: '1'},
	{label: '女', value: '0'},
];
const FIND_CARD_URL = 'elh/medicalCard/my/list/0/100';
const FIND_URL = 'elh/userPatient/my/list/0/100'
const REAL_PERSON = 'elh/userPatient/my/realperson/'

class PatientDetail extends Component {

    static displayName = 'PatientDetail';
    static description = '就诊人员明细';

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
        value: {
			id: '',
			status: '1',
	        userId: UserStore.getUser().id,
		},
        user: UserStore.getUser(),
        cardCount: 0,
        userPatient: this.props.userPatient,
		cards: null,
		self:false,
		realperson: false
	};

    constructor (props) {
        super(props);
		this.cardAdd = this.cardAdd.bind(this);
		this.fresh = this.fresh.bind(this);
		this.goPage = this.goPage.bind(this);
		this.goBack = this.goBack.bind(this);
    }

	componentWillMount() {
		this.fetchCardData();
		this.getRealPerson();
	}

	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
		if(this.props.userPatient.relationshi==='自己'){
			this.state.self=true;
		}
	}

	goBack() {
		this.props.navigator.pop();
		this.props.freshlist();
	}
    /**
	 * 异步加获取卡数量
	 */
	async getCardCount() {
        let data = encodeURI(JSON.stringify({
			state: 1,
			patientId: this.props.userPatient.patientId,
		}));
		try {
			let responseData = await this.request(Global._host + FIND_CARD_URL + '?data=' + data, {
				method: 'GET',
			});
            if (responseData.success) {
				this.renderCardMananger(responseData.result.length);
            }
		} catch (e) {
			this.handleRequestException(e);
		}
	}

	/**
	 * 异步获取是否实名
	 */
	async getRealPerson() {
		try {
			let responseData = await this.request(Global._host + REAL_PERSON + this.props.userPatient.patientId, {
				method: 'GET',
			});
            if (responseData.success) {
				if(responseData.result){
					this.state.realperson = true;
				}
            }
		} catch (e) {
			this.handleRequestException(e);
		}
	}

	/**
	 * 获取人员数据
	*/
	async fetchData() {
		let data = encodeURI(JSON.stringify({
			name: this.state.cond,
			userId: this.state.user.id,
			status: '1',
		}));
		try {
			let responseData = await this.request(Global._host + FIND_URL + '?data=' + data, {
					method: 'GET',
				});
			for (let up of responseData.result) {
				if (up.id === this.props.userPatient.id) {
					this.setState({
						userPatient: up
					});
				}
			}
		} catch (e) {
			this.handleRequestException(e);
		}
	}

	/**
	 * 异步加载列表数据
	 */
	async fetchCardData() {
        // let FIND_URL = 'elh/medicalCard/list/'+this.state.start+'/'+this.state.pageSize;
		let data = encodeURI(JSON.stringify({
			state: 1,
			patientId: this.props.userPatient.patientId,
		}));
		try {
			let responseData = await this.request(Global._host + FIND_CARD_URL + '?data=' + data, {
				method: 'GET',
			});
			let rebuild = [];
			if (responseData.result != null) {
				for (let tcard of responseData.result) {
					if (tcard.typeName === '社保卡') {
						rebuild.push(tcard);
					} else if (tcard.typeName === '健康卡') {
						rebuild.push(tcard);
					} else if (tcard.typeName === '就诊卡') {
						rebuild.push(tcard);
					}
				}
				// rebuild.push(responseData.result.find((card) => card.typeName === '社保卡'));
				// rebuild.push(responseData.result.find((card) => card.typeName === '健康卡'));
				// for (let jzcard of responseData.result) {
				// 	if (jzcard.typeName === '就诊卡') {
				// 		rebuild.push(jzcard);
				// 	}
				// }
			}
			this.setState({
				cards: rebuild
			});
		} catch (e) {
			this.handleRequestException(e);
		}
	}

    /**
	 * 展示人员信息list
	 */
    getInfoList() {
		return (
			<View>
				<View style={Global._styles.PLACEHOLDER20} />
				<View style={Global._styles.FULL_SEP_LINE} />
				<View style={[styles.listItem, Global._styles.CENTER]} >
					<Text style={styles.testLeft}>真实姓名</Text>
					<Text style={styles.testRight}>{this.state.userPatient.name===null ? '' : this.state.userPatient.name}</Text>
				</View>
				<View style={Global._styles.FULL_SEP_LINE} />
				<View style={[styles.listItem, Global._styles.CENTER]} >
					<Text style={styles.testLeft}>别名</Text>
					<Text style={styles.testRight}>{this.state.userPatient.alias===null ? '' : this.state.userPatient.alias}</Text>
				</View>
				<View style={Global._styles.FULL_SEP_LINE} />
				<View style={[styles.listItem, Global._styles.CENTER]} >
					<Text style={styles.testLeft}>关系</Text>
					<Text style={styles.testRight}>{this.state.userPatient.relationshi===null ? '' : this.state.userPatient.relationshi}</Text>
				</View>
				<View style={Global._styles.FULL_SEP_LINE} />
				<View style={[styles.listItem, Global._styles.CENTER]} >
					<Text style={styles.testLeft}>性别</Text>
					<Text style={styles.testRight}>{this.state.userPatient.gender===null ? '' : this.state.userPatient.gender==='1' ? '男' : '女'}</Text>
				</View>
				<View style={Global._styles.FULL_SEP_LINE} />
				<View style={[styles.listItem, Global._styles.CENTER]} >
					<Text style={styles.testLeft}>身高(cm)</Text>
					<Text style={styles.testRight}>{this.state.userPatient.height===null ? '' : this.state.userPatient.height}</Text>
				</View>
				<View style={Global._styles.FULL_SEP_LINE} />
				<View style={[styles.listItem, Global._styles.CENTER]} >
					<Text style={styles.testLeft}>体重(kg)</Text>
					<Text style={styles.testRight}>{this.state.userPatient.weight===null ? '' : this.state.userPatient.weight}</Text>
				</View>
				<View style={Global._styles.FULL_SEP_LINE} />
				<View style={[styles.listItem, Global._styles.CENTER]} >
					<Text style={styles.testLeft}>出生日期</Text>
					<Text style={styles.testRight}>{this.state.userPatient.birthday===null ? '' : this.state.userPatient.birthday}</Text>
				</View>
				<View style={Global._styles.FULL_SEP_LINE} />
				<View style={[styles.listItem, Global._styles.CENTER]} >
					<Text style={styles.testLeft}>身份证号</Text>
					<Text style={styles.testRight}>{this.state.userPatient.idno===null ? '' : this.state.userPatient.idno}</Text>
				</View>
				<View style={Global._styles.FULL_SEP_LINE} />
				<View style={[styles.listItem, Global._styles.CENTER]} >
					<Text style={styles.testLeft}>手机号</Text>
					<Text style={styles.testRight}>{this.state.userPatient.mobile===null ? '' : this.state.userPatient.mobile}</Text>
				</View>
				<View style={Global._styles.FULL_SEP_LINE} />
				<View style={[styles.listItem, Global._styles.CENTER]} >
					<Text style={styles.testLeft}>电子邮箱</Text>
					<Text style={styles.testRight}>{this.state.userPatient.email===null ? '' : this.state.userPatient.email}</Text>
				</View>
				<View style={Global._styles.FULL_SEP_LINE} />
				<View style={[styles.listItem, Global._styles.CENTER]} >
					<Text style={styles.testLeft}>地址</Text>
					<Text style={styles.testRight}>{this.state.userPatient.address===null ? '' : this.state.userPatient.address}</Text>
				</View>
				<View style={Global._styles.FULL_SEP_LINE} />
				<View style={Global._styles.PLACEHOLDER20} />
			</View>
		);
    }

	/**
	* 打开就诊卡管理
	**/
	patientCardManager() {
		this.props.navigator.push({
			component: CardList, 
			hideNavBar: true, 
			value: this.state.value,
			refreshDataSource: this.props.refreshDataSource,
            passProps: {
            	userPatient: this.state.userPatient,
	    		refreshDataSource: this.props.refreshDataSource,
            	getCardCount: this.getCardCount,
            },
    	});
	}

	goNext() {
		this.props.navigator.push({
			component: PatientEdit, 
			hideNavBar: true, 
			passProps: {
				addPatient: false,
				realperson: this.state.realperson,
				self: this.state.self,
				fresh: this.fresh,
				freshlist: this.props.freshlist,
				userPatient: this.state.userPatient,
				hasself: this.props.hasself,
				refreshDataSource: this.props.refreshDataSource,
				patientItemRowId: this.props.patientItemRowId,
			},
		});
	}

	addCardComp() {
		return (<TouchableOpacity
			key='8abaddcardcompkey'
			style={[styles.cardStyle1]}
			onPress={() => this.cardAdd() }
			>

			<View style = {[styles.detailHolder,{flexDirection: 'row',justifyContent: 'center',alignItems:'center'}]} >
				<EasyIcon name = 'ios-add' size = {20} />
				<Text style = {styles.bankName} >
					<Text style = {styles.cardTypeInDetail} >	新添加卡</Text>
				</Text>
			</View>

		</TouchableOpacity>);
	}

	getCardsList() {
		if (this.state.cards != null) {
			let sbcard=[];
			let jkcard=[];
			let jzcard=[];
			let sbCardTitle=null,jkCardTitle=null,jzCardTitle=null;
			let sbrn=null,jkrn=null,jzrn=null
			this.state.cards.forEach((card) => {
				switch (card.typeName) {
					case '社保卡':
						sbcard.push(this.buildCard(card));
						// sbrn=card.patientId!=''||card.patientId!=null||card.patientId!=undefined ? this.goRealName(true,2,card) : this.goRealName(false,2,card);
						sbCardTitle = sbCardTitle ? sbCardTitle : this.renderCardTypeTitle(card);
						break;
					case '健康卡':
						jkcard.push(this.buildCard(card));
						// jkrn=card.patientId!=''||card.patientId!=null||card.patientId!=undefined ? this.goRealName(true,3,card) : this.goRealName(false,3,card);
						jkCardTitle = jkCardTitle ? jkCardTitle : this.renderCardTypeTitle(card);
						break;
					case '就诊卡':
						jzcard.push(this.buildCard(card));
						// jzrn=card.patientId!=''||card.patientId!=null||card.patientId!=undefined ? this.goRealName(true,4,card) : this.goRealName(false,4,card);
						jzCardTitle = jzCardTitle ? jzCardTitle : this.renderCardTypeTitle(card);
						break;
					default:
						break;
				}
			});
			return <View style={{marginLeft:8,marginRight:8,borderRadius: 4}}>
				{this.addCardComp()}
				{sbCardTitle!=null ? sbCardTitle : null}
				{sbcard.length<1 ? null : sbcard.map((card) => {return card;})}
				{sbrn}
				{jkCardTitle!=null ? jkCardTitle : null}
				{jkcard.length<1 ? null : jkcard.map((card) => {return card;})}
				{jkrn}
				{jzCardTitle!=null ? jzCardTitle : null}
				{jzcard.length<1 ? null : jzcard.map((card) => {return card;})}
				<View style={Global._styles.PLACEHOLDER20} />
			</View>
		}
	}
	
	// goRealName(show,type,card) {
	// 	let colors;
	// 	switch (type) {
	// 		case 2:
	// 			colors = '#ff6463'
	// 			break;
	// 		case 3:
	// 			colors = '#5ac9f1'
	// 			break;
	// 		case 4:
	// 			colors = '#4CD964'
	// 			break;
	// 		default:
	// 			break;
	// 	}
	// 	if(show){
	// 		return (<Button text = "已经实名认证" disabled={true} style={[styles.button,{backgroundColor: colors,borderColor: colors}]}  onPress={() => {}}/>);
	// 	}else{
	// 		return (<Button text = "去实名认证" style={[styles.button,{backgroundColor: colors,borderColor: colors}]}  onPress={() => this.goPage(card)}/>);
	// 	}
	// }

	goPage(card) {
		this.props.navigator.push({
			component: RealNameReg,
			hideNavBar: true,
			passProps: {
				way: false,
				userPatient: this.props.userPatient,
				card: card,
				fresh: this.fresh
			},
		});
	}

	renderCardTypeTitle (item) {
		return (
			<Text key = {'cardType_' + item.cardNo} style = {{
				fontSize: 15,
				color: Global._colors.FONT_GRAY,
				margin: 10,
			}} >{item.typeName}</Text>
		);
	}
	buildCard(card) {
		return <Card key = {card.id}
			showType = {1}
			realcheck = {(card) => {this.goPage(card)}}
			card = {card}
			onPress = {() => { this.cardDetail(card); } }
			/>
	}

	cardAdd() {
		this.props.navigator.push({
			component: CardADD,
			hideNavBar: true,
			passProps: {
				card: this.state.cards,
				userPatient: this.state.userPatient,
				fresh: this.fresh
			}
		});
	}

	/**
	 * 刷新本页
	*/
	fresh(editvalue,tempValue) {
		if(editvalue!=undefined && editvalue===true){
			this.setState({
				userPatient: tempValue
			});
		}
		this.fetchData();
		this.fetchCardData();
	}
	/**
	 * 跳转卡详情页面
	*/
	cardDetail(card) {
		this.props.navigator.push({
			component: CardDetail,
			hideNavBar: true,
			passProps: {
				userPatient: this.state.userPatient,
				patientItemRowId: this.props.patientItemRowId,
				card: card,
				fresh: this.fresh
			},
		});
	}

	nocard() {
		return (
			<TouchableOpacity
				style={[styles.cardStyle1]}
				onPress={() => this.cardAdd() }
				>

				<View style = {styles.detailHolder} >
					<Text style = {styles.bankName} >
						<Text style = {styles.cardTypeInDetail} >还未绑卡，点击绑定</Text>
					</Text>
				</View>

			</TouchableOpacity>
		);
	}

	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		return (
			<View style = {Global._styles.CONTAINER} >
				{this._getNavBar() }
				<ScrollView style = {styles.scrollView} keyboardShouldPersistTaps={true}>
                    {this.getInfoList() }
					<View style={styles.paddingView }></View>
					{this.state.cards ? this.state.cards.length <= 0 ? this.nocard() : this.getCardsList() : this.nocard()}
					<View style={styles.paddingView }></View>
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
			<NavBar title = '就诊人员明细' 
		    	navigator = {this.props.navigator} 
				route = {this.props.route}
		    	hideBackButton = {false} 
		    	hideBottomLine = {false}
				backFn = {this.goBack}
				rightButtons = {(
					<View style = {[Global._styles.NAV_BAR.BUTTON_CONTAINER, Global._styles.NAV_BAR.RIGHT_BUTTONS]}>
						<TouchableOpacity style = {[Global._styles.NAV_BAR.BUTTON]} onPress={() => this.goNext()}>
							<Text style = {{color:'white',paddingRight:10}}>编辑</Text>
						</TouchableOpacity>
					</View>
				)} />
		);
	}

}

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
	},
	listItem: {
        alignItems: 'center', 
        justifyContent: 'center',//上下
        height: 40,
        width: Global.getScreen().width,
        backgroundColor:'white',
        flexDirection: 'row',
    },
	testLeft:{
        width: Global.getScreen().width/3,
        left: 15,
    },
    testRight:{
        // width: Global.getScreen().width/4,
        flex:1,
        right: 15,
        textAlign:'right',
    },
	cardStyle1: {
		borderRadius: 4,
		marginBottom: 5,
		marginTop: 3,
		padding: 0,
		borderWidth: 1 / Global._pixelRatio,
		borderColor: Global._colors.IOS_SEP_LINE,
		backgroundColor: 'white'
	},
	detailHolder: {
		height: 40
	},
	bankName: {
		fontSize: 14,
		textAlign: 'center',
		color: '#63636b',
		marginTop: 10,
		marginBottom: 6
	},
	cardTypeInDetail: {
		textAlign: 'center',
		fontSize: 15,
		color: '#63636b'
	},
	button: {
		alignItems: 'center',
		justifyContent: 'center',
		height: 40,
		borderWidth: 1 / Global._pixelRatio,
		borderRadius: 3
	}
});

export default PatientDetail;



