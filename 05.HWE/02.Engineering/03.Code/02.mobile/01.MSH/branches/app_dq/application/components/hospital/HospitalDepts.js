/**
 * 医院科室
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ListView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Button from 'rn-easy-button';
import Icon from 'rn-easy-icon';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Global from '../../Global';
// import { listBrief } from '../../services/hospital/DeptService';
import { forDeptTree/* , forDocList*/ } from '../../services/outpatient/AppointService';
import ctrlState from '../../modules/ListState';
// import SearchInput from '../../modules/SearchInput';
// import { forDeptList } from '../../services/outpatient/AppointService';

const dismissKeyboard = require('dismissKeyboard');

class HospitalDepts extends Component {
  static displayName = 'HospitalDepts';
  static description = '医院科室';

  /**
   * 渲染数据分区表头
   */
  static renderSectionHeader(sectionData) {
    return (
      <View style={[styles.section]}>
        <Text style={styles.sectionText}>
          {sectionData}
        </Text>
      </View>
    );
  }

  constructor(props) {
    super(props);
    this.refresh = this.refresh.bind(this);
    this.pullToRefresh = this.pullToRefresh.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.renderToolBar = this.renderToolBar.bind(this);
    this.renderSeparator = this.renderSeparator.bind(this);
    this.appendSectionData = this.appendSectionData.bind(this);
    this.onPressRegister = this.onPressRegister.bind(this);
    this.onPressDetail = this.onPressDetail.bind(this);
    this.isEndOfSection = this.isEndOfSection.bind(this);
  }

  state = {
    ctrlState,
    dataSource: new ListView.DataSource({
      // getRowData: (dataBlob, sectionId, rowId) => { return dataBlob[rowId]; },
      // getSectionHeaderData: (dataBlob, sectionId) => { return dataBlob[sectionId]; },
      rowHasChanged: (row1, row2) => row1 !== row2,
      // sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    }),
    // name: '',
    deptList: [], // 全部科室

  };

  componentDidMount() {
    this.refresh();
  }

  /**
   * 查看科室详情
   */
  onPressDetail(/* dept*/) {
    // this.props.navigation.navigate('Department', { hosp: this.props.hosp, dept, title: '科室信息' });
  }

  /**
   * 导向到预约挂号
   */
  onPressRegister(item) {
    this.props.navigation.navigate('Schedule', {
      title: item.name,
      depNo: item.no,
      hosNo: item.hosNo,
      showCurrHospitalAndPatient: true,
      allowSwitchHospital: false,
      allowSwitchPatient: true,
      afterChooseHospital: null,
      afterChoosePatient: null,
      hideNavBarBottomLine: false,
      backIndex: this.props.nav.index,
    });
  }

  isEndOfSection(sectionId, rowId) {
    if (this.sectionIds.length === 0 || this.rowIds.length === 0) return false;
    const sectionIdx = this.sectionIds.indexOf(sectionId);
    const rowIdx = this.rowIds[sectionIdx].indexOf(rowId);
    return rowIdx === this.rowIds[sectionIdx].length - 1;
  }

  data = [];
  sectionData = {};
  sectionIds = [];
  rowIds = [];

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
    // console.log('.......ctrlState in fetchData:', this.state.ctrlState);
    // const name = this.state.name;

    try {
      let responseData = [];
      // if (name !== '') {
      //   responseData = await listBrief({ hosId: this.props.hosp.id, name });
      // } else {
      //   responseData = await listBrief({ hosId: this.props.hosp.id });
      // }
      responseData = await forDeptTree();

      // console.log('responseData in HospitalDepts.fetchData():', responseData);
      if (responseData.success) {
        this.state.deptList = responseData.result;
        this.sectionIds = [];
        this.rowIds = [];
        this.sectionData = [];
        const newCtrlState = {
          ...this.state.ctrlState,
          refreshing: false,
        };
        this.data = responseData.result;
        this.setState({
          // data: responseData.result,
          dataSource: this.state.dataSource.cloneWithRows(responseData.result),
          ctrlState: newCtrlState,
        });
        // this.appendSectionData(responseData.result);
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

  appendSectionData(data) {
    // console.log(data);
    let sectionId;
    let idx;
    let rId;
    if (data && data.length > 0) {
      data.forEach((item) => {
        sectionId = item['type'];
        idx = this.sectionIds.indexOf(sectionId);
        if (idx === -1) {
          idx = this.sectionIds.length;
          this.sectionIds.push(sectionId);
          this.rowIds.push([]);
        }
        rId = `s${idx}r${this.rowIds[idx].length}`; // 's' + idx + 'r' + this.rowIds[idx].length;
        this.rowIds[idx].push(rId);

        this.sectionData[sectionId] = item['type'];
        this.sectionData[rId] = item;
      });
    }
    const newCtrlState = {
      ...this.state.ctrlState,
      refreshing: false,
    };
    this.setState({
      dataSource: this.state.dataSource.cloneWithRowsAndSections(this.sectionData, this.sectionIds, this.rowIds),
      ctrlState: newCtrlState,
    });
  }

  /**
   * 渲染行数据
   */
  // renderRow(item, sectionId, rowId) {
  //   return (
  //     <TouchableOpacity key={rowId} style={[Global.styles.CENTER, styles.item]} onPress={() => this.onPressDetail(item)} >
  //       <Text style={{ flex: 1 }} >{item.name}</Text>
  //       <Button theme={Button.THEME.ORANGE} outline stretch={false} style={{ width: 50, height: 25, marginRight: 15 }} onPress={() => this.onPressRegister(item)} >
  //         <Text style={{ fontSize: 12, color: Global.colors.ORANGE }} >去挂号</Text>
  //       </Button>
  //       <Icon name="ios-arrow-forward-outline" size={20} width={40} height={20} color={Global.colors.FONT_LIGHT_GRAY1} />
  //     </TouchableOpacity>
  //   );
  // }
  renderRow(item) {
    const content = item.children.map(({ no, name }, idx) => {
      return (
        <TouchableOpacity key={`${no}${name}${idx + 1}`} style={[Global.styles.CENTER, styles.item]} onPress={() => this.onPressDetail(item)} >
          <Text style={{ flex: 1 }} >{name}</Text>
          <Button theme={Button.THEME.ORANGE} outline stretch={false} style={{ width: 50, height: 25, marginRight: 15 }} onPress={() => this.onPressRegister({ no, name })} >
            <Text style={{ fontSize: 12, color: Global.colors.ORANGE }} >去挂号</Text>
          </Button>
          <Icon name="ios-arrow-forward-outline" size={20} width={40} height={20} color={Global.colors.FONT_LIGHT_GRAY1} />
        </TouchableOpacity>
      );
    });
    return (
      <View key={`${item.no}${item.name}`} style={styles.sectionContainer}>
        <View style={[styles.section]}>
          <Text style={styles.sectionText}>
            {item.name}
          </Text>
        </View>
        {content}
      </View>
    );
  }

  /**
   * 渲染行分割线
   */
  renderSeparator(sectionId, rowId) {
    if (this.isEndOfSection(sectionId, rowId)) {
      return <View key={`sep_${rowId}`} style={Global.styles.FULL_SEP_LINE} />;
    } else {
      return <View key={`sep_${rowId}`} style={Global.styles.SEP_LINE} />;
    }
  }

  /**
   * 渲染顶端工具栏
   */
  renderToolBar() {
    return null;
    // return (
    //   <View style={[Global.styles.TOOL_BAR.FIXED_BAR]} >
    //     <SearchInput
    //       value={this.state.name}
    //       onChangeText={(value) => {
    //         this.setState({ name: value });
    //       }}
    //       onSearch={() => {
    //         this.fetchData();
    //       }}
    //       onClear={() => {
    //         this.setState({ name: '' }, () => {
    //           this.fetchData();
    //         });
    //       }}
    //       placeholder="请输入科室名称"
    //     />
    //   </View>
    // );
  }

  render() {
    const emptyView = this.renderEmptyView({
      msg: '暂无科室信息',
      reloadMsg: '点击刷新按钮重新查询',
      reloadCallback: this.pullToRefresh,
      ctrlState: this.state.ctrlState,
      data: this.data,
      showActivityIndicator: true,
      style: { marginTop: 15 },
    });
    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]} >
        <TouchableWithoutFeedback onPress={() => dismissKeyboard()} accessible={false} >
          <KeyboardAwareScrollView style={styles.scrollView} keyboardShouldPersistTaps="always" >
            {this.renderToolBar()}
            {emptyView}
            <ListView
              automaticallyAdjustContentInsets={false} // 此参数保证在IOS的Tabbar中顶端不出现与statusBar等高的空隙
              dataSource={this.state.dataSource}
              renderRow={this.renderRow}
              // renderSectionHeader={HospitalDepts.renderSectionHeader}
              // renderSeparator={this.renderSeparator}
              initialListSize={10}
              pageSize={10}
              style={[styles.list]}
            />
          </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    // margin: 8,
    marginTop: 0,
    paddingBottom: 40,
  },
  item: {
    paddingLeft: 15,
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 10,
    flexDirection: 'row',
    backgroundColor: 'white',
    // borderLeftWidth: 1 / Global.pixelRatio,
    // borderLeftColor: Global.colors.IOS_SEP_LINE,
    // borderRightWidth: 1 / Global.pixelRatio,
    // borderRightColor: Global.colors.IOS_SEP_LINE,
  },
  sectionContainer: {
    borderBottomWidth: 1 / Global.pixelRatio,
    borderBottomColor: Global.colors.LINE,
  },
  section: {
    marginTop: 15,
    backgroundColor: 'white',
    borderWidth: 1 / Global.pixelRatio,
    borderColor: Global.colors.LINE,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    flexDirection: 'row',
  },
  sectionText: {
    textAlign: 'center',
    fontSize: 15,
    color: Global.colors.FONT_GRAY,
    fontWeight: '500',
  },
});

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(HospitalDepts);

// export default HospitalDepts;

// const mapStateToProps = state => ({
//   base: state.base,
// });
//
// export default connect(mapStateToProps)(HospitalDepts);
