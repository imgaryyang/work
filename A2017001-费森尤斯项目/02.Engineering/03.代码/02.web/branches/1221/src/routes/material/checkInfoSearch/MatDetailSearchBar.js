import React, { Component } from 'react';
import { Row, Col, Button, Modal } from 'antd';
import { connect } from 'dva';

class MatCheckInfoSearchBar extends Component {
  handleSubmit() {
    const search = this.props.onSearch;
    this.props.form.validateFields((err, values) => {
      if (!err && search) {
        this.props.setCheckInfoSearchObjs(values);
        search(this.props.matCheckInfoSearchObjs);
      }
    });
  }

  handlePrint() {
    const search = this.props.matCheckInfoSearch.record.id;
    Modal.confirm({
      content: '确定要打印盘点单吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        this.props.dispatch({
          type: 'print/getPrintInfo',
          payload: { code: '102', bizId: search },
        });
      },
    });
  }

  handleReset() {
    this.props.form.resetFields();
    this.props.setCheckInfoSearchObjs(null);
  }
  handleExport() {
    const w = window.open('about:blank');
    const { query } = this.props.matCheckInfoSearch;
    w.location.href = `/api/hcp/material/matCheckInfo/expertBillToExcel?data= ${JSON.stringify(query)}`;
  }
  render() {
    const { record } = this.props.matCheckInfoSearch;
    const { depts, deptsIdx, dicts } = this.props.utils;
    return (
      <div className="action-form-wrapper">
        <Row type="flex" justify="space-between" align="middle" >
          <Col span="4">
            <div >科室：{record ? depts.disDeptName(deptsIdx, record.deptId) : ''}</div>
          </Col>
          <Col span="4">
            <div >创建人：{record ? record.createOper : ''}</div>
          </Col>
          <Col span="5">
            <div >盘点单号：{record ? record.id : ''}</div>
          </Col>
          <Col span="5">
            <div >盘点单状态：{record ? dicts.dis('CHECK_STATE', record.checkState) : ''}</div>
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
  ({ matCheckInfoSearch, utils }) => ({ matCheckInfoSearch, utils }),
)(MatCheckInfoSearchBar);
