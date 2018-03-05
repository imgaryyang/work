'use strict';

import React, {
    Component,
    PropTypes,
} from 'react';

import {
    View,
    ScrollView,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
	InteractionManager,
	ListView,
	ActivityIndicator,
	RefreshControl,
} from 'react-native';

import * as Global  from '../../Global';
import * as Filters from '../../utils/Filters';
import UserStore    from '../../flux/UserStore';
import AuthAction   from '../../flux/AuthAction';

import NavBar       from 'rn-easy-navbar';
import Button       from 'rn-easy-button';
import EasyIcon     from 'rn-easy-icon';
import Card       	from 'rn-easy-card';

import Login      	from '../../el/me/Login'
import BillDetail   from './BillDetail';

const BILLS_URL = "elh/order/my/list/";

class Bill extends Component {

	sectionData = {};
	sectionIds = [];
	rowIds = [];

	iconConfig = {
		'1': 		{bgColor: Global._colors.IOS_RED, 	icon: 'send-o'},
		'2': 		{bgColor: Global._colors.IOS_GREEN, icon: 'stethoscope'},
		'3': 		{bgColor: Global._colors.IOS_BLUE, 	icon: 'envira'},
		'99': 		{bgColor: Global._colors.ORANGE, 	icon: 'flash'},
		'##dft##': 	{bgColor: Global._colors.BROWN, 	icon: 'file-text'},
	};

	statusConfig = {
		'0': 		{title: '待支付',	color: Global._colors.ORANGE,			icon: 'send-o', 		desc: '待付款状态',},
		'1': 		{title: '交易成功',	color: Global._colors.FONT_LIGHT_GRAY1,	icon: 'stethoscope',	desc: '交易完成状态',},
		'2': 		{title: '交易失败', 	color: Global._colors.IOS_RED,			icon: 'envira',			desc: '交易失败状态',},
		'9': 		{title: '交易关闭', 	color: Global._colors.FONT_LIGHT_GRAY1, icon: 'flash',			desc: '交易失败状态',},
		'##dft##': 	{title: '', 		color: Global._colors.BROWN, 			icon: 'file-text',		desc: '其他未知状态',},
	};

    static displayName = 'Bill';
    static description = '账单';

    /**
     * 参数说明
     */
    static propTypes = {
    };

    /**
     * 默认参数
     */
    static defaultProps = {
    };

    /**
     * 初始化状态位
     */
	state = {
		doRenderScene: false,
		cond: null,
		user: UserStore.getUser(),
		dataSource: new ListView.DataSource({
			getRowData: (dataBlob, sectionId, rowId) => { return dataBlob[rowId]; },
			getSectionHeaderData: (dataBlob, sectionId) => { return dataBlob[sectionId]; },
			rowHasChanged: (row1, row2) => row1 !== row2,
			sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
		}),
		total: 0,
		start: 0,
		pageSize: 10,
		noMoreData: false,
		_refreshing: true,//控制刷新
		_pullToRefreshing: false,//控制下拉刷新
		_infiniteLoading: false,//控制无限加载
	};

	/**
	 * 构造函数
	 */
    constructor (props) {
        super(props);

        this.refresh 				= this.refresh.bind(this);
        this.pullToRefresh 			= this.pullToRefresh.bind(this);
        this.fetchData 				= this.fetchData.bind(this);
        this.appendSectionData 		= this.appendSectionData.bind(this);
        
        this.renderRow 				= this.renderRow.bind(this);
        this.renderSectionHeader 	= this.renderSectionHeader.bind(this);
        this.renderSeparator 		= this.renderSeparator.bind(this);
        this.renderFooter 			= this.renderFooter.bind(this);

        this.infiniteLoad 			= this.infiniteLoad.bind(this);
        this.onPressDetail 			= this.onPressDetail.bind(this);
        this.onUserStoreChange		= this.onUserStoreChange.bind(this);
        this.goLogin				= this.goLogin.bind(this);
    }

    /**
     * function when component mounted
     */
	componentDidMount () {
		//监听UserStore
		this.onUserStoreChange = UserStore.listen(this.onUserStoreChange);

		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true}, () => {
				this.fetchData();
			});
		});
	}

	componentWillUnmount () {
        this.onUserStoreChange();
    }

	/**
	 * 刷新
	 */
	refresh () {
		this.sectionData = {};
		this.sectionIds = [];
		this.rowIds = [];
		
		this.setState({
			_refreshing: true,
			total: 0,
			start: 0,
			noMoreData: false,
		}, () => {
			this.fetchData();
		});
	}

	/**
	 * 下拉刷新
	 */
	pullToRefresh () {
		this.sectionData = {};
		this.sectionIds = [];
		this.rowIds = [];

		this.setState({
			_pullToRefreshing: true,
			total: 0,
			start: 0,
			noMoreData: false,
		}, () => {
			this.fetchData();
		});
	}

	/**
	 * 查询账单数据
	 */
	async fetchData () {
		try {
			if(!this.state.user || this.state.user.id == "" ){//登录用户为null时，清空数据
				this.sectionData = {};
				this.sectionIds = [];
				this.rowIds = [];

				this.setState({
					dataSource: this.state.dataSource.cloneWithRowsAndSections(this.sectionData, this.sectionIds, this.rowIds),
					total: 0,
					start: 0,
					pageSize: 10,
					noMoreData: false,
					_refreshing: false,//控制刷新
					_pullToRefreshing: false,//控制下拉刷新
					_infiniteLoading: false,//控制无限加载
				});

				return;
			}

			let responseData = await this.request(Global._host + BILLS_URL + this.state.start + "/" + this.state.pageSize, {
				method : "GET"
			});

			//console.log(responseData);

			if(responseData.result && responseData.result.length > 0) {

				//将获取到的数据追加到场景中的DS中
				this.appendSectionData(responseData.result);

				this.setState({
					dataSource: this.state.dataSource.cloneWithRowsAndSections(this.sectionData, this.sectionIds, this.rowIds),
					total: responseData.total,
					start: responseData.start,
					noMoreData: responseData.start + responseData.pageSize >= responseData.total ? true : false,
				});
			} else {
            	this.setState({
					dataSource: this.state.dataSource.cloneWithRowsAndSections(this.sectionData, this.sectionIds, this.rowIds),
					noMoreData: true,
				});
			}
		} catch(e) {
			this.handleRequestException(e);
		}
	}

	/**
	 * 将新查询到的数据追加到sectionData中
	 */
	appendSectionData (data) {
		if(!data || data.length==0) {
			return;
		}
		let sectionId, rowId, idx;
		data.forEach((item) => {
			sectionId = item['createTime'].substring(0, 7);
			idx = this.sectionIds.indexOf(sectionId);
			if(idx == -1) {
				idx = this.sectionIds.length;
				this.sectionIds.push(sectionId);
				this.rowIds.push([]);
			}
			rowId = 's' + idx + 'r' + item.id;
			if(this.rowIds[idx].indexOf(rowId) == -1){
				this.rowIds[idx].push(rowId);
			}
			this.sectionData[sectionId] = sectionId.replace('-', '年') + '月';
			this.sectionData[rowId] = item;
		});

		let rId, _rId, _item;
		for(let i=0; i<this.sectionIds.length; i++){
			for(let j=0; j<this.rowIds[i].length; j++){
				rId = this.rowIds[i][j];
				if(rId && rId.indexOf("_end")!=-1 && j<this.rowIds[i].length-1){
					_item = this.sectionData[rId];
					_rId = 's' + idx + 'r' + _item.id;
					this.rowIds[i][j] = _rId;
					this.sectionData[_rId] = _item;
					// delete this.sectionData[rId];
				}
				if(rId && !rId.indexOf("_end")!=-1 && j==this.rowIds[i].length-1){
					_item = this.sectionData[rId];
					_rId = 's' + idx + 'r' + _item.id + '_end';
					this.rowIds[i][j] = _rId;
					this.sectionData[_rId] = _item;
					// delete this.sectionData[rId];
				}
			}
		}
		
	}

	/**
	 * 获取账单类型对应Icon
	 */
	getIconConfig (type) {
		if(this.iconConfig[type])
			return this.iconConfig[type];
		else
			return this.iconConfig['##dft##'];
	}

	/**
	 * 获取账单类型对应Icon
	 */
	getStatusConfig (status) {
		if(this.statusConfig[status])
			return this.statusConfig[status];
		else
			return this.statusConfig['##dft##'];
	}

	/**
	 * 查看账单详情
	 */
	onPressDetail (item, iconConfig) {
		this.props.navigator.push({
			component: BillDetail,
			hideNavBar: true,
			passProps: {
				refresh : this.refresh,
				bill: item,
				iconConfig: iconConfig
			}
		});
	}

	/**
	 * 无限加载
	 */
	infiniteLoad () {
		if(this.state._refreshing || this.state._pullToRefreshing || this.state.noMoreData || this.state._requestErr)
			return;

		this.setState({
			start: this.state.start + this.state.pageSize,
			_infiniteLoading: true,
		}, () => {
			this.fetchData();
		});
	}

	/**
	 * 监听UserStore变化
	 */
	onUserStoreChange () {
		this.setState({
			user: UserStore.getUser(),
		}, () => {
			this.refresh();
		});
	}

	goLogin() {
		//TODO:需要登录时调用登录
		AuthAction.clearContinuePush();
		AuthAction.needLogin();
    }

	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		let loginView = !this.state.user || this.state.user.id == "" ? (
			<Card radius = {6} style = {{paddingBottom: 20, margin: 8, marginTop: 16}} >
				<Text style = {[Global._styles.MSG_TEXT, {marginTop: 30, marginBottom: 20}]} >您还未登录，登录后方能查看账单数据</Text>
				<Button text = "登录" onPress = {this.goLogin} />
			</Card>
		) : null;

		return (
			<View style = {Global._styles.CONTAINER} >
				{this._getNavBar()}
				{this.getLoadingView('正在载入账单信息...', this.refresh, {marginTop: 20})}
				{loginView}
				
				{this.getEmptyView({
					condition: (this.state.user != null && this.state.user.id != "" && this.rowIds.length == 0),
					msg: '暂无账单信息',
					reloadCallback: this.refresh
				})}

				<ListView
					automaticallyAdjustContentInsets = {false}	//此参数保证在IOS的Tabbar中顶端不出现与statusBar等高的空隙
			        dataSource = {this.state.dataSource}
			        renderRow = {this.renderRow}
			        enableEmptySections = {true}
    				renderSectionHeader = {this.renderSectionHeader}
    				renderSeparator = {this.renderSeparator}
    				renderFooter = {this.renderFooter}
                    onEndReached = {this.infiniteLoad}
                    onEndReachedThreshold = {10}
        			scrollRenderAheadDistance = {5}
			        initialListSize = {10}
			        pageSize = {5}
			        style = {[styles.list]} 
			        refreshControl = {
						<RefreshControl
							refreshing = {this.state._pullToRefreshing}
							onRefresh = {this.pullToRefresh}
						/>
					}
			    />
			</View>
		);
	}

	/**
	 * 判断某rowId是否是所属section的最后一项
	 */
	isEndOfSection (sectionId, rowId) {
		if(this.sectionIds.length==0 || this.rowIds.length==0)
			return false;
		let sectionIdx = this.sectionIds.indexOf(sectionId);
		let rowIdx = this.rowIds[sectionIdx].indexOf(rowId);
		return rowIdx == this.rowIds[sectionIdx].length - 1 ? true : false;
	}

	/**
	 * 判断某rowId是否是list的最后一项
	 */
	isEndOfList (sectionId, rowId) {
		if(this.sectionIds.length==0 || this.rowIds.length==0)
			return false;
		let sectionIdx = this.sectionIds.indexOf(sectionId);
		let rowIdx = this.rowIds[sectionIdx].indexOf(rowId);
		return rowIdx == this.rowIds[this.rowIds.length - 1].length - 1 ? true : false;
	}

	/**
	 * 渲染行数据
	 */
	renderRow (item, sectionId, rowId, highlightRow) {

		let sectionBottomComp = rowId.indexOf("_end")!=-1 ? (
			<View style = {styles.sectionBottom} >
				{/*<View style = {styles.sectionBottomInnerView} >*/}
					<Image source = {require('../../res/images/card/list-section-bottom.png')} style = {styles.sectionBottomImg} />
				{/*</View>*/}
			</View>
		) : null;

		return (
			<View>
				<TouchableOpacity key = {rowId} style = {[Global._styles.CENTER, styles.item]} onPress={() => this.onPressDetail(item, this.getIconConfig(item.billType))} >
					<View style={[Global._styles.CENTER, {width: 50, height: 30}]} >
						<EasyIcon iconLib = "fa" 
							name = {this.getIconConfig(2).icon} 
							color = "#ffffff" bgColor = {this.getIconConfig(2).bgColor}
							size = {18} width = {30} height = {30} radius = {15} />
					</View>
					<View style = {{width: 65, paddingLeft: 10}} >
						<Text style={{fontSize: 14, color: Global._colors.FONT_GRAY}} >{Filters.filterDateTimeToMonthAndDay(item.createTime)}</Text>
						<Text style={{fontSize: 12, color: Global._colors.FONT_LIGHT_GRAY}} >{Filters.filterDateTimeToTime(item.createTime)}</Text>
					</View>
					<View style = {{flex: 1, paddingLeft: 20}} >
						<View style = {{flexDirection: 'row',}} >
							<View style={{flex: 1, }}>
								<Text style={{fontSize: 15, fontWeight: '500'}} >{Filters.filterMoney(item.amount)}</Text>
							</View>
							<View style = {{alignItems: 'flex-end', width: 60}} >
								<Text style={{fontSize: 12, color: this.getStatusConfig(item.status).color}} >{this.getStatusConfig(item.status).title}</Text>
							</View>
						</View>
						<Text style={{fontSize: 12, color: Global._colors.FONT_GRAY}} >{item.description}</Text>
					</View>
				</TouchableOpacity>
				{sectionBottomComp}
			</View>
		);
	}

	/**
	 * 渲染数据分区表头
	 */
	renderSectionHeader (sectionData, sectionId) {
		return (
			<View style={[styles.section]}>
				<Text style={styles.sectionText}>
					{sectionData}
				</Text>
			</View>
		);
	}

	/**
	 * 渲染行分割线
	 */
	renderSeparator (sectionId, rowId) {
		if(this.isEndOfList(sectionId, rowId))
			return null;
		else
			return <View key={'sep_' + rowId} style={Global._styles.SEP_LINE} />;
	}

	/**
	 * 渲染列表表尾
	 * 如果无限加载被触发，则显示loading，如果没有更多数据，则显示相关提示信息
	 */
	renderFooter () {

		if(!this.state.user || this.state.user.id == "")
			return null;

		if(this.state._refreshing || this.state._pullToRefreshing)
			return null;

		if(this.state._infiniteLoading)
			return this.getInfiniteLoadingView('正在载入更多账单信息', this.infiniteLoad);

		if(this.rowIds.length > 0 && this.state.noMoreData)
			return (
				<View style={[Global._styles.CENTER, styles.footer]} >
					<Text style={styles.footerText} >全部账单信息加载完成</Text>
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

	/**
	 * 渲染导航栏
	 */
	_getNavBar () {
		
		return (
			<NavBar title = '账单' 
		    	navigator = {this.props.navigator} 
				route = {this.props.route}
		    	hideBackButton = {true} 
		    	hideBottomLine = {true}
				rightButtons = {(
					<View style = {[Global._styles.NAV_BAR.BUTTON_CONTAINER, Global._styles.NAV_BAR.RIGHT_BUTTONS]} >
						<Button onPress = {this.refresh} stretch = {false} clear = {true} style = {Global._styles.NAV_BAR.BUTTON} >
							<EasyIcon name = "ios-refresh-outline" color = 'white' size = {25} />
						</Button>
					</View>
				)}
			/>
		);
	}

}

const styles = StyleSheet.create({

	list: {
		flex: 1,
		backgroundColor: 'transparent',
		marginLeft: 8,
		marginRight: 8,
		marginBottom: Global._os == 'ios' ? 48 : 0,
	},

	item: {
		padding: 15,
		paddingLeft: 0,
		flexDirection: 'row',
		borderLeftWidth: 1 / Global._pixelRatio,
		borderLeftColor: '#dcdce1',
		borderRightWidth: 1 / Global._pixelRatio,
		borderRightColor: '#dcdce1',
		backgroundColor: 'white',
	},
	sepLine: {
		marginLeft: 15,
		backgroundColor: '#dcdce1', 
        height: 1 / Global._pixelRatio,
	},

	section: {
		backgroundColor: 'white',
		borderWidth: 1 / Global._pixelRatio,
		borderColor: '#dcdce1',
		height: 40,
		justifyContent: 'center',
		marginTop: 20,
	},
	sectionText: {
		fontSize: 14,
		color: Global._colors.FONT_GRAY,
		fontWeight: '500',
		marginLeft: 15,
	},

	sectionBottom: {
		overflow: 'hidden',
		borderLeftWidth: 1 / Global._pixelRatio,
		borderLeftColor: '#dcdce1',
		borderRightWidth: 1 / Global._pixelRatio,
		borderRightColor: '#dcdce1',
		width: Global.getScreen().width - 16,
		paddingLeft: 1 / Global._pixelRatio,
		paddingRight: 1 / Global._pixelRatio,
		backgroundColor: 'white',
	},
	sectionBottomImg: {
		width: 1500 / Global._pixelRatio,
		height: 14 / Global._pixelRatio,
	},

	footer: {
		height: 50,
		//flexDirection: 'row',
	},
	footerText: {
		color: Global._colors.FONT_LIGHT_GRAY1,
		fontSize: 13,
		marginTop: 10,
		//width: 100,
	},
});

export default Bill;

