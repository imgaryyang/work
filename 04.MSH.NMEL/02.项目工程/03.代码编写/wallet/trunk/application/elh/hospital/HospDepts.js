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
} from 'react-native';

import * as Global  		from '../../Global';

import Card       			from 'rn-easy-card';
import Button       		from 'rn-easy-button';
import EasyIcon     		from 'rn-easy-icon';

import Dept 				from './HospDept';
import RegisterResource  	from '../register/RegisterResource';


const FIND_URL 	= 'elh/department/app/listByHos/';

class HospDepts extends Component {

    static displayName = 'HospDepts';
    static description = '科室';

	sectionData = {};
	sectionIds = [];
	rowIds = [];

    static propTypes = {
    	/**
    	 * 是否只显示特色科室
    	 */
    	isSpecial: PropTypes.bool,
    };

    static defaultProps = {
    };

	state = {
		start: 0,
		pageSize: 10,
		dataSource: new ListView.DataSource({
			getRowData: (dataBlob, sectionId, rowId) => { return dataBlob[rowId]; },
			getSectionHeaderData: (dataBlob, sectionId) => { return dataBlob[sectionId]; },
			rowHasChanged: (row1, row2) => row1 !== row2,
			sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
		}),
		_refreshing: true,//控制刷新
		_pullToRefreshing: false,//控制下拉刷新
	};

    constructor (props) {
        super(props);

        this.fetchData 			= this.fetchData.bind(this);
        this.refresh 			= this.refresh.bind(this);
        this.pullToRefresh 		= this.pullToRefresh.bind(this);
       	this.appendSectionData 	= this.appendSectionData.bind(this);
      
        this.renderRow 			= this.renderRow.bind(this);
        this.renderSectionHeader = this.renderSectionHeader.bind(this);
        this.renderSeparator 	= this.renderSeparator.bind(this);

        this.onPressDetail 		= this.onPressDetail.bind(this);
        this.onPressRegister 	= this.onPressRegister.bind(this);
    }

	componentDidMount () {
		this.refresh();
	}

	refresh () {
		this.setState({
			_refreshing: true,
		}, () => {
			this.fetchData();
		});
	}

	pullToRefresh () {
		this.setState({
			_pullToRefreshing: true,
		}, () => {
			this.fetchData();
		});
	}

	async fetchData () {
		try {

			let data = this.props.isSpecial === true ? encodeURI(JSON.stringify({isSpecial: true})) : null;

			let responseData = await this.request(Global._host + FIND_URL + this.props.hosp.id + (data ? '?data=' + data : ''), {
				method : "GET"
			});
			
			this.sectionIds = [];
			this.rowIds = [];
			this.sectionData = [];
			
			this.appendSectionData(responseData.result);

			this.setState({
				dataSource: this.state.dataSource.cloneWithRowsAndSections(this.sectionData, this.sectionIds, this.rowIds),
			});

			if (typeof this.props.onChildCompLoaded == 'function')
				this.props.onChildCompLoaded();

		} catch(e) {
			this.handleRequestException(e);
		}
	}

	/**
	 * 将新查询到的数据追加到sectionData中
	 */
	appendSectionData (data) {
		//console.log(data);
		let sectionId, idx, rId;
		if(data && data.length > 0)
			data.forEach((item) => {
				sectionId = item['type'];
				idx = this.sectionIds.indexOf(sectionId);
				if(idx == -1) {
					idx = this.sectionIds.length;
					this.sectionIds.push(sectionId);
					this.rowIds.push([]);
				}
				rId = 's' + idx + 'r' + this.rowIds[idx].length;
				this.rowIds[idx].push(rId);

				this.sectionData[sectionId] = item['type'];
				this.sectionData[rId] = item;
			});
	}
	

	render () {

		let emptyView = !this.state._refreshing && !this.state._pullToRefreshing && !this.state._requestErr && this.sectionIds.length == 0 ? (
			<Card fullWidth = {true} >
				<Text style = {[Global._styles.MSG_TEXT, {marginTop: 30, marginBottom: 30}]} >暂无科室信息</Text>
			</Card>
		) : null;

		return (
			<View style = {Global._styles.CONTAINER} >
				{this.getLoadingView('正在查询科室信息...', this.refresh)}
				{emptyView}
				<ListView
					automaticallyAdjustContentInsets = {false}	//此参数保证在IOS的Tabbar中顶端不出现与statusBar等高的空隙
			        dataSource = {this.state.dataSource}
			        renderRow = {this.renderRow}
    				renderSectionHeader = {this.renderSectionHeader}
    				renderSeparator = {this.renderSeparator}
			        initialListSize = {10}
			        pageSize = {10}
			        style = {[styles.list]} />
			</View>
		);
	}


	/**
	 * 渲染行数据
	 */
	renderRow (item, sectionId, rowId, highlightRow) {
		return (
			<TouchableOpacity key = {rowId} style = {[Global._styles.CENTER, styles.item]} onPress = {() => this.onPressDetail(item)} >
				<Text style = {{flex: 1}} >{item.name}</Text>
				<Button theme = {Button.THEME.ORANGE} outline = {true} stretch = {false} style = {{width: 50, height: 25, marginRight: 15}} onPress = {() => this.onPressRegister(item)} >
					<Text style = {{fontSize: 12, color: Global._colors.ORANGE}} >去挂号</Text>
				</Button>
				<EasyIcon name = "ios-arrow-forward-outline" size = {20} color = {Global._colors.FONT_LIGHT_GRAY1} />
			</TouchableOpacity>
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
		return <View key={'sep_' + rowId} style={Global._styles.SEP_LINE} />;
	}


	/**
	 * 查看科室详情
	 */
	onPressDetail (dept) {
		this.props.navigator.push({
			component: Dept,
			hideNavBar: true,
			passProps: {
				dept: dept
			}
		});
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

}

const styles = StyleSheet.create({

	list: {
		flex: 1,
		paddingBottom: 40,
	},
	item: {
		padding: 15,
		paddingTop: 8,
		paddingBottom: 8,
		paddingRight: 10,
		flexDirection: 'row',
		backgroundColor: 'white',
	},
	section: {
		backgroundColor: Global._colors.IOS_BG,
		borderWidth: 1 / Global._pixelRatio,
		borderColor: Global._colors.IOS_SEP_LINE,
		borderLeftWidth: 0,
		borderRightWidth: 0,
		height: 35,
		justifyContent: 'center',
	},
	sectionText: {
		fontSize: 14,
		color: Global._colors.FONT_GRAY,
		fontWeight: '500',
		left: 20,
	},
});

export default HospDepts;



