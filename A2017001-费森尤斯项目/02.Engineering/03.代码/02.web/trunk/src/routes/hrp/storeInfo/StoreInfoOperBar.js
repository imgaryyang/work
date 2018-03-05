import React, { Component } from 'react';
import moment from 'moment';
import { Row, Col, Form, Input, Button, DatePicker, notification } from 'antd';
import DeptSelect from '../../../components/DeptSelect';
import AsyncTreeCascader from '../../../components/AsyncTreeCascader';

const FormItem = Form.Item;

class StoreInfoSearchBar extends Component {
  onSave() {
    if (this.props.updateRow.length <= 0) {
      notification.info({
        message: '提示',
        description: '没有改动，无需保存！',
      });
    } else {
      this.props.dispatch({ type: 'instrmStoreInfo/save' });
    }
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.resetPage();
        this.props.setSearchObjs(values);
        if (typeof values.instrmType === 'undefined' ) {
          values.instrmType = '';
        } else if (typeof values.instrmType  !== 'undefined' &&  values.instrmType.length ===0 ){
          values.instrmType = '';
        }
        this.props.onSearch(values);
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
      this.props.setSearchObjs({ deptId:'' });
    } else {
      this.props.setSearchObjs({ deptId:values });
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
                {getFieldDecorator('instrmType')(<AsyncTreeCascader dictType="ASSETS_TYPE" placeholder="资产类别" />)}
              </FormItem>
              <FormItem>
                {getFieldDecorator('tradeName', {
                  rules: [{ max: 50, message: '查询码不能超过50个字符' }],
                })(<Input placeholder="固资名称/拼音/五笔/编码/条码" style={{ width: '180px' }} maxLength={50} onPressEnter={this.handleSubmit.bind(this)} />)}
              </FormItem>
              <FormItem>
                {getFieldDecorator('deptId')(<DeptSelect showSearch style={{ width: '120px' }} placeholder="科室" onChange={this.change.bind(this)} allowClear />)}
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
