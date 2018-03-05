import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import SearchBar from './InvoiceReprintSearchBar';
import List from './InvoiceReprintList';
import DetailModal from './InvoiceDetailModal';
import PayWayModal from './PayWayModal';
import RefundModal from './RefundModal';

class InvoiceReprintMain extends Component {
  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['CANCEL_Flag', 'FEE_TYPE', 'FEE_CODE', 'REBATE_TYPE', 'APPLY_STATE', 'PAY_MODE'],
    });
  }

  render() {
    const { spin } = this.props.invoiceReprint;

    return (
      <Spin spinning={spin} >
        <SearchBar />
        <List />
        <DetailModal />
        <PayWayModal />
        <RefundModal />
      </Spin>
    );
  }
}

export default connect(({ invoiceReprint, utils }) =>
  ({ invoiceReprint, utils }))(InvoiceReprintMain);
