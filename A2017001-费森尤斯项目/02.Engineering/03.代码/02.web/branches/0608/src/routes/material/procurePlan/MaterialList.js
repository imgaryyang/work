import React, { Component } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';

import CommonTable from '../../../components/CommonTable';
import SearchBar from './ProcureSearchBar';

import styles from './ProcurePlan.less';

class MaterialList extends Component {

  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'materialProcurePlan/loadMaterial',
    });
  }

  onSearch(s) {
    const { page } = this.props.materialProcurePlan.material;
    page.pageNo = 1;
    this.props.dispatch({
      type: 'materialProcurePlan/loadMaterial',
      payload: { query: s, page },
    });
  }

  onConfirm(record) {
    // const scrollDiv = this.refs.commonTable;
    // console.log('scrollDiv', scrollDiv);
    this.props.dispatch({
      type: 'materialProcurePlan/forAddBuy',
      record,
    });
  }

  onPageChange(page) {
    // console.info('onPageChange', page);
    const { query } = this.props.materialProcurePlan.material;
    this.props.dispatch({
      type: 'materialProcurePlan/loadMaterial',
      payload: { page, query },
    });
  }

  render() {
    const { materialProcurePlan, base } = this.props;
    const { material } = materialProcurePlan || {};
    const { wsHeight } = base;
    const leftHeight = wsHeight - 6;
//    console.info('+++++material.data++++', material);
    const columns = [
      { title: '物资信息',
        dataIndex: 'commonName',
        key: 'commonName',
        width: '275px',
        render: (text, record) => {
          return (
            <div style={{ position: 'relative' }} >
              {`${text}(${record.materialSpecs || '-'})`}<br />
              厂商：{record.companyInfo ? (record.companyInfo.companyName || '-') : '-'}
              <span className="drug-state-float" >{record.stopFlag ? '正常' : '停用'}</span>
            </div>
          );
        },
      },
    ];
    return (
      <div style={{ padding: 3 }}>
        <Card className={styles.leftCard} style={{ height: `${leftHeight}px` }}>
          <SearchBar onSearch={s => this.onSearch(s)} />
          <CommonTable
            data={material.data} columns={columns} bordered page={material.page}
            paginationStyle="mini" rowSelection={false} size="middle"
            onRowClick={record => this.onConfirm(record)}
            scroll={{ y: (leftHeight - 38 - 34 - 55) }}
            onPageChange={this.onPageChange}
          />
        </Card>
      </div>

    );
  }
}

export default connect(
  ({ materialProcurePlan, base }) => ({ materialProcurePlan, base }),
)(MaterialList);
