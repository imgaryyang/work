import { connect } from 'dva';
import React, { Component } from 'react';

import CommonTable from '../../../components/CommonTable';

class DailyIncomeAndExpensesList extends Component {

  render() {
    const { financeStatistics, base } = this.props;
    const { wsHeight } = base;
    const { incomeAndExpensesData } = financeStatistics;

    const columns = [
      {
        title: '医院名称',
        dataIndex: 'hosName',
        key: 'tc8',
        width: 80,
        className: 'text-align-center',
      },
      {
        title: '收入',
        dataIndex: 'totalAmt',
        key: 'tc0',
        width: 80,
        className: 'text-align-center',
        render: value => (value != null ? value.formatMoney() : '0.00'),
      },
      {
        title: '药品消耗',
        children: [
          {
            title: '进价',
            dataIndex: 'totalBuyOfDrug',
            key: 'tc2',
            width: 80,
            className: 'text-align-right',
            render: value => (value != null ? value.formatMoney() : '0.00'),
          },
          {
            title: '售价',
            dataIndex: 'totalSaleOfDrug',
            key: 'tc3',
            width: 80,
            className: 'text-align-right',
            render: value => (value != null ? value.formatMoney() : '0.00'),
          },
        ],
      },
      {
        title: '物资消耗',
        children: [
          {
            title: '进价',
            dataIndex: 'totalBuyOfMat',
            key: 'tc6',
            width: 80,
            className: 'text-align-right',
            render: value => (value != null ? value.formatMoney() : '0.00'),
          },
          {
            title: '售价',
            dataIndex: 'totalSaleOfMat',
            key: 'tc7',
            width: 80,
            className: 'text-align-right',
            render: value => (value != null ? value.formatMoney() : '0.00'),
          },
        ],
      },
    ];
    return (
      <div>
        <CommonTable
          data={incomeAndExpensesData}
          pagination={false}
          columns={columns}
          bordered
          scroll={{ y: (wsHeight - 43 - 35) }}
          rowSelection={false}
        />
      </div>
    );
  }
}
export default connect(
  ({ financeStatistics, base }) => ({ financeStatistics, base }),
)(DailyIncomeAndExpensesList);
