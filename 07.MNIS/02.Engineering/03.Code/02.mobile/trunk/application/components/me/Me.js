/**
 * 我的 - 用户主页
 */

import React, {
  Component,
} from 'react';

import {
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  InteractionManager,
  Animated,
  AsyncStorage,
  Alert,
  Switch,
  ActivityIndicator,
} from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import DeviceInfo from 'react-native-device-info';
import Toast from 'react-native-root-toast';
import EasyIcon from 'rn-easy-icon';
import Separator from 'rn-easy-separator';

import Global from '../../Global';
import { logout } from '../../services/base/AuthService';
import { afterLogout, updateUser } from '../../actions/base/AuthAction';
import { base } from '../../services/RequestTypes';
// import { getByFkId } from '../../services/base/ImagesService';

// import JPush from 'react-native-jpush';

const portraits = {
  p002: require('../../assets/images/user/p0002.jpg'),
  u0001: require('../../assets/images/user/u0001.jpg'),
  u0002: require('../../assets/images/user/u0002.jpg'),
  u0003: require('../../assets/images/user/u0003.jpg'),
  u0004: require('../../assets/images/user/u0004.jpg'),
  u0005: require('../../assets/images/user/u0005.jpg'),
  dft: require('../../assets/images/me-portrait-dft.png'),
};

const containerWidth = Global.device.isTablet() ? (_.min([Global.screen.width, Global.screen.height]) * 0.8) : (Global.screen.width);

class Me extends Component {
  static displayName = 'Me';
  static description = '个人中心';

  static getPicBgHeight() {
    return (150 + 44);
  }

  static async clear() {
    await AsyncStorage.clear();
  }

  static renderPlaceholderView() {
    return (
      <View style={Global.styles.INDICATOR_CONTAINER} >
        <ActivityIndicator />
      </View>
    );
  }

  constructor(props) {
    super(props);

    this.getList = this.getList.bind(this);
    this.gotoLogin = this.gotoLogin.bind(this);
    this.navigate = this.navigate.bind(this);
    this.switchMessageState = this.switchMessageState.bind(this);
    this.logout = this.logout.bind(this);
    this.doLogout = this.doLogout.bind(this);
    this.switchEdition = this.switchEdition.bind(this);
    this.getScrollResponder = this.getScrollResponder.bind(this);
    this.setNativeProps = this.setNativeProps.bind(this);
    this.renderBackground = this.renderBackground.bind(this);
    // this.getImages = this.getImages.bind(this);
  }

  state = {
    doRenderScene: false,
    // bankCards: null,
    scrollY: new Animated.Value(0),
    messageSwitch: true, // 1: 关; 0: 开
    editionText: Global.getEditionDesc(),
    // userInfo: this.props.auth.user,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
      }/* , () => this.getImages()*/);
    });
  }

  getList() {
    return [
      {
        text: '个人资料',
        icon: 'md-person',
        bg: '#fe80c4',
        component: 'Profile',
        passProps: { userInfo: this.props.auth.user },
      },
      {
        text: '消息开关',
        icon: 'md-notifications',
        bg: '#ffa122',
        component: null,
        func: this.switchMessageState,
        right: <Switch
          value={this.state.messageSwitch}
          onValueChange={this.switchMessageState}
          style={{ marginRight: 10 }}
        />,
        separator: true,
      },
      {
        text: '联系我们',
        icon: 'md-mail',
        bg: '#ffa122',
        component: 'ContactUs',
        passProps: { x: 1 },
      },
      {
        text: '反馈意见',
        icon: 'ios-paper-plane',
        bg: '#fe80c4',
        component: 'Suggest',
        passProps: { auth: this.props.auth },
      },
      {
        text: '关于',
        icon: 'md-paper',
        bg: '#fed02f',
        component: 'AboutUs',
        separator: true,
      },
      {
        text: '设置',
        icon: 'md-cog',
        component: 'SettingsForTest',
        devMode: true,
        separator: true,
      },
      {
        text: '安全退出',
        icon: 'md-exit',
        bg: '#04d3be',
        func: this.logout,
        authorizedVisible: true,
      },
    ];
  }

  /**
   * IMPORTANT: You must return the scroll responder of the underlying
   * scrollable component from getScrollResponder() when using ScrollableMixin.
   */
  getScrollResponder() {
    return this.scrollView.getScrollResponder();
  }

  setNativeProps(props) {
    this.scrollView.setNativeProps(props);
  }

  // 取用户头像
  // TODO: 在后台用户对象加头像字段，存储头像图片的id，不要单独发请求去查
  // async getImages() {
  //   try {
  //     if (this.props.auth.user && !this.props.auth.user.portrait) {
  //       const responseData = await getByFkId({ fkId: this.props.auth.user.id });
  //       const user = { ...this.props.auth.user };
  //       if (responseData.success) {
  //         user.portrait = responseData.result === null ? null : responseData.result.id;
  //         this.props.updateUser(user);
  //       } else {
  //         this.handleRequestException({ msg: responseData.msg });
  //       }
  //     }
  //   } catch (e) {
  //     this.handleRequestException(e);
  //   }
  // }

  gotoLogin() {
    this.props.gotoLogin();
  }

  navigate({ title, component, passProps }) {
    if (component !== null) {
      this.props.navigate({ component, params: passProps });
    } else {
      Toast.show(`${title}即将开通`);
    }
  }

  switchMessageState() {
    this.setState({ messageSwitch: !this.state.messageSwitch }, () => {
      if (this.state.messageSwitch) {
        // JPush.stopPush();
      } else {
        // JPush.resumePush();
      }
    });
  }

  logout() {
    Alert.alert(
      '提示',
      '您确定要退出吗？',
      [
        { text: '取消', style: 'cancel' },
        { text: '确定', onPress: () => this.doLogout() },
      ],
    );
  }

  /**
   * 推送,清空别名和标签
   */
  // jPushClearAliasAndTags() {
  //   JPush.setTags([], '');
  //   console.log('清空别名和标签');
  // }

  async doLogout() {
    try {
      const responseData = await logout();
      if (responseData.success) {
        // 清空redux中的用户信息
        this.props.afterLogout();
        Toast.show('您已安全退出！');
        this.navigate({ component: 'Login' });
      }
    } catch (e) {
      this.handleRequestException(e);
    }
  }

  switchEdition() {
    Global.setEdition(Global.edition === Global.EDITION_MULTI ? Global.EDITION_SINGLE : Global.EDITION_MULTI);
    this.setState({ editionText: Global.getEditionDesc() });
  }

  renderBackground() {
    // console.log('containerWidth:', containerWidth);
    const picBgHeight = Me.getPicBgHeight();
    const { scrollY } = this.state;
    const width = containerWidth; // this.props.base.screen;
    return (
      <Animated.Image
        style={[styles.bg, {
          width,
          height: picBgHeight,
          transform: [{
            translateY: scrollY.interpolate({
              inputRange: [-picBgHeight, 0, picBgHeight],
              outputRange: [picBgHeight / 2, 0, -picBgHeight],
            }),
          }, {
            scaleY: scrollY.interpolate({
              inputRange: [-picBgHeight, 0, picBgHeight],
              outputRange: [2, 1, 1],
            }),
          }],
        }]}
        source={require('../../assets/images/base/me/default-bg.png')}
        resizeMode="cover"
      />
    );
  }

  renderList() {
    const list = this.getList().map(({
      text, icon, component, func, separator, passProps, right, devMode, authorizedVisible,
    }, idx) => {
      if (devMode === true && Global.mode !== Global.MODE_DEV) return null;

      const topLine = idx === 0 ? (<View style={Global.styles.FULL_SEP_LINE} />) : null;
      const bottomLine = idx === this.getList().length - 1 ? (<View style={Global.styles.FULL_SEP_LINE} />) : null;

      let itemLine = idx < this.getList().length - 1 ? (
        <View style={[Global.styles.FULL_SEP_LINE, { backgroundColor: 'white' }]} >
          <View style={[Global.styles.SEP_LINE_WITH_ICON]} />
        </View>
      ) : null;
      if (separator === true) {
        itemLine = (
          <View key={`${text}_${idx + 1}`}>
            <View style={Global.styles.FULL_SEP_LINE} />
            <Separator height={20} />
            <View style={Global.styles.FULL_SEP_LINE} />
          </View>
        );
      }

      const chevron = typeof right === 'object' ? right : (
        <EasyIcon
          iconLib="fa"
          name="angle-right"
          size={20}
          width={40}
          height={47}
          color={Global.colors.IOS_ARROW}
        />
      );

      const leftIcon = (
        <EasyIcon
          name={icon}
          size={20}
          width={40}
          height={47}
          color={Global.colors.FONT_LIGHT_GRAY1}
        />
      );

      return (
        <View key={`${text}_${idx + 1}`}>
          {topLine}
          <TouchableOpacity
            style={[styles.listItem, Global.styles.CENTER]}
            onPress={() => {
              if (authorizedVisible === true && !this.props.auth.isLoggedIn) {
                Toast.show('您还未登录！');
                return;
              }
              if (typeof func === 'function') {
                func();
              } else {
                this.navigate({ title: text, component, passProps });
              }
            }}
          >
            {leftIcon}
            <Text style={{ flex: 1, marginLeft: 10 }}>{text}</Text>
            {chevron}
          </TouchableOpacity>
          {itemLine}
          {bottomLine}
        </View>
      );
    });
    return list;
  }

  render() {
    if (!this.state.doRenderScene) {
      return Me.renderPlaceholderView();
    }
    // console.log('this.props.base.screen in me.render():', this.props.base.screen, this.props.base.orientation);
    // console.log('Global.getScreen() in me.render():', Global.getScreen());

    let userNameHolder = null;
    if (!this.props.auth.isLoggedIn) {
      userNameHolder = (
        <TouchableOpacity style={styles.userNamePos} onPress={() => this.props.navigate({ component: 'Login', params: null })}>
          <Text style={[styles.userName]}>请登录系统</Text>
        </TouchableOpacity>
      );
    } else {
      userNameHolder = (
        <TouchableOpacity style={styles.userNamePos} onPress={() => this.props.navigate({ component: 'Profile', params: { userInfo: this.props.auth.user } })}>
          <Text style={[styles.userName, styles.userNamePos]} >
            {this.props.auth.user && this.props.auth.user.name ?
              this.props.auth.user.name :
              (this.props.auth.user && this.props.auth.user.nickname ? this.props.auth.user.nickname : '未填写')
            }
          </Text>
        </TouchableOpacity>
      );
    }

    const portrait = this.props.auth.isLoggedIn && this.props.auth.user && this.props.auth.user.portrait ? (
      <Image
        resizeMode="cover"
        key={base().img + this.props.auth.user.portrait}
        style={[styles.portrait]}
        source={portraits[this.props.auth.user.portrait]}
      />
    ) : (
      <Image
        resizeMode="cover"
        style={[styles.portrait]}
        source={require('../../assets/images/me-portrait-dft.png')}
      />
    );
    // { uri: `${base().img}${this.props.auth.user.portrait}?timestamp=${new Date().getTime()}` }

    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]}>
        <View style={[styles.bgContainer, { width: this.props.base.screen.width }]} >
          {this.renderBackground()}
        </View>
        <ScrollView
          automaticallyAdjustContentInsets={false}
          style={styles.scrollView}
          contentContainerStyle={{ alignItems: 'center' }}
          keyboardShouldPersistTaps="always"
          ref={(component) => {
            this.scrollView = component;
          }}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }])}
          scrollEventThrottle={16}
        >
          <View style={{ width: containerWidth }} >
            <View style={[styles.portraitView]}>
              <TouchableOpacity
                style={styles.portraitHolder}
                onPress={() => {
                  this.navigate({ title: '个人资料', component: 'Profile', passProps: { userInfo: this.props.auth.user } });
                }}
              >
                {portrait}
              </TouchableOpacity>
              {userNameHolder}
            </View>
            {this.renderList()}
            <Separator height={40} />
          </View>
        </ScrollView>
        {/* {statusBarMask} */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  bgContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  bg: {
  },

  portraitView: {
    height: Me.getPicBgHeight() + 20,
    paddingTop: (Me.getPicBgHeight() - 64 - 12 - 17) / 2,
    alignItems: 'center',
  },
  portraitHolder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,.3)',
  },
  portrait: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userName: {
    flex: 1,
    fontSize: 17,
    color: 'white',
    textShadowColor: 'rgba(0,0,0,.4)',
    textShadowOffset: { width: 0.5, height: 1 },
    textShadowRadius: 0.5,
    backgroundColor: 'transparent',
  },
  userNamePos: {
    backgroundColor: 'transparent',
  },

  listItem: {
    flex: 1,
    height: 49,
    flexDirection: 'row',
    paddingLeft: 6,
    paddingRight: 0,
    backgroundColor: 'white',
  },
  listItemIcon: {
    width: 30,
    height: 30,
    borderRadius: 5,
  },

  statusBarMask: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: DeviceInfo.getModel() === 'iPhone X' ? 44 : 20,
    backgroundColor: 'rgba(0, 0, 0, .5)',
    borderBottomWidth: 1 / Global.pixelRatio,
    borderBottomColor: Global.colors.IOS_NAV_LINE,
  },
  itemRightText: {
    marginRight: 15,
    color: Global.colors.FONT_LIGHT_GRAY,
  },
});

Me.navigationOptions = {
  title: '设置',
};

const mapStateToProps = state => ({
  auth: state.auth,
  base: state.base,
});

const mapDispatchToProps = dispatch => ({
  // gotoLogin: () => dispatch(gotoLogin()),
  afterLogout: () => dispatch(afterLogout()),
  updateUser: () => dispatch(updateUser()),
  navigate: ({ component, params }) => dispatch(NavigationActions.navigate({ routeName: component, params })),
});

export default connect(mapStateToProps, mapDispatchToProps)(Me);
