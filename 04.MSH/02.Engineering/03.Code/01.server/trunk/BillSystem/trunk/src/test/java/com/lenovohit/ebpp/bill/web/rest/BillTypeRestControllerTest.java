package com.lenovohit.ebpp.bill.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;

import org.junit.Ignore;
import org.junit.Test;
import org.springframework.boot.test.TestRestTemplate;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import com.alibaba.fastjson.serializer.SerializerFeature;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.ebpp.bill.ApplicationTests;
import com.lenovohit.ebpp.bill.model.BillType;

/**
 * 账单类型测试
 * @author Administrator
 *
 */
public class BillTypeRestControllerTest extends ApplicationTests {

	private String url = "http://localhost:8080/bill/type";

	RestTemplate template = new TestRestTemplate();

	@Test
//	@Ignore
	public void testCreate() {
		log.info("create测试开始");
		String param1 = "{code:'ty0001',name:'tytest01', catalog:'cl0001', bizChannel:'a00001'}";
//		String param2 = "{code:'ty0002',name:'tytest02', catalog:'cl0001', bizChannel:'a00001', }";
		System.out.println("发送：" + param1);

		String result = template.postForObject(url + "/create", param1, String.class);
		
		System.out.println("接收：" + format(result));
		org.junit.Assert.assertNotNull(result);
		org.junit.Assert.assertThat(result, org.hamcrest.Matchers.containsString("test"));

		log.info("create测试结束");
		
		/*
		2016-05-27 13:47:26.047  INFO   --- [           main] c.i.e.b.w.r.BillTypeRestControllerTest   : create测试开始
		发送：{code:'ty0002',name:'tytest02', catalog:'cl00001', bizChannel:'000001'}
		接收：{
			"success":true,
			"result":{
				"code":"ty0002",
				"name":"tytest02",
				"memo":null,
				"catalog":"cl00001",
				"bizChannel":"000001",
				"status":"01",
				"regeditedOn":"2016-05-27"
			},
			"msg":null
		}
		2016-05-27 13:47:26.353  INFO   --- [           main] c.i.e.b.w.r.BillTypeRestControllerTest   : create测试结束
		*/
	}

	@Test
	@Ignore
	public void testInfo() {
		log.info("getSingle测试开始");

		String code = "ty0002";
		System.out.println("发送：" + url + "/" + code);
		String result = template.getForObject(url + "/" + code, String.class);
		
		System.out.println("接收：" + result);

		org.junit.Assert.assertNotNull(result);
//		log.info("执行结果为：" + result);
		org.junit.Assert.assertThat(result, org.hamcrest.Matchers.containsString("test"));

		log.info("getSingle测试结束");
		
		/*
		2016-05-27 13:49:10.949  INFO   --- [           main] c.i.e.b.w.r.BillTypeRestControllerTest   : getSingle测试开始
		发送：http://localhost:8080/bill/type/ty0002
		接收：{"success":true,"result":{"code":"ty0002","name":"tytest02","memo":null,"catalog":"cl00001","bizChannel":"000001","status":"01","regeditedOn":"2016-05-27"},"msg":null}
		2016-05-27 13:49:11.071  INFO   --- [           main] c.i.e.b.w.r.BillTypeRestControllerTest   : getSingle测试结束
		*/
	}

	@Test
	@Ignore
	public void testUpdate() throws URISyntaxException {
		log.info("update测试开始");

		BillType bt = new BillType();
		bt.setCode("ty0001");
		bt.setName("tytest011");
		bt.setMemo("xxxxx");
		bt.setCatalog("cl00001");
		bt.setBizChannel("000001");
		
		System.out.println("发送：" + JSONUtils.serialize(bt, SerializerFeature.PrettyFormat));
		
		RequestEntity<BillType> request = RequestEntity.put(new URI(url + "/update")).accept(MediaType.APPLICATION_JSON).body(bt);
		ResponseEntity<String> response = template.exchange(request, String.class);
		String bc2 = response.getBody();
		System.out.println("接收：" + format(bc2));

		org.junit.Assert.assertNotNull(bc2);
		org.junit.Assert.assertThat(bc2.toString(), org.hamcrest.Matchers.containsString("xxxxx"));

		log.info("update测试结束");
		
		/*
		2016-05-27 16:55:40.958  INFO   --- [           main] c.i.e.b.w.r.BillTypeRestControllerTest   : update测试开始
		发送：{
			"bizChannel":"000001",
			"catalog":"cl00001",
			"code":"ty0001",
			"memo":"xxxxx",
			"name":"tytest011",
			"new":false
		}
		接收：{
			"success":true,
			"result":{
				"code":"ty0001",
				"name":"tytest011",
				"memo":"xxxxx",
				"catalog":"cl00001",
				"bizChannel":"000001",
				"status":"01",
				"regeditedOn":"2016-05-27"
			},
			"msg":null
		}
		2016-05-27 16:55:42.075  INFO   --- [           main] c.i.e.b.w.r.BillTypeRestControllerTest   : update测试结束
		*/
		
	}

	@Test
	@Ignore
	public void testQuery() {
		log.info("getPage测试开始");

		Map<String, Object> urlVariables = new HashMap<String, Object>();
		urlVariables.put("data", "{name:'test', start:0, pageSize:2}");
		
		System.out.println("发送：" + url + "/query?data={name:'test', start:0, pageSize:2}");
		String result = template.getForObject(url + "/query?data={data}", String.class, urlVariables);
		System.out.println("接收：" + format(result));
		
		org.junit.Assert.assertNotNull(result);
//		log.info("执行结果为：" + result);
		org.junit.Assert.assertThat(result, org.hamcrest.Matchers.containsString("total"));

		log.info("getPage测试结束");
		
		/*
		2016-05-27 16:59:51.433  INFO   --- [           main] c.i.e.b.w.r.BillTypeRestControllerTest   : getPage测试开始
		发送：http://localhost:8080/bill/type/query?data={name:'test', start:0, pageSize:2}
		接收：{
			"start":0,
			"pageSize":2,
			"totalPage":1,
			"total":2,
			"result":[
				{
					"code":"ty0001",
					"name":"tytest011",
					"memo":"xxxxx",
					"catalog":"cl00001",
					"bizChannel":"000001",
					"status":"01",
					"regeditedOn":"2016-05-27"
				},
				{
					"code":"ty0002",
					"name":"tytest02",
					"memo":null,
					"catalog":"cl00001",
					"bizChannel":"000001",
					"status":"01",
					"regeditedOn":"2016-05-27"
				}
			]
		}
		2016-05-27 16:59:51.695  INFO   --- [           main] c.i.e.b.w.r.BillTypeRestControllerTest   : getPage测试结束
		*/
	}
	
	@Test
	@Ignore
	public void testUnregister() throws URISyntaxException {
		log.info("delete测试开始");

		String code = "ty0001";
		System.out.println("发送：" + url + "/"+code);
		
		RequestEntity<Void> request = RequestEntity.delete(new URI(url + "/" + code)).accept(MediaType.APPLICATION_JSON).build();
		ResponseEntity<String> response = template.exchange(request, String.class);
		String result = response.getBody();
		
		System.out.println("接收：" + format(result));
		
		log.info("delete测试结束");
		/*
		2016-05-27 17:02:56.522  INFO   --- [           main] c.i.e.b.w.r.BillTypeRestControllerTest   : delete测试开始
		发送：http://localhost:8080/bill/type/ty0001
		接收：{
			"success":true,
			"result":{
				"code":"ty0001",
				"name":"tytest011",
				"memo":"xxxxx",
				"catalog":"cl00001",
				"bizChannel":"000001",
				"status":"00",
				"regeditedOn":"2016-05-27"
			},
			"msg":null
		}
		2016-05-27 17:02:56.746  INFO   --- [           main] c.i.e.b.w.r.BillTypeRestControllerTest   : delete测试结束
		*/
	}
}
