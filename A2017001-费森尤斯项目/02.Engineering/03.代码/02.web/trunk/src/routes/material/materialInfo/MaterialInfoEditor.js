import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Button, Form, Input, InputNumber, Spin, Modal } from 'antd';
// import _ from 'lodash';

// import CommonModal from '../../../components/CommonModal';
import DictSelect from '../../../components/DictSelect';
import DictRadioGroup from '../../../components/DictRadioGroup';
// import DataSourceSelect from '../../../components/DataSourceSelect';
import CompanySelect from '../../../components/searchInput/MaterialCompanySearchInput';
import CertificateSelect from '../../../components/searchInput/MaterialCertificateSearchInput';
import CommonItemSearchInput from '../../../components/searchInput/CommonItemSearchInput';

// import Styles from './MaterialInfo.less';
import CompanySearchInput from '../../../components/searchInput/CompanySearchInput';

const FormItem = Form.Item;

class EditorForm extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.resetData = this.resetData.bind(this);
    this.onSelectCompany = this.onSelectCompany.bind(this);
    this.onSelectCertificate = this.onSelectCertificate.bind(this);
    this.onSelectCommonItem = this.onSelectCommonItem.bind(this);
  }

  componentWillMount() {
    /* this.props.dispatch({
      type: 'utils/initDataSource',
      payload: ['companyInfo'],
    });*/
  }

  onSelectCommonItem(item) {
    const newRecord = { ...item };
    // console.log(newRecord);
    // 将所选项目更新到order
    this.props.dispatch({
      type: 'material/setState',
      payload: {
        record: {
          ...this.props.material.record,
          itemCode: newRecord.id,
          itemName: newRecord.itemName,
        },
      },
    });
  }

  onSelectCompany(item) {
    this.props.dispatch({
      type: 'material/setState',
      payload: {
        record: {
          ...this.props.material.record,
          companyInfo: item,
        },
      },
    });
  }

  onSelectCertificate(item) {
    // console.log('item:', item);
    this.props.dispatch({
      type: 'material/setState',
      payload: {
        record: {
          ...this.props.material.record,
          registerId: item.id,
          registerCode: item.regNo,
          registerName: item.regName,
        },
      },
    });
  }

  handleReset() {
    this.resetData();
  }

  handleSubmit() {
    const { record } = this.props.material;
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.props.dispatch({
        type: 'material/save',
        params: { 
          ...record,
          ...values,
          producer: record && record.companyInfo ? record.companyInfo.id : '',
        },
      });
      this.resetData();
    });
  }

  handleCancel() {
    this.props.dispatch({
      type: 'material/setState',
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
      type: 'material/setState',
      payload: {
        record: {},
      },
    });
    this.props.form.resetFields();
  }

  render() {
    const { base, material, chanel } = this.props;
    const { editorSpin, visible, record } = material;
    const { getFieldDecorator } = this.props.form;
    const title = record.id ? `修改物资信息：${record.commonName}` : '新增物资信息';
    // console.log('record in editor:', record);
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const isShow = typeof(record.hosId) ==='undefined' || record.hosId === base.user.hosId ? false : true;
    /* const formItemLayoutColspan2 = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };*/

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
                <FormItem label="物资编码" {...formItemLayout} >
                  { getFieldDecorator('materialCode', {
                    initialValue: record.materialCode,
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
                  })(<Input style={{ width: '100%' }} maxLength={20} disabled = {isShow} />) }
                </FormItem>
              </Col>
              <Col span={6} >
                <FormItem label="中心码" {...formItemLayout} >
                  { getFieldDecorator('centerCode', {
                    initialValue: record.centerCode,
                    rules: [
                      { max: 20, message: '中心码不能超过20个字符' },
                    ],
                  })(<Input style={{ width: '100%' }} maxLength={20}  disabled = {isShow}/>) }
                </FormItem>
              </Col>
              <Col span={6} >
                <FormItem label="条形码" {...formItemLayout} >
                  { getFieldDecorator('barcode', {
                    initialValue: record.barcode,
                    rules: [
                      { max: 30, message: '条形码不能超过30个字符' },
                    ],
                  })(<Input style={{ width: '100%' }} maxLength={30}  disabled = {isShow}/>) }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={6} >
                <FormItem label="物资类型" {...formItemLayout} >
                  {
                    getFieldDecorator('materialType', {
                      initialValue: record.materialType,
                      rules: [
                        { required: true, message: '请选择物资类型' },
                      ],
                    })( 
                      <DictSelect
                        columnName="MATERIAL_TYPE"
                        placeholder="选择物资类型"
                        style={{ width: '100%' }}
                        allowClear
                        disabled = {isShow}
                        onChange={this.onSelectChange}
                      />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={6} >
                <FormItem label="物资名称" {...formItemLayout} >
                  { getFieldDecorator('commonName', {
                    initialValue: record.commonName,
                    rules: [
                      { required: true, message: '请填写物资名称' },
                      { max: 100, message: '物资名称不能超过100个字符' },
                    ],
                  })(<Input style={{ width: '100%' }} maxLength={100}  disabled = {isShow}/>) }
                </FormItem>
              </Col>
              <Col span={6} >
                <FormItem label="拼音码" {...formItemLayout} >
                  { getFieldDecorator('commonSpell', {
                    initialValue: record.commonSpell,
                    rules: [
                      { max: 50, message: '物资名称拼音码不能超过50个字符' },
                    ],
                  })(<Input style={{ width: '100%' }} maxLength={50}  disabled = {isShow}/>) }
                </FormItem>
              </Col>
              <Col span={6} >
                <FormItem label="五笔码" {...formItemLayout} >
                  { getFieldDecorator('commonWb', {
                    initialValue: record.commonWb,
                    rules: [
                      { max: 50, message: '物资名称五笔码不能超过50个字符' },
                    ],
                  })(<Input style={{ width: '100%' }} maxLength={50}  disabled = {isShow}/>) }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={6} >
                <FormItem label="规格" {...formItemLayout} >
                  { getFieldDecorator('materialSpecs', {
                    initialValue: record.materialSpecs,
                    rules: [
                      { max: 100, message: '规格不能超过100个字符' },
                    ],
                  })(<Input style={{ width: '100%' }} maxLength={100}  disabled = {isShow}/>) }
                </FormItem>
              </Col>
              <Col span={6} >
                <FormItem label="物资别名" {...formItemLayout} >
                  { getFieldDecorator('alias', {
                    initialValue: record.alias,
                    rules: [
                      { max: 100, message: '物资别名不能超过100个字符' },
                    ],
                  })(<Input style={{ width: '100%' }} maxLength={100}  disabled = {isShow}/>) }
                </FormItem>
              </Col>
              <Col span={6} >
                <FormItem label="别名拼音码" {...formItemLayout} >
                  { getFieldDecorator('aliasSpell', {
                    initialValue: record.aliasSpell,
                    rules: [
                      { max: 50, message: '物资别名拼音码不能超过50个字符' },
                    ],
                  })(<Input style={{ width: '100%' }} maxLength={50}  disabled = {isShow}/>) }
                </FormItem>
              </Col>
              <Col span={6} >
                <FormItem label="别名五笔码" {...formItemLayout} >
                  { getFieldDecorator('aliasWb', {
                    initialValue: record.aliasWb,
                    rules: [
                      { max: 50, message: '物资别名五笔码不能超过50个字符' },
                    ],
                  })(<Input style={{ width: '100%' }} maxLength={50}  disabled = {isShow}/>) }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={6} >
                <FormItem style={{ display: 'none' }} >
                  { getFieldDecorator('producer', {
                    initialValue: record.companyInfo ? record.companyInfo.id : '',
                  })(
                    <Input  disabled = {isShow}/>,
                  )}
                </FormItem>
                <FormItem label="生产厂家" {...formItemLayout}>
                  {
                    getFieldDecorator('selectedProducer', {
                      initialValue: record.companyInfo ? record.companyInfo.companyName : ''
                    })(
                      <CompanySearchInput
                        companyType={['1']}
                        services={['2']}
                        disabled = {isShow}
                        onSelect={this.onSelectCompany}
                        style={{ width: '100%' }}
                      />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={6} >
                <FormItem label="常规单位" {...formItemLayout} >
                  {
                    getFieldDecorator('materialUnit', {
                      initialValue: record.materialUnit,
                    })(
                      <DictSelect
                        columnName="MATERIAL_UNIT"
                        placeholder="选择常规单位"
                        style={{ width: '100%' }}
                        valueField="val"
                        disabled = {isShow}
                        allowClear
                      />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={6} >
                <FormItem label="常规数量" {...formItemLayout} >
                  { getFieldDecorator('materialQuantity', {
                    initialValue: typeof record.materialQuantity === 'undefined' || record.materialQuantity === null ? '' : record.materialQuantity,
                  })(
                    <InputNumber style={{ width: '100%' }} maxLength={8} max={99999999}  disabled = {isShow}/>,
                  )}
                </FormItem>
              </Col>
              <Col span={6} >
                <FormItem label="最大单位" {...formItemLayout} >
                  {
                    getFieldDecorator('maxUnit', {
                      initialValue: record.maxUnit,
                    })(
                      <DictSelect
                        columnName="MATERIAL_UNIT"
                        placeholder="选择最大单位"
                        style={{ width: '100%' }}
                        valueField="val"
                        disabled = {isShow}
                        allowClear
                      />,
                    )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={6} >
                <FormItem label="收费对应" {...formItemLayout} >
                  {
                    getFieldDecorator('feeFlag', {
                      initialValue: record.feeFlag,
                    })(
                      <DictSelect
                        columnName="MATERIAL_FEE_FLAG"
                        placeholder="选择收费对应"
                        style={{ width: '100%' }}
                        allowClear
                      />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={6} >
                <FormItem label="收费项目" {...formItemLayout} >
                  {
                    getFieldDecorator('itemName', {
                      initialValue: record.itemName,
                    })(
                      <CommonItemSearchInput
                        onSelect={this.onSelectCommonItem}
                        drugFlag="3"
                        placeholder="收费项目"
                      />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={6} >
                <FormItem label="一次性物资" {...formItemLayout} >
                  { getFieldDecorator('disposable', {
                    initialValue: record.disposable || '0',
                  })(
                    <DictRadioGroup
                      columnName="BOOLEAN"
                      buttonMode
                      disabled = {isShow}
                      style={{ width: '100%' }}
                      buttonStyle={{ width: '50%', textAlign: 'center' }}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={6} >
                <FormItem label="植入物" {...formItemLayout} >
                  { getFieldDecorator('implant', {
                    initialValue: record.implant || '0',
                  })(
                    <DictRadioGroup
                      columnName="BOOLEAN"
                      buttonMode
                      disabled = {isShow}
                      style={{ width: '100%' }}
                      buttonStyle={{ width: '50%', textAlign: 'center' }}
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={6} >
                <FormItem label="采购价" {...formItemLayout} >
                  { getFieldDecorator('buyPrice', {
                    initialValue: typeof record.buyPrice === 'undefined' || record.buyPrice === null ? '' : record.buyPrice,
                  })(<InputNumber style={{ width: '100%' }} maxLength={8} max={999999999.9999} />) }
                </FormItem>
              </Col>
              <Col span={6} >
                <FormItem label="含税采购价" {...formItemLayout} >
                  { getFieldDecorator('taxBuyPrice', {
                    initialValue: typeof record.taxBuyPrice === 'undefined' || record.taxBuyPrice === null ? '' : record.taxBuyPrice,
                  })(<InputNumber style={{ width: '100%' }} maxLength={8} max={9999999999.9999} />) }
                </FormItem>
              </Col>
              <Col span={6} >
                <FormItem label="零售价" {...formItemLayout} >
                  { getFieldDecorator('salePrice', {
                    initialValue: typeof record.salePrice === 'undefined' || record.salePrice === null ? '' : record.salePrice,
                  })(<InputNumber style={{ width: '100%' }} maxLength={8} max={9999999999.9999} />) }
                </FormItem>
              </Col>
              <Col span={6} >
                <FormItem label="含税零售价" {...formItemLayout} >
                  { getFieldDecorator('taxSalePrice', {
                    initialValue: typeof record.taxSalePrice === 'undefined' || record.taxSalePrice === null ? '' : record.taxSalePrice,
                  })(<InputNumber style={{ width: '100%' }} maxLength={8} max={9999999999.9999} />) }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={6} >
                <FormItem style={{ display: 'none' }} >
                  { getFieldDecorator('registerId', {
                    initialValue: record.registerId,
                  })(
                    <Input  disabled = {isShow}/>,
                  )}
                </FormItem>
                <FormItem style={{ display: 'none' }} >
                  { getFieldDecorator('registerCode', {
                    initialValue: record.registerCode,
                  })(
                    <Input  disabled = {isShow}/>,
                  )}
                </FormItem>
                <FormItem label="注册证" {...formItemLayout} >
                  {
                    getFieldDecorator('registerName', {
                      initialValue: record.registerName,
                    })(
                      <CertificateSelect
                        style={{ width: '100%' }}
                        disabled = {isShow}
                        onSelect={this.onSelectCertificate}
                      />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={6} >
                <FormItem label="停用标识" {...formItemLayout} >
                  { getFieldDecorator('stopFlag', {
                    initialValue: record.stopFlag || '1',
                  })(
                    <DictRadioGroup
                      disabled = {isShow}
                      columnName="STOP_FLAG"
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ textAlign: 'right' }} >
                <Button size="large" onClick={this.handleReset} style={{ marginRight: '10px' }} icon="reload">重置</Button>
                <Button size="large" type="primary" onClick={this.handleSubmit} icon="save">保存</Button>
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
  ({ material, base }) => ({ material, base }),
)(Editor);
