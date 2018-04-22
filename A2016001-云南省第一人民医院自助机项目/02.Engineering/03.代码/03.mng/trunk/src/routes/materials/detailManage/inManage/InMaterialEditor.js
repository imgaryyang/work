import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Tabs, Row, Col, Button, Modal, DatePicker, Form, Input, Select } from 'antd';
import moment from 'moment';

import { arrayToString } from '../../../../utils/tools';
import { testMobile, testCnIdNo } from '../../../../utils/validation';


const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

function compare(obj, values) {
  for (const key in obj) {
    if (obj[key] !== values[key]) {
      return true;
    }
  }
  return false;
}

class EditorForm extends Component {

  constructor(props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.close = this.close.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentWillMount() {
	  
  }


  reset() {
    this.props.form.resetFields();
  }

  handleCancel() {
    const values = this.props.form.getFieldsValue();
    if (values.bornDate) {
      values.bornDate = values.bornDate.format('YYYY-MM-DD');
    }
    const data = this.props.inMaterialDetail.record;
    const changed = compare(values, data);
    if (changed) {
      Modal.confirm({
        title: '确认',
        content: '放弃保存您的修改？',
        okText: '放弃',
        cancelText: '我再看看',
        onOk: () => { this.close(); },
      });
    } else {
      this.close();
    }
  }

  close() {
    this.props.dispatch({
      type: 'inMaterialDetail/setState',
      payload: {
        record: {},
        spin: false,
        inVisible: false,
      },
    });
    this.props.form.resetFields();
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const newValues = { ...values };
        this.props.dispatch({
          type: 'inMaterialDetail/save',
          params: newValues,
        });
       this.props.form.resetFields();
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { spin, record, inVisible, materials } = this.props.inMaterialDetail;
    const { material, id, inPutAccount } = record;
    const options = materials.map(d => <Option key={d.id}>{d.name}</Option>);
    const title = '入库信息';
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    return (
      <Modal
        width={850}
        title={title}
        visible={inVisible}
        closable
        footer={null}
        maskClosable={false}
        onCancel={this.handleCancel}
      >
        <Spin spinning= {spin} >
          <Form onSubmit={this.handleSubmit}>
          <FormItem style={{ display: 'none' }}>
          {
            getFieldDecorator('id', { initialValue: id || '' })(<Input value={id} />)
          }
          </FormItem>
            <Row>
              <Col span={12}>
                <FormItem label="材料名称" {...formItemLayout}>
                  {
                    getFieldDecorator('material.id', {
                      initialValue: record.material?record.material.id:"" || '',
                      rules: [{ required: true, message: '材料名称不能为空' }],
                    })(<Select disabled={material?true:false}  tabIndex={5}>
		              	  {options}
			      		</Select>)
                  }
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="入库数量" {...formItemLayout}>
                {
                  getFieldDecorator('inPutAccount', {
                    initialValue: inPutAccount || '',
                    rules: [{ required: true, message: '入库数量不能为空' }],
                  })(<Input tabIndex={1} />)
                }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={23} style={{ textAlign: 'right' }} >
                <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }} icon="save" size="large" >保存</Button>
                <Button onClick={this.reset} icon="reload" size="large" >重置</Button>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>
    );
  }
}
const Editor = Form.create()(EditorForm);
export default connect(({ inMaterialDetail, utils }) => ({ inMaterialDetail, utils }))(Editor);

