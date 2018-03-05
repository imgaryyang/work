import React, { Component } from 'react';
import moment from 'moment';
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

  render() {
    const { page, data, dicts, depts, deptsIdx, activeKey, wsHeight } = this.props;
    let columns = [];
    const storeSumCompute = (record) => {
      if (record.storeSum != null && record.drugInfo.packQty != null && record.drugInfo.packQty !== 0) {
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
    const alertNumCompute = (record) => {
      if (record.alertNum != null && record.drugInfo.packQty != null && record.drugInfo.packQty !== 0) {
        if (record.alertNum === 0) {
          return 0;
        } else if (floor(record.alertNum / record.drugInfo.packQty) === 0) {
          return `${record.alertNum % record.drugInfo.packQty}${record.drugInfo.miniUnit}`;
        } else if (record.alertNum % record.drugInfo.packQty === 0) {
          return `${floor(record.alertNum / record.drugInfo.packQty)}${record.drugInfo.packUnit}`;
        } else {
          return `${floor(record.alertNum / record.drugInfo.packQty)}${record.drugInfo.packUnit}
          ${record.alertNum % record.drugInfo.packQty}${record.drugInfo.miniUnit}`;
        }
      } else {
        return '';
      }
    };

    if (activeKey === '1') {
      columns = [
        { title: '库房',
          dataIndex: 'deptId',
          key: 'deptId',
          width: 65,
          className: 'text-align-center',
          render: (value) => {
            return depts.disDeptName(deptsIdx, value);
          },
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
        /* { title: '药品性质',
          dataIndex: 'drugInfo.drugQuality',
          key: 'drugInfo.drugQuality',
          width: 65,
          className: 'text-align-center text-no-wrap',
          render: (value) => {
            return dicts.dis('DRUG_QUALITY', value);
          },
        },*/
        {
          title: '商品信息',
          width: 250,
          dataIndex: 'drugCode',
          key: 'drugCode',
          render: (text, record) => {
            return (
              <div>
                <font style={{ color: 'rgb(191, 191, 191)' }}>{text}</font><br />
                {`${record.tradeName} (${record.specs || ''})`}<br />
                {`厂商：${record.companyInfo ? (record.companyInfo.companyName || '-') : '-'}`}
              </div>
            );
          },
        },
        /* { title: '药品规格', dataIndex: 'specs', key: 'specs' },
        { title: '厂家', dataIndex: 'companyInfo.companyName', key: 'companyInfo.companyName' },*/
        // { title: '厂家',
        //   dataIndex: 'producer',
        //   key: 'producer',
        //   render: (value) => {
        //     return dicts.dis('COMPANY_TYPE', value);
        //   },
        // },
        { title: '采购价', dataIndex: 'buyPrice', key: 'bugPrice', width: 90, render: text => (text || 0.00).formatMoney(4), className: 'text-align-right' },
        { title: '零售价', dataIndex: 'salePrice', key: 'salePrice', width: 90, render: text => (text || 0.00).formatMoney(4), className: 'text-align-right' },
        // { title: '库存数量', dataIndex: 'storeSum', key: 'storeSum' },
        { title: '库存量',
          dataIndex: 'storeSumCompute',
          key: 'storeSumCompute',
          width: 90,
          render: (text, record) => {
            return storeSumCompute(record);
          },
        },
        { title: '警戒库存量',
          dataIndex: 'alertNum',
          key: 'alertNum',
          width: 90,
          render: (text, record) => {
            return alertNumCompute(record);
          },
        },
        // { title: '最小单位', dataIndex: 'minUnit', key: 'minUnit' },
        { title: '采购金额', dataIndex: 'buyCost', key: 'buyCost', width: 90, render: text => (text || 0.00).formatMoney(2), className: 'text-align-right' },
        { title: '零售金额', dataIndex: 'saleCost', key: 'saleCost', width: 90, render: text => (text || 0.00).formatMoney(2), className: 'text-align-right' },
        { title: '药品位置', dataIndex: 'location', key: 'location', width: 100 },
        { title: '停用标志',
          dataIndex: 'stop',
          key: 'stop',
          width: 65,
          className: 'text-align-center text-no-wrap',
          render: (value) => {
            return value ? '正常' : '停用';
          },
        },
        /* { title: '备注', dataIndex: 'comm', key: 'comm' },*/
      ];
    } else {
      columns = [
        { title: '库房',
          dataIndex: 'deptId',
          key: 'deptId',
          width: 65,
          className: 'text-align-center',
          render: (value) => {
            return depts.disDeptName(deptsIdx, value);
          },
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
                {dicts.dis('DRUG_QUALITY', record.drugInfo ? (record.drugInfo.drugQuality || '-') : '-')}
              </div>
            );
          },
        },
        /* { title: '药品性质',
          dataIndex: 'drugInfo.drugQuality',
          key: 'drugInfo.drugQuality',
          width: 65,
          className: 'text-align-center',
          render: (value) => {
            return dicts.dis('DRUG_QUALITY', value);
          },
        },*/
        {
          title: '商品信息',
          width: 250,
          dataIndex: 'drugCode',
          key: 'drugCode',
          render: (text, record) => {
            return (
              <div>
                <font style={{ color: 'rgb(191, 191, 191)' }}>{text}</font><br />
                {`${record.tradeName} (${record.specs || ''})`}<br />
                {`厂商：${record.companyInfo ? (record.companyInfo.companyName || '-') : '-'}`}
              </div>
            );
          },
        },
        /* { title: '药品编码', dataIndex: 'drugCode', key: 'drugCode' },
        { title: '商品名称', dataIndex: 'tradeName', key: 'tradeName' },
        { title: '药品规格', dataIndex: 'specs', key: 'specs' },
        { title: '批次', dataIndex: 'batchNo', key: 'batchNo' },*/
        { title: '批号/批次',
          dataIndex: 'approvalNo',
          key: 'approvalNo',
          width: 110,
          render: (text, record) => {
            return (
              <div>
                {text || '-'}<br />
                {record.batchNo || '-'}
              </div>
            );
          },
        },
        /* { title: '厂家', dataIndex: 'companyInfo.companyName', key: 'companyInfo.companyName' },*/
        // { title: '厂家',
        //   dataIndex: 'producer',
        //   key: 'producer',
        //   render: (value) => {
        //     return dicts.dis('COMPANY_TYPE', value);
        //   },
        // },
        { title: '生产日期', dataIndex: 'produceDate', width: 90, key: 'produceDate', className: 'text-align-center' },
        { title: '有效期', dataIndex: 'validDate', width: 90, key: 'validDate', className: 'text-align-center' },
        { title: '采购/零售价',
          dataIndex: 'buyPrice',
          key: 'bugPrice',
          width: 110,
          className: 'text-align-right',
          render: (text, record) => {
            return (
              <div>
                <font style={{ color: 'rgb(191, 191, 191)' }}>(购) </font>{(text || 0.00).formatMoney(4)}<br />
                <font style={{ color: 'rgb(191, 191, 191)' }}>(售) </font>{(record.salePrice || 0.00).formatMoney(4)}
              </div>
            );
          },
        },
        /* { title: '零售价', dataIndex: 'salePrice', key: 'salePrice', width: 75, render: text => (text || 0.00).formatMoney(4), className: 'text-align-right' },*/
        // { title: '库存数量', dataIndex: 'storeSum', key: 'storeSum' },
        { title: '库存量',
          dataIndex: 'storeSumCompute',
          key: 'storeSumCompute',
          width: 80,
          render: (text, record) => {
            return storeSumCompute(record);
          },
        },
        // { title: '最小单位', dataIndex: 'minUnit', key: 'minUnit' },
        { title: '采购/零售金额',
          dataIndex: 'buyCost',
          key: 'buyCost',
          width: 110,
          className: 'text-align-right',
          render: (text, record) => {
            return (
              <div>
                <font style={{ color: 'rgb(191, 191, 191)' }}>(购) </font>{(text || 0.00).formatMoney()}<br />
                <font style={{ color: 'rgb(191, 191, 191)' }}>(售) </font>{(record.saleCost || 0.00).formatMoney()}
              </div>
            );
          },
        },
        /* { title: '零售金额', dataIndex: 'saleCost', key: 'saleCost', width: 75, render: text => (text || 0.00).formatMoney(2), className: 'text-align-right' },*/
        // { title: '药品位置', dataIndex: 'location', key: 'location' },
        { title: '停用标志',
          dataIndex: 'stop',
          key: 'stop',
          width: 65,
          className: 'text-align-center text-no-wrap',
          render: (value) => {
            return value ? '正常' : '停用';
          },
        },
        /* { title: '备注', dataIndex: 'comm', key: 'comm' },*/
      ];
    }
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
export default StoreInfoQueryList;
