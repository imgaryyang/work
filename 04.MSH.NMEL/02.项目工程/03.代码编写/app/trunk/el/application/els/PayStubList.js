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
} from 'react-native';

import * as Global 		from '../Global';
import * as Filters 	from '../utils/Filters';
import NavBar			from 'rn-easy-navbar';
import EasyIcon     	from 'rn-easy-icon';
import Button			from 'rn-easy-button';
import Sep				from 'rn-easy-separator';

import PayStub 			from './PayStub';

const FIND_URL 	= 'els/stubbatchinfo/perstublist/';
const TEMP_URL 	= 'els/stubtemplate/detail/';

class PayStubList extends Component {

	sectionData = {};
	sectionIds = [];
	rowIds = [];

    static displayName = 'PayStubList';
    static description = '工资条';

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
		firstFetchEnd: false,
		start: 0,
		pageSize: 10,
		total: 0,
		totalPage: 0,
		cond: null,
		noMoreData: false,
		loading: false,
		_refreshing: true,//控制刷新
		_pullToRefreshing: false,//控制下拉刷新
		_infiniteLoading: false,//控制无限加载
	};

    constructor (props) {
        super(props);

        this.fetchData 				= this.fetchData.bind(this);
        this.refresh 				= this.refresh.bind(this);
        this.appendSectionData 		= this.appendSectionData.bind(this);
        this.renderRow 				= this.renderRow.bind(this);
        this.renderSectionHeader 	= this.renderSectionHeader.bind(this);
        this.renderSeparator 		= this.renderSeparator.bind(this);
    }

	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true}, () => this.refresh());
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
	 * 异步加载数据
	 */
	async fetchData () {

		try {
			let responseData = await this.request(Global._host + FIND_URL + "0/200?month=" + this.props.month, {
				method : "GET"
			});

			if(responseData && responseData.success && responseData.result){
				let tempInfos = null;
				let stubData = responseData.result;

				for(let i=0; i<stubData.length; i++){
					tempInfos = await this.request(Global._host + TEMP_URL + stubData[i].templateId, {
						method : "GET"
					});
					stubData[i].tempInfos = tempInfos.result;
				}
			}

			this.appendSectionData(responseData.result);
			
			this.setState({
				firstFetchEnd: true,
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
		if(!data || typeof(data)=='undefined'){
			return;
		}
		data.forEach((item) => {
			this.sectionIds.push(item.id);
			this.rowIds.push([]);
			this.sectionData[item.id] = item;
			item.tempInfos.forEach((tempInfo) => {
				let rowId = item.id+ "_" +tempInfo.id;
				this.rowIds[this.rowIds.length-1].push(rowId);
				this.sectionData[rowId] = tempInfo;
			});
			item.tempInfos = null;
		});
	}

	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		return (
			<View style = {Global._styles.CONTAINER} >
				{this._getNavBar()}

				{this.getLoadingView(
					'正在载入工资条信息...', this.refresh, {marginTop: 20}
				)}
				{this.getEmptyView({
					condition: (!this.state.loading && this.rowIds.length == 0),
					msg: '暂无工资条信息',
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
			        initialListSize = {10}
			        pageSize = {4}
			        style = {[styles.list]} />

			</View>
		);
	}

	/**
	 * 渲染行数据
	 */
	renderRow (item, sectionId, rowId, highlightRow) {
		let itemValue = this.sectionData[sectionId]["item"+item.seqNo]
        return (
			<View style = {[styles.item]} >
				<View style={{width:120, paddingLeft: 15, alignItems: 'center', }}>
					<Text style={[styles.itemTitle]}>{item.item}:</Text>
            	</View>
				<View style={{flex: 1, alignItems: 'flex-end', }}>
	            	<Text style={[styles.itemAmt]}>{Filters.filterMoney(itemValue, 2)}</Text>
            	</View>
				
			</View>
		);
	}

	/**
	 * 渲染数据分区表头
	 */
	renderSectionHeader (sectionData, sectionId) {
		let payAmt = 0.0;
        for(let i=0; i<=30; i++){
        	let itemValue = parseFloat(sectionData["item" +i]);
        	if(itemValue > 0.0){
        		payAmt = itemValue;
        	}
        }

		return (
			<View style={[styles.section]}>
				<View style={[{width:120, marginLeft: 10, justifyContent: 'center',}]} >
					<Text style={[styles.sectionText]}>
						{sectionData.month}月
					</Text>
				</View>
				<View style={[{flex: 1, alignItems: 'flex-end', justifyContent: 'center',}]} >
					<Text style={[styles.sectionAmt]}>
						实发：{Filters.filterMoney(payAmt, 2)}
					</Text>
				</View>
			</View>
		);
	}

	/**
	 * 渲染行分割线
	 */
	renderSeparator (sectionId, rowId) {
		return <View key={'sep_' + rowId} style={Global._styles.SEP_LINE} />;
	}

	renderFooter () {
		return <Sep height = {40} />;
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
				title =  {'工资条'} 
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
	sv: {
		flex: 1,
	},
	list: {
		marginLeft: 8,
		marginRight: 8,
	},
	item: {
		backgroundColor: '#ffffff',
        flexDirection: 'row',
        padding: 15,
        paddingLeft: 0,
		borderLeftWidth: 1 / Global._pixelRatio,
		borderLeftColor: Global._colors.IOS_SEP_LINE,
		borderRightWidth: 1 / Global._pixelRatio,
		borderRightColor: Global._colors.IOS_SEP_LINE,
	},
	itemTitle:{
		width: 120, 
		fontSize: 15,
		marginLeft: 10, 
	},
	itemTime: {
		flex: 1,
		fontSize: 13,
	},
	itemAmt:{
		flex: 1,
		fontSize: 13,
	},
	section: {
		marginTop: 16,
		backgroundColor: '#ffffff',
		borderWidth: 1 / Global._pixelRatio,
		borderColor: Global._colors.IOS_SEP_LINE,
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

export default PayStubList;

