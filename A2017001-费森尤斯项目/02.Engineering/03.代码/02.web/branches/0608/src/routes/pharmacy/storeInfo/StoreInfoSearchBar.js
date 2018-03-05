import React, { Component } from 'react';
import moment from 'moment';
import { Row, Col, Form, Input, Button, DatePicker } from 'antd';
import DictSelect from '../../../components/DictSelect';
import DeptSelect from '../../../components/DeptSelect';

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
    const { activeKey, searchObjs } = this.props;
    return (
      <div className="action-form-wrapper" style={{ marginBottom: '10px' }} >
        <Row type="flex" justify="left">
          <Col>
            <Form inline>
              <FormItem>
                {getFieldDecorator('drugType')(<DictSelect showSearch style={{ width: '100px' }} columnName="DRUG_TYPE" placeholder="药品分类" />)}
              </FormItem>
              <FormItem>
                {getFieldDecorator('drugInfo.drugQuality')(<DictSelect showSearch style={{ width: '120px' }} columnName="DRUG_QUALITY" placeholder="药品性质" />)}
              </FormItem>
              <FormItem>
                {getFieldDecorator('tradeName', {
                  rules: [{ max: 50, message: '查询码不能超过50个字符' }],
                })(<Input placeholder="药品名称/拼音/五笔/编码/条码" style={{ width: '180px' }} maxLength={50} />)}
              </FormItem>
              { activeKey === '1' ? null : (
                <FormItem>
                  {getFieldDecorator('validDate', { initialValue: searchObjs.validDate ? moment(searchObjs.validDate, 'YYYY-MM-DD') : null })(<DatePicker style={{ width: '100px' }} format="YYYY-MM-DD" placeholder="有效期" />)}
                </FormItem>
                )
              }
              <FormItem>
                {getFieldDecorator('deptId')(<DeptSelect showSearch style={{ width: '100px' }} deptType={['004', '005']} placeholder="库房" />)}
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
