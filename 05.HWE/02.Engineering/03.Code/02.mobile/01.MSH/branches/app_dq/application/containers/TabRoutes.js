import React from 'react';
import { Image, StyleSheet } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';

// import HealthCenter from '../components/health/HealthCenter';
// import Community from '../components/community/Community';
import HospitalFuncCenterSingle from '../components/hospital/HospitalFuncCenter.single';
import HospitalFuncCenterMulti from '../components/hospital/HospitalFuncCenter.multi';
// import Tools from '../components/tools/Tools';
// import Guide from '../components/guide/OutpatientGuidance';
import Me from '../components/me/Me';
import Global from '../Global';

/* tabBarIcon: ({ tintColor, focused }) => (
  <Image
    source={focused ? icons.hcActive : icons.hc}
    style={[styles.icon, { tintColor }]}
  />
), */

export const titles = {
  hfc: '首页',
  hc: '健康',
  comm: '社区',
  guide: '导诊',
  // tools: '工具',
  me: '我的',
};

export const tabsNavOptions = {
  hc: {
    title: titles.hc,
    tabBarLabel: titles.hc,
    showLabel: true,
    showIcon: true,
    tabBarIcon: ({ focused }) => (
      <Image
        resizeMode="contain"
        source={focused ? Global.Config.imgTabIcons.hcActive : Global.Config.imgTabIcons.hc}
        style={[styles.icon]}
      />
    ),
    // tabBarIcon: ({ tintColor, focused }) => (
    //   <Icon
    //     name={focused ? 'ios-paper' : 'ios-paper-outline'}
    //     size={26}
    //     style={{ color: tintColor }}
    //   />
    // ),
  },
  hfc: {
    title: titles.hfc,
    tabBarLabel: titles.hfc,
    showLabel: true,
    showIcon: true,
    tabBarIcon: ({ focused }) => (
      <Image
        resizeMode="contain"
        source={focused ? Global.Config.imgTabIcons.hospActive : Global.Config.imgTabIcons.hosp}
        style={[styles.icon]}
      />
    ),
  },
  comm: {
    title: titles.comm,
    tabBarLabel: titles.comm,
    showLabel: true,
    showIcon: true,
    tabBarIcon: ({ focused }) => (
      <Image
        resizeMode="contain"
        source={focused ? Global.Config.imgTabIcons.commActive : Global.Config.imgTabIcons.comm}
        style={[styles.icon]}
      />
    ),
  },
  // tools: {
  //   title: titles.tools,
  //   tabBarLabel: titles.tools,
  //   showLabel: true,
  //   showIcon: true,
  //   tabBarIcon: ({ tintColor, focused }) => (
  //     <Icon
  //       name={focused ? 'ios-medkit' : 'ios-medkit-outline'}
  //       size={26}
  //       style={{ color: tintColor }}
  //     />
  //   ),
  // },
  guide: {
    title: titles.guide,
    tabBarLabel: titles.guide,
    showLabel: true,
    showIcon: true,
    tabBarIcon: ({ focused }) => (
      <Image
        resizeMode="contain"
        source={focused ? Global.Config.imgTabIcons.guideActive : Global.Config.imgTabIcons.guide}
        style={[styles.icon]}
      />
    ),
  },
  me: {
    title: titles.me,
    tabBarLabel: titles.me,
    showLabel: true,
    showIcon: true,
    tabBarIcon: ({ focused }) => (
      <Image
        resizeMode="contain"
        source={focused ? Global.Config.imgTabIcons.meActive : Global.Config.imgTabIcons.me}
        style={[styles.icon]}
      />
    ),
    // tabBarIcon: ({ tintColor, focused }) => (
    //   <Icon
    //     name={focused ? 'ios-person' : 'ios-person-outline'}
    //     size={26}
    //     style={{ color: tintColor }}
    //   />
    // ),
  },
};

export default function TabRoutes(base) {
  return {
    HFCTab: {
      screen: base.edition === Global.EDITION_SINGLE ? HospitalFuncCenterSingle : HospitalFuncCenterMulti,
      navigationOptions: tabsNavOptions.hfc,
    },
    // HCTab: {
    //   screen: HealthCenter,
    //   navigationOptions: tabsNavOptions.hc,
    // },
    // GuideTab: {
    //   screen: Guide,
    //   navigationOptions: tabsNavOptions.guide,
    // },
    // CommTab: {
    //   screen: Community,
    //   navigationOptions: tabsNavOptions.comm,
    // },
    // ToolsTab: {
    //   screen: Tools,
    //   navigationOptions: tabsNavOptions.tools,
    // },
    MeTab: {
      screen: Me,
      navigationOptions: tabsNavOptions.me,
    },
  };
}

const styles = StyleSheet.create({
  icon: {
    width: 22, // 42.6 / 2,
    height: 22, // 43.4 / 2,
  },
});
