import React from 'react';
import { connect } from 'dva';
import { Flex, Toast } from 'antd-mobile';
import { routerRedux } from 'dva/router';
import _ from 'lodash';
import less from './AppointSource.less';
import { action, clientWidth, isValidArray } from '../../utils/common';

class AppointSource extends React.Component {
  constructor(props) {
    super(props);
    this.onClickItem = this.onClickItem.bind(this);
  }

  componentDidMount() {
    const { dispatch, appoint: { selectSchedule, selectSchedule: { no: schNo, docName: title } } } = this.props;
    dispatch(action('base/save', {
      title,
      allowSwitchPatient: true,
      hideNavBarBottomLine: false,
      showCurrHospitalAndPatient: true,
      headerRight: null,
    }));
    if (_.isEmpty(selectSchedule)) {
      Toast.fail('查询条件不能为空');
    } else {
      dispatch(action('appoint/forAppointSource', { schNo }));
    }
  }

  componentWillUnmount() {
    this.props.dispatch(action('appoint/save', { appointSourceData: [], isLoading: true }));
  }

  onClickItem(item) {
    this.props.dispatch(action('appoint/save', { selectAppointSource: item }));
    this.props.dispatch(routerRedux.push({ pathname: 'appoint' }));
  }

  render() {
    const { selectSchedule, appointSourceData, isLoading } = this.props.appoint;
    const { depName, clinicTypeName, clinicDate, shiftName } = selectSchedule;
    const title = `${depName} > ${clinicTypeName} > ${clinicDate} > ${shiftName}`;
    return (
      <div className={less.scrolly}>
        <div className={less.title}>{title}</div>
        <Flex direction="row" wrap="wrap" >
          {
            isValidArray(appointSourceData) ?
            appointSourceData.map((item, index) => {
              return (
                <Flex
                  direction="row"
                  key={`${index}`}
                  style={{ width: ((clientWidth - 46) / 3) }}
                  className={less.item}
                  onClick={() => this.onClickItem(item)}
                >
                  <Flex justify="center" align="center" className={less.left}>{item.num}</Flex>
                  <Flex justify="center" align="center" className={less.right}>{item.clinicTime}</Flex>
                </Flex>
              );
            }) : (isLoading ? null : <div className={less.noData}>查无号源数据</div>)
          }
        </Flex>
      </div>
    );
  }
}

export default connect(appoint => (appoint))(AppointSource);
