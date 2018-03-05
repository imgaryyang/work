import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Row, Col, Input, Button, DatePicker, Collapse } from 'antd';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Panel = Collapse.Panel;
const dateFormat = 'YYYY-MM-DD';

class TrainingInfo extends Component {
  constructor(props) {
    super(props);
    this.handleCreate = ::this.handleCreate;
    this.handleSave = ::this.handleSave;
    this.handleRemove = ::this.handleRemove;
    this.handleDelete = ::this.handleDelete;
    this.onDateChange = ::this.onDateChange;
  }

  componentWillMount() {
    const { userId } = this.props;
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['TRAIN_TYPE'],
    });
    this.props.dispatch({
      type: 'userTraining/loadTrainingInfo',
      payload: { userId },
    });
  }

  onDateChange(dates, dateStrings) {
    const startTime = moment(dateStrings[0]);
    const endTime = moment(dateStrings[1]);
    const dateRange = {
      startTime: startTime.format(dateFormat),
      endTime: endTime.format(dateFormat),
    };
    this.props.dispatch({
      type: 'userTraining/setState',
      payload: { dateRange },
    });
  }

  handleCreate() {
    this.props.dispatch({
      type: 'userTraining/setState',
      payload: { isCreate: true },
    });
  }

  handleRemove() {
    this.props.dispatch({
      type: 'userTraining/setState',
      payload: { isCreate: false, record: {} },
    });
    this.props.form.resetFields();
  }

  handleSave() {
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }

      if (!err) {
        this.props.dispatch({
          type: 'userTraining/createTrainingInfo',
          payload: { params: values },
        });
        this.props.form.resetFields();
      }
    });
  }

  handleEdit(record) {
    const { startTime, endTime } = record;
    const dateRange = { dateRange: [moment(startTime), moment(endTime)] };
    const newRecord = Object.assign(record, dateRange);
    this.props.dispatch({
      type: 'userTraining/setState',
      payload: { isCreate: true, record: newRecord },
    });
    this.props.form.resetFields();
  }

  handleDelete(id) {
    this.props.dispatch({
      type: 'userTraining/removeTrainingInfo',
      payload: { id },
    });
  }

  render() {
    const { isCreate, data, record } = this.props.userTraining;
    const { getFieldDecorator } = this.props.form;
    const { dicts } = this.props.utils;

    const trainKey = data.map((v) => {
      return v.trainOrg;
    });

    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };

    const towColLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };

    function disabledDate(current) {
      // Can not select days before today and today
      return current && current.valueOf() > Date.now();
    }

    const renderCreateDom = () => {
      return (
        <div style={{ marginBottom: 8 }}>
          <Form layout="horizontal">
            <FormItem label="培训内容" {...formItemLayout}>
              {
                getFieldDecorator('trainContent', {
                  initialValue: record.trainContent,
                })(
                  <Input type="textarea" rows={4} maxLength={500} tabIndex={4} style={{ width: '100%' }} />,
                )
              }
            </FormItem>
            <Row>
              <Col span={12}>
                <FormItem label="培训时间" {...towColLayout}>
                  {
                    getFieldDecorator('trainDateRange', {
                      initialValue: record.dateRange,
                      rules: [
                        { required: true, message: '培训时间不能为空！' },
                      ],
                    })(
                      <RangePicker
                        format={dateFormat}
                        disabledDate={disabledDate}
                        onChange={this.onDateChange}
                        tabIndex="2"
                      />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem style={{ display: 'none' }}>
                  {getFieldDecorator('id', { initialValue: record.id })(<Input />)}
                </FormItem>
                <FormItem label="培训成绩" {...towColLayout}>
                  {
                    getFieldDecorator('trainOrg', {
                      initialValue: record.trainOrg,
                      rules: [
                        { required: true, message: '培训成绩不能为空！' },
                      ],
                    })(<Input tabIndex="1" />)
                  }
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      );
    };

    const trainContent = (r) => {
      return (
        <Row type="flex" className="training-info">
          <Col span={16} className="info-left">
            <h3 style={{ marginBottom: 8 }}>{dicts.dis('TRAIN_TYPE', r.trainType)}</h3>
            <span>{r.trainContent}</span>
          </Col>
          <Col span={8} style={{ textAlign: 'right' }}>
            <Button type="primary" ghost size="small" onClick={this.handleEdit.bind(this, r)} icon="edit" style={{ marginRight: 4, marginBottom: 8 }}>编辑</Button>
            <Button type="danger" size="small" onClick={this.handleDelete.bind(this, r.id)} icon="delete" style={{ marginBottom: 8 }}>删除</Button>
            <br />
            <span>{r.trainOrg}</span>
          </Col>
        </Row>
      );
    };

    const trainInfoPage = () => {
      const contentDom = [];
      data.forEach((r) => {
        contentDom.push(
          <Panel header={<strong>{`${r.startTime} ~ ${r.endTime}`}</strong>} key={r.trainOrg}>
            { trainContent(r) }
          </Panel>,
        );
      });

      return (
        <Collapse bordered={false} defaultActiveKey={[...trainKey]}>
          { contentDom }
        </Collapse>
      );
    };

    return (
      <Row>
        <Col span={16} offset={4}>
          <Row type="flex" justify="end">
            <Col span={12} offset={12}>
              <div style={{ marginBottom: 8, textAlign: 'right' }}>
                {
                  isCreate
                  ? <Button style={{ marginRight: '4px' }} onClick={this.handleRemove} size="small" icon="rollback" >取消</Button>
                  : <Button type="primary" ghost style={{ marginRight: '4px' }} onClick={this.handleCreate} size="small" icon="plus" >新增</Button>
                }
                <Button type="primary" style={{ marginRight: '4px' }} disabled={!isCreate} onClick={this.handleSave} size="small" icon="save" >保存</Button>
              </div>
            </Col>
          </Row>
          {isCreate ? renderCreateDom() : ''}
          {data.length > 0 ? trainInfoPage() : ''}
        </Col>
      </Row>
    );
  }
}

const TrainingInfoEditor = Form.create()(TrainingInfo);
export default connect(({ userTraining, utils }) => ({ userTraining, utils }))(TrainingInfoEditor);
