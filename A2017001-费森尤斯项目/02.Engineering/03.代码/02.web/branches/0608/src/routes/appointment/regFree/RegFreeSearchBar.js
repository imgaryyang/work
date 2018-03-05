import React, { Component } from 'react';
import { Row, Col, Form, Input } from 'antd';
import { connect } from 'dva';
import DictSelect from '../../../components/DictSelect';
import CommonItemSearchInput from '../../../components/searchInput/CommonItemSearchInput';

const FormItem = Form.Item;

class RegFreeSearchBar extends Component {

  onSelectCommonItem(record) {
    const itemId = record.id;
    this.props.form.setFieldsValue({
      'itemInfo.id': itemId,
    });
    this.handleSubmit();
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'regFree/save',
          params: values,
        });
      }
    });
  }
  changeRegLevel(value, option) {
    const values = { regLevel: value };
    const levelName = option.props.children;
    this.props.form.setFieldsValue({
      levelName,
    });
    const search = this.props.onSearch;
    if (search) {
      this.props.setSearchObjs(values);
      search(this.props.searchObjs);
    }
  }

  handleReset() {
    this.props.form.resetFields();
    this.props.setSearchObjs(null);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
    };
    return (
      <div className="action-form-wrapper">
        <Row type="flex" justify="left">
          <Col span={20} className="action-form-searchbar">
            <Form inline >
              <FormItem style={{ display: 'none' }}>
                {getFieldDecorator('levelName', { initialValue: '普通门诊' })(<Input />)}
              </FormItem>
              <FormItem style={{ display: 'none' }}>
                {getFieldDecorator('itemInfo.id')(<Input />)}
              </FormItem>
              <FormItem style={{ display: 'none' }}>
                {getFieldDecorator('stopFlag', { initialValue: '1' })(<Input />)}
              </FormItem>
              <FormItem>
                {getFieldDecorator('regLevel', { initialValue: '1' })(<DictSelect onSelect={this.changeRegLevel.bind(this)} showSearch style={{ width: '250px' }} columnName="REG_LEVEL" placeholder="挂号类型" />)}
              </FormItem>
              <FormItem style={{ width: '300px' }} {...formItemLayout}>
                {getFieldDecorator('item')(<CommonItemSearchInput placeholder="费用拼音码/五笔码" itemType="0" onSelect={this.onSelectCommonItem.bind(this)} />)}
              </FormItem>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

const Editor = Form.create()(RegFreeSearchBar);
export default connect(({ regFree }) => ({ regFree }))(Editor);
