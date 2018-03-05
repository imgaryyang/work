import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Button, Modal, Form, Input, InputNumber, Select, Radio, Spin } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

/* function compare(obj, values) {
  if (typeof obj.id === 'undefined') {
    return false;
  }
  for (const key in obj) {
    if (obj[key] !== values[key]) return true;
  }
  return false;
}*/

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
    if (nextProps.data == null) this.reset();
  }

  reset() {
    this.props.form.resetFields();
  }

  handleCancel() {
    /* const values = this.props.form.getFieldsValue();
    const data = this.props.data;*/
    const changed = false; // compare(values, data);
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
      type: 'dict/setState',
      payload: { record: null },
    });
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const newValues = { ...values };
        this.props.dispatch({
          type: 'dict/save',
          params: newValues,
        });
      }
    });
  }

  handleGroupChange(value) {
    this.props.dispatch({
      type: 'dict/setState',
      payload: {
        selectedGroup: value,
      },
    });
  }

  render() {
    const { tree, selectedType, selectedGroup, spin } = this.props.dict;

    const groupItems = [];
    for (let i = 0; i < tree.length; i += 1) {
      groupItems.push(
        <Option key={tree[i].code + i} value={tree[i].code} >
          {tree[i].code}
        </Option>,
      );
    }

    let typesInGroup = [];
    for (let i = 0; i < tree.length; i += 1) {
      if (tree[i].code === selectedGroup) {
        typesInGroup = tree[i].children;
        break;
      }
    }

    const columnNameItems = [];
    const columnDisItems = [];
    for (let i = 0; i < typesInGroup.length; i += 1) {
      columnNameItems.push(
        <Option key={typesInGroup[i].code + i} value={typesInGroup[i].code} >
          {typesInGroup[i].code}
        </Option>,
      );
      columnDisItems.push(
        <Option key={typesInGroup[i].dis + i} value={typesInGroup[i].dis} >
          {typesInGroup[i].dis}
        </Option>,
      );
    }

    const { getFieldDecorator } = this.props.form;
    const data = this.props.data || {};
    const visible = !!this.props.data;
    const title = data.columnDis ? `修改${data.columnDis}` : '新增数据字典项';

    const formItemLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
      style: { width: '100%' },
    };

    const formItemLayoutColspan = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      style: { width: '100%' },
    };

    // hasFeedback 属性删除，解决firefox无法输入汉字的bug xiaweiyi
    return (
      <Modal
        width={850} title={title} visible={visible} closable
        footer={null} maskClosable={false} onCancel={this.handleCancel}
      >
        <Spin spinning={spin}>
          <Form style={{ paddingRight: '20px' }} >
            <FormItem style={{ display: 'none' }} >
              {getFieldDecorator('id', {
                initialValue: data.id,
              })(
                <Input />,
              )}
            </FormItem>
            <FormItem style={{ display: 'none' }} >
              {getFieldDecorator('hosId', {
                initialValue: data.hosId,
              })(
                <Input />,
              )}
            </FormItem>

            <Row>
              <Col span={8} >
                <FormItem label="分组" {...formItemLayout} >
                  {getFieldDecorator('columnGroup', {
                    initialValue: data.columnGroup ? data.columnGroup : (selectedType.code ? selectedType.group : ''),
                    rules: [{ required: true, message: '分组不能为空' }],
                  })(
                    <Select
                      combobox
                      style={{ width: '100%' }}
                      onChange={this.handleGroupChange}
                      tabIndex={0}
                    >
                      {groupItems}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={8} >
                <FormItem label="类别码" {...formItemLayout} >
                  {getFieldDecorator('columnName', {
                    initialValue: data.columnName ? data.columnName : (selectedType.type === '2' ? selectedType.code : ''),
                    rules: [{ required: true, message: '类别码不能为空' }],
                  })(
                    <Select
                      combobox
                      style={{ width: '100%' }}
                      onChange={this.handleColumnNameChange}
                      tabIndex={1}
                    >
                      {columnNameItems}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={8} >
                <FormItem label="类别名" {...formItemLayout} >
                  {getFieldDecorator('columnDis', {
                    initialValue: data.columnDis ? data.columnDis : (selectedType.type === '2' ? selectedType.dis : ''),
                    rules: [{ required: true, message: '类别名不能为空' }],
                  })(
                    <Select
                      combobox
                      style={{ width: '100%' }}
                      onChange={this.handleColumnDisChange}
                      tabIndex={2}
                    >
                      {columnDisItems}
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={12}>

                <FormItem label="键" {...formItemLayoutColspan} >
                  {getFieldDecorator('columnKey', {
                    initialValue: data.columnKey,
                    rules: [{ required: true, message: '键不能为空' }],
                  })(
                    <Input tabIndex={3} style={{ width: '100%' }} />,
                  )}
                </FormItem>

                <FormItem label="拼音码" {...formItemLayoutColspan} >
                  {getFieldDecorator('spellCode', {
                    initialValue: data.spellCode,
                  })(
                    <Input tabIndex={5} disabled style={{ width: '100%' }} />,
                  )}
                </FormItem>

                <FormItem label="自定义码" {...formItemLayoutColspan} >
                  {getFieldDecorator('userCode', {
                    initialValue: data.userCode,
                  })(
                    <Input tabIndex={7} style={{ width: '100%' }} />,
                  )}
                </FormItem>

                <FormItem label="是否默认" {...formItemLayoutColspan} >
                  {getFieldDecorator('defaulted', {
                    initialValue: typeof data.defaulted === 'undefined' || data.defaulted === null ? false : data.defaulted,
                  })(
                    <RadioGroup tabIndex={9} >
                      <Radio value >是</Radio>
                      <Radio value={false} >否</Radio>
                    </RadioGroup>,
                  )}
                </FormItem>

              </Col>

              <Col span={12} >

                <FormItem label="值" {...formItemLayoutColspan} >
                  {getFieldDecorator('columnVal', {
                    initialValue: data.columnVal,
                    rules: [{ required: true, message: '列值不能为空' }],
                  })(
                    <Input tabIndex={4} style={{ width: '100%' }} />,
                  )}
                </FormItem>

                <FormItem label="五笔码" {...formItemLayoutColspan} >
                  {getFieldDecorator('wbCode', {
                    initialValue: data.wbCode,
                  })(
                    <Input tabIndex={6} disabled style={{ width: '100%' }} />,
                  )}
                </FormItem>

                <FormItem label="排序" {...formItemLayoutColspan} >
                  {getFieldDecorator('sortId', {
                    initialValue: data.sortId,
                    rules: [{ required: true, message: '序号不能为空' }],
                  })(
                    <InputNumber min={1} max={999} tabIndex={8} style={{ width: '100%' }} />,
                  )}
                </FormItem>

                <FormItem label="停用标志" {...formItemLayoutColspan} >
                  {getFieldDecorator('stop', {
                    initialValue: typeof data.stop === 'undefined' ? true : data.stop,
                  })(
                    <RadioGroup tabIndex={10} >
                      <Radio value={false} >停用</Radio>
                      <Radio value >正常</Radio>
                    </RadioGroup>,
                  )}
                </FormItem>

              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ textAlign: 'right' }} >
                <Button type="primary" onClick={this.handleSubmit} style={{ marginRight: '10px' }} icon="save" size="large" >保存</Button>
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
export default connect(
  ({ dict }) => ({ dict }),
)(Editor);

