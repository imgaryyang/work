import React, { Component } from 'react';
import EditTable from '../../../components/editTable/EditTable';

class MonthCheckList extends Component {
  onPageChange(page) {
    this.props.dispatch({
      type: 'matMonthCheck/load',
      payload: { page },
    });
  }

  render() {
    const { page, data, dicts, depts, deptsIdx, wsHeight } = this.props;
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
      { title: '物资类别',
        dataIndex: 'materialType',
        key: 'materialType',
        width: 75,
        className: 'text-align-center',
        render: (value) => {
          return (
            <div>
              {dicts.dis('MATERIAL_TYPE', value)}<br />
            </div>
          );
        },
      },
      { title: '物品信息',
        dataIndex: 'tradeName',
        key: 'tradeName',
        width: 260,
        render: (text, record) => {
          return (
            <div>
              <font style={{ color: 'rgb(191, 191, 191)' }}>{record.materialCode}</font><br />
              {`${text}(${record.materialSpecs || '-'})`}<br />
              {`生产厂商：${record.companyInfo ? (record.companyInfo.companyName || '-') : '-'}`}
            </div>
          );
        },
      },
      /* { title: '批号/批次',
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
      { title: '有效期', dataIndex: 'validDate', key: 'validDate', width: 110, className: 'text-align-center' },
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
      { title: '库存量',
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
      { title: '停用标志',
        dataIndex: 'stop',
        key: 'stop',
        width: 65,
        className: 'text-align-center',
        render: (value) => {
          return value ? '正常' : '停用';
        },
      },
      { title: '月结日期', dataIndex: 'monthcheckTime', key: 'monthcheckTime', width: 110, className: 'text-align-center' },
    ];

    const containerHeight = wsHeight - 43 - 46 - 17;
    return (
      <div style={{ height: `${containerHeight}px`, overflow: 'hidden' }} >
        <EditTable
          data={data}
          page={page}
          columns={columns}
          rowSelection={false}
          onPageChange={this.onPageChange.bind(this)}
          bordered
          scroll={{ y: (containerHeight - 33 - 62) }}
        />
      </div>
    );
  }
}
export default MonthCheckList;
