import React, { Component } from 'react';
import { connect } from 'dva';
import CommonTable from '../../../components/CommonTable';

class InStoreSummaryList extends Component {

  onPageChange(page) {
    this.props.dispatch({
      type: 'inStoreSummary/load',
      payload: { page },
    });
  }

  render() {
    const { page, data } = this.props;
    const { wsHeight } = this.props.base;
    const columns = [
      { title: '供货商', dataIndex: '3', key: 'drugCode', width: '40%' },
      { title: '进价总额', dataIndex: '1', key: 'commonName', width: '30%', render: text => (text ? text.formatMoney(2) : ''), className: 'text-align-right' },
      { title: '售价总额', dataIndex: '2', key: 'tradeName', width: '30%', render: text => (text ? text.formatMoney(2) : ''), className: 'text-align-right' },
    ];

    return (
      <CommonTable
        data={data}
        size="small"
        bordered
        columns={columns}
        page={page}
        onPageChange={this.onPageChange.bind(this)}
        rowSelection={false}
        scroll={{ y: (wsHeight - 190) }}
      />
    );
  }
}
export default connect(({ base }) => ({ base }))(InStoreSummaryList);
