import { connect } from 'dva';
import React, { Component } from 'react';
import { Row, Col, Button, Form, Input, Icon, Modal, Spin } from 'antd';

import DictCheckboxGroup from '../../../components/DictCheckboxGroup';
import DictRadioGroup from '../../../components/DictRadioGroup';

const FormItem = Form.Item;

class EditorForm extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = ::this.handleSubmit;
    this.handleReset = ::this.handleReset;
    this.handleCancel = ::this.handleCancel;
  }

  componentWillReceiveProps(newProps) {
    if (newProps.company.resetForm) {
      this.handleReset();
      this.props.dispatch({
        type: 'company/setState',
        payload: {
          resetForm: false,
        },
      });
    }
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.props.dispatch({
        type: 'company/save',
        params: values,
      });
    });
  }

  handleReset() {
    this.props.form.resetFields();
  }

  handleCancel() {
    this.props.dispatch({
      type: 'company/setState',
      payload: {
        isSpin: false,
        editorSpin: false,
        visible: false,
        record: {},
      },
    });
    this.props.form.resetFields();
  }

  render() {
    const { company, form } = this.props;
    const { record, editorSpin, visible } = company;
    const { getFieldDecorator } = form;
    const title = record.companyName ? `修改 ${record.companyName} 信息` : '新增厂商信息';

    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      style: { width: '100%' },
    };

    const formItemLayoutColspan2 = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      style: { width: '100%' },
    };

    return (
      <Modal
        width={600}
        title={title}
        visible={visible}
        closable
        footer={null}
        maskClosable={false}
        wrapClassName="vertical-center-modal" // modal-padding-0
        onCancel={this.handleCancel}
      >
        <Spin spinning={editorSpin}>
          <Form>
            <FormItem style={{ display: 'none' }}>
              {getFieldDecorator('id', { initialValue: record.id })(<Input />)}
            </FormItem>
            <FormItem style={{ display: 'none' }}>
              {getFieldDecorator('companyId', { initialValue: record.companyId })(<Input />)}
            </FormItem>
            <Row>
              <Col span={12}>
                <FormItem label="厂商编码" {...formItemLayout} >
                  { getFieldDecorator('companyCode', {
                    initialValue: record.companyCode,
                  })(
                    <Input disabled style={{ width: '100%' }} />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="用户编码" {...formItemLayout} >
                  { getFieldDecorator('userCode', {
                    initialValue: record.userCode,
                    rules: [
                      { max: 30, message: '用户编码不能超过30个字符' },
                    ],
                  })(
                    <Input maxLength={30} style={{ width: '100%' }} />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem label="厂商名称" {...formItemLayoutColspan2} >
                  { getFieldDecorator('companyName', {
                    initialValue: record.companyName,
                    rules: [
                      { required: true, message: '厂商名称不能为空' },
                      { max: 100, message: '厂商名称不能超过100个字符' },
                    ],
                  })(
                    <Input maxLength={100} style={{ width: '100%' }} />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem label="服务范围" {...formItemLayout}>
                  { getFieldDecorator('services', {
                    initialValue: record.services ? JSON.parse(record.services) : [],
                    rules: [
                      { required: true, message: '请选择服务范围' },
                    ],
                  })(
                    <DictCheckboxGroup
                      columnName="COMPANY_SERVICES"
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="厂商类型" {...formItemLayout}>
                  { getFieldDecorator('companyType', {
                    initialValue: record.companyType ? JSON.parse(record.companyType) : [],
                    rules: [
                      { required: true, message: '请选择厂商类型' },
                    ],
                  })(
                    <DictCheckboxGroup
                      columnName="COMPANY_TYPE"
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem label="拼音码" {...formItemLayout} >
                  { getFieldDecorator('phoneticCode', {
                    initialValue: record.phoneticCode,
                    rules: [
                      { max: 100, message: '拼音码不能超过100个字符' },
                    ],
                  })(
                    <Input maxLength={100} style={{ width: '100%' }} />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="五笔码" {...formItemLayout} >
                  { getFieldDecorator('wangCode', {
                    initialValue: record.wangCode,
                    rules: [
                      { max: 100, message: '五笔码不能超过100个字符' },
                    ],
                  })(
                    <Input maxLength={100} style={{ width: '100%' }} />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem label="自定义搜索码" {...formItemLayout} >
                  { getFieldDecorator('userSearchCode', {
                    initialValue: record.userSearchCode,
                    rules: [
                      { max: 100, message: '自定义搜索码不能超过100个字符' },
                    ],
                  })(
                    <Input maxLength={100} style={{ width: '100%' }} />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="停用标志" {...formItemLayout}>
                  { getFieldDecorator('stopFlag', {
                    initialValue: record.stopFlag || '1',
                    rules: [
                      { required: true, message: '请选择停用标志' },
                    ],
                  })(
                    <DictRadioGroup
                      columnName="STOP_FLAG"
                      buttonMode
                      style={{ width: '100%' }}
                      buttonStyle={{ width: '50%', textAlign: 'center' }}
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>

            <div style={{ textAlign: 'right' }} >
              <Button size="large" type="primary" onClick={this.handleSubmit} style={{ marginRight: '10px' }}>
                <Icon type={editorSpin ? 'loading' : 'save'} />保存
              </Button>
              <Button size="large" onClick={this.handleReset}>
                <Icon type="reload" />重置
              </Button>
            </div>
          </Form>
        </Spin>
      </Modal>
    );
  }
}

const Editor = Form.create()(EditorForm);
export default connect(
  ({ company }) => ({ company }),
)(Editor);
