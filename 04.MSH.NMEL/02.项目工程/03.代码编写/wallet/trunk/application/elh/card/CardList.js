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
    PixelRatio,
} from 'react-native';

import * as Global 	from '../../Global';
import Form 		from '../../lib/form/EasyForm';
import FormConfig 	from '../../lib/form/config/LineInputsConfig';

import NavBar 		from 'rn-easy-navbar';
import Button		from 'rn-easy-button';
import EasyIcon		from 'rn-easy-icon';

class CardList extends Component {

	datas 	= [];
	item 	= null;
	rowID 	= null;

    static displayName = 'CardList';
    static description = '就诊卡列表';

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
		dataSource: new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,
		}),
		addState: false,
		start: 0,
		pageSize: 100,
		value: {
			status: '1',
		},
		hid: null,
		hospitals: [],
		cardTypes: [],
	};

    constructor (props) {
        super(props);
        this.onChange 				= this.onChange.bind(this);
        this.fetchData 				= this.fetchData.bind(this);
        this.renderRow 				= this.renderRow.bind(this);
        this.confirmDelete 			= this.confirmDelete.bind(this);
        this.renderSeparator 		= this.renderSeparator.bind(this);
        this.delBindCard 			= this.delBindCard.bind(this);
    }

	getLabelByValue (array,value) {
		for(let i=0;i<array.length;i++){
			if(array[i].value==value)
				return array[i].label;
		}
	}
    /**
	* 页面装载时调用，只调用这一次
    **/
    componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({
				doRenderScene: true,
			});
		});
		this.fetchData();
	}

	/**
	 * 加载医院列表
	 */
	async getHospitals () {
        this.showLoading();
        let FIND_URL = 'elh/hospital/app/list/0/100';
		let data =  encodeURI(JSON.stringify({
					state: 1,
					patientId: this.props.userPatient.id,
				}));
		try {
			let responseData = await this.request(Global._host + FIND_URL + '?data=' + data , {
	        	method:'GET',
			});
			if(responseData.success){
				let newHospitals = [];
				let obj = null;
				responseData.result.forEach((item) => {
					obj = new Object();
					obj.label = item.name;
					obj.value = item.id;
					newHospitals.push(obj);
				});
				this.setState({
					hospitals: newHospitals,
				});
			}
            this.hideLoading();
		} catch(e) {
			this.handleRequestException(e);
		}
	}

	/**
	 * 加载医院支持的列表
	 */
	async getSuppCardTypes () {
        this.showLoading();
        let FIND_URL = 'elh/hospital/cardType/list/'+this.state.value.orgId;
		try {
			let responseData = await this.request(Global._host + FIND_URL, {
	        	method:'GET',
			});
			if(responseData.success){
				let newCardTypes = [];
				let obj = null;
				responseData.result.forEach((item) => {
					obj = new Object();
					obj.value = item.id;
					obj.label = item.cardTypeName;
					newCardTypes.push(obj);
				});
				/*this.setState({
					cardTypes: newCardTypes,
				});*/
				this.state.cardTypes = newCardTypes;
            	this.hideLoading();
			}
		} catch(e) {
			this.handleRequestException(e);
		}
	}

	/**
	 * 异步加载列表数据
	 */
	async fetchData () {
		this.datas = [];
        let FIND_URL = 'elh/medicalCard/list/'+this.state.start+'/'+this.state.pageSize;
		if(this.state.loading) return;
		this.setState({loading: true});
		let data =  encodeURI(JSON.stringify({
					state: 1,
					patientId: this.props.userPatient.id,
				}));
		try {
			let responseData = await this.request(Global._host + FIND_URL + '?data=' + data , {
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
		} catch(e) {
			this.handleRequestException(e);
		}
	}

	/**
	 * 将新查询到的数据追加到sectionData中
	 */
	appendSectionData (datas) {
		if(!datas){
			return;
		}
		datas.forEach((item) => {
			this.datas.push(item);
		});
	}

	/**
	* 提示是否解绑
	**/
    confirmDelete (item, rowID) {
    	this.item = item;
    	this.rowID = rowID;
    	Alert.alert(
            '提示',
            '您确定要删除此条记录吗？',
            [
            	{text: '取消', style: 'cancel'},
            	{text: '确定', onPress: () => this.delBindCard()},
            ]
        );
    }

	/**
	*	解除绑定卡
	**/
	async delBindCard () {
        let FIND_URL = 'elh/medicalCard/delBindCard/'+this.item.id;
        try {
    		this.showLoading();
	        let responseData = await this.request(Global._host + FIND_URL,{
	        	method:'GET',
            });
            if(responseData.success){
            	this.hideLoading();
				this.datas.splice(this.rowID, 1);
				this.setState({
					dataSource: this.state.dataSource.cloneWithRows(this.datas),
				});
				this.props.getCardCount();
				this.props.refreshDataSource(); //后续优化改进
				this.toast('删除成功！');
            }
        } catch(e) {
            this.hideLoading();
            this.handleRequestException(e);
        }
	}

	/**
	* 保存卡信息
	**/
	async submit () {
		if (!this.form.validate()) {
			return;
		}
		let SAVE_CARD_URL = 'elh/medicalCard/create/';
        let responseData = await this.request(Global._host + SAVE_CARD_URL,{
        	method:'POST',
            body: JSON.stringify({
        		patientId: this.props.userPatient.id,
            	cardholder: this.props.userPatient.name,
            	idCardNo: this.props.userPatient.idno,
            	state: '1',
            	cardNo: this.state.value.cardNo,
            	orgId: this.state.value.orgId,
            	orgName: this.getLabelByValue(this.state.hospitals, this.state.value.orgId), //发卡机构名称
            	typeId: this.state.value.typeId,
            	typeName: this.getLabelByValue(this.state.cardTypes, this.state.value.typeId), //卡类型名称　
            })
        });
        if(responseData.success){
			/*this.datas.push(responseData.result);
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(this.datas),
			});*/
	        this.state.value.cardNo="";
			this.fetchData();
			this.props.getCardCount();
			this.props.refreshDataSource(); //后续优化改进
        	this.toast("保存成功");
        }
	}

	/**
	* 将form中改变的值赋值在state value中
	**/
	onChange (fieldName, fieldValue, formValue) {
		this.setState({value: formValue});
	}
	isSelectOrg () {
		this.getSuppCardTypes();
	}
	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();
		let addCard = null;
		if(this.state.addState){
			addCard = (
					<Form ref = {(c) => this.form = c} config = {FormConfig} showLabel = {this.state.showLabel} labelPosition = {this.state.labelPosition}
								labelWidth = {70} onChange = {this.onChange} value = {this.state.value} >
						<Form.Picker name = "orgId" label = "医院" placeholder = "请选择医院" onChange = {this.isSelectOrg() } 
							required = {true}  dataSource = {this.state.hospitals} type = "multi" display = "col" />
						<Form.Picker name = "typeId" label = "类型" placeholder = "请选择类型" 
							required = {true}  dataSource = {this.state.cardTypes} type = "multi" display = "col" />
						<Form.TextInput name = "cardNo" label = "卡号" placeholder = "请输入卡号" 
							required = {true} minLength = {1} maxLength = {20} />
						<View style={styles.paddingView }></View>
						<View style = {{flexDirection: 'row', margin: 5, marginTop: 20, marginBottom: 40}} >
							<Button text = "保存" theme={Button.THEME.ORANGE}  onPress={() => this.submit()}/>
						</View>
					</Form>
				);
		}else{
			addCard = null;
		}
		return (
			<View style = {Global._styles.CONTAINER} >
				{this._getNavBar()}
				<ScrollView automaticallyAdjustContentInsets = {false} style ={styles.scrollView} >
					<ListView
						key = {this.datas}
				        dataSource = {this.state.dataSource}
				        renderRow = {this.renderRow}
	    				renderSeparator = {this.renderSeparator}
				        style = {[styles.list]} 
				    />
			    	<View style={styles.paddingView}></View>
					<TouchableOpacity style={styles.hrefView} onPress={() => this.renderAddCardForm() }>
						<Text style={{color:'blue',flex:1,}}>我要添加就诊卡</Text>
						<EasyIcon iconLib = 'fa' name = 'angle-right' 
							size = {20} color = {Global.IOS_BLUE} 
							style = {[Global._styles.ICON, {width: 20}]} />
					</TouchableOpacity>
					{addCard }
					<View style={styles.paddingView }></View>
				</ScrollView>
			</View>

		);
	}

	/**
	* 显示或隐藏添加卡信息 //修改
	**/
	renderAddCardForm () {
		if(this.state.addState){
			this.setState({
				addState: false,
			});
		}else{
			this.getHospitals();
			this.setState({
				addState: true,
			});
		}
	}

	/**
	 * 渲染行数据
	 */
	renderRow (item, sectionId, rowID, highlightRow) {
		return (
			<View style = {[styles.item]} >
				<View style = {[styles.item, Global._styles.CENTER,{marginLeft:10,}]} >
					<View style={styles.portrait}>
						<EasyIcon iconLib = 'fa' name = 'credit-card' 
							size = {20} color = {Global._colors.IOS_ARROW} />
					</View>
					<View style={{flex:1,marginLeft:15,alignItems:'flex-start'}}>
						<View style={{flexDirection: 'row',alignItems:'flex-end',}}>
							<Text style = {styles.orgName}>{item.orgName}</Text>
							<Text style = {styles.typeName}>（{item.typeName}）</Text>
						</View>
						<Text style = {styles.cardTypeName}>卡号：{item.cardNo}</Text>
					</View>
					<TouchableOpacity onPress = {()=>{this.confirmDelete(item, rowID);}}>
						<EasyIcon iconLib = 'fa' name = 'trash-o' 
							size = {20} color = {Global._colors.IOS_ARROW} 
							style = {[Global._styles.ICON, {width: 40}]} />
					</TouchableOpacity>
				</View>
			</View>
		);
	}

	/**
	 * 渲染行分割线
	 */
	renderSeparator (sectionId, rowID) {
		return <View key={'sep_' + rowID} style={[Global._styles.FULL_SEP_LINE,{margin:0}]} />;
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
			<NavBar title = '就诊卡管理' 
				hideBackText = {true} 
		    	navigator = {this.props.navigator} 
				route = {this.props.route}
		    	hideBackButton = {false} 
		    	hideBottomLine = {false} 
				rightButtons = {(
					<View style = {[Global._styles.NAV_BAR.BUTTON_CONTAINER, Global._styles.NAV_BAR.RIGHT_BUTTONS]}>
					</View>
				)} />
		);
	}
}

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
		backgroundColor: 'white',
		marginBottom: Global._os == 'ios' ? 48 : 0,
	},
	portrait: {
		width: 36,
		height: 36,
		borderRadius: 18,
		borderWidth: 1,
		borderColor: 'rgba(200,199,204,1)', 
		justifyContent:'center',
		alignItems:'center',
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
	orgName: {
		color: '#ff6600',
		fontSize: 15,
	},
	typeName: {
		color: '#999999',
		fontSize: 13,
	},
	cardNo: {
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
	hrefView: {
		height:50,
		flex:1,
		flexDirection: 'row',
		padding:5,
		alignItems:'center',
		borderBottomWidth: 1 / PixelRatio.get(),
		borderBottomColor: 'rgba(200,199,204,1)',  //#c8c7cc
		borderTopWidth: 1 / PixelRatio.get(),
		borderTopColor: 'rgba(200,199,204,1)',  //#c8c7cc
	},
	paddingView: {
		height:20,
		backgroundColor: Global._colors.IOS_GRAY_BG,
	},
});

export default CardList;

