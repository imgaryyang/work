import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Button } from 'antd';
import moment from 'moment';

import CommonTable from '../../../components/CommonTable';
import SearchBar from './SearchBar';
import Detail from './Detail';
import { order, settlement, prestore } from '../../base/Dict';

import styles from './BackTracking.less';

class BackTracking extends Component {

  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
    this.showDetail = this.showDetail.bind(this);
    this.backTracking = this.backTracking.bind(this);
  }

  componentWillMount() {
    /* this.props.dispatch({
      type: 'backTracking/load',
      payload: {
        startDate: moment().format('YYYY-MM-DD');
        endDate: moment().format('YYYY-MM-DD');
      },
    });*/
  }

  onSearch(values) {
    console.info('list search：', values);
    this.props.dispatch({
      type: 'backTracking/load',
      payload: { ...values },
    });
  }

  showDetail(record) {
    this.props.dispatch({
      type: 'backTracking/loadDetails',
      payload: {
    	  briefRecord: record,
      },
    });
  }

  backTracking(record) {

  }

  render() {
    const { backTracking, base } = this.props;
    const { wsHeight } = base;
    const { spin, data } = backTracking;

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
        width: 180,
        render: (value, record) => {
          if (record.variables.his) {
            return (
              <div className={styles.order} >
                <b>[ {value} ] </b>
                {`${prestore.ycfs[record.variables.his.prestoreType] || '-'} | ${prestore.ztbz[record.variables.his.status] || '-'} | ${prestore.ly[record.variables.his.source] || '-'}`}<br />
                {/* <span className={styles.idField} >{value}</span>*/}
                <font className={styles.createTime} >{moment(record.variables.his.optTime).format('YYYY-MM-DD HH:mm:ss')}</font>
                <div className={styles.amt} >
                  {typeof record.variables.his.amt !== 'undefined' ? record.variables.his.amt.formatMoney() : '-'}<br />
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
                {/* <span className={styles.idField} >{value}</span>*/}
                <font className={styles.createTime} >{moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')}</font>
                <div className={styles.amt} >
                  {typeof record.amt !== 'undefined' ? record.amt.formatMoney() : '-'}<br />
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
        width: 300,
        render: (value, record) => {
          if (record.settlements) {
            return record.settlements.map(({ id, amt, status, payChannelName, settleNo, createTime }) => {
              return (
                <div className={styles.settlement} key={id} >
                  {`${settleNo || '-'} | ${payChannelName || '-'} | ${settlement.status[status] || '-'}`}
                  &nbsp;&nbsp;<font className={styles.createTime} >{moment(createTime).format('YYYY-MM-DD HH:mm:ss')}</font>
                  {/* <span className={styles.idField} >{id}</span>*/}
                  <div className={styles.amt} >
                    {typeof amt !== 'undefined' ? amt.formatMoney() : '-'}<br />
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
              <Button onClick={() => this.backTracking(record)} size="small" >补录</Button>
            </div>
          );
        },
      },
    ];

    return (
      <Spin spinning={spin} >
        <div style={{ height: `${wsHeight}px`, overflow: 'hidden' }} >
          <SearchBar onSearch={this.onSearch} />
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
        <Detail />
      </Spin>
    );
  }
}
export default connect(
  ({ backTracking, base }) => ({ backTracking, base }),
)(BackTracking);
