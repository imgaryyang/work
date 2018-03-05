import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, notification, Spin } from 'antd';
import { isEmpty, isMatch } from 'lodash';

import CommonTable from '../../../components/CommonTable';
import SearchBar from './ComplexItemLeftSearchBar';

import styles from './ComplexItem.less';

class ComplexItemLeftList extends Component {

  constructor(props) {
    super(props);
    this.onPageChange = ::this.onPageChange;
    this.onRowClick = ::this.onRowClick;
    this.onSearch = ::this.onSearch;
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'complexItem/load',
      payload: {
        isStop: true,
      },
    });
  }

  onPageChange(page) {
    this.props.dispatch({
      type: 'complexItem/load',
      payload: { page },
    });
  }

  onRowClick(record) {
    const { itemData, selectedItemGroup } = this.props.complexItem;

    if (isEmpty(selectedItemGroup)) {
      notification.error({ message: '提示', description: '请先选择复合收费项目' });
      return;
    }

    const dataSource = { id: record.id };

    const matchData = itemData.find(value => isMatch(value, dataSource));

    if (matchData) {
      notification.error({ message: '提示', description: '同一收费项目不允许重复添加!' });
    } else {
      this.props.dispatch({
        type: 'complexItem/addItem',
        record,
      });
    }
  }

  onSearch(query) {
    this.props.dispatch({
      type: 'complexItem/load',
      payload: { query },
    });
  }

  render() {
    const {
      complexItem: { data, page, isLeftSpin },
      base: { wsHeight },
    } = this.props;
    const leftHeight = wsHeight - 6;
    const columns = [
      {
        title: '项目名称',
        dataIndex: 'itemName',
        key: 'itemName',
        width: '200px',
      },
      {
        title: '价格',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
        width: '100px',
        render: (text, record = {}) => {
          return `${text.formatMoney()}/${record.unit}`;
        },
      },
    ];

    return (
      <div style={{ padding: '3px' }} >
        <Card className={styles.leftCard} style={{ height: leftHeight }}>
          <Row>
            <Col>
              <SearchBar onSearch={this.onSearch} />
            </Col>
          </Row>
          <Spin spinning={isLeftSpin}>
            <Row>
              <CommonTable
                bordered
                data={data}
                page={page}
                columns={columns}
                size="middle"
                paginationStyle="mini"
                scroll={{ y: (leftHeight - 6 - 37 - 33 - 50) }}
                onRowClick={record => this.onRowClick(record)}
                onPageChange={this.onPageChange}
                rowSelection={false}
              />
            </Row>
          </Spin>
        </Card>
      </div>
    );
  }
}
export default connect(({ complexItem, base }) => ({ complexItem, base }))(ComplexItemLeftList);
