package com.lenovohit.mnis.base.aop;

import java.util.Date;
import java.util.List;

import javax.persistence.Transient;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.subject.support.DefaultSubjectContext;
import org.aspectj.lang.JoinPoint;

import com.lenovohit.bdrp.authority.model.AuthPrincipal;
import com.lenovohit.mnis.base.model.AuditableModel;

public class AuditableModelAspect {

	/*@Autowired
	private IRedisSequenceDao redisSequenceDao;*/

	public void audit(JoinPoint jp) {
		Object[] args = jp.getArgs();
		if (args == null)
			return;
		if (args.length != 1)
			return;
		Object arg = args[0];
		if (arg instanceof AuditableModel) {
			complete((AuditableModel) arg);
		} else if (arg instanceof List) {// 批量保存
			List<?> list = (List<?>) arg;
			for (Object m : list) {
				if (m instanceof AuditableModel)
					complete((AuditableModel) m);
			}
		}
	}

	private void complete(AuditableModel model) {
		AuditableModel baseModel = (AuditableModel) model;
		AuthPrincipal principal = this.getCurrentPrincipal();
		Date now = new Date();
		if(null == principal) {
			return;
		}
		if (null == baseModel.getCreatedBy()) {
			baseModel.setCreatedBy(principal.getId());
		}
		if (null == baseModel.getCreatedAt()) {
			baseModel.setCreatedAt(now);
		}
		baseModel.setUpdatedBy(principal.getId());
		baseModel.setUpdatedAt(now);
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
	
}
