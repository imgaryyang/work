import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { TreeSelect } from 'antd';

const TreeNode = TreeSelect.TreeNode;

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

class DeptTreeSelect extends Component {

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
    returnType: 'id',
  };

  render() {
    const {
      deptType, showSearch, filterOption, utils,
      returnType, isRegdept, ...other
    } = this.props;

    let deptItems = [];
    // console.log('utils.depts in DeptTreeSelect:', utils.depts);
    // console.log(isRegdept);

    if (this.props.deptType
      && this.props.deptType instanceof Array
      && this.props.deptType.length > 0
    ) { // 如果指定了科室类型
      for (let i = 0; utils && utils.depts && deptType && i < deptType.length; i += 1) {
        const type = deptType[i];
        if (utils.depts[type] && utils.depts[type].children.length > 0) { // 页面刚加载，没数据时跳过
          const items = filterDeptItems(utils.depts[type].children, isRegdept);
          if (items.length > 0) {
            deptItems = deptItems.concat({ ...utils.depts[type], children: items });
          }
        }
      }
    } else { // 未指定科室类型，显示所有
      for (const key in utils.depts) {
        if (key && utils.depts[key].children.length > 0) {
          const items = filterDeptItems(utils.depts[key].children, isRegdept);
          if (items.length > 0) {
            deptItems = deptItems.concat({ ...utils.depts[key], children: items });
          }
        }
      }
    }
    // console.log('deptItems in DeptTreeSelect:', deptItems);

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

    const loop = loopData => loopData.map((item) => {
      const value = returnType === 'deptId' ? (!item.deptId ? item.value : item.deptId) : item.value;
      if (item.children && item.children.length) {
        return (
          <TreeNode
            key={item.key}
            value={value}
            title={item.title}
            originData={item}
            disabled={!item.deptId || false}
          >
            {loop(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          key={item.key}
          value={value}
          title={item.title}
          originData={item}
          disabled={!item.deptId || false}
        />
      );
    });

    return (
      <TreeSelect
        dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
        treeDefaultExpandAll
        allowClear
        showSearch={typeof showSearch === 'undefined' ? true : showSearch}
        filterOption={typeof filterOption === 'function' ? filterOption : defaultFilterOption}
        {...other}
      >
        { loop(deptItems) }
      </TreeSelect>
    );
  }
}

export default connect(({ utils }) => ({ utils }))(DeptTreeSelect);

