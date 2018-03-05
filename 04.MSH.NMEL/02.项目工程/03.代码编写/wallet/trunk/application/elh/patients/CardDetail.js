/**
 * 卡详情界面 
 * */
'use strict';

import React, {
    Component,
    PropTypes,
} from 'react';

import {
    View,
	Alert,
    ScrollView,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
	InteractionManager,
} from 'react-native';

import * as Global  from '../../Global';
import NavBar       from 'rn-easy-navbar';
import Button       from 'rn-easy-button';

const DELETE_URL 	= 'elh/medicalCard/my/';

class CardDetail extends Component {

    static displayName = 'CardDetail';
    static description = '卡详情界面';

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
		userPatient: this.props.card,
	};

    constructor (props) {
        super(props);
    }

	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
	}

    /**
	 * 展示卡信息list
	 */
    getInfoList() {
		return (
			<View>
				<View style={Global._styles.PLACEHOLDER20} />
				<View style={Global._styles.FULL_SEP_LINE} />
				<View style={[styles.listItem, Global._styles.CENTER]} >
					<Text style={styles.testLeft}>卡类型</Text>
					<Text style={styles.testRight}>{this.state.userPatient.typeName===null ? '' : this.state.userPatient.typeName}</Text>
				</View>
				<View style={Global._styles.FULL_SEP_LINE} />
				<View style={[styles.listItem, Global._styles.CENTER]} >
					<Text style={styles.testLeft}>卡号</Text>
					<Text style={styles.testRight}>{this.state.userPatient.cardNo===null ? '' : this.state.userPatient.cardNo}</Text>
				</View>
				<View style={Global._styles.FULL_SEP_LINE} />
				<View style={[styles.listItem, Global._styles.CENTER]} >
					<Text style={styles.testLeft}>持卡人姓名</Text>
					<Text style={styles.testRight}>{this.state.userPatient.cardholder===null ? '' : this.state.userPatient.cardholder}</Text>
				</View>
				<View style={[styles.listItem, Global._styles.CENTER]} >
					<Text style={styles.testLeft}>持卡人身份证号</Text>
					<Text style={styles.testRight}>{this.state.userPatient.idCardNo===null ? '' : this.state.userPatient.idCardNo}</Text>
				</View>
				<View style={Global._styles.FULL_SEP_LINE} />
				<View style={[styles.listItem, Global._styles.CENTER]} >
					<Text style={styles.testLeft}>发卡机构</Text>
					<Text style={styles.testRight}>{this.state.userPatient.orgName===null ? '' : this.state.userPatient.orgName}</Text>
				</View>
				<View style={Global._styles.FULL_SEP_LINE} />
				<View style={[styles.listItem, Global._styles.CENTER]} >
					<Text style={styles.testLeft}>绑卡时间</Text>
					<Text style={styles.testRight}>{this.state.userPatient.bindedAt===null ? '' : this.state.userPatient.bindedAt}</Text>
				</View>
				<View style={Global._styles.FULL_SEP_LINE} />
				<View style={[styles.listItem, Global._styles.CENTER]} >
					<Text style={styles.testLeft}>解绑时间</Text>
					<Text style={styles.testRight}>{this.state.userPatient.unbindedAt===null ? '' : this.state.userPatient.unbindedAt}</Text>
				</View>
				<View style={Global._styles.FULL_SEP_LINE} />
				<View style={Global._styles.PLACEHOLDER20} />
			</View>
		);
    }

	/**
	 * 提示解绑本卡
	*/
	confirmDelete() {
		Alert.alert(
            '提示',
            '您确定要解绑本卡吗？',
            [
				{ text: '取消', style: 'cancel' },
				{ text: '确定', onPress: () => this.delPatient() },
            ]
        );
    }

	/**
	 * 解绑本卡
	*/
	async delPatient () {
		this.showLoading();
		try {
			let responseData = await this.request(Global._host + DELETE_URL + this.props.card.id, {
	        	method:'DELETE',
			});
			this.hideLoading();
            if(responseData.success){
	    		// this.props.refreshDataSource();//后续优化改进
				//TODO 需要刷新上页
				this.toast('解绑成功');
				this.props.fresh();
				this.props.navigator.pop();
            }
		} catch(e) {
			this.hideLoading();
			this.handleRequestException(e);
		}
	}

	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		return (
			<View style = {Global._styles.CONTAINER} >
				{this._getNavBar()}
				<ScrollView style = {styles.scrollView} keyboardShouldPersistTaps={true}>
					{this.getInfoList()}
					<View style={styles.paddingView }></View>
					<Button text = "解绑" style={{margin:10}} theme={Button.THEME.ORANGE}  onPress={() => this.confirmDelete()}/>
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
			<NavBar title = '卡详细信息' 
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
	},
	listItem: {
        alignItems: 'center',
        justifyContent: 'center',//上下
        height: 40,
        width: Global.getScreen().width,
        backgroundColor: 'white',
        flexDirection: 'row',
    },
	testLeft: {
        width: Global.getScreen().width / 3,
        left: 15,
    },
    testRight: {
        // width: Global.getScreen().width/4,
        flex: 1,
        right: 15,
        textAlign: 'right',
    }
});

export default CardDetail;