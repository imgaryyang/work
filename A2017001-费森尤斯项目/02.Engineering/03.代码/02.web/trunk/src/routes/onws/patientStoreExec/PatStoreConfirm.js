import React from 'react';
import { connect } from 'dva';
import { Modal, Row, Col, Card, Button, Form, Input, InputNumber, Icon } from 'antd';
import { testInt } from '../../../utils/validation';
import EditTable from '../../../components/editTable/EditTable';
import CommonItemSearchInput from '../../../components/searchInput/CommonItemSearchInput';

const FormItem = Form.Item;

class PatStoreConfirm extends React.Component {

  constructor(props) {
    super(props);
    this.onSave = this.onSave.bind(this);
    this.onAdd = this.onAdd.bind(this);
  }

  state = {
    item: '',
    dataList: [],
    record: '',
  }
  onPageChange(page) {
    this.props.dispatch({ type: 'patientStoreExec/loadDetail', payload: { page } });
  }

  onDelete(record, e) {
    this.props.dispatch({
      type: 'patientStoreExec/deleteDetail',
      record,
    });
  }

  onCancel() {
    this.props.dispatch({
      type: 'patientStoreExec/setState',
      payload: { visible: '' },
    });
  }
  onSave() {
    this.props.dispatch({
      type: 'patientStoreExec/saveDetail',
      payload: { visible: '' },
    });
  }
  onAdd() {
    let dataList = this.state.dataList;
    const item = this.state.item;
    const record = this.state.record;
    if (item !== '') {
      item.hosId = record.hosId;
      item.patientId = record.patient.id;
      item.regId = record.regId;
      item.name = record.patient.name;
      item.itemCode = item.id;
      item.specs = item.itemSpecs;
      item.unit = item.itemUnit;
      item.unitPrice = item.salePrice;
      if (item.amount && item.amount !== 0) {
        item.qty = item.amount;
      } else {
        item.qty = 1;
      }
      item.recipeId = record.recipeId;
      item.recipeNo = record.recipeNo;
      item.dosage = '';

      dataList = dataList.concat(item);
    }
    this.state.dataList = dataList;
    this.props.dispatch({
      type: 'patientStoreExec/setState',
      payload: { confirmData: dataList },
    });
    this.state.item = '';
    this.props.form.setFieldsValue({
      approvalNo: '',
      barcode: '',
      amount: 1,
      itemName: '',
    });
  }

  onSelectCommonItem(record) {
    this.state.item = record;
  }

  updateApprovalNo(record) {
    const item = this.state.item;
    this.state.item = { ...item, ...{ approvalNo: record.target.value } };
  }

  updateAmount(record) {
    const item = this.state.item;
    this.state.item = { ...item, ...{ amount: record } };
  }

  updateBarcode(record) {
    const item = this.state.item;
    this.state.item = { ...item, ...{ barcode: record.target.value } };
  }

  refreshTable() {
    const dataList = this.props.patientStoreExec.confirmData;
    if (dataList && dataList.length > 0) {
      let newData = [];
      for (const tmp of dataList) {
        /*
        动态计算金额
         */
        if (tmp.qty != null && tmp.qty !== 0 && tmp.unitPrice != null && tmp.unitPrice !== 0) {
          tmp.totalMoney = tmp.unitPrice * tmp.qty;
        }
        newData.push(tmp);
      }

      this.props.dispatch({
        type: 'patientStoreExec/setState',
        payload: { confirmData: newData },
      });
    }
  }
  render() {
    const { confirmData, visible, record, approvalNo } = this.props.patientStoreExec;
    let map = {};
    for (const key in approvalNo) {
      const t = key;
      const op = [];
      if (approvalNo[key].length > 0) {
        for (const v of approvalNo[key]) {
          op.push(<Option value={v}>{v}</Option>);
        }
      }
      const tmp = {};
      tmp[t] = op;
      map = { ...map, ...tmp };
    }
    const { getFieldDecorator } = this.props.form;
    const tmpItem = this.state.item;
    this.state.dataList = confirmData;

    this.state.record = record;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      style: { width: '100%' },
    };
    const columns = [
      { title: '项目名称', dataIndex: 'itemName', key: 'itemName', width: '200px' },
      { title: '规格', dataIndex: 'specs', key: 'specs', width: '120px' },
      { title: '单位', dataIndex: 'unit', key: 'unit', width: '50px' },
      { title: '单价', dataIndex: 'unitPrice', key: 'unitPrice', width: '100px', render: text => (text ? text.formatMoney(4) : '0.0000'), className: 'text-align-right' },
      {
        title: '数量',
        dataIndex: 'qty',
        key: 'qty',
        editable: true,
        width: '120px',
        editorConfig: { verfy: (v) => { return testInt(v); } },
        addonAfter: (text, record) => {
          return record.unit;
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
        editor: 'CustomSelect',
        width: '180px',
        className: 'text-align-center',
        editorConfig: {
          option: map,
        },
        editable: true,
      },
      /* { title: '条码', dataIndex: 'barcode', key: 'barcode', editable: true, width: '180px' },*/
      {
        title: '操作',
        key: 'action',
        width: 90,
        className: 'text-align-center',
        render: (text, record) => (
          <span>
            <Icon type="delete" className="tableDeleteIcon" onClick={this.onDelete.bind(this, record)} />
          </span>
        ),
      }];
    return (
      <Modal
        title="执行确认" visible={visible === '1'}
        footer={null}
        width={'85%'}
        height={'475px'}
        onCancel={this.onCancel.bind(this)}
      >
        <Card style={{ height: '450px' }}>
          <div>
            <Form inline style={{ width: '100%' }} >
              <Row style={{ marginBottom: '3px' }}>
                <Col span={4} >
                  <FormItem label="名称" {...formItemLayout} >
                    { getFieldDecorator('itemName', { initialValue: tmpItem ? tmpItem.itemName : '' })(
                      <CommonItemSearchInput
                        onSelect={this.onSelectCommonItem.bind(this)}
                        drugFlag="3"
                        style={{ width: '100%' }}
                      />,
                    )}
                  </FormItem>
                </Col>
                <Col span={3} >
                  <FormItem label="规格" {...formItemLayout} >
                    { getFieldDecorator('itemSpecs', { initialValue: tmpItem ? tmpItem.itemSpecs : '' })(
                      <Input disabled />,
                    )}
                  </FormItem>
                </Col>
                <Col span={2} >
                  <FormItem label="单位" {...formItemLayout} >
                    { getFieldDecorator('itemUnit', { initialValue: tmpItem ? tmpItem.itemUnit : '' })(
                      <Input disabled />,
                    )}
                  </FormItem>
                </Col>
                <Col span={2} >
                  <FormItem label="单价" {...formItemLayout} >
                    { getFieldDecorator('salePrice', { initialValue: tmpItem ? tmpItem.salePrice : '' })(
                      <Input disabled />,
                    )}
                  </FormItem>
                </Col>
                <Col span={3} >
                  <FormItem label="数量" {...formItemLayout} >
                    { getFieldDecorator('amount', { initialValue: '1' })(
                      <InputNumber style={{ width: '100%' }} onChange={this.updateAmount.bind(this)} />,
                    )}
                  </FormItem>
                </Col>
                <Col span={3}>
                  <FormItem label="批号" {...formItemLayout} >
                    { getFieldDecorator('approvalNo')(
                      <Input style={{ width: '95%' }} onChange={this.updateApprovalNo.bind(this)} />,
                    )}
                  </FormItem>
                </Col>
                <Col span={2}>
                  <Button type="primary" size="large" onClick={() => this.onAdd()} icon="plus" >添加</Button>
                </Col>
                <Col span={2}>
                  <Button type="primary" size="large" onClick={() => this.onSave()} icon="save" >保存</Button>
                </Col>
              </Row>
              <EditTable
                data={confirmData} columns={columns}
                bordered
                pagination={false}
                onChange={this.refreshTable.bind(this)}
              />
            </Form>
          </div>
        </Card>
      </Modal>
    );
  }
}
const editorForm = Form.create()(PatStoreConfirm);
export default connect(({ patientStoreExec, base, utils }) => ({ patientStoreExec, base, utils }))(editorForm);
