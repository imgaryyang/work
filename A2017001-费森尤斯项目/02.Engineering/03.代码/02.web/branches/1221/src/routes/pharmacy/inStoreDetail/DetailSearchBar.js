import React, { Component } from 'react';
import { Row, Col, Button, Modal, notification } from 'antd';
import { connect } from 'dva';

class InStoreSearchBar extends Component {
  handlePrint() {
    const { record } = this.props.inStoreDetail;
    if (record.id) {
      Modal.confirm({
        content: '确定要打印入库单吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.props.dispatch({
            type: 'print/getPrintInfo',
            payload: { code: '009', bizId: record.id },
          });
        },
      });
    } else {
      notification.error({
        message: '提示',
        description: '请先选择入库单号!',
      });
    }
  }
  handleReset() {
    this.props.form.resetFields();
    this.props.setInStoreSearchObjs(null);
  }
  handleExport() {
    const w = window.open('about:blank');
    const { record } = this.props.inStoreDetail;
    const query = { inBill: record.id };
    w.location.href = `/api/hcp/pharmacy/directIn/expertToExcel?data=${JSON.stringify(query)}`;
  }
  render() {
    const { record } = this.props.inStoreDetail;
    const { depts, deptsIdx, dicts } = this.props.utils;
    return (
      <div className="action-form-wrapper">
        <Row type="flex" justify="space-between" align="middle" >
          <Col span="4">
            <div >科室：{record ? depts.disDeptName(deptsIdx, record.deptId) : ''}</div>
          </Col>
          <Col span="4">
            <div >操作人：{record ? record.inOper : ''}</div>
          </Col>
          <Col span="5">
            <div >入库单号：{record ? record.id : ''}</div>
          </Col>
          <Col span="5">
            <div >入库单状态：{record ? dicts.dis('INPUT_STATE', record.inputState) : ''}</div>
          </Col>
          <Col span={3} style={{ paddingRight: '3px' }} >
            <Button type="primary" size="large" onClick={this.handlePrint.bind(this)} style={{ width: '100%' }} icon="search" >打印</Button>
          </Col>
          <Col span={3} style={{ paddingRight: '3px' }} >
            <Button onClick={this.handleExport.bind(this)} size="large" style={{ width: '100%' }} icon="reload" >导出</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect(
  ({ inStoreDetail, utils }) => ({ inStoreDetail, utils }),
)(InStoreSearchBar);
