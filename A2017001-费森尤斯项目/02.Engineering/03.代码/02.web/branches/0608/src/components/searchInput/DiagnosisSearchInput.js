import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import SearchInput from './SearchInput';

import styles from './SearchInput.less';

class DiagnosisSearchInput extends Component {

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
    this.props.dispatch({
      type: 'utils/setState',
      payload: {
        diagnosis: [],
      },
    });
    if (typeof this.props.onSelect === 'function') {
      this.props.onSelect(item);
    }
  }

  onSearch(searchCode) {
    this.props.dispatch({
      type: 'utils/loadDiagnosis',
      payload: {
        searchCode,
      },
    });
  }

  onFocus() {
    this.props.dispatch({
      type: 'utils/loadDiagnosis',
      payload: {
        searchCode: '',
      },
    });
  }

  render() {
    const { utils, value, placeholder } = this.props;
    const { diagnosis, diagnosisFetching } = utils;

    const optionRender = option => (
      <div className={`${styles.searchInput} ${styles.diagnosis}`} >
        <span className={styles.diagnosisCode} >{option.diagnosisCode}</span>
        <span className={styles.diagnosisName} >{option.diagnosisName}</span>
      </div>
    );

    return (
      <SearchInput
        onSearch={this.onSearch}
        onSelect={this.onSelect}
        onFocus={this.onFocus}
        options={diagnosis}
        optionRender={optionRender}
        valueRender={option => `${option.diagnosisName}`}
        fetching={diagnosisFetching}
        dropdownStyle={{ width: '350px' }}
        value={value}
        placeholder={placeholder}
      />
    );
  }
}

export default connect(
  ({ utils }) => ({ utils }),
)(DiagnosisSearchInput);

