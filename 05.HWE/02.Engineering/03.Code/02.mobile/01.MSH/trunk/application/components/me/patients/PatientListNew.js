/** 就诊人下显示档案 **/
import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  InteractionManager,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import Sep from 'rn-easy-separator';
import Button from 'rn-easy-button';
import Card from 'rn-easy-card';

import Global from '../../../Global';
import Item from '../../../modules/PureListItem';
import ctrlState from '../../../modules/ListState';
import { list } from '../../../services/me/PatientService';
import { updateUser } from '../../../actions/base/AuthAction';
import { setCurrPatient } from '../../../actions/base/BaseAction';

class PatientListNew extends Component {
  static displayName = 'PatientListNew';
  static description = '常用就诊人';

  static renderPlaceholderView() {
    return (
      <View style={Global.styles.CONTAINER} />
    );
  }
  static getProfiles(data, hospital) {
    console.log('data', data);
    const { id } = hospital;
    const sections = [];
    for (let i = 0; i < data.length; i++) {
      const datas = [];
      const pro = data[i].profiles;
      for (let j = 0; j < pro.length; j++) {
        if (pro[j].hosId === id) {
          datas.push(pro[j]);
        }
      }
      sections.push({ key: data[i].name, gender: data[i].gender, id: data[i].id, data: datas });
    }
    console.log('sections', sections);
    return sections;
  }
  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
    this.onInfiniteLoad = this.onInfiniteLoad.bind(this);
    this.gotoEdit = this.gotoEdit.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.sectionComp = this.sectionComp.bind(this);
    this.renderDefault = this.renderDefault.bind(this);
    this.renderIdentify = this.renderIdentify.bind(this);
    this.renderData = this.renderData.bind(this);
    this.setCurrPat = this.setCurrPat.bind(this);
    this.bindProfile = this.bindProfile.bind(this);
  }

  state = {
    doRenderScene: false,
    data: this.props.auth.user.map ? this.props.auth.user.map.userPatients : [],
    hospital: (
      this.props.navigation.state.params.hospital ?
        Object.assign({}, this.props.navigation.state.params.hospital) : null
    ),
    ctrlState,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
        data: this.props.auth.user.map ? this.props.auth.user.map.userPatients : [],
      });
    });
    this.props.navigation.setParams({
      title: '常用就诊人',
    });
  }

  // 搜索
  onSearch() {
    this.setState({
      ctrlState: {
        ...this.state.ctrlState,
        refreshing: true,
        infiniteLoading: false,
        noMoreData: false,
      },
    }, () => this.fetchData());
  }

  // 无限加载
  onInfiniteLoad() {
    if (this.state.ctrlState.refreshing ||
      this.state.ctrlState.infiniteLoading ||
      this.state.ctrlState.noMoreData ||
      this.state.ctrlState.requestErr) {
      return;
    }
    this.setState({
      ctrlState: {
        ...this.state.ctrlState,
        refreshing: false,
        infiniteLoading: true,
        noMoreData: false,
      },
    }, () => this.fetchData());
  }
  setCurrPat(id) {
    const { userPatients } = this.props.auth.user.map;
    const length = userPatients && userPatients.length > 0 ? userPatients.length : 0;
    for (let i = 0; i < length; i++) {
      const patient = userPatients[i];
      if (id === patient.id) {
        this.props.setCurrPatient(patient);
        return patient;
      }
    }
  }
  gotoEdit(profile, patient) {
    const { id } = patient;
    const currPatient = this.setCurrPat(id);
    // 回调列表更新数据
    const { callback, route, routeData } = this.props.navigation.state.params;
    if (typeof callback === 'function') callback(currPatient, profile);
    if (typeof route === 'string') {
      this.props.navigation.navigate(route, { routeData });
    } else {
      this.props.navigation.goBack();
    }
  }
  // 查询数据
  async fetchData() {
    try {
      const responseData = await list(this.state.hospital);
      if (responseData.success) {
        const newCtrlState = {
          ...this.state.ctrlState,
          refreshing: false,
          infiniteLoading: false,
          noMoreData: true,
        };
        this.setState({
          data: responseData.result,
          ctrlState: newCtrlState,
        });
        const { user } = this.props.auth;
        const userPatients = this.state.data;
        user.map = { userPatients };
        this.props.updateUser(user);
      } else {
        this.setState({
          ctrlState: {
            ...this.state.ctrlState,
            refreshing: false,
            infiniteLoading: false,
            noMoreData: true,
            requestErr: true,
            requestErrMsg: { msg: responseData.msg },
          },
        });
        this.handleRequestException({ msg: responseData.msg });
      }
    } catch (e) {
      this.setState({
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: false,
          infiniteLoading: false,
          noMoreData: true,
          requestErr: true,
          requestErrMsg: e,
        },
      });
      this.handleRequestException(e);
    }
  }
  bindProfile(patient) {
    const { id } = patient;
    const currPatient = this.setCurrPat(id);
    this.props.navigation.navigate('BindArchives', {
      data: currPatient,
      callbacks: this.callbacking,
      title: '添加卡号',
    });
  }
  sectionComp = (item) => {
    const txt = item.section.key;
    const gender = item.section.gender === '1' ? '男' : '女';
    return (
      <View style={styles.header}>
        <Text style={styles.headerText} >
          {txt} {gender}
        </Text>
      </View>
    );
  }
  renderDefault(status) {
    const txt = status === '1' ? '默认卡号' : '';
    // const tag = status === '1' ? styles.default : null;
    const bgColor = status === '1' ? Global.colors.IOS_BLUE : 'white';
    return (
      <View style={[styles.tagContainer, { backgroundColor: bgColor }]} >
        <Text style={styles.tag} >{txt}</Text>
      </View>
    );
  }

  renderIdentify(identify) {
    const txt = identify === '1' ? '已认证' : '未认证';
    // const tag = identify === '1' ? styles.identify : styles.unidentify;
    const bgColor = identify === '1' ? Global.colors.IOS_GREEN : Global.colors.FONT_GRAY;
    return (
      <View style={[styles.tagContainer, { backgroundColor: bgColor }]} >
        <Text style={styles.tag} >{txt}</Text>
      </View>
    );
  }
  /**
   * 渲染行数据
   */
  renderItem = (item) => {
    console.log('renderItem', item);
    const defaultView = item.item.status === '1' ? (
      <Text style={{ fontSize: 8, color: Global.colors.ORANGE }} />
    ) : (
      <Button text="默认" outline size="small" onPress={() => this.gotoBind(item)} stretch={false} style={{ width: 50, height: 23 }} />
    );
    const identifyView = item.item.identify === '1' ? (
      <Text style={{ fontSize: 8, color: Global.colors.ORANGE }} />
    ) : (
      <Button text="认证" outline size="small" onPress={() => this.identify(item)} stretch={false} style={{ width: 50, height: 23, marginLeft: 6 }} />
    );
    return (
      <Item
        data={item.item}
        chevron={null}
        index={item.index}
        onPress={this.gotoEdit}
      >
        <View style={{ flex: 1, flexDirection: 'row' }} >
          <View style={{ flex: 3, flexDirection: 'column' }} >
            <View style={{ flex: 1, flexDirection: 'row' }} >
              <Text style={styles.info}>卡类型</Text>
              <Sep width={10} />
              <Text style={styles.info}>{item.item.type === '1' ? '医保' : '自费'}</Text>
            </View>
            <Sep height={5} />
            <View style={{ flex: 1, flexDirection: 'row' }} >
              <Text style={styles.info}>卡号</Text>
              <Sep width={10} />
              <Text style={styles.info}>{item.item.no}</Text>
            </View>
          </View>
          <View style={{ flex: 1, flexDirection: 'column' }} >
            <View style={{ flexDirection: 'row', width: 80, justifyContent: 'flex-end' }}>
              {this.renderDefault(item.item.status)}
              <Sep width={5} />
              {this.renderIdentify(item.item.identify)}
            </View>
            <Sep height={20} />
            <View style={{ flexDirection: 'row', width: 80, justifyContent: 'flex-end' }}>
              {defaultView}
              {identifyView}
            </View>
          </View>
        </View>
      </Item>
    );
  }
  renderData(patients) {
    return patients.map((patient, index) => (
      <View key={index}>
        <View style={styles.header}>
          <Text style={styles.headerText} >
            {patient.key} {patient.gender === '1' ? '男' : '女'}
          </Text>
        </View>
        <Sep style={{ height: Global.lineWidth, backgroundColor: Global.colors.LINE }} />
        <Sep style={{ height: 10, backgroundColor: 'white' }} />
        {
          patient.data && patient.data.length > 0 ? (
            patient.data.map((profile, index) => (
              <TouchableOpacity style={{ flex: 1, flexDirection: 'column', paddingLeft: 10, backgroundColor: 'white' }} key={index} onPress={() => this.gotoEdit(profile, patient)} >
                {
                  index !== 0 ? (
                    <Sep style={{ height: Global.lineWidth, backgroundColor: Global.colors.LINE, marginRight: 10 }} />
                  ) : null
                }
                <Sep style={{ height: 10 }} />
                <View style={{ flex: 1, flexDirection: 'row' }} >
                  <View style={{ flex: 3, flexDirection: 'column' }} >
                    <View style={{ flex: 1, flexDirection: 'row' }} >
                      <Text style={styles.info}>卡类型</Text>
                      <Sep width={10} />
                      <Text style={styles.info}>{profile.type === '1' ? '医保' : '自费'}</Text>
                    </View>
                    <Sep height={5} />
                    <View style={{ flex: 1, flexDirection: 'row' }} >
                      <Text style={styles.info}>卡号</Text>
                      <Sep width={10} />
                      <Text style={styles.info}>{profile.no}</Text>
                    </View>
                  </View>
                  <View style={{ flex: 1, flexDirection: 'column' }} >
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                      {this.renderDefault(profile.status)}
                      <Sep width={5} />
                      {this.renderIdentify(profile.identify)}
                    </View>
                    <Sep height={10} />
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                      {
                        profile.status === 1 ? (
                          <Text style={{ fontSize: 8, color: Global.colors.ORANGE }} />
                        ) : (
                          <Button text="默认" outline size="small" onPress={() => this.gotoBind(profile)} stretch={false} style={{ width: 50, height: 23 }} />
                        )
                      }
                      {
                        profile.identify === 1 ? (
                          <Text style={{ fontSize: 8, color: Global.colors.ORANGE }} />
                        ) : (
                          <Button text="认证" outline size="small" onPress={() => this.identify(profile)} stretch={false} style={{ width: 50, height: 23, marginLeft: 6 }} />
                        )
                      }
                    </View>
                    <Sep height={10} />
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Card style={{ flex: 1, borderTopWidth: 0, backgroundColor: 'white' }} >
              <View style={styles.card} >
                <Text style={Global.styles.CARD_TITLE_TEXT} >暂无档案</Text>
              </View>
              <Button
                text="去绑定"
                theme={Button.THEME.ORANGE}
                outline
                onPress={() => this.bindProfile(patient)}
                style={styles.button}
              />
            </Card>
          )
        }
      </View>
    ));
  }
  render() {
    if (!this.state.doRenderScene) { return PatientListNew.renderPlaceholderView(); }
    const { currHospital } = this.props.base;
    const data = PatientListNew.getProfiles(this.state.data, currHospital);
    const view = this.renderData(data);
    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]}>
        <ScrollView style={{ flex: 1 }}>
          {view}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  header: {
    // flex: 1,
    flexDirection: 'row',
    height: 40,
    // borderTopWidth: Global.lineWidth,
    // borderTopColor: Global.colors.LINE,
    borderBottomWidth: Global.lineWidth,
    borderBottomColor: Global.colors.LINE,
    backgroundColor: 'white',
    marginTop: 10,
    alignItems: 'center',
  },
  headerText: {
    color: '#000000',
    // flex: 1,
    fontSize: 16,
    fontWeight: '400',
    paddingLeft: 15,
  },
  textLeft: {
    marginLeft: 10,
    justifyContent: 'center',
    flex: 1,
  },
  textRight: {
    textAlign: 'right',
    color: Global.colors.IOS_BLUE,
    marginRight: 10,
  },
  headerToch: {
    flex: 1,
    flexDirection: 'row',
    marginRight: 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  inforMain: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
  },
  info: {
    color: '#999999',
    fontSize: 13,
  },
  tagsContainer: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  tagContainer: {
    // padding: 3,
    paddingLeft: 4,
    paddingRight: 4,
    borderRadius: 3,
    overflow: 'hidden',
    height: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tag: {
    fontSize: 9,
    lineHeight: 9,
    color: 'white',
  },
  undefault: {
    padding: 2,
    borderRadius: 3,
    fontSize: 9,
    color: 'white',
    backgroundColor: Global.colors.IOS_LIGHT_GRAY,
  },
  button: {
    position: 'absolute',
    top: 8,
    right: 15,
    width: 70,
    height: 25,
  },
  card: {
    // borderBottomWidth: 1 / Global.pixelRatio,
    borderBottomColor: Global.colors.IOS_SEP_LINE,
    paddingTop: 8,
    paddingBottom: 8,
  },
});

const mapStateToProps = state => ({
  auth: state.auth,
  base: state.base,
});

const mapDispatchToProps = dispatch => ({
  updateUser: user => dispatch(updateUser(user)),
  setCurrPatient: userPatient => dispatch(setCurrPatient(userPatient)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PatientListNew);
