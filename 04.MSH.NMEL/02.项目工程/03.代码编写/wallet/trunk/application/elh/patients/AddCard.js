/**
 * 添加卡第一步 选择卡类型
 */
'use strict';

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
import NavBar       from 'rn-easy-navbar';
import EasyIcon     from 'rn-easy-icon';

import BindCard     from './BindCard';
import BindCardH    from './BindCardH';
import BindCardP    from './BindCardP';

const FINDCARD_URL = 'elh/medicalCard/all/cardTypes';

class AddCard extends Component {

    static displayName = 'AddCard';
    static description = '选择卡类型';

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
		cardType: [],
		cards: null
	};

    constructor (props) {
        super(props);
    }

	componentDidMount () {
		this.getCardType();
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
	}

	/**
	 * 异步加获取卡类型和发卡机构
	 */
	async getCardType () {
		try {
			let responseData = await this.request(Global._host + FINDCARD_URL, {
	        	method:'GET',
			});
            if(responseData.success){
				this.renderCardMananger(responseData.result);
            }
		} catch(e) {
			this.handleRequestException(e);
		}
	}

	/**
     * 处理卡类型和发卡机构
    */
    renderCardMananger(result){
        if(result){
            this.setState({
                cardType: result
            });
        }
    }

	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		return (
			<View style = {Global._styles.CONTAINER} >
				{this._getNavBar()}
				<ScrollView style = {styles.scrollView} keyboardShouldPersistTaps={true}>
					<View style={Global._styles.PLACEHOLDER20} />
					<View style={Global._styles.FULL_SEP_LINE} />
					<TouchableOpacity onPress={() => this.goNextStep(2) }>
						<View style={{flex:1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
							<Text style = {{ marginLeft:10,fontSize: 15 }}>二代社保卡</Text>
							<EasyIcon iconLib = 'fa' name = 'angle-right'
								size = {35} color = {Global._colors.IOS_ARROW} />
						</View>
					</TouchableOpacity>
					<View style={Global._styles.FULL_SEP_LINE} />
					<TouchableOpacity onPress={() => this.goNextStep(3) }>
						<View style={{flex:1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
							<Text style = {{ marginLeft:10,fontSize: 15 }}>健康卡</Text>
							<EasyIcon iconLib = 'fa' name = 'angle-right'
								size = {35} color = {Global._colors.IOS_ARROW} />
						</View>
					</TouchableOpacity>
					<View style={Global._styles.FULL_SEP_LINE} />
					<TouchableOpacity onPress={() => this.goNextStep(4) }>
						<View style={{flex:1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
							<Text style = {{ marginLeft:10,fontSize: 15 }}>就诊卡</Text>
							<EasyIcon iconLib = 'fa' name = 'angle-right'
								size = {35} color = {Global._colors.IOS_ARROW} />
						</View>
					</TouchableOpacity>
					<View style={Global._styles.FULL_SEP_LINE} />
					<View style={Global._styles.PLACEHOLDER20} />
				</ScrollView>
			</View>
		);
	}

	/**
	 * 到第二环节
	 * 注意字符串的数字和纯数字
	*/
	goNextStep(type) {
		let comp;
		let typeN;
		switch (type) {
			case 2:
				comp = BindCard;
				typeN = '社保卡';
				break;
			case 3:
				comp = BindCardH;
				typeN = '健康卡';
				break;
			case 4:
				comp = BindCardP;
				// typeN = '就诊卡';
				break;
			// default:
			// 	break;
		}
		let cards = []; //某类型卡有多少
		let flag;
		let typeCards = []; //某类型有多少type
		for (let cardt of this.state.cardType) {
			if (cardt.type === type.toString()) {
				typeCards.push(cardt);
			}
		}
		if (this.props.card) {
			for (let tcard of this.props.card) {
				if (tcard.typeName === typeN) {
					cards.push(tcard);
				}
			}
		}
		if (cards.length > 0) {
			if (cards.length >= typeCards.length) {
				this.toast(typeN + '已经不能添加了');
				return;
			} else {
				for (let card of cards) {
					typeCards = typeCards.filter(selected =>
						selected.id !== card.typeId
					);
				}
			}
			if (typeCards.length > 0) {
				this.props.navigator.push({
					component: comp,
					hideNavBar: true,
					passProps: {
						hadcard: cards,
						type: type,
						userPatient: this.props.userPatient,
						fresh: this.props.fresh
					}
				});
			} else {
				this.toast(typeN + '已经不能添加了');
				return;
			}
		} else {
			// this.toast(typeN + '已经不能添加了');
			this.props.navigator.push({
				component: comp,
				hideNavBar: true,
				passProps: {
					hadcard: cards,
					type: type,
					userPatient: this.props.userPatient,
					fresh: this.props.fresh
				}
			});
		}
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
			<NavBar title = '选择卡类型' 
		    	navigator = {this.props.navigator} 
				route = {this.props.route}
		    	hideBackButton = {false} 
		    	hideBottomLine = {false} />
		);
	}

}

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
		backgroundColor: '#fff'
	},
});

export default AddCard;



