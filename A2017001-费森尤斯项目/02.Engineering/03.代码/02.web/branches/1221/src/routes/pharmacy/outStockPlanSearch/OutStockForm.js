import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Row, Col, Form, Input } from 'antd';

const FormItem = Form.Item;
// const Search = Input.Search;

class SelectForm extends Component {
  constructor(props) {
    super(props);
    // this.handleSubmit = this.handleSubmit.bind(this);
    this.toSearch = this.toSearch.bind(this);
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'outStockPlan/saveOutStockInfo',
          value: values,
        });
      }
    });
  }

  handleSubmitBack() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'outStockPlan/backOutStockInfo',
          value: values,
        });
      }
    });
  }

  toSearch(event) {
    const { record } = this.props.outStockPlan;
    this.props.dispatch({
      type: 'outStockPlan/addOutStockDetail',
      record,
      payload: {
        tradeName: event.target.value,
      },
    });
  }

  render() {
    const { record, sum, searchSwitch } = this.props.outStockPlan;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
      style: { width: '100%' },
    };

    return (
      <Form inline style={{ paddingBottom: '5px' }} >
        <Row style={{ paddingBottom: '5px' }} >
          <Col span="8" >
            <FormItem label="请领科室" {...formItemLayout} >
              { getFieldDecorator('deptid', { initialValue: record[3] })(
                <Input disabled style={{ width: '100%' }} />,
              )}
            </FormItem>
          </Col>
          <Col span="8" >
            <FormItem label="请领人员" {...formItemLayout}>
              { getFieldDecorator('appOper', { initialValue: record[1] })(
                <Input disabled style={{ width: '100%' }} />,
              )}
            </FormItem>
          </Col>
          <Col span="8" >
            <FormItem label="合计金额" {...formItemLayout}>
              { getFieldDecorator('sum', { initialValue: sum.formatMoney() })(
                <Input disabled style={{ width: '100%' }} />,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem label="药品过滤" {...formItemLayout}>
              { getFieldDecorator('tradeName')(
                <Input placeholder="药名" onPressEnter={this.toSearch.bind(this)} disabled={searchSwitch} style={{ width: '100%' }} />,
              )}
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="备注" {...formItemLayout}>
              {getFieldDecorator('comm', { initialValue: '请领核准出库' })(
                <Input style={{ width: '100%' }} />,
              )}
            </FormItem>
          </Col>
          <Col span="4" >
            <Row>
              <Col span={9} />
              <Col span={15} style={{ textAlign: 'right' }} >
                <Button type="primary" size="large" onClick={() => this.handleSubmit()} icon="upload" style={{ width: '100%' }} >出库</Button>
              </Col>
            </Row>
          </Col>
          <Col span="4" >
            <Row>
              <Col span={9} />
              <Col span={15} style={{ textAlign: 'right' }} >
                <Button type="primary" size="large" onClick={() => this.handleSubmitBack()} icon="close" style={{ width: '100%' }} >驳回</Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    );
  }
}

const OutStockForm = Form.create()(SelectForm);
export default connect(
  ({ outStockPlan }) => ({ outStockPlan }),
)(OutStockForm);
