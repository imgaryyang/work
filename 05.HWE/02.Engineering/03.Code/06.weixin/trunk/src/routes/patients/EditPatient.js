import React from 'react';
import { connect } from 'dva';

import { createForm } from 'rc-form';
import { List, InputItem, WhiteSpace, WingBlank, Button } from 'antd-mobile';
import { testCnIdNo } from '../../utils/validation';

class FormItem extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (!values.name) {
          alert('请输入姓名');
          return;
        }
        if (!testCnIdNo(values.idNo)) {
          alert('身份证号不符合格式！请从新输入');
          return;
        }
        console.log('Received values of form: ', values);
        this.props.dispatch({
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
            placeholder="请输入姓名"
          >姓名
          </InputItem>
          <InputItem
            {...getFieldProps('idNo')}
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
const EditPatient = createForm()(FormItem);
export default connect(({ home, user }) => ({ home, user }))(EditPatient);
