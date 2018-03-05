import React, { Component } from 'react';
import CommonTable from '../../../components/CommonTable';

class WorkLoadList extends Component {

  componentWillMount() {
    this.props.dispatch({
      type: 'workLoad/load',
      payload: { query: {} },
    });
  }

  render() {
    const { page, data, wsHeight } = this.props;

    const columns = [{
      title: '操作员',
      dataIndex: 'person',
      key: 'person',
      width: '5%',
    }, {
      title: '挂号',
      children: [{
        title: '数量',
        dataIndex: 'regCount',
        key: 'regCount',
        width: '5%',
        className: 'column-right',
      }, {
        title: '挂号费',
        dataIndex: 'regFee',
        key: 'regFee',
        width: '5%',
        className: 'column-right',
        render: (value) => { return (value || 0).formatMoney(); },
      }, {
        title: '诊疗费',
        dataIndex: 'regClinicFee',
        key: 'regClinicFee',
        width: '5%',
        className: 'column-right',
        render: (value) => { return (value || 0).formatMoney(); },
      }, {
        title: '附加费',
        dataIndex: 'regAddFee',
        key: 'regAddFee',
        width: '5%',
        className: 'column-right',
        render: (value) => { return (value || 0).formatMoney(); },
      }, {
        title: '费用小计',
        dataIndex: 'regFeeSum',
        key: 'regFeeSum',
        width: '5%',
        className: 'column-money',
        render: (value) => { return (value || 0).formatMoney(); },
      }],
    }, {
      title: '退号',
      children: [{
        title: '数量',
        dataIndex: 'refundCount',
        key: 'refundCount',
        width: '5%',
        className: 'column-right',
      }, {
        title: '挂号费',
        dataIndex: 'refundFee',
        key: 'refundFee',
        width: '5%',
        className: 'column-right',
        render: (value) => { return (value || 0).formatMoney(); },
      }, {
        title: '诊疗费',
        dataIndex: 'refundClinicFee',
        key: 'refundClinicFee',
        width: '5%',
        className: 'column-right',
        render: (value) => { return (value || 0).formatMoney(); },
      }, {
        title: '附加费',
        dataIndex: 'refundAddFee',
        key: 'refundAddFee',
        width: '5%',
        className: 'column-right',
        render: (value) => { return (value || 0).formatMoney(); },
      }, {
        title: '费用小计',
        dataIndex: 'refundFeeSum',
        key: 'refundFeeSum',
        width: '5%',
        className: 'column-money',
        render: (value) => { return (value || 0).formatMoney(); },
      }],
    }, {
      title: '合计',
      children: [{
        title: '数量',
        dataIndex: 'totalCount',
        key: 'totalCount',
        width: '5%',
        className: 'column-right',
      }, {
        title: '挂号费',
        dataIndex: 'totalFee',
        key: 'totalFee',
        width: '5%',
        className: 'column-right',
        render: (value) => { return (value || 0).formatMoney(); },
      }, {
        title: '诊疗费',
        dataIndex: 'totalClinicFee',
        key: 'totalClinicFee',
        width: '5%',
        className: 'column-right',
        render: (value) => { return (value || 0).formatMoney(); },
      }, {
        title: '附加费',
        dataIndex: 'totalAddFee',
        key: 'totalAddFee',
        width: '5%',
        className: 'column-right',
        render: (value) => { return (value || 0).formatMoney(); },
      }, {
        title: '费用小计',
        dataIndex: 'totalFeeSum',
        key: 'totalFeeSum',
        width: '5%',
        className: 'column-money',
        render: (value) => { return (value || 0).formatMoney(); },
      }],
    }];

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
export default WorkLoadList;
