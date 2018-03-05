import React, { Component } from 'react';
import { Icon, Popconfirm, Badge } from 'antd';
import CommonTable from '../../../components/CommonTable';

class DrugInfoList extends Component {

  onEdit(record) {
    this.props.dispatch({ type: 'drugInfo/toggleVisible' });
    this.props.dispatch({
      type: 'utils/setState',
      payload: { record, shortcuts: true },
    });
  }

  onDelete(record) {
    this.props.dispatch({
      type: 'drugInfo/delete',
      id: record.id,
    });
  }

  onPageChange(page) {
    this.props.dispatch({
      type: 'drugInfo/load',
      payload: { page },
    });
  }

  rowSelectChange(selectedRowKeys) {
    this.props.dispatch({
      type: 'drugInfo/setState',
      payload: { selectedRowKeys },
    });
  }

  render() {
    const { page, data, dicts, wsHeight } = this.props;

    const columns = [
      { title: '药品编码', dataIndex: 'drugCode', key: 'drugCode', width: 125, className: 'text-align-center' },
      { title: '药品名称',
        dataIndex: 'commonName',
        key: 'commonName',
        width: 280,
        render: (value, record) => {
          return (
            <div>
              <font style={{ color: '#919191' }} >(通用)</font> {value}<br />
              <font style={{ color: '#919191' }} >(商品)</font> {record.tradeName}<br />
              厂家：{record.companyInfo ? (record.companyInfo.companyName || '-') : '-'}
            </div>
          );
        },
      },
      /* { title: '商品名称', dataIndex: 'tradeName', key: 'tradeName' },*/
      { title: '药品条码', dataIndex: 'barcode', key: 'barcode', width: 115 },
      { title: '国标准字', dataIndex: 'approvedId', key: 'approvedId', width: 115 },
      /* {
        title: '生产厂家',
        dataIndex: 'companyInfo',
        key: 'companyInfo',
        render: (value) => {
          // console.log(value);
          return value ? value.companyName : '';
        },
      },*/
      {
        title: '分类/规格',
        dataIndex: 'drugType',
        key: 'drugType',
        width: 80,
        className: 'text-align-center',
        render: (value, record) => {
          return (
            <div>
              {value ? dicts.dis('DRUG_TYPE', value) : '-'}<br />
              {record.drugQuality ? dicts.dis('DRUG_QUALITY', record.drugQuality) : '-'}
            </div>
          );
        },
      }, /* {
        title: '药品性质',
        dataIndex: 'drugQuality',
        key: 'drugQuality',
        render: (value) => {
          return dicts.dis('DRUG_QUALITY', value);
        },
      },*/
      { title: '药品规格', dataIndex: 'drugSpecs', key: 'drugSpecs', width: 115 },
      {
        title: '剂型',
        dataIndex: 'dosage',
        key: 'dosage',
        width: 70,
        render: (value) => {
          return dicts.dis('DOSAGE', value);
        },
      },
      /* {
        title: '用法',
        dataIndex: 'usage',
        key: 'usage',
        width: 60,
        render: (value) => {
          return dicts.dis('USAGE', value);
        },
      },*/
      {
        title: '停用标志',
        dataIndex: 'stopFlag',
        key: 'stopFlag',
        width: 80,
        className: 'text-align-center',
        render: value => (
          <span><Badge status={value ? 'success' : 'error'} />{value ? '正常' : '停用'}</span>
        ),
      }, {
        title: '操作',
        key: 'action',
        width: 80,
        className: 'text-align-center',
        render: (text, record) => (
          <span>
            <Icon type="edit" className="tableEditIcon" onClick={this.onEdit.bind(this, record)} />
            <span className="ant-divider" />
            <Popconfirm placement="left" title={'您确定要删除此项么?'} cancelText={'否'} okText={'是'} onConfirm={this.onDelete.bind(this, record)}>
              <Icon type="delete" className="tableDeleteIcon" />
            </Popconfirm>
          </span>
        ),
      },
    ];

    const expandTable = (record) => {
      const expandColumns = [
        { title: '基本剂量', dataIndex: 'baseDose', key: 'baseDose', className: 'column-right' },
        { title: '剂量单位', dataIndex: 'doseUnit', key: 'doseUnit' },
        { title: '包装数量', dataIndex: 'packQty', key: 'packQty', className: 'column-right' },
        { title: '最小单位', dataIndex: 'miniUnit', key: 'miniUnit' },
        { title: '包装单位', dataIndex: 'packUnit', key: 'packUnit' },
        {
          title: '用法',
          dataIndex: 'usage',
          key: 'usage',
          render: (value) => {
            return dicts.dis('USAGE', value);
          },
        },
        {
          title: '处方药',
          dataIndex: 'isrecipe',
          key: 'isrecipe',
          render: (value) => {
            return value
              ? '是'
              : '否';
          },
        },
        {
          title: '需要皮试',
          dataIndex: 'isskin',
          key: 'isskin',
          render: (value) => {
            return value
              ? '需要'
              : '不需要';
          },
        },
        {
          title: '进价',
          dataIndex: 'buyPrice',
          key: 'bugPrice',
          className: 'column-money',
          render: (value) => { return (value || 0).formatMoney(); },
        },
        {
          title: '批发价',
          dataIndex: 'wholePrice',
          key: 'wholePrice',
          className: 'column-money',
          render: (value) => { return (value || 0).formatMoney(); },
        },
        {
          title: '售价',
          dataIndex: 'salePrice',
          key: 'salePrice',
          className: 'column-money',
          render: (value) => { return (value || 0).formatMoney(); },
        },
        { title: '物价编码', dataIndex: 'priceCode', key: 'priceCode' },
        { title: '频次编码', dataIndex: 'freqCode', key: 'freqCode' },
        { title: '抗菌药编码', dataIndex: 'antCode', key: 'antCode' },
      ];
      return (
        <CommonTable
          data={data.filter(item => item.id === record.id)}
          size="small"
          bordered
          columns={expandColumns}
          pagination={false}
          rowSelection={false}
        />
      );
    };

    return (
      <div>
        <CommonTable
          data={data}
          page={page}
          columns={columns}
          onPageChange={this.onPageChange.bind(this)}
          onSelectChange={this.rowSelectChange.bind(this)}
          expandedRowRender={record => expandTable(record)}
          bordered
          size="middle"
          scroll={{ y: (wsHeight - 37 - 47 - 33 - 62 - 2) }}
        />
      </div>
    );
  }
}
export default DrugInfoList;
