import { connect } from 'dva';
import React, { Component } from 'react';

import CommonTable from '../../../components/CommonTable';

class MonthCheckList extends Component {

  render() {
    const { financeStatistics, base } = this.props;
    const { wsHeight } = base;
    const { monthCheckData } = financeStatistics;
    const columns = [
      {
        title: '物资名称',
        dataIndex: 'tradeName',
        key: 'tradeName',
        width: 80,
        className: 'text-align-center',
        render: (text, record) => {
          return (
            <div>
              {`${record.tradeName}`}<br />
              <font style={{ color: 'rgb(191, 191, 191)' }}>{`${record.batchNo}/${record.approvalNo}`}</font>
            </div>
          );
        },
      },
      {
        title: '期初',
        children: [
          {
            title: '数量',
            dataIndex: 'startQty',
            key: 'startQty',
            width: 80,
            className: 'text-align-center',
            render: (text, record) => {
              return (text != null ? text.formatMoney(0) : '0') + (record.unit ? record.unit : '');
            },
          },
          {
            title: '单价',
            dataIndex: 'startPrice',
            key: 'startPrice',
            width: 80,
            className: 'text-align-right',
            render: value => (value != null ? value.formatMoney() : '0.00'),
          },
          {
            title: '金额',
            dataIndex: 'startMoney',
            key: 'startMoney',
            width: 80,
            className: 'text-align-right',
            render: value => (value != null ? value.formatMoney() : '0.00'),
          },
        ],
      },
      {
        title: '所选期间采购',
        children: [
          {
            title: '数量',
            dataIndex: 'purchaseQty',
            key: 'purchaseQty',
            width: 80,
            className: 'text-align-center',
            render: (text, record) => {
              return (text != null ? text.formatMoney(0) : '0') + (record.unit ? record.unit : '');
            },
          },
          {
            title: '单价',
            dataIndex: 'purchasePrice',
            key: 'purchasePrice',
            width: 80,
            className: 'text-align-right',
            render: value => (value != null ? value.formatMoney() : '0.00'),
          },
          {
            title: '金额',
            dataIndex: 'purchaseMoney',
            key: 'purchaseMoney',
            width: 80,
            className: 'text-align-right',
            render: value => (value != null ? value.formatMoney() : '0.00'),
          },
        ],
      },
      {
        title: '所选期间消耗',
        children: [
          {
            title: '数量',
            dataIndex: 'consumeQty',
            key: 'consumeQty',
            width: 80,
            className: 'text-align-center',
            render: (text, record) => {
              return (text != null ? text.formatMoney(0) : '0') + (record.unit ? record.unit : '');
            },
          },
          {
            title: '单价',
            dataIndex: 'consumePrice',
            key: 'consumePrice',
            width: 80,
            className: 'text-align-right',
            render: value => (value != null ? value.formatMoney() : '0.00'),
          },
          {
            title: '金额',
            dataIndex: 'consumeMoney',
            key: 'consumeMoney',
            width: 80,
            className: 'text-align-right',
            render: value => (value != null ? value.formatMoney() : '0.00'),
          },
        ],
      },
      {
        title: '期末',
        children: [
          {
            title: '数量',
            dataIndex: 'endQty',
            key: 'endQty',
            width: 80,
            className: 'text-align-right',
            render: (text, record) => {
              return (text != null ? text.formatMoney(0) : '0') + (record.unit ? record.unit : '');
            },
          },
          {
            title: '单价',
            dataIndex: 'endPrice',
            key: 'endPrice',
            width: 80,
            className: 'text-align-right',
            render: value => (value != null ? value.formatMoney() : '0.00'),
          },
          {
            title: '金额',
            dataIndex: 'endMoney',
            key: 'endMoney',
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
          data={monthCheckData}
          pagination={false}
          columns={columns}
          bordered
          scroll={{ y: (wsHeight - 66 - 50) }}
          rowSelection={false}
        />
      </div>
    );
  }
}
export default connect(
  ({ financeStatistics, base }) => ({ financeStatistics, base }),
)(MonthCheckList);
