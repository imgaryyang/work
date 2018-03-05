package com.infohold.bdrp.authority.shiro.session.dao.impl;

import java.io.Serializable;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import org.apache.shiro.session.Session;
import org.apache.shiro.session.mgt.SimpleSession;
import org.apache.shiro.session.mgt.eis.EnterpriseCacheSessionDAO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.BoundHashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.JdkSerializationRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.stereotype.Repository;
import org.springframework.util.Assert;

import com.infohold.bdrp.authority.shiro.session.dao.RedisFlushMode;
import com.infohold.bdrp.authority.shiro.session.events.SessionCreatedEvent;
import com.infohold.bdrp.authority.shiro.session.events.SessionDeletedEvent;
import com.infohold.bdrp.authority.shiro.session.events.SessionDestroyedEvent;
import com.infohold.bdrp.authority.shiro.session.events.SessionExpiredEvent;
import com.infohold.bdrp.common.session.data.redis.serializer.BdrpRedisSeriaziler;
import com.infohold.core.utils.BeanUtils;

@Repository("redisSessionDao")
public class RedisSessionDaoImpl extends EnterpriseCacheSessionDAO implements InitializingBean,MessageListener {
	
	private static Logger log = LoggerFactory.getLogger(RedisSessionDaoImpl.class);
	
	@Value("${app.session.storage.redis.prefix:app:sessions}")
	String DEFAULT_APP_SESSION_REDIS_PREFIX = "app:sessions:";
	
	/**
	 * The key in the Hash representing
	 * {@link org.springframework.session.ExpiringSession#getCreationTime()}.
	 */
	static final String CREATION_TIME_ATTR = "creationTime";

	/**
	 * The key in the Hash representing
	 * {@link org.springframework.session.ExpiringSession#getMaxInactiveIntervalInSeconds()}
	 * .
	 */
	static final String MAX_INACTIVE_ATTR = "maxInactiveInterval";

	/**
	 * The key in the Hash representing
	 * {@link org.springframework.session.ExpiringSession#getLastAccessedTime()}.
	 */
	static final String LAST_ACCESSED_ATTR = "lastAccessedTime";

	/**
	 * The prefix of the key for used for session attributes. The suffix is the name of
	 * the session attribute. For example, if the session contained an attribute named
	 * attributeName, then there would be an entry in the hash named
	 * sessionAttr:attributeName that mapped to its value.
	 */
	static final String SESSION_ATTR_PREFIX = "sessionAttr:";
	
	/**
	 * If non-null, this value is used to override the default value for
	 * {@link RedisSession#setMaxInactiveIntervalInSeconds(int)}.
	 */
	@Value("${server.session.timeout:3600000}")
	private long defaultMaxInactiveInterval = 3600000;
	
	private String keyPrefix = DEFAULT_APP_SESSION_REDIS_PREFIX;
	
	private RedisFlushMode redisFlushMode = RedisFlushMode.ON_SAVE;
	
//	private final RedisSessionExpirationPolicy expirationPolicy;
	
	private RedisSerializer<Object> defaultSerializer = new BdrpRedisSeriaziler();
	
	private ApplicationEventPublisher eventPublisher = new ApplicationEventPublisher() {
		public void publishEvent(ApplicationEvent event) {
		}

		public void publishEvent(Object event) {
		}
	};
	
	
	
	private RedisTemplate<Object, Object> redisTemplate;
	
	@Autowired
	private RedisConnectionFactory connectionFactory;
//	private boolean hasInited = false;
	
	public RedisSessionDaoImpl() {
		super();
//		this.expirationPolicy = new RedisSessionExpirationPolicy(redisTemplate,
//				this);
	}
	
	/**
	 * Sets the {@link ApplicationEventPublisher} that is used to publish
	 * {@link SessionDestroyedEvent}. The default is to not publish a
	 * {@link SessionDestroyedEvent}.
	 *
	 * @param applicationEventPublisher the {@link ApplicationEventPublisher} that is used
	 * to publish {@link SessionDestroyedEvent}. Cannot be null.
	 */
	public void setApplicationEventPublisher(
			ApplicationEventPublisher applicationEventPublisher) {
		Assert.notNull(applicationEventPublisher,
				"applicationEventPublisher cannot be null");
		this.eventPublisher = applicationEventPublisher;
	}
	
	private void initRedisTemplate() {
		this.redisTemplate = new RedisTemplate<Object, Object>();
		this.redisTemplate.setKeySerializer(new StringRedisSerializer());
		this.redisTemplate.setHashKeySerializer(new StringRedisSerializer());
		this.redisTemplate.setDefaultSerializer(this.defaultSerializer);
		this.redisTemplate.setConnectionFactory(connectionFactory);
		this.redisTemplate.afterPropertiesSet();
	}
	
	/**
	 * Sets the maximum inactive interval in seconds between requests before newly created
	 * sessions will be invalidated. A negative time indicates that the session will never
	 * timeout. The default is 3600000 (30 minutes).
	 *
	 * @param defaultMaxInactiveInterval the number of seconds that the {@link Session}
	 * should be kept alive between client requests.
	 */
	public void setDefaultMaxInactiveInterval(long defaultMaxInactiveInterval) {
		this.defaultMaxInactiveInterval = defaultMaxInactiveInterval;
	}
	
	
	public long getDefaultMaxInactiveInterval() {
		return defaultMaxInactiveInterval*1000;
	}

	/**
	 * Sets the default redis serializer. Replaces default serializer which is based on
	 * {@link JdkSerializationRedisSerializer}.
	 *
	 * @param defaultSerializer the new default redis serializer
	 */
	public void setDefaultSerializer(RedisSerializer<Object> defaultSerializer) {
		Assert.notNull(defaultSerializer, "defaultSerializer cannot be null");
		this.defaultSerializer = defaultSerializer;
	}

	/**
	 * Sets the redis flush mode. Default flush mode is {@link RedisFlushMode#ON_SAVE}.
	 *
	 * @param redisFlushMode the new redis flush mode
	 */
	public void setRedisFlushMode(RedisFlushMode redisFlushMode) {
		Assert.notNull(redisFlushMode, "redisFlushMode cannot be null");
		this.redisFlushMode = redisFlushMode;
	}

	public void save(RedisSession session) {
		session.saveDelta();
		if (session.isNew()) {
			String sessionCreatedKey = getSessionCreatedChannel(session.getId().toString());
			this.redisTemplate.convertAndSend(sessionCreatedKey, session);
			session.setNew(false);
		}
	}
	
	@Override
	protected Serializable doCreate(Session session) {
		Serializable sessionId = generateSessionId(session);
        assignSessionId(session, sessionId);

        RedisSession redisSession = new RedisSession(session);
		redisSession.setTimeout(this.getDefaultMaxInactiveInterval());
		session.setTimeout(getDefaultMaxInactiveInterval());
		redisSession.setNew(true);
		this.save(redisSession);
		return sessionId;
	}
	protected void doDelete(Session session) {
		if(null != this.getSession(session.getId().toString())){
			this.redisTemplate.delete(this.getSessionKey(session.getId().toString()));
		}
		
	}

	protected void doUpdate(Session session) {
		RedisSession rs = this.getSession(session.getId().toString());
		BeanUtils.copyProperties(session, rs);
		rs.transSession(session);
		this.save(rs);
	}


	@Override
	protected Session doReadSession(Serializable sessionId) {
		return this.getSession(sessionId.toString());
	}
	
	/**
	 * Gets the Hash key for this session by prefixing it appropriately.
	 *
	 * @param sessionId the session id
	 * @return the Hash key for this session by prefixing it appropriately.
	 */
	String getSessionKey(String sessionId) {
		return this.keyPrefix + sessionId;
	}
	
	/**
	 * Gets the {@link BoundHashOperations} to operate on a {@link Session}.
	 * @param sessionId the id of the {@link Session} to work with
	 * @return the {@link BoundHashOperations} to operate on a {@link Session}
	 */
	private BoundHashOperations<Object, Object,Object> getSessionBoundHashOperations(
			String sessionId) {
		Serializable key = getSessionKey(sessionId);
		return this.redisTemplate.boundHashOps(key);
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		initRedisTemplate();
//		this.expirationPolicy.setRedis(this.redisTemplate);
	}

	/**
	 * Gets the key for the specified session attribute.
	 *
	 * @param attributeName the attribute name
	 * @return the attribute key name
	 */
	static String getSessionAttrNameKey(String attributeName) {
		return SESSION_ATTR_PREFIX + attributeName;
	}
	
	String getExpirationsKey(long expiration) {
		return this.keyPrefix + "expirations:" + expiration;
	}
	
	private String getSessionCreatedChannel(String sessionId) {
		return getSessionCreatedChannelPrefix() + sessionId;
	}

	private String getExpiredKeyPrefix() {
		return this.keyPrefix + "sessions:" + "expires:";
	}

	/**
	 * Gets the prefix for the channel that SessionCreatedEvent are published to. The
	 * suffix is the session id of the session that was created.
	 *
	 * @return the prefix for the channel that SessionCreatedEvent are published to
	 */
	public String getSessionCreatedChannelPrefix() {
		return this.keyPrefix + "event:created:";
	}

	public RedisSession getSession(String id) {
		return getSession(id, false);
	}
	
	/**
	 * Gets the session.
	 * @param id the session id
	 * @param allowExpired if true, will also include expired sessions that have not been
	 * deleted. If false, will ensure expired sessions are not returned.
	 * @return the Redis session
	 */
	private RedisSession getSession(String id, boolean allowExpired) {
		Map<Object, Object> entries = getSessionBoundHashOperations(id).entries();
		if (entries.isEmpty()) {
			return null;
		}
		RedisSession loaded = loadSession(id, entries);
		if (!allowExpired && loaded.isExpired()) {
			return null;
		}
		RedisSession result = new RedisSession(loaded);
		result.originalLastAccessTime = loaded.getLastAccessTime().getTime();
		return result;
	}

	private RedisSession loadSession(String id, Map<Object, Object> entries) {
		if ( null == entries){
			return null;
		}
		RedisSession loaded = new RedisSession();
		loaded.setId(id);
		for (Map.Entry<Object, Object> entry : entries.entrySet()) {
			String key = (String) entry.getKey();
			if (CREATION_TIME_ATTR.equals(key)) {
				loaded.setStartTimestamp(new Date((Long) entry.getValue()));
			}
			else if (MAX_INACTIVE_ATTR.equals(key)) {
				loaded.setTimeout(Long.parseLong(entry.getValue().toString()));
			}
			else if (LAST_ACCESSED_ATTR.equals(key)) {
				loaded.setLastAccessTime(new Date((Long) entry.getValue()));
			}
			else if (key.startsWith(SESSION_ATTR_PREFIX)) {
				loaded.setAttribute(key.substring(SESSION_ATTR_PREFIX.length()),
						entry.getValue());
			}
		}
		
		return loaded;
	}
	
	
	/**
	 * A custom implementation of {@link Session} that uses a {@link MapSession} as the
	 * basis for its mapping. It keeps track of any attributes that have changed. When
	 * {@link org.springframework.session.data.redis.RedisOperationsSessionRepository.RedisSession#saveDelta()}
	 * is invoked all the attributes that have been changed will be persisted.
	 *
	 * @author Rob Winch
	 * @since 1.0
	 */
	
	final class RedisSession extends SimpleSession {
		private static final long serialVersionUID = 6286173611101351851L;
		private Long originalLastAccessTime;
		private boolean isNew;
		private Map<String, Object> delta = new HashMap<String, Object>();
		/**
		 * Creates a new instance ensuring to mark all of the new attributes to
		 * be persisted in the next save operation.
		 */
		RedisSession() {
			this(UUID.randomUUID().toString());
			this.isNew = true;
			this.setTimeout(getDefaultMaxInactiveInterval());
			flushImmediateIfNecessary();
			
		}

		/**
		 * Creates a new instance from the provided {@link MapSession}.
		 *
		 * @param cached
		 *            the {@MapSession} that represents the persisted session
		 *            that was retrieved. Cannot be null.
		 */
		RedisSession(Session session) {
			Assert.notNull("Session cannot be null");
			this.setTimeout(getDefaultMaxInactiveInterval());
			BeanUtils.copyProperties(session, this);
			if(null == session.getId()){
				this.setId(UUID.randomUUID().toString());
			}
		}

		public RedisSession(String id) {
			super.setId(id);
			this.setTimeout(getDefaultMaxInactiveInterval());
		}
		
		public void setNew(boolean isNew) {
			this.isNew = isNew;
		}
		
		public boolean isNew() {
			return this.isNew;
		}
		
		public Object getAttribute(String attributeName) {
			return super.getAttribute(attributeName);
		}

		public void setAttribute(String attributeName, Object attributeValue) {
			super.setAttribute(attributeName, attributeValue);
			this.delta.put(getSessionAttrNameKey(attributeName), attributeValue);
			flushImmediateIfNecessary();
		}

		public void removeAttribute(String attributeName) {
			super.removeAttribute(attributeName);
			this.delta.remove(getSessionAttrNameKey(attributeName));
			flushImmediateIfNecessary();
		}

		private void flushImmediateIfNecessary() {
			if (RedisSessionDaoImpl.this.redisFlushMode == RedisFlushMode.IMMEDIATE) {
				saveDelta();
			}
		}

		/**
		 * Saves any attributes that have been changed and updates the
		 * expiration of this session.
		 */
		private void saveDelta() {
			String sessionId = this.getId().toString();
			this.transSession(this);
			getSessionBoundHashOperations(sessionId).putAll(this.delta);
//			Long originalExpiration = this.originalLastAccessTime == null ? null
//					: this.originalLastAccessTime + TimeUnit.SECONDS.toMillis(this.getTimeout());
//			RedisSessionDaoImpl.this.expirationPolicy.onExpirationUpdated(originalExpiration, this);
		}

		public Long getOriginalLastAccessTime() {
			return originalLastAccessTime;
		}

		public void setOriginalLastAccessTime(Long originalLastAccessTime) {
			this.originalLastAccessTime = originalLastAccessTime;
		}

		private void  transSession(Session session) {  
	        if(session == null){  
	        	return;
	        } 
	        this.delta.clear();
	        this.delta.put(CREATION_TIME_ATTR, session.getStartTimestamp().getTime());
			this.delta.put(MAX_INACTIVE_ATTR, session.getTimeout());
			this.delta.put(LAST_ACCESSED_ATTR, session.getLastAccessTime().getTime());
			for(Object key : session.getAttributeKeys()){
				this.delta.put(getSessionAttrNameKey(key.toString()), session.getAttribute(key));
			}
	    }  
		
	}

	@SuppressWarnings("unchecked")
	@Override
	public void onMessage(Message message, byte[] pattern) {
		byte[] messageChannel = message.getChannel();
		byte[] messageBody = message.getBody();
		if (messageChannel == null || messageBody == null) {
			return;
		}

		String channel = new String(messageChannel);

		if (channel.startsWith(getSessionCreatedChannelPrefix())) {
			// TODO: is this thread safe?
			Map<Object, Object> loaded = (Map<Object, Object>) this.defaultSerializer
					.deserialize(message.getBody());
			handleCreated(loaded, channel);
			return;
		}

		String body = new String(messageBody);
		if (!body.startsWith(getExpiredKeyPrefix())) {
			return;
		}

		boolean isDeleted = channel.endsWith(":del");
		if (isDeleted || channel.endsWith(":expired")) {
			int beginIndex = body.lastIndexOf(":") + 1;
			int endIndex = body.length();
			String sessionId = body.substring(beginIndex, endIndex);

			RedisSession session = getSession(sessionId, true);

			if (log.isDebugEnabled()) {
				log.debug("Publishing SessionDestroyedEvent for session " + sessionId);
			}


			if (isDeleted) {
				handleDeleted(sessionId, session);
			}
			else {
				handleExpired(sessionId, session);
			}

			return;
		}
	}
	
	public void handleCreated(Map<Object, Object> loaded, String channel) {
		String id = channel.substring(channel.lastIndexOf(":") + 1);
		RedisSession session = loadSession(id, loaded);
		publishEvent(new SessionCreatedEvent(this, session));
	}

	private void handleDeleted(String sessionId, RedisSession session) {
		if (session == null) {
			publishEvent(new SessionDeletedEvent(this, sessionId));
		}
		else {
			publishEvent(new SessionDeletedEvent(this, session));
		}
	}

	private void handleExpired(String sessionId, RedisSession session) {
		if (session == null) {
			publishEvent(new SessionExpiredEvent(this, sessionId));
		}
		else {
			publishEvent(new SessionExpiredEvent(this, session));
		}
	}

	private void publishEvent(ApplicationEvent event) {
		try {
			this.eventPublisher.publishEvent(event);
		}
		catch (Throwable ex) {
			log.error("Error publishing " + event + ".", ex);
		}
	}
}
