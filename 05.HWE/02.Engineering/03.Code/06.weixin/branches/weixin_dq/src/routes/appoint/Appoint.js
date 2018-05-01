import React from 'react';
import { Card, List, InputItem, Button, Toast } from 'antd-mobile';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { createForm } from 'rc-form';
import _ from 'lodash';
import ModalSelect from '../../components/ModalSelect';
import Global from '../../Global';
import Radios from '../../components/Radios';
import { action } from '../../utils/common';
import less from './Appoint.less';
import { testCnIdNo, testMobile } from '../../utils/validation';
import baseStyles from '../../utils/base.less';

const initTypeData = [
  { value: '0', label: '有卡预约' },
  { value: '1', label: '无卡预约' },
];

class Appoint extends React.Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onSelectType = this.onSelectType.bind(this);
    this.toggleModal = this.toggleModal.bind(this);

    const typeData = _.isEmpty(props.base.currProfile) ? initTypeData.slice(1) : initTypeData;
    this.state = {
      modalVisible: false,
      typeData,
      selectedType: typeData[0],
    };
  }

  componentDidMount() {
    this.props.dispatch(action('base/save', {
      title: '预约挂号',
      allowSwitchPatient: true,
      hideNavBarBottomLine: false,
      showCurrHospitalAndPatient: true,
      headerRight: null,
    }));
  }

  componentWillUnmount() {
    this.props.dispatch(action('appoint/save', { appointSourceData: [] }));
  }

  onSubmit() {
    const { selectedType } = this.state;
    const {
      form,
      dispatch,
      appoint: { selectAppointSource },
      base: { currProfile, user: { id: terminalUser } }
    } = this.props;

    if (_.isEmpty(selectAppointSource)) {
      Toast.fail('号源信息不能为空', 3);
      return;
    }

    if (selectedType.value === '1') {
      form.validateFields((error, values) => {
        const { name, mobile, idNo } = values;
        const trimMobile = (mobile || '').replace(/\s/g, ''); // lodash的trim只能去除头尾，不能去除中间

        if (!error) {
          if (!name || !name.length) {
            Toast.info('无卡预约用户姓名必填');
            return;
          }
          if (!trimMobile || !trimMobile.length) {
            Toast.info('无卡预约用户手机号码必填');
            return;
          } else if (!testMobile(trimMobile)) {
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
          if (!terminalUser) {
            Toast.info('无用户信息，不可无卡预约');
            return;
          }
        } else {
          Toast.fail('表单校验失败');
          return;
        }
        dispatch(action('appoint/forReserve', {
          ...selectAppointSource,
          mobile: trimMobile,
          proName: name,
          idNo,
          terminalUser,
          appCode: Global.Config.appCode,
          appType: Global.Config.appType,
          type: selectedType.value,
        })).then((success) => {
          if (success) Toast.success('预约成功', 1, () => dispatch(routerRedux.go(-3)));
        }).catch(e => Toast.fail(String(e), 3));
      });
    } else {
      const { id: proId, no: proNo, cardNo, cardType, name: proName, mobile, idNo, gender } = currProfile;
      const trimMobile = (mobile || '').replace(/\s/g, ''); // lodash的trim只能去除头尾，不能去除中间
      if (!proName || !proName.length) {
        Toast.fail('姓名不能为空', 3);
        return;
      }
      if (!trimMobile || !trimMobile.length) {
        Toast.fail('手机号不能为空', 3);
        return;
      } else if (!testMobile(trimMobile)) {
        Toast.fail('手机号格式不符合要求', 3);
        return;
      }
      // 有卡预约去掉身份证号校验
      // if (!idNo || !idNo.length) {
      //   Toast.fail('身份证号不能为空', 3);
      //   return;
      // } else if (!testCnIdNo(idNo)) {
      //   Toast.fail('身份证号格式不符合要求', 3);
      //   return;
      // }
      dispatch(action('appoint/forReserve', {
        ...selectAppointSource,
        mobile,
        proName,
        idNo,
        proId,
        proNo,
        cardNo,
        cardType,
        terminalUser,
        gender,
        appCode: Global.Config.appCode,
        appType: Global.Config.appType,
        type: selectedType.value,
      })).then((success) => {
        if (success) Toast.success('预约成功', 1, () => dispatch(routerRedux.go(-3)));
      }).catch(e => Toast.fail(String(e), 3));
    }
  }

  onSelectType(item) {
    this.setState({ selectedType: item });
    this.toggleModal();
  }

  toggleModal() {
    this.setState({ modalVisible: !this.state.modalVisible });
  }

  render() {
    const {
      form: { getFieldProps },
      appoint: { selectAppointSource: item },
      base: { currProfile, currHospital: { name: hosName } },
    } = this.props;
    const { selectedType, typeData, modalVisible } = this.state;

    return (
      <div className={baseStyles.scrolly}>
        <Card>
          <Card.Header
            className={less.cardHeader}
            title={
              <span className={less.titleMain}>
                {item.docName}<span className={less.titleExtra}>{item.docJobTitle}</span>
              </span>
            }
            thumb={<div className={less.thumb} />}
          />
          <Card.Body className={less.cardBody}>
            <div className={less.row}>
              <span className={less.label}>就诊医院</span>
              <span className={less.content}>{hosName}</span>
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
              <span className={less.content}>{item.clinicTime ? item.clinicTime.slice(11, 16) : item.clinicTime}</span>
            </div>
          </Card.Body>
        </Card>
        <div className={less.sep}>患者信息</div>
        <form>
          <List>
            <List.Item>
              <div className={baseStyles.flexRow}>
                <span className={less.formLabel}>预约方式</span>
                <Radios data={typeData} value={selectedType.value} onSelect={obj => this.setState({ selectedType: obj })} />
              </div>
            </List.Item>
            {
              selectedType.value === '0' ?
              (
                <div>
                  <InputItem value={currProfile.name} editable={false}>
                    <span className={less.formFont}>患者姓名</span>
                  </InputItem>
                  <InputItem value={currProfile.mobile} editable={false}>
                    <span className={less.formFont}>手机号</span>
                  </InputItem>
                  <InputItem value={currProfile.idNo} editable={false}>
                    <span className={less.formFont}>身份证号</span>
                  </InputItem>
                  <InputItem value={currProfile.no} editable={false}>
                    <span className={less.formFont}>就诊卡</span>
                  </InputItem>
                </div>
              ) : (
                <div>
                  <InputItem {...getFieldProps('name')} placeholder="请输入患者姓名">
                    <span className={less.formFont}>患者姓名</span>
                  </InputItem>
                  <InputItem {...getFieldProps('mobile')} type="phone" placeholder="请输入手机号">
                    <span className={less.formFont}>手机号</span>
                  </InputItem>
                  <InputItem {...getFieldProps('idNo')} maxLength={18} placeholder="请输入身份证号">
                    <span className={less.formFont}>身份证号</span>
                  </InputItem>
                </div>
              )
            }
          </List>
        </form>
        <div className={less.tips}>温馨提示：实名制预约挂号，就诊人信息不符将无法取号
          {
            selectedType.value === '0' ? null : <span><br />无卡预约请就诊当天使用医院自助机完成自助办卡并签到</span>
          }
        </div>
        <Button className={less.button} type="primary" onClick={this.onSubmit}>确定预约</Button>
        <ModalSelect visible={modalVisible} data={typeData} defaultValue={selectedType.value} onClose={this.toggleModal} onSelect={this.onSelectType} />
      </div>
    );
  }
}

export default connect(({ appoint, base }) => ({ appoint, base }))(createForm()(Appoint));
