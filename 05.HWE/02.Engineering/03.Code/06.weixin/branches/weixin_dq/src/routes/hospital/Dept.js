import React from 'react';
import { connect } from 'dva';
import { Card } from 'antd-mobile';

import ActivityIndicatorView from '../../components/ActivityIndicatorView';

import styles from './Dept.less';

class Dept extends React.Component {
  constructor(props) {
    super(props);
    this.loadDeptDescs = this.loadDeptDescs.bind(this);

    this.loadDeptDescs();
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/save',
      payload: {
        title: '科室信息',
        hideNavBarBottomLine: false,
        showCurrHospitalAndPatient: false,
        headerRight: null,
      },
    });
  }

  loadDeptDescs() {
    const { dispatch, hospital } = this.props;
    dispatch({
      type: 'hospital/getDeptDescs',
      payload: { id: hospital.dept.id },
    });
  }

  render() {
    const { dept, deptDescs, loading } = this.props.hospital;

    const deptDescsView = loading ? <ActivityIndicatorView /> : (
      deptDescs.length === 0 ? (
        <div className={styles.emptyView}>暂无科室详细介绍</div>
      ) : (
        <Card full style={{ marginTop: 15 }}>
          <Card.Body>
            {deptDescs.map((item, idx) => {
              return (
                <div key={`desc_${idx + 1}`} >
                  <div className={styles.descTitleContainer} >
                    <span className={styles.descTitle} >{item.caption}</span>
                  </div>
                  <div className={styles.descContent} >{item.body}</div>
                </div>
              );
            })}
          </Card.Body>
        </Card>
      )
    );
    return (
      <div className={styles.container}>
        <Card full style={{ marginTop: 15 }}>
          <Card.Header
            title={(
              <div className={styles.nameContainer}>
                <div className={styles.cardTitle} style={{ flex: 1 }}>{dept.name}</div>
                <div className={styles.btn}>去挂号</div>
              </div>
            )}
          />
          <Card.Body>
            <div className={styles.brief} >{dept.brief || '暂无简介信息'}</div>
          </Card.Body>
        </Card>
        <Card full style={{ marginTop: 15 }}>
          <Card.Header title={(<div className={styles.cardTitle}>院内地址</div>)} />
          <Card.Body>
            <div className={styles.brief} >{dept.address || '暂无地址信息'}</div>
          </Card.Body>
        </Card>
        {deptDescsView}
      </div>
    );
  }
}

Dept.propTypes = {
};

export default connect(({ base, hospital }) => ({ base, hospital }))(Dept);
