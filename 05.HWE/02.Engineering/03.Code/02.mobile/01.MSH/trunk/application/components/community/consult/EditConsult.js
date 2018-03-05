import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  Image,
  View,
  Text,
  InteractionManager,
  TouchableWithoutFeedback,
  Alert,
  FlatList,
} from 'react-native';

import Toast from 'react-native-root-toast';
import Sep from 'rn-easy-separator';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import EasyButton from 'rn-easy-button';
import Portrait from 'rn-easy-portrait';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'rn-easy-icon';

import Global from '../../../Global';
import Form from '../../../modules/form/EasyForm';
import { save } from '../../../services/community/ConsultRecordsService';


import { upload } from '../../../services/base/ImagesService';

const dismissKeyboard = require('dismissKeyboard');

class EditConsult extends Component {
  static displayName = 'EditConsult';
  static description = '添加咨询';

  static add0(m) {
    return m < 10 ? `0${m}` : m;
  }
  static timestamp() {
    const time = new Date();
    const y = time.getFullYear();
    const m = time.getMonth() + 1;
    const d = time.getDate();
    const h = time.getHours();
    const mm = time.getMinutes();
    const s = time.getSeconds();

    return y + EditConsult.add0(m) + EditConsult.add0(d) + EditConsult.add0(h) + EditConsult.add0(mm) + EditConsult.add0(s);
  }

  static renderPlaceholderView() {
    return (
      <View style={[Global.styles.CONTAINER, styles.container]} />
    );
  }


  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.submit = this.submit.bind(this);
    this.countdown = this.countdown.bind(this);
    this.selectPhoto = this.selectPhoto.bind(this);
    this.selectedPhoto = this.selectedPhoto.bind(this);
    this.savePhoto = this.savePhoto.bind(this);
    this.renderImage = this.renderImage.bind(this);
  }

  state = {
    doRenderScene: false,
    value: (
      this.props.navigation.state.params.data ?
        Object.assign({}, this.props.navigation.state.params.data) : null
    ),
    data: Object.assign({}),
    second: 30,
    photo: [],
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ doRenderScene: true });
    });

    this.props.navigation.setParams({
      title: '添加咨询',
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    clearTimeout(this.clockTimer);
  }

  /**
   * 为表单绑定 onChange 事件，表单中的任何元素更改都会触发此方法
   */
  onChange(fieldName, fieldValue, formValue) {
    // console.log(arguments);
    this.setState({ data: formValue });
  }

  form = null;
  timer = null;
  clockTimer = null;

  /**
   * 从相册选择
   */
  async selectPhoto() {
    this.props.navigation.navigate('CameraRollView', {
      callback: this.selectedPhoto,
      hideNavBar: true,
      maxCount: 5,
      type: 'multi',
    });
  }

  /**
   * 选择完图片后回调
   */
  async selectedPhoto(photo) {
    /* let list = this.state.photo ;
    list = list.concat(this.state.photo);
    for (var i=0; i < photo.length; i++) {
      list.push( photo[i] );
    }
    this.state.photo = list; */


    for (let i = 0; i < photo.length; i++) {
      this.state.photo.push(photo[i]);
    }
  }

  /**
   * 保存图片
   */
  async savePhoto() {
    let ext;

    if (Global.os === 'ios') {
      const startPos = this.state.photo[0].uri.indexOf('&ext=');
      ext = this.state.photo[0].uri.substring(startPos + 5, this.state.photo[0].uri.length);
    } else {
      ext = 'png';
    }
    if (this.state.photo != null && this.state.photo.length > 0) {
      for (let i = 0; i < this.state.photo.length; i++) {
        const fileType = `image/${ext.toLowerCase()}`;
        const id = EditConsult.timestamp();
        const fileConfig = {
          uri: this.state.photo[i].uri,
          type: fileType,
          name: `${id}.${ext.toLowerCase()}`,
        };
        const form = new FormData();
        form.append('FormData', true);
        form.append('id', id);
        form.append('fkId', this.state.data.id);
        form.append('fkType', 'consult_image');
        form.append('memo', '1234');
        form.append('resolution', '');
        form.append('sortNum', '0');
        form.append('file', fileConfig);

        try {
          // this.props.screenProps.showLoading();
          const responseData = await upload({
            body: form,
          });
          // this.props.screenProps.hideLoading();
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
          }
          /* else {
            this.state.userInfo.portrait = responseData.result.id;
            Toast.show('保存头像成功！');
            // 将头像id 存入 user表中
            // this.updatePortrait();
            // UserAction.onUpdateUser(this.state.userInfo);
            this.props.navigation.goBack();
          } */
        } catch (e) {
          // this.props.screenProps.hideLoading();
          this.handleRequestException(e);
        }
      }
    }
  }

  countdown() {
    if (this.state.second === 0) {
      this.setState({ second: 30 });
      return;
    }

    const second = this.state.second ? this.state.second - 1 : 30;
    this.clockTimer = setTimeout(
      () => {
        this.setState({ second });
        this.countdown();
      },
      1000,
    );
  }

  async submit() {
    if (this.form.validate()) {
      try {
        // 显示遮罩
        this.props.screenProps.showLoading();
        // 完善数据
        const record = this.state.data;
        record.deptId = this.state.value.depId;
        record.deptName = this.state.value.depName;
        record.hosId = this.state.value.hosId;
        record.hosName = this.state.value.hosName;
        record.doctorId = this.state.value.id;
        record.createdBy = this.props.auth.user.id;
        record.updatedBy = this.props.auth.user.id;
        // 调用后台保存
        const responseData = await save(record);
        if (responseData.success) {
          // 提示成功信息
          Toast.show('保存成功！');

          this.setState({ data: responseData.result });

          // 上传图片
          this.savePhoto();

          // 隐藏遮罩
          this.props.screenProps.hideLoading();
          // 回调列表更新数据
          const { callback } = this.props.navigation.state.params;
          if (typeof callback === 'function') callback(responseData.result);
          // 返回列表页
          this.props.navigation.goBack();
        } else {
          Toast.show(responseData.msg || '保存数据出错！');
        }
      } catch (e) {
        // 隐藏遮罩
        this.props.screenProps.hideLoading();
        this.handleRequestException(e);
      }
    }
  }


  renderImage(data) {
    return (
      <View>
        <Image source={data.item} style={{ marginLeft: 13, marginTop: 10, width: 57, height: 57 }} />
      </View>
    );
  }

  render() {
    if (!this.state.doRenderScene) { return EditConsult.renderPlaceholderView(); }
    const portrait = (<Portrait
      width={66}
      height={66}
      radius={33}
      bgColor="rgba(102,51,0,.2)"
      imageSource={this.state.value.photo === null ?
        require('../../../assets/images/me-portrait-dft.png') : ({ uri: `${Global.getImageHost()}${this.state.value.photo}?timestamp=${new Date().getTime()}` })}
    />);

    const ds = [
      { label: '咨询一', value: '1' },
      { label: '咨询二', value: '2' },
      { label: '咨询三', value: '3' },
    ];


    return (

      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]}>
        {/* <EasyCard radius={20}>
          <View style={{ height: 240, flexDirection: 'row' }} >
            <View style={{ flex: 1 }}>
              {portrait}
              <Text style={{ marginTop:20, marginLeft: 15, width: 70, height: 70, backgroundColor: 'red', fontSize: 18, color: 'white'}} > 咨询费  50.00元</Text>
            </View>
            <View style={{ flex: 2, flexDirection: 'column' }}>
              <Text><Text style={{ fontSize: 20, width: 100, fontWeight: '600' }}>{this.state.value.name}</Text>   {this.state.value.gender === '1' ? '男' : '女'}  {this.state.value.jobTitle}</Text>
              <Text>{this.state.value.depName}</Text>
              <Text style={{ fontSize: 18, width: 100, fontWeight: '600' }}>基本信息</Text>
              <Text style={{ height: 80 }}>
                {this.state.value.major.length > 100 ? this.state.value.major.substring(0, 100) + '......' : this.state.value.major }
              </Text>
              <Text style={{ fontSize: 18, width: 100, fontWeight: '600' }}>擅长领域</Text>
              <Text>
                {this.state.value.speciality.length > 100 ? this.state.value.speciality.substring(0, 100) + '......' : this.state.value.speciality }
              </Text>
            </View>
          </View>
        </EasyCard>
        <EasyCard radius={20} style={{marginTop: 10}}>
          <ScrollView style={styles.scrollView}>
            <Form
              ref={(c) => { this.form = c; }}
              labelWidth={65}
              onChange={this.onChange}
              value={this.state.data}
              labelPosition={'left'}
              style={{ backgroundColor: 'red' }}
            >
              <Form.Picker name="consultType" label="咨询类型" placeholder="请选择咨询类型" dataSource={ds} />
              <Form.TextInput name="consultTopic" label="咨询主题" placeholder="请输入咨询主题" required minLength={5} maxLength={40} />
              <Form.TextInput multiline style={{ height: 200 }} name="consultDetail" label="咨询内容" placeholder="请输入咨询内容" required maxLength={400} />
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ marginLeft: 5, marginTop: 20, color: '#2C3742' }} fontSize={20} fontWeight={800}>添加图片</Text>
                <View style={{ width: 50 }}>
                  <Button
                    style={{
                       marginLeft: 10, marginTop: 10, width: 40, height: 40, borderColor : 'black', backgroundColor: 'white'
                    }}
                    onPress={() => {
                      this.selectPhoto();
                    }}
                  >
                    <Icon name="md-add" size={40} width={40} height={40} />
                  </Button>
                </View>
              </View>
            </Form>

            <View style={styles.btnHolder} >
              <Button
                text="在线支付并发起咨询"
                style={{ marginTop: 10 }}
                onPress={() => {
                  this.submit();
                }}
              />
            </View>
          </ScrollView>
        </EasyCard> */}
        <TouchableWithoutFeedback onPress={() => dismissKeyboard()} accessible={false} >
          <KeyboardAwareScrollView style={styles.scrollView} keyboardShouldPersistTaps="always" >
            <LinearGradient colors={['#FE4D3D', '#FF8040', '#FF9731']} style={[styles.linearGradient, { height: 90 }]}>
              <View style={{ flexDirection: 'row', marginLeft: 15 }}>
                {portrait}
                <View style={{ flexDirection: 'column' }}>
                  <View style={{ marginLeft: 10, flexDirection: 'row' }}>
                    <Text style={{ fontSize: 16, color: '#fff', fontWeight: 'bold' }}>{this.state.value.name}</Text>
                    {/* <EasyCard style={{ height: 25, borderRadius: 18, backgroundColor: '#FE4D3D', borderColor: '#fff', alignItems: 'center', borderWidth: 2 / Global.pixelRatio }} ><Text style={{ fontSize: 15, color: '#fff' }}>{this.state.value.jobTitle}</Text></EasyCard> */}
                    <View
                      style={{
                      marginLeft: 10,
                      marginTop: 4,
                      height: 20,
                      paddingLeft: 10,
                      paddingRight: 10,
                      borderRadius: 10,
                      backgroundColor: 'transparent',
                      borderWidth: 1 / Global.pixelRatio,
                      borderColor: 'white',
                    }}
                    >
                      <Text style={{ color: 'white', fontSize: 13 }}>{this.state.value.jobTitle}</Text>
                    </View>
                  </View>
                  <Text style={{ marginLeft: 10, fontSize: 15, width: 100, color: '#fff' }}>{this.state.value.depName}</Text>
                  <Text style={{ marginLeft: 10, fontSize: 15, width: 150, color: '#fff' }}>咨询费：100.00/次</Text>
                </View>
              </View>
            </LinearGradient>
            <View style={[{ marginTop: 8, paddingTop: 10, paddingBottom: 10 }, Global.styles.CONTAINER]}>
              <View >
                <Text style={{ marginLeft: 15, fontSize: 16, fontWeight: 'bold' }}>医生简介/擅长</Text>
                <View style={{ marginLeft: 15, marginTop: 10, flexDirection: 'row' }}>
                  <Text style={{ fontSize: 14 }}>擅长：</Text>
                  <Text numberOfLines={3} style={{ fontSize: 14, alignItems: 'center', width: Global.getScreen().width - 67 }}>{this.state.value.speciality ? this.state.value.speciality : '暂无擅长' } </Text>
                </View>
              </View>
              <Sep style={[Global.styles.BORDER, { marginTop: 10 }]} />
              <View style={{ marginLeft: 15, marginTop: 10, flexDirection: 'row' }}>
                <Text style={{ fontSize: 14 }}>简介：</Text>
                <Text numberOfLines={3} style={{ fontSize: 14, alignItems: 'center' }}>{this.state.value.major ? this.state.value.major : '暂无简介' } </Text>
              </View>
            </View>
            <Form
              ref={(c) => { this.form = c; }}
              labelWidth={65}
              onChange={this.onChange}
              value={this.state.data}
              labelPosition="left"
              style={{ backgroundColor: 'red' }}
            >
              <Form.Picker name="consultType" label="咨询类型" placeholder="请选择咨询类型" dataSource={ds} />
              <Form.TextInput multiline style={{ height: 200 }} name="consultDetail" label="咨询内容" placeholder="请输入咨询内容" required maxLength={400} lineHeight={5} />
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ marginLeft: 5, marginTop: 20, color: '#2C3742' }} fontSize={20} fontWeight={800}>添加图片</Text>
                <View>
                  <FlatList
                    data={this.state.photo}
                    horizontal
                    renderItem={this.renderImage}
                    contentContainerStyle={{ maxWidth: 300, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}
                    scrollEnabled={false}
                  />
                  <EasyButton
                    style={{
                  marginLeft: 13, marginTop: 10, width: 57, height: 57, borderColor: 'black', backgroundColor: 'white',
                }}
                    onPress={() => {
                  this.selectPhoto();
                }}
                  >
                    <Icon name="md-add" size={40} width={40} height={40} />
                  </EasyButton>
                </View>
              </View>
            </Form>
            <View style={[styles.btnHolder, { height: 50 }]} >
              <EasyButton
                text="提交咨询"
                style={{ marginTop: 10 }}
                onPress={() => {
              this.submit();
            }}
              />
            </View>
          </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {},
  btnHolder: {
    flexDirection: 'row', margin: 10, marginTop: 0, marginBottom: 40,
  },
  linearGradient: {
    justifyContent: 'center',
  },
});


const mapStateToProps = state => ({
  auth: state.auth,
});


export default connect(mapStateToProps)(EditConsult);
