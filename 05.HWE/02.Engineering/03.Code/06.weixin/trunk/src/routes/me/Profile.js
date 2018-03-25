import React from 'react';
// import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { createForm } from 'rc-form';
import { List, InputItem, WhiteSpace, WingBlank, Button, Picker, Flex } from 'antd-mobile';
// import styles from './User.less';

class FormItem extends React.Component {
  onChange(v) {
    console.log('onChange', v);
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // if (values.idNo.replace(/\s/g, '').length < 11) {
        //   alert('身份证号不符合格式');
        // }
        console.log('values:', values);
        // console.log('gender', typeof values.gender[0]);
        this.props.dispatch({
          type: 'base/doSave',
          payload: {
            ...values,
            gender: values.gender[0] ? `${values.gender[0]}` : null,
          },
        });
      }
    });
  }
  reset() {
    console.log('reset');
  }
  render() {
    const genders = [
      { label: '女', value: '0' },
      { label: '男', value: '1' },
    ];
    const { getFieldProps } = this.props.form;
    const { user } = this.props.base;
    console.log('form', this.props.form);
    return (
      <form>
        <List>
          <InputItem
            {...getFieldProps('name', { initialValue: user.name ? user.name : '', })}
            type="text"
            placeholder="请输入姓名"
          >姓名
          </InputItem>
          <Picker data={genders} cols={1} {...getFieldProps('gender', { initialValue: user.gender ? user.gender : '', onChange(v) { console.log('aaa', v); } })} className="forss">
            <List.Item arrow="horizontal">性别</List.Item>
          </Picker>
          <InputItem
            {...getFieldProps('idNo', { initialValue: user.idNo ? user.idNo : '', })}
            type="text"
            placeholder="请输入身份证号"
            maxLength={18}
          >身份证
          </InputItem>
          <InputItem
            {...getFieldProps('email', { initialValue: user.email ? user.email : '', })}
            type="text"
            placeholder="请输入邮箱"
            maxLength={20}
          >邮箱
          </InputItem>
          <InputItem
            {...getFieldProps('address', { initialValue: user.address ? user.address : '', })}
            type="text"
            placeholder="请输入地址"
            maxLength={18}
          >地址
          </InputItem>
          <WhiteSpace />
          <WingBlank>
            <Flex direction="row">
              <Flex.Item>
                <Button type="primary" size="small" onClick={this.reset}>重置</Button>
              </Flex.Item>
              <Flex.Item>
                <Button type="primary" size="small" onClick={this.handleSubmit}>保存</Button>
              </Flex.Item>
            </Flex>
          </WingBlank>
        </List>
      </form>
    );
  }
}
FormItem.propTypes = {
};
const Profile = createForm()(FormItem);
export default connect(({ home, user, base }) => ({ home, user, base }))(Profile);
