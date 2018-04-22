/**
 * 医院医生
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ListView,
  TouchableOpacity,
} from 'react-native';
import Card from 'rn-easy-card';
import Toast from 'react-native-root-toast';
import Portrait from 'rn-easy-portrait';
import Picker from 'rn-easy-picker';
import Icon from 'rn-easy-icon';
import Sep from 'rn-easy-separator';
import { B } from 'rn-easy-text';

import Global from '../../Global';
import { listByHospital } from '../../services/hospital/DoctorService';
import ctrlState from '../../modules/ListState';
import { listBrief } from '../../services/hospital/DeptService';

const initPage = { start: 0, limit: 1000 };
class HospitalDoctors extends Component {
  static displayName = 'HospitalDoctors';
  static description = '医院医生';

  /**
   * 渲染行分割线
   */
  static renderSeparator(sectionId, rowId) {
    return <Sep key={`row_sep_${rowId}`} height={10} />;
  }

  constructor(props) {
    super(props);
    this.refresh = this.refresh.bind(this);
    this.pullToRefresh = this.pullToRefresh.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.onPressRegister = this.onPressRegister.bind(this);
    this.onPressDetail = this.onPressDetail.bind(this);
    this.renderToolBar = this.renderToolBar.bind(this);
  }

  state = {
    page: initPage,
    ctrlState,
    deptId: '',
    deptName: null,
    dept: [],
    dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
  };

  componentDidMount() {
    this.refresh();
  }

  /**
   * 查看医生详情
   */
  onPressDetail(doctor) {
    this.props.navigation.navigate('Doctor', { hosp: this.props.hosp, doctor, title: '医生信息' });
  }

  /**
   * 导向到预约挂号
   */
  onPressRegister() {
  }

  data = [];

  refresh() {
    this.setState({
      ctrlState: {
        ...this.state.ctrlState,
        refreshing: true,
        requestErr: false,
        requestErrMsg: null,
      },
    }, () => this.fetchData());
  }

  pullToRefresh() {
    this.setState({
      ctrlState: {
        ...this.state.ctrlState,
        refreshing: true,
        requestErr: false,
        requestErrMsg: null,
      },
    }, () => this.fetchData());
  }

  // 查询数据
  async fetchData() {
    const deptId = this.state.deptId;
    // console.log('.......ctrlState in fetchData:', this.state.ctrlState);
    try {
      let responseData = [];
      if (deptId === '') {
        responseData = await listByHospital(
          this.state.ctrlState.refreshing ? initPage.start : this.state.page.start,
          this.state.page.limit,
          { hosId: this.props.hosp.id },
        );
      } else {
        responseData = await listByHospital(
          this.state.ctrlState.refreshing ? initPage.start : this.state.page.start,
          this.state.page.limit,
          { hosId: this.props.hosp.id, depId: this.state.deptId },
        );
      }

      // 获取科室
      const dept = await listBrief({ hosId: this.props.hosp.id });

      // console.log('responseData in HospitalDepts.fetchData():', responseData);
      if (responseData.success) {
        this.data = responseData.result;
        const newCtrlState = {
          ...this.state.ctrlState,
          refreshing: false,
        };
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(this.data),
          ctrlState: newCtrlState,
          dept: dept.result,
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
    if (typeof this.props.onChildCompLoaded === 'function') this.props.onChildCompLoaded();
  }

  /**
   * 渲染行数据
   */
  renderRow(item, sectionId, rowId) {
    const portraitSource = item.photo ?
      { uri: `${Global.getImageHost()}${item.photo}?timestamp=${new Date().getTime()}` } :
      Global.Config.defaultImgs.docPortrait;
    return (
      <TouchableOpacity key={`doc_row_${rowId}`} onPress={() => this.onPressDetail(item)} >
        <Card radius={6} style={{ margin: 8, marginTop: 16, marginBottom: 0 }} >
          <View style={[{ flexDirection: 'row' }]} >
            <Portrait imageSource={portraitSource} bgColor={Global.colors.IOS_GRAY_BG} width={50} height={50} radius={25} />
            <View style={{ flex: 1, paddingLeft: 10 }} >
              <View style={{ flexDirection: 'row' }} >
                <Text style={{ flex: 1 }} ><B>{item.name}</B></Text>
                <Text style={{ flex: 1, textAlign: 'right', marginRight: 8 }}><B>科室 : </B>{item.depName}</Text>
              </View>
              <Text style={[Global.styles.GRAY_FONT, { marginTop: 12 }]} ><B>职称 : </B>{item.jobTitle}</Text>
              <Text style={[Global.styles.GRAY_FONT, { marginTop: 5, lineHeight: 17 }]} ><B>专长 : </B>{item.speciality}</Text>
            </View>
          </View>
          <View
            style={{
              borderTopWidth: 1 / Global.pixelRatio,
              borderTopColor: Global.colors.IOS_SEP_LINE,
              marginTop: 10,
              paddingTop: 10,
              paddingLeft: 8,
            }}
          >
            <Text><B>常规出诊时间 : </B></Text>
            <Text style={[Global.styles.GRAY_FONT, { marginTop: 5 }]} >{item.clinicDesc || '暂无记录'}</Text>
          </View>
        </Card>
      </TouchableOpacity>
    );
  }

  /**
   * 渲染顶端工具栏
   */
  renderToolBar() {
    const dept = this.state.dept;
    const selectDept = [];
    if (dept && dept.length > 0) {
      const all = {};
      all.value = '';
      all.label = '全部科室';
      selectDept.push(all);
      dept.forEach((item) => {
        const d = {};
        d.value = item['id'];
        d.label = item['name'];
        selectDept.push(d);
      });
    } else {
      // Toast.show('该医院还没有科室！');
      return;
    }
    return (
      <View style={[Global.styles.TOOL_BAR.FIXED_BAR]} >
        <TouchableOpacity
          style={styles.dateBtn}
          onPress={() => this.easyPicker2.toggle()}
        >
          <Text style={styles.picker} >{this.state.deptName ? this.state.deptName : '全部科室'}</Text>
          <Icon name="ios-arrow-down" size={12} width={12} height={12} color={Global.colors.FONT_LIGHT_GRAY1} style={styles.switchIcon} />
        </TouchableOpacity>
        <Picker
          ref={(c) => { this.easyPicker2 = c; }}
          dataSource={selectDept}
          selected={this.state.deptId}
          onChange={(selected) => {
            this.state.deptId = selected.value;
            this.state.deptName = selected.label;
            this.fetchData();
          }}
          center
        />
      </View>
    );
  }

  render() {
    const emptyView = this.renderEmptyView({
      msg: '暂无医生信息',
      reloadMsg: '点击刷新按钮重新查询',
      reloadCallback: this.pullToRefresh,
      ctrlState: this.state.ctrlState,
      data: this.data,
      showActivityIndicator: true,
      style: { marginTop: 15 },
    });
    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]} >
        {this.renderToolBar()}
        {emptyView}
        <ListView
          automaticallyAdjustContentInsets={false} // 此参数保证在IOS的Tabbar中顶端不出现与statusBar等高的空隙
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          renderSeparator={this.renderSeparator}
          style={[styles.list]}
          enableEmptySections
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    marginTop: 0,
    paddingBottom: 40,
  },
  item: {
    padding: 15,
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 10,
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  dateBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    // paddingLeft: 15,
  },
  picker: {
    fontSize: 15,
    lineHeight: 17,
    textAlign: 'center',
    color: '#000000',
    fontWeight: '600',
  },
});

export default HospitalDoctors;
