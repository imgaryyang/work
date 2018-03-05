import React from 'react';
import { connect } from 'dva';

import { createForm } from 'rc-form';
import { routerRedux } from 'dva/router';
import { List, InputItem, WhiteSpace, WingBlank, Button } from 'antd-mobile';
import styles from './AddPatient.less';

class FormItem extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // if (values.idNo.replace(/\s/g, '').length < 11) {
        //   alert('身份证号不符合格式');
        // }
        console.log('Received values of form: ', values);
        const response = this.props.dispatch({
          type: 'user/addPatient',
          payload: { ...values },
        });
      }
    });
  }
  render() {
    const { getFieldProps } = this.props.form;
    return (
      <form>
        <List>
          <InputItem
            {...getFieldProps('name')}
            type="text"
            placeholder="请输入姓名"
          >姓名
          </InputItem>
          <InputItem
            {...getFieldProps('idNo')}
            type="text"
            placeholder="请输入身份证号"
            maxLength={18}
          >身份证
          </InputItem>
          <WhiteSpace />
          <WingBlank>
            <Button type="primary" onClick={this.handleSubmit}>添加</Button>
          </WingBlank>
        </List>
      </form>
    );
  }
}
FormItem.propTypes = {
};
const AddPatient = createForm()(FormItem);
export default connect(({ home, user }) => ({ home, user }))(AddPatient);
