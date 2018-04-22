import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Tabs, Row, Col, Button, Modal, DatePicker, Form, Input, Select } from 'antd';
import moment from 'moment'; 

import { arrayToString } from '../../../../utils/tools';
import { testMobile, testCnIdNo } from '../../../../utils/validation';
import MachineSelect 		from '../../../../components/MachineSelect';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

function compare(obj, values) {
  for (const key in obj) {
    if (obj[key] !== values[key]) {
      return true;
    }
  }
  return false;
}

class EditorForm extends Component {

  constructor(props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChangeMaterial = this.onChangeMaterial.bind(this);
    this.close = this.close.bind(this);
    this.reset = this.reset.bind(this);
  }

  
  
  reset() {
    this.props.form.resetFields();
  }

  handleCancel() {
    const values = this.props.form.getFieldsValue();
    if (values.bornDate) {
      values.bornDate = values.bornDate.format('YYYY-MM-DD');
    }
    const data = this.props.outMaterialDetail.record;
    const changed = compare(values, data);
    if (changed) {
      Modal.confirm({
        title: '确认',
        content: '放弃保存您的修改？',
        okText: '放弃',
        cancelText: '我再看看',
        onOk: () => { this.close(); },
      });
    } else {
      this.close();
    }
  }

  close() {
    this.props.dispatch({
      type: 'outMaterialDetail/setState',
      payload: {
        record: {},
        spin: false,
        outVisible: false,
      },
    });
    this.props.form.resetFields();
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const newValues = { ...values };
        this.props.dispatch({
          type: 'outMaterialDetail/save',
          params: newValues,
        });
       this.props.form.resetFields();
      }
    });
  }
  onChangeMaterial(value){
	  this.props.dispatch({
		  type: 'outMaterialDetail/selectAccount',
		  payload: value,
	  });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { spin, record, outVisible, materials, account } = this.props.outMaterialDetail;
    const options = materials.map(d => <Option key={d.id}>{d.name}</Option>);
    const title = '出库信息';
    const limit = account?'库存为'+account:'';
    const { material, id, outPutAccount, machine } = record;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    return (
      <Modal
        width={850}
        title={title}
        visible={outVisible}
        closable
        footer={null}
        maskClosable={false}
        onCancel={this.handleCancel}
      >
        <Spin spinning={spin} >
          <Form onSubmit={this.handleSubmit}>
          <FormItem style={{ display: 'none' }}>
          {
            getFieldDecorator('id', { initialValue: id })(<Input />)
          }
        </FormItem>
            <Row>
	          <Col span={12}>
	            <FormItem label="自助机编号"  {...formItemLayout}>
	              {
	                getFieldDecorator('machine.id', {
	                  initialValue: record.machine?record.machine.id:"" || '',
	                  rules: [{ required: true, message: '自助机编号不能为空' }],
	                })(<MachineSelect disabled={record.machine?true:false} tabIndex={1} />)
	              }
	            </FormItem>
	            <FormItem label="出库数量" {...formItemLayout}>
	              {
	                getFieldDecorator('outPutAccount', {
	                  initialValue: outPutAccount || '',
	                  rules: [{ required: true, message: '出库数量不能为空' }],
	                })(<Input placeholder={ limit } tabIndex={3} />)
	              }
	            </FormItem> 
	          </Col>
              <Col span={12}>
                <FormItem label="材料名称" {...formItemLayout}>
                  {
                    getFieldDecorator('material.id', {
                      initialValue: record.material?record.material.id:"" || '',
                      rules: [{ required: true, message: '材料名称不能为空' }],
                    })(<Select disabled={record.material?true:false} onChange={this.onChangeMaterial} tabIndex={5}>
	              	  		{options}
			      		</Select>)
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
const Editor = Form.create()(EditorForm);
export default connect(({ outMaterialDetail, utils, machine }) => ({ outMaterialDetail, utils, machine }))(Editor);

