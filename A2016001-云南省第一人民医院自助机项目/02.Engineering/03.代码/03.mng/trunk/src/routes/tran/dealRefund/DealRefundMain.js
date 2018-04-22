import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Spin, Button } from 'antd';
import moment from 'moment';

import CommonTable 			from '../../../components/CommonTable';
import TranSearchBar 		from './TranSearchBar';
import TranDetail 			from './TranDetail';
import DealRefundWin 		from './DealRefundWin';
import { order, settlement, prestore } from '../../base/Dict';

import styles	from './TranRefund.less';

class DealRefundMain extends Component {

  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
    this.onRefund = this.onRefund.bind(this);
    this.showDealWin = this.showDealWin.bind(this);
    this.showTranDetail = this.showTranDetail.bind(this);
  }

  componentWillMount() {
  }
 
  onSearch(values) {
    this.props.dispatch({
      type: 'dealRefundTran/load',
      payload: values,
    });
  }
  
  onRefund(account) {
	  const { cardType,paymentWay } = account;
	  if(paymentWay && paymentWay == '0' ) {
		  if(cardType && cardType == '1') {
			  this.showDealWin(account);
		  } else {
			  this.showTranDetail(account);
		  }  
	  } else {
		  this.showTranDetail(account);
	  }
  }
  
  showDealWin(account, tranDetail) {
	  this.props.dispatch({
		  type: 'dealRefundTran/setState',
		  payload: {
			  dealVisible: true,
			  dealSpin: true,
			  account: account||{},
			  tranDetail: tranDetail||{},
		},
	  });
	  this.props.dispatch({
	      type: 'dealRefundTran/loadPatient',
	      payload: {  
	    	  account: account,
	      },
	  });
	  
	  this.props.dispatch({
	      type: 'dealRefundTran/loadCreditAmt',
	      payload: {  
	    	  account: account,
	      },
	  });
	  
	  this.props.dispatch({
		  type: 'dealRefundTran/setState',
		  payload: {
			  dealSpin: false,
		},
	  });
  }
  
  showTranDetail(account) {
	  this.props.dispatch({
		  type: 'dealRefundTran/setState',
		  payload: {
	    	  account: account,
			  tranVisible: true,
		  },
	  });
	  this.props.dispatch({
	      type: 'dealRefundTran/loadAccountDetails',
	      payload: {  
	    	  account: account,
	      },
	  });
  }
  
  render() {
    const { dealRefundTran, base } = this.props;
    const { wsHeight } = base;
    const { spin, data, settlement } = dealRefundTran;
    const columns = [
      { title: '患者编号',
        dataIndex: 'patientNo',
        key: 'patientNo',
        width: 80,
        render: (value, record) => {
          return (
            <div>
              {value}
            </div>
          );
        }, 
      },
      { title: '退款账户',
        dataIndex: 'accId',
        key: 'accId',
        width: 120,
        render: (value, record) => {
          if (data) {
            return (
              <div className={styles.order} >
              { value } 
              </div>
            );
          } else {
            return <div />;
          }
        },
      },
      { title: '渠道',
          dataIndex: 'openBankName',
          key: 'openBankName',
          width: 80,
          render: (value, record) => {
            if (data) {
              return (
                <div className={styles.order} >
                { value } 
                </div>
              );
            } else {
              return <div />;
            }
          },
        },
      { title: '账户类型',
          dataIndex: 'accType',
          key: 'accType',
          width: 80,
          render: (value, record) => {
            if (data) {
              return (
                <div className={styles.order} >
                { prestore.paymentWay[value] } 
                </div>
              );
            } else {
              return <div />;
            }
          },
      },
      { title: '卡类型',
          dataIndex: 'cardType',
          key: 'cardType',
          width: 80,
          render: (value, record) => {
            if (value) {
              return (
                <div className={styles.order} >
                { record.accType=='0'?prestore.cardType[value]:'' } 
                </div>
              );
            } else {
              return <div />;
            }
          },
      },
      { title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 60,
        className: 'text-align-center',
        render: (value, record) => {
          return (
            <div>
              <Button onClick={()=>this.onRefund(record)} size="small" >退款</Button>
            </div>
          );
        },
      },
    ];

    return (
      <Spin spinning={spin} >
        <div style={{ height: `${wsHeight}px`, overflow: 'hidden' }} >
          <TranSearchBar onSearch={this.onSearch} />
          <CommonTable
            rowKey={record => `${record.accNo}`}
            data={data}
            columns={columns}
            onPageChange={this.onPageChange}
            onSelectChange={this.rowSelectChange}
            scroll={{ y: (wsHeight - 41 - 36 - 62) }}
            bordered
            size="middle"
            className="compact-table"
            pagination={false}
          />
        </div>
        <TranDetail showDealWin={this.showDealWin} />
        <DealRefundWin />
      </Spin>
    );
  }
}
export default connect( ({ dealRefundTran, base }) => ({ dealRefundTran, base }),)(DealRefundMain);
