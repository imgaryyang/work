

import React, {
  Component,
} from 'react';

import {
  View,
  StyleSheet,
  InteractionManager,
  NativeAppEventEmitter,
  BackAndroid,
  Platform,
} from 'react-native';

import Global from '../../Global';
import JPushModule from 'jpush-react-native';

class JPush extends Component {

  static displayName = 'JPush';
  static description = '组件';


  static propTypes = {};

  static defaultProps = {};


  componentDidMount () {
    InteractionManager.runAfterInteractions(() => {
      this.setState({doRenderScene: true});
    });

    if (Platform.OS === 'android') {
      BackAndroid.addEventListener('hardwareBackPress', this._onBackAndroid);

      // -----------jpush android start
      // JPushModule.getInfo((map) => {
      //  console.log(map);
      // });
      // JPushModule.addReceiveCustomMsgListener((message) => {
      // });
      JPushModule.addReceiveNotificationListener((message) => {
        console.log("receive notification: ");
        console.log(message);
      });
      JPushModule.addReceiveOpenNotificationListener((map) => {
        console.log("Opening notification!");
        console.log("map.extra: " + map.extras);
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
        }
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

  render () {
    return (
      <View></View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingTop: 20,
  },

  fieldSet: {
    borderLeftWidth: 4,
    borderLeftColor: 'brown',
    paddingLeft: 10,
    paddingTop: 15,
    paddingBottom: 15,
  },
});

export default JPush;

