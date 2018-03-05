import React from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import moment from 'moment';

import CommonTable from '../../../components/CommonTable';
import SearchBar from './NameSearchBar';

import styles from './InstockPlan.less';

class InventoryList extends React.Component {

  constructor(props) {
    super(props);
    this.onSearch = ::this.onSearch;
    this.onRowClick = ::this.onRowClick;
    this.onPageChange = ::this.onPageChange;
  }

  onSearch(values) {
    // 根据查询条件查询库存列表
    this.props.dispatch({
      type: 'instockPlan/loadApplyInPage',
      payload: { query: values },
    });
  }

  onRowClick(record) {
    // 添加请领到请领详细列表
    this.props.dispatch({
      type: 'instockPlan/addInstockDetail',
      record,
    });
  }

  onPageChange(page) {
    this.props.dispatch({
      type: 'instockPlan/loadApplyInPage',
      payload: { page },
    });
  }

  render() {
    const { data, page } = this.props.instockPlan;
    const { wsHeight } = this.props.base;

    const columns = [
      {
        title: '申请单号',
        dataIndex: '0',
        key: 'appBill',
        width: 110,
        className: 'text-align-center',
      },
      {
        title: '申请人/申请时间',
        dataIndex: '1',
        key: 'appOper',
        width: 140,
        className: 'text-no-wrap',
        render: (value, record) => {
          return (
            <div>
              {value}<br />
              <font style={{ color: '#bfbfbf' }} >{moment(record[2]).format('YYYY-MM-DD HH:mm:ss')}</font>
            </div>
          );
        },
      },
    ];

    const leftHeight = wsHeight - (3 * 2);

    return (
      <div style={{ padding: 3 }} >
        <Card className={styles.bottomCard} style={{ height: leftHeight }} >
          <SearchBar onSearch={this.onSearch} />
          <CommonTable
            data={data}
            page={page}
            columns={columns}
            bordered
            pagination
            paginationStyle="mini"
            rowSelection={false}
            onPageChange={this.onPageChange}
            onRowClick={record => this.onRowClick(record)}
            scroll={{ y: (leftHeight - 69 - 34 - 5 - 55) }}
          />
        </Card>
      </div>
    );
  }
}

export default connect(
  ({ instockPlan, base }) => ({ instockPlan, base }),
)(InventoryList);
