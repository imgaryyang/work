import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Tabs, Row, Col, Button, Modal, DatePicker, Form, Input, Select } from 'antd';
import moment from 'moment';

import { arrayToString } from '../../../utils/tools';

const Option = Select.Option;
const FormItem = Form.Item;

class EditorForm extends Component {

  constructor(props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.close = this.close.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentWillMount() {
  }

  reset() {
    this.props.form.resetFields();
  }

  handleCancel() {
	  this.close();
  }

  close() {
    this.props.dispatch({
      type: 'cash/setState',
      payload: {
        spin: false,
        visible: false,
      },
    });
    this.props.form.resetFields();
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const newValues = { ...values };
        if (newValues.batchDay) {
          newValues.batchDay = newValues.batchDay.format('YYYY-MM-DD');
        }
        const { batchDay,payChannelCode }  =  { ...newValues}
        const w = window.open('about:blank');
        w.location.href = `/api/ssm/pay/cash/batch/export/${batchDay}/${payChannelCode}`;
      }
      this.close();
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { spin, visible } = this.props.cash;

    const title = '导出清钞记录';

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };

    return (
      <Modal
        width={850}
        title={title}
        visible={visible}
        closable
        footer={null}
        maskClosable={false}
        onCancel={this.handleCancel}
      >
        <Spin spinning={spin} >
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Col span={12}>
                <FormItem label="清钞日期" {...formItemLayout}>
                  {
                    getFieldDecorator('batchDay', {initialValue:moment(moment().format('YYYY-MM-DD')),})(<DatePicker tabIndex={8} format={'YYYY-MM-DD'} style={{ width: '100%' }} />)
                  }
                </FormItem>
              </Col>
              <Col span={12}>
	              <FormItem label="清钞银行" {...formItemLayout}>
	              {
	            	  getFieldDecorator('payChannelCode')(
	    	      		  <Select style ={{width:'100px'}}>
	    	      		  <Option value={'0306'}> {'广发银行'}</Option>
	    	      		  <Option value={'0308'}> {'招商银行'}</Option>
	    	      		  <Option value={'0103'}> {'农业银行'}</Option>
	    	      		  <Option value={'0301'}> {'交通银行'}</Option>
	    	      	      </Select> )
	              }
	            </FormItem>
	          </Col>
            </Row>
            <Row>
	            <Col span={23} style={{ textAlign: 'right' }} >
	              <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }} icon="download" size="large" >导出</Button>
	              <Button onClick={this.reset} icon="reload" size="large" >重置</Button>
	            </Col>
	         </Row>
          </Form>
        </Spin>
      </Modal>
    );
  }
}
const Editor = Form.create()(EditorForm);
export default connect(({ cash, utils }) => ({ cash, utils }))(Editor);

