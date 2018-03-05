import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import CommonTable from '../../../components/CommonTable';
import Styles from './StoreInfoSearchList.less';

class StoreInfoSearchList extends Component {
  onPageChange(page) {
    this.props.dispatch({
      type: 'matStoreInfoQuery/load',
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
      if (record.storeSum != null) {
        if (record.minUnit && record.minUnit !== null) {
          return `${record.storeSum}${record.minUnit}`;
        } else {
          return `${record.storeSum}`;
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
      { title: '物资类别',
        dataIndex: 'materialType',
        key: 'materialType',
        width: 75,
        className: 'text-align-center',
        render: (value, record) => {
          return (
            <div>
              {dicts.dis('MATERIAL_TYPE', value) || '其它' }
            </div>
          );
        },
      },
      {
        title: '物资信息',
        width: 180,
        dataIndex: 'materialCode',
        key: 'materialCode',
        render: (text, record) => {
          return (
            <div>
              <font style={{ color: 'rgb(191, 191, 191)' }}>{text}</font><br />
              {`${record.tradeName} (${record.materialSpecs || ''})`}
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
        dataIndex: 'alertNum',
        key: 'alertNum',
        width: 125,
        render: (text, record) => {
          return record.materialInfo ? (record.materialInfo.companyInfo ? (record.materialInfo.companyInfo.companyName || '-') : '-') : '-';
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
export default connect(({ user4Opt }) => ({ user4Opt }))(StoreInfoSearchList);
