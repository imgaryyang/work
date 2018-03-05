/**
 * 业务操作成功提示单据打印公用组件
 * added by BLB
 */
import { connect } from 'dva';
import React, { Component } from 'react';
import { Row, Col, Button, Form, Input, InputNumber, Icon, Modal, Spin,DatePicker,notification } from 'antd';

class BizPrintAlert extends Component {
  	
  constructor(props) {
    super(props);
    this.handleSubmit = ::this.handleSubmit;
    this.handleCancel = ::this.handleCancel;
  }

  handleSubmit() {
	  const { bizPrintAlertNamespace, bizPrintAlertParams } = this.props;
	  
      this.props.dispatch({
        type: 'print/getPrintInfo', payload: {code: bizPrintAlertParams.tmplateCode, bizId: bizPrintAlertParams.bizCode}
      });
      
      this.props.dispatch({
          type: bizPrintAlertNamespace + '/setState',
          payload: {
        	  bizPrintAlertParams: { 
				visible: false	
			  }
          },
      });
  }

  handleCancel() {
	const { bizPrintAlertNamespace } = this.props;
	  
    this.props.dispatch({
      type: bizPrintAlertNamespace + '/setState',
      payload: {
    	 bizPrintAlertParams: { 
			visible: false					
		 }
      },
    });
  }

  render() {
    const { bizPrintAlertParams } = this.props;
    console.log('bizPrintAlertParams', bizPrintAlertParams);
      
    const title = bizPrintAlertParams.bizTip +  '，是否打印？';

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
        visible={bizPrintAlertParams.visible}
        closable
        footer={null}
        maskClosable={false}
        wrapClassName="vertical-center-modal" // modal-padding-0
        onCancel={this.handleCancel}
      > 
          <Form layout="inline" >            
            <Row>
              <Col span={24}>
              {bizPrintAlertParams.bizCodeLabel}: {bizPrintAlertParams.bizCode}       
              <br/><br/><br/><br/>
              </Col>
            </Row>
            
            <div style={{ textAlign: 'right' }} >
              <Button size="large" onClick={this.handleCancel}>
                <Icon type="close" />暂不打印
              </Button>&nbsp;&nbsp;
              <Button size="large" type="primary" onClick={this.handleSubmit} style={{ marginRight: '10px' }}>
              <Icon type="printer" />现在打印
              </Button>
            </div>
          </Form>
        
      </Modal>
    );
  }
}

export default connect(({ print }) => ({ print })) (BizPrintAlert);
