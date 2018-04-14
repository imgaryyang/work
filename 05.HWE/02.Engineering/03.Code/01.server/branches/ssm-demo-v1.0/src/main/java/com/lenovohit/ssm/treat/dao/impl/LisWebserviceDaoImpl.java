package com.lenovohit.ssm.treat.dao.impl;

import java.beans.BeanInfo;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.lenovohit.core.utils.DocMap;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.ssm.treat.dao.LisWebserviceDao;

public class LisWebserviceDaoImpl implements LisWebserviceDao{
	private final Logger log = LoggerFactory.getLogger(this.getClass());

	private String location;
	private CloseableHttpClient client = HttpClientBuilder.create().build(); 
	
	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}
	
	public  String postForEntity(String code, Object param ) throws Exception {
		Map<String, Object> result = this.post(code, param);
		Object listObject = result.get("string");
		if( null == listObject ) listObject = result.toString();
		if( null == listObject ) return null;
		if(listObject instanceof Object[]){
			Object[] array = (Object[])listObject;
			if(array.length >= 0)return array[0].toString();
			return null;
		}else{
			return listObject.toString();
		}
	}

	public  List<String> postForList(String code, Object param) throws Exception {
		Map<String, Object> result = this.post(code, param);
		List<String> list = new ArrayList<String>();
		Object listObject = result.get("string");
		if( null == listObject ) listObject = result.toString();
		if( null == listObject ) return list;
		if(listObject instanceof Object[]){
			Object[] array = (Object[])listObject;
			for(Object value : array){
				list.add(value.toString());
			}
		}else{
			list.add(listObject.toString());
		}
		
		return list;
	}
	
	public  Map<String,Object> post(String code, Object param) throws Exception {
		List<NameValuePair> params = new ArrayList<NameValuePair>();
		BeanInfo paramBean = Introspector.getBeanInfo(param.getClass());
		PropertyDescriptor[] propertyDescriptors = paramBean.getPropertyDescriptors();
		for (int i = 0; i < propertyDescriptors.length; i++) {
			PropertyDescriptor pro = propertyDescriptors[i];
			if("class".equals(pro.getDisplayName()))continue;
			Method rm = pro.getReadMethod();
			Object value = rm.invoke(param, new Object[0]);
			if(null != value ) params.add(new BasicNameValuePair(pro.getDisplayName(),value.toString()));
		}	
		String xml = post(code, params);
		Document doc = DocumentHelper.parseText(xml);
		return new DocMap(doc.getRootElement());
	}

	public String post(String code, List<NameValuePair> params) throws Exception {
		String url = this.location + code;
		HttpPost post = new HttpPost(url);
//		StringEntity stringEntity = new StringEntity("patientId=0003463433&patientType=门诊&dtReg=2017-04-01&dtEnd=2017-04-15");//param参数，可以为"key1=value1&key2=value2"的一串字符串  
//	    stringEntity.setContentType("application/x-www-form-urlencoded;charset=utf-8"); 
		UrlEncodedFormEntity entity = new UrlEncodedFormEntity(params,"utf-8");
		entity.setContentType("application/x-www-form-urlencoded;charset=utf-8");  
		post.setEntity(entity);  
		String uuid = com.lenovohit.core.utils.StringUtils.uuid();
		
		log.info(uuid+" LisRequest: URL 【" + url + "】");
		log.info(uuid+" LisRequest: Code【" + code + "】");
		log.info(uuid+" LisRequest: param【" + JSONUtils.serialize(params) + "】");
        try {
             // 提交登录数据
             HttpResponse response = client.execute(post);
             String xml = "";
             // 判断网络连接状态码是否正常(0--200都数正常)
             int status =  response.getStatusLine().getStatusCode();
             if (status == HttpStatus.SC_OK) {
            	 xml= EntityUtils.toString(response.getEntity(),"utf-8");
            	 log.info(uuid+" HisRequest: response 【" + xml + "】");
            	 return xml;
             } else{
            	 xml= EntityUtils.toString(response.getEntity(),"utf-8");
            	 log.info(uuid+" HisRequest: response 【" + xml + "】");
            	 throw new RuntimeException("请求LIS出错，返回状态码： " + status ); 
             }
         } catch (Exception e) {
        	e.printStackTrace(); 
        	throw e;
         }
	}
}
