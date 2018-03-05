import { connect } from 'dva';
import React, { Component } from 'react';

import CommonTable from '../../../components/CommonTable';

class MatConsumList extends Component {

  render() {
    const { financeStatistics, base } = this.props;
    const { wsHeight } = base;
    const { matConsumData } = financeStatistics;
    const columns = [
      {
        title: '物资名称',
        dataIndex: '1',
        key: 'c1',
        width: 80,
        className: 'text-align-center text-no-wrap',
      }, {
        title: '数量',
        dataIndex: '4',
        key: 'c2',
        width: 80,
        className: 'text-align-center text-no-wrap',
        render: (value, record) => {
          return record[4] + (record[2] ? record[2] : '');
        },
      }, {
        title: '单价',
        dataIndex: '5',
        key: 'c3',
        width: 130,
        className: 'text-align-center text-no-wrap',
        render: (value, record) => {
          return (record[5] || 0.00).formatMoney();
        },
      }, {
        title: '金额',
        dataIndex: '6',
        key: 'c4',
        width: 100,
        className: 'text-align-center text-no-wrap',
        render: (value, record) => {
          return (record[6] || 0.00).formatMoney();
        },
      },
    ];
    return (
      <div>
        <CommonTable
          data={matConsumData}
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
)(MatConsumList);
