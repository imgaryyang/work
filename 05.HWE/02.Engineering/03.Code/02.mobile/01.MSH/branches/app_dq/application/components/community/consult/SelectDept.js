/**
 * 新建或修改咨询
 */

import React, { Component, PureComponent } from 'react';
import { connect } from 'react-redux';
import {
  InteractionManager,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  View,
  Text,
  FlatList,
} from 'react-native';
import Sep from 'rn-easy-separator';
import Icon from 'rn-easy-icon';

import Global from '../../../Global';
import { select } from '../../../services/hospital/DeptService';


class Item extends PureComponent {
  onPress = () => {
    this.props.onPressItem(typeof (this.props.dataId) !== 'undefined' ? this.props.dataId : this.props.data, typeof this.props.index !== 'undefined' ? this.props.index : '');
  };

  render() {
    const { selected, data } = this.props;
    const selectedItemStyle = selected ? { backgroundColor: 'white' } : null;
    const selectedTextStyle = selected ? { color: Global.colors.IOS_BLUE } : null;
    return (
      <TouchableOpacity
        onPress={this.onPress}
        style={[styles.item, selectedItemStyle]}
      >
        {
          selected ? <Icon name="md-arrow-dropright" size={16} color={Global.colors.IOS_BLUE} style={[null, styles.icon]} /> : null
        }
        <Text style={[styles.text, selectedTextStyle]} >
          {data.name || data}
        </Text>
      </TouchableOpacity>
    );
  }
}

class SelectDept extends Component {
  static displayName = 'SelectDept';
  static description = '选择科室';

  /**
   * 渲染过渡场景
   * @returns {XML}
   */
  static renderPlaceholderView() {
    return (
      <View style={Global.styles.CONTAINER} />
    );
  }

  constructor(props) {
    super(props);
    this.fetchData = this.fetchData.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.renderLeftItem = this.renderLeftItem.bind(this);
    this.showDept = this.showDept.bind(this);
    this.showDoctor = this.showDoctor.bind(this);
    this.afterDoctor = this.afterDoctor.bind(this);

  }

  state = {
    doRenderScene: false,
    data: {},
    leftData: [],
    rightData: [],
    selectedDeptClassIndex: 0,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
      }, () => this.fetchData());
    });

    this.props.navigation.setParams({
      title: '选择科室',
    });
  }

  async fetchData() {
    try {
      const responseData = await select({
        hosId: this.props.base.currHospital.id,
      });
      if (responseData.success) {
        if (responseData.result != null) {
          this.setState({
            data: responseData.result.map,
            leftData: responseData.result.typeList,
            rightData: responseData.result.deptList,
          });
        }
      } else {
        this.handleRequestException({ msg: responseData.msg });
      }
    } catch (e) {
      this.handleRequestException(e);
    }
  }


  showDept(key, index) {
    this.setState({
      rightData: this.state.data[key],
      selectedDeptClassIndex: index,
    });
  }


  showDoctor(key) {
    this.props.navigation.navigate('DoctorList', {
      deptId: key,
      callback: this.afterDoctor,
    });
  }

  afterDoctor(item) {
    // 回调列表更新数据
    const { callback } = this.props.navigation.state.params;
    if (typeof callback === 'function') callback();
    // 返回列表页
    this.props.navigation.goBack();
  }

  /**
   * 渲染行数据
   */
  renderItem({ item, index }) {
    return (
      <Item
        data={item.name}
        index={index}
        dataId={item.id}
        onPressItem={this.showDoctor}
      />
    );
  }

  /**
   * 渲染行数据
   */
  renderLeftItem({ item, index }) {
    return (
      <Item
        data={item}
        index={index}
        onPressItem={this.showDept}
        selected={this.state.selectedDeptClassIndex === index}
      />
    );
  }

  render() {
    // 场景过渡动画未完成前，先渲染过渡场景
    if (!this.state.doRenderScene) {
      return SelectDept.renderPlaceholderView();
    }
    // console.log('this.props.navigation in SelectDept.render():', this.props.navigation);

    return (
      <View style={Global.styles.CONTAINER_ROW} >
        <ScrollView>
          <FlatList
            data={this.state.leftData}
            renderItem={this.renderLeftItem}
            keyExtractor={(item, index) => `${item}${index + 1}`}
            style={styles.deptClassList}
            ItemSeparatorComponent={() => (<Sep height={Global.lineWidth} bgColor={Global.colors.LINE} />)}
          />
          <Sep height={20} />
        </ScrollView>
        <ScrollView>
          <FlatList
            data={this.state.rightData}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => `${item}${index + 1}`}
            ItemSeparatorComponent={() => (<Sep height={1 / Global.pixelRatio} bgColor={Global.colors.LINE} />)}
              /* ListEmptyComponent={() => {
                return this.renderEmptyView({ msg: '暂无科室信息', reloadMsg: '', reloadCallback: null, ctrlState: null, });
              }}*/
            style={styles.list}
          />
          <Sep height={20} />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  deptClassList: {
    flex: 1,
    backgroundColor: Global.colors.IOS_GRAY_BG,
  },

  icon: {
    marginRight: 6,
  },
  item: {
    flex: 1,
    height: 45,
    paddingLeft: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    flex: 1,
    fontSize: 15,
    color: Global.colors.FONT_GRAY,
  },
});


const mapStateToProps = state => ({
  // auth: state.auth,
  base: state.base,
});


export default connect(mapStateToProps)(SelectDept);
