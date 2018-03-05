package com.infohold.ebpp.bill.web.rest;

import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
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
import com.infohold.core.utils.DateUtils;
import com.infohold.core.utils.JSONUtils;
import com.infohold.ebpp.bill.ApplicationTests;
import com.infohold.ebpp.bill.model.BillInstance;
import com.infohold.ebpp.bill.model.PayInfo;

/**
 * 账单处理测试
 * @author Administrator
 *
 */
@FixMethodOrder(value=MethodSorters.NAME_ASCENDING)
//@Ignore
public class BillInstanceRestControllerTest extends ApplicationTests {

	private String url = "http://localhost:8080/bill/instance";

	RestTemplate template = new TestRestTemplate();
	
	private BillInstance createBill(){
		BillInstance bi = new BillInstance();
		bi.setOriBizNo("PAY2016062900000001");//业务单号OriBizNo
		bi.setOldOriBizNo("");//原业务单号OldOriBizNo
		bi.setType("lx0001");//账单类型编码Type  外键
		bi.setFlag("1");//启用标志Flag
		bi.setStatus("01");//状态Status
		bi.setMemo("xxxx");//备注Memo
		bi.setCcy("001");//币种Ccy
		bi.setAmt(22.6f);//金额Amt
		bi.setBizChannel("qd0001");//业务渠道号BizChannel  外键
		bi.setPayeeCode("fkr001");//付款人编号PayeeCode
		bi.setPayeeName("张三");//付款人名称PayeeName
		bi.setPayeeAcctNo("fkrzh001");//付款人账号PayeeAcctNo
		bi.setPayerCode("skr001");//收款人编号PayerCode
		bi.setPayerName("李四");//收款人名称PayerName
		bi.setPayerAcctNo("skrzh001");//收款人账号PayerAcctNo
//		bi.setTransTime(DateUtils.date2String(new Date(), "yyyy-MM-dd"));
		bi.setTransTime(DateUtils.date2String(new Date(), "yyyy-MM-dd HH:mm:ss"));
		return bi;
	}
	
	@Test
	@Ignore
	public void generateBillEndDay(){
		BillInstance bi = createBill();
		List<String> list = new ArrayList<String>();
		
		list.add(bi.getOriBizNo());//业务单号OriBizNo
		list.add(bi.getOldOriBizNo());//原业务单号OldOriBizNo
		list.add(bi.getType());//账单类型编码Type  外键
		list.add(bi.getFlag());//启用标志Flag
		list.add(bi.getStatus());//状态Status
		list.add(bi.getMemo());//备注Memo
		list.add(bi.getCcy());//币种Ccy
		list.add(bi.getAmt()+"");//金额Amt
		list.add(bi.getBizChannel());//业务渠道号BizChannel  外键
		list.add(bi.getPayeeCode());//付款人编号PayeeCode
		list.add(bi.getPayeeName());//付款人名称PayeeName
		list.add(bi.getPayeeAcctNo());//付款人账号PayeeAcctNo
		list.add(bi.getPayerCode());//收款人编号PayerCode
		list.add(bi.getPayerName());//收款人名称PayerName
		list.add(bi.getPayerAcctNo());//收款人账号PayerAcctNo
		list.add(bi.getTransTime());
		
		String s = "";
		for(String i: list){
			s = s + i + "|";
		}
		s = s.substring(0, s.length()-1);
		System.out.println(s);
	}
	
	

	@Test
	@Ignore
	public void t1testCreate() {
		try {
			log.info("create测试开始");
			BillInstance bi = createBill();
			System.out.println("发送：" + JSONUtils.serialize(bi, SerializerFeature.PrettyFormat));
			String result = template.postForObject(url + "/create", bi, String.class);
			System.out.println("接收：" + result);
			org.junit.Assert.assertNotNull(result);
//			org.junit.Assert.assertThat(result, org.hamcrest.Matchers.containsString("x00001"));

			log.info("create测试结束");
		} catch (RestClientException e) {
			e.printStackTrace();
			throw e;
		}
	}
	
	private String createPay(){
		PayInfo payMain = new PayInfo();
		payMain.setNo("BILL2016062900000001");//流水号no
		payMain.setOriBizNo("PAY2016062900000001");//业务单号oriBizNo
		payMain.setPayNo("ST16062900000001");//支付流水payNo
		payMain.setPayChannel("zf0001");//支付渠道payChannel
		payMain.setPayedTime(DateUtils.date2String(new Date(), "yyyy-MM-dd HH:mm:ss"));//支付时间payedTime
		payMain.setStatus("12");//状态status
		
		PayInfo pay1 = new PayInfo();
		pay1.setAmt(1.01f);//金额amt
		pay1.setWay("03");//支付方式way
		pay1.setQuantity(1);//使用数量quantity
		
		PayInfo pay2 = new PayInfo();
		pay2.setAmt(2.01f);//金额amt
		pay2.setWay("01");//支付方式way
		pay2.setQuantity(2);//使用数量quantity
		
		String s = "{"+
				"	no:'"+payMain.getNo()+"',"+
				"	oriBizNo:'"+payMain.getOriBizNo()+"',"+
				"	payNo:'"+payMain.getPayNo()+"',"+
				"	payChannel:'"+payMain.getPayChannel()+"',"+
				"	payedTime:'"+payMain.getPayedTime()+"',"+
				"	status:'"+payMain.getStatus()+"',"+
				"	payInfo:["+
				"		{"+
				"		amt:"+pay1.getAmt()+","+
				"		way:'"+pay1.getWay()+"',"+
				"		quantity:"+pay1.getQuantity()+
				"		},{"+
				"		amt:"+pay2.getAmt()+","+
				"		way:'"+pay2.getWay()+"',"+
				"		quantity:"+pay2.getQuantity()+
				"	}]"+
				"} ";
		
		{//打印日终文件
			List<String> list = new ArrayList<String>();
			//顺序：流水号|业务单号|支付流水|金额①|支付渠道|支付方式①|使用数量①|支付时间|状态
			
			list.add(payMain.getNo());//流水号no
			list.add(payMain.getOriBizNo());//业务单号oriBizNo
			list.add(payMain.getPayNo());//支付流水payNo
			list.add("amt");//金额amt
			list.add(payMain.getPayChannel());//支付渠道payChannel
			list.add("way");//支付方式way
			list.add("quantity");//使用数量quantity
			list.add(payMain.getPayedTime()+"");//支付时间payedTime
			list.add(payMain.getStatus());//状态status
			
			String s2 = "";
			for(String i: list){
				s2 = s2 + i + "|";
			}
			s2 = s2.substring(0, s2.length()-1);
			String info1 = s2.replace("amt", pay1.getAmt()+"").replace("way", pay1.getWay()).replace("quantity", pay1.getQuantity()+"");
			String info2 = s2.replace("amt", pay2.getAmt()+"").replace("way", pay2.getWay()).replace("quantity", pay2.getQuantity()+"");
			s2 = info1 + "\n" + info2;
			System.out.println(s2);
		}
		
		return s;
	}
	
	@Test
	@Ignore
	public void generatePayEndDay(){
		createPay();
	}
	
	@Test
	@Ignore
	public void testPayInfoload() {
		try {
			log.info("payInfoload测试开始");
			String s = createPay();
			System.out.println("发送：" + format(s));
			String result = template.postForObject(url + "/payInfo/load", s, String.class);
			System.out.println("接收：" + result);
			org.junit.Assert.assertNotNull(result);
			org.junit.Assert.assertThat(result, org.hamcrest.Matchers.containsString("success"));

			log.info("payInfoload测试结束");
		} catch (RestClientException e) {
			e.printStackTrace();
			throw e;
		}
	}
	
	// --------------------------------------------  分割线  ---------------------------------------------------

	@Test
	@Ignore
	public void t2testInfo() {
		try {
			log.info("getSingle测试开始");

			String no = "BILL2016060200000002";
			System.out.println("发送：" + url + "/" + no);
			String result = template.getForObject(url + "/" + no, String.class);

			org.junit.Assert.assertNotNull(result);
			
			System.out.println("接收：" + format(result));
			org.junit.Assert.assertThat(result, org.hamcrest.Matchers.containsString("BILL2016060200000002"));

			log.info("getSingle测试结束");
		} catch (RestClientException e) {
			e.printStackTrace();
			throw e;
		}
		/*
		2016-06-06 11:08:30.845  INFO   --- [           main] i.e.b.w.r.BillInstanceRestControllerTest : getSingle测试开始
		发送：http://localhost:8080/bill/instance/BILL2016060200000002
		接收：{
			"success":true,
			"result":{
				"id":"402880e6550fdc4301550fdde0100001",
				"no":"BILL2016060200000002",
				"oriBizNo":"PAY2016051800007656",
				"type":"ty0001",
				"flag":"1",
				"status":"01",
				"memo":"xxxx",
				"ccy":"001",
				"amt":22.6,
				"bizChannel":"a00001",
				"payeeCode":"abc",
				"payeeName":"张三",
				"payeeAcctNo":"0909098872387328",
				"payerCode":"def",
				"payerName":"李四",
				"payerAcctNo":"12321321321312",
				"transTime":"2016-06-02",
				"createdOn":"2016-06-02",
				"updatedOn":null,
				"finishedOn":null,
				"oldOriBizNo":null
			},
			"msg":null
		}
		2016-06-06 11:08:32.140  INFO   --- [           main] i.e.b.w.r.BillInstanceRestControllerTest : getSingle测试结束

		*/
	}
	
	@Test
	@Ignore
	public void t3testUpdate() throws URISyntaxException {
		log.info("update测试开始");

		BillInstance bi = new BillInstance();
//		bi.setId("8a81808154f0b1630154f17db0200000");
		bi.setNo("BILL2016060200000002");
		bi.setOriBizNo("PAY2016051800007656");
		bi.setOldOriBizNo("xxx");
		bi.setType("ty0001");
		bi.setMemo("xxx2");
		bi.setCcy("001");
		bi.setAmt(22.7f);
		bi.setBizChannel("a00001");
		bi.setPayeeCode("abc2");
		bi.setPayeeName("张三2");
		bi.setPayeeAcctNo("09090988723873282a");
		bi.setPayerCode("def2");
		bi.setPayerName("李四2");
		bi.setPayerAcctNo("12321321321312a");
		bi.setTransTime(DateUtils.date2String(new Date(), "yyyy-MM-dd"));
		
		System.out.println("发送：" + JSONUtils.serialize(bi, SerializerFeature.PrettyFormat));

		RequestEntity<BillInstance> request = RequestEntity.put(new URI(url + "/" + bi.getNo())).accept(MediaType.APPLICATION_JSON).body(bi);
		ResponseEntity<String> response = template.exchange(request, String.class);
		String bc2 = response.getBody();
		System.out.println("接收：" + format(bc2));
		
		org.junit.Assert.assertNotNull(bc2);
		org.junit.Assert.assertThat(bc2.toString(), org.hamcrest.Matchers.containsString("xxx2"));

		log.info("update测试结束");
		
		/*	
		2016-06-06 11:22:00.568  INFO   --- [           main] i.e.b.w.r.BillInstanceRestControllerTest : update测试开始
		发送：{
			"amt":22.7,
			"bizChannel":"a00001",
			"ccy":"001",
			"memo":"xxx2",
			"new":true,
			"no":"BILL2016060200000002",
			"oldOriBizNo":"xxx",
			"oriBizNo":"PAY2016051800007656",
			"payeeAcctNo":"09090988723873282a",
			"payeeCode":"abc2",
			"payeeName":"张三2",
			"payerAcctNo":"12321321321312a",
			"payerCode":"def2",
			"payerName":"李四2",
			"transTime":"2016-06-06",
			"type":"ty0001"
		}
		接收：{
			"success":true,
			"result":{
				"id":"402880e6550fdc4301550fdde0100001",
				"no":"BILL2016060200000002",
				"oriBizNo":"PAY2016051800007656",
				"type":"ty0001",
				"flag":"1",
				"status":"01",
				"memo":"xxx2",
				"ccy":"001",
				"amt":22.7,
				"bizChannel":"a00001",
				"payeeCode":"abc2",
				"payeeName":"张三2",
				"payeeAcctNo":"09090988723873282a",
				"payerCode":"def2",
				"payerName":"李四2",
				"payerAcctNo":"12321321321312a",
				"transTime":"2016-06-02",
				"createdOn":"2016-06-02",
				"updatedOn":null,
				"finishedOn":null,
				"oldOriBizNo":"xxx"
			},
			"msg":null
		}
		2016-06-06 11:22:00.910  INFO   --- [           main] i.e.b.w.r.BillInstanceRestControllerTest : update测试结束
		*/
	}

	@Test
	@Ignore
	public void t4testQuery() throws UnsupportedEncodingException {
		log.info("getPage测试开始");

		Map<String, Object> urlVariables = new HashMap<String, Object>();
		urlVariables.put("data", "{oriBizNo:'a', start:0, pageSize:20 }");
		System.out.println("发送：" + url + "/query?data={oriBizNo:'a', start:0, pageSize:2 }");
		String result = template.getForObject(url + "/query?data={data}", String.class, urlVariables);
		System.out.println("接收：" + format(result));
		org.junit.Assert.assertNotNull(result);
		org.junit.Assert.assertThat(result, org.hamcrest.Matchers.containsString("total"));

		log.info("getPage测试结束");
		
		/*
		2016-05-27 17:28:44.768  INFO   --- [           main] i.e.b.w.r.BillInstanceRestControllerTest : getPage测试开始
		发送：http://localhost:8080/bill/instance/query?data={oriBizNo:'a', start:0, pageSize:2 }
		接收：{
			"start":0,
			"pageSize":20,
			"totalPage":0,
			"total":0,
			"result":null
		}
		2016-05-27 17:28:44.888  INFO   --- [           main] i.e.b.w.r.BillInstanceRestControllerTest : getPage测试结束
		*/
	}
	
	@Test
	@Ignore
	public void t5testUpdateState() throws URISyntaxException {
		log.info("updateState测试开始");
		
		BillInstance bi = new BillInstance();
		bi.setNo("BILL2016060200000002");
		bi.setStatus(BillInstance.STATUS_PAYING);

		System.out.println("发送：" + JSONUtils.serialize(bi, SerializerFeature.PrettyFormat));

		RequestEntity<BillInstance> request = RequestEntity.put(new URI(url + "/updatestatus/" + bi.getNo())).accept(MediaType.APPLICATION_JSON).body(bi);
		ResponseEntity<String> response = template.exchange(request, String.class);
		String bc2 = response.getBody();
		System.out.println("接收：" + format(bc2));
		
		org.junit.Assert.assertNotNull(bc2);
		org.junit.Assert.assertThat(bc2.toString(), org.hamcrest.Matchers.containsString(BillInstance.STATUS_PAYING));

		log.info("updateState测试结束");
		
		/*
		2016-06-06 11:24:11.516  INFO   --- [           main] i.e.b.w.r.BillInstanceRestControllerTest : updateState测试开始
		发送：{
			"amt":0,
			"new":true,
			"no":"BILL2016060200000002",
			"status":"11"
		}
		接收：{
			"success":true,
			"result":{
				"id":"402880e6550fdc4301550fdde0100001",
				"no":"BILL2016060200000002",
				"oriBizNo":"PAY2016051800007656",
				"type":"ty0001",
				"flag":"1",
				"status":"11",
				"memo":"xxx2",
				"ccy":"001",
				"amt":22.7,
				"bizChannel":"a00001",
				"payeeCode":"abc2",
				"payeeName":"张三2",
				"payeeAcctNo":"09090988723873282a",
				"payerCode":"def2",
				"payerName":"李四2",
				"payerAcctNo":"12321321321312a",
				"transTime":"2016-06-02",
				"createdOn":"2016-06-02",
				"updatedOn":"2016-06-06",
				"finishedOn":null,
				"oldOriBizNo":"xxx"
			},
			"msg":null
		}
		2016-06-06 11:24:12.114  INFO   --- [           main] i.e.b.w.r.BillInstanceRestControllerTest : updateState测试结束

		*/
	}
	
	
	@Test
	@Ignore
	public void testUnregister() throws URISyntaxException {
		log.info("delete测试开始");

		String no = "BILL2016060200000002";
		System.out.println("发送：" + url + "/"+no);
		
		RequestEntity<Void> request = RequestEntity.delete(new URI(url + "/" + no)).accept(MediaType.APPLICATION_JSON).build();
		ResponseEntity<String> response = template.exchange(request, String.class);
		String result = response.getBody();
		System.out.println("接收：" + format(result));
		
		org.junit.Assert.assertNotNull(result);
		org.junit.Assert.assertThat(result, org.hamcrest.Matchers.containsString(BillInstance.FLAG_DISABLED));

		log.info("delete测试结束");
		
		/*
		2016-06-06 11:25:58.980  INFO   --- [           main] i.e.b.w.r.BillInstanceRestControllerTest : delete测试开始
		发送：http://localhost:8080/bill/instance/BILL2016060200000002
		接收：{
			"success":true,
			"result":{
				"id":"402880e6550fdc4301550fdde0100001",
				"no":"BILL2016060200000002",
				"oriBizNo":"PAY2016051800007656",
				"type":"ty0001",
				"flag":"0",
				"status":"11",
				"memo":"xxx2",
				"ccy":"001",
				"amt":22.7,
				"bizChannel":"a00001",
				"payeeCode":"abc2",
				"payeeName":"张三2",
				"payeeAcctNo":"09090988723873282a",
				"payerCode":"def2",
				"payerName":"李四2",
				"payerAcctNo":"12321321321312a",
				"transTime":"2016-06-02",
				"createdOn":"2016-06-02",
				"updatedOn":"2016-06-06",
				"finishedOn":null,
				"oldOriBizNo":"xxx"
			},
			"msg":null
		}
		2016-06-06 11:25:59.118  INFO   --- [           main] i.e.b.w.r.BillInstanceRestControllerTest : delete测试结束

		*/
	}
	
	
	
	
	
}
