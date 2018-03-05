import React, { Component } from 'react';
import EditTable from '../../../components/editTable/EditTable';

class StoreInfoList extends Component {
  onPageChange(page) {
    this.props.dispatch({
      type: 'instrmStoreInfo/load',
      payload: { page },
    });
  }

  onChange(value, row) {
    const updateData = this.editTable.getUpdatedData();
    this.props.dispatch({
      type: 'instrmStoreInfo/updateRow',
      row,
    });
    this.props.dispatch({
      type: 'instrmStoreInfo/setState',
      payload: { data: updateData },
    });
  }

  render() {
    const { page, data, depts, deptsIdx, wsHeight } = this.props;
    // data.stop为Boolean，而dicts.STOP_BOOL为字符型，为此必须做转化，否则EditTable中的DictSelect无法反显
    // 更彻底的解决办法是修改后台，返回0、1而非布尔，前台用dicts.dis('STOP_FLAG')
    // 但修改后台Model涉及改动较多，因此还是在前台单独转化
    for (let i = 0; data && i < data.length; i += 1) {
      if (data[i].stop === true) {
        data[i].stop = 'true';
      } else if (data[i].stop === false) {
        data[i].stop = 'false';
      }
    }
    let columns = [];
    const storeSumCompute = (record) => {
      if (record.storeSum != null) {
        if (record.storeSum === 0) {
          return 0;
        } else {
          return `${(record.storeSum)}${record.minUnit ? record.minUnit : ''}`;
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
        render: (value) => {
          return (
            <div>
              {value ? (this.getTreeDictCascadeValue('ASSETS_TYPE', JSON.parse(value)) || '-') : '-'}
            </div>
          );
        },
      },
      { title: '资产信息',
        dataIndex: 'tradeName',
        key: 'tradeName',
        width: 260,
        render: (text, record) => {
          return (
            <div>
              <font style={{ color: 'rgb(191, 191, 191)' }}>{record.instrmCode}</font><br />
              {`${text}(${record.instrmSpecs || '-'})`}<br />
              {`生产厂商：${record.companyInfo ? (record.companyInfo.companyName || '-') : '-'}`}
            </div>
          );
        },
      },
      { title: '型号',
        dataIndex: 'batchNo',
        key: 'batchNo',
        width: 110,
      },
      { title: '生产日期', dataIndex: 'produceDate', key: 'produceDate', width: 90, className: 'text-align-center' },
      { title: '购入日期', dataIndex: 'purchaseDate', key: 'purchaseDate', editor: 'date', width: 110, className: 'text-align-center' },
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
      { title: '数量',
        dataIndex: 'storeSumCompute',
        key: 'storeSumCompute',
        width: 90,
        render: (text, record) => {
          return storeSumCompute(record);
        },
      },
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
      { title: '药品位置', dataIndex: 'location', key: 'location', className: 'text-align-center', width: 110, editable: true },
      { title: '停用标志',
        dataIndex: 'stop',
        key: 'stop',
        editor: 'dictSelect',
        width: 90,
        className: 'text-align-center',
        editorConfig: {
          columnName: 'STOP_BOOL',
        },
        editable: true,
      },
    ];

    const containerHeight = wsHeight - 43 - 46 - 17;
    return (
      <div style={{ height: `${containerHeight}px`, overflow: 'hidden' }} >
        <EditTable
          ref={(node) => { this.editTable = node; }}
          data={data}
          page={page}
          columns={columns}
          rowSelection={false}
          onChange={this.onChange.bind(this)}
          onPageChange={this.onPageChange.bind(this)}
          bordered
          scroll={{ y: (containerHeight - 33 - 62) }}
        />
      </div>
    );
  }
}
export default StoreInfoList;
