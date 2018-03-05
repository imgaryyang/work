/**
 * 上传头像
 */

import React, {
  Component,
} from 'react';

import {
  View,
  ScrollView,
  Text,
  Alert,
  TouchableOpacity,
  StyleSheet,
  InteractionManager,
} from 'react-native';

import Separator from 'rn-easy-separator';
import Button from 'rn-easy-button';
import EasyPortrait from 'rn-easy-portrait';
import Icon from 'rn-easy-icon';
import Toast from 'react-native-root-toast';


import Global from '../../Global';
// import UserAction from '../../flux/UserAction';
import CameraRollView from '../common/CameraRollView';

import { upload } from '../../services/base/ImagesService';
import { base } from '../../services/RequestTypes';


class Portrait extends Component {
  static displayName = 'Portrait';
  static description = '头像';

  static navigationOptions = (navigation) => ({
    title: '我的头像',
  });


  static defaultProps = {
  };

  static renderPlaceholderView() {
    return (
      <View style={Global.styles.CONTAINER} />
    );
  }

  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.takePhoto = this.takePhoto.bind(this);
    this.selectPhoto = this.selectPhoto.bind(this);
    this.selectedPhoto = this.selectedPhoto.bind(this);
    this.savePhoto = this.savePhoto.bind(this);
    this.updatePortrait = this.updatePortrait.bind(this);
  }

  state = {
    doRenderScene: false,
    userInfo: (
      this.props.navigation.state.params.data ?
        Object.assign({}, this.props.navigation.state.params.data) : null
    ),
    photo: null,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ doRenderScene: true });
    });
  }

  takePhoto() {
    Toast.show('暂无法访问相机！');
  }
  /**
   * 从相册选择
   */
  selectPhoto() {
    this.props.navigation.navigate('CameraRollView', {
      //selected: this.selectedPhoto,
      userInfo: this.state.userInfo,
      callback: this.selectedPhoto,
      hideNavBar: true,
    });
  }

  /**
   * 选择完图片后回调
   */
  selectedPhoto(photo) {
    this.setState({
      photo,
      // buttonDisabled: false,
      // showModal: false,
    });
    // this.savePhoto();
  }
  goPop() {
    this.props.navigation.goBack();
  }

  /**
   * 保存头像
   */
  async savePhoto() {
    let /* startPos, */ext;

    if (Global.os === 'ios') {
      // startPos = this.state.photo.uri.indexOf('&ext=');
      // ext = this.state.photo.uri.substring(startPos + 5, this.state.photo.uri.length);
    } else {
      // TODO: 需要想办法获取文件的真实扩展名
      ext = 'png';
    }
    const fileType = `image/${ext.toLowerCase()}`;
    const fileConfig = {
      uri: this.state.photo.uri,
      type: fileType,
      name: `${this.state.userInfo.id}.${ext.toLowerCase()}`,
    };
    const form = new FormData();
    form.append('FormData', true);
    form.append('id', this.state.userInfo.portrait);
    form.append('fkId', this.state.userInfo.id);
    form.append('fkType', 'user_portrait');
    form.append('memo', '1234');
    form.append('resolution', '');
    form.append('sortNum', '0');
    form.append('file', fileConfig);

    try {
      this.props.screenProps.showLoading();
      console.info(form)
      const responseData = await upload({
        body: form,
      });
      this.props.screenProps.hideLoading();
      if (responseData.success === false) {
        Alert.alert(
          '提示',
          `${responseData.msg},请重新输入!`,
          [
            {
              text: '确定',
            },
          ],
        );
      } else {
        this.state.userInfo.portrait = responseData.result.id;
        Toast.show('保存头像成功！');
        // 将头像id 存入 user表中
        // this.updatePortrait();
        // UserAction.onUpdateUser(this.state.userInfo);
        this.props.navigation.goBack();
      }
    } catch (e) {
      this.props.screenProps.hideLoading();
      this.handleRequestException(e);
    }
  }

  async updatePortrait() {
    try {
      this.showLoading();
      const responseData = await this.request(Global.host + SAVE_PORTRAIT_URL, {
        body: JSON.stringify({ portrait: this.state.userInfo.portrait }),
      });

      this.hideLoading();
      if (responseData.success === false) {
        Alert.alert(
          '提示',
          `${responseData.msg},请重新输入!`,
          [
            {
              text: '确定',
            },
          ],
        );
      } else {
        this.setState({ userInfo: responseData.result });
      }
      // 将头像id 存入 user表中
      Toast.show('修改用户信息成功！');
    } catch (e) {
      this.hideLoading();
      this.handleRequestException(e);
    }
  }
  render() {
    if (!this.state.doRenderScene) { return Portrait.renderPlaceholderView(); }

    const saveButton = this.state.photo ? (
      <Button text="头像上传" onPress={() => { this.savePhoto(); }} theme={Button.THEME.BLUE} style={{ marginLeft: 10, marginRight: 10 }} />
    ) : null;

    const portraitImage = (this.state.photo == null && this.state.userInfo.portrait == null) ?
      require('../../assets/images/me-portrait-dft.png') :
      (this.state.photo != null ? this.state.photo : { uri: base().img + this.state.userInfo.portrait + '?timestamp=' + new Date().getTime() });
    return (
      <View style={Global.styles.CONTAINER} >
        <ScrollView style={[styles.scrollView]} alwaysBounceVertical>

          <View style={[Global.styles.CENTER, styles.portraitHolder]} >
            <View style={styles.portraitbackground}>
              <EasyPortrait imageSource={portraitImage} width={100} height={100} radius={50} />
            </View>
          </View>

          <View style={Global.styles.FULL_SEP_LINE} />
          <TouchableOpacity style={[styles.buttonHolder, Global.styles.CENTER]} onPress={this.takePhoto} >
            <Icon iconLib="fa" name="camera" size={22} color={Global.colors.IOS_ARROW} style={[Global.styles.ICON]} />
            <Text style={{ flex: 1, marginLeft: 10 }} >拍一张照片</Text>
            <Icon iconLib="fa" name="angle-right" size={18} color={Global.colors.IOS_ARROW} style={[Global.styles.ICON, { width: 40 }]} />
          </TouchableOpacity>
          <View style={Global.styles.FULL_SEP_LINE} />
          <TouchableOpacity style={[styles.buttonHolder, Global.styles.CENTER]} onPress={this.selectPhoto} >
            <Icon iconLib="fa" name="photo" size={22} color={Global.colors.IOS_ARROW} style={[styles.icon, Global.styles.ICON]} />
            <Text style={{ flex: 1, marginLeft: 10 }}>从相册中选择一张</Text>
            <Icon iconLib="fa" name="angle-right" size={18} color={Global.colors.IOS_ARROW} style={[Global.styles.ICON, { width: 40 }]} />
          </TouchableOpacity>
          <View style={Global.styles.FULL_SEP_LINE} />
          <Separator height={20} />
          {saveButton}

        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    // backgroundColor: 'gray',
  },
  portraitHolder: {
    marginTop: 80,
    marginBottom: 80,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  portraitbackground: {
    height: 100,
    borderRadius: 50,
    width: 100,
    backgroundColor: 'gray',

  },
  buttonHolder: {
    width: Global.getScreen().width,
    flexDirection: 'row',
    padding: 7,
    paddingLeft: 15,
    paddingRight: 0,
    backgroundColor: 'white',
    height: 50,
  },
  button: {
    flex: 1,
    backgroundColor: 'transparent',
    height: 40,
  },
  buttonText: {
    fontSize: 15,

    backgroundColor: 'transparent',
  },

});



export default Portrait;

