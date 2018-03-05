import React from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Modal } from 'antd';
import CommonTable from '../../../components/CommonTable';
import RowDelBtn from '../../../components/TableRowDeleteButton';

class PatientStoreRecordList extends React.Component {

  constructor(props) {
    super(props);
    this.onDelete = this.onDelete.bind(this);
  }

  onPageChange(page) {
    this.props.dispatch({ type: 'patientStoreExec/loadDetail', payload: { page } });
  }

  onDelete(record) {
    console.log(record);
    this.props.dispatch({
      type: 'patientStoreExec/delete',
      record,
    });
  }

  onCancel() {
    this.props.dispatch({
      type: 'patientStoreExec/setState',
      payload: { visible: false },
    });
    this.props.dispatch({
      type: 'patientStoreExec/load',
    });
  }

  render() {
    const { detailPage, detailData, visible } = this.props.patientStoreExec;
    const { user } = this.props.base;
    const today = moment().format('YYYY-MM-DD');
    const name = user.name;
    const columns = [
      { title: '项目名称', dataIndex: 'itemName', key: 'itemName' },
      { title: '规格', dataIndex: 'specs', key: 'specs' },
      { title: '单位', dataIndex: 'unit', key: 'unit' },
      { title: '单价', dataIndex: 'unitPrice', key: 'unitPrice', render: text => (text ? text.formatMoney(4) : '0.0000'), className: 'text-align-right' },
      { title: '数量', dataIndex: 'qty', key: 'qty' },
      { title: '费用', dataIndex: 'useQty', key: 'useQty',
        render: (text, record) => {
          return (record.unitPrice * record.qty).formatMoney(2);
        },
      },
      { title: '执行人', dataIndex: 'execOper', key: 'execOper' },
      { title: '执行时间', dataIndex: 'createTime', key: 'createTime', render: text => (text ? moment(text).format('YYYY-MM-DD') : '') },
      { title: '操作',
        key: 'action',
        width: 90,
        className: 'text-align-center',
        render: (text, record) => {
          if (record.execOper === name && today === moment(record.createTime).format('YYYY-MM-DD')) {
            return <span><RowDelBtn onOk={() => this.onDelete(record)} disabled /></span>;
          }
        },
      }];
    return (
      <Modal
        title="执行带明细" visible={visible}
        footer={null}
        width={'75%'}
        height={'60%'}
        onCancel={this.onCancel.bind(this)}
      >
        <div>
          <CommonTable
            data={detailData} page={detailPage} columns={columns}
            onPageChange={this.onPageChange.bind(this)}
            bordered
          />
        </div>
      </Modal>
    );
  }
}
export default connect(({ patientStoreExec, base, utils }) => ({ patientStoreExec, base, utils }))(PatientStoreRecordList);
