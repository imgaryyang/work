import React, { Component } from 'react';
import { Form, Button, Radio, Row, Col, Modal, notification, Icon } from 'antd';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const confirm = Modal.confirm;

class RegVisitTempOperBar extends Component {

  state = {
    week: {
      1: '星期一',
      2: '星期二',
      3: '星期三',
      4: '星期四',
      5: '星期五',
      6: '星期六',
      7: '星期日',
    },
    weekArray: [],
  }

  componentWillMount() {
    const self = this;
    const { controlParam } = this.props;
    for (const key of Object.keys(self.state.week)) {
      self.state.weekArray.push({ key, val: self.state.week[key] });
    }
    if (controlParam === 0) {
      self.onInitWeek();
    } else {
      self.onInitLoad();
    }
  }

  onInitLoad() {
    this.props.dispatch({ type: 'regVisitTemp/load' });
  }

  onInitWeek() {
    this.props.dispatch({
      type: 'regVisitTemp/setState',
      payload: { activeWeek: '1' },
    });
    this.props.setSearchObjs({ week: '1' });
    this.props.dispatch({
      type: 'regVisitTemp/load',
      payload: { query: this.props.searchObjs },
    });
  }

  onChangeWeek(e) {
    this.props.dispatch({
      type: 'regVisitTemp/setState',
      payload: { activeWeek: e.target.value },
    });
    this.props.setSearchObjs({ week: e.target.value || '' });
    this.props.dispatch({
      type: 'regVisitTemp/load',
      payload: { query: this.props.searchObjs },
    });
  }

  render() {
    const { weekArray } = this.state;
    const { activeWeek, selectedRowKeys, controlParam } = this.props;

    const onAdd = () => {
      this.props.dispatch({ type: 'regVisitTemp/toggleVisible' });
      this.props.dispatch({
        type: 'utils/setState',
        payload: { record: {} },
      });
    };

    const onDeleteAll = () => {
      const self = this;
      if (selectedRowKeys && selectedRowKeys.length > 0) {
        confirm({
          title: `您确定要删除选择的${selectedRowKeys.length}条记录吗?`,
          onOk() {
            self.props.dispatch({ type: 'regVisitTemp/deleteSelected' });
          },
        });
      } else {
        notification.info({ message: '提示信息：', description: '您目前没有选择任何数据！' });
      }
    };

    const weekGroup = weekData => weekData.map((item) => {
      return (
        <RadioButton value={item.key.toString()} key={item.key.toString()}>
          {item.val}
        </RadioButton>
      );
    });

    return (
      <div className="action-form-wrapper">
        <Row gutter={24}>
          <Col lg={12} md={12} sm={16} xs={24} className="">
            {
              controlParam === 0
              ?
                <RadioGroup
                  defaultValue="1"
                  value={activeWeek}
                  size="large"
                  onChange={this.onChangeWeek.bind(this)}
                >
                  {weekGroup(weekArray)}
                </RadioGroup>
              :
                ''
            }
          </Col>
          <Col lg={12} md={12} sm={16} xs={24} className="action-form-operating">
            <Button type="primary" size="large" className="btn-left" onClick={onAdd.bind(this)}>
              <Icon type="plus" />新增
            </Button>
            <Button type="danger" size="large" className="btn-right" onClick={onDeleteAll.bind(this)}>
              <Icon type="delete" />删除
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Form.create()(RegVisitTempOperBar);
