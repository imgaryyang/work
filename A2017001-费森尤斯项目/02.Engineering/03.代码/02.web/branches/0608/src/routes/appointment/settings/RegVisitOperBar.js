import React, { Component } from 'react';
import { Form, Radio, Button, Row, Col, Modal, Icon, notification } from 'antd';
import moment from 'moment';
// import SearchGroup from '../../../components/SearchGroup';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const ButtonGroup = Button.Group;
const confirm = Modal.confirm;

class RegVisitOperBar extends Component {

  state = {
    week: {
      1: '一',
      2: '二',
      3: '三',
      4: '四',
      5: '五',
      6: '六',
      7: '日',
    },
    weekArray: [],
    dayCount: 0,
  }

  componentWillMount() {
    const self = this;

    const activeWeek = moment().isoWeekday().toString();
    const activeDay = moment().isoWeekday(moment().isoWeekday()).format('YYYY-MM-DD');

    for (const key of Object.keys(self.state.week)) {
      const weekDay = moment().isoWeekday(parseInt(key, 10)).format('YY-MM-DD');
      self.state.weekArray.push({ key, val: `${weekDay} ${self.state.week[key]}` });
    }

    self.onNavWeek(activeWeek, activeDay, self.state.weekArray);
  }

  onNavWeek(activeWeek, activeDay, weekArray) {
    const values = { week: activeWeek || '', visitDate: activeDay || '' };
    this.props.setSearchObjs(values);
    this.props.dispatch({
      type: 'regVisit/setState',
      payload: { activeWeek, activeDay, weekArray },
    });
    this.props.dispatch({
      type: 'regVisit/load',
      payload: { query: this.props.searchObjs },
    });
  }

  onChangeWeek(e) {
    const { weekArray } = this.props;
    const activeWeek = e.target.value;
    const activeDay = moment().isoWeekday(parseInt(activeWeek, 10) + this.state.dayCount).format('YYYY-MM-DD');
    const values = { week: activeWeek || '', visitDate: activeDay || '' };
    this.props.setSearchObjs(values);
    this.props.dispatch({
      type: 'regVisit/setState',
      payload: { activeWeek, activeDay, weekArray },
    });
    this.props.dispatch({
      type: 'regVisit/load',
      payload: { query: this.props.searchObjs },
    });
  }

  render() {
    const { weekArray, activeWeek, selectedRowKeys } = this.props;

    const onAdd = () => {
      const query = {
        deptId: this.props.searchObjs.deptId || '',
        week: this.props.searchObjs.week || '',
      };
      this.props.dispatch({
        type: 'regVisitTemp/load',
        payload: { query },
      });
      this.props.dispatch({
        type: 'regVisit/setState',
        payload: { record: {} },
      });
    };

    const onDeleteAll = () => {
      const self = this;
      if (selectedRowKeys && selectedRowKeys.length > 0) {
        confirm({
          title: `您确定要删除选择的${selectedRowKeys.length}条记录吗?`,
          onOk() {
            self.props.dispatch({ type: 'regVisit/deleteSelected' });
          },
        });
      } else {
        notification.info({ message: '提示信息：', description: '您目前没有选择任何数据！' });
      }
    };

    const onNav = (day) => {
      this.state.weekArray = [];
      if (day === 0) {
        this.state.dayCount = day;
      } else {
        this.state.dayCount += day;
      }

      const activeDay = moment().isoWeekday(parseInt(activeWeek, 10) + this.state.dayCount).format('YYYY-MM-DD');

      for (const key of Object.keys(this.state.week)) {
        const weekDay = moment().isoWeekday(parseInt(key, 10) + this.state.dayCount).format('YY-MM-DD');
        this.state.weekArray.push({ key, val: `${weekDay} ${this.state.week[key]}` });
      }

      this.onNavWeek(activeWeek, activeDay, this.state.weekArray);
    };

    const weekGroup = weekData => weekData.map((item) => {
      return (
        <RadioButton value={item.key.toString()} key={item.key.toString()}>
          {item.val}
        </RadioButton>
      );
    });

    const opearations = () => {
      return (
        <div>
          <ButtonGroup>
            <Button type="primary" onClick={onNav.bind(this, -7)} ghost>
              <Icon type="left" />上周
            </Button>
            <Button type="primary" onClick={onNav.bind(this, 0)} ghost>
              本周
            </Button>
            <Button type="primary" onClick={onNav.bind(this, 7)} ghost>
              下周<Icon type="right" />
            </Button>
            <Button type="primary" onClick={onAdd.bind(this)}><Icon type="plus" />新增</Button>
            <Button type="danger" onClick={onDeleteAll.bind(this)}><Icon type="delete" />删除</Button>
          </ButtonGroup>
        </div>
      );
    };

    return (
      <div className="action-form-wrapper">
        <Row gutter={24}>
          <Col lg={16} md={16} sm={16} xs={24} className="">
            <RadioGroup
              defaultValue="1"
              value={activeWeek}
              size="large"
              onChange={this.onChangeWeek.bind(this)}
            >
              {weekGroup(weekArray)}
            </RadioGroup>
          </Col>
          <Col lg={8} md={8} sm={16} xs={24} className="action-form-operating">
            {opearations()}
          </Col>
        </Row>
      </div>
    );
  }
}

export default Form.create()(RegVisitOperBar);
