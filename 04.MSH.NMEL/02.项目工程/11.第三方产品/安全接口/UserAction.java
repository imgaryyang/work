package com.web.actions;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;

import com.alibaba.fastjson.JSON;
import com.infohold.api.InfoholdPassWordAPI;
import com.infohold.api.handle.InfoholdHandle;
import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionSupport;
import com.web.utils.PublicKeyMap;
import com.web.utils.RSAUtils;
import com.web.utils.WebUtil;
 
@SuppressWarnings("serial")
public class UserAction extends ActionSupport{

 
    /**
     * 获取公钥的系数和指数
     * @return
     * @throws Exception
     */
    public void keyPair(){
    	Properties prop = new Properties();
	try {
			
			String path = System.getProperty("user.dir") + File.separator +"publickey.properties";
			FileInputStream istream = new FileInputStream(path);
			prop.load(istream);
		} catch (IOException e) {
			throw new RuntimeException("read keys properties file error.", e);
		}
	PublicKeyMap publicKeyMap = new PublicKeyMap();
	publicKeyMap.setModulus(prop.getProperty("modulus"));
	publicKeyMap.setExponent(prop.getProperty("exponent"));
    HttpServletResponse response = ServletActionContext.getResponse();
    WebUtil.returnJSON(response, JSON.toJSONString(publicKeyMap).toString(), "json");
    }
    
    /**
     * 调用密码服务平台接口获取认随机数
     */
    public void getRandom(){
    	String zkConnStr="110.76.186.49:2181,110.76.186.49:2182,110.76.186.49:2183";
		String random = null;
		try {
		InfoholdHandle  handle = new InfoholdHandle(zkConnStr, "YM", 8000);
		handle.openHandle();
		InfoholdPassWordAPI pwdApi =new InfoholdPassWordAPI(handle);
		 random = pwdApi.InfoholdAuthInit(16);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		 HttpServletResponse response = ServletActionContext.getResponse();
		WebUtil.returnJSON(response,JSON.toJSONString(random).toString() , "json");
    }
     
    /**
     * 登录
     * @return
     * @throws Exception
     */
    public String login(){
    	String inPwd = getPassword(); //用户在页面输入的密码
    	
    	//调用InfoholdPassWordAPI的InfoholdTransLoginPwd接口获取密码的密文
    	String  dbPwd = "157abfccf45aaa7fe19e241e32047e135e3d6c09f6928013266e52416ce522f8";
    	
    	String zkConnStr="110.76.186.49:2181,110.76.186.49:2182,110.76.186.49:2183";
		boolean bool = false;
		try {
			InfoholdHandle  handle = new InfoholdHandle(zkConnStr, "YM", 8000);
			handle.openHandle();
			InfoholdPassWordAPI pwdApi =new InfoholdPassWordAPI(handle);
			 bool = pwdApi.InfoholdVerifyLoginPwd(getUid(),inPwd, getRandomNUM(),dbPwd);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		if(bool){
			 ActionContext.getContext().put("msg", "登录成功");	
		}else{
			ActionContext.getContext().put("msg", "登录失败");	
		}
		
        return SUCCESS;
    }

    
    private String password;
    private String uid;
    private String randomNUM;
    public String getRandomNUM() {
		return randomNUM;
	}

	public void setRandomNUM(String randomNUM) {
		this.randomNUM = randomNUM;
	}

	public String getPassword() {
        return password;
    }
 
    public void setPassword(String password) {
        this.password = password;
    }
    

	public String getUid() {
		return uid;
	}

	public void setUid(String uid) {
		this.uid = uid;
	}
     

}