import React, { Component } from 'react';
import _ from 'lodash';
import { Row, Col, Form, Input, InputNumber, Modal, Button, notification, Icon } from 'antd';
import DictCheckable from '../../../components/DictCheckable';
import DataSourceSelect from '../../../components/DataSourceSelect';

const FormItem = Form.Item;
const confirm = Modal.confirm;

class InvoiceMngSearchBar extends Component {

  componentWillReceiveProps(nextProps) {
    /* 通知信息 */
    const { success, msg } = nextProps.result;
    if (!_.isEmpty(nextProps.result)) {
      if (!success) {
        notification.error({
          message: '通知信息',
          description: msg,
          duration: 4,
        });
      }
      this.props.dispatch({
        type: 'invoiceMng/setState',
        payload: { result: {} },
      });
    }
  }

  onSearch(values) {
    this.props.dispatch({
      type: 'invoiceMng/load',
      payload: { query: values },
    });
  }

  setSearchObjs(searchObj) {
    this.props.dispatch({
      type: 'invoiceMng/setSearchObjs',
      payload: searchObj,
    });
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setSearchObjs(values);
        this.onSearch(this.props.searchObjs);
      }
    });
  }

  handleReset() {
    this.props.form.resetFields();
    this.props.dispatch({
      type: 'invoiceMng/setState',
      payload: { selectedTag: '1' },
    });
    this.setSearchObjs(null);
    this.onSearch();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      selectedRowKeys, dicts, namespace, result,
      searchObjs, selectedTag, invoiceStart, invoiceAmount,
    } = this.props;

    const dictProps = {
      namespace,
      dictArray: dicts.INVOICE_TYPE,
      tagColumn: 'invoiceType',
      searchObjs,
      selectedTag,
    };
    const onAdd = () => {
      this.props.form.validateFields((err, values) => {
        if (err) {
          return;
        }
        this.props.dispatch({
          type: 'invoiceMng/save',
          params: values,
        });
        if (_.isEmpty(result)) {
          this.handleReset();
        }
      });
    };
    const onDeleteAll = () => {
      const self = this;
      if (selectedRowKeys && selectedRowKeys.length > 0) {
        confirm({
          title: `您确定要删除选择的${selectedRowKeys.length}条记录吗?`,
          onOk() {
            self.props.dispatch({ type: 'invoiceMng/deleteSelected' });
          },
        });
      } else {
        notification.info({ message: '提示信息：', description: '您目前没有选择任何数据！' });
      }
    };
    const handleStartChange = (value) => {
      const numMount = parseInt((invoiceAmount || 0), 10);
      const numInput = parseInt((value || 0), 10);
      this.props.dispatch({
        type: 'invoiceMng/setState',
        payload: { invoiceStart: numInput },
      });
      this.props.form.setFieldsValue({
        invoiceEnd: (numMount + numInput) - 1,
      });
    };
    const handleAmountChange = (value) => {
      const numStart = parseInt((invoiceStart || 0), 10);
      const numInput = parseInt((value || 0), 10);
      this.props.dispatch({
        type: 'invoiceMng/setState',
        payload: { invoiceAmount: numInput },
      });
      this.props.form.setFieldsValue({
        invoiceEnd: (numStart + numInput) - 1,
      });
    };
    return (
      <div className="action-form-wrapper">
        <Row type="flex" justify="left">
          <Col span={12}>
            <FormItem style={{ marginBottom: 0 }}>
              {getFieldDecorator('invoiceType', {
                initialValue: selectedTag,
              })(<DictCheckable {...dictProps} />)}
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="left">
          <Col span={10} className="action-form-searchbar">
            <Form inline>
              <FormItem>
                {getFieldDecorator('getOper', {
                  rules: [
                    {
                      required: true,
                      message: '领用人不能为空',
                    },
                  ],
                })(
                  <DataSourceSelect
                    placeholder="领用人"
                    showSearch
                    style={{ width: '110px' }}
                    codeName="hcpUserCashier"
                    allowClear = 'true'
                  />,
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('invoiceNo')(<Input placeholder="发票号" />)}
              </FormItem>
              <FormItem>
                <Button type="primary" onClick={this.handleSubmit.bind(this)}>
                  <Icon type="search" />查询
                </Button>
              </FormItem>
              <FormItem>
                <Button onClick={this.handleReset.bind(this)}>
                  <Icon type="reload" />清空
                </Button>
              </FormItem>
            </Form>
          </Col>
          <Col span={14} className="action-form-operating">
            <Form inline>
              <FormItem label="起始号">
                {getFieldDecorator('invoiceStart', {
                  initialValue: invoiceStart,
                  rules: [
                    {
                      required: true,
                      message: '起始号不能为空',
                    },
                  ],
                })(
                  <InputNumber min={0} size="large" tabIndex="2" onChange={handleStartChange.bind(this)} />,
                )}
              </FormItem>
              <FormItem label="数量">
                {getFieldDecorator('invoiceAmount', {
                  initialValue: invoiceAmount,
                })(
                  <InputNumber min={1} size="large" tabIndex="3" onChange={handleAmountChange.bind(this)} />,
                )}
              </FormItem>
              <FormItem label="结束号">
                {getFieldDecorator('invoiceEnd', {
                  initialValue: 0,
                  rules: [
                    {
                      required: true,
                      message: '结束号不能为空',
                    },
                  ],
                })(
                  <InputNumber size="large" tabIndex="4" disabled />,
                )}
              </FormItem>
              <FormItem>
                <Button type="primary" size="large" onClick={onAdd} className="btn-left">
                  <Icon type="plus" />领用
                </Button>
              </FormItem>
              <FormItem>
                <Button type="danger" size="large" onClick={onDeleteAll} className="btn-right">
                  <Icon type="delete" />删除
                </Button>
              </FormItem>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Form.create()(InvoiceMngSearchBar);
