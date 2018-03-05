import { connect } from 'dva';
import React, { Component } from 'react';
import { Button, Row, Col, Icon, Form, Input } from 'antd';
import _ from 'lodash';

import DictCheckboxGroup from '../../../components/DictCheckboxGroup';
import DelRowsBtn from '../../../components/TableDeleteRowsButton';
import DictSelect from '../../../components/DictSelect';

const FormItem = Form.Item;

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.onSearch = ::this.onSearch;
    this.onAdd = ::this.onAdd;
    this.onDeleteSelected = ::this.onDeleteSelected;
  }

  onSearch() {
    this.props.form.validateFields((err, values) => {
      // console.log(values);
      if (err) return;
      this.props.dispatch({
        type: 'company/load',
        payload: {
          query: values,
          startFrom0: true,
        },
      });
    });
  }

  onAdd() {
    this.props.dispatch({
      type: 'company/setState',
      payload: {
        record: {},
        visible: true,
      },
    });
  }

  onDeleteSelected() {
    const { selectedRowKeys } = this.props.company;
    if (selectedRowKeys && selectedRowKeys.length > 0) {
      this.props.dispatch({ type: 'company/deleteSelected' });
    }
  }

  render() {
    const { company, form } = this.props;
    const { query, selectedRowKeys } = company;
    const { getFieldDecorator } = form;
    // console.log('query in SearchBar.render():', query);
    const formItemLayout = {
      labelCol: { span: 0 },
      wrapperCol: { span: 22 },
    };
    const formItemLayoutWithLabel = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const formItemLayoutWithLabel1 = {
      labelCol: { span: 7 },
      wrapperCol: { span: 16 },
    };

    return (
      <Form inline style={{ marginBottom: '10px' }} >
        <Row>
          <Col span={18} >
            <FormItem label="服务范围" {...formItemLayoutWithLabel} style={{ width: '260px' }} >
              { getFieldDecorator('services', {
                initialValue: _.toArray(query.services),
              })(<DictCheckboxGroup
                columnName="COMPANY_SERVICES"
              />)}
            </FormItem>
              <FormItem label="厂商类型" {...formItemLayoutWithLabel1} style={{ width: '230px' }} >
                { getFieldDecorator('companyType', {
                initialValue: _.toArray(query.companyType),
              })(<DictCheckboxGroup
                columnName="COMPANY_TYPE"
              />)}
              </FormItem>
            {/* <FormItem {...formItemLayout} >
              { getFieldDecorator('companyType', {
                initialValue: query.companyType,
              })(
                <DictSelect
                  columnName="COMPANY_TYPE"
                  allowClear
                  placeholder="厂商分类"
                  style={{ width: '85px' }}
                  onPressEnter={this.onSearch}
                />,
              )}
            </FormItem> */}
              <FormItem {...formItemLayout} >
                { getFieldDecorator('companyName', {
                initialValue: query.companyName,
              })(<Input
                maxLength={100}
                style={{ width: '130px' }}
                placeholder="名称/拼音/五笔/自定义"
                onPressEnter={this.onSearch}
              />)}
              </FormItem>
                <FormItem {...formItemLayout} >
                  { getFieldDecorator('stopFlag', {
                initialValue: query.stopFlag,
              })(<DictSelect
                columnName="STOP_FLAG"
                allowClear
                placeholder="停用标志"
                style={{ width: '85px' }}
                onPressEnter={this.onSearch}
              />)}
                </FormItem>
                  <FormItem {...formItemLayout} >
                    <Button type="primary" icon="search" onClick={this.onSearch} >搜索</Button>
                  </FormItem>
          </Col>
            <Col span={6} style={{ textAlign: 'right' }} >
              <Button type="primary" size="large" onClick={this.onAdd} style={{ marginRight: '10px' }} >
                <Icon type="plus" />新增
              </Button>
              {/* <DelRowsBtn onOk={this.onDeleteSelected} selectedRows={selectedRowKeys} icon="delete" /> */}
            </Col>
        </Row>
      </Form>
    );
  }
}

const SearchBarForm = Form.create()(SearchBar);
export default connect(({ company }) => ({ company }))(SearchBarForm);
