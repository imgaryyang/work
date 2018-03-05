import React, { Component } from 'react';
import { Row, Col, Button, Modal, Form, Input, Radio, InputNumber, DatePicker, TimePicker } from 'antd';
import { isMatch, isObject, isUndefined } from 'lodash';
import { connect } from 'dva';
import moment from 'moment';
import DictSelect from '../../../components/DictSelect';
import DeptSelect from '../../../components/DeptSelect';
import RegTempList from './RegTempList';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const format = 'HH:mm';

class EditorForm extends Component {

  constructor(props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.close = this.close.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.record == null) {
      this.reset();
    }
  }

  reset() {
    this.props.form.resetFields();
  }

  handleCancel() {
    const values = this.props.form.getFieldsValue();
    const record = this.props.record;
    // 如果匹配则无变化，反之有变化。
    const changed = !isMatch(record, values);

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
      type: 'regVisit/setState',
      payload: { record: null },
    });
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({ type: 'regVisit/save', params: values });
      }
    });
  }

  render() {
    const { dicts, depts, deptsIdx, searchObjs, dispatch } = this.props;
    const { getFieldDecorator } = this.props.form;
    const record = this.props.record || {};
    const visible = isObject(this.props.record);
    const title = record.id ? `${depts.disDeptNameByDeptId(deptsIdx, record.deptId)} - ${dicts.dis('REG_LEVEL', record.levelName)} - ${record.docName}` : '新增';
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    };
    const twoColLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const fourColLayout = {
      labelCol: { span: 12 },
      wrapperCol: { span: 12 },
    };
    const regTempList = {
      data: this.props.regVisitTemp.data,
      page: this.props.regVisitTemp.page,
      dicts,
      depts,
      deptsIdx,
      searchObjs,
      dispatch,
    };
    return (
      <Modal
        closable
        width={800}
        title={title}
        visible={visible}
        style={{ top: 20 }}
        footer={null}
        maskClosable={false}
        onCancel={this.handleCancel}
      >
        <RegTempList {...regTempList} />
        <Form horizontal>
          <FormItem style={{ display: 'none' }}>
            {getFieldDecorator('id', { initialValue: record.id })(<Input />)}
          </FormItem>
          <FormItem style={{ display: 'none' }}>
            {getFieldDecorator('deptId', { initialValue: record.deptId || '001' })(<Input />)}
          </FormItem>
          <Row type="flex" justify="start">
            <Col span={12}>
              <FormItem label="出诊科室" {...twoColLayout}>
                {
                  getFieldDecorator('deptId', {
                    initialValue: record.deptId,
                    rules: [
                      {
                        required: true,
                        message: '出诊科室不能为空',
                      },
                    ],
                  })(<DeptSelect showSearch style={{ width: '100%' }} tabIndex="1" />)
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="出诊日期" {...twoColLayout}>
                {
                  getFieldDecorator('visitDate', { initialValue: moment(this.props.activeDay, 'YYYY-MM-DD') })(
                    <DatePicker
                      showTime
                      format="YYYY-MM-DD"
                      disabled
                      style={{ width: '100%' }}
                      tabIndex="2"
                    />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="挂号级别" {...twoColLayout}>
                {
                  getFieldDecorator('levelName', { initialValue: record.levelName })(
                    <DictSelect
                      showSearch
                      style={{ width: '100%' }}
                      columnName="REG_LEVEL"
                      tabIndex="3"
                    />,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="出诊医生" {...twoColLayout}>
                { getFieldDecorator('docName', { initialValue: record.docName })(<Input tabIndex="4" />) }
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col span={6}>
              <FormItem label="星期" {...fourColLayout}>
                { getFieldDecorator('week', { initialValue: record.week || '1' })(<InputNumber min={1} max={7} tabIndex="5" />) }
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="午别" {...twoColLayout}>
                { getFieldDecorator('noon', { initialValue: record.noon || 'S' })(
                  <RadioGroup tabIndex="6">
                    <Radio value="S">上午</Radio>
                    <Radio value="X">下午</Radio>
                  </RadioGroup>)
                }
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="上班时间" {...fourColLayout}>
                {
                  getFieldDecorator('startTime', { initialValue: record.startTime ? moment(record.startTime) : null })(
                    <TimePicker format={format} tabIndex="7" />)
                }
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="下班时间" {...fourColLayout}>
                {
                  getFieldDecorator('endTime', { initialValue: record.endTime ? moment(record.endTime) : null })(
                    <TimePicker format={format} tabIndex="8" />)
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label="现场限额" {...fourColLayout}>
                { getFieldDecorator('regLmt', { initialValue: record.regLmt || '0' })(<InputNumber min={0} max={20} tabIndex="9" />) }
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="现场已挂" {...fourColLayout}>
                { getFieldDecorator('reged', { initialValue: record.reged || '0' })(<InputNumber min={0} max={20} tabIndex="10" />) }
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="预约限额" {...fourColLayout}>
                { getFieldDecorator('orderLmt', { initialValue: record.orderLmt || '0' })(<InputNumber min={0} max={20} tabIndex="11" />) }
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="预约已挂" {...fourColLayout}>
                { getFieldDecorator('ordered', { initialValue: record.ordered || '0' })(<InputNumber min={0} max={20} tabIndex="12" />) }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="允许加号" {...twoColLayout}>
                {
                  getFieldDecorator('allowAdd', { initialValue: record.allowAdd || isUndefined(record.allowAdd) })(
                    <RadioGroup tabIndex="13">
                      <Radio value>允许</Radio>
                      <Radio value={false}>不允许</Radio>
                    </RadioGroup>)
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="停用标志" {...twoColLayout}>
                {
                  getFieldDecorator('stopFlag', { initialValue: record.stopFlag || isUndefined(record.stopFlag) })(
                    <RadioGroup tabIndex="14">
                      <Radio value>正常</Radio>
                      <Radio value={false}>停用</Radio>
                    </RadioGroup>)
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem label="停诊原因" {...formItemLayout}>
                { getFieldDecorator('stopReson', { initialValue: record.stopReson || '' })(<Input tabIndex="15" />) }
              </FormItem>
            </Col>
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
      </Modal>
    );
  }
}

const Editor = Form.create()(EditorForm);
export default connect(({ regVisitTemp }) => ({ regVisitTemp }))(Editor);
