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
    this.autoClick = this.autoClick.bind(this);
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'directIn/load',
    });
  }
  onPageChange(page) {
    const { tradeName } = this.props.directIn;
    this.props.dispatch({
      type: 'directIn/load',
      payload: {
        page,
        query: { tradeName },
      },
    });
  }

  onConfirm(record) {
    this.props.dispatch({
      type: 'directIn/forAddApply',
      record,
    });
  }

  B(values) {
    this.props.dispatch({
      type: 'directIn/load',
      payload: {
        query: values,
      },
    });
    window.setTimeout(this.autoClick, 1000);
  }

  autoClick() {
    const { newData } = this.props.directIn;
    // console.log('data+++',data);
    if (newData && newData.length === 1) {
      this.onConfirm(newData[0]);
    }
  }

  render() {
    const { directIn, base } = this.props;
    const { data, page } = directIn || {};
    const columns = [
      { title: '药品信息',
        dataIndex: 'tradeName',
        key: 'tradeName',
        width: 260,
        render: (text, record) => {
          return (
            <div style={{ position: 'relative' }} >
              {`${text ? record.tradeName : record.commonName}(${record.drugSpecs || '-'})`}<br />
              厂商：{record.companyInfo ? (record.companyInfo.companyName || '-') : '-'}
              <span className="drug-state-float" >{record.stopFlag ? '正常' : '停用'}</span>
            </div>
          );
        },
      },
      /* {title:'药品编码', width:'50', dataIndex :'drugCode',key:'drugCode'},
      { title: '药品规格', width: '50', dataIndex: 'drugSpecs', key: 'drugSpecs' },
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
  ({ directIn, utils, base }) => ({ directIn, utils, base }),
)(DirectInventoryList);

