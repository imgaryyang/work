import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Button } from 'antd';

import DeptSelect from '../../../components/DeptSelect';

const FormItem = Form.Item;

class matSearchBar extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = ::this.handleSubmit;
    this.doSearch = ::this.doSearch;
    this.onSelect = ::this.onSelect;
  }

  onSelect(value) {
    this.props.dispatch({
      type: 'instockPlanEdit/load',
      payload: { query: { deptId: value } },
    });
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (err) return;
      this.doSearch(values);
    });
  }

  doSearch(values) {
    if (typeof this.props.onSearch === 'function') { this.props.onSearch(values); }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { instockPlanEdit } = this.props;
    const { planData, fromDeptId } = instockPlanEdit;

    const formItemLayout = {
      labelCol: { span: 0 },
      wrapperCol: { span: 24 },
      style: { width: '100%', paddingRight: '5px', marginBottom: 0 },
    };

    let disabled = false;
    if (fromDeptId) {
      disabled = planData.length !== 0;
    }

    return (
      <Row style={{ marginBottom: '5px' }}>
        <Form >
          <Col span={9} >
            <FormItem {...formItemLayout} >
              {getFieldDecorator('deptId', {
                rules: [
                  {
                    required: true,
                    message: '库房不能为空',
                  },
                ],
              })(
                <DeptSelect
                  showSearch
                  placeholder="库房"
                  onSelect={this.onSelect}
                  style={{ width: '100%' }}
                  deptType={['010']}
                  disabled={disabled}
                />,
              )}
            </FormItem>
          </Col>
          <Col span={9} >
            <FormItem {...formItemLayout} >
              {getFieldDecorator('tradeName')(
                <Input
                  placeholder="药品名称/条码"
                  style={{ width: '100%' }}
                  onPressEnter={this.handleSubmit}
                />,
              )}
            </FormItem>
          </Col>
          <Col span={6} >
            <Button type="primary" onClick={this.handleSubmit} style={{ width: '100%' }} icon="search" size="large" >查询</Button>
          </Col>
        </Form>
      </Row>
    );
  }
}

const selfForm = Form.create()(matSearchBar);
export default connect(
  ({ instockPlanEdit, utils }) => ({ instockPlanEdit, utils }),
)(selfForm);
