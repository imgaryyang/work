import React, { Component } from 'react';
import moment from 'moment';
import { Row, Col, Form, Button, Select } from 'antd';

const Option = Select.Option;
const FormItem = Form.Item;

class MonthCheckSearchBar extends Component {
  onSave() {
    this.props.dispatch({ type: 'matMonthCheck/save' });
  }

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
    const { checkTimeList } = this.props;
    let option = [];
    if (checkTimeList && checkTimeList.length > 0) {
      for (const d of checkTimeList) {
        option.push(<Option value={d}>{moment(d).format('YYYY-MM-DD')}</Option>);
      }
    }
    return (
      <div className="action-form-wrapper" style={{ marginBottom: '10px' }} >
        <Row type="flex" justify="left">
          <Col span={20}>
            <Form inline>
              <FormItem>
                {getFieldDecorator('monthcheckTime')(<Select style={{ width: '180px' }} placeholder="月结时间" >{option}</Select>)}
              </FormItem>
              <FormItem>
                <Button type="primary" icon="search" onClick={this.handleSubmit.bind(this)}>查询</Button>
              </FormItem>
              <FormItem>
                <Button size="large" icon="reload" onClick={this.handleReset.bind(this)}>清空</Button>
              </FormItem>
            </Form>
          </Col>
          <Col span={4} style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={this.onSave.bind(this)} style={{ marginRight: '10px' }} icon="save" size="large" >月结</Button>
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
})(MonthCheckSearchBar);
