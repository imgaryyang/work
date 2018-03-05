import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Icon, Input, Button, Checkbox, Row, Col } from 'antd';
import styles from './Login.less';

const FormItem = Form.Item;

class RealForm extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        this.props.dispatch({
          type: 'base/login',
          payload: { user: values },
        });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
      style: { width: '100%' },
    };// onSubmit={this.handleSubmit}
    return (
      <Form className={styles.form}>
        <FormItem label="账号" {...formItemLayout} >
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入用户名' }],
          })(
            <Input addonAfter={<Icon type="user" />} placeholder="用户名" onPressEnter={this.handleSubmit} style={{ width: '100%' }} />,
          )}
        </FormItem>
        <FormItem label="密码" {...formItemLayout} >
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码!' }],
          })(
            <Input addonAfter={<Icon type="lock" />} type="password" placeholder="密码" onPressEnter={this.handleSubmit} style={{ width: '100%' }} />,
          )}
        </FormItem>
        <Row>
          <Col span={5} />
          <Col span={10} >
            <FormItem style={{ display: 'none' }} >
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(
                <Checkbox className={styles.input}>记住密码</Checkbox>,
              )}
            </FormItem>
          </Col>
          <Col span={9} >
            <Button type="primary" className={styles.button} onClick={this.handleSubmit} size="large" icon="login" >登录</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}
const LoginFormCmp = Form.create()(RealForm);
export default connect(
  ({ base }) => ({ base }),
)(LoginFormCmp);
