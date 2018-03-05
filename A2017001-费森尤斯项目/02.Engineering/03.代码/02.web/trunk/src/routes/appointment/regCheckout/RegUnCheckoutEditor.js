import React, { Component } from 'react';
import { Row, Col, Form, Card, Button, notification, Icon } from 'antd';
import _ from 'lodash';
import Styles from './RegCheckout.less';

const FormItem = Form.Item;

class EditorForm extends Component {

  constructor(props) {
    super(props);
    this.handleUnCheckout = ::this.handleUnCheckout;
    this.onSearch = ::this.onSearch;
  }

  state = {
    medicalCardRequired: true,
    checked: false,
    disabled: false,
    inputValue: '',
  };

  componentWillReceiveProps(nextProps) {
    if (!_.isEmpty(nextProps.unCheckResult)) {
      this.handleUnCheckResult(nextProps.unCheckResult);
    }
  }

  componentWillUnmount() {
    console.log('component will unmount');
  }

  onSearch = () => {
    const { activeTab, invoiceSource } = this.props;
    this.props.dispatch({
      type: 'regCheckout/load',
      payload: { activeTab, invoiceSource },
    });
  }

  handleUnCheckResult(result) {
    const { success } = result;
    if (success) {
      notification.success({
        message: '通知信息',
        description: '取消结账成功！',
        duration: 4,
      });
      this.props.dispatch({
        type: 'regCheckout/setState',
        payload: { record: {}, feeType: [], payWay: [] },
      });
      // notification.destroy();
    } else {
      notification.error({
        message: '通知信息',
        description: '取消结账失败',
        duration: 4,
      });
      // notification.destroy();
    }
    this.props.dispatch({
      type: 'regCheckout/setState',
      payload: { unCheckResult: {} },
    });
  }

  handleUnCheckout() {
    const { balanceId } = this.props.record;
    this.props.dispatch({
      type: 'regCheckout/unCheckout',
      params: balanceId,
    });
  }
  printInvoice() {
    console.log(this.props.record.balanceId);
    if (this.props.record && this.props.record.balanceId) {
      this.props.dispatch({
        type: 'print/getPrintInfo',
        payload: { code: '007', bizId: this.props.record.balanceId },
      });
    }
  }
  print() {
    console.log(this.props.record.balanceId);
    if (this.props.record && this.props.record.balanceId) {
      this.props.dispatch({
        type: 'print/getPrintInfo',
        payload: { code: '008', bizId: this.props.record.balanceId },
      });
    }
  }
  render() {
    const { record, wsHeight, form, invoiceSource } = this.props;
    const { getFieldDecorator } = form;
    const isDisabled = _.isEmpty(record);

    const formColLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14, style: { paddingLeft: 10 } },
    };

    return (
      <Card style={{ height: `${wsHeight - 67}px` }} bodyStyle={{ padding: 10 }} >
        <Form>
          <div className={Styles.topBtnContainer} >
            <div className="action-form-wrapper">
              <Row type="flex" gutter={24} justify="end">
                <Col className="action-form-operating">
                  <Button type="primary" size="large" onClick={this.onSearch} className="btn-left">
                    <Icon type="search" />查询
                  </Button>
                  <Button
                    type="primary" ghost
                    onClick={this.handleUnCheckout}
                    size="large" className="btn-left"
                    disabled={isDisabled}
                  >
                    <Icon type="pay-circle-o" />取消结账
                  </Button>
                  <Button type="primary" size="large" onClick={this.printInvoice.bind(this)} className="btn-left">
                    <Icon type="printer" />发票打印
                  </Button>
                  <Button type="primary" size="large" onClick={this.print.bind(this)} className="btn-left">
                    <Icon type="printer" />结账单打印
                  </Button>
                </Col>
              </Row>
            </div>
          </div>
          <div className={Styles.topShadow} />
          <div style={{ height: `${wsHeight - 20}px` }} className={Styles.formContainer} >
            <Row>
              <Col span={24}>
                <div className={Styles.fieldSet} >
                  <div />
                  <span>结账信息</span>
                </div>
              </Col>
            </Row>
            <Row className={'checkout-info'}>
              <FormItem style={{ display: 'none' }}>
                {getFieldDecorator('invoiceSource', { initialValue: invoiceSource })(<span />)}
              </FormItem>
              <FormItem style={{ display: 'none' }}>
                {getFieldDecorator('invoiceOper', { initialValue: record.invoiceOper || '' })(<span />)}
              </FormItem>
              <Col span={12} className={Styles.formCol} >
                <FormItem label="开始时间" {...formColLayout} >
                  {getFieldDecorator('beginDate', { initialValue: record.beginDate || '' })(
                    <span className={`${Styles.checkoutSpan} ${Styles.checkoutInfo}`}>
                      {record.beginDate}
                    </span>,
                  )}
                </FormItem>
              </Col>
              <Col span={12} className={Styles.formCol} >
                <FormItem label="收款员" {...formColLayout} >
                  {getFieldDecorator('invoiceOperName', { initialValue: record.invoiceOperName || '' })(
                    <span className={`${Styles.checkoutSpan} ${Styles.checkoutInfo}`}>
                      {record.invoiceOperName}
                    </span>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12} className={Styles.formCol} >
                <FormItem label="结束时间" {...formColLayout} >
                  {getFieldDecorator('endDate', { initialValue: record.endDate || '' })(
                    <span className={`${Styles.checkoutSpan} ${Styles.checkoutInfo}`}>
                      {record.endDate}
                    </span>,
                  )}
                </FormItem>
              </Col>
              <Col span={12} className={Styles.formCol} >
                <FormItem label="结账时间" {...formColLayout} >
                  {getFieldDecorator('checkOutDate', { initialValue: record.checkOutDate || '' })(
                    <span className={`${Styles.checkoutSpan} ${Styles.checkoutInfo}`}>
                      {record.checkOutDate}
                    </span>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12} className={Styles.formCol} >
                <FormItem label="合计金额" {...formColLayout} >
                  {getFieldDecorator('totalAmt', { initialValue: record.totalAmt || '' })(
                    <span className={`${Styles.checkoutSpan} ${Styles.checkoutAmt}`}>
                      {(record.totalAmt || 0).formatMoney()}
                    </span>,
                  )}
                </FormItem>
              </Col>
              <Col span={12} className={Styles.formCol} >
                <FormItem label="票据数量" {...formColLayout} >
                  {getFieldDecorator('totalCount', { initialValue: record.totalCount || '' })(
                    <span className={`${Styles.checkoutSpan} ${Styles.checkoutNum}`}>
                      {record.totalCount || 0}
                    </span>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12} className={Styles.formCol} >
                <FormItem label="最小票据" {...formColLayout} >
                  {getFieldDecorator('minInvoiceNo', { initialValue: record.minInvoiceNo || '' })(
                    <span className={`${Styles.checkoutSpan} ${Styles.checkoutNum}`}>
                      {record.minInvoiceNo}
                    </span>,
                  )}
                </FormItem>
              </Col>
              <Col span={12} className={Styles.formCol} >
                <FormItem label="最大票据" {...formColLayout} >
                  {getFieldDecorator('maxinvoiceNo', { initialValue: record.maxinvoiceNo || '' })(
                    <span className={`${Styles.checkoutSpan} ${Styles.checkoutNum}`}>
                      {record.maxinvoiceNo}
                    </span>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12} className={Styles.formCol} >
                <FormItem label="退费金额" {...formColLayout}>
                  {getFieldDecorator('refundAmt', { initialValue: record.refundAmt || '' })(
                    <span className={`${Styles.checkoutSpan} ${Styles.checkoutAmt}`}>
                      {(record.refundAmt || 0).formatMoney()}
                    </span>,
                  )}
                </FormItem>
              </Col>
              <Col span={12} className={Styles.formCol} >
                <FormItem label="退费票据数量" className={Styles.numLabel} {...formColLayout}>
                  {getFieldDecorator('refundCount', { initialValue: record.refundCount || '' })(
                    <span className={`${Styles.checkoutSpan} ${Styles.checkoutNum}`}>
                      {record.refundCount || 0}
                    </span>,
                  )}
                </FormItem>
              </Col>
            </Row>
          </div>
          <div className={Styles.bottomShadow} />
          <div className={Styles.bottomBtnContainer} />
        </Form>
      </Card>
    );
  }
}

export default Form.create()(EditorForm);
