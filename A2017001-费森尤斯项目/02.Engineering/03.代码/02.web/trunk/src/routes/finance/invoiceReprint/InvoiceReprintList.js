import React, { Component } from 'react';
import { Button, Modal } from 'antd';
import { connect } from 'dva';
import CommonTable from '../../../components/CommonTable';

class InvoiceReprintList extends Component {
  onPageChange(page) {
    this.props.dispatch({
      type: 'invoiceReprint/load',
      payload: { page },
    });
  }

  onDetailModal(record) {
    this.props.dispatch({
      type: 'invoiceReprint/loadDetail',
      payload: { query: { ...record } },
    });
  }

  onPayWayModal(record) {
    this.props.dispatch({
      type: 'invoiceReprint/loadPayWay',
      payload: { query: { ...record } },
    });
  }

  onRefundModal(record) {
    this.props.dispatch({
      type: 'invoiceReprint/loadPayWay',
      payload: { query: { ...record }, onRefund: true },
    });
  }

  onReprint(record) {
    Modal.confirm({
      content: '重打操作不可撤销，确定重打？',
      okText: '打吧',
      cancelText: '我再看看',
      onOk: () => {
        const callback = (bizId) => {
          this.props.dispatch({
            type: 'print/getPrintInfo',
            payload: { code: '005', bizId },
          });
        };
        /* this.props.dispatch({
          type: 'invoiceReprint/reprint',
          payload: { ...record },
          callback,
        });*/
        const regId = record.regId;
        const invoiceNo = record.invoiceNo;
        this.props.dispatch({
          type: 'print/getPrintInfo',
          payload: { code: '005', bizId: `${regId}&&&${invoiceNo}` },
        });
      },
    });
  }

  render() {
    const { page, data, dataReFund, chanel } = this.props.invoiceReprint;
    const { dicts } = this.props.utils;
    const { wsHeight } = this.props.base;
    const columns = [
    // 病人姓名、发票号、金额、收款员、收款时间、支付方式、取消状态、取消人员、取消时间、重打按钮、退费按钮
    // 100,300,100,100,150,70,100,150,70
      { title: '病人姓名', dataIndex: 'patientInfo.name', key: 'patientInfo.name', width: 70 },
      // { title: '发票号', dataIndex: 'invoiceNo', key: 'invoiceNo', width: 250 },
      { title: '发票号',
        dataIndex: 'invoiceNo',
        key: 'invoiceNo',
        width: 200,
        render: (value, record) => {
          return (
            <Button icon="search" onClick={this.onDetailModal.bind(this, record)}>{value}</Button>
          );
        },
      },
      { title: '金额', dataIndex: 'totCost', key: 'totCost', width: 70, render: text => (text || 0.00).formatMoney(), className: 'text-align-right' },
      { title: '收款员', dataIndex: 'invoiceOperName', key: 'invoiceOperName', width: 70 },
      { title: '发票时间', dataIndex: 'invoiceTime', key: 'invoiceTime', width: 100 },
      { title: '支付标识号',
        dataIndex: 'payId',
        key: 'payId',
        width: 200,
        render: (value, record) => {
          return (
            <Button icon="search" onClick={this.onPayWayModal.bind(this, record)}>{value}</Button>
          );
        },
      },
      { title: '取消标志',
        dataIndex: 'cancelFlag',
        key: 'cancelFlag',
        width: 70,
        render: (value) => {
          return dicts.dis('CANCEL_FLAG', value);
        },
      },
      { title: '取消人员', dataIndex: 'cancelOperName', key: 'cancelOperName', width: 70 },
      { title: '取消时间', dataIndex: 'cancelTime', key: 'cancelTime', width: 100 },
      { title: chanel === 'reFund' ? '退费' : '重打',
        key: 'refund',
        display: true,
        width: 80,
        render: (text, record) => {
          if (chanel === 'reFund') {
            if (record.cancelFlag === '1') {
              return '不可退费';
            } else {
              return (
                <Button size="small" icon="pay-circle-o" onClick={this.onRefundModal.bind(this, record)}>退费</Button>
              );
            }
          } else if (record.cancelFlag === '1') {
            return '不可重打';
          } else {
            return (
              <Button size="small" icon="printer" onClick={this.onReprint.bind(this, record)}>重打</Button>
            );
          }
        },
      },
    ];

    return (
      <div>
        <CommonTable
          rowSelection={false}
          data={chanel === 'reFund' ? dataReFund : data}
          page={page}
          columns={columns}
          onPageChange={this.onPageChange.bind(this)}
          scroll={{ y: (wsHeight - 85 - 33 - 25) }}
          bordered
        />
      </div>
    );
  }
}

// style={{ width: '70' }}

export default connect(({ invoiceReprint, utils, base }) =>
  ({ invoiceReprint, utils, base }))(InvoiceReprintList);
