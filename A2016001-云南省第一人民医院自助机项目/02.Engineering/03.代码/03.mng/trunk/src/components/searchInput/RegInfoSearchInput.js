import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import SearchInput from './SearchInput';
import styles from './SearchInput.less';

class RegInfoSearchInput extends Component {

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
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['REG_LEVEL', 'SEX'],
    });
  }

  onSelect(item) {
    this.props.dispatch({
      type: 'utils/setState',
      payload: {
        regInfo: [],
      },
    });
    if (typeof this.props.onSelect === 'function') {
      this.props.onSelect(item);
    }
  }

  onSearch(searchCode) {
    this.props.dispatch({
      type: 'utils/loadRegInfo',
      payload: {
        searchCode,
      },
    });
  }

  render() {
    const { utils, value, placeholder } = this.props;
    const { regInfo, regInfoFetching, dicts, depts } = utils;

    const optionRender = option => (
      <div className={`${styles.searchInput} ${styles.regInfo}`} >
        <span className={styles.regId} >{option.regId}</span>
        <span className={styles.name} >{option.patient.name}</span>
        <span className={styles.sex} >{dicts.dis('SEX', option.patient.sex)}</span>
        <span className={styles.birth} >{moment(option.patient.birthday).format('YYYY-MM-DD')}</span>
        <span className={styles.regLevel} >{dicts.dis('REG_LEVEL', option.regLevel)}</span>
        <span className={styles.regDept} >
          {depts.disDeptName(this.props.utils.deptsIdx, option.regDept)}
        </span>
      </div>
    );

    return (
      <SearchInput
        onSearch={this.onSearch}
        onSelect={this.onSelect}
        options={regInfo}
        optionRender={optionRender}
        valueRender={option => `${option ? option.regId : ''}`}
        fetching={regInfoFetching}
        dropdownStyle={{ width: '520px' }}
        value={value}
        placeholder={placeholder}
      />
    );
  }
}

export default connect(
  ({ utils }) => ({ utils }),
)(RegInfoSearchInput);

