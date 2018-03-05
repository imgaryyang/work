import { connect } from 'dva';
import React, { Component } from 'react';
import { Row, Col, Button, Form, Input, InputNumber, Icon, Modal, Spin,DatePicker,notification } from 'antd';
import moment from 'moment';
import DictCheckboxGroup from '../../../components/DictCheckboxGroup';
import DictRadioGroup from '../../../components/DictRadioGroup';

const FormItem = Form.Item;

class SetStockWarn extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = ::this.handleSubmit;
    this.handleReset = ::this.handleReset;
    this.handleCancel = ::this.handleCancel;
  }

  componentWillReceiveProps(newProps) {
    
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      
      var percent1 = values.percent1;
      var percent2 = values.percent2;
      var proportion = values.proportion;
      
      /*
      console.log('licenseSdate:', sdate);
      console.log('licenseEdate:', edate);
      if(sdate >= edate){
    	  notification.error({
	          message: '提示',
	          description: '证照开始时间必须小于证照结束时间！',
    	  });
    	  return;
      }
      */
      const { user } = this.props.base;
      
      this.props.dispatch({
        type: 'procurePlan/listStockWarnDurg',
        payload:{
	        query:{
	        	comm: percent1 + '/' + percent2 + '/' + proportion,
	        	deptId: user.loginDepartment.id
	        }
        }
      });
    });
  }

  handleReset() {
    this.props.form.resetFields();
  }

  handleCancel() {
    this.props.dispatch({
      type: 'procurePlan/setState',
      payload: {
        isSpin: false,
        editorSpin: false,
        visible: false,
        
      },
    });
    this.props.form.resetFields();
  }

  render() {
    const { procurePlan, form } = this.props;
    const { editorSpin, visible } = procurePlan;
    const { getFieldDecorator } = form;
    const title = '按库存定义生成采购计划';

    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      style: { width: '100%' },
    };

    const formItemLayoutColspan2 = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      style: { width: '100%' },
    };

    return (
      <Modal
        width={600}
        title={title}
        visible={visible}
        closable
        footer={null}
        maskClosable={false}
        wrapClassName="vertical-center-modal" // modal-padding-0
        onCancel={this.handleCancel}
      >
       
          <Form layout="inline" >
            
            <Row>
              <Col span={24} style={{ lineHeight: '28px' }}>
                采购量算法（ 包装单位 ）：
                ( 1 + &nbsp;
                <FormItem>
                { getFieldDecorator('percent1', {
                  initialValue: 50,

                })(
                  <InputNumber min={0} maxLength={128} style={{ width: 64 }} />,
                )}
              </FormItem>% ) * 库存警戒线 - 实际库存 * &nbsp;
                <FormItem> 
                { getFieldDecorator('percent2', {
                  initialValue: 100,
                })(
                  <InputNumber min={0} maxLength={128} style={{ width: 64 }} />,
                )}
              </FormItem>%<br/><br/>
                库存低于：（ 警戒线 * &nbsp;
                <FormItem>
	                { getFieldDecorator('proportion', {
	                  initialValue: 1,
	                })(
	                  <InputNumber min={0} maxLength={128} style={{ width:64 }} />,
	                )}
	              </FormItem>）时采购<br/><br/><br/>
              </Col>
            </Row>
            
            <div style={{ textAlign: 'right' }} >
              <Button size="large" type="primary" onClick={this.handleSubmit} style={{ marginRight: '10px' }}>
                <Icon type="plus" />生成计划
              </Button>
              <Button size="large" onClick={this.handleCancel}>
                <Icon type="close" />取消
              </Button>
            </div>
          </Form>
        
      </Modal>
    );
  }
}

const SetStockWarnForm = Form.create()(SetStockWarn);
export default connect(
  ({ procurePlan, base }) => ({ procurePlan, base }),
)(SetStockWarnForm);
