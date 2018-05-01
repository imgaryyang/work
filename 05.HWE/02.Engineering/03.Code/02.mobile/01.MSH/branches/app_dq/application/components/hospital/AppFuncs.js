import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Image, View, Text } from 'react-native';
import _ from 'lodash';
import Toast from 'react-native-root-toast';
// import Swiper from 'react-native-swiper';

import Global from '../../Global';

export default class AppFuncs extends Component {
  static primaryItemWidth = (Global.getScreen().width) / 3;
  static primaryIconWidth = Global.getScreen().width / 6;

  static itemWidth = (Global.getScreen().width - 4) / 4;
  static iconWidth = Global.getScreen().width / 8;

  constructor(props) {
    super(props);
    this.onPressMenuItem = this.onPressMenuItem.bind(this);
    this.chooseHospitalForNext = this.chooseHospitalForNext.bind(this);
  }

  onPressMenuItem(component, title, passProps, children, state) {
    if (component && state === '1') {
      if (component === 'AppSubFuncs') {
        this.props.navigate({
          component,
          params: {
            title,
            ...passProps,
            children,
            onPressMenuItem: this.onPressMenuItem,
          },
        });
      } else if (_.indexOf(Global.Config.needProfileComp, component) !== -1 && !this.props.base.currProfile) {
        // 判断当前档案，如果没选择档案，则需要先选择
        Toast.show('请先选择就诊人');
        this.props.navigate({
          component: 'ChoosePatient',
          params: {
            title: '选择就诊人',
            callback: (hospital, patient, profile) => {
              if (profile) {
                this.props.setCurrPatient(patient, profile);
                this.props.navigate({
                  component,
                  params: {
                    title,
                    ...passProps,
                    hospital: this.props.currHospital,
                  },
                });
              }
            },
            hideNavBarBottomLine: false,
            allowSwitchHospital: true,
          },
        });
      } else if (_.indexOf(Global.Config.needChooseHospServices, component) === -1 || this.props.currHospital) {
        this.props.navigate({
          component,
          params: {
            title,
            ...passProps,
            hospital: this.props.currHospital,
          },
        });
      } else {
        this.props.navigate({
          component: 'HospitalList',
          params: {
            title: '选择医院',
            chooseHospitalForNext: this.chooseHospitalForNext,
            routeName: component,
            passProps,
            hideNavBarBottomLine: true,
          },
        });
      }
    } else {
      Toast.show(`${title}即将开通${'\n'}敬请期待`);
    }
  }

  // 需要先选择医院的业务，在选择医院后回调
  chooseHospitalForNext(hospital, routeName, passProps) {
    this.props.setCurrHospital(hospital);
    this.props.navigate({ component: routeName, params: { hospital, ...passProps } });
  }

  /**
   * 渲染所有菜单项
   */
  renderMenu() {
    const { services, imgIcons } = Global.Config;
    const mainServices = _.dropRight(services.hfc, services.hfc.length - 6);
    return mainServices.map(({
      id, name, imgIcon, route, passProps, children, state,
    }, idx) => {
      // const bgColor = idx >= 6 ? this.bgColors[idx % 6] : this.bgColors[idx];
      const forbiddenItemIconStyle = !route || state !== '1' ? { tintColor: Global.colors.FONT_LIGHT_GRAY1 } : {};
      const forbiddenItemTextStyle = !route || state !== '1' ? { color: Global.colors.FONT_LIGHT_GRAY1 } : {};
      const content = (
        <View style={[styles.primaryItem, idx === 2 || idx === 5 ? { borderRightWidth: 0 } : null]} >
          <View style={[styles.primaryIconContainer]} >
            <Image source={imgIcons[imgIcon]} resizeMode="contain" style={[styles.primaryIcon, forbiddenItemIconStyle]} />
          </View>
          <Text style={[styles.primaryText, forbiddenItemTextStyle]}>{name}</Text>
        </View>
      );
      return (
        <TouchableOpacity
          key={id}
          style={styles.primaryItemContainer}
          onPress={() => {
            this.onPressMenuItem(route, name, passProps, children, state);
          }}
        >
          {content}
        </TouchableOpacity>
      );
    });
  }

  // renderSlideMenu() {
  //   const { services, imgIcons } = Global.Config;
  //   const otherServices = _.slice(services.hfc, 3);
  //   const chunkServices = _.chunk(otherServices, 4);
  //   return chunkServices.map((menus, idx) => {
  //     const content = menus.map(({
  //       id, name, imgIcon, route, /* borderColor, */passProps, children,
  //     }) => {
  //       return (
  //         <TouchableOpacity
  //           key={id}
  //           style={styles.itemContainer}
  //           onPress={() => {
  //             this.onPressMenuItem(route, name, passProps, children);
  //           }}
  //         >
  //           <View style={styles.item} >
  //             <View style={[styles.iconContainer]} >
  //               <Image source={imgIcons[imgIcon]} resizeMode="contain" style={styles.icon} />
  //             </View>
  //             <Text style={[styles.text]} numberOfLines={1}>{name}</Text>
  //           </View>
  //         </TouchableOpacity>
  //       );
  //     });
  //     return (
  //       <View style={styles.slideMenuContainer} key={`slide_${idx + 1}`} >
  //         {content}
  //       </View>
  //     );
  //   });
  // }

  render() {
    return (
      <View style={styles.container} >
        <View style={styles.menu} >
          {this.renderMenu()}
        </View>
        {/* <Swiper
          style={styles.wrapper}
          paginationStyle={{ bottom: 5 }}
          autoplay={false}
          loop={false}
          width={Global.getScreen().width}
          height={AppFuncs.itemWidth + 10}
          dotStyle={{
            width: 3,
            height: 3,
            borderRadius: 1.5,
            backgroundColor: Global.colors.FONT_LIGHT_GRAY1,
          }}
          activeDotStyle={{
            width: 6,
            height: 3,
            borderRadius: 1.5,
            backgroundColor: Global.colors.IOS_GREEN,
          }}
        >
          {this.renderSlideMenu()}
        </Swiper>*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1 / Global.pixelRatio,
    borderTopColor: Global.colors.LINE,
    // borderBottomWidth: 1 / Global.pixelRatio,
    // borderBottomColor: Global.colors.LINE,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  menu: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  primaryItemContainer: {
    width: AppFuncs.primaryItemWidth,
  },
  primaryItem: {
    width: AppFuncs.primaryItemWidth,
    height: AppFuncs.primaryItemWidth - 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1 / Global.pixelRatio,
    borderRightColor: Global.colors.LINE,
    borderBottomWidth: 1 / Global.pixelRatio,
    borderBottomColor: Global.colors.LINE,
    // marginBottom: 1,
    paddingBottom: 10,
  },
  primaryIconContainer: {
    width: AppFuncs.primaryIconWidth,
    height: AppFuncs.primaryIconWidth,
    borderRadius: AppFuncs.primaryIconWidth / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryIcon: {
    width: AppFuncs.primaryIconWidth / 2,
    height: AppFuncs.primaryIconWidth / 2,
    backgroundColor: 'transparent',
    tintColor: Global.colors.FONT_GRAY,
  },
  primaryText: {
    width: AppFuncs.itemWidth - 10,
    fontSize: 14,
    textAlign: 'center',
    overflow: 'hidden',
    marginTop: 5,
    color: '#000000',
    fontWeight: '600',
  },

  // itemContainer: {
  //   width: AppFuncs.itemWidth,
  // },
  // item: {
  //   width: AppFuncs.itemWidth,
  //   height: AppFuncs.itemWidth + 10,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   // backgroundColor: 'red',
  // },
  // iconContainer: {
  //   width: AppFuncs.iconWidth,
  //   height: AppFuncs.iconWidth,
  //   // borderWidth: 1 / Global.pixelRatio,
  //   borderRadius: AppFuncs.iconWidth / 2,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   paddingBottom: 20,
  //   // backgroundColor: 'green',
  // },
  // icon: {
  //   width: AppFuncs.iconWidth / 2,
  //   height: AppFuncs.iconWidth / 2,
  //   backgroundColor: 'transparent',
  //   tintColor: Global.colors.FONT_GRAY,
  // },
  // text: {
  //   width: AppFuncs.itemWidth - 10,
  //   fontSize: 12,
  //   textAlign: 'center',
  //   overflow: 'hidden',
  //   marginTop: 0,
  //   top: -8,
  //   color: '#000000',
  //   fontWeight: '600',
  // },

  wrapper: {
    marginTop: 2,
  },
  slideMenuContainer: {
    flexDirection: 'row',
  },
});
