import React, { Component, PropTypes } from 'react';
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
  };

  render() {
    const { columnName, utils } = this.props;
    const other = _.omit(this.props, ['columnName', 'dispatch', 'utils']);
    const dictItems = utils.dicts[columnName];
    const options = [];
    for (let i = 0; dictItems && i < dictItems.length; i += 1) {
      const item = dictItems[i];
      options.push(
        {
          label: item.columnVal,
          value: item.columnKey,
          originData: item,
        },
      );
    }

    return (
      <CheckboxGroup options={options} {...other} />
    );
  }
}

export default connect(({ utils }) => ({ utils }))(DictCheckboxGroup);

