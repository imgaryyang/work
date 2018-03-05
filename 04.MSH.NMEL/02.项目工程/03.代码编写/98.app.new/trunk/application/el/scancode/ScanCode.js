'use strict';

import React, {
  Component,

} from 'react';

import {
  View,
  ScrollView,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  InteractionManager,
  Animated,
  AppRegistry,
  Dimensions,
  Platform,

} from 'react-native';

import PropTypes from 'prop-types';
import * as Global  		from '../../Global';
import NavBar				from 'rn-easy-navbar';
// import BarcodeScanner 		from 'react-native-barcode-scanner-universal';
import WebViewLink		    from './WebView';



class QRCodeScreen  extends Component {

  static displayName = 'QRCodeScreen ';
  static description = '扫一扫';
  url =null;

  static propTypes = {
    cancelButtonVisible: PropTypes.bool,
    cancelButtonTitle: PropTypes.string,
    onSucess: PropTypes.func,
    onCancel: PropTypes.func,

  };

  static defaultProps = {

  };

  state = {
    doRenderScene: false,
    data: null,
  };

  constructor (props) {
    super(props);

  }

  componentDidMount () {
    InteractionManager.runAfterInteractions(() => {
      this.setState({doRenderScene: true});
    });
  }

  componentWillReceiveProps () {

  }


  /*处理读取到的二维码*/
  abarcodeReceived(url) {
    console.log('Barcode: ' + url.data);
    console.log('Type: ' + url.type);
    /*目前只支持URL码*/
    if (url.data.substring(0,7) == 'http://')
    {

      this.props.navigator.push({
        component: WebViewLink,
        hideNavBar: true,
        passProps: {
          url: url.data,

        }
      })

    }
    else
    {
      this.toast('此码无法识别！');
    }

  }

  render(){
    var cancelButton = null;
    let scanArea = null

    this.barCodeFlag = true;
    console.info(this.data);
    if(!this.state.doRenderScene)
      return this._renderPlaceholderView();

    if (Platform.OS === 'ios') {
      scanArea = (
        <View style={styles.rectangleContainer}>
          <View style={styles.rectangle} />
        </View>
      )
    }

    return (
      <View style = {Global._styles.CONTAINER} >

        {this._getNavBar()}

        <BarcodeScanner
          onBarCodeRead={(code) => this.abarcodeReceived(code)}
          style={styles.camera}>
          {scanArea}
        </BarcodeScanner>

      </View>
    );
  }


  _renderPlaceholderView () {
    return (
      <View style = {Global._styles.CONTAINER}>
        {this._getNavBar}
      </View>
    );
  }
  _getNavBar(){
    return(
      <NavBar
        navigator={this.props.navigator}
        route={this.props.route}
        title={"扫一扫"}
        backText={"返回"}
      />
    );
  }
}



const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: 'white',
    marginBottom: Global._os == 'ios' ? 48 : 0,
  },
  logo: {
    width: 120,
    height: 150,
    borderRadius: 7,
    // left: 120,
  },
  holder: {
    marginLeft: 20,
    marginRight: 20,
  },

  camera: {
    flex: 1,
    width: Global.getScreen().width,
    //height: 500,
    //alignItems: 'center',
  },

  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  rectangle: {
    height: 280,
    width: 280,
    borderWidth: 2,
    borderColor: '#00FF00',
    backgroundColor: 'transparent',
  },

  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  }

});

export default QRCodeScreen ;