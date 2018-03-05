import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Card } from 'antd';
import { floor } from 'lodash';

import CommonTable from '../../../components/CommonTable';
import SearchBar from './InstockApplyEditDrugSearchBar';

import styles from './InstockApplyEdit.less';

class InstockApplyEditDrugList extends Component {

  constructor(props) {
    super(props);
    this.onPageChange = this.onPageChange.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.B = this.B.bind(this);
  }

  onPageChange(page) {
    this.props.dispatch({
      type: 'instockApplyEdit/load',
      payload: {
        dataPage: page,
      },
    });
  }

  onConfirm(record) {
    this.props.dispatch({
      type: 'instockApplyEdit/forAddApply',
      record,
    });
  }

  B(values) {
    this.props.dispatch({
      type: 'instockApplyEdit/load',
      payload: {
        query: values,
      },
    });
  }

  render() {
    const { instockApplyEdit, base } = this.props;
    const { data, dataPage } = instockApplyEdit || {};
    const { wsHeight } = base;
    const leftHeight = wsHeight - 6;
    const columns = [
      { title: '药品名称',
        dataIndex: 'tradeName',
        key: 'tradeName',
        width: '200px',
        render: (text, record) => {
          return (
            <div>
              {`${text}(${record.specs || '-'})`}<br />
              厂商：{record.companyInfo ? record.companyInfo.companyName : '-'}
            </div>
          );
        },
      },
      /* { title: '规格', dataIndex: 'specs', key: 'specs', width: '50px' },*/
      /* { title: '批次', dataIndex: 'batchNo', key: 'batchNo', width: '100px' },*/
      /*{ title: '批号/批次',
        dataIndex: 'approvalNo',
        key: 'approvalNo',
        width: '90px',
        render: (text, record) => {
          return (
            <div>
              {text}<br />
              {record.batchNo}
            </div>
          );
        },
      },*/
      { title: '库存',
        dataIndex: 'storeSum',
        key: 'storeSum',
        width: '90px',
        render: (text, record) => (`${floor((record.storeSum ? record.storeSum : 0) / record.drugInfo.packQty)} ${record.drugInfo.packUnit} ${
          record.storeSum % record.drugInfo.packQty === 0 ? '' : `${record.storeSum % record.drugInfo.packQty} ${record.drugInfo.miniUnit}`}`),
      },
      { title: '有效期',
          dataIndex: 'validDate',
          key: 'validDate',
          width: '90px',
        },
      /* { title: '厂家', dataIndex: 'companyInfo.companyName', key: 'companyInfo.companyName', width: '50px' },*/
    ];

    return (
      <div style={{ padding: '3px' }} >
        <Card className={styles.leftCard} style={{ height: leftHeight }}>
          <Row>
            <Col>
              <SearchBar A={this.B.bind(this)} />
            </Col>
          </Row>
          <Row>
            <CommonTable
              data={data}
              paginationStyle="mini"
              page={dataPage}
              onPageChange={this.onPageChange.bind(this)}
              size="middle"
              bordered
              columns={columns}
              scroll={{ y: (leftHeight - 6 - 37 - 33 - 50) }}
              onRowClick={record => this.onConfirm(record)}
              rowSelection={false}
            />
          </Row>
        </Card>
      </div>

    );
  }
}
export default connect(({ instockApplyEdit, utils, base }) => ({ instockApplyEdit, utils, base }))(InstockApplyEditDrugList);

