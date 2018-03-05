'use strict';

import React, {
    Component,

} from 'react';

import {
    View,
    ScrollView,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
	InteractionManager,
	ActivityIndicator,
	RefreshControl,
} from 'react-native';

import * as Global  		from '../../Global';
import NavBar       		from 'rn-easy-navbar';

import Card       			from 'rn-easy-card';
import Button       		from 'rn-easy-button';
// import EasyIcon     		from 'rn-easy-icon';
import Separator    		from 'rn-easy-separator';
import Portrait     		from 'rn-easy-portrait';
import {B, I, U, S} 		from 'rn-easy-text';

import CommonCheckReport 	from '../check/CommonCheckReport';
import CashierDesk 			from '../../el/cashier-desk/CashierDesk';

import moment       		from 'moment';

const FETCH_URL = 'elh/treat/my/treatGuide/';

class OutpatientGuidance extends Component {

    static displayName = 'OutpatientGuidance';
    static description = '门诊导诊';

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
		mainContainerHeight: 0,
		data: null,
		_refreshing: true,//控制刷新
		_pullToRefreshing: false,//控制下拉刷新
	};

    constructor (props) {
        super(props);

        this.refresh 			= this.refresh.bind(this);
        this.pullToRefresh 		= this.pullToRefresh.bind(this);
        this.fetchData 			= this.fetchData.bind(this);
        this.renderHeader 		= this.renderHeader.bind(this);
        this.renderStepCats 	= this.renderStepCats.bind(this);
        this.renderSteps 		= this.renderSteps.bind(this);
        this.renderRegister 	= this.renderRegister.bind(this);
        this.renderDiagnosis 	= this.renderDiagnosis.bind(this);
        this.renderCheck 		= this.renderCheck.bind(this);
        this.checkReport 		= this.checkReport.bind(this);
        this.renderDrug 		= this.renderDrug.bind(this);
        this.renderQueue 		= this.renderQueue.bind(this);
        this.renderCure 		= this.renderCure.bind(this);
        this.renderOrder 		= this.renderOrder.bind(this);
        this.goToPay 			= this.goToPay.bind(this);
        this.onPayed 			= this.onPayed.bind(this);
        this.backParent 		= this.backParent.bind(this);
        this.onMainContainerLayout = this.onMainContainerLayout.bind(this);

    }

	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true}, () => {
				this.fetchData();
			});
		});
	}

	refresh () {
		this.setState({
			_refreshing: true,
		}, () => {
			this.fetchData();
		});
	}

	pullToRefresh () {
		this.setState({
			_pullToRefreshing: true
		}, () => {
			this.fetchData();
		});
	}

	async fetchData () {
		try {

			let treatData = await this.request(Global._host + FETCH_URL + this.props.item.id, {
				method:'GET',
			});
			/*console.log(Global._host + FETCH_URL + this.props.item.id);
			console.log(treatData);*/
			if(treatData.result) {
				this.setState({
					data: treatData.result,
				})
			}

		} catch(e) {
			this.handleRequestException(e);
		}
	}

	/**
	 * 支付完成回调
	 * @param  {[string]} orderId [订单ID]
	 * @param  {[boolean]} status  [支付状态]
	 * @return {[null]}         [description]
	 */
	onPayed (orderId, status) {
		if(status)
			this.toast('付款成功！');
		else
			this.toast('付款失败，请稍后再试！');
		this.refresh();
	}

	/**
	 * 去缴费
	 */
	goToPay (orderId, amt) {
		this.props.navigator.push({
			component: CashierDesk,
			hideNavBar: true,
			passProps: {
				orderId: orderId,
				callback: this.onPayed,
				backRoute: this.props.route
			}
		})
	}

	backParent () {
        this.props.navigator.pop();

		if(this.props.refresh && typeof this.props.refresh == 'function'){
			this.props.refresh();
		}
	}
	
	/**
	 * 导诊步骤 - 缴费
	 */
	renderOrder (item, idx) {
		return (
			<StepCat key = {"step_cat_" + idx} item = {item} idx = {idx} >
				{item.steps.map((step, sidx) => {
					let orderGuidanceMsg = step.bizObject.status == '1' ? (
						<View key = {step.bizObject.id + sidx} style = {styles.orderItemsHolder} >
							<Text style = {styles.orderItem} ><B>已缴纳费用共计：</B></Text>
							<Text style = {styles.orderItemAmt} ><B>{step.bizObject.amount}</B></Text>
						</View>
					) : (
						<View key = {step.bizObject.id + sidx} style = {styles.orderItemsHolder} >
							<Text style = {styles.orderItem} ><B>待缴纳费用共计：</B></Text>
							<Text style = {styles.orderItemAmt} ><B>{step.bizObject.amount}</B></Text>
							<Button text = "去缴费" outline = {true} stretch = {false} 
								onPress = {() => this.goToPay(step.bizObject.id, step.bizObject.amount)} 
								style = {{width: 50, height: 25, marginLeft: 10}} />
						</View>
					);
					return (
						<Step key = {'step_' + idx + '_' + sidx} step = {step} >
							{step.bizObject.charges.map((charge, cidx) => {
								let height = null;//this.state['order' + step.id]
								return (
									<View key = {charge.id + cidx} style = {[styles.orderItemsHolder, height, {marginBottom: 8}]} >
										<Text style = {styles.orderItem} >{charge.name}</Text>
										<Text style = {styles.orderItemAmt} >{charge.receiveAmount}</Text>
									</View>
								);
							})}
							{orderGuidanceMsg}
						</Step>
					);
				})}
			</StepCat>
		)
	}

	/**
	 * 导诊步骤 - 治疗
	 */
	renderCure (item, idx) {
		return (
			<StepCat key = {"step_cat_" + idx} item = {item} idx = {idx} >
				{this.renderSteps(item, idx)}
			</StepCat>
		)
	}

	/**
	 * 导诊步骤 - 排队机（看诊、检查、取药）
	 */
	renderQueue (item, idx) {
		return (
			<StepCat key = {"step_cat_" + idx} item = {item} idx = {idx} >
				{this.renderSteps(item, idx)}
			</StepCat>
		);
	}

	/**
	 * 导诊步骤 - 开药、取药
	 */
	renderDrug (item, idx) {
		return (
			<StepCat key = {"step_cat_" + idx} item = {item} idx = {idx} >
				{item.steps.map((step, sidx) => {
					let drugGuidanceMsg = (
						<View key = {step.bizObject.id + sidx} style = {styles.drugItemsHolder} >
							<Text style = {styles.drugItem} ><B>共计：</B></Text>
							<Text style = {styles.drugItemAmt} ><B>{step.bizObject.amount}</B></Text>
						</View>
					);
					return (
						<Step key = {'step_' + idx + '_' + sidx} step = {step} >
							{step.bizObject.details.map((detail, cidx) => {
								let height = null;
								return (
									<View key = {detail.id + cidx} style = {[styles.drugItemsHolder, height, {marginBottom: 8}]} >
										<Text style = {styles.drugItem} >{detail.name}</Text>
										<Text style = {styles.drugItemAmt} >{detail.num}({detail.unit})</Text>
									</View>
								);
							})}
							{drugGuidanceMsg}
						</Step>
					);
				})}
			</StepCat>
		);
	}

	/**
	 * 查看检查单
	 */
	checkReport (checkId) {
		this.props.navigator.push({
			component: CommonCheckReport,
			hideNavBar: true,
			passProps: {
				id: checkId
			}
		});
	}

	/**
	 * 导诊步骤 - 开检查单、检查引导、检查预约、查看检查结果
	 * 0 - 未检
	 * 1 - 已检
	 * 2 - 已出结果
	 */
	renderCheck (item, idx) {
		let steps = item.steps.map((step, sidx) => {
			let c = step.bizObject, status = c.status ? c.status : 0;
			let statusContainer = null;
			if(status == '0') statusContainer = <Text style = {styles.checkStatus} >未检查</Text>;
			else if(status == '1') statusContainer = <Text style = {styles.checkStatus} >未出结果</Text>;
			else if(status == '2') statusContainer = (
				<Button text = "查看检查单" outline = {true} stretch = {false} 
					onPress = {() => this.checkReport(c.id)} 
					style = {{width: 80, height: 25, marginLeft: 10}} />
			);
			return (
				<Step key = {'step_' + idx + '_' + sidx} step = {step} >
					<View style = {styles.checksHolder} >
						<Text style = {styles.checkName} >{c.name}</Text>
						{statusContainer}
					</View>
				</Step>
			);
		});
		return (
			<StepCat key = {"step_cat_" + idx} item = {item} idx = {idx} >
				{steps}
			</StepCat>
		);
	}

	/**
	 * 导诊步骤 - 看诊
	 */
	renderDiagnosis (item, idx) {
		return (
			<StepCat key = {"step_cat_" + idx} item = {item} idx = {idx} >
				{item.steps.map((step, sidx) => {
					return (
						<Step key = {'step_' + idx + '_' + sidx} step = {step} >
							<Text style = {styles.stepMsg} >{step.bizObject.description}</Text>
						</Step>
					);
				})}
			</StepCat>
		);
	}

	/**
	 * 导诊步骤 - 挂号
	 */
	renderRegister (item, idx) {
		return (
			<StepCat key = {"step_cat_" + idx} item = {item} idx = {idx} >
				{item.steps.map((step, sidx) => {
					return (
						<Step key = {'step_' + idx + '_' + sidx} step = {step} >
							<Text style = {styles.stepMsg} >{step.bizObject.description}</Text>
						</Step>
					);
				})}
			</StepCat>
		);
	}

	renderSteps (item, idx) {
		let steps = item.steps.map((step, sidx) => {
			return (
				<Step key = {'step_' + idx + '_' + sidx} step = {step} >
					<Text style = {styles.stepMsg} >{step.msg}</Text>
				</Step>
			);
		});
		return steps;
	}

	/**
	 * 渲染导诊步骤
	 */
	renderStepCats () {
		if(this.state.data) {
			//console.log(this.state.data.groups);
			return this.state.data.groups.map((item, idx) => {
				switch (item.bizType) {
					case "register":
						return this.renderRegister(item, idx);
					case "diagnosis":
						return this.renderDiagnosis(item, idx);
					case "order":
						if(item.steps[0].bizObject.status == '1')
							return null;
						return this.renderOrder(item, idx);
					case "medicalCheck":
						return this.renderCheck(item, idx);
					case "drugOrder":
						return this.renderDrug(item, idx);
					case "cure":
						return this.renderCure(item, idx);
					case 'queue':
						return this.renderQueue(item, idx);
					default:
						return null;
				}
			});
		}
	}

	onMainContainerLayout (e) {
		this.setState({mainContainerHeight: e.nativeEvent.layout.height});
	}

	renderHeader () {

		let row = this.props.row, item = this.props.item;
		let portrait = row.patient.photo ? 
			{uri: (Global._host + 'el/base/images/view/' + row.patient.photo)} : 
			require('../../res/images/me-portrait-dft.png');
		return (
			<Card radius = {6} style = {styles.header} >
				<View style = {[styles.hospHolder, Global._styles.CENTER]} >
					<Portrait imageSource = {require('../../res/images/hosp/logo01.png')} width = {26} height = {26} />
					<Text style = {styles.hospName} >{row.hospitalName}</Text>
				</View>

				<Separator style = {Global._styles.FULL_SEP_LINE} />

				<View style = {[styles.patientHolder, Global._styles.CENTER]} >
					<Portrait imageSource = {portrait} bgColor = {Global._colors.IOS_GRAY_BG} width = {30} height = {30} radius = {5} />
					<Text style = {styles.patientName} >{row.patientName} </Text>
					<View style = {styles.cardHolder} >
						<Text style = {styles.cardTypeName} >{row.cardTypeName}</Text>
						<Text style = {styles.cardNo} >{row.cardNo}</Text>
					</View>
				</View>

				<Separator style = {Global._styles.FULL_SEP_LINE} />

				<View style = {[{flexDirection: 'row'}, Global._styles.CENTER]} >
					<Text style = {styles.deptName} >{item.departmentName}</Text>
					<View style = {styles.treatInfo} >
						<Text style = {styles.doc}><B>主诊医生：</B>{item.doctorName}{item.doctorTitle ? " [ " + item.doctorTitle + " ]" : ""}</Text>
						<Text style = {styles.medcialResult}><B>诊断结果：</B>{item.medcialResult}</Text>
						
						<View style = {[styles.addrHolder, Global._styles.CENTER]} >
							<EasyIcon name = "ios-pin" size = {13} color = {Global._colors.FONT_LIGHT_GRAY1} />
							<Text style = {styles.addr} >{item.department.address}</Text>
						</View>
					</View>
				</View>

			</Card>
		);
	}

	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		let row = this.props.row, item = this.props.item;

		return (
			<View style = {Global._styles.CONTAINER} >
				{this._getNavBar()}
				<View style = {styles.bgView} onLayout = {this.onMainContainerLayout} >

					<ScrollView 
						style = {[styles.scrollView, {height: this.state.mainContainerHeight}]}
				        refreshControl = {
							<RefreshControl
								refreshing = {this.state._pullToRefreshing}
								onRefresh = {this.pullToRefresh}
							/>
						} >

						{this.renderHeader()}
						{this.getLoadingView('正在载入导诊信息...', this.refresh)}
						{this.renderStepCats()}
						<Separator height = {40} />

					</ScrollView>

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

	_getNavBar () {
		return (
			<NavBar title = '门诊导诊' 
		    	navigator = {this.props.navigator} 
				route = {this.props.route}
		    	hideBackButton = {false} 
		    	hideBottomLine = {false}
		    	backFn = {this.backParent} 
		    	rightButtons = {(
					<View style = {[Global._styles.NAV_BAR.BUTTON_CONTAINER, Global._styles.NAV_BAR.RIGHT_BUTTONS]} >
		    			<Button text = "刷新" theme = {Button.THEME.WHITE} onPress = {this.refresh} stretch = {false} clear = {true} style = {Global._styles.NAV_BAR.BUTTON} />
		    		</View>
		    	)} />
		);
	}

}

const styles = StyleSheet.create({
	bgView: {
		flex: 1,
		overflow: 'hidden',
	},
	timeLineView: {
		borderRightWidth: 4,
		borderRightColor: 'rgba(220,220,220,1)',
		width: 92,
		height: 1000,
	},


	scrollView: {
		position: 'absolute',
		left: 0,
		top: 0,
		width: Global.getScreen().width - 32,
		paddingTop: 16,
		marginLeft: 16,
	},

	header: {
		paddingLeft: 0, 
		paddingRight: 0, 
		paddingTop: 0, 
		paddingBottom: 0
	},
	hospHolder: {
		flexDirection: 'row', 
		padding: 15
	},
	hospName: {
		marginLeft: 15,
		flex: 1,
	},
	patientHolder: {
		flexDirection: 'row', 
		padding: 15
	},
	patientName: {
		flex: 1, 
		marginLeft: 15
	},
	cardHolder: {
		flex: 1, 
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
	treatInfo: {
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
	medcialResult: {
		fontSize: 14, 
		marginLeft: 3, 
		color: Global._colors.FONT_GRAY
	},
	addrHolder: {
		flex: 1, 
		flexDirection: 'row', 
		marginTop: 10, 
	},
	addr: {
		flex: 1, 
		fontSize: 12, 
		color: Global._colors.FONT_GRAY
	},

	stepCat: {
		marginTop: 16,
		paddingTop: 10,
		borderWidth: 1 / Global._pixelRatio,
		borderColor: Global._colors.IOS_SEP_LINE,
		borderRadius: 6,
		backgroundColor: 'white',
		overflow: 'hidden',
	},
	stepCatTitle: {
		paddingLeft: 10,
		paddingBottom: 6,
		borderBottomWidth: 1 / Global._pixelRatio,
		borderBottomColor: Global._colors.IOS_SEP_LINE,
	},
	stepCatFoot: {
		height: 10,
	},
	stepsHolder: {
	},

	stepHolder: {
		backgroundColor: 'white',
	},
	stepTime: {
		fontSize: 10,
		fontWeight: '400',
		color: Global._colors.FONT_LIGHT_GRAY,
		backgroundColor: 'white',
		margin: 10,
	},
	step: {
		flex: 1,
		backgroundColor: 'white',
		padding: 10,
		paddingLeft: 15,
		paddingTop: 0,
		/*borderWidth: 1 / Global._pixelRatio,
		borderColor: 'red',*/
	},
	stepMsg: {
		fontSize: 13,
		color: Global._colors.FONT_GRAY,
	},
	stepDot: {
		position: 'absolute',
		left: 84.5,
		top: 2,
		width: 10,
		height: 10,
		borderRadius: 5,
		backgroundColor: 'rgba(200,200,200,.5)',
	},

	orderItemsHolder: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	orderItem: {
		flex: 1,
		fontSize: 13,
		color: Global._colors.FONT_GRAY,
	},
	orderItemAmt: {
		width: 70,
		textAlign: 'right',
		fontSize: 13,
		color: Global._colors.FONT_GRAY,
	},

	drugItemsHolder: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	drugItem: {
		flex: 1,
		fontSize: 13,
		color: Global._colors.FONT_GRAY,
	},
	drugItemAmt: {
		width: 70,
		textAlign: 'right',
		fontSize: 13,
		color: Global._colors.FONT_GRAY,
	},

	checksHolder: {
		flexDirection: 'row',
	},
	checkName: {
		flex: 1,
		fontSize: 13,
		color: Global._colors.FONT_GRAY,
	},
	checkStatus: {
		width: 70,
		textAlign: 'right',
		fontSize: 13,
		color: Global._colors.FONT_GRAY,
	},
});

export default OutpatientGuidance;


class StepCat extends Component {
	render () {
		return (
			<View style = {styles.stepCat} {...this.props} >
				<View style = {[styles.stepCatTitle]} >
					<Text style = {{fontSize: 15, color: Global._colors.FONT_GRAY}} >{this.props.item.name}</Text>
				</View>
				<View style = {styles.stepsHolder} >
					{this.props.children}
				</View>
				<View style = {[styles.stepCatFoot]} />
			</View>
		);
	}
}

class Step extends Component {
	render () {
		return (
			<View style = {styles.stepHolder} >
				<Text style = {styles.stepTime} >{this.props.step.updateTime ? moment(this.props.step.updateTime).format('M月D日 h:m') : ''}</Text>
				<View style = {styles.step} >
					{this.props.children}
				</View>
			</View>
		);
	}
}



