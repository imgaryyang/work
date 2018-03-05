import React, { Component } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Row, Col, Button, Modal, Form, Input, Radio, Spin } from 'antd';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

function compare(obj, values) {
  if (typeof obj.id === 'undefined') {
    return false;
  }
  for (const key in obj) {
    if (obj[key] !== values[key]) return true;
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
    this.handleGroupChange = this.handleGroupChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.record == null) this.reset();
  }

  reset() {
    this.props.form.resetFields();
  }

  handleCancel() {
    const values = this.props.form.getFieldsValue();
    const record = this.props.record;
    const changed = compare(values, record);
    if (changed) {
      Modal.confirm({
        title: '确认',
        content: '您要放弃保存您所作的修改吗？',
        okText: '放弃',
        cancelText: '我再看看',
        onOk: () => {
          this.close();
        },
      });
    } else {
      this.close();
    }
  }

  close() {
    this.props.dispatch({
      type: 'ctrlParam/setState',
      payload: { record: null },
    });
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'ctrlParam/save',
          params: values,
        });
      }
    });
  }

  handleGroupChange(value) {
    this.props.dispatch({
      type: 'ctrlParam/setState',
      payload: {
        selectedGroup: value,
      },
    });
  }

  render() {
    const { selectedType, spin } = this.props.ctrlParam;
    const { getFieldDecorator } = this.props.form;
    const record = this.props.record || {};
    const visible = !_.isNull(this.props.record);
    const isCreate = !_.isEmpty(this.props.record);
    const title = record.controlNote ? `修改 - ${record.controlNote}` : '新增控制参数';
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
    };

    // const optionArray = _.uniq(_.map(data, 'controlClass'));
    //
    // const options = optionData => optionData.map((item) => {
    //   return (
    //     <Option key={item}>
    //       {item}
    //     </Option>
    //   );
    // });

    return (
      <Modal
        width={600} title={title} visible={visible} closable
        footer={null} maskClosable={false} onCancel={this.handleCancel}
      >
        <Spin spinning={spin}>
          <Form>
            <FormItem style={{ display: 'none' }} >
              {getFieldDecorator('id', { initialValue: record.id })(<Input />)}
            </FormItem>
            <FormItem style={{ display: 'none' }} >
              {getFieldDecorator('hosId', { initialValue: record.hosId })(<Input />)}
            </FormItem>
            <Row>
              <Col span={24} >
                <FormItem label="控制分类" {...formItemLayout} >
                  {getFieldDecorator('controlClass', {
                    initialValue: record.controlClass ? record.controlClass : (selectedType.type === '2' ? selectedType.code : ''),
                    rules: [{ required: true, message: '控制分类码不能为空' }],
                  })(
                    <Input tabIndex={1} />,
                    // <Select
                    //   tabIndex={1}
                    //   onChange={this.handleChange}
                    // >
                    //   {options(optionArray)}
                    // </Select>,
                  )}
                </FormItem>
                <FormItem label="控制id" {...formItemLayout} >
                  {getFieldDecorator('controlId', {
                    initialValue: record.controlId,
                    rules: [{ required: true, message: '控制id不能为空' }],
                  })(
                    <Input tabIndex={2} disabled={isCreate} />,
                  )}
                </FormItem>
                <FormItem label="控制说明" {...formItemLayout} >
                  {getFieldDecorator('controlNote', {
                    initialValue: record.controlNote,
                    rules: [{ required: true, message: '控制说明不能为空' }],
                  })(
                    <Input tabIndex={3} />,
                  )}
                </FormItem>
                <FormItem label="控制参数" {...formItemLayout} >
                  {getFieldDecorator('controlParam', {
                    initialValue: record.controlParam,
                  })(
                    <Input tabIndex={4} />,
                  )}
                </FormItem>
                <FormItem label="停用标志" {...formItemLayout} >
                  {getFieldDecorator('stopFlag', {
                    initialValue: record.stopFlag || _.isUndefined(record.stopFlag),
                  })(
                    <RadioGroup tabIndex={5} >
                      <Radio value={false} >停用</Radio>
                      <Radio value >正常</Radio>
                    </RadioGroup>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={23} style={{ textAlign: 'right' }} >
                <Button type="primary" style={{ marginRight: '10px' }} icon="save" size="large" onClick={this.handleSubmit} >保存</Button>
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
export default connect(({ ctrlParam }) => ({ ctrlParam }))(Editor);
