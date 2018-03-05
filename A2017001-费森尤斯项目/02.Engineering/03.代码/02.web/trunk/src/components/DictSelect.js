import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Select } from 'antd';
import _ from 'lodash';

import { getRandomNum } from '../utils/randomTool';

const Option = Select.Option;

class DictSelect extends Component {

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
    const { columnName, filterOption, showSearch, utils } = this.props;
    const other = _.omit(this.props, ['columnName', 'dispatch', 'filterOption', 'showSearch', 'utils']);
    const dictItems = utils.dicts[columnName];
    const options = [];
    for (let i = 0; dictItems && i < dictItems.length; i += 1) {
      const item = dictItems[i];
      const valueField = this.props.valueField === 'key' ? item.columnKey : item.columnVal;
      options.push(
        <Option key={`${columnName}_${item.columnKey}_${getRandomNum(4)}`} value={valueField} originData={item} >
          {item.columnVal}
        </Option>,
      );
    }

    const defaultFilterOption = (input, option) => {
      /* console.log(input, option); */
      return ((option.props.originData.spellCode
          && option.props.originData.spellCode.toLowerCase().indexOf(input.toLowerCase()) >= 0)
        || (option.props.originData.wbCode
          && option.props.originData.wbCode.toLowerCase().indexOf(input.toLowerCase()) >= 0)
        || (option.props.originData.userCode
          && option.props.originData.userCode.toLowerCase().indexOf(input.toLowerCase()) >= 0)
        || option.props.children.indexOf(input) >= 0);
    };

    return (
      <Select
        showSearch={typeof showSearch === 'undefined' ? true : showSearch}
        filterOption={typeof filterOption === 'function' ? filterOption : defaultFilterOption}
        {...other}
        allowClear
      >
        { options }
      </Select>
    );
  }
}

export default connect(({ utils }) => ({ utils }))(DictSelect);

