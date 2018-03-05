import React, { Component } from 'react';
import { Row, Col, Modal, Input } from 'antd';
import { connect } from 'dva';
import CommonTable from '../../../components/CommonTable';

class PayWayModal extends Component {
  // onPageChange(page) {
  //   this.props.dispatch({
  //     type: 'invoiceReprint/loadPayWay',
  //     payload: { page },
  //   });
  // }

  close() {
    this.props.dispatch({
      type: 'invoiceReprint/setState',
      payload: {
        payWayVisible: false,
        payWayData: null,
        // payWayQuery: { payId: null },
      },
    });
  }

  render() {
    const { payWayPage, payWayData, payWayQuery, payWayVisible } = this.props.invoiceReprint;
    const { dicts } = this.props.utils;
    // const visible = !!payWayQuery.payId;
    const title = `支付方式${payWayQuery.payId}`;
    // const { wsHeight } = this.props.base; 限高使用

    const columns = [
      { title: '支付序号', dataIndex: 'payNum', key: 'payNum', width: 100 },
      { title: '支付方式',
        dataIndex: 'payWay',
        key: 'payWay',
        width: 100,
        render: (value) => {
          return dicts.dis('PAY_MODE', value);
        },
      },
      { title: '金额', dataIndex: 'payCost', key: 'payCost', width: 100, render: text => (text || 0.00).formatMoney(), className: 'text-align-right' },
      { title: '取消标志',
        dataIndex: 'cancelFlag',
        key: 'cancelFlag',
        width: 70,
        render: (value) => {
          return dicts.dis('CANCEL_FLAG', value);
        },
      },
      // { title: '取消人员', dataIndex: 'cancelOper', key: 'cancelOper', width: 100 },
      // { title: '取消时间', dataIndex: 'cancelTime', key: 'cancelTime', width: 100 },
    ];

    // hasFeedback 属性删除，解决firefox无法输入汉字的bug xiaweiyi
    return (
      <Modal
        width={540}
        title={title}
        visible={payWayVisible}
        closable
        footer={null}
        onCancel={this.close.bind(this)}
      >
        <Row span={24} gutter={16} style={{ marginBottom: 8 }}>
          <Col span={8}>
            <Input addonBefore="病人姓名" defaultValue={payWayQuery.patientInfo ? payWayQuery.patientInfo.name : ''} disabled />
          </Col>
          <Col span={8}>
            <Input addonBefore="发票号" defaultValue={payWayQuery.invoiceNo || ''} disabled />
          </Col>
          <Col span={8}>
            <Input addonBefore="总费用" defaultValue={(payWayQuery.totCost || 0.00).formatMoney()} className="text-align-right" disabled />
          </Col>
        </Row>
        <Row>
          <CommonTable
            rowSelection={false}
            data={payWayData}
            page={payWayPage}
            columns={columns}
            pagination={false}
            bordered
          />
        </Row>
      </Modal>
    );
  }
}

export default connect(({ invoiceReprint, utils, base }) =>
  ({ invoiceReprint, utils, base }))(PayWayModal);
