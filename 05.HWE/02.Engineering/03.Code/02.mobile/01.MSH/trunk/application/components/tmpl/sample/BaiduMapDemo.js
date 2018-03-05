/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  MapView,
  MapTypes,
} from 'react-native-baidu-map';

import MapsView from 'react-native-maps';

import {
  StyleSheet,
  View,
} from 'react-native';

import Dimensions from 'Dimensions';
import Global from '../../../Global';

export default class BaiduMapDemo extends Component {
  constructor() {
    super();

    this.state = {
      markers: [{
        longitude: 113.981718,
        latitude: 22.542449,
        title: 'Window of the world',
      }, {
        longitude: 113.995516,
        latitude: 22.537642,
        title: '',
      }],
    };
  }

  componentDidMount() {
  }

  render() {
    const navigate = this.props.navigation.state.params;

    let baiduMapView = null;
    if (Global.os === 'android') {
      baiduMapView = (<MapView
        trafficEnabled
        baiduHeatMapEnabled={false}
        zoom={15}
        mapType={MapTypes.NORMAL}
        center={{
            longitude: navigate.longitude,
            latitude: navigate.latitude,
          }}
        markers={this.state.markers}
        style={styles.map}
        onMarkerClick={(e) => {
            console.warn(JSON.stringify(e));
          }}
      />);
    } else if (Global.os === 'ios') {
      baiduMapView = (<MapsView
        style={styles.map}
        region={{
          latitude: navigate.latitude,
          longitude: navigate.longitude,
          latitudeDelta: 0.01, // 地图显示范围，距中点的横向距离
          longitudeDelta: 0.01, // 地图显示范围，距中点的纵向距离
        }}
        zoom={20}
      >
        <MapsView.Marker
          coordinate={{ latitude: navigate.latitude, longitude: navigate.longitude }}
          title={navigate.title}
          description={navigate.title}
        />
      </MapsView>);
    }
    console.info(baiduMapView);
    return (
      <View style={styles.container}>
        {baiduMapView}

        {/* <View style={styles.row}>
          <Button title="Normal" onPress={() => {
            this.setState({
              mapType: MapTypes.NORMAL
            });
          }} />
          <Button style={styles.btn} title="Satellite" onPress={() => {
            this.setState({
              mapType: MapTypes.SATELLITE
            });
          }} />

          <Button style={styles.btn} title="Locate" onPress={() => {
            console.warn('center', this.state.center);
            Geolocation.getCurrentPosition()
              .then(data => {
                console.warn(JSON.stringify(data));
                this.setState({
                  zoom: 15,
                  marker: {
                    latitude: data.latitude,
                    longitude: data.longitude,
                    title: 'Your location'
                  },
                  center: {
                    latitude: data.latitude,
                    longitude: data.longitude,
                    rand: Math.random()
                  }
                });
              })
              .catch(e =>{
                console.warn(e, 'error');
              })
          }} />
        </View>

        <View style={styles.row}>
          <Button title="Zoom+" onPress={() => {
            this.setState({
              zoom: this.state.zoom + 1
            });
          }} />
          <Button title="Zoom-" onPress={() => {
            if(this.state.zoom > 0) {
              this.setState({
                zoom: this.state.zoom - 1
              });
            }

          }} />
        </View>

        <View style={styles.row}>
          <Button title="Traffic" onPress={() => {
            this.setState({
              trafficEnabled: !this.state.trafficEnabled
            });
          }} />

          <Button title="Baidu HeatMap" onPress={() => {
            this.setState({
              baiduHeatMapEnabled: !this.state.baiduHeatMapEnabled
            });
          }} />
        </View>*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    height: 40,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  map: {
    width: Dimensions.get('window').width,
    // height: Dimensions.get('window').height - 200,
    height: Dimensions.get('window').height,
    marginBottom: 16,
  },
});


BaiduMapDemo.navigationOptions = {
  headerTitle: '百度地图',
};

