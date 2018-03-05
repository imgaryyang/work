package com.lenovohit.hcp.finance.model;

import java.util.HashMap;
import java.util.Map;

public class PayWayContent {

	public final static Map<String, Map<String,String>> payWayMap = new HashMap<String, Map<String,String>>() {
		
		private static final long serialVersionUID = 1L;

		{
			put("1", new HashMap<String,String>(){{	put("dataIndex","cash");put("title","现金");}});
			put("2", new HashMap<String,String>(){{	put("dataIndex","cheque");put("title","支票");}});
			put("3", new HashMap<String,String>(){{	put("dataIndex","creditCard");put("title","信用卡");}});
			put("4", new HashMap<String,String>(){{	put("dataIndex","debitCard");put("title","借记卡");}});
			put("5", new HashMap<String,String>(){{	put("dataIndex","draft");put("title","汇票");}});
			put("6", new HashMap<String,String>(){{	put("dataIndex","insureAccount");put("title","保险帐户");}});
			put("7", new HashMap<String,String>(){{	put("dataIndex","hospitalAccount");put("title","院内账户");}});
			put("8", new HashMap<String,String>(){{	put("dataIndex","aliPay");put("title","支付宝");}});
			put("9", new HashMap<String,String>(){{	put("dataIndex","wxPay");put("title","微信");}});

		}
	};
}
