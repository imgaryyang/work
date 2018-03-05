import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Modal, Spin, Button, Form, Input, Icon, notification } from 'antd';
import _ from 'lodash';

import styles from './Login.less';

import baseUtil from '../../utils/baseUtil';

const FormItem = Form.Item;

class ChangePwd extends Component {

  constructor(props) {
    super(props);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  /* onSearch(values) {
    const { user } = this.props.base;
    console.log('values+++++', values);
    if (values && values.password && values.newPassword && values.rePassword) {
      if (values.newPassword === values.rePassword) {
        this.props.dispatch({
          type: 'base/loadChangePwd',
          payload: {
            query: { ...values, id: user.id, username: user.name },
          },
        });
      } else {
        notification.info({ message: '提示信息', description: '新密码与确认密码不同，请重新输入！' });
      }
    } else {
      notification.info({ message: '提示信息', description: '密码不能为空，请重新输入！' });
    }
  }*/

  handleOk() {
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      if (values.newPassword === values.password) {
        form.setFields({
          newPassword: {
            errors: ['新密码不能与原密码相同！'],
          },
        });
        return;
      }
      if (values.newPassword !== values.rePassword) {
        form.setFields({
          rePassword: {
            errors: ['确认密码与新密码不符！'],
          },
        });
        return;
      }

      const { user } = this.props.base;
      this.props.dispatch({
        type: 'base/loadChangePwd',
        payload: {
          query: { ...values, id: user.id},
        },
      });
      /* const { user } = this.props.base;
      if (values.newPassword === values.rePassword) {
        this.props.dispatch({
          type: 'base/loadChangePwd',
          payload: {
            query: { ...values, id: user.id, username: user.name },
          },
        });
      } else {
        notification.info({ message: '提示信息', description: '新密码与原密码相同，请重新输入！' });
      }*/

      /* if (!err) {
        this.onSearch(values);
      } else {
        notification.info({ message: '提示信息', description: '* 标记不能为空，请重新输入！' });
      }*/
      // form.resetFields();
    });
  }

  handleCancel() {
    this.props.dispatch({
      type: 'base/setState',
      payload: {
        changeVisible: false,
      },
    });
    this.props.form.resetFields();
  }

  render() {
    const { changeVisible } = this.props.base;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    return (
      <Modal
        width={350}
        visible={changeVisible}
        title={<div style={{ fontSize: '15px', textAlign: 'center' }} >修改密码</div>}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={(
          <div style={{ padding: '10px 15px 0 0', textAlign: 'right' }} >
            <Button key="submit" type="primary" size="large" onClick={this.handleOk} icon="save" style={{ marginRight: '10px' }} >确定</Button>
            <Button key="back" size="large" onClick={this.handleCancel} icon="close" >返回</Button>
          </div>
        )}
        closable={false}
        maskClosable={false}
        style={{ padding: '0px' }}
        wrapClassName={styles.verticalCenterModal}
      >
        <Form>
          <FormItem label="原密码" {...formItemLayout} >
            {getFieldDecorator('password', {
              rules: [
                { required: true, message: '请输入原密码！' },
              ],
            })(
              <Input type="password" placeholder="原密码" />,
            )}
          </FormItem>
          <FormItem label="新密码" {...formItemLayout} >
            {getFieldDecorator('newPassword', {
              rules: [
                { required: true, message: '请输入新密码!' },
                { min: 8, message: '密码长度至少8位字符!' },
              ],
            })(
              <Input type="password" placeholder="新密码" />,
            )}
          </FormItem>
          <FormItem label="确认密码" {...formItemLayout} >
            {getFieldDecorator('rePassword', {
              rules: [
                { required: true, message: '请输入确认密码!' },
                { min: 8, message: '密码长度至少8位字符!' },
              ],
            })(
              <Input type="password" placeholder="确认密码" />,
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
const ChangePwdCmp = Form.create()(ChangePwd);
export default connect(
  ({ base }) => ({ base }),
)(ChangePwdCmp);
