import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Tabs, Row, Col, Button, Modal, DatePicker, Form, Input, Select } from 'antd';
import moment from 'moment';

import { arrayToString } from '../../../utils/tools';
import { testMobile, testCnIdNo } from '../../../utils/validation';


const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;

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
    this.close = this.close.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentWillMount() {
   
  }

  reset() {
    this.props.form.resetFields();
  }

  handleCancel() {
    const values = this.props.form.getFieldsValue();
    if (values.bornDate) {
      values.bornDate = values.bornDate.format('YYYY-MM-DD');
    }
    const data = this.props.material.record;
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
      type: 'material/setState',
      payload: {
        record: {},
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
        this.props.dispatch({
          type: 'material/save',
          params: newValues,
        });
       this.props.form.resetFields();
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { spin, record, visible } = this.props.material;
    const title = record && record.name ? `修改${record.name}材料信息` : '新增材料';

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
          <FormItem style={{ display: 'none' }}>
          {
            getFieldDecorator('id', { initialValue: record.id })(<Input />)
          }
        </FormItem>
        <FormItem style={{ display: 'none' }}>
          {
            getFieldDecorator('createTime', { initialValue: record.createTime })(<Input />)
          }
        </FormItem>
            <Row>
              <Col span={12}>
                <FormItem label="材料名称" {...formItemLayout}>
                  {
                    getFieldDecorator('name', {
                      initialValue: record?record.name:'' || '',
                      rules: [{ required: true, message: '材料名称不能为空' }],
                    })(<Input disabled={record.name?true:false} placeholder="材料名称" tabIndex={1} />)
                  }
                </FormItem>
                <FormItem label="单位" {...formItemLayout}>
                  {
                    getFieldDecorator('unit', {
                      initialValue: record.unit,
                      rules: [{ required: true, message: '单位不能为空' }],
                    })(<Select tabIndex={1} placeholder="选择单位" mode="combobox" >
                    		<Option value='卷'>卷</Option>
                    		<Option value='个'>个</Option>
                    		<Option value='包'>包</Option>
                    		<Option value='张'>张</Option>
                    		<Option value='盒'>盒</Option>
                    	</Select>)
                  }
                </FormItem>
              </Col>
              <Col span={12}>
              <FormItem label="数量" {...formItemLayout}>
                {
                  getFieldDecorator('account', {
                    initialValue: record.account,
                    rules: [{ required: true, message: '数量不能为空' }],
                  })(<Input tabIndex={1} placeholder="材料数量" />)
                }
              </FormItem>
              <FormItem label="供应商" {...formItemLayout}>
              {
                getFieldDecorator('supplier', {
                  initialValue: record.supplier,
                  rules: [{ required: true, message: '供应商不能为空' }],
                })(<Input tabIndex={1} placeholder="材料供应商" />)
              }
              </FormItem>
            </Col>
            </Row>
            <Row>
            <Col span={24}>
            <FormItem label="备注" labelCol={{ span: 3 }} wrapperCol={{ span: 20 }} >
              {
                getFieldDecorator('remark', {
                  initialValue: record.remark,
                })(<Input type='textarea' rows={4}  tabIndex={1} />)
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
export default connect(({ material, utils }) => ({ material, utils }))(Editor);

