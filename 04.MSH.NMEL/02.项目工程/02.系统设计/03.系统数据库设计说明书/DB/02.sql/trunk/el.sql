/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     2016/7/11 15:45:16                           */
/*==============================================================*/


DROP TABLE IF EXISTS EL_APPS;

DROP TABLE IF EXISTS EL_APP_AD;

DROP TABLE IF EXISTS EL_APP_AD_POS;

DROP TABLE IF EXISTS EL_APP_DOWNLOAD_CHANNEL;

DROP TABLE IF EXISTS EL_APP_FEEDBACK;

DROP TABLE IF EXISTS EL_APP_USER_REL;

DROP TABLE IF EXISTS EL_HOME_MENU;

DROP TABLE IF EXISTS EL_USER;

DROP TABLE IF EXISTS EL_USER_APP;

/*==============================================================*/
/* Table: EL_APPS                                               */
/*==============================================================*/
CREATE TABLE EL_APPS
(
   ID                   CHAR(32) NOT NULL,
   TYPE                 CHAR(1) COMMENT '1 - 易民生
            2 - 医院专属APP',
   BIZ_ID               CHAR(32) COMMENT '当为某医院专属APP时，需要关联医院ID',
   NAME                 VARCHAR(50),
   STATE                CHAR(1) COMMENT '1 - 正常
            2 - 已下线',
   ONLINE_AT            CHAR(19),
   OFFLINE_AT           CHAR(19),
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: EL_APP_AD                                             */
/*==============================================================*/
CREATE TABLE EL_APP_AD
(
   ID                   CHAR(32) NOT NULL,
   AD_POS_ID            CHAR(32),
   IMAGE                VARCHAR(100),
   MEMO                 VARCHAR(100),
   SORT_NUM             INT,
   LINK_ARTICLE         CHAR(1),
   ARTICLE              CHAR(32),
   STATE                CHAR(1) COMMENT '1 - 正常
            2 - 下线',
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: EL_APP_AD_POS                                         */
/*==============================================================*/
CREATE TABLE EL_APP_AD_POS
(
   ID                   CHAR(32) NOT NULL,
   APP_ID               CHAR(32),
   MEMO                 VARCHAR(100),
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: EL_APP_DOWNLOAD_CHANNEL                               */
/*==============================================================*/
CREATE TABLE EL_APP_DOWNLOAD_CHANNEL
(
   ID                   CHAR(32) NOT NULL,
   APP_ID               CHAR(32),
   CHANNEL              VARCHAR(20),
   DOWNLOADED           INT,
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: EL_APP_FEEDBACK                                       */
/*==============================================================*/
CREATE TABLE EL_APP_FEEDBACK
(
   ID                   CHAR(32) NOT NULL,
   APP_ID               CHAR(32) NOT NULL,
   HOSP_ID              CHAR(32) COMMENT '当为某医院专属APP时，需要关联医院ID',
   USER_ID              CHAR(32),
   FEEDBACK             VARCHAR(500),
   FEEDED_AT            CHAR(19),
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: EL_APP_USER_REL                                       */
/*==============================================================*/
CREATE TABLE EL_APP_USER_REL
(
   ID                   CHAR(32) NOT NULL,
   USER_ID              CHAR(32) NOT NULL,
   APP_ID               CHAR(32) NOT NULL,
   IS_REG               CHAR(1),
   STATE                CHAR(1) COMMENT '1 - 正常
            2 - 冻结',
   CREATED_AT           CHAR(19),
   EXPIRY_AT            CHAR(19),
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: EL_HOME_MENU                                          */
/*==============================================================*/
CREATE TABLE EL_HOME_MENU
(
   ID                   CHAR(32) NOT NULL,
   APP_ID               CHAR(32),
   CODE                 CHAR(20),
   TEXT                 VARCHAR(20),
   TEXT_SIZE            VARCHAR(3),
   TEXT_COLOR           VARCHAR(40),
   ICON                 VARCHAR(50),
   ICON_SIZE            VARCHAR(3),
   ICON_COLOR           VARCHAR(40),
   IMAGE                VARCHAR(200),
   IMAGE_RESOLUTION     VARCHAR(50),
   CONPONENT            VARCHAR(30),
   ON_CLICK             VARCHAR(30),
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: EL_USER                                               */
/*==============================================================*/
CREATE TABLE EL_USER
(
   ID                   CHAR(32) NOT NULL,
   NAME                 VARCHAR(100),
   ID_CARD_NO           CHAR(18),
   GENDER               CHAR(1),
   NICKNAME             VARCHAR(100),
   MOBILE               CHAR(11),
   PASSWORD             CHAR(50),
   PAY_PASSWORD         CHAR(50),
   EMAIL                VARCHAR(100),
   WECHAT               VARCHAR(50),
   WEIBO                VARCHAR(50),
   QQ                   VARCHAR(50),
   PORTRAIT             VARCHAR(200),
   PER_HOME_BG          VARCHAR(200),
   SI_ID                CHAR(20),
   PERSON_ID            CHAR(32),
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: EL_USER_APP                                           */
/*==============================================================*/
CREATE TABLE EL_USER_APP
(
   ID                   CHAR(32) NOT NULL,
   USER_ID              CHAR(32) NOT NULL,
   APP_ID               CHAR(32),
   IOS                  CHAR(1),
   ANDROID              CHAR(1),
   VERSION              CHAR(10),
   PRIMARY KEY (ID)
);

ALTER TABLE EL_APP_AD ADD CONSTRAINT FK_REFERENCE_24 FOREIGN KEY (AD_POS_ID)
      REFERENCES EL_APP_AD_POS (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE EL_APP_AD_POS ADD CONSTRAINT FK_REFERENCE_23 FOREIGN KEY (APP_ID)
      REFERENCES EL_APPS (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE EL_APP_DOWNLOAD_CHANNEL ADD CONSTRAINT FK_REFERENCE_28 FOREIGN KEY (APP_ID)
      REFERENCES EL_APPS (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE EL_APP_FEEDBACK ADD CONSTRAINT FK_REFERENCE_18 FOREIGN KEY (APP_ID)
      REFERENCES EL_APPS (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE EL_APP_FEEDBACK ADD CONSTRAINT FK_REFERENCE_19 FOREIGN KEY (USER_ID)
      REFERENCES EL_USER (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE EL_APP_USER_REL ADD CONSTRAINT FK_REFERENCE_1 FOREIGN KEY (USER_ID)
      REFERENCES EL_USER (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE EL_APP_USER_REL ADD CONSTRAINT FK_REFERENCE_2 FOREIGN KEY (APP_ID)
      REFERENCES EL_APPS (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE EL_HOME_MENU ADD CONSTRAINT FK_REFERENCE_11 FOREIGN KEY (APP_ID)
      REFERENCES EL_APPS (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE EL_USER_APP ADD CONSTRAINT FK_REFERENCE_26 FOREIGN KEY (USER_ID)
      REFERENCES EL_USER (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE EL_USER_APP ADD CONSTRAINT FK_REFERENCE_27 FOREIGN KEY (APP_ID)
      REFERENCES EL_APPS (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

