import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Card, Checkbox } from 'antd';
import moment from 'moment';

import MedicalCard from '../../../components/ScanMedicalCardInput';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

class SearchBarTop extends Component {
  state = {
    medicalCardRequired: true,
    checked: false,
    disabled: false,
    inputValue: '',
    recipeCheck: '',
  };

  componentWillReceiveProps() {
    const isCheckBox = this.props.isCheckBox;
    if (!isCheckBox) {
      this.state.recipeCheck = '';
    }
  }

  onSelect(value) {
    this.props.dispatch({
      type: 'outpatientCharge/loadData',
      id: value,
    });
  }

  onChange(checkedValues) {
    this.state.recipeCheck = checkedValues;
    this.props.dispatch({
      type: 'outpatientCharge/loadChargeDetail',
      recipes: checkedValues,
    });
  }

  readMedicalCardDone(info) {
    this.props.form.resetFields(['medicalCardNo']);
    this.props.dispatch({
      type: 'outpatientCharge/getCurrentRegId',
      medicalCardNo: info.medicalCardNo,
    });
    this.props.dispatch({
      type: 'outpatientCharge/setState',
      payload: {
        userInfo: { ...this.props.userInfo, ...info },
      },
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { recipeList, userInfo } = this.props;
    let isHaveRecipe = false;
    let plainOptions = [];
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      style: { width: '200px' },
    };
    const checkList = [];
    if (recipeList && recipeList.length > 0) {
      isHaveRecipe = true;
      plainOptions = recipeList.map(
        (row, index) => {
          checkList.push(row[0]);
          return (
                { label: `处方号：${row[0]}(时间:${moment(row[3]).format('YYYY-MM-DD')})`, key: index, value: row[0] }
          );
        },
      );
      // this.state.recipeCheck = checkList;
    }
    return (
      <div>
        <Form inline >
          <Row type="flex" justify="left">
            <Col span={24} style={{ marginBottom: '5px' }} >
              <FormItem label="诊疗卡" {...formItemLayout} >
                {getFieldDecorator('medicalCardNo', {
                  initialValue: userInfo ? userInfo.medicalCardNo : '',
                  rules: [
                      { required: this.state.medicalCardRequired, message: '诊疗卡号不能为空' },
                      { max: 10, message: '诊疗卡长度不能超过10个字符' },
                  ],
                })(
                  <MedicalCard
                    iconOnly
                    maxLength={10}
                    tabIndex={1}
                    readed={this.readMedicalCardDone.bind(this)}
                  />,
                )}
              </FormItem>
              <FormItem style={{ display: 'none' }}>
                {getFieldDecorator('patientId', { initialValue: userInfo ? userInfo.patientId : '' })(<Input />)}
              </FormItem>
              <FormItem label="患者姓名" {...formItemLayout}>
                { getFieldDecorator('name', { initialValue: userInfo ? userInfo.name : '' })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={24} >
              <Card style={{ width: '100%', height: '76px', paddingLeft: '20px' }} className="card-padding-5 card-overflow-auto" >
                {
                  isHaveRecipe ? (
                    <FormItem >
                      <CheckboxGroup options={plainOptions} value={this.state.recipeCheck ? this.state.recipeCheck : checkList} onChange={this.onChange.bind(this)} />
                    </FormItem>
                  ) : <div style={{ lineHeight: '33px' }} >暂无未收费处方信息......</div>
                }
              </Card>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

const searchBarTop = Form.create()(SearchBarTop);
export default connect(
  ({ patient, utils, base }) => ({ patient, utils, base }),
)(searchBarTop);
