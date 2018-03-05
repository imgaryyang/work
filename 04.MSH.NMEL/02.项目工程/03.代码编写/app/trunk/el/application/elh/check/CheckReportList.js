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
		_infiniteLoading: false,//控制无限加载
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
		// this.showLoading();
		this.setState({
			loading: true,
			fetchForbidden: false,
			_infiniteLoading: false,//控制无限加载
		});
		if(this.state._refreshing || this.state._pullToRefreshing){
				this.datas = [];
			}
		try {
			var data1 = "{}";
            data1 = encodeURI(data1);
			//var userId = UserStore.getUser().id;
			let responseData = await this.request(Global._host + FIND_URL + this.state.start+ "/" + this.state.pageSize, {
				method: 'GET'
			});
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
				<ListView
					key = {this.data}
			        dataSource = {this.state.dataSource}
			        renderRow = {this.renderItem}
			        renderFooter = {this.renderFooter}
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

		return (
			<TouchableOpacity  onPress = {()=>{this.doDetail(item.id, item.patientName);}}>
				<View style = {{margin: 8, marginBottom: 0}} >
					<Card radius = {6}  >
						<View style = {styles.itemRow}>
							<Text style = {{flex:1, fontSize: 18,marginTop: -5}}>{item.subject}</Text>
							<View style = {[styles.hospHolder, Global._styles.CENTER,{marginTop:-18}]} >
								<View >
									<Portrait imageSource = {require('../../res/images/hosp/logo01.png')} width = {26} height = {26} />
								</View>
									<Text style = {{marginLeft:15, }} >{item.hospitalName}</Text>
							</View>						
								{/*<View style = {styles.itemRow}>
															<Text style = {{color: Global._colors.FONT}}>{item.applyDoctor}</Text>
														</View>*/}
						</View>
						<View style = {[Global._styles.FULL_SEP_LINE,{marginTop:-8}]} />
						<View style = {[styles.itemRow,{marginTop:8}]}>
							<Text style = {{flex:1}}>{item.deptName}</Text>
							<View style = {[styles.itemRow, ]}>
								<Text >{item.patientName}</Text>
								<Text style = {{fontSize: 12,marginTop:2,marginLeft:5,color:Global._colors.FONT_LIGHT_GRAY}}>{item.checkTime}</Text>
							</View>
						</View>
					</Card>
				</View>
			</TouchableOpacity>
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
			start: this.state.start + this.state.pageSize,
			_infiniteLoading: true,
		}, () => {
			this.fetchData();
		});
	}

	/**
	 * 渲染列表表尾
	 * 如果无限加载被触发，则显示loading，如果没有更多数据，则显示相关提示信息
	 */
	renderFooter () {

		if(this.state._refreshing || this.state._pullToRefreshing)
			return null;

		if(this.state._infiniteLoading)
			return this.getInfiniteLoadingView('正在载入更多报告单信息', this.onEndReached);

		if(this.state.noMoreData)
			return (
				<View style={[Global._styles.CENTER, styles.footer]} >
					<Text style={styles.footerText} >全部报告单信息加载完成</Text>
				</View>
			);

  //       let footerText = !this.state.loading && !this.state._refreshing && !this.state._pullToRefreshing && this.state.noMoreData 
  //       	? '数据载入完成' : '载入数据……';
		// return (
		// 	<View style={[Global._styles.CENTER, styles.footer]} >
		// 		<Text style={styles.footerText} >{footerText}</Text>
		// 	</View>
		// );
	}
}

const styles = StyleSheet.create({
	list: {
		backgroundColor: '#ffffff',
	},
	item: {
		paddingLeft: 0, 
		paddingRight: 0, 
		paddingTop: 0, 
		paddingBottom: 0,
		marginTop: 5,
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
    hospHolder: {
		flexDirection: 'row', 
		padding: 15
	},
});

export default CheckReportList;




