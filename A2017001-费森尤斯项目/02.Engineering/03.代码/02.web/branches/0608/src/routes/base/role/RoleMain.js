import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Row, Col, Card } from 'antd';
import Editor from './RoleEditor';
import List from './RoleList';

class RoleMain extends Component {
  render() {
    const { spin } = this.props.role;

    const { wsHeight } = this.props.base;

    return (
      <Spin spinning={spin} >
        <Row>
          <Col span={14} style={{ padding: '3px' }} >
            <Card className="card-padding-5" style={{ height: `${wsHeight - 6}px` }} >
              <List />
            </Card>
          </Col>
          <Col span={10} style={{ padding: '3px' }} >
            <Card className="card-padding-15" style={{ marginLeft: '4px' }} >
              <Editor />
            </Card>
          </Col>
        </Row>
      </Spin>
    );
  }
}
export default connect(({ role, base }) => ({ role, base }))(RoleMain);

