'use strict';

import React, {
    Component,
    PropTypes,
} from 'react';

import {
	StyleSheet,
	ScrollView,
	RefreshControl,
	View,
	Text,
	Image,
	TouchableOpacity,
	InteractionManager,
	ListView,
} from 'react-native';

import * as Global 		from '../../Global';
import UserStore    	from '../../flux/UserStore';

import NavBar 			from 'rn-easy-navbar';
import Card       		from 'rn-easy-card';
import Button       	from 'rn-easy-button';
import Separator    	from 'rn-easy-separator';
import Portrait     	from 'rn-easy-portrait';

import TreatDetail  	from './TreatmentDetail';
import RegisterResource from '../register/RegisterResource';

const FIND_URL 	= 'elh/treat/my/treatment/list';

class TreatList extends Component {

	datas 	= [];
	item 	= null;
	rowID 	= null;

    static displayName = 'TreatList';
    static description = '就诊记录';

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
		dataSource: new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,
		}),
		loading: false,
		cond: null,
		noMoreData: false,
		start: 0,
		pageSize: 10,
		total: 0,
		_refreshing: true,//控制刷新
		_pullToRefreshing: false,//控制下拉刷新
	};

    constructor (props) {
        super(props);

        this.refresh 			= this.refresh.bind(this);
        this.pullToRefresh 		= this.pullToRefresh.bind(this);
        this.fetchData 			= this.fetchData.bind(this);
        this.doDetail 			= this.doDetail.bind(this);
        this.renderItem 		= this.renderItem.bind(this);
        this.onEndReached 		= this.onEndReached.bind(this);
        this.renderFooter 		= this.renderFooter.bind(this);
        this.renderSeparator 	= this.renderSeparator.bind(this);
        this.goToRegister 		= this.goToRegister.bind(this);
        this.appendSectionData 	= this.appendSectionData.bind(this);
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
			//noMoreData: false,
		}, () => {
			this.fetchData();
		});
	}


	/**
	 * 去挂号
	 */
	goToRegister () {
		this.props.navigator.push({
			component: RegisterResource,
			hideNavBar: true,
		});
	}

	async fetchData () {
		this.showLoading();
		
		this.setState({
			loading: true
		});
		if(this.state._refreshing || this.state._pullToRefreshing){
				this.datas = [];
			}

		try {
			//var userId = UserStore.getUser().id;
			let responseData = await this.request(Global._host + FIND_URL, {
				method: 'GET'
			});
			this.data = responseData.result;
			this.appendSectionData(responseData.result);
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(this.datas),
				_pullToRefreshing: false,
				loading: false,
				start: responseData.start,
				total: responseData.total,
				noMoreData: responseData.start + responseData.pageSize >= responseData.total ? true : false,
			}); 
			console.log(responseData);
			this.hideLoading();
		} catch(e) {
			this.hideLoading();
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
		data.forEach((item) => {
			this.datas.push(item);
		});
	}

    doDetail (id, photo, hospLogo) {
        this.props.navigator.push({
            title: "就诊记录详情",
            component: TreatDetail,
            passProps: {
            	id: id,
            	photo: photo,
            	hospLogo: hospLogo,
            	refresh: this.refresh,
            	backRoute: this.props.route,
            },
            hideNavBar: true,
        });
    }    

	render () {
		var listView = null;
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();
		let emptyView = !this.state._refreshing && !this.state._pullToRefreshing && !this.state._requestErr && this.datas.length == 0 ? (
			<Card fullWidth = {true} style = {{paddingBottom: 20}} >
				<Text style = {[Global._styles.MSG_TEXT, {marginTop: 30, marginBottom: 20}]} >暂无就诊记录</Text>
				<Button text = "去挂号" onPress = {this.goToRegister} outline = {true} />
			</Card>
		) : null;

		var SIStyleIOS = Global._os === 'ios' ? Global._styles.TOOL_BAR.SEARCH_INPUT_IOS : {};
		return (
			<View style = {Global._styles.CONTAINER}>
				{this._getNavBar()}
				{this.getLoadingView('正在载入就诊信息...', this.refresh, {marginTop: 20})}
				{emptyView}
				<View style = {Global._styles.PLACEHOLDER10} />
				{/*<ScrollView 
									automaticallyAdjustContentInsets = {false} 
									keyboardShouldPersistTaps = {true}
									style = {styles.sv} >*/}

					{/*refreshView*/}
					<ListView
						key = {this.data}
				        dataSource = {this.state.dataSource}
				        renderRow = {this.renderItem}
						renderSectionHeader = {this.renderSectionHeader}
						renderSeparator = {this.renderSeparator}
						renderFooter = {this.renderFooter}
		                onEndReached = {this.onEndReached}
		                onEndReachedThreshold = {10}
		    			// scrollRenderAheadDistance = {0}
				     //    initialListSize = {10}
				     //    pageSize = {2}
				        style = {[styles.list]} 
				        refreshControl = {
							<RefreshControl
								refreshing = {this.state._pullToRefreshing}
								onRefresh = {this.pullToRefresh}/>
							}
				        enableEmptySections = {true} />

			    {/*</ScrollView>*/}
		    </View>
		);
	}

	renderItem (item, sectionID, rowID, highlightRow) {
            
        var placeHolder10 = parseInt(rowID) === this.state.total-1 ? null : 
        	(<View>
        		<View style = {Global._styles.PLACEHOLDER10} />
        		<View style = {Global._styles.FULL_SEP_LINE} />
        	</View>) ;
        let portrait = item.patient.photo ?  
					{uri: (Global._host + 'el/base/images/view/' + item.patient.photo)} : 
					require('../../res/images/me-portrait-dft.png');	
		return (
			<View>
				<TouchableOpacity onPress = {()=>{this.doDetail(item.id, item.patient.photo, item.hospital.sceneryThumb);}}>
					<Card fullWidth = {true} style = {{paddingBottom: 5}} >
						<View style = {[styles.itemRow]}>
							<View style = {{flex:1, marginLeft:25}}>
								<Portrait imageSource = {portrait} bgColor = {Global._colors.IOS_GRAY_BG} width = {30} height = {30} radius = {5} />
							</View>
							<Portrait imageSource = {{uri: (Global._host + 'el/base/images/view/' + item.hospital.sceneryThumb)}} width = {90} height = {35} />
							{/*<Text style = {{marginLeft: 5}} >{item.hospitalName}</Text>*/}
						</View>
						<View style = {[styles.itemRow]}>
							<Text style = {{flex: 1, marginLeft: 20, fontSize: 14,}}>{item.patientName}</Text>
						</View>
						<View style = {Global._styles.SEP_LINE} />
						{/*<Icon name = 'ios-arrow-forward-outline' size = {18} color = {Global._colors.IOS_ARROW} style = {[Global._styles.ICON, {width: 40}]} />*/}
						<View style = {[styles.itemRow]}>
							<View style = {{flex: 3}}>
								<Text style = {{flex: 1, marginLeft: 10, fontSize: 14,}}>{item.departmentName}</Text>

							</View>
							{/*<View style = {styles.FULL_VER_LINE} />*/}
							<View style = {{flex: 7}}>
								<View style = {[styles.itemRow,]}>
									<Text style = {[styles.itemRowText1]}>主治医生：</Text>
									<Text style = {[styles.itemRowText2]}>{item.doctorName}</Text>
								</View>
								<View style = {[styles.itemRow]}>
									<Text style = {[styles.itemRowText1]}>就诊时间：</Text>
									<Text style = {[styles.itemRowText2]}>{item.createTime}</Text>
								</View>
								<View style = {[styles.itemRow,]}>
									<Text style = {[styles.itemRowText1]}>诊断结果：</Text>
									<Text style = {[styles.itemRowText2, {color: Global._colors.IOS_RED}]}>{item.medcialResult}</Text>
								</View>
							</View>
						</View>
					</Card>
				</TouchableOpacity>
			</View>
		);
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
				title = '就诊记录'
				navigator = {this.props.navigator} 
				route = {this.props.route} 
				hideBottomLine = {true} />
		);
	}

	/**
	 * 无限加载
	 */
	onEndReached () {
		if(this.state.noMoreData || this.state._pullToRefreshing || this.state._refreshing || this.state.loading)
			return;
		
		this.setState({
			start: this.state.start + this.state.pageSize
		}, () => {
			this.fetchData();
		});
	}

	/**
	 * 渲染行分割线
	 */
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
        let footerText = !this.state.loading && !this.state._refreshing && !this.state._pullToRefreshing && this.state.noMoreData 
        	? '数据载入完成' : '载入数据……';
		return (
			<View style={[Global._styles.CENTER, styles.footer]} >
				<Text style={styles.footerText} >{footerText}</Text>
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
		width: Global.getScreen().width,
        //flexDirection: 'row',
        padding: 10,
        paddingLeft: 0,
        paddingRight: 20,
	},
	itemRow: {
		flexDirection: 'row',
	},
	itemRowText1: {
		//marginLeft: 10,
		fontSize: 14, 
		color: Global._colors.FONT
	},
	itemRowText2: {
		//marginLeft: 5, 
		fontSize: 14,
	},
	portrait: {
		width: 40,
		height: 40,
        borderRadius: 20,
        marginLeft: 20,
	},
	FULL_VER_LINE: {
        width: 1/Global._pixelRatio,
        backgroundColor: Global._colors.IOS_RED, //IOS_SEP_LINE, 
        height: 70, 
    },
    footer: {
		height: 50,
	},
	footerText: {
		color: Global._colors.FONT_LIGHT_GRAY1,
		fontSize: 13,
	},
});

export default TreatList;

