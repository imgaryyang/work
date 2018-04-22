import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Row, Col } from 'antd';

import CommonTable from '../../../components/CommonTable';
import SearchBar from './SearchBar';

class TrilateralChecking extends Component {

  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
  }

  componentWillMount() {
    /* this.props.dispatch({
      type: 'user/load',
    });*/
  }

  onSearch(values) {
    console.info('list search ', values);
    this.props.dispatch({
      type: 'user/load',
      payload: {
        query: values,
      },
    });
  }

  render() {
    const { trilateralChecking, base } = this.props;
    const { wsHeight } = base;
    const { data, page } = trilateralChecking;

    const columns = [
      { title: '订单类型',
        dataIndex: 'orderType',
        key: 'orderType',
        width: 120,
        render: (text, record) => {
          return (
            <div>
              {text}<br />
              {record.orderId}
            </div>
          );
        },
      },
      { title: '患者',
        dataIndex: 'patientNo',
        key: 'patientNo',
        width: 200,
        render: (text, record) => {
          return (
            <div>
              {record.patientName}<br />
              {text}
            </div>
          );
        },
      },
      { title: '发生额', dataIndex: 'realAmt', key: 'realAmt', width: 200 },
      { title: '订单状态', dataIndex: 'orderStatus', key: 'orderStatus', width: 200 },
      { title: '订单时间', dataIndex: 'orderCreateTime', key: 'orderCreateTime', width: 200 },
      { title: '结算单',
        dataIndex: 'settlements.settleId',
        key: 'settlements.settleId',
        width: 400,
        render: (text, record) => {
          return record.settlements.map(({ settleId, amt, settleStatus, tradeStatus, payChannelCode, payChannelName, payTypeCode, payTypeName, settleCreateTime }, idx) => {
            return (
              <div>
                <span>{idx}</span>
                <span>{settleId}</span>
                <span>{amt}</span>
                <span>{settleStatus}</span>
                <span>{payChannelName}</span>
                <span>{settleCreateTime}</span>
              </div>
            );
          });
        },
      },
    ];

    return (
      <div style={{ height: `${wsHeight}px`, overflow: 'hidden' }} >
        <SearchBar />
        <CommonTable
          data={data}
          page={page}
          columns={columns}
          onPageChange={this.onPageChange}
          onSelectChange={this.rowSelectChange}
          scroll={{ y: (wsHeight - 41 - 36 - 62) }}
          bordered
        />
      </div>
    );
  }
}
export default connect(
  ({ trilateralChecking, base }) => ({ trilateralChecking, base }),
)(TrilateralChecking);
