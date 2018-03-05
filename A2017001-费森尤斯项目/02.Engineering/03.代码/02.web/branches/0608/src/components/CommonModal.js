import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal } from 'antd';
import _ from 'lodash';
import { is } from 'immutable';
import keymaster from 'keymaster';

/**
 * @Author xlbd
 * @Desc CommonModal 通用模态框组件，适用新增／修改触发模态框
 * @Props namespace [Model namespace]
 * @Props form [Form.create API]
 * @Props formCache [form.fieldsValue]
 * @Props shortcuts 快捷键绑定
 * @Model utils.record isEmpty - 新增 !isEmpty - 修改
 * @Func submit 提交操作
 * @Func reset 重置操作
 */

class CommonModal extends Component {

  constructor(props) {
    super(props);
    this.handleCancel = ::this.handleCancel;
    this.handleClose = ::this.handleClose;
    this.handleReset = ::this.handleReset;
    this.handleAfterClose = ::this.handleAfterClose;
  }

  state = {
    newKey: _.random(10000),
  }

  componentWillMount() {
    const formCache = this.props.form.getFieldsValue();
    const { namespace } = this.props;
    if (_.isEmpty(this.props.record)) {
      this.props.dispatch({
        type: `${namespace}/setState`,
        payload: { formCache },
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const thisProps = this.props || {};
    const thisState = this.state || {};

    if (Object.keys(thisProps).length !== Object.keys(nextProps).length ||
        Object.keys(thisState).length !== Object.keys(nextState).length) {
      return true;
    }

    for (const key in _.omit(nextProps, ['style', 'form'])) {
      if (!is(thisProps[key], nextProps[key])) {
        return true;
      }
    }

    for (const key in nextState) {
      if (thisState[key] !== nextState[key] || !is(thisState[key], nextState[key])) {
        return true;
      }
    }

    return false;
  }

  componentWillUpdate(nextProps) {
    const { namespace, submit, reset } = this.props;
    if (nextProps.visible && nextProps.shortcuts) {
      console.log('keymaster enter');
      keymaster.setScope(namespace);
      keymaster('⌥+s alt+s', namespace, () => submit());
      keymaster('⌥+r alt+r', namespace, () => reset());
      this.props.dispatch({
        type: 'utils/setState',
        payload: { shortcuts: false },
      });
      console.log('keymaster exit');
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
    const { namespace } = this.props;
    this.props.dispatch({
      type: 'utils/setState',
      payload: { record: {} },
    });
    this.handleReset();
    keymaster.unbind('⌥+s alt+s', namespace);
    keymaster.unbind('⌥+r alt+r', namespace);
    keymaster.deleteScope(namespace);
  }

  render() {
    const { newKey } = this.state;
    const { visible, children } = this.props;
    const others = _.omit(this.props, ['namespace', 'form', 'formCache', 'children', 'submit', 'reset', 'shortcuts']);

    return (
      <Modal
        closable
        key={newKey}
        footer={null}
        visible={visible}
        maskClosable={false}
        onCancel={this.handleCancel}
        afterClose={this.handleAfterClose}
        {...others}
      >
        {children}
      </Modal>
    );
  }
}

export default connect(({ utils }) => ({ utils }))(CommonModal);
