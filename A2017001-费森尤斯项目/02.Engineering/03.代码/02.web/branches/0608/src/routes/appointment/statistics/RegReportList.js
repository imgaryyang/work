import React, { Component } from 'react';
import moment from 'moment';
import CommonTable from '../../../components/CommonTable';

class RegReportList extends Component {

  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['SEX', 'REG_LEVEL', 'DEPT_TYPE', 'REG_STATE', 'FEE_TYPE', 'PAY_MODE'],
    });
    this.props.dispatch({
      type: 'utils/initDataSource',
      payload: ['hcpUserCashier'],
    });
    this.props.dispatch({
      type: 'regReport/load',
      payload: { query: {} },
    });
  }

  render() {
    const { page, data, wsHeight, dicts } = this.props;

    const columns = [
      {
        title: '就诊流水号',
        dataIndex: 'regId',
        width: '10%',
        key: 'regId',
      }, {
        title: '发票号',
        dataIndex: 'invoiceNo',
        width: '5%',
        key: 'invoiceNo',
      }, {
        title: '就诊卡号',
        dataIndex: 'patient.medicalCardNo',
        width: '9%',
        key: 'patient.medicalCardNo',
      }, {
        title: '姓名',
        width: '5%',
        dataIndex: 'patient.name',
        key: 'patient.name',
      }, {
        title: '性别',
        width: '5%',
        dataIndex: 'patient.sex',
        key: 'patient.sex',
        render: (value) => {
          return dicts.dis('SEX', value);
        },
      }, {
        title: '年龄',
        width: '5%',
        dataIndex: 'patient.birthday',
        key: 'patient.birthday',
        render: (value) => {
          const thisYear = moment.duration(moment().year(), 'y');
          const birthYear = moment.duration(parseInt(moment(value).format('YYYY'), 10), 'y');
          return `${thisYear.subtract(birthYear).years() + 1} 岁`;
        },
      }, {
        title: '挂号级别',
        width: '7%',
        dataIndex: 'regLevel',
        key: 'regLevel',
        render: (value) => {
          return dicts.dis('REG_LEVEL', value);
        },
      }, {
        title: '挂号科室',
        dataIndex: 'regDept',
        width: '7%',
        key: 'regDept',
        render: (value) => {
          return value.deptName;
        },
      }, {
        title: '挂号医生',
        width: '7%',
        dataIndex: 'regDoc',
        key: 'regDoc',
        render: (value) => {
          return value == null ? '' : value.name;
        },
      }, {
        title: '就诊类别',
        width: '7%',
        dataIndex: 'feeType',
        key: 'feeType',
        render: (value) => {
          return dicts.dis('FEE_TYPE', value);
        },
      }, {
        title: '复诊标志',
        width: '7%',
        dataIndex: 'reviewFlag',
        key: 'reviewFlag',
        render: (value) => {
          return value
            ? '复诊'
            : '初诊';
        },
      }, {
        title: '急诊标志',
        width: '7%',
        dataIndex: 'emergencyFlag',
        key: 'emergencyFlag',
        render: (value) => {
          return value
            ? '急诊'
            : '非急诊';
        },
      }, {
        title: '状态',
        width: '7%',
        dataIndex: 'regState',
        key: 'regState',
        render: (value) => {
          return dicts.dis('REG_STATE', value);
        },
      },
    ];

    return (
      <div>
        <CommonTable
          bordered
          rowSelection={false}
          data={data}
          page={page}
          columns={columns}
          pagination={false}
          scroll={{ y: (wsHeight - 47 - 33 - 62 - 2) }}
        />
      </div>
    );
  }
}
export default RegReportList;
