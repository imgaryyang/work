import React from 'react';
import { Route } from 'dva/router';
import { connect } from 'dva';
import styles from './AppointMain.less';
import Departments from './Departments';
import Schedule from './Schedule';
import AppointSource from './AppointSource';
import Appoint from './Appoint';
import AppointSuccess from './AppointSuccess';
import AppointRecords from './AppointRecords';
import AppointRecordDetail from './AppointRecordDetail';

class AppointMain extends React.Component {
  render() {
    const { match } = this.props;
    return (
      <div className={styles['container']}>
        {/* <div>AppointMain</div>*/}
        <Route path={`${match.url}/departments`} component={Departments} />
        <Route path={`${match.url}/schedule`} component={Schedule} />
        <Route path={`${match.url}/source`} component={AppointSource} />
        <Route path={`${match.url}/appoint`} component={Appoint} />
        <Route path={`${match.url}/success`} component={AppointSuccess} />
        <Route path={`${match.url}/records`} component={AppointRecords} />
        <Route path={`${match.url}/recordDetail`} component={AppointRecordDetail} />
      </div>
    );
  }
}

AppointMain.propTypes = {
};

export default connect()(AppointMain);
