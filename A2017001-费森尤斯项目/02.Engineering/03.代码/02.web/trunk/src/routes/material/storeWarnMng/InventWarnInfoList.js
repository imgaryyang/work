import React, { Component } from 'react';
import { connect } from 'dva';
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
      type: 'materialInventWarnInfo/loadInventWarn',
    });
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['MATERIAL_TYPE'],
    });
  }

  onSearch(values) {
    this.props.dispatch({
      type: 'materialInventWarnInfo/loadInventWarn',
      payload: { queryCon: values },
    });
  }

  onPageChange(pageNew) {
    const { query } = this.props.materialInventWarnInfo;
    this.props.dispatch({
      type: 'materialInventWarnInfo/loadInventWarn',
      payload: { pageNew, query },
    });
  }

  render() {
    const { data, page, spin } = this.props.materialInventWarnInfo || {};
    const { dicts } = this.props.utils;
    const columns = [
        { title: '物资分类', dataIndex: 'materialType', key: 'materialType', width: 70, 
          render: (value) => {
            return dicts.dis('MATERIAL_TYPE', value);
          },
         },
        { title: '编码', dataIndex: 'materialCode', key: 'materialCode', width: 70 },
        { title: '名称', dataIndex: 'tradeName', key: 'tradeName', width: 150 },
        { title: '规格', dataIndex: 'materialSpecs', key: 'materialSpecs', width: 70 },
        { title: '生产厂家', dataIndex: 'companyInfo.companyName', key: 'companyInfo.companyName', width: 200 },
        { title: '停用标识',
          dataIndex: 'stop',
          key: 'stop',
          width: 70,
          render: (value) => {
            if (value) {
              return '正常';
            }              else {
              return '停用';
            }
          },
          },
        { title: '本科库存量', dataIndex: 'storeSum', key: 'storeSum', width: 70 },
        { title: '预警存量', dataIndex: 'alertNum', key: 'alertNum', width: 70 },
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
            data={data} page={page} columns={columns} bordered pagination
            rowSelection={false} onPageChange={this.onPageChange.bind(this)}
          />
        </Row>
      </Spin>
    );
  }
}

export default connect(
  ({ materialInventWarnInfo, utils }) => ({ materialInventWarnInfo, utils }),
)(InventWarnInfoList);
