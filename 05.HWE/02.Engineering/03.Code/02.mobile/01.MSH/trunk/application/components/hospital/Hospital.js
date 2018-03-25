/**
 * 医院微主页
 */

import React, { Component } from 'react';
import {
  InteractionManager,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Animated,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
// import Portrait from 'rn-easy-portrait';
import { B, S } from 'rn-easy-text';

import Global from '../../Global';
import * as Filters from '../../utils/Filters';
import { base } from '../../services/RequestTypes';
import { contacts, sectionDescs } from '../../services/base/BaseService';
import { info } from '../../services/hospital/HospitalService';
import HospitalIntro from './HospitalIntro';
import HospitalDepts from './HospitalDepts';
import HospitalDoctors from './HospitalDoctors';
import NewsListComponent from '../news/NewsListComponent';

class Hospital extends Component {
  static displayName = 'Hospital';
  static description = '医院微主页';

  static getPicBgHeight() {
    return Global.getScreen().width * (1 - 0.618);
  }

  constructor(props) {
    super(props);
    this.fetchData = this.fetchData.bind(this);
    this.onMenuPress = this.onMenuPress.bind(this);
    this.renderBackground = this.renderBackground.bind(this);
    this.renderNavMenu = this.renderNavMenu.bind(this);
    this.pullToRefresh = this.pullToRefresh.bind(this);
    this.onChildCompLoaded = this.onChildCompLoaded.bind(this);
  }

  state = {
    doRenderScene: false,
    hospital: Object.assign(this.props.navigation.state.params.hospital),
    scrollY: new Animated.Value(0),
    menuIdx: 0,
    pullToRefreshing: false,
  };

  componentDidMount() {
    this.props.navigation.setParams({
      title: '医院信息',
    });
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
      }, () => {
        this.fetchData();
      });
    });
    this.props.screenProps.getCurrentLocation(() => {});
  }

  onMenuPress(idx) {
    this.setState({
      menuIdx: idx,
    });
  }

  onChildCompLoaded() {
    this.setState({
      pullToRefreshing: false,
    });
  }

  menus = [
    { text: '首页', component: HospitalIntro, passProps: null },
    { text: '科室', component: HospitalDepts, passProps: null },
    { text: '医生', component: HospitalDoctors, passProps: null },
    {
      text: '院报',
      component: NewsListComponent,
      passProps: () => {
        return {
          fkId: this.state.hospital.id,
          fkType: 'N1',
          title: '院报',
          loadingText: '正在载入院报信息...',
        };
      },
    },
    {
      text: '特色',
      component: NewsListComponent,
      passProps: () => {
        return {
          fkId: this.state.hospital.id,
          fkType: 'N2',
          title: '特色',
          loadingText: '正在载入医院特色信息...',
        };
      },
    },
  ];

  pullToRefresh() {
    // console.log(this.state.menuIdx, this.currComp);
    this.setState({
      pullToRefreshing: true,
    }, () => {
      // 如果处在首页，则只刷新本页中医院基本信息
      if (this.state.menuIdx === 0) {
        this.fetchData();
      } else { // 调用对应组件的刷新
        this.currComp.pullToRefresh();
      }
    });
  }

  /**
   * 加载数据
   */
  async fetchData() {
    try {
      const responseData = await info(this.state.hospital.id);
      const hospContacts = await contacts(0, 100, { fkId: this.state.hospital.id, fkType: 'hospital' });
      const hospSectionDescs = await sectionDescs(0, 100, { fkId: this.state.hospital.id, fkType: 'hospDesc' });
      if (responseData.success) {
        this.setState({
          hospital: {
            ...responseData.result,
            contacts: hospContacts.result,
            descs: hospSectionDescs.result,
          },
          pullToRefreshing: false,
        });
      } else {
        this.setState({
          pullToRefreshing: false,
        });
        this.handleRequestException({ msg: '获取医院信息出错！' });
      }
    } catch (e) {
      this.setState({
        pullToRefreshing: false,
      });
      this.handleRequestException(e);
    }
  }

  /**
   * 渲染过渡场景
   */
  renderPlaceholderView() {
    const bgSource = Global.Config.defaultImgs.hospBg;
    return (
      <View style={Global.styles.CONTAINER} >
        <Image source={bgSource} style={{ width: Global.getScreen().width, height: Hospital.getPicBgHeight() }} resizeMode="contain" />
        {this.renderNavMenu()}
      </View>
    );
  }

  renderBackground() {
    const picBgHeight = Hospital.getPicBgHeight();
    const { scrollY, hospital } = this.state;

    const bgSource = hospital && hospital.homeBg ?
      { uri: base().img + hospital.homeBg } :
      Global.Config.defaultImgs.hospBg;

    return (
      <Animated.Image
        style={[styles.bg, {
          height: picBgHeight,
          transform: [{
            translateY: scrollY.interpolate({
              inputRange: [-picBgHeight, 0, picBgHeight],
              outputRange: [picBgHeight / 2, 0, -picBgHeight],
            }),
          }, {
            scale: scrollY.interpolate({
              inputRange: [-picBgHeight, 0, picBgHeight],
              outputRange: [2, 1, 1],
            }),
          }],
        }]}
        source={bgSource}
        resizeMode="cover"
      />
    );
  }

  renderNavMenu() {
    const items = this.menus.map((item, idx) => {
      const selectedViewStyle = this.state.menuIdx === idx ? { borderBottomColor: Global.colors.ORANGE } : null;
      const selectedTextStyle = this.state.menuIdx === idx ? { color: Global.colors.ORANGE } : null;
      return (
        <TouchableOpacity key={`menu_item_${idx + 1}`} style={[styles.navMenuItem, selectedViewStyle]} onPress={() => this.onMenuPress(idx)} >
          <Text style={[styles.navMenuItemText, selectedTextStyle]} >{item.text}</Text>
        </TouchableOpacity>
      );
    });
    return (
      <View style={[styles.navMenu]} >
        {items}
      </View>
    );
  }

  render() {
    // console.log('this.props in Hospital.render():', this.props);
    // 场景过渡动画未完成前，先渲染过渡场景
    if (!this.state.doRenderScene) {
      return this.renderPlaceholderView();
    }

    const { hospital, refreshing, requestErr } = this.state;
    const logoSource = hospital && hospital.logo ?
      { uri: `${Global.getImageHost()}${hospital.logo}?timestamp=${new Date().getTime()}` } :
      Global.Config.defaultImgs.hospLogo;

    const flowNavMenu = (
      <Animated.View style={[styles.navMenuHolder, {
        opacity: this.state.scrollY.interpolate({
          inputRange: [Hospital.getPicBgHeight(), Hospital.getPicBgHeight() + 1],
          outputRange: [0, 1],
        }),
      }]}
      >
        {this.renderNavMenu()}
      </Animated.View>
    );

    let selectedView = null;
    if (!refreshing && !requestErr && this.menus[this.state.menuIdx].component) {
      const Comp = this.menus[this.state.menuIdx].component;
      const { passProps } = this.menus[this.state.menuIdx];
      selectedView = (
        <Comp
          ref={(c) => { this.currComp = c; }}
          hosp={this.state.hospital}
          onChildCompLoaded={this.onChildCompLoaded}
          screenProps={this.props.screenProps}
          navigation={this.props.navigation}
          {...(typeof passProps === 'function' ? passProps() : passProps)}
        />
      );
    }

    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]} >
        {this.renderBackground()}
        <ScrollView
          ref={(component) => { this.scrollView = component; }}
          style={styles.scrollView}
          automaticallyAdjustContentInsets={false}
          onScroll={
            Animated.event([{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }])
          }
          refreshControl={
            <RefreshControl
              refreshing={this.state.pullToRefreshing}
              onRefresh={this.pullToRefresh}
            />
          }
          scrollEventThrottle={16}
        >
          <View style={{ justifyContent: 'center', alignItems: 'center', height: Hospital.getPicBgHeight() }} >
            <View
              style={[styles.portraitContainer, {
                width: Hospital.getPicBgHeight() / 3,
                height: Hospital.getPicBgHeight() / 3,
                borderRadius: 6, // Hospital.getPicBgHeight() / 3 / 2,
              }]}
            >
              <Image
                source={logoSource}
                resizeMode="contain"
                style={[styles.portrait, {
                  width: (Hospital.getPicBgHeight() / 3) - 5,
                  height: (Hospital.getPicBgHeight() / 3) - 5,
                }]}
              />
            </View>
            <Text style={styles.hospName} ><B><S>{hospital.name}</S></B></Text>
            <Text style={styles.levelText} ><S>{hospital.name ? Filters.filterHospLevel(hospital.level) : null} | {hospital.type ? Filters.filterHospType(hospital.type) : null}</S></Text>
          </View>
          {this.renderNavMenu()}
          {selectedView}
        </ScrollView>
        {flowNavMenu}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  bg: {
    position: 'absolute',
    width: Global.getScreen().width,
  },
  navbarHolder: {
    position: 'absolute',
    left: 0,
    top: 0,
  },

  backBtnHolder: {
    position: 'absolute',
    left: 0,
    width: 88,
    height: 44,
  },
  backBtn: {
    flex: 1,
    flexDirection: 'row',
    width: 88,
    height: 44,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
    paddingLeft: 7,
  },

  portraitContainer: {
    // marginTop: 25,
    backgroundColor: 'rgba(102,51,0,.2)',
    justifyContent: 'center',
    alignItems: 'center',
    // width: 60,
    // height: 60,
    // borderRadius: 30,
    overflow: 'hidden',
  },
  portrait: {
    // width: 45,
    // height: 45,
  },
  hospName: {
    marginTop: 8,
    fontSize: 17,
    color: 'white',
    backgroundColor: 'transparent',
  },
  levelText: {
    fontSize: 12,
    marginTop: 6,
    color: 'white',
    backgroundColor: 'transparent',
  },

  tabview: {
    // marginTop: 15,
    backgroundColor: 'rgba(0, 0, 0, .3)',
  },

  navMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1 / Global.pixelRatio,
    borderBottomColor: Global.colors.LINE,
  },
  navMenuItem: {
    width: 70,
    height: 40,
    justifyContent: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 2,
    borderBottomColor: 'white',
  },
  navMenuItemText: {
    fontSize: 14,
    color: Global.colors.FONT_GRAY,
    textAlign: 'center',
  },

  navMenuHolder: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Global.getScreen().width,
    overflow: 'hidden',
  },
});

Hospital.navigationOptions = () => ({
  // headerTitle: /* navigation.state.params.hospital ? navigation.state.params.hospital.name || '医院信息' : */ '医院信息',
});

export default Hospital;
