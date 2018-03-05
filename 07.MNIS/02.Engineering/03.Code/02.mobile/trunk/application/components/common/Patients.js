
/**
 * 显示及重载患者列表
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, FlatList, InteractionManager } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Toast from 'react-native-root-toast';
import Modal from 'react-native-modal';
import Card from 'rn-easy-card';
import Button from 'rn-easy-button';
import Icon from 'rn-easy-icon';
import Sep from 'rn-easy-separator';

import Global from '../../Global';
import Item from '../../modules/PureListItem';
import { setPatients, setCurrPatient } from '../../actions/base/BaseAction';
import { loadPatients } from '../../services/inpatientArea/InpatientArea';

class Patients extends Component {
  static displayName = 'Patients';
  static description = '患者管理';

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
    this.renderPatientsItem = this.renderPatientsItem.bind(this);
    this.refreshPatients = this.refreshPatients.bind(this);
    this.switchPatient = this.switchPatient.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  state = {
    doRenderScene: false,
    patientsRefreshing: false,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
      });
    });
  }

  onClose() {
    this.props.onClose();
  }

  switchPatient(patient) {
    this.props.setCurrPatient(patient);
    this.props.onSwitch(patient);
  }

  async refreshPatients() {
    try {
      this.setState({ patientsRefreshing: true });
      const responseData = await loadPatients();
      if (responseData.success) {
        this.props.setPatients(responseData.result);
      } else {
        Toast.show('获取患者列表出错！');
      }
      this.setState({ patientsRefreshing: false });
    } catch (e) {
      this.setState({ patientsRefreshing: false });
      this.handleRequestException(e);
    }
  }

  renderPatientsItem({ item, index }) {
    // console.log(item);
    const { base } = this.props;
    const { currPatient } = base;
    const textStyle = currPatient && currPatient.id === item.id ? {
      color: Global.colors.IOS_BLUE,
    } : null;
    return (
      <Item
        data={item}
        index={index}
        onPress={() => {
          if (currPatient && currPatient.id === item.id) return;
          this.switchPatient(item);
        }}
      >
        <Text style={[styles.patientItemText, textStyle]} >{item.name}
          <Text style={styles.appendInfo} > ( {item.gender} {item.age}岁 ){'\n'}</Text>
          <Text style={[styles.appendInfo, { lineHeight: 26 }]} >{item.roomNo ? ` ${item.roomNo} 房` : null} {item.bedNo} 床</Text>
        </Text>
        <Text>
          <Text>住院号：{item.inpatientNo}</Text>
        </Text>
      </Item>
    );
  }

  render() {
    // 场景过渡动画未完成前，先渲染过渡场景
    if (!this.state.doRenderScene) {
      return Patients.renderPlaceholderView();
    }

    const { base } = this.props;
    const { currInpatientArea, patients, screen } = base;
    const areaPatients = patients && currInpatientArea && patients[currInpatientArea.id] ? patients[currInpatientArea.id] : [];
    return (
      <Modal
        isVisible={this.props.visible}
        onBackdropPress={() => this.onClose()}
        animationIn="slideInDown"
      >
        <Card radius={5} noPadding style={{ maxHeight: (screen.height - 40), paddingBottom: 15 }} >
          <View style={styles.cardTitleContainer} >
            <Button clear stretch={false} style={styles.closeButton} onPress={() => this.onClose()} >
              <Icon iconLib="mi" name="close" color={Global.colors.FONT_GRAY} />
            </Button>
            <Text style={styles.cardTitle} >患者列表</Text>
            <Button clear stretch={false} style={styles.refreshButton} onPress={this.refreshPatients} >
              <Icon iconLib="mi" name="refresh" color={Global.colors.FONT_GRAY} />
              <Text>刷新</Text>
            </Button>
          </View>
          <FlatList
            ref={(c) => { this.listPatientsRef = c; }}
            data={areaPatients}
            style={styles.list}
            keyExtractor={(item, index) => `${item}${index + 1}`}
            // 渲染行
            renderItem={this.renderPatientsItem}
            // 渲染行间隔
            ItemSeparatorComponent={() => (<Sep height={1} bgColor={Global.colors.LINE} />)}
            // 控制下拉刷新
            refreshing={this.state.patientsRefreshing}
            onRefresh={this.refreshPatients}
          />
        </Card>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  cardTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: Global.colors.LINE,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    color: Global.colors.FONT_GRAY,
    fontWeight: '600',
    textAlign: 'center',
    paddingLeft: 30,
  },
  refreshButton: {
    width: 70,
    flexDirection: 'row',
  },
  closeButton: {
    width: 40,
    flexDirection: 'row',
  },
  list: {
  },
  patientItemText: {
    flex: 1,
    fontSize: 16,
    color: Global.colors.FONT_GRAY,
  },
  appendInfo: {
    fontSize: 13,
    color: Global.colors.FONT_LIGHT_GRAY,
  },
});

Patients.propTypes = {
  visible: PropTypes.bool,
  onSwitch: PropTypes.func,
  onClose: PropTypes.func,
};

Patients.defaultProps = {
  visible: false,
  onSwitch: () => {},
  onClose: () => {},
};

// export default Patients;

const mapStateToProps = state => ({
  auth: state.auth,
  base: state.base,
});

const mapDispatchToProps = dispatch => ({
  setPatients: patients => dispatch(setPatients(patients)),
  setCurrPatient: patient => dispatch(setCurrPatient(patient)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Patients);
