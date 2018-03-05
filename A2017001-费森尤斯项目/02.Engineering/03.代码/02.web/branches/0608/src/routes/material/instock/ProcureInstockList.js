import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Card } from 'antd';

import styles from './ProcureInstock.less';

import CommonTable from '../../../components/CommonTable';
import SearchBar from './ProcureInstockSearchBar';

class ProcureInstockList extends Component {

  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
  }
  componentWillMount() {
	  const {user} = this.props.base;
	  const deptId = user.loginDepartment.id;
    this.props.dispatch({
      type: 'procureDeptInstock/loadBuyList',
      payload: {
        query: { buyState: '2' ,deptId:deptId},
      },
    });
  }

  onSearch(values) {
    // console.info('onSearch', values);
	  const {user} = this.props.base;
	  const deptId = user.loginDepartment.id;
    this.props.dispatch({
      type: 'procureDeptInstock/loadBuyList',
      payload: {
        query: { ...values, buyState: '2',deptId:deptId },
      },
    });
  }

  onConfirm(record) {
    this.props.dispatch({
      type: 'procureDeptInstock/loadBuyDetail',
      payload: {
        query: {
          buyBill: record.buyBill,
        },
        record,
      },
    });
  }

  render() {
    const { buyList } = this.props.procureDeptInstock;
    // console.info('+++++render++buyList+++', buyList);
    const { data } = buyList;
    const columns = [
      { title: '物资采购单',
        dataIndex: 'buyBill',
        key: 'buyBill',
        width: 128,
        className: 'text-align-center text-no-wrap',
      },
      { title: '申请人/申请时间',
        dataIndex: 'createOper',
        key: 'createOper',
        width: 139,
        className: 'text-no-wrap',
        render: (value, record) => {
          return (
            <div>
              {value}<br />
              <font style={{ color: '#bfbfbf' }} >{record.createTime}</font>
            </div>
          );
        },
      },
    ];

    const { wsHeight } = this.props.base;
    const leftHeight = wsHeight - (3 * 2);

    return (
      <div style={{ padding: '3px' }} >
        <Card className={styles.leftCard} style={{ height: `${leftHeight}px` }} >
          <SearchBar onSearch={values => this.onSearch(values)} />
          <CommonTable
            data={data} columns={columns} bordered
            paginationStyle="mini" rowSelection={false}
            onRowClick={record => this.onConfirm(record)}
            scroll={{ y: (leftHeight - 38 - 34 - 55) }}
          />
        </Card>
      </div>
    );
  }
}

export default connect(
  ({ base, procureDeptInstock }) => ({ base, procureDeptInstock }),
)(ProcureInstockList);

