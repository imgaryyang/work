import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Toast } from 'antd-mobile';
import { routerRedux } from 'dva/router';

import Icon from '../../components/FAIcon';
// import SearchInput from '../../components/SearchInput';

import styles from './DeptList.less';
import { action } from '../../utils/common';
import baseStyles from '../../utils/base.less';

class DeptList extends React.Component {
  constructor(props) {
    super(props);
    this.getDepts = this.getDepts.bind(this);
    this.gotoSchedule = this.gotoSchedule.bind(this);
    this.renderDepts = this.renderDepts.bind(this);
  }

  componentWillMount() {
  }

  getDepts() {
    // const { depts } = this.props;
    // const arr = [];
    // const types = {};
    // for (let i = 0; i < depts.length; i++) {
    //   const { type } = depts[i];
    //   if (typeof types[type] === 'number') {
    //     arr[types[type]].depts[arr[types[type]].depts.length] = depts[i];
    //   } else {
    //     types[type] = arr.length;
    //     arr[arr.length] = {
    //       type,
    //       depts: [depts[i]],
    //     };
    //   }
    // }
    // return arr;
  }

  gotoSchedule(dept) {
    if (dept && dept.no) {
      this.props.dispatch(action('appoint/save', { cond: { ...dept, depNo: dept.no } }));
      this.props.dispatch(routerRedux.push({ pathname: 'appoint/schedule' }));
    } else {
      Toast.fail('缺乏信息', 3);
    }
  }

  renderDepts() {
    const { allowReg, onRowClick, depts } = this.props;
    // const types = this.getDepts();
    // console.log('depts:', types);

    return depts.map(({ type, children }, idx) => {
      const deptList = children.map((item, deptIdx) => {
        const { name, no } = item;
        const btn = allowReg ? (
          <div className={styles.btn} onClick={() => this.gotoSchedule(item)}>去挂号</div>
        ) : (
          <div style={{ height: 25 }} />
        );
        return (
          <div key={`${no}_${name}_${deptIdx}`} className={styles.itemContainer} onClick={() => onRowClick(item)}>
            <div className={styles.contentContainer} style={deptIdx === children.length - 1 ? { borderBottomWidth: 0 } : {}}>
              <div className={styles.name}>{name}</div>
              {btn}
              <div className={baseStyles.chevronContainer}>
                <Icon type="angle-right" className={baseStyles.chevron} />
              </div>
            </div>
          </div>
        );
      });
      return (
        <div key={`type_${type}_${idx}`} className={styles.typeContainer}>
          {
            type ? (<div className={styles.typeName}>{type}</div>) : null
          }
          {deptList}
        </div>
      );
    });
  }

  render() {
    return (
      <div className={styles.container}>
        {/* <div className={styles.topBar}>
          <SearchInput
            value={this.props.hospital.cond}
            onChangeText={(value) => {
              this.props.dispatch({
                type: 'hospital/setState',
                payload: { cond: value },
              });
            }}
            onSearch={value => this.props.onSearch(value)}
            onClear={() => {
              this.props.onSearch('');
              this.props.dispatch({
                type: 'hospital/setState',
                payload: { cond: '' },
              });
            }}
          />
        </div>*/}
        {this.renderDepts()}
        <div style={{ height: 40 }} />
      </div>
    );
  }
}

DeptList.propTypes = {
  depts: PropTypes.array,
  allowReg: PropTypes.bool,
  onRowClick: PropTypes.func,
  // onSearch: PropTypes.func,
};

DeptList.defaultProps = {
  depts: [],
  allowReg: true,
  onRowClick: () => {},
  // onSearch: () => {},
};

export default connect(({ base, hospital, appoint }) => ({ base, hospital, appoint }))(DeptList);
