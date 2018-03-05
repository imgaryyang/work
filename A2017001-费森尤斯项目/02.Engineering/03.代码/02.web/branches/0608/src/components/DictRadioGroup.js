import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Radio } from 'antd';
import _ from 'lodash';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class DictRadioGroup extends Component {

  static propTypes = {
    /**
     * 字典项columnName
     */
    columnName: PropTypes.string.isRequired,

    /**
     * 是否显示为按钮性选项，默认为false
     */
    buttonMode: PropTypes.bool,

    /**
     * 按钮型选项样式
     */
    buttonStyle: PropTypes.object,

    /**
     * 按钮型选项样式
     */
    buttonClass: PropTypes.string,

    /**
     * 字典项返回值域 key | val
     */
    valueField: PropTypes.string,
  };

  static defaultProps = {
    buttonMode: false,
    valueField: 'key',
  };

  render() {
    const { columnName, utils, buttonMode, buttonStyle, buttonClass } = this.props;
    const other = _.omit(this.props, ['columnName', 'dispatch', 'utils', 'buttonMode', 'buttonStyle', 'buttonClass']);
    const dictItems = utils.dicts[columnName];
    const options = [];
    for (let i = 0; dictItems && i < dictItems.length; i += 1) {
      const item = dictItems[i];
      const valueField = this.props.valueField === 'key' ? item.columnKey : item.columnVal;
      if (!buttonMode) {
        options.push(
          <Radio key={item.columnKey + i} value={valueField} originData={item} >
            {item.columnVal}
          </Radio>,
        );
      } else {
        options.push(
          <RadioButton key={item.columnKey + i} value={valueField} originData={item} style={buttonStyle} className={buttonClass} >
            {item.columnVal}
          </RadioButton>,
        );
      }
    }

    return (
      <RadioGroup {...other} >
        { options }
      </RadioGroup>
    );
  }
}

export default connect(({ utils }) => ({ utils }))(DictRadioGroup);

