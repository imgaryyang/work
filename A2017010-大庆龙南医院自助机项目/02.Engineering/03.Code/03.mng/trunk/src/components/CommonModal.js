import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal } from 'antd';
import _ from 'lodash';

/**
 * @Author xlbd
 * @Desc CommonModal 通用模态框组件，适用新增／修改触发模态框
 * @Props namespace [Model namespace]
 * @Props form [Form.create API]
 * @Props formCache [form.fieldsValue]
 * @Model utils.record isEmpty - 新增 !isEmpty - 修改
 */

class CommonModal extends Component {

  constructor(props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleAfterClose = this.handleAfterClose.bind(this);
  }

  state = {
    newKey: _.random(10000),
  }

  componentDidMount() {
    const formCache = this.props.form.getFieldsValue();
    const { namespace } = this.props;
    if (_.isEmpty(this.props.record)) {
      this.props.dispatch({
        type: `${namespace}/setState`,
        payload: { formCache },
      });
    }
  }

  handleCancel(e) {
    e.preventDefault();
    const formData = this.props.form.getFieldsValue();
    const { record } = this.props.utils;
    const { formCache } = this.props;
    // 如果匹配则无变化，反之有变化。
    const changed = _.isEmpty(record)
      ? !_.isMatch(formCache, formData)
      : !_.isMatch(record, formData);

    if (changed) {
      Modal.confirm({
        title: '确认',
        content: '放弃保存您的修改？',
        okText: '放弃',
        cancelText: '我再看看',
        onOk: () => {
          this.handleClose();
        },
      });
    } else {
      this.handleClose();
    }
  }

  handleClose() {
    const { namespace } = this.props;
    this.props.dispatch({
      type: `${namespace}/setState`,
      payload: { visible: false },
    });
    this.handleReset();
  }

  handleReset() {
    this.props.form.resetFields();
  }

  handleAfterClose() {
    this.props.dispatch({
      type: 'utils/setState',
      payload: { record: {} },
    });
    this.handleReset();
  }

  render() {
    const { visible, children } = this.props;
    const { newKey } = this.state;
    const others = _.omit(this.props, ['namespace', 'form', 'formCache', 'children']);

    return (
      <Modal
        visible={visible}
        closable
        footer={null}
        maskClosable={false}
        onCancel={this.handleCancel}
        afterClose={this.handleAfterClose}
        key={newKey}
        {...others}
      >
        {children}
      </Modal>
    );
  }
}

export default connect(({ utils }) => ({ utils }))(CommonModal);
