package com.infohold.test.web.rest;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.boot.test.TestRestTemplate;
import org.springframework.boot.test.WebIntegrationTest;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.infohold.bdrp.org.model.Org;
import com.infohold.core.IcoreApplication;
import com.infohold.core.utils.JSONUtils;





@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes=IcoreApplication.class)
@WebIntegrationTest
public class OrgRestControllerTest {
	
	
	
	private String url = "http://localhost.:8080/bdrp/org";
	
	
	@Before
	public void init(){
		//设置代理fiddler，注释这两行就不走fiddler代理
//		System.setProperty("http.proxyHost", "127.0.0.1");
//	    System.setProperty("http.proxyPort", "9999");
	}
	
	@Test
	@Ignore
	public void saveOrg(){
		System.out.println("save Org");
		RestTemplate template = new TestRestTemplate();
		
		
		MultiValueMap<String, String> bodyMap = new LinkedMultiValueMap<String, String>();
		bodyMap.add("name", "lisi");
		String result = template.postForObject(url+"/create", bodyMap, String.class);
		org.junit.Assert.assertNotNull(result);
		org.junit.Assert.assertThat(result, org.hamcrest.Matchers.containsString("张三"));  
	}	
		
	@Test
	@Ignore
	public void updateOrg(){
		System.out.println("update Org");
		RestTemplate template = new TestRestTemplate();
		Org org = new Org();
		org.setId("8a8180844ecf0b27014ecf0b392e0000");
		org.setAddress("changchun2");
		org.setPhone("1234567891");
		org.setCity("sdsd");
		template.put(url+"/update", org);
		String result = JSONUtils.serialize(org);
		System.out.println(result);
		
	}
	
	
	@Test
	@Ignore
	public void remove(){
		System.out.println("remove");
		RestTemplate template = new TestRestTemplate();
		template.delete(url+"/remove/{id}", "8a8180844ecf385b014ecf3869120000");
	}
	
	@Test
	@Ignore
	public void get(){
		System.out.println("get");
		RestTemplate template = new TestRestTemplate();
		String result = template.getForObject(url+"/get/{id}", String.class, "8a8180844ecf0b27014ecf0b392e00001");
		System.out.println("client receive:"+result);
		org.junit.Assert.assertNotNull(result);
		org.junit.Assert.assertThat(result, org.hamcrest.Matchers.containsString("张三"));  
	}
	
	@Test
	@Ignore
	public void getAll(){
		System.out.println("getAll");
		RestTemplate template = new TestRestTemplate();
		String result = template.getForObject(url+"/list", String.class);
		System.out.println("client receive:"+result);
		org.junit.Assert.assertNotNull(result);
		org.junit.Assert.assertThat(result, org.hamcrest.Matchers.containsString("张三"));  
	}
	
	@Test
//	@Ignore
	public void getPage(){
		System.out.println("getPage21");
		RestTemplate template = new TestRestTemplate();
		String result = template.getForObject(url+"/get/{start}/{limit}", String.class, 0, 2);
		System.out.println("client receive:"+result);
		org.junit.Assert.assertNotNull(result);
	}
	
	@Test
	@Ignore
	public void count(){
		System.out.println("count");
		RestTemplate template = new TestRestTemplate();
		String result = template.getForObject(url+"/user/count", String.class);
		System.out.println("client receive:"+result);
		org.junit.Assert.assertNotNull(result);
	}

}
