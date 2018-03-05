import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Cascader } from 'antd';
import _ from 'lodash';

/**
 * 树状动态加载
 */
class AsyncTreeCascader extends Component {

  static propTypes = {
    /**
     * 多级字典类型
     */
    dictType: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.loadData = this.loadData.bind(this);
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDictTrees',
      payload: [this.props.dictType],
    });
    
  }

  loadData(selectedOptions) {
    /* if (typeof this.props.asyncLoad === 'function') {
      this.props.asyncLoad(this.props.dictType, selectedOptions);
    } */
    this.props.dispatch({
      type: 'utils/loadTreeItemChildren',
      payload: {
        dictType: this.props.dictType,
        selectedOptions,
      },
    });
    /* this.props.dispatch({
      type: 'utils/loadTreeItemChildren',
      payload: {
        dictType: this.props.dictType,
        selectedOptions,
      },
    }); */
  }

  render() {
    const { dictType, placeholder, showSearch, utils } = this.props;
    const other = _.omit(this.props, ['dictType', 'placeholder', 'showSearch', 'dispatch', 'utils']);
    const options = utils.dictTrees[dictType];
    /* const defaultFilter = (inputValue, path) => {
      console.log(inputValue, path);
      return true;
    } */

    return (
      <Cascader
        showSearch={typeof showSearch === 'undefined' ? false : showSearch}
        options={options}
        loadData={this.loadData}
        changeOnSelect={false}
        placeholder={placeholder || ''}
        {...other}
      />
    );
  }
}

export default connect(({ utils }) => ({ utils }))(AsyncTreeCascader);

