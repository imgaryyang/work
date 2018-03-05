import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, DatePicker } from 'antd';
const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD';

class VisitingRecordSearchBar extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.doSearch = this.doSearch.bind(this);
  }


  handleSubmit() {
    // console.info(this);
    // console.info(this.props.form.getFieldInstance('tradeName'));
    this.props.form.validateFields((err, values) => {
      if (!err) this.doSearch(values);
    });
  }

  doSearch(values) {
    if (typeof this.props.onSearch === 'function') { this.props.onSearch(values); }
  }

  doReset(values) {
     if (typeof this.props.handleReset === 'function') { this.props.handleReset(values); }
  }

  handleReset() {
    this.props.form.resetFields();
    this.doSearch({
      regState: '31',
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form inline style={{ paddingBottom: '5px' }} >
          <Row>
            <Col span={12} >
              <FormItem>
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
            <Col span={12} style={{ paddingLeft: '0', paddingRight: '0' }} >
              <FormItem style={{ width: '100%' }} wrapperCol={{ span: 24 }} >
                {getFieldDecorator('patientName', {
                  initialValue: this.props.form.patientName,
                })(
                  <Input maxLength={20} placeholder="患者姓名" onPressEnter={this.handleSubmit} />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12} >
              
            </Col>
            <Col span={12} >
              <Button type="primary" onClick={this.handleSubmit} size="large" icon="search" >查询</Button>
              <Button onClick={this.handleReset} size="large" icon="reload" >清空</Button>
            </Col>
          </Row>
      </Form>
      
    );
  }
}

export default Form.create()(VisitingRecordSearchBar);
