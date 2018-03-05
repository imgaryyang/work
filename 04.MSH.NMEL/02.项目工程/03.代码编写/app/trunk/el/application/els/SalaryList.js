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
import Button			from 'rn-easy-button';
import EasyCard			from 'rn-easy-card';
import Sep				from 'rn-easy-separator';

import Card       		from '../el/card/Card';
import BindCard1		from '../el/card/BindCard1';
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
		_infiniteLoading: false,//控制无限加载
	};

    constructor (props) {
        super(props);

        this.refresh 				= this.refresh.bind(this);
        this.pullToRefresh 			= this.pullToRefresh.bind(this);
        this.infiniteLoad 			= this.infiniteLoad.bind(this);
        this.fetchData 				= this.fetchData.bind(this);
        this.bindCard 				= this.bindCard.bind(this);
        this.appendSectionData 		= this.appendSectionData.bind(this);
        this.renderRow 				= this.renderRow.bind(this);
        this.renderSectionHeader 	= this.renderSectionHeader.bind(this);
        this.renderSeparator 		= this.renderSeparator.bind(this);
        this.renderFooter 			= this.renderFooter.bind(this);
        this.onPressDetail 			= this.onPressDetail.bind(this);
        this.onUserStoreChange		= this.onUserStoreChange.bind(this);
    }

	componentDidMount () {
		//监听UserStore
		this.onUserStoreChange = UserStore.listen(this.onUserStoreChange);

		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true}, () => {
				if(this.state.salaryCard)
					this.refresh();
			});
		});
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
			loading: true,
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
			loading: true,
		}, () => {
			this.fetchData();
		});
	}

	/**
	 * 无限加载
	 */
	infiniteLoad () {
		if(this.state._refreshing || this.state._pullToRefreshing || this.state.loading || this.state.noMoreData || this.state._requestErr)
			return;

		this.setState({
			start: this.state.start + this.state.pageSize,
			_infiniteLoading: true,
			loading: true,
		}, () => {
			this.fetchData();
		});
	}

	/**
	 * 异步加载数据
	 */
	async fetchData () {
		try {

			let personId = "";
			let personData = await this.request(Global._host + FIND_PER_URL + this.state.user.idCardNo, {
				method : "GET"
			});

			if(personData && personData.success && personData.result){
				personId = personData.result.id;
			}
			if(!personId){
				this.sectionData = {};
				this.sectionIds = [];
				this.rowIds = [];

				this.setState({
					dataSource: this.state.dataSource.cloneWithRowsAndSections(this.sectionData, this.sectionIds, this.rowIds),
					total: 0,
					start: 0,
					pageSize: 10,
					noMoreData: true,
					_refreshing: false,//控制刷新
					_pullToRefreshing: false,//控制下拉刷新
					_infiniteLoading: false,//控制无限加载
					loading: false,
				});

				return;
			}

			let responseData = await this.request(Global._host + FIND_URL 
				+ this.state.start+ "/" + this.state.pageSize + "?perId=" + personId, {
					method : "GET"
			});

			if(responseData.result && responseData.result.length > 0) {

				//将获取到的数据追加到场景中的DS中
				this.appendSectionData(responseData.result);

				this.setState({
					dataSource: this.state.dataSource.cloneWithRowsAndSections(this.sectionData, this.sectionIds, this.rowIds),
					total: responseData.total,
					start: responseData.start,
					noMoreData: responseData.start + responseData.pageSize >= responseData.total ? true : false,
					loading: false,
				});
			} else {
            	this.setState({
					dataSource: this.state.dataSource.cloneWithRowsAndSections(this.sectionData, this.sectionIds, this.rowIds),
					noMoreData: true,
					loading: false,
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
	 * 去绑卡
	 */
	bindCard () {
		this.props.navigator.push({
			component: BindCard1, 
			hideNavBar: true,
		});
	}

	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		if(!this.state.salaryCard) {
			return (
				<View style = {Global._styles.CONTAINER} >
					{this._getNavBar()}
					<EasyCard radius = {6} style = {{margin: 16, paddingBottom: 30}} >
						<Text style = {[Global._styles.MSG_TEXT, {margin: 30, marginBottom: 16}]} >{'您还未绑定二代社保卡' + '\n' + '绑卡后方能使用此功能'}</Text>
						<Button text = "去绑卡" onPress = {this.bindCard} />
					</EasyCard>
				</View>
			);
		}

		return (
			<View style = {[Global._styles.CONTAINER]} >
				{this._getNavBar()}

				{this._renderCard()}

				{this.getLoadingView(
					'正在载入工资发放信息...', this.refresh, {marginTop: 20}
				)}
				{this.getEmptyView({
					condition: (!this.state.loading && this.rowIds.length == 0),
					msg: '暂无工资发放信息',
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

	_renderCard () {
		let salaryCard = this.state.salaryCard;

		return (
			<View style = {{margin: 8, marginBottom: 0}} >
				<Card showType = {2} card = {salaryCard} balance = {salaryCard.balance} />
			</View>
		);
	}
	/**
	 * 渲染行数据
	 */
	renderRow (item, sectionId, rowId, highlightRow) {
            
		return (
			<View style = {[styles.item, Global._styles.CENTER]} >
				<Text style={[styles.itemTitle]}>{item.month}月</Text>
				<Text style={[styles.itemTime]}>{Filters.filterDateTimeToDate(item.payTime)}</Text>
				<Text style={[styles.itemAmt]}>{Filters.filterMoney(item.amount, 2)}</Text>
				<TouchableOpacity style={[styles.itemBtn]} onPress = {()=>{this.onPressDetail(item);}}>
					<Text style = {{color: Global._colors.IOS_BLUE, fontSize: 13,}}>工资条</Text>
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

		if(this.state._refreshing || this.state._pullToRefreshing)
			return null;

		if(this.state._infiniteLoading)
			return this.getInfiniteLoadingView('正在载入更多工资发放信息', this.infiniteLoad);

		if(this.rowIds.length > 0 && this.state.noMoreData)
			return (
				<View style={[Global._styles.CENTER, styles.footer]} >
					<Text style={styles.footerText} >全部工资发放信息加载完成</Text>
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
		//backgroundColor: 'white',
		margin: 8,
		marginBottom: 0,
	},
	item: {
        flexDirection: 'row',
        padding: 15,
        paddingLeft: 0,
        backgroundColor: 'white',
		borderLeftWidth: 1 / Global._pixelRatio,
		borderLeftColor: Global._colors.IOS_SEP_LINE,
		borderRightWidth: 1 / Global._pixelRatio,
		borderRightColor: Global._colors.IOS_SEP_LINE,
	},
	itemTitle:{
		flex: 1,
		fontSize: 12,
		color: Global._colors.FONT_LIGHT_GRAY,
		marginLeft: 15, 
	},
	itemTime: {
		flex: 1,
		fontSize: 12,
		color: Global._colors.FONT_LIGHT_GRAY,
		marginLeft: 10, 
	},
	itemAmt: {
		flex: 1,
		fontSize: 15,
		color: Global._colors.FONT_GRAY,
		marginLeft: 10, 
		textAlign : 'right',
	},
	itemBtn: {
		width: 50,
		alignItems: 'flex-end',
	},
	section: {
		backgroundColor: 'white',
		borderWidth: 1 / Global._pixelRatio,
		borderColor: Global._colors.IOS_SEP_LINE,
		/*borderLeftWidth: 0,
		borderRightWidth: 0,*/
		height: 40,
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

