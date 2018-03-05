/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     2017/12/15 11:14:47                          */
/*==============================================================*/


DROP TABLE IF EXISTS APP_AD;

DROP TABLE IF EXISTS APP_AD_POS;

DROP TABLE IF EXISTS APP_APPLICATION;

DROP TABLE IF EXISTS APP_DL_CHANNEL;

DROP TABLE IF EXISTS APP_FEEDBACK;

DROP TABLE IF EXISTS APP_MENU;

DROP TABLE IF EXISTS APP_USER_INSTALL;

DROP TABLE IF EXISTS APP_USER_LOGIN;

DROP TABLE IF EXISTS APP_USER_PATIENT;

/*==============================================================*/
/* Table: APP_AD                                                */
/*==============================================================*/
CREATE TABLE APP_AD
(
   ID                   CHAR(32) NOT NULL,
   AD_POS_ID            CHAR(32),
   IMAGE                VARCHAR(100),
   MEMO                 VARCHAR(100),
   SORT                 INT,
   LINK_ARTICLE         CHAR(1),
   ARTICLE              CHAR(32),
   STATUS               CHAR(1) COMMENT 'A - 初始
            0 - 正常
            1 - 冻结',
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: APP_AD_POS                                            */
/*==============================================================*/
CREATE TABLE APP_AD_POS
(
   ID                   CHAR(32) NOT NULL,
   APP_ID               CHAR(32),
   MEMO                 VARCHAR(100),
   STATUS               CHAR(1) COMMENT 'A - 初始
            0 - 正常
            1 - 冻结',
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: APP_APPLICATION                                       */
/*==============================================================*/
CREATE TABLE APP_APPLICATION
(
   ID                   CHAR(32) NOT NULL,
   TYPE                 CHAR(1) COMMENT '1 - 易民生
            2 - 医院专属APP',
   ORG_ID               CHAR(32) COMMENT '当为某医院专属APP时，需要关联医院ID',
   NAME                 VARCHAR(50),
   ONLINE_AT            DATETIME,
   OFFLINE_AT           DATETIME,
   STATUS               CHAR(1) COMMENT 'A - 初始
            0 - 正常
            1 - 冻结',
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: APP_DL_CHANNEL                                        */
/*==============================================================*/
CREATE TABLE APP_DL_CHANNEL
(
   ID                   CHAR(32) NOT NULL,
   APP_ID               CHAR(32),
   CHANNEL              VARCHAR(20),
   DOWNLOADED           INT,
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: APP_FEEDBACK                                          */
/*==============================================================*/
CREATE TABLE APP_FEEDBACK
(
   ID                   CHAR(32) NOT NULL,
   USER_ID              CHAR(32),
   APP_ID               CHAR(32) NOT NULL,
   HOSP_ID              CHAR(32) COMMENT '当为某医院专属APP时，需要关联医院ID',
   FEEDBACK             VARCHAR(500),
   FEEDED_AT            DATETIME,
   STATUS               CHAR(1) COMMENT 'A - 初始
            0 - 正常
            1 - 冻结',
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: APP_MENU                                              */
/*==============================================================*/
CREATE TABLE APP_MENU
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
   STATUS               CHAR(1) COMMENT 'A - 初始
            0 - 正常
            1 - 冻结',
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: APP_USER_INSTALL                                      */
/*==============================================================*/
CREATE TABLE APP_USER_INSTALL
(
   ID                   CHAR(32) NOT NULL,
   USER_ID              CHAR(32),
   APP_ID               CHAR(32),
   IOS                  CHAR(1),
   ANDROID              CHAR(1),
   VERSION              CHAR(10),
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: APP_USER_LOGIN                                        */
/*==============================================================*/
CREATE TABLE APP_USER_LOGIN
(
   ID                   CHAR(32) NOT NULL,
   USER_ID              CHAR(32),
   APP_ID               CHAR(32) NOT NULL,
   IS_REG               CHAR(1),
   EXPIRY_AT            DATETIME,
   LOG_SYSTEM           VARCHAR(50) COMMENT 'ios
            android
            winphone
            web',
   LOG_VERSION          VARCHAR(20),
   LOG_USER             VARCHAR(50),
   LOG_GROUPS           VARCHAR(100),
   STATUS               CHAR(1) COMMENT 'A - 初始
            0 - 正常
            1 - 冻结',
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: APP_USER_PATIENT                                      */
/*==============================================================*/
CREATE TABLE APP_USER_PATIENT
(
   ID                   CHAR(32) NOT NULL,
   PATIENT_ID           CHAR(32),
   USER_ID              CHAR(32),
   RELATION             CHAR(2),
   ALIAS                VARCHAR(50),
   PHOTO                VARCHAR(200),
   STATUS               CHAR(1),
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

ALTER TABLE APP_AD ADD CONSTRAINT FK_AD_APP FOREIGN KEY (AD_POS_ID)
      REFERENCES APP_AD_POS (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE APP_AD_POS ADD CONSTRAINT FK_ADPOS_APP FOREIGN KEY (APP_ID)
      REFERENCES APP_APPLICATION (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE APP_DL_CHANNEL ADD CONSTRAINT FK_DLCHL_APP FOREIGN KEY (APP_ID)
      REFERENCES APP_APPLICATION (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE APP_FEEDBACK ADD CONSTRAINT FK_FEEDBACK_APP FOREIGN KEY (APP_ID)
      REFERENCES APP_APPLICATION (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE APP_MENU ADD CONSTRAINT FK_MENU_APP FOREIGN KEY (APP_ID)
      REFERENCES APP_APPLICATION (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE APP_USER_INSTALL ADD CONSTRAINT FK_USERINS_APP FOREIGN KEY (APP_ID)
      REFERENCES APP_APPLICATION (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE APP_USER_LOGIN ADD CONSTRAINT FK_APPUSER_APP FOREIGN KEY (APP_ID)
      REFERENCES APP_APPLICATION (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

