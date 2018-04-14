package com.lenovohit.hwe.mobile.weixin.web.rest;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.bdrp.authority.shiro.authc.AuthAccountToken;
import com.lenovohit.bdrp.authority.utils.AuthUtils;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DocMap;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hwe.base.model.SmsMessage;
import com.lenovohit.hwe.mobile.core.model.UserPatient;
import com.lenovohit.hwe.mobile.core.model.UserPatientProfile;
import com.lenovohit.hwe.mobile.weixin.configration.WeixinMpProperties;
import com.lenovohit.hwe.mobile.weixin.mananger.WeixinBaseManger;
import com.lenovohit.hwe.mobile.weixin.model.WeixinToken;
import com.lenovohit.hwe.org.model.Account;
import com.lenovohit.hwe.org.model.User;
import com.lenovohit.hwe.treat.model.Profile;

@RestController
@RequestMapping("/hwe/weixin/common")
@EnableConfigurationProperties(WeixinMpProperties.class)
public class WeixinCommonRestController extends WeixinBaseRestController{
	private static String token = "lenovohit2017";

	@Autowired
	private WeixinMpProperties properties;
	@Autowired
	private WeixinBaseManger weixinBaseManger;
	@Autowired
	private GenericManager<Account, String> accountManager;
	@Autowired
	private GenericManager<User, String> userManager;
	@Autowired
	private GenericManager<UserPatient, String> userPatientManager;
	@Autowired
	private GenericManager<UserPatientProfile, String> userPatientProfileManager;
	@Autowired
	private GenericManager<SmsMessage, String> smsMessageManager;

	@RequestMapping(value = "/base", method = RequestMethod.GET, produces = MediaTypes.TEXT_PLAIN_UTF_8)
	public String signature(@RequestParam(value = "signature") String signature, // 微信加密签名，signature结合了开发者填写的token参数和请求中的timestamp参数、nonce参数
			@RequestParam(value = "timestamp") String timestamp, // 时间戳
			@RequestParam(value = "nonce") String nonce, // 随机数
			@RequestParam(value = "echostr") String echostr// 随机字符串
			) {
		System.out.println("signature ： " + signature);
		System.out.println("timestamp ： " + timestamp);
		System.out.println("nonce ： " + nonce);
		System.out.println("echostr ： " + echostr);

		ArrayList<String> list = new ArrayList<String>();
		list.add(token);
		list.add(nonce);
		list.add(timestamp);
		Collections.sort(list);
		StringBuilder sb = new StringBuilder();
		for (String value : list) {
			sb.append(value);
		}
		String sign = DigestUtils.sha1Hex(sb.toString());
		// 微信返回的加密串
		if (sign.equals(signature))
			return echostr;
		else
			return "";
	}

	@RequestMapping(value = "/base", method = RequestMethod.POST, produces = MediaTypes.TEXT_PLAIN_UTF_8)
	public String base(@RequestBody String data) throws DocumentException {
		System.out.println("@RequestBody ： " + data);

		Document doc = DocumentHelper.parseText(data);
		DocMap docMap = new DocMap(doc.getRootElement());

		String ToUserName = docMap.get("ToUserName").toString();
		String FromUserName = docMap.get("FromUserName").toString();
		/**
		String CreateTime = docMap.get("CreateTime").toString();
		String MsgType = docMap.get("MsgType").toString();
		String Content = docMap.get("Content").toString();
		String MsgId = docMap.get("MsgId").toString();
		 */
		// PicUrl MediaId
		/**
		 <xml><ToUserName><![CDATA[gh_281bf8ad6d8f]]></ToUserName>
		 <FromUserName><![CDATA[oFTG9w-pyYc4iBPJvUSHo9HIFGzg]]></FromUserName>
		 <CreateTime>1517038051</CreateTime>
		 <MsgType><![CDATA[text]]></MsgType>
		 <Content><![CDATA[1]]></Content>
		 <MsgId>6515628816421842505</MsgId>
		 </xml>
		 */
		/**
		 <xml><ToUserName><![CDATA[gh_281bf8ad6d8f]]></ToUserName>
		 <FromUserName><![CDATA[oFTG9w-pyYc4iBPJvUSHo9HIFGzg]]></FromUserName>
		 <CreateTime>1517038079</CreateTime>
		 <MsgType><![CDATA[image]]></MsgType>
		 <PicUrl><![CDATA[http://mmbiz.qpic.cn/mmbiz_jpg/TvBYibWdSrHLUYiaTXah9ybe18kWZVYjZTAj6V05jib2xAHjCLZU5LoCMhjOSg6JCfvpSMnlgIkHMa3yDZtsNsA4Q/0]]></PicUrl>
		 <MsgId>6515628936680926796</MsgId>
		 <MediaId><![CDATA[sV1K4yGfgBgGPkK2Vzk6_6OBFOkFuYJvPouyJqgv84bpm9nVFBk9Pt9esoM3U3Ia]]></MediaId>
		 </xml>
		 */
		String xml ="<xml>" 
				+ "<ToUserName><![CDATA[" + FromUserName + "]]></ToUserName>" + "<FromUserName><![CDATA["
				+ ToUserName + "]]></FromUserName>" + "<CreateTime>" + System.currentTimeMillis()
				+ "</CreateTime>" + "<MsgType><![CDATA[text]]></MsgType>" + "<Content><![CDATA[你好]]></Content>"
				+ "</xml>";

		return xml;
	}
	@RequestMapping(value = "/redirect", method = RequestMethod.GET)
	public void redirect(
			@RequestParam(value = "code") String code, // code作为换取access_token的票据，每次用户授权带上的code将不一样，code只能使用一次，5分钟未被使用自动过期。
			@RequestParam(value = "state") String state, // 重定向后会带上state参数，开发者可以填写a-zA-Z0-9的参数值，最多128字节
			@RequestParam(value = "route") String route
			){
		try {
			String baseUrl = properties.getMpBaseUrl();
			System.out.println("code : "+code);
			System.out.println("state : "+state);
			System.out.println("route : "+route);
			WeixinToken token = weixinBaseManger.getToken(code);
			String openid = token.getOpenid();
			String url = baseUrl.contains("?")? (baseUrl+"openid="+openid+"&route="+route) :( baseUrl+"?openid="+openid+"&route="+route);
			System.out.println("url：" + url);
			this.getResponse().sendRedirect(url);
		} catch (IOException e) {
			e.printStackTrace();
		} 
	}
	
	@RequestMapping(value = "/token", method = RequestMethod.GET)
	public void forToken(
			@RequestParam(value = "code") String code, 
			@RequestParam(value = "state") String state,
			@RequestParam(value = "route") String route
			){
		try {
			System.out.println("code："+code+" ,state："+state+" ,route："+route);
			String baseUrl = properties.getMpBaseUrl();
			WeixinToken token = weixinBaseManger.getToken(code);
			String openid = token.getOpenid();
			String url = baseUrl.contains("?")? (baseUrl+"openid="+openid+"&route="+route) :( baseUrl+"?openid="+openid+"&route="+route);
			System.out.println("url：" + url);
			this.getResponse().sendRedirect(url);
		} catch (Exception e) {
			e.printStackTrace();
		} 
	}
	
	/**
	 * 登录
	 */
	@SuppressWarnings(value="rawtypes")
	@RequestMapping(value = "/loginOld", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forLogin(@RequestBody String data) {
		try {
			//TODO WeixinToken 不合适
//			WeixinToken temp = JSONUtils.deserialize(data, WeixinToken.class);//接参数用
			Map dataMap = JSONUtils.deserialize(data, Map.class);
			Object openid = dataMap.get("openid");
			Object hospitalId = dataMap.get("hospitalId");
			if(StringUtils.isEmpty(openid)) {
				throw new BaseException("非法请求");
			}
			if(StringUtils.isEmpty(hospitalId)) {
				throw new BaseException("非法请求");
			}
			Account model  = new Account();
			model.setUsername(openid.toString());
			model.setPassword(properties.getSecret());
			Subject subject = SecurityUtils.getSubject();
			AuthAccountToken authToken = new AuthAccountToken(model);
			subject.login(authToken);
			User user = this.getMobileUser(hospitalId.toString());
			user.setSessionId(this.getSession().getId());
			user.setLoginAccount(model);
			return ResultUtils.renderSuccessResult(user);
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult("用户名或密码错误");
		}
	}
	/**
	 * 注册/登录 功能
	 * @param data
	 * @return
	 */
	@SuppressWarnings("null")
	@RequestMapping(value = "/login", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forRegister(@RequestBody String data) {
		try {
			System.out.println(data);
			Map dataMap = JSONUtils.deserialize(data, Map.class);
			if(null == dataMap && dataMap.isEmpty()){
				throw new BaseException("输入数据为空！");
			}
			String openid = "";
			if(dataMap.containsKey("openid")){
				openid = dataMap.get("openid").toString();
			}
			// 业务数据校验
			if (StringUtils.isEmpty(openid)) {
				throw new BaseException("非法请求！");
			}
			String hospitalId = "";
			if(dataMap.containsKey("hospitalId")){
				hospitalId = dataMap.get("hospitalId").toString();
			}
			User user = null;
			Account model = this.accountManager.findOne("from Account u where u.username=? ", openid);
			if (null != model && !StringUtils.isEmpty(model.getId())) {
				model.setUsername(openid.toString());
				model.setPassword(properties.getSecret());
				Subject subject = SecurityUtils.getSubject();
				AuthAccountToken authToken = new AuthAccountToken(model);
				subject.login(authToken);
				user = this.getMobileUser(hospitalId);
				user.setSessionId(this.getSession().getId());
				return ResultUtils.renderSuccessResult(user);
			} else {
				String token = "";
				if(dataMap.containsKey("token")){
					token = dataMap.get("token").toString();
				}
				SmsMessage smsMessage = this.smsMessageManager.get(token);
				if(null == smsMessage){
					throw new BaseException("非法请求！");
				}
				Object mobile = dataMap.get("mobile");
				if (StringUtils.isEmpty(mobile)) {
					throw new BaseException("非法请求！");
				}
				model = new Account();
				model.setUsername(openid.toString());
				model.setPassword(properties.getSecret());
				model.setType(Account.TYPE_WX);
				model = (Account) AuthUtils.encryptAccount(model);
				List<User> list = this.userManager.find(" from User where mobile = ?", mobile.toString());
				if(null != list && !list.isEmpty()) {
					user = list.get(0);
					user.setLoginAccount(model);
				}else {
					user = new User();
					user.setIsActive("1");
					user.setMobile(mobile.toString());
					user.setLoginAccount(model);
					user = this.userManager.save(user);
				}
				model.setUser(user);
				this.accountManager.save(model);
				model.setPassword(properties.getSecret());
				Subject subject = SecurityUtils.getSubject();
				AuthAccountToken authToken = new AuthAccountToken(model);
				subject.login(authToken);
				user = this.getMobileUser(hospitalId);
				user.setSessionId(this.getSession().getId());
				return ResultUtils.renderSuccessResult(user);
			}
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult("请求出错");
		}
	}
	/**
	 * 退出登陆
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/logout", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forLogout() {
		try {
			Subject subject = SecurityUtils.getSubject();
			subject.logout();
			return ResultUtils.renderSuccessResult();
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult("用户名或密码错误，请从新登陆");
		}

	}
	/**
	 * 更新档案
	 * @return
	 */
	@RequestMapping(value = "/getProfiles", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result getProfiles() {
		User user = this.getCurrentUser();
		List<UserPatient> userPatients = this.userPatientManager.find(" from UserPatient where userId = ? ", user.getId());
		List<Profile> list = new ArrayList<Profile>();
		if(!userPatients.isEmpty() && userPatients.size()>0){
			for(UserPatient userPatient : userPatients) {
				List<Profile> profiles = getProfile(userPatient.getId(), "8a81a7db4dad2271014dad2271e20001");
				if(!profiles.isEmpty() && profiles.size()>0) {
					for(Profile profile : profiles){
						list.add(profile);
					}
				}
			}
			return ResultUtils.renderSuccessResult(list);
		}
		return null;
	}
	public List<Profile> getMyProfiles() {
		User user = this.getCurrentUser();
		List<UserPatient> userPatients = this.userPatientManager.find(" from UserPatient where userId = ? ", user.getId());
		List<Profile> list = new ArrayList<Profile>();
		if(!userPatients.isEmpty() && userPatients.size()>0){
			for(UserPatient userPatient : userPatients) {
				List<Profile> profiles = getProfile(userPatient.getId(), "8a81a7db4dad2271014dad2271e20001");
				if(!profiles.isEmpty() && profiles.size()>0) {
					for(Profile profile : profiles){
						list.add(profile);
					}
				}
			}
			return list;
		}
		return null;
	}
	/**
	 * 修改个人资料
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/doSave", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forChangeUserInfo(@RequestBody String data) {
		// 数据校验
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}
		User model = JSONUtils.deserialize(data, User.class);
		if (null == model) {
			throw new BaseException("输入数据为空！");
		}
		User user = this.getCurrentUser();
		if(!StringUtils.isEmpty(model.getName())) {
			user.setName(model.getName());
		}
		if(!StringUtils.isEmpty(model.getGender())) {
			user.setGender(model.getGender());
		}
		if(!StringUtils.isEmpty(model.getIdNo())) {
			user.setIdNo(model.getIdNo());
		}
		if(!StringUtils.isEmpty(model.getEmail())) {
			user.setEmail(model.getEmail());
		}
		if(!StringUtils.isEmpty(model.getAddress())) {
			user.setAddress(model.getAddress());
		}
		this.userManager.save(user);
		this.getMobileUser(null);
		user.setSessionId(this.getSession().getId());
		return ResultUtils.renderSuccessResult(user);
	}
	/**
	 * 获取当前就诊人关联的档案
	 * @param userPatientId
	 * @return
	 */
	public List<Profile> getProfile(String userPatientId, String hospitalId){
		String sql = "select p.ID,p.NAME,p.NO,p.HOS_ID,p.HOS_NO,p.HOS_NAME,p.ID_NO,r.STATUS,r.IDENTIFY,p.GENDER,p.MOBILE,p.Type from APP_USER_PATIENT_PROFILE r "
				+ "left join TREAT_PROFILE p ON r.PRO_ID = p.ID JOIN APP_USER_PATIENT a "
				+ "ON a.ID = r.UP_ID where a.id = '"+ userPatientId + "'";
		if(!StringUtils.isEmpty(hospitalId)){
			sql += " and r.HOSPITAL_Id = '"+hospitalId+"'";
		}
		List<?> list = this.userPatientProfileManager.findBySql(sql);
		List<Profile> profiles = new ArrayList<Profile>();
		for(Object obj : list){
			Object[] objects = (Object[]) obj;
			Profile profile = new Profile();
			profile.setId(Object2String(objects[0]));   
			profile.setName(Object2String(objects[1]));
			profile.setNo(Object2String(objects[2]));
			profile.setHosId(Object2String(objects[3]));
			profile.setHosNo(Object2String(objects[4]));
			profile.setHosName(Object2String(objects[5]));
			profile.setIdNo(Object2String(objects[6]));
			profile.setStatus(Object2String(objects[7]));
			profile.setIdentify(Object2String(objects[8]));
			profile.setGender(Object2String(objects[9]));
			profile.setMobile(Object2String(objects[10]));
			profile.setType(Object2String(objects[11]));
			profiles.add(profile);
		}
		return profiles;
	}
	public String Object2String(Object object){
		if(object == null){
			return "";
		}
		return object.toString();
	}
	
	public Result validCode(String smsId, String code) {
		SmsMessage _smsMessage = this.smsMessageManager.get(smsId);
		if(null == _smsMessage ){
			return ResultUtils.renderFailureResult("未找到对应记录!");
		}
		if(StringUtils.equals(_smsMessage.getCode(), code)){
			return ResultUtils.renderSuccessResult();
		} else {
			return ResultUtils.renderFailureResult("验证码错误，请核对验证码！");
		}
	}
	public static void main(String args[]){
		try {
			//String url="http://tjdev.lenovohit.com/api/hwe/weixin/common/redirect";
			String url="http://tjdev.lenovohit.com/api/hwe/weixin/common/redirect?route=";			String encodedUrl = URLEncoder.encode(url,"UTF-8");
			System.out.println("encodedUrl : " +encodedUrl);
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		/**
		 * https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc861b86da5958607&redirect_uri=http%3A%2F%2Ftjdev.lenovohit.com%2Fapi%2Fhwe%2Fweixin%2Fcommon%2Fredirect&response_type=code&scope=snsapi_base&state=123#wechat_redirect
		 * 
		 * https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc861b86da5958607&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fapi%2Fhwe%2Fweixin%2Fcommon%2Fredirect&response_type=code&scope=snsapi_base&state=123#wechat_redirect
		 */
	}
}