import React, { Component } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';

import CommonTable from '../../../components/CommonTable';
import SearchBar from './ProcureSearchBar';

import styles from './ProcurePlan.less';

class ProcureDrugList extends Component {

  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'procurePlan/loadDrug',
    });
  }

  onSearch(s) {
    const { page } = this.props.procurePlan.drug;
    page.pageNo = 1;
    this.props.dispatch({
      type: 'procurePlan/loadDrug',
      payload: { query: s, page },
    });
  }

  onConfirm(record) {
    // const scrollDiv = this.refs.commonTable;
    // console.log('scrollDiv', scrollDiv);
    this.props.dispatch({
      type: 'procurePlan/forAddBuy',
      record,
    });
  }

  onPageChange(page) {
    // console.info('onPageChange', page);
    const { query } = this.props.procurePlan.drug;
    this.props.dispatch({
      type: 'procurePlan/loadDrug',
      payload: { page, query },
    });
  }

  render() {
    const { procurePlan, base } = this.props;
    const { drug } = procurePlan || {};
    const { wsHeight } = base;
    const leftHeight = wsHeight - 6;
    // console.info('+++++drug.data++++', drug);
    const columns = [
      { title: '药品信息',
        dataIndex: 'tradeName',
        key: 'tradeName',
        width: '275px',
        render: (text, record) => {
          return (
            <div style={{ position: 'relative' }} >
              {`${text}(${record.drugSpecs || '-'})`}<br />
              厂商：{record.companyInfo ? (record.companyInfo.companyName || '-') : '-'}
              <span className="drug-state-float" >{record.stopFlag ? '正常' : '停用'}</span>
            </div>
          );
        },
      },
      /* { title: '规格', dataIndex: 'drugSpecs', key: 'drugSpecs', width: '50px' },
      { title: '生产厂商', dataIndex: 'companyInfo.companyName', key: 'producer', width: '50px' },*/
    ];

    return (
      <div style={{ padding: 3 }}>
        <Card className={styles.leftCard} style={{ height: `${leftHeight}px` }}>
          <SearchBar onSearch={s => this.onSearch(s)} />
          <CommonTable
            data={drug.data} columns={columns} bordered page={drug.page}
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
  ({ procurePlan, base }) => ({ procurePlan, base }),
)(ProcureDrugList);

// const panes = [
//               {title: '药品', content:'测试1', key: '1', closable: false },
//               {title: '已审批', content:'测试2', key: '2', closable: false}
//               ];
// <Tabs type="editable-card" >
// {panes.map(pane => <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>{pane.content}
// </TabPane>)}
// </Tabs>
