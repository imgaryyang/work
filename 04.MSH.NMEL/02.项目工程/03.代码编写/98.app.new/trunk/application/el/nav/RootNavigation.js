/**
 * 主导航组件
 * 采用 StackNavigator
 * by Victor
 * Created on 2017/11/13
 * Updated on 2017/11/13
 */

import { StackNavigator } from 'react-navigation';

import TabNavigation from './TabNavigation';
/* scenes of me */
import Profile from '../me/Profile';
import SecuritySettings from '../me/SecuritySettings';
import ContactUs from '../me/ContactUs';
import AboutUs from '../me/AboutUs';
import Suggest from '../me/Suggest';

const RootNavigation = StackNavigator({
  Root: {
    screen: TabNavigation,
  },
  Profile: {
    screen: Profile,
  },
  SecuritySettings: {
    screen: SecuritySettings,
  },
  ContactUs: {
    screen: ContactUs,
  },
  AboutUs: {
    screen: AboutUs,
  },
  Suggest: {
    screen: Suggest,
  },
});

export default RootNavigation;
