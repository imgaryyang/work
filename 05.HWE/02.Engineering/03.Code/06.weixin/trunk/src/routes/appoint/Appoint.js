import React from 'react';
import { Card, List, InputItem, Button, Toast } from 'antd-mobile';
import { connect } from 'dva';
import { createForm } from 'rc-form';
import { action, testAppointItem } from '../../utils/common';
import less from './Appoint.less';

export const initTypeData = [
  { value: 0, label: '有卡预约' },
  { value: 1, label: '无卡预约' },
];

class Appoint extends React.Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const { profiles } = this.props.base;
    console.log('profiles', profiles);
  }

  componentWillUnmount() {
    this.props.dispatch(action('appoint/save', { appointSourceData: [] }));
  }

  onSubmit() {
    this.props.form.validateFields((error, values) => {
      if (!error) {
        if (!values.proName || !values.proName.length) {
          Toast.info('无卡预约用户姓名必填');
          return;
        }
        if (!values.mobile || !values.mobile.length) {
          Toast.info('无卡预约用户手机号码必填');
          return;
        }
        const mobile = values.mobile.replace(/\s/g, '');
        if (mobile.length < 11) {
          Toast.info('手机号不符合格式');
          return;
        }
        const item = this.props.location.state ? this.props.location.state.item : testAppointItem;
        this.props.dispatch(action('appoint/forReserve', { ...item, mobile, proName: values.proName }));
      } else {
        Toast.fail('表单校验失败');
      }
    });
  }

  render() {
    const item = this.props.location.state ? this.props.location.state.item : testAppointItem;
    const { getFieldProps } = this.props.form;

    return (
      <div>
        <Card>
          <Card.Header
            className={less.cardHeader}
            title={
              <span className={less.titleMain}>
                {item.docName}<span className={less.titleExtra}>{item.docJobTitle}</span>
              </span>
            }
            thumb="https://cloud.githubusercontent.com/assets/1698185/18039916/f025c090-6dd9-11e6-9d86-a4d48a1bf049.png"
            thumbStyle={styles.thumb}
          />
          <Card.Body className={less.cardBody}>
            <div className={less.row}>
              <span className={less.label}>就诊医院</span>
              <span className={less.content}>{item.hosName}</span>
            </div>
            <div className={less.row}>
              <span className={less.label}>就诊科室</span>
              <span className={less.content}>{item.depName}</span>
            </div>
            <div className={less.row}>
              <span className={less.label}>门诊类型</span>
              <span className={less.content}>{item.clinicTypeName}</span>
            </div>
            <div className={less.row}>
              <span className={less.label}>门诊金额</span>
              <span className={less.content}>¥{item.totalFee}</span>
            </div>
            <div className={less.row}>
              <span className={less.label}>门诊时间</span>
              <span className={less.content}>{item.clinicDate} {item.shiftName}</span>
            </div>
            <div className={less.row}>
              <span className={less.label}>预约时间</span>
              <span className={less.content}>{item.clinicTime}</span>
            </div>
          </Card.Body>
        </Card>
        <div className={less.sep}>患者信息</div>
        <form>
          <List>
            <List.Item arrow="horizontal" extra={<span className={`${less.fontBlack} ${less.font17}`}>无卡预约</span>}>
              <span className={less.fontGray}>预约类型</span>
            </List.Item>
            <InputItem {...getFieldProps('proName')} placeholder="请输入患者名称">
              <span className={less.fontGray}>患者名称</span>
            </InputItem>
            <InputItem {...getFieldProps('mobile')} type="phone" placeholder="请输入手机号">
              <span className={less.fontGray}>手机号</span>
            </InputItem>
          </List>
        </form>
        <div className={less.tips}>温馨提示：实名制预约挂号，就诊人信息不符将无法取号</div>
        <Button className={less.button} type="primary" onClick={this.onSubmit}>确定预约</Button>
      </div>
    );
  }
}

const styles = {
  thumb: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
};

// const Login = createForm()(FormItem);

// export default connect(base => (base))(Login);
export default connect(({ appoint, base }) => ({ appoint, base }))(createForm()(Appoint));
