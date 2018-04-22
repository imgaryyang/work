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
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.dom4j.Document;
import org.dom4j.DocumentHelper;

import com.lenovohit.core.utils.DocMap;
import com.lenovohit.ssm.base.utils.SoapXmlUtil;
import com.lenovohit.ssm.treat.dao.PacsWebserviceDao;
import com.lenovohit.ssm.treat.model.PacsRecord;

public class PacsWebserviceDaoImpl implements PacsWebserviceDao{
	
	private String location;

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}
	private CloseableHttpClient client = HttpClientBuilder.create().build();
	
	public String postForEntity(String code, Object param, String reqXml) throws Exception {
		Map<String,Object> result = this.post(code, param, reqXml);
		String resultXml = result.toString();
		
		PacsRecord pacsRecord = SoapXmlUtil.parseSoapMessage(resultXml);
		String downLoadPdfResult = pacsRecord.getDownLoadPdfResult();
		return downLoadPdfResult;
	}

	public List<String> postForList(String code, Object param, String reqXml) throws Exception {
		Map<String,Object> result = this.post(code, param, reqXml);
		List<String> list = new ArrayList<String>();
		Object listObject = result.get("string");
		if( null == listObject )return list;
		if(listObject instanceof Object[]){
			Object[] array = (Object[])listObject;
			for(Object value : array){
				System.out.println(value.toString());
				list.add(value.toString());
			}
		}else{
			System.out.println(listObject.toString());
			list.add(listObject.toString());
		}
		return list;
	}

	public Map<String, Object> post(String code, Object param, String reqXml) throws Exception {
		List<NameValuePair> params = new ArrayList<NameValuePair>();
		BeanInfo paramBean = Introspector.getBeanInfo(param.getClass());
		PropertyDescriptor[] propertyDescriptors = paramBean.getPropertyDescriptors();
		for (int i = 0; i < propertyDescriptors.length; i++) {
			PropertyDescriptor pro = propertyDescriptors[i];
			if("class".equals(pro.getDisplayName()))continue;
			Method rm = pro.getReadMethod();
			Object value = rm.invoke(param, new Object[0]);
			System.out.println("pro.getDisplayName() : "+pro.getDisplayName()+": "+value);
			if(null != value )params.add(new BasicNameValuePair(pro.getDisplayName(),value.toString()));
		}	
		String xml = post(code,params,reqXml);
        Document doc = DocumentHelper.parseText(xml);
        
		return new DocMap(doc.getRootElement());
	}

	public String post(String code, List<NameValuePair> params, String reqXml) throws Exception {
		String url = this.location + code;
		System.out.println(" url "+ url);
		HttpPost post = new HttpPost(url);
		StringEntity entity = new StringEntity(reqXml,"utf-8");
		entity.setContentType("text/xml;charset=utf-8");  
		post.setEntity(entity);  
        try {
             //提交登录数据
             HttpResponse response = client.execute(post);
             // 判断网络连接状态码是否正常(0--200都数正常)
             String xml = "";
             int status =  response.getStatusLine().getStatusCode();
             if (status == HttpStatus.SC_OK) {
            	 xml= EntityUtils.toString(response.getEntity(),"utf-8");
            	 System.out.println(xml);
            	 return xml;
             } else{
            	 xml= EntityUtils.toString(response.getEntity(),"utf-8");
            	 System.out.println(xml);
            	throw new RuntimeException("请求PACS出错，返回状态码： " + status ); 
             }
         } catch (Exception e) {
        	e.printStackTrace(); 
        	throw e;
         }
	}

}
