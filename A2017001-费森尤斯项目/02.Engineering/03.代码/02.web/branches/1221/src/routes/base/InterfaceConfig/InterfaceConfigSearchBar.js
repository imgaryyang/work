import React, { Component } from 'react';
import _ from 'lodash';
import { Row, Col, Form, Input, Modal, Button, notification, Icon, Select } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const confirm = Modal.confirm; 

class InterfaceConfigSearchBar extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = ::this.handleSubmit;
    this.handleReset = ::this.handleReset;
    this.onSearch = ::this.onSearch;
    this.setSearchObjs = ::this.setSearchObjs;
  }

  onSearch(values) {
    // console.log(values);
    this.props.dispatch({
      type: 'interfaceconfig/load',
      payload: { query: values },
    });
  }
  setSearchObjs(searchObj) {
    this.props.dispatch({
      type: 'interfaceconfig/setSearchObjs',
      payload: searchObj,
    });
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log(values);
        this.setSearchObjs(values);
        this.onSearch(this.props.searchObjs);
      }
    });
  }

  handleReset() {
    this.props.form.resetFields();
    this.setSearchObjs(null);
    this.onSearch(null);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { isSpin, selectedRowKeys, namespace, record, searchObjs, interfaceconfig } = this.props;
    const { hosListData } = interfaceconfig;
    const hosOptios = hosListData.map(elm =>
      <Option key={elm.id} value={elm.id}>
        {elm.hosName}
      </Option>,
    );
    const onAdd = () => {
      this.props.dispatch({ type: 'interfaceconfig/toggleVisible' });
      this.props.dispatch({
        type: 'utils/setState',
        payload: { record: {} },
      });
    };
    return (
      <div className="action-form-wrapper">
        <Row type="flex" justify="center" > 
          <Col span={12} className="action-form-searchbar">
            <Form inline>
              <FormItem>
                {
                  getFieldDecorator('hospital.id', {
                  })(
                    <Select placeholder="所属医院" style={{ width: '180px' }} allowClear >
                      {hosOptios}
                    </Select>,
                  )
                }
              </FormItem>
              <FormItem>
                {getFieldDecorator('bizName')(<Input placeholder="业务名称" onPressEnter={this.handleSubmit} />)}
              </FormItem>
              <FormItem>
                <Button type="primary" onClick={this.handleSubmit}>
                  <Icon type="search" />查询
                </Button>
              </FormItem>
              <FormItem>
                <Button onClick={this.handleReset}>
                  <Icon type="reload" />清空
                </Button>
              </FormItem>
            </Form>    
         </Col> 
          <Col span={12} className="action-form-operating">
            <Button type="primary" size="large" onClick={onAdd.bind(this)} className="btn-left">
              <Icon type="plus" />新增
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

const searchBar= Form.create()(InterfaceConfigSearchBar);
export default connect(
  ({ interfaceconfig }) => ({ interfaceconfig }),
)(searchBar);
