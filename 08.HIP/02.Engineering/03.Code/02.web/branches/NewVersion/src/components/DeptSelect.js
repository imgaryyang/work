import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Select } from 'antd';

const { Option } = Select;

function filterDeptItems(items, isRegdept) {
  const rtnItems = [];
  for (let j = 0; j < items.length; j += 1) {
    const item = items[j];
    if (typeof isRegdept === 'undefined'
      || typeof item.deptId === 'undefined'
      || (isRegdept === true && item.isRegdept === '1')
      || (isRegdept === false && item.isRegdept === '0')
    ) {
      rtnItems.push(item);
    }
  }
  return rtnItems;
}

class DeptSelect extends Component {
  static propTypes = {
    /**
     * 字典项deptType
     * 为空时显示所有
     */
    deptType: PropTypes.array,

    /**
     * 返回类型
     * id | deptId
     */
    returnType: PropTypes.string,

    /**
     * 是否可挂号科室
     */
    isRegdept: PropTypes.bool,
  };

  static defaultProps = {
    deptType: [],
    returnType: 'id',
    isRegdept: false,
  };

  render() {
    const {
      deptType, showSearch, filterOption,
      utils, returnType, isRegdept, ...other
    } = this.props;
    let deptItems = [];
    let item;
    const options = [];
    // console.log(utils.depts);
    if (this.props.deptType
      && this.props.deptType instanceof Array
      && this.props.deptType.length > 0
    ) { // 如果指定了科室类型
      for (let i = 0; utils && utils.depts && deptType && i < deptType.length; i += 1) {
        const type = deptType[i];
        if (utils.depts[type]) { // 页面刚加载，没数据时跳过
          const items = filterDeptItems(utils.depts[type].children, isRegdept);
          if (items.length > 0) {
            deptItems = deptItems.concat(utils.depts[type].children);
          }
        }
      }
    } else { // 未指定科室类型，显示所有
      for (const key in utils.depts) {
        if (key) {
          // console.log(key);
          const items = filterDeptItems(utils.depts[key].children, isRegdept);
          if (items.length > 0) {
            deptItems = deptItems.concat(utils.depts[key].children);
          }
        }
      }
    }
    // console.log('deptItems in DeptSelect:', deptItems);
    for (let i = 0; deptItems && i < deptItems.length; i += 1) {
      item = deptItems[i];
      const value = returnType === 'deptId' ? item.deptId : item.value;
      options.push(<Option key={item.key + i} value={value} originData={item} >{item.title}</Option>);
    }

    const defaultFilterOption = (input, option) => {
      return (option.props.originData.title
          && option.props.originData.title.toLowerCase().indexOf(input.toLowerCase()) >= 0)
        || (option.props.originData.spellCode
          && option.props.originData.spellCode.toLowerCase().indexOf(input.toLowerCase()) >= 0)
        || (option.props.originData.wbCode
          && option.props.originData.wbCode.toLowerCase().indexOf(input.toLowerCase()) >= 0)
        || (option.props.originData.userCode
          && option.props.originData.userCode.toLowerCase().indexOf(input.toLowerCase()) >= 0)
        || option.props.children.indexOf(input) >= 0;
    };

    return (
      <Select
        showSearch={typeof showSearch === 'undefined' ? true : showSearch}
        filterOption={typeof filterOption === 'function' ? filterOption : defaultFilterOption}
        {...other}
      >
        { options }
      </Select>
    );
  }
}

export default connect(({ utils }) => ({ utils }))(DeptSelect);

