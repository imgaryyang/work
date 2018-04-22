import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  InteractionManager,
} from 'react-native';

import Toast from 'react-native-root-toast';
import Button from 'rn-easy-button';
import EasyCard from 'rn-easy-card';

import Global from '../../../Global';
import { reply, complete } from '../../../services/community/ConsultRecordsService';
import { getByFkId } from '../../../services/base/ImagesService';

class EditReply extends Component {
  static displayName = 'EditReply';
  static description = '咨询回复';

  static renderPlaceholderView() {
    return (
      <View style={[Global.styles.CONTAINER, styles.container]} />
    );
  }

  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.gotoComplete = this.gotoComplete.bind(this);
    this.renderImage = this.renderImage.bind(this);
    this.getImages = this.getImages.bind(this);
  }

  state = {
    doRenderScene: false,
    value: (
      this.props.navigation.state.params.data ?
        Object.assign({}, this.props.navigation.state.params.data) : null
    ),
    data: Object.assign({}),
    buttonDisabled: false,
    images: [],
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ doRenderScene: true }, () => this.getImages());
    });
    this.props.navigation.setParams({
      title: '咨询回复',
      headerRight: (
        this.props.navigation.state.params.data.status !== '3' ?
          (<Text
            onPress={() => {
              /* if (typeof this.props.navigation.state.params.gotoComplete === 'function') {
                this.props.navigation.state.params.gotoComplete();
              }*/
              this.gotoComplete();
            }}
            style={{ color: Global.styles.FONT_GRAY, fontSize: 14, marginRight: 10 }}
          >
            完成
          </Text>) : ''

      ),
    });
  }


  async getImages() {
    try {
      if (this.state.value && this.state.images.length === 0) {
        const responseData = await getByFkId({ fkId: this.state.value.id });
        if (responseData.success) {
          let list = [];
          list = list.concat(this.state.images);

          for (let i = 0; i < responseData.result.length; i++) {
            list.push(responseData.result[i]);
          }
          this.setState({ images: list });
        } else {
          this.handleRequestException({ msg: responseData.msg });
        }
      }
    } catch (e) {
      this.handleRequestException(e);
    }
  }


  async submit() {
    try {
      // 显示遮罩
      this.props.screenProps.showLoading();

      // 完善数据
      const record = this.state.data;
      record.type = 'consult';
      record.status = '0';
      record.businessId = this.state.value.id;
      record.sendId = this.state.value.createdBy;
      record.sendContent = this.refs.sendContent._lastNativeText;
      record.createOper = this.props.auth.user.name;
      record.updateOper = this.props.auth.user.name;
      record.createOperId = this.props.auth.user.id;
      record.updateOperId = this.props.auth.user.id;
      // 调用后台保存
      const responseData = await reply(record);
      if (responseData.success) {
        // 提示成功信息
        Toast.show('回复成功！');
        // 隐藏遮罩
        this.props.screenProps.hideLoading();
        // 回调列表更新数据
        const replyArr = this.state.value.replyList;
        replyArr[0] = record;
        this.props.navigation.state.params.data = replyArr;
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

  async gotoComplete() {
    try {
      // 显示遮罩
      this.props.screenProps.showLoading();
      // 完善数据
      const record = this.state.value;
      // 调用后台保存
      const responseData = await complete(record);
      if (responseData.success) {
        // 提示成功信息
        Toast.show('修改成功！');
        // 隐藏遮罩
        this.props.screenProps.hideLoading();
        // 回调列表更新数据
        const { callback } = this.props.navigation.state.params;
        if (typeof callback === 'function') callback(responseData.result);
        // 返回列表页
        this.props.navigation.goBack();
      } else {
        Toast.show(responseData.msg || '修改数据出错！');
      }
    } catch (e) {
      // 隐藏遮罩
      this.props.screenProps.hideLoading();
      this.handleRequestException(e);
    }
  }

  renderImage(data) {
    return (
      <View>
        <Image source={{ uri: `${Global.getImageHost()}${data.item.fileName}?timestamp=${new Date().getTime()}` }} style={{ marginLeft: 8, width: 57, height: 57 }} />
      </View>
    );
  }


  render() {
    if (!this.state.doRenderScene) {
      return EditReply.renderPlaceholderView();
    }

    let type = '';
    if (this.state.value.consultType === '1') {
      type = '咨询一';
    } else if (this.state.consultType === '2') {
      type = '咨询二';
    } else if (this.state.value.consultType === '3') {
      type = '咨询三';
    }

    const isShow = this.state.value.status === '3' ? 'none' : 'flex';


    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]}>
        <ScrollView>
          <EasyCard radius={8} style={{ marginTop: 6 }}>
            {/* <View >
              <View style={{ flexDirection: 'row', paddingTop: 3 }}>
                <Text style={{ fontWeight: '800', fontSize: 16 }}>咨询类型:</Text>
                <Text>{type}</Text>
              </View>
               <Text><Text style={{ fontWeight: '800', fontSize: 16 }}>咨询主题:</Text>
              <Text>{this.state.value.consultTopic}</Text>
            </Text>
              <View style={{ flexDirection: 'row', paddingTop: 3 }}>
                <Text style={{ fontWeight: '800', fontSize: 16 }}>咨询内容:</Text>
                <Text style={{ marginLeft: 8 }}>{this.state.value.consultDetail}</Text>
              </View>
              <View style={{ flexDirection: 'row', paddingTop: 3 }}>
                <Text style={{ fontWeight: '800', fontSize: 16 }}>相关图片:</Text>
                <View>
                  <FlatList
                    data={this.state.images}
                    horizontal
                    extraData={this.state.images}
                    renderItem={this.renderImage}
                    contentContainerStyle={{ maxWidth: 300, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}
                    scrollEnabled={false}
                  />
                </View>
              </View>
            </View>*/}
            <View style={{ flexDirection: 'row', paddingTop: 3 }}>
              <Text style={{ fontSize: 14, color: '#2C3742' }}>类型：</Text>
              <Text style={{ marginLeft: 8, fontSize: 14, alignItems: 'center', width: Global.getScreen().width - 65 }}>{type}</Text>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 3 }}>
              <Text style={{ fontSize: 14, color: '#2C3742' }}>内容：</Text>
              <Text style={{ marginLeft: 8, fontSize: 14, alignItems: 'center', width: Global.getScreen().width - 65 }}>{this.state.value.consultDetail}</Text>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 3 }}>
              <Text style={{ fontSize: 14, color: '#2C3742' }}>图片：</Text>
              <View>
                <FlatList
                  data={this.state.images}
                  horizontal
                  extraData={this.state.images}
                  renderItem={this.renderImage}
                  contentContainerStyle={{ maxWidth: 300, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}
                  scrollEnabled={false}
                />
              </View>
            </View>
          </EasyCard>
          <EasyCard radius={8} style={{ marginTop: 6 }}>
            <ScrollView style={styles.scrollView}>
              {/* <TextInput
                style={{ height: 200 }}
                placeholder="请输入回复内容"
                required
                ref="sendContent"
                maxLength={200}
                defaultValue={this.state.value.reply ? this.state.value.reply.sendContent : ''}
              />*/}
              <View style={[styles.viewInputHolder]}>
                <TextInput
                  style={[styles.rowInput]}
                  multiline
                  ref="sendContent"
                  maxLength={500}
                  onChangeText={(value) => { this.changeFeedBack(value); }}
                  placeholder="您好，请您对以上咨询做出回复！"
                  underlineColorAndroid="transparent"
                  defaultValue={this.state.value.reply ? this.state.value.reply.sendContent : ''}
                />
              </View>
              <View style={[styles.buttonHolder, { display: isShow }]} >
                <Button
                  text="提交"
                  onPress={() => {
                    this.setState({ buttonDisabled: !this.state.buttonDisabled });
                    this.submit();
                  }}
                  theme={Button.THEME.BLUE}
                />
              </View>

              {/* <View style={[styles.btnHolder, { display: isShow }]}>
                <Button
                  text="保存"
                  style={{ marginTop: 10 }}
                  onPress={() => {
                  this.setState({ buttonDisabled: !this.state.buttonDisabled });
                  this.submit();
                }}
                />
              </View>*/}
            </ScrollView>
          </EasyCard>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {},
  btnHolder: {
    flexDirection: 'row', margin: 10, marginTop: 0, marginBottom: 40,
  },

  rowInput: {
    flex: 1,
    fontSize: 14,
    backgroundColor: 'transparent',
    padding: 6,
  },

  viewInputHolder: {
    flex: 1,
    flexDirection: 'row',
    height: 120,
    borderWidth: 1 / Global.pixelRatio,
    borderColor: Global.colors.LINE,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: '#F8F8F8',
  },
  buttonHolder: {
    flexDirection: 'row',
    marginTop: 8,
  },
});


const mapStateToProps = state => ({
  auth: state.auth,
});


export default connect(mapStateToProps)(EditReply);
