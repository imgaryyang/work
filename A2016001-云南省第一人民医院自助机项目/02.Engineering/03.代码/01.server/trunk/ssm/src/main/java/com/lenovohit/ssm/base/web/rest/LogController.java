package com.lenovohit.ssm.base.web.rest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ssm/base/log")
public class LogController {

	@RequestMapping("/writelog")
	public Object writeLog() {
		System.out.println("This is logger message");
		return "OK";
	}
}
