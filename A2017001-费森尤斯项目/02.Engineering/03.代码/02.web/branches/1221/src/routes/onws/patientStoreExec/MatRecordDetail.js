import React from 'react';
import { connect } from 'dva';
import { Modal, Card, Button, Form, Icon, Select } from 'antd';
import { testInt } from '../../../utils/validation';
import EditTable from '../../../components/editTable/EditTable';

const Option = Select.Option;

class MatRecordDetail extends React.Component {

  constructor(props) {
    super(props);
    this.onSave = this.onSave.bind(this);
  }

  state = {
    approvalNo: '',
    item: '',
    dataList: [],
    record: '',
  }

  onCancel() {
    this.props.dispatch({
      type: 'patientStoreExec/setState',
      payload: { visible: '' },
    });
  }
  onSave(record) {
    record.approvalNo = this.state.approvalNo;
    this.props.dispatch({
      type: 'patientStoreExec/save',
      payload: { record },
    });
  }

  handleChange(record) {
    this.state.approvalNo = record;
  }

  render() {
    const { matData, visible, matRecord, approvalNo } = this.props.patientStoreExec;
    let map = {};
    let op = [];
    for (const key in approvalNo) {
      const t = key;
      if (approvalNo[key].length > 0) {
        for (const v of approvalNo[key]) {
          op.push(<Option value={v}>{v}</Option>);
        }
      }
      const tmp = {};
      tmp[t] = op;
      map = { ...map, ...tmp };
    }
    this.state.dataList = matData;

    this.state.record = matRecord;
    const columns = [
      { title: '项目名称', dataIndex: 'itemInfo.itemName', key: 'itemName', width: '200px' },
      { title: '规格', dataIndex: 'itemInfo.specs', key: 'specs', width: '120px' },
      { title: '单位', dataIndex: 'itemInfo.unit', key: 'unit', width: '50px' },
      { title: '单价', dataIndex: 'itemInfo.unitPrice', key: 'unitPrice', width: '100px', render: text => (text ? text.formatMoney(4) : '0.0000'), className: 'text-align-right' },
      {
        title: '数量',
        dataIndex: 'qty',
        key: 'qty',
        width: '120px',
        render: (text, record) => {
          return 1;
        },
      },
      {
        title: '金额',
        dataIndex: 'totalMoney',
        key: 'totalMoney',
        width: '100px',
        render: text => (text ? text.formatMoney(2) : '0.00'),
      },
      { title: '批号',
        dataIndex: 'approvalNo',
        key: 'approvalNo',
        width: '180px',
        className: 'text-align-center',
        render: (text, record) => (
          <Select defaultValue="" style={{ width: 120 }} onChange={this.handleChange.bind(this)}>
            {op}
          </Select>
        ),
      },
      /* { title: '条码', dataIndex: 'barcode', key: 'barcode', editable: true, width: '180px' },*/
      {
        title: '操作',
        key: 'action',
        width: 90,
        className: 'text-align-center',
        render: (text, record) => {
          return <Button onClick={this.onSave.bind(this, record)} disabled={record.useQty === record.qty} style={{ width: '70px' }} ><Icon type="save" />确认</Button>;
        },
      }];
    return (
      <Modal
        title="执行确认" visible={visible === '4'}
        footer={null}
        width={'85%'}
        height={'475px'}
        onCancel={this.onCancel.bind(this)}
      >
        <Card style={{ height: '450px' }}>
          <EditTable
            data={matData} columns={columns}
            bordered
            pagination={false}
          />
        </Card>
      </Modal>
    );
  }
}
const editorForm = Form.create()(MatRecordDetail);
export default connect(({ patientStoreExec, base, utils }) => ({ patientStoreExec, base, utils }))(editorForm);
