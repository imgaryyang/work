import React from 'react';
import moment from 'moment';
import { connect } from 'dva';
import CommonTable from '../../../components/CommonTable';

class PatStoreRecordDetail extends React.Component {

  constructor(props) {
    super(props);
    this.onDelete = this.onDelete.bind(this);
  }

  onPageChange(page) {
    this.props.dispatch({ type: 'patientStoreExec/loadDetail', payload: { page } });
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
      payload: { visible: false },
    });
    this.props.dispatch({
      type: 'patientStoreExec/load',
    });
  }

  render() {
    const { recordDetail } = this.props.patientStoreExec;
    const { wsHeight } = this.props.base;
    const columns = [
      { title: '项目名称', dataIndex: 'itemName', key: 'itemName', width: '200px' },
      { title: '规格', dataIndex: 'specs', key: 'specs', width: '80px' },
      { title: '单位', dataIndex: 'unit', key: 'unit', width: '80px' },
      { title: '单价', dataIndex: 'unitPrice', width: '100px', key: 'unitPrice', render: text => (text ? text.formatMoney(4) : '0.0000'), className: 'text-align-right' },
      { title: '数量', dataIndex: 'qty', key: 'qty', width: '50px' },
      {
        title: '金额',
        dataIndex: 'useQty',
        key: 'useQty',
        width: '100px',
        render: (text, record) => {
          return (record.unitPrice * record.qty).formatMoney(2);
        },
      },
      { title: '批号', dataIndex: 'approvalNo', key: 'approvalNo', width: '100px' },
      /* { title: '条码', dataIndex: 'barcode', key: 'barcode', width: '100px' },*/
      { title: '执行人', dataIndex: 'createOper', key: 'createOper', width: '100px' },
      { title: '执行时间', dataIndex: 'createTime', width: '120px', key: 'createTime', render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm') : '') },
    ];
    return (
      <div style={{ marginTop: '5px' }}>
        <CommonTable
          data={recordDetail}
          columns={columns}
          bordered
          rowSelection={false}
          scroll={{ y: '100px' }}
          pagination={false}
        />
      </div>
    );
  }
}
export default connect(({ patientStoreExec, base, utils }) => ({ patientStoreExec, base, utils }))(PatStoreRecordDetail);
