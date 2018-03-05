import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, notification } from 'antd';
import { floor, isEmpty, isMatch } from 'lodash';

import CommonTable from '../../../components/CommonTable';
import SearchBar from './InstockPlanEditMatSearchBar';

import styles from './InstockPlanEdit.less';

class InstockPlanEditMatList extends Component {

  constructor(props) {
    super(props);
    this.onPageChange = ::this.onPageChange;
    this.onRowClick = ::this.onRowClick;
    this.onSearch = ::this.onSearch;
  }

  onPageChange(page) {
    this.props.dispatch({
      type: 'instockPlanEdit/load',
      payload: { page },
    });
  }

  onRowClick(record) {
    const { planData, fromDeptId, currentAppBill } = this.props.instockPlanEdit;

    if (isEmpty(currentAppBill)) {
      notification.error({ message: '提示', description: '请先选择需要修改的请领单' });
      return;
    }

    if (record.storeSum === 0) {
      notification.error({ message: '提示', description: '该药品库存为零,不能请领' });
      return;
    }

    const dataSource = {
      matInfo: {
        id: record.materialInfo.id,
      },
      approvalNo: record.approvalNo,
    };

    const matchData = planData.find(value => isMatch(value, dataSource) || !Object.is(value.fromDeptId, fromDeptId));

    if (matchData) {
      notification.error({ message: '提示', description: '同一药品或不同库房的药品不允许添加!' });
    } else {
      this.props.dispatch({
        type: 'instockPlanEdit/forAddPlan',
        record,
      });
    }
  }

  onSearch(values) {
    this.props.dispatch({
      type: 'instockPlanEdit/load',
      payload: {
        query: values,
      },
    });
  }

  render() {
    const { instockPlanEdit: { data, page }, base: { wsHeight } } = this.props;
    const leftHeight = wsHeight - 6;
    const columns = [
      {
        title: '药品名称',
        dataIndex: 'tradeName',
        key: 'tradeName',
        width: '200px',
        render: (text, record) => {
          return (
            <div>
              {`${text}(${record.materialSpecs || '-'})`}<br />
              厂商：{record.companyInfo ? record.companyInfo.companyName : '-'}
            </div>
          );
        },
      },
      {
        title: '库存',
        dataIndex: 'storeSum',
        key: 'storeSum',
        width: '90px',
        render: (text, record = {}) => {
          const { storeSum, materialInfo: {
            materialQuantity, materialUnit, maxUnit,
          } } = record;

          return (`
            ${(record.storeSum ? storeSum : 0) .formatMoney(0)} ${materialUnit}
          `);
        },
      },
      {
        title: '有效期',
        dataIndex: 'validDate',
        key: 'validDate',
        width: '90px',
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
        </Card>
      </div>
    );
  }
}
export default connect(({ instockPlanEdit, base }) => ({ instockPlanEdit, base }))(InstockPlanEditMatList);
