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
} from 'react-native';

import * as Global 		from '../Global';
import * as Filters 	from '../utils/Filters';
import NavBar			from 'rn-easy-navbar';

const FIND_URL 	= 'els/paybatchinfo/perpaylist/';

class PayStub extends Component {

	data 	= [];
	item 	= null;
	rowID 	= null;

    static displayName = 'PayStub';
    static description = '工资明细';

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
		dataSource: new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,
		}),
		loaded: false,
		isRefreshing: false,
	};

    constructor (props) {
        super(props);

        this.refresh 		= this.refresh.bind(this);
        this.pullToRefresh 	= this.pullToRefresh.bind(this);
        this.search 		= this.search.bind(this);
        this.fetchData 		= this.fetchData.bind(this);
        this.renderItem 	= this.renderItem.bind(this);
    }

	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
			this.fetchData();
		});
	}

	/**
	* 调用刷新
	*/
	refresh () {
		this.fetchData();
	}

	/**
	 * 下拉刷新
	 */
	pullToRefresh () {
		this.setState({isRefreshing: true});
		this.fetchData();
	}

	/**
	 * 查询
	 */
	search () {
		this.fetchData();
	}

	/**
	 * 异步加载数据
	 */
	async fetchData () {
		this.showLoading();
		this.setState({
			loaded: false,
			fetchForbidden: false,
		});
		try {
			// let responseData = await this.request(Global._host + FIND_URL, 
			let responseData = await this.request("http://10.12.253.44:8080/els/stubtemplate/detail/"+this.props.payStubInfo.templateId, {
				method : "GET"
			});
			

			this.hideLoading();
			this.data = responseData.result;
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(responseData.result),
				isRefreshing: false,
				loaded: true,
			});
		} catch(e) {
			this.hideLoading();
			this.setState({
				isRefreshing: false,
			});
			if(e.status == 401 || e.status == 403)
				this.setState({fetchForbidden: true});
			this.handleRequestException(e);
		}
	}

    onPressDetail (item) {
		console.log('month:' + item.month);
	}

	render () {
		var listView = null;
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		var refreshText = this.state.fetchForbidden === true ? 
			'您还未登录，登录后点击此处刷新数据' : 
			'暂无符合条件的数据，点击此处重新载入';

		/*var refreshView = (this.state.loaded || this.state.fetchForbidden) && this.data.length === 0 ?
			this.props.getListRefreshView(refreshText, this.refresh) : 
			null;*/

		var SIStyleIOS = Global._os === 'ios' ? Global._styles.TOOL_BAR.SEARCH_INPUT_IOS : {};

		return (

			<View style = {Global._styles.CONTAINER}>
				{this._getNavBar()}

				<ScrollView 
					automaticallyAdjustContentInsets = {false} 
					style = {styles.sv} >

					<View style = {Global._styles.PLACEHOLDER20} />
					{/*refreshView*/}
					<ListView
						key = {this.data}
				        dataSource = {this.state.dataSource}
				        renderRow = {this.renderItem}
				        style = {[styles.list]} />
			        <View style = {Global._styles.PLACEHOLDER20} />	
					<View style={{alignItems: 'flex-end', marginTop: 10, }}>
						<Text style={[styles.itemTitle]}>实发:{Filters.filterMoney(this.props.payStubInfo.payAmt, 2)}</Text>
	            	</View>

					<View style = {Global._styles.PLACEHOLDER20} />

			    </ScrollView>
		    </View>
		);
	}

	renderItem (item, sectionID, rowID, highlightRow) {
            
        var topLine = rowID === '0' ? <View style = {Global._styles.FULL_SEP_LINE} /> : null;
        var bottomLine = (<View style = {Global._styles.FULL_SEP_LINE} />);
        let itemValue = this.props.payStubInfo["item"+item.seqNo];

        if(rowID < this.data.length-1){
	        return (
				<View>
					{topLine}
					<View style = {[styles.item]} >
						<View style={{flex: 3, alignItems: 'center', }}>
							<Text style={[styles.itemTitle]}>{item.item}:</Text>
		            	</View>
						<View style={{flex: 2, alignItems: 'center', }}>
			            	<Text style={[styles.itemAmt]}>{Filters.filterMoney(itemValue, 2)}</Text>
		            	</View>
						
					</View>
					{bottomLine}
				</View>
			);
        } else {
        	 return (

				<View  />
			
			);
        }

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
			<NavBar 
				title =  {'工资明细'} 
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
        padding: 10,
        paddingLeft: 0,
        paddingRight: 20,
	},
	itemTitle:{
		width: 120, 
		fontSize: 15,
		marginLeft: 20, 
	},
	itemTime: {
		flex: 1,
		fontSize: 13,
	},
	itemAmt:{
		flex: 1,
		fontSize: 13,
	},
});

export default PayStub;

