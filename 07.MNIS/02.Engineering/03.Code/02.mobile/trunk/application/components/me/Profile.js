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
  Image,
  TouchableOpacity,
  StyleSheet,
  InteractionManager,
} from 'react-native';

import { connect } from 'react-redux';
import Button from 'rn-easy-button';
import Icon from 'rn-easy-icon';
import { NavigationActions } from 'react-navigation';

import Global from '../../Global';
import { base } from '../../services/RequestTypes';
import { updateUser } from '../../actions/base/AuthAction';

const portraits = {
  p002: require('../../assets/images/user/p0002.jpg'),
  u0001: require('../../assets/images/user/u0001.jpg'),
  u0002: require('../../assets/images/user/u0002.jpg'),
  u0003: require('../../assets/images/user/u0003.jpg'),
  u0004: require('../../assets/images/user/u0004.jpg'),
  u0005: require('../../assets/images/user/u0005.jpg'),
  dft: require('../../assets/images/me-portrait-dft.png'),
};

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
      title: '我的个人资料',
      changePwd: this.changePwd,
    });
  }

  // No icon list
  getList() {
    return [
      // text, component, func, separator, passProps  var textright = textRight ? textRight : '未填写';
      // { textLeft: '昵称', textRight: this.state.userInfo.name || '未填写' },
      // {
      //   textLeft: '性别', textRight: this.state.userInfo.gender === null ? '未填写' : (this.state.userInfo.gender === '1' ? '男' : '女'),
      // },
      // { textLeft: '年龄', textRight: this.state.userInfo.age || '未填写' },
      // { textLeft: '身份证号码', textRight: this.state.userInfo.idNo || '未填写' },
      // { textLeft: '邮箱', textRight: this.state.userInfo.email || '未填写' },
      { textLeft: '登录账号', textRight: this.state.userInfo.username },
      { textLeft: '姓名', textRight: this.state.userInfo.name || '未填写' },
      { textLeft: '手机号', textRight: this.state.userInfo.mobile || '未填写' },
      { textLeft: '科室', textRight: this.state.userInfo.deptName || '未填写' },
    ];
  }
  afterEdit(item) {
    this.setState({
      userInfo: item,
    });
  }
  gotoEdit() {
    this.props.navigation.navigate('EditProfile', {
      afterEdit: this.afterEdit,
    });
  }
  changePwd() {
    this.props.navigation.navigate('ChangePwd');
  }
  renderList() {
    const list = this.getList().map(({ textLeft, textRight, separator }, idx) => {
      const topLine = idx === 0 ? (<View style={Global.styles.FULL_SEP_LINE} />) : null;
      const bottomLine = idx === this.getList().length - 1 ? (<View style={Global.styles.FULL_SEP_LINE} />) : null;

      let itemLine = idx < this.getList().length - 1 ? <View style={Global.styles.SEP_LINE} /> : null;
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
    const portrait = this.state.userInfo && this.state.userInfo.portrait ? (
      <Image
        resizeMode="cover"
        key={Global.host + this.state.userInfo.portrait}
        style={[styles.portrait]}
        source={portraits[this.state.userInfo.portrait]}
        view
      />
    ) : (
      <Image
        resizeMode="cover"
        style={[styles.portrait]}
        source={require('../../assets/images/me-portrait-dft.png')}
      />
    );
    // { uri: base().img + this.state.userInfo.portrait + '?timestamp=' + new Date().getTime() }

    return (
      <View style={Global.styles.CONTAINER}>
        <ScrollView>
          <View style={Global.styles.FULL_SEP_LINE} />
          <TouchableOpacity
            style={Global.styles.CENTER}
            onPress={() => {
              // this.props.navigation.navigate('Portrait', {
              //   data: this.state.userInfo,
              // });
            }}
          >
            <View style={[styles.portraitItem, Global.styles.CENTER]}>
              <Text style={styles.textLeft}>头像</Text>
              <View style={styles.portraitHolder}>
                {portrait}
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
          {/* <View style={Global.styles.PLACEHOLDER20} />
          <Button
            text="编辑"
            onPress={() => { this.props.navigation.navigate('EditProfile', { callback: this.afterEdit }); }}
            style={{ marginLeft: 10, marginRight: 10 }}
            theme={Button.THEME.BLUE}
          />*/}
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
    width: Global.getScreen().width / 3,
    left: 15,
  },
  textRight: {
    // width: Global.getScreen().width/4,
    flex: 1,
    right: 15,
    textAlign: 'right',
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
  portrait: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

Profile.navigationOptions = ({ navigation }) => ({
  headerTitle: navigation.state.params ? navigation.state.params.title : '我的个人资料',
  // headerRight: (
  //   <Text
  //     onPress={() => {
  //       if (typeof navigation.state.params.changePwd === 'function') {
  //         navigation.state.params.changePwd();
  //       }
  //     }}
  //     style={{ color: Global.styles.FONT_GRAY, fontSize: 14, marginRight: 10 }}
  //   >
  //     修改密码
  //   </Text>
  // ),
});

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
  updateUser: user => dispatch(updateUser(user)),
  navigate: ({ component, params }) => dispatch(NavigationActions.navigate({ routeName: component, params })),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
