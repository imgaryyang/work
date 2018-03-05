'use strict';
/**
 * 卡样组件，显示几种通用卡样
 */
import React, {
    Component,
} from 'react';

import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

import * as Global  from '../../Global';
import {filterCardNumLast4} from '../../utils/Filters';

const bbColors = {
	'1': '#ff6463',
	'2': '#5ac9f1',
	'3': '#4CD964',
};

class Card extends Component {

    constructor (props) {
        super(props);
        
        this.state = {
        };
    }

	render () {
		if(this.props.showType == "1") {
			return this._renderCard1(this.props.card.cardType.type);
		} else {
			return this._renderCard2(this.props.card.cardType.type);
		}
	}

	/**
	 * 查看卡详情
	 */
	cardDetail () {
  		const {onPress} = this.props;
  		if(onPress && 'function' == typeof onPress)
  			onPress();
	}

	/**
	 * 渲染卡类型
	 */
	renderCardType () {
		let item = this.props.card;
		let cardType = item.cardType.type, type1, type2;  //1 - 银行卡 2 - 社保卡 3 - 健康卡
		switch (cardType) {
			case '1':
				type1 = '银行卡';
				type2 = item.bankCardTypeName;
				break;
			case '2':
				type1 = '社保卡';
				type2 = item.cardType.orgName + '社会保障卡';
				break;
			case '3':
				type1 = '健康卡';
				type2 = item.cardType.orgName + '健康卡';
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

	_renderCard1 (cardType) {
		return (
			<TouchableOpacity 
				style={[styles.cardStyle1]}
		    	onPress={() => this.cardDetail()} >

		    	{this.renderCardType()}

		    	<View style = {styles.cardInfo} >
		    		<View style = {styles.bankLogoContainer} >
			    		<View style = {styles.bankLogoHolder} >
			    			<Image source = {this.getBankLogo(this.props.card.bankNo)} style = {styles.bankLogo} />
			    		</View>
		    		</View>
		    		<View style = {styles.detailHolder} >
		    			<Text style = {styles.bankName} >
		    				{this.props.card.bankName + '  '}
		    				<Text style = {styles.cardTypeInDetail} >
		    					{cardType != '1' ? this.props.card.bankCardTypeName : null}
		    				</Text>
		    			</Text>
		    			<Text style = {styles.cardholder} >{this.props.card.cardHolder}</Text>
		    			<Text style = {styles.cardNo} >{filterCardNumLast4(this.props.card.cardNo)}</Text>
		    		</View>
		    	</View>

			    <View style = {[styles.bl, {borderColor: bbColors[cardType]}]} />
			    <View style = {styles.blMask} />

			</TouchableOpacity>
		);
	}

	_renderCard2 (cardType) {
		return (
			<View style={[styles.cardStyle2, {borderBottomColor: bbColors[cardType]}]} >

		    	{this.renderCardType()}

		    	<View style = {[styles.cardInfo]} >
		    		<View style = {styles.bankLogoContainer} >
			    		<View style = {styles.bankLogoHolder} >
			    			<Image source = {this.getBankLogo(this.props.card.bankNo)} style = {styles.bankLogo} />
			    		</View>
		    		</View>
		    		<View style = {styles.detailHolder} >
		    			<Text style = {styles.bankName} >
		    				{this.props.card.bankName + '  '}
		    				<Text style = {styles.cardTypeInDetail} >
		    					{cardType != '1' ? this.props.card.bankCardTypeName : null}
		    				</Text>
		    			</Text>
		    			<Text style = {styles.cardholder} >{this.props.card.cardHolder}</Text>
		    			<Text style = {styles.cardNo} >{filterCardNumLast4(this.props.card.cardNo)}</Text>
		    		</View>
		    	</View>

			    <View style = {[styles.bl, {borderColor: bbColors[cardType]}]} />
			    <View style = {styles.blMask} />

			</View>
		);
	}

	getBankLogo(bankNo){
		let icon = require('../../res/images/bankLogos/1040000.png');
		switch(bankNo){
			case "1000000":
				icon = require('../../res/images/bankLogos/1000000.png');
				break;
			case "1020000":
				icon = require('../../res/images/bankLogos/1020000.png');
				break;
			case "1030000":
				icon = require('../../res/images/bankLogos/1030000.png');
				break;
			case "1040000":
				icon = require('../../res/images/bankLogos/1040000.png');
				break;
			case "1050000":
				icon = require('../../res/images/bankLogos/1050000.png');
				break;
			case "3010000":
				icon = require('../../res/images/bankLogos/3010000.png');
				break;
			case "3020000":
				icon = require('../../res/images/bankLogos/3020000.png');
				break;
			case "3030000":
				icon = require('../../res/images/bankLogos/3030000.png');
				break;
			case "3050000":
				icon = require('../../res/images/bankLogos/3050000.png');
				break;
			case "3060000":
				icon = require('../../res/images/bankLogos/3060000.png');
				break;
			case "3070000":
				icon = require('../../res/images/bankLogos/3070000.png');
				break;
			case "3080000":
				icon = require('../../res/images/bankLogos/3080000.png');
				break;
			case "3090000":
				icon = require('../../res/images/bankLogos/3090000.png');
				break;
			case "3100000":
				icon = require('../../res/images/bankLogos/3100000.png');
				break;
			case "4031000":
				icon = require('../../res/images/bankLogos/4031000.png');
				break;
			case "4062410":
				icon = require('../../res/images/bankLogos/4062410.png');
				break;
		}
		return icon;
	}
}

const styles = StyleSheet.create({
	cardStyle1: {
		borderRadius:4,
		marginBottom:5,
		marginTop:3,
		padding: 0,
		borderWidth: 1 / Global._pixelRatio,
		borderColor: Global._colors.IOS_SEP_LINE,
		backgroundColor: 'white',
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
		borderRadius:4,
		marginBottom:5,
		marginTop:3,
		padding: 0,
		borderWidth: 1 / Global._pixelRatio,
		borderColor: Global._colors.IOS_SEP_LINE,
		backgroundColor: 'white',
	},

	cardType: {
		flexDirection: 'row',
		padding: 15,
		marginBottom: 15,
		borderBottomWidth: 1 / Global._pixelRatio,
		borderBottomColor: Global._colors.IOS_SEP_LINE,
		alignItems: 'center',
		justifyContent: 'center',
	},
	cardTypeText1: {
		textAlign: 'center',
		fontSize: 12,
		color: Global._colors.FONT_GRAY,
		width: 61,
	},
	cardTypeText2: {
		flex: 1,
		fontSize: 14,
		color: Global._colors.FONT_GRAY,
	},

	cardInfo: {
		flexDirection: 'row',
	},
	bankLogoContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		width: 76,
		height: 32,
	},
	bankLogoHolder: {
		width: 32,
		height: 32,
		borderRadius: 16,
		borderWidth: 1 / Global._pixelRatio,
		borderColor: Global._colors.IOS_SEP_LINE,
		alignItems: 'center',
		justifyContent: 'center',
		overflow: 'hidden',
	},
	bankLogo: {
		width: 30,
		height: 18,
		resizeMode: 'contain',
	},

	detailHolder: {
		flex: 1,
	},
	bankName: {
		fontSize: 14,
		color: '#63636b',
		marginTop: 6,
		marginBottom: 6,
	},
	cardTypeInDetail: {
		fontSize: 12,
		color: '#63636b',
	},
	cardholder: {
		fontSize: 14,
		color: '#63636b',
		marginBottom: 6,
	},
	cardNo: {
		fontSize: 14,
		color: '#63636b',
		marginBottom: 15,
	},
	
});

export default Card;

