import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Button, Modal, notification } from 'antd';
import _ from 'lodash';

const { confirm } = Modal;

class TableDeleteRowsButton extends Component {
  static propTypes = {
    /**
     * 点击确定按钮回调
     */
    onOk: PropTypes.func,

    /**
     * 点击取消按钮回调
     */
    onCancel: PropTypes.func,

    /**
     * 自定义确认标题
     */
    title: PropTypes.node,

    /**
     * 自定义确认内容
     */
    content: PropTypes.node,

    /**
     * 按钮文字，默认显示”删除“
     */
    buttonText: PropTypes.node,

    /**
     * 选中的项
     */
    selectedRows: PropTypes.array,
  };

  static defaultProps = {
    title: '您确定要删除选中的数据吗？',
    content: '',
    selectedRows: [],
    buttonText: '删除',
    onOk: () => {},
    onCancel: () => {},
  };

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.onOk = this.onOk.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  onClick() {
    if (this.props.selectedRows instanceof Array && this.props.selectedRows.length > 0) {
      confirm({
        title: this.props.title,
        content: this.props.content,
        onOk: this.onOk,
        onCancel: this.onCancel,
      });
    } else {
      notification.warning({
        message: '警告!',
        description: '请选择要删除的数据！',
      });
    }
  }

  onOk() {
    if (typeof this.props.onOk === 'function') {
      this.props.onOk.call();
    }
  }

  onCancel() {
    if (typeof this.props.onCancel === 'function') {
      this.props.onCancel.call();
    }
  }

  render() {
    const { buttonText } = this.props;
    const other = _.omit(this.props, ['onOk', 'onCancel', 'onClick', 'title', 'content', 'buttonText', 'selectedRows', 'dispatch']);
    return (
      <Button type="danger" size="large" onClick={this.onClick} {...other} >{buttonText}</Button>
    );
  }
}

export default connect()(TableDeleteRowsButton);

