package com.lenovohit.ssm.treat.dao.impl;

import java.io.UnsupportedEncodingException;
import java.util.Base64;

import org.apache.cxf.endpoint.Client;
import org.apache.cxf.endpoint.dynamic.DynamicClientFactory;
import org.apache.cxf.jaxws.endpoint.dynamic.JaxWsDynamicClientFactory;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;

public class LisWSClient {

	public static Object getBean(String url) throws Exception {
		JaxWsDynamicClientFactory clientFactory = JaxWsDynamicClientFactory.newInstance();
		Client client = clientFactory.createClient("http://localhost:9090/helloWorldService?wsdl");
		Object[] result = client.invoke("sayHello", "KEVIN");
		System.out.println(result[0]);
		return null;
	}
	
	
	private void initClient() throws Exception {
//		JaxWsDynamicClientFactory clientFactory = JaxWsDynamicClientFactory.newInstance();
//		this.client = clientFactory.createClient("assay.wsdl");
	}
	private Object[] invoke() throws Exception{
//		Object[] result = client.invoke("sayHello", "KEVIN");
//		return result;
		return null;
	}
	public void wsTest() throws Exception{
		DynamicClientFactory clientFactory = DynamicClientFactory.newInstance();
		Client client = clientFactory.createClient("assay.wsdl");
		Object[] result = client.invoke("OpenCon");
		System.out.println(result[0]);
		Object[] result1 = client.invoke("GetTestForm","patientId=0003463433&patientType=门诊&dtReg=2017-04-01&dtEnd=2017-04-15");
		System.out.println(result1[0]);
		
		Object[] result2 = client.invoke("PrintForm","barcode=1004042290");
		System.out.println(result2[0]);
	}
	public void httpTest() throws Exception{
		String url = "http://10.10.210.190/ssm/PrintService.asmx/PrintForm_ByBarcode";
		System.out.println(" url "+ url);
		HttpPost post = new HttpPost(url);
		StringEntity stringEntity = new StringEntity("barcode=1004042290");//param参数，可以为"key1=value1&key2=value2"的一串字符串  
		stringEntity.setContentType("application/x-www-form-urlencoded;charset=utf-8"); 
//	    stringEntity.setContentEncoding("utf-8");
//		UrlEncodedFormEntity entity = new UrlEncodedFormEntity(params);
		//entity.setContentType("application/xml");  
		System.out.println("post "+stringEntity);
		post.setEntity(stringEntity);  
		CloseableHttpClient client = HttpClientBuilder.create().build() ;
        try {
             //提交登录数据
             HttpResponse response = client.execute(post);
          // 判断网络连接状态码是否正常(0--200都数正常)
             String xml = "";
             int status =  response.getStatusLine().getStatusCode();
             if (status == HttpStatus.SC_OK) {
            	 xml= EntityUtils.toString(response.getEntity(),"utf-8");
            	 System.out.println(xml);
             } else{
            	 xml= EntityUtils.toString(response.getEntity(),"utf-8");
            	 System.out.println(xml);
            	throw new RuntimeException("请求LIS出错，返回状态码： " + status ); 
             }
         } catch (Exception e) {
        	e.printStackTrace(); 
        	throw e;
         }finally{
        	 client.close();
         }
	}
	public static void main(String args[]) throws Exception{
		LisWSClient client = new LisWSClient();
		// client.wsTest();
		client.httpTest();
		
		
        
	}
}
