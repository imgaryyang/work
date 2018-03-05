import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Icon, Modal } from 'antd';
import _ from 'lodash';

const confirm = Modal.confirm;

class TableRowDeleteButton extends Component {

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
  };

  static defaultProps = {
    title: '您确定要删除此项数据吗？',
    content: '',
  };

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.onOk = this.onOk.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  onClick() {
    confirm({
      title: this.props.title,
      content: this.props.content,
      onOk: this.onOk,
      onCancel: this.onCancel,
    });
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
    const { className } = this.props;
    const other = _.omit(this.props, ['onOk', 'onCancel', 'onClick', 'title', 'content', 'className', 'dispatch']);
    return (
      <Icon type="delete" className={`table-row-del-btn ${className || ''}`} onClick={this.onClick} {...other} />
    );
  }
}

export default connect()(TableRowDeleteButton);

