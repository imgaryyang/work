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

import * as Global  		from '../../Global';
import UserStore			from '../../flux/UserStore';
import AuthAction   		from '../../flux/AuthAction';

import NavBar       		from 'rn-easy-navbar';
import Card       			from 'rn-easy-card';
import Button       		from 'rn-easy-button';
import EasyIcon     		from 'rn-easy-icon';
import Separator    		from 'rn-easy-separator';
import Portrait     		from 'rn-easy-portrait';
import {B, I, U, S} 		from 'rn-easy-text';

import OutpatientGuidance 	from './OutpatientGuidance';
import RegisterResource 	from '../register/RegisterResource';

const FETCH_URL = 'elh/treat/my/treatment/unclose/list/';

class OutpatientGuidanceList extends Component {

    static displayName = 'OutpatientGuidanceList';
    static description = '门诊导诊列表';

    _data = [];
    _dataKey = [];

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
		user: UserStore.getUser(),
		dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
		_refreshing: true,//控制刷新
		_pullToRefreshing: false,//控制下拉刷新
	};

    constructor (props) {
        super(props);

        this.refresh 			= this.refresh.bind(this);
        this.pullToRefresh 		= this.pullToRefresh.bind(this);
        this.fetchData 			= this.fetchData.bind(this);
        this.buildData 			= this.buildData.bind(this);
        this.renderRow 			= this.renderRow.bind(this);
        this.renderSeparator 	= this.renderSeparator.bind(this);
        this.showGuidance 		= this.showGuidance.bind(this);
        this.goToRegister 		= this.goToRegister.bind(this);
        this.goLogin 			= this.goLogin.bind(this);
        this.onUserStoreChange	= this.onUserStoreChange.bind(this);
    }

	componentDidMount () {
		//监听UserStore
		this.onUserStoreChange = UserStore.listen(this.onUserStoreChange);

		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
		this.fetchData();
	}

	/**
	 * 监听UserStore变化
	 */
	onUserStoreChange () {
		this.setState({
			user: UserStore.getUser(),
		}, () => {
			this.refresh();
		});
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
	 * 获取数据
	 */
	async fetchData () {
		try {
			if(!this.state.user || this.state.user.id == "" ){//登录用户为null时，清空数据
				this._data = [];

				this.setState({
					dataSource: this.state.dataSource.cloneWithRows(this._data),
					_refreshing: false,//控制刷新
					_pullToRefreshing: false,//控制下拉刷新
				});

				return;
			}

			let treatData = await this.request(Global._host + FETCH_URL, {
				method:'GET',
			});
			//console.log(treatData);
			if(treatData.result) {
				this.buildData(treatData.result);
				this.setState({
					dataSource: this.state.dataSource.cloneWithRows(this._data),
				})
			}

		} catch(e) {
			this.handleRequestException(e);
		}
	}

	/**
	 * 按照医院及就诊人分类组合数据
	 */
	buildData (data) {
		var item, key, idx, tmpData;
		this._dataKey = [];
		this._data = [];
		for (var i = 0 ; i < data.length ; i++) {
			item = data[i];
			key = item.hospitalId + '_' + item.patientId + '_' + item.cardNo;
			tmpData = {
				appUser: item.appUser,
				hospital: item.hospital,
				hospitalId: item.hospitalId,
				hospitalName: item.hospitalName,
				patient: item.patient,
				patientHlht: item.patientHlht,
				patientId: item.patientId,
				patientName: item.patientName, 
				cardNo: item.cardNo,
				cardType: item.cardType,
				cardTypeName: item.cardTypeName,
				treats: [{
					id: item.id,
					idHlht: item.idHlht,
					type: item.type,
					department: item.department,
					departmentId: item.departmentId,
					departmentName: item.departmentName,
					doctor: item.doctor,
					doctorId: item.doctorId,
					doctorName: item.doctorName,
					medcialResult: item.medcialResult,
					notification: item.notification,
					status: item.status,
					startTime: item.startTime,
					createTime: item.createTime,
					updateTime: item.updateTime,
				}]
			}
			idx = this._dataKey.indexOf(key);
			if(idx == -1) {	//如果{医院+就诊人}不存在
				this._dataKey.push(key);
				this._data.push(tmpData);
			} else {
				this._data[idx].treats.push(tmpData.treats[0]);
			}
		}
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

	/**
	 * 导向导诊界面
	 * @param  {[object]} row  [description]
	 * @param  {[object]} item [description]
	 * @return {[]}      [description]
	 */
	showGuidance (row, item) {
		this.props.navigator.push({
			component: OutpatientGuidance,
			hideNavBar: true,
			passProps: {
				row: row,
				item: item,
				refresh: this.refresh,
			}
		})
	}

	renderRow (row, sectionID, rowID, highlightRow) {
		//console.log(row);

		let treats = row.treats.map((item, idx) => {
			let bb = idx == 0 ? null : {
				borderTopWidth: 1 / Global._pixelRatio,
				borderTopColor: Global._colors.IOS_SEP_LINE,
			};
			return (
				<TouchableOpacity key = {item.doctorId + idx} style = {[{flexDirection: 'row'}, Global._styles.CENTER, bb]} onPress = {() => this.showGuidance(row, item)} >
					<Text style = {styles.deptName} >{item.departmentName}</Text>
					<View style = {styles.treatBrief} >
						<Text style = {styles.doc} ><B>主诊医生：</B>{item.doctorName}{item.doctorTitle ? " [ " + item.doctorTitle + " ]" : ""}</Text>
						<View style = {[styles.notificationHolder, Global._styles.CENTER]} >
							<EasyIcon name = "md-arrow-dropright-circle" size = {15} color = {Global._colors.IOS_BLUE} />
							<Text style = {styles.notification} >{item.notification}</Text>
						</View>
						<View style = {[styles.addrHolder, Global._styles.CENTER]} >
							<EasyIcon name = "ios-pin" size = {13} color = {Global._colors.FONT_LIGHT_GRAY1} />
							<Text style = {styles.addr} >{item.department.address}</Text>
						</View>
					</View>
					<EasyIcon name = "ios-arrow-forward" color = {Global._colors.FONT_LIGHT_GRAY1} size = {20} width = {25} height = {25} />
				</TouchableOpacity>
			);
		});
		
		let portrait = row.patient.photo ? 
			{uri: (Global._host + 'el/base/images/view/' + row.patient.photo)} : 
			require('../../res/images/me-portrait-dft.png');
		return (
			<Card key = {rowID} radius = {6} style = {styles.item} >
				<View style = {[styles.hospHolder, Global._styles.CENTER]} >
					<Portrait imageSource = {require('../../res/images/hosp/logo01.png')} width = {26} height = {26} />
					<Text style = {{marginLeft: 15, flex: 1}} >{row.hospitalName}</Text>
				</View>
				<Separator style = {Global._styles.FULL_SEP_LINE} />
				<View style = {[styles.patientHolder, Global._styles.CENTER]} >
					<Portrait imageSource = {portrait} bgColor = {Global._colors.IOS_GRAY_BG} width = {30} height = {30} radius = {5} />
					<Text style = {styles.patientName} >{row.patientName}</Text>
					<View style = {styles.cardHolder} >
						<Text style = {styles.cardTypeName} >{row.cardTypeName}</Text>
						<Text style = {styles.cardNo} >{row.cardNo}</Text>
					</View>
				</View>
				<Separator style = {Global._styles.FULL_SEP_LINE} />
				{treats}
			</Card>
		);
	}

	renderSeparator (sectionID, rowID, adjacentRowHighlighted) {
		return (
			<Separator key = {rowID} height = {10} />
		)
	}

	goLogin() {
		//TODO:需要登录时调用登录
		AuthAction.clearContinuePush();
		AuthAction.needLogin();
    }

	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		let loginView = !this.state.user || this.state.user.id == "" ? (
			<Card radius = {6} style = {{paddingBottom: 20, margin: 8, marginTop: 16}} >
				<Text style = {[Global._styles.MSG_TEXT, {marginTop: 30, marginBottom: 20}]} >您还未登录，登录后方能查看导诊信息</Text>
				<Button text = "登录" onPress = {this.goLogin} />
			</Card>
		) : null;

		/*let emptyView = this.state.user && !this.state._refreshing && !this.state._pullToRefreshing && !this.state._requestErr && this._data.length == 0 ? (
			<Card radius = {6} style = {{paddingBottom: 20, margin: 8, marginTop: 16}} >
				<Text style = {[Global._styles.MSG_TEXT, {marginTop: 30, marginBottom: 20}]} >暂无未完成的就诊记录</Text>
				<Button text = "去挂号" onPress = {this.goToRegister} outline = {true} />
			</Card>
		) : null;*/

		let listMarginBottom = Global._os == 'ios' && this.props.inTab ? 48 : 0;

		return (
			<View style = {Global._styles.CONTAINER} >
				{this._getNavBar()}
				{this.getLoadingView('正在载入导诊信息...', this.refresh, {marginTop: 20})}
				{loginView}

				{this.getEmptyView({
					condition: (this.state.user != null && this.state.user.id != "" && this._data.length == 0),
					msg: '暂无未完成的就诊记录',
					reloadCallback: this.refresh,
					buttons: <Button text = "去挂号" onPress = {this.goToRegister} style = {{marginBottom: 15}} />,
				})}

				<ListView 
					automaticallyAdjustContentInsets = {false}
					dataSource = {this.state.dataSource}
					renderRow = {this.renderRow}
					renderSeparator = {this.renderSeparator}
					style = {[styles.list, {marginBottom: listMarginBottom}]}
					enableEmptySections = {true}
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

	_renderPlaceholderView () {
		return (
			<View style = {Global._styles.CONTAINER}>
			    {this._getNavBar()}
			</View>
		);
	}

	_getNavBar () {
		return (
			<NavBar title = '门诊导诊' 
		    	navigator = {this.props.navigator} 
				route = {this.props.route}
		    	hideBackButton = {this.props.hideBackButton === false ? this.props.hideBackButton : true} 
		    	hideBottomLine = {false} 
		    	rightButtons = {(
					<View style = {[Global._styles.NAV_BAR.BUTTON_CONTAINER, Global._styles.NAV_BAR.RIGHT_BUTTONS]} >
						<Button onPress = {this.refresh} stretch = {false} clear = {true} style = {Global._styles.NAV_BAR.BUTTON} >
							<EasyIcon name = "ios-refresh-outline" color = 'white' size = {25} />
						</Button>
		    		</View>
		    	)}
		    />
		);
	}

}

const styles = StyleSheet.create({
	list: {
		flex: 1,
		marginLeft: 16,
		marginRight: 16,
		paddingTop: 10,
		//top: - 1 / Global._pixelRatio,
	},
	sepInCard: {
		height: 1 / Global._pixelRatio, 
		backgroundColor: Global._colors.IOS_SEP_LINE, 
		left: -15,
		width: Global.getScreen().width,
	},

	item: {
		paddingLeft: 0, 
		paddingRight: 0, 
		paddingTop: 0, 
		paddingBottom: 0,
		marginTop: 5,
	},
	hospHolder: {
		flexDirection: 'row', 
		padding: 15
	},
	patientHolder: {
		flexDirection: 'row', 
		padding: 15
	},
	patientName: {
		flex: .6, 
		marginLeft: 15
	},
	cardHolder: {
		flex: 1.2, 
		alignItems: 'flex-end'
	},
	cardTypeName: {
		fontSize: 10, 
		color: Global._colors.FONT_LIGHT_GRAY
	},
	cardNo: {
		fontSize: 12, 
		color: Global._colors.FONT_GRAY, 
		marginTop: 4
	},

	deptName: {
		width: 60, 
		fontSize: 13, 
		fontWeight: '500', 
		color: Global._colors.FONT_GRAY, 
		textAlign: 'center', 
		margin: 15
	},
	treatBrief: {
		flex: 1, 
		borderLeftWidth: 1 / Global._pixelRatio, 
		borderLeftColor: Global._colors.IOS_SEP_LINE, 
		padding: 5, 
		paddingTop: 10, 
		paddingBottom: 10
	},
	doc: {
		fontSize: 14, 
		marginLeft: 3, 
		color: Global._colors.FONT_GRAY
	},
	notificationHolder: {
		flexDirection: 'row', 
		marginTop: 10
	},
	notification: {
		flex: 1, 
		fontSize: 14, 
		color: Global._colors.IOS_BLUE, 
		marginLeft: 5
	},
	addrHolder: {
		flex: 1, 
		flexDirection: 'row', 
		marginTop: 10, 
		borderTopColor: Global._colors.IOS_SEP_LINE, 
		borderTopWidth: 0 / Global._pixelRatio
	},
	addr: {
		flex: 1, 
		fontSize: 12, 
		color: Global._colors.FONT_GRAY
	},
});

export default OutpatientGuidanceList;



