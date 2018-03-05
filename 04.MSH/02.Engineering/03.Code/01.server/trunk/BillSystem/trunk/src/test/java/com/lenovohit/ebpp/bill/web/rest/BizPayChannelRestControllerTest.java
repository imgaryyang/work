package com.lenovohit.ebpp.bill.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;

import org.junit.FixMethodOrder;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runners.MethodSorters;
import org.springframework.boot.test.TestRestTemplate;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.alibaba.fastjson.serializer.SerializerFeature;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.ebpp.bill.ApplicationTests;
import com.lenovohit.ebpp.bill.model.PayChannel;

/**
 * 支付渠道测试
 * @author Administrator
 *
 */
@FixMethodOrder(value=MethodSorters.NAME_ASCENDING)
//@Ignore
public class BizPayChannelRestControllerTest extends ApplicationTests {

	private String url = "http://localhost:8080/bill/paychannel";

	RestTemplate template = new TestRestTemplate();
	
	

	@Test
//	@Ignore
	public void t1testCreate() {
		try {
			log.info("create测试开始");
			PayChannel pc = new PayChannel();
			pc.setCode("pc0001");
			pc.setName("支付渠道test");
			pc.setMemo("");
			pc.setBizChannel("a00001");
			System.out.println("发送：" + JSONUtils.serialize(pc, SerializerFeature.PrettyFormat));
			String result = template.postForObject(url + "/create", pc, String.class);
			System.out.println("接收：" + result);
			org.junit.Assert.assertNotNull(result);
			org.junit.Assert.assertThat(result, org.hamcrest.Matchers.containsString("pc0001"));

			log.info("create测试结束");
		} catch (RestClientException e) {
			e.printStackTrace();
			throw e;
		}
		
		/*
		2016-05-26 16:05:01.680  INFO   --- [           main] .e.b.w.r.BizPayChannelRestControllerTest : create测试开始
		发送：{
			"bizChannel":"000001",
			"code":"pc0001",
			"memo":"",
			"name":"支付渠道test",
			"new":false
		}
		接收：{"success":true,"result":{"code":"pc0001","name":"支付渠道test","memo":"","status":"01","bizChannel":"000001","createdOn":"2016-05-26"},"msg":null}
		2016-05-26 16:05:02.165  INFO   --- [           main] .e.b.w.r.BizPayChannelRestControllerTest : create测试结束

		
		
		
		2016-05-26 16:05:41.162  INFO   --- [           main] .e.b.w.r.BizPayChannelRestControllerTest : create测试开始
		发送：{
			"bizChannel":"000001",
			"code":"pc0001",
			"memo":"",
			"name":"支付渠道test",
			"new":false
		}
		接收：
		com.lenovohit.core.exception.BaseException: 该支付渠道号已存在！
		*/
	}

	@Test
	@Ignore
	public void t2testInfo() {
		try {
			log.info("getSingle测试开始");

			String code = "pc0001";
			System.out.println("发送：" + url + "/" + code);
			String result = template.getForObject(url + "/" + code, String.class);

			org.junit.Assert.assertNotNull(result);
			
			System.out.println("接收：" + result);
			org.junit.Assert.assertThat(result, org.hamcrest.Matchers.containsString("test"));

			log.info("getSingle测试结束");
		} catch (RestClientException e) {
			e.printStackTrace();
			throw e;
		}
		/*
		2016-05-26 16:08:02.927  INFO   --- [           main] .e.b.w.r.BizPayChannelRestControllerTest : getSingle测试开始
		发送：http://localhost:8080/bill/paychannel/pc0001
		接收：{"success":true,"result":{"code":"pc0001","name":"支付渠道test","memo":"","status":"01","bizChannel":"000001","createdOn":"2016-05-26"},"msg":null}
		2016-05-26 16:08:03.012  INFO   --- [           main] .e.b.w.r.BizPayChannelRestControllerTest : getSingle测试结束
		*/
	}
	
	@Test
	@Ignore
	public void t3testUpdate() throws URISyntaxException {
		log.info("update测试开始");

		PayChannel pc = new PayChannel();
		pc.setCode("pc0001");
		pc.setName("支付渠道test2");
		pc.setMemo("mmm");
		pc.setBizChannel("000001");
		pc.setStatus(PayChannel.STATUS_UNUSED);
		
		System.out.println("发送：" + JSONUtils.serialize(pc, SerializerFeature.PrettyFormat));

		RequestEntity<PayChannel> request = RequestEntity.put(new URI(url + "/" + pc.getCode())).accept(MediaType.APPLICATION_JSON).body(pc);
		ResponseEntity<String> response = template.exchange(request, String.class);
		String pc2 = response.getBody();
		System.out.println("接收：" + format(pc2));
		
		org.junit.Assert.assertNotNull(pc2);
		org.junit.Assert.assertThat(pc2.toString(), org.hamcrest.Matchers.containsString("支付渠道test2"));

		log.info("update测试结束");
		
		/*	
		2016-05-26 16:12:47.307  INFO   --- [           main] .e.b.w.r.BizPayChannelRestControllerTest : update测试开始
		发送：{
			"bizChannel":"000001",
			"code":"pc0001",
			"memo":"mmm",
			"name":"支付渠道test2",
			"new":false,
			"status":"02"
		}
		接收：{
			"success":true,
			"result":{
				"code":"pc0001",
				"name":"支付渠道test2",
				"memo":"mmm",
				"status":"02",
				"bizChannel":"000001",
				"createdOn":"2016-05-26"
			},
			"msg":null
		}
		2016-05-26 16:12:47.669  INFO   --- [           main] .e.b.w.r.BizPayChannelRestControllerTest : update测试结束
		*/
	}

	@Test
	@Ignore
	public void t4testQuery() {
		log.info("getPage测试开始");

		int start = 0;
		int pageSize = 2;

		Map<String, Object> urlVariables = new HashMap<String, Object>();
		urlVariables.put("data", "{name:'支付渠道test3'}");
		System.out.println("发送：" + url + "/query?data={name:'支付渠道test3'}");
		String result = template.getForObject(url + "/query?data={data}", String.class, urlVariables);
		System.out.println("接收：" + format(result));
		org.junit.Assert.assertNotNull(result);
//		log.info("执行结果为：" + result);
		org.junit.Assert.assertThat(result, org.hamcrest.Matchers.containsString("total"));

		log.info("getPage测试结束");
		
		/*
		2016-05-27 11:05:59.744  INFO   --- [           main] .e.b.w.r.BizPayChannelRestControllerTest : getPage测试开始
		发送：http://localhost:8080/bill/paychannel/query?data={name:'支付渠道test2'}
		接收：{
			"start":0,
			"pageSize":20,
			"totalPage":0,
			"total":0,
			"result":null
		}
		2016-05-27 11:05:59.847  INFO   --- [           main] .e.b.w.r.BizPayChannelRestControllerTest : getPage测试结束
		*/
		
	}
	
	@Test
	@Ignore
	public void t5testUnregister() throws URISyntaxException {
		log.info("delete测试开始");

		String code = "pc0001";
		System.out.println("发送：" + url + "/"+code);
		RequestEntity<Void> request = RequestEntity.delete(new URI(url + "/" + code)).accept(MediaType.APPLICATION_JSON).build();
		ResponseEntity<String> response = template.exchange(request, String.class);
		String result = response.getBody();
		System.out.println("接收：" + format(result));
		log.info("delete测试结束");
		
		/*
		2016-05-27 11:08:48.260  INFO   --- [           main] .e.b.w.r.BizPayChannelRestControllerTest : delete测试开始
		发送：http://localhost:8080/bill/paychannel/pc0001
		接收：{
			"success":true,
			"result":{
				"code":"pc0001",
				"name":"支付渠道test2",
				"memo":"mmm",
				"status":"00",
				"bizChannel":"000001",
				"createdOn":"2016-05-26"
			},
			"msg":null
		}
		2016-05-27 11:08:48.506  INFO   --- [           main] .e.b.w.r.BizPayChannelRestControllerTest : delete测试结束
		*/
	}
	
}
