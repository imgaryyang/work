import React from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import List from './PhaLisList';
import SearchBar from './SearchBar';

class PhaLisMain extends React.Component {
  componentWillMount() {
    this.props.dispatch({
      type: 'phaLis/load',
    });
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['SEX', 'INFECTIOUS_DISEASE', 'SPECIMENT'],
    });
  }

  render() {
    const { isSpin, patient, data, page } = this.props.phaLis;
    const { dispatch } = this.props;
    const searchProps = {
      dispatch,
      patient,
      data,
      page,
    };
    return (
      <Spin spinning={isSpin} >
        <SearchBar {...searchProps} />
        <List {...searchProps} />
      </Spin>
    );
  }
}
export default connect(({ phaLis }) => ({ phaLis }))(PhaLisMain);
