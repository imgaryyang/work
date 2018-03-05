import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Row, Col, Button } from 'antd';
import DictSelect from '../../../components/DictSelect';

const FormItem = Form.Item;

class InStoreSearchBar extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleExport = this.handleExport.bind(this);
  }


  handleSubmit() {
    const search = this.props.onSearch;
    this.props.form.validateFields((err, values) => {
      if (!err && search)search(values);
    });
  }

  handleReset() {
    this.props.form.resetFields();
  }
    // 导出
  handleExport() {
    const w = window.open('about:blank');
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { selectedRowKeys } = this.props.inStoreDetail;
        const condition = { ...values, ...{ selectedRowKeys } };
        w.location.href = `/api/hcp/pharmacy/phaInStore/expertToExcel?data= ${JSON.stringify(condition)}`;
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form inline style={{ paddingBottom: '5px' }} >
        <Row style={{ paddingBottom: '5px' }} >
          <Col span={12} style={{ paddingRight: '2px' }} >
            <FormItem>
              {getFieldDecorator('outBill')(<Input placeholder="出库单号" style={{ width: 135 }} />,
              )}
            </FormItem>
          </Col>
          <Col span={6} style={{ paddingRight: '3px' }} >
            <Button type="primary" size="large" onClick={() => this.handleSubmit()} style={{ width: '100%' }} icon="search" >查询</Button>
          </Col>
          <Col span={6} style={{ paddingRight: '3px' }} >
            <Button onClick={this.handleReset} size="large" style={{ width: '100%' }} icon="reload" >清空</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}
const InStoreSearchBarForm = Form.create()(InStoreSearchBar);
export default connect(({ inStoreDetail }) => ({ inStoreDetail }))(InStoreSearchBarForm);
