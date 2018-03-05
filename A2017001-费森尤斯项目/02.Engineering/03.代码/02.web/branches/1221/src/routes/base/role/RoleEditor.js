import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Button, Form, Input, Radio } from 'antd';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class EditorForm extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.reset = this.reset.bind(this);
    this.clear = this.clear.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    const { record } = nextProps.role;
    if (record !== this.props.role.record) {
      if (nextProps.role.record == null) this.reset();
    }
  }
  reset() {
    this.props.form.resetFields();
  }
  clear() {
    this.props.form.resetFields();
    this.props.dispatch({
      type: 'role/setState',
      payload: { record: null },
    });
  }
  /* compare(obj, values) {
    for (const key in obj) {
      if (obj[key] !== values[key]) return true;
    }
    return false;
  }*/
  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        this.props.dispatch({
          type: 'role/save',
          params: values,
        });
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    
    const data = this.props.role.record || {};
    const chanel = this.props.role.chanel;

    const isShow = chanel === 'group' ? '' : 'none';
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    };
    return (
      <Form style={{ paddingRight: '20px' }} >
        <FormItem style={{ display: 'none' }}>
          {
          getFieldDecorator('id', { initialValue: data.id })(<Input />)
        }
        </FormItem>
        <FormItem style={{ display: 'none' }}>
          {
          getFieldDecorator('hosId', { initialValue: data.hosId })(<Input />)
        }
        </FormItem>
        <FormItem style={{ display: 'none' }}>
          {
          getFieldDecorator('creator', { initialValue: data.creator })(<Input />)
        }
        </FormItem>
        <FormItem style={{ display: 'none' }}>
          {
          getFieldDecorator('createTime', { initialValue: data.createTime })(<Input />)
        }
        </FormItem>
        <FormItem style={{ display: 'none' }}>
          {
          getFieldDecorator('updateTime', { initialValue: data.updateTime })(<Input />)
        }
        </FormItem>
        <FormItem style={{ display: 'none' }}>
          {
          getFieldDecorator('updater', { initialValue: data.updater })(<Input />)
        }
        </FormItem>
        <FormItem label="名称" {...formItemLayout}>
          {
           getFieldDecorator('name', {
             initialValue: data.name,
             rules: [{ required: true, message: '名称不能为空' }],
           })(<Input />)
         }
        </FormItem>
        <FormItem label="编码" {...formItemLayout}>
          {
           getFieldDecorator('code', {
             initialValue: data.code,
             rules: [{ required: true, message: '编码不能为空' }],
           })(<Input />)
         }
        </FormItem>
        <FormItem label="是否集团角色" style={{ display: isShow }} {...formItemLayout} >
          {getFieldDecorator('isGroup', { initialValue: data.isGroup || '0' })(
             (
                <RadioGroup tabIndex="26" >
                  <Radio value={'1'}>是</Radio>
                  <Radio value={'0'}>否</Radio>
                </RadioGroup>)
         )}
        </FormItem>
        <FormItem label="描述" {...formItemLayout}>
          {
           getFieldDecorator('description', {
             initialValue: data.description,
           })(<Input type="textarea" rows={4} />)
         }
        </FormItem>

        <div style={{ textAlign: 'right' }} >
          <Button type="primary" onClick={this.handleSubmit} style={{ marginRight: '10px' }} size="large" icon="save" >保存</Button>
          {/* <Button onClick={this.reset} style={{ marginRight: '10px' }} size="large" icon="reload" >重置</Button>*/}
          <Button onClick={this.clear} size="large" icon="reload" >清空</Button>
        </div>
      </Form>
    );
  }
}
const Editor = Form.create()(EditorForm);
export default connect(({ role }) => ({ role }))(Editor);

