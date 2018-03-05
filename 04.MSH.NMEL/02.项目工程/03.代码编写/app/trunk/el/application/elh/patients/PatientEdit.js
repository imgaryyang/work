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
    PixelRatio,
	InteractionManager,
	Alert,
} from 'react-native';

import * as Global  from '../../Global';
import Form 		from '../../lib/form/EasyForm';
import UserStore    from '../../flux/UserStore';

import NavBar       from 'rn-easy-navbar';
import Button       from 'rn-easy-button';
import Separator    from 'rn-easy-separator';
import Card    		from 'rn-easy-card';
import EasyPicker   from 'rn-easy-picker';

import CardList     from '../card/CardList';

const genders = [
	{label: '男', value: '1'},
	{label: '女', value: '2'},
];
const CREATE_URL 	= 'elh/userPatient/my/create/';
const EDIT_URL 		= 'elh/userPatient/my/';
const DELETE_URL 	= 'elh/userPatient/my/';
const SAVE_CARD_URL = 'elh/medicalCard/my/create/';
const FIND_CARD_URL = 'elh/mmedicalCard/my/list/0/100';

class PatientEdit extends Component {

    static displayName = 'PatientEdit';
    static description = '常用就诊人信息';

    form = null;

    static propTypes = {
    };

    static defaultProps = {
    };


	state = {
		doRenderScene: false,
		value: {
			id: '',
			status: '1',
	        userId: UserStore.getUser().id,
		},
		showLabel: true,
		labelPosition: 'left',
		user: UserStore.getUser(),
		cardCount: 0,
		addState: false,
		flag: true,
		userPatient: this.props.userPatient,
	};

    constructor (props) {
        super(props);
        this.submit 		= this.submit.bind(this);
        this.onChange 		= this.onChange.bind(this);
        this.getCardCount 	= this.getCardCount.bind(this);
        this.confirmDelete 	= this.confirmDelete.bind(this);
        this.delPatient 	= this.delPatient.bind(this);
    }

	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
		if(this.props.userPatient && this.props.userPatient.id){
			this.setFormValue();
		}
	}

	/**
	* 页面初始化赋值，用于修改
	**/
	setFormValue () {
		this.setState({
			value: {
				patientId: this.state.userPatient.patientId,
				id: this.state.userPatient.id,
				userId: this.state.userPatient.userId,
				name: this.state.userPatient.name,
				gender: this.state.userPatient.gender,
				relationshi: this.state.userPatient.relationshi,
				alias: this.state.userPatient.alias,
				idno: this.state.userPatient.idno,
				photo: this.state.userPatient.photo,
				mobile: this.state.userPatient.mobile,
				email: this.state.userPatient.email,
				address: this.state.userPatient.address,
				birthday: this.state.userPatient.birthday,
				height: ""+this.state.userPatient.height,
				weight: ""+this.state.userPatient.weight,
				status:"1",
			},
			cardCount: this.state.userPatient.cardCount,
		});
	}

	/**
	* 将form中改变的值赋值在state value中
	**/
	onChange(fieldName, fieldValue, formValue) {
		if (this.props.addPatient !== false) {
			if (fieldName === 'relationshi') {
				if (fieldValue === '自己') {
					this.setState({
						value: {
							alias: this.state.user.nickname,
							userId: this.state.user.id,
							name: this.state.user.name,
							gender: this.state.user.gender,
							relationshi: fieldValue,
							idno: this.state.user.idCardNo,
							mobile: this.state.user.mobile,
							email: this.state.user.email,
							height: this.state.user.height,
							weight: this.state.user.weight,
							birthday: this.state.user.birthday,
							status: "1",
						}
					});
				}
			} else {
				this.setState({ value: formValue });
			}
		} else {
			this.setState({ value: formValue });
		}
	}

	/**
	* 合作医院列表
	**/
	hospitals = [
		{label: '内蒙古自治区医院', value: '0'},
		{label: '内蒙古医学院附属医院', value: '1'},
		{label: '呼和浩特市第一医院', value: '2'},
	];

	/**
	* 卡类型列表
	**/
	cardTypes = [
		{label: '就诊卡', value: '0'},
		{label: '社保卡', value: '1'},
	];

	getLabelByValue (array,value) {
		for(let i=0;i<array.length;i++){
			if(array[i].value==value)
				return array[i].label;
		}
	}

	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		let cardText = null;
		let cardCount = this.state.cardCount;
		let rs=[];
		let relationShips = [
			{ label: '自己', value: '自己' },
			{ label: '父母', value: '父母' },
			{ label: '亲戚', value: '亲戚' },
			{ label: '同事', value: '同事' },
			{ label: '爱人', value: '爱人' },
			{ label: '朋友', value: '朋友' },
			{ label: '其他', value: '其他' },
		];
		let noself = [
			{ label: '父母', value: '父母' },
			{ label: '亲戚', value: '亲戚' },
			{ label: '同事', value: '同事' },
			{ label: '爱人', value: '爱人' },
			{ label: '朋友', value: '朋友' },
			{ label: '其他', value: '其他' },
		];
		if (this.props.hasself) {
			if(this.props.self){
				rs=relationShips;
			}else{
				rs=noself;
			}
		} else {
			rs=relationShips;
		}
		if(this.props.realperson!=undefined){//可能是undefined的
			if(this.props.realperson){
				this.state.flag=false;
			}
		}
		return (
			<View style = {[Global._styles.CONTAINER, ]} >
				{this._getNavBar()}
				<ScrollView style = {styles.scrollView} keyboardShouldPersistTaps={true}>
					<Form ref = {(c) => this.form = c} showLabel = {this.state.showLabel} labelPosition = {this.state.labelPosition}
						labelWidth = {70} onChange = {this.onChange} value = {this.state.value} >
						{/*<View style = {styles.fieldSet} ><Text>基础信息</Text></View>*/}
						<Form.TextInput name = "name" label = "真实姓名" placeholder = "请输入姓名" required = {true} minLength = {1} maxLength = {20} editable = {this.state.flag}/>
						<Form.TextInput name = "alias" label = "别名" placeholder = "请输入别名" maxLength = {20} />
						<Form.Picker name = "relationshi" label = "关系" placeholder = "请选择关系" required = {true} dataSource = {rs}/>
						<Form.Checkbox name = "gender" showLabel = {false} label = "性别" dataSource = {genders}  required = {true} />
						<Form.TextInput name = "height" label = "身高(cm)" placeholder = "请输入身高" dataType = "number" />
						<Form.TextInput name = "weight" label = "体重(kg)" placeholder = "请输入体重" dataType = "number" />
						<Form.Date name = "birthday" label = "出生日期" placeholder = "请输入出生日期" dataType = "string" />
						<Form.TextInput name = "idno" label = "身份证号" required = {true} placeholder = "请输入身份证号" dataType = "cnIdNo" editable = {this.state.flag}/>
						<Form.TextInput name = "mobile" label = "手机号" placeholder = "请输入手机号码" dataType = "mobile" required = {true} />
						<Form.TextInput name = "email" label = "电子邮箱" placeholder = "请输入电子邮箱" dataType = "email" />
						<Form.TextInput name = "address" label = "地址" placeholder = "请输入地址" dataType = "string" />
					</Form>
					<View style={styles.paddingView }></View>
					{cardText }
					<View style={styles.paddingView }></View>
					<View style = {{flexDirection: 'row', margin: 5, marginTop: 20, marginBottom: 40}} >
						{this.renderDelButton() }
						<Button text = "保存" theme={Button.THEME.BULE}  onPress={() => this.submit()}/>
					</View>
				</ScrollView>
			</View>
		);
	}

	/**
	* 保存数据
	**/
	async submit() {
		let url;
		let method;
		if(this.props.addPatient){
			url = CREATE_URL;
			method = 'POST';
		}else{
			url = EDIT_URL + this.props.userPatient.id;
			method = 'PUT';
		}
		if (!this.form.validate()) {
			return;
		}
		this.showLoading();
        try {
			let responseData = await this.request(Global._host + url, {
				method: method,
				body: JSON.stringify(this.state.value),
			});
			this.hideLoading();
            if (responseData.success) {
				this.toast("保存成功");
				if(this.props.addPatient){
					this.props.freshlist();
				}else{
					this.props.fresh(true, this.state.value);
				}
				this.props.navigator.pop();
			} else {
				this.toast(responseData.msg);
			}
        } catch (e) {
			this.hideLoading();
            this.handleRequestException(e);
        }
	}

	/**
	 * 异步加获取卡数量
	 */
	async getCardCount() {
        let data = encodeURI(JSON.stringify({
			state: 1,
			patientId: this.state.value.id,
		}));
		try {
			let responseData = await this.request(Global._host + FIND_CARD_URL + '?data=' + data, {
				method: 'GET',
			});
            if (responseData.success) {
				this.renderCardMananger(responseData.result.length);
            }
		} catch (e) {
			this.handleRequestException(e);
		}
	}

	/**
	* 渲染删除常用就诊人按钮
	**/
	renderDelButton() {
		if (this.state.value.id != '') {
			return (
				<View style = {{ flexDirection: 'row', flex: 1 }} >
					<Button text = "删除就诊人" theme={Button.THEME.ORANGE} onPress={() => this.confirmDelete() }/>
					<Separator width = {10} />
				</View>
			);
		}
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
            	{text: '确定', onPress: () => this.delPatient()},
            ]
        );
    }

	/**
	* 删除常用就诊人 需要将绑定该常用就诊人的卡状态置为已删除
	**/
	async delPatient() {
		this.showLoading();
		try {
			let responseData = await this.request(Global._host + DELETE_URL + this.props.userPatient.id, {
				method: 'DELETE',
			});
			this.hideLoading();
            if (responseData.success) {
				let routes = this.props.navigator.getCurrentRoutes();
				this.props.navigator.popToRoute(routes[routes.length - 3]);
				this.props.freshlist();
            }
		} catch (e) {
			this.hideLoading();
			this.handleRequestException(e);
		}
	}

	/**
	* 设置state后，重新更新该常用就诊人绑定的卡数量
	**/
	renderCardMananger (count) {
		this.setState({cardCount:count,});
	}
	
	/**
	* 打开就诊卡管理
	**/
	patientCardManager() {
		this.props.navigator.push({
			component: CardList, 
			hideNavBar: true, 
			value: this.state.value,
			refreshDataSource: this.props.refreshDataSource,
            passProps: {
            	userPatient: this.state.userPatient,
	    		refreshDataSource: this.props.refreshDataSource,
            	getCardCount: this.getCardCount,
            },
    	});
	}

	/**
	* 显示或隐藏添加卡信息
	**/
	renderAddCardForm () {
		if(this.state.addState){
			this.setState({
				addState: false,
			});
		}else{
			this.setState({
				addState: true,
			});
		}
	}

	/**
	 * 渲染临时占位场景
	 */
	_renderPlaceholderView () {
		return (
			<View style = {[Global._styles.CONTAINER, {backgroundColor: '#ffffff'}]}>
			    {this._getNavBar()}
			</View>
		);
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
						<TouchableOpacity style = {[Global._styles.NAV_BAR.BUTTON]} onPress={() => this.submit()}>
							<Text style = {{color:'#fff',fontSize:14,}}>保存</Text>
						</TouchableOpacity>
					</View>
				)} />
		);
	}
}


const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
		backgroundColor: Global._colors.IOS_GRAY_BG,
	},
	fieldSet: {
		borderLeftWidth: 4, 
		borderLeftColor: 'brown', 
		paddingLeft: 10,
		paddingTop: 15,
		paddingBottom: 15, 
		backgroundColor: Global._colors.IOS_GRAY_BG,
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


export default PatientEdit;
