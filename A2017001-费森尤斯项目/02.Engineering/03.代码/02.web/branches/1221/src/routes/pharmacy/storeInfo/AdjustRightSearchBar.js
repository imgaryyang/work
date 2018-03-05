import React, { Component } from 'react';
import { Row, Col, Form, Input, Button } from 'antd';
import DictSelect from '../../../components/DictSelect';
import DrugInfoSearchInput from '../../../components/searchInput/DrugInfoSearchInput';

const FormItem = Form.Item;

class AdjutRightSearchBar extends Component {

  onSelect(record) {
    const drugCode = record.drugCode;
    this.props.form.setFieldsValue({
      drugCode,
    });
    this.handleSubmit();
  }

  handleSubmit() {
    const search = this.props.onSearch;
    this.props.form.validateFields((err, values) => {
      if (!err && search) {
        this.props.setSearchObjs(values);
        search(this.props.adjustSearchObjs);
      }
    });
  }

  handleReset() {
    this.props.form.resetFields();
    this.props.setSearchObjs(null);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { saveAdjust } = this.props;
    return (
      <div className="action-form-wrapper">
        <Row type="flex" justify="left">
          <Col span={19} className="action-form-searchbar">
            <Form inline >
              <FormItem>
                {getFieldDecorator('drugType')(<DictSelect showSearch columnName="DRUG_TYPE" style={{ width: '200px' }} placeholder="药品分类" />)}
              </FormItem>
              <FormItem {...{ wrapperCol: { span: 24 } }} style={{ width: '300px' }}>
                {getFieldDecorator('tradeName')(<DrugInfoSearchInput
                  onSelect={this.onSelect.bind(this)}
                  style={{ width: 120 }}
                />)}
              </FormItem>
              <FormItem style={{ display: 'none' }}>
                {getFieldDecorator('drugCode')(<Input />)}
              </FormItem>
              <FormItem>
                <Button type="primary" onClick={this.handleSubmit.bind(this)} icon="search" >查询</Button>
              </FormItem>
              <FormItem>
                <Button onClick={this.handleReset.bind(this)} icon="reload" >清空</Button>
              </FormItem>
            </Form>
          </Col>
          <Col lg={{ span: 5 }} md={{ span: 5 }} sm={8} xs={24} className="action-form-operating">
            <Button type="primary" size="large" className="btn-left" onClick={saveAdjust} icon="save" >确认调价</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Form.create()(AdjutRightSearchBar);
