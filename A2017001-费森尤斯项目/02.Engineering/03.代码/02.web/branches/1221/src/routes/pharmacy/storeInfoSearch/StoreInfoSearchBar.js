import React, { Component } from 'react';
import { Modal, Row, Col, Form, Input, Button, Select } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class StoreInfoSearchBar extends Component {
  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.resetPage();
        this.props.setSearchObjs(values);
        this.props.onSearch(this.props.searchObjs);
      }
    });
  }

  handlePrint() {
    const { searchObjs } = this.props;
    Modal.confirm({
      content: '确定要打印库存单吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        this.props.dispatch({
          type: 'print/getPrintInfo',
          payload: { code: '011', bizId: searchObjs.deptId },
        });
      },
    });
  }

  handleReset() {
    this.props.form.resetFields();
    this.props.setSearchObjs(null);
    this.props.onSearch();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { hosListData, searchObjs } = this.props;
    console.log(hosListData);
    let flag = '';
    if (searchObjs) {
      const { chanel } = searchObjs;
      flag = chanel;
    }
    let options = [];
    options.push(<Option value=""> 全部</Option>);
    if (hosListData && hosListData.length > 0) {
      for (const hos of hosListData) {
        options.push(<Option value={hos.hosId}> {hos.hosName}</Option>);
      }
    }
    return (
      <div className="action-form-wrapper" style={{ marginBottom: '10px' }} >
        <Row type="flex" justify="left">
          <Col>
            <Form inline>
              <FormItem style={{ paddingRight: '3px' }}>
                { getFieldDecorator('hosId', {
                  initialValue: '',
                })(
                  <Select style={{ width: '200px', paddingRight: '3px' }} disabled={flag ==='person' ? 'true' : ''}  allowClear = 'true'>{options}</Select>,
                  )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('tradeName', {
                  rules: [{ max: 50, message: '查询码不能超过50个字符' }],
                })(<Input placeholder="药品名称/拼音/五笔/编码/条码" style={{ width: '180px' }} maxLength={50} onPressEnter={this.handleSubmit.bind(this)} />)}
              </FormItem>
              <FormItem>
                <Button type="primary" icon="search" onClick={this.handleSubmit.bind(this)}>查询</Button>
              </FormItem>
              <FormItem>
                <Button size="large" icon="reload" onClick={this.handleReset.bind(this)}>清空</Button>
              </FormItem>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Form.create({
  onValuesChange(props, values) {
    props.setSearchObjs(values);
  },
})(StoreInfoSearchBar);
