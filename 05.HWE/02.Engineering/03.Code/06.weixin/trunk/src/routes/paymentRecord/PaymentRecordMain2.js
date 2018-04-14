import { Tabs, WhiteSpace, Badge } from 'antd-mobile';
import { connect } from 'dva';
import React from 'react';
import ConsumeRecordList from './ConsumeRecordList';
import PreRecordsList from './PreRecordsList';
import style from './PaymentMain.less';

const tabs = [
  { title: <Badge>缴费记录</Badge>, page: 1 },
  { title: <Badge>预存记录</Badge>, page: 2 },
];
class PaymentRecordMain2 extends React.Component {
  constructor(props) {
    super(props);
    this.loadData = this.loadData.bind(this);
    this.loadConsumeRecordList = this.loadConsumeRecordList.bind(this);
    this.loadPreRecordsList = this.loadPreRecordsList.bind(this);
    this.onTabClick = this.onTabClick.bind(this);
  }

  componentWillMount() {
    // console.log('tab====componentWillMount===');
    const { dispatch } = this.props;
    dispatch({
      type: 'base/save',
      payload: {
        title: '消费记录',
        hideNavBarBottomLine: true,
        showCurrHospitalAndPatient: true,
        headerRight: null,
      },
    });
  }
  componentDidMount() {
    const { currProfile } = this.props.base;
    const arr = Object.keys(currProfile);
    // 已经选择了就诊人
    if (arr.length !== 0) {
      this.loadData(currProfile);
    }
  }
  onTabClick(tab, index) {
    const { currProfile } = this.props.base;
    // console.log('onTabClick', tab, index);

    if (index === 0) {
      // console.log('index===', index);

      this.loadData(currProfile);
      this.loadConsumeRecordList(currProfile);
    } else if (index === 1) {
      // console.log('index====', index);

      this.loadData(currProfile);
      this.loadPreRecordsList(currProfile);
    }
  }
  loadData(profile) {
    const query = { no: profile.no };
    // console.info('tabmain=====query====', profile.no);
    this.props.dispatch({
      type: 'paymentRecord/loadPreStore',
      payload: query,
    });
  }
  loadConsumeRecordList(profile) {
    // console.log('tab111==',profile.no);
    const query = { proNo: profile.no, hosNo: profile.hosNo };
    // console.info('query', query);
    this.props.dispatch({
      type: 'paymentRecord/loadConsumeRecords',
      payload: query,
    });
  }
  loadPreRecordsList(profile) {
    // console.log('tab222==',profile.no);
    const query = { proNo: profile.no, hosNo: profile.hosNo };
    // console.info('query', query);
    this.props.dispatch({
      type: 'paymentRecord/loadPreRecords',
      payload: query,
    });
  }
  render() {
    // const { type } = this.state;
    return (
      <div className={style['container']}>
        <Tabs
          tabs={tabs}
          initalPage="t1"
          onChange={(tab, index) => {
            console.log('onChange', index, tab);
            // this.loadData();
          }}
          onTabClick={(tab, index) => {
            // console.log('onTabClick', index, tab);
            this.onTabClick(tab, index);
          }}
        >
          <ConsumeRecordList />
          <PreRecordsList />
        </Tabs>
      </div>
    );
  }
}

export default connect(({ paymentRecord, base }) => ({ paymentRecord, base }))(PaymentRecordMain2);
