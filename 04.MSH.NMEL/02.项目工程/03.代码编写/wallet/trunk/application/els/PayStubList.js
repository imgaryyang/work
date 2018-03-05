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
	};

    constructor (props) {
        super(props);

        this.fetchData 		= this.fetchData.bind(this);
        this.appendSectionData 		= this.appendSectionData.bind(this);
        this.renderRow 				= this.renderRow.bind(this);
        this.renderSectionHeader 	= this.renderSectionHeader.bind(this);
        this.renderSeparator 		= this.renderSeparator.bind(this);
        this.renderFooter 			= this.renderFooter.bind(this);
        this.onEndReached 			= this.onEndReached.bind(this);
    }

	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
			this.fetchData();
		});
	}

	/**
	 * 异步加载数据
	 */
	async fetchData () {
		if(this.state.loading)
			return;

		this.setState({loading: true});
		try {
//			let responseData = await this.request("http://10.12.253.7:8080/els/stubbatchinfo/perstublist/"
			let responseData = await this.request(Global._host + FIND_URL
				+ "0/20?perId="+this.props.perId + "&month=" + this.props.month, {
				method : "GET"
			});

			if(responseData && responseData.success && responseData.result){
				let tempInfos = null;
				let stubData = responseData.result;

				for(let i=0; i<stubData.length; i++){
//					tempInfos = await this.request("http://10.12.253.7:8080/els/stubtemplate/detail/" + stubData[i].templateId, {
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

				<ListView
					automaticallyAdjustContentInsets = {false}	//此参数保证在IOS的Tabbar中顶端不出现与statusBar等高的空隙
			        dataSource = {this.state.dataSource}
			        renderRow = {this.renderRow}
			        enableEmptySections = {true}
    				renderSectionHeader = {this.renderSectionHeader}
    				renderSeparator = {this.renderSeparator}
    				renderFooter = {this.renderFooter}
                    onEndReached = {this.onEndReached}
        			scrollRenderAheadDistance = {0}
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
			<View style={[styles.section,]}>
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
        /*if(Global._os == 'ios') 
            this._spinnerObj = (<ActivityIndicatorIOS animating = {this.state.animating} color = 'white' size = 'small' style = {{height: 80}} />)
        else 
            this._spinnerObj = (<ProgressBarAndroid color = 'white' styleAttr = 'Normal' />)*/

        var footerText = this.state.noMoreData ? '数据载入完成' : '载入数据……';
		return (
			<View style={[Global._styles.CENTER, styles.footer]} >
				<Text style={styles.footerText} >{footerText}</Text>
			</View>
		);
	}

	/**
	 * 无限加载
	 */
	onEndReached () {
		if(this.state.noMoreData || !this.state.firstFetchEnd || this.state.loading)
			return;

		this.setState({
			start: this.state.start + this.state.pageSize
		}, () => {
			this.fetchData();
		});
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
	},
	itemAmt:{
		flex: 1,
		fontSize: 13,
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

export default PayStubList;

