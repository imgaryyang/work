'use strict';


import React, {
    Component,
    
} from 'react';

import {
	StyleSheet,
	ScrollView,
	View,
	Text,
	Image,
	TouchableOpacity,
	InteractionManager,
    Alert,
} from 'react-native';

import * as Global 	from '../../Global';
import Icon 		from 'react-native-vector-icons/Ionicons';
import t 			from 'tcomb-form-native';
import TcombStylesThin from '../../lib/tcomb-form/TcombStylesThin';
import TcombSelect 	from '../../lib/tcomb-form/TcombSelect';
import ImageSelect 	from '../../lib/tcomb-form/ImageSelect';

import NavBar 		from 'rn-easy-navbar';
import Button       from 'rn-easy-button';
import Separator    from 'rn-easy-separator';

import SamList 		from './SampleList';


//import InputPayPwd from '../lib/InputPayPwd');

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#ffffff',
	},
	sv: {
		paddingLeft: 20,
		paddingRight: 20,
	},
	paddingPlace: {
		flex: 1,
		height: 20,
	},
	
	portrait: {
		width: (Global.getScreen().width - 90) / 4,
		height: (Global.getScreen().width - 90) / 4,
	},

	iconOnPortrait: {
		backgroundColor: 'transparent',
		position: 'absolute',
		top: 3,
		left: 3,
	},
});

var Form = t.form.Form;
t.form.Form.stylesheet = TcombStylesThin;

var Person = t.struct({
	id: t.maybe(t.String),
	name: t.String,
	gender: t.String,
	portrait: t.String,
	gender1: t.maybe(t.String),
	gender2: t.maybe(t.String),
});

const FIND_URL 		= 'samperson/findOne';
const SUBMIT_URL 	= 'samperson/save';

class SampleEdit extends Component {

    static displayName = 'SampleEdit';
    static description = '表单样例';

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
		loaded: false,
		value: {
			id: this.props.id,
		},
		showLoading: false,
	};

    constructor (props) {
        super(props);

        this.getOptions 		= this.getOptions.bind(this);
        this.fetchData 			= this.fetchData.bind(this);
        this.save 				= this.save.bind(this);
        this.saveWhenError 		= this.saveWhenError.bind(this);
        this.doSave 			= this.doSave.bind(this);
        this.onFormChange 		= this.onFormChange.bind(this);
        this.addOther 			= this.addOther.bind(this);
        this.goBackToList 		= this.goBackToList.bind(this);
        this.afterPwdChecked 	= this.afterPwdChecked.bind(this);
    }

	componentDidMount () {
		console.log('TcombStylesThin:');
		console.log(TcombStylesThin);
		console.log(t.form.Form.stylesheet);
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
			if(this.props.id && this.props.id != '')
				this.fetchData();
		});
	}

	getOptions () {
		return {
			fields: {
				id: {
					hidden: true,
				},
				name: {
					label: '姓名',
					error: '姓名必须填写且长度不能超过50个字符',
					help: '请填写您的姓名',
				},
				gender: {
					label: '性别',
					factory: TcombSelect,
					type: 'single',
					display: 'one-row',
					disabled: false,
					options: {
						'1': '男',
						'0': '女',
					},
					icon: (<Icon name = 'ios-checkmark-circle-outline' size = {18} color = {Global._colors.IOS_DARK_GRAY} style = {[Global._styles.ICON, {marginRight: 10,}]} />),
					activeIcon: (<Icon name = 'ios-checkmark-circle' size = {18} color = {Global._colors.ORANGE} style = {[Global._styles.ICON, {marginRight: 10,}]} />),
					help: 'Choose gender pls.',
					error: '请选择性别',
				},
				portrait: {
					label: '头像',
					factory: ImageSelect,
					type: 'single',
					display: 'row',
					disabled: false,
					options: {
						'head01.jpg': (<Image style = {[styles.portrait]} resizeMode = 'cover'  source = {{uri: Global._iSEB_host + "images/person/portrait/" + 'head01.jpg'}} />),
						'head02.jpg': (<Image style = {[styles.portrait]} resizeMode = 'cover'  source = {{uri: Global._iSEB_host + "images/person/portrait/" + 'head02.jpg'}} />),
						'head03.jpg': (<Image style = {[styles.portrait]} resizeMode = 'cover'  source = {{uri: Global._iSEB_host + "images/person/portrait/" + 'head03.jpg'}} />),
						'head04.jpg': (<Image style = {[styles.portrait]} resizeMode = 'cover'  source = {{uri: Global._iSEB_host + "images/person/portrait/" + 'head04.jpg'}} />),
						'head05.jpg': (<Image style = {[styles.portrait]} resizeMode = 'cover'  source = {{uri: Global._iSEB_host + "images/person/portrait/" + 'head05.jpg'}} />),
						'u0003.jpg':  (<Image style = {[styles.portrait]} resizeMode = 'cover'  source = {{uri: Global._iSEB_host + "images/person/portrait/" + 'u0003.jpg' }} />),
					},
					icon: (<Icon name = 'ios-checkmark-circle' size = {18} color = '#ffffff' style = {[Global._styles.ICON, styles.iconOnPortrait]} />),
					activeIcon: (<Icon name = 'ios-checkmark-circle' size = {18} color = {Global._colors.ORANGE} style = {[Global._styles.ICON, styles.iconOnPortrait]} />),
					error: '请选择头像',
				},
				gender1: {
					label: '性别1',
					factory: TcombSelect,
					type: 'multi',
					display: 'row',
					disabled: false,
					options: {
						'1': '男',
						'0': '女',
						'2': '不男不女',
						'3': '亦男亦女',
						'4': '男女莫辨',
						'5': '焉能辨我是雌雄',
					},
					icon: (<Icon name = 'ios-checkmark-circle-outline' size = {18} color = {Global._colors.IOS_DARK_GRAY} style = {[Global._styles.ICON, {marginRight: 10,}]} />),
					activeIcon: (<Icon name = 'ios-checkmark-circle' size = {18} color = {Global._colors.ORANGE} style = {[Global._styles.ICON, {marginRight: 10,}]} />),
					error: '请选择性别',
				},
				gender2: {
					label: '性别2',
					factory: TcombSelect,
					type: 'multi',
					display: 'col',
					disabled: false,
					options: {
						'1': '男',
						'0': '女',
						'2': '不男不女',
						'3': '亦男亦女',
					},
					icon: (<Icon name = 'ios-checkmark-circle-outline' size = {18} color = {Global._colors.IOS_DARK_GRAY} style = {[Global._styles.ICON, {marginRight: 10,}]} />),
					activeIcon: (<Icon name = 'ios-checkmark-circle' size = {18} color = {Global._colors.ORANGE} style = {[Global._styles.ICON, {marginRight: 10,}]} />),
					error: '请选择性别',
				},
			},
		};
	}

	async fetchData () {
		this.showLoading();
		try {
			let responseData = await this.request(Global._iSEB_host + FIND_URL, {
				body: JSON.stringify({
					id: this.props.id,
				})
			});
			this.hideLoading();
			this.setState({
				value: responseData.body,
				loaded: true,
			});
		} catch(e) {
			this.handleRequestException(e);
		}
	}

	/**
	* 保存数据
	*/
	save () {
		var value = this.refs.form.getValue();
		if(value)
			this.doSave(value);
	}

	/**
	* 测试报错
	*/
	saveWhenError () {
		var value = this.refs.form.getValue();
		//console.log('in saveWhenError.');
		if(value) {
			var v = {
				id: value.id,
				name: null,
				gender: value.gender,
				portrait: value.portrait,
			}
			this.doSave(v);
		}
	}

	async doSave (value) {
    	this.showLoading();
		try {
			var body = JSON.stringify(value);
			let responseData = await this.request(Global._iSEB_host + SUBMIT_URL, {
				body: body,
			});
			this.hideLoading();
			//回调list的刷新
			this.props.refresh.call();
			this.props.navigator.pop();
			this.toast('保存用户信息成功！');

		} catch(e) {
			this.handleRequestException(e);
		}
	}

	/**
	* 为表单绑定 onChange 事件，表单中的任何元素更改都会触发此方法
	* value: 表单所有元素的值，本例中为 {id : '', name: '', gender: '' ... }
	* objName: 触发此事件的元素，类型为数组（支持多个元素同时触发？），如 name 被更改时，传入的值为 ['name']
	*/
	onFormChange (value, objName) {
	}

	addOther () {
		//console.log(this.props.backRoute);
		//this.toast(JSON.stringify(this.props.backRoute));
        this.props.navigator.push({
            title: "Add Another",
            component: SampleEdit,
            passProps: {
            	backRoute: this.props.backRoute,
            },
        });
	}

	goBackToList () {
		this.props.navigator.popToRoute(this.props.backRoute);
	}

	/*callPwdCheck: function() {
		this.props.navigator.push({
			component: InputPayPwd,
			hideNavBar: true,
			passProps: {
				pwdChecked: this.afterPwdChecked,
			},
		});
	},*/

	afterPwdChecked () {
		//TODO:添加密码校验后业务逻辑
		this.toast('支付成功！');
		this.props.navigator.replace({
            title: "Add Another",
            component: SampleEdit,
            passProps: {
            	backRoute: this.props.backRoute,
            },
        });
		//this.props.navigator.popToRoute(this.props.backRoute);
	}

	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		return (
			<View style = {[Global._styles.CONTAINER, styles.container]}>
				<ScrollView style = {styles.sv}>
					<View style = {styles.paddingPlace} />
					<Form
						ref = "form"
						type = {Person}
						options = {this.getOptions()}
						value = {this.state.value}
						onChange = {this.onFormChange} />
					<View style = {{flex: 1, flexDirection: 'row', marginTop: 10,}}>
				    	<Button text = "取消" onPress = {() => this.props.navigator.pop()} />
				    	<Separator style = {{flex: 0.05}} />
				    	<Button text = "保存" onPress = {this.save} />
					</View>
				    <Button text = "测试报错" onPress = {this.saveWhenError} theme = {Button.THEME.ORANGE} style = {{marginTop: 10}} />

					<View style = {{flex: 1, flexDirection: 'row', marginTop: 10,}}>
				    	<Button text = "继续添加" onPress = {this.addOther} />
				    	<Separator style = {{flex: 0.05}} />
				    	<Button text = "回到列表" onPress = {this.goBackToList} />
					</View>

				    <Button text = "测试密码键盘" onPress = {this.callPwdCheck} theme = {Button.THEME.ORANGE} style = {{marginTop: 10}} />

					<Separator height = {40} />
			    </ScrollView>
			</View>
		);
	}

	_renderPlaceholderView () {
		return (
			<View style = {[Global._styles.CONTAINER, styles.container]} ></View>
		);
	}

}

export default SampleEdit;
