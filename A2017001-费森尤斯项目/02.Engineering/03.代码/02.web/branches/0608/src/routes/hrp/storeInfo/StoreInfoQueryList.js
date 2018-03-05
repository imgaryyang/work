import React, { Component } from 'react';
import CommonTable from '../../../components/CommonTable';

class StoreInfoQueryList extends Component {
  onPageChange(page) {
    this.props.dispatch({
      type: 'instrmStoreInfoQuery/load',
      payload: { page },
    });
  }

  render() {
    const { page, data, dicts, depts, deptsIdx, wsHeight } = this.props;
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
      { title: '库房',
        dataIndex: 'deptId',
        key: 'deptId',
        width: 65,
        className: 'text-align-center',
        render: (value) => {
          return depts.disDeptName(deptsIdx, value);
        },
      },
      { title: '资产类别',
        dataIndex: 'instrmType',
        key: 'instrmType',
        width: 75,
        className: 'text-align-center',
        render: (value, record) => {
          return (
            <div>
              {value ? (this.getTreeDictCascadeValue('ASSETS_TYPE', JSON.parse(value)) || '-') : '-'}
            </div>
          );
        },
      },
      {
        title: '资产信息',
        width: 250,
        dataIndex: 'instrmCode',
        key: 'instrmCode',
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
      /* { title: '资产编码', dataIndex: 'instrmCode', key: 'instrmCode' },
      { title: '资产名称', dataIndex: 'tradeName', key: 'tradeName' },
      { title: '资产规格', dataIndex: 'specs', key: 'specs' },
      { title: '批次', dataIndex: 'batchNo', key: 'batchNo' },*/
      { title: '型号',
        dataIndex: 'batchNo',
        key: 'batchNo',
        width: 110,
      },
      { title: '生产日期', dataIndex: 'produceDate', key: 'produceDate', width: 90, className: 'text-align-center' },
      { title: '购入日期', dataIndex: 'purchaseDate', key: 'purchaseDate', editor: 'date', editable: true, width: 110, className: 'text-align-center' },
      { title: '供应商', dataIndex: 'companySupply.companyName', key: 'companySupply.companyName', width: 110 },
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
      { title: '数量',
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
      { title: '药品位置', dataIndex: 'location', key: 'location', className: 'text-align-center', width: 110 },
      /* { title: '零售金额', dataIndex: 'saleCost', key: 'saleCost', width: 75, render: text => (text || 0.00).formatMoney(2), className: 'text-align-right' },*/
      // { title: '资产位置', dataIndex: 'location', key: 'location' },
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

    return (
      <CommonTable
        data={data}
        page={page}
        columns={columns}
        rowSelection={false}
        onPageChange={this.onPageChange.bind(this)}
        bordered
        scroll={{ y: (wsHeight - 43 - 37 - 10 - 33 - 62 - 7) }}
      />
    );
  }
}
export default StoreInfoQueryList;
