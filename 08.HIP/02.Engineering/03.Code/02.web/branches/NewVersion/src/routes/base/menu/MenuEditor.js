import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Select, Row, Col, Button, Modal } from 'antd';
import IconSelecter from '../../../components/IconSelecter';
import styles from './Menu.css';

const FormItem = Form.Item;
const Option = Select.Option;

class MenuEditor extends Component {
  constructor(props) {
    super(props);
    this.selectIcon = this.selectIcon.bind(this);
    this.onIconSelected = this.onIconSelected.bind(this);
    this.reset = this.reset.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.clearIcon = this.clearIcon.bind(this);
  }

  componentWillReceiveProps(props) {
    // 解决校验后接收新表单数据不刷新的问题
    if (this.props.menu && props.menu && (this.props.menu.id !== props.menu.id)) {
      this.props.form.resetFields();
    }
  }

  onCancel() {
    this.props.dispatch({
      type: 'mngMenu/setState',
      state: {
        showIconSelecter: false,
      },
    });
  }

  onIconSelected(icon) {
    const { menu } = this.props.mngMenu;
    const newMenu = { ...menu, icon };

    this.props.dispatch({
      type: 'mngMenu/setState',
      state: {
        menu: newMenu,
        showIconSelecter: false,
      },
    });
    /* this.props.form.setFieldsValue({
      "icon": icon
    }); */
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'mngMenu/save',
          params: values,
        });
      }
    });
  }

  selectIcon() {
    this.props.dispatch({
      type: 'mngMenu/setState',
      state: {
        showIconSelecter: true,
      },
    });
  }

  clearIcon() {
    this.onIconSelected('');
  }

  reset() {
    this.props.dispatch({
      type: 'mngMenu/setState',
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
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };

    const { showIconSelecter } = this.props.mngMenu;

    // 排序选项
    let sortIdx = null;
    const sortArr = menu.parent && menu.parent.children ? menu.parent.children : this.props.menus;
    const idxForMap = [];
    for (let i = 0; sortArr && i < sortArr.length; i++) { idxForMap.push(i); }

    if (menu && !menu.id) { idxForMap.push(idxForMap.length); }

    sortIdx = idxForMap.map(
      (row, idx) => {
        return (
          <Option key={`_sort_idx_${idx + 1}`} value={`${idx + 1}`} >{`${idx + 1}`}</Option>
        );
      },
    );

    return (
      <Form>
        <FormItem style={{ display: 'none' }}>
          {
          getFieldDecorator('id', { initialValue: menu.id })(<Input />)
        }
        </FormItem>
        <Row>

          <Col span={24} >
            <FormItem style={{ display: 'none' }} >
              {
                getFieldDecorator('parent', {
                  initialValue: menu.parent && menu.parent.id ? menu.parent.id : '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="父菜单" labelCol={{ span: 3 }} wrapperCol={{ span: 20 }} >
              {
                getFieldDecorator('parentName', {
                  initialValue: menu.parent && menu.parent.id ? `${menu.parent.name}(${menu.parent.alias})` : '',
                })(<Input disabled />)
              }
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem label="名称" {...formItemLayout} >
              {
                getFieldDecorator('name', {
                  initialValue: menu.name,
                  rules: [{ required: true, message: '名称不能为空' }],
                })(<Input />)
              }
            </FormItem>

            <FormItem label="编码" {...formItemLayout} >
              {
                getFieldDecorator('code', {
                  initialValue: menu.code,
                  rules: [{ required: true, message: '编码不能为空' }],
                })(<Input />)
              }
            </FormItem>

            <FormItem label="图标" {...formItemLayout} >
              {/* <Row gutter={10} >
                <Col span={6} >
                  <Button type="dashed" className={styles.iconBtn + (menu.icon ? '' : ` ${styles.blankIconBtn}`)} icon={menu.icon ? menu.icon : 'minus'} onClick={this.selectIcon} />
                </Col>
                <Col span={18} >
                  {
                    getFieldDecorator('icon', {
                      initialValue: menu.icon,
                    })(
                      <Input onClick={this.selectIcon} />,
                    )
                  }
                </Col>
              </Row> */}
              {
                getFieldDecorator('icon', {
                  initialValue: menu.icon,
                })(<Input maxLength={30} />)
              }
            </FormItem>

          </Col>

          <Col span={12}>
            <FormItem label="别名" {...formItemLayout} >
              {
                getFieldDecorator('alias', {
                  initialValue: menu.alias,
                  rules: [{ required: true, message: '别名不能为空' }],
                })(<Input />)
              }
            </FormItem>

            <FormItem label="路径" {...formItemLayout} >
              {
                getFieldDecorator('pathname', {
                  initialValue: menu.pathname,
                  rules: [{ required: true, message: '别名不能为空' }],
                })(<Input />)
              }
            </FormItem>

            <FormItem label="排序" {...formItemLayout} >
              {
                getFieldDecorator('sort', {
                  initialValue: menu.sort ? `${menu.sort}` : '',
                  rules: [{ required: true, message: '排序不能为空' }],
                })(
                  <Select >{ sortIdx }</Select>,
                )
              }
            </FormItem>
          </Col>

        </Row>
        <Row>
          <Col span={23} style={{ textAlign: 'right' }} >
            <Button onClick={this.handleSubmit.bind(this)} style={{ marginRight: '10px' }} icon="save" size="large" type="primary" >保存</Button>
            <Button onClick={this.reset} icon="reload" size="large" >重置</Button>
          </Col>
        </Row>

        <Modal visible={showIconSelecter} title="图标选择器" onCancel={this.onCancel} footer={null} width="600px" maskClosable >
          <div style={{ height: '400px', overflow: 'auto' }} >
            <IconSelecter onSelected={this.onIconSelected} selected={menu.icon} />
          </div>
          <div style={{ textAlign: 'center', paddingTop: '25px' }} >
            <Button style={{ width: '500px' }} size="large" onClick={this.clearIcon} >清除</Button>
          </div>
        </Modal>
      </Form>
    );
  }
}

const MenuEditorForm = Form.create()(MenuEditor);
export default connect(({ mngMenu }) => ({ mngMenu }))(MenuEditorForm);

