package com.test;

import org.springframework.beans.factory.annotation.Autowired;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.ssm.app.elh.base.model.AppDepartment;

public class TestController {
	@Autowired
	private static GenericManager<AppDepartment, String> appDepartmentManager;
	public static void main(String[] args) {
		System.out.println(appDepartmentManager);
	}
}
