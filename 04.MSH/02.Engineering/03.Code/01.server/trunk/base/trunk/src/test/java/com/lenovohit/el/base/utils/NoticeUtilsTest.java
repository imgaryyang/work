package com.lenovohit.el.base.utils;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.lenovohit.el.ApplicationTests;
import com.lenovohit.el.base.model.Notice;
import com.lenovohit.el.base.service.NoticeService;

public class NoticeUtilsTest extends ApplicationTests {
	@Autowired
	private NoticeService noticeService;

	@Test
	public void testSendNotice() {
		Notice notice = new Notice();
		notice.setId("id");
		notice.setTitle("测试Jpush消息推送标题");
		notice.setContent("测试Jpsh消息推送内容");
		notice.setTarget("target");
		notice.setType("00");
		notice.setMode("1");
		notice.setReceiverType("1");
		notice.setApps("8a8c7db154ebe90c0154ebfdd1270004");
		notice.setReceiverValue("40281882554de9e101554deaa0590000");
		notice.getExtraParams().put("id", "id");
		notice.getExtraParams().put("target", "target");
		notice.getExtraParams().put("type", "type");
		
		noticeService.send(notice);
	}
	
	@Test
	public void testSendMessage() {
		Notice notice = new Notice();
		notice.setMode(Notice.NOT_MODE_MSG);
		notice.setType(Notice.NOT_TYPE_MSG_CHK);
		notice.getExtraParams().put("mobiles", "15210237560");
		notice.getExtraParams().put("checkCode", "123456");
		notice.getExtraParams().put("time", "5");
		
		noticeService.send(notice);
	}
}
