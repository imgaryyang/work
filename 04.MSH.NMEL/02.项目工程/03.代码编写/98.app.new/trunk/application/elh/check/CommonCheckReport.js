'use strict';

import React, {
    Component,

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

import * as Global  	from '../../Global';
import NavBar			from 'rn-easy-navbar';

const FIND_URL 	= 'elh/treat/my/medicalcheck/';

class ComChkReport extends Component {

    static displayName = 'ComChkReport';
    static description = '报告单详情';

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
		chkListInfo: {},
		chkDataSource: new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,
		}),
		
	};

    constructor (props) {
        super(props);
        this.fetchData 		= this.fetchData.bind(this);
        this.renderChkItem 	= this.renderChkItem.bind(this);
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
			// let responseData = {"success":true,
			// "result":
			// 	{"applyDoctor":"周明明","optDoctor":"34","subject":"尿检","caseNo":"2","department":"消化内科","bedNo":"4",
			// 	"specimenNo":"4","specimen":"血清","checkTime":"2016-01-23 12:09:23","submitTime":"2016-01-23 12:11:233","reportTime":"2016-01-23 15:09:23",
			// 	"operator":"2","audit":"2","machine":"5","comment":"无","diagnosis":"3","doctorTitlt":"主任医师",
			// 	"details":
			// 		[{"id":"111111","subjectCode":"1000001","subject":"血细胞","result":"10.97","flag":"1",
			// 		"unit":"10^9/L","reference":"4-10","checkOrder":"8a8c7db154ebe90c0154ebfdd1270004","new":false},
			// 		{"id":"111112","subjectCode":"1000002","subject":"中性粒细胞百分比","result":"51.01","flag":"1",
			// 		"unit":"%","reference":"50-70","checkOrder":"8a8c7db154ebe90c0154ebfdd1270004","new":false},
			// 		{"id":"111113","subjectCode":"1000003","subject":"淋巴细胞比率","result":"39.21","flag":"1",
			// 		"unit":"%","reference":"20-40","checkOrder":"8a8c7db154ebe90c0154ebfdd1270004","new":false}],
			// 	"id":"8a8c7db154ebe90c0154ebfdd1270004"}}

			this.hideLoading();
			this.data = responseData.result;
			var total1 = responseData.result.details.length;
			this.setState({
				chkListInfo: responseData.result,
				chkDataSource: this.state.chkDataSource.cloneWithRows(responseData.result.details),
				isRefreshing: false,
				loaded: true,
				total: total1,
			}); 
		} catch(e) {
			this.hideLoading();
			this.handleRequestException(e);
		}
	}

	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		return (
			<View style = {Global._styles.CONTAINER} >
				{this._getNavBar()}
				<View style = {Global._styles.PLACEHOLDER10} />
				<View style = {Global._styles.FULL_SEP_LINE} />
				<ScrollView style = {styles.scrollView,styles.container} keyboardShouldPersistTaps = {true}>
					<View>
						<View style = {styles.itemRow}>
							<View style = {{flex:1,marginLeft: 10,}}>
								<View style = {styles.itemRow}>
									<Text style = {styles.itemRowText1}>患        者：</Text>
									<Text style = {styles.itemRowText2}>{this.props.patientName}</Text>
								</View>
								<View style = {styles.itemRow}>
									<Text style = {styles.itemRowText1}>申请项目：</Text>
									<Text style = {styles.itemRowText2}>{this.state.chkListInfo.subject}</Text>
								</View>
								<View style = {[styles.itemRow,]}>
									<Text style = {styles.itemRowText1}>科        室：</Text>
									<Text style = {styles.itemRowText2}>{this.state.chkListInfo.deptName}</Text>
								</View>
							</View>
							<View style = {{flex:1}}>
								<View style = {styles.itemRow}>
									<Text style = {styles.itemRowText1}>申请医师：</Text>
									<Text style = {styles.itemRowText2}>{this.state.chkListInfo.applyDoctor}</Text>
								</View>
								<View style = {styles.itemRow}>
									<Text style = {styles.itemRowText1}>标        本：</Text>
									<Text style = {styles.itemRowText2}>{this.state.chkListInfo.specimen}</Text>
								</View>
								<View style = {[styles.itemRow,]}>
									<Text style = {styles.itemRowText1}>备        注：</Text>
									<Text style = {styles.itemRowText2}>{this.state.chkListInfo.comment}</Text>
								</View>
							</View>
						</View>
						<View style = {Global._styles.FULL_SEP_LINE} />

					</View>
					<View>
						<View style = {[styles.itemRow]}>
							<Text style = {[styles.itemRowText3, {marginLeft: 10,flex: 1}]}>项目代号</Text>
							<Text style = {[styles.itemRowText3, {flex: 2}]}>项目名称</Text>
							<Text style = {[styles.itemRowText3, {flex: 1}]}>结果</Text>
							<Text style = {[styles.itemRowText3, {flex: 1}]}>单位</Text>
							<Text style = {[styles.itemRowText3, {flex: 1}]}>参考值</Text>
						</View>
						<View style = {Global._styles.FULL_SEP_LINE} />
						<ListView
						key = {this.data}
				        dataSource = {this.state.chkDataSource}
				        renderRow = {this.renderChkItem}
				        style = {[styles.list]} 
				        enableEmptySections = {true}/>
				        <View style = {Global._styles.FULL_SEP_LINE} />
					</View>
					<View style = {[styles.itemRow]}>
						<View style = {{flex:2}}>
							<Text style = {[styles.itemRowText4, {marginLeft:10}]}>采样时间：
								<Text style = {[styles.itemRowText4,]}>{this.state.chkListInfo.checkTime}</Text>
							</Text>
							<Text style = {[styles.itemRowText4, {marginLeft:10}]}>接收时间：
								<Text style = {[styles.itemRowText4,]}>{this.state.chkListInfo.submitTime}</Text>
							</Text>
							<Text style = {[styles.itemRowText4, {marginLeft:10}]}>报告时间：
								<Text style = {[styles.itemRowText4,]}>{this.state.chkListInfo.reportTime}</Text>
							</Text>
						</View>
						<View style = {{flex:1}}>
							<Text style = {[styles.itemRowText4, ]}>检验者：{this.state.chkListInfo.operator}</Text>
							<Text style = {[styles.itemRowText4, ]}>审核者：{this.state.chkListInfo.audit}</Text>
							
						</View>
					</View>
					<Text style = {[styles.itemRowText4, {marginLeft:10}]}>检验仪器：{this.state.chkListInfo.machine}</Text>
				</ScrollView>
				<View style = {Global._styles.PLACEHOLDER10} />
			</View>
		);
	}

	//检查单
	renderChkItem (item, sectionID, rowID, highlightRow) {

		return (
			<View>
				<View style = {[styles.itemRow, styles.container]}>
					<Text style = {[styles.itemRowText5, {marginLeft:10, flex: 1}]}>{item.subjectCode}</Text>
					<Text style = {[styles.itemRowText5, {flex: 2}]}>{item.subject}</Text>
					<Text style = {[styles.itemRowText5, {flex: 1}]}>{item.result}</Text>
					<Text style = {[styles.itemRowText5, {flex: 1}]}>{item.unit}</Text>
					<Text style = {[styles.itemRowText5, {flex: 1}]}>{item.reference}</Text>
				</View>
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
			<NavBar title = '报告单详情'
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
		marginTop:10,
		fontSize: 14, 
		color: Global._colors.FONT,
	},
	itemRowText2: {
		marginTop:10,
		marginLeft: 2, 
		fontSize: 13,
		color: Global._colors.FONT_GRAY,
	},
	itemRowText3: {
		fontSize: 14,
		color: Global._colors.FONT_GRAY,
	},
	itemRowText4: {
		flex:1,
		fontSize: 12,
		color: Global._colors.FONT_GRAY,
	},
	itemRowText5: {
		fontSize: 12,
		color: Global._colors.FONT_LIGHT_GRAY,
	},
	portrait: {
		width: 40,
		height: 40,
        borderRadius: 20,
        marginLeft: 20,
        marginTop: 10,
	},
});

export default ComChkReport;



