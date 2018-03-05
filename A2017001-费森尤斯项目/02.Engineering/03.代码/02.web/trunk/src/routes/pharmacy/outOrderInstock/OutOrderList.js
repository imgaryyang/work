import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Card } from 'antd';

import styles from './OutOrderInstock.less';

import CommonTable from '../../../components/CommonTable';
import SearchBar from './SearchBar';

class OutOrderList extends Component {

  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
  }
  componentWillMount() {
  
  this.props.dispatch({
    type: 'outOrderInstock/loadOutOrderList',
  });
  }

  onSearch(values) {
//    
    const deptId = this.props.base.user.loginDepartment.id;
    this.props.dispatch({
      type: 'outOrderInstock/loadOutOrderList',
      payload: {
        query: { ...values },
      },
    });
  }

  onConfirm(record) {

  this.props.dispatch({
    type: 'outOrderInstock/loadOutOrderDetail',
    outBill: record[0],
  });
  }

  render() {

    const { outOrderList } = this.props.outOrderInstock;
//    
//    const { data } = outOrderList;
    const columns = [
      { title: '出库单',
        dataIndex: '0',
        key: '0',
        width: 126,
        className: 'text-align-center text-no-wrap',
      },
      { title: '出库科室/时间',
        dataIndex: '2',
        key: '2',
        width: 141,
        className: 'text-no-wrap',
        render: (value, record) => {
          return (
            <div>
              {value}<br />
              <font style={{ color: '#bfbfbf' }} >{record[3]}</font>
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
            rowKey={outOrderList}
            data={outOrderList} columns={columns} bordered
            pagination={false} rowSelection={false}
            onRowClick={record => this.onConfirm(record)}
            scroll={{ y: (leftHeight - 80) }}
          />
        </Card>
      </div>
    );
  }
}

export default connect(({ base, outOrderInstock }) => ({ base, outOrderInstock }))(OutOrderList);

