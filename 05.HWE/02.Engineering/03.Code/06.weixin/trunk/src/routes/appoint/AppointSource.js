import React from 'react';
import { connect } from 'dva';
import { Flex } from 'antd-mobile';
import { routerRedux } from 'dva/router';
import less from './AppointSource.less';
import { action, clientWidth } from '../../utils/common';

class AppointSource extends React.Component {
  constructor(props) {
    super(props);
    this.onClickItem = this.onClickItem.bind(this);
  }

  componentWillUnmount() {
    this.props.dispatch(action('appoint/save', { appointSourceData: [] }));
  }

  onClickItem(item) {
    console.log('item', item);
    this.props.dispatch(routerRedux.push({
      pathname: 'appoint',
      state: { item },
    }));
  }

  render() {
    const { selectSchedule, appointSourceData } = this.props.appoint;
    const { depName, clinicTypeName, clinicDate, shiftName } = selectSchedule;
    const title = `${depName} > ${clinicTypeName} > ${clinicDate} > ${shiftName}`;
    return (
      <div>
        <div className={less.title}>{title}</div>
        <Flex direction="row" wrap="wrap">
          {
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
            })
          }
        </Flex>
      </div>
    );
  }
}

export default connect(appoint => (appoint))(AppointSource);
