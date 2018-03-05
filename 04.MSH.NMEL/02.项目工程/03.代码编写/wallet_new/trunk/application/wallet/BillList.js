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
	PixelRatio,
	RefreshControl,
} from 'react-native';

import * as Global  from '../Global';

import NavBar       from '../store/common/TopNavBar';
import EasyIcon     from 'rn-easy-icon';
import Card       	from 'rn-easy-card';

class BillList extends Component {

	datas = [];

    static displayName = 'BillList';
    static description = '账单';

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
		noMoreData: false,
		_infiniteLoading: false,//控制无限加载
		_pullToRefreshing: false,//控制下拉刷新
		start:1,
		dataSource: new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,
		}),
	};

    constructor (props) {
        super(props);
        this.fetchData 				= this.fetchData.bind(this);
        this.renderItem 			= this.renderItem.bind(this);
        this.renderSeparator 		= this.renderSeparator.bind(this);
        this.onEndReached 			= this.onEndReached.bind(this);
        this.renderFooter 			= this.renderFooter.bind(this);
        this.appendSectionData 		= this.appendSectionData.bind(this);
        this.formatDate 			= this.formatDate.bind(this);
        this.pullToRefresh 			= this.pullToRefresh.bind(this);
    }

	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
		this.fetchData();
	}

	/**
	 * 下拉刷新
	 */
	pullToRefresh () {
		this.datas = [];

		this.setState({
			_pullToRefreshing: true,
			start: 1,
			noMoreData: false,
			loading: true,

		}, () => {
			this.fetchData();
		});
	}

	async fetchData () {
		this.showLoading();
		this.setState({
			fetchForbidden: false,
			_infiniteLoading: false,//控制无限加载
		});
		try {
			let FIND_URL = 'shop/index.php?act=interface_app&op=morder&curpage=';
			let responseData = await this.request(Global._host_store + FIND_URL +this.state.start, {
				method: 'GET'
			});
			this.hideLoading();
			this.appendSectionData(responseData.root.Items);
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(this.datas),
				_pullToRefreshing: false,
				noMoreData: this.state.start * 10 >= responseData.root.totnum ? true : false,
			});
		} catch(e) {
			this.hideLoading();
			this.handleRequestException(e);
		}
	}

	//时间戳转化成时间正确格式
	formatDate (time) {
		var time=parseInt(time);//转为整形
		time= new Date(time*1000);
		var year=time.getFullYear();     
        var month1=time.getMonth()+1;     
        var date1=time.getDate();     
        var hour1=time.getHours();     
        var minute1=time.getMinutes();     
        var month=this.add0(month1);
        var date=this.add0(date1); 
        var hour=this.add0(hour1);
        var minute=this.add0(minute1);
        return year+"-"+month+"-"+date+"   "+hour+":"+minute;

	}
	add0(m){
		return m<10?'0'+m:m 
	}

	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		return (
			<View style = {Global._styles.CONTAINER} >
				{this._getNavBar()}
				
				<View style = {styles.scrollView} >
					<ListView
						key = {this.data}
				        dataSource = {this.state.dataSource}
				        renderRow = {this.renderItem}
				        renderSeparator = {this.renderSeparator}
				        renderFooter = {this.renderFooter}
				        onEndReached = {this.onEndReached}
				        onEndReachedThreshold = {10}
				        refreshControl = {
							<RefreshControl
								refreshing={this.state._pullToRefreshing}
								onRefresh = {this.pullToRefresh} />}
				        enableEmptySections = {true} />
				</View>
			</View>
		);
	}

	renderItem (item, sectionID, rowID, highlightRow) {

		return (
			<View style = {{backgroundColor:'#fff', padding: 16}}>
				<View style = {{flexDirection: 'row',}}>
					<Text style = {{flex:1, fontSize: Global.FontSize.BASE, color:Global.Color.DARK_GRAY}}>{item.order_sn}</Text>
					<Text style = {{fontSize: Global.FontSize.BASE, color:Global.Color.DARK_GRAY}}>- {item.order_amount}</Text>
				</View> 
				<View>
					<Text style = {{marginTop:7, fontSize: Global.FontSize.SMALL, color:Global.Color.GRAY}}>{this.formatDate(item.finnshed_time)}</Text>
				</View>

			</View>
		);
	}

	/**
	 * 无限加载
	 */
	onEndReached () {
		if(this.state.noMoreData || this.state._pullToRefreshing)
			return;
		
		this.setState({
			start: this.state.start + 1,
			_infiniteLoading: true,
		}, () => {
			this.fetchData();
		});
	}

	/**
	 * 将新查询到的数据追加到sectionData中
	 */
	appendSectionData (data) {
		if(!data || data.length==0) {
			return;
		}
		data.forEach((item) => {
			this.datas.push(item);
		});
	}

	/**
	 * 渲染列表表尾
	 * 如果无限加载被触发，则显示loading，如果没有更多数据，则显示相关提示信息
	 */
	renderFooter () {
		if(this.state.noMoreData)
			return (
				<View style={[Global._styles.CENTER, styles.footer]} >
					<Text style={styles.footerText} >全部账单信息加载完成</Text>
				</View>
			);
	}

	/**
	 * 渲染行分割线
	 */
	renderSeparator (sectionId, rowId) {
		return <View key={'sep_' + rowId} style={[styles.fullLine,{margin:0}]} />;
	}

	_renderPlaceholderView () {
		return (
			<View style = {Global._styles.CONTAINER}>
			    {this._getNavBar()}
			</View>
		);
	}

	_getNavBar () {
		return (
			<NavBar title = '账单' 
		    	navigator = {this.props.navigator} 
				route = {this.props.route}
		    	hideBackButton = {false} 
		    	hideBottomLine = {false} />
		);
	}

}

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
		// marginTop: 10,
	},
	fullLine: {
		backgroundColor: Global.Color.LIGHTER_GRAY, 
        height: 1/PixelRatio.get(),
	},
	footer: {
		height: 50,
	},
	footerText: {
		color: Global.Color.FONT_LIGHT_GRAY1,
		fontSize: 13,
	},
});

export default BillList;



