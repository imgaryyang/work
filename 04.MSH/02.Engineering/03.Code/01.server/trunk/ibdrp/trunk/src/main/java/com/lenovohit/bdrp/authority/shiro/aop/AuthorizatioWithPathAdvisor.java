package com.lenovohit.bdrp.authority.shiro.aop;

import java.lang.annotation.Annotation;
import java.lang.reflect.Method;
import java.util.Collection;

import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.apache.shiro.authz.annotation.RequiresGuest;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.apache.shiro.authz.annotation.RequiresRoles;
import org.apache.shiro.authz.annotation.RequiresUser;
import org.apache.shiro.authz.aop.AuthorizingAnnotationMethodInterceptor;
import org.apache.shiro.mgt.SecurityManager;
import org.apache.shiro.spring.security.interceptor.AopAllianceAnnotationsAuthorizingMethodInterceptor;
import org.apache.shiro.spring.security.interceptor.AuthorizationAttributeSourceAdvisor;
import org.springframework.core.annotation.AnnotationUtils;

import com.lenovohit.bdrp.authority.shiro.annotation.RequiresPathPermission;
@SuppressWarnings({"unchecked"})
public class AuthorizatioWithPathAdvisor extends AuthorizationAttributeSourceAdvisor {

	

	/**
	 * 
	 */
	private static final long serialVersionUID = 5556499461837052782L;

	private static final Class<? extends Annotation>[] AUTHZ_ANNOTATION_CLASSES = new Class[] {
			RequiresPermissions.class, RequiresRoles.class, RequiresUser.class,
			RequiresGuest.class, RequiresAuthentication.class,RequiresPathPermission.class, };

	protected SecurityManager securityManager = null;

	/**
	 * Create a new AuthorizationAttributeSourceAdvisor.
	 */
	public AuthorizatioWithPathAdvisor() {
		AopAllianceAnnotationsAuthorizingMethodInterceptor interceptor = new AopAllianceAnnotationsAuthorizingMethodInterceptor();
		Collection<AuthorizingAnnotationMethodInterceptor> col = interceptor
				.getMethodInterceptors();
		col.add(new PathPermissionAnnotationMethodInterceptor());
		setAdvice(interceptor);
	}

	public SecurityManager getSecurityManager() {
		return securityManager;
	}

	public void setSecurityManager(
			org.apache.shiro.mgt.SecurityManager securityManager) {
		this.securityManager = securityManager;
	}
	public boolean matches(Method method, Class targetClass) {
		Method m = method;

		if (isAuthzAnnotationPresent(m)) {
			return true;
		}

		// The 'method' parameter could be from an interface that doesn't have
		// the annotation.
		// Check to see if the implementation has it.
		if (targetClass != null) {
			try {
				m = targetClass.getMethod(m.getName(), m.getParameterTypes());
				if (isAuthzAnnotationPresent(m)) {
					return true;
				}
			} catch (NoSuchMethodException ignored) {
				// default return value is false. If we can't find the method,
				// then obviously
				// there is no annotation, so just use the default return value.
			}
		}

		return false;
	}

	private boolean isAuthzAnnotationPresent(Method method) {
		for (Class<? extends Annotation> annClass : AUTHZ_ANNOTATION_CLASSES) {
			Annotation a = AnnotationUtils.findAnnotation(method, annClass);
			if (a != null) {
				return true;
			}
		}
		return false;
	}

}
