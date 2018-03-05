import React, { Component } from 'react';
import { Row, Col, Button, Form, Input, Radio,
  InputNumber, TimePicker, Icon,
} from 'antd';
import { isEmpty, isUndefined } from 'lodash';
import moment from 'moment';
import DictSelect from '../../../components/DictSelect';
import DeptSelect from '../../../components/DeptSelect';
import NumberInput from '../../../components/NumberInput';
import CommonModal from '../../../components/CommonModal';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const format = 'HH:mm';

class EditorForm extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = ::this.handleSubmit;
    this.handleReset = ::this.handleReset;
    this.onInputChange = ::this.onInputChange;
  }

  // componentWillReceiveProps(nextProps) {
  // }

  onInputChange = (value) => {
    this.props.form.setFieldsValue({ numSourceId: value });
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
      this.props.dispatch({
        type: 'regVisitTemp/save',
        params: values,
      });
      if (isEmpty(record)) {
        this.handleReset();
      }
    });
  }

  render() {
    const { dicts, activeWeek, controlParam, isSpin, namespace, formCache, visible, form } = this.props;
    const { getFieldDecorator } = this.props.form;
    const record = this.props.record || {};
    const title = dicts.dis('DEPT_TYPE', record.deptId) || '新增';
    const isCreate = !record.id;
    const twoColLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    return (
      <CommonModal
        width={720}
        title={title}
        visible={visible}
        namespace={namespace}
        form={form}
        formCache={formCache}
      >
        <Form horizontal>
          <FormItem style={{ display: 'none' }}>
            {getFieldDecorator('id', { initialValue: record.id })(<Input />)}
          </FormItem>
          <Row type="flex" justify="start">
            <Col span={12}>
              <FormItem label="号源ID" {...twoColLayout}>
                {
                  getFieldDecorator('numSourceId', {
                    initialValue: record.numSourceId || '',
                    rules: [
                      { max: 4, message: '号源ID长度不能超过4位' },
                    ],
                  })(
                    <NumberInput
                      numberType="integer"
                      tabIndex="1"
                      maxLength={4}
                      placeholder="输入1-4位数字"
                      onChange={this.onInputChange}
                    />,
                )}
              </FormItem>
            </Col>
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
                  })(<DeptSelect showSearch style={{ width: '100%' }} tabIndex="2" deptType={['001']} />)
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="挂号级别" {...twoColLayout}>
                { getFieldDecorator('regLevel', { initialValue: record.regLevel })(
                  <DictSelect
                    showSearch
                    style={{ width: '100%' }}
                    tabIndex="3"
                    columnName="REG_LEVEL"
                  />,
                )}
              </FormItem>
            </Col>
            {
              controlParam === 0
              ?
                <Col span={12}>
                  <FormItem label="出诊医生" {...twoColLayout}>
                    { getFieldDecorator('docName', { initialValue: record.docName })(<Input tabIndex="4" />) }
                  </FormItem>
                </Col>
              :
                ''
            }
          </Row>
          {
            controlParam === 0
            ?
              <div>
                <Row type="flex" justify="start">
                  <Col span={12}>
                    <FormItem label="星期" {...twoColLayout}>
                      { getFieldDecorator('week', { initialValue: activeWeek || '1' })(<InputNumber min={1} max={7} tabIndex="5" />) }
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="午别" {...twoColLayout}>
                      { getFieldDecorator('noon', { initialValue: record.noon || 'Q' })(
                        <RadioGroup tabIndex="6">
                          <Radio value="Q">全天</Radio>
                          <Radio value="S">上午</Radio>
                          <Radio value="X">下午</Radio>
                        </RadioGroup>)
                      }
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem label="上班时间" {...twoColLayout}>
                      { getFieldDecorator('startTime', { initialValue: record.startTime ? moment(record.startTime) : null })(
                        <TimePicker format={format} tabIndex="7" />)
                      }
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="下班时间" {...twoColLayout}>
                      { getFieldDecorator('endTime', { initialValue: record.endTime ? moment(record.endTime) : null })(
                        <TimePicker format={format} tabIndex="8" />)
                      }
                    </FormItem>
                  </Col>
                </Row>
              </div>
            :
              ''
          }
          <Row>
            <Col span={12}>
              <FormItem label="现场限额" {...twoColLayout}>
                { getFieldDecorator('regLmt', { initialValue: record.regLmt || '1' })(<InputNumber min={-1} max={20} tabIndex="9" />) }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="预约限额" {...twoColLayout}>
                { getFieldDecorator('orderLmt', { initialValue: record.orderLmt || '1' })(<InputNumber min={-1} max={20} tabIndex="10" />) }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="允许加号" {...twoColLayout}>
                {
                  getFieldDecorator('allowAdd', {
                    initialValue: record.allowAdd || isUndefined(record.allowAdd),
                  })(
                    <RadioGroup tabIndex="11">
                      <Radio value>允许</Radio>
                      <Radio value={false}>不允许</Radio>
                    </RadioGroup>)
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="停用标志" {...twoColLayout}>
                {
                  getFieldDecorator('stopFlag', {
                    initialValue: record.stopFlag || isUndefined(record.stopFlag),
                  })(
                    <RadioGroup tabIndex="12">
                      <Radio value>正常</Radio>
                      <Radio value={false}>停用</Radio>
                    </RadioGroup>)
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="创建时间" {...twoColLayout} style={{ display: isCreate ? 'none' : '' }}>
                { getFieldDecorator('createTime', { initialValue: record.createTime })(<Input disabled />) }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="更新时间" {...twoColLayout} style={{ display: isCreate ? 'none' : '' }}>
                { getFieldDecorator('updateTime', { initialValue: record.updateTime })(<Input disabled />) }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="创建人员" {...twoColLayout} style={{ display: isCreate ? 'none' : '' }}>
                { getFieldDecorator('createOper', { initialValue: record.createOper })(<Input disabled />) }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="更新人员" {...twoColLayout} style={{ display: isCreate ? 'none' : '' }}>
                { getFieldDecorator('updateOper', { initialValue: record.updateOper })(<Input disabled />) }
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" gutter={24} className="action-form-footer">
            <Col span={24} className="action-form-operating">
              <Button size="large" onClick={this.handleReset} className="on-reload">
                <Icon type="reload" />重置
              </Button>
              <Button size="large" type="primary" onClick={this.handleSubmit} className="on-save">
                <Icon type={isSpin ? 'loading' : 'save'} />保存
              </Button>
            </Col>
          </Row>
        </Form>
      </CommonModal>
    );
  }
}

export default Form.create()(EditorForm);
