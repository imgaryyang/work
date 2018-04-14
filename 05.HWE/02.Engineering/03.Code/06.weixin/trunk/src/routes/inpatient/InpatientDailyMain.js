import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { List, Toast, Calendar, Icon, Button } from 'antd-mobile';
import moment from 'moment';
import classnames from 'classnames';

import { filterMoney, filterTextBreak } from '../../utils/Filters';

import styles from './InpatientDailyMain.less';
import commonStyles from '../../utils/common.less';

class InpatientDailyMain extends React.Component {
  constructor(props) {
    super(props);
    this.changeDate = this.changeDate.bind(this);
    this.loadInpatientDaily = this.loadInpatientDaily.bind(this);
    this.renderToolBar = this.renderToolBar.bind(this);
    this.renderBottomBar = this.renderBottomBar.bind(this);
  }

  state = {
    visible: false,
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/save',
      payload: {
        title: '住院日清单',
        hideNavBarBottomLine: true,
        showCurrHospitalAndPatient: true,
        headerRight: null,
      },
    });
  }

  componentDidMount() {
    this.loadInpatientDaily();
  }

  componentWillReceiveProps(props) {
    if (props.base.currProfile !== this.props.base.currProfile) {
      this.loadInpatientDaily();
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/save',
      payload: {
        hideNavBarBottomLine: false,
      },
    });
  }

  changeDate(date) {
    this.props.dispatch({
      type: 'inpatientDaily/setState',
      payload: {
        selectDate: date,
      },
    });
    this.setState({
      visible: false,
    }, () => this.loadInpatientDaily());
  }

  loadInpatientDaily() {
    const { currHospital, currProfile } = this.props.base;
    if (!currHospital.id) {
      Toast.info('没有当前医院信息！', 2, null, false);
      return;
    }
    if (!currProfile.id) {
      return;
    }

    const query = {
      proNo: currProfile.no,
      hosNo: currProfile.hosNo,
    };
    // console.info('query', query);
    this.props.dispatch({
      type: 'inpatientDaily/findInpatientDaily',
      payload: query,
    });
  }

  renderToolBar() {
    return (
      <div
        className={classnames(styles.toolBar, styles.topBar)}
        onClick={() => this.setState({ visible: true })}
      >
        <span className={styles.selectDate}>
          {moment(this.props.inpatientDaily.selectDate).format('YYYY-MM-DD')}
        </span>
        <Icon type="down" className={styles.switchIcon} />
      </div>
    );
  }

  renderBottomBar(amt) {
    return (
      <div className={classnames(styles.toolBar, styles.bottomBar)}>
        <span>总计：{filterMoney(amt)} 元</span>
      </div>
    );
  }

  render() {
    const { data, selectDate } = this.props.inpatientDaily;
    const { currProfile } = this.props.base;

    const itemList = [];
    const tmpData = data;
    let totalAmount = 0;
    let tmpTotalAmount = 0;

    if (tmpData && tmpData.length > 0) {
      let i = 0;
      for (const d of tmpData) {
        const firstPadding = i === 0 ? { paddingTop: 15 } : {};
        const lastPadding = i === tmpData.length - 1 ? { paddingBottom: 15 } : {};
        itemList.push((
          <div key={i} className={styles.itemContainer} style={{ ...firstPadding, ...lastPadding }}>
            <div className={classnames(commonStyles.ellipsisText, styles.name)}>{d.name}</div>
            <div className={classnames(commonStyles.ellipsisText, styles.price)}>{filterMoney(d.price)} × {d.num}</div>
            <div className={classnames(commonStyles.ellipsisText, styles.itemTotal)}>{filterMoney(d.realAmount)}</div>
          </div>
        ));
        tmpTotalAmount += parseFloat(d.realAmount);
        i += 1;
      }
      totalAmount = tmpTotalAmount;
    }

    const list = (
      <List className={styles.list}>
        {itemList}
      </List>
    );

    const emptyText = `暂无${currProfile.name}（卡号：${currProfile.no}）\n在 ${moment(selectDate).format('YYYY-MM-DD')} 的住院日清单信息！`;
    const content = !currProfile.id ?
      (
        <div className={commonStyles.emptyView}>请先选择就诊人！
          <Button
            type="ghost"
            inline
            style={{ marginTop: 10, width: 200 }}
            onClick={() => this.props.dispatch(routerRedux.push({ pathname: 'choosePatient' }))}
          >选择就诊人
          </Button>
        </div>
      ) :
      (
        data.length === 0 ? (
          <div className={commonStyles.emptyView}>{filterTextBreak(emptyText)}</div>
        ) : list
      );

    return (
      <div className={styles.container}>
        {this.renderToolBar()}
        <div className={styles.listContainer}>
          {content}
        </div>
        {this.renderBottomBar(totalAmount)}
        <Calendar
          type="one"
          visible={this.state.visible}
          onConfirm={this.changeDate}
          onCancel={() => this.setState({ visible: false })}
          defaultDate={this.state.selectDate}
        />
      </div>
    );
  }
}

InpatientDailyMain.propTypes = {
};

export default connect(({ home, user, base, inpatientDaily }) => ({ home, user, base, inpatientDaily }))(InpatientDailyMain);
