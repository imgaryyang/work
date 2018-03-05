'use strict';
/**
 * 绑定卡 第一步 输入卡号
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
    Alert,
} from 'react-native';

import * as Global  from '../../Global';
import Form 		from '../../lib/form/EasyForm';
import FormConfig 	from '../../lib/form/config/DefaultConfig';

import NavBar       from 'rn-easy-navbar';
import Button       from 'rn-easy-button';
import BindCard2        from './BindCard2';
import BindStep         from './BindStep';

class BindCard1 extends Component {

    static displayName = 'BindCard1';
    static description = '绑定卡-输入卡号';

    form = null;
    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
		value: {
			cardNo: '',
		},
		showLabel: true,
		labelPosition: 'left',
		disabled: false,
	};

    constructor (props) {
        super(props);
        this.submit 		= this.submit.bind(this);
        this.onChange 		= this.onChange.bind(this);
    }

	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({
				doRenderScene: true,
			});
		});
	}
	
	onChange (fieldName, fieldValue, formValue) {
		this.setState({value: formValue});
	}
	
	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();
		return (
			<View style = {Global._styles.CONTAINER} >
				{this._getNavBar()}
				<BindStep num="1"/>
				<ScrollView automaticallyAdjustContentInsets = {false} keyboardShouldPersistTaps = {true} style = {styles.scrollView} >
					<Form ref = {(c) => this.form = c} config = {FormConfig} showLabel = {this.state.showLabel} labelPosition = {this.state.labelPosition}
						labelWidth = {50} onChange = {this.onChange} value = {this.state.value} >
						<Form.TextInput name = "cardNo" autoFocus={true} label = "卡号" minLength = {16} maxLength = {19}
							 placeholder = "请输入卡号" dataType = "bankAcct" />
					</Form>
					<View style={styles.textDescView}>
						<Text>注意：</Text>
						<View>
							<Text style={styles.textStyle}>1、请输入二代社保卡银行卡卡号；</Text>
							<Text style={styles.textStyle}>2、请输入银联卡卡号；</Text>
							<Text style={styles.textStyle}>3、请输入本人社保卡或银行卡号。</Text>
						</View>
					</View>
					<View style = {{flexDirection: 'row', margin: 10, marginTop: 20, marginBottom: 40}} >
						<Button text = "下一步" disabled = {this.state.disabled} onPress={() => this.submit()}/>
					</View>
				</ScrollView>
			</View>
		);
	}
	_getNavBar () {
		return (
			<NavBar 
				title = '输入卡号'
				// centerComponent = {(
				// 	<BindStep num="1"/>
				// )} 
				navigator = {this.props.navigator} 
				route = {this.props.route} 
				hideBottomLine = {false} 
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
	async submit () {
		if (!this.form.validate()) {
			return;
		}
        let FIND_URL = 'el/cardBin/checkCardNo/';
		let cardNo = this.state.value.cardNo;
        this.showLoading();
        try {
	        let responseData = await this.request(Global._host + FIND_URL + cardNo,{
	        	method:'GET',
            });
            if(responseData.success){
            	//验证卡号是否存在，如果存在，而且状态为1 提示该卡已经绑定
            	let FIND_URL1 = 'el/bankCards/getCardFoCardNo/';
		        let responseData1 = await this.request(Global._host + FIND_URL1 + cardNo,{
		        	method:'GET',
	            });
	            if(responseData1.success){
            		this.hideLoading();
	            	if(responseData1.result!=null && responseData1.result.state==1){
		            	this.toast("该卡已经绑定，请更换卡号。");
		            	return;
	            	}
					this.props.navigator.push({
						component: BindCard2, 
						hideNavBar: true, 
			            passProps: {
			            	cardBin: responseData.result,
	                    	cardNo: cardNo,
			            },
		        	});
	            }
            }
        } catch(e) {
            this.hideLoading();
            this.handleRequestException(e);
        }
	}
}

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
		// backgroundColor: "#ffffff",
		marginBottom: Global._os == 'ios' ? 48 : 0,
	},
	textDescView: {
		position: 'relative',
		alignItems: 'flex-start',
		flexDirection: 'row',
		paddingLeft: 10,
		paddingRight: 10,
		marginTop: 5,
	},
	textStyle: {
		lineHeight: 25,
	},
	fieldSet: {
		borderLeftColor: 'brown', 
		paddingLeft: 10,
		paddingTop: 15,
		paddingBottom: 15, 
	},
});

export default BindCard1;

