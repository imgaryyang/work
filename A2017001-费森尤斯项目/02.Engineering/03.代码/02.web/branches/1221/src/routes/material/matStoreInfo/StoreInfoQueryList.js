import React, { Component } from 'react';
import moment from 'moment';
import CommonTable from '../../../components/CommonTable';
import Styles from './StoreInfoList.less';

class StoreInfoQueryList extends Component {
  onPageChange(page) {
    this.props.dispatch({
      type: 'matStoreInfoQuery/load',
      payload: { page },
    });
  }

  render() {
    const { page, data, dicts, depts, deptsIdx, activeKey, wsHeight } = this.props;
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
    const alertNumCompute = (record) => {
      if (record.alertNum != null) {
        if (record.minUnit && record.minUnit !== null) {
          return `${record.alertNum}${record.minUnit}`;
        } else {
          return `${record.alertNum}`;
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
          width: 250,
          dataIndex: 'materialCode',
          key: 'materialCode',
          render: (text, record) => {
            return (
              <div>
                <font style={{ color: 'rgb(191, 191, 191)' }}>{text}</font><br />
                {`${record.tradeName} (${record.materialSpecs || ''})`}<br />
                {`厂商：${record.companyInfo ? (record.companyInfo.companyName || '-') : '-'}`}
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
        { title: '警戒库存量',
          dataIndex: 'alertNum',
          key: 'alertNum',
          width: 90,
          render: (text, record) => {
            return alertNumCompute(record);
          },
        },
        { title: '采购金额', dataIndex: 'buyCost', key: 'buyCost', width: 90, render: text => (text || 0.00).formatMoney(2), className: 'text-align-right' },
        { title: '零售金额', dataIndex: 'saleCost', key: 'saleCost', width: 90, render: text => (text || 0.00).formatMoney(2), className: 'text-align-right' },
        { title: '物资位置', dataIndex: 'location', key: 'location', width: 100 },
        { title: '停用标志',
          dataIndex: 'stop',
          key: 'stop',
          width: 65,
          className: 'text-align-center',
          render: (value) => {
            return value ? '正常' : '停用';
          },
        },
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
        { title: '物资类别',
          dataIndex: 'materialType',
          key: 'materialType',
          width: 75,
          className: 'text-align-center',
          render: (value, record) => {
            return (
              <div>
                {dicts.dis('MATERIAL_TYPE', value)}<br />
                {dicts.dis('DRUG_QUALITY', record.drugInfo ? (record.drugInfo.drugQuality || '-') : '-')}
              </div>
            );
          },
        },
        {
          title: '物资信息',
          width: 250,
          dataIndex: 'materialCode',
          key: 'materialCode',
          render: (text, record) => {
            return (
              <div>
                <font style={{ color: 'rgb(191, 191, 191)' }}>{text}</font><br />
                {`${record.tradeName} (${record.materialSpecs || ''})`}<br />
                {`厂商：${record.companyInfo ? (record.companyInfo.companyName || '-') : '-'}`}
              </div>
            );
          },
        },
        /* { title: '物资编码', dataIndex: 'materialCode', key: 'materialCode' },
        { title: '物资名称', dataIndex: 'tradeName', key: 'tradeName' },
        { title: '物资规格', dataIndex: 'specs', key: 'specs' },
        { title: '批次', dataIndex: 'batchNo', key: 'batchNo' },*/
        /*{ title: '批号/批次',
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
        },*/
        { title: '生产日期', dataIndex: 'produceDate', key: 'produceDate', width: 90, className: 'text-align-center' },
        { title: '有效期', dataIndex: 'validDate', key: 'validDate', editor: 'date', editable: true, width: 110, className: 'text-align-center' },
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
        // { title: '物资位置', dataIndex: 'location', key: 'location' },
        { title: '停用标志',
          dataIndex: 'stop',
          key: 'stop',
          width: 65,
          className: 'text-align-center',
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
