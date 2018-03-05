package com.lenovohit.hcp.base.aop;

import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import javax.persistence.Table;
import javax.persistence.Transient;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.UnauthenticatedException;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.subject.support.DefaultSubjectContext;
import org.aspectj.lang.JoinPoint;
import org.springframework.beans.factory.annotation.Autowired;

import com.lenovohit.bdrp.authority.model.AuthPrincipal;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.model.BaseIdModel;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hcp.HCPConstants;
import com.lenovohit.hcp.base.annotation.RedisSequence;
import com.lenovohit.hcp.base.configuration.RedisSequenceConfig;
import com.lenovohit.hcp.base.manager.IRedisSequenceManager;
import com.lenovohit.hcp.base.model.HcpBaseModel;
import com.lenovohit.hcp.base.model.HcpUser;

public class HcpModelAspect {

	/*@Autowired
	private IRedisSequenceDao redisSequenceDao;*/
	
	@Autowired
	private IRedisSequenceManager redisSequenceManager;

	public void audit(JoinPoint jp) {
		Object[] args = jp.getArgs();
		if (args == null)
			return;
		if (args.length != 1)
			return;
		Object arg = args[0];
		if (arg instanceof HcpBaseModel) {
			complete((HcpBaseModel) arg);
		} else if (arg instanceof List) {// 批量保存
			List<?> list = (List<?>) arg;
			for (Object m : list) {
				if (m instanceof HcpBaseModel)
					complete((HcpBaseModel) m);
			}
		}
		// 设置redis sequence
		if (arg instanceof BaseIdModel) {
			setSequence((BaseIdModel) arg);
		} else if (arg instanceof List) {// 批量保存
			List<?> list = (List<?>) arg;
			for (Object m : list) {
				if (m instanceof BaseIdModel)
					setSequence((BaseIdModel) m);
			}
		}
	}

	private void complete(HcpBaseModel model) {
		HcpBaseModel baseModel = (HcpBaseModel) model;
		Date now = new Date();
		if(!model.isStateless()){
			HcpUser user = this.getCurrentUser();
			if (null == baseModel.getHosId()) {
				baseModel.setHosId(user.getHosId());
			}
			if (null == baseModel.getCreateOper()) {
				baseModel.setCreateOper(user.getName());
			}

			if (null == baseModel.getCreateOperId()) {
				baseModel.setCreateOperId(user.getId());
			}
			
			baseModel.setUpdateOperId(user.getId());
			baseModel.setUpdateOper(user.getName());
		}
		
		if (null == baseModel.getCreateTime()) {
			baseModel.setCreateTime(now);
		}
		baseModel.setUpdateTime(now);
	}

	private void setSequence(BaseIdModel baseModel) {
		// 自动获取业务编码
		String tableName;
		String colName;
		// 获取实体对应的数据库表信息
		Table table = baseModel.getClass().getAnnotation(Table.class);
		if (table != null) {
			// 获取数据库表名
			tableName = table.name().toUpperCase();
			Method[] methods = baseModel.getClass().getMethods();
			for (int i = 0; i < methods.length; i++) {
				Method m = methods[i];
				RedisSequence rs = m.getAnnotation(RedisSequence.class);
				// 通过注解判断需要获取编码的get方法
				if (rs != null) {
					try {
						String methodName = m.getName();
						String fieldName = methodName.replaceFirst("get", "");
						fieldName = fieldName.substring(0, 1).toLowerCase() + fieldName.substring(1);
						// 将驼峰写法的fieldName转换为带下划线的数据库字段名
						colName = HcpModelAspect.camelToUnderline(fieldName);
						// 获取编码规则
						RedisSequenceConfig config = HCPConstants.SEQUENCE_RULE.get(tableName + "_" + colName);
						if (null != config) {
							Class type = m.getReturnType();
							String typeName = type.getSimpleName().toUpperCase();
							// 定长字符或日期字符型编码，且对应的field为String
							if ((RedisSequenceConfig.SEQ_TYPE_FIXED_STRING == config.getType() 
									|| RedisSequenceConfig.SEQ_TYPE_DATE_STRING == config.getType()) 
									&& typeName.equals("STRING")) {

								// 获取field值
								Object fieldValue = m.invoke(baseModel);
								// 取field对应的set方法
								Method fieldSetMethod = baseModel.getClass().getMethod(parseSetMethodName(fieldName), String.class);
								// 如果当前方法返回的值为空，则取对应编码赋值
								if (StringUtils.isEmpty(fieldValue)) {
									String seq = redisSequenceManager.get(tableName, colName);
									// 用得到的编码赋值
									fieldSetMethod.invoke(baseModel, (Object) seq);
								}
							// 数字型编码，且对应的field为Integer、Double或BigDecimal
							} else if (RedisSequenceConfig.SEQ_TYPE_NUMBER == config.getType() && (
									typeName.equals("INTEGER")
									|| typeName.equals("DOUBLE")
									|| typeName.equals("BIGDECIMAL")
									)) {
								
								// 获取field值
								Object fieldValue = m.invoke(baseModel);
								// 取field对应的set方法
								Method fieldSetMethod = baseModel.getClass().getMethod(parseSetMethodName(fieldName), type);
								// 如果当前方法返回的值为空，则取对应编码赋值
								if (null == fieldValue) {
									BigDecimal seq = redisSequenceManager.getSeq(tableName, colName).getSeq();
									// 用得到的编码赋值
									if (typeName.equals("INTEGER")) fieldSetMethod.invoke(baseModel, new Integer(seq.intValue()));
									else if (typeName.equals("DOUBLE")) fieldSetMethod.invoke(baseModel, new Double(seq.doubleValue()));
									else if (typeName.equals("BIGDECIMAL")) fieldSetMethod.invoke(baseModel, seq);
								}
							}
						}
					} catch (Exception e) {
						e.printStackTrace();
						throw new BaseException(e);
					}
				}
			}
		}
	}
	@Transient
	protected HcpUser getCurrentUser() {
		AuthPrincipal user = this.getCurrentPrincipal();
		if (null == user) {
			throw new UnauthenticatedException("当前无登录用户");
		}
		if (!(user instanceof HcpUser)) {
			HcpUser hcpUser = new HcpUser();
			hcpUser.setId(user.getId());
			hcpUser.setName(user.getName());
			return hcpUser;
		}
		return (HcpUser) user;
	}

	@Transient
	protected AuthPrincipal getCurrentPrincipal() {
		Subject subject = SecurityUtils.getSubject();
		Session session = subject.getSession();
		PrincipalCollection principals = (PrincipalCollection) session
				.getAttribute(DefaultSubjectContext.PRINCIPALS_SESSION_KEY);
		if (null == principals)
			return null;
		AuthPrincipal principal = (AuthPrincipal) principals.getPrimaryPrincipal();
		return principal;
	}

	/**
	 * 驼峰转下划线
	 * 
	 * @param param
	 * @return
	 */
	@Transient
	public static final String camelToUnderline(String param) {
		if (param == null || "".equals(param.trim())) {
			return "";
		}
		int len = param.length();
		StringBuilder sb = new StringBuilder(len);
		for (int i = 0; i < len; i++) {
			char c = param.charAt(i);
			if (i != 0 && Character.isUpperCase(c)) {
				sb.append("_");
				sb.append(Character.toUpperCase(c));
			} else {
				sb.append(Character.toUpperCase(c));
			}
		}
		return sb.toString();
	}
	
	/**
	 * 拼接某属性的 get方法
	 * 
	 * @param fieldName
	 * @return String
	 */
	public static String parseGetMethodName(String fieldName) {
		if (null == fieldName || "".equals(fieldName)) {
			return null;
		}
		int startIndex = 0;
		if (fieldName.charAt(0) == '_')
			startIndex = 1;
		return "get" + fieldName.substring(startIndex, startIndex + 1).toUpperCase()
				+ fieldName.substring(startIndex + 1);
	}

	/**
	 * 拼接在某属性的 set方法
	 * 
	 * @param fieldName
	 * @return String
	 */
	public static String parseSetMethodName(String fieldName) {
		if (null == fieldName || "".equals(fieldName)) {
			return null;
		}
		int startIndex = 0;
		if (fieldName.charAt(0) == '_')
			startIndex = 1;
		return "set" + fieldName.substring(startIndex, startIndex + 1).toUpperCase()
				+ fieldName.substring(startIndex + 1);
	}

	/**
	 * 根据编码规则取最终编码
	 * 
	 * @param tableName
	 * @param colName
	 * @return
	 */
	/*@Transient
	private String getFullCode(String tableName, String colName) {
		String key = tableName + "_" + colName;
		if (null != HCPConstants.SEQUENCE_RULE.get(key)) {
			RedisSequenceConfig config = HCPConstants.SEQUENCE_RULE.get(key);
			com.lenovohit.hcp.base.model.RedisSequence rs = redisSequenceDao.get(key, config.getLength());
			return config.getPrefix() + rs.getSeqStr();
		}
		return null;
	}*/

}
