'use strict';

import React, {
    Component,
    PropTypes,
} from 'react';

import {
	Animated,
	ScrollView,
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    ListView,
	InteractionManager,
	Picker,
	RefreshControl,
} from 'react-native';

import * as Global  	from '../../Global';
import NavBar			from 'rn-easy-navbar';
import EasyIcon     	from 'rn-easy-icon';
import Card       		from 'rn-easy-card';
import Portrait     	from 'rn-easy-portrait';
import {B, I, U, S} 	from 'rn-easy-text';

import ChoosePat    	from './ChoosePat.js';

const FIND_REG_URL = 'elh/treat/reg/sources/appiont';

class Appointment extends Component {

    static displayName = 'Appointment';
    static description = '预约挂号';

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
		dataSource: new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,
		}),
		_refreshing: true,//控制刷新
		_pullToRefreshing: false,//控制下拉刷新
	};

	/**
	*会用到props需在此bind
	*例   this.refresh 		= this.refresh.bind(this);
	*/
    constructor (props) {
        super(props);
        this.doReg 			= this.doReg.bind(this);
        this.renderItem 	= this.renderItem.bind(this);
        this.fetchData		= this.fetchData.bind(this);
        this.refresh 		= this.refresh.bind(this);
        this.pullToRefresh 	= this.pullToRefresh.bind(this);
    }

    //初始化
	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
		this.fetchData();
	}

	/**
	 * 刷新
	 */
	refresh () {
		this.setState({
			_refreshing: true,
		}, () => {
			this.fetchData();
		});
	}

	/**
	 * 下拉刷新
	 */
	pullToRefresh () {
		this.setState({
			_pullToRefreshing: true,
		}, () => {
			this.fetchData();
		});
	}

	async fetchData () {
		this.showLoading();
		this.setState({
			loaded: false,
			fetchForbidden: false,
		});
		try {
			let regData =  encodeURI(JSON.stringify({
	            hospital: this.props.hospId,
	            department: this.props.deptId,
	            regType: '1',
	            date: this.props.date,
	          }));
			let responseRegData = await this.request(Global._host + FIND_REG_URL+"?"+"data="+regData, {
					method: 'GET'
				});
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(responseRegData.result),
				hospName: responseRegData.result[0].hospitalName,
				deptName: responseRegData.result[0].departmentName,
				loaded: true,
			});
			this.hideLoading();
		} catch(e) {
			this.hideLoading();
			this.handleRequestException(e);
		}
	}

	doReg (item) {
		if(item.last == '0'){
			this.toast('没有剩余号源！');
		}else{
			this.props.navigator.push({
	            title: "选择常用就诊人",
	            component: ChoosePat,
	            passProps: {
	            	regInfo: item,
	            	refresh: this.refresh,
	            	backRoute: this.props.backRoute,
	            },
	            hideNavBar: true,
	        });
		}
    }
	

	render () {
		var listView = null;
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		var refreshText = this.state.fetchForbidden === true ? 
			'您还未登录，登录后点击此处刷新数据' : 
			'暂无符合条件的数据，点击此处重新载入';

		var SIStyleIOS = Global._os === 'ios' ? Global._styles.TOOL_BAR.SEARCH_INPUT_IOS : {};

		return (
			<View style = {Global._styles.CONTAINER} >
				{this._getNavBar()}
				<ScrollView>
					<Card radius = {6} style = {{margin: 8, marginTop: 16}} >
						<View style = {[{flexDirection: 'row', alignItems: 'center'}]}>
							<Portrait imageSource = {require('../../res/images/hosp/logo01.png')} width = {30} height = {30} />
							<View style = {{ marginLeft:10,marginTop:10,marginBottom:10}}>
								<Text>{this.state.hospName}</Text>
								<Text style = {{fontSize:13, marginTop: 5}}>{this.state.deptName}</Text>
							</View>
						</View>
					</Card>

					<ListView
						key = {this.data}
				        dataSource = {this.state.dataSource}
				        renderRow = {this.renderItem}
				        enableEmptySections = {true}
				        refreshControl = {
							<RefreshControl
								refreshing = {this.state._pullToRefreshing}
								onRefresh = {this.pullToRefresh}/>
						} />

					<View style = {Global._styles.PLACEHOLDER40} />
				</ScrollView>
			</View>
		);
	}

	renderItem (item, sectionID, rowID, highlightRow) {
            
		return (
			<View >
				<TouchableOpacity onPress = {()=>{this.doReg(item);}} >
				<View style = {{marginLeft: 8,marginRight:8, marginBottom: 0}} >
					<Card radius = {6} style = {styles.card}>
						<View style = {[Global._styles.CENTER, styles.item]}>
						<View style = {[{flex:1,}]}>
							<Text style = {{ marginLeft: 10, fontSize: 15,}}>{item.noon ? (item.noon == 'am' ? '上午' : '下午') : '' }</Text>
							<Text style = {{marginTop:6, marginLeft: 10, fontSize: 13,}}>{item.type}</Text>
						</View>
						<View style = {[{flex:1, alignItems: 'center'}]}>
							<Text style = {{width: 70, fontSize: 15, color: Global._colors.FONT_GRAY}}>剩余：<B>{item.last}</B></Text>
							<Text style = {{width: 70, fontSize: 15, color: Global._colors.FONT_LIGHT_GRAY1}}>可挂：<B>{item.total}</B></Text>
						</View>
						<View style = {[{flex: 1, alignItems: 'flex-end'}]}>
							<Text style = {{color:Global._colors.FONT_LIGHT_GRAY1, fontSize: 12}}>挂号费</Text>
							<Text style = {{color:Global._colors.FONT_GRAY, fontSize: 22}}>{item.amt}</Text>
						</View>
						<EasyIcon name = 'ios-arrow-forward-outline' size = {18} color = {Global._colors.IOS_ARROW} style = {[{marginLeft:10, width: 20}]} />
						</View>
					</Card>
				</View>
				</TouchableOpacity>
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
			<NavBar title = '挂号' 
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
	item: {
		width: Global.getScreen().width,
        flexDirection: 'row',
        padding: 10,
        paddingLeft: 0,
        paddingRight: 20,
	},
	portrait: {
		width: 40,
		height: 40,
        borderRadius: 20,
        marginLeft: 20,
	},
	card: {
		paddingLeft: 0, 
		paddingRight: 0, 
		paddingTop: 0, 
		paddingBottom: 0,
		marginTop: 5,
	},
});

export default Appointment;