
/**
 * 显示及重载病区列表
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
import { setCurrInpatientArea, setInpatientAreas } from '../../actions/base/BaseAction';
import { loadInpatientAreas } from '../../services/inpatientArea/InpatientArea';

class InpatientAreas extends Component {
  static displayName = 'InpatientAreas';
  static description = '病区列表';

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
    this.renderAreasItem = this.renderAreasItem.bind(this);
    this.refreshAreas = this.refreshAreas.bind(this);
    this.switchArea = this.switchArea.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  state = {
    doRenderScene: false,
    areasRefreshing: false,
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

  switchArea(area) {
    this.props.setCurrInpatientArea(area);
    this.props.onSwitch(area);
  }

  async refreshAreas() {
    try {
      this.setState({ areasRefreshing: true });
      const responseData = await loadInpatientAreas();
      if (responseData.success) {
        this.props.setInpatientAreas(responseData.result);
      } else {
        Toast.show('获取病区出错！');
      }
      this.setState({ areasRefreshing: false });
    } catch (e) {
      this.setState({ areasRefreshing: false });
      this.handleRequestException(e);
    }
  }

  renderAreasItem({ item, index }) {
    const { base } = this.props;
    const { currInpatientArea } = base;
    const textStyle = currInpatientArea.id === item.id ? {
      color: Global.colors.IOS_BLUE,
    } : null;
    return (
      <Item
        data={item}
        index={index}
        onPress={() => {
          if (currInpatientArea.id === item.id) return;
          this.switchArea(item);
        }}
      >
        <Text style={[styles.areaItemText, textStyle]} >{item.name}</Text>
      </Item>
    );
  }

  render() {
    // 场景过渡动画未完成前，先渲染过渡场景
    if (!this.state.doRenderScene) {
      return InpatientAreas.renderPlaceholderView();
    }

    const { base } = this.props;
    const { inpatientAreas, screen } = base;
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
            <Text style={styles.cardTitle} >切换病区</Text>
            <Button clear stretch={false} style={styles.refreshButton} onPress={this.refreshAreas} >
              <Icon iconLib="mi" name="refresh" color={Global.colors.FONT_GRAY} />
              <Text>刷新</Text>
            </Button>
          </View>
          <FlatList
            ref={(c) => { this.listAreasRef = c; }}
            data={inpatientAreas}
            style={styles.list}
            keyExtractor={(item, index) => `${item}${index + 1}`}
            // 渲染行
            renderItem={this.renderAreasItem}
            // 渲染行间隔
            ItemSeparatorComponent={() => (<Sep height={1} bgColor={Global.colors.LINE} />)}
            // 控制下拉刷新
            refreshing={this.state.areasRefreshing}
            onRefresh={this.refreshAreas}
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
  areaItemText: {
    fontSize: 16,
    color: Global.colors.FONT_GRAY,
  },
});

InpatientAreas.propTypes = {
  visible: PropTypes.bool,
  onSwitch: PropTypes.func,
  onClose: PropTypes.func,
};

InpatientAreas.defaultProps = {
  visible: false,
  onSwitch: () => {},
  onClose: () => {},
};

// export default InpatientAreas;

const mapStateToProps = state => ({
  auth: state.auth,
  base: state.base,
});

const mapDispatchToProps = dispatch => ({
  setInpatientAreas: areas => dispatch(setInpatientAreas(areas)),
  setCurrInpatientArea: area => dispatch(setCurrInpatientArea(area)),
});

export default connect(mapStateToProps, mapDispatchToProps)(InpatientAreas);
