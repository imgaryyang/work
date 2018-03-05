import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button } from 'antd';

import MedicalCard from '../../../components/ScanMedicalCardInput';

const FormItem = Form.Item;

class CardSearchBar extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.doSearch = this.doSearch.bind(this);
    this.readMedicalCardDone = this.readMedicalCardDone.bind(this);
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) this.doSearch(values);
    });
  }

  doSearch(values) {
    // console.log('search values:', values);
    if (typeof this.props.onSearch === 'function') {
      this.props.onSearch(values);
    }
  }

  handleReset() {
    this.props.dispatch({
      type: 'card/setState',
      payload: {
        query: { ...this.props.card.query, patientId: '', cardNo: '', name: '' },
      },
    });
    this.props.form.resetFields();
    this.doSearch();
  }

  readMedicalCardDone(info) {
    // console.log(info);
    this.props.dispatch({
      type: 'card/setState',
      payload: {
        query: { ...this.props.card.query, cardNo: info.medicalCardNo },
      },
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { query } = this.props.card;
    return (
      <Form inline >
        <FormItem wrapperCol={{ span: 24 }} >
          {getFieldDecorator('cardNo', {
            initialValue: query.cardNo,
          })(
            <MedicalCard readed={this.readMedicalCardDone} maxLength={10} placeholder="请输入诊疗卡号" />,
          )}
        </FormItem>
        <FormItem >
          {getFieldDecorator('name', {
            initialValue: query.name,
          })(
            <Input maxLength={15} placeholder="患者姓名" />,
          )}
        </FormItem>
        <Button type="primary" size="large" style={{ marginRight: '10px' }} onClick={this.handleSubmit} icon="search" >查询</Button>
        <Button onClick={this.handleReset} size="large" icon="reload" >清空</Button>
      </Form>
    );
  }
}
const CardSearchBarForm = Form.create()(CardSearchBar);
export default connect(({ card }) => ({ card }))(CardSearchBarForm);

