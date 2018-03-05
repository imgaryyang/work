package com.lenovohit.el.web.rest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.TypeReference;
import com.lenovohit.bdrp.authority.shiro.authc.AuthUserToken;
import com.lenovohit.bdrp.tools.security.SecurityUtil;
import com.lenovohit.bdrp.tools.security.impl.SecurityConstants;
import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.el.ElConstants;
import com.lenovohit.el.base.model.AppUser;
import com.lenovohit.el.base.model.BankCards;
import com.lenovohit.el.base.model.CardType;
import com.lenovohit.el.base.model.Notice;
import com.lenovohit.el.base.model.User;
import com.lenovohit.el.base.service.NoticeService;

/**
 * APP用户管理
 * 
 * @author Dpp
 *
 */
@RestController
@RequestMapping("/el/user")
public class UserRestController extends BaseRestController {

	@Autowired
	private GenericManager<User, String> userManager;
	@Autowired
	private GenericManager<AppUser, String> appUserManager;
	@Autowired
	private GenericManager<BankCards, String> bankCardsManager;
	@Autowired
	private NoticeService noticeService;

	/*
	 * ELB_USER_001 登陆 只做验证用户信息
	 */
	@RequestMapping(value = "/login", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forLogin(@RequestBody String data) {
		// 数据校验
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}

		Map<String, String> model = JSONUtils.parseObject(data, new TypeReference<HashMap<String, String>>(){});
		if (null == model) {
			throw new BaseException("输入数据为空！");
		}

		// 业务数据校验
		if (StringUtils.isEmpty(model.get("mobile"))) {
			throw new BaseException("用户电话为空。");
		}
		if (StringUtils.isEmpty(model.get("encpswd"))) {
			throw new BaseException("登陆密码为空。");
		}
		
		User _user = this.userManager.findOne("from User u where u.mobile=? ", model.get("mobile"));
		if (null == _user) {
			throw new BaseException("本手机号未注册，请查证后再登陆！");
		}
		String random = (String) this.getSession().getAttribute(SecurityConstants.PARAM_KEY_LONIN_RANDOM);
		
		User user = new User();
		user.setMobile(model.get("mobile"));
		user.setPassword(model.get("encpswd"));
		log.info("App用户【" + user.getMobile() + "】密码：【" + user.getPassword() + "】随机字符串【" + random + "】请求登录");
		try {
			Subject subject = SecurityUtils.getSubject();
			AuthUserToken<User> token = new AuthUserToken<User>(user);
			subject.login(token);
			
			// 数据存入session;
			user = (User) subject.getPrincipal();
			user.setSessionId(this.getSession().getId());
			user.setPassword("");
			user.setAppId(model.get("appId"));
			if(user.getPayPassword()!=null && !user.getPayPassword().isEmpty()){
				user.setPayPassword("1");
			}else{
				user.setPayPassword("");
			}

			this.getSession().setAttribute(ElConstants.APP_USER_KEY, user);
			this.getSession().removeAttribute(SecurityConstants.PARAM_KEY_LONIN_RANDOM);
			return ResultUtils.renderSuccessResult(user);
		} catch (AuthenticationException e) {
			e.printStackTrace();
			throw new BaseException("用户名密码校验失败");
		}

	}

	/*
	 * ELB_USER_002 获取用户卡信息
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/getBankCards", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forGetBankCards(@RequestBody String data) {
		
		// session中获取用户id
		User _user = (User) this.getSession().getAttribute(ElConstants.APP_USER_KEY);
		// 获得用户银行卡信息
		String jql = "from BankCards b, CardType c where b.typeId=c.id and b.state=1 and b.personId = ? order by b.typeId ";
		List<Object[]> list = (List<Object[]>) bankCardsManager.findByJql(jql, _user.getPersonId());
		BankCards bankcard = null;
		CardType cardType = null;
		List<BankCards> bankCards = new ArrayList<BankCards>();
		for (Object[] obj : list) {
			bankcard = (BankCards) obj[0];
			cardType = (CardType) obj[1];
			if (bankcard != null) {
				bankcard.setCardType(cardType);
				bankCards.add(bankcard);
			}
		}

		return ResultUtils.renderSuccessResult(bankCards);
	}

	/**
	 * 
	 * ELB_USER_003 退出
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/logout", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forLogout() {
		// TODO shiro用户退出
		// 将用户信息从session中删除
		Subject subject = SecurityUtils.getSubject();
		if (subject.isAuthenticated()) {
			subject.logout(); // session 会销毁，在SessionListener监听session销毁，清理权限缓存
			User user = null;
			if(null != this.getSession().getAttribute(ElConstants.APP_USER_KEY)){
				user = (User) this.getSession().getAttribute(ElConstants.APP_USER_KEY);
				log.debug("用户[" + user.getId() + "]退出登录");
			}
			
		}

		return ResultUtils.renderSuccessResult();
	}

	/**
	 * 
	 * ELB_USER_004 注册
	 * 
	 * @param data
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/register", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forRegister(@RequestBody String data) {
		// 数据校验
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}

		Map dataMap = JSONUtils.deserialize(data, Map.class);
		if (null == dataMap) {
			throw new BaseException("输入数据为空！");
		}

		// 业务数据校验
		String mobile = dataMap.get("mobile").toString();
		String password = dataMap.get("encPsswd").toString();
		String appId = dataMap.get("appId").toString();
		String group = dataMap.get("group").toString();
		if (StringUtils.isEmpty(mobile)) {
			throw new BaseException("手机号为空！");
		}
		if (StringUtils.isEmpty(password)) {
			throw new BaseException("登陆密码为空！");
		}
		if (StringUtils.isEmpty(appId)) {
			throw new BaseException("产品编号为空！");
		}

		// 验证用户存在
		User user = this.userManager.findOne("from User u where u.mobile=? ", mobile);
		if (null != user) {
			throw new BaseException("该手机号码已经注册，请直接登录！");
		} else {
			user = new User();
		}
		user.setMobile(mobile);
		user.setPassword(password);
		
		user = this.userManager.save(user);
		Map<String, String> params = new HashMap<String, String>();
		String random = (String) this.getSession().getAttribute(SecurityConstants.PARAM_KEY_LONIN_RANDOM);
		params.put(SecurityConstants.PARAM_KEY_LONIN_RANDOM, random);

		String loginPasswdHash = SecurityUtil.encryptPin(SecurityConstants.PIN_TYPE_LOGIN, user.getId(), password, params);
		log.info("用户【" + user.getId() + "]的登录密码加密后为 " + loginPasswdHash);
		
		String  updSql = "UPDATE EL_USER SET PASSWORD = ?  WHERE ID =  ? ";
		this.userManager.executeSql(updSql, loginPasswdHash, user.getId() );
		
		AppUser appUser = new AppUser();
		// 生成产品用户关联记录
		appUser.setAppId(appId);
		appUser.setUserId(user.getId());
		appUser.setLogUser(user.getId());
		appUser.setLogGroups(group);
		appUser.setIsReg(AppUser.APPUSER_ISREG_YES);
		appUser.setState(AppUser.APPUSER_STATE_ON);
		appUser.setCreatedAt(DateUtils.getCurrentDateTimeStr());
		appUser = this.appUserManager.save(appUser);
		
		user.getAppUsers().add(appUser);

		// 数据存入session
		this.getSession().setAttribute(ElConstants.APP_USER_KEY, user);
		this.getSession().removeAttribute(SecurityConstants.PARAM_KEY_LONIN_RANDOM);
		user.setSessionId(this.getSession().getId());
		
		// TODO：调用账单系统，得到虚拟账户账号
		user.setPassword("");
		if(user.getPayPassword()!=null && !user.getPayPassword().isEmpty()){
			user.setPayPassword("1");
		}else{
			user.setPayPassword("");
		}
		return ResultUtils.renderSuccessResult(user);
	}

	/*
	 * ELB_USER_005 找回密码
	 */
	@RequestMapping(value = "/getPassword", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forGetPassword(@RequestBody String data) {
		// 数据校验
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}

		Map<String,String> model = JSONUtils.parseObject(data,new TypeReference<HashMap<String,String>>(){});
		
		if (null == model) {
			throw new BaseException("输入数据为空！");
		}
		
		// 业务数据校验
		String mobile = model.get("mobile");
		String password = model.get("encPsswd") ;
		if (StringUtils.isEmpty(mobile)) {
			throw new BaseException("电话号码为空！");
		}
		if (StringUtils.isEmpty(password)) {
			throw new BaseException("登陆密码为空！");
		}

		// 验证用户存在
		User _user = this.userManager.findOne("from User u where u.mobile = ? ", mobile);
		if (_user == null) {
			throw new BaseException("用户未注册！");
		}
		
		Map<String, String> params = new HashMap<String, String>();
		String random = (String) this.getSession().getAttribute(SecurityConstants.PARAM_KEY_LONIN_RANDOM);
		this.getSession().removeAttribute(SecurityConstants.PARAM_KEY_LONIN_RANDOM);
		params.put(SecurityConstants.PARAM_KEY_LONIN_RANDOM, random);
		
		String loginPasswdHash = SecurityUtil.encryptPin(SecurityConstants.PIN_TYPE_LOGIN, _user.getId(), password, params);
		log.info("用户【" + _user.getId() + "]的登录密码加密后为 " + loginPasswdHash);
		
		String  updSql = "UPDATE EL_USER SET PASSWORD = ?  WHERE ID =  ? ";
		this.userManager.executeSql(updSql, loginPasswdHash, _user.getId() );
		
		return ResultUtils.renderSuccessResult();
	}

	/*
	 * ELB_USER_006 设置头像
	 */
	@RequestMapping(value = "/setPortrait", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forSetPortrait(@RequestBody String data) {
		// 数据校验
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}

		User model = JSONUtils.deserialize(data, User.class);
		if (null == model) {
			throw new BaseException("输入数据为空！");
		}

		// 业务数据校验
		if (StringUtils.isEmpty(model.getPortrait())) {
			throw new BaseException("头像地址为空！");
		}

		// 验证用户存在
		User _user = (User) this.getSession().getAttribute(ElConstants.APP_USER_KEY);
		_user = this.userManager.get(_user.getId());
		
		_user.setPortrait(model.getPortrait());
		_user = this.userManager.save(_user);
		_user.setPassword("");
		if(_user.getPayPassword()!=null && !_user.getPayPassword().isEmpty()){
			_user.setPayPassword("1");
		}else{
			_user.setPayPassword("");
		}
		return ResultUtils.renderSuccessResult(_user);
	}

	/*
	 * ELB_USER_007 修改个人资料
	 */
	@RequestMapping(value = "/changeUserInfo", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forChangeUserInfo(@RequestBody String data) {
		// 数据校验
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}

		User model = JSONUtils.deserialize(data, User.class);
		if (null == model) {
			throw new BaseException("输入数据为空！");
		}
		User _user = (User) this.getSession().getAttribute(ElConstants.APP_USER_KEY);
		_user = this.userManager.get(_user.getId());
		if (!StringUtils.isEmpty(model.getEmail())) {
			System.out.println("email is not empty!!!");
			_user.setEmail(model.getEmail());
		}
		if (!StringUtils.isEmpty(model.getGender())) {
			_user.setGender(model.getGender());
		}
		if (!StringUtils.isEmpty(model.getNickname())) {
			_user.setNickname(model.getNickname());
		}
		if (!StringUtils.isEmpty(model.getQq())) {
			_user.setQq(model.getQq());
		}
		if (!StringUtils.isEmpty(model.getWechat())) {
			_user.setWechat(model.getWechat());
		}
		if (!StringUtils.isEmpty(model.getWeibo())) {
			_user.setWeibo(model.getWeibo());
		}

		_user = this.userManager.save(_user);
		_user.setPassword("");
		if(_user.getPayPassword()!=null &&!_user.getPayPassword().isEmpty()){
			_user.setPayPassword("1");
		}else{
			_user.setPayPassword("");
		}
		return ResultUtils.renderSuccessResult(_user);
	}

	
	/*
	 * ELB_USER_008 设置支付密码
	 */
	@RequestMapping(value = "/setPayPassword/{id}/{encpaypswd}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forSetPayPassword(@PathVariable("id") String id,@PathVariable("encpaypswd") String encpaypswd) {
		
		User _user = (User) this.getSession().getAttribute(ElConstants.APP_USER_KEY);
		if(!id.equals(_user.getId())){
			throw new BaseException("更新用户不匹配！");
		}
		Map<String, String> params = new HashMap<String, String>();
		String random = (String) this.getSession().getAttribute(SecurityConstants.PARAM_KEY_PAY_RANDOM);
		this.getSession().removeAttribute(SecurityConstants.PARAM_KEY_PAY_RANDOM);
		params.put(SecurityConstants.PARAM_KEY_PAY_RANDOM, random);
		
		_user = this.userManager.get(_user.getId());	
		//获取用户账户号
		String account = "0000000000000000";
		String payPasswdHash = SecurityUtil.encryptPin(SecurityConstants.PIN_TYPE_PAY, account, encpaypswd, params);
		
		
		log.info("用户【" + _user.getId() + "]的支付密码加密后为 " + payPasswdHash+"随机数为==="+payPasswdHash);
		Boolean check = SecurityUtil.verifyPin(SecurityConstants.PIN_TYPE_PAY, account, encpaypswd, payPasswdHash, params);
		
		String upSql = "UPDATE EL_USER SET PAY_PASSWORD = ? WHERE ID = ? ";
		this.userManager.executeSql(upSql, payPasswdHash,_user.getId());
		
		return ResultUtils.renderSuccessResult();
	}
	/*
	 * ELB_USER_009 修改支付密码
	 */
	@RequestMapping(value = "/changePayPassword/{id}/{encpaypswdOld}/{encpaypswd}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forChangePayPassword(@PathVariable("id") String id,@PathVariable("encpaypswdOld") String encpaypswdOld,@PathVariable("encpaypswd") String encpaypswd) {
		
		User _user = (User) this.getSession().getAttribute(ElConstants.APP_USER_KEY);
		if(!id.equals(_user.getId())){
			throw new BaseException("更新用户不匹配！");
		}
		_user = this.userManager.get(_user.getId());
		Map<String, String> params = new HashMap<String, String>();
		String random = (String) this.getSession().getAttribute(SecurityConstants.PARAM_KEY_PAY_RANDOM);
		this.getSession().removeAttribute(SecurityConstants.PARAM_KEY_PAY_RANDOM);
		params.put(SecurityConstants.PARAM_KEY_PAY_RANDOM, random);
		
		//获取用户账户号
		String account = "0000000000000000";
		Boolean check = SecurityUtil.verifyPin(SecurityConstants.PIN_TYPE_PAY,account.trim(),encpaypswdOld.trim(), _user.getPayPassword().trim(), params);
		if(check){
			String payPasswdHash = SecurityUtil.encryptPin(SecurityConstants.PIN_TYPE_PAY, account, encpaypswd, params);
			log.info("用户【" + _user.getId() + "],修改后的支付密码加密后为[ " + payPasswdHash + "]随机数为==="+random);
		}
		
		
		
//		String upSql = "UPDATE EL_USER SET PAY_PASSWORD = ? WHERE ID = ? ";
//		this.userManager.executeSql(upSql, payPasswdHash,_user.getId());
		
		return ResultUtils.renderSuccessResult();
	}
	/*
	 * ELB_USER_010 找回支付密码
	 */
	@RequestMapping(value = "/findPayPassword/{id}/{encpaypswd}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forFindPayPassword(@PathVariable("id") String id,@PathVariable("encpaypswd") String encpaypswd) {
		
		User _user = (User) this.getSession().getAttribute(ElConstants.APP_USER_KEY);
		if(!id.equals(_user.getId())){
			throw new BaseException("更新用户不匹配！");
		}
		_user = this.userManager.get(_user.getId());
		Map<String, String> params = new HashMap<String, String>();
		String random = (String) this.getSession().getAttribute(SecurityConstants.PARAM_KEY_PAY_RANDOM);
		this.getSession().removeAttribute(SecurityConstants.PARAM_KEY_PAY_RANDOM);
		params.put(SecurityConstants.PARAM_KEY_PAY_RANDOM, random);
		
		_user = this.userManager.get(_user.getId());	
		//获取用户账户号
		String account = "0000000000000000000000";
		String payPasswdHash = SecurityUtil.encryptPin(SecurityConstants.PIN_TYPE_PAY, account, encpaypswd, params);
		log.info("用户【" + _user.getId() + "]的支付密码加密后为[ " + payPasswdHash + "]");
		
		String upSql = "UPDATE EL_USER SET PAY_PASSWORD = ? WHERE ID = ? ";
		this.userManager.executeSql(upSql, payPasswdHash,_user.getId());
		
		return ResultUtils.renderSuccessResult();
	}
	/*
	 * ELB_USER_011 校验支付密码
	 */
	@RequestMapping(value = "/checkPayPassword/{id}/{encpaypswd}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forCheckPayPassword(@PathVariable("id") String id,@PathVariable("encpaypswd") String encpaypswd) {
		
		User _user = (User) this.getSession().getAttribute(ElConstants.APP_USER_KEY);
		if(!id.equals(_user.getId())){
			throw new BaseException("更新用户不匹配！");
		}
		_user = this.userManager.get(_user.getId());
		Map<String, String> params = new HashMap<String, String>();
		String random = (String) this.getSession().getAttribute(SecurityConstants.PARAM_KEY_PAY_RANDOM);
		this.getSession().removeAttribute(SecurityConstants.PARAM_KEY_PAY_RANDOM);
		params.put(SecurityConstants.PARAM_KEY_PAY_RANDOM, random);
		
		_user = this.userManager.get(_user.getId());	
		//获取用户账户号
		String account = "0000000000000000000000";
		String payPasswdHash = SecurityUtil.encryptPin(SecurityConstants.PIN_TYPE_PAY, account, encpaypswd, params);
		log.info("用户【" + _user.getId() + "]的支付密码加密后为[ " + payPasswdHash + "]");
		if(!payPasswdHash.equals(_user.getPayPassword())){
			throw new BaseException("原支付密码校验失败，请查证后再重新输入！");
		}
		
		return ResultUtils.renderSuccessResult();
	}
	/*
	 * ELB_USER_010 修改登录密码
	 */
	@RequestMapping(value = "/changePassword/{id}/{encpswd}/{oldencpswd}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forChangePassword(@PathVariable("id") String id,@PathVariable("encpswd") String encpswd,@PathVariable("oldencpswd") String oldencpswd) {
		// 数据校验

		User _user = (User) this.getSession().getAttribute(ElConstants.APP_USER_KEY);
		if(!id.equals(_user.getId())){
			throw new BaseException("更新用户不匹配！");
		}
		// 验证用户存在

		Map<String, String> params = new HashMap<String, String>();
		String random = (String) this.getSession().getAttribute(SecurityConstants.PARAM_KEY_LONIN_RANDOM);
		this.getSession().removeAttribute(SecurityConstants.PARAM_KEY_LONIN_RANDOM);
		params.put(SecurityConstants.PARAM_KEY_LONIN_RANDOM, random);
		
		String loginPasswdHashOld = SecurityUtil.encryptPin(SecurityConstants.PIN_TYPE_LOGIN, _user.getId(), oldencpswd, params);
		log.info("用户【" + _user.getId() + "]的原登录密码加密后为 " + loginPasswdHashOld);
		_user = this.userManager.get(_user.getId());
		if (!loginPasswdHashOld.equals(_user.getPassword())) {
			throw new BaseException("更新用户不匹配！");
		}
		
		String loginPasswdHash = SecurityUtil.encryptPin(SecurityConstants.PIN_TYPE_LOGIN, _user.getId(), encpswd, params);
		
		log.info("用户【" + _user.getId() + "]的登录密码加密后为 " + loginPasswdHash);
		
		String  updSql = "UPDATE EL_USER SET PASSWORD = ?  WHERE ID = ? ";
		this.userManager.executeSql(updSql, loginPasswdHash, _user.getId() );
		
		return ResultUtils.renderSuccessResult();
	}

	/*
	 * ELB_USER_012 修改手机号码
	 */
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/changeMobile", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forChangeMobile(@RequestBody String data) {
		// 数据校验
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}

		Map dataMap = JSONUtils.deserialize(data, Map.class);
		if (null == dataMap) {
			throw new BaseException("输入数据为空！");
		}

		// 业务数据校验
		String newMobile = dataMap.get("newMobile").toString();
		if (StringUtils.isEmpty(newMobile)) {
			throw new BaseException("手机号为空！");
		}
		// 更改的新手机号码不能被注册，
		User _user = this.userManager.findOne("from User u where u.mobile = ?", newMobile);
		if (_user != null) {
			throw new BaseException("该手机号码已注册！");
		}

		_user = (User) this.getSession().getAttribute(ElConstants.APP_USER_KEY);
		_user = this.userManager.get(_user.getId());
		_user.setMobile(newMobile);
		_user = this.userManager.save(_user);
		_user.setPassword("");
		if(_user.getPayPassword()!=null &&!_user.getPayPassword().isEmpty()){
			_user.setPayPassword("1");
		}else{
			_user.setPayPassword("");
		}
		return ResultUtils.renderSuccessResult(_user);
	}

	/*
	 * 用户列表查询
	 */
	@RequestMapping(value = "/list/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@PathVariable(value = "start") int start, @PathVariable(value = "pageSize") int pageSize,
			@RequestParam(value = "data") String data) {

		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}
		User model = JSONUtils.deserialize(data, User.class);

		StringBuffer jql = new StringBuffer("from User user where 1=1 ");
		List<String> values = new ArrayList<String>();
		if (null != model) {
			if (StringUtils.isNotBlank(model.getName())) {
				jql.append(" and user.name like ?");
				values.add("%" + model.getName() + "%");
			}
			if (StringUtils.isNotBlank(model.getGender())) {
				jql.append(" and user.gender = ?");
				values.add(model.getGender());
			}
			if (StringUtils.isNotBlank(model.getMobile())) {
				jql.append(" and user.mobile = ?");
				values.add(model.getMobile());
			}
			if (StringUtils.isNotBlank(model.getIdCardNo())) {
				jql.append(" and user.idCardNo = ?");
				values.add(model.getIdCardNo());
			}
		}

		Page page = new Page();
		page.setStart(start);
		page.setPageSize(pageSize);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		this.userManager.findPage(page);

		return ResultUtils.renderSuccessResult(page);
	}

	/*
	 * 用户信息查询
	 */
	@RequestMapping(value = "/{userId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("userId") String userId, @RequestParam(value = "data") String data) {
		User model = JSONUtils.deserialize(data, User.class);
		if (null == model) {
			throw new BaseException("输入数据为空！");
		}
		StringBuffer jql = new StringBuffer(
				"select distinct user,appUser from User user, AppUser appUser where user.id=appUser.userId");
		List<String> values = new ArrayList<String>();
		jql.append(" and appUser.userId = ?");
		values.add(userId);
		
		if (StringUtils.isNotBlank(model.getName())) {
			jql.append(" and user.name like ?");
			values.add("%" + model.getName() + "%");
		}
		if (StringUtils.isNotBlank(model.getGender())) {
			jql.append(" and user.gender = ?");
			values.add(model.getGender());
		}
		if (StringUtils.isNotBlank(model.getMobile())) {
			jql.append(" and user.mobile = ?");
			values.add(model.getMobile());
		}
		if (StringUtils.isNotBlank(model.getIdCardNo())) {
			jql.append(" and user.idCardNo = ?");
			values.add(model.getIdCardNo());
		}

		Page page = new Page();
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		this.userManager.findPage(page);

		return ResultUtils.renderSuccessResult(page);
	}

	/*
	 * ELH_MNG_011 查询患者（用户）列表 HOP2.1/HMP3.1 医院专属APP用户，需同时查出首次注册医院 1
	 */
	@RequestMapping(value = "/patients/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPatientList(@PathVariable(value = "start") int start,
			@PathVariable(value = "pageSize") int pageSize, @RequestParam(value = "data") String data) {

		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}

		User model = JSONUtils.deserialize(data, User.class);
		if (null == model) {
			throw new BaseException("输入数据为空！");
		}

		// 业务数据校验
		// if (StringUtils.isEmpty(model.getAppId())) {
		// throw new BaseException("产品编号为空！");
		// }

		StringBuffer jql = new StringBuffer(
				"select distinct apps,user,appUser from Apps apps,User user, AppUser appUser where apps.id=appUser.appId and user.id=appUser.userId");
		List<String> values = new ArrayList<String>();
//		jql.append(" and apps.hospId = ?");
//		values.add("123");
		if (StringUtils.isNotBlank(model.getName())) {
			jql.append(" and user.name like ?");
			values.add("%" + model.getName() + "%");
		}
		if (StringUtils.isNotBlank(model.getGender())) {
			jql.append(" and user.gender = ?");
			values.add(model.getGender());
		}
		if (StringUtils.isNotBlank(model.getMobile())) {
			jql.append(" and user.mobile = ?");
			values.add(model.getMobile());
		}
		if (StringUtils.isNotBlank(model.getIdCardNo())) {
			jql.append(" and user.idCardNo = ?");
			values.add(model.getIdCardNo());
		}

		Page page = new Page();
		page.setStart(start);
		page.setPageSize(pageSize);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		this.userManager.findPage(page);

		return ResultUtils.renderSuccessResult(page);
	}

	/*
	 * ELB_USER_0** 判断用户是否实名认证
	 */
	@RequestMapping(value = "/isRealName/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result isRealName(@PathVariable(value = "id") String id) {
		User user = userManager.get(id);
		if (user.getIdCardNo() == null || "".equals(user.getIdCardNo())) {
			return ResultUtils.renderFailureResult();
		}

		return ResultUtils.renderSuccessResult();
	}

	/*
	 * ELB_USER_0** 更新用户实名认证信息
	 */
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/isRealName/", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result saveRealName(@RequestBody String data) {
		Map map = JSONUtils.deserialize(data, Map.class);
		User user = userManager.get(ObjectIsNull(map.get("id")));
		user.setIdCardNo(ObjectIsNull(map.get("idCardNo")));
		user = userManager.save(user);

		return ResultUtils.renderSuccessResult(user);
	}

	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/genCheckCode/{mobile}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forGenCheckCode(@PathVariable(value = "mobile") String mobile, @RequestParam() boolean isMobileExist) {
		
		String vldSql = "select mobile from EL_USER where MOBILE = ? ";
		List<String> lst = (List<String>) this.userManager.findBySql(vldSql, mobile);
		
		if (null != lst && lst.size() > 0 && !isMobileExist) {
			throw new BaseException("手机号［" + mobile + "]已存在，请确定该手机号码未使用！");
		} else if ((isMobileExist && null == lst)
				|| (isMobileExist && lst.size() == 0)) {
			throw new BaseException("手机号［" + mobile + "]不存在，请确定登陆手机号码！");
		}
		
		String checkCode = SecurityUtil.genCheckCode(SecurityConstants.CHECKCODE_TYPE_SMS, mobile, 6, 5*60);
		Notice notice = new Notice();
		notice.setMode(Notice.NOT_MODE_MSG);
		notice.setType(Notice.NOT_TYPE_MSG_CHK);
		notice.getExtraParams().put("mobiles", mobile);
		notice.getExtraParams().put("checkCode", checkCode);
		notice.getExtraParams().put("time", "5");
		this.noticeService.send(notice);
		log.info("手机号【" + mobile + "】注册申请请求验证码为：" + checkCode );
		
		return ResultUtils.renderSuccessResult();
	}

	@RequestMapping(value = "/verifyCheckCode/{mobile}/{checkCode}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forVerCheckCode(@PathVariable(value = "mobile") String mobile,
			@PathVariable(value = "checkCode") String checkCode) {
		
		boolean flag = SecurityUtil.verifyCheckCode(SecurityConstants.CHECKCODE_TYPE_SMS, mobile, checkCode, 6, 5*60);
		
		log.info("手机号【" + mobile + "】注册申请输入验证码为：" + checkCode + "，验证结果：" + flag);
		flag = true;
		if (!flag) {
			throw new BaseException("验证码错误！");
		}
		String random = SecurityUtil.genRandom(16);
		this.getSession().setAttribute(SecurityConstants.PARAM_KEY_LONIN_RANDOM, random);
		Map<String, Object> result = new HashMap<>();
		result.put("success", true);
		result.put("random", random);
		result.put("modulus1", SecurityConstants.KEY_PUBLIC_MODULUS1);
		result.put("exponent1", SecurityConstants.KEY_PUBLIC_EXPONENT1);
		result.put("modulus2", SecurityConstants.KEY_PUBLIC_MODULUS2);
		result.put("exponent2", SecurityConstants.KEY_PUBLIC_EXPONENT2);
		
		return ResultUtils.renderSuccessResult(result);
	}
	
	@RequestMapping(value = "/pre/{type}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPre(@PathVariable("type") String type) {
		
		String random = SecurityUtil.genRandom(16);
		if("login".equals(type)){
			this.getSession().setAttribute(SecurityConstants.PARAM_KEY_LONIN_RANDOM, random);
		}else{
			this.getSession().setAttribute(SecurityConstants.PARAM_KEY_PAY_RANDOM, random);
		}
		
		Map<String, Object> result = new HashMap<>();
		result.put("success", true);
		result.put("random", random);
		result.put("modulus1", SecurityConstants.KEY_PUBLIC_MODULUS1);
		result.put("exponent1", SecurityConstants.KEY_PUBLIC_EXPONENT1);
		result.put("modulus2", SecurityConstants.KEY_PUBLIC_MODULUS2);
		result.put("exponent2", SecurityConstants.KEY_PUBLIC_EXPONENT2);
		return ResultUtils.renderSuccessResult(result);
	}

	public String ObjectIsNull(Object obj) {
		if (obj == null)
			return "";
		return obj.toString();
	}

}
