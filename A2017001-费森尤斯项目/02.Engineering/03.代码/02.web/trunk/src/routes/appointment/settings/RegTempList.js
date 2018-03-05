import React, { Component } from 'react';
import moment from 'moment';
import CommonTable from '../../../components/CommonTable';
import Styles from './RegVisit.less';

class RegTempList extends Component {

  onPageChange(page) {
    this.props.dispatch({
      type: 'regVisitTemp/load',
      payload: { page },
    });
  }

  onRowClick(record) {
    this.props.dispatch({
      type: 'regVisit/setState',
      payload: { record },
    });
  }

  rowSelectChange(selectedRowKeys) {
    this.props.dispatch({
      type: 'regVisitTemp/setState',
      payload: { selectedRowKeys },
    });
  }

  render() {
    const { page, data, dicts, depts, deptsIdx } = this.props;

    const columns = [
      {
        title: '出诊科室',
        dataIndex: 'deptId',
        key: 'deptId',
        width: 100,
        render: (value) => {
          return depts.disDeptNameByDeptId(deptsIdx, value);
        },
      },
      {
        title: '挂号级别',
        dataIndex: 'levelName',
        key: 'levelName',
        width: 100,
        render: (value) => {
          return dicts.dis('REG_LEVEL', value);
        },
      },
      { title: '出诊医生', dataIndex: 'docName', width: 100, key: 'docName' },
      {
        title: '午别',
        dataIndex: 'noon',
        key: 'noon',
        width: 40,
        render: (value) => {
          return dicts.dis('NOON_TYPE', value);
        },
      }, {
        title: '上班时间',
        dataIndex: 'startTime',
        key: 'startTime',
        width: 60,
        render: (value) => {
          return moment(value).format('HH:mm');
        },
      }, {
        title: '下班时间',
        dataIndex: 'endTime',
        key: 'endTime',
        width: 60,
        render: (value) => {
          return moment(value).format('HH:mm');
        },
      },
      { title: '现场限额', dataIndex: 'regLmt', width: 60, key: 'reglmt' },
      { title: '预约限额', dataIndex: 'orderLmt', width: 60, key: 'orderLmt' },
      { title: '诊区名称', dataIndex: 'areaName', width: 100, key: 'areaName' },
    ];

    return (
      <div className={Styles.modelInnerTable}>
        <CommonTable
          data={data}
          page={page}
          columns={columns}
          onPageChange={this.onPageChange.bind(this)}
          onRowClick={this.onRowClick.bind(this)}
          onSelectChange={this.rowSelectChange.bind(this)}
          rowSelection={false}
          size="small"
          scroll={{ y: 180 }}
        />
      </div>
    );
  }
}
export default RegTempList;
