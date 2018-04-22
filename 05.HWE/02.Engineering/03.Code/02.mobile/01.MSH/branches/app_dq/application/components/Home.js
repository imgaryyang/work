import React, { Component } from 'react';

import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  InteractionManager,
} from 'react-native';

// import Button from 'rn-easy-button';

import Global from '../Global';

/* import ELPHome from '../../elp/Home';
import SalaryList from '../../els/SalaryList';
import ELHHome from '../../elh/Home';
import SIServices from '../../elh/si/SIServices';
import RegResource from '../../elh/register/RegisterResource.js';
import MedAlarmList from '../../elh/medAlarm/MedAlarmList'; */
/* 用药 */

/* add by shikai */
// import ScanCode from '../scancode/ScanCode';
/* 扫一扫 */
// import Message from '../message/Message';
/* 消息 */

const icons = {
  salary: require('../assets/images/base/salary.png'),
  pay: require('../assets/images/base/pay.png'),
  reg: require('../assets/images/base/reg.png'),
  treat: require('../assets/images/base/treat.png'),
  si: require('../assets/images/base/si.png'),
  med: require('../assets/images/base/med.png'),
};

/**
 * 系统提供的服务
 */
const services = [
  /* {
    code: '001', name: '工资', icon: 'salary', component: SalaryList, hideNavBar: true, navTitle: '工资',
  },
  {
    code: '002', name: '缴费', icon: 'pay', component: ELPHome, hideNavBar: true, navTitle: '缴费',
  },
  {
    code: '003', name: '挂号', icon: 'reg', component: RegResource, hideNavBar: true, navTitle: '挂号',
  },
  {
    code: '004', name: '就医', icon: 'treat', component: ELHHome, hideNavBar: true, navTitle: '就医',
  },
  {
    code: '005', name: '社保', icon: 'si', component: SIServices, hideNavBar: true, navTitle: '社保',
  },
  {
    code: '006', name: '用药', icon: 'med', component: MedAlarmList, hideNavBar: true, navTitle: '用药',
  }, */
  /* {code: '901', name: '样例', icon: 'salary',  component: SampleMenu, hideNavBar: true, navTitle: '样例',},
  {code: '904', name: '专属APP', icon: 'treat',  component: HosHome, hideNavBar: true, navTitle: '专属App',},
  {code: '905', name: '收银台', icon: 'si',  component: CashierTest, hideNavBar: true, navTitle: '收银台',}, */
];

const bgColors = ['#ff6666', '#ffcf2f', '#8b8ffa', '#4dc7ee', '#2bd3c2', '#ff80c3'];

const itemWidth = (Global.getScreen().width - 4) / 3;
const topImgHeight = (Global.getScreen().width * 255) / 750;

class Home extends Component {
  static displayName = 'Home';
  static description = '首页';

  static navigationOptions = () => ({
    /* headerLeft: (
      <Button
        onPress={() => {
          this.props.navigator.push({ /!* component: ScanCode, *!/ hideNavBar: true });
        }}
        stretch={false}
        clear
        style={Global.styles.NAV_BAR.BUTTON}
      >
        <Image
          resizeMode="cover"
          source={require('./assets/images/base/scan.png')}
          style={{
            width: 16,
            height: 16,
            backgroundColor: 'transparent',
            tintColor: 'blue',
          }}
        />
      </Button>
    ),
    headerRight: (
      <Button
        /!* onPress={() => {
          this.onPressMenuItem(Message, true, null);
        }} *!/
        stretch={false}
        clear
        style={Global.styles.NAV_BAR.BUTTON}
      >
        <Image
          resizeMode="cover"
          source={require('./assets/images/base/msg.png')}
          style={{
            width: 16,
            height: 16,
            backgroundColor: 'transparent',
            tintColor: 'blue',
          }}
        />
      </Button>
    ), */
  });

  static renderPlaceholderView() {
    return (
      <View style={Global.styles.CONTAINER}>
        {/* {this._getNavBar()} */}
      </View>
    );
  }

  constructor(props) {
    super(props);
    this.onPressMenuItem = this.onPressMenuItem.bind(this);
    this.renderMenu = this.renderMenu.bind(this);
  }

  state = {
    doRenderScene: false,
    services,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ doRenderScene: true });
    });
  }

  onPressMenuItem(component, hideNavBar, navTitle) {
    if (component) {
      this.props.navigator.push({
        title: navTitle,
        component,
        hideNavBar: hideNavBar || false,
      });
    } else {
      this.toast(`${navTitle}即将开通`);
    }
  }

  /**
   * 渲染所有菜单项
   */
  renderMenu() {
    const iconWidth = Global.getScreen().width / 5;
    return this.state.services.map(({
      code, name, icon, component, hideNavBar, navTitle,
    }, idx) => {
      const bgColor = idx >= 6 ? bgColors[idx % 6] : bgColors[idx];
      return (
        <TouchableOpacity
          key={code}
          style={[styles.item]}
          onPress={() => {
            this.onPressMenuItem(component, hideNavBar, navTitle);
          }}
        >
          <View style={{
            width: iconWidth,
            height: iconWidth,
            borderRadius: iconWidth / 2,
            backgroundColor: bgColor,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          >
            <Image
              resizeMode="cover"
              source={icons[icon]}
              style={{
                width: iconWidth / 2,
                height: iconWidth / 2,
                backgroundColor: 'transparent',
              }}
            />
          </View>
          <Text style={[styles.text]}>{name}</Text>
        </TouchableOpacity>
      );
    });
  }

  render() {
    if (!this.state.doRenderScene) {
      return Home.renderPlaceholderView();
    }

    return (
      <View style={Global.styles.CONTAINER}>
        <View automaticallyAdjustContentInsets={false} style={styles.scrollView}>
          <View style={styles.menu}>
            {this.renderMenu()}
          </View>
        </View>
        <ImageBackground
          resizeMode="cover"
          source={require('../assets/images/base/home-top-bg.jpg')}
          style={[styles.topImg, Global.styles.CENTER]}
        >
          <Text style={{ fontSize: 15, color: '#9e9dad', marginTop: 50 }}>有易在手 生活无忧</Text>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    // marginBottom: Global._os == 'ios' ? 48 : 0,
  },
  menu: {
    marginTop: topImgHeight,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  item: {
    width: itemWidth,
    height: itemWidth + 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 1,
  },
  text: {
    width: itemWidth - 10,
    fontSize: 15,
    textAlign: 'center',
    overflow: 'hidden',
    marginTop: 15,
  },

  topImg: {
    position: 'absolute',
    // top: Global._navBarHeight,
    left: 0,
    width: Global.getScreen().width,
    height: topImgHeight,
  },
});

export default Home;

