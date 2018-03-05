import React, { Component } from 'react';
import CommonTable from '../../../components/CommonTable';

class PayWayList extends Component {

  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['INVOICE_TYPE'],
    });
    this.props.dispatch({
      type: 'utils/initDataSource',
      payload: ['hcpUserCashier'],
    });
    this.props.dispatch({
      type: 'payWay/load',
      payload: { query: {} },
    });
  }

  render() {
    const { page, data, wsHeight, title } = this.props;
    const columns = [
      {
        title: '收款员',
        dataIndex: 'person',
        key: 'person',
        width: '9%',
      }, {
        title: '现金',
        dataIndex: 'cash',
        key: 'cash',
        width: '9%',
        className: 'column-right',
        render: (value) => { return (value || 0).formatMoney(); },
      },/* {
        title: '支票',
        dataIndex: 'cheque',
        key: 'cheque',
        width: '9%',
        className: 'column-right',
        render: (value) => { return (value || 0).formatMoney(); },
      },*/ {
        title: '信用卡',
        dataIndex: 'creditCard',
        key: 'creditCard',
        width: '9%',
        className: 'column-right',
        render: (value) => { return (value || 0).formatMoney(); },
      }, {
        title: '借记卡',
        dataIndex: 'debitCard',
        key: 'debitCard',
        width: '9%',
        className: 'column-right',
        render: (value) => { return (value || 0).formatMoney(); },
      },/* {
        title: '汇票',
        dataIndex: 'draft',
        key: 'draft',
        width: '9%',
        className: 'column-right',
        render: (value) => { return (value || 0).formatMoney(); },
      }, {
        title: '保险账户',
        dataIndex: 'insureAccount',
        key: 'insureAccount',
        width: '9%',
        className: 'column-right',
        render: (value) => { return (value || 0).formatMoney(); },
      },*/ {
        title: '院内账户',
        dataIndex: 'hospitalAccount',
        key: 'hospitalAccount',
        width: '9%',
        className: 'column-right',
        render: (value) => { return (value || 0).formatMoney(); },
      }, {
        title: '支付宝',
        dataIndex: 'aliPay',
        key: 'aliPay',
        width: '9%',
        className: 'column-right',
        render: (value) => { return (value || 0).formatMoney(); },
      }, {
        title: '微信',
        dataIndex: 'wxPay',
        key: 'wxPay',
        width: '9%',
        className: 'column-right',
        render: (value) => { return (value || 0).formatMoney(); },
      }, {
        title: '合计',
        dataIndex: 'all',
        key: 'all',
        width: '10%',
        className: 'column-right',
        render: (value) => { return (value || 0).formatMoney(); },
      },
    ];

    return (
      <div>
        <CommonTable
          bordered
          rowSelection={false}
          data={data}
          page={page}
          columns={columns}
          pagination={false}
          scroll={{ y: (wsHeight - 47 - 33 - 62 - 2) }}
        />
      </div>
    );
  }
}
export default PayWayList;
