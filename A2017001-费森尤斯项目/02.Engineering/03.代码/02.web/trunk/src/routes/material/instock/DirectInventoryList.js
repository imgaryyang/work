import React, { Component } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';

import CommonTable from '../../../components/CommonTable';
import SearchBar from './DirectInventorySearchBar';

import styles from './DirectIn.less';

class DirectInventoryList extends Component {

  constructor(props) {
    super(props);
    this.onPageChange = this.onPageChange.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.B = this.B.bind(this);
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'materialDirectIn/load',
    });
  }
  onPageChange(page) {
    const { commonName } = this.props.materialDirectIn;
    this.props.dispatch({
      type: 'materialDirectIn/load',
      payload: {
        page,
        query: { commonName },
      },
    });
  }

  onConfirm(record) {
    this.props.dispatch({
      type: 'materialDirectIn/forAddApply',
      record,
    });
  }

  B(values) {
    this.props.dispatch({
      type: 'materialDirectIn/load',
      payload: {
        query: values,
      },
    });
  }

  render() {
    const { materialDirectIn, base } = this.props;
    const { data, page } = materialDirectIn || {};

    //
    const columns = [{
      title: '物资信息',
      dataIndex: 'commonName',
      key: 'commonName',
      width: 260,
      render: (text, record) => {
        return (
          <div style={{ position: 'relative' }} >
            {`${text}(${record.materialSpecs || '-'})`}<br />
            厂商：{record.companyInfo ? (record.companyInfo.companyName || '-') : '-'}
            <span className="drug-state-float" >{(record.stopFlag === '1') ? '正常' : '停用'}</span>
          </div>
        );
      },
    },
      /* {title:'物资编码', width:'50', dataIndex :'drugCode',key:'drugCode'},
      { title: '物资规格', width: '50', dataIndex: 'drugSpecs', key: 'drugSpecs' },
      { title: '厂家', width: '50', dataIndex: 'companyInfo.companyName', key: 'companyInfo.companyName' },*/
      /* { title: '状态',
        width: 55,
        dataIndex: 'stopFlag',
        key: 'stopFlag',
        className: 'text-align-center text-no-wrap',
        render: (text) => {
          return text ? '正常' : '停用';
        },
      },*/
    ];

    const { wsHeight } = base;
    const leftHeight = wsHeight - (3 * 2);

    return (
      <div style={{ padding: 3 }} >
        <Card className={styles.leftCard} style={{ height: leftHeight }} >
          <SearchBar A={this.B} />
          <CommonTable
            data={data}
            paginationStyle="mini"
            page={page}
            onPageChange={this.onPageChange}
            bordered
            columns={columns}
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
  ({ materialDirectIn, utils, base }) => ({ materialDirectIn, utils, base }),
)(DirectInventoryList);
