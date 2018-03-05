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
	RefreshControl,
	InteractionManager,
	ListView,
    Alert,
} from 'react-native';

import * as Global 	from '../../Global';
import SearchInput 	from '../../lib/SearchInput';
import UserStore    from '../../flux/UserStore';

import NavBar 		from 'rn-easy-navbar';
import Button       from 'rn-easy-button';
import EasyIcon     from 'rn-easy-icon';
import Card       	from 'rn-easy-card';

import PatientDetail from './PatientDetail';
import PatientEdit  from './PatientEdit';

const FIND_URL = 'elh/userPatient/my/list/';

class PatientsList extends Component {

	datas = [];

    static displayName = 'PatientsList';
    static description = '常用就诊人';

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
		user: UserStore.getUser(),
		_pullToRefreshing: false,//控制下拉刷新
		_refreshing: true,//控制刷新
		hasself: false,
	};

    constructor (props) {
        super(props);

        this.search 				= this.search.bind(this);
        this.fetchData 				= this.fetchData.bind(this);
        this.renderRow 				= this.renderRow.bind(this);
        this.renderSeparator 		= this.renderSeparator.bind(this);
        this.renderFooter 			= this.renderFooter.bind(this);
        this.onEndReached 			= this.onEndReached.bind(this);
        this.refreshDataSource 		= this.refreshDataSource.bind(this);
        this.renderListView 		= this.renderListView.bind(this);
        this.patient 				= this.patient.bind(this);
		this.fresh					= this.fresh.bind(this);
		this.getEV					= this.getEV.bind(this);
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
	 * 下拉刷新
	 */
	pullToRefresh () {
		this.setState({
			_pullToRefreshing: true,
		}, () => {
			this.fetchData();
		});
	}

	/**
	 * 刷新
	 */
	fresh () {
		this.setState({
			_refreshing: true,
		}, () => {
			this.fetchData();
		});
	}
	/**
	 * 异步加载列表数据
	 */
	async fetchData () {
		if(this.state.loading) return;
		this.setState({loading: true});

		let data = encodeURI(JSON.stringify({
					name: this.state.cond,
	                userId: this.state.user.id,
					// userId: '40281882554de9e101554deaa0590000',
	                status: '1',
				}));
		try {
			let responseData = await this.request(Global._host + FIND_URL 
					+ this.state.start+'/'+this.state.pageSize + '?data=' + data, {
	        	method:'GET',
			});
			this.appendSectionData(responseData.result);
			let flag=false;
			if(responseData.result){
				for(let self of responseData.result){
					if(self.relationshi==='自己'){
						flag=true;
						break;
					}
				}
			}
			this.setState({
				hasself: flag,
				firstFetchEnd: true,
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
	 * 将新查询到的数据追加到this.datas
	 */
	appendSectionData (data) {
		if(!data){
			return;
		}
		this.datas=[];
		data.forEach((item) => {
			this.datas.push(item);
		});
	}

	getEV() {
		return (
			!this.state._refreshing && !this.state._pullToRefreshing && !this.state._requestErr && this.datas.length == 0 ? (
				<Card fullWidth = {true} style = {{ paddingBottom: 20 }} >
					<Text style = {[Global._styles.MSG_TEXT, { marginTop: 30, marginBottom: 20 }]} >暂无常用就诊人</Text>
					<Button text = "添加就诊人" onPress = {this.patient('', '', true) } outline = {true} />
				</Card>
			) : null
		)
	}

	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();
		
		return (
			<View style = {Global._styles.CONTAINER} >
				{this._getNavBar()}
				{this.getLoadingView('正在载入常用就诊人列表...', this.fresh, {marginTop: 20})}
				{this.getEV}
				{this.state._refreshing ? null : <View style = {[Global._styles.TOOL_BAR.FIXED_BAR,{paddingLeft:5,}]}>
					<SearchInput 
						value = {this.state.cond} 
						onChangeText = {(value) => this.setState({cond: value})} />
					<TouchableOpacity style = {[Global._styles.CENTER, Global._styles.TOOL_BAR.BUTTON,]} onPress = {this.search}>
						<Text style = {{color: Global._colors.IOS_BLUE}}>查询</Text>
					</TouchableOpacity>
				</View>}

				<ListView
					automaticallyAdjustContentInsets = {false}	//此参数保证在IOS的Tabbar中顶端不出现与statusBar等高的空隙
					enableEmptySections = {true}
					dataSource = {this.state.dataSource}
					renderRow = {this.renderRow}
					renderSeparator = {this.renderSeparator}
					renderFooter = {this.state._refreshing ? null : this.renderFooter}
                    onEndReached = {this.onEndReached}
					scrollRenderAheadDistance = {20}
					initialListSize = {10}
					pageSize = {4}
					style = {[styles.list]}
					refreshControl = {
						<RefreshControl
							refreshing = {this.state._pullToRefreshing}
							onRefresh = {this.pullToRefresh.bind(this)}
						/>
					}
					/>
			{/*<View style = {[styles.item]} >
					<Button text = "+ 添加常用就诊人" theme = {Button.THEME.ORANGE} outline = {true} onPress={() => this.patient()} />
				</View>*/}
			</View>
		);
	}

	/**
	 * 渲染行数据
	 */
	renderRow (item, sectionId, rowId, highlightRow) {
		let cardText = (
				<View style={{flex:1,marginLeft:10,}}>
					<Text style = {styles.info}> 还未绑定卡</Text>
				</View>
			);
		if(item.cardCount!=null && item.cardCount!=0){
			cardText = (
				<View style={{flex:1,marginLeft:10,flexDirection: 'row'}}>
					<Text style = {styles.info}>已绑定 </Text>
					<Text style = {[styles.info,{color: '#ff6600'}]}>{item.cardCount}</Text>
					<Text style = {styles.info}> 张卡</Text>
				</View>
			);
		}
		return (
			<View style = {[styles.item]} >
				<TouchableOpacity style = {[styles.item, Global._styles.CENTER,{marginLeft:10,}]} onPress={() => this.patient(item, rowId, false) }>
					<Image resizeMode='cover' 
               			style={[styles.portrait]} 
                		source={require('../../res/images/me-portrait-dft.png')} />
					<View style={{flex:1,marginLeft:10,}}>
						<View style={{flexDirection: 'row',alignItems:'flex-end',}}>
							<Text style = {styles.name}>{item.name}</Text>
							<Text style = {styles.alias}>（{item.relationshi}）</Text>
						</View>
						<Text style = {styles.mobile}>{item.mobile}</Text>
					</View>
					{cardText}
					<EasyIcon name = 'angle-right' iconLib = 'fa'
						size = {35} color = {Global._colors.IOS_ARROW} />
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
	* 重新渲染数据 
	**/
	refreshDataSource () {
		this.setState ({
			start: 0,
		});
		this.datas = [];
		this.fetchData();
	}

	renderListView(rowId,item,action){
		if(action=="i"){
			this.datas.unshift(item); //新增一条记录 rowId=0
		}
		if(action=="u"){
			this.datas.splice(rowId, 1); //修改指定行
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(this.datas),
			});
		}
		if(action=="d"){
			this.datas.splice(rowId, 1); //删除指定行
		}
	}

	/**
	* 打开就诊人页面
	**/
	async patient (item, rowId) {
		if(item.id!=null && item.id!=""){
	        let FIND_URL = 'elh/userPatient/my/' + item.id;
			try {
				let responseData = await this.request(Global._host + FIND_URL , {
		        	method:'GET',
				});
	            if(responseData.success){
					this.props.navigator.push({
						component: PatientDetail, 
						hideNavBar: true, 
			            passProps: {
							hasself: this.state.hasself,
							freshlist: this.fresh,
			            	userPatient: responseData.result,
			            	refreshDataSource: this.refreshDataSource,
			    			renderListView: this.renderListView,
			            	patientItemRowId: rowId,
			            },
		        	});
	            }
			} catch(e) {
				this.handleRequestException(e);
			}
		}else{
			this.props.navigator.push({
				component: PatientEdit, 
				hideNavBar: true,
			    passProps: {
					addPatient: true,
					hasself: this.state.hasself,
					freshlist: this.fresh,
			    	refreshDataSource: this.refreshDataSource,
			    	renderListView: this.renderListView,
			        patientItemRowId: 0,
				},
			});
		}
	}

	/**
	 * 渲染导航栏
	 */
	_getNavBar () {
		return (
			<NavBar title = '常用就诊人' 
				hideBackText = {true} 
		    	navigator = {this.props.navigator} 
				route = {this.props.route}
		    	hideBackButton = {false} 
		    	hideBottomLine = {false} 
				rightButtons = {(
					<View style = {[Global._styles.NAV_BAR.BUTTON_CONTAINER, Global._styles.NAV_BAR.RIGHT_BUTTONS]}>
						<TouchableOpacity style = {[Global._styles.NAV_BAR.BUTTON]} onPress={() => this.patient('', '', true)}>
							<EasyIcon name = "ios-add" color = 'white' size = {25} />
						</TouchableOpacity>
					</View>
				)} />
		);
	}
}

const styles = StyleSheet.create({
	portrait: {
		width: 40,
		height: 40,
		borderRadius:20,
	},
	sv: {
		flex: 1,
	},
	list: {
		backgroundColor: '#ffffff',
	},
	item: {
		width: Global.getScreen().width,
        flexDirection: 'row',
        padding: 5,
        paddingLeft: 0,
        paddingRight: 20,
	},
	footer: {
		height: 50,
	},
	footerText: {
		color: Global._colors.FONT_LIGHT_GRAY1,
		fontSize: 13,
	},
	name: {
		color: '#ff6600',
		fontSize: 15,
	},
	alias: {
		color: '#999999',
		fontSize: 13,
	},
	mobile: {
		color: '#999999',
		marginTop: 3,
	},
	idno: {
		color: '#999999',
	},
	info: {
		fontSize: 13,
		color: '#aaaaaa',
	}
});

export default PatientsList;

