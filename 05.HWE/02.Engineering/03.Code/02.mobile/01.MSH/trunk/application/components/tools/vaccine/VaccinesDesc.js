import React, {
  Component,
} from 'react';

import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  InteractionManager,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import Icon from 'rn-easy-icon';
import Card from 'rn-easy-card';
import Sep from 'rn-easy-separator';
import Global from '../../../Global';
import { filterHtmlForWiki } from '../../../utils/Filters';


class VaccinesDesc extends Component {
    static displayName = 'VaccinesDesc';
    static description = '疫苗详情';

    static renderPlaceholderView() {
      return (
        <View style={[Global.styles.INDICATOR_CONTAINER]} >
          <ActivityIndicator />
        </View>
      );
    }


    state = {
      doRenderScene: false,
    };


    componentDidMount() {
      InteractionManager.runAfterInteractions(() => {
        this.setState({ doRenderScene: true });
      });
      this.props.navigation.setParams({
        title: '疫苗详情',
      });
    }


    render() {
      const { item } = this.props.navigation.state.params;
      if (!this.state.doRenderScene) {
        return VaccinesDesc.renderPlaceholderView();
      }

      return (

        <View style={Global.styles.CONTAINER_BG} >
          <ScrollView style={styles.scrollView} >
            <Card fullWidth style={{ borderTopWidth: 0 }} >
              <Text style={{ fontSize: 16, color: 'black', fontWeight: '600' }} >{item.vaccineName}</Text>
            </Card>


            <Sep height={15} />
              <Card fullWidth noPadding >
                  <View style={styles.cardTitle}>
                      <Text style={styles.cardTitleText} >预防疾病</Text>
                  </View>
                  <Text style={styles.detail}>{filterHtmlForWiki(item.disease || '暂无预防疾病信息介绍')}</Text>
              </Card>

            <Sep height={15} />
              <Card fullWidth noPadding >
                  <View style={styles.cardTitle}>
                      <Text style={styles.cardTitleText} >接种部位</Text>
                  </View>
                  <Text style={styles.detail}>{filterHtmlForWiki(item.inoculationSite || '暂无接种部位信息介绍')}</Text>
              </Card>

            <Sep height={15} />
              <Card fullWidth noPadding >
                  <View style={styles.cardTitle}>
                      <Text style={styles.cardTitleText} >接种方式</Text>
                  </View>
                  <Text style={styles.detail}>{filterHtmlForWiki(item.way || '暂无接种方式信息介绍')}</Text>
              </Card>

            <Sep height={15} />
              <Card fullWidth noPadding >
                  <View style={styles.cardTitle}>
                      <Text style={styles.cardTitleText} >接种次数</Text>
                  </View>
                  <Text style={styles.detail}>{filterHtmlForWiki(item.inoculationTime || '暂无接种次数信息介绍')}</Text>
              </Card>

            <Sep height={15} />
              <Card fullWidth noPadding >
                  <View style={styles.cardTitle}>
                      <Text style={styles.cardTitleText} >接种计量</Text>
                  </View>
                  <Text style={styles.detail}>{filterHtmlForWiki(item.dose || '暂无接种计量信息介绍')}</Text>
              </Card>

            <Sep height={15} />
              <Card fullWidth noPadding >
                  <View style={styles.cardTitle}>
                      <Text style={styles.cardTitleText} >备注</Text>
                  </View>
                  <Text style={styles.detail}>{filterHtmlForWiki(item.remark || '暂无备注信息介绍')}</Text>
              </Card>


          </ScrollView>
        </View>
      );
    }
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },

    cardTitle: {
        borderBottomWidth: 1 / Global.pixelRatio,
        borderBottomColor: Global.colors.LINE,
        paddingLeft: 15,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        height: 40,
    },
    cardTitleText: {
        flex: 1,
        color: '#000000',
        fontSize: 14,
        fontWeight: '600',
    },

    list: {
        paddingLeft: 15,
        paddingRight: 15,
    },

    rowStyle: {
        paddingTop: 15,
        paddingBottom: 15,
    },

    detail: {
        fontSize: 13,
        lineHeight: 16,
        padding: 15,
        paddingTop: 10,
        paddingBottom: 10,
    },
    content: {
        marginTop: 10,
    },
});

VaccinesDesc.navigationOptions = {
  title: '疫苗详情',
};

export default VaccinesDesc;

