import React, { Component } from 'react';
import { Row, Col, Button, Modal, Form, Input, Radio, DatePicker, InputNumber } from 'antd';
import moment from 'moment';
import { isMatch } from 'lodash';
import DictSelect from '../../../components/DictSelect';
import DeptSelect from '../../../components/DeptSelect';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class EditorForm extends Component {
  constructor(props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.close = this.close.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data == null) {
      this.reset();
    }
  }

  reset() {
    this.props.form.resetFields();
  }

  handleCancel() {
    const values = this.props.form.getFieldsValue();
    const data = this.props.data;
    if (this.props.activeKey !== '1') {
      values.validDate = moment(values.validDate).format('YYYY-MM-DD');
    }
    // 如果匹配则无变化，反之有变化。注意要data在前values在后，因为data比values多
    const changed = !isMatch(data, values);

    if (changed) {
      Modal.confirm({
        title: '确认',
        content: '放弃保存您的修改？',
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
      type: 'storeInfo/setState',
      payload: { record: null },
    });
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({ type: 'storeInfo/save', params: values });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { activeKey } = this.props;
    const data = this.props.data || {};
    const visible = !!this.props.data;
    const title = data.tradeName || '新增';
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
    
    // hasFeedback 属性删除，解决firefox无法输入汉字的bug xiaweiyi
    return (
      <Modal
        width={1080}
        title={title}
        visible={visible}
        closable
        footer={null}
        maskClosable={false}
        onCancel={this.handleCancel}
      >
        <Form>
          <FormItem style={{ display: 'none' }}>
            {getFieldDecorator('id', { initialValue: data.id })(<Input />)}
          </FormItem>
          <FormItem style={{ display: 'none' }}>
            {getFieldDecorator('hosId', { initialValue: data.hosId })(<Input />)}
          </FormItem>
          <FormItem style={{ display: 'none' }}>
            {getFieldDecorator('storeId', { initialValue: data.storeId })(<Input />)}
          </FormItem>
          <FormItem style={{ display: 'none' }}>
            {getFieldDecorator('createTime', { initialValue: data.createTime })(<Input />)}
          </FormItem>
          <FormItem style={{ display: 'none' }} >
            {getFieldDecorator('createOper', { initialValue: data.createOper })(<Input />)}
          </FormItem>
          <FormItem style={{ display: 'none' }} >
            {getFieldDecorator('drugInfo.id', { initialValue: data.drugInfo ? data.drugInfo.id : '' })(<Input />)}
          </FormItem>
          <FormItem style={{ display: 'none' }} >
            {getFieldDecorator('companyInfo.id', { initialValue: data.companyInfo ? data.companyInfo.id : '' })(<Input />)}
          </FormItem>
          <FormItem style={{ display: 'none' }} >
            {getFieldDecorator('storeSum', { initialValue: data.storeSum ? data.storeSum : 0 })(<Input />)}
          </FormItem>
          <FormItem style={{ display: 'none' }} >
            {getFieldDecorator('minUnit', { initialValue: data.minUnit ? data.minUnit : '' })(<Input />)}
          </FormItem>
          <Row>
            <Col span={8}>
              <FormItem label="库房" {...formItemLayout}>
                {
                  getFieldDecorator('deptId', { initialValue: data.deptId })(
                    <DeptSelect showSearch style={{ width: '100%' }} tabIndex={1} deptType={['004', '005']} disabled />)
                }
              </FormItem>
              <FormItem label="商品名称" {...formItemLayout}>
                { getFieldDecorator('tradeName', { initialValue: data.tradeName })(<Input tabIndex={4} disabled />) }
              </FormItem>
              { activeKey === '1' ? null : (
                <div>
                  <FormItem label="批次" {...formItemLayout}>
                    { getFieldDecorator('batchNo', { initialValue: data.batchNo })(<Input tabIndex={7} disabled />) }
                  </FormItem>
                  <FormItem label="有效期" {...formItemLayout}>
                    { getFieldDecorator('validDate', { initialValue: data.validDate ? moment(data.validDate, 'YYYY-MM-DD') : null })(<DatePicker format="YYYY-MM-DD" tabIndex={10} />) }
                  </FormItem>
                </div>
                )
              }
              <FormItem label="零售价" {...formItemLayout}>
                { getFieldDecorator('salePrice', { initialValue: data.salePrice })(<Input tabIndex={13} disabled />) }
              </FormItem>
              <FormItem label="零售金额" {...formItemLayout}>
                { getFieldDecorator('saleCost', { initialValue: data.saleCost })(<Input tabIndex={16} disabled />) }
              </FormItem>
              <FormItem label="停用标志" {...formItemLayout}>
                {
               getFieldDecorator('stop', { initialValue: data.stop ? true : data.stop,
                 rules: [{ required: true, message: '停用标志不能为空' }] })(
                   <RadioGroup tabIndex={19}>
                     <Radio value>正常</Radio>
                     <Radio value={false}>停用</Radio>
                   </RadioGroup >,
               )
             }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="药品分类" {...formItemLayout}>
                {
                  getFieldDecorator('drugType', { initialValue: data.drugType })(
                    <DictSelect showSearch style={{ width: '100%' }} tabIndex={2} columnName="DRUG_TYPE" disabled />,
                )}
              </FormItem>
              <FormItem label="药品性质" {...formItemLayout}>
                { getFieldDecorator('drugInfo.drugQuality', { initialValue: data.drugInfo ? data.drugInfo.drugQuality : '' })(
                  <DictSelect showSearch style={{ width: '100%' }} tabIndex={5} columnName="DRUG_QUALITY" disabled />,
                )}
              </FormItem>
              { activeKey === '1' ? null : (
                <FormItem label="批号" {...formItemLayout}>
                  { getFieldDecorator('approvalNo', { initialValue: data.approvalNo })(<Input tabIndex={8} disabled />) }
                </FormItem>
                )
              }
              <FormItem label="厂家" {...formItemLayout}>
                { getFieldDecorator('companyInfo.companyName', { initialValue: data.companyInfo ? data.companyInfo.companyName : '' })(<Input tabIndex={11} disabled />) }
              </FormItem>
              { activeKey === '1' ? (
                <FormItem label="警戒库存量" {...formItemLayout}>
                  { getFieldDecorator('alertNum', { initialValue: data.alertNum ? data.alertNum : 0 })(<InputNumber tabIndex={14} />) }
                </FormItem>
                ) : null
              }
              <FormItem label="采购金额" {...formItemLayout}>
                { getFieldDecorator('buyCost', { initialValue: data.buyCost })(<Input tabIndex={17} disabled />) }
              </FormItem>
              <FormItem label="备注" {...formItemLayout}>
                { getFieldDecorator('comm', { initialValue: data.comm })(<Input tabIndex={20} disabled />) }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="药品编码" {...formItemLayout}>
                { getFieldDecorator('drugCode', { initialValue: data.drugCode })(<Input tabIndex={3} disabled />) }
              </FormItem>
              <FormItem label="药品规格" {...formItemLayout}>
                { getFieldDecorator('specs', { initialValue: data.specs })(<Input tabIndex={6} disabled />) }
              </FormItem>
              { activeKey === '1' ? null : (
                <div>
                  <FormItem label="生产日期" {...formItemLayout}>
                    { getFieldDecorator('produceDate', { initialValue: data.produceDate || null })(<Input tabIndex={9} disabled />) }
                  </FormItem>
                </div>
                )
              }
              <FormItem label="采购价" {...formItemLayout}>
                { getFieldDecorator('buyPrice', { initialValue: data.buyPrice })(<Input tabIndex={12} disabled />) }
              </FormItem>
              { activeKey === '1' ? (
                <FormItem label="药品位置" {...formItemLayout}>
                  { getFieldDecorator('location', {
                    initialValue: data.location,
                    rules: [{ max: 10, message: '药品位置不能超过10个字符' }],
                  })(<Input tabIndex={18} maxLength={10} />) }
                </FormItem>
                ) : (<FormItem label="药品位置" style={{ display: 'none' }}>
                  { getFieldDecorator('location', { initialValue: data.location })(<Input tabIndex={18} style={{ display: 'none' }} />) }
                </FormItem>)
              }
            </Col>
          </Row>
          <Row>
            <Col span={23} style={{ textAlign: 'right' }} >
              <Button type="primary" onClick={this.handleSubmit} style={{ marginRight: '10px' }} icon="save" size="large" >保存</Button>
              <Button onClick={this.reset} icon="reload" size="large" >重置</Button>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(EditorForm);
