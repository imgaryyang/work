import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Button, Modal, Form, Input, Spin, InputNumber } from 'antd';
import { isObject } from 'lodash';
import moment from 'moment';
import DictSelect from '../../../components/DictSelect';
import DeptSelect from '../../../components/DeptSelect';

const FormItem = Form.Item;

class CheckInfoEditor extends Component {

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
    this.close();
  }

  close() {
    this.props.dispatch({
      type: 'matCheckInfo/setState',
      payload: { record: null },
    });
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'matCheckInfo/updateCheckInfo',
          params: values,
        });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { spin } = this.props.matCheckInfo;
    const data = this.props.data || {};
    const visible = isObject(this.props.data);
    const title = data.drugCode || '新增';
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
        <Spin spinning={spin} >
          <Form>
            <FormItem style={{ display: 'none' }}>
              {getFieldDecorator('id', { initialValue: data.id })(<Input />)}
            </FormItem>
            <FormItem style={{ display: 'none' }}>
              {getFieldDecorator('checkId', { initialValue: data.checkId })(<Input />)}
            </FormItem>
            <FormItem style={{ display: 'none' }}>
              {getFieldDecorator('storeId', { initialValue: data.storeId })(<Input />)}
            </FormItem>
            <FormItem style={{ display: 'none' }}>
              {getFieldDecorator('deptId', { initialValue: data.deptId })(<Input />)}
            </FormItem>
            <FormItem style={{ display: 'none' }}>
              {getFieldDecorator('producer', { initialValue: data.producer })(<Input />)}
            </FormItem>
            <FormItem style={{ display: 'none' }}>
              {getFieldDecorator('drugType', { initialValue: data.drugType })(<Input disabled />)}
            </FormItem>
            <FormItem style={{ display: 'none' }}>
              {getFieldDecorator('profitFlag', { initialValue: data.profitFlag })(<Input />)}
            </FormItem>
            <FormItem style={{ display: 'none' }}>
              {getFieldDecorator('endSum', { initialValue: data.endSum })(<Input />)}
            </FormItem>
            <FormItem style={{ display: 'none' }}>
              {getFieldDecorator('createOper', { initialValue: data.createOper })(<Input />)}
            </FormItem>
            <FormItem style={{ display: 'none' }}>
              {getFieldDecorator('createTime', { initialValue: data.createTime })(<Input />)}
            </FormItem>
            <Row>
              <Col span={8}>
                <FormItem label="盘点单号" {...formItemLayout}>
                  { getFieldDecorator('checkBill', { initialValue: data.checkBill })(<Input disabled />)}
                </FormItem>
                <FormItem label="物资编码"{...formItemLayout}>
                  { getFieldDecorator('drugCode', { initialValue: data.drugCode })(<Input disabled />)}
                </FormItem>
                <FormItem label="物资规格"{...formItemLayout}>
                  { getFieldDecorator('specs', { initialValue: data.specs })(<Input disabled />)}
                </FormItem>
                <FormItem label="生产日期"{...formItemLayout}>
                  { getFieldDecorator('produceDate', { initialValue: moment(data.produceDate).format('YYYY-MM-DD') })(<Input disabled />)}
                </FormItem>
                <FormItem label="采购价"{...formItemLayout}>
                  { getFieldDecorator('buyPrice', { initialValue: data.buyPrice })(<Input disabled />)}
                </FormItem>
                <FormItem label="开始数量"{...formItemLayout}>
                  { getFieldDecorator('startSum', { initialValue: data.startSum })(<Input disabled />)}
                </FormItem>
                <FormItem label="最小单位"{...formItemLayout}>
                  { getFieldDecorator('minUnit', { initialValue: data.minUnit })(<Input disabled />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="库房"{...formItemLayout}>
                  { getFieldDecorator('storeId', { initialValue: data.storeId })(<Input disabled />)}
                </FormItem>
                <FormItem label="商品名称"{...formItemLayout}>
                  { getFieldDecorator('tradeName', { initialValue: data.tradeName })(<Input disabled />)}
                </FormItem>
                <FormItem label="批次"{...formItemLayout}>
                  { getFieldDecorator('batchNo', { initialValue: data.batchNo })(<Input disabled />)}
                </FormItem>
                <FormItem label="厂家"{...formItemLayout}>
                  { getFieldDecorator('producer', { initialValue: data.producer })(<Input disabled />)}
                </FormItem>
                <FormItem label="零售价"{...formItemLayout}>
                  { getFieldDecorator('salePrice', { initialValue: data.salePrice })(<Input disabled />)}
                </FormItem>
                <FormItem label="盘点数量"{...formItemLayout}>
                  { getFieldDecorator('writeSum', {
                    initialValue: data.writeSum,
                    rules: [
                            { required: true, message: '盘点数量不能为空' }] })(<InputNumber min={1} max={10000000} style={{ width: '218' }} />)}
                </FormItem>

              </Col>
              <Col span={8}>
                <FormItem label="药房"{...formItemLayout}>
                  { getFieldDecorator('deptId', { initialValue: data.deptId })(
                    <DeptSelect showSearch style={{ width: '100%' }} tabIndex={1} deptType={['004', '005']} disabled />)}
                </FormItem>
                <FormItem label="物资分类"{...formItemLayout}>
                  { getFieldDecorator('drugType', { initialValue: data.drugType })(
                    <DictSelect
                      showSearch
                      style={{ width: '100%' }}
                      tabIndex={0}
                      columnName="DRUG_TYPE"
                      disabled
                    />,
                  )}
                </FormItem>
                <FormItem label="批号"{...formItemLayout}>
                  { getFieldDecorator('approvalNo', { initialValue: data.approvalNo })(<Input disabled />)}
                </FormItem>
                <FormItem label="有效期"{...formItemLayout}>
                  { getFieldDecorator('validDate', { initialValue: moment(data.validDate).format('YYYY-MM-DD') })(<Input disabled />)}
                </FormItem>
                <FormItem label="物资位置"{...formItemLayout}>
                  { getFieldDecorator('location', { initialValue: data.location })(<Input disabled />)}
                </FormItem>
                <FormItem label="盘点状态"{...formItemLayout}>
                  {getFieldDecorator('checkState', { initialValue: data.checkState })(
                    <DictSelect
                      showSearch
                      style={{ width: '100%' }}
                      tabIndex={0}
                      columnName="CHECK_STATE"
                      disabled
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={10} >
                <FormItem label="备注" {...formItemLayout}>
                  { getFieldDecorator('comm', { initialValue: '',
                    rules: [
                        { max: 250, message: '备注不能超过250个字' }] })(<Input type="textarea" rows={3} />)
                  }
                </FormItem>
              </Col>
              <Col span={14} />
            </Row>
            <Row>
              <Col span={10} />
              <Col span={1}>
                <Button type="primary" onClick={this.handleSubmit}>保存</Button>
              </Col>
              <Col span={2} />
              <Col span={1}>
                <Button onClick={this.reset}>重置</Button>
              </Col>
              <Col span={10} />
            </Row>
          </Form>
        </Spin>
      </Modal>
    );
  }
}

const Editor = Form.create()(CheckInfoEditor);
export default connect(({ matCheckInfo }) => ({ matCheckInfo }))(Editor);
