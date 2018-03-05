'use strict';

import React, {
    Component,

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

import * as Global  		from '../../Global';

import NavBar       		from 'rn-easy-navbar';
import Card       			from 'rn-easy-card';
import Button       		from 'rn-easy-button';
import Separator    		from 'rn-easy-separator';
import {B, I, U, S} 		from 'rn-easy-text';
import RegisterResource  	from '../register/RegisterResource';


const FIND_DESC_URL 	= 'el/base/desc/all';

class HospDept extends Component {

    static displayName = 'HospDept';
    static description = '科室';

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
		_refreshing: true,//控制刷新
	};

    constructor (props) {
        super(props);
        this.fetchDescData 		= this.fetchDescData.bind(this);
        this.onPressRegister 	= this.onPressRegister.bind(this);
    }

	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true}, () => this.fetchDescData());
		});
	}

	/**
	 * 异步加载数据
	 */
	async fetchDescData () {
		this.setState({
			_refreshing: true,
		});
		try {
			let data = encodeURI(JSON.stringify({
	            	fkId: this.props.dept.id,
	            	fkType: "department",
	        }));
			let responseData = await this.request(Global._host + FIND_DESC_URL + '?data=' + data, {
				method : "GET"
			});

			this.setState({
				descs: responseData.result,
			});
		} catch(e) {
			this.handleRequestException(e);
		}
	}

	/**
	 * 导向到预约挂号
	 */
	onPressRegister (dept) {
		this.props.navigator.push({
        	title: '挂号',
            component: RegisterResource,
            hideNavBar: true,
			passProps: {
				hospitalId: dept.hospitalId,
				departmentId: dept.id,
			}
        });
	}

	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		let emptyView = !this.state._refreshing && !this.state._requestErr && (!this.state.descs || this.state.descs.length == 0) ? (
			<Card fullWidth = {true} style = {{paddingBottom: 20}} >
				<Text style = {[Global._styles.MSG_TEXT, {marginTop: 30, marginBottom: 20}]} >暂无科室详细介绍信息</Text>
			</Card>
		) : null;

		return (
			<View style = {Global._styles.CONTAINER} >
				{this._getNavBar()}
				<ScrollView style = {styles.scrollView} >
					<Separator height = {10} />
					<Card >
						<View style = {Global._styles.CARD_TITLE} >
							<Text style = {Global._styles.CARD_TITLE_TEXT} >院内地址</Text>
						</View>
						<Text style = {[Global._styles.GRAY_FONT, {marginTop: 15}]} >{this.props.dept.address}</Text>
						<Button stretch = {false} theme = {Button.THEME.ORANGE} onPress = {() => this.onPressRegister(this.props.dept)} style = {{width: 70, height: 25, position: 'absolute', top: 0, right: 15, borderRadius: 0}} >
							<Text style = {{fontSize: 12, color: 'white'}} >去挂号</Text>
						</Button>
					</Card>
					<Separator height = {10} />

					{this.getLoadingView('正在载入科室详细介绍信息...', this.fetchDescData, {marginTop: 20})}
					{emptyView}
					{this.renderDescs()}

					<Separator height = {40} />
				</ScrollView>
			</View>
		);
	}

	renderDescs() {
		if(!this.state.descs || this.state.descs.length==0){
			return null;
		}
		return(
			<Card >
				{this.state.descs.map((item, idx) => {
					return (
						<View key = {"desc_" + idx} style = {{marginTop: 12}} >
							<Text style = {[Global._styles.GRAY_FONT]} ><B>{item.caption}</B></Text>
							<Text style = {[Global._styles.GRAY_FONT, {marginTop: 10}]} >{item.body}</Text>
						</View>
					);
				})}
			</Card>
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
			<NavBar title = {this.props.dept.name} 
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
});

export default HospDept;



