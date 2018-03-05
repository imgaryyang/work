import React from 'react';
import { connect } from 'dva';
import { Button, Row, Form, Input, Col, notification, Modal } from 'antd';
import DictCheckable from '../../../components/DictCheckable';

const FormItem = Form.Item;
const confirm = Modal.confirm;

class ItemInfoOperBar extends React.Component {
  onAdd() {
    this.props.dispatch({ type: 'itemInfo/setState', payload: { visible: true, record: null } });
  }

  onDeleteAll() {
    const self = this;

    const { selectedRowKeys } = this.props.itemInfo;
        console.info(selectedRowKeys);
    if (selectedRowKeys && selectedRowKeys.length > 0) { // selectedRowKeys是跨页的，selectedRows不是
      confirm({
        title: `您确定要删除选择的${selectedRowKeys.length}条记录吗?`,
        onOk() {
          self.props.dispatch({ type: 'itemInfo/deleteSelected' });
        },
      });
    } else {
      notification.warning({
        message: '警告!',
        description: '您目前没有选择任何数据！',
      });
    }
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({ type: 'itemInfo/setSearchObjs', payload: values });
        this.props.dispatch({ type: 'itemInfo/load', payload: { query: this.props.searchObjs } });
      }
    });
  }

  handleReset() {
    this.props.form.resetFields();
    this.props.dispatch({ type: 'itemInfo/setState', payload: { selectedTag: '' } });
    this.props.dispatch({ type: 'itemInfo/setSearchObjs', payload: null });
    this.props.dispatch({ type: 'itemInfo/load' });
  }

  render() {
    const { selectedTag, namespace, query } = this.props.itemInfo;
    const { dicts } = this.props.utils;
    const { getFieldDecorator } = this.props.form;
    const tagColumn = dicts.CLASS_CODE ? [{ columnDis: '维护分类', columnGroup: '项目信息', columnKey: '', columnName: 'CLASS_CODE', columnVal: '全部' }].concat(dicts.CLASS_CODE) : null;
    // { columnDis: "维护分类", columnGroup: "项目信息", columnKey: "", columnName: "CLASS_CODE", columnVal: "全部" }

    const dictProps = {
      namespace,
      dictArray: tagColumn,
      tagColumn: 'classCode',
      searchObjs: query,
      selectedTag,
    };

    return (
      <div className="action-form-wrapper">
        <Row>
          <DictCheckable {...dictProps} />
        </Row>
        <Row>
          <Col span={16} className="action-form-searchbar">
            <Form inline>
              <FormItem>
                {getFieldDecorator('itemName')(<Input placeholder="项目名称/拼音/五笔" onPressEnter={this.handleSubmit.bind(this)}/>)}
              </FormItem>
              <FormItem>
                <Button type="primary" icon="search" onClick={this.handleSubmit.bind(this)}>查询</Button>
              </FormItem>
              <FormItem>
                <Button size="large" icon="reload" onClick={this.handleReset.bind(this)}>清空</Button>
              </FormItem>
            </Form>
          </Col>
          <Col span={8} className="action-form-operating">
            <Button type="primary" size="large" icon="plus" onClick={this.onAdd.bind(this)} className="btn-left">新增</Button>
            <Button type="danger" size="large" icon="delete" onClick={this.onDeleteAll.bind(this)} className="btn-right">删除</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect(({ itemInfo, utils }) => ({ itemInfo, utils }))(Form.create()(ItemInfoOperBar));
