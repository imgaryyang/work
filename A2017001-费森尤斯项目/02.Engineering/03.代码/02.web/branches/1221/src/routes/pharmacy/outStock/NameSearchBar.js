import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button } from 'antd';

const FormItem = Form.Item;

class InvSearchBar extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.doSearch = this.doSearch.bind(this);
  }


  handleSubmit() {
    // console.info(this);
    // console.info(this.props.form.getFieldInstance('tradeName'));
    this.props.form.validateFields((err, values) => {
      if (!err) this.doSearch(values);
    });
    this.props.form.getFieldInstance('tradeName').refs.input.select();
  }

  doSearch(values) {
    if (typeof this.props.onSearch === 'function') { this.props.onSearch(values); }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 0 },
      wrapperCol: { span: 24 },
      style: { width: '100%' },
    };
    return (
      <Form inline style={{ paddingBottom: '5px' }} >
        <FormItem {...formItemLayout} >
          {getFieldDecorator('tradeName')(
            <Input
              placeholder="药品名称/条码"
              addonAfter={
                <Button onClick={this.handleSubmit} icon="search" size="small" >查询</Button>
              }
              onPressEnter={this.handleSubmit}
              style={{ width: '100%' }}
            />,
          )}
        </FormItem>
        {/* <FormItem>
          {getFieldDecorator('tradeName')(
            <Input
              placeholder="药品" style={{ width: '140px' }}
              addonAfter={
                <span
                  style={{ cursor: 'pointer' }}
                  onClick={this.handleSubmit.bind(this)}
                ><Icon type="search" />检索</span>
              }
              onPressEnter={this.handleSubmit.bind(this)}
            />,
        )}
        </FormItem>*/}
      </Form>
    );
  }
}

const InvSearchBarForm = Form.create()(InvSearchBar);
export default connect(
  ({ outStock, utils }) => ({ outStock, utils }),
)(InvSearchBarForm);
