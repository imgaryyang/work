import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Card } from 'antd';
import CommonTable from '../../../components/CommonTable';
import SearchBar from './ProcureSearchBar';
import styles from './ProcurePlanAuitd.less';

class ProcurePlanList extends Component {

  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'procureAuitd/loadBuyList',
      payload: {
        query: { buyState: '1' },
      },
    });
  }

  onSearch(values) {
    this.props.dispatch({
      type: 'procureAuitd/loadBuyList',
      payload: {
        query: { ...values, buyState: '1' },
      },
    });
  }

  onPageChange(page) {
    this.props.dispatch({
      type: 'procureAuitd/loadBuyList',
      payload: {
        page,
        query: { buyState: '1' },
      },
    });
  }

  onConfirm(record) {
    this.props.dispatch({
      type: 'procureAuitd/loadBuyDetail',
      payload: {
        query: {
          buyBill: record.buyBill,
        },
        record,
      },
    });
  }

  render() {
    const { procureAuitd, base } = this.props;
    const { buyList } = procureAuitd;
    const { wsHeight } = base;
    const leftHeight = wsHeight - (3 * 2);
    const { data, page } = buyList;
    const columns = [
      { title: '采购单',
        dataIndex: 'buyBill',
        key: 'buyBill',
        width: 110,
        className: 'text-align-center ',
      },
      { title: '申请人/申请时间',
        dataIndex: 'createOper',
        key: 'createOper',
        width: 140,
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
    return (
      <div style={{ padding: 3 }} >
        <Card className={styles.bottomCard} style={{ height: leftHeight }} >
          <SearchBar onSearch={this.onSearch.bind(this)} />
          <CommonTable
            data={data}
            columns={columns}
            bordered
            pagination
            page={page}
            paginationStyle="mini"
            rowSelection={false}
            onPageChange={this.onPageChange.bind(this)}
            onRowClick={(record, index) => this.onConfirm(record, index)}
            scroll={{ y: (leftHeight - 38 - 34 - 55) }}
          />
        </Card>
      </div>
    );
  }
}
export default connect(({ procureAuitd, base }) => ({ procureAuitd, base }))(ProcurePlanList);

