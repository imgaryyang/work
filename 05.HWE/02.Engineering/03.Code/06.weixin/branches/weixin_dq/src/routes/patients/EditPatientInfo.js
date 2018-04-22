import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Toast, List, InputItem, Button } from 'antd-mobile';
import { createForm } from 'rc-form';
import classnames from 'classnames';

import { colors } from '../../utils/common';
import ModalSelect from '../../components/ModalSelect';
import Radios from '../../components/Radios';
import Global from '../../Global';
import { testMobile, testCnIdNo } from '../../utils/validation';

import styles from './EditPatientInfo.less';

const { Item } = List;

class EditPatientInfo extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    const { /* location, */dispatch, patient } = this.props;
    dispatch({
      type: 'base/save',
      payload: {
        title: `${patient.patientInfo.id ? '修改' : '新增'}就诊人信息`,
        hideNavBarBottomLine: false,
        showCurrHospitalAndPatient: false,
        headerRight: null,
      },
    });
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'patient/setState',
    //   payload: {
    //     patientInfo: {},
    //   },
    // });
  }

  /**
   * 提交表单
   */
  handleSubmit() {
    const { form, dispatch, patient } = this.props;
    form.validateFields((error, values) => {
      if (!error) {
        const { patientInfo } = patient;
        const newValues = { ...patientInfo, ...values };
        // console.log('EditPatientInfo...newValues', newValues);
        if (!newValues.relation) {
          Toast.info('请选择患者与本人关系！', 2, null, false);
          return;
        }
        if (!newValues.name) {
          Toast.info('请填写患者姓名！', 2, null, false);
          return;
        }
        if (!newValues.gender) {
          Toast.info('请选择患者性别！', 2, null, false);
          return;
        }
        if (!newValues.idNo) {
          Toast.info('请填写身份证号！', 2, null, false);
          return;
        }
        if (!testCnIdNo(newValues.idNo)) {
          Toast.info('身份证不合法，请重新填写！', 2, null, false);
          return;
        }
        if (!newValues.mobile) {
          Toast.info('请填写手机号！', 2, null, false);
          return;
        }
        if (!testMobile(newValues.mobile)) {
          Toast.info('手机号不合法，请重新填写！', 2, null, false);
          return;
        }

        dispatch({
          type: 'patient/save',
          payload: {
            patientInfo: newValues,
          },
          callback: msg => Toast(msg, 2, null, false),
          submitDown: (result) => {
            // console.log('result after edit patient:', result);
            dispatch({
              type: 'patient/setState',
              payload: {
                patientInfo: { ...patient.patientInfo, ...result, profiles: patient.patientInfo.profiles },
              },
            });
            dispatch({
              type: 'base/reloadUserInfo',
              // callback: msg => Toast.info(msg, 2, null, false),
              // reloadDown: () => {},
            });
            dispatch(routerRedux.goBack());
          },
        });
      }
    });
  }

  render() {
    const { form, patient, dispatch } = this.props;
    const { getFieldProps } = form;
    const { patientInfo, visible } = patient;
    const { name, relation, gender, idNo, mobile, address } = patientInfo;
    // console.log(patientInfo);

    const genders = [
      { label: '女', value: '0' },
      { label: '男', value: '1' },
    ];
    const relations = [];
    for (const key in Global.relations) {
      relations[relations.length] = { value: key, label: Global.relations[key] };
    }
    // console.log(relations);

    return (
      <div className={styles.container}>
        <List>
          <Item
            arrow="horizontal"
            onClick={() => dispatch({ type: 'patient/setState', payload: { visible: true } })}
            // extra={Global.relations[relation] || '请选择与患者关系'}
          >
            <div className={styles.item}>
              <div className={styles.label}>关系</div>
              <div className={styles.value} style={{ color: relation ? 'black' : colors.FONT_LIGHT_GRAY1 }}>
                {Global.relations[relation] || '请选择与患者关系'}
              </div>
              <ModalSelect
                data={relations}
                defaultValue={relation}
                visible={visible}
                onClose={() => dispatch({ type: 'patient/setState', payload: { visible: false } })}
                onSelect={(item) => {
                  dispatch({
                    type: 'patient/setState',
                    payload: {
                      patientInfo: {
                        ...patientInfo,
                        relation: item.value,
                      },
                      visible: false,
                    },
                  });
                }}
              />
            </div>
          </Item>
          <InputItem
            {...getFieldProps('name', { initialValue: name })}
            placeholder="请输入患者的真实姓名"
            clear
            maxLength={50}
            disabled={patientInfo.profiles && patientInfo.profiles.length > 0}
          >姓名
          </InputItem>
          <Item>
            <div className={styles.item}>
              <div className={styles.label}>性别</div>
              <Radios
                data={genders}
                value={gender}
                onSelect={(item) => {
                  dispatch({
                    type: 'patient/setState',
                    payload: {
                      patientInfo: {
                        ...patientInfo,
                        gender: item.value,
                      },
                    },
                  });
                }}
                containerStyle={{ flex: 1 }}
              />
            </div>
          </Item>
          <InputItem
            {...getFieldProps('idNo', { initialValue: idNo })}
            placeholder="请输入患者的真实身份证号"
            clear
            maxLength={18}
            disabled={patientInfo.profiles && patientInfo.profiles.length > 0}
          >身份证号
          </InputItem>
          <InputItem
            {...getFieldProps('mobile', { initialValue: mobile })}
            placeholder="请输入手机号码"
            clear
            // type="phone"
            maxLength={11}
          >手机号
          </InputItem>
          <InputItem
            {...getFieldProps('address', { initialValue: address })}
            placeholder="请输入联系地址"
            clear
            maxLength={200}
          >联系地址
          </InputItem>
        </List>
        {patientInfo.id ? (
          <div className={classnames(styles.flexRow, styles.noticeContainer)}>
            <span className={styles.noticeTitle}>注意：</span>
            <span className={styles.noticeContent}>就诊人已经绑定就诊卡时，姓名及身份证号不允许修改！</span>
          </div>
        ) : null}
        <Button
          type="primary"
          onClick={this.handleSubmit}
          style={{ margin: 15, marginTop: 30 }}
        >
          保存
        </Button>
      </div>
    );
  }
}

EditPatientInfo.propTypes = {
};

const EditPatientInfoWrapper = createForm()(EditPatientInfo);

export default connect(({ base, patient }) => ({ base, patient }))(EditPatientInfoWrapper);
