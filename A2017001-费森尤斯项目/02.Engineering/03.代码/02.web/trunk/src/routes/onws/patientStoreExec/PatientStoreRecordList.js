import React from 'react';
import moment from 'moment';
import { connect } from 'dva';
import CommonTable from '../../../components/CommonTable';
import RowDelBtn from '../../../components/TableRowDeleteButton';

class PatientStoreRecordList extends React.Component {

  constructor(props) {
    super(props);
    this.onDelete = this.onDelete.bind(this);
  }

  onRowClick(record) {
    this.props.dispatch({ type: 'patientStoreExec/loadRecordDetail', payload: { record } });
  }

  onDelete(record) {
    this.props.dispatch({
      type: 'patientStoreExec/delete',
      record,
    });
  }

  onCancel() {
    this.props.dispatch({
      type: 'patientStoreExec/setState',
      payload: { visible: '' },
    });
    this.props.dispatch({
      type: 'patientStoreExec/load',
    });
  }

  render() {
    const { recordData } = this.props.patientStoreExec;
    const { user } = this.props.base;
    const today = moment().format('YYYY-MM-DD');
    const name = user.name;
    const columns = [
      { title: '项目名称', dataIndex: 'itemName', key: 'itemName', width: '200px' },
      { title: '单位', dataIndex: 'unit', key: 'unit', width: '80px' },
      { title: '单价', dataIndex: 'unitPrice', width: '100px', key: 'unitPrice', render: text => (text ? text.formatMoney(4) : '0.0000'), className: 'text-align-right' },
      { title: '数量', dataIndex: 'qty', key: 'qty', width: '80px' },
      {
        title: '金额',
        width: '120px',
        dataIndex: 'useQty',
        key: 'useQty',
        render: (text, record) => {
          return (record.unitPrice * record.qty).formatMoney(2);
        },
      },
      { title: '执行人', dataIndex: 'execOper', key: 'execOper', width: '100px' },
      { title: '执行时间', dataIndex: 'createTime', key: 'createTime', render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm') : ''), width: '150px' },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        width: '275px',
        render: (text, record) => {
          if (text === '1') {
            return '已确认';
          } else {
            return (
              <div>
              已作废<br />
                {`操作人：${record.cancelOper} (操作时间: ${record.cancelTime})`}
              </div>
            );
          }
        },
      },
      { title: '操作',
        key: 'action',
        width: '120px',
        className: 'text-align-center',
        render: (text, record) => {
          if (record.execOper === name && today === moment(record.createTime).format('YYYY-MM-DD') && record.state === '1') {
            return <span><RowDelBtn onOk={() => this.onDelete(record)} disabled /></span>;
          }
        },
      }];
    return (
      <div>
        <CommonTable
          data={recordData} columns={columns}
          bordered
          pagination={false}
          onRowClick={this.onRowClick.bind(this)}
          scroll={{ y: '200px' }}
          rowSelection={false}
        />
      </div>
    );
  }
}
export default connect(({ patientStoreExec, base, utils }) => ({ patientStoreExec, base, utils }))(PatientStoreRecordList);
