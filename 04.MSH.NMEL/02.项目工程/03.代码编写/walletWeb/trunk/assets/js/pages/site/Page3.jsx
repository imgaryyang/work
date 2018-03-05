import React from 'react';
import TweenOne from 'rc-tween-one';
import ScrollOverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import { Icon, Button } from 'antd';
import QueueAnim from 'rc-queue-anim';

export default function Page3() {
  return (
    <ScrollOverPack scrollName="page3" className="content-wrapper page" playScale={1} replay>
      <TweenOne key="image" className="image3 image-wrapper" animation={{ x: 0, opacity: 1, duration: 550 }}
        style={{ transform: 'translateX(-100px)', opacity: 0 }} hideProps={{ reverse: true }}
      />
      <QueueAnim className="text-wrapper" delay={300} key="text" duration={550} leaveReverse style={{ top: '40%' }}
        hideProps={{ child: null }}
      >
        <h2 key="h2">易缴费</h2>
        <p key="p" style={{ maxWidth: 280 }}>您身边的生活缴费助手</p>
        <div key="button">
          <Button type="dashed" size="large" disabled >
              敬请期待
            </Button>
        </div>
      </QueueAnim>
    </ScrollOverPack>
  );
}
