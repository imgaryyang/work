import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tag } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import Styles from './DictCheckable.less';

const CheckableTag = Tag.CheckableTag;

/**
 * @Author xlbd
 * @Desc DictCheckable 可选数据字典模块，提供根据数据字典渲染字典选择Tag
 * @Array dictArray 数据字典类型数组
 * @string tagColumn 对应的表字段，例如：drugType
 * @String searchObjs 搜索对象，例如：{ drugType: '001' }
 * @string selectedTag 选中的tag值，例如：'001'
 */
class DictCheckable extends Component {

  static propTypes = {

    /**
     * namespace 调用组件的model
     */
    namespace: PropTypes.string,

    /**
     * dictArray 数字字典类型数组
     */
    dictArray: PropTypes.array,

    /**
     * tagColumn 对应的表字段，例如：drugType
     */
    tagColumn: PropTypes.string,

    /**
     * selectedTag 选中的tag值，string/object
     */
    selectedTag: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),

    /*
     * searchObjs 搜索对象
     */
    searchObjs: PropTypes.object,

  };

  handleChange(tag, checked) {
    if (checked) {
      const { namespace, tagColumn, searchObjs } = this.props;
      let { selectedTag } = this.props;

      const tagObj = { [tagColumn]: tag };

      selectedTag = _.isObject(selectedTag)
        ? Object.assign(selectedTag, tagObj)
        : tag;

      this.props.dispatch({
        type: `${namespace}/setState`,
        payload: { selectedTag },
      });
      this.props.dispatch({
        type: `${namespace}/setSearchObjs`,
        payload: tagObj,
      });
      this.props.dispatch({
        type: `${namespace}/load`,
        payload: { query: searchObjs },
      });
    }
  }

  render() {
    const { dictArray, tagColumn } = this.props;
    let { selectedTag } = this.props;

    selectedTag = _.isObject(selectedTag)
      ? selectedTag[tagColumn]
      : selectedTag;

    const tagDiscribe = _.uniq(_.map(dictArray, 'columnDis')).toString();

    const tagArray = dictArray || [];

    return (
      <div className={Styles.tagbar}>
        <strong>{tagDiscribe}:</strong>
        {tagArray.map(item => (
          <CheckableTag
            key={item.columnKey.toString()}
            checked={selectedTag === item.columnKey}
            onChange={checked => this.handleChange(item.columnKey, checked)}
          >
            {item.columnVal}
          </CheckableTag>
          ))
        }
      </div>
    );
  }
}

export default connect()(DictCheckable);
