import React, { Component } from 'react';
import { connect } from 'dva';
import { floor } from 'lodash';
import { Spin, Row, Col } from 'antd';
import CommonTable from '../../../components/CommonTable';
import SearchBar from './StoreWarnMngSearchBar';

class InventWarnInfoList extends Component {

  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'inventWarnInfo/loadInventWarn',
    });
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['DRUG_TYPE'],
    });
  }

  onSearch(values) {
    this.props.dispatch({
      type: 'inventWarnInfo/loadInventWarn',
      payload: { queryCon: values },
    });
  }

  onPageChange(pageNew) {
    this.props.dispatch({
      type: 'inventWarnInfo/loadInventWarn',
      payload: { pageNew },
    });
  }

  render() {
    const { data, page, spin } = this.props.inventWarnInfo || {};
    const { dicts } = this.props.utils;

    const columns = [
      {
        title: '药品分类',
        dataIndex: 'drugType',
        key: 'drugType',
        width: 70,
        render: (value) => {
          return dicts.dis('DRUG_TYPE', value);
        },
      },
      { title: '编码', dataIndex: 'drugCode', key: 'drugCode', width: 90 },
      { title: '名称', dataIndex: 'tradeName', key: 'tradeName', width: 150 },
      { title: '规格', dataIndex: 'specs', key: 'specs', width: 70 },
      { title: '生产厂家', dataIndex: 'companyInfo.companyName', key: 'companyInfo.companyName', width: 200 },
      {
        title: '停用标识',
        dataIndex: 'stop',
        key: 'stop',
        width: 70,
        render: (value) => {
          if (value) {
            return '正常';
          } else {
            return '停用';
          }
        },
      },
      {
        title: '本科库存量',
        dataIndex: 'storeSum',
        key: 'storeSum',
        width: 70,
        render: (text, record) => {
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
        },
      },
      {
        title: '预警存量',
        dataIndex: 'alertNum',
        key: 'alertNum',
        width: 70,
        render: (text, record) => {
          if (record.alertNum != null && record.drugInfo.packQty != null && record.drugInfo.packQty !== 0) {
            if (record.alertNum === 0) {
              return 0;
            } else {
              return `${floor(record.alertNum / record.drugInfo.packQty)}${record.drugInfo.packUnit ? record.drugInfo.packUnit : ''}`;
            }
          } else {
            return '';
          }
        },
      },
    ];
    return (
      <Spin spinning={spin} >
        <Row type="flex" align="middle" style={{ paddingBottom: 15, paddingTop: 15 }} >
          <Col>
            <SearchBar onSearch={values => this.onSearch(values)} />
          </Col>
        </Row>

        <Row>
          <CommonTable
            data={data} page={page}
            columns={columns} bordered
            rowSelection={false}
            onPageChange={this.onPageChange.bind(this)}
          />
        </Row>
      </Spin>
    );
  }
}

export default connect(
  ({ inventWarnInfo, utils }) => ({ inventWarnInfo, utils }),
)(InventWarnInfoList);
