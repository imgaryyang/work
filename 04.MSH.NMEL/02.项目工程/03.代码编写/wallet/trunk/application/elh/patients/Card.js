'use strict';
/**
 * 卡样组件，显示几种通用卡样(常用就诊人使用)
 */
import React, {
    Component
} from 'react';

import {
    View,
    Text,
    Image,
    TouchableOpacity,
	StyleSheet
} from 'react-native';

import * as Global  from '../../Global';
import {filterCardNumLast4} from '../../utils/Filters';
import Button       from 'rn-easy-button';

const bbColors = {
	'1': '#ff6463',
	'2': '#5ac9f1',
	'3': '#4CD964'
};

class Card extends Component {

	constructor (props) {
		super(props);
		this.state = {
		};
	}

	render () {
		let cardType=1;
		if(this.props.card.typeName==='医保卡'){
			cardType=1;
		}else if(this.props.card.typeName==='健康卡'){
			cardType=2;
		}else if(this.props.card.typeName==='就诊卡'){
			cardType=3;
		}
		if(this.props.showType === 1) {
			return this._renderCard1(cardType);
		} else {
			return this._renderCard2(cardType);
		}
	}

	/**
	 * 查看卡详情
	 */
	cardDetail () {
		const {onPress} = this.props;
		onPress();
	}

	/**
	 * 渲染卡类型
	 */
	renderCardType () {
		let item = this.props.card;
		let cardType = item.typeName, type1, type2;  //1 - 银行卡 2 - 社保卡 3 - 健康卡
		switch (cardType) {
		case '社保卡':
			type1 = '社保卡';
			type2 = item.orgName===null ? '社会保障卡' : item.orgName + '社会保障卡';
			break;
		case '健康卡':
			type1 = '健康卡';
			type2 = item.orgName===null ? '健康卡' : item.orgName + '健康卡';
			break;
		case '就诊卡':
			type1 = '就诊卡';
			type2 = item.orgName===null ? '就诊卡' : item.orgName + '就诊卡';
			break;
		default:
			break;
		}
		return (
			<View style = {styles.cardType} >
				<Text style = {styles.cardTypeText1} >{type1}</Text>
				<Text style = {styles.cardTypeText2} >{type2}</Text>
			</View>
		);
	}

	_renderCard1(cardType) {
		return (
			<TouchableOpacity
				style={[styles.cardStyle1]}
				onPress={() => this.cardDetail() }
				>

				{this.renderCardType() }

				<View style = {styles.cardInfo} >
					<View style = {styles.bankLogoContainer} >
						<View style = {styles.bankLogoHolder} >
							<Image source = {this.getBankLogo(this.props.card.bankNo) } style = {styles.bankLogo} />
						</View>
					</View>
					<View style = {styles.detailHolder} >
						<Text style = {styles.bankName} >
							<Text style = {styles.cardTypeInDetail} >卡号    </Text>
							{this.props.card.cardNo}
						</Text>
					</View>
					{cardType===3 ? null : this.props.card.realName ? this.goRealName(true,cardType,this.props.card) : this.goRealName(false,cardType,this.props.card)}
				</View>

				<View style = {[styles.bl, { borderColor: bbColors[cardType] }]} />
				<View style = {styles.blMask} />

			</TouchableOpacity>
		);
	}

	goRealName(show,type,card) {
		let colors;
		switch (type) {
		case 1:
			colors = '#ff6463';
			break;
		case 2:
			colors = '#5ac9f1';
			break;
		case 3:
			colors = '#4CD964';
			break;
		default:
			break;
		}
		if(show){
			return (<Button text = "已实名认证" disabled={true} style={[styles.button,{backgroundColor: colors,borderColor: colors}]}/>);
		}else{
			return (<Button text = "去实名认证" style={[styles.button,{backgroundColor: colors,borderColor: colors}]}  onPress={() => this.props.realcheck(card)}/>);
		}
	}

	_renderCard2(cardType) {
		return (
			<View style={[styles.cardStyle2, { borderBottomColor: bbColors[cardType] }]} >

				{this.renderCardType() }

				<View style = {[styles.cardInfo]} >
					<View style = {styles.bankLogoContainer} >
						<View style = {styles.bankLogoHolder} >
							<Image source = {this.getBankLogo(this.props.card.bankNo) } style = {styles.bankLogo} />
						</View>
					</View>
					<View style = {styles.detailHolder} >
						<Text style = {styles.bankName} >
							<Text style = {styles.cardTypeInDetail} >卡号    </Text>
							{this.props.card.cardNo}
						</Text>
						<Text style = {styles.cardholder} >{this.props.card.cardHolder}</Text>
						<Text style = {styles.cardNo} >{filterCardNumLast4(this.props.card.cardNo) }</Text>
					</View>
				</View>

			</View>
		);
	}

	getBankLogo(bankNo){
		let icon = require('../../res/images/bankLogos/1040000.png');
		switch(bankNo){
		case '1020000':
			icon = require('../../res/images/bankLogos/1020000.png');
			break;
		case '1030000':
			icon = require('../../res/images/bankLogos/1030000.png');
			break;
		case '1040000':
			icon = require('../../res/images/bankLogos/1040000.png');
			break;
		case '1050000':
			icon = require('../../res/images/bankLogos/1050000.png');
			break;
		case '3020000':
			icon = require('../../res/images/bankLogos/3020000.png');
			break;
		default: 
			icon = require('../../res/images/hosp/default.png');
		}
		return icon;
	}
}

const styles = StyleSheet.create({
	cardStyle1: {
		borderRadius: 4,
		marginBottom: 5,
		marginTop: 3,
		padding: 0,
		borderWidth: 1 / Global._pixelRatio,
		borderColor: Global._colors.IOS_SEP_LINE,
		backgroundColor: 'white'
	},

	//只有IOS支持单边个性化边框，采用双View模拟底边线，以支持Android显示
	bl: {
		position: 'absolute',
		left: 0,
		bottom: 0,
		width: Global.getScreen().width - 16,
		height: 10,
		borderWidth: 3,
		backgroundColor: 'white',
		borderRadius: 4
	},
	blMask: {
		position: 'absolute',
		left: 1 / Global._pixelRatio,
		bottom: 3,
		width: Global.getScreen().width - 16 - 3 / Global._pixelRatio,
		height: 10,
		backgroundColor: 'white',
		borderRadius: 6
	},

	cardStyle2: {
		padding: 0,
		borderBottomWidth: 3,
		backgroundColor: 'white'
	},
	cardType: {
		flexDirection: 'row',
		padding: 7,
		marginBottom: 7,
		borderBottomWidth: 1 / Global._pixelRatio,
		borderBottomColor: Global._colors.IOS_SEP_LINE,
		alignItems: 'center',
		justifyContent: 'center'
	},
	cardTypeText1: {
		textAlign: 'center',
		fontSize: 12,
		color: Global._colors.FONT_GRAY,
		width: 61
	},
	cardTypeText2: {
		flex: 1,
		fontSize: 14,
		color: Global._colors.FONT_GRAY
	},

	cardInfo: {
		flexDirection: 'row'
	},
	bankLogoContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		width: 35,
		height: 35
	},
	bankLogoHolder: {
		width: 25,
		height: 32,
		borderRadius: 16,
		borderWidth: 1 / Global._pixelRatio,
		borderColor: Global._colors.IOS_SEP_LINE,
		alignItems: 'center',
		justifyContent: 'center',
		overflow: 'hidden'
	},
	bankLogo: {
		width: 30,
		height: 18,
		resizeMode: 'contain'
	},

	detailHolder: {
		height: 40
	},
	bankName: {
		fontSize: 14,
		color: '#63636b',
		marginTop: 6,
		marginBottom: 6
	},
	cardTypeInDetail: {
		fontSize: 12,
		color: '#63636b'
	},
	cardholder: {
		fontSize: 14,
		color: '#63636b',
		marginBottom: 6
	},
	cardNo: {
		fontSize: 14,
		color: '#63636b',
		marginBottom: 15
	},
	button: {
		alignItems: 'center',
		justifyContent: 'center',
		height: 20,
		borderWidth: 1 / Global._pixelRatio,
		borderRadius: 3,
		margin: 5,
		padding: 12
	}
});

export default Card;