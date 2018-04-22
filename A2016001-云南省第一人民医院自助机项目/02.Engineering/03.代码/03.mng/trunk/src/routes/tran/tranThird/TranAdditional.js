import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Tabs, Row, Col, Button, Modal, DatePicker, Form, Input, Select } from 'antd';
import { arrayToString } from '../../../utils/tools';
import MachineSelect 		from '../../../components/MachineSelect';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

class AdditionalForm extends Component {

  constructor(props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.close = this.close.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentWillMount() {
	 const { dicts } = this.props.machine;
	 if(!dicts || dicts.length < 1){
		 this.props.dispatch({
			 type: 'machine/initDicts',
		 });
	 }
  }

  /* componentWillReceiveProps(nextProps) {
    if (nextProps.data == null) {
      this.reset();
    }
  } */

  reset() {
    this.props.form.resetFields();
  }

  handleCancel() {
	  Modal.confirm({
	    title: '确认',
	    content: '放弃保存您的修改？',
	    okText: '放弃',
	    cancelText: '我再看看',
	    onOk: () => { this.close(); },
	  });
  }

  close() {
    this.props.dispatch({
      type: 'thridTran/setState',
      payload: {
        additionalVisible: false,
        additionalSpin: false,
      },
    });
    this.props.form.resetFields();
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const {patientNo, ...settle} = values;
        var respText = this.getRespText(settle);
        var pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
        var tradeTime = moment().format('YYYY') + settle.transDate + settle.transTime;
        settle.tradeRspCode = '00';
        settle.tradeRspMsg = '交易成功';
        settle.respText = respText;
        settle.payerAcctType = this.getCardType(settle.payerAcctType);
        settle.tradeTime = tradeTime.replace(pattern, '$1-$2-$3 $4:$5:$6');  
        this.props.dispatch({
          type: 'thridTran/tranAdditional',
          payload: {patientNo, settle},
        });
        this.props.form.resetFields();
      }
    });
  }
  getRespText(settlement){
	var respCode 	= "00".rightPad(2," ");// 	2 应答码
	var respInfo	= "交易成功".rightPad(40-4," ");// 40 应答码说明信息（汉字 GBK 2个字符）
	var cardNo 		= settlement.payerAccount.rightPad(20," ");//20 交易卡号
	var amount 		= (""+(settlement.amt*100)).leftPad(12,"0");//12 金额
	var trace 		= "123456".rightPad(6," ");	//6 终端流水号（凭证号）
	var batch 		= "123456".rightPad(6," ");	//6 批次号
	var transDate 	= settlement.transDate.rightPad(4," ");	//4 交易日期MMDD
	var transTime 	= settlement.transTime.rightPad(6," ");	//6 交易时间hhmmss
	var ref 		= settlement.tradeNo.rightPad(12," ");//12 系统参考号
	var auth 		= "".rightPad(6," ");//6 授权号
	var mid 		= "".rightPad(15," ");//15 商户号
	var tid 		= settlement.terminalCode.rightPad(8," ");// 8 终端号
	var memo 		= ("0x_"+settlement.payerAcctType).rightPad(1024-settlement.payerAcctType.length," ");// 1024 48域附加信息
	var lrc 		= "123".rightPad(3," ");//3个校验字符
	var resp = respCode+respInfo+cardNo+amount+trace+batch+transDate+transTime+ref+auth+mid+tid+memo+lrc;
	console.info("补录报文",resp)
	return resp;
  }
  getCardType(cardTypeName){
	  var cardType = '';
	  if ("借记卡" == cardTypeName || "储蓄卡" == cardTypeName) {
		  cardType = "1";
	  } else if ("贷记卡" == cardTypeName || "信用卡" == cardTypeName || cardTypeName.indexOf().indexOf("贷记") != -1) {
		  cardType = "0";
	  }
	  return cardType;
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { additionalSpin, additionalVisible } = this.props.thridTran;
    const title = '新增补录记录';
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };

    return (
      <Modal
        width={850}
        title={title}
        visible={additionalVisible}
        closable
        footer={null}
        maskClosable={false}
        onCancel={this.handleCancel}
      >
        <Spin spinning={additionalSpin} >
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Col span={12}>
              	<FormItem label="患者健康号" {...formItemLayout}>
                  {
                    getFieldDecorator('patientNo', {
                      initialValue: '',
                      rules: [{ required: true, message: '患者健康号不能为空' }],
                    })(<Input tabIndex={1} />)
                  }
                </FormItem>
                <FormItem label="机器" {...formItemLayout}>
                  {
                      getFieldDecorator('machineId', {
                    	  required: true, message: '机器不能为空'
                      })(
                        <MachineSelect tabIndex={13} />,
                      )
                  }
                </FormItem>
                <FormItem label="银行卡" {...formItemLayout}>
                {
                	  getFieldDecorator('payerAccount', {
                         initialValue: '',
                         rules: [{ required: true, message: '银行卡不能为空' }],
                       })(<Input tabIndex={1} />)
                }
                </FormItem>
                <FormItem label="银行" {...formItemLayout}>
                {
                	  getFieldDecorator('payerAcctBank', {
                         initialValue: '',
                         rules: [{ required: true, message: '银行不能为空' }],
                       })(<Input tabIndex={1} />)
                }
                </FormItem>
                <FormItem label="交易日期" {...formItemLayout}>
                {
                	getFieldDecorator('transDate', {
                		initialValue: '',
                		rules: [{ required: true, message: '交易时间不能为空' }],
                	})(<Input tabIndex={4} />)
                }
                </FormItem>
                <FormItem label="结算单号" {...formItemLayout}>
                {
                	getFieldDecorator('settleNo', {
                        initialValue: '',
                        rules: [{ required: true, message: '结算单号不能为空' }],
                      })(<Input tabIndex={1} />)
                }
                </FormItem>
              </Col>
              <Col span={12}>
	              <FormItem label="预存方式" {...formItemLayout}>
		              {
		                getFieldDecorator('payChannelCode', {
		                  initialValue: '0306',
		                  rules: [
		                    { required: true, message: '预存方式不能为空' },
		                  ],
		                })(<Select  tabIndex={5}>
		                	  <Option value={'0306'}> {'广发'}</Option>
		                	  <Option value={'0308'}> {'招商'}</Option>
	    	      	      </Select> )
		              }
		            </FormItem>
	                <FormItem label="交易金额" {...formItemLayout}>
	                  {
	                    getFieldDecorator('amt', {
	                      initialValue: '',
	                      rules: [{ required: true, message: '补录金额不能为空' }],
	                    })(<Input tabIndex={4} />)
	                  }
	                </FormItem>
	                <FormItem label="卡类型" {...formItemLayout}>
	                  {
	                    getFieldDecorator('payerAcctType', {
	                      initialValue: '',
	                      rules: [{ required: true, message: '卡类型不能为空' }],
	                    })(<Input tabIndex={4} />)
	                  }
	                </FormItem>
	                <FormItem label="终端号" {...formItemLayout}>
	                  {
	                    getFieldDecorator('terminalCode', {
	                      initialValue: '',
	                      rules: [{ required: true, message: '终端号不能为空' }],
	                    })(<Input tabIndex={4} />)
	                  }
	                </FormItem>
	                <FormItem label="交易时间" {...formItemLayout}>
	                {
	                	getFieldDecorator('transTime', {
	                		initialValue: '',
	                		rules: [{ required: true, message: '交易时间不能为空' }],
	                	})(<Input tabIndex={4} />)
	                }
	                </FormItem>
	                <FormItem label="流水号" {...formItemLayout}>
	                {
	                	getFieldDecorator('tradeNo', {
	                        initialValue: '',
	                        rules: [{ required: true, message: '流水号不能为空' }],
	                      })(<Input tabIndex={1} />)
	                }
	                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={23} style={{ textAlign: 'right' }} >
                <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }} icon="save" size="large" >保存</Button>
                <Button onClick={this.reset} icon="reload" size="large" >重置</Button>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>
    );
  }
}
const Additional = Form.create()(AdditionalForm);
export default connect(({ thridTran, machine }) => ({ thridTran, machine }))(Additional);

