import React from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import moment from 'moment';

import CommonTable from '../../../components/CommonTable';
import SearchBar from './NameSearchBar';

import styles from './StockOutCheck.less';

class InventoryList extends React.Component {

  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
  }

  onSearch(values) {
    // 根据查询条件查询库存列表
    const condition = { ...values };
    this.props.dispatch({
      type: 'matOutStockCheck/loadAppIn',
      payload: {
        queryCon: condition,
      },
    });
  }

  onConfirm(record) {
    // 添加请领到请领详细列表
    this.props.dispatch({
      type: 'matOutStockCheck/addOutStockDetail',
      record,
    });
  }

  onPageChange(pageNew) {
    const { query } = this.props.matOutStockCheck;
    this.props.dispatch({
      type: 'matOutStockCheck/loadAppIn',
      payload: { pageNew, query },
    });
  }

  render() {
    const { matOutStockCheck } = this.props;
    const { data, page } = matOutStockCheck || {};

    const columns = [
      { title: '申请单号',
        dataIndex: '0',
        key: 'appBill',
        width: 110,
        className: 'text-align-center text-no-wrap',
      },
      { title: '申请人/申请时间',
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
      /* { title: '申请单号', dataIndex: '0', key: 'appBill', width: 40 },
      { title: '申请人', dataIndex: '1', key: 'appOper', width: 40 },
      { title: '申请时间',
        dataIndex: '2',
        key: 'appTime',
        width: 60,
        render: (text, record) => {
          return (moment(record[2]).format('YYYY-MM-DD HH:mm:ss'));
        },
      },*/
    ];

    const { wsHeight } = this.props.base;
    const leftHeight = wsHeight - (3 * 2);

    return (
      <div style={{ padding: 3 }} >
        <Card className={styles.bottomCard} style={{ height: leftHeight }} >
          <SearchBar onSearch={this.onSearch} />
          <CommonTable
            data={data}
            columns={columns}
            bordered
            paginationStyle="mini"
            rowSelection={false}
            onPageChange={this.onPageChange}
            onRowClick={(record, index) => this.onConfirm(record, index)}
            scroll={{ y: (leftHeight - 69 - 34 - 5 - 55) }}
            pagination
            page={page}
          />
        </Card>
      </div>
    );
  }
}

export default connect(
  ({ matOutStockCheck, base }) => ({ matOutStockCheck, base }),
)(InventoryList);

/*
  <div>
    <Row type="flex" >
      <Col span={24} >
        <SearchBar onSearch={this.onSearch.bind(this)} />
      </Col>
    </Row>
    <CommonTable
      data={data}
      pagination
      paginationStyle="mini"
      bordered
      page={page}
      onPageChange={this.onPageChange.bind(this)}
      onRowClick={(record, index) => this.onConfirm(record, index)}
      columns={columns}
      rowSelection={false}
      size="small"
    />
  </div>
*/
