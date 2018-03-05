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
    ListView,
    TouchableOpacity,
    StyleSheet,
	InteractionManager,
} from 'react-native';

import * as Global		from '../../Global';
import NavBar			from 'rn-easy-navbar';
import EasyIcon			from 'rn-easy-icon';
import Button			from 'rn-easy-button';
import Portrait     	from 'rn-easy-portrait';
import Card       		from 'rn-easy-card';
import Separator    	from 'rn-easy-separator';

import ComChkReport		from '../check/CommonCheckReport';

const FIND_URL 	= 'elh/treat/my/treatment/';

class TreatDetail extends Component {

    static displayName = 'TreatDetail';
    static description = '就诊记录详情';

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
		patientName: '',
		departmentName: '',
		doctorName: '',
		createTime: '',
		medcialResult: '',
		chkDataSource: new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,
		}),
		medDataSource: new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,
		}),
	};

    constructor (props) {
        super(props);
        this.fetchData 		= this.fetchData.bind(this);
        this.renderChkItem 	= this.renderChkItem.bind(this);
        this.renderMedItem 	= this.renderMedItem.bind(this);
    }

	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
			this.fetchData();

		});
	}

	async fetchData () {
		this.showLoading();
		this.setState({
			loaded: false,
			fetchForbidden: false,
		});
		var id = this.props.id;
		try {
			let responseData = await this.request(Global._host + FIND_URL + id, {
				method: 'GET'
			});
			// let responseData =  {"success":true,
			// "result":
			// 	{"medicalCheck":
			// 		[{"name":"不不不","id":"8a8c7db154ebe90c0154ebfdd1270004","comment":"6","description":"热热热","startTime":"2016-06-04 16:33:20","status":"1","patient":null,"createTime":"2016-06-04 16:33:20","updateTime":"2016-06-04 16:33:20","bizName":"检查单","biz":"medicalCheck","payed":false,"department":"45","patientId":"345","patientName":"看看看","subject":"尿检","details":null,"bedNo":"4","checkTime":"3","caseNo":"2","specimenNo":"4","specimen":"3","audit":"2","diagnosis":"3","machine":"5","submitTime":"3","optDoctor":"34","reportTime":"3","operator":"2","treatment":"11111111111111111111111111111112","idHlht":"34","endTime":"2016-06-04 16:54:10","needPay":"1","applyDoctor":"23","medicalResult":"0","notification":"我问问"},
			// 		{"name":"去去去","id":"8a8c7db154ebe90c0154ebfdd1270005","comment":"8","description":"热热热","startTime":"2016-06-04 16:39:20","status":"1","patient":null,"createTime":"2016-06-04 16:39:20","updateTime":"2016-06-04 16:39:20","bizName":"检查单","biz":"medicalCheck","payed":false,"department":"65","patientId":"234","patientName":"vvv","subject":"肝功","details":null,"bedNo":"3","checkTime":"6","caseNo":"3","specimenNo":"43","specimen":"7","audit":"4","diagnosis":"6","machine":"6","submitTime":"5","optDoctor":"45","reportTime":"2","operator":"3","treatment":"11111111111111111111111111111112","idHlht":"23","endTime":"2016-06-04 16:54:10","needPay":"1","applyDoctor":"45","medicalResult":"0","notification":"我问问"}],
			// 	"tretment":{"id":"11111111111111111111111111111112","idHlht":"2","patient":null,"hospital":null,"department":null,"doctor":null,"patientId":"11111111111111111111111111111114","hospitalId":"12","departmentId":null,"doctorId":null,"patientName":"lili","hospitalName":"内蒙古医院","departmentName":"眼科","doctorName":"李四","cardType":null,"cardNo":null,"appUser":"11111111111111111111111111111116","patientHlht":"111","status":null,"type":null,"medcialResult":"白内障","notification":null,"createTime":"2016-11-11","new":false},
			// 	"drugOrder":[{"id":"8a8c7db154ebe90c0154ebfdd1270006","name":"发发发","description":"热热热","startTime":"2016-06-04 16:54:10","status":"1","patient":null,"createTime":"2016-06-04 16:54:10","updateTime":"2016-06-04 16:54:10","bizName":"药单","biz":"drugOrder","payed":false,"patientId":"123","amount":10.0,"patientName":"嗯嗯嗯",
			// 		"details":[{"id":"8a8c7db154ebe90c0154ebfdd1270010","idHlht":"12","name":"含笑半步癫","price":2.0,"num":1,"amount":2.0,"type":"1","prescribed":"1","treatment":"8a8c7db154ebe90c0154ebfdd1270006","spec":"1","dosage":"1","expira_date":"1","unit":"瓶","new":false},
			// 				{"id":"8a8c7db154ebe90c0154ebfdd1270011","idHlht":"21","name":"脑残片","price":1.0,"num":5,"amount":5.0,"type":"2","prescribed":"2","treatment":"8a8c7db154ebe90c0154ebfdd1270006","spec":"2","dosage":"2","expira_date":"2","unit":"盒","new":false}],
			// 		"treatment":"11111111111111111111111111111112","idHlht":"12","endTime":"2016-06-04 16:54:10","needPay":"1","medicalResult":"12","notification":"我问问","new":false}]}}
			
			this.hideLoading();
			this.data = responseData.result;
			this.setState({
				chkDataSource: this.state.chkDataSource.cloneWithRows(responseData.result.medicalCheck),
				medDataSource: this.state.medDataSource.cloneWithRows(responseData.result.drugOrder),
				patientName: responseData.result.tretment.patientName,
				departmentName: responseData.result.tretment.departmentName,
				doctorName: responseData.result.tretment.doctorName,
				createTime: responseData.result.tretment.createTime,
				medcialResult: responseData.result.tretment.medcialResult,
				hospitalName: responseData.result.tretment.hospitalName,
				isRefreshing: false,
				loaded: true,
				total: responseData.total,
			}); 
		} catch(e) {
			this.hideLoading();
			// this.setState({
			// 	isRefreshing: false,
			// });
			// if(e.status == 401 || e.status == 403)
			// 	this.setState({fetchForbidden: true});
			this.handleRequestException(e);
		}
	}

	//跳转到报告单详情页
	doDetail (id, patientName) {
        this.props.navigator.push({
            title: "报告单详情",
            component: ComChkReport,
            passProps: {
            	id: id,
				patientName: patientName,
            	refresh: this.refresh,
            	backRoute: this.props.route,
            },
            hideNavBar: true,
        });
    } 

	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		let portrait = this.props.photo ? 
					{uri: (Global._host + 'el/base/images/view/' + this.props.photo)} : 
					require('../../res/images/me-portrait-dft.png');

		return (
			<View style = {Global._styles.CONTAINER} >
				{this._getNavBar()}
				<ScrollView style = {styles.scrollView} keyboardShouldPersistTaps = {true} >
				<View style = {{margin: 8, marginBottom: 0}} >
					<Card radius = {6} style = {styles.item1} >
						<View style = {[styles.hospHolder, Global._styles.CENTER]} >
							<Portrait imageSource = {require('../../res/images/hosp/logo01.png')} width = {26} height = {26} />
							<Text style = {{marginLeft: 15, flex: 1}} >{this.state.hospitalName}</Text>
						</View>
						<Separator style = {Global._styles.FULL_SEP_LINE} />
						<View style = {[styles.patientHolder, Global._styles.CENTER]} >
							<Portrait imageSource = {portrait} bgColor = {Global._colors.IOS_GRAY_BG} width = {30} height = {30} radius = {5} />
							<Text style = {styles.patientName} >{this.state.patientName}</Text>
							<View style = {styles.cardHolder} >
								<Text style = {styles.cardTypeName} >{this.props.cardTypeName}</Text>
								<Text style = {styles.cardNo} >{this.props.cardNo}</Text>
							</View>
						</View>
						<Separator style = {Global._styles.FULL_SEP_LINE} />
						<TouchableOpacity style = {[{flexDirection: 'row'}, Global._styles.CENTER,]} onPress = {()=>{this.doDetail(item.id, item.patient.photo, item.hospital.sceneryThumb);}}>
							<Text style = {styles.deptName} >{this.state.departmentName}</Text>
							<View style = {styles.treatBrief} >
								<Text style = {styles.doc} >主诊医生：{this.state.doctorName}</Text>
								<View style = {[styles.creatTime, Global._styles.CENTER]} >
									<Text style = {styles.notification} >就诊时间：{this.state.createTime}</Text>
								</View>
								<View style = {[styles.addrHolder,styles.itemRow, Global._styles.CENTER]} >
									<Text style = {styles.notification}>诊断结果：<Text style = { {color: Global._colors.IOS_RED}}>{this.state.medcialResult}</Text></Text>
								</View>
							</View>
						</TouchableOpacity>
					</Card>
					<Card radius = {6} style = {styles.item1}>
						<Text style = {[styles.itemRowText3]}>检查单：</Text>
						<ListView
						key = {this.data}
				        dataSource = {this.state.chkDataSource}
				        renderRow = {this.renderChkItem}
				        style = {[styles.list]} 
				        enableEmptySections = {true}/>
					</Card>
					<Card radius = {6} style = {styles.item1}>
						<Text style = {[styles.itemRowText3]}>开药：</Text>
						<View style = {Global._styles.FULL_SEP_LINE} />
						<View style = {[styles.itemRow, styles.container]}>
							<Text style = {[styles.itemRowText4, {marginLeft:10, flex: 5}]}>药品</Text>
							<Text style = {[styles.itemRowText4, {flex: 1}]}>数量</Text>
							<Text style = {[styles.itemRowText4, {flex: 1}]}>单位</Text>
						</View>
						<View style = {Global._styles.FULL_SEP_LINE} />
						<ListView
						key = {this.data1}
				        dataSource = {this.state.medDataSource}
				        renderRow = {this.renderMedItem}
				        style = {[styles.list]} 
				        enableEmptySections = {true}/>
					</Card>
					</View>
					<Separator height = {20} />
				</ScrollView>
			</View>
		);
	}

	//检查单
	renderChkItem (item, sectionID, rowID, highlightRow) {
		var topLine = rowID === '0' ? <View style = {Global._styles.FULL_SEP_LINE} /> : null;
        var bottomLine = (<View style = {Global._styles.FULL_SEP_LINE} />);

		return (
			<View style = {styles.container}>
				{topLine}
				<TouchableOpacity style = {[styles.item, Global._styles.CENTER,]} >

					<Text style = {{ marginLeft:10, fontSize: 14, flex: 1}}>{item.name}</Text>
					<Button theme = {Button.THEME.ORANGE} outline = {true} stretch = {false} style = {{width: 50, height: 25, marginLeft: 10}} onPress = {()=>{this.doDetail(item.id, item.patientName);}} >
						<Text style = {{fontSize: 12, color: Global._colors.ORANGE}} >看检查单</Text>
					</Button>
					{/*<Text style = {{  fontSize: 14, }}>查看结果</Text>
										<EasyIcon name = 'ios-arrow-forward-outline' size = {14} color = {Global._colors.IOS_ARROW} style = {[{width: 20,}]} />*/}
				</TouchableOpacity>
				{bottomLine}
			</View>
		);
	}

	//药
	renderMedItem (item, sectionID, rowID, highlightRow) {
		var itemArray = [];
        for (var i = 0; i <item.details.length; i++) {
        	itemArray.push(<View style = {[styles.itemRow, styles.container]}>
				<Text style = {[styles.itemRowText4, {marginLeft:10, flex: 5}]}>{item.details[i].name}</Text>
				<Text style = {[styles.itemRowText4, {flex: 1}]}>{item.details[i].num}</Text>
				<Text style = {[styles.itemRowText4, {flex: 1}]}>{item.details[i].unit}</Text>
			</View>);
        };
		return (
			<View>
				{itemArray}
				<View style = {Global._styles.FULL_SEP_LINE} />
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

	/**
	 * 渲染导航栏
	 */
	_getNavBar () {
		return (
			<NavBar title = '就诊记录详情'
				hideBackText = {true} 
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
	},
	container: {
		backgroundColor: '#ffffff',
	},
	item1: {
		paddingLeft: 0, 
		paddingRight: 0, 
		paddingTop: 0, 
		paddingBottom: 0,
		marginTop: 5,
	},
	item: {
		width: Global.getScreen().width,
        flexDirection: 'row',
        padding: 10,
        paddingLeft: 0,
        paddingRight: 20,
	},
	itemRow: {
		flexDirection: 'row',
	},
	itemRowText1: {
		marginLeft: 10,
		fontSize: 14, 
		color: Global._colors.FONT
	},
	itemRowText2: {
		marginLeft: 5, 
		fontSize: 14,
	},
	itemRowText3: {
		marginTop:10,
		marginLeft: 10, 
		fontSize: 16,
	},
	itemRowText4: {
		fontSize: 14,
	},
	portrait: {
		width: 40,
		height: 40,
        borderRadius: 20,
        marginLeft: 20,
        marginTop: 10,
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
	creatTime: {
		flexDirection: 'row', 
		marginTop: 10
	},
	notification: {
		flex: 1, 
		fontSize: 14, 
		//color: Global._colors.IOS_BLUE, 
		marginLeft: 5
	},
	addrHolder: {
		flex: 1, 
		flexDirection: 'row', 
		marginTop: 10, 
		borderTopColor: Global._colors.IOS_SEP_LINE, 
		borderTopWidth: 0 / Global._pixelRatio
	},
});

export default TreatDetail;



