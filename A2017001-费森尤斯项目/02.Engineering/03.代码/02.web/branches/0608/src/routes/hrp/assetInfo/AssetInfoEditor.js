import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Button, Form, Input, InputNumber, Spin, Modal } from 'antd';

import { testNumber } from '../../../utils/validation';
import DictSelect from '../../../components/DictSelect';
import DictRadioGroup from '../../../components/DictRadioGroup';
import CompanySelect from '../../../components/searchInput/CompanySearchInput';
import AsyncTreeCascader from '../../../components/AsyncTreeCascader';

const FormItem = Form.Item;

class EditorForm extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.resetData = this.resetData.bind(this);
    this.onSelectCompany = this.onSelectCompany.bind(this);
    this.onSelectAssetsType = this.onSelectAssetsType.bind(this);
  }

  componentWillMount() {
  }

  componentWillReceiveProps(newProps) {
    if (newProps.asset.resetForm) {
      this.props.dispatch({
        type: 'asset/setState',
        payload: {
          record: {},
          resetForm: false,
        },
      });
      this.props.form.resetFields();
    }
  }

  onSelectCompany(item) {
    // console.log('item:', item);
    this.props.dispatch({
      type: 'asset/setState',
      payload: {
        record: {
          ...this.props.asset.record,
          companyInfo: item,
        },
      },
    });
  }

  onSelectAssetsType(item) {
    // console.log('item:', item);
    this.props.dispatch({
      type: 'asset/setState',
      payload: {
        record: {
          ...this.props.asset.record,
          instrmType: item.key,
        },
      },
    });
  }

  handleReset() {
    this.resetData();
  }

  handleSubmit() {
    const { record } = this.props.asset;
    this.props.form.validateFields((err, values) => {
      // console.log(values);
      if (err) return;
      this.props.dispatch({
        type: 'asset/save',
        params: {
          ...record,
          ...values,
          producer: record.companyInfo.id,
        },
      });
    });
  }

  handleCancel() {
    this.props.dispatch({
      type: 'asset/setState',
      payload: {
        isSpin: false,
        editorSpin: false,
        visible: false,
        record: {},
      },
    });
    this.props.form.resetFields();
  }

  resetData() {
    this.props.dispatch({
      type: 'asset/setState',
      payload: {
        record: {},
      },
    });
    this.props.form.resetFields();
  }

  render() {
    const { editorSpin, visible, record } = this.props.asset;
    const { getFieldDecorator } = this.props.form;
    const title = record.drugCode ? `修改资产信息：${record.commonName}` : '新增资产信息';

    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };

    return (
      <Modal
        width={1080}
        title={title}
        visible={visible}
        closable
        footer={null}
        maskClosable={false}
        onCancel={this.handleCancel}
        wrapClassName="vertical-center-modal"
      >
        <Spin spinning={editorSpin} >
          <Form>
            <Row>
              <Col span={6} >
                <FormItem label="资产编码" {...formItemLayout} >
                  { getFieldDecorator('instrmCode', {
                    initialValue: record.instrmCode,
                  })(<Input style={{ width: '100%' }} disabled />) }
                </FormItem>
              </Col>
              <Col span={6} >
                <FormItem label="自定义码" {...formItemLayout} >
                  { getFieldDecorator('userCode', {
                    initialValue: record.userCode,
                    rules: [
                      { max: 20, message: '自定义码不能超过20个字符' },
                    ],
                  })(<Input style={{ width: '100%' }} maxLength={20} />) }
                </FormItem>
              </Col>
              <Col span={6} >
                <FormItem label="中心码" {...formItemLayout} >
                  { getFieldDecorator('centerCode', {
                    initialValue: record.centerCode,
                    rules: [
                      { max: 20, message: '中心码不能超过20个字符' },
                    ],
                  })(<Input style={{ width: '100%' }} maxLength={20} />) }
                </FormItem>
              </Col>
              <Col span={6} >
                <FormItem label="条形码" {...formItemLayout} >
                  { getFieldDecorator('barcode', {
                    initialValue: record.barcode,
                    rules: [
                      { max: 30, message: '条形码不能超过30个字符' },
                    ],
                  })(<Input style={{ width: '100%' }} maxLength={30} />) }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={6} >
                {/* <FormItem style={{ display: 'none' }} >
                  { getFieldDecorator('instrmType', {
                    initialValue: record.instrmType,
                  })(
                    <Input />,
                  )}
                </FormItem>*/}
                <FormItem label="资产类别" {...formItemLayout} >
                  {
                    getFieldDecorator('instrmType', {
                      initialValue: record.instrmType ? JSON.parse(record.instrmType) : [],
                      rules: [
                        { required: true, message: '请选择资产类别' },
                      ],
                    })(
                      <AsyncTreeCascader
                        dictType="ASSETS_TYPE"
                        placeholder="选择资产类别"
                        style={{ width: '100%' }}
                        allowClear
                        onChange={this.onSelectAssetsType}
                      />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={6} >
                <FormItem label="资产名称" {...formItemLayout} >
                  { getFieldDecorator('commonName', {
                    initialValue: record.commonName,
                    rules: [
                      { required: true, message: '请填写资产名称' },
                      { max: 100, message: '资产名称不能超过100个字符' },
                    ],
                  })(<Input style={{ width: '100%' }} maxLength={100} />) }
                </FormItem>
              </Col>
              <Col span={6} >
                <FormItem label="拼音码" {...formItemLayout} >
                  { getFieldDecorator('commonSpell', {
                    initialValue: record.commonSpell,
                    rules: [
                      { max: 50, message: '资产名称拼音码不能超过50个字符' },
                    ],
                  })(<Input style={{ width: '100%' }} maxLength={50} />) }
                </FormItem>
              </Col>
              <Col span={6} >
                <FormItem label="五笔码" {...formItemLayout} >
                  { getFieldDecorator('commonWb', {
                    initialValue: record.commonWb,
                    rules: [
                      { max: 50, message: '资产名称五笔码不能超过50个字符' },
                    ],
                  })(<Input style={{ width: '100%' }} maxLength={50} />) }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={6} >
                <FormItem label="停用标识" {...formItemLayout} >
                  { getFieldDecorator('stopFlag', {
                    initialValue: record.stopFlag || '1',
                  })(
                    <DictRadioGroup
                      columnName="STOP_FLAG"
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={6} >
                <FormItem label="资产别名" {...formItemLayout} >
                  { getFieldDecorator('alias', {
                    initialValue: record.alias,
                    rules: [
                      { max: 100, message: '资产别名不能超过100个字符' },
                    ],
                  })(<Input style={{ width: '100%' }} maxLength={100} />) }
                </FormItem>
              </Col>
              <Col span={6} >
                <FormItem label="拼音码" {...formItemLayout} >
                  { getFieldDecorator('aliasSpell', {
                    initialValue: record.aliasSpell,
                    rules: [
                      { max: 50, message: '资产别名拼音码不能超过50个字符' },
                    ],
                  })(<Input style={{ width: '100%' }} maxLength={50} />) }
                </FormItem>
              </Col>
              <Col span={6} >
                <FormItem label="五笔码" {...formItemLayout} >
                  { getFieldDecorator('aliasWb', {
                    initialValue: record.aliasWb,
                    rules: [
                      { max: 50, message: '资产别名五笔码不能超过50个字符' },
                    ],
                  })(<Input style={{ width: '100%' }} maxLength={50} />) }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={6} >
                <FormItem style={{ display: 'none' }} >
                  { getFieldDecorator('producer', {
                    initialValue: record.companyInfo ? record.companyInfo.id : '',
                  })(
                    <Input />,
                  )}
                </FormItem>
                <FormItem label="生产厂家" {...formItemLayout}>
                  {
                    getFieldDecorator('selectedProducer', {
                      initialValue: record.companyInfo ? record.companyInfo.companyName : '',
                    })(
                      <CompanySelect
                        companyType={['1']}
                        services={['3']}
                        onSelect={this.onSelectCompany}
                        style={{ width: '100%' }}
                      />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={6} >
                <FormItem label="型号" {...formItemLayout} >
                  { getFieldDecorator('batchNo', {
                    initialValue: record.batchNo,
                    rules: [
                      { max: 30, message: '型号不能超过30个字符' },
                    ],
                  })(<Input style={{ width: '100%' }} maxLength={30} />) }
                </FormItem>
              </Col>
              <Col span={6} >
                <FormItem label="规格" {...formItemLayout} >
                  { getFieldDecorator('instrmSpecs', {
                    initialValue: record.instrmSpecs,
                    rules: [
                      { max: 100, message: '规格不能超过100个字符' },
                    ],
                  })(<Input style={{ width: '100%' }} maxLength={100} />) }
                </FormItem>
              </Col>
              <Col span={6} >
                <FormItem label="单位" {...formItemLayout} >
                  {
                    getFieldDecorator('instrmUnit', {
                      initialValue: record.instrmUnit,
                    })(
                      <DictSelect
                        columnName="ASSET_UNIT"
                        placeholder="选择单位"
                        style={{ width: '100%' }}
                        valueField="val"
                        allowClear
                      />,
                    )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={6} >
                <FormItem label="采购价" {...formItemLayout} >
                  { getFieldDecorator('buyPrice', {
                    initialValue: typeof record.buyPrice === 'undefined' || record.buyPrice === null ? '' : record.buyPrice,
                  })(<InputNumber style={{ width: '100%' }} maxLength={8} max={99999999999999.9999} />) }
                </FormItem>
              </Col>
              <Col span={6} >
                <FormItem label="零售价" {...formItemLayout} >
                  { getFieldDecorator('salePrice', {
                    initialValue: typeof record.salePrice === 'undefined' || record.salePrice === null ? '' : record.salePrice,
                  })(<InputNumber style={{ width: '100%' }} maxLength={8} max={99999999999999.9999} />) }
                </FormItem>
              </Col>
              <Col span={6} >
                <FormItem label="折旧时间" {...formItemLayout} >
                  { getFieldDecorator('limitMonth', {
                    initialValue: typeof record.limitMonth === 'undefined' || record.limitMonth === null ? '' : record.limitMonth,
                    rules: [
                      { validator: (rule, value, callback) => {
                        if (!testNumber(value)) callback('请填写数字');
                        else callback();
                      } },
                    ],
                  })(
                    <Input style={{ width: '100%' }} maxLength={8} max={99999999999999.9999} addonAfter="个月" />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ textAlign: 'right' }} >
                <Button size="large" type="primary" onClick={this.handleSubmit} icon="save" style={{ marginRight: '10px' }}>保存</Button>
                <Button size="large" onClick={this.handleReset} icon="reload">重置</Button>
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
  ({ asset, utils }) => ({ asset, utils }),
)(Editor);
