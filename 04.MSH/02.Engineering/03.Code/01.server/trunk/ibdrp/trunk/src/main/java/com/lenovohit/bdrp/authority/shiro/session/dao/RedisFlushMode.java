package com.lenovohit.bdrp.authority.shiro.session.dao;

/**
 * Specifies when to write to the backing Redis instance.
 *
 * @author Rob Winch
 * @since 1.1
 */
public enum RedisFlushMode {
	/**
	 * Only writes to Redis when
	 * {@link SessionRepository#save(org.springframework.session.Session)} is
	 * invoked. In a web environment this is typically done as soon as the HTTP
	 * response is committed.
	 */
	ON_SAVE,

	/**
	 * Writes to Redis as soon as possible. For example
	 * {@link SessionRepository#createSession()} will write the session to
	 * Redis. Another example is that setting an attribute on the session will
	 * also write to Redis immediately.
	 */
	IMMEDIATE
}
