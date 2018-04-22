import React, { PropTypes, Component } from 'react';
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
     * selectedTag 选中的tag值
     */
    selectedTag: PropTypes.string,

    /*
     * searchObjs 搜索对象
     */
    searchObjs: PropTypes.object,

  };

  handleChange(selectedTag, checked) {
    if (checked) {
      const { namespace, tagColumn, searchObjs } = this.props;

      this.props.dispatch({
        type: `${namespace}/setState`,
        payload: { selectedTag },
      });
      this.props.dispatch({
        type: `${namespace}/setSearchObjs`,
        payload: { [tagColumn]: selectedTag },
      });
      this.props.dispatch({
        type: `${namespace}/load`,
        payload: { query: searchObjs },
      });
    }
  }

  render() {
    const { dictArray, selectedTag } = this.props;
    const tagDiscribe = _.uniq(_.map(dictArray, 'columnDis')).toString();

    const tagArray = dictArray || [];

    return (
      <div className={Styles.tagbar}>
        <strong>{tagDiscribe}:</strong>
        {tagArray.map(item => (
          <CheckableTag
            key={item.columnKey}
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
