import React, { Component } from 'react';
import { Row, Col, Form, Input, Button } from 'antd';
import AsyncTreeCascader from '../../../components/AsyncTreeCascader';

const FormItem = Form.Item;

class CheckSearchBar extends Component {

  handleSubmit() {
    const search = this.props.onSearch;
    this.props.form.validateFields((err, values) => {
      if (!err && search) {
        this.props.setSearchObjs(values);
        search(this.props.searchObjs);
      }
    });
  }


  codeChange(e){
    const instrmCode = e.target.value;
    if(instrmCode != null && instrmCode !=''){
       this.props.createCheckInfo(instrmCode);
    }
   }

  handleReset() {
    this.props.form.resetFields();
    this.props.setSearchObjs(null);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { addCheckInfo, deleteCheckInfo, saveCheckInfo, finishCheck, createCheckInfo, bill } = this.props;
    return (
      <div className="action-form-wrapper">
        <Row type="flex" justify="left">
          <Col span={20} className="action-form-searchbar">
            <Form inline >
              <FormItem>
                {getFieldDecorator('tradeName')(<Input placeholder="查询码(名称/编码)" />)}
              </FormItem>
              <FormItem>
                {getFieldDecorator('drugType')(<AsyncTreeCascader dictType="ASSETS_TYPE" placeholder="资产类别" />)}
              </FormItem>
              <FormItem>
                <Button type="primary" onClick={this.handleSubmit.bind(this)} icon="search" >查询</Button>
              </FormItem>
              <FormItem>
                <Button onClick={this.handleReset.bind(this)} icon="reload" >清空</Button>
              </FormItem>
              <FormItem {...{ labelCol: { span: 10 }, wrapperCol: { span: 14 } }} style={{ width: '150px' }}label="盘点单号">
                <span>{ bill }</span>
              </FormItem>
            </Form>
          </Col>
          <Col span={4} className="action-form-operating">
            <FormItem>
                {getFieldDecorator('instrmCode')(<Input placeholder="商品编码" onPressEnter={this.codeChange.bind(this)} style={{ width: '150px' }}/>)}
            </FormItem>
            <Button size="large" className="btn-left" onClick={deleteCheckInfo} icon="delete" >作废</Button>
            <Button type="primary" size="large" className="btn-left" onClick={finishCheck} icon="save" >盘清</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Form.create()(CheckSearchBar);
