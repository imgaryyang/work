import { connect } from 'dva';
import React, { Component } from 'react';
import { Icon, Badge } from 'antd';
import _ from 'lodash';

import CommonTable from '../../../components/CommonTable';
import RowDelBtn from '../../../components/TableRowDeleteButton';
// import CompanySearchInput from '../../../components/searchInput/CompanySearchInput';
// import AsyncTreeCascader from '../../../components/AsyncTreeCascader';

import styles from './Company.less';

class CompanyList extends Component {

  constructor(props) {
    super(props);
    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.rowSelectChange = this.rowSelectChange.bind(this);
  }

  componentWillMount() {
    this.props.dispatch({ type: 'company/load' });
    // this.props.dispatch({ type: 'utils/initDictTrees', payload: ['DIVISIONS', 'ASSETS_TYPE'] });
  }

  onEdit(record) {
    this.props.dispatch({
      type: 'company/setState',
      payload: { record, visible: true },
    });
  }

  onDelete(record) {
    this.props.dispatch({
      type: 'company/delete',
      id: record.id,
    });
  }

  onPageChange(page) {
    this.props.dispatch({
      type: 'company/load',
      payload: {
        page,
        query: this.props.company.query,
      },
    });
  }

  rowSelectChange(selectedRowKeys) {
    this.props.dispatch({
      type: 'company/setState',
      payload: { selectedRowKeys },
    });
  }

  render() {
    const { company, utils, base } = this.props;
    // const { dicts } = utils;
    const { wsHeight } = base;
    const { page, data } = company;

    // console.log(this.props.utils.dictTrees);
    // console.log(this.props.utils.flatDictTrees);

    const columns = [
      /* {
        title: '医院名称',
        dataIndex: 'hosId',
        key: 'hosId',
        render: (value) => {
          return dicts.dis('HOS_INFO', value);
        },
      }, */{
        title: '厂商编号',
        dataIndex: 'companyCode',
        key: 'companyCode',
        width: 130,
        render: value => _.trim(value),
      }, {
        title: '用户编号',
        dataIndex: 'userCode',
        key: 'userCode',
        width: 100,
      }, {
        title: '厂商名称',
        dataIndex: 'companyName',
        key: 'companyName',
        width: 280,
      }, {
        title: '服务范围',
        dataIndex: 'services',
        key: 'services',
        width: 150,
        className: 'text-align-center text-no-wrap',
        render: (value) => {
          return (
            <div>
              <font className={_.indexOf(value, '1') !== -1 ? styles.available : styles.unavailable} >药品</font>&nbsp;
              <font className={_.indexOf(value, '2') !== -1 ? styles.available : styles.unavailable} >物资</font>&nbsp;
              <font className={_.indexOf(value, '3') !== -1 ? styles.available : styles.unavailable} >资产</font>
            </div>
          );
        },
      }, {
        title: '厂商分类',
        dataIndex: 'companyType',
        key: 'companyType',
        width: 125,
        className: 'text-align-center text-no-wrap',
        render: (value) => {
          return (
            <div>
              <font className={_.indexOf(value, '1') !== -1 ? styles.available : styles.unavailable} >生产厂家</font>&nbsp;
              <font className={_.indexOf(value, '2') !== -1 ? styles.available : styles.unavailable} >供货商</font>
            </div>
          );
        },
        /* render: (value) => {
          return dicts.dis('COMPANY_TYPE', value);
        },*/
      }, {
        title: '停用标志',
        dataIndex: 'stopFlag',
        key: 'stopFlag',
        width: 80,
        className: 'text-align-center',
        render: value => (
          <span><Badge status={value === '1' ? 'success' : 'error'} />{value === '1' ? '正常' : '停用'}</span>
        ),
      }, {
        title: '操作',
        key: 'action',
        width: 80,
        className: 'text-align-center text-no-wrap',
        render: (text, record) => (
          <span>
            <Icon type="edit" className="tableEditIcon" onClick={this.onEdit.bind(this, record)} />
            <span className="ant-divider" />
            <RowDelBtn onOk={() => this.onDelete(record)} />
          </span>
        ),
      },
    ];
    return (
      <div>
        {/* <AsyncTreeCascader dictType="DIVISIONS" />
        <AsyncTreeCascader dictType="ASSETS_TYPE" />
        {this.getTreeDictValue('ASSETS_TYPE', '001003')}......
        {this.getTreeDictCascadeValue('ASSETS_TYPE', ['001', '001003'])}*/}
        {/* <CompanySearchInput
          companyType={['2']}
          services={['1']}
          onSelect={item => console.log(item)}
          style={{ width: '200px' }}
        />
        <CompanySearchInput
          companyType={['1']}
          services={['3']}
          onSelect={item => console.log(item)}
          style={{ width: '200px' }}
        />*/}
        <CommonTable
          data={data}
          page={page}
          columns={columns}
          onPageChange={this.onPageChange}
          onSelectChange={this.rowSelectChange}
          bordered
          scroll={{ y: (wsHeight - 43 - 33 - 48) }}
        />
      </div>
    );
  }
}
export default connect(
  ({ company, utils, base }) => ({ company, utils, base }),
)(CompanyList);
