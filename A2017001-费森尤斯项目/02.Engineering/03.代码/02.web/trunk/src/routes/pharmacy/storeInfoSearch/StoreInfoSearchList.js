import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { floor } from 'lodash';
import CommonTable from '../../../components/CommonTable';
import Styles from './StoreInfoList.less';

class StoreInfoQueryList extends Component {
  onPageChange(page) {
    this.props.dispatch({
      type: 'storeInfoQuery/load',
      payload: { page },
    });
  }
  getHosName(hosId) {
    const { hosListData } = this.props.user4Opt;
    for (const index in hosListData) {
      if (hosListData[index].hosId === hosId) {
        return hosListData[index].hosName;
      } else if (index === hosListData.length) {
        return '';
      }
    }
  }
  render() {
    const { page, data, dicts, wsHeight } = this.props;
    let columns = [];

    const storeSumCompute = (record) => {
      if (record.storeSum != null && record.drugInfo != null && record.drugInfo.packQty !== 0) {
        if (record.storeSum === 0) {
          return 0;
        } else if (floor(record.storeSum / record.drugInfo.packQty) === 0) {
          return `${record.storeSum % record.drugInfo.packQty}${record.drugInfo.miniUnit}`;
        } else if (record.storeSum % record.drugInfo.packQty === 0) {
          return `${floor(record.storeSum / record.drugInfo.packQty)}${record.drugInfo.packUnit}`;
        } else {
          return `${floor(record.storeSum / record.drugInfo.packQty)}${record.drugInfo.packUnit}
          ${record.storeSum % record.drugInfo.packQty}${record.drugInfo.miniUnit}`;
        }
      } else {
        return '';
      }
    };
    columns = [
      { title: '医院名称',
        dataIndex: 'hosId',
        key: 'hosId',
        width: 125,
        className: 'text-align-center',
        render: value => this.getHosName(value),
      },
      { title: '分类/性质',
        dataIndex: 'drugType',
        key: 'drugType',
        width: 75,
        className: 'text-align-center text-no-wrap',
        render: (value, record) => {
          return (
            <div>
              {dicts.dis('DRUG_TYPE', value)}<br />
              {record.drugInfo ? (record.drugInfo.drugQuality ? dicts.dis('DRUG_QUALITY', record.drugInfo.drugQuality) : '-') : '-'}
            </div>
          );
        },
      },
      {
        title: '商品信息',
        width: 180,
        dataIndex: 'drugCode',
        key: 'drugCode',
        render: (text, record) => {
          return (
            <div>
              <font style={{ color: 'rgb(191, 191, 191)' }}>{text}</font><br />
              {`${record.tradeName} (${record.specs || ''})`}
            </div>
          );
        },
      },
      { title: '采购价', dataIndex: 'buyPrice', key: 'bugPrice', width: 90, render: text => (text || 0.00).formatMoney(4), className: 'text-align-right' },
      { title: '零售价', dataIndex: 'salePrice', key: 'salePrice', width: 90, render: text => (text || 0.00).formatMoney(4), className: 'text-align-right' },
      { title: '库存量',
        dataIndex: 'storeSumCompute',
        key: 'storeSumCompute',
        width: 90,
        render: (text, record) => {
          return storeSumCompute(record);
        },
      },
      { title: '生产厂商',
        dataIndex: 'companyInfo',
        key: 'companyInfo',
        width: 125,
        render: (text, record) => {
          return record.drugInfo ? (record.drugInfo.companyInfo ? (record.drugInfo.companyInfo.companyName || '-') : '-') : '-';
        },
      },
    ];
    const rowClassName = (record) => {
      // 停用显示浅红
      if (!record.stop) {
        return Styles.stop;
      }
      // 过期显示浅黄
      if (record.validDate) {
        const validDate = moment(record.validDate).format('YYYY-MM-DD');
        const newDate = moment(new Date()).format('YYYY-MM-DD');
        if (newDate > validDate) {
          return Styles.expired;
        }
      }
    };

    return (
      <CommonTable
        data={data}
        page={page}
        columns={columns}
        rowSelection={false}
        onPageChange={this.onPageChange.bind(this)}
        rowClassName={rowClassName}
        bordered
        scroll={{ y: (wsHeight - 43 - 37 - 10 - 33 - 62 - 7) }}
      />
    );
  }
}
export default connect(({ user4Opt }) => ({ user4Opt }))(StoreInfoQueryList);
