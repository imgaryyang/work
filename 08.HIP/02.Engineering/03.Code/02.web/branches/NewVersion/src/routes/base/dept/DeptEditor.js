import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Select, Row, Col, Button, Radio } from 'antd';
import { testMobile } from '../../../utils/validation';
import DictSelect from '../../../components/DictSelect';

const FormItem = Form.Item;
// const Option = Select.Option;
const RadioGroup = Radio.Group;

class DeptEditor extends Component {
  constructor(props) {
    super(props);
    this.reset = this.reset.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.handleDeptChange = this.handleDeptChange.bind(this);
  }

  componentWillReceiveProps(props) {
    // 解决校验后接收新表单数据不刷新的问题
    if (this.props.menu && props.menu && (this.props.menu.id !== props.menu.id)) {
      this.props.form.resetFields();
    }
  }

  onChange = (e) => {
    // console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  }

  onCancel() {
    this.props.dispatch({
      type: 'department/setState',
      state: {
        showIconSelecter: false,
      },
    });
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      // console.log('handleSubmit:', values);
      if (!err) {
        this.props.dispatch({
          type: 'department/save',
          params: values,
        });
      }
    });
  }

  /** *科室类别** */
  handleDeptChange(value) {
    this.props.dispatch({
      type: 'department/setDeptType',
      payload: {
        selectedType: value,
      },
    });
  }

  reset() {
    this.props.dispatch({
      type: 'department/setState',
      state: {
        checkedKeys: [],
        selectedNode: {},
        menu: {},
      },
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const menu = this.props.menu || {};
    // console.log('menu:', menu);
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    // 科室类别
    /* const depts = this.props.utils.depts;
    const deptTypes = [];
    for (const key in depts) {
      if (key) {
        const item = depts[key];
        // console.log("item",item)
        if (item.deptType === menu.deptType) {
          menu.deptType = item.title;
        }
        deptTypes.push(
          <Option key={item.deptType} value={item.deptType} >
            {item.title}
          </Option>,
          );
      }
    } */
    // console.log("dic",deptTypes)
    // 排序选项

    return (
      <Form >
        <FormItem style={{ display: 'none' }}>
          {
          getFieldDecorator('id', { initialValue: menu.id })(<Input />)
        }
        </FormItem>
          <Row>

            <Col span={12}>
              <FormItem label="科室名称" {...formItemLayout} >
                {
               getFieldDecorator('deptName', {
                 initialValue: menu.deptName,
                 rules: [
                    { required: true, message: '科室名称不能为空' },
                    { max: 50, message: '科室名称长度不能超过50个汉字' },
                 ],
               })(<Input maxLength={15} tabIndex={0} style={{ width: '100%' }} />)
             }
              </FormItem>

                <FormItem label="科室类型" {...formItemLayout} >
                  {
              getFieldDecorator('deptType', {
                initialValue: menu.deptType,
                rules: [
                  { required: true, message: '科室类型不能为空' },
                ],
              })(<DictSelect
                style={{ width: '100%' }}
                tabIndex={0}
                columnName="DEPT_TYPE"
              />)}
                </FormItem>


                  <FormItem label="是否挂号科室" {...formItemLayout}>
                    {
               getFieldDecorator('isRegdept', {
                 initialValue: menu.isRegdept || '0',
                 rules: [{ required: true }],
               })(<RadioGroup tabIndex={4} >
                 <Radio value="1">是</Radio>
                   <Radio value="0">不是</Radio>
               </RadioGroup>)}
                  </FormItem>
            </Col>

              <Col span={12}>

                <FormItem label="科室别名" {...formItemLayout} >
                  {
               getFieldDecorator('eName', {
                 initialValue: menu.eName,
                 rules: [{ max: 50, message: '科室介绍长度不能超过50个汉字' }],
               })(<Input maxLength={50} tabIndex={1} style={{ width: '100%' }} />)
             }
                </FormItem>
                  <FormItem label="联系电话" {...formItemLayout} help="">
                    {
                getFieldDecorator('linkTel', {
                  initialValue: menu.linkTel,
                  rules: [
                    { max: 11, message: '手机号码长度不能超过11个数字' },
                    {
                      validator: (rule, value, callback) => {
                        if (!testMobile(value)) {
                          callback('不是有效的手机号码');
                        } else {
                          callback();
                        }
                      },
                    },
                  ],
                })(<Input maxLength={11} tabIndex={6} style={{ width: '100%' }} />)
             }
                  </FormItem>
                    <FormItem label="是否生效" {...formItemLayout}>
                      {
               getFieldDecorator('stopFlag', {
                 initialValue: menu.stopFlag || '1',
                 rules: [{ required: true }],
               })(<RadioGroup tabIndex={5}>
                 <Radio value="1">生效</Radio>
                   <Radio value="0">不生效</Radio>
                  </RadioGroup>)}
                    </FormItem>
              </Col>
                <Col span={24} >
                  <FormItem label="科室地址" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                    {
               getFieldDecorator('pAddress', {
                 initialValue: menu.pAddress,
                 rules: [{ max: 100, message: '科室地址长度不能超过100个汉字' }],
               })(<Input maxLength={100} tabIndex={10} style={{ width: '100%' }} />)
             }
                  </FormItem>
                </Col>
                  <Col span={24} >
                    <FormItem label="科室介绍" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} >
                      {
               getFieldDecorator('introduce', {
                 initialValue: menu.introduce,
                 rules: [{ max: 500, message: '科室介绍长度不能超过500个汉字' }],
               })(<Input type="textarea" rows={4} maxLength={500} tabIndex={11} style={{ width: '100%' }} />)
             }
                    </FormItem>
                  </Col>
          </Row>
            <Row>
              <Col span={6}>
                <FormItem label="拼音" {...formItemLayout} style={{ display: 'none' }}>
                  {
               getFieldDecorator('spellCode', {
                 initialValue: menu.spellCode,
               })(<Input disabled />)
             }
                </FormItem>
              </Col>
                <Col span={6}>
                  <FormItem label="五笔" {...formItemLayout} style={{ display: 'none' }}>
                    {
               getFieldDecorator('wbCode', {
                 initialValue: menu.wbCode,
               })(<Input disabled />)
             }
                  </FormItem>
                </Col>
                  <Col span={6}>
                    <FormItem label="科室ID" {...formItemLayout} style={{ display: 'none' }}>
                      {
                getFieldDecorator('deptId', {
                  initialValue: menu.deptId,
                })(<Input disabled tabIndex={3} />)
             }
                    </FormItem>
                  </Col>
                    <Col span={6}>
                      <FormItem label="其他缩写" {...formItemLayout} style={{ display: 'none' }}>
                        {
               getFieldDecorator('customCode', {
                 initialValue: menu.customCode,
               })(<Input tabIndex={9} />)
             }
                      </FormItem>
                    </Col>
            </Row>
              <div style={{ textAlign: 'right' }} >
                <Button type="primary" size="large" onClick={this.handleSubmit.bind(this)} icon="save" >保存</Button>
                  <Button size="large" style={{ marginLeft: '10px' }} onClick={this.reset} icon="reload" >重置</Button>
              </div>
                <div />
      </Form>
    );
  }
}
const DeptEditorForm = Form.create()(DeptEditor);
export default connect(({ department, utils }) => ({ department, utils }))(DeptEditorForm);

