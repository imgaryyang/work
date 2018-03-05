import React, { Component } from 'react';
import { Icon, Badge } from 'antd';

import CommonTable from '../../../components/CommonTable';
import RowDelBtn from '../../../components/TableRowDeleteButton';

class CompanyInfoList extends Component {

  constructor(props) {
    super(props);
    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.rowSelectChange = this.rowSelectChange.bind(this);
  }

  onEdit(record) {
    this.props.dispatch({ type: 'materialCompanyInfo/toggleVisible' });
    this.props.dispatch({
      type: 'utils/setState',
      payload: { record },
    });
  }

  onDelete(record) {
    this.props.dispatch({
      type: 'materialCompanyInfo/delete',
      id: record.id,
    });
  }

  onSearch(values) {
    this.props.dispatch({
      type: 'materialCompanyInfo/load',
      payload: { values },
    });
  }

  onPageChange(page) {
    this.props.dispatch({
      type: 'materialCompanyInfo/load',
      payload: { page },
    });
  }

  rowSelectChange(selectedRowKeys) {
    this.props.dispatch({
      type: 'materialCompanyInfo/setState',
      payload: { selectedRowKeys },
    });
  }

  render() {
    const { page, data, dicts, wsHeight } = this.props;

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
        dataIndex: 'companyId',
        key: 'companyId',
        width: '15%',
      }, {
        title: '厂商名称',
        dataIndex: 'companyName',
        key: 'companyName',
        width: '30%',
      }, {
        title: '厂商分类',
        dataIndex: 'companyType',
        key: 'companyType',
        width: '15%',
        className: 'text-align-center text-no-wrap',
        render: (value) => {
          return dicts.dis('COMPANY_TYPE', value);
        },
      }, /* {
        title: '拼音',
        dataIndex: 'companySpell',
        key: 'companySpell',
        width: 110,
      }, {
        title: '五笔',
        dataIndex: 'companyWb',
        key: 'companyWb',
        width: 110,
      }, */{
        title: '停用标志',
        dataIndex: 'stopFlag',
        key: 'stopFlag',
        width: '15%',
        className: 'text-align-center text-no-wrap',
        render: value => (
          <span><Badge status={value ? 'success' : 'error'} />{value ? '正常' : '停用'}</span>
        ),
      }, {
        title: '操作',
        key: 'action',
        width: '15%',
        className: 'text-align-center text-no-wrap',
        render: (text, record) => (
          <span>
            <Icon type="edit" className="tableEditIcon" onClick={this.onEdit.bind(this, record)} />
            <span className="ant-divider" />
            {/* <Popconfirm placement="left" title={'您确定要删除此项么?'} cancelText={'否'} okText={'是'} onConfirm={this.onDelete.bind(this, record)}>
              <Icon type="delete" className="tableDeleteIcon" />
            </Popconfirm>*/}
            <RowDelBtn onOk={() => this.onDelete(record)} />
          </span>
        ),
      },
    ];
    return (
      <div>
        <CommonTable
          data={data}
          page={page}
          columns={columns}
          onPageChange={this.onPageChange.bind(this)}
          onSelectChange={this.rowSelectChange.bind(this)}
          bordered
          scroll={{ y: (wsHeight - 47 - 33 - 62 - 2) }}
        />
      </div>
    );
  }
}
export default CompanyInfoList;
