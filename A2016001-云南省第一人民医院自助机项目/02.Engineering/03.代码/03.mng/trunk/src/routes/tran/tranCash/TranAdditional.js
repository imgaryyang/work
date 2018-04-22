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
      type: 'cashTran/setState',
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
        this.props.dispatch({
          type: 'cashTran/tranAdditional',
          payload: {patientNo, settle},
        });
        this.props.form.resetFields();
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { additionalSpin, additionalVisible } = this.props.cashTran;
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
              </Col>
              <Col span={12}>
	              <FormItem label="预存方式" {...formItemLayout}>
		              {
		                getFieldDecorator('payChannelCode', {
		                  initialValue: '0000',
		                  rules: [
		                    { required: true, message: '预存方式不能为空' },
		                  ],
		                })(<Select  tabIndex={5}>
		                	  <Option value={'0000'}> {'现金'}</Option>
	    	      	      </Select> )
		              }
		            </FormItem>
	                <FormItem label="补录金额" {...formItemLayout}>
	                  {
	                    getFieldDecorator('amt', {
	                      initialValue: '',
	                      rules: [{ required: true, message: '补录金额为空' }],
	                    })(<Input tabIndex={4} />)
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
export default connect(({ cashTran, machine }) => ({ cashTran, machine }))(Additional);

