import React, { Component } from 'react';
import { Row, Col, Form, Input, Button, Icon } from 'antd';

const FormItem = Form.Item;

class MiHisCompareSearchBar extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = ::this.handleSubmit;
    this.handleReset = ::this.handleReset;
    this.onSearch = ::this.onSearch;
    this.setSearchObjs = ::this.setSearchObjs;
  }

  onSearch(values) {
    this.props.dispatch({
      type: 'miHisCompare/load',
      payload: { query: values },
    });
  }
  setSearchObjs(searchObj) {
    this.props.dispatch({
      type: 'miHisCompare/setSearchObjs',
      payload: searchObj,
    });
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setSearchObjs(values);
        this.onSearch(this.props.searchObjs);
      }
    });
  }

  handleReset() {
    this.props.form.resetFields();
    this.setSearchObjs(null);
    this.onSearch(null);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const onAdd = () => {
      /* this.props.dispatch({ type: 'miHisCompare/toggleVisible' });
      this.props.dispatch({
        type: 'utils/setState',
        payload: { record: {} },
      });*/
    };
    return (
      <div className="action-form-wrapper">
        <Row type="flex" justify="center">
          <Col span={12} className="action-form-searchbar">
            <Form inline>
              <FormItem>
                {getFieldDecorator('itemName')(<Input placeholder="项目名称" onPressEnter={this.handleSubmit} />)}
              </FormItem>
              <FormItem>
                {getFieldDecorator('itemCode')(<Input placeholder="医保(医院)编码" onPressEnter={this.handleSubmit} />)}
              </FormItem>
              <FormItem>
                {getFieldDecorator('miClass')(<Input placeholder="分类" onPressEnter={this.handleSubmit} />)}
              </FormItem>
              <FormItem>
                <Button type="primary" onClick={this.handleSubmit}>
                  <Icon type="search" />查询
                </Button>
              </FormItem>
              <FormItem>
                <Button onClick={this.handleReset}>
                  <Icon type="reload" />清空
                </Button>
              </FormItem>
            </Form>
          </Col>
          <Col span={12} className="action-form-operating">
            <Button type="primary" size="large" onClick={onAdd.bind(this)} className="btn-left">
              <Icon type="plus" />新增
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Form.create()(MiHisCompareSearchBar);
