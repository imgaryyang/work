import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, DatePicker } from 'antd';
const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD';
import styles from './style.less';
class WithDrwalSearchBar extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.doSearch = this.doSearch.bind(this);
  }


  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) this.doSearch(values);
    });
  }

  doSearch(values) {
    if (typeof this.props.onSearch === 'function') { this.props.onSearch(values); }
  }

  doReset(values) {
     if (typeof this.props.handleReset === 'function') { this.handleReset(values); }
  }

  handleReset() {
    this.props.form.resetFields();
    this.props.onSearch();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 0 },
      wrapperCol: { span: 24 },
      style: { width: '100%' },
    };
    return (
      <Form  className={styles.form} >
        <Row>
          <Col span={12} style={{ paddingRight: '2px' }} >
            <FormItem {...formItemLayout}>
              { getFieldDecorator('regTime', {
                initialValue: this.props.form.regTime,
              })(
              <DatePicker
                format={dateFormat}
                placeholder="挂号日期"
                allowClear={false}
                onPressEnter={this.handleSubmit}
              />,
              )}
            </FormItem>
          </Col>
          <Col  span={12} style={{ paddingLeft: '3px' }} >
            <FormItem {...formItemLayout} >
              {getFieldDecorator('patientName', {
                // initialValue: this.props.form.patientName,
              })(
                <Input maxLength={20} placeholder="患者姓名" onPressEnter={this.handleSubmit} />,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12} style={{ paddingRight: '2px' }}>
            <Button type="primary" onClick={this.handleSubmit} size="large" icon="search" style={{ width: '100%' }} >查询</Button>
          </Col>
          <Col span={12} style={{  paddingLeft: '3px' }}>
            <Button onClick={this.handleReset} size="large" icon="reload" style={{ width: '100%' }}>清空</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(WithDrwalSearchBar);
