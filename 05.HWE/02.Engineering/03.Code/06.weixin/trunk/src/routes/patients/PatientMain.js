import React from 'react';
import { Route } from 'dva/router';
import { connect } from 'dva';
import styles from './PatientMain.less';
import Patient from './Patient';
import AddPatient from './AddPatient';
import Profiles from './Profiles';

class PatientMain extends React.Component {
  render() {
    const { match } = this.props;
    return (
      <div className={styles['container']}>
        <Route path={`${match.url}/patient`} component={Patient} />
        <Route path={`${match.url}/addPatient`} component={AddPatient} />
        <Route path={`${match.url}/profiles`} component={Profiles} />
      </div>
    );
  }
}

PatientMain.propTypes = {
};

export default connect()(PatientMain);
