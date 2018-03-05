import React, { Component } from 'react';
import { Row, Col, Button, Form, Input, Radio, Icon, message, Spin } from 'antd';
import { isEmpty, isUndefined, round, multiply, divide } from 'lodash';
import CommonModal from '../../../components/CommonModal';
import DictSelect from '../../../components/DictSelect';
import DataSourceSelect from '../../../components/DataSourceSelect';
import NumberInput from '../../../components/NumberInput';
import Styles from './DrugInfo.less';

import CompanySearchInput from '../../../components/searchInput/CompanySearchInput';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class EditorForm extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = ::this.handleSubmit;
    this.handleReset = ::this.handleReset;
    this.handleSelectChange = ::this.handleSelectChange;
    
    this.companySelectEvent = ::this.companySelectEvent;
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDataSource',
      payload: ['companyInfo', 'frequency'],
    });
  }

  componentWillReceiveProps(nextProps) {
    /* 通知提示 */
    const { success, msg } = nextProps.result;
    if (!isEmpty(nextProps.result)) {
      if (success) {
        message.success('保存成功！', 4);
      } else {
        message.warning(msg, 4);
      }
      this.props.dispatch({
        type: 'drugInfo/setState',
        payload: { result: {} },
      });
    }
  }

  handleReset() {
    this.props.form.resetFields();
  }

  handleSubmit() {
    const { record } = this.props;
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log('values:', values);
      this.props.dispatch({
        type: 'drugInfo/save',
        params: values,
      });
      if (isEmpty(record)) {
        this.handleReset();
      }
    });
  }

  handleSelectChange = (value) => {
    const { form } = this.props;
    const price = form.getFieldValue('buyPrice');
    const buyPrice = parseInt(price, 10) || 0.00;
    const priceCase = parseInt(value, 10);
    const salePrice = buyPrice + divide(multiply(buyPrice, priceCase), 100);
    form.setFieldsValue({
      salePrice: round(salePrice, 2),
    });
  }
  
  companySelectEvent(value) {
	 console.log('companySelectEvent value:', value);
	 this.props.form.setFieldsValue({
		producer: value.id,
    });
  }

  render() {
    const { namespace, record, form, isSpin, visible, formCache, shortcuts } = this.props;
    const { getFieldDecorator } = this.props.form;
    const title = record.drugCode ? `修改药品信息：${record.commonName}` : '新增药品信息';
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
    };

    return (
      <CommonModal
        namespace={namespace}
        style={{ top: 20 }}
        width={1080}
        title={title}
        visible={visible}
        form={form}
        submit={this.handleSubmit}
        reset={this.handleReset}
        shortcuts={shortcuts}
        formCache={formCache}
      >
        <Spin spinning={isSpin}>
          <Form>
            <FormItem style={{ display: 'none' }}>
              {getFieldDecorator('id', { initialValue: record.id || '' })(<Input />)}
            </FormItem>
            <FormItem style={{ display: 'none' }}>
	          {getFieldDecorator('producer', { initialValue: record.companyInfo ? record.companyInfo.id : ''  })(<Input />)}
	        </FormItem>
            <Row className={Styles.drugInfo}>
              <Col span={8}>
                <FormItem label="药品编码" {...formItemLayout}>
                  {
                    getFieldDecorator('drugCode', { initialValue: record.drugCode })(<Input disabled placeholder="自动生成" />)
                  }
                </FormItem>
                <FormItem label="通用名称" {...formItemLayout}>
                  { getFieldDecorator('commonName', {
                    initialValue: record.commonName || '',
                    rules: [
                      {
                        required: true,
                        message: '通用名称不能为空',
                      },
                    ],
                  })(<Input tabIndex="4" />) }
                </FormItem>
                <FormItem label="药品规格" {...formItemLayout}>
                  { getFieldDecorator('drugSpecs', {
                    initialValue: record.drugSpecs,
                  })(<Input disabled placeholder="自动生成" tabIndex="7" />) }
                </FormItem>
                <FormItem label="包装数量" {...formItemLayout}>
                  { getFieldDecorator('packQty', {
                    initialValue: record.packQty,
                    rules: [
                      {
                        required: true,
                        message: '包装数量不能为空',
                      },
                    ],
                  })(
                    <NumberInput
                      numberType="currency"
                      size="large"
                      tabIndex="10"
                    />,
                  ) }
                </FormItem>
                <FormItem label="药品性质" {...formItemLayout}>
                  { getFieldDecorator('drugQuality', { initialValue: record.drugQuality || '1' })(
                    <DictSelect
                      showSearch
                      style={{ width: '100%' }}
                      tabIndex="13"
                      columnName="DRUG_QUALITY"
                    />,
                  )}
                </FormItem>
                <FormItem label="药品条码" {...formItemLayout}>
                  { getFieldDecorator('barcode', { initialValue: record.barcode })(<Input tabIndex="16" />) }
                </FormItem>
                <FormItem label="抗菌药编码" {...formItemLayout}>
                  { getFieldDecorator('antCode', { initialValue: record.antCode })(<Input tabIndex="19" />) }
                </FormItem>
                <FormItem label="加价方案" {...formItemLayout}>
                  { getFieldDecorator('priceCase', {
                    initialValue: record.priceCase,
                    onChange: this.handleSelectChange,
                  })(
                    <DictSelect
                      showSearch
                      style={{ width: '100%' }}
                      tabIndex="22"
                      columnName="PRICE_CASE"
                    />,
                  )}
                </FormItem>
                <FormItem label="需要皮试" {...formItemLayout}>
                  {
                    getFieldDecorator('isskin', {
                      initialValue: record.isskin || false,
                    })(
                      <RadioGroup tabIndex="25">
                        <Radio value>是</Radio>
                        <Radio value={false}>否</Radio>
                      </RadioGroup>)
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="药品分类" {...formItemLayout}>
                  { getFieldDecorator('drugType', { initialValue: record.drugType })(
                    <DictSelect
                      showSearch
                      style={{ width: '100%' }}
                      tabIndex="2"
                      columnName="DRUG_TYPE"
                    />,
                  )}
                </FormItem>
                <FormItem label="商品名称" {...formItemLayout}>
                  { getFieldDecorator('tradeName', { initialValue: record.tradeName || '' })(<Input tabIndex="5" />) }
                </FormItem>
                <FormItem label="基本剂量" {...formItemLayout}>
                  { getFieldDecorator('baseDose', {
                    initialValue: record.baseDose,
                    rules: [
                      {
                        required: true,
                        message: '基本剂量不能为空',
                      },
                    ],
                  })(
                    <NumberInput
                      numberType="currency"
                      size="large"
                      tabIndex="8"
                    />,
                  ) }
                </FormItem>
                <FormItem label="最小单位" {...formItemLayout}>
                  { getFieldDecorator('miniUnit', {
                    initialValue: record.miniUnit,
                    rules: [
                      {
                        required: true,
                        message: '最小单位不能为空',
                      },
                    ],
                  })(
                    <DictSelect
                      showSearch
                      style={{ width: '100%' }}
                      tabIndex="11"
                      columnName="MINI_UNIT"
                    />,
                  ) }
                </FormItem>
                <FormItem label="剂型编码" {...formItemLayout}>
                  { getFieldDecorator('dosage', { initialValue: record.dosage })(
                    <DictSelect
                      showSearch
                      style={{ width: '100%' }}
                      tabIndex="14"
                      columnName="DOSAGE"
                    />,
                  )}
                </FormItem>
                <FormItem label="物价编码" {...formItemLayout}>
                  { getFieldDecorator('priceCode', { initialValue: record.priceCode })(<Input tabIndex="17" />) }
                </FormItem>
                <FormItem label="用法编码" {...formItemLayout}>
                  { getFieldDecorator('usage', { initialValue: record.usage })(
                    <DictSelect
                      showSearch
                      style={{ width: '100%' }}
                      tabIndex="20"
                      columnName="USAGE"
                    />,
                  )}
                </FormItem>
                <FormItem label="售价" {...formItemLayout}>
                  { getFieldDecorator('salePrice', {
                    initialValue: record.salePrice,
                    rules: [
                      {
                        required: true,
                        message: '售价不能为空',
                      },
                    ],
                  })(
                    <NumberInput
                      numberType="currency4"
                      addonBefore="¥"
                      size="large"
                      tabIndex="23"
                      className={Styles.drugInfo_currencyInput}
                    />,
                  ) }
                </FormItem>
                <FormItem label="处方药" {...formItemLayout}>
                  {
                    getFieldDecorator('isrecipe', {
                      initialValue: record.isrecipe || false,
                    })(
                      <RadioGroup tabIndex="26">
                        <Radio value>是</Radio>
                        <Radio value={false}>否</Radio>
                      </RadioGroup>)
                    }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="自定义码" {...formItemLayout}>
                  { getFieldDecorator('userCode', { initialValue: record.userCode })(<Input tabIndex="3" />) }
                </FormItem>
                <FormItem label="生产厂家" {...formItemLayout}>
                  { getFieldDecorator('producerName', { initialValue: record.companyInfo ? record.companyInfo.companyName : ''  })(
                    /*<DataSourceSelect
                      showSearch
                      style={{ width: '100%' }}
                      tabIndex="6"
                      codeName="companyInfo"
                    />,*/
                		  <CompanySearchInput
                    
            	          companyType={['1']}
            	          services={['1']}
            	          onSelect={this.companySelectEvent}
                		  
            	          style={{ width: '100%' }} /> 
                    
                  )}
                </FormItem>
                <FormItem label="剂量单位" {...formItemLayout}>
                  { getFieldDecorator('doseUnit', {
                    initialValue: record.doseUnit,
                    rules: [
                      {
                        required: true,
                        message: '剂量单位不能为空',
                      },
                    ],
                  })(
                    <DictSelect
                      showSearch
                      style={{ width: '100%' }}
                      tabIndex="12"
                      columnName="DOSE_UNIT"
                    />,
                  ) }
                </FormItem>
                <FormItem label="包装单位" {...formItemLayout}>
                  { getFieldDecorator('packUnit', {
                    initialValue: record.packUnit,
                    rules: [
                      {
                        required: true,
                        message: '包装单位不能为空',
                      },
                    ],
                  })(
                    <DictSelect
                      showSearch
                      style={{ width: '100%' }}
                      tabIndex="12"
                      columnName="PACK_UNIT"
                    />,
                  ) }
                </FormItem>
                <FormItem label="国标准字" {...formItemLayout}>
                  { getFieldDecorator('approvedId', { initialValue: record.approvedId })(<Input tabIndex="15" />) }
                </FormItem>
                <FormItem label="默认频次" {...formItemLayout}>
                  { getFieldDecorator('freqCode', { initialValue: record.freqCode })(
                    <DataSourceSelect
                      showSearch
                      style={{ width: '100%' }}
                      tabIndex="18"
                      codeName="frequency"
                    />,
                  ) }
                </FormItem>
                <FormItem label="进价" {...formItemLayout}>
                  { getFieldDecorator('buyPrice', {
                    initialValue: record.buyPrice,
                    rules: [
                      {
                        required: true,
                        message: '进价不能为空',
                      },
                    ],
                  })(
                    <NumberInput
                      numberType="currency4"
                      addonBefore="¥"
                      size="large"
                      tabIndex="21"
                      className={Styles.drugInfo_currencyInput}
                    />,
                  ) }
                </FormItem>
                <FormItem label="批发价" {...formItemLayout}>
                  { getFieldDecorator('wholePrice', {
                    initialValue: record.wholePrice,
                  })(
                    <NumberInput
                      numberType="currency4"
                      addonBefore="¥"
                      size="large"
                      tabIndex="24"
                      className={Styles.drugInfo_currencyInput}
                    />,
                  ) }
                </FormItem>
                <FormItem label="停用标志" {...formItemLayout}>
                  {
                    getFieldDecorator('stopFlag', {
                      initialValue: record.stopFlag || isUndefined(record.stopFlag),
                    })(
                      <RadioGroup tabIndex="27">
                        <Radio value>正常</Radio>
                        <Radio value={false}>停用</Radio>
                      </RadioGroup>)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" gutter={24} className="action-form-footer">
              <Col span={24} className="action-form-operating">
                <Button size="large" onClick={this.handleReset} className="on-reload">
                  <Icon type="reload" />重置(R)
                </Button>
                <Button size="large" type="primary" onClick={this.handleSubmit} className="on-save">
                  <Icon type={isSpin ? 'loading' : 'save'} />保存(S)
                </Button>
              </Col>
            </Row>
          </Form>
        </Spin>
      </CommonModal>
    );
  }
}

export default Form.create()(EditorForm);
