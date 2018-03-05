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

  onPageChange(page) {
    const { commonName } = this.props.hrpDirectIn;
    // console.info('zhoumin--------tradeName', tradeName);
    this.props.dispatch({
      type: 'hrpDirectIn/load',
      payload: {
        page,
        query: { commonName }, 
      },
    });
  }

  onConfirm(record) {
    this.props.dispatch({
      type: 'hrpDirectIn/forAddApply',
      record,
    });
  }

  B(values) {
    this.props.dispatch({
      type: 'hrpDirectIn/load',
      payload: {
        query: values,
      },
    });
  }

  render() {
    const { hrpDirectIn, base } = this.props;
    const { data, page } = hrpDirectIn || {};
    console.info('data*: ', data);
    //console.info('翻页', page);
    const columns = [
      { title: '资产信息',
        dataIndex: 'commonName',
        key: 'commonName',
        width: 260,
        render: (text, record) => {
          return (
            <div style={{ position: 'relative' }} >
              {`${text}(${record.instrmSpecs || '-'})`}<br />
              厂商：{record.companyInfo ? (record.companyInfo.companyName || '-') : '-'}
              <span className="drug-state-float" >{(record.stopFlag == '1') ? '正常' : '停用'}</span>
            </div>
          );  
        },
      },
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
  ({ hrpDirectIn, utils, base }) => ({ hrpDirectIn, utils, base }),
)(DirectInventoryList);

