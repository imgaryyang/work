import React, { Component } from 'react';
import { Row, Col, Button, Modal, notification } from 'antd';
import { connect } from 'dva';

class DetailSearchBar extends Component {
  handlePrint() {
    const { record } = this.props.outputdetail;
    if (record.id) {
      Modal.confirm({
        content: '确定要打印出库单吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.props.dispatch({
            type: 'print/getPrintInfo',
            payload: { code: '110', bizId: record.id },
          });
        },
      });
    } else {
      notification.error({
        message: '提示',
        description: '请先选择出库单号!',
      });
    }
  }
  handleReset() {
    this.props.form.resetFields();
    this.props.setInStoreSearchObjs(null);
  }
  handleExport() {
    const w = window.open('about:blank');
    const { query } = this.props.outputdetail;
    w.location.href = `/api/hcp/material/outputInfo/expertToExcel?data= ${JSON.stringify(query)}`;
  }
  render() {
    const { record } = this.props.outputdetail;
    const { depts, deptsIdx, dicts } = this.props.utils;
    return (
      <div className="action-form-wrapper">
        <Row type="flex" justify="space-between" align="middle" >
          <Col span="4">
            <div >科室：{record ? depts.disDeptName(deptsIdx, record.deptId) : ''}</div>
          </Col>
          <Col span="4">
            <div >操作人：{record ? record.outOper : ''}</div>
          </Col>
          <Col span="5">
            <div >出库单号：{record ? record.id : ''}</div>
          </Col>
          <Col span="5">
            <div >出库单状态：{record ? dicts.dis('OUTPUT_STATE', record.outputState) : ''}</div>
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
  ({ outputdetail, utils }) => ({ outputdetail, utils }),
)(DetailSearchBar);
