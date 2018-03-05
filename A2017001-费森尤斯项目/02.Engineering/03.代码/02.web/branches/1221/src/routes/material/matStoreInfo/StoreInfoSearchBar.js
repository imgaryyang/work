import React, { Component } from 'react';
import moment from 'moment';
import { Modal,Row, Col, Form, Input, Button, DatePicker } from 'antd';
import DictSelect from '../../../components/DictSelect';
import DeptSelect from '../../../components/DeptSelect';

const FormItem = Form.Item;

class StoreInfoSearchBar extends Component {
  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.resetPage();
        this.props.setSearchObjs(values);
        this.props.onSearch(this.props.searchObjs);
      }
    });
  }
  handlePrint() {
    const { searchObjs } = this.props;
    Modal.confirm({
      content: '确定要打印库存单吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        this.props.dispatch({
          type: 'print/getPrintInfo',
          payload: { code: '111', bizId: searchObjs.deptId },
        });
      },
    });
  }
  handleReset() {
    this.props.form.resetFields();
    this.props.setSearchObjs(null);
    this.props.onSearch();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { activeKey, searchObjs } = this.props;
    return (
      <div className="action-form-wrapper" style={{ marginBottom: '10px' }} >
        <Row type="flex" justify="left">
          <Col>
            <Form inline>
              <FormItem>
                {getFieldDecorator('materialType')(<DictSelect showSearch style={{ width: '180px' }} columnName="MATERIAL_TYPE" placeholder="物资类别" />)}
              </FormItem>
              <FormItem>
                {getFieldDecorator('tradeName', {
                  rules: [{ max: 50, message: '查询码不能超过50个字符' }],
                })(<Input placeholder="物资名称/拼音/五笔/编码/条码" style={{ width: '180px' }} maxLength={50} onPressEnter={this.handleSubmit.bind(this)} />)}
              </FormItem>
              { activeKey === '1' ? null : (
                <FormItem>
                  {getFieldDecorator('validDate', { initialValue: searchObjs.validDate ? moment(searchObjs.validDate, 'YYYY-MM-DD') : null })(<DatePicker style={{ width: '100px' }} format="YYYY-MM-DD" placeholder="有效期" />)}
                </FormItem>
                )
              }
              <FormItem>
                {getFieldDecorator('deptId')(<DeptSelect showSearch style={{ width: '180px' }} deptType={['001', '010']} placeholder="库房" />)}
              </FormItem>
              <FormItem>
                <Button type="primary" icon="search" onClick={this.handleSubmit.bind(this)}>查询</Button>
              </FormItem>
              <FormItem>
                <Button type="primary" icon="printer" onClick={this.handlePrint.bind(this)}>打印</Button>
              </FormItem>
              <FormItem>
                <Button size="large" icon="reload" onClick={this.handleReset.bind(this)}>清空</Button>
              </FormItem>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Form.create({
  onValuesChange(props, values) {
    props.setSearchObjs(values);
  },
})(StoreInfoSearchBar);
