import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Checkbox } from 'antd';
import _ from 'lodash';

const CheckboxGroup = Checkbox.Group;

class DictCheckboxGroup extends Component {
  static propTypes = {
    /**
     * 字典项columnName
     */
    columnName: PropTypes.string.isRequired,

    /**
     * 字典项返回值域 key | val
     */
    valueField: PropTypes.string,
  };

  static defaultProps = {
    valueField: 'key',
  };

  render() {
    const { columnName, utils } = this.props;
    const other = _.omit(this.props, ['columnName', 'dispatch', 'utils']);
    const dictItems = utils.dicts[columnName];
    const options = [];
    for (let i = 0; dictItems && i < dictItems.length; i += 1) {
      const item = dictItems[i];
      const valueField = this.props.valueField === 'key' ? item.columnKey : item.columnVal;
      options.push({
        label: item.columnVal,
        value: valueField,
        originData: item,
      });
    }

    return (
      <CheckboxGroup options={options} {...other} />
    );
  }
}

export default connect(({ utils }) => ({ utils }))(DictCheckboxGroup);

