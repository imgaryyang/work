import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Menu } from 'antd-mobile';
import { isValidArray, action, clientHeight } from '../../utils/common';
import less from './Departments.less';

class Departments extends React.Component {
  constructor(props) {
    super(props);
    this.onSelectDept = this.onSelectDept.bind(this);
  }

  componentWillUnmount() {
    this.props.dispatch(action('appoint/save', { deptTreeData: [] }));
  }

  onSelectDept(item) {
    const { dispatch, appoint } = this.props;
    const { deptTreeData } = appoint;
    const { children } = deptTreeData.filter(element => element.value === item[0])[0];
    const dept = isValidArray(children) ?
      children.filter(element => element.value === item[1])[0] : null;

    if (dept) {
      dispatch(routerRedux.push({
        pathname: 'schedule',
        state: { dept: { ...dept, depNo: dept.no } },
      }));
    }
  }

  render() {
    const { deptTreeData } = this.props.appoint;

    return (
      <div className={less.container}>
        <Menu
          data={deptTreeData}
          height={clientHeight}
          value={isValidArray(deptTreeData) ? [deptTreeData[0].value] : null}
          onChange={this.onSelectDept}
          className={{ fontSize: '14px' }}
        />
      </div>
    );
  }
}

export default connect(appoint => (appoint))(Departments);
