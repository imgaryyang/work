

import React, {
  Component,
} from 'react';

import {
  View,
  NativeAppEventEmitter,
  BackAndroid,
  Platform,
} from 'react-native';

import JPushModule from 'jpush-react-native';

class JPush extends Component {
  static displayName = 'JPush';
  static description = '组件';


  static propTypes = {};

  static defaultProps = {};


  componentDidMount() {
    if (Platform.OS === 'android') {
      BackAndroid.addEventListener('hardwareBackPress', this._onBackAndroid);

      // -----------jpush android start
      // JPushModule.getInfo((map) => {
      //  console.log(map);
      // });
      // JPushModule.addReceiveCustomMsgListener((message) => {
      // });
      JPushModule.addReceiveNotificationListener((message) => {
        console.log('receive notification: ');
        console.log(message);
      });
      JPushModule.addReceiveOpenNotificationListener((map) => {
        console.log('Opening notification!');
        console.log(`map.extra: ${map.extras}`);
        this.props.navigation.navigate('Message');
      });
      // -----------jpush android end
    }


    // -----------jpush ios start
    if (Platform.OS === 'ios') {
      this.subscription = NativeAppEventEmitter.addListener(
        'ReceiveNotification',
        (notification) => {
          console.log('-------------------收到推送----------------');
          console.log(notification);
        },
      );
    }
    // -----------jpush ios end
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackAndroid.removeEventListener('hardwareBackPress', this._onBackAndroid);
    }
    JPushModule.removeReceiveCustomMsgListener();
    JPushModule.removeReceiveNotificationListener();
  }

  render() {
    return (
      <View />
    );
  }
}


export default JPush;

