import React, { Component } from 'react';
import { Row, Col, Form, Input, Button } from 'antd';
import DeptSelect from '../../../components/DeptSelect';
import AsyncTreeCascader from '../../../components/AsyncTreeCascader';

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

  handleReset() {
    this.props.form.resetFields();
    this.props.setSearchObjs(null);
    this.props.onSearch();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="action-form-wrapper" style={{ marginBottom: '10px' }} >
        <Row type="flex" justify="left">
          <Col>
            <Form inline>
              <FormItem>
                {getFieldDecorator('instrmType')(<AsyncTreeCascader dictType="ASSETS_TYPE" placeholder="资产类别" />)}
              </FormItem>
              <FormItem>
                {getFieldDecorator('tradeName', {
                  rules: [{ max: 50, message: '查询码不能超过50个字符' }],
                })(<Input placeholder="名称/拼音/五笔/编码" maxLength={50} />)}
              </FormItem>
              <FormItem>
                {getFieldDecorator('deptId')(<DeptSelect showSearch style={{ width: '120px' }} placeholder="科室" />)}
              </FormItem>
              <FormItem>
                <Button type="primary" icon="search" onClick={this.handleSubmit.bind(this)}>查询</Button>
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
