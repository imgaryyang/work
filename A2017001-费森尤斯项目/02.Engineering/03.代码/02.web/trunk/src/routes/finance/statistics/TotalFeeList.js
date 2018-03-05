import { connect } from 'dva';
import React, { Component } from 'react';
import { Icon, Badge } from 'antd';
import _ from 'lodash';

import CommonTable from '../../../components/CommonTable';

class TotalFeeList extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { financeStatistics, utils, base } = this.props;
    const { wsHeight } = base;
    const { totalFeePage, totalFeeData } = financeStatistics;

    const columns = [
      {
        title: '医院',
        dataIndex: '18',
        key: 'tc18',
        width: 120,
        className: 'text-align-center',
      },
      {
        title: '项目',
        dataIndex: '0',
        key: 'tc0',
        width: 80,
        className: 'text-align-center',
      },
      {
        title: '日期',
        dataIndex: '1',
        key: 'tc1',
        width: 80,
        className: 'text-align-center',
      },
      {
        title: '总费用',
        children: [
          {
            title: '医保',
            dataIndex: '2',
            key: 'tc2',
            width: 80,
            className: 'text-align-right',
            render: value => value != null ? value.formatMoney() : '0.00',
          },
          {
            title: '居保',
            dataIndex: '3',
            key: 'tc3',
            width: 80,
            className: 'text-align-right',
            render: value => value != null ? value.formatMoney() : '0.00',
          },
          {
            title: '自费',
            dataIndex: '4',
            key: 'tc4',
            width: 80,
            className: 'text-align-right',
            render: value => value != null ? value.formatMoney() : '0.00',
          },
          {
            title: '合计',
            dataIndex: '5',
            key: 'tc5',
            width: 80,
            className: 'text-align-right',
            render: value => value != null ? value.formatMoney() : '0.00',
          },
        ],
      },
      {
        title: '记账',
        children: [
          {
            title: '医保',
            dataIndex: '6',
            key: 'tc6',
            width: 80,
            className: 'text-align-right',
            render: value => value != null ? value.formatMoney() : '0.00',
          },
          {
            title: '居保',
            dataIndex: '7',
            key: 'tc7',
            width: 80,
            className: 'text-align-right',
            render: value => value != null ? value.formatMoney() : '0.00',
          },
          {
            title: '自费',
            dataIndex: '8',
            key: 'tc8',
            width: 80,
            className: 'text-align-right',
            render: value => value != null ? value.formatMoney() : '0.00',
          },
          {
            title: '合计',
            dataIndex: '9',
            key: 'tc9',
            width: 80,
            className: 'text-align-right',
            render: value => value != null ? value.formatMoney() : '0.00',
          },
        ],
      },
      {
        title: '现金',
        children: [
          {
            title: '医保',
            dataIndex: '10',
            key: 'tc10',
            width: 80,
            className: 'text-align-right',
            render: value => value != null ? value.formatMoney() : '0.00',
          },
          {
            title: '居保',
            dataIndex: '11',
            key: 'tc11',
            width: 80,
            className: 'text-align-right',
            render: value => value != null ? value.formatMoney() : '0.00',
          },
          {
            title: '自费',
            dataIndex: '12',
            key: 'tc12',
            width: 80,
            className: 'text-align-right',
            render: value => value != null ? value.formatMoney() : '0.00',
          },
          {
            title: '合计',
            dataIndex: '13',
            key: 'tc13',
            width: 80,
            className: 'text-align-right',
            render: value => value != null ? value.formatMoney() : '0.00',
          },
        ],
      },
      {
        title: '药费',
        children: [
          {
            title: '医保',
            dataIndex: '14',
            key: 'tc14',
            width: 80,
            className: 'text-align-right',
            render: value => value != null ? value.formatMoney() : '0.00',
          },
          {
            title: '居保',
            dataIndex: '15',
            key: 'tc15',
            width: 80,
            className: 'text-align-right',
            render: value => value != null ? value.formatMoney() : '0.00',
          },
          {
            title: '自费',
            dataIndex: '16',
            key: 'tc16',
            width: 80,
            className: 'text-align-right',
            render: value => value != null ? value.formatMoney() : '0.00',
          },
          {
            title: '合计',
            dataIndex: '17',
            key: 'tc17',
            width: 80,
            className: 'text-align-right',
            render: value => value != null ? value.formatMoney() : '0.00',
          },
        ],
      },
    ];
    return (
      <div>
        <CommonTable
          data={totalFeeData}
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
)(TotalFeeList);
