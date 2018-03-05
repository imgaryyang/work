package com.lenovohit.hcp.base.utils;

import java.lang.reflect.Method;

import com.lenovohit.hcp.appointment.model.RegInfo;
import com.lenovohit.hcp.finance.model.AccountItemStatisticsDto;
import com.lenovohit.hcp.finance.model.InvoiceInfo;
import com.lenovohit.hcp.finance.model.InvoiceInfoDetail;
import com.lenovohit.hcp.finance.model.OutpatientChargeDetail;
import com.lenovohit.hcp.finance.model.PayWay;

/**
 * 反射小工具
 * @description
 * @author jatesun
 * @version 1.0.0
 * @date 2017年4月22日
 */
public class ReflectModelUtils {
	public static void main(String[] args) {
		ReflectModelUtils.reflect("sumDto", AccountItemStatisticsDto.class);
	}

	public static void reflect(String start, Class clazz) {
		Method[] methods = clazz.getMethods();
		for (Method m : methods) {
			String name = m.getName();
			if (name.startsWith("get")) {
				System.out.println(start + "." + name + "(\"\");");
			}
		}
	}
}
