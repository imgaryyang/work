import React from 'react';
import { connect } from 'dva';
import { Button, Flex, Modal } from 'antd-mobile';
import { testAppointItem2, action, colors } from '../../utils/common';
import less from './AppointRecordDetail.less';

class AppointRecordDetail extends React.Component {
  constructor(props) {
    super(props);

    this.cancelAppoint = this.cancelAppoint.bind(this);
  }

  cancelAppoint(item) {
    // this.props.dispatch(action('appoint/forCancel', { item }));
    this.props.dispatch(action('appoint/forCancel', { ...item }));
  }

  render() {
    const item = this.props.location.state ? this.props.location.state.item : testAppointItem2;

    return (
      <div>
        <div className={less.header}>预约状态： <span className={less.fontOrange}>{item.statusName}</span></div>
        <div className={less.topCard}>
          <div className={less.row}>
            <span className={less.label}>就诊医院</span>
            <span className={less.content}>{item.hosName}</span>
          </div>
          <div className={less.sep} />
          <div className={less.row}>
            <span className={less.label}>就诊科室</span>
            <span className={less.content}>{item.depName}</span>
          </div>
          <div className={less.sep} />
          <div className={less.row}>
            <span className={less.label}>预约医生</span>
            <span className={less.content}>{item.docName}</span>
          </div>
          <div className={less.sep} />
          <div className={less.row}>
            <span className={less.label}>门诊类型</span>
            <span className={less.content}>{item.clinicTypeName}</span>
          </div>
        </div>
        <div className={less.downCard}>
          <Flex direction="row" align="center" className={less.row}>
            <div className={less.label}>
              {item.proName} <span className={less.fontOrange}>（无卡预约）</span>
            </div>
            <div>{item.mobile}</div>
          </Flex>
          <Flex direction="row" align="center" className={less.row}>
            <div className={less.label}>预约时间</div>
            <div>{item.appointTime}</div>
          </Flex>
          <Flex direction="row" align="center" className={less.row}>
            <div className={less.label}>挂号费</div>
            <div>¥{item.totalFee}</div>
          </Flex>
          <Flex direction="row" align="center" className={less.row}>
            <div className={less.label}>支付类型</div>
            <div>去医院支付</div>
          </Flex>
        </div>
        {
          item.status === '1' || item.statusName === '已预约' ?
            <Button
              className={less.button}
              type="primary"
              onClick={() => Modal.alert(
                null,
                <div className={less.alert}>您是否要取消预约？</div>,
                [{ text: '取消' }, { text: '确定', onPress: () => this.cancelAppoint(item), style: { color: colors.ORANGE } }],
              )}
            >
              取消预约
            </Button> :
            null
        }
      </div>
    );
  }
}

export default connect(appoint => (appoint))(AppointRecordDetail);
