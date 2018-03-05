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
    PixelRatio,
    RefreshControl,
} from 'react-native';

import * as Global 		from '../../Global';

import NavBar			from 'rn-easy-navbar';
import EasyIcon     	from 'rn-easy-icon';

import OutpatientGuidanceList 		from '../outpatient/OutpatientGuidanceList';

class PatCardList extends Component {

	datas 	= [];
	item 	= null;
	rowID 	= null;

    static displayName = 'PatCardList';
    static description = '就诊卡列表';

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
		dataSource: new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,
		}),
		start: 0,
		pageSize: 10,
		value: {
			status: '1',
		},
		_refreshing: true,//控制刷新
		_pullToRefreshing: false,//控制下拉刷新
	};

    constructor (props) {
        super(props);
        this.fetchData 				= this.fetchData.bind(this);
        this.renderRow 				= this.renderRow.bind(this);
        this.renderSeparator 		= this.renderSeparator.bind(this);
        this.toAppoint				= this.toAppoint.bind(this);
        this.refresh 				= this.refresh.bind(this);
        this.pullToRefresh 			= this.pullToRefresh.bind(this);
        this.goGuiList				= this.goGuiList.bind(this);
    }

	getLabelByValue (array,value) {
		for(let i=0;i<array.length;i++){
			if(array[i].value==value)
				return array[i].label;
		}
	}
    /**
	* 页面装载时调用，只调用这一次
    **/
    componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({
				doRenderScene: true,
			});
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

	/**
	 * 异步加载列表数据
	 */
	async fetchData () {
		this.datas = [];
        let FIND_URL = 'elh/medicalCard/my/hislist/'+this.state.start+'/'+this.state.pageSize;
        let FIND_CARDTYPE_URL = 'elh/medicalCard/all/cardTypes';
		this.setState({loading: true});
		this.showLoading();
		
		try {

			let responseTypeData = await this.request(Global._host + FIND_CARDTYPE_URL ,{
	        	method:'GET',
			});
			let orgId1 = '';
			let orgId2 = '';
			for(let i=0; i<responseTypeData.result.length; i++){
				if(responseTypeData.result[i].type == '2'){
					orgId1 = responseTypeData.result[i].orgId;
				}if(responseTypeData.result[i].type == '3'){
					orgId2 = responseTypeData.result[i].orgId;
				}
			};

			let orgIdList = this.props.regInfo.hospital +','+ orgId1 +','+ orgId2;
			console.log(orgIdList);
			let data =  encodeURI(JSON.stringify({
					orgId: orgIdList,
					state: 1,
					patientId: this.props.id,
					
				}));

			let responseData = await this.request(Global._host + FIND_URL + '?data=' + data , {
	        	method:'GET',
			});
			this.setState({
				total: responseData.total,
				start: responseData.start,
				dataSource: this.state.dataSource.cloneWithRows(responseData.result),
				loading: false,
			});
			this.hideLoading();
		} catch(e) {
			this.hideLoading();
			this.handleRequestException(e);
		}
	}

	toAppoint(patientId, cardNo, typeId, typeName){
		Alert.alert(
			'提示','确认挂号？',
			[
				{text: '取消', style: 'cancel'},
				{text: '确定', onPress: () => {this.appoint(patientId, cardNo, typeId, typeName);}},
			]
		); 
	}

	async appoint (patientId, cardNo, typeId, typeName) {
		this.showLoading();
        this.setState({
            loaded: false,
            fetchForbidden: false,
        });
        let APPOINT_URL = 'elh/treat/reg/appoint';
        try {
        	var regInfo1 = this.props.regInfo;

        	regInfo1.date = regInfo1.date.substring(0,10);
			regInfo1.patientName = this.props.parentName;
			regInfo1.patient = patientId;
			regInfo1.cardNo = cardNo;
			regInfo1.cardType = typeId;
			regInfo1.cardTypeName = typeName;
            let responseData = await this.request(Global._host + APPOINT_URL, {
                body: JSON.stringify(regInfo1)
            });
            this.hideLoading();
            if (responseData.success == true){
            	Alert.alert(
					'提示',
					responseData.result.description + ',' + responseData.result.notification + '!',
					[
					 	{
					 		text: '确定', onPress: () => {
					 			this.goGuiList();
					 		}
					 	}
					]
				);          	
            }else{
            	this.toast('预约挂号失败！');
            	this.props.navigator.pop();
            }
            
        } catch(e) {
            this.hideLoading();
            this.handleRequestException(e);
        }
	}

	goGuiList () {
		let routes = this.props.navigator.getCurrentRoutes();
		// routes = routes.splice(this.props.navigator.getCurrentRoutes().length-4,3);
		routes.pop();
		routes.pop();
		routes.pop();
		routes.pop();
		this.props.navigator.immediatelyResetRouteStack(routes);
		this.props.navigator.push({
			component: OutpatientGuidanceList, 
			hideNavBar: true, 
			passProps:{hideBackButton: false},
		});
	}

	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();
		
		return (
			<View style = {Global._styles.CONTAINER} >	
				{this._getNavBar()}
				<ScrollView automaticallyAdjustContentInsets = {false} keyboardShouldPersistTaps = {true} style ={styles.scrollView} >
					<ListView
						key = {this.datas}
				        dataSource = {this.state.dataSource}
				        renderRow = {this.renderRow}
				        enableEmptySections = {true}
	    				renderSeparator = {this.renderSeparator}
	    				refreshControl = {
							<RefreshControl
								refreshing = {this.state._pullToRefreshing}
								onRefresh = {this.pullToRefresh}/>
						}
				        style = {[styles.list]} />
					
				</ScrollView>
			</View>
		);
	}

	/**
	 * 渲染行数据
	 */
	renderRow (item, sectionId, rowID, highlightRow) {
		return (
			<View style = {[styles.item]} >
			<TouchableOpacity onPress={() => this.toAppoint(item.patientId, item.cardNo, item.typeId, item.typeName) }>
				<View style = {[styles.item, Global._styles.CENTER,{marginLeft:10,}]} >
					<View style={styles.portrait}>
						<EasyIcon iconLib = 'fa' name = 'credit-card' 
							size = {20} color = {Global._colors.IOS_ARROW} />
					</View>
					<View style={{flex:1,marginLeft:15,alignItems:'flex-start'}}>
						<View style={{flexDirection: 'row',alignItems:'flex-end',}}>
							<Text style = {styles.orgName}>{item.orgName}</Text>
							<Text style = {styles.typeName}>（{item.typeName}）</Text>
						</View>
						<Text style = {styles.cardTypeName}>卡号：{item.cardNo}</Text>
					</View>
				</View>
			</TouchableOpacity>
			</View>
		);
	}

	/**
	 * 渲染行分割线
	 */
	renderSeparator (sectionId, rowID) {
		return <View key={'sep_' + rowID} style={[Global._styles.FULL_SEP_LINE,{margin:0}]} />;
	}

	/**
	 * 渲染临时占位场景
	 */
	_renderPlaceholderView () {
		return (
			<View style = {Global._styles.CONTAINER}>
			    {this._getNavBar()}
			</View>
		);
	}

	/**
	 * 渲染导航栏
	 */
	_getNavBar () {
		return (
			<NavBar title = '就诊卡列表' 
				hideBackText = {true} 
		    	navigator = {this.props.navigator} 
				route = {this.props.backRoute}
		    	hideBackButton = {false} 
		    	hideBottomLine = {false} />
		);
	}
}

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
		backgroundColor: 'white',
		marginBottom: Global._os == 'ios' ? 48 : 0,
	},
	portrait: {
		width: 36,
		height: 36,
		borderRadius: 18,
		borderWidth: 1,
		borderColor: 'rgba(200,199,204,1)', 
		justifyContent:'center',
		alignItems:'center',
	},
	sv: {
		flex: 1,
	},
	list: {
		backgroundColor: '#ffffff',
	},
	item: {
		width: Global.getScreen().width,
        flexDirection: 'row',
        padding: 5,
        paddingLeft: 0,
        paddingRight: 20,
	},
	orgName: {
		color: '#ff6600',
		fontSize: 15,
	},
	typeName: {
		color: '#999999',
		fontSize: 13,
	},
	cardNo: {
		color: '#999999',
		marginTop: 3,
	},
	info: {
		fontSize: 13,
		color: '#aaaaaa',
	},

});

export default PatCardList;

