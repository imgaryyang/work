'use strict';

import React, {
    Component,
    PropTypes,
} from 'react';

import {
	StyleSheet,
	ScrollView,
	RefreshControl,
	View,
	Text,
	Image,
	TouchableOpacity,
	InteractionManager,
	ListView,
    Alert,
} from 'react-native';

import * as Global 		from '../../Global';

import NavBar 			from 'rn-easy-navbar';
import Portrait     	from 'rn-easy-portrait';
import Card       		from 'rn-easy-card';
import Button       	from 'rn-easy-button';
import Separator    	from 'rn-easy-separator';

import ComChkReport  	from './CommonCheckReport';

const FIND_URL 	= 'elh/treat/my/medicalcheck/list/';

class CheckReportList extends Component {

	datas 	= [];
	item 	= null;

    static displayName = 'CheckReportList';
    static description = '报告单';

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
		dataSource: new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,
		}),
		loading: false,
		cond: null,
		start: 0,
		pageSize: 10,
		total: 0,
		responseData: [],
		noMoreData: false,
		_refreshing: true,//控制刷新
		_pullToRefreshing: false,//控制下拉刷新
	};

    constructor (props) {
        super(props);

        this.refresh 			= this.refresh.bind(this);
        this.pullToRefresh 		= this.pullToRefresh.bind(this);
        this.fetchData 			= this.fetchData.bind(this);
        this.doDetail 			= this.doDetail.bind(this);
        this.renderItem 		= this.renderItem.bind(this);
        this.onEndReached 		= this.onEndReached.bind(this);
        this.renderFooter 		= this.renderFooter.bind(this);
        this.renderSeparator 	= this.renderSeparator.bind(this);
        this.appendSectionData 	= this.appendSectionData.bind(this);
        this.goToRegister 		= this.goToRegister.bind(this);
    }

	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
			this.fetchData();
		});
	}

	/**
	* 调用刷新
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
			//noMoreData: false,
		}, () => {
			this.fetchData();
		});
	}

	/**
	 * 去挂号
	 */
	goToRegister () {
		this.props.navigator.push({
			component: RegisterResource,
			hideNavBar: true,
		});
	}

	async fetchData () {
		this.showLoading();
		this.setState({
			loading: true,
			fetchForbidden: false,
		});
		if(this.state._refreshing || this.state._pullToRefreshing){
				this.datas = [];
			}
		try {
			// console.log('wwwwwwwwwwwwwwwwwwwwwwwwwwwwww');

			var data1 = "{}";
            data1 = encodeURI(data1);
			//var userId = UserStore.getUser().id;
			let responseData = await this.request(Global._host + FIND_URL + this.state.start+ "/" + this.state.pageSize, {
				method: 'GET'
			});
			// console.log(responseData);
			// let responseData =  {"success":true,
			// "result":
			// 	[{"name":"不不不","id":"8a8c7db154ebe90c0154ebfdd1270004","comment":"6","description":"热热热","startTime":"2016-06-04 16:33:20",
			// 		"status":"1","subject":"血常规检测","details":null,"patientName":"周明","patient":null,"department":"消化内科",
			// 		"bizName":"检查单","biz":"medicalCheck","updateTime":"2016-06-04 16:33:20","createTime":"2016-06-04 16:33:20",
			// 		"payed":false,"patientId":"345","applyDoctor":"23","notification":"我问问","medicalResult":"0","caseNo":"2",
			// 		"bedNo":"4","audit":"2","reportTime":"3","checkTime":"2016-01-23 12:09:23","machine":"5","submitTime":"3",
			// 		"operator":"2","specimenNo":"4","optDoctor":"34","specimen":"3","diagnosis":"3","treatment":"100","idHlht":"34",
			// 		"endTime":"2016-06-04 16:54:10","needPay":"1","doctorTitlt":"主任医师"},
			// 	{"name":"去去去","id":"8a8c7db154ebe90c0154ebfdd1270005","comment":"8","description":"热热热","startTime":"2016-06-04 16:39:20",
			// 		"status":"1","subject":"肝功","details":null,"patientName":"周红华","patient":null,"department":"内分泌科",
			// 		"bizName":"检查单","biz":"medicalCheck","updateTime":"2016-06-04 16:39:20","createTime":"2016-06-04 16:39:20",
			// 		"payed":false,"patientId":"234","applyDoctor":"45","notification":"我问问","medicalResult":"0","caseNo":"3",
			// 		"bedNo":"3","audit":"4","reportTime":"2","checkTime":"2016-11-03 11:19:13","machine":"6","submitTime":"5",
			// 		"operator":"3","specimenNo":"43","optDoctor":"45","specimen":"7","diagnosis":"6","treatment":"100","idHlht":"23",
			// 		"endTime":"2016-06-04 16:54:10","needPay":"1","doctorTitlt":"主任医师"}],
			// "total":2,"pageSize":10,"start":0}
			this.hideLoading();
			this.data = responseData.result;
			this.appendSectionData(responseData.result);
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(this.datas),
				_pullToRefreshing: false,
				loading: false,
				start: responseData.start,
				total: responseData.total,
				noMoreData: responseData.start + responseData.pageSize >= responseData.total ? true : false,
			}); 
		} catch(e) {
			this.hideLoading();
			this.handleRequestException(e);
		}
	}

	/**
	 * 将新查询到的数据追加到this.datas
	 */
	appendSectionData (data) {
		if(!data){
			return;
		}
		data.forEach((item) => {
			this.datas.push(item);
		});
	}

    doDetail (id, patientName) {
        this.props.navigator.push({
            title: "报告单详情",
            component: ComChkReport,
            passProps: {
            	id: id,
				patientName: patientName,
            	refresh: this.refresh,
            	backRoute: this.props.route,
            },
            hideNavBar: true,
        });
    }    

	render () {
		var listView = null;
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		/*var refreshText = this.state.fetchForbidden === true ? 
			'您还未登录，登录后点击此处刷新数据' : 
			'暂无符合条件的数据，点击此处重新载入';*/
		/*var refreshView = (this.state.loading || this.state.fetchForbidden) && this.data.length === 0 ?
			this.props.getListRefreshView(refreshText, this.refresh) : 
			null;*/
		let emptyView = !this.state._refreshing && !this.state._pullToRefreshing && !this.state._requestErr && this.datas.length == 0 ? (
			<Card fullWidth = {true} style = {{paddingBottom: 20}} >
				<Text style = {[Global._styles.MSG_TEXT, {marginTop: 30, marginBottom: 20}]} >暂无报告单</Text>
				<Button text = "去挂号" onPress = {this.goToRegister} outline = {true} />
			</Card>
		) : null;

		var SIStyleIOS = Global._os === 'ios' ? Global._styles.TOOL_BAR.SEARCH_INPUT_IOS : {};
		return (
			<View style = {Global._styles.CONTAINER}>
				{this._getNavBar()}
				{this.getLoadingView('正在载入报告单信息...', this.refresh, {marginTop: 20})}
				{emptyView}
				{/*refreshView*/}
				<ListView
					key = {this.data}
			        dataSource = {this.state.dataSource}
			        renderRow = {this.renderItem}
			        renderFooter = {this.renderFooter}
			        renderSeparator = {this.renderSeparator}
			        onEndReached = {this.onEndReached}
			        onEndReachedThreshold = {10}
			        refreshControl = {
						<RefreshControl
							refreshing={this.state._pullToRefreshing}
							onRefresh = {this.pullToRefresh} />}
			        enableEmptySections = {true} />
				<View style = {Global._styles.PLACEHOLDER20} />
		    </View>
		);
	}

	renderItem (item, sectionID, rowID, highlightRow) {
        var placeHolder10 = parseInt(rowID) === this.state.total-1 ? null : 
        	(<View>
        		<View style = {Global._styles.PLACEHOLDER10} />
        		<View style = {Global._styles.FULL_SEP_LINE} />
        	</View>) ;

        /*for (var i = 0; i <= this.state.total; i++) {
        	var jobTitle = this.state.responseData[i].jobTitle === null ?<Text style = {{marginLeft: 10, fontSize: 14,}}>[{item.jobTitle}]</Text> : null;
        };*/
        // console.log(item.hospital.sceneryThumb);	
		return (
			<View >
				<TouchableOpacity  onPress = {()=>{this.doDetail(item.id, item.patientName);}}>
				<Card fullWidth = {true} style = {{paddingBottom: 5}} >
				<View style = {styles.itemRow}>
					<Text style = {{flex:1, fontSize: 20, color: Global._colors.IOS_GREEN}}>{item.subject}</Text>
					<View style = {{flex:2}}>
						<View style = {styles.itemRow}>
							<View style = {{flex:1,}}>
							</View>
							<View style = {{flex:4,}}>
								<Portrait imageSource = {{uri: (Global._host + 'el/base/images/view/' + item.hospital.sceneryThumb)}} width = {90} height = {30} />								
							</View>
						</View>
						<View style = {styles.itemRow}>
							<Text style = {{color: Global._colors.FONT}}>{item.applyDoctor}</Text>
							{/*jobTitle*/}
						</View>
					</View>
				</View>
				<View style = {Global._styles.SEP_LINE} />
				<View style = {styles.itemRow}>
					<Text style = {{flex:1,marginTop:5, }}>{item.deptName}</Text>
					<View style = {{flex:2,}}>
						<Text >{item.patientName}</Text>
						<Text >{item.checkTime}</Text>
					</View>
				</View>
				</Card>
				</TouchableOpacity>
			</View>
		);
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

	_getNavBar () {
		return (
			<NavBar 
				title = '报告单'
				navigator = {this.props.navigator} 
				route = {this.props.route} 
				hideBottomLine = {true} />
		);
	}

	/**
	 * 无限加载
	 */
	onEndReached () {
		if(this.state.noMoreData || this.state._pullToRefreshing || this.state._refreshing || this.state.loading)
			return;
		
		this.setState({
			start: this.state.start + this.state.pageSize
		}, () => {
			this.fetchData();
		});
	}

	/**
	 * 渲染行分割线
	 */
	renderSeparator (sectionID, rowID, adjacentRowHighlighted) {
		return (
			<Separator key = {rowID} height = {10} />
		)
	}

	/**
	 * 渲染列表表尾
	 * 如果无限加载被触发，则显示loading，如果没有更多数据，则显示相关提示信息
	 */
	renderFooter () {
        let footerText = !this.state.loading && !this.state._refreshing && !this.state._pullToRefreshing && this.state.noMoreData 
        	? '数据载入完成' : '载入数据……';
		return (
			<View style={[Global._styles.CENTER, styles.footer]} >
				<Text style={styles.footerText} >{footerText}</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	sv: {
		flex: 1,
	},
	list: {
		backgroundColor: '#ffffff',
	},
	item: {
		width: Global.getScreen().width,
        //flexDirection: 'row',
        //padding: 10,
        // paddingLeft: 0,
        // paddingRight: 20,
	},
	itemRow: {
		flexDirection: 'row',
	},
	portrait: {
		width: 40,
		height: 40,
        borderRadius: 20,
        marginLeft: 20,
	},
	footer: {
		height: 50,
	},
	footerText: {
		color: Global._colors.FONT_LIGHT_GRAY1,
		fontSize: 13,
	},
	FULL_VER_LINE: {
        width: 1/Global._pixelRatio,
        backgroundColor: Global._colors.IOS_RED, //IOS_SEP_LINE, 
        height: 70, 
    },
});

export default CheckReportList;




