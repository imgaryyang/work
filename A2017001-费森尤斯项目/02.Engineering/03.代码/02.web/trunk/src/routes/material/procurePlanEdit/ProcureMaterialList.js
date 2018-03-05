import React, { Component } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';

import CommonTable from '../../../components/CommonTable';
import SearchBar from './ProcurePlanEditMaterialSearchBar';

import styles from './ProcurePlan.less';

class ProcureMaterialList extends Component {
  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.autoClick = this.autoClick.bind(this);
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'matProcurePlanEdit/loadMaterial',
    });
  }

  onSearch(s) {
    const { page } = this.props.matProcurePlanEdit.material;
    page.pageNo = 1;
    this.props.dispatch({
      type: 'matProcurePlanEdit/loadMaterial',
      payload: { query: s, page },
    });
    window.setTimeout(this.autoClick, 1000);
  }

  onConfirm(record) {
    this.props.dispatch({
      type: 'matProcurePlanEdit/forAddBuy',
      record,
    });
  }

  onPageChange(page) {
    // console.info('onPageChange', page);
    const { query } = this.props.matProcurePlanEdit.material;
    this.props.dispatch({
      type: 'matProcurePlanEdit/loadMaterialInfo',
      payload: { page, query },
    });
  }

  autoClick() {
    const { newData } = this.props.matProcurePlanEdit;
    // console.log('data+++',data);
    if (newData && newData.length === 1) {
      this.onConfirm(newData[0]);
    }
  }

  render() {
    const { matProcurePlanEdit, base } = this.props;
    const { material } = matProcurePlanEdit || {};
    const { wsHeight } = base;
    const leftHeight = wsHeight - 6;
    // console.info('+++++material.data++++', material);
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
              <span className="material-state-float" >{record.stopFlag ? '正常' : '停用'}</span>
            </div>
          );
        },
      },
      /* { title: '规格', dataIndex: 'materialSpecs', key: 'materialSpecs', width: '50px' },
      { title: '生产厂商', dataIndex: 'companyInfo.companyName', key: 'producer', width: '50px' },*/
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
  ({ matProcurePlanEdit, base }) => ({ matProcurePlanEdit, base }),
)(ProcureMaterialList);
