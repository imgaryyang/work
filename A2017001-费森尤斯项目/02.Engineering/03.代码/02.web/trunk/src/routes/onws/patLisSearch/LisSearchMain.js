import React from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import List from './LisSearchList';
import SearchBar from './SearchBar';
import View from './LisSearchView';

class LisSearchMain extends React.Component {
  componentWillMount() {
    this.props.dispatch({
      type: 'phaLisResult/load',
    });
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['SEX', 'INFECTIOUS_DISEASE', 'SPECIMENT'],
    });
  }

  render() {
    const { isSpin, patient, data, page, visible } = this.props.phaLisResult;
    const { dispatch, print } = this.props;
    const searchProps = {
      dispatch,
      patient,
      data,
      page,
    };

    const viewProps = {
      dispatch,
      visible,
      data,
      print,
    };
    return (
      <Spin spinning={isSpin} >
        <SearchBar {...searchProps} />
        <List {...searchProps} />
        <View {...viewProps} />
      </Spin>
    );
  }
}
export default connect(({ phaLisResult, print }) => ({ phaLisResult, print }))(LisSearchMain);
