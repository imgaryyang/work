package com.lenovohit.hcp.payment.utils;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.atomic.AtomicInteger;

public class SequenceUtils {
	private static AtomicInteger count = new AtomicInteger();

	public static String getOrderSeq(String prefix) {
		return getSeq(prefix);
	}

	public static String getSettleSeq(String prefix) {
		return getSeq(prefix);
	}

	private synchronized static String getSeq(String prefix) {
		Date date = new Date();
		SimpleDateFormat format = new SimpleDateFormat("yyMMdd");
		String sdate = format.format(date);
		// 2 + 6 + 8 = 16
		String settleNo = prefix + sdate + getEightCode();
		return settleNo;
	}

	private static String getEightCode() {
		String now = String.valueOf(count.getAndIncrement());
		if (now.length() > 8) {
			count.set(0);
			now = String.valueOf(count.getAndIncrement());
		}
		int toAdd = 8 - now.length();
		StringBuilder sb = new StringBuilder();
		for (int i = 0; i < toAdd; i++) {
			sb.append("0");
		}
		sb.append(now);
		return sb.toString();
	}
}
