import React from 'react';
import TweenOne from 'rc-tween-one';
import { Link } from 'react-router';
import ScrollOverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import { Icon, Card,Input, Button } from 'antd';
import QueueAnim from 'rc-queue-anim';

const clientHeight = document.documentElement.clientHeight;
function onScrollEvent(e) {
  const header = document.getElementById('header');
  if (e.pageY >= clientHeight) {
  if (header.className.indexOf('home-nav-bottom') < 0) {
  header.className += ' home-nav-bottom';
  }
  } else if (header.className.indexOf('home-nav-bottom') >= 0) {
  header.className = header.className.replace(/home-nav-bottom/ig, '');
  }
}

function onBtnOnclick(e){
	document.location.href="/login";
}

export default function Page1() {
  return (
    <ScrollOverPack scrollName="page1" className="content-wrapper page" playScale={1} replay scrollEvent={onScrollEvent}>
      <TweenOne key="image" className="image1 image-wrapper" animation={{ x: 0, opacity: 1, duration: 550 }}
        style={{ transform: 'translateX(-100px)', opacity: 0 }} hideProps={{ reverse: true }}
      />

      <QueueAnim className="text-wrapper" delay={300} key="text" duration={550} leaveReverse
        hideProps={{ child: null }}
      >
        <span className="line" key="line" />
        	<h2 key="h2">易健康</h2>
        <p key="p" style={{ maxWidth: 310 }}>易健康&nbsp;&nbsp;&nbsp;&nbsp;你健康</p>
        <div key="button">
            <Button type="primary" size="large" onClick={onBtnOnclick}>
              了解更多
              <Icon type="right" />
            </Button>
         </div>
      </QueueAnim>
    </ScrollOverPack>
  );
}
