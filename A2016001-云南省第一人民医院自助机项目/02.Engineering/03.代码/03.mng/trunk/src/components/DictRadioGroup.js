import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Radio } from 'antd';
import _ from 'lodash';

const RadioGroup = Radio.Group;

class DictRadioGroup extends Component {

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
        <Radio key={item.columnKey + i} value={item.columnKey} originData={item} >
          {item.columnVal}
        </Radio>,
      );
    }

    return (
      <RadioGroup {...other} >
        { options }
      </RadioGroup>
    );
  }
}

export default connect(({ utils }) => ({ utils }))(DictRadioGroup);

