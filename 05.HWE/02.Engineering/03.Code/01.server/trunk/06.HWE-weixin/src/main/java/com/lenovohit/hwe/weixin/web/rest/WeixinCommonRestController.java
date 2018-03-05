package com.lenovohit.hwe.weixin.web.rest;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Map;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
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
import com.lenovohit.hwe.org.model.Account;
import com.lenovohit.hwe.org.model.User;
import com.lenovohit.hwe.weixin.configration.WeixinMpProperties;
import com.lenovohit.hwe.weixin.mananger.WeixinBaseManger;
import com.lenovohit.hwe.weixin.model.WeixinToken;

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
			@RequestParam(value = "state") String state // 重定向后会带上state参数，开发者可以填写a-zA-Z0-9的参数值，最多128字节
			){
		try {
			String baseUrl = properties.getMpBaseUrl();
			System.out.println("code : "+code);
			System.out.println("state : "+state);
			WeixinToken token = weixinBaseManger.getToken(code);
			String openid = token.getOpenid();
			String url = baseUrl.contains("?")? (baseUrl+"openid="+openid) :( baseUrl+"?openid="+openid);
			this.getResponse().sendRedirect(url);
		} catch (IOException e) {
			e.printStackTrace();
		} 
	}
	/**
	 * 登录
	 */
	@RequestMapping(value = "/login", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forLogin(@RequestBody String data) {
		try {
			//TODO WeixinToken 不合适
			WeixinToken temp = JSONUtils.deserialize(data, WeixinToken.class);//接参数用
			Account model  = new Account();
			model.setUsername(temp.getOpenid());
			model.setPassword(properties.getSecret());
			Subject subject = SecurityUtils.getSubject();
			AuthAccountToken authToken = new AuthAccountToken(model);
			subject.login(authToken);
			User user = this.getCurrentUser();
			user.setSessionId(this.getSession().getId());
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
	@RequestMapping(value = "/register", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forRegister(@RequestBody String data) {
		try {
			Map dataMap = JSONUtils.deserialize(data, Map.class);
			if(null == dataMap && dataMap.isEmpty()){
				throw new BaseException("输入数据为空！");
			}
			String mobile = dataMap.get("mobile").toString();
			String smscode = dataMap.get("smscode").toString();
			String openid = dataMap.get("openid").toString();
			
			// 业务数据校验
			if (StringUtils.isEmpty(openid)) {
				throw new BaseException("注册出错！");
			}
			
			User user = null;
			Account model = this.accountManager.findOne("from Account u where u.username=? ", openid);
			if (null != model) {
				model.setPassword(properties.getSecret());
				Subject subject = SecurityUtils.getSubject();
				AuthAccountToken authToken = new AuthAccountToken(model);
				subject.login(authToken);
				user = this.getCurrentUser();
				user.setSessionId(this.getSession().getId());
				return ResultUtils.renderSuccessResult(user);
			} else {
				model = new Account();
				user = new User();
				model.setUsername(openid);
				model.setPassword(properties.getSecret());
				model = (Account) AuthUtils.encryptAccount(model);
				
				user.setIsActive("1");
				user.setMobile(mobile);
				user.setLoginAccount(model);
				user = this.userManager.save(user);
				
				model.setUser(user);
				this.accountManager.save(model);
				user.setSessionId(this.getSession().getId());
				return ResultUtils.renderSuccessResult(user);
			}
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult("登录出错");
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
	public static void main(String args[]){
		try {
			String url="http://tjdev.lenovohit.com/api/hwe/weixin/common/redirect";
			String encodedUrl = URLEncoder.encode(url,"UTF-8");
			System.out.println("encodedUrl : " +encodedUrl);
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		/**
		 * https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc861b86da5958607&redirect_uri=http%3A%2F%2Ftjdev.lenovohit.com%2Fapi%2Fhwe%2Fweixin%2Fcommon%2Fredirect&response_type=code&scope=snsapi_base&state=123#wechat_redirect
		 */
	}
}
