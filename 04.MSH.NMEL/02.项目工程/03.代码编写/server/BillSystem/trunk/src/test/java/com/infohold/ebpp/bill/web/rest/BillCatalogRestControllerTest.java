package com.infohold.ebpp.bill.web.rest;

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
import com.infohold.core.utils.JSONUtils;
import com.infohold.ebpp.bill.ApplicationTests;
import com.infohold.ebpp.bill.model.BillCatalog;
import com.infohold.ebpp.bill.model.BizChannel;
import com.infohold.ebpp.bill.model.PayChannel;
/**
 * 账单类别测试
 * @author Administrator
 *
 */
public class BillCatalogRestControllerTest extends ApplicationTests {

	private String url = "http://localhost:8080/bill/billcatalog";

	RestTemplate template = new TestRestTemplate();

	@Test
//	@Ignore
	public void testCreate() {
		log.info("create测试开始");
		String s = "";
		//s = "{code:'cl0001',name:'cltest1'}";//parent
		s = "{code:'cl0002',name:'cltest2', parent:'cl0001'}";//child
		System.out.println("发送：" + s);
		
		String result = template.postForObject(url + "/create", s, String.class);
		
		org.junit.Assert.assertNotNull(result);
		System.out.println("接收：" + format(result));
		log.info("执行结果为："+result);
		org.junit.Assert.assertThat(result, org.hamcrest.Matchers.containsString("test"));

		log.info("create测试结束");
		
		/*
		2016-05-27 11:16:13.953  INFO   --- [           main] .i.e.b.w.r.BillCatalogRestControllerTest : create测试开始
		发送：{code:'cl00001',name:'cltest1'}
		接收：{
			"success":true,
			"result":{
				"code":"cl00001",
				"name":"cltest1",
				"parent":null,
				"createdOn":"2016-05-27"
			},
			"msg":null
		}
		2016-05-27 11:16:14.373  INFO   --- [           main] .i.e.b.w.r.BillCatalogRestControllerTest : 执行结果为：{"success":true,"result":{"code":"cl00001","name":"cltest1","parent":null,"createdOn":"2016-05-27"},"msg":null}
		2016-05-27 11:16:14.383  INFO   --- [           main] .i.e.b.w.r.BillCatalogRestControllerTest : create测试结束

		*/
		
	}

	@Test
	@Ignore
	public void testInfo() {
		log.info("getSingle测试开始");

		String code = "cl00001";
		System.out.println("发送：" + url + "/" + code);
		String result = template.getForObject(url + "/" + code, String.class);

		org.junit.Assert.assertNotNull(result);
//		log.info("执行结果为：" + result);
		System.out.println("接收：" + result);
		org.junit.Assert.assertThat(result, org.hamcrest.Matchers.containsString("test"));

		log.info("getSingle测试结束");
		/*
		2016-05-27 11:23:32.849  INFO   --- [           main] .i.e.b.w.r.BillCatalogRestControllerTest : getSingle测试开始
		发送：http://localhost:8080/bill/billcatalog/cl00001
		接收：{"success":true,"result":{"code":"cl00001","name":"cltest1","parent":null,"createdOn":"2016-05-27"},"msg":null}
		2016-05-27 11:23:32.966  INFO   --- [           main] .i.e.b.w.r.BillCatalogRestControllerTest : getSingle测试结束
		*/
	}

	@Test
	@Ignore
	public void testUpdate() throws URISyntaxException {
		log.info("update测试开始");

		BillCatalog bc = new BillCatalog();
		bc.setCode("cl00001");
		bc.setName("cltest11");
		
		System.out.println("发送：" + JSONUtils.serialize(bc, SerializerFeature.PrettyFormat));
		
		RequestEntity<BillCatalog> request = RequestEntity.put(new URI(url + "/update")).accept(MediaType.APPLICATION_JSON).body(bc);
		ResponseEntity<String> response = template.exchange(request, String.class);
		String bc2 = response.getBody();
		System.out.println("接收：" + format(bc2));

		org.junit.Assert.assertNotNull(bc2);
		org.junit.Assert.assertThat(bc2.toString(), org.hamcrest.Matchers.containsString("cltest11"));

		log.info("update测试结束");
		
		/*
		2016-05-27 11:30:53.587  INFO   --- [           main] .i.e.b.w.r.BillCatalogRestControllerTest : update测试开始
		发送：{
			"code":"cl00001",
			"name":"cltest11",
			"new":false
		}
		接收：{
			"success":true,
			"result":{
				"code":"cl00001",
				"name":"cltest11",
				"parent":null,
				"createdOn":"2016-05-27"
			},
			"msg":null
		}
		2016-05-27 11:30:54.057  INFO   --- [           main] .i.e.b.w.r.BillCatalogRestControllerTest : update测试结束
		*/
		
	}

	@Test
	@Ignore
	public void testQuery() {
		log.info("getPage测试开始");

		Map<String, Object> urlVariables = new HashMap<String, Object>();
		urlVariables.put("data", "{name:'aa',start:0, pageSize:2}");
		System.out.println("发送：" + url + "/query?data={name:'aa',start:0, pageSize:2}");
		String result = template.getForObject(url + "/query?data={data}", String.class, urlVariables);
		System.out.println("接收：" + format(result));
		org.junit.Assert.assertNotNull(result);
//		log.info("执行结果为：" + result);
		org.junit.Assert.assertThat(result, org.hamcrest.Matchers.containsString("total"));

		log.info("getPage测试结束");
		/*
		2016-05-27 13:11:33.903  INFO   --- [           main] .i.e.b.w.r.BillCatalogRestControllerTest : getPage测试开始
		发送：http://localhost:8080/bill/billcatalog/query?data={name:'aa',start:0, pageSize:2}
		接收：{
			"start":0,
			"pageSize":2,
			"totalPage":0,
			"total":0,
			"result":null
		}
		2016-05-27 13:11:34.029  INFO   --- [           main] .i.e.b.w.r.BillCatalogRestControllerTest : getPage测试结束
		*/
		
	}
	
	@Test
	@Ignore
	public void testUnregister() {
		log.info("测试开始");
		//此接口停用了！
		String code = "000001";
		template.delete(url + "/"+code);
//		org.junit.Assert.assertNotNull(result);
//		log.info("执行结果为：" + result);
//		org.junit.Assert.assertThat(result, org.hamcrest.Matchers.containsString("total"));

		log.info("测试结束");
	}
}
