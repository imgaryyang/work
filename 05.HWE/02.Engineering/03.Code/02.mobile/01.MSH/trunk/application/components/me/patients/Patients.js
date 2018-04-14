
import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  InteractionManager,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import Sep from 'rn-easy-separator';
import Button from 'rn-easy-button';
import Icon from 'rn-easy-icon';
import Card from 'rn-easy-card';

import Global from '../../../Global';
import Tags from '../../../modules/filters/Tags';

class Patients extends Component {
  static displayName = 'Patients';
  static description = '常用就诊人';
  constructor(props) {
    super(props);
    this.viewPatientInfo = this.viewPatientInfo.bind(this);
    this.reloadUserInfo = this.reloadUserInfo.bind(this);
    this.renderPlaceholderView = this.renderPlaceholderView.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.gotoAdd = this.gotoAdd.bind(this);
    this.afterAdd = this.afterAdd.bind(this);
    this.checkProfile = this.checkProfile.bind(this);
  }

  state = {
    doRenderScene: false,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
      });
    });
    this.props.navigation.setParams({
      title: '常用就诊人',
      headerRight: (
        <View style={{ flexDirection: 'row' }}>
          <Button
            onPress={this.reloadUserInfo}
            clear
            stretch={false}
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}
          >
            <Icon iconLib="mi" name="cached" size={18} width={26} height={35} color={Global.colors.FONT_GRAY} />
            <Text style={{ color: Global.colors.FONT_GRAY, fontSize: 12 }}>刷新</Text>
          </Button>
          <Button
            onPress={this.gotoAdd}
            clear
            stretch={false}
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginLeft: 15,
            }}
          >
            <Icon iconLib="mi" name="person-add" size={18} width={26} height={35} color={Global.colors.FONT_GRAY} />
            <Text style={{ color: Global.colors.FONT_GRAY, fontSize: 12 }}>添加</Text>
          </Button>
        </View>
      ),
    });
  }

  reloadUserInfo() {
    this.props.screenProps.reloadUserInfo();
  }

  // 跳转到修改记录界面
  viewPatientInfo(item) {
    this.props.navigation.navigate('PatientInfo', {
      id: item.id,
      title: '就诊人信息',
    });
  }

  // 跳转到新增记录界面
  gotoAdd() {
    this.props.navigation.navigate('EditPatientInfo', {
      callback: this.afterAdd,
      title: '添加就诊人',
    });
  }

  // 新增完成后回调
  afterAdd() {
    // this.fetchData();
  }

  checkProfile(profiles, currHospital) {
    if (!currHospital) return 0;
    const { id } = currHospital;
    let num = 0;
    for (let i = 0; i < profiles.length; i++) {
      if (profiles[i].hosId === id) {
        num += 1;
      }
    }
    return num;
  }

  renderPlaceholderView() {
    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]}>
        <View style={[Global.styles.CENTER, { flex: 1 }]} >
          <ActivityIndicator />
        </View>
      </View>
    );
  }

  /**
   * 渲染行数据
   */
  renderItem({ item, index }) {
    // console.log('render patients item:', item);
    const { currHospital, edition } = this.props.base;

    const profiles = item.profiles ? item.profiles : [];
    const flag = edition === Global.EDITION_SINGLE;
    const num1 = item.profiles ? item.profiles.length : '0';
    const num2 = this.checkProfile(profiles, currHospital);
    const no = flag ? num2 : num1;

    const { tagConfig } = Global.Config;
    const tags = [item.relation !== '0' ? { ...tagConfig.patientRelationOther, label: Global.relations[item.relation] } : tagConfig.patientRelationMeself];

    return (
      <TouchableOpacity key={`patient_${item.id}_${index + 1}`} onPress={() => this.viewPatientInfo(item)}>
        <Card fullWidth hideTopBorder noPadding>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 15, paddingTop: 10, paddingBottom: 10 }}>
            <View style={{ flex: 1 }}>
              <View style={styles.nameContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.gender}>{`（ ${item.gender === '1' ? '男' : '女'} ）`}</Text>
                <Tags tags={tags} containerStyle={{ flex: 1 }} />
              </View>
              <View style={[styles.itemContainer, { marginTop: 0 }]}>
                <Text style={styles.label}>身份证：</Text>
                <Text style={styles.text} numberOfLine={1}>{item.idNo}</Text>
              </View>
              <View style={styles.itemContainer}>
                <Text style={styles.label}>手机号：</Text>
                <Text style={styles.text} numberOfLine={1}>{item.mobile}</Text>
              </View>
              <View style={styles.itemContainer}>
                <Text style={styles.label}>已绑定：</Text>
                <Text style={styles.text} numberOfLine={1}><Text style={styles.cardNum}>{no}</Text> 张就诊卡</Text>
              </View>
            </View>
            <Icon
              iconLib="fa"
              name="angle-right"
              size={20}
              width={50}
              height={25}
              color={Global.colors.IOS_ARROW}
            />
          </View>
        </Card>
      </TouchableOpacity>
    );
  }

  render() {
    if (!this.state.doRenderScene) {
      return this.renderPlaceholderView();
    }
    const { auth } = this.props;
    const { userPatients } = auth.user.map;
    // console.log('userPatients:', userPatients);
    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]}>
        <View
          automaticallyAdjustContentInsets={false}
          style={styles.scrollView}
        >
          <FlatList
            data={userPatients || []}
            style={styles.list}
            keyExtractor={(item, index) => `${item.id}_${index + 1}`}
            // 渲染行
            renderItem={this.renderItem}
            // 渲染行间隔
            ItemSeparatorComponent={() => (<Sep height={1 / Global.pixelRatio} bgColor={Global.colors.LINE} />)}
            // 控制下拉刷新
            refreshing={auth.reloadUserCtrlState.refreshing}
            onRefresh={this.reloadUserInfo}
            // 无数据占位符
            ListEmptyComponent={() => {
              return this.renderEmptyView({
                msg: '暂无就诊人信息',
                reloadMsg: '点击刷新按钮重新查询',
                reloadCallback: this.reloadUserInfo,
                ctrlState: auth.reloadUserCtrlState,
                style: { marginTop: 15 },
              });
            }}
            // 列表底部
            ListFooterComponent={<View style={{ height: 40 }} />}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  list: {
    flex: 1,
  },

  nameContainer: {
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: 'black',
  },
  gender: {
    fontSize: 12,
    fontWeight: '600',
    color: Global.colors.FONT_GRAY,
  },
  itemContainer: {
    flexDirection: 'row',
    marginTop: 3,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: Global.colors.FONT_LIGHT_GRAY,
  },
  text: {
    flex: 1,
    fontSize: 12,
    color: Global.colors.FONT_LIGHT_GRAY,
    textAlign: 'right',
  },
  cardNum: {
    fontSize: 12,
    fontWeight: '700',
    color: Global.colors.IOS_BLUE,
  },

  lock: {
    backgroundColor: Global.colors.IOS_BLUE,
  },
  unlock: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E4E4E4',
  },
  img: {
    width: 28,
    height: 28,
  },
  tagContainer: {
    padding: 2,
    paddingLeft: 4,
    paddingRight: 4,
    borderRadius: 3,
    marginLeft: 8,
    backgroundColor: Global.colors.IOS_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tag: {
    fontSize: 9,
    lineHeight: 9,
    color: 'white',
  },
});

Patients.navigationOptions = () => ({
});

const mapStateToProps = state => ({
  auth: state.auth,
  base: state.base,
});

/* const mapDispatchToProps = dispatch => ({
  afterLogout: () => dispatch(afterLogout()),
  updateUser: user => dispatch(updateUser(user)),
  setCurrPatient: userPatient => dispatch(setCurrPatient(userPatient)),
});*/

export default connect(mapStateToProps/* , mapDispatchToProps*/)(Patients);
