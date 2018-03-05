import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import _ from 'lodash';

import SearchInput from './SearchInput';

import styles from './SearchInput.less';

class FreqsSearchInput extends Component {

  static propTypes = {

    /**
     * 选中后回调
     */
    onSelect: PropTypes.func,

  };

  constructor(props) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onFocus = this.onFocus.bind(this);
  }

  onSelect(item) {
    /* this.props.dispatch({
      type: 'utils/setState',
      payload: {
        freqs: [],
      },
    });*/
    if (typeof this.props.onSelect === 'function') {
      this.props.onSelect(item);
    }
  }

  onSearch(searchCode) {
    this.props.dispatch({
      type: 'utils/loadFreqs',
      payload: {
        searchCode,
      },
    });
  }

  onFocus() {
    this.props.dispatch({
      type: 'utils/loadFreqs',
      payload: {
        searchCode: '',
      },
    });
  }

  render() {
    const { utils } = this.props;
    const rest = _.omit(this.props, ['utils', 'dropdownStyle', 'onSelect', 'onSearch', 'onFocus']);
    const { freqs, freqsFetching } = utils;
    // console.log(freqs, freqsFetching);
    const optionRender = option => (
      <div className={`${styles.searchInput} ${styles.freq}`} >
        <span className={styles.freqName} >{option.freqName}</span>
        <span className={styles.freqQty} >{option.freqQty}次</span>
        <span className={styles.freqTime} >{option.freqTime}</span>
      </div>
    );

    return (
      <SearchInput
        onSearch={this.onSearch}
        onSelect={this.onSelect}
        onFocus={this.onFocus}
        options={freqs}
        optionRender={optionRender}
        valueRender={option => `${option ? `${option.freqName} | ${option.freqTime}` : ''}`}
        fetching={freqsFetching}
        dropdownStyle={{ width: '320px' }}
        {...rest}
      />
    );
  }
}

export default connect(
  ({ utils }) => ({ utils }),
)(FreqsSearchInput);

