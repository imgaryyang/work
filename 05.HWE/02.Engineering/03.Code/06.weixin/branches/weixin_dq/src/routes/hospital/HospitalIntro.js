import React from 'react';
import { connect } from 'dva';
import { Card } from 'antd-mobile';

import ActivityIndicatorView from '../../components/ActivityIndicatorView';
import { filterContactWay } from '../../utils/Filters';

import styles from './HospitalIntro.less';

class HospitalIntro extends React.Component {
  constructor(props) {
    super(props);
    this.loadHospInfo = this.loadHospInfo.bind(this);

    this.loadHospInfo();
  }

  componentWillMount() {
  }

  loadHospInfo() {
    const { dispatch, hospital } = this.props;
    if (!hospital.id) {
      dispatch({
        type: 'hospital/getHospInfo',
        payload: {},
      });
    }
  }

  render() {
    const { hospital } = this.props;
    const { contacts, sectionDescs, loading, loading1 } = hospital;
    const hosp = hospital.hospital;
    const address = hosp.address && hosp.address.address ? hosp.address.address : '';
    // console.log(hospital.hospital, contacts, sectionDescs, depts);
    const contactsView = loading1 ? <ActivityIndicatorView /> : (
      <Card full style={{ marginTop: 15 }}>
        <Card.Header title={(<div className={styles.cardTitle}>联系方式</div>)} />
        <Card.Body>
          {!loading1 && contacts.length === 0 ? (
            <div className={styles.brief}>暂无联系方式信息</div>
          ) : (
            <div>
              {contacts.map((contact, idx) => {
                return (
                  <div key={`contact_${idx + 1}`} className={styles.contactItemContainer} >
                    <b>{filterContactWay(contact.type)} : </b>{contact.content}
                  </div>
                );
              })}
            </div>
          )}
        </Card.Body>
      </Card>
    );

    const sectionDescsView = loading ? <ActivityIndicatorView /> : (
      sectionDescs.length === 0 ? (
        <div className={styles.emptyView}>暂无医院详细介绍</div>
      ) : (
        <Card full style={{ marginTop: 15 }}>
          <Card.Body>
            {sectionDescs.map((item, idx) => {
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
          <Card.Header title={(<div className={styles.cardTitle}>医院地址</div>)} />
          <Card.Body>
            <div className={styles.brief} >{address || '暂无地址信息'}</div>
          </Card.Body>
        </Card>
        {contactsView}
        <Card full style={{ marginTop: 15 }}>
          <Card.Header title={(<div className={styles.cardTitle}>交通方式</div>)} />
          <Card.Body>
            {
              hosp.transportation ? (
                <div className={styles.brief}>{hosp.transportation.content}</div>
              ) : (
                <div className={styles.brief}>暂无交通方式信息</div>
              )
            }
          </Card.Body>
        </Card>
        {sectionDescsView}
      </div>
    );
  }
}

HospitalIntro.propTypes = {
};

export default  connect(({ base, hospital }) => ({ base, hospital }))(HospitalIntro);
