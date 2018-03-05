import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Button,notification} from 'antd';

import DeptSelect from '../../../components/DeptSelect';

const FormItem = Form.Item;

class InstockInvSearchBar extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.doSearch = this.doSearch.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  onSelect(value) {
    this.props.dispatch({
      type: 'instock/load',
      payload: { query: { deptId: value } },
    });
  }

  handleSubmit() {

    this.props.form.validateFields((err, values) => {
	if (!values.deptId) {
		notification.error({
            message: '错误',
            description: `请先选择库房!`,
          });
      }
	else if (!err) this.doSearch(values);
    });
  }

  doSearch(values) {
    if (typeof this.props.A === 'function') { this.props.A(values); }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { instock } = this.props;
    const { dataApply,fromDeptId } = (instock || {});
    const formItemLayout = {
      labelCol: { span: 0 },
      wrapperCol: { span: 24 },
      style: { width: '100%', paddingRight: '5px', marginBottom: 0 },
    };
    let disabled = false;
    if (fromDeptId){
    	 disabled = dataApply.length !== 0;
    }
    
    return (
      <Row style={{ marginBottom: '5px' }}>
        <Form >
          <Col span={9} >
            <FormItem {...formItemLayout} >
              {getFieldDecorator('deptId')(
                <DeptSelect
                  showSearch
                  placeholder="库房"
                  onSelect={this.onSelect}
                  style={{ width: '100%' }}
                  deptType={['004', '005']}
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

const InstockInvSearchBarForm = Form.create()(InstockInvSearchBar);
export default connect(
  ({ instock, utils }) => ({ instock, utils }),
)(InstockInvSearchBarForm);
