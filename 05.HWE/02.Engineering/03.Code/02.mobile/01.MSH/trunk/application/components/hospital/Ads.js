import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Image, View } from 'react-native';
import Swiper from 'react-native-swiper';

import Global from '../../Global';

export default class Ads extends Component {
  // 渲染滚动广告
  static renderAds() {
    return Global.Config.ads.map(({ image }, idx) => {
      return (
        <TouchableOpacity style={styles.ad} key={`home_ad_${idx + 1}`} >
          <Image source={image} resizeMode="cover" style={styles.img} />
        </TouchableOpacity>
      );
    });
  }

  render() {
    return (
      <View style={styles.container} >
        <Swiper
          style={styles.wrapper}
          paginationStyle={{ bottom: 5 }}
          autoplay
          loop
          width={Global.getScreen().width}
          height={Global.getScreen().width * (1 - 0.618)}
        >
          {Ads.renderAds()}
        </Swiper>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1 / Global.pixelRatio,
    borderBottomColor: Global.colors.LINE,
  },
  wrapper: {
  },
  ad: {
    flex: 1,
  },
  img: {
    width: Global.getScreen().width,
    height: Global.getScreen().width * (1 - 0.618),
  },
});
