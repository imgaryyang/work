import moment from 'moment';
import React, { Component } from 'react';
import { floor } from 'lodash';
import { Icon, Row, Col, Form, Input, Select, Button, notification, InputNumber } from 'antd';
import { connect } from 'dva';
import DeptSelect from '../../../components/DeptSelect';
import DictSelect from '../../../components/DictSelect';
import MedicalCard from '../../../components/ScanMedicalCardInput';
import CommonItemSearchInput from '../../../components/searchInput/CommonItemSearchInput';
import RegInfoSearchInput from '../../../components/searchInput/RegInfoSearchInput';

const Option = Select.Option;
const FormItem = Form.Item;
const InputGroup = Input.Group;

class PricChargeTop extends Component {

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
  componentWillReceiveProps(nextProps) {
    const clear = nextProps.pricChargeModel.record;
    if (clear === 'clear') {
      this.props.form.resetFields();
      this.props.dispatch({
        type: 'pricChargeModel/setState',
        payload: { record: '' },
      });
    }
  }

  onSelectRegInfo(record) {
    this.props.dispatch({
      type: 'pricChargeModel/getUserInfoByRegId',
      regId: record.regId,
    });
  }

  onSelectCommonItem(record) {
    this.props.dispatch({
      type: 'pricChargeModel/tmpItem',
      addData: record,
    });
  }

  onChangeAmount(e) {
    const stock = this.props.pricChargeModel.tmpItem.stock;
    if (e.target.value < stock) {
      this.props.dispatch({
        type: 'pricChargeModel/updateItem',
        update: { amount: e.target.value },
      });
    } else if (stock !== undefined) {
      notification.info({ message: '提示信息：', description: '输入数量不能大于库存！' });
    }
  }

  onSelectRecipe(e) {
    this.props.dispatch({
      type: 'pricChargeModel/setState',
      payload: {
        currentRecipe: e,
      },
    });
  }
  onClickDept(e) {
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      // TODO:校验更多条件
      if (!values.seeDept || !values.recipeDoc) {
        notification.warning({
          message: '警告',
          description: '请选择开单科室及开单医生！',
        });
        return;
      }
      this.props.dispatch({
        type: 'pricChargeModel/updateItem',
        update: { exeDept: e },
      });
      this.props.dispatch({
        type: 'pricChargeModel/addCharge',
        exeDept: e,
      });
    });
    this.props.form.setFieldsValue({
      dept: e,
    });
  }
  onFeeType(value) {
    this.props.dispatch({
      type: 'pricChargeModel/updateUserInfo',
      user: { feeType: value },
    });
  }
  readMedicalCardDone(info) {
    this.props.form.resetFields(['medicalCardNo']);
    this.props.dispatch({
      type: 'pricChargeModel/getCurrentRegId',
      medicalCardNo: info.medicalCardNo,
    });
    this.props.dispatch({
      type: 'pricChargeModel/setState',
      payload: {
        userInfo: { ...this.props.userInfo, ...info },
      },
    });
  }
  selectDept(value) {
    this.props.form.setFieldsValue({
      recipeDoc: '',
    });
    this.props.form.getFieldValue('dept', value);
    this.props.dispatch({
      type: 'pricChargeModel/updateUserInfo',
      user: { recipeDept: value },
    });
    this.props.dispatch({
      type: 'pricChargeModel/finDoctorsByDept',
      deptId: value,
    });
  }
  selectDoc(value, e) {
    this.props.dispatch({
      type: 'pricChargeModel/updateUserInfo',
      user: { recipeDocId: value, recipeDocName: e.props.children },
    });
  }

  randomRecipe() {
    this.props.dispatch({
      type: 'pricChargeModel/getRecipeId',
    });
  }
  changeDrugDept(e) {
    this.state.deptId = e;
    this.props.form.setFieldsValue({
      exeDept: e,
    });
    this.props.dispatch({
      type: 'pricChargeModel/updateItem',
      update: { exeDept: e },
    });
  }
  changeDrugType(e) {
    this.props.form.setFieldsValue({
      exeDept: '',
      dept: '',
    });
    this.props.dispatch({
      type: 'pricChargeModel/setState',
      payload: { tmpItem: [] },
    });
    this.state.drugFlag = e;
    if (e === '3') {
      this.state.isDrug = false;
    } else {
      this.state.isDrug = true;
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { userInfo, tmpItem, deptDocList, currentRecipe } = this.props.pricChargeModel;
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
        <Row>
          <Col span={5} >
            <FormItem label="就诊类别" {...formItemLayout} >
              { getFieldDecorator('feeType', { initialValue: dicts.dis('FEE_TYPE', userInfo.feeType) })(
                <DictSelect showSearch onSelect={this.onFeeType.bind(this)} columnName="FEE_TYPE" tabIndex="1" placeholder="就诊类别" allowClear = 'true'/>,
              )}
            </FormItem>
          </Col>
          <Col span={5} >
            <FormItem label="诊疗卡" {...formItemLayout} >
              {getFieldDecorator('medicalCardNo', {
                initialValue: userInfo ? userInfo.medicalCardNo : '',
              })(
                <MedicalCard
                  iconOnly
                  maxLength={10}
                  tabIndex={1}
                  readed={this.readMedicalCardDone.bind(this)}
                />,
          )}
            </FormItem>
          </Col>
          <Col span={5} >
            <FormItem label="就诊号" {...formItemLayout} >
              { getFieldDecorator('regId', { initialValue: userInfo ? userInfo.regNo : '' })(
                <RegInfoSearchInput
                  onSelect={this.onSelectRegInfo.bind(this)}
                  allowClear = 'true'
                />,
              )}
            </FormItem>
          </Col>
          <Col span={5} >
            <FormItem label="患者姓名" {...formItemLayout} >
              { getFieldDecorator('name', { initialValue: userInfo && userInfo.name ? `${userInfo.name}(${dicts.dis('SEX', userInfo.sex)})` : '' })(<Input disabled />)}
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
          <Col span={5} >
            <FormItem label="处方分类" {...formItemLayout} >
              { getFieldDecorator('groupType', { initialValue: '1' })(<DictSelect showSearch={false} onChange={this.changeDrugType.bind(this)} columnName="GROUP_TYPE" tabIndex="1" placeholder="处方分类" allowClear = 'true'/>)}
            </FormItem>
          </Col>
          <Col span={5} >
            <FormItem label="处方号" {...formItemLayout} >
              { getFieldDecorator('recipe', { initialValue: currentRecipe })(
                <InputGroup compact >
                  <Select
                    onChange={this.onSelectRecipe.bind(this)}
                    style={{ width: '75%' }}
                    dropdownMatchSelectWidth={false}
                    allowClear = 'true'
                  >{recipeOption}</Select>
                  <Button
                    onClick={this.randomRecipe.bind(this)}
                    style={{ width: '25%', padding: '4px 2px' }}
                    size="large"
                  ><Icon type="arrow-down" /></Button>
                </InputGroup>,
              )}
            </FormItem>
            {/* <FormItem {...{ wrapperCol: { span: 24 } }} >
              { getFieldDecorator('bt')(<Button type="primary" onClick={this.randomRecipe.bind(this)}><Icon type="arrow-down" /></Button>)}
            </FormItem>*/}
          </Col>
          <Col span={5} >
            <FormItem label="开单科室" {...formItemLayout} >
              { getFieldDecorator('seeDept', { initialValue: userInfo ? depts.disDeptName(this.props.utils.deptsIdx, userInfo.recipeDept) : '',
              })(
                <DeptSelect
                  showSearch
                  onSelect={this.selectDept.bind(this)}
                  deptType={['001']}
                  allowClear = 'true'
                />)
              }
            </FormItem>
          </Col>
          <Col span={5} >
            <FormItem label="开单医生" {...formItemLayout} >
              { getFieldDecorator('recipeDoc', { initialValue: userInfo ? userInfo.recipeDocName : '',
              })(<Select
                showSearch
                optionFilterProp="title"
                onSelect={this.selectDoc.bind(this)}
                allowClear = 'true'
              >
                {plainOptions}
              </Select>)}
            </FormItem>
          </Col>
          <Col span={4} >
            <FormItem label="取药药房" {...formItemLayoutLast1} style={{ width: '100%', display: this.state.isDrug ? '' : 'none' }} >
              { getFieldDecorator('dept')(
                <DeptSelect
                  showSearch
                  onChange={this.changeDrugDept.bind(this)}
                  deptType={['005', '004']}
                  allowClear = 'true'
                />)
              }
            </FormItem>
          </Col>
        </Row>

        <Row style={{ marginTop: 5 }}>
          <Col span={5} >
            <FormItem label="名称" {...formItemLayout} >
              { getFieldDecorator('itemName', { initialValue: tmpItem ? tmpItem.itemName : '' })(
                <CommonItemSearchInput
                  onSelect={this.onSelectCommonItem.bind(this)}
                  drugFlag={this.state.drugFlag}
                  deptId={this.state.deptId}
                  allowClear = 'true'
                />,
              )}
            </FormItem>
          </Col>
          <Col span={5} >
            <FormItem label="规格" {...formItemLayout} >
              { getFieldDecorator('specis', { initialValue: tmpItem ? tmpItem.itemSpecs : '' })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={5} >
            <FormItem label="单价" {...formItemLayout} >
              { getFieldDecorator('saleSpice', { initialValue: tmpItem ? tmpItem.salePrice : '' })(
                <Input disabled addonAfter={tmpItem && tmpItem.itemUnit ? `/${tmpItem.itemUnit}` : '-'} />,
              )}
            </FormItem>
          </Col>
          {/* <Col span="1">
            <FormItem {...{ wrapperCol: { span: 24 } }} >
              { getFieldDecorator('unit', { initialValue: tmpItem ? tmpItem.itemUnit : '' })(<Input disabled />)}
            </FormItem>
          </Col>*/}
          <Col span={5} >
            <FormItem label="数量" {...formItemLayout} >
              { getFieldDecorator('amount', { initialValue: '1' })(
                <InputNumber max={tmpItem ? floor(tmpItem.stock / tmpItem.packQty) : ''} style={{ width: '100%' }} onBlur={this.onChangeAmount.bind(this)} />,
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="执行科室" {...formItemLayoutLast1} >
              {getFieldDecorator('exeDept', { initialValue: tmpItem ? depts.disDeptName(this.props.utils.deptsIdx, tmpItem.exeDept) : '' })(
                <DeptSelect
                  onSelect={this.onClickDept.bind(this)}
                  deptType={this.state.isDrug ? this.state.deptList : ['001']}
                  allowClear = 'true'
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
  ({ pricChargeModel, utils }) => ({ pricChargeModel, utils }))(editorForm);
