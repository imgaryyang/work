import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Menu } from 'antd-mobile';
import { isValidArray, action, clientHeight, navBarHeight } from '../../utils/common';
import less from './Departments.less';

class Departments extends React.Component {
  constructor(props) {
    super(props);
    this.onSelectDept = this.onSelectDept.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(action('base/save', {
      title: '预约挂号',
      allowSwitchPatient: true,
      hideNavBarBottomLine: false,
      showCurrHospitalAndPatient: true,
      headerRight: null,
    }));
    this.props.dispatch(action('appoint/forDeptTree'));
  }

  componentWillUnmount() {
    this.props.dispatch(action('appoint/save', { deptTreeData: [] }));
  }

  onSelectDept(item) {
    const { dispatch, appoint: { deptTreeData } } = this.props;
    const { children } = deptTreeData.filter(element => element.value === item[0])[0];
    const dept = isValidArray(children) ?
      children.filter(element => element.value === item[1])[0] : null;

    if (dept) {
      dispatch(action('appoint/save', { cond: { ...dept, depNo: dept.no } }));
      dispatch(routerRedux.push({ pathname: 'schedule', }));
    }
  }

  render() {
    const { deptTreeData } = this.props.appoint;

    return (
      <div className={less.flexCol}>
        <Menu
          data={deptTreeData}
          height={clientHeight - navBarHeight - 1}
          value={isValidArray(deptTreeData) ? [deptTreeData[0].value] : null}
          onChange={this.onSelectDept}
          className={less.flexCol}
        />
      </div>
    );
  }
}

export default connect(({ appoint, base }) => ({ appoint, base }))(Departments);
