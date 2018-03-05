import { connect } from 'dva';
import React, { Component } from 'react';
import { Row, Col, Button, Form, Input, Icon, Modal, Spin, DatePicker, notification, Checkbox } from 'antd';
import moment from 'moment';
import DictCheckboxGroup from '../../../components/DictCheckboxGroup';
import DictRadioGroup from '../../../components/DictRadioGroup';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

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
      if (err) return;
      if (values.licenseSdate !== '' && values.licenseEdate != null) {
        const sdate=values.licenseSdate.format('YYYY-MM-DD');
        const edate=values.licenseEdate.format('YYYY-MM-DD');
        if (sdate >= edate) {
          notification.error({
            message: '提示',
            description: '证照开始时间必须小于证照结束时间！',
          });
          return;
        }
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
    const { record, editorSpin, visible, chanel } = company;
    const { getFieldDecorator } = form;
    const title = record.companyName ? `修改 ${record.companyName} 信息` : '新增厂商信息';
    const servicesOptions = [{ label: '药品', value: '1', disabled: !(chanel === 'drug' || chanel === 'group' || chanel === 'operate') }, { label: '物资', value: '2', disabled: !(chanel === 'material' || chanel === 'group' || chanel === 'operate') }, { label: '资产', value: '3', disabled: !(chanel === 'hrp' || chanel === 'group' || chanel === 'operate') }];
    const companyTypeOptions = [{ label: '生产厂家', value: '1' }, { label: '供货商', value: '2', disabled: (chanel === 'drug' || chanel === 'material' || chanel === 'hrp') }];
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
              {getFieldDecorator('chanel', { initialValue: chanel })(<Input />)}
            </FormItem>
            <Row>
              <Col span={12}>
                <FormItem label="厂商编码" {...formItemLayout} >
                  { getFieldDecorator('companyId', {
                    initialValue: record.companyId,
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
                  })(<CheckboxGroup options={servicesOptions} />,
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
                      <CheckboxGroup options={companyTypeOptions} />,
                    /*<DictCheckboxGroup
                      columnName="COMPANY_TYPE"
                    />,*/
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem label="拼音码" {...formItemLayout} >
                  { getFieldDecorator('companySpell', {
                    initialValue: record.companySpell,
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
                  { getFieldDecorator('companyWb', {
                    initialValue: record.companyWb,
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
            <Row>
              <Col span={12}>
                <FormItem label="税号" {...formItemLayout} >
                  { getFieldDecorator('taxNumber', {
                    initialValue: record.taxNumber,
                    rules: [
                      { max: 128, message: '税号不能超过 128 个字符' },
                    ],
                  })(
                    <Input maxLength={128} style={{ width: '100%' }} />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="中心码" {...formItemLayout} >
                  { getFieldDecorator('centerCode', {
                    initialValue: record.centerCode,
                    rules: [
                      { max: 20, message: '中心码不能超过20个字符' },
                    ],
                  })(
                    <Input maxLength={20} style={{ width: '100%' }} />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem label="证照号" {...formItemLayout} >
                  { getFieldDecorator('licenseNo', {
                    initialValue: record.licenseNo,
                    rules: [
                      { max: 100, message: '拼音码不能超过100个字符' },
                    ],
                  })(
                    <Input maxLength={100} style={{ width: '100%' }} />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem label="证照开始时间" {...formItemLayout} >
                  { getFieldDecorator('licenseSdate', {
                    initialValue: record.licenseSdate ? moment(record.licenseSdate, 'YYYY-MM-DD') : null,
                  })(<DatePicker format={'YYYY-MM-DD'} style={{ width: '100%' }} />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="证照结束时间" {...formItemLayout} >
                  { getFieldDecorator('licenseEdate', {
                    initialValue: record.licenseEdate ? moment(record.licenseEdate, 'YYYY-MM-DD') : null,
                  })(<DatePicker format={'YYYY-MM-DD'} style={{ width: '100%' }} />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem label="GSP证照号" {...formItemLayout} >
                  { getFieldDecorator('GSPlicenseNo', {
                    initialValue: record.gsplicenseNo,
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
                <FormItem label="GSP开始时间" {...formItemLayout} >
                  { getFieldDecorator('GSPlicenseSdate', {
                    initialValue: record.gsplicenseSdate ? moment(record.gsplicenseSdate, 'YYYY-MM-DD') : null,
                  })(<DatePicker format={'YYYY-MM-DD'} style={{ width: '100%' }} />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="GSP结束时间" {...formItemLayout} >
                  { getFieldDecorator('GSPlicenseEdate', {
                    initialValue: record.gsplicenseEdate ? moment(record.gsplicenseEdate, 'YYYY-MM-DD') : null,
                  })(<DatePicker format={'YYYY-MM-DD'} style={{ width: '100%' }} />,
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
