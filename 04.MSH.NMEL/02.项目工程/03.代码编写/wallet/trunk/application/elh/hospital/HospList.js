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

import NavBar       from 'rn-easy-navbar';
import Card       	from 'rn-easy-card';
import Button       from 'rn-easy-button';
import EasyIcon     from 'rn-easy-icon';
import Separator    from 'rn-easy-separator';
import Portrait     from 'rn-easy-portrait';

import SearchInput 	from '../../lib/SearchInput';

import HospMicroWebSite from './HospMicroWebSite';

const FIND_URL 		= 'elh/hospital/app/list/';
const IMAGES_URL 	= 'el/base/images/view/';

class HospList extends Component {

    static displayName = 'HospList';
    static description = '医院列表';

    _data = [];

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
		cond: null,
		dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
		total: 0,
		start: 0,
		pageSize: 10,
		noMoreData: false,
		_refreshing: true,//控制刷新
		_pullToRefreshing: false,//控制下拉刷新
		_infiniteLoading: false,//控制无限加载
	};

    constructor (props) {
        super(props);

        this.refresh 			= this.refresh.bind(this);
        this.pullToRefresh 		= this.pullToRefresh.bind(this);
        this.infiniteLoad 		= this.infiniteLoad.bind(this);
        this.fetchData 			= this.fetchData.bind(this);

        this.renderRow 			= this.renderRow.bind(this);
        this.renderSeparator 	= this.renderSeparator.bind(this);
        this.renderFooter 		= this.renderFooter.bind(this);

        this.onPressDetail 	 	= this.onPressDetail.bind(this);
    }

	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({
				doRenderScene: true,
			}, () => this.refresh());
		});
	}

	refresh () {
		this._data = [];
		this.setState({
			_refreshing: true,
			total: 0,
			start: 0,
			noMoreData: false,
		}, () => {
			this.fetchData();
		});
	}

	pullToRefresh () {
		this._data = [];
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
	 * 无限加载
	 */
	infiniteLoad () {
		console.log(this.state.noMoreData);
		if(this.state._refreshing || this.state._pullToRefreshing || this.state.noMoreData)
			return;

		this.setState({
			start: this.state.start + this.state.pageSize,
			_infiniteLoading: true,
		}, () => {
			this.fetchData();
		});
	}

	async fetchData () {
		try {
			let data = encodeURI(JSON.stringify({
	            name: this.state.cond,
	        }));

			let responseData = await this.request(Global._host + FIND_URL 
				+ this.state.start + '/' + this.state.pageSize + '?data=' + data, {
				method: 'GET',
			});

			if(responseData.result && responseData.result.length > 0) {
				this._data = this._data.concat(responseData.result);
				this.setState({
					dataSource: this.state.dataSource.cloneWithRows(this._data),
					total: responseData.total,
					start: responseData.start,
					noMoreData: responseData.start + responseData.pageSize >= responseData.total ? true : false,
				});
			} else {
            	this.setState({
					dataSource: this.state.dataSource.cloneWithRows(this._data),
					noMoreData: true,
				});
			}
		} catch(e) {
			this.handleRequestException(e);
		}
	}

	onPressDetail (hosp) {
		this.props.navigator.push({
			component: HospMicroWebSite,
			hideNavBar: true,
			passProps: {
				hosp: hosp
			}
		});
	}

	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		let emptyView = !this.state._refreshing && !this.state._pullToRefreshing && !this.state._requestErr && this._data.length == 0 ? (
			<Card fullWidth = {true} >
				<Text style = {[Global._styles.MSG_TEXT, {marginTop: 30, marginBottom: 30}]} >暂无相关医院信息</Text>
			</Card>
		) : null;
		
		return (
			<View style = {Global._styles.CONTAINER} >
				{this._getNavBar()}
			    {this._getToolBar()}
			    {this.getLoadingView('正在查询医院信息...', this.refresh)}
			    {emptyView}
				<ListView 
					dataSource = {this.state.dataSource}
	        		enableEmptySections = {true}
					renderRow = {this.renderRow}
					renderSeparator = {this.renderSeparator}
					renderFooter = {this.renderFooter}
		            onEndReached = {this.infiniteLoad}
					style = {styles.list}
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

	renderRow (row, sectionID, rowID, highlightRow) {
		return (
			<TouchableOpacity onPress = {() => this.onPressDetail(row)} >
				<Card fullWidth = {true} style = {{paddingBottom: 5}} >
					<View style = {[{flexDirection: 'row'}, Global._styles.CENTER]} >
						<View style = {[{flex: 1}]} >
							<View style = {[{flexDirection: 'row'}, Global._styles.CENTER]} >
								<Portrait imageSource = {{uri: Global._host + IMAGES_URL + row.elhOrg.logo,}} width = {26} height = {26} />
								<Text style = {{flex: 1, marginLeft: 10}} >{row.name}</Text>
							</View>
							<Text style = {{fontSize: 13, marginTop: 8, color: Global._colors.FONT_GRAY}} >{Filters.filterHospLevel(row.elhOrg.hosLevel)} | {Filters.filterHospType(row.elhOrg.hosType)}</Text>
						</View>
						<Portrait imageSource = {{uri: Global._host + IMAGES_URL + row.sceneryThumb,}} width = {80} height = {60} radius = {5} />
					</View>
					<View style = {[{flexDirection: 'row', marginTop: 10, borderTopColor: Global._colors.IOS_SEP_LINE, borderTopWidth: 1 / Global._pixelRatio, paddingTop: 5}, Global._styles.CENTER]} >
						<EasyIcon name = "ios-pin" size = {13} color = {Global._colors.FONT_LIGHT_GRAY1} />
						<Text style = {{flex: 1, fontSize: 12, color: Global._colors.FONT_GRAY}} >{row.elhOrg.address}</Text>
					</View>
				</Card>
			</TouchableOpacity>
		);
	}

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
		if(this.state._refreshing || this.state._pullToRefreshing)
			return null;

		if(this.state._infiniteLoading)
			return this.getInfiniteLoadingView('正在载入更多信息', this.infiniteLoad);

		if(this._data.length > 0 && this.state.noMoreData) {
			return (
				<View style={[Global._styles.CENTER, styles.footer]} >
					<Text style={styles.footerText} >全部医院信息加载完成</Text>
				</View>
			);
		}
	}

	_renderPlaceholderView () {
		return (
			<View style = {Global._styles.CONTAINER}>
			    {this._getNavBar()}
			    {this._getToolBar()}
			</View>
		);
	}

	_getNavBar () {
		return (
			<NavBar title = '找医院' 
		    	navigator = {this.props.navigator} 
				route = {this.props.route}
		    	hideBackButton = {false} 
		    	hideBottomLine = {false} />
		);
	}

	_getToolBar () {
		return (
			<View style = {[Global._styles.TOOL_BAR.FIXED_BAR, {backgroundColor: Global._colors.IOS_GRAY_BG}]}>
				<SearchInput value = {this.state.cond} onChangeText = {(value) => this.state.cond = value} style = {{marginLeft: 10}} />
				<Button text = "查询" onPress = {this.fetchData} stretch = {false} clear = {true} style = {[Global._styles.NAV_BAR.BUTTON]} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	list: {
		flex: 1,
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

export default HospList;



