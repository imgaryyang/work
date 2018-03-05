import React, { Component } from 'react';
import { Icon, Modal, Form, Input, Card, Popconfirm } from 'antd';
import { connect } from 'dva';
import { isMatch, isObject } from 'lodash';
import CommonTable from '../../../components/CommonTable';

const FormItem = Form.Item;

class PricChargeList extends Component {

  constructor(props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
    this.close = this.close.bind(this);
    this.reset = this.reset.bind(this);
  }

  state = {
    medicalCardRequired: true,
    checked: false,
    disabled: false,
    inputValue: '',
  };

  onSelectCommonItem(record) {
    this.props.dispatch({
      type: 'pricCharge/tmpItem',
      addData: record,
    });
  }

  onChangeAmount(e) {
    this.props.dispatch({
      type: 'pricCharge/updateItem',
      update: { amount: e.target.value },
    });
  }

  onDelete(record) {
    this.props.dispatch({
      type: 'pricCharge/deleteItem',
      record,
    });
  }

  onClickDept(amount) {
    this.props.dispatch({
      type: 'pricCharge/addCharge',
      update: { exeDept: amount },
    });
  }

  handleChange(value) {
    if (!isObject(value)) {
      this.props.dispatch({
        type: 'pricCharge/loadOptions',
        spellCode: value,
      });
    }
  }
  randomRecipe() {
    this.props.dispatch({
      type: 'pricCharge/getRecipeId',
    });
  }

  reset() {
    this.props.form.resetFields();
  }

  handleCancel() {
    const values = this.props.form.getFieldsValue();
    const record = this.props.record;
    // 如果匹配则无变化，反之有变化。
    const changed = !isMatch(record, values);
    if (changed) {
      Modal.confirm({
        title: '确认',
        content: '放弃保存您的修改？',
        okText: '放弃',
        cancelText: '我再看看',
        onOk: () => {
          this.close();
        },
      });
    } else {
      this.close();
    }
  }

  saveTemplate() {
    this.props.dispatch({
      type: 'pricCharge/setState',
      payload: { record: '1,2' },
    });
  }

  close() {
    this.props.dispatch({
      type: 'pricCharge/setState',
      payload: { record: null },
    });
  }
  closeTemplate() {
    this.props.dispatch({
      type: 'pricCharge/setState',
      payload: { record: '1' },
    });
  }
  rememberTemplateName(e) {
    const value = e.target.value;
    this.props.dispatch({
      type: 'pricCharge/setState',
      payload: { templateName: value },
    });
  }

  handleOk() {
    this.props.dispatch({
      type: 'pricCharge/saveItemToTemplate',
    });
  }

  saveCharge() {
    this.props.dispatch({
      type: 'pricCharge/saveCharge',
    });
  }
  readMedicalCardDone(info) {
    this.props.form.resetFields(['medicalCardNo']);
    this.props.dispatch({
      type: 'pricCharge/getCurrentRegId',
      medicalCardNo: info.medicalCardNo,
    });
    this.props.dispatch({
      type: 'pricCharge/setState',
      payload: {
        userInfo: { ...this.props.userInfo, ...info },
      },
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { itemData, record } = this.props.pricCharge;
    const { depts } = this.props.utils;
    const visible2 = record !== null && record.indexOf('2') >= 0;

    const listColumns = [
      {
        title: '处方号',
        dataIndex: 'recipeId',
        key: 'recipeId',
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
      },
      {
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
        render: (text, r) => (
          <span>
            <Icon type="delete" className="tableDeleteIcon" onClick={this.onDelete.bind(this, r)} />
          </span>
        ),
      },
    ];
    const { wsHeight } = this.props.base;
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
              { getFieldDecorator('templateName', { initialValue: '', rules: [{ required: true, message: '模板名称不能为空' }] })(<Input style={{ width: 150 }} onBlur={this.rememberTemplateName.bind(this)} />)}
            </FormItem>
          </Form>
        </Modal>
        <CommonTable
          data={itemData}
          columns={listColumns}
          pagination={false}
          bordered
          className="compact-table"
          scroll={{
            y: (wsHeight - 111 - 10 - 42 - 35),
          }}
        />
      </div>
    );
  }
}

const editorForm = Form.create()(PricChargeList);
export default connect(
  ({ pricCharge, utils, base }) => ({ pricCharge, utils, base }))(editorForm);
