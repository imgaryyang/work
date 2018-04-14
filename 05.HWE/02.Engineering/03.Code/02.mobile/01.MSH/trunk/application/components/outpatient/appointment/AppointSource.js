/**
 * 预约挂号3
 */
import React, { Component } from 'react';
import {
  InteractionManager,
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';

import Card from 'rn-easy-card';
import Toast from 'react-native-root-toast';
import Global from '../../../Global';
import PlaceholderView from '../../../modules/PlaceholderView';
import NoDataView from '../../../modules/NoDataView';
import { forList } from '../../../services/outpatient/AppointService';

class AppointSource extends Component {
  static displayName = 'AppointSource';
  static description = '号源';
  static margin = 10;
  static radius = 5;

  // 转化'YYYY-MM-DD'为汉字格式'YYYY年MM月DD日'
  static chineseDate(date) {
    const [year, month, day] = date.split('-');
    return `${year}年${month}月${day}日`;
  }

  constructor(props) {
    super(props);

    this.fetchData = this.fetchData.bind(this);
    this.reFetchData = this.reFetchData.bind(this);
    this.renderBody = this.renderBody.bind(this);
    this.gotoAppoint = this.gotoAppoint.bind(this);

    this.state = {
      doRenderScene: false,
      data: [],
      reloading: false,
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => { this.fetchData(); });
    this.props.navigation.setParams({
      title: this.props.navigation.state.params.data.docName || '选择号源',
      showCurrHospitalAndPatient: true,
      allowSwitchHospital: false,
      allowSwitchPatient: true,
      afterChooseHospital: null,
      afterChoosePatient: null,
      hideNavBarBottomLine: false,
    });
  }

  reFetchData() {
    this.setState(
      { reloading: true },
      () => this.fetchData(),
    );
  }

  gotoAppoint(data) {
    this.props.navigation.navigate('Appoint', {
      data,
      backIndex: this.props.navigation.state.params.backIndex,
      title: '预约挂号',
      showCurrHospitalAndPatient: true,
      allowSwitchHospital: false,
      allowSwitchPatient: true,
      afterChoosePatient: null,
      hideNavBarBottomLine: false,
    });
  }

  async fetchData() {
    try {
      const responseData = await forList(this.props.navigation.state.params.data);
      const { result, success, msg } = responseData;

      if (success) {
        if (result.length > 0) {
          this.setState({ data: result, doRenderScene: true, reloading: false });
        } else {
          this.setState({ doRenderScene: true, reloading: false });
        }
      } else {
        this.setState({ doRenderScene: true, reloading: false });
        Toast.show(`错误：${msg}`);
      }
    } catch (e) {
      this.setState({ doRenderScene: true, reloading: false });
      this.handleRequestException(e);
    }
  }

  renderBody(doRenderScene, reloading, data) {
    if (doRenderScene) {
      if (data.length > 0) {
        return (
          <ScrollView contentContainerStyle={styles.body}>
            {
              data.map((item, index) => {
                return (
                  <TouchableOpacity key={`${item}${index + 1}`} style={styles.button} onPress={() => this.gotoAppoint(item)} >
                    <View style={styles.buttonLeft}>
                      <Text style={styles.buttonLeftText}>{item.num}</Text>
                    </View>
                    <View style={styles.buttonRight}>
                      <Text style={styles.buttonRightText}>{item.clinicTime}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            }
          </ScrollView>
        );
      } else {
        return <NoDataView msg="未查到可用号源" reloading={reloading} onReload={this.reFetchData} />;
      }
    } else {
      return <PlaceholderView style={{ backgroundColor: Global.colors.IOS_GRAY_BG }} />;
    }
  }

  render() {
    const { doRenderScene, reloading, data } = this.state;
    const { depName, clinicTypeName, clinicDate, shiftName } = this.props.navigation.state.params.data;
    const title = `${depName} > ${clinicTypeName} > ${AppointSource.chineseDate(clinicDate)} > ${shiftName}`;

    return (
      <View style={styles.container}>
        <Card style={styles.header}>
          <Text style={styles.headerText}>{title}</Text>
        </Card>
        {
          this.renderBody(doRenderScene, reloading, data)
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Global.colors.IOS_GRAY_BG,
  },
  header: {
    margin: AppointSource.margin,
    borderRadius: AppointSource.radius,
    paddingLeft: 0,
    paddingRight: 0,
    // backgroundColor: Global.colors.IOS_GRAY_BG,
  },
  headerText: {
    textAlign: 'center',
    color: Global.colors.FONT_GRAY,
    fontSize: 13,
  },
  body: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    width: (Global.getScreen().width - (4 * AppointSource.margin)) / 3, // 一行3个按钮，按钮宽度=(屏幕宽度-4*间隙宽度)/3
    marginLeft: AppointSource.margin,
    borderWidth: Global.lineWidth,
    borderColor: Global.colors.LINE,
    backgroundColor: 'white',
    marginBottom: AppointSource.margin,
    height: 55,
    flexDirection: 'row',
    borderRadius: AppointSource.radius,
  },
  buttonLeft: {
    flex: 2,
    backgroundColor: Global.colors.IOS_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: AppointSource.radius,
    borderBottomLeftRadius: AppointSource.radius,
  },
  buttonLeftText: {
    fontSize: 15,
    textAlign: 'center',
    color: 'white',
  },
  buttonRight: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: AppointSource.radius,
    borderBottomRightRadius: AppointSource.radius,
  },
  buttonRightText: {
    fontSize: 13,
    textAlign: 'center',
    color: Global.colors.FONT_GRAY,
  },
});

// AppointSource.navigationOptions = ({ navigation }) => ({
//   title: navigation.state.params.data.docName || '选择号源',
// });

export default AppointSource;
