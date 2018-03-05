package com.lenovohit.mnis.base.manager;

import com.lenovohit.core.exception.BaseException;
import com.lenovohit.mnis.base.model.Notice;

public interface SendNoticeManager {
	
	/**
	 * 发送消息接口
	 * @param mode 发送方式
	 * 		0 - ALL | 1 - APP | 2 - WEB | 3 - MSG | 4 - MAIL | 5 - QQ | 6 - WX | 9 - OTHER
	 * @param type 类型
	 * 		00 - 系统公告   | 10 - 支付通知 | 11 - 导诊提醒 | 12 - 工资通知 | 20 - 验证码 
	 * @param title 消息标题
	 * @param content 消息内容
	 * @param apps 应用
	 * @param receiverType 接收类型
	 * 		0 - 所有 | 1 - 用户 | 2 - 组别 
	 * @param receiverValue 接收者
	 * @param production 是否生产模式
	 * @param params  额外属性
	 * @return
	 * @throws BaseException
	 */
	public boolean send(Notice notice);
}
