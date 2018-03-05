import { connect } from 'dva';
import React, { Component } from 'react';
import { Icon, Badge } from 'antd';
import _ from 'lodash';

import CommonTable from '../../../components/CommonTable';

class FeeTypeList extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { financeStatistics, utils, base } = this.props;
    const { wsHeight } = base;
    const { feeTypePage, feeTypeData } = financeStatistics;

    const columns = [
      {
        title: '医院',
        dataIndex: '10',
        key: 'c11',
        width: 80,
      },
      {
        title: '开始日期',
        dataIndex: '0',
        key: 'c1',
        width: 80,
      }, {
        title: '结束日期',
        dataIndex: '1',
        key: 'c2',
        width: 80,
      }, {
        title: '大类名称',
        dataIndex: '2',
        key: 'c3',
        width: 130,
      }, {
        title: '大类代码',
        dataIndex: '3',
        key: 'c4',
        width: 100,
        className: 'text-align-center text-no-wrap',
      }, {
        title: '分类费用名称',
        dataIndex: '4',
        key: 'c5',
        width: 130,
      }, {
        title: '自费病人合计',
        dataIndex: '5',
        key: 'amt1',
        width: 130,
        className: 'text-align-right text-no-wrap',
        render: value => value.formatMoney(),
      }, {
        title: '医保病人合计',
        dataIndex: '6',
        key: 'amt2',
        width: 130,
        className: 'text-align-right text-no-wrap',
        render: value => value.formatMoney(),
      }, {
        title: '农合病人合计',
        dataIndex: '7',
        key: 'amt3',
        width: 130,
        className: 'text-align-right text-no-wrap',
        render: value => value.formatMoney(),
      }, {
        title: '总计',
        dataIndex: '8',
        key: 'amt4',
        width: 130,
        className: 'text-align-right text-no-wrap',
        render: value => value.formatMoney(),
      },
    ];
    return (
      <div>
        <CommonTable
          data={feeTypeData}
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
)(FeeTypeList);
