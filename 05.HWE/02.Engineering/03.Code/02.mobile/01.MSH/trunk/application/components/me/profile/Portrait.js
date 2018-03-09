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
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

import Separator from 'rn-easy-separator';
import Button from 'rn-easy-button';
import EasyPortrait from 'rn-easy-portrait';
import Icon from 'rn-easy-icon';
import Toast from 'react-native-root-toast';

// import UserAction from '../../flux/UserAction';

import { upload } from '../../../services/base/ImagesService';
import { setPortrait } from '../../../services/base/AuthService';
import { base } from '../../../services/RequestTypes';

import { updateUser } from '../../../actions/base/AuthAction';
import Global from '../../../Global';


class Portrait extends Component {
  static displayName = 'Portrait';
  static description = '我的头像';

  static uuid() {
    const len = 32;// 32长度
    let radix = 16;// 16进制
    const chars = '0123456789abcdefghijklmnopqrstuvwxyz'.split(''); let uuid = [],
      i; radix = radix || chars.length; if (len) { for (i = 0; i < len; i++)uuid[i] = chars[0 | Math.random() * radix]; } else { let r; uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'; uuid[14] = '4'; for (i = 0; i < 36; i++) { if (!uuid[i]) { r = 0 | Math.random() * 16; uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r]; } } }
    return uuid.join('');
  }


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
    userInfo: this.props.auth.user,
    photo: [],
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ doRenderScene: true });
    });
    this.props.navigation.setParams({
      title: '我的头像',
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
      // selected: this.selectedPhoto,
      userInfo: this.state.userInfo,
      callback: this.selectedPhoto,
      hideNavBar: true,
    });
  }

  /**
   * 选择完图片后回调
   */
  selectedPhoto(photo) {
    this.state.photo = photo;
  }

  goPop() {
    this.props.navigation.goBack();
  }

  /**
   * 保存头像
   */
  async savePhoto() {
    let ext;

    if (Global.os === 'ios') {
      const startPos = this.state.photo[0].uri.indexOf('&ext=');
      ext = this.state.photo[0].uri.substring(startPos + 5, this.state.photo[0].uri.length);
    } else {
      // TODO: 需要想办法获取文件的真实扩展名
      ext = 'png';
    }
    const fileType = `image/${ext.toLowerCase()}`;
    const id = Portrait.uuid();
    const fileConfig = {
      uri: this.state.photo[0].uri,
      type: fileType,
      name: `${this.state.userInfo.portrait ? this.state.userInfo.portrait.split('.')[0] : id}.${ext.toLowerCase()}`,
    };
    const form = new FormData();
    form.append('FormData', true);
    form.append('id', this.state.userInfo.portrait ? this.state.userInfo.portrait.split('.')[0] : id);
    form.append('fkId', this.state.userInfo.id);
    form.append('fkType', '03');
    form.append('memo', 'user_portrait');
    form.append('resolution', '');
    form.append('sortNum', '0');
    form.append('file', fileConfig);

    try {
      this.props.screenProps.showLoading();
      const responseData = await upload({
        body: form,
      });


      if (responseData.success === false) {
        this.props.screenProps.hideLoading();
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
        Toast.show('保存头像成功！');
        // 将头像id 存入 user表中
        /* if (this.state.userInfo.portrait === null) {
          this.updatePortrait(responseData.result.fileName);
        } */

        // 将头像文件名 存入 user表中
        this.updatePortrait(responseData.result.fileName);

        this.props.screenProps.hideLoading();
        updateUser(this.state.userInfo);
        // 回调列表更新数据
        const { callback } = this.props.navigation.state.params;
        if (typeof callback === 'function') callback(this.state.userInfo);
        // 返回列表页
        this.props.navigation.goBack();
      }
    } catch (e) {
      this.props.screenProps.hideLoading();
      this.handleRequestException(e);
    }
  }

  async updatePortrait(portrait) {
    try {
      const user = this.state.userInfo;
      user.portrait = portrait;
      const responseData = await setPortrait(user);
      if (responseData.success === false) {
        this.setState({ userInfo: user });
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
      this.handleRequestException(e);
    }
  }
  render() {
    if (!this.state.doRenderScene) { return Portrait.renderPlaceholderView(); }

    const saveButton = this.state.photo ? (
      <Button text="头像上传" onPress={() => { this.savePhoto(); }} theme={Button.THEME.BLUE} style={{ margin: 20 }} />
    ) : null;
    const portraitImage = this.state.photo.length === 0 && this.state.userInfo.portrait === null ?
      Global.Config.defaultImgs.userPortrait :
      (this.state.photo.length > 0 ? this.state.photo[0] : { uri: `${Global.getImageHost()}${this.state.userInfo.portrait}?timestamp=${new Date().getTime()}` });
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
            <Icon iconLib="fa" name="camera" size={22} width={22} height={22} color={Global.colors.IOS_ARROW} style={[Global.styles.ICON]} />
            <Text style={{ flex: 1, marginLeft: 10 }} >拍一张照片</Text>
            <Icon iconLib="fa" name="angle-right" size={18} width={18} height={18} color={Global.colors.IOS_ARROW} style={[Global.styles.ICON, { width: 40 }]} />
          </TouchableOpacity>
          <View style={Global.styles.FULL_SEP_LINE} />
          <TouchableOpacity style={[styles.buttonHolder, Global.styles.CENTER]} onPress={this.selectPhoto} >
            <Icon iconLib="fa" name="photo" size={22} width={22} height={22} color={Global.colors.IOS_ARROW} style={[styles.icon, Global.styles.ICON]} />
            <Text style={{ flex: 1, marginLeft: 10 }}>从相册中选择一张</Text>
            <Icon iconLib="fa" name="angle-right" size={18} width={18} height={18} color={Global.colors.IOS_ARROW} style={[Global.styles.ICON, { width: 40 }]} />
          </TouchableOpacity>
          <View style={Global.styles.FULL_SEP_LINE} />
          {saveButton}
          <Separator height={20} />
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
    backgroundColor: Global.colors.FONT_LIGHT_GRAY1,
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

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
  updateUser: user => dispatch(updateUser(user)),
  navigate: ({ component, params }) => dispatch(NavigationActions.navigate({ routeName: component, params })),
});

export default connect(mapStateToProps, mapDispatchToProps)(Portrait);

