/**
 * 显示当前病区、切换当前病区、显示及重载患者列表
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import Card from 'rn-easy-card';
import Button from 'rn-easy-button';
import Icon from 'rn-easy-icon';
import Sep from 'rn-easy-separator';

import Global from '../../Global';
import Patients from './Patients';
import InpatientAreas from './InpatientAreas';

class AreasAndPatients extends Component {
  static displayName = 'AreasAndPatients';
  static description = '病区及患者管理';

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
    this.showAreas = this.showAreas.bind(this);
    this.showPatients = this.showPatients.bind(this);
    this.onAreasWinClose = this.onAreasWinClose.bind(this);
    this.onSwitchArea = this.onSwitchArea.bind(this);
    this.onPatientsWinClose = this.onPatientsWinClose.bind(this);
    this.onSwitchPatient = this.onSwitchPatient.bind(this);
  }

  state = {
    doRenderScene: false,
    areasVisible: false,
    patientsVisible: false,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
      });
    });
  }
  onAreasWinClose() {
    this.setState({ areasVisible: false });
  }
  onSwitchArea() {
    this.setState({ areasVisible: false });
  }
  onPatientsWinClose() {
    this.setState({ patientsVisible: false });
  }
  onSwitchPatient() {
    this.setState({ patientsVisible: false });
  }

  showAreas(visible) {
    this.setState({ areasVisible: visible });
  }

  showPatients(visible) {
    this.setState({ patientsVisible: visible });
  }

  render() {
    // 场景过渡动画未完成前，先渲染过渡场景
    if (!this.state.doRenderScene) {
      return AreasAndPatients.renderPlaceholderView();
    }

    const { base } = this.props;
    const { inpatientAreas, currInpatientArea, patients, currPatient } = base;
    const areaPatients = patients && currInpatientArea && patients[currInpatientArea.id] ? patients[currInpatientArea.id] : [];
    const areasNum = inpatientAreas ? inpatientAreas.length : 0;
    const patientsNum = areaPatients.length;
    return (
      <Card noPadding >
        <View style={styles.container} >
          <Button
            clear
            style={styles.areaButton}
            onPress={() => {
              if (areasNum === 0) return;
              this.showAreas(true);
            }}
          >
            <Text style={styles.areaButtonText} numberOfLines={1} >{currInpatientArea ? currInpatientArea.name : '未知病区'}</Text>
            {areasNum > 0 ? (<Icon iconLib="mi" name="wrap-text" color={Global.colors.FONT_GRAY} />) : null}
          </Button>
          <Sep width={1} height={15} bgColor={Global.colors.FONT_LIGHT_GRAY1} style={{ marginLeft: 10, marginRight: 10 }} />
          <Button
            clear
            style={styles.areaButton}
            onPress={() => {
              if (patientsNum === 0) return;
              this.showPatients(true);
            }}
          >
            <Text style={styles.patientsButtonText} numberOfLines={1} >
              <Text style={{ color: Global.colors.IOS_BLUE }} >{ currPatient ? `${currPatient.name} · ` : null } </Text>
              共 <Text style={styles.patientsNum} >{patientsNum}</Text> 位患者
            </Text>
            {patientsNum > 0 ? (<Icon iconLib="mi" name="list" color={Global.colors.FONT_GRAY} />) : null}
          </Button>
        </View>
        <InpatientAreas visible={this.state.areasVisible} onClose={this.onAreasWinClose} onSwitch={this.onSwitchArea} />
        <Patients visible={this.state.patientsVisible} onClose={this.onPatientsWinClose} onSwitch={this.onSwitchPatient} />
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5,
    paddingRight: 5,
  },
  areaButton: {
    flexDirection: 'row',
  },
  areaButtonText: {
    color: Global.colors.FONT_GRAY,
    marginRight: 8,
  },
  patientsButton: {
    flexDirection: 'row',
    paddingLeft: 10,
  },
  patientsButtonText: {
    color: Global.colors.FONT_GRAY,
    marginRight: 8,
  },
  patientsNum: {
    fontWeight: '600',
    color: Global.colors.IOS_BLUE,
  },
});

AreasAndPatients.propTypes = {
};

AreasAndPatients.defaultProps = {
};

// export default AreasAndPatients;

const mapStateToProps = state => ({
  auth: state.auth,
  base: state.base,
});

export default connect(mapStateToProps)(AreasAndPatients);
