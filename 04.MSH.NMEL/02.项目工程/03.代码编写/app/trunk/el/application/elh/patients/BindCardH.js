/**
 * 添加卡第二步 根据不同卡类型填写信息
 */
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
} from 'react-native';

import * as Global  from '../../Global';
import Form 		from '../../lib/form/EasyForm';

import NavBar       from 'rn-easy-navbar';
import Button       from 'rn-easy-button';
import Separator    from 'rn-easy-separator';

import WaitingPage  from './WaitingPage';

const FINDCARD_URL 	= 'elh/medicalCard/all/cardTypes';
const SAVE_CARD_URL = 'elh/medicalCard/my/create/';

class BindCardH extends Component {

    static displayName = 'BindCardH';
    static description = '添加健康卡信息';

    static propTypes = {
    };

    static defaultProps = {
    };

    state = {
        value: {
			cardholder: this.props.userPatient.name,
			cardNo: '',
            selorgId:null,
		},
        showLabel: true,
		labelPosition: 'left',
        type: this.props.type,
        cardType: [],
        beSelectOrg: []
    };

    constructor (props) {
        super(props);
        this.clear 			= this.clear.bind(this);
        this.submit 		= this.submit.bind(this);
        this.onChange 		= this.onChange.bind(this);
    }

	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
        this.getCardType();
        this.setFormValue();
	}

    /**
	* 页面初始化赋值，用于修改
	**/
    setFormValue() {
        this.setState({
            value: {
                cardholder: this.props.userPatient.name,
                cardNo: this.state.value.cardNo
            }
        });
    }
    /**
     * 通过cardType获取orgId orgName
    */
    getOrg() {
        let orgObj = {};
        for(let org of this.state.cardType){
             if(org.orgId===this.state.value.selorgId)
                orgObj = org;
        }
        return orgObj;
    }
    render() {
        if (!this.state.doRenderScene)
            return this._renderPlaceholderView();
        let that = this;
        return (
            <View style = {[Global._styles.CONTAINER, { backgroundColor: '#ffffff' }]} >
                {this._getNavBar() }
                <ScrollView style = {styles.scrollView} keyboardShouldPersistTaps={true}>
                    <Form ref = {(c) => that.form = c} showLabel = {this.state.showLabel} labelPosition = {this.state.labelPosition} 
						labelWidth = {100} onChange = {this.onChange} value = {this.state.value} >

                        <View style = {{ borderLeftWidth: 4, borderLeftColor: 'brown', paddingLeft: 10, marginBottom: 6, marginTop: 10 }} ><Text>绑卡基本信息</Text></View>

                        <Form.Picker name = "selorgId" label = "支持发卡机构" placeholder = "请选择机构" required = {true} dataSource = {this.state.beSelectOrg} />
                        <Form.TextInput name = "cardholder" label = "持卡人姓名" required = {true} minLength = {2} maxLength = {20} editable = {false} showClearIcon={false}/>
                        <Form.TextInput name = "cardNo" label = "健康卡卡号" placeholder = "请输入卡号" required = {true} minLength = {6} maxLength = {20} dataType = "number" help = "请输入健康卡卡号" />
                    </Form>

                    <View style = {{ flexDirection: 'row', margin: 20, marginTop: 0, marginBottom: 40 }} >
                        <Button text = "清除" outline = {true} onPress = {this.clear} />
                        <Separator width = {10} />
                        <Button text = "提交" outline = {true} onPress = {this.submit} />
                    </View>
                </ScrollView>
            </View>);
    }

    clear() {
        this.setState({
            value: {
                cardholder: this.props.userPatient.name,
                selorgId: null,
            }
        });
    }

    /**
	* 保存数据
	**/
    async submit() {
        if (!this.form.validate()) {
            return;
        }
        this.showLoading();
        try {
            //添加卡执行    
            // let d = new Date();     
            let responseData = await this.request(Global._host + SAVE_CARD_URL, {
                method: 'POST',
                body: JSON.stringify({
                    patientId: this.props.userPatient.patientId,
                    cardholder: this.props.userPatient.name,
                    idCardNo: this.props.userPatient.idno,
                    state: '1',
                    cardNo: this.state.value.cardNo,
                    orgId: this.state.value.selorgId,
                    orgName: this.getOrg().orgName, //发卡机构名称
                    typeId: this.getOrg().id,
                    typeName: this.getOrg().name, //卡类型名称　
                    // bindedAt: d.getFullYear() + "-" +(d.getMonth()+1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() 
                })
            });
            this.hideLoading();
            if (!responseData.success) {
                this.toast(responseData.msg);
            } else {
                this.props.navigator.push({
                    component: WaitingPage,
                    hideNavBar: true,
                    passProps: {
                        userPatient: this.props.userPatient,
                        card: {
                            patientId: this.props.userPatient.id,
                            cardholder: this.props.userPatient.name,
                            idCardNo: this.props.userPatient.idno,
                            state: '1',
                            cardNo: this.state.value.cardNo,
                            orgId: this.state.value.selorgId,
                            orgName: this.getOrg().orgName, //发卡机构名称
                            typeId: this.getOrg().id,
                            typeName: this.getOrg().name, //卡类型名称　
                            // bindedAt: d.getFullYear() + "-" +(d.getMonth()+1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() 
                        },
                        fresh: this.props.fresh
                    }
                });
            }
            // if (responseData.success) {
            //     this.state.value.cardNo = "";
            //     this.props.refreshDataSource();//后续优化改进
            //     this.getCardType();
            //     this.toast("保存成功");
            // }
        } catch (e) {
            this.hideLoading();
            this.handleRequestException(e);
        }
    }

    onChange(fieldName, fieldValue, formValue) {
        //console.log(arguments);
        this.setState({ value: formValue });
    }

    /**
	 * 异步加获取卡类型和发卡机构
	 */
	async getCardType () {
		try {
			let responseData = await this.request(Global._host + FINDCARD_URL, {
	        	method:'GET',
			});
            if(responseData.success){
				this.renderCardMananger(responseData.result);
            }
		} catch(e) {
			this.handleRequestException(e);
		}
	}

    /**
     * 处理卡类型和发卡机构
    */
    renderCardMananger(result) {
        let sbcardtype = [];
        let orgs = [];
        let newresult;
        let newsbcardtype=[];
        for (let tcard of result) {
            if (tcard.type === '3') {
                sbcardtype.push(tcard);
            }
        }
        newresult = sbcardtype;
        if (sbcardtype.length > 0) {
            if(this.props.hadcard.length>0){
                for (let card of this.props.hadcard) {
                    newsbcardtype = sbcardtype.filter(selected =>
                        selected.id !== card.typeId
                    );
                }
            }else{
                newsbcardtype = sbcardtype;
            }
            newsbcardtype.map((enmv, index) => {
                orgs.push({ label: enmv.orgName, value: enmv.orgId });
            });
            this.setState({
                cardType: newresult,
                beSelectOrg: orgs
            });
        }
    }

    // /**
    //  * 健康卡信息
    // */
    // _renderCard2() {
    //     <Form ref = {(c) => this.form = c} config = {FormConfig} showLabel = {this.state.showLabel} labelPosition = {this.state.labelPosition}
    //         labelWidth = {70} onChange = {this.onChange} value = {this.state.value} >
    //         <Form.Picker name = "orgId" label = "医院" placeholder = "请选择医院"
    //             required = {true}  dataSource = {this.hospitals} type = "multi" display = "col" />
    //         <Form.Picker name = "typeId" label = "类型" placeholder = "请选择类型"
    //             required = {true}  dataSource = {this.cardTypes} type = "multi" display = "col" />
    //         <Form.TextInput name = "cardNo" label = "卡号" placeholder = "请输入卡号"
    //             required = {true} minLength = {1} maxLength = {20} />
    //     </Form>
    // }
    
    // /**
    //  * 就诊卡信息
    // */
    // _renderCard3() {
    //     <Form ref = {(c) => this.form = c} config = {FormConfig} showLabel = {this.state.showLabel} labelPosition = {this.state.labelPosition}
    //         labelWidth = {70} onChange = {this.onChange} value = {this.state.value} >
    //         <Form.Picker name = "orgId" label = "医院" placeholder = "请选择医院"
    //             required = {true}  dataSource = {this.hospitals} type = "multi" display = "col" />
    //         <Form.Picker name = "typeId" label = "类型" placeholder = "请选择类型"
    //             required = {true}  dataSource = {this.cardTypes} type = "multi" display = "col" />
    //         <Form.TextInput name = "cardNo" label = "卡号" placeholder = "请输入卡号"
    //             required = {true} minLength = {1} maxLength = {20} />
    //     </Form>
    // }
	
    _renderPlaceholderView () {
		return (
			<View style = {Global._styles.CONTAINER}>
			    {this._getNavBar()}
			</View>
		);
	}

	_getNavBar () {
		return (
			<NavBar title = '填写卡信息' 
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
		backgroundColor: '#fff'
	},
});

export default BindCardH;