import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button,notification } from 'antd';
import CommonItemSearchInput from '../../../components/searchInput/CommonItemSearchInput';


const FormItem = Form.Item;

class DirectInSearchBar extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.doSearch = this.doSearch.bind(this);
  }

  
  componentWillReceiveProps(props) {
    if (this.props.directIn.dept_id!== props.directIn.dept_id) {
      const selectedType = props.dict.selectedType;
      const formValues = this.props.form.getFieldsValue();
   
      this.doSearch(values);
    }
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) this.doSearch(values);
    });
  }

  doSearch(values) {
    if (typeof this.props.onSearch === 'function') { this.props.onSearch(values); }
  }

  handleReset() {
    this.props.form.resetFields();
  }

  render() {
    const { selectedType } = this.props.directIn;
    const { getFieldDecorator } = this.props.form;

    return (
      <Form style={{paddingBottom:10}} inline>
        <FormItem>
          {getFieldDecorator('tradeName')(
            <Input placeholder="药品" />,
          )}
        </FormItem>
        <FormItem>
          <Button type="primary"  onClick={this.handleSubmit} >查询</Button>
        </FormItem>
      </Form>
    );
  }
}
const DirectInSearchBarForm = Form.create()(DirectInSearchBar);
export default connect(({ directIn }) => ({ directIn }))(DirectInSearchBarForm);

