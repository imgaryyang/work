import React, { Component } from 'react';
import moment from 'moment';
import { Row, Col, Form, Input, Button, DatePicker, notification } from 'antd';
import DictSelect from '../../../components/DictSelect';
import DeptSelect from '../../../components/DeptSelect';

const FormItem = Form.Item;

class StoreInfoSearchBar extends Component {
  onSave() {
    if (this.props.updateRow.length <= 0) {
      notification.info({
        message: '提示',
        description: '没有改动，无需保存！',
      });
    } else {
      this.props.dispatch({ type: 'matStoreInfo/save' });
    }
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.resetPage();
        this.props.setSearchObjs(values);
        this.props.onSearch(this.props.searchObjs);
      }
    });
  }

  handleReset() {
    this.props.form.resetFields();
    this.props.setSearchObjs(null);
    this.props.onSearch();
  }
  change(values) {
    if (typeof values === 'undefined') {
      this.props.setSearchObjs({ materialType: '' });
    } else {
      this.props.setSearchObjs({ materialType: values });
    }
  }
  changeDept(values) {
    if (typeof values === 'undefined') {
      this.props.setSearchObjs({ deptId: '' });
    } else {
      this.props.setSearchObjs({ deptId: values });
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { activeKey, searchObjs } = this.props;
    return (
      <div className="action-form-wrapper" style={{ marginBottom: '10px' }} >
        <Row type="flex" justify="left">
          <Col span={20}>
            <Form inline>
              <FormItem>
                {getFieldDecorator('materialType')(<DictSelect showSearch style={{ width: '180px' }} columnName="MATERIAL_TYPE" placeholder="物资类别" onChange={this.change.bind(this)} />)}
              </FormItem>
              <FormItem>
                {getFieldDecorator('tradeName', {
                  rules: [{ max: 50, message: '查询码不能超过50个字符' }],
                })(<Input placeholder="物资名称/拼音/五笔/编码/条码" style={{ width: '180px' }} maxLength={50}  onPressEnter={this.handleSubmit.bind(this)}/>)}
              </FormItem>
              { activeKey === '1' ? null : (
                <FormItem>
                  {getFieldDecorator('validDate', { initialValue: searchObjs.validDate ? moment(searchObjs.validDate, 'YYYY-MM-DD') : null })(<DatePicker style={{ width: '100px' }} format="YYYY-MM-DD" placeholder="有效期" />)}
                </FormItem>
                )
              }
              <FormItem>
                {getFieldDecorator('deptId')(<DeptSelect showSearch style={{ width: '180px' }} deptType={['010', '001']} placeholder="库房" onChange={this.changeDept.bind(this)} />)}
              </FormItem>
              <FormItem>
                <Button type="primary" icon="search" onClick={this.handleSubmit.bind(this)}>查询</Button>
              </FormItem>
              <FormItem>
                <Button size="large" icon="reload" onClick={this.handleReset.bind(this)}>清空</Button>
              </FormItem>
            </Form>
          </Col>
          <Col span={4} style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={this.onSave.bind(this)} style={{ marginRight: '10px' }} icon="save" size="large" >保存</Button>
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
