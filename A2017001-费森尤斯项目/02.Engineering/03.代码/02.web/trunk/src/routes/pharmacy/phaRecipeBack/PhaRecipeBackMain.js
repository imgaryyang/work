import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import SearchBar from './SearchBar';
import List from './PhaRecipeBackList';
// import Editor from './AdviceEditor';

class PhaRecipeBackMain extends Component {

  render() {
    const { dispatch } = this.props;
    const { dicts } = this.props.utils;
    const { printTemplate, printData } = this.props.print;
    const { data, page, isSpin, selectedRowKeys, searchObjs, patient } = this.props.phaRecipe;
    const listProps = {
      data,
      page,
      dicts,
      dispatch,
    };
    const searchBarProps = {
      selectedRowKeys,
      searchObjs,
      patient,
      dispatch,
      printTemplate,
      printData,
    };
    return (
      <Spin spinning={isSpin}>
        <SearchBar {...searchBarProps} />
        <List {...listProps} />
      </Spin>
    );
  }
}

export default connect(({ phaRecipe, utils, print }) => ({ phaRecipe, utils, print }))(PhaRecipeBackMain);
