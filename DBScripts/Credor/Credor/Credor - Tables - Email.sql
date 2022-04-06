-----------------------------------------------------------------------------------------------------------------------------------------------
/*	CREATE TABLE SCRIPTS 

	1. CredorFromEmailAddress
	2. CredorDomain
	3. EmailTemplate
	4. EmailRecipient
	5. EmailType
	6. EmailProvider
	7. CredorEmailProvider
	8. EmailStatus
	9. CredorEmailDetail
	10. CredorEmail
	11. EmailAttachment
*/
-----------------------------------------------------------------------------------------------------------------------------------------------
IF OBJECT_ID (N'CredorDomain', N'U') IS NOT NULL
BEGIN
	DROP TABLE dbo.CredorDomain
	PRINT 'Table [CredorDomain] Dropped'
END
IF OBJECT_ID (N'CredorDomain', N'U') IS NULL
BEGIN
	CREATE TABLE dbo.CredorDomain
(
	Id INT NOT NULL CONSTRAINT PK_CredorDomain PRIMARY KEY (Id) IDENTITY (1,1),			
	[Name] VARCHAR(100) NOT NULL,	
	Active BIT NOT NULL,
	[Status] INT NOT NULL,
	CreatedOn DATETIME NOT NULL,
	CreatedBy VARCHAR(100) NOT NULL,
	ModifiedOn DATETIME NULL,
	ModifiedBy VARCHAR(100) NULL	
)
PRINT 'Table [CredorDomain] Created'
END
-------------------------------------------------------------------------------------------------------------------------------------------------
IF OBJECT_ID (N'CredorFromEmailAddress', N'U') IS NOT NULL
BEGIN
	DROP TABLE dbo.CredorFromEmailAddress
	PRINT 'Table [CredorFromEmailAddress] Dropped'
END
IF OBJECT_ID (N'CredorFromEmailAddress', N'U') IS  NULL
BEGIN
	CREATE TABLE dbo.CredorFromEmailAddress
(
	Id INT NOT NULL CONSTRAINT PK_CredorFromEmailAddress PRIMARY KEY (Id) IDENTITY (1,1),			
	FromName VARCHAR(100) NOT NULL,
	EmailId VARCHAR(100) NOT NULL,	
	[Password] VARCHAR(50) NOT NULL,
	DomainId INT NOT NULL CONSTRAINT FK_CredorDomain_CredorFromEmailAddress FOREIGN KEY (DomainId) REFERENCES dbo.CredorDomain(Id),
	[Status] INT NOT NULL,
	Active BIT NOT NULL,	
	CreatedOn DATETIME NOT NULL,
	CreatedBy VARCHAR(100) NOT NULL,
	ModifiedOn DATETIME NULL,
	ModifiedBy VARCHAR(100) NULL	
)
PRINT 'Table [CredorFromEmailAddress] Created'
END
ALTER TABLE dbo.CredorFromEmailAddress ADD [Password] VARCHAR(50) NULL
-----------------------------------------------------------------------------------------------------------------------------------------------
IF OBJECT_ID (N'EmailTemplate', N'U') IS NOT NULL
BEGIN
	DROP TABLE dbo.EmailTemplate
	PRINT 'Table [EmailTemplate] Dropped'
END
IF OBJECT_ID (N'EmailTemplate', N'U') IS NULL
BEGIN
	CREATE TABLE dbo.EmailTemplate
(
	Id INT NOT NULL CONSTRAINT PK_EmailTemplate PRIMARY KEY (Id) IDENTITY (1,1),			
	[Name] VARCHAR(100) NOT NULL,	
	Template NVARCHAR(MAX) NOT NULL,
	Design NVARCHAR(MAX) NOT NULL,
	[Description] VARCHAR(500) NOT NULL,
	Active BIT NOT NULL,
	[Status] INT NOT NULL,
	IsDefault BIT NOT NULL DEFAULT 0,
	CreatedOn DATETIME NOT NULL,
	CreatedBy VARCHAR(100) NOT NULL,
	ModifiedOn DATETIME NULL,
	ModifiedBy VARCHAR(100) NULL	
)
PRINT 'Table [EmailTemplate] Created'
END
-----------------------------------------------------------------------------------------------------------------------------------------------
IF OBJECT_ID (N'EmailRecipient', N'U') IS NOT NULL
BEGIN
	DROP TABLE dbo.EmailRecipient
	PRINT 'Table [EmailRecipient] Dropped'
END
ELSE
BEGIN
	CREATE TABLE dbo.EmailRecipient
(
	Id INT NOT NULL CONSTRAINT PK_EmailRecipient PRIMARY KEY (Id) IDENTITY (1,1),		
	[Name] VARCHAR(100) NOT NULL,
	[Description] VARCHAR(500) NULL,	
	Active BIT NOT NULL DEFAULT 1,
	CreatedOn DATETIME NOT NULL DEFAULT GETDATE(),
	CreatedBy VARCHAR(50) NOT NULL DEFAULT 'DEV'
)
PRINT 'Table [EmailRecipient] Created'
END

DELETE FROM dbo.EmailRecipient

INSERT dbo.EmailRecipient ([Name],[Description],Active) 
VALUES 
('All Leads & All Investors','Mail will be sent to all leads and all investors',1),
('Verified Users','Mail will be sent to verified users only',1),
('Accredited Only','Mail will be sent to accredited users only',1),
('All Investors','Mail will be sent to all investors',1),
('All Leads','Mail will be sent to all leads',1),
('Not Registered','Mail will be sent to all the un-registered users',1)

SELECT * FROM dbo.EmailRecipient
-----------------------------------------------------------------------------------------------------------------------------------------------
IF OBJECT_ID (N'EmailType', N'U') IS NOT NULL
BEGIN
	DROP TABLE dbo.EmailType
	PRINT 'Table [EmailType] Dropped'
END
ELSE
BEGIN
	CREATE TABLE dbo.EmailType
(
	Id INT NOT NULL CONSTRAINT PK_EmailType PRIMARY KEY (Id) IDENTITY (1,1),		
	[Name] VARCHAR(100) NOT NULL,	
	Active BIT NOT NULL DEFAULT 1,
	CreatedOn DATETIME NOT NULL DEFAULT GETDATE(),
	CreatedBy VARCHAR(50) NOT NULL DEFAULT 'DEV'
)
PRINT 'Table [EmailType] Created'
END

DELETE FROM dbo.EmailType

INSERT dbo.EmailType ([Name],Active) 
VALUES 
('Company Newsletter/ Updates ',1),
('New Investment Announcements',1),
('AdminNotifications',0),
('UserNotifications',0)

SELECT * FROM dbo.EmailType
-----------------------------------------------------------------------------------------------------------------------------------------------
IF OBJECT_ID (N'EmailProvider', N'U') IS NOT NULL
BEGIN
	DROP TABLE dbo.EmailProvider
	PRINT 'Table [EmailProvider] Dropped'
END
ELSE
BEGIN
	CREATE TABLE dbo.EmailProvider
(
	Id INT NOT NULL CONSTRAINT PK_EmailProvider PRIMARY KEY (Id) IDENTITY (1,1),
	[Name] VARCHAR(100) NOT NULL,
	IMAP VARCHAR(100) NOT NULL,	
	SMTP VARCHAR(100) NOT NULL,
	Active  BIT NOT NULL DEFAULT 1,
	CreatedOn DATETIME NOT NULL DEFAULT GETDATE(),
	CreatedBy VARCHAR(50) NOT NULL DEFAULT 'DEV'
)
PRINT 'Table [EmailProvider] Created'
END

DELETE FROM dbo.EmailProvider

INSERT dbo.EmailProvider ([Name], IMAP, SMTP, Active) 
VALUES 
('Gmail','imap.gmail.com','smtp.gmail.com',1),
('iCloud','imap.mail.me.com','smtp.mail.me.com',1),
('MSN','imap-mail.outlook.com','smtp-mail.outlook.com',1),
('MicroSoft 365 Outlook.com Hotmail.com Live.com','outlook.office365.com','smtp.office365.com',1),
('AOL & Verizon.net','imap.aol.com','smtp.aol.com',1),
('Yahoo!','imap.mail.yahoo.com','smtp.mail.yahoo.com',1)

SELECT * FROM dbo.EmailProvider
-----------------------------------------------------------------------------------------------------------------------------------------------

IF OBJECT_ID (N'CredorEmailProvider', N'U') IS NOT NULL
BEGIN
	DROP TABLE dbo.CredorEmailProvider
	PRINT 'Table [CredorEmailProvider] Dropped'
END
ELSE
BEGIN
	CREATE TABLE dbo.CredorEmailProvider
(
	Id INT NOT NULL CONSTRAINT PK_CredorEmailProvider PRIMARY KEY (Id) IDENTITY (1,1),		
	IMAPHost VARCHAR(100) NOT NULL,	
	SMTPHost VARCHAR(100) NOT NULL,
	EmailId VARCHAR(100) NOT NULL,
	[Password] VARCHAR(100) NOT NULL,
	DisplayName VARCHAR(100) NULL,
	Active BIT NOT NULL DEFAULT 1,
	CreatedOn DATETIME NOT NULL DEFAULT GETDATE(),
	CreatedBy VARCHAR(50) NOT NULL DEFAULT 'DEV',
	ModifiedOn DATETIME NULL,
	ModifiedBy VARCHAR(50) NULL 
)
PRINT 'Table [CredorEmailProvider] Created'
END
ALTER TABLE dbo.CredorEmailProvider ADD ModifiedOn DATETIME NULL,
	ModifiedBy VARCHAR(50) NULL 

DELETE FROM dbo.CredorEmailProvider

INSERT dbo.CredorEmailProvider (IMAPHost, SMTPHost, EmailId, [Password],DisplayName,Active) 
VALUES 
('imap.gmail.com','smtp.gmail.com','internal.credor@gmail.com','Excel.123','Credor Support',1)

SELECT * FROM dbo.CredorEmailProvider
-----------------------------------------------------------------------------------------------------------------------------------------------
IF OBJECT_ID (N'CredorEmailDetail', N'U') IS NOT NULL
BEGIN
	DROP TABLE dbo.CredorEmailDetail
	PRINT 'Table [CredorEmailDetail] Dropped'
END
ELSE
BEGIN
	CREATE TABLE dbo.CredorEmailDetail
(
	Id INT NOT NULL CONSTRAINT PK_CredorEmailDetail PRIMARY KEY (Id) IDENTITY (1,1),		
	[Subject] VARCHAR(500) NOT NULL,	
	ScheduledOn DATETIME NULL,		
	FromName VARCHAR(100) NOT NULL,
	FromEmail VARCHAR(100) NULL,
	FromEmailAddressId INT NULL CONSTRAINT FK_CredorEmailDetail_CredorFromEmailAddress FOREIGN KEY (FromEmailAddressId) REFERENCES dbo.CredorFromEmailAddress(Id),
	ReplyTo VARCHAR(100) NULL,
	EmailTypeId INT NOT NULL CONSTRAINT FK_CredorEmailDetail_EmailType FOREIGN KEY (EmailTypeId) REFERENCES dbo.EmailType(Id),
	EmailTemplateId INT NULL,
	EmailTemplate NVARCHAR(MAX) NULL,
	EmailDesign NVARCHAR(MAX) NULL,
	SentTo INT NULL,
	Delivered INT NULL,
	Opened INT NULL,
	Clicked INT NULL,
	Bounced INT NULL,
	[Status] INT NOT NULL,
	Active BIT NOT NULL DEFAULT 1,
	CreatedOn DATETIME NOT NULL DEFAULT GETDATE(),
	CreatedBy VARCHAR(50) NOT NULL DEFAULT 'DEV',
	ModifiedOn DATETIME NULL,
	ModifiedBy VARCHAR(50) NULL 
)
PRINT 'Table [CredorEmailDetail] Created'
END
-----------------------------------------------------------------------------------------------------------------------------------------------
IF OBJECT_ID (N'CredorEmail', N'U') IS NOT NULL
BEGIN
	DROP TABLE dbo.CredorEmail
	PRINT 'Table [CredorEmail] Dropped'
END
ELSE
BEGIN
	CREATE TABLE dbo.CredorEmail
(
	Id INT NOT NULL CONSTRAINT PK_CredorEmail PRIMARY KEY (Id) IDENTITY (1,1),	
	CredorEmailDetailId INT NULL CONSTRAINT FK_CredorEmail_CredorEmailDetail FOREIGN KEY (CredorEmailDetailId) REFERENCES dbo.CredorEmailDetail(Id), 
	RecipientEmailId VARCHAR(100) NOT NULL,
	UserId INT NULL CONSTRAINT FK_CredorEmail_UserAccount FOREIGN KEY (UserId) REFERENCES dbo.UserAccount(Id),
	CredorEmailProviderId INT NULL CONSTRAINT FK_CredorEmail_CredorEmailProvider FOREIGN KEY (CredorEmailProviderId) REFERENCES dbo.CredorEmailProvider(Id), 
	EmailTypeId INT NULL CONSTRAINT FK_CredorEmail_EmailType FOREIGN KEY (EmailTypeId) REFERENCES dbo.EmailType(Id),
	[Subject] NVARCHAR(500) NULL,
	Body NVARCHAR(MAX) NULL,
	[Status] INT NOT NULL,	
	Active BIT NOT NULL DEFAULT 1,
	CreatedOn DATETIME NOT NULL DEFAULT GETDATE(),
	CreatedBy VARCHAR(50) NOT NULL DEFAULT 'DEV',
	ModifiedOn DATETIME NULL,
	ModifiedBy VARCHAR(50) NULL 
)
PRINT 'Table [CredorEmail] Created'
END
-----------------------------------------------------------------------------------------------------------------------------------------------
IF OBJECT_ID (N'EmailRecipientGroup', N'U') IS NOT NULL
BEGIN
	DROP TABLE dbo.EmailRecipientGroup
	PRINT 'Table [EmailRecipientGroup] Dropped'
END
ELSE
BEGIN
	CREATE TABLE dbo.EmailRecipientGroup
(
	Id INT NOT NULL CONSTRAINT PK_EmailRecipientGroup PRIMARY KEY (Id) IDENTITY (1,1),	
	CredorEmailDetailId INT NOT NULL CONSTRAINT FK_EmailRecipientGroup_CredorEmailDetail FOREIGN KEY (CredorEmailDetailId) REFERENCES dbo.CredorEmailDetail(Id), 
	EmailRecipientId INT NULL CONSTRAINT FK_EmailRecipientGroup_EmailRecipient FOREIGN KEY (EmailRecipientId) REFERENCES dbo.EmailRecipient(Id),
	TagId INT NULL CONSTRAINT FK_EmailRecipientGroup_Tag FOREIGN KEY (TagId) REFERENCES dbo.Tag(Id),
	UserId INT NULL CONSTRAINT FK_EmailRecipientGroup_UserAccount FOREIGN KEY (UserId) REFERENCES dbo.UserAccount(Id),
	EmailId VARCHAR(100) NULL,
	[Status] INT NOT NULL,	
	Active BIT NOT NULL DEFAULT 1,
	CreatedOn DATETIME NOT NULL DEFAULT GETDATE(),
	CreatedBy VARCHAR(50) NOT NULL DEFAULT 'DEV',
	ModifiedOn DATETIME NULL,
	ModifiedBy VARCHAR(50) NULL 
)
PRINT 'Table [EmailRecipientGroup] Created'
END
ALter table dbo.EmailRecipientGroup add UserId INT NULL CONSTRAINT FK_EmailRecipientGroup_UserAccount FOREIGN KEY (UserId) REFERENCES dbo.UserAccount(Id)
-----------------------------------------------------------------------------------------------------------------------------------------------
IF OBJECT_ID (N'EmailAttachment', N'U') IS NOT NULL
BEGIN
	DROP TABLE dbo.EmailAttachment
	PRINT 'Table [EmailAttachment] Dropped'
END
ELSE
BEGIN
	CREATE TABLE dbo.EmailAttachment
(
	Id INT NOT NULL CONSTRAINT PK_EmailAttachment PRIMARY KEY (Id) IDENTITY (1,1),	
	CredorEmailDetailId INT NOT NULL CONSTRAINT FK_EmailAttachment_CredorEmailDetail FOREIGN KEY (CredorEmailDetailId) REFERENCES dbo.CredorEmailDetail(Id), 
	[FileName] VARCHAR(500) NOT NULL,
	FilePath VARCHAR(1000) NOT NULL,
	Extension VARCHAR(10) NOT NULL,
	[Status] INT NOT NULL,	
	Active BIT NOT NULL DEFAULT 1,
	CreatedOn DATETIME NOT NULL DEFAULT GETDATE(),
	CreatedBy VARCHAR(50) NOT NULL DEFAULT 'DEV',
	ModifiedOn DATETIME NULL,
	ModifiedBy VARCHAR(50) NULL 
)
PRINT 'Table [EmailAttachment] Created'
END
-----------------------------------------------------------------------------------------------------------------------------------------------

