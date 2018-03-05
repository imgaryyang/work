import React, { Component } from 'react';
import moment from 'moment';
import { Row, Col, Form, Button, DatePicker, Icon } from 'antd';
import DictCheckable from '../../../components/DictCheckable';
import DataSourceSelect from '../../../components/DataSourceSelect';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const dateFormat = 'YYYY-MM-DD';
const timeFormat = 'YYYY-MM-DD HH:mm:ss';

class OperBalanceSearchBar extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = ::this.handleSubmit;
    this.handleReset = ::this.handleReset;
    this.onSearch = ::this.onSearch;
    this.setSearchObjs = ::this.setSearchObjs;
    this.onDateChange = ::this.onDateChange;
  }
  onDateChange(dates, dateStrings) {
    const beginTime = moment(dateStrings[0]).startOf('day');
    const endTime = moment(dateStrings[1]).endOf('day');
    const dateRange = {
      dateRange: [beginTime.format(timeFormat), endTime.format(timeFormat)],
    };
    this.setSearchObjs(dateRange);
  }
  onSearch(values) {
    console.log(values);
    this.props.dispatch({
      type: 'operBalance/load',
      payload: { query: values },
    });
  }
  setSearchObjs(searchObj) {
    this.props.dispatch({
      type: 'operBalance/setSearchObjs',
      payload: searchObj,
    });
  }
  setTag(selectedTag) {
    this.props.dispatch({
      type: 'operBalance/setState',
      payload: { selectedTag },
    });
  }
  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
        this.setSearchObjs(values);
        this.onSearch(this.props.searchObjs);
      }
    });
  }

  handleReset() {
    this.props.form.resetFields();
    this.setTag(null);
    this.setSearchObjs(null);
    this.onSearch();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { namespace, dicts, selectedTag, searchObjs } = this.props;
    const dictProps = {
      namespace,
      dictArray: dicts.INVOICE_TYPE,
      tagColumn: 'invoiceSource',
      searchObjs,
      selectedTag,
    };
    const twodictProps = {
      namespace,
      dictArray: dicts.IS_CHECK,
      tagColumn: 'ischeck',
      searchObjs,
      selectedTag,
    };
    return (
      <div className="action-form-wrapper">
        <Row type="flex" justify="left">
          <Col>
            <FormItem style={{ marginBottom: 0 }}>
              {getFieldDecorator('invoiceSource', {
                initialValue: '1',
              })(<DictCheckable {...dictProps} />)}
            </FormItem>
          </Col>
          <Col style={{ marginLeft: 50 }}>
            <FormItem style={{ marginBottom: 0 }}>
              {getFieldDecorator('ischeck', {
                initialValue: false,
              })(<DictCheckable {...twodictProps} />)}
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="center">
          <Col span={24} className="action-form-searchbar">
            <Form inline>
              <FormItem>
                {
                  getFieldDecorator('dateRange')(
                    <RangePicker
                      ranges={{ 今天: [moment(), moment()], 本月: [moment(), moment().endOf('month')] }}
                      format={dateFormat}
                      onChange={this.onDateChange.bind(this)}
                    />,
                  )
                }
              </FormItem>
              <FormItem>
                {getFieldDecorator('invoiceOper', {
                })(
                  <DataSourceSelect
                    placeholder="收款员"
                    showSearch
                    style={{ width: '160px' }}
                    codeName="hcpUserCashier"
                    allowClear = 'true'
                  />,
                )}
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
        </Row>
      </div>
    );
  }
}

export default Form.create()(OperBalanceSearchBar);
