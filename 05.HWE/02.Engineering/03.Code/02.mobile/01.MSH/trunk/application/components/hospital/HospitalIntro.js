/**
 * 医院介绍
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { connect } from 'react-redux';
import Card from 'rn-easy-card';
import Sep from 'rn-easy-separator';
import Icon from 'rn-easy-icon';
import { B } from 'rn-easy-text';
import { MapView, Marker } from 'react-native-amap3d';
import Global from '../../Global';
import * as Filters from '../../utils/Filters';
import Distance from '../../modules/filters/Distance';

class HospitalIntro extends Component {
  static displayName = 'HospitalIntro';
  static description = '医院介绍';

  componentDidMount() {
  }

  renderContacts() {
    const { contacts } = this.props.hosp;
    // console.log(contacts);
    if (!contacts || contacts.length === 0) {
      return null;
    }
    return (
      <View>
        {contacts.map((contact, idx) => {
          return (
            <Text key={`contact_${idx + 1}`} style={[Global.styles.GRAY_FONT, { marginTop: 8 }]} >
              <B>{Filters.filterContactWay(contact.type)} : </B>{contact.content}
            </Text>
          );
        })}
      </View>
    );
  }

  renderDescs() {
    if (!this.props.hosp.descs || this.props.hosp.descs.length === 0) {
      return null;
    }
    return (
      <Card>
        {this.props.hosp.descs.map((item, idx) => {
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
    const { base, hosp } = this.props;
    console.info(base, hosp);
    // const { refreshing, requestErr, contacts } = this.state;
    const { longitude, latitude } = base.currLocation;
    console.log('.......:', longitude, latitude, hosp);
    const distance = longitude !== null && latitude !== null && hosp.longitude !== null && hosp.latitude !== null ? (
      <Distance
        start={{
          longitude,
          latitude,
        }}
        end={{
          longitude: hosp.longitude,
          latitude: hosp.latitude,
        }}
      />
    ) : null;

    let mapView = null;
    if (hosp.latitude && hosp.longitude) {
      mapView = (
        <View style={styles.map}>
          <MapView
            style={styles.map}
            zoomLevel={17}
            coordinate={{
              latitude: hosp.latitude,
              longitude: hosp.longitude,
            }}
          >
            <Marker
              active
              title={hosp.name}
              color="red"
              coordinate={{
                latitude: hosp.latitude,
                longitude: hosp.longitude,
              }}
            />
          </MapView>
        </View>
      );
    }


    const emptyView = (!hosp.contacts || hosp.contacts.length === 0) ? (
      <Text style={[Global.styles.MSG_TEXT, { marginTop: 30, marginBottom: 20 }]} >暂无联系方式</Text>
    ) : null;

    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG, paddingTop: 15 }]} >
        <Card >
          <View style={Global.styles.CARD_TITLE} >
            <Text style={Global.styles.CARD_TITLE_TEXT} >地址</Text>
          </View>
          <View style={styles.addrContainer} >
            <Icon name="ios-pin" size={16} width={18} height={20} color={Global.colors.FONT_LIGHT_GRAY} />
            <Text style={styles.addrText} numberOfLines={1} ellipsizeMode="tail" >{ hosp.address ? hosp.address.address : '暂无地址信息'}</Text>
            <Text style={styles.distanceText} numberOfLines={1} ellipsizeMode="tail" >
              {distance}
            </Text>
          </View>
          {mapView}
        </Card>
        <Sep height={15} />
        <Card >
          <View style={Global.styles.CARD_TITLE} >
            <Text style={Global.styles.CARD_TITLE_TEXT} >联系方式</Text>
          </View>
          {emptyView}
          {this.renderContacts()}
        </Card>
        <Sep height={15} />
        <Card >
          <View style={Global.styles.CARD_TITLE} >
            <Text style={Global.styles.CARD_TITLE_TEXT} >交通方式</Text>
          </View>
          {
            hosp.transportation ? (
              <Text style={[Global.styles.GRAY_FONT, { marginTop: 8, lineHeight: 17 }]} >{hosp.transportation.content}</Text>
            ) : (
              <Text style={[Global.styles.MSG_TEXT, { marginTop: 30, marginBottom: 20 }]} >暂无交通方式信息</Text>
            )
          }
        </Card>
        <Sep height={15} />
        {this.renderDescs()}
        <Sep height={40} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  map: {
    width: Global.getScreen().width - 30,
    height: 120,
    borderWidth: 1 / Global.pixelRatio,
    borderColor: '#000000',
    overflow: 'hidden',
  },
  mapView: {
    width: Global.getScreen().width,
    // height: Dimensions.get('window').height - 200,
    height: Global.getScreen().height,
    marginBottom: 16,
  },
  addrContainer: {
    flexDirection: 'row',
    borderTopColor: Global.colors.LINE,
    borderTopWidth: 1 / Global.pixelRatio,
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
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

const mapStateToProps = state => ({
  base: state.base,
});

export default connect(mapStateToProps)(HospitalIntro);
