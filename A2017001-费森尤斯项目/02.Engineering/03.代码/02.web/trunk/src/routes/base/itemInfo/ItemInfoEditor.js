import React from 'react';
import { connect } from 'dva';
import { Row, Col, Button, Modal, Form, Input, Radio, Spin } from 'antd';
import _ from 'lodash';
import DictSelect from '../../../components/DictSelect';
import DeptTreeSelect from '../../../components/DeptTreeSelect';
import NumberInput from '../../../components/NumberInput';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class EditorForm extends React.Component {

  constructor(props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.close = this.close.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.itemInfo.visible && this.props.itemInfo.visible) {
      if (this.itemNameInput) {
        // 实测页面第一次加载会focus，之后就不会focus(console能打出来)，原因不明，问过夏、肖均无解
        // this.itemNameInput.refs.input.focus(); 换成这个也一样
        // console.log(this, this.itemNameInput, this.itemNameInput.focus);
        this.itemNameInput.focus();
      }
    }
  }

  close() {
    this.props.dispatch({ type: 'itemInfo/setState', payload: { visible: false } });
    this.reset();
    this.props.dispatch({ type: 'itemInfo/setState', payload: { record: null } });
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // unit要求保存值而非键
        const unit = this.props.utils.dicts.dis('UNIT', values.unit) || values.unit;
        this.props.dispatch({
          type: 'itemInfo/save',
          params: { ...values, unit },
        });
        if (_.isEmpty(this.props.itemInfo.record)) {
          this.itemNameInput.focus();
        }
        this.reset();
      }
    });
  }

  handleCancel() {
    const values = this.props.form.getFieldsValue();
    const record = this.props.itemInfo.record;
    // unit要求保存值而非键
    const unit = this.props.utils.dicts.dis('UNIT', values.unit) || values.unit;
    // const changed = !_.isMatch(record, { ...values, unit }) && (typeof values.id !== 'undefined');
    const changed = !_.isMatch(record, { ...values, unit }) && !_.isUndefined(values.id);

    if (changed) {
      Modal.confirm({
        title: '确认',
        content: '放弃保存您的修改？',
        okText: '放弃',
        cancelText: '我再看看',
        onOk: () => { this.close(); },
      });
    } else {
      this.close();
    }
  }

  reset() {
    this.props.form.resetFields();
  }

  render() {
    const { spin, visible } = this.props.itemInfo;
    const { getFieldDecorator } = this.props.form;
    const data = this.props.itemInfo.record || {};
    // const visible = !!this.props.itemInfo.record;
    const title = data.itemName || '新增';
    const formItemLayout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };
    const itemLayoutCol3 = { labelCol: { span: 3 }, wrapperCol: { span: 21 } };
    const initClassCode = data.classCode || this.props.itemInfo.selectedTag;

    // hasFeedback 属性删除，解决firefox无法输入汉字的bug xiaweiyi
    return (
      <Modal
        width={850} title={title} visible={visible} closable
        footer={null} maskClosable={false} onCancel={this.handleCancel}
      >
        <Spin spinning={spin}>
          <Form style={{ paddingRight: 20 }} >
            <Row>
              <FormItem style={{ display: 'none' }}>
                { getFieldDecorator('id', { initialValue: data.id })(<Input />) }
              </FormItem>
              <FormItem style={{ display: 'none' }}>
                { getFieldDecorator('hosId', { initialValue: data.hosId })(<Input />) }
              </FormItem>
              <FormItem style={{ display: 'none' }}>
                { getFieldDecorator('createTime', { initialValue: data.createTime })(<Input />) }
              </FormItem>
              <FormItem style={{ display: 'none' }}>
                { getFieldDecorator('createOper', { initialValue: data.createOper })(<Input />) }
              </FormItem>
              <FormItem label="项目编码" style={{ display: 'none' }}>
                { getFieldDecorator('itemCode', { initialValue: data.itemCode })(<Input />) }
              </FormItem>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label="项目名称" {...formItemLayout}>
                  { getFieldDecorator('itemName', {
                    initialValue: data.itemName,
                    rules: [{ required: true, message: '项目名称不能为空' }],
                  })(<Input maxLength={50} ref={(node) => { this.itemNameInput = node; }} />) }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="拼音" {...formItemLayout}>
                  { getFieldDecorator('spellCode', {
                    initialValue: data.spellCode,
                    // rules: [{ required: true, message: '拼音不能为空' }],
                  })(<Input disabled />) }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="五笔" {...formItemLayout}>
                  { getFieldDecorator('wbCode', {
                    initialValue: data.wbCode,
                    // rules: [{ required: true, message: '五笔不能为空' }],
                  })(<Input disabled />) }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label="自定义码" {...formItemLayout}>
                  { getFieldDecorator('userCode', {
                    initialValue: data.userCode,
                  })(<Input maxLength={50}/>) }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="中心项目编码" {...formItemLayout}>
                  { getFieldDecorator('groupCode', {
                    initialValue: data.groupCode,
                  })(<Input maxLength={10} />) }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="物价编码" {...formItemLayout}>
                  { getFieldDecorator('priceCode', {
                    initialValue: data.priceCode,
                  })(<Input maxLength={30} />) }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label="规格" {...formItemLayout}>
                  { getFieldDecorator('specs', {
                    initialValue: data.specs,
                  })(<Input maxLength={30}/>) }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="单位" {...formItemLayout}>
                  { getFieldDecorator('unit', {
                    initialValue: data.unit,
                    rules: [{ required: true, message: '单位不能为空' }],
                  })(<DictSelect showSearch style={{ width: '100%' }} columnName="UNIT" />) }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="标准价格" {...formItemLayout}>
                  { getFieldDecorator('unitPrice', {
                    initialValue: data.unitPrice || '0.0000',
                    rules: [{ required: true, message: '标准价格不能为空' }],
                  })(<NumberInput numberType="currency4" addonBefore="¥" size="large" className="text-align-right" />) }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label="维护分类" {...formItemLayout}>
                  { getFieldDecorator('classCode', {
                    initialValue: initClassCode,
                    rules: [{ required: true, message: '维护分类不能为空' }],
                  })(<DictSelect showSearch style={{ width: '100%' }} columnName="CLASS_CODE" />) }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="费用分类" {...formItemLayout}>
                  { getFieldDecorator('feeCode', {
                    initialValue: data.feeCode,
                    rules: [{ required: true, message: '费用分类不能为空' }],
                  })(<DictSelect showSearch style={{ width: '100%' }} columnName="FEE_CODE" />) }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="默认科室" {...formItemLayout}>
                  { getFieldDecorator('defaultDept', {
                    initialValue: data.defaultDept,
                  })(<DeptTreeSelect showSearch style={{ width: '100%' }} />) }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label="复合项目" {...formItemLayout}>
                  { getFieldDecorator('isgather', {
                    initialValue: typeof data.isgather === 'undefined' ? false : data.isgather,
                  })(
                    <RadioGroup>
                      <Radio value>是</Radio>
                      <Radio value={false}>否</Radio>
                    </RadioGroup >) }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="执行确认" {...formItemLayout}>
                  { getFieldDecorator('exec', {
                    initialValue: typeof data.exec === 'undefined' ? false : data.exec,
                  })(
                    <RadioGroup>
                      <Radio value>是</Radio>
                      <Radio value={false}>否</Radio>
                    </RadioGroup >) }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="停用标志" {...formItemLayout}>
                  { getFieldDecorator('stop', {
                    initialValue: typeof data.stop === 'undefined' ? true : data.stop,
                    rules: [{ required: true, message: '停用标志不能为空' }],
                  })(
                    <RadioGroup>
                      <Radio value>正常</Radio>
                      <Radio value={false}>停用</Radio>
                    </RadioGroup>) }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem label="备注" {...itemLayoutCol3}>
                  { getFieldDecorator('comm', {
                    initialValue: data.comm,
                  })(<Input maxLength={500}/>) }
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
      </Modal >
    );
  }
}

// <InputNumber min={0} max={99999999} defaultValue={0.0000} step={0.0001} style={{ width: '100%' }} />
const Editor = Form.create()(EditorForm);
export default connect(({ itemInfo, utils }) => ({ itemInfo, utils }))(Editor);
