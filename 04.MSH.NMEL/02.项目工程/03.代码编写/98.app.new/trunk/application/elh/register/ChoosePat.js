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
	RefreshControl,
} from 'react-native';

import * as Global 	from '../../Global';
import UserStore    from '../../flux/UserStore';

import NavBar		from 'rn-easy-navbar';
// import EasyIcon		from 'rn-easy-icon';
import Card       	from 'rn-easy-card';
import Portrait     from 'rn-easy-portrait';

import PatCardList  from './PatCardList';
import AddCard 		from '../patients/AddCard';

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
		pageSize: 100,
		total: 0,
		totalPage: 0,
		cond: null,
		noMoreData: false,
		loading: false,
		user: UserStore.getUser(),
		responseCardData: [],
		cardArray: [],
		_refreshing: true,//控制刷新
		_pullToRefreshing: false,//控制下拉刷新
	};

    constructor (props) {
        super(props);
        this.search 				= this.search.bind(this);
        this.fetchData 				= this.fetchData.bind(this);
        this.renderRow 				= this.renderRow.bind(this);
        this.renderSeparator 		= this.renderSeparator.bind(this);
        this.renderFooter 			= this.renderFooter.bind(this);
        this.onEndReached 			= this.onEndReached.bind(this);
        this.cardList				= this.cardList.bind(this);
        this.refresh 				= this.refresh.bind(this);
        this.pullToRefresh 			= this.pullToRefresh.bind(this);
        this.addCard 				= this.addCard.bind(this);
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
	 * 刷新
	 */
	refresh () {
		this.setState({
			_refreshing: true,
		}, () => {
			this.fetchData();
		});
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
	 * 异步加载列表数据
	 */
	async fetchData () {
        let FIND_URL = 'elh/userPatient/my/list/'+this.state.start+'/'+this.state.pageSize;
		if(this.state.loading) return;
		this.setState({loading: true});
		if(this.state._refreshing || this.state._pullToRefreshing){
				this.datas = [];
			}
		this.showLoading();
		let data =  encodeURI(JSON.stringify({
					name: this.state.cond,
	                userId: this.state.user.id,
	                status: '1',
				}));
		try {
			let responseData = await this.request(Global._host + FIND_URL + '?data=' + data, {
	        	method:'GET',
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

			this.hideLoading();
		} catch(e) {
			this.hideLoading();
			this.handleRequestException(e);
		}
	}

	/**
	*加载常用就诊人的卡列表
	*/
	async cardList (id, name, cardCount) {
		if(cardCount){
			this.props.navigator.push({
	            title: "就诊卡列表",
	            component: PatCardList,
	            passProps: {
	            	id: id,
	            	parentName: name,
	            	regInfo: this.props.regInfo,
	            	refresh: this.refresh,
	            	backRoute: this.props.backRoute,
	            },
	            hideNavBar: true,
        	});
		}else{
			this.toast('请先给常用就诊人绑卡！');
		}
	}

	addCard () {
		this.props.navigator.push({
            title: "绑卡",
            component: AddCard,
            hideNavBar: true,
    	});
	}

	/**
	 * 将新查询到的数据追加到sectionData中this.sectionData, this.rowIds
	 */
	appendSectionData (data) {
		if(!data){
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
				<ScrollView>
					<Card radius = {6} style = {styles.card}>
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
					        refreshControl = {
								<RefreshControl
									refreshing = {this.state._pullToRefreshing}
									onRefresh = {this.pullToRefresh}/>
							}
					        style = {[styles.list]} 
					    />
						{/*<View style = {[styles.item]} >
							<Button text = "+ 添加常用就诊人" theme = {Button.THEME.ORANGE} outline = {true} onPress={() => this.patient()} />
						</View>*/}
					</Card>
				</ScrollView>
			</View>
		);
	}

	/**
	 * 渲染行数据
	 */
	renderRow (item, sectionId, rowId, highlightRow) {
		let cardText = (
				<View style={{marginLeft:10,}}>
					<Text style = {styles.info}> 还未绑定卡</Text>
				</View>
			);
		if(item.cardCount!=null && item.cardCount!=0) {
			cardText = (
				<View style={{flexDirection: 'row'}} >
					<Text style = {styles.info}>已绑定 </Text>
					<Text style = {[styles.info,{color: '#ff6600'}]}>{item.cardCount}</Text>
					<Text style = {styles.info}> 张卡</Text>
					{/*<Button theme = {Button.THEME.ORANGE} outline = {true} stretch = {false} style = {{width: 50, height: 25, marginLeft: 10}} onPress = {() => this.cardList(item.patientId, item.name, item.cardCount)} >
						<Text style = {{fontSize: 12, color: Global._colors.ORANGE}} >去挂号</Text>
					</Button>*/}
				</View>
			);
		}
		let portrait = item.photo ? 
			{uri: (Global._host + 'el/base/images/view/' + item.photo)} : 
			require('../../res/images/me-portrait-dft.png');

		return (
			<TouchableOpacity style = {[Global._styles.CENTER, {flexDirection: 'row', padding: 15}]} onPress={() => this.cardList(item.patientId, item.name, item.cardCount) }>
				<Portrait imageSource = {portrait} bgColor = {Global._colors.IOS_GRAY_BG} width = {40} height = {40} radius = {20} />
				<View style={{flex:1, marginLeft: 10}}>
					<View style={{flexDirection: 'row'}}>
						<Text style = {styles.name}>{item.name}</Text>
						<Text style = {styles.alias}>（{item.relationshi}）</Text>
					</View>
					<Text style = {styles.mobile}>{item.mobile}</Text>
				</View>
				{cardText}
				<EasyIcon iconLib = 'fa' name = 'angle-right' size = {20} width = {30} height = {30} color = {Global._colors.IOS_ARROW} />
			</TouchableOpacity>
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
  //       var footerText = this.state.noMoreData ? '数据载入完成' : '正在载入数据……';
		// return (
		// 	<View style={[Global._styles.CENTER, styles.footer]} >
		// 		<Text style={styles.footerText} >{footerText}</Text>
		// 	</View>
		// );
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
	 * 渲染导航栏
	 */
	_getNavBar () {
		return (
			<NavBar title = '选择常用就诊人' 
				hideBackText = {true} 
		    	navigator = {this.props.navigator} 
				route = {this.props.route}
		    	hideBackButton = {false} 
		    	hideBottomLine = {false} />
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
	},
	item: {
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
		color: Global._colors.FONT_GRAY,
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
	},
	card: {
		paddingLeft: 0, 
		paddingRight: 0, 
		paddingTop: 0, 
		paddingBottom: 0,
		margin: 8,
		marginTop: 16,
	},
});

export default PatientsList;

