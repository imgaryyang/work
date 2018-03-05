import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Row, Col, Button, Modal, DatePicker, Form, Input } from 'antd';
import moment from 'moment';

import CompanySelect from '../../../components/searchInput/MaterialCompanySearchInput';
import MaterialSelect from '../../../components/searchInput/MaterialSearchInput';
// import CommonItemSearchInput from '../../../components/searchInput/CommonItemSearchInput';
import DictRadioGroup from '../../../components/DictRadioGroup';
import CompanySearchInput from '../../../components/searchInput/CompanySearchInput';

const FormItem = Form.Item;

class EditorForm extends Component {

  constructor(props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.close = this.close.bind(this);
    this.reset = this.reset.bind(this);
    this.onSelectCompany = this.onSelectCompany.bind(this);
    this.onSelectMaterial = this.onSelectMaterial.bind(this);
  }

  componentWillMount() {
    /* this.props.dispatch({
      type: 'utils/initDataSource',
      payload: ['companyInfo'],
    });*/
  }

  onSelectCompany(item) {
    // console.log('item:', item);
    this.props.dispatch({
      type: 'credential/setState',
      payload: {
        record: { ...this.props.credential.record, producer: item.id, producerName: item.companyName },
      },
    });
  }

  onSelectMaterial(item) {
    // console.log('item:', item);
    this.props.dispatch({
      type: 'credential/setState',
      payload: {
        record: { ...this.props.credential.record, tradeName: item.commonName },
      },
    });
  }

  reset() {
    this.props.form.resetFields();
  }

  handleCancel() {
    this.close();
  }

  close() {
    this.props.dispatch({
      type: 'credential/setState',
      payload: {
        record: {},
        spin: false,
        editorSpin: false,
        visible: false,
      },
    });
    this.props.form.resetFields();
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      if (!err) {
        const newValues = { ...values };
        if (newValues.regStartDate) {
          newValues.regStartDate = moment(newValues.regStartDate).format('YYYY-MM-DD');
        }
        if (newValues.regStopDate) {
          newValues.regStopDate = moment(newValues.regStopDate).format('YYYY-MM-DD');
        }
        if (newValues.createTime) {
          newValues.createTime = moment(newValues.createTime).format('YYYY-MM-DD');
        }
        if (newValues.producer) {
          newValues.producer = { id: newValues.producer };
        }
        const { producer, ...rest } = newValues;
        this.props.dispatch({
          type: 'credential/save',
          params: { ...this.props.credential.record, ...rest },
        });
        this.props.form.resetFields();
      }
    });
  }

  render() {
    const { form, credential } = this.props;
    const { getFieldDecorator } = form;
    const { editorSpin, record, visible } = credential;

    const title = record.id ? `修改证书信息：${record.regNo}` : '新增证书信息';

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
        width={900}
        title={title}
        visible={visible}
        closable
        footer={null}
        maskClosable={false}
        onCancel={this.handleCancel}
      >
        <Spin spinning={editorSpin} >
          <Form >
            <Row>
              <Col span={8} >
                <FormItem label="证书ID" {...formItemLayout}>
                  {
                    getFieldDecorator('regId', {
                      initialValue: record.regId,
                    })(<Input style={{ width: '100%' }} disabled />)
                  }
                </FormItem>
              </Col>
              <Col span={8} >
                <FormItem label="证书号" {...formItemLayout}>
                  {
                    getFieldDecorator('regNo', {
                      initialValue: record.regNo,
                      rules: [
                        { required: true, message: '证书号不能为空' },
                        { max: 30, message: '证书号长度不能超过30个字符' },
                      ],
                    })(<Input style={{ width: '100%' }} />)
                  }
                </FormItem>
              </Col>
              <Col span={8} >
                <FormItem label="证书名称" {...formItemLayout}>
                  {
                    getFieldDecorator('regName', {
                      initialValue: record.regName,
                      rules: [
                        { required: true, message: '证书名称不能为空' },
                        { max: 30, message: '证书名称长度不能超过100个字符' },
                      ],
                    })(<Input style={{ width: '100%' }} />)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8} >
                <FormItem style={{ display: 'none' }} >
                  { getFieldDecorator('producer', {
                    initialValue: record.producer,
                  })(
                    <Input />,
                  )}
                </FormItem>
                <FormItem label="厂商" {...formItemLayout}>
                  {
                    getFieldDecorator('producerName', {
                      initialValue: record.producerName,
                      /* rules: [
                        { required: true, message: '请选择厂商' },
                      ],*/
                    })(
                      <CompanySearchInput
        	          companyType={['1']}
        	          services={['2']}
        	          onSelect={this.onSelectCompany}
                        style={{ width: '100%' }}
                      />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8} >
                <FormItem style={{ display: 'none' }} >
                  { getFieldDecorator('tradeName', {
                    initialValue: record.tradeName,
                  })(
                    <Input />,
                  )}
                </FormItem>
                <FormItem label="产品名称" {...formItemLayout}>
                  {
                    getFieldDecorator('tradeName1', {
                      initialValue: record.tradeName,
                      /* rules: [
                        { required: true, message: '产品名称不能为空' },
                      ],*/
                    })(
                      <MaterialSelect
                        onSelect={this.onSelectMaterial}
                        style={{ width: '100%' }}
                      />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8} >
                <FormItem label="状态" {...formItemLayout}>
                  {
                    getFieldDecorator('stopFlag', {
                      initialValue: record.stopFlag || '1',
                    })(
                      <DictRadioGroup columnName="STOP_FLAG" style={{ width: '100%' }} />,
                    )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8} >
                <FormItem label="开始时间" {...formItemLayout}>
                  {
                    getFieldDecorator('regStartDate', {
                      initialValue: typeof record.regStartDate !== 'undefined' && record.regStartDate !== null ? moment(record.regStartDate) : null,
                      rules: [
                        { required: true, message: '开始时间不能为空' },
                      ],
                    })(
                      <DatePicker style={{ width: '100%' }} />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8} >
                <FormItem label="结束时间" {...formItemLayout}>
                  {
                    getFieldDecorator('regStopDate', {
                      initialValue: typeof record.regStopDate !== 'undefined' && record.regStopDate !== null ? moment(record.regStopDate) : null,
                      rules: [
                        { required: true, message: '结束时间不能为空' },
                      ],
                    })(
                      <DatePicker style={{ width: '100%' }} />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8} >
                <FormItem label="登记时间" {...formItemLayout}>
                  {
                    getFieldDecorator('createTime', {
                      initialValue: typeof record.createTime !== 'undefined' && record.createTime !== null ? moment(record.createTime) : '',
                    })(
                      <DatePicker style={{ width: '100%' }} disabled />,
                    )
                  }
                </FormItem>
              </Col>
            </Row>

            <div style={{ textAlign: 'right' }} >
              <Button type="primary" style={{ marginRight: '10px' }} icon="save" size="large" onClick={this.handleSubmit} >保存</Button>
              <Button onClick={this.reset} icon="reload" size="large" >重置</Button>
            </div>

          </Form>
        </Spin>
      </Modal>
    );
  }
}
const Editor = Form.create()(EditorForm);
export default connect(
  ({ credential, utils }) => ({ credential, utils }),
)(Editor);
