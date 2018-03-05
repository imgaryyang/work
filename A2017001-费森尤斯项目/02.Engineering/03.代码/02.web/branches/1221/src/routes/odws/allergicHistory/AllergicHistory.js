/**
 * 过敏史
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Spin, Card, Row, Col, Form, Checkbox, Input,
  Badge, Button, notification,
} from 'antd';
import moment from 'moment';

import CommonItemSearchInput from '../../../components/searchInput/CommonItemSearchInput';
import CommonTable from '../../../components/CommonTable';

import styles from './AllergicHistory.less';

const FormItem = Form.Item;

/**
 * 判断日期是否当天
 */
function isToday(date) {
  return moment(date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD');
}

class AllergicHistory extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.onSelectCommonItem = this.onSelectCommonItem.bind(this);
  }

  state = {
    formValue: {
      item: {},
    },
  };

  componentWillMount() {
    // 载入过敏信息
    this.props.dispatch({
      type: 'odwsAllergicHistory/loadAllergicHistory',
      payload: {
        patientId: this.props.odws.currentReg.patient.id,
      },
    });
  }

  componentWillReceiveProps(props) {
    // 当前就诊人发生改变
    if (this.props.odws.currentReg.id !== props.odws.currentReg.id) {
      // 载入过敏信息
      this.props.dispatch({
        type: 'odwsAllergicHistory/loadAllergicHistory',
        payload: {
          patientId: this.props.odws.currentReg.patient.id,
        },
      });
    }
  }

  /**
   * 选择药物
   */
  onSelectCommonItem(record) {
    this.setState({
      formValue: {
        item: record,
      },
    });
  }

  /**
   * 保存过敏信息
   */
  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      // console.log(values);
      if (!err) {
        if (!values.itemCode && !values.deny) {
          notification.warning({
            message: '警告',
            description: '请选择过敏药物或勾选“病人否认过敏史”！',
          });
          return;
        }
        const newValues = {
          ...values,
          deny: values.deny === true ? '1' : '0',
          regId: this.props.odws.currentReg.id, // 关联挂号id
          patientId: this.props.odws.currentReg.patient.id, // 关联患者id
        };
        this.props.dispatch({
          type: 'odwsAllergicHistory/saveAllergic',
          payload: newValues,
        });
      }
    });
  }

  handleReset() {
    this.setState({
      formValue: {
        item: {},
      },
    }, () => this.props.form.resetFields());
  }

  render() {
    const { odws, odwsAllergicHistory, form } = this.props;
    const { getFieldDecorator } = form;
    const { spin, allergicHistory } = odwsAllergicHistory;
    const { formValue } = this.state;
    const { odwsWsHeight, currentReg } = odws;

    const listCardHeight = odwsWsHeight - 6 - 139 - 10;

    const formItemLayout = {
      wrapperCol: { span: 24 },
      size: 'small',
    };

    const formItemLayoutColSpan = {
      wrapperCol: { span: 24 },
      size: 'small',
    };

    const columns = [
      { title: '过敏药物', dataIndex: 'itemName', key: 'itemName', width: 200 },
      { title: '病人否认过敏史',
        dataIndex: 'deny',
        key: 'deny',
        width: 90,
        render: text => (
          <span><Badge status={text === '1' ? 'success' : 'error'} />{text === '1' ? '是' : '否'}</span>
        ),
        className: 'text-align-center',
      },
      { title: '备注', dataIndex: 'memo', key: 'memo', width: 300 },
      { title: '操作者', dataIndex: 'createOper', key: 'createOper', width: 80 },
      { title: '操作时间', dataIndex: 'createTime', key: 'createTime', width: 125, render: text => (text ? moment(text).format('YYYY-MM-DD hh:mm:ss') : '') },
    ];

    const disabled = !(isToday(currentReg.regTime) && currentReg.regState === '30');

    /* CommonItemSearchInput : 0 - 收费项目 ；1 - 药品 */
    return (
      <Spin spinning={spin} >
        <Form inline className={styles.form} >
          <Card className={styles.inputCard} >
            <div>
              <Row>
                <Col span={3} style={{ textAlign: 'right', lineHeight: '32px' }} >过敏药物：</Col>
                <Col span={16} >
                  <FormItem style={{ display: 'none' }} >
                    {getFieldDecorator('itemCode', {
                      initialValue: formValue.item.itemCode,
                    })(<Input />)}
                  </FormItem>
                  <FormItem style={{ display: 'none' }} >
                    {getFieldDecorator('itemName', {
                      initialValue: formValue.item.itemName,
                    })(<Input />)}
                  </FormItem>
                  <FormItem style={{ width: '100%' }} {...formItemLayout} >
                    {getFieldDecorator('allergicMed')(
                      <CommonItemSearchInput
                        tabIndex={1}
                        onSelect={this.onSelectCommonItem}
                        itemType="1"
                        disabled={disabled}
                        style={{ width: '100%' }}
                      />,
                    )}
                  </FormItem>
                </Col>
                <Col span={5} >
                  <FormItem style={{ width: '100%', paddingLeft: '15px' }} wrapperCol={{ span: 24 }} >
                    {getFieldDecorator('deny', {
                      initialValue: formValue.deny,
                    })(
                      <Checkbox tabIndex={3} disabled={disabled} >病人否认过敏史</Checkbox>,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={3} style={{ textAlign: 'right', lineHeight: '32px' }} >备注信息：</Col>
                <Col span={21} >
                  <FormItem style={{ width: '100%' }} {...formItemLayoutColSpan} >
                    {getFieldDecorator('memo', {
                      initialValue: formValue.memo,
                    })(
                      <Input tabIndex={4} maxLength={100} disabled={disabled} style={{ width: '100%' }} />,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={24} >
                  <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }} icon="plus" size="large" onClick={this.handleSubmit} disabled={disabled} >保存</Button>
                  <Button onClick={this.handleReset} icon="reload" size="large" disabled={disabled} >清空</Button>
                </Col>
              </Row>
            </div>
          </Card>
          <Card className={styles.listCard} style={{ height: `${listCardHeight}px` }} >
            <CommonTable
              rowSelection={false}
              data={allergicHistory}
              columns={columns}
              pagination={false}
              scroll={{ y: (listCardHeight - 10 - 37) }}
              bordered
              size="middle"
            />
          </Card>
        </Form>
      </Spin>
    );
  }
}
const AllergicHistoryForm = Form.create()(AllergicHistory);
export default connect(
  ({ odws, odwsAllergicHistory, base, utils }) => ({ odws, odwsAllergicHistory, base, utils }),
)(AllergicHistoryForm);
