import React, { Component } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';

import CommonTable from '../../../components/CommonTable';
import SearchBar from './InstockAuitdSearchBar';

import styles from './InstockAuited.less';

class InstockAuitdList extends Component {

  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
  }

  componentWillMount() {
	  const {user} = this.props.base;
	  const deptId = user.loginDepartment.id;
    this.props.dispatch({
      type: 'instockAuitd/loadBuyList',
      payload: {
        query: { appState: '3',deptId : deptId },
      },
    });
  }

  onSearch(values) {
	  const {user} = this.props.base;
	  const deptId = user.loginDepartment.id;
    this.props.dispatch({
      type: 'instockAuitd/loadBuyList',
      payload: {
        query: { ...values, appState: '3' ,deptId : deptId},
      },
    });
  }

  onConfirm(record) {
    this.props.dispatch({
      type: 'instockAuitd/loadBuyDetail',
      payload: {
        query: {
          appBill: record.appBill,
        },
        record,
      },
    });
  }

  render() {
    const { buyList } = this.props.instockAuitd;
    const { data } = buyList;
    const columns = [
      { title: '请领单',
        dataIndex: 'appBill',
        key: 'appBill',
        width: '128px',
        className: 'text-align-center text-no-wrap',
      },
      { title: '申请人/申请时间',
        dataIndex: 'createOper',
        key: 'createOper',
        width: '139px',
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
      <div style={{ padding: 3 }} >
        <Card className={styles.leftCard} style={{ height: leftHeight }} >
          <SearchBar onSearch={values => this.onSearch(values)} />
          <CommonTable
            rowKey={'appBill'}
            data={data}
            columns={columns}
            bordered
            pagination={false}
            rowSelection={false}
            onRowClick={record => this.onConfirm(record)}
            scroll={{ y: (leftHeight - 38 - 34 - 55) }}
          />
        </Card>
      </div>
    );
  }
}

export default connect(
  ({ base, instockAuitd }) => ({ base, instockAuitd }),
)(InstockAuitdList);
