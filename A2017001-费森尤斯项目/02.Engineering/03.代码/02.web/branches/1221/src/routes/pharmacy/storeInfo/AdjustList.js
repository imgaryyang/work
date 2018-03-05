import React, { Component } from 'react';
import { connect } from 'dva';
import { testAmt } from '../../../utils/validation';
import EditTable from '../../../components/editTable/EditTable';

class AdjustList extends Component {

  onPageChange(page) {
    this.props.dispatch({
      type: 'adjust/load',
      payload: { page },
    });
  }
  onDelete(e, record) {
    this.props.dispatch({
      type: 'adjust/delete',
      record,
    });
  }

  render() {
    const { page, data } = this.props;
    const { dicts } = this.props.utils;
    const { wsHeight } = this.props.base;
    const columns = [
      {
        title: '药品编码',
        width: 120,
        dataIndex: 'drugCode',
        key: 'drugCode',
      },
      {
        title: '药品分类',
        dataIndex: 'drugType',
        width: 120,
        key: 'drugType',
        render: (value) => {
          return dicts.dis('DRUG_TYPE', value);
        },
      },
      {
        title: '药品名称',
        width: 120,
        dataIndex: 'tradeName',
        key: 'tradeName',
      },
      {
        title: '药品规格',
        width: 120,
        dataIndex: 'drugSpecs',
        key: 'specs',
        render: (value, record) => {
          return record.specs ? record.specs : record.drugSpecs;
        },
      },
      {
        title: '购入价',
        width: 120,
        dataIndex: 'buyPrice',
        key: 'startBuy',
        className: 'text-align-right',
        render: (value, record) => {
          return record.buyPrice ? record.buyPrice.formatMoney(4) : '';
        },
      },
      {
        title: '原零售价',
        width: 120,
        dataIndex: 'salePrice',
        key: 'startSale',
        className: 'text-align-right',
        render: (value, record) => {
          return record.salePrice ? record.salePrice.formatMoney(4) : '';
        },
      },
      {
        title: '调整后售价',
        width: 120,
        dataIndex: 'endSale',
        key: 'endSale',
        editorConfig: { verfy: (v) => { return testAmt(v); } },
        render: (value, record) => {
          return value ? value.formatMoney(4) : record.salePrice.formatMoney(4);
        },
        editable: true,
      },
      {
        title: '调价原因',
        width: 120,
        dataIndex: 'comm',
        key: 'comm',
        editable: true,
      },
    ];

    return (
      <div>
        <EditTable
          ref="commonTable"
          data={data}
          page={page}
          columns={columns}
          onPageChange={this.onPageChange.bind(this)}
          scroll={{ y: (wsHeight - (36 * 2) - (30 * 2) - (7 * 2)) }}
          rowSelection={false}
          bordered
          size="middle"
        />
      </div>
    );
  }
}
export default connect(({ adjust, utils, base }) => ({ adjust, utils, base }))(AdjustList);
