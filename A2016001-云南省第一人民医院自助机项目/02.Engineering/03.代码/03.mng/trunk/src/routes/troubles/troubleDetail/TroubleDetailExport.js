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
      type: 'troubleDetail/setState',
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
        console.log('newValues',newValues);
        if (newValues.createDay) {
          newValues.createDay = newValues.createDay.format('YYYY-MM-DD');
        }
        const { createDay,code }  =  { ...newValues}
        const w = window.open('about:blank');
        w.location.href = `/api/ssm/troubleDetail/export/${createDay}/${code}`;
      }
      this.close();
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { spin, visible } = this.props.troubleDetail;

    const title = '导出出库记录';

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
                <FormItem label="出库日期" {...formItemLayout}>
                  {
                    getFieldDecorator('createDay', 
                    {
                    	initialValue:moment(moment().format('YYYY-MM-DD')),
                    	rules: [{ required: true, message: '出库日期不能为空' }],
                    })
                    (<DatePicker tabIndex={8} format={'YYYY-MM-DD'} style={{ width: '100%' }} />)
                  }
                </FormItem>
              </Col>
              <Col span={12}>
	              <FormItem label="机器类型" {...formItemLayout}>
	              {
	            	  getFieldDecorator('code',{rules: [{ required: true, message: '出库日期不能为空' }],})(
	    	      		  <Select style ={{width:'100px'}}>
	    	      		  <Option value={'GF%'}> {'广发银行'}</Option>
	    	      		  <Option value={'ZH%'}> {'招商银行'}</Option>
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
export default connect(({ troubleDetail, utils }) => ({ troubleDetail, utils }))(Editor);

