import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Spin, Row, Col, Icon } from 'antd';
import CommonTable from '../../../components/CommonTable'
import SearchBar from './StoreWarnMngSearchBar';

class ValidWarnInfoList extends React.Component {

  constructor(props) {
    super(props);
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'validWarnInfo/loadValidWarn',
    });
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['DRUG_TYPE'],
    });
  }
  onSearch(values) {
    this.props.dispatch({
      type: 'validWarnInfo/loadValidWarn',
      payload: { query: values },
    });
  }

  onPageChange(page) {
    this.props.dispatch({
      type: 'validWarnInfo/loadValidWarn',
      payload: { page },
    });
  }

  render() {
    const { ValidDetail, page, spin } = this.props.validWarnInfo || {};
    const { dicts } = this.props.utils;
    const { data } = ValidDetail;
    const columns = [
    { title: '药品分类', dataIndex: 'drugType', key: 'drugType', width: 70, render: (value) => { return dicts.dis('DRUG_TYPE', value); } },
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
    { title: '有效期', dataIndex: 'validDate', key: 'validDate', width: 70 },
      { title: '预警天数',
        dataIndex: 'validDate',
        key: 'alertNum',
        width: 70,
        render: (value) => {
          const nowDate = new Date();
          const udpDate = new Date(value.substr(0, 4), value.substr(5, 2) - 1, value.substr(8, 2));
          const time = Math.floor((udpDate - nowDate) / (24 * 60 * 60 * 1000)) + 1;
          if (time < 0) {
            return (
              <div>
                <font style={{ color: 'rgb(191, 191, 191)' }}>{time}</font>
              </div>
            );
          } else if (time < 15) {
            return (
              <div>
                <font style={{ color: 'rgb(255, 0, 0)' }}>{time}</font>
              </div>
            );
          } else if (time < 30) {
            return (
              <div>
                <font style={{ color: 'rgb(0, 0, 255)' }}>{time}</font>
              </div>
            );
          } else {
            return (
              <div>
                <font>{time}</font>
              </div>
            );
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
            data={data}
            page={page}
            columns={columns}
            bordered
            rowSelection={false} onPageChange={this.onPageChange.bind(this)}
          />
        </Row>
      </Spin>
    );
  }
}
export default connect(({ validWarnInfo, utils }) => ({ validWarnInfo, utils }))(ValidWarnInfoList);
