import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, Select, Row, Col, Button } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class ProcureSearchBar extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handlePrint = this.handlePrint.bind(this);
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
        const { selectedRowKeys } = this.props.procureAuitdSearch;
        const condition = { ...values, ...{selectedRowKeys} };
        w.location.href = '/api/hcp/pharmacy/buyBill/expertToExcel?data=' + JSON.stringify(condition);
      }
    });
  }
  // 打印
  handlePrint() {
    const search = this.props.onSearch;
    console.info('tiger 2 ',search);
    Modal.confirm({
      content: '确定要打印审批单吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        this.props.dispatch({
          type: 'print/getPrintInfo',
          payload: { code: '014', bizId: search },
        });
      },
    });
  }
  render() {
    const { buyState } = this.props.procureAuitdSearch;
    const { getFieldDecorator } = this.props.form;
    let stateOptions = [];
    if (buyState) {
      stateOptions = buyState.map(type => <Option key={type.columnKey}>{type.columnVal}</Option>);
    }
    return (
      <Form inline style={{ paddingBottom: '5px' }} >
        {/* <FormItem {...formItemLayout} >
          {getFieldDecorator('buyBill')(
            <Input
              placeholder="采购单号"
              addonAfter={
                <Button onClick={this.handleSubmit} icon="search" size="small" >查询</Button>
              }
              onPressEnter={this.handleSubmit}
              style={{ width: '100%' }}
            />,
          )}
        </FormItem>*/}
        <Row style={{ paddingBottom: '5px' }} >
          <Col span={12} style={{ paddingRight: '2px' }} >
            <FormItem>
              {getFieldDecorator('buyBill')(<Input placeholder="采购单号" style={{ width: 135 }} />,
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
        <Row>
          <Col span={12}>
            <FormItem>
              { getFieldDecorator('buyState')(
                <Select style={{ width: 135 }} placeholder="状态" allowClear>
                  {stateOptions}
                </Select>)}
            </FormItem>
          </Col>

          <Col span={6} style={{ paddingRight: '3px' }} >
            <Button onClick={this.handleExport} size="large" style={{ width: '100%' }} icon="reload" >导出</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}
const ProcureSearchBarForm = Form.create()(ProcureSearchBar);
export default connect(({ procureAuitdSearch }) => ({ procureAuitdSearch }))(ProcureSearchBarForm);
