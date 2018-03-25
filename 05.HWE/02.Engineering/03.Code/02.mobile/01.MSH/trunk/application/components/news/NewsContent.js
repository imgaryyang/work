import React, { Component } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  InteractionManager,
  ActivityIndicator,
} from 'react-native';
import Sep from 'rn-easy-separator';
import moment from 'moment';
import Portrait from 'rn-easy-portrait';

import Global from '../../Global';
import Form from '../../modules/form/EasyForm';
import FormConfig from '../../modules/form/config/LineInputsConfig';

class NewsContent extends Component {
  static displayName = 'NewsContent';
  static description = '详情信息';

  state = {
    doRenderScene: false,
    value: (
      this.props.navigation.state.params.data ?
        Object.assign({}, this.props.navigation.state.params.data) : null
    ),
    showLabel: true,
    labelPosition: 'left',
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
      });
    });
    this.props.navigation.setParams({
      title: '新闻详情', // this.state.value.caption,
    });
  }

  form = null;

  renderPlaceholderView() {
    return (
      <View style={Global.styles.INDICATOR_CONTAINER} >
        <ActivityIndicator />
      </View>
    );
  }

  render() {
    if (!this.state.doRenderScene) {
      return this.renderPlaceholderView();
    }

    if (typeof this.state.value.image === 'undefined' || this.state.value.image === '' || this.state.value.image === null) {
      return (
        <View style={[Global.styles.CONTAINER]}>
          <ScrollView style={styles.scrollView} >
            <Form
              ref={(c) => { this.form = c; }}
              config={FormConfig}
              showLabel={this.state.showLabel}
              labelPosition={this.state.labelPosition}
              labelWidth={100}
              value={this.state.value}
            >
              <View radius={8} style={{ margin: 10 }} >
                <Text style={styles.titleText}>{this.state.value.caption}</Text>
                <Sep height={3} />
                <Text style={styles.addText}>{moment(this.state.value.createdAt).format('YYYY-MM-DD HH:MM')}</Text>
                <Sep height={23 / 2} />
                <Text style={styles.text}>{this.state.value.digest}</Text>
                <Sep height={10} />
                <Text style={styles.text}>{this.state.value.body}</Text>
              </View>

            </Form>
          </ScrollView>
        </View>
      );
    } else {
      /* const uriBefore = base().img + this.state.value.image;
      const uriAfter = new Date().getTime();
      const uriImage = `${uriBefore}?timestamp=${uriAfter}`;*/
      const portrait = (
        <Portrait
          width={Global.screen.width - 40}
          height={(Global.screen.width - 40) * (177 / 340)}
          imageSource={{ uri: `${Global.getImageHost()}${this.state.value.image}?timestamp=${new Date().getTime()}` }}
        />
      );

      return (
        <View style={[Global.styles.CONTAINER]}>
          <ScrollView style={styles.scrollView} >
            <Form
              ref={(c) => { this.form = c; }}
              config={FormConfig}
              showLabel={this.state.showLabel}
              labelPosition={this.state.labelPosition}
              labelWidth={100}
              value={this.state.value}
            >
              <View radius={8} style={{ margin: 20 }} >
                <Text style={styles.titleText}>{this.state.value.caption}</Text>
                <Text style={styles.addText}>{moment(this.state.value.createdAt).format('YYYY-MM-DD HH:MM')}</Text>
                <Sep height={23 / 2} />
                <Text style={[styles.text, { color: Global.colors.FONT_GRAY }]}>{this.state.value.digest}</Text>
                <Sep height={10} />
                <View>
                  {portrait}
                </View>
                <Sep height={10} />
                <Text style={styles.text}>{this.state.value.body}</Text>
              </View>

            </Form>
          </ScrollView>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },

  fieldSet: {
    borderLeftWidth: 4,
    borderLeftColor: 'brown',
    paddingLeft: 10,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: Global.colors.IOS_GRAY_BG,
  },

  titleText: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 20,
    color: 'black',
  },
  addText: {
    fontSize: 12,
    color: Global.colors.FONT_LIGHT_GRAY1,
  },
  text: {
    fontSize: 14,
    lineHeight: 25,
    color: 'black',
  },
});

NewsContent.navigationOptions = () => ({
});

export default NewsContent;
