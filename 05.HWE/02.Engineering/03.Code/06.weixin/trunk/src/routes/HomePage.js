import React from 'react';
import { routerRedux, Prompt } from 'dva/router';
import { connect } from 'dva';
import { Grid, TabBar, Button, List, WhiteSpace, WingBlank, Modal } from 'antd-mobile';
import Icon from '../components/CustomIcon';
import styles from './HomePage.less';
import Portrait from './me/Portrait';
import imgNews from '../assets/images/hospital_news.jpg';

const { Item } = List;

const menus = [
  { icon: 'i_appoint', text: '手机预约', description: '足不出户 挂号看病', uri: '/appoint/departments' },
  { icon: 'i_report', text: '报告单查询', description: '检查结果 随时解读', uri: '/report' },
  { icon: 'i_daily', text: '健康资讯', description: '医院动态 实时掌握', uri: '/news' },
  { icon: 'i_inhospital', text: '住院单查询', description: '住院单查询', uri: '/inpatientBillQuery' },
  { icon: 'i_daily', text: '住院日清单', description: '住院日清单', uri: '/inpatientDaily/inpatientDailyList' },
  { icon: 'i_recharge', text: '门诊消费记录', description: '门诊消费记录', uri: '/paymentRecord/paymentRecordList' },
  { icon: 'i_foregift', text: '住院预缴记录', description: '住院预缴记录', uri: 'inpatientPaymentRecord/inpatientPaymentRecordList' },
  // { icon: 'i_recharge', text: '门诊预存', description: '门诊预存', uri: '/payment/inputMoney' },
  { icon: 'i_refund', text: '门诊退费', description: '门诊退费', uri: '/outpatientReturn/outpatientRefundList' },
];

const mes = [
  { icon: 'user', text: '个人资料', description: '个人资料', uri: '/me/profile' },
  { icon: 'contacts', text: '常用就诊人', description: '常用就诊人', uri: '/patientMain/patient' },
  { icon: 'mail', text: '联系我们', description: '联系我们', uri: 'contactUs' },
  { icon: 'from', text: '反馈意见', description: '反馈意见', uri: 'feedBack' },
  { icon: 'copy', text: '关于', description: '关于', uri: 'aboutUs' },
  { text: '预约历史', uri: '/appoint/records' },
];

const controls = [
  '/',
  '/home',
  '/loginZFB',
  '/loginWeChat',
  '/appoint/departments',
  '/appoint/schedule',
  '/appoint/source',
  '/news',
  '/newsDetail',
  '/me/profile',
  '/patientMain/profiles',
  '/patientMain/patient',
  '/feedBack',
  '/aboutUs',
  '/contactUs',
  '/appoint/records',
  '/payment/inputMoney',
];
class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.toBind = this.toBind.bind(this);
  }
  componentDidMount() {
    routerRedux.replace(0);
  }
  selectMenu(menu) {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(menu.uri));
  }
  pressTab(tab) {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/save',
      payload: { selectedTab: tab },
    });
  }
  logout(openid, userId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/logout',
      payload: { openid, userId },
    });
  }
  toBind(location) {
    const { profiles } = this.props.base;
    let flag = profiles.length === 0;
    if (controls.indexOf(location.pathname) >= 0) {
      flag = false;
    }
    if (flag) {
      Modal.alert('提示', '暂无档案信息，是否前去绑定？', [
        { text: '取消', onPress: () => this.props.dispatch(routerRedux.goBack()) },
        { text: '确认', onPress: () => this.props.dispatch(routerRedux.push('/patientMain/addPatient')) },
      ]);
    }
  }
  renderGridItem(el) {
    const { text, icon, description } = el;
    const cls = `${styles['icon']} ${styles[icon]}`;
    return (
      <div className={styles['menu']} onClick={() => this.selectMenu(el)} >
        <div className={cls} />
        <div className={styles['text']}>
          <div className={styles['name']}>{text}</div>
          <div className={styles['desc']}>{description}</div>
        </div>
      </div>
    );
  }
  render() {
    const { selectedTab } = this.props.home;
    const { openid, userId, user, profiles } = this.props.base;
    console.log('user', user);
    console.log('profiles', profiles);
    return (
      <div className={styles['container']}>
        <Prompt message={this.toBind} />
        <TabBar unselectedTintColor="#949494" tintColor="#33A3F4" >
          <TabBar.Item
            title="医院"
            key="hospital"
            icon={<Icon type="hospital" color="black" />}
            selectedIcon={<Icon type="hospital-active" color="red" />}
            selected={selectedTab === 'hospital'}
            onPress={() => this.pressTab('hospital')}
          >
            <div className={styles['full']} >
              <div className={styles['news']}>
                <img alt="" src={imgNews} />
                <div className={styles['desc']}>
                  <div className={styles['title']}>大庆龙南医院</div>
                  <div className={styles['level']}>三级甲等</div>
                </div>
              </div>
              <div className={styles['address']}>
                <a href="tel:0459-5989120" className={styles['phone']}><span className={styles['i_phone']} /></a>
                <div className={styles['content']}>
                  <span className={styles['i_location']} />
                  <font>让胡路区爱国路35号</font>
                </div>
              </div>
              <Grid columnNum={2} square={false} data={menus} activeStyle={false} renderItem={(el, index) => this.renderGridItem(el, index)} />
              <div className={styles['info']}>
                <div className={styles['title']}>医院简介</div>
                <div className={styles['content']}>大庆龙南医院地处石油、石化企业中心区域，始建于1997年，是一所集医疗、教学、科研、预防保健于一体的综合性国家三级甲等医院。建筑面积10.8万平方米，开放床位823张，共设34个病区，38个临床科室，年门诊量100万余人次。</div>
              </div>
              <div className={styles['info']}>
                <div className={styles['title']}>公共交通</div>
                <div className={styles['content']}>公交车线路有:38路、202路、6路、26路、34路</div>
              </div>
            </div>
          </TabBar.Item>
          <TabBar.Item
            title="我的"
            key="info"
            icon={<Icon type="me" color="black" />}
            selectedIcon={<Icon type="me-active" color="red" />}
            selected={selectedTab === 'info'}
            onPress={() => this.pressTab('info')}
          >
            <div className={styles['full']} >
              <Portrait />
              <WhiteSpace />
              <List>
                {
                  mes.map((menu, index) => (
                    <Item key={index} className={styles['placeholder']} arrow="horizontal" onClick={() => this.selectMenu(menu)}>
                      <span>{menu.text}</span>
                    </Item>
                  ))
                }
              </List>
              <WhiteSpace />
              <WingBlank>
                <Button type="primary" onClick={() => this.logout(openid, userId)}>退出</Button>
              </WingBlank>
            </div>
          </TabBar.Item>
        </TabBar>
      </div>
    );
  }
}

HomePage.propTypes = {
};

export default connect(({ home, user, base }) => ({ home, user, base }))(HomePage);
