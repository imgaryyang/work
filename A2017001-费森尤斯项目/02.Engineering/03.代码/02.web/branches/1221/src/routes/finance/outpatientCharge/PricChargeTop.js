import moment from 'moment';
import React, { Component } from 'react';
import { Icon, Row, Col, Form, Input, Select, Button, InputNumber, notification } from 'antd';
import { connect } from 'dva';
import { isObject, floor } from 'lodash';
import DictSelect from '../../../components/DictSelect';
import DeptSelect from '../../../components/DeptSelect';
import CommonItemSearchInput from '../../../components/searchInput/CommonItemSearchInput';

const Option = Select.Option;
const FormItem = Form.Item;
const InputGroup = Input.Group;

class PricChargeTop extends Component {

  constructor(props) {
    super(props);
    this.close = this.close.bind(this);
  }
  state = {
    medicalCardRequired: true,
    checked: false,
    disabled: false,
    inputValue: '',
    drugFlag: '1',
    recipe: [],
    isDrug: true,
    deptList: ['005', '004'],
    deptId: '',
  };
  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['FEE_TYPE', 'SEX', 'GROUP_TYPE'],
    });
  }
  onSelect(record) {
    this.props.dispatch({
      type: 'outpatientCharge/tmpItem',
      addData: record,
    });
  }
  onSelectCommonItem(record) {
    this.props.dispatch({
      type: 'outpatientCharge/tmpItem',
      addData: record,
    });
  }
  onChangeAmount(e) {
    
    this.props.dispatch({
      type: 'outpatientCharge/updateItem',
      update: { amount: e.target.value },
    });
  }
  onChangeDept() {
    this.props.dispatch({
      type: 'outpatientCharge/addCharge',
    });
  }


  onClickDept(e) {
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      if (!values.seeDept || !values.recipeDoc) {
        notification.warning({
          message: '警告',
          description: '请选择开单科室及开单医生！',
        });
        return;
      }
      this.props.dispatch({
        type: 'outpatientCharge/updateItem',
        update: { exeDept: e },
      });
      this.props.dispatch({
        type: 'outpatientCharge/addCharge',
        exeDept: e,
      });
    });
    this.props.form.setFieldsValue({
      dept: e,
    });
  }

  onSelectRecipe(e) {
    this.props.dispatch({
      type: 'outpatientCharge/setState',
      payload: {
        currentRecipe: e,
      },
    });
  }
  handleChange(value) {
    if (!isObject(value)) {
      this.props.dispatch({
        type: 'outpatientCharge/loadOptions',
        spellCode: value,
      });
    }
  }
  randomRecipe() {
    this.props.dispatch({
      type: 'outpatientCharge/getRecipeId',
    });
  }
  changeDrugType(e) {
    this.state.drugFlag = e;
    if (e === '3') {
      this.state.isDrug = false;
    } else {
      this.state.isDrug = true;
    }
  }

  changeDrugDept(e) {
    this.state.deptId = e;
    this.props.form.setFieldsValue({
      exeDept: e,
    });
    this.props.form.getFieldValue('exeDept', e);
    this.props.dispatch({
      type: 'outpatientCharge/updateItem',
      update: { exeDept: e },
    });
  }
  close() {
    this.props.dispatch({
      type: 'outpatientCharge/setState',
      payload: { record: null },
    });
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({ type: 'outpatientCharge/save', params: values });
      }
    });
  }
  selectDept(value) {
    this.props.form.setFieldsValue({
      recipeDoc: '',
    });
    this.props.dispatch({
      type: 'outpatientCharge/updateUserInfo',
      user: { recipeDept: value },
    });
    this.props.dispatch({
      type: 'outpatientCharge/finDoctorsByDept',
      deptId: value,
    });
  }
  selectDoc(value) {
    this.props.dispatch({
      type: 'outpatientCharge/updateUserInfo',
      user: { recipeDoc: value },
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { userInfo, tmpItem, currentRecipe, deptDocList } = this.props.outpatientCharge;
    const { depts, dicts } = this.props.utils;
    let recipeList = this.state.recipe;
    let recipeOption = [];

    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      style: { width: '100%' },
    };
    const formItemLayoutLast1 = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
      style: { width: '100%' },
    };

    if (currentRecipe) {
      if (recipeList.length === 0) {
        recipeList.push(currentRecipe);
      } else if (!recipeList.contains(currentRecipe)) {
        recipeList.push(currentRecipe);
      }
    }
    let plainOptions = [];
    if (deptDocList && deptDocList.length > 0) {
      plainOptions = deptDocList.map((row) => {
        return (
          <Option key={row.name} title={row.name} value={row.id}>{row.name}</Option>
        );
      },
      );
    }
    if (recipeList && recipeList.length > 0) {
      recipeOption = recipeList.map((row) => {
        return (
          <Option key={row} title={row} value={row}>{row}</Option>
        );
      },
      );
    }
    return (
      <Form inline style={{ width: '100%' }} >
        <Row style={{ paddingTop: '5px' }} >
          <Col span={5}>
            <FormItem label="就诊类别" {...formItemLayout} >
              { getFieldDecorator('payType', { initialValue: dicts.dis('FEE_TYPE', userInfo.payType) })(<DictSelect showSearch columnName="FEE_TYPE" tabIndex="1" placeholder="就诊类别" />)}
            </FormItem>
          </Col>
          <Col span={5} >
            <FormItem label="诊疗卡" {...formItemLayout} >
              {getFieldDecorator('medicalCardNo', {
                initialValue: userInfo ? userInfo.medicalCardNo : '',
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={5} >
            <FormItem label="就诊号" {...formItemLayout} >
              { getFieldDecorator('regNo', { initialValue: userInfo ? userInfo.regNo : '' })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={5} >
            <FormItem label="患者姓名" {...formItemLayout} >
              { getFieldDecorator('name', { initialValue: `${userInfo ? userInfo.name : ''}(${userInfo ? (dicts.dis('SEX', userInfo.sex)) : ''})` })(<Input disabled />)}
            </FormItem>
            <FormItem style={{ display: 'none' }} >
              { getFieldDecorator('sex', { initialValue: userInfo ? (dicts.dis('SEX', userInfo.sex)) : '' })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={4} >
            <FormItem label="出生日期" {...formItemLayoutLast1} >
              { getFieldDecorator('birth', { initialValue: userInfo ? (userInfo.birth ? moment(userInfo.birth).format('YYYY-MM-DD') : '') : '' })(<Input disabled />)}
            </FormItem>
          </Col>
        </Row>

        <Row style={{ marginTop: 5 }}>
          <Col span={5}>
            <FormItem label="处方分类" {...formItemLayout} >
              { getFieldDecorator('groupType', { initialValue: '1' })(
                <DictSelect showSearch={false} onChange={this.changeDrugType.bind(this)} columnName="GROUP_TYPE" tabIndex="1" placeholder="处方分类" />,
              )}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem label="处方号" {...formItemLayout} >
              { getFieldDecorator('recipe', { initialValue: currentRecipe })(
                <InputGroup compact >
                  <Select
                    onChange={this.onSelectRecipe.bind(this)}
                    style={{ width: '75%' }}
                    dropdownMatchSelectWidth={false}
                  >{recipeOption}</Select>
                  <Button
                    onClick={this.randomRecipe.bind(this)}
                    style={{ width: '25%', padding: '4px 2px' }}
                    size="large"
                  ><Icon type="arrow-down" /></Button>
                </InputGroup>,
              )}
            </FormItem>
          </Col>
          {/* <Col span="1">
            <FormItem {...{ wrapperCol: { span: 24 } }} style={{ width: '100%' }} >
              { getFieldDecorator('bt')(<Button type="primary" onClick={this.randomRecipe.bind(this)}><Icon type="arrow-down" /></Button>)}
            </FormItem>
          </Col>*/}
          <Col span={5}>
            <FormItem label="开单科室" {...formItemLayout} >
              { getFieldDecorator('seeDept', { initialValue: userInfo ? depts.disDeptName(this.props.utils.deptsIdx, userInfo.recipeDept) : '' })(
                <DeptSelect
                  showSearch
                  onSelect={this.selectDept.bind(this)}
                  deptType={['001']}
                />,
              )}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem label="开单医生" {...formItemLayout} >
              { getFieldDecorator('recipeDoc', { initialValue: userInfo ? userInfo.recipeDocName : '' })(
                <Select
                  showSearch
                  optionFilterProp="title"
                  onSelect={this.selectDoc.bind(this)}
                >
                  {plainOptions}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="取药药房" {...formItemLayoutLast1} style={{ width: '100%', display: this.state.isDrug ? '' : 'none' }} >
              { getFieldDecorator('dept', { initialValue: userInfo ? depts.disDeptName(this.props.utils.deptsIdx, tmpItem.exeDept) : '' })(
                <DeptSelect
                  showSearch
                  onChange={this.changeDrugDept.bind(this)}
                  deptType={['005', '004']}
                />)
              }
            </FormItem>
          </Col>
        </Row>

        <Row style={{ marginTop: 5 }}>
          <Col span={5}>
            <FormItem label="名称" {...formItemLayout} >
              { getFieldDecorator('itemName', { initialValue: tmpItem ? tmpItem.itemName : '' })(
                <CommonItemSearchInput
                  onSelect={this.onSelectCommonItem.bind(this)}
                  drugFlag={this.state.drugFlag}
                  deptId={this.state.deptId}
                />,
              )}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem label="规格" {...formItemLayout} >
              { getFieldDecorator('specis', { initialValue: tmpItem ? tmpItem.itemSpecs : '' })(
                <Input disabled />,
              )}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem style={{ display: 'none' }} >
              { getFieldDecorator('unit', { initialValue: tmpItem ? tmpItem.itemUnit : '' })(<Input disabled />)}
            </FormItem>
            <FormItem label="单价" {...formItemLayout} >
              { getFieldDecorator('saleSpice', { initialValue: tmpItem && typeof tmpItem.salePrice === 'number' ? tmpItem.salePrice.formatMoney(4) : '' })(
                <Input disabled addonAfter={tmpItem && tmpItem.itemUnit ? `/${tmpItem.itemUnit}` : '-'} />,
              )}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem label="数量" {...formItemLayout} >
              { getFieldDecorator('amount', { initialValue: '1' })(
                <InputNumber max={tmpItem ? floor(tmpItem.stock / tmpItem.packQty) : ''} style={{ width: '100%' }} onBlur={this.onChangeAmount.bind(this)} />,
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="执行科室" {...formItemLayoutLast1} >
              {getFieldDecorator('exeDept', { initialValue: depts.disDeptName(this.props.utils.deptsIdx, tmpItem ? tmpItem.exeDept : '') })(
                <DeptSelect
                  onSelect={this.onClickDept.bind(this)}
                  deptType={this.state.isDrug ? this.state.deptList : ['001']}
                />)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}

const editorForm = Form.create()(PricChargeTop);
export default connect(
  ({ outpatientCharge, utils }) => ({ outpatientCharge, utils }))(editorForm);
