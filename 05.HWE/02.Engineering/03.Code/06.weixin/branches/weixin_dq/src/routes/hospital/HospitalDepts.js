import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import DeptList from './DeptList';
import styles from './HospitalDepts.less';

class HospitalDepts extends React.Component {
  componentWillMount() {
  }

  render() {
    const { hospital } = this.props;
    const { depts } = hospital;
    return (
      <div className={styles.container}>
        <DeptList
          depts={depts}
          onRowClick={(item) => {
            const { dispatch } = this.props;
            dispatch({
              type: 'hospital/setState',
              payload: { dept: item },
            });
            // dispatch(routerRedux.push('/stack/dept'));
          }}
          onSearch={(value) => {
            this.props.dispatch({
              type: 'hospital/getDeptsBrief',
              payload: {
                hosId: hospital.hospital.id,
                name: value,
              },
            });
          }}
        />
      </div>
    );
  }
}

HospitalDepts.propTypes = {
};

export default connect(({ base, hospital }) => ({ base, hospital }))(HospitalDepts);
