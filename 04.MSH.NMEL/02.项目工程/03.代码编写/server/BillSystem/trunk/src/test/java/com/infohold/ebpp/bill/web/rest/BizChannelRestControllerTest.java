package com.infohold.ebpp.bill.web.rest;

import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLEncoder;
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
import com.infohold.core.utils.JSONUtils;
import com.infohold.ebpp.bill.ApplicationTests;
import com.infohold.ebpp.bill.model.BillCatalog;
import com.infohold.ebpp.bill.model.BillType;
import com.infohold.ebpp.bill.model.BizChannel;
import com.infohold.ebpp.bill.model.PayChannel;

/**
 * 业务渠道测试
 * @author Administrator
 *
 */
@FixMethodOrder(value=MethodSorters.NAME_ASCENDING)
//@Ignore
public class BizChannelRestControllerTest extends ApplicationTests {

	private String url = "http://localhost:8080/bill/bizchannel";
//	private String url = "http://36.48.69.70:8081/ebm/bill/bizchannel";

	RestTemplate template = new TestRestTemplate();
	
	@Test
	@Ignore
	public void initDict(){
		//初始化字典用
		
//		{//初始化渠道
//			BizChannel bc = new BizChannel();
//			bc.setCode("qd0001");
//			bc.setName("qd0001");
//			bc.setMemo("");
//			bc.setType("01");
//			bc.setStatus("02");
//			System.out.println("发送渠道：" + JSONUtils.serialize(bc, SerializerFeature.PrettyFormat));
//			String result = template.postForObject(url + "/create", bc, String.class);
//			System.out.println("接收渠道：" + result);
//		}
//		
//		{//初始化支付渠道
//			PayChannel pc = new PayChannel();
//			pc.setCode("zf0001");
//			pc.setName("zf0001");
//			pc.setMemo("");
//			pc.setBizChannel("qd0001");//所属渠道
//			System.out.println("发送支付渠道：" + JSONUtils.serialize(pc, SerializerFeature.PrettyFormat));
//			String result = template.postForObject("http://localhost:8080/bill/paychannel/create", pc, String.class);
//			System.out.println("接收支付渠道：" + result);
//		}
		
		{//初始化账单类别
			BillCatalog bc = new BillCatalog();
			bc.setCode("lb0001");
			bc.setName("lb0001");
			bc.setMemo("");
			bc.setParent(null);
			System.out.println("发送账单类别：" + JSONUtils.serialize(bc, SerializerFeature.PrettyFormat));
			String result = template.postForObject("http://localhost:8080/bill/billcatalog/create", bc, String.class);
			System.out.println("接收账单类别：" + result);
		}
		
		{//初始化账单类型
			BillType bt = new BillType();
			bt.setCode("lx0001");
			bt.setName("lx0001");
			bt.setMemo("");
			bt.setCatalog("lb0001");//所属类别
			bt.setBizChannel("qd0001");//所属渠道
			System.out.println("发送账单类型：" + JSONUtils.serialize(bt, SerializerFeature.PrettyFormat));
			String result = template.postForObject("http://localhost:8080/bill/type/create", bt, String.class);
			System.out.println("接收账单类型：" + result);
		}
	}
	

	@Test
	@Ignore
	public void t1testCreate() {
		try {
			log.info("create测试开始");
			BizChannel bc = new BizChannel();
			bc.setCode("a00001");
			bc.setName("test");
			bc.setMemo("");
			bc.setType("01");
			bc.setStatus("02");
//			System.out.println("发送：" + JSONUtils.serialize(bc, SerializerFeature.PrettyFormat));
			String result = template.postForObject(url + "/create", bc, String.class);
			System.out.println("接收：" + result);
			org.junit.Assert.assertNotNull(result);
			org.junit.Assert.assertThat(result, org.hamcrest.Matchers.containsString("test"));

			log.info("create测试结束");
		} catch (RestClientException e) {
			e.printStackTrace();
			throw e;
		}
		
		/*
		2016-05-26 09:34:33.526  INFO   --- [           main] c.i.e.b.w.r.BizChannelRestControllerTest : 测试开始
		发送：{
			"code":"000001",
			"memo":"",
			"name":"test",
			"new":false,
			"status":"02",
			"type":"01"
		}
		接收：{"success":true,"result":{"code":"000001","name":"test","memo":"","type":"01","status":"01","registedOn":"2016-05-26"},"msg":null}
		2016-05-26 09:34:35.248  INFO   --- [           main] c.i.e.b.w.r.BizChannelRestControllerTest : 测试结束
		
		
		
		2016-05-26 10:19:50.133  INFO   --- [           main] c.i.e.b.w.r.BizChannelRestControllerTest : 测试开始
		发送：{
			"code":"000001",
			"memo":"",
			"name":"test",
			"new":false,
			"status":"02",
			"type":"01"
		}
		接收：
		com.infohold.core.exception.BaseException: 该业务渠道号已存在！
		*/
	}

	@Test
	@Ignore
	public void t2testInfo() {
		try {
			log.info("getSingle测试开始");

			String code = "a00001";
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
		
		2016-05-26 10:43:58.111  INFO   --- [           main] c.i.e.b.w.r.BizChannelRestControllerTest : getSingle测试开始
		发送：http://localhost:8080/bill/bizchannel/000001
		接收：{"success":true,"result":{"code":"000001","name":"test","memo":"","type":"01","status":"01","registedOn":"2016-05-26"},"msg":null}
		2016-05-26 10:43:58.195  INFO   --- [           main] c.i.e.b.w.r.BizChannelRestControllerTest : getSingle测试结束
		
		*/
	}
	
	@Test
	@Ignore
	public void t3testUpdate() throws URISyntaxException {
		log.info("update测试开始");

		BizChannel bc = new BizChannel();
		bc.setCode("000001");
		bc.setName("test2");
		bc.setMemo("xxxxx");
		bc.setType("02");
		bc.setStatus(BizChannel.STATUS_UNUSED);
		
		System.out.println("发送：" + JSONUtils.serialize(bc, SerializerFeature.PrettyFormat));

		RequestEntity<BizChannel> request = RequestEntity.put(new URI(url + "/" + bc.getCode())).accept(MediaType.APPLICATION_JSON).body(bc);
		ResponseEntity<String> response = template.exchange(request, String.class);
		String bc2 = response.getBody();
		System.out.println("接收：" + format(bc2));
		
		org.junit.Assert.assertNotNull(bc2);
		org.junit.Assert.assertThat(bc2.toString(), org.hamcrest.Matchers.containsString("xxxx"));

		log.info("update测试结束");
		
		/*	
		2016-05-26 14:57:10.899  INFO   --- [           main] c.i.e.b.w.r.BizChannelRestControllerTest : update测试开始
		发送：{
			"code":"000001",
			"memo":"xxxxx",
			"name":"test2",
			"new":false,
			"status":"02",
			"type":"02"
		}
		接收：{
			"success":true,
			"result":{
				"code":"000001",
				"name":"test2",
				"memo":"xxxxx",
				"type":"01",
				"status":"01",
				"registedOn":"2016-05-26"
			},
			"msg":null
		}
		2016-05-26 14:57:11.250  INFO   --- [           main] c.i.e.b.w.r.BizChannelRestControllerTest : update测试结束
		*/
	}

	@Test
	@Ignore
	public void t4testQuery() throws UnsupportedEncodingException {
		log.info("getPage测试开始");

		int start = 0;
		int pageSize = 2;

		Map<String, Object> urlVariables = new HashMap<String, Object>();
		urlVariables.put("data", "{name:'a'}");
		System.out.println("发送：" + url + "/list/" + start + "/" + pageSize+"?data="+URLEncoder.encode("{name:'a'}", "UTF-8"));
		String result = template.getForObject(url + "/list/" + start + "/" + pageSize+"?data={data}", String.class, urlVariables);
		System.out.println("接收：" + format(result));
		org.junit.Assert.assertNotNull(result);
//		log.info("执行结果为：" + result);
		org.junit.Assert.assertThat(result, org.hamcrest.Matchers.containsString("total"));

		log.info("getPage测试结束");
		
		/*
		2016-05-27 09:50:04.661  INFO   --- [           main] c.i.e.b.w.r.BizChannelRestControllerTest : getPage测试开始
		发送：http://localhost.:8080/bill/bizchannel/list/0/2?data=%7Bname%3A%27a%27%7D
		接收：{
			"start":0,
			"pageSize":2,
			"totalPage":0,
			"total":0,
			"result":null
		}
		2016-05-27 09:50:04.773  INFO   --- [           main] c.i.e.b.w.r.BizChannelRestControllerTest : getPage测试结束
		*/
		
	}
	
	@Test
	@Ignore
	public void t5testUnregister() throws URISyntaxException {
		log.info("delete测试开始");

		String code = "000001";
		System.out.println("发送：" + url + "/"+code);
//		template.delete(url + "/"+code);
		
		RequestEntity<Void> request = RequestEntity.delete(new URI(url + "/" + code)).accept(MediaType.APPLICATION_JSON).build();
		ResponseEntity<String> response = template.exchange(request, String.class);
		String result = response.getBody();
		System.out.println("接收：" + format(result));
		
//		org.junit.Assert.assertNotNull(result);
//		log.info("执行结果为：" + result);
//		org.junit.Assert.assertThat(result, org.hamcrest.Matchers.containsString("total"));

		log.info("delete测试结束");
		
		/*
		2016-05-26 15:35:51.627  INFO   --- [           main] c.i.e.b.w.r.BizChannelRestControllerTest : delete测试开始
		发送：http://localhost:8080/bill/bizchannel/000001
		接收：{
			"success":true,
			"result":{
				"code":"000001",
				"name":"test2",
				"memo":"xxxxx",
				"type":"01",
				"status":"00",
				"registedOn":"2016-05-26"
			},
			"msg":null
		}
		2016-05-26 15:35:51.832  INFO   --- [           main] c.i.e.b.w.r.BizChannelRestControllerTest : delete测试结束
		*/
	}
	
}
