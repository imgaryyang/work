/**
 * 医生介绍
 */

import React, { Component } from 'react';
import {
  InteractionManager,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Animated,
  Image,
} from 'react-native';
import Card from 'rn-easy-card';
import Sep from 'rn-easy-separator';
import Portrait from 'rn-easy-portrait';
import { B, S } from 'rn-easy-text';

import Global from '../../Global';
import { sectionDescs } from '../../services/base/BaseService';
import ctrlState from '../../modules/ListState';

const picBgHeight = Global.getScreen().width * (1 - 0.618);

class Doctor extends Component {
  static displayName = 'Doctor';
  static description = '医生介绍';

  constructor(props) {
    super(props);

    this.refresh = this.refresh.bind(this);
    this.fetchDescData = this.fetchDescData.bind(this);
    this.renderBackground = this.renderBackground.bind(this);
    this.renderSpeciality = this.renderSpeciality.bind(this);
    this.renderPlaceholderView = this.renderPlaceholderView.bind(this);
    this.renderCalendar = this.renderCalendar.bind(this);
    this.renderDescs = this.renderDescs.bind(this);
    this.onPressRegister = this.onPressRegister.bind(this);
  }

  state = {
    doRenderScene: false,
    scrollY: new Animated.Value(0),
    descs: [],
    ctrlState,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
      });
    });
    // const { params } = this.props.navigation.state;
    this.props.navigation.setParams({
      title: /* params && params.doctor ? params.doctor.name || '医生信息' : */'医生信息',
    });
  }

  /**
   * 导向到预约挂号
   */
  onPressRegister(/* doc*/) {
    // this.props.navigator.push({
    //   title: '挂号',
    //   component: RegisterResource,
    //   hideNavBar: true,
    //   passProps: {
    //     hospitalId: doc.hospitalId,
    //     departmentId: doc.departmentId,
    //   }
    // });
  }

  refresh() {
    this.setState({
      ctrlState: {
        ...this.state.ctrlState,
        refreshing: true,
        requestErr: false,
        requestErrMsg: null,
      },
    }, () => this.fetchDescData());
  }

  /**
   * 异步加载数据
   */
  async fetchDescData() {
    try {
      const { doctor } = this.props.navigation.state.params;
      const responseData = await sectionDescs(0, 100, { fkId: doctor.id, fkType: 'docDesc' });
      if (responseData.success) {
        const newCtrlState = {
          ...this.state.ctrlState,
          refreshing: false,
        };
        this.setState({
          descs: responseData.result,
          ctrlState: newCtrlState,
        });
      } else {
        this.setState({
          ctrlState: {
            ...this.state.ctrlState,
            refreshing: false,
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
          requestErr: true,
          requestErrMsg: e,
        },
      });
      this.handleRequestException(e);
    }
  }

  /**
   * 渲染过渡场景
   * @returns {XML}
   */
  renderPlaceholderView() {
    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]} >
        <Image
          source={Global.Config.defaultImgs.docBg}
          resizeMode="cover"
          style={{ width: Global.getScreen().width, height: picBgHeight }}
        />
        {/* <Sep height={15} />*/}
        {/* <Card fullWidth style={{ height: (((Global.getScreen().width - 36) / 8) * 3) + 16 }} />*/}
        {this.renderSpeciality()}
      </View>
    );
  }

  renderBackground() {
    const { scrollY } = this.state;
    return (
      <Animated.Image
        style={[styles.bg, {
          height: picBgHeight,
          transform: [{
            translateY: scrollY.interpolate({
              inputRange: [-picBgHeight, 0, picBgHeight],
              outputRange: [picBgHeight / 2, 0, -picBgHeight],
            }),
          }, {
            scale: scrollY.interpolate({
              inputRange: [-picBgHeight, 0, picBgHeight],
              outputRange: [2, 1, 1],
            }),
          }],
        }]}
        source={Global.Config.defaultImgs.docBg}
        resizeMode="cover"
      />
    );
  }

  renderCalendar() {
    const days = ['', '一', '二', '三', '四', '五', '六', '日'];

    const width = (Global.getScreen().width - 36) / 8;

    const dayViewStyle = {
      width,
      height: width,
      marginLeft: 4,
      marginTop: 4,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Global.colors.IOS_GRAY_BG,
    };
    const dayTextStyle = {
      fontSize: 10,
      color: Global.colors.FONT_GRAY,
      textAlign: 'center',
    };

    const daysView = days.map((day, idx) => {
      const dayText = idx === 0 ? (`常规出${'\n'}诊时间`) : day;
      return (
        <View key={`days_${idx + 1}`} style={dayViewStyle} >
          <Text style={dayTextStyle} >{dayText}</Text>
        </View>
      );
    });

    const scheduleViewStyle = {
      backgroundColor: 'rgba(253,253,253,1)',
    };

    // 'clinic': '1;am;200|2;am;200|3;am;200'
    const { doctor } = this.props.navigation.state.params;
    const op = {};
    if (doctor.clinic) {
      const scheArr = doctor.clinic.split('|');
      scheArr.forEach((sche) => {
        const arr = sche.split(';');
        op[`${arr[0]}${arr[1]}`] = arr[2];
      });
    }

    const amView = days.map((day, idx) => {
      const fee = op[`${idx}am`];
      const dayText = idx === 0 ? (`上午${'\n'}AM`) : (fee || '');
      const appendStyle = idx === 0 ? {} : (fee ? { backgroundColor: Global.colors.ORANGE } : scheduleViewStyle);
      const whiteTextStyle = fee ? { color: 'white', fontSize: 14 } : {};
      return (
        <View key={`days_${idx + 1}`} style={[dayViewStyle, appendStyle]} >
          <Text style={[dayTextStyle, whiteTextStyle]} >{dayText}</Text>
        </View>
      );
    });

    const pmView = days.map((day, idx) => {
      const fee = op[`${idx}pm`];
      const dayText = idx === 0 ? (`下午${'\n'}PM`) : (fee || '');
      const appendStyle = idx === 0 ? {} : (fee ? { backgroundColor: Global.colors.ORANGE } : scheduleViewStyle);
      const whiteTextStyle = fee ? { color: 'white', fontSize: 14 } : {};
      return (
        <View key={`days_${idx + 1}`} style={[dayViewStyle, appendStyle]} >
          <Text style={[dayTextStyle, whiteTextStyle]} >{dayText}</Text>
        </View>
      );
    });

    const rowStyle = {
      flexDirection: 'row',
    };

    return (
      <View>
        <View style={rowStyle} >{daysView}</View>
        <View style={rowStyle} >{amView}</View>
        <View style={rowStyle} >{pmView}</View>
        <Sep height={4} />
      </View>
    );
  }

  renderSpeciality() {
    const { doctor } = this.props.navigation.state.params;
    return (
      <View>
        <Sep height={15} />
        <Card >
          <View style={Global.styles.CARD_TITLE} >
            <Text style={Global.styles.CARD_TITLE_TEXT} >简介</Text>
          </View>
          <Text style={Global.styles.CARD_CONTENT_TEXT} >{doctor.description/* speciality*/}</Text>
        </Card>
        <Sep height={15} />
      </View>
    );
  }

  renderDescs() {
    if (!this.state.descs || this.state.descs.length === 0) {
      return null;
    }
    return (
      <Card >
        {this.state.descs.map((item, idx) => {
          return (
            <View key={`desc_${idx + 1}`} >
              <View style={Global.styles.CARD_TITLE} >
                <Text style={Global.styles.CARD_TITLE_TEXT} >{item.caption}</Text>
              </View>
              <Text style={Global.styles.CARD_CONTENT_TEXT} >{item.body}</Text>
            </View>
          );
        })}
      </Card>
    );
  }

  render() {
    // 场景过渡动画未完成前，先渲染过渡场景
    if (!this.state.doRenderScene) {
      return this.renderPlaceholderView();
    }
    // console.log('this.props.navigation in ConsultRecords.render():', this.props.navigation);
    const { doctor } = this.props.navigation.state.params;

    // const emptyView = this.renderEmptyView({
    //   msg: '暂无更多医生介绍',
    //   reloadMsg: '点击刷新按钮重新查询',
    //   reloadCallback: this.refresh,
    //   ctrlState: this.state.ctrlState,
    //   data: this.state.descs,
    //   showActivityIndicator: true,
    // });

    // const portraitSource = doctor.portrait ?
    //   { uri: base().img + doctor.portrait } :
    //   Global.Config.defaultImgs.docPortrait;
    const portraitSource = doctor.photo ?
      { uri: `${Global.getImageHost()}${doctor.photo}?timestamp=${new Date().getTime()}` } :
      Global.Config.defaultImgs.docPortrait;

    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]} >
        {this.renderBackground()}
        <ScrollView
          ref={(c) => { this.scrollView = c; }}
          style={styles.scrollView}
          automaticallyAdjustContentInsets={false}
          onScroll={
            Animated.event([{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }])
          }
          scrollEventThrottle={16}
        >
          <View style={{ alignItems: 'center', height: picBgHeight }} >
            <Portrait
              imageSource={portraitSource}
              width={50}
              height={50}
              radius={25}
              bgColor="rgba(102,51,0,.5)"
              style={styles.portrait}
            />
            <Text style={styles.docName} ><B><S>{doctor.name}</S></B></Text>
          </View>
          {/* <Sep height={15} />
          <Card noPadding >
            {this.renderCalendar()}
          </Card>*/}
          {this.renderSpeciality()}
          {/* emptyView*/}
          {/* this.renderDescs()*/}
          <Card >
            <View>
              <View style={Global.styles.CARD_TITLE} >
                <Text style={Global.styles.CARD_TITLE_TEXT} >医生介绍</Text>
              </View>
              <Text style={Global.styles.CARD_CONTENT_TEXT} >{doctor.speciality}</Text>
            </View>
          </Card>
          <Sep height={40} />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  bg: {
    position: 'absolute',
    width: Global.getScreen().width,
  },
  navbarHolder: {
    position: 'absolute',
    left: 0,
    top: 0,
  },

  backBtnHolder: {
    position: 'absolute',
    left: 0,
    width: 88,
    height: 44,
  },
  backBtn: {
    flex: 1,
    flexDirection: 'row',
    width: 88,
    height: 44,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
    paddingLeft: 7,
  },

  portrait: {
    marginTop: 35,
  },
  docName: {
    marginTop: 8,
    fontSize: 17,
    color: 'white',
    backgroundColor: 'transparent',
  },
});

Doctor.navigationOptions = () => ({
});

export default Doctor;
