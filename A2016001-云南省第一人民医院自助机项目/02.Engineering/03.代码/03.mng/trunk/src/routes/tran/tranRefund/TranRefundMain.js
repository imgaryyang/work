import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Spin, Button } from 'antd';
import moment from 'moment';

import CommonTable 		from '../../../components/CommonTable';
import TranSearchBar 		from './TranSearchBar';
import TranDetail 			from './TranDetail';
import { order, settlement, prestore } from '../../base/Dict';

import styles 			from './TranRefund.less';

class TranRefundMain extends Component {

  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
    this.showDetail = this.showDetail.bind(this);
    this.handleCallBack = this.handleCallBack.bind(this);
  }

  componentWillMount() {
  }

  onSearch(values) {
    this.props.dispatch({
      type: 'refundTran/load',
      payload: {orderType:'OR', ...values },
    });
  }

  showDetail(record) {
    this.props.dispatch({
      type: 'refundTran/loadDetails',
      payload: {
    	  briefRecord: record,
      },
    });
  }
  
  handleCallBack(record) {
	  Modal.confirm({
        title: '确认',
        content: '是否确认该笔退款被撤销？',
        okText: '确认',
        cancelText: '我再看看',
        onOk: () => { 
        	this.props.dispatch({
       	      	type: 'refundTran/cancelRefund',
       	      	payload: record
   	  		});
    	},
      });
  }

  render() {
    const { refundTran, base } = this.props;
    const { wsHeight } = base;
    const { spin, data } = refundTran;

    const columns = [
      { title: '患者',
        dataIndex: 'patientNo',
        key: 'patientNo',
        width: 100,
        render: (value, record) => {
          return (
            <div>
              {record.patientName || '-'}<br />
              {value}
            </div>
          );
        },
      },
      { title: 'HIS预存明细',
        dataIndex: 'variables.his.id',
        key: 'variables.his.id',
        width: 200,
        render: (value, record) => {
          if (record.variables.his) {
            return (
              <div className={styles.order} >
                <b>[ {value} ] </b>
                {`${prestore.ycfs[record.variables.his.prestoreType] || '-'} | ${prestore.ztbz[record.variables.his.status] || '-'} | ${prestore.ly[record.variables.his.source] || '-'}`}<br />
                <font className={styles.createTime} >{moment(record.variables.his.prestoreTime).format('YYYY-MM-DD HH:mm:ss')}</font>
                <div className={styles.amt} >
                  {record.variables.his.amt.formatMoney()}<br />
                </div>
              </div>
            );
          } else {
            return <div />;
          }
        },
      },
      { title: '订单',
        dataIndex: 'id',
        key: 'id',
        width: 250,
        render: (value, record) => {
          if (value) {
            return (
              <div className={styles.order} >
                {`${record.orderNo} | ${record.machineCode} | ${order.type[record.orderType] || '-'} | ${order.status[record.status] || '-'}`}<br />
                <font className={styles.createTime} >{moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')}</font>
                <div className={styles.amt} >
                  { record.realAmt.formatMoney()}<br />
                </div>
              </div>
            );
          } else {
            return <div />;
          }
        },
      },
      { title: '结算单',
        dataIndex: 'settlements.id',
        key: 'settlements.id',
        width: 250,
        render: (value, record) => {
          if (record.settlements) {
            return record.settlements.map(({ id, amt, status, payChannelName, settleNo, createTime }) => {
              return (
                <div className={styles.settlement} key={id} >
                  {`${settleNo || '-'} | ${payChannelName || '-'} | ${settlement.status[status] || '-'}`}<br />
                  <font className={styles.createTime} >{moment(createTime).format('YYYY-MM-DD HH:mm:ss')}</font>
                  <div className={styles.amt} >
                    { amt.formatMoney() }<br />
                  </div>
                </div>
              );
            });
          } else {
            return <div />;
          }
        },
      },
      { title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 120,
        className: 'text-align-center',
        render: (value, record) => {
          return (
            <div>
              <Button onClick={() => this.showDetail(record)} size="small" >明细</Button>
              <span className="ant-divider" />
              <Button onClick={() => this.handleCallBack(record)} size="small" >退款取消</Button>
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
            rowKey={record => `${record.id}`}
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
        <TranDetail />
      </Spin>
    );
  }
}
export default connect( ({ refundTran, base }) => ({ refundTran, base }),)(TranRefundMain);
