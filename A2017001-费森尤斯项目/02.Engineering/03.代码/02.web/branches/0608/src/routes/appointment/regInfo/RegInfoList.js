import React, { Component } from 'react';
import moment from 'moment';
import { Button, Icon, Badge } from 'antd';
import CommonTable from '../../../components/CommonTable';

class RegInfoList extends Component {

  onEdit(record) {
    this.props.dispatch({
      type: 'regInfo/setState',
      payload: { record },
    });
  }

  onCancel(record) {
    this.props.dispatch({ type: 'regInfo/toggleVisible' });
    this.props.dispatch({
      type: 'regInfo/getCancelInfo',
      payload: { id: record.id },
    });
  }

  onDelete(record) {
    this.props.dispatch({ type: 'regInfo/delete', id: record.id });
  }

  onSearch(values) {
    this.props.dispatch({
      type: 'regInfo/load',
      payload: { values },
    });
  }

  onPageChange(page) {
    this.props.dispatch({
      type: 'regInfo/load',
      payload: { page },
    });
  }

  rowSelectChange(selectedRowKeys) {
    this.props.dispatch({
      type: 'regInfo/setState',
      payload: { selectedRowKeys },
    });
  }

  render() {
    const { page, data, dicts, wsHeight } = this.props;

    const opearations = (record) => {
      return (
        record.regState === '21'
        ?
          <div>
            <Button type="danger" onClick={this.onCancel.bind(this, record)}>
              <Icon type="rollback" />退号
            </Button>
          </div>
        :
          ''
      );
    };

    const columns = [
      {
        title: '就诊流水号',
        dataIndex: 'regId',
        width: '9%',
        key: 'regId',
      }, {
        title: '发票号',
        dataIndex: 'invoiceNo',
        width: '9%',
        key: 'invoiceNo',
      }, {
        title: '就诊卡号',
        dataIndex: 'patient.medicalCardNo',
        width: '9%',
        key: 'patient.medicalCardNo',
      }, {
        title: '姓名',
        width: '7%',
        dataIndex: 'patient.name',
        key: 'patient.name',
      }, {
        title: '性别',
        width: '6%',
        dataIndex: 'patient.sex',
        key: 'patient.sex',
        render: (value) => {
          return dicts.dis('SEX', value);
        },
      }, {
        title: '年龄',
        width: '6%',
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
          const name = dicts.dis('REG_STATE', value);
          let displayName = '';
          if (value === '12') {
            displayName = (
              <span><Badge status="success" />{name}</span>
            );
          } else {
            displayName = name;
          }
          return displayName;
        },
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          opearations(record)
        ),
      },
    ];
    return (
      <div>
        <CommonTable
          data={data}
          page={page}
          rowSelection={false}
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
export default RegInfoList;
