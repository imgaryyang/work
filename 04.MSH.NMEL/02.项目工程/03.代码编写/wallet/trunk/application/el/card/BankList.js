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
import * as Global 		from '../../Global';
import SearchInput 		from '../../lib/SearchInput';

import NavBar			from 'rn-easy-navbar';
import EasyIcon     	from 'rn-easy-icon';

const FIND_URL = 'el/bankBranch/list/';

class BankList extends Component {

	datas = [];

    static displayName = 'BankList';
    static description = '分行列表';

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
		dataSource: new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,
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

        this.search 				= this.search.bind(this);
        this.fetchData 				= this.fetchData.bind(this);
        this.renderRow 				= this.renderRow.bind(this);
        this.renderSeparator 		= this.renderSeparator.bind(this);
        this.renderFooter 			= this.renderFooter.bind(this);
        this.onEndReached 			= this.onEndReached.bind(this);
    }

    /**
	* 页面装载时调用，只调用这一次
    **/
    componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
		this.fetchData();
	}

	/**
	* 条件检索
	**/
	search () {
		this.setState ({
			start: 0,
			noMoreData: false,
			loading: false,
		});
		this.datas = [];
		this.fetchData();
	}

	/**
	 * 异步加载列表数据
	 */
	async fetchData () {
		if(this.state.loading) return;
		this.setState({loading: true});
		let data =  encodeURI(JSON.stringify({
					cond: this.state.cond,
					bankNo: this.props.bankNo,
				}));
		try {
			let responseData = await this.request(Global._host + FIND_URL
				+ this.state.start + '/' + this.state.pageSize + '?data=' + data, {
	        	method: 'GET',
			});
			this.appendSectionData(responseData.result);
			this.setState({
				firstFetchEnd:true,
				total: responseData.total,
				totalPage: responseData.totalPage,
				start: responseData.start,
				dataSource: this.state.dataSource.cloneWithRows(this.datas),
				noMoreData: responseData.start + responseData.pageSize >= responseData.total ? true : false,
				loading: false,
			});
		} catch(e) {
			this.handleRequestException(e);
		}
	}

	/**
	 * 将新查询到的数据追加到sectionData中this.sectionData, this.rowIds
	 */
	appendSectionData (data) {
		if(!data || data==null){
			return;
		}
		data.forEach((item) => {
			this.datas.push(item);
		});
	}

	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();
		return (
			<View style = {Global._styles.CONTAINER} >
				{this._getNavBar()}
				<View style = {[Global._styles.TOOL_BAR.FIXED_BAR,{paddingLeft:5,}]}>
					<SearchInput 
						value = {this.state.cond} 
						onChangeText = {(value) => this.setState({cond: value})} />
					<TouchableOpacity style = {[Global._styles.CENTER, Global._styles.TOOL_BAR.BUTTON,]} onPress = {this.search}>
						<Text style = {{color: Global._colors.IOS_BLUE}}>查询</Text>
					</TouchableOpacity>
				</View>
				<ListView 
					automaticallyAdjustContentInsets = {false}	//此参数保证在IOS的Tabbar中顶端不出现与statusBar等高的空隙
			        dataSource = {this.state.dataSource}
			        renderRow = {this.renderRow}
			        enableEmptySections = {true}
    				renderSeparator = {this.renderSeparator}
    				renderFooter = {this.renderFooter}
                    onEndReached = {this.onEndReached}
        			scrollRenderAheadDistance = {20}
			        initialListSize = {7}
			        pageSize = {4}
			        style = {[styles.list]} />
			</View>

		);
	}

	/**
	 * 渲染行数据
	 */
	renderRow (item, sectionId, rowId, highlightRow) {
		let icon = require('../../res/images/bankLogos/1040000.png');
		return (
			<View style = {[styles.item]} >
				<TouchableOpacity style = {[styles.item, Global._styles.CENTER,]} >
		    		<Image style={[styles.icon]} source={icon} />
					<View style={{flex:1,}}>
						<Text style = {[styles.bankBranchName,{flex: 1, marginLeft: 10, fontSize: 15,}]}>
							{item.name}
						</Text>
						<Text style = {{flex: 1, marginLeft: 10, fontSize: 15,}}>
							{item.contactWay}
						</Text>
						<Text style = {{flex: 1, marginLeft: 10, fontSize: 13,}}>
							{item.address}
						</Text>
					</View>
					<EasyIcon iconLib = 'fa' name = 'map-marker' 
						size = {40} color = {Global._colors.IOS_ARROW} 
						style = {[Global._styles.ICON, {width: 40}]} 
						/>
				</TouchableOpacity>
			</View>
		);
	}

	/**
	 * 渲染行分割线
	 */
	renderSeparator (sectionId, rowId) {
		return <View key={'sep_' + rowId} style={[Global._styles.FULL_SEP_LINE,{margin:0}]} />;
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

        var footerText = this.state.noMoreData ? '数据载入完成' : '正在载入数据……';
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
		console.log("******");
		console.log("this.state.firstFetchEnd="+this.state.firstFetchEnd);
		if(this.state.noMoreData || !this.state.firstFetchEnd || this.state.loading){
			return;
		}
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

	/**
	 * 渲染导航栏
	 */
	_getNavBar () {
		return (
			<NavBar 
				title = '分行列表'
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
	icon: {
		width: 40,
		height: 40,
	},
	image: {
		width: 42,
		height: 42,
		borderRadius:21,
		padding: 1,
		backgroundColor: '#ffffff',
		marginLeft: 10,
		marginTop: 15,
	},
	list: {
		backgroundColor: '#ffffff',
	},
	item: {
		width: Global.getScreen().width,
        flexDirection: 'row',
        padding: 5,
	},
	footer: {
		height: 50,
	},
	footerText: {
		color: Global._colors.FONT_LIGHT_GRAY1,
		fontSize: 13,
	},
	bankBranchName: {
		color: '#ff6600',
		fontSize: 15,
	},
});

export default BankList;

