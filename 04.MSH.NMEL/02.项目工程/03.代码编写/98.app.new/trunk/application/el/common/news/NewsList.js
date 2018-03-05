'use strict';

import React, {
    Component,

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
    ActivityIndicator,
} from 'react-native';

import PropTypes from 'prop-types';
import * as Global  from '../../../Global';

import Card       	from 'rn-easy-card';
import Separator    from 'rn-easy-separator';
import Portrait     from 'rn-easy-portrait';

import NewsDetail	from './NewsDetail.js';

const newsTypes = {
	'H1': '院报',
    'H2': '特色',
    'H3': '政策信息',
    'H4': '健康指导',
    'HA': '广告',
}

class NewsList extends Component {

    static displayName = 'NewsList';
    static description = '新闻中心';

    static propTypes = {

    	/**
    	 * 查询条件
    	 * {
    	 * 	fkId		- 外联id
    	 * 	fkType		- 外联类型
    	 * 	caption		- 标题
    	 * 	feededBy	- 供稿人
    	 * }
    	 */
    	data: PropTypes.object,

    	/**
    	 * 类型描述文字信息
    	 */
    	typeText: PropTypes.string,

    	/**
    	 * 加载数据时显示的文字信息
    	 */
    	loadingText: PropTypes.string,
    };

    static defaultProps = {
    };

    _data = [];

	state = {
		dataSource: new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,
		}),
		total: 0,
		start: 0,
		pageSize: 10,
		noMoreData: false,
		_refreshing: true,//控制刷新
		_pullToRefreshing: false,//控制下拉刷新
		_infiniteLoading: false,//控制无限加载
		typeText: this.props.typeText,
	};

    constructor (props) {
        super(props);

        this.refresh 		= this.refresh.bind(this);
        this.pullToRefresh 	= this.pullToRefresh.bind(this);
        this.infiniteLoad 	= this.infiniteLoad.bind(this);
        this.fetchData 		= this.fetchData.bind(this);
        this.renderItem 	= this.renderItem.bind(this);
        this.renderFooter 	= this.renderFooter.bind(this);
        this.showNewsDetail = this.showNewsDetail.bind(this);
    }

	componentDidMount () {
		this.refresh();
	}

	componentWillReceiveProps (props) {
		if(this.state.typeText != props.typeText) {
			this._data = [];
			this.setState({
				typeText: props.typeText,
				total: 0,
				start: 0,
				noMoreData: false,
				_refreshing: true,//控制刷新
				_pullToRefreshing: false,//控制下拉刷新
				_infiniteLoading: false,//控制无限加载
			}, () => {
				this.refresh();
			});
		}
	}

	/**
	* 调用刷新
	*/
	refresh () {
		//console.log('NewsList.refresh()');
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

	/**
	 * 下拉刷新
	 */
	pullToRefresh () {
		//console.log('NewsList.pullToRefresh()');
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
		//console.log(this.state.noMoreData);
		if(this.state._refreshing || this.state._pullToRefreshing || this.state.noMoreData)
			return;

		this.setState({
			start: this.state.start + this.state.pageSize,
			_infiniteLoading: true,
		}, () => {
			this.fetchData();
		});
	}

	async fetchData() {
        let FIND_URL = 'el/base/news/list/' + this.state.start + '/' + this.state.pageSize + '?data=' + encodeURI(JSON.stringify(this.props.data));
        try {
	        let responseData = await this.request(Global._host + FIND_URL, {
	        	method: 'GET'
            });
	        //console.log(responseData);
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

			if (typeof this.props.onChildCompLoaded == 'function')
				this.props.onChildCompLoaded();

        } catch(e) {
            this.handleRequestException(e);
        }
	}

	render () {
		var content = null;

		let emptyView = !this.state._refreshing && !this.state._pullToRefreshing && !this.state._requestErr && this._data.length == 0 ? (
			<Card fullWidth = {true} >
				<Text style = {[Global._styles.MSG_TEXT, {marginTop: 30, marginBottom: 30}]} >暂无{this.props.typeText ? this.props.typeText : '相关'}信息</Text>
			</Card>
		) : null;

		content = <ListView
	        dataSource = {this.state.dataSource}
	        enableEmptySections = {true}
	        renderRow = {this.renderItem}
	        renderSeparator = {this.renderSeparator}
			renderFooter = {this.renderFooter}
            onEndReached = {this.infiniteLoad}
	        style = {[styles.list]} />

		return (
			<View style = {[Global._styles.CONTAINER]} >
				{this.getLoadingView(this.props.loadingText ? this.props.loadingText : '正在载入...', this.refresh)}
				{emptyView}
				{content}
			</View>
		);
	}

	renderSeparator (sectionID, rowID, adjacentRowHighlighted) {
		return (
			<Separator key = {"sep_" + rowID} height = {10} />
		)
	}

	renderItem (item, sectionID, rowID, highlightRow) {
		//console.log(item);
		var image = Global._host + 'el/base/images/view/' + item.image;
		return (
			<TouchableOpacity onPress = {() => this.showNewsDetail(item)} >
				<Card key = {"yb_" + rowID} fullWidth = {true} >
					<Portrait 
						imageSource = {{uri: image}} 
						radius = {10} 
						bgColor = {Global._colors.IOS_GRAY_BG} 
						width = {Global.getScreen().width - 30} 
						height = {(Global.getScreen().width - 30) * (1 - 0.618)} 
					/>
					<View style = {{marginTop: 10}} >
						<Text style = {[Global._styles.GRAY_FONT, {marginBottom: 8}]} >{item.createdAt}</Text>
						<Text style = {{fontSize: 17}} >{item.caption}</Text>
						<Text style = {[Global._styles.GRAY_FONT, {marginTop: 5, lineHeight: 17, fontSize: 14}]} >{item.digest}</Text>
					</View>
				</Card>
			</TouchableOpacity>
		);
	}

	/**
	 * 渲染列表表尾
	 * 如果无限加载被触发，则显示loading，如果没有更多数据，则显示相关提示信息
	 */
	renderFooter () {
		if(this.state._refreshing || this.state._pullToRefreshing)
			return null;

		if(this.state._infiniteLoading)
			return this.getInfiniteLoadingView('正在载入更多' + (this.props.typeText ? this.props.typeText : '') + '信息', this.infiniteLoad);

		if(this._data.length > 0 && this.state.noMoreData)
			return (
				<View style={[Global._styles.CENTER, styles.footer]} >
					<Text style={styles.footerText} >全部{this.props.typeText ? this.props.typeText : '相关'}信息加载完成</Text>
				</View>
			);
	}

	showNewsDetail (item) {
		this.props.navigator.push({
			component: NewsDetail,
			hideNavBar: true,
			passProps: {
				newsItem: item
			}
		});
	}
}

const styles = StyleSheet.create({
	list: {},
	footer: {
		height: 50,
	},
	footerText: {
		color: Global._colors.FONT_LIGHT_GRAY1,
		fontSize: 13,
	},
});

export default NewsList;

