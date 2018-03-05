import React, { Component } from 'react';
import { connect } from 'dva';
import { Icon, Modal, Form, Input, Popconfirm } from 'antd';
import CommonTable from '../../../components/CommonTable';

const FormItem = Form.Item;
class PricChargeList extends Component {

  onDelete(record) {
    this.props.dispatch({
      type: 'outpatientCharge/deleteItem',
      record,
    });
  }

  reset() {
    this.props.form.resetFields();
  }

  closeTemplate() {
    this.props.dispatch({
      type: 'outpatientCharge/setState',
      payload: { record: '1' },
    });
  }
  rememberTemplateName(e) {
    const value = e.target.value;
    this.props.dispatch({
      type: 'outpatientCharge/setState',
      payload: { templateName: value },
    });
  }

  handleOk() {
    this.props.dispatch({
      type: 'outpatientCharge/saveItemToTemplate',
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { itemData, record } = this.props.outpatientCharge;
    const { depts } = this.props.utils;
    const { innerHeight } = this.props;
    const visible2 = record !== null && record.indexOf('2') >= 0;

    const listColumns = [
      {
        title: '处方号',
        dataIndex: 'recipeId',
        key: '2',
        width: 110,
      },
      {
        title: '项目名称',
        dataIndex: 'itemName',
        key: 'itemName',
        width: 270,
        render: (text, item) => {
          return (
            <div>
              {text} {`(${item.itemSpecs || '-'})`}
            </div>
          );
        },
      },
      /* { title: '规格',
        dataIndex: 'itemSpecs',
        key: 'drugSpecs',
      },*/
      /* {
        title: '单位',
        dataIndex: 'itemUnit',
        key: 'doseUnit',
      },*/
      {
        title: '单价',
        dataIndex: 'salePrice',
        key: 'salePrice',
        className: 'text-align-right',
        width: 90,
        render: (value) => {
          return value ? value.formatMoney(4) : '';
        },
      },
      {
        title: '数量',
        dataIndex: 'amount',
        key: 'amount',
        width: 80,
        className: 'text-align-right',
        render: (text, item) => {
          return (
            <div>
              {text} {item.itemUnit}
            </div>
          );
        },
      },
      {
        title: '金额',
        dataIndex: 'money',
        key: 'money',
        className: 'text-align-right',
        width: 90,
        render: (value, item) => {
          return item.salePrice && item.amount ? (item.salePrice * item.amount).formatMoney(2) : '0.00';
        },
      },
      {
        title: '执行科室',
        dataIndex: 'exeDept',
        key: 'deptId',
        width: 90,
        render: (value) => {
          return depts.disDeptName(this.props.utils.deptsIdx, value);
        },
      },
      {
        title: '操作',
        key: 'action',
        width: 70,
        className: 'text-align-center',
        render: (text, item) => (
          <span>
            <Popconfirm placement="left" title={'您确定要删除此项么?'} cancelText={'否'} okText={'是'} onConfirm={this.onDelete.bind(this, item)}>
              <Icon type="delete" className="tableDeleteIcon" />
            </Popconfirm>
          </span>
        ),
      },
    ];
    return (
      <div>
        <Modal
          width={300}
          title="模板保存"
          visible={visible2}
          closable
          onOk={this.handleOk.bind(this)}
          maskClosable={false}
          onCancel={this.closeTemplate.bind(this)}
        >
          <Form inline>
            <FormItem label="模板名称" >
              {
                getFieldDecorator('templateName',
                  { initialValue: '', rules: [{ required: true, message: '模板名称不能为空' }] })(<Input style={{ width: '150px' }} onBlur={this.rememberTemplateName.bind(this)} />)}
            </FormItem>
          </Form>
        </Modal>

        <CommonTable
          data={itemData}
          columns={listColumns}
          bordered
          pagination={false}
          className="compact-table"
          scroll={{
            y: (innerHeight - 35),
          }}
        />
      </div>
    );
  }
}
const editorForm = Form.create()(PricChargeList);
export default connect(
  ({ utils, outpatientCharge, base }) => ({ utils, outpatientCharge, base }))(editorForm);
