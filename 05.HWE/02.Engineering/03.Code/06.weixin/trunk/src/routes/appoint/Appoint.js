import React from 'react';
import { Card, List, InputItem, Button, Toast } from 'antd-mobile';
import { connect } from 'dva';
import { createForm } from 'rc-form';
import ModalSelect from '../../components/ModalSelect';
import { action, isValidArray, testAppointItem } from '../../utils/common';
import less from './Appoint.less';
import { testCnIdNo } from '../../utils/validation';

const thumbStyle = { width: 50, height: 50, borderRadius: 25 };
const initTypeData = [
  { value: 0, label: '有卡预约' },
  { value: 1, label: '无卡预约' },
];

class Appoint extends React.Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onSelectType = this.onSelectType.bind(this);
    this.toggleModal = this.toggleModal.bind(this);

    const typeData = isValidArray(props.base.profiles) ? initTypeData : initTypeData.slice(1);
    this.state = {
      modalVisible: false,
      typeData,
      selectedType: typeData[0],
    };
  }

  componentDidMount() {
    console.log('this.props.base', this.props.base);
  }

  componentWillUnmount() {
    this.props.dispatch(action('appoint/save', { appointSourceData: [] }));
  }

  onSubmit() {
    const { form, location, dispatch } = this.props;
    form.validateFields((error, values) => {
      if (!error) {
        const { proName, mobile, idNo } = values;
        if (!proName || !proName.length) {
          Toast.info('无卡预约用户姓名必填');
          return;
        }
        if (!mobile || !mobile.length) {
          Toast.info('无卡预约用户手机号码必填');
          return;
        }
        const trimMobile = mobile.replace(/\s/g, '');
        if (trimMobile.length < 11) {
          Toast.info('手机号不符合格式');
          return;
        }
        if (!idNo || !idNo.length) {
          Toast.info('无卡预约用户身份证号必填');
          return;
        } else if (!testCnIdNo(idNo)) {
          Toast.info('身份证号不符合格式');
          return;
        }

        const item = location.state ? location.state.item : testAppointItem;
        dispatch(action('appoint/forReserve', { ...item, mobile: trimMobile, proName, idNo }));
      } else {
        Toast.fail('表单校验失败');
      }
    });
  }

  onSelectType(item) {
    this.setState({ selectedType: item });
    this.toggleModal();
  }

  toggleModal() {
    this.setState({ modalVisible: !this.state.modalVisible });
  }

  render() {
    const item = this.props.location.state ? this.props.location.state.item : testAppointItem;
    const { getFieldProps } = this.props.form;
    const { selectedType, typeData, modalVisible } = this.state;

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
            thumbStyle={thumbStyle}
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
            <List.Item arrow="horizontal" extra={<span className={`${less.fontBlack} ${less.font17}`} onClick={this.toggleModal}>{selectedType.label}</span>}>
              <span className={less.fontGray}>预约类型</span>
            </List.Item>
            <InputItem {...getFieldProps('proName')} placeholder="请输入患者名称">
              <span className={less.fontGray}>患者名称</span>
            </InputItem>
            <InputItem {...getFieldProps('mobile')} type="phone" placeholder="请输入手机号">
              <span className={less.fontGray}>手机号</span>
            </InputItem>
            <InputItem {...getFieldProps('idNo')} maxLength={18} placeholder="请输入身份证号">
              <span className={less.fontGray}>身份证号</span>
            </InputItem>
          </List>
        </form>
        <div className={less.tips}>温馨提示：实名制预约挂号，就诊人信息不符将无法取号</div>
        <Button className={less.button} type="primary" onClick={this.onSubmit}>确定预约</Button>
        <ModalSelect visible={modalVisible} data={typeData} defaultValue={selectedType.value} onClose={this.toggleModal} onSelect={this.onSelectType} />
      </div>
    );
  }
}

export default connect(({ appoint, base }) => ({ appoint, base }))(createForm()(Appoint));
