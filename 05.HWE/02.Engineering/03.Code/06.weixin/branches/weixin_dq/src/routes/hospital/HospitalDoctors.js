import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { ListView, PullToRefresh, Card, Icon, Modal } from 'antd-mobile';
import classnames from 'classnames';

import styles from './HospitalDoctors.less';
import { image } from '../../services/baseService';
import DeptList from './DeptList';

class HospitalDoctors extends React.Component {
  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
  }

  componentWillMount() {
  }

  renderRow(rowData, sectionID, rowID) {
    const portrait = rowData.photo ? { backgroundImage: `url(${image(rowData.photo)})` } : {};
    return (
      <Card
        key={rowID}
        full
        className={styles.row}
        onClick={() => {
          const { dispatch } = this.props;
          dispatch({
            type: 'hospital/setState',
            payload: { doctor: rowData },
          });
          dispatch(routerRedux.push('/stack/doctor'));
        }}
      >
        <Card.Body>
          <div className={styles.mainContainer}>
            <div
              className={classnames(styles.portrait, !rowData.photo ? styles.userPortrait : null)}
              style={portrait}
            />
            <div style={{ flex: 1 }}>
              <div className={styles.nameContainer}>
                <div className={styles.name}>{rowData.name}</div>
                <div className={styles.docDept}><b>科室：</b>{rowData.depName}</div>
              </div>
              <span className={styles.appendText}><b>职称：</b>{rowData.jobTitle}</span>
              <span className={styles.appendText}><b>专长：</b>{rowData.speciality}</span>
            </div>
          </div>
          <div className={styles.clinicDescContainer}>
            <span className={styles.clinicDescTitle}>常规出诊时间：</span>
            <span className={styles.clinicDesc}>{rowData.clinicDesc || '暂无记录'}</span>
          </div>
        </Card.Body>
      </Card>
    );
  }

  render() {
    const {
      doctors, doctorsDS, refreshing, loading, noMoreData,
      hospital, filterDept, chooseDeptVisible, depts,
    } = this.props.hospital;
    // console.log('chooseDeptVisible:', chooseDeptVisible);
    const initQuery = { hosId: hospital.id };
    const modalHeight = this.props.base.screen.height * 0.8;
    return (
      <div className={styles.container}>
        <div
          className={styles.deptContainer}
          onClick={() => {
            this.props.dispatch({
              type: 'hospital/setState',
              payload: { chooseDeptVisible: true },
            });
          }}
        >
          <span className={styles.filterDeptName}>{filterDept.id ? filterDept.name : '全部科室'}</span>
          <Icon type="down" className={styles.switchIcon} />
        </div>
        <div style={{ flex: 1 }}>
          <ListView
            ref={(el) => { this.lv = el; }}
            dataSource={doctorsDS.cloneWithRows(doctors)}
            className={styles.list}
            pageSize={10}
            style={{ height: '100%' }}
            // 渲染行
            renderRow={this.renderRow}
            // 渲染行间隔
            // renderSeparator={() => <div className={commonStyles.sep15} />}
            // 下拉刷新
            pullToRefresh={<PullToRefresh
              refreshing={refreshing}
              onRefresh={() => this.props.dispatch({
                type: 'hospital/refresh',
                payload: { ...initQuery },
              })}
              style={{
                borderBottomWidth: 0,
              }}
            />}
            // 无限加载
            onEndReached={() => {
              if (!noMoreData) {
                this.props.dispatch({
                  type: 'hospital/infiniteLoad',
                  payload: {},
                });
              }
            }}
            onEndReachedThreshold={10}
            renderFooter={() => (
              <div className={styles.listFooterContainer} >
                {loading ? '载入更多数据...' : (doctors.length === 0 ? '未查询到任何符合条件的医生信息' : (noMoreData ? '所有数据载入完成' : ''))}
              </div>
            )}
          />
        </div>
        <Modal
          visible={chooseDeptVisible}
          maskClosable
          onClose={() => this.props.dispatch({ type: 'hospital/setState', payload: { chooseDeptVisible: false } })}
          transparent
          className={styles.modal}
        >
          <div className={styles.modalContainer} style={{ maxHeight: modalHeight }}>
            <div
              className={styles.allDepts}
              onClick={() => {
                this.props.dispatch({
                  type: 'hospital/search',
                  payload: {
                    filterDept: {},
                    chooseDeptVisible: false,
                  },
                });
              }}
            >全部科室
            </div>
            <DeptList
              depts={depts}
              allowReg={false}
              onRowClick={(dept) => {
                this.props.dispatch({
                  type: 'hospital/search',
                  payload: {
                    filterDept: dept,
                    chooseDeptVisible: false,
                  },
                });
              }}
              onSearch={(value) => {
                this.props.dispatch({
                  type: 'hospital/getDeptsBrief',
                  payload: {
                    hosId: hospital.id,
                    name: value,
                  },
                });
              }}
            />
          </div>
        </Modal>
      </div>
    );
  }
}

HospitalDoctors.propTypes = {
};

export default connect(({ base, hospital }) => ({ base, hospital }))(HospitalDoctors);
