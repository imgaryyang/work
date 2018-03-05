import React, { Component } from 'react';
import CommonTable from '../../../components/CommonTable';
import Styles from '../settings/RegVisit.less';

class RegRefundList extends Component {

  render() {
    const { payWays, dicts } = this.props;

    const columns = [
      {
        title: '支付序号',
        dataIndex: 'payNum',
        key: 'payNum',
        width: 100,
      },
      {
        title: '支付方式',
        dataIndex: 'payWay',
        key: 'payWay',
        width: 100,
        render: value => dicts.dis('PAY_MODE', value),
      },
      {
        title: '金额',
        dataIndex: 'payCost',
        width: 100,
        key: 'payCost',
        render: value => (value || 0).formatMoney(),
      },
    ];

    return (
      <div className={Styles.modelInnerTable}>
        <CommonTable
          data={payWays}
          columns={columns}
          rowSelection={false}
          size="small"
          paginationStyle="mini"
          scroll={{ y: 180 }}
        />
      </div>
    );
  }
}
export default RegRefundList;
