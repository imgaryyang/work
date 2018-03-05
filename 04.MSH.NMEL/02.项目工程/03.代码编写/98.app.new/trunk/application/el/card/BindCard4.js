'use strict';
/**
 * 绑定卡成功
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
} from 'react-native';

import * as Global  from '../../Global';

import NavBar       from 'rn-easy-navbar';
import Button       from 'rn-easy-button';
import Separator    from 'rn-easy-separator';

import Card			from './Card';
import BindStep		from './BindStep';
import BindCard1	from './BindCard1';

class BindCard4 extends Component {

    static displayName = 'BindCard4';
    static description = '绑定卡成功';

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
		data: null,
	};

    constructor (props) {
        super(props);
        this._backList 		= this._backList.bind(this);
    }

	
	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({
				doRenderScene: true,
				bankCards: this.props.bankCards,
			});
		});
	}
	
	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		return (
			<View style = {Global._styles.CONTAINER} >
				{this._getNavBar()}
				<BindStep num="4"/>
				<ScrollView automaticallyAdjustContentInsets = {false} style = {styles.scrollView} >
					<View style={{flex: 1,height: 80,flexDirection: 'column',marginBottom: 20,marginTop: 30,}}>
						<Text style={[styles.textTitle,{marginTop: 15,}]}>恭喜，您的银行卡绑定成功了~</Text>
					</View>
					<View style = {{margin: 10, marginTop: 20, marginBottom: 20}} >
						<Card  
							showType = {2} 
							card = {this.props.bankCards}
						/>

						{/*<Card color={Global._colors.ORANGE} 
								showType={1} 
								bankNo={this.props.bankCards.bankNo} 
								cardType={this.props.bankCards.cardType.type} 
								cardTypeName={this.props.bankCards.cardType.name} 
								bankName={this.props.bankCards.bankName} 
								bankCardTypeName={this.props.bankCards.bankCardTypeName} 
								cardholder={this.props.bankCards.cardholder} 
								cardNo={this.props.bankCards.cardNo}
								balance="234.09"
								onPress={()=>{this._cardDetail(item);}}
						/>*/}
					</View>
					<View style = {{flexDirection: 'row', margin: 10, marginTop: 20, marginBottom: 40}} >
						<Button text = "继续添加" theme={Button.THEME.BLUE} onPress={() => this._openBindCard1()}/>
						<Separator width = {10} />
						<Button text = "回主页" theme={Button.THEME.ORANGE} onPress={() => this._backList()} />
					</View>
				</ScrollView>
			</View>
		);
	}
	_getNavBar () {
		return (
			<NavBar 
				title = '完成'
				// centerComponent = {(
				// 	<BindStep num="4"/>
				// )} 
				navigator = {this.props.navigator} 
				route = {this.props.route} 
				hideBottomLine = {false} 
				hideBackButton = {false}  
				backFn = {this._backList} 
				rightButtons = {(
					<View style = {{width:1,}}></View>
				)} 
			/>
		);
	}

	_renderPlaceholderView () {
		return (
			<View style = {Global._styles.CONTAINER}>
			</View>
		);
	}

	_openBindCard1() {
		this.props.navigator.push({component: BindCard1, hideNavBar: true});
	}
	_backList() {
		this.props.navigator.popToTop();
	}
}

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
		// backgroundColor: 'white',
		paddingLeft: 5,
		paddingRight: 5,
		marginBottom: Global._os == 'ios' ? 48 : 0,
	},
	textTitle: {
		textAlign: 'center',
		fontSize: 14,
		color:Global.FONT,
	},
	icon: {
		width: 60,
		right: 0,
		top: 10,
	},
	textInputView: {
		flex: 1,
		backgroundColor: 'white',
		paddingBottom: 5,
		paddingLeft: 10,
		paddingRight: 10,
		paddingTop: 5,
		flexDirection : 'row',
		justifyContent: 'center',
	},
	textDescView: {
		position : 'relative',
	},
	textInputText: {
		color: '#000000',
		height: 40,
		width: 80,
		lineHeight: 40,
		alignItems: 'center',
		borderWidth: 1,
	},
	textInputContent: {
		lineHeight:40,
		height: 40,
		borderWidth: 0,
		width: 100,
		alignItems: 'center',
		fontSize: 14,
		backgroundColor: 'transparent',
		flex: 1,
	},
	textStyle: {
		lineHeight:25,
		left: 50,
		top: -18,
	},
	textPadding: {
		left: 10,
	},
});

export default BindCard4;

