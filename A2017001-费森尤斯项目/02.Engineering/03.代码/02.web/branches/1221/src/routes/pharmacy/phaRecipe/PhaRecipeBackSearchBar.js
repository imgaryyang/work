/* eslint linebreak-style: ["error", "windows"]*/
import React, { Component } from 'react';
import { Row, Col, Form, Input, Button, Popconfirm, DatePicker } from 'antd';
import DictCheckable from '../../../components/DictCheckable';
import moment from 'moment';
import _ from 'lodash';
const FormItem = Form.Item; 
const RangePicker = DatePicker.RangePicker;
const dateFormat = 'YYYY-MM-DD';
const timeFormat = 'YYYY-MM-DD HH:mm:ss';
class PhaRecipeBackSearchBar extends Component {
  handleSubmit() {
    const onSearch = this.props.onSearch;
    this.props.form.validateFields((err, values) => {
      if (!err && onSearch) {
        this.props.setSearchObjs(values);
        onSearch(this.props.searchObjs);

      } 
    });
  }

  handleReset() {
    this.props.form.resetFields();
    this.props.setTag(null);
    this.props.setSearchObjs(null);
  }

  render() { 
    const { getFieldDecorator } = this.props.form;
    const { dicts, onSearch,
      setSearchObjs, searchObjs, setTag, selectedTag } = this.props;
    const dictProps = {
      dictArray: dicts.APPLY_STATE,
      tagColumn: 'applyState',
      searchObjs,
      selectedTag,
      setTag,
      setSearchObjs,
      onSearch,
      namespace:'phaRecipe',
    };

    return (
      <div className="action-form-wrapper">
        <Row type="flex" justify="left">
          <Col span={12}>
            <DictCheckable {...dictProps} />
          </Col>
        </Row>
        <Row type="flex" justify="center">
          <Col span={24} className="action-form-searchbar">
            <Form inline>
              <FormItem>
                {getFieldDecorator('recipeId')(<Input placeholder="处方号" />)}
              </FormItem>
               <FormItem>
                {getFieldDecorator('patientName')(<Input placeholder="姓名" />)}
              </FormItem>
               <FormItem label="挂号日期">
                {
                  getFieldDecorator('dateRange')(
                    <RangePicker
                      ranges={{ 今天: [moment(), moment()], 本月: [moment(), moment().endOf('month')] }}
                      format={dateFormat}
                      onChange={this.onDateChange}
                    />,
                  )
                }
              </FormItem>
              <FormItem>
                <Button type="primary" onClick={this.handleSubmit.bind(this)}>查询</Button>
              </FormItem>
              <FormItem>
                <Button onClick={this.handleReset.bind(this)}>清空</Button>
              </FormItem>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Form.create()(PhaRecipeBackSearchBar);
