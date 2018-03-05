import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Icon from 'rn-easy-icon';
import Portrait from 'rn-easy-portrait';
import Button from 'rn-easy-button';

import Global from '../../Global';
import * as Filters from '../../utils/Filters';
import Distance from '../../modules/filters/Distance';
import Tags from '../../modules/filters/Tags';

class HospitalListItem extends PureComponent {
  render() {
    // console.log(this.props);
    const { item, showScenery, showGotoButton, tags, showAddrTopLine } = this.props;
    // 显示医院logo
    const logoSource = item.logo ?
      { uri: `${Global.getImageHost()}${item.logo}?timestamp=${new Date().getTime()}` } :
      Global.Config.defaultImgs.hospLogo;

    // 显示医院图册
    const scenerySource = item.scenery ?
      { uri: `${Global.getImageHost()}${item.scenery}` } :
      Global.Config.defaultImgs.hospScenery;
    // console.log(logoSource, scenerySource);
    const scenery = showScenery ? (
      <View style={styles.sceneryContainer} >
        <ImageBackground source={scenerySource} resizeMode="cover" style={styles.sceneryBg} >
          <View style={styles.sceneryNumContainer} >
            <Text style={styles.sceneryNumText} >{item.sceneryNum || '0'}</Text>
          </View>
        </ImageBackground>
      </View>
    ) : null;

    // 计算距离
    const { currLocation } = this.props.base;
    const distance = currLocation && currLocation.longitude !== null && currLocation.latitude !== null ? (
      <Distance
        start={{
          longitude: currLocation.longitude,
          latitude: currLocation.latitude,
        }}
        end={{
          longitude: item.longitude,
          latitude: item.latitude,
        }}
      />
    ) : null;

    // 查看详情按钮
    const gotoButton = showGotoButton ? (
      <Button
        theme={Button.THEME.BLUE}
        clear
        stretch={false}
        onPress={() => this.props.navigation.navigate('Hospital', { hospital: item, title: '医院信息' })}
        style={styles.button}
      >
        <Text style={{ fontSize: 12, color: Global.colors.IOS_BLUE }} >医院详情</Text>
      </Button>
    ) : null;
    return (
      <View style={{ width: Global.getScreen().width, overflow: 'hidden' }} >
        <View style={styles.mainInfoContainer} >
          <View style={styles.logoContainer} >
            <Portrait
              imageSource={logoSource}
              width={34}
              height={34}
              resizeMode="contain"
            />
          </View>
          <View style={{ flex: 1 }} >
            <View style={{ flexDirection: 'row', alignItems: 'center' }} >
              <Text style={styles.hospName} numberOfLines={1} >{item.name}</Text>
              {gotoButton}
            </View>
            <View style={styles.textContainer} >
              <Text style={styles.lvlAndType} >
                {Filters.filterHospLevel(item.level)} | {Filters.filterHospType(item.type)}
              </Text>
              <Tags tags={tags} containerStyle={{ flex: 1, paddingRight: 10 }} />
            </View>
          </View>
        </View>
        {scenery}
        <View style={[styles.addrContainer, showAddrTopLine ? styles.addrTopLine : null]} >
          <Icon name="ios-pin" size={16} width={18} height={20} color={Global.colors.FONT_LIGHT_GRAY} />
          <Text style={styles.addrText} numberOfLines={1} ellipsizeMode="tail" >{item.address ? item.address.address : '暂无地址信息'}</Text>
          <Text style={styles.distanceText} numberOfLines={1} ellipsizeMode="tail" >
            {distance}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainInfoContainer: {
    flexDirection: 'row',
    paddingTop: 15,
    paddingBottom: 15,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 15 + 33 + 15,
  },
  hospName: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    color: '#000000',
  },
  button: {
    // position: 'absolute',
    // top: 10,
    // right: 0,
    width: 60,
    height: 25,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  lvlAndType: {
    marginLeft: 10,
    fontSize: 11,
    color: Global.colors.FONT_GRAY,
    width: 120,
  },
  sceneryContainer: {
    width: 80,
    height: 50,
    borderRadius: 5,
    backgroundColor: Global.colors.IOS_GRAY_BG,
    marginLeft: 15 + 33 + 15 + 15,
    marginBottom: 15,
    overflow: 'hidden',
  },
  sceneryBg: {
    width: 80,
    height: 50,
  },
  sceneryNumContainer: {
    position: 'absolute',
    right: 5,
    bottom: 5,
    padding: 2,
    paddingLeft: 4,
    paddingRight: 4,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 2,
  },
  sceneryNumText: {
    fontSize: 8,
    color: 'white',
  },
  addrContainer: {
    flexDirection: 'row',
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: Global.getScreen().width - 10,
    left: 10,
  },
  addrTopLine: {
    borderTopColor: Global.colors.LINE,
    borderTopWidth: 1 / Global.pixelRatio,
  },
  addrText: {
    flex: 1,
    fontSize: 12,
    color: Global.colors.FONT_GRAY,
  },
  distanceText: {
    textAlign: 'right',
    fontSize: 10,
    color: Global.colors.FONT_LIGHT_GRAY,
    width: 70,
    paddingRight: 5,
    // backgroundColor: 'red',
  },
});

HospitalListItem.propTypes = {
  /**
   * 显示医院实景图
   */
  showScenery: PropTypes.bool,
  /**
   * 显示查看医院详情按钮
   */
  showGotoButton: PropTypes.bool,
  /**
   * 是否显示地址上端的线条
   */
  showAddrTopLine: PropTypes.bool,
  /**
   * 显示的标签
   */
  tags: PropTypes.array,
};

HospitalListItem.defaultProps = {
  showScenery: true,
  showGotoButton: false,
  showAddrTopLine: true,
  tags: [],
};

const mapStateToProps = state => ({
  base: state.base,
});

export default connect(mapStateToProps)(HospitalListItem);
