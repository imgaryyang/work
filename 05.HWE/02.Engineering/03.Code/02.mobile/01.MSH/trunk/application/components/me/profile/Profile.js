/**
 * 我的档案
 */

import React, {
  Component,
} from 'react';

import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  InteractionManager,
} from 'react-native';

import { connect } from 'react-redux';
import Button from 'rn-easy-button';
import Icon from 'rn-easy-icon';
import Portrait from 'rn-easy-portrait';

import Global from '../../../Global';
import { updateUser } from '../../../actions/base/AuthAction';

class Profile extends Component {
  static displayName = 'Profile';
  static description = '个人资料';

  static renderPlaceholderView() {
    return (
      <View style={Global.styles.CONTAINER} />
    );
  }
  constructor(props) {
    super(props);
    this.getList = this.getList.bind(this);
    this.gotoEdit = this.gotoEdit.bind(this);
    this.changePwd = this.changePwd.bind(this);
    this.afterEdit = this.afterEdit.bind(this);
    // this.getImages = this.getImages.bind(this);
    this.test = this.test.bind(this);
    this.afterTest = this.afterTest.bind(this);
  }

  state = {
    doRenderScene: false,
    userInfo: (
      this.props.navigation.state.params.userInfo ?
        Object.assign({}, this.props.navigation.state.params.userInfo) : null
    ),
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
      });
    });
    this.props.navigation.setParams({
      title: '个人资料',
      headerRight: (
        <Text
          onPress={() => {
            this.changePwd();
          }}
          style={{ color: Global.styles.FONT_GRAY, fontSize: 14, marginRight: 10 }}
        >
          修改密码
        </Text>
      ),
    });
  }

  // No icon list
  getList() {
    return [
      { textLeft: '姓名', textRight: this.state.userInfo.name || '未填写' },
      { textLeft: '性别', textRight: this.state.userInfo.gender === null ? '未填写' : (this.state.userInfo.gender === '1' ? '男' : '女') },
      { textLeft: '年龄', textRight: this.state.userInfo.age || '未填写' },
      { textLeft: '身份证号码', textRight: this.state.userInfo.idNo || '未填写' },
      { textLeft: '邮箱', textRight: this.state.userInfo.email || '未填写' },
      { textLeft: '地址', textRight: this.state.userInfo.address || '未填写' },
    ];
  }
  afterEdit(item) {
    this.setState({
      userInfo: item,
    });
  }
  gotoEdit() {
    this.props.navigation.navigate('EditProfile', {
      callback: this.afterEdit,
      title: '编辑个人资料',
      headerBackTitle: '首页',
    });
  }
  test() {
    console.log('archivesList:', this.props.base.currPatient);
    this.props.navigation.navigate('ArchivesList2', {
      callback: this.afterTest,
      title: '卡号列表',
    });
  }
  afterTest(item) {
    console.log('aftertest', item);
  }
  changePwd() {
    this.props.navigation.navigate('ChangePwd', { title: '修改密码' });
  }
  renderList() {
    const list = this.getList().map(({ textLeft, textRight, separator }, idx) => {
      const topLine = idx === 0 ? (<View style={Global.styles.FULL_SEP_LINE} />) : null;
      const bottomLine = idx === this.getList().length - 1 ? (<View style={Global.styles.FULL_SEP_LINE} />) : null;
      let itemLine = idx < this.getList().length - 1 ? <View style={Global.styles.FULL_SEP_LINE} /> : null;
      if (separator === true) {
        itemLine = (
          <View key={`${idx + 1}_${textLeft}`}>
            <View style={Global.styles.FULL_SEP_LINE} />
            <View style={Global.styles.PLACEHOLDER20} />
            <View style={Global.styles.FULL_SEP_LINE} />
          </View>
        );
      }

      return (
        <View key={`${idx + 1}_${textLeft}`}>
          {topLine}
          <View style={[styles.listItem, Global.styles.CENTER]}>
            <Text style={styles.textLeft}>{textLeft}</Text>
            <Text style={styles.textRight}>{textRight}</Text>
          </View>
          {itemLine}
          {bottomLine}
        </View>
      );
    });
    return list;
  }

  render() {
    if (!this.state.doRenderScene) {
      return Profile.renderPlaceholderView();
    }
    const portraitSource = this.state.userInfo && this.state.userInfo.portrait ?
      { uri: `${Global.getImageHost()}${this.state.userInfo.portrait}?timestamp=${new Date().getTime()}` } :
      Global.Config.defaultImgs.userPortrait;
    return (
      <View style={Global.styles.CONTAINER}>
        <ScrollView>
          <TouchableOpacity
            style={Global.styles.CENTER}
            onPress={() => {
              this.props.navigation.navigate('Portrait', {
                data: this.state.userInfo,
                callback: this.afterEdit,
                title: '我的头像',
              });
            }}
          >
            <View style={[styles.portraitItem, Global.styles.CENTER]}>
              <Text style={styles.textLeft}>头像</Text>
              <View style={styles.portraitHolder}>
                <Portrait
                  width={40}
                  height={40}
                  radius={20}
                  bgColor={Global.colors.FONT_LIGHT_GRAY1}
                  imageSource={portraitSource}
                />
              </View>
              <Icon
                iconLib="fa"
                name="angle-right"
                size={18}
                color={Global.colors.IOS_ARROW}
                width={40}
                height={40}
              />
            </View>
          </TouchableOpacity>
          {this.renderList()}
          <View style={{ flexDirection: 'row', margin: 20 }} >
            <Button
              text="编辑"
              onPress={this.gotoEdit}
              theme={Button.THEME.BLUE}
            />
          </View>
          <View style={{ flexDirection: 'row', margin: 20 }} >
            <Button
              text="测试"
              onPress={this.test}
              theme={Button.THEME.BLUE}
            />
          </View>
          <View style={Global.styles.PLACEHOLDER20} />
        </ScrollView>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: 'white',
    marginBottom: Global.os === 'ios' ? 48 : 0,
  },
  listItem: {
    alignItems: 'center',
    justifyContent: 'center', // 上下
    height: 50,
    width: Global.getScreen().width,
    backgroundColor: 'white',
    flexDirection: 'row',
  },
  textLeft: {
    fontSize: 15,
    fontWeight: '500',
    width: Global.getScreen().width / 3,
    left: 10,
  },
  textRight: {
    // width: Global.getScreen().width/4,
    flex: 1,
    right: 15,
    textAlign: 'right',
    color: Global.colors.FONT_GRAY,
    fontSize: 13,
  },

  portraitItem: {
    height: 70,
    width: Global.getScreen().width,
    backgroundColor: 'white',
    flexDirection: 'row',
  },
  portraitHolder: {
    flex: 1,
    height: 50,
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});

const mapStateToProps = state => ({
  auth: state.auth,
  base: state.base,
});

const mapDispatchToProps = dispatch => ({
  updateUser: user => dispatch(updateUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
