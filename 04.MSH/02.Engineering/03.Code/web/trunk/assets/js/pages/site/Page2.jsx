import React from 'react';
import TweenOne from 'rc-tween-one';
import ScrollOverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import { Icon, Button } from 'antd';
import QueueAnim from 'rc-queue-anim';

export default function Page2() {
  
  return (
    <ScrollOverPack scrollName="page2" className="content-wrapper page" playScale={1} replay>
      <QueueAnim className="text-wrapper left-text" delay={300} key="text" duration={550} type="bottom"
        leaveReverse
        hideProps={{ child: null }}
      >
        <h2 key="h2">易薪宝</h2>
        <p key="p" style={{ maxWidth: 260 }}>美好生活 从薪开始</p>
        <div key="button">
          <Button type="primary" size="large"  >
              了解更多
              <Icon type="right" />
            </Button>
        </div>
      </QueueAnim>
      <TweenOne key="image" className="image2 image-wrapper" animation={{ x: 0, opacity: 1, delay: 300, duration: 550 }}
        style={{ transform: 'translateX(100px)', opacity: 0 }} hideProps={{ reverse: true }}
      />
    </ScrollOverPack>
  );
}
