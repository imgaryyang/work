package com.infohold.bdrp.authority.shiro.authc;

import org.apache.shiro.authc.AccountException;

@SuppressWarnings("serial")
public class NoPasswordException extends AccountException{
	/**
     * Creates a new NoPasswordException.
     */
    public NoPasswordException() {
        super();
    }

    /**
     * Constructs a new NoPasswordException.
     *
     * @param message the reason for the exception
     */
    public NoPasswordException(String message) {
        super(message);
    }

    /**
     * Constructs a new NoPasswordException.
     *
     * @param cause the underlying Throwable that caused this exception to be thrown.
     */
    public NoPasswordException(Throwable cause) {
        super(cause);
    }

    /**
     * Constructs a new NoPasswordException.
     *
     * @param message the reason for the exception
     * @param cause   the underlying Throwable that caused this exception to be thrown.
     */
    public NoPasswordException(String message, Throwable cause) {
        super(message, cause);
    }
}
