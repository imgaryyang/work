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
	RefreshControl,
} from 'react-native';


import * as Global 		from '../Global';
import * as Filters 	from '../utils/Filters';
import UserStore    	from '../flux/UserStore';
import NavBar			from 'rn-easy-navbar';
import EasyIcon     	from 'rn-easy-icon';

import Card       		from '../el/card/Card';
import PayStubList 		from './PayStubList';

const FIND_URL 		= 'els/paybatchinfo/perpaylist/';
const FIND_PER_URL 	= 'els/permng/findByIdNo/';

class SalaryList extends Component {

	sectionData = {};
	sectionIds = [];
	sectionAmts = [];
	rowIds = [];

    static displayName = 'SalaryList';
    static description = '工资列表';

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
		dataSource: new ListView.DataSource({
			getRowData: (dataBlob, sectionId, rowId) => { return dataBlob[rowId]; },
			getSectionHeaderData: (dataBlob, sectionId) => { return dataBlob[sectionId]; },
			rowHasChanged: (row1, row2) => row1 !== row2,
			sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
		}),
		start: 0,
		pageSize: 10,
		total: 0,
		totalPage: 0,
		cond: null,
		noMoreData: false,
		user: UserStore.getUser(),
		salaryCard: UserStore.getSalaryCard(),
		loading: false,
		_refreshing: true,//控制刷新
		_pullToRefreshing: false,//控制下拉刷新
	};

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
       
        this.onEndReached 			= this.onEndReached.bind(this);
        this.onPressDetail 			= this.onPressDetail.bind(this);
        this.onUserStoreChange		= this.onUserStoreChange.bind(this);
    }

	componentDidMount () {
		//监听UserStore
		this.unUserStoreChange = UserStore.listen(this.onUserStoreChange);

		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
			this.fetchData();
		});
	}

	componentWillUnmount () {
        this.unUserStoreChange();
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
	 * 异步加载数据
	 */
	async fetchData () {
		try {
			if(this.state.loading){
				return;
			} else {
				this.state.loading = true;
			}

			if(this.state._refreshing || this.state._pullToRefreshing){
				this.sectionData = {};
				this.sectionIds = [];
				this.rowIds = [];

				this.setState({
					dataSource: this.state.dataSource.cloneWithRowsAndSections(this.sectionData, this.sectionIds, this.rowIds),
					total: 0,
					totalPage: 0,
					start: 0,
					noMoreData: false,
				});
			}

			let personId = "";
			let personData = await this.request(Global._host + FIND_PER_URL + this.state.user.idCardNo, {
				method : "GET"
			});
			if(personData && personData.success && personData.result){
				personId = personData.result.id;
			}

			if(!personId || personId == ""){
				this.sectionData = {};
				this.sectionIds = [];
				this.rowIds = [];

				this.setState({
					dataSource: this.state.dataSource.cloneWithRowsAndSections(this.sectionData, this.sectionIds, this.rowIds),
					total: 0,
					totalPage: 0,
					start: 0,
					noMoreData: true,
					loading: false,
					_refreshing: false,//控制刷新
					_pullToRefreshing: false,//控制下拉刷新
				});

				return;
			}
			let responseData = await this.request(Global._host + FIND_URL 
				+ this.state.start+ "/" + this.state.pageSize + "?perId=" + personId, {
					method : "GET"
			});

			this.appendSectionData(responseData.result);

			this.setState({
				total: responseData.total,
				totalPage: responseData.totalPage,
				start: responseData.start,
				dataSource: this.state.dataSource.cloneWithRowsAndSections(this.sectionData, this.sectionIds, this.rowIds),
				noMoreData: responseData.start + responseData.pageSize >= responseData.total ? true : false,
				loading: false,
			});
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
			sectionId = item['month'].substring(0, 4);
			idx = this.sectionIds.indexOf(sectionId);
			if(idx == -1) {
				idx = this.sectionIds.length;
				this.sectionIds.push(sectionId);
				this.sectionAmts.push(0.0);
				this.rowIds.push([]);
			}

			rowId = 's' + idx + 'r' + item.id;
			if(this.rowIds[idx].indexOf(rowId) == -1){
				this.sectionAmts[idx] = this.sectionAmts[idx] + item.amount;
				this.rowIds[idx].push(rowId);
			}
			this.sectionData[sectionId] = {sectionText: sectionId + "年", sectionAmt: this.sectionAmts[idx]};
			this.sectionData[rowId] = item;
		});
	}

    onPressDetail (item) {
    	 this.props.navigator.push({
            title: "工资条",
            component: PayStubList,
        	hideNavBar : true,
            passProps: {
            	perId: item.perId,
            	month: item.month,
            	refresh: this.refresh,
            	backRoute: this.props.route,
            },
        });
	}

	onUserStoreChange (user) {
		this.setState({
			user: UserStore.getUser(),
			salaryCard: UserStore.getSalaryCard(),
		}, () => {
			this.fetchData();
		});
	}

	/**
	 * 无限加载
	 */
	onEndReached () {
		if(this.state.loading || this.state._pullToRefreshing || this.state._refreshing || this.state.noMoreData)
			return;

		this.setState({
			start: this.state.start + this.state.pageSize
		}, () => {
			this.fetchData();
		});
	}

	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		let emptyView = !this.state.loading && !this.state._refreshing && !this.state._pullToRefreshing && !this.state._requestErr && this.sectionData.length == 0 ? (
			<Card fullWidth = {true} style = {{paddingBottom: 20}} >
				<Text style = {[Global._styles.MSG_TEXT, {marginTop: 30, marginBottom: 20}]} >暂无符合条件的数据</Text>
			</Card>
		) : null;

		return (
			<View style = {Global._styles.CONTAINER} >
				{this._getNavBar()}
				{this._renderCard()}
				{this.getLoadingView('正在载入工资信息...', this.refresh, {marginTop: 20})}
				{emptyView}
				
				<ListView
					automaticallyAdjustContentInsets = {false}	//此参数保证在IOS的Tabbar中顶端不出现与statusBar等高的空隙
			        dataSource = {this.state.dataSource}
			        renderRow = {this.renderRow}
			        enableEmptySections = {true}
					renderSectionHeader = {this.renderSectionHeader}
					renderSeparator = {this.renderSeparator}
					renderFooter = {this.renderFooter}
	                onEndReached = {this.onEndReached}
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

	_renderCard () {
		let salaryCard = this.state.salaryCard;
		if(salaryCard == null){
			return null;
		}

		return (
				<View style={{ margin: 8, marginTop:20, }}>
					<Card color={Global._colors.ORANGE} 
						showType={2} 
						card={salaryCard} 
						balance={salaryCard.balance} />
				</View>
			/*<View style = {[Global._styles.TOOL_BAR.FIXED_BAR,{height:, 80backgroundColor: Global._colors.ORANGE, borderRadius: 3,}]}>
				<Image style={{width: 45, height: 45, marginLeft: 10, marginRight: 10, backgroundColor: 'transparent'}} resizeMode='contain' 
					source={require('../res/images/bankLogos/313100000013.png')} />

				<View style={{flex: 1, paddingLeft: 10}}>
	            	<Text style={{flex: 1, fontSize: 15, alignItems: 'center', }}>
	              		内蒙古自治区社会保障卡
	            	</Text>
	            	<Text style={{flex: 1, fontSize: 12, color: "#FFFFFF"}}>
	              		{salaryCard.bankName}
	            	</Text>
	            	<View style={{flexDirection: 'row', }}>
		            	<Text style={{flex: 1, fontSize: 12,  color: "#FFFFFF"}}>
		              		{Filters.filterCardNumLast4(salaryCard.cardNo)}
		            	</Text>
		            	<View style={{flex: 1, alignItems: 'flex-end'}}>
			            	<Text style={{flex: 1, marginRight: 10, fontSize: 12,  color: "#FFFFFF"}}>
			              		余额{Filters.filterMoney(salaryCard.balance, 2)}元
			            	</Text>
		            	</View>
	            	</View>
	            </View>
			</View>*/
		);
	}
	/**
	 * 渲染行数据
	 */
	renderRow (item, sectionId, rowId, highlightRow) {
            
		return (
			<View style = {[styles.item]} >
				<Text style={[styles.itemTitle]}>{item.month}月</Text>
				<Text style={[styles.itemTime]}>{Filters.filterDateTimeToDate(item.payTime)}</Text>
				<Text style={[styles.itemAmt]}>{Filters.filterMoney(item.amount, 2)}</Text>
				<TouchableOpacity style={[styles.itemBtn]} onPress = {()=>{this.onPressDetail(item);}}>
					<Text style = {{color: Global._colors.IOS_BLUE, fontSize: 15,}}>工资条</Text>
				</TouchableOpacity>
			</View>
		);
	}

	/**
	 * 渲染数据分区表头
	 */
	renderSectionHeader (sectionData, sectionId) {
		return (
			<View style={[styles.section,]}>
				<View style={[{width:120, marginLeft: 10, justifyContent: 'center',}]} >
					<Text style={[styles.sectionText]}>
						{sectionData.sectionText}
					</Text>
				</View>
				<View style={[{flex: 1, alignItems: 'flex-end', justifyContent: 'center',}]} >
					<Text style={[styles.sectionAmt]}>
						合计：{Filters.filterMoney(sectionData.sectionAmt, 2)}
					</Text>
				</View>
			</View>
		);
	}

	/**
	 * 渲染行分割线
	 */
	renderSeparator (sectionId, rowId) {
		/*if(rowId == this.data.length - 1)
			return null;
		else*/
			return <View key={'sep_' + rowId} style={Global._styles.SEP_LINE} />;
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
			<NavBar 
				title = '工资'
				navigator = {this.props.navigator} 
				route = {this.props.route} 
				hideBottomLine = {false} 
			/>
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
        flexDirection: 'row',
        padding: 15,
        paddingLeft: 0,
	},
	itemTitle:{
		width: 120, 
		fontSize: 15,
		marginLeft: 10, 
	},
	itemTime: {
		flex: 1,
		fontSize: 13,
		marginLeft: 10, 
	},
	itemAmt: {
		flex: 1,
		fontSize: 13,
		marginLeft: 10, 
		textAlign : 'right',
	},
	itemBtn: {
		flex: 1,
		marginLeft: 10, 
		alignItems: 'flex-end',
	},
	section: {
		backgroundColor: Global._colors.IOS_BG,
		borderWidth: 1 / Global._pixelRatio,
		borderColor: Global._colors.IOS_SEP_LINE,
		borderLeftWidth: 0,
		borderRightWidth: 0,
		height: 35,
		flexDirection: 'row',
		padding: 15,
        paddingLeft: 0,
		justifyContent: 'center',
	},
	sectionText: {
		fontSize: 14,
		color: Global._colors.FONT_GRAY,
		fontWeight: '500',
	},
	sectionAmt: {
		fontSize: 14,
		color: Global._colors.FONT_GRAY,
		fontWeight: '500',
	},
	footer: {
		height: 50,
	},
	footerText: {
		color: Global._colors.FONT_LIGHT_GRAY1,
		fontSize: 13,
	},
});

export default SalaryList;

