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


class TestDesc extends Component {
    static displayName = 'TestDesc';
    static description = '详情';

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
        title: '化验元素详情',

      });
    }


    render() {
      const value = this.props.navigation.state.params.item;
      const clinicalSignificance = filterHtmlForWiki(value.clinicalSignificance);
      if (!this.state.doRenderScene) {
        return TestDesc.renderPlaceholderView();
      }

      return (

        <View style={Global.styles.CONTAINER_BG} >
          <ScrollView style={styles.scrollView} >
            <Card fullWidth style={{ borderTopWidth: 0 }} >
              <Text style={{ fontSize: 16, color: 'black', fontWeight: '600' }} >{filterHtmlForWiki(value.laboratoryName)}</Text>
            </Card>
            <Sep height={15} />
            <Card fullWidth noPadding >
              <View style={styles.cardTitle}>
                <Text style={styles.cardTitleText} >工程介绍</Text>
              </View>
              <Text style={styles.detail}>{value.projectIntroduction.replace(/<p>|<\\\/\p>/g, '') || '暂无工程信息介绍'}</Text>
            </Card>
            <Sep height={15} />
            <Card fullWidth noPadding >
              <View style={styles.cardTitle}>
                <Text style={styles.cardTitleText} >正常参考值</Text>
              </View>
              <Text style={styles.detail}>{value.referenceValue.replace(/<p>|<\\\/\p>/g, '') || '暂无成分信息介绍'}</Text>
            </Card>
            <Sep height={15} />
            <Card fullWidth noPadding >
              <View style={styles.cardTitle}>
                <Text style={styles.cardTitleText} >临床意义</Text>
              </View>
              <Text style={styles.detail}>{clinicalSignificance.replace(/<p>|<\\\/\p>/g, '') || '暂无成分信息介绍'}</Text>
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

TestDesc.navigationOptions = {
  title: '药品详情',
};

export default TestDesc;

