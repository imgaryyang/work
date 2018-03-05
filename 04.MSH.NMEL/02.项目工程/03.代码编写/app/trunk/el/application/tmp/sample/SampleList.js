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

import * as Global 	from '../../Global';
import SearchInput 	from '../../lib/SearchInput';
import NavBar 		from 'rn-easy-navbar';

import SampleEdit 	from './SampleEdit';

const FIND_URL 	= 'samperson/find';
const DEL_URL 	= 'samperson/destory';

class SampleList extends Component {

	data 	= [];
	item 	= null;
	rowID 	= null;

    static displayName = 'SampleList';
    static description = '列表样例';

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
		showDelBtn: false,
		delBtnLeftPos: new Animated.Value(-60),
		cond: null,
		isRefreshing: false,
	};

    constructor (props) {
        super(props);

        this.refresh 		= this.refresh.bind(this);
        this.pullToRefresh 	= this.pullToRefresh.bind(this);
        this.search 		= this.search.bind(this);
        this.fetchData 		= this.fetchData.bind(this);
        this.doEdit 		= this.doEdit.bind(this);
        this.showDelBtn 	= this.showDelBtn.bind(this);
        this.hideDelBtn 	= this.hideDelBtn.bind(this);
        this.controlDelBtn 	= this.controlDelBtn.bind(this);
        this.confirmDelete 	= this.confirmDelete.bind(this);
        this.deleteItem 	= this.deleteItem.bind(this);
        this.renderItem 	= this.renderItem.bind(this);
        this._getToolBar 	= this._getToolBar.bind(this);
    }

	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
			this.fetchData();
		});
	}

	/*getInitialState: function() {
		var ds = new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,
		});
		return {
			doRenderScene: false,
			dataSource: ds.cloneWithRows(this._genRows({})),
			loaded: false,
			showDelBtn: false,
			delBtnLeftPos: new Animated.Value(-60),
			cond: null,
			isRefreshing: false,
		};
	},*/

	/*_genRows: function(pressData: {[key: number]: boolean}): Array<string> {
		var dataBlob = [];
		return dataBlob;
	},*/

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

	search () {
		this.fetchData();
	}

	async fetchData () {
		//this.showLoading();
		this.setState({
			loaded: false,
			fetchForbidden: false,
		});
		try {
			let responseData = await this.request(Global._iSEB_host + FIND_URL, {
				body: JSON.stringify({
					cond: this.state.cond,
				})
			});
			this.hideLoading();
			this.data = responseData.body;
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(responseData.body),
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

    doEdit (id) {
        this.props.navigator.push({
            title: "表单样例",
            component: SampleEdit,
            passProps: {
            	id: id,
            	refresh: this.refresh,
            	backRoute: this.props.route,
            },
        });
    }

    showDelBtn () {
		Animated.timing(
	       	this.state.delBtnLeftPos,
	       	{
	       		toValue: 0,
	       		duration: 100,
	       	},
	    ).start();
    }

    hideDelBtn () {
		Animated.timing(
	       	this.state.delBtnLeftPos,
	       	{
	       		toValue: -60,
	       		duration: 100,
	       	},
	    ).start();
    }

    controlDelBtn () {
    	if(!this.state.showDelBtn) {
    		this.showDelBtn();
    	} else {
    		this.hideDelBtn();
    	}
    	this.setState({showDelBtn: !this.state.showDelBtn});
    }

    confirmDelete (item, rowID) {
    	this.item = item;
    	this.rowID = rowID;
    	Alert.alert(
            '提示',
            '您确定要删除此条记录吗？',
            [
            	{text: '取消', style: 'cancel'},
            	{text: '确定', onPress: () => this.deleteItem()},
            ]
        );
    }

    async deleteItem () {
    	this.showLoading();
		try {

			let responseData = await this.request(Global._iSEB_host + DEL_URL, {
				body: JSON.stringify({
					id: this.item.id,
				})
			});
			this.hideLoading();
			//从前端数组中删除该条数据
			this.data.splice(this.rowID, 1);
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(this.data),
			});
			this.controlDelBtn();
			this.toast('删除成功！');
		} catch(e) {
			this.handleRequestException(e);
		}
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
				{this._getToolBar()}
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

			    </ScrollView>
		    </View>
		);
	}

	renderItem (item, sectionID, rowID, highlightRow) {
            
        var topLine = rowID === '0' ? <View style = {Global._styles.FULL_SEP_LINE} /> : null;
        var bottomLine = (<View style = {Global._styles.FULL_SEP_LINE} />);

		return (
			<View >
				{topLine}
				<TouchableOpacity style = {[styles.item, Global._styles.CENTER, {left: this.state.delBtnLeftPos}]} onPress = {()=>{this.doEdit(item.id);}}>

					<TouchableOpacity style = {[styles.delInItem, Global._styles.CENTER]} onPress = {()=>{this.confirmDelete(item, rowID);}}>
						<Icon name = 'ios-remove-circle' size = {25} color = {Global._colors.IOS_RED} style = {[Global._styles.ICON]} />
					</TouchableOpacity>

					<Image style = {[styles.portrait, Global._styles.BORDER]}  source = {{uri: Global._iSEB_host + "images/person/portrait/" + item.portrait}} />

					<Text style = {{flex: 1, marginLeft: 10, fontSize: 15,}}>{item.name}</Text>

					<Icon name = 'ios-arrow-forward-outline' size = {18} color = {Global._colors.IOS_ARROW} style = {[Global._styles.ICON, {width: 40}]} />

				</TouchableOpacity>
				{bottomLine}
			</View>
		);
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
			<NavBar 
				title = '样例'
				navigator = {this.props.navigator} 
				route = {this.props.route} 
				hideBottomLine = {true} 
				rightButtons = {(
					<View style = {[Global._styles.NAV_BAR.BUTTON_CONTAINER, Global._styles.NAV_BAR.RIGHT_BUTTONS]}>
						<TouchableOpacity style = {[Global._styles.NAV_BAR.BUTTON]} onPress = {this.refresh}>
							<Text style = {{color: Global._colors.IOS_BLUE,}}>刷新</Text>
						</TouchableOpacity>
						<TouchableOpacity style = {[Global._styles.NAV_BAR.BUTTON]} onPress = {() => this.doEdit()}>
							<Text style = {{color: Global._colors.IOS_BLUE,}}>添加</Text>
						</TouchableOpacity>
					</View>
				)} 
			/>
		);
	}

	_getToolBar () {
		return (
			<View style = {[Global._styles.TOOL_BAR.FIXED_BAR]}>
				<TouchableOpacity style = {[Global._styles.CENTER, Global._styles.TOOL_BAR.BUTTON,]} onPress = {this.controlDelBtn}>
					<Icon style = {[Global._styles.ICON]} name = 'ios-remove-circle-outline' size = {25} color = {Global._colors.FONT_GRAY}/>
				</TouchableOpacity>

				<SearchInput 
					value = {this.state.cond} 
					onChangeText = {(value) => this.setState({cond: value})} />

				<TouchableOpacity style = {[Global._styles.CENTER, Global._styles.TOOL_BAR.BUTTON,]} onPress = {this.search}>
					<Text style = {{color: Global._colors.IOS_BLUE}}>查询</Text>
				</TouchableOpacity>
			</View>
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
		width: Global.getScreen().width + 60,
        flexDirection: 'row',
        padding: 10,
        paddingLeft: 0,
        paddingRight: 20,
	},
	delInItem: {
		width: 60,
		height: 40,
	},
	portrait: {
		width: 40,
		height: 40,
        borderRadius: 20,
        marginLeft: 20,
	},
});

export default SampleList;




