USE [master]
GO
/****** Object:  Database [InstantPayment]    Script Date: 7/6/2020 11:16:58 AM ******/
CREATE DATABASE [InstantPayment] ON  PRIMARY 
( NAME = N'InstantPayment', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL10_50.MSSQLSERVER\MSSQL\DATA\InstantPayment.mdf' , SIZE = 5120KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'InstantPayment_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL10_50.MSSQLSERVER\MSSQL\DATA\InstantPayment_log.ldf' , SIZE = 4096KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO
ALTER DATABASE [InstantPayment] SET COMPATIBILITY_LEVEL = 100
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [InstantPayment].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [InstantPayment] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [InstantPayment] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [InstantPayment] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [InstantPayment] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [InstantPayment] SET ARITHABORT OFF 
GO
ALTER DATABASE [InstantPayment] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [InstantPayment] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [InstantPayment] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [InstantPayment] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [InstantPayment] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [InstantPayment] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [InstantPayment] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [InstantPayment] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [InstantPayment] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [InstantPayment] SET  DISABLE_BROKER 
GO
ALTER DATABASE [InstantPayment] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [InstantPayment] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [InstantPayment] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [InstantPayment] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [InstantPayment] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [InstantPayment] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [InstantPayment] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [InstantPayment] SET RECOVERY FULL 
GO
ALTER DATABASE [InstantPayment] SET  MULTI_USER 
GO
ALTER DATABASE [InstantPayment] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [InstantPayment] SET DB_CHAINING OFF 
GO
USE [InstantPayment]
GO
/****** Object:  User [instant]    Script Date: 7/6/2020 11:16:59 AM ******/
CREATE USER [instant] FOR LOGIN [instant] WITH DEFAULT_SCHEMA=[dbo]
GO
ALTER ROLE [db_owner] ADD MEMBER [instant]
GO
/****** Object:  Schema [IPS]    Script Date: 7/6/2020 11:16:59 AM ******/
CREATE SCHEMA [IPS]
GO
/****** Object:  UserDefinedFunction [dbo].[CALCULATE_FEE]    Script Date: 7/6/2020 11:16:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date, ,>
-- Description:	<Description, ,>
-- =============================================
CREATE FUNCTION [dbo].[CALCULATE_FEE] 
(
	-- Add the parameters for the function here
	@MERCHANT_ID INT,
	@DEBTOR_ACCOUNT NVARCHAR(50),
	@AMOUNT NVARCHAR(20)
)
RETURNS float
AS
BEGIN
	-- Declare the return variable here
	DECLARE @Result float, @Percentage float, @isOnUS tinyint, @fAmount float;

	IF(@DEBTOR_ACCOUNT like '155%')
		SET @isOnUs =1;
	ELSE
		SET @isOnUS = 2;

    SET @fAmount = dbo.PARSE_AMOUNT(@AMOUNT);
	-- Add the T-SQL statements to compute the return value here
	SELECT TOP 1 @Percentage = FEE_AMOUNT
	  FROM REG_FEE_RULES
	 WHERE MERCHANT_ID = @MERCHANT_ID
	   AND PRODUCT_TYPE_ID = @isOnUS
	   AND FEE_TYPE = 1
	   AND FEE_RECEIVER_ID = 2
	   AND FEE_CONDITION < @fAmount
	 ORDER BY FEE_CONDITION DESC;

	 SET @Result = @fAmount * (@Percentage / 100);
	-- Return the result of the function
	RETURN @Result;

END
GO
/****** Object:  UserDefinedFunction [dbo].[CALCULATE_IPS_FEE]    Script Date: 7/6/2020 11:16:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date, ,>
-- Description:	<Description, ,>
-- =============================================
CREATE FUNCTION [dbo].[CALCULATE_IPS_FEE] 
(
	-- Add the parameters for the function here
	@DEBTOR_ACCOUNT NVARCHAR(50),
	@TRANSACTION_DATE DATE,
	@AMOUNT NVARCHAR(20)
)
RETURNS float
AS
BEGIN
	-- Declare the return variable here
	DECLARE @Result float, @isOnUS tinyint, @fAmount float;

	IF(@DEBTOR_ACCOUNT like '155%')
		SET @isOnUs =1;
	ELSE
		SET @isOnUS = 2;

    SET @fAmount = dbo.PARSE_AMOUNT(@AMOUNT);
	-- Add the T-SQL statements to compute the return value here
	SELECT TOP 1 @Result = FEE_AMOUNT
	  FROM REG_FEE_RULES
	 WHERE PRODUCT_TYPE_ID = @isOnUS
	   AND FEE_RECEIVER_ID = 1
	   AND FEE_CONDITION < @fAmount
	   AND FEE_TYPE = 0
	   AND (VALIDITY_DATE > @TRANSACTION_DATE OR VALIDITY_DATE IS NULL)
	 ORDER BY FEE_CONDITION DESC;

	RETURN @Result;

END
GO
/****** Object:  UserDefinedFunction [dbo].[CALCULATE_MERCHANT_FEE]    Script Date: 7/6/2020 11:16:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date, ,>
-- Description:	<Description, ,>
-- =============================================
CREATE FUNCTION [dbo].[CALCULATE_MERCHANT_FEE] 
(
	-- Add the parameters for the function here
	@MERCHANT_ID INT,
	@TRANSACTION_DATE DATE,
	@DEBTOR_ACCOUNT NVARCHAR(50),
	@AMOUNT NVARCHAR(20)
)
RETURNS float
AS
BEGIN
	-- Declare the return variable here
	DECLARE @Result float, @percentage float, @fAmount float, @calculatedAmount float;

	SET @fAmount = dbo.PARSE_AMOUNT(@AMOUNT);

	SET @percentage = dbo.GET_MERCHANT_FEE_PERCENTAGE(@MERCHANT_ID, @TRANSACTION_DATE, @DEBTOR_ACCOUNT, @AMOUNT);

	SET @calculatedAmount = dbo.GET_MERCHANT_FEE_AMOUNT(@MERCHANT_ID, @TRANSACTION_DATE, @DEBTOR_ACCOUNT, @AMOUNT);

	IF((@fAmount*@percentage)/100 > @calculatedAmount)
		SET @Result = (@fAmount*@percentage)/100;
	ELSE
		SET @Result = @calculatedAmount;
    
	RETURN @Result;

END
GO
/****** Object:  UserDefinedFunction [dbo].[CHECK_REFUND_AMOUNT]    Script Date: 7/6/2020 11:16:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date, ,>
-- Description:	<Description, ,>
-- =============================================

CREATE FUNCTION [dbo].[CHECK_REFUND_AMOUNT] 
(
	-- Add the parameters for the function here
	@end_to_end_id nvarchar(50),
	@amount float
)
RETURNS BIT
AS
BEGIN
	-- Declare the return variable here
	DECLARE @result BIT, @original_amount float;

	-- Add the T-SQL statements to compute the return value here
	SELECT @original_amount = MAX(instructed_amount)
	  FROM PAYMENT_REQUESTS_SERBIA
	 WHERE end_to_end_id = @end_to_end_id
	   AND ((transaction_identifier = 100 AND status in ('incoming-credit-transfer-executed', 'executed')) 
	    OR (transaction_identifier = 200 AND mti = '0200' AND processing_code IN ('000000', '890000')))
	IF(@amount > @original_amount)
		SET @result = 0;
	ELSE
		SET @result = 1;

	-- Return the result of the function
	RETURN @result

END
GO
/****** Object:  UserDefinedFunction [dbo].[GET_AMOUNT]    Script Date: 7/6/2020 11:16:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date, ,>
-- Description:	<Description, ,>
-- =============================================
CREATE FUNCTION [dbo].[GET_AMOUNT](
	-- Add the parameters for the function here
	@end_to_end_id nvarchar(50)
)
RETURNS float
AS
BEGIN
	-- Declare the return variable here
	DECLARE @amount float;

	-- Add the T-SQL statements to compute the return value here
	  SET @amount	= (SELECT TOP 1 instructed_amount
	  FROM PAYMENT_REQUESTS_SERBIA
	 WHERE end_to_end_id = @end_to_end_id
	   and instructed_amount is not null
	 ORDER by instruction_id);

	-- Return the result of the function
	RETURN @amount

END
GO
/****** Object:  UserDefinedFunction [dbo].[GET_DATUM]    Script Date: 7/6/2020 11:16:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date, ,>
-- Description:	<Description, ,>
-- =============================================
CREATE FUNCTION [dbo].[GET_DATUM] 
(
	-- Add the parameters for the function here
	@end_to_end_id nvarchar(50)
)
RETURNS datetime
AS
BEGIN
	-- Declare the return variable here
	DECLARE @datum datetime;

	-- Add the T-SQL statements to compute the return value here
	  SET @datum	= (SELECT TOP 1 datum
	  FROM PAYMENT_REQUESTS_SERBIA
	 WHERE end_to_end_id = @end_to_end_id
	   and datum is not null
	 ORDER by instruction_id);

	-- Return the result of the function
	RETURN @datum

END
GO
/****** Object:  UserDefinedFunction [dbo].[GET_INSTRUCTION_ID]    Script Date: 7/6/2020 11:16:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date, ,>
-- Description:	<Description, ,>
-- =============================================
CREATE FUNCTION [dbo].[GET_INSTRUCTION_ID] 
(
	-- Add the parameters for the function here
)
RETURNS NVARCHAR(20)
AS
BEGIN
	-- Declare the return variable here
	DECLARE @INSTRUCTION_ID NVARCHAR(20);
	DECLARE @date DATETIME;
	SET @date = GETDATE();
	-- Add the T-SQL statements to compute the return value here
	SET @INSTRUCTION_ID = 	RIGHT(CONVERT(varchar(4), DATEPART(YY, @date)), 1)			-- last digit of the year
						  + RIGHT('000' + CONVERT(varchar(3),DATEPART(dy, @date)), 3)	-- julian day of the year
						  + CONVERT(varchar(2), DATEPART(HOUR, @date))					-- hours
						  + RIGHT('00' + CONVERT(varchar(3), datepart(mi, getdate())),2) 
						  + RIGHT('00' + CONVERT(varchar(3), datepart(ss, getdate())),2)
						  + RIGHT('0000' + CONVERT(varchar(3), datepart(ms, getdate())),4) ;

	-- Return the result of the function
	RETURN @INSTRUCTION_ID

END
GO
/****** Object:  UserDefinedFunction [dbo].[GET_INTERBANK_FEE_PERCENT]    Script Date: 7/6/2020 11:16:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date, ,>
-- Description:	<Description, ,>
-- =============================================
CREATE FUNCTION [dbo].[GET_INTERBANK_FEE_PERCENT] 
(
	-- Add the parameters for the function here
	@DEBTOR_ACCOUNT NVARCHAR(50),
	@TRANSACTION_DATE DATE,
	@AMOUNT NVARCHAR(20)
)
RETURNS float
AS
BEGIN
	-- Declare the return variable here
	DECLARE @Result float, @isOnUS tinyint, @fAmount float;

	IF(@DEBTOR_ACCOUNT like '155%')
		SET @isOnUs =1;
	ELSE
		SET @isOnUS = 2;

    SET @fAmount = dbo.PARSE_AMOUNT(@AMOUNT);
	-- Add the T-SQL statements to compute the return value here
	SELECT TOP 1 @Result = FEE_AMOUNT
	  FROM REG_FEE_RULES
	 WHERE PRODUCT_TYPE_ID = @isOnUS
	   AND FEE_TYPE = 1
	   AND FEE_RECEIVER_ID = 3
	   AND FEE_CONDITION < @fAmount
	    AND (VALIDITY_DATE > @TRANSACTION_DATE OR VALIDITY_DATE IS NULL)
	 ORDER BY FEE_CONDITION DESC;

	RETURN @Result;

END
GO
/****** Object:  UserDefinedFunction [dbo].[GET_MERCHANT_FEE_AMOUNT]    Script Date: 7/6/2020 11:16:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date, ,>
-- Description:	<Description, ,>
-- =============================================
CREATE FUNCTION [dbo].[GET_MERCHANT_FEE_AMOUNT] 
(
	-- Add the parameters for the function here
	@MERCHANT_ID INT,
	@TRANSACTION_DATE DATE,
	@DEBTOR_ACCOUNT NVARCHAR(50),
	@AMOUNT NVARCHAR(20)
)
RETURNS float
AS
BEGIN
	-- Declare the return variable here
	DECLARE @Result float, @isOnUS tinyint, @fAmount float;

	IF(@DEBTOR_ACCOUNT like '155%')
		SET @isOnUs =1;
	ELSE
		SET @isOnUS = 2;

    SET @fAmount = dbo.PARSE_AMOUNT(@AMOUNT);
	-- Add the T-SQL statements to compute the return value here
	SELECT TOP 1 @Result = FEE_AMOUNT
	  FROM REG_FEE_RULES
	 WHERE MERCHANT_ID = @MERCHANT_ID
	   AND PRODUCT_TYPE_ID = @isOnUS
	   AND FEE_RECEIVER_ID = 2
	   AND FEE_CONDITION < @fAmount
	   AND FEE_TYPE = 0
	   AND (VALIDITY_DATE > @TRANSACTION_DATE OR VALIDITY_DATE IS NULL)
	 ORDER BY FEE_CONDITION DESC;

	RETURN @Result;

END
GO
/****** Object:  UserDefinedFunction [dbo].[GET_MERCHANT_FEE_PERCENTAGE]    Script Date: 7/6/2020 11:16:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date, ,>
-- Description:	<Description, ,>
-- =============================================
CREATE FUNCTION [dbo].[GET_MERCHANT_FEE_PERCENTAGE] 
(
	-- Add the parameters for the function here
	@MERCHANT_ID INT,
	@TRANSACTION_DATE DATE,
	@DEBTOR_ACCOUNT NVARCHAR(50),
	@AMOUNT NVARCHAR(20)
)
RETURNS float
AS
BEGIN
	-- Declare the return variable here
	DECLARE @Result float, @isOnUS tinyint, @fAmount float;

	IF(@DEBTOR_ACCOUNT like '155%')
		SET @isOnUs =1;
	ELSE
		SET @isOnUS = 2;

    SET @fAmount = dbo.PARSE_AMOUNT(@AMOUNT);
	-- Add the T-SQL statements to compute the return value here
	SELECT TOP 1 @Result = FEE_AMOUNT
	  FROM REG_FEE_RULES
	 WHERE MERCHANT_ID = @MERCHANT_ID
	   AND PRODUCT_TYPE_ID = @isOnUS
	   AND FEE_RECEIVER_ID = 2
	   AND FEE_CONDITION < @fAmount
	   AND FEE_TYPE = 1
	   AND (VALIDITY_DATE > @TRANSACTION_DATE OR VALIDITY_DATE IS NULL)
	 ORDER BY FEE_CONDITION DESC;

	RETURN @Result;

END
GO
/****** Object:  UserDefinedFunction [dbo].[GET_MERCHANT_ID]    Script Date: 7/6/2020 11:16:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date, ,>
-- Description:	<Description, ,>
-- =============================================
CREATE FUNCTION [dbo].[GET_MERCHANT_ID] 
(
	-- Add the parameters for the function here
	@local_merchant_id nvarchar(50)
)
RETURNS int
AS
BEGIN
	-- Declare the return variable here
	DECLARE @merchant_id int

	-- Add the T-SQL statements to compute the return value here
	SELECT @merchant_id = merchant_id
	  FROM ACQ_MERCHANTS
	 WHERE local_merchant_id = @local_merchant_id;

	-- Return the result of the function
	RETURN @merchant_id;

END
GO
/****** Object:  UserDefinedFunction [dbo].[GET_POINT_OF_SALE_ID]    Script Date: 7/6/2020 11:16:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date, ,>
-- Description:	<Description, ,>
-- =============================================
CREATE FUNCTION [dbo].[GET_POINT_OF_SALE_ID] 
(
	-- Add the parameters for the function here
	@point_of_sale_local_id nvarchar(50)
)
RETURNS int
AS
BEGIN
	-- Declare the return variable here
	DECLARE @point_of_sale_id int

	-- Add the T-SQL statements to compute the return value here
	SELECT @point_of_sale_id = point_of_sale_id
	  FROM ACQ_POINTS_OF_SALE
	 WHERE @point_of_sale_local_id = point_of_sale_local_id;

	-- Return the result of the function
	RETURN @point_of_sale_id;

END
GO
/****** Object:  UserDefinedFunction [dbo].[GET_RRN]    Script Date: 7/6/2020 11:16:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date, ,>
-- Description:	<Description, ,>
-- =============================================
CREATE FUNCTION [dbo].[GET_RRN]
(

	@Sequence NVARCHAR(10)
)
RETURNS NVARCHAR(15)
AS
BEGIN

	DECLARE @Response NVARCHAR(15)
	DECLARE @date DATETIME

	SET @date = getdate();
	SET @Response = RIGHT(CONVERT(varchar(4), DATEPART(YY, @date)), 1)			-- last digit of the year
	              + RIGHT('000' + CONVERT(varchar(3),DATEPART(dy, @date)), 3)	-- julian day of the year
				  + CONVERT(varchar(2), DATEPART(HOUR, @date))					-- hours
				  + @Sequence;
	RETURN @Response

END
GO
/****** Object:  UserDefinedFunction [dbo].[GET_STATUS]    Script Date: 7/6/2020 11:16:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date, ,>
-- Description:	<Description, ,>
-- =============================================
CREATE FUNCTION [dbo].[GET_STATUS] 
(
	-- Add the parameters for the function here
	@end_to_end_id nvarchar(50)
)
RETURNS nvarchar(20)
AS
BEGIN
	-- Declare the return variable here
	DECLARE @status nvarchar(50);

	-- Add the T-SQL statements to compute the return value here
	  SET @status	= (SELECT TOP 1 status
	  FROM PAYMENT_REQUESTS_SERBIA
	 WHERE end_to_end_id = @end_to_end_id
	   and status is not null
	 ORDER by instruction_id);
	 
	 IF(@status = 'incoming-credit-transfer-executed' OR @status = 'executed')
		SET @status = '00'
	 ELSE 
		SET @status = '05'
	-- Return the result of the function
	RETURN @status

END
GO
/****** Object:  UserDefinedFunction [dbo].[GET_TID]    Script Date: 7/6/2020 11:16:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date, ,>
-- Description:	<Description, ,>
-- =============================================
CREATE FUNCTION [dbo].[GET_TID] 
(
	-- Add the parameters for the function here
	@end_to_end_id nvarchar(50)
)
RETURNS nvarchar(20)
AS
BEGIN
	-- Declare the return variable here
	DECLARE @tid nvarchar(20);

	-- Add the T-SQL statements to compute the return value here
	  SET @tid	= (SELECT TOP 1 tid
	  FROM PAYMENT_REQUESTS_SERBIA
	 WHERE end_to_end_id = @end_to_end_id
	   and tid is not null
	 ORDER by instruction_id);

	-- Return the result of the function
	RETURN @tid

END
GO
/****** Object:  UserDefinedFunction [dbo].[PARSE_AMOUNT]    Script Date: 7/6/2020 11:16:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date, ,>
-- Description:	<Description, ,>
-- =============================================
CREATE FUNCTION [dbo].[PARSE_AMOUNT] 
(
	-- Add the parameters for the function here
	@AMOUNT_IN NVARCHAR(20)
)
RETURNS float
AS
BEGIN
	-- Declare the return variable here
	DECLARE @response float;

	-- Add the T-SQL statements to compute the return value here
	SET @response = cast(REPLACE(@AMOUNT_IN, ',', '.') AS float) 
	-- Return the result of the function
	RETURN @response

END
GO
/****** Object:  Table [dbo].[ACQ_MERCHANTS]    Script Date: 7/6/2020 11:16:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ACQ_MERCHANTS](
	[merchant_id] [int] IDENTITY(1,1) NOT NULL,
	[merchant_name] [nvarchar](50) NOT NULL,
	[merchant_address] [nvarchar](50) NOT NULL,
	[merchant_city_id] [int] NOT NULL,
	[merchant_setup_date] [date] NULL,
	[merchant_status] [nvarchar](3) NOT NULL,
	[mcc] [int] NULL,
	[merchant_account] [nvarchar](20) NULL,
	[merchant_perc_fee] [float] NULL,
	[merchant_min_fee] [int] NULL,
	[default_payment_method] [char](1) NULL,
	[tax_identity_number] [nvarchar](50) NULL,
	[personal_identity_number] [nvarchar](50) NULL,
	[local_merchant_id] [nvarchar](50) NULL,
	[return_enabled] [int] NULL,
	[payment_code] [nvarchar](3) NULL,
	[ereceipt_enabled] [tinyint] NULL,
	[service_amount_limit] [decimal](18, 2) NULL,
	[e_mail] [nvarchar](50) NULL,
 CONSTRAINT [PK_ACQ_MERCHANTS] PRIMARY KEY CLUSTERED 
(
	[merchant_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ACQ_PAYMENT_METHODS]    Script Date: 7/6/2020 11:16:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ACQ_PAYMENT_METHODS](
	[PAYMENT_METHOD_ID] [char](1) NOT NULL,
	[PAYMENT_METHOD_NAME] [nvarchar](10) NULL,
 CONSTRAINT [PK_ACQ_PAYMENT_METHODS] PRIMARY KEY CLUSTERED 
(
	[PAYMENT_METHOD_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ACQ_POINTS_OF_SALE]    Script Date: 7/6/2020 11:16:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ACQ_POINTS_OF_SALE](
	[point_of_sale_id] [int] IDENTITY(1,1) NOT NULL,
	[point_of_sale_name] [nvarchar](50) NOT NULL,
	[point_of_sale_address] [nvarchar](50) NOT NULL,
	[point_of_sale_setup_date] [date] NOT NULL,
	[point_of_sale_status] [nvarchar](3) NOT NULL,
	[merchant_id] [int] NOT NULL,
	[point_of_sale_city_id] [int] NOT NULL,
	[point_of_sale_local_id] [nvarchar](15) NULL,
	[default_payment_method] [nvarchar](1) NULL,
	[point_of_sale_account] [nvarchar](20) NULL,
	[mcc] [int] NULL,
	[channel_type] [nvarchar](50) NULL,
 CONSTRAINT [PK_ACQ_POINTS_OF_SALE] PRIMARY KEY CLUSTERED 
(
	[point_of_sale_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ACQ_STATUS]    Script Date: 7/6/2020 11:17:00 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ACQ_STATUS](
	[status_id] [nvarchar](3) NOT NULL,
	[status_name] [nvarchar](50) NULL,
 CONSTRAINT [PK_ACQ_STATUS] PRIMARY KEY CLUSTERED 
(
	[status_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ACQ_TERMINALS]    Script Date: 7/6/2020 11:17:00 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ACQ_TERMINALS](
	[terminal_id] [int] IDENTITY(1,1) NOT NULL,
	[terminal_setup_date] [date] NOT NULL,
	[terminal_status] [nvarchar](3) NOT NULL,
	[point_of_sale_id] [int] NOT NULL,
	[acquirer_tid] [nvarchar](8) NULL,
	[activation_code] [nvarchar](16) NULL,
	[user_id] [nvarchar](64) NULL,
	[default_payment_method] [nvarchar](1) NULL,
	[terminal_account] [nvarchar](50) NULL,
	[terminal_type] [nvarchar](50) NULL,
	[contact_phone_no] [nvarchar](20) NULL,
 CONSTRAINT [PK_ACQ_TERMINALS] PRIMARY KEY CLUSTERED 
(
	[terminal_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ACQ_TERMINALS_TYPE]    Script Date: 7/6/2020 11:17:00 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ACQ_TERMINALS_TYPE](
	[terminal_type_id] [int] NOT NULL,
	[terminal_type_name] [nvarchar](50) NULL,
 CONSTRAINT [PK_ACQ_TERMINALS_TYPE] PRIMARY KEY CLUSTERED 
(
	[terminal_type_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[APPROVAL_CODE_SEQ]    Script Date: 7/6/2020 11:17:00 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[APPROVAL_CODE_SEQ](
	[NEXTVAL] [int] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[GROUP_ROLES]    Script Date: 7/6/2020 11:17:00 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[GROUP_ROLES](
	[GROUP_ID] [bigint] NOT NULL,
	[ROLE_ID] [bigint] NOT NULL,
 CONSTRAINT [PK_GROUP_ROLES] PRIMARY KEY CLUSTERED 
(
	[GROUP_ID] ASC,
	[ROLE_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[GROUPS]    Script Date: 7/6/2020 11:17:00 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[GROUPS](
	[GROUP_ID] [bigint] IDENTITY(1,1) NOT NULL,
	[GROUPNAME] [nvarchar](50) NULL,
	[DESCRIPTION] [nvarchar](100) NULL,
 CONSTRAINT [PK_GROUPS] PRIMARY KEY CLUSTERED 
(
	[GROUP_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LOG]    Script Date: 7/6/2020 11:17:00 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LOG](
	[log_time] [date] NULL,
	[log_text] [nvarchar](200) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[MESSAGES]    Script Date: 7/6/2020 11:17:00 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[MESSAGES](
	[message_identification] [nvarchar](35) NOT NULL,
	[creation_date_time] [datetime] NULL,
	[identification] [nvarchar](35) NULL,
	[notification_date_time] [datetime] NULL,
	[creditor_account] [nvarchar](30) NULL,
	[creditor_name] [nvarchar](70) NULL,
	[amount] [int] NULL,
	[credit_indicator] [nvarchar](250) NULL,
	[entry_type] [nvarchar](250) NULL,
	[notification_type] [nvarchar](4) NULL,
	[notification_family] [nvarchar](4) NULL,
	[notification_subfamily] [nvarchar](4) NULL,
	[proprietary_notification_code] [nvarchar](35) NULL,
	[issuer] [nvarchar](35) NULL,
	[message_identification_pacs] [nvarchar](35) NULL,
	[instruction_identification] [nvarchar](35) NULL,
	[end_to_end_identification] [nvarchar](35) NULL,
	[transaction_identification] [nvarchar](35) NULL,
	[transaction_amount] [int] NULL,
	[credit_indicator_2] [nvarchar](250) NULL,
	[payer_name] [nvarchar](140) NULL,
	[payer_alias] [nvarchar](140) NULL,
	[payee_name] [nvarchar](140) NULL,
	[payee_alias] [nvarchar](140) NULL,
	[unstructured] [nvarchar](140) NULL,
	[structured] [nvarchar](140) NULL,
	[approval_code] [nvarchar](6) NULL,
	[rrn] [nvarchar](15) NULL,
	[tid] [nvarchar](20) NULL,
	[terminal_sequence] [nvarchar](10) NULL,
	[terminal_invoice] [nvarchar](50) NULL,
	[status] [nvarchar](2) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PAYMENT_REQUESTS]    Script Date: 7/6/2020 11:17:00 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PAYMENT_REQUESTS](
	[TRANSACTION_IDENTIFIER] [nvarchar](140) NOT NULL,
	[CUSTOMER_ACCOUNT_NUMBER] [nvarchar](20) NULL,
	[CUSTOMER_NAME] [nvarchar](50) NULL,
	[AMOUNT] [int] NULL,
	[DATUM] [datetime] NULL,
	[STATUS] [nvarchar](2) NULL,
	[APPROVAL_CODE] [nvarchar](6) NULL,
	[RRN] [nvarchar](15) NULL,
	[TID] [nvarchar](20) NULL,
	[TERMINAL_SEQUENCE] [nvarchar](10) NULL,
	[TERMINAL_INVOICE] [nvarchar](50) NULL,
 CONSTRAINT [PK_PAYMENT_REQUESTS] PRIMARY KEY CLUSTERED 
(
	[TRANSACTION_IDENTIFIER] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PAYMENT_REQUESTS_SERBIA]    Script Date: 7/6/2020 11:17:00 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PAYMENT_REQUESTS_SERBIA](
	[transaction_identifier] [nvarchar](20) NULL,
	[tid] [nvarchar](20) NULL,
	[status] [nvarchar](50) NULL,
	[status_date] [nvarchar](50) NULL,
	[originated] [nvarchar](50) NULL,
	[direction] [nvarchar](50) NULL,
	[authorisation_system] [nvarchar](50) NULL,
	[transfer_id] [nvarchar](50) NULL,
	[instruction_id] [nvarchar](50) NULL,
	[instructing_agent] [nvarchar](50) NULL,
	[creditor_account] [nvarchar](50) NULL,
	[end_to_end_id] [nvarchar](50) NULL,
	[debtor_account] [nvarchar](50) NULL,
	[instructed_amount] [float] NULL,
	[instructed_code] [nvarchar](50) NULL,
	[creditor_name] [nvarchar](250) NULL,
	[creditor_address_line] [nvarchar](250) NULL,
	[creditor_address_locality] [nvarchar](50) NULL,
	[creditor_address_country] [nvarchar](10) NULL,
	[debtor_name] [nvarchar](250) NULL,
	[debtor_address_line] [nvarchar](250) NULL,
	[debtor_address_locality] [nvarchar](50) NULL,
	[debtor_address_country] [nvarchar](10) NULL,
	[payment_description] [nvarchar](250) NULL,
	[purpose_code] [int] NULL,
	[urgency] [nvarchar](50) NULL,
	[instrument_code] [nvarchar](50) NULL,
	[mcc] [nvarchar](50) NULL,
	[creditor_reference] [nvarchar](50) NULL,
	[creditor_reference_model] [nvarchar](50) NULL,
	[charge] [nvarchar](50) NULL,
	[value_date] [nvarchar](50) NULL,
	[sync_timestamp] [nvarchar](50) NULL,
	[datum] [datetime] NULL,
	[status_code] [nvarchar](2) NULL,
	[approval_code] [nvarchar](6) NULL,
	[rrn] [nvarchar](15) NULL,
	[terminal_sequence] [nvarchar](10) NULL,
	[terminal_invoice] [nvarchar](50) NULL,
	[mti] [nvarchar](4) NULL,
	[processing_code] [nvarchar](6) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PAYMENT_TOKENS]    Script Date: 7/6/2020 11:17:00 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PAYMENT_TOKENS](
	[token_id] [bigint] IDENTITY(1,1) NOT NULL,
	[terminal_id] [int] NULL,
	[token_value] [nvarchar](128) NULL,
	[expiry_time] [datetime] NULL,
	[token_status] [nvarchar](3) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PAYMENT_TOKENS_WS]    Script Date: 7/6/2020 11:17:00 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PAYMENT_TOKENS_WS](
	[token_id] [bigint] IDENTITY(1,1) NOT NULL,
	[token_value] [nvarchar](128) NULL,
	[expiry_time] [datetime] NULL,
	[token_status] [nvarchar](3) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[REG_CITIES]    Script Date: 7/6/2020 11:17:00 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[REG_CITIES](
	[city_id] [int] IDENTITY(1,1) NOT NULL,
	[city_code] [nvarchar](10) NOT NULL,
	[city_name] [nvarchar](25) NULL,
	[country_id] [int] NOT NULL,
 CONSTRAINT [PK_REG_CITIES] PRIMARY KEY CLUSTERED 
(
	[city_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[REG_COUNTRIES]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[REG_COUNTRIES](
	[country_id] [int] IDENTITY(1,1) NOT NULL,
	[country_code] [nvarchar](5) NULL,
	[country_name] [nvarchar](20) NOT NULL,
 CONSTRAINT [PK_REG_COUNTRIES] PRIMARY KEY CLUSTERED 
(
	[country_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[REG_FEE_RECEIVER]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[REG_FEE_RECEIVER](
	[RECEIVER_ID] [tinyint] NOT NULL,
	[RECEIVER_NAME] [nvarchar](50) NULL,
 CONSTRAINT [PK_REG_FEE_RECEIVER] PRIMARY KEY CLUSTERED 
(
	[RECEIVER_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[REG_FEE_RULES]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[REG_FEE_RULES](
	[FEE_ID] [int] IDENTITY(1,1) NOT NULL,
	[MERCHANT_ID] [int] NULL,
	[FEE_TYPE] [tinyint] NULL,
	[FEE_RECEIVER_ID] [tinyint] NULL,
	[FEE_CONDITION] [float] NULL,
	[FEE_AMOUNT] [float] NULL,
	[PRODUCT_TYPE_ID] [tinyint] NULL,
	[VALIDITY_DATE] [date] NULL,
 CONSTRAINT [PK_REG_FEE_RULES] PRIMARY KEY CLUSTERED 
(
	[FEE_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[REG_FEE_TYPE]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[REG_FEE_TYPE](
	[REG_FEE_TYPE_ID] [tinyint] NOT NULL,
	[REG_FEE_TYPE_NAME] [nvarchar](20) NULL,
 CONSTRAINT [PK_REG_FEE_TYPE] PRIMARY KEY CLUSTERED 
(
	[REG_FEE_TYPE_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[REG_PRODUCT_TYPE]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[REG_PRODUCT_TYPE](
	[TYPE_ID] [tinyint] NOT NULL,
	[TYPE_NAME] [nvarchar](20) NULL,
 CONSTRAINT [PK_REG_PROEDUCT_TYPE] PRIMARY KEY CLUSTERED 
(
	[TYPE_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ROLES]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ROLES](
	[ROLE_ID] [bigint] IDENTITY(1,1) NOT NULL,
	[ROLENAME] [nvarchar](50) NULL,
	[DESCRIPTION] [nvarchar](100) NULL,
 CONSTRAINT [PK_ROLES] PRIMARY KEY CLUSTERED 
(
	[ROLE_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[USER_GROUPS]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[USER_GROUPS](
	[user_id] [bigint] NOT NULL,
	[group_id] [bigint] NOT NULL,
 CONSTRAINT [PK_USER_GROUPS] PRIMARY KEY CLUSTERED 
(
	[user_id] ASC,
	[group_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[USERS]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[USERS](
	[USER_ID] [bigint] IDENTITY(1,1) NOT NULL,
	[username] [nvarchar](20) NULL,
	[email] [nvarchar](128) NULL,
	[password] [nvarchar](20) NULL,
	[is_approved] [bit] NULL,
	[full_name] [nvarchar](50) NULL,
 CONSTRAINT [PK_USERS] PRIMARY KEY CLUSTERED 
(
	[USER_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  View [dbo].[PAYMENT_SUCCESSFUL]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[PAYMENT_SUCCESSFUL]
AS
WITH pgw AS (SELECT        transaction_identifier, CASE WHEN tid IS NULL THEN SUBSTRING(end_to_end_id, 1, 8) ELSE TID END AS tid, status, status_date, originated, direction, authorisation_system, transfer_id, instruction_id, 
                                                         instructing_agent, creditor_account, end_to_end_id, debtor_account, CASE WHEN instructed_amount IS NULL THEN 0 ELSE instructed_amount END instructed_amount, instructed_code, creditor_name, creditor_address_line, creditor_address_locality, creditor_address_country, debtor_name, 
                                                         debtor_address_line, debtor_address_locality, debtor_address_country, payment_description, purpose_code, urgency, instrument_code, mcc, creditor_reference, creditor_reference_model, charge, value_date, 
                                                         sync_timestamp, datum, status_code, approval_code, rrn, terminal_sequence, terminal_invoice, mti, processing_code
                               FROM            dbo.PAYMENT_REQUESTS_SERBIA
                               WHERE        (transaction_identifier = N'100') AND (status = N'incoming-credit-transfer-executed' OR
                                                         status = N'executed')), trm AS
    (SELECT        transaction_identifier, tid, status, status_date, originated, direction, authorisation_system, transfer_id, instruction_id, instructing_agent, creditor_account, end_to_end_id, debtor_account, instructed_amount, instructed_code, 
                                creditor_name, creditor_address_line, creditor_address_locality, creditor_address_country, debtor_name, debtor_address_line, debtor_address_locality, debtor_address_country, payment_description, purpose_code, 
                                urgency, instrument_code, mcc, creditor_reference, creditor_reference_model, charge, value_date, sync_timestamp, datum, status_code, approval_code, rrn, terminal_sequence, terminal_invoice, mti, processing_code
      FROM            dbo.PAYMENT_REQUESTS_SERBIA
      WHERE        (transaction_identifier = N'200') AND (mti = '0200') AND (processing_code = N'890000' OR
                                processing_code = N'000000') OR
                                (transaction_identifier = N'200') AND (mti IS NULL))
    SELECT        pgw.transaction_identifier, pgw.tid, pgw.status, pgw.status_date, pgw.originated, pgw.direction, pgw.authorisation_system, pgw.transfer_id, pgw.instruction_id, pgw.instructing_agent, pgw.creditor_account, 
                              pgw.end_to_end_id, pgw.debtor_account, CASE WHEN trm.INSTRUCTED_AMOUNT > pgw.INSTRUCTED_AMOUNT THEN trm.INSTRUCTED_AMOUNT ELSE pgw.INSTRUCTED_AMOUNT END AS INSTRUCTED_AMOUNT, 
                              pgw.instructed_code, pgw.creditor_name, pgw.creditor_address_line, pgw.creditor_address_locality, pgw.creditor_address_country, pgw.debtor_name, pgw.debtor_address_line, pgw.debtor_address_locality, 
                              pgw.debtor_address_country, pgw.payment_description, pgw.purpose_code, pgw.urgency, pgw.instrument_code, pgw.mcc, pgw.creditor_reference, pgw.creditor_reference_model, pgw.charge, pgw.value_date, 
                              pgw.sync_timestamp, pgw.datum, pgw.status_code, CASE WHEN pgw.APPROVAL_CODE IS NULL THEN trm.APPROVAL_CODE ELSE pgw.APPROVAL_CODE END AS APPROVAL_CODE, pgw.rrn, pgw.terminal_sequence, 
                              pgw.terminal_invoice
     FROM            pgw LEFT OUTER JOIN
                              trm ON pgw.end_to_end_id = trm.end_to_end_id
GO
/****** Object:  View [dbo].[PAYMENT_SUCCESSFUL2]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[PAYMENT_SUCCESSFUL2]
AS
WITH pgw AS (SELECT        transaction_identifier, CASE WHEN tid IS NULL THEN SUBSTRING(end_to_end_id, 1, 8) ELSE TID END AS tid, status, status_date, originated, direction, authorisation_system, transfer_id, instruction_id, 
                                                         instructing_agent, creditor_account, end_to_end_id, debtor_account, CASE WHEN instructed_amount IS NULL THEN 0 ELSE instructed_amount END instructed_amount, instructed_code, creditor_name, creditor_address_line, creditor_address_locality, creditor_address_country, debtor_name, 
                                                         debtor_address_line, debtor_address_locality, debtor_address_country, payment_description, purpose_code, urgency, instrument_code, mcc, creditor_reference, creditor_reference_model, charge, value_date, 
                                                         sync_timestamp, datum, status_code, approval_code, rrn, terminal_sequence, terminal_invoice, mti, processing_code
                               FROM            dbo.PAYMENT_REQUESTS_SERBIA
                               WHERE        (transaction_identifier = N'100') AND (status = N'incoming-credit-transfer-executed' OR
                                                         status = N'executed')), trm AS
    (SELECT        transaction_identifier, tid, status, status_date, originated, direction, authorisation_system, transfer_id, instruction_id, instructing_agent, creditor_account, end_to_end_id, debtor_account, instructed_amount, instructed_code, 
                                creditor_name, creditor_address_line, creditor_address_locality, creditor_address_country, debtor_name, debtor_address_line, debtor_address_locality, debtor_address_country, payment_description, purpose_code, 
                                urgency, instrument_code, mcc, creditor_reference, creditor_reference_model, charge, value_date, sync_timestamp, datum, status_code, approval_code, rrn, terminal_sequence, terminal_invoice, mti, processing_code
      FROM            dbo.PAYMENT_REQUESTS_SERBIA
      WHERE        (transaction_identifier = N'200') AND (mti = '0200') AND (processing_code = N'890000' OR
                                processing_code = N'000000') OR
                                (transaction_identifier = N'200') AND (mti IS NULL))
    SELECT        pgw.transaction_identifier, pgw.tid, pgw.status, pgw.status_date, pgw.originated, pgw.direction, pgw.authorisation_system, pgw.transfer_id, pgw.instruction_id, pgw.instructing_agent, pgw.creditor_account, 
                              pgw.end_to_end_id, pgw.debtor_account, CASE WHEN trm.INSTRUCTED_AMOUNT > pgw.INSTRUCTED_AMOUNT THEN trm.INSTRUCTED_AMOUNT ELSE pgw.INSTRUCTED_AMOUNT END AS INSTRUCTED_AMOUNT, 
                              pgw.instructed_code, pgw.creditor_name, pgw.creditor_address_line, pgw.creditor_address_locality, pgw.creditor_address_country, pgw.debtor_name, pgw.debtor_address_line, pgw.debtor_address_locality, 
                              pgw.debtor_address_country, pgw.payment_description, pgw.purpose_code, pgw.urgency, pgw.instrument_code, pgw.mcc, pgw.creditor_reference, pgw.creditor_reference_model, pgw.charge, pgw.value_date, 
                              pgw.sync_timestamp, pgw.datum, pgw.status_code, CASE WHEN pgw.APPROVAL_CODE IS NULL THEN trm.APPROVAL_CODE ELSE pgw.APPROVAL_CODE END AS APPROVAL_CODE, pgw.rrn, pgw.terminal_sequence, 
                              pgw.terminal_invoice
     FROM            pgw LEFT OUTER JOIN
                              trm ON pgw.end_to_end_id = trm.end_to_end_id
GO
/****** Object:  View [dbo].[TRANSACTIONS]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[TRANSACTIONS]
AS
WITH TRN AS (SELECT DISTINCT end_to_end_id, dbo.GET_TID(end_to_end_id) AS TID, dbo.GET_STATUS(end_to_end_id) AS STATUS, dbo.GET_DATUM(end_to_end_id) AS DATUM, dbo.GET_AMOUNT(end_to_end_id) AS AMOUNT
                                FROM            dbo.PAYMENT_REQUESTS_SERBIA)
    SELECT        end_to_end_id, TID, STATUS, DATUM, AMOUNT
     FROM            TRN AS TRN_1
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_ACQ_MERCHANTS]    Script Date: 7/6/2020 11:17:01 AM ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_ACQ_MERCHANTS] ON [dbo].[ACQ_MERCHANTS]
(
	[local_merchant_id] ASC
)
WHERE ([local_merchant_id] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_ACQ_POINTS_OF_SALE]    Script Date: 7/6/2020 11:17:01 AM ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_ACQ_POINTS_OF_SALE] ON [dbo].[ACQ_POINTS_OF_SALE]
(
	[point_of_sale_local_id] ASC
)
WHERE ([point_of_sale_local_id] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UN_ACQUIRER_TID]    Script Date: 7/6/2020 11:17:01 AM ******/
CREATE UNIQUE NONCLUSTERED INDEX [UN_ACQUIRER_TID] ON [dbo].[ACQ_TERMINALS]
(
	[acquirer_tid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[ACQ_MERCHANTS] ADD  CONSTRAINT [DF_ACQ_MERCHANTS_default_payment_method]  DEFAULT ('A') FOR [default_payment_method]
GO
ALTER TABLE [dbo].[PAYMENT_REQUESTS_SERBIA] ADD  CONSTRAINT [DF_PAYMENT_REQUESTS_SERBIA_instructed_amount]  DEFAULT ((0)) FOR [instructed_amount]
GO
ALTER TABLE [dbo].[ACQ_MERCHANTS]  WITH CHECK ADD  CONSTRAINT [FK_ACQ_MERCHANTS_ACQ_STATUS] FOREIGN KEY([merchant_status])
REFERENCES [dbo].[ACQ_STATUS] ([status_id])
GO
ALTER TABLE [dbo].[ACQ_MERCHANTS] CHECK CONSTRAINT [FK_ACQ_MERCHANTS_ACQ_STATUS]
GO
ALTER TABLE [dbo].[ACQ_MERCHANTS]  WITH CHECK ADD  CONSTRAINT [FK_ACQ_MERCHANTS_PAYMENT_METHODS] FOREIGN KEY([default_payment_method])
REFERENCES [dbo].[ACQ_PAYMENT_METHODS] ([PAYMENT_METHOD_ID])
GO
ALTER TABLE [dbo].[ACQ_MERCHANTS] CHECK CONSTRAINT [FK_ACQ_MERCHANTS_PAYMENT_METHODS]
GO
ALTER TABLE [dbo].[ACQ_MERCHANTS]  WITH CHECK ADD  CONSTRAINT [FK_ACQ_MERCHANTS_REG_CITIES] FOREIGN KEY([merchant_city_id])
REFERENCES [dbo].[REG_CITIES] ([city_id])
GO
ALTER TABLE [dbo].[ACQ_MERCHANTS] CHECK CONSTRAINT [FK_ACQ_MERCHANTS_REG_CITIES]
GO
ALTER TABLE [dbo].[ACQ_POINTS_OF_SALE]  WITH CHECK ADD  CONSTRAINT [FK_ACQ_POINTS_OF_SALE_ACQ_MERCHANTS] FOREIGN KEY([merchant_id])
REFERENCES [dbo].[ACQ_MERCHANTS] ([merchant_id])
GO
ALTER TABLE [dbo].[ACQ_POINTS_OF_SALE] CHECK CONSTRAINT [FK_ACQ_POINTS_OF_SALE_ACQ_MERCHANTS]
GO
ALTER TABLE [dbo].[ACQ_POINTS_OF_SALE]  WITH CHECK ADD  CONSTRAINT [FK_ACQ_POINTS_OF_SALE_ACQ_STATUS] FOREIGN KEY([point_of_sale_status])
REFERENCES [dbo].[ACQ_STATUS] ([status_id])
GO
ALTER TABLE [dbo].[ACQ_POINTS_OF_SALE] CHECK CONSTRAINT [FK_ACQ_POINTS_OF_SALE_ACQ_STATUS]
GO
ALTER TABLE [dbo].[ACQ_POINTS_OF_SALE]  WITH CHECK ADD  CONSTRAINT [FK_ACQ_POINTS_OF_SALE_REG_CITIES] FOREIGN KEY([point_of_sale_city_id])
REFERENCES [dbo].[REG_CITIES] ([city_id])
GO
ALTER TABLE [dbo].[ACQ_POINTS_OF_SALE] CHECK CONSTRAINT [FK_ACQ_POINTS_OF_SALE_REG_CITIES]
GO
ALTER TABLE [dbo].[ACQ_TERMINALS]  WITH CHECK ADD  CONSTRAINT [FK_ACQ_TERMINALS_ACQ_POINTS_OF_SALE] FOREIGN KEY([point_of_sale_id])
REFERENCES [dbo].[ACQ_POINTS_OF_SALE] ([point_of_sale_id])
GO
ALTER TABLE [dbo].[ACQ_TERMINALS] CHECK CONSTRAINT [FK_ACQ_TERMINALS_ACQ_POINTS_OF_SALE]
GO
ALTER TABLE [dbo].[ACQ_TERMINALS]  WITH CHECK ADD  CONSTRAINT [FK_ACQ_TERMINALS_ACQ_STATUS] FOREIGN KEY([terminal_status])
REFERENCES [dbo].[ACQ_STATUS] ([status_id])
GO
ALTER TABLE [dbo].[ACQ_TERMINALS] CHECK CONSTRAINT [FK_ACQ_TERMINALS_ACQ_STATUS]
GO
ALTER TABLE [dbo].[GROUP_ROLES]  WITH CHECK ADD  CONSTRAINT [FK_GROUP_ROLES_GROUPS] FOREIGN KEY([GROUP_ID])
REFERENCES [dbo].[GROUPS] ([GROUP_ID])
GO
ALTER TABLE [dbo].[GROUP_ROLES] CHECK CONSTRAINT [FK_GROUP_ROLES_GROUPS]
GO
ALTER TABLE [dbo].[GROUP_ROLES]  WITH CHECK ADD  CONSTRAINT [FK_GROUP_ROLES_ROLES] FOREIGN KEY([ROLE_ID])
REFERENCES [dbo].[ROLES] ([ROLE_ID])
GO
ALTER TABLE [dbo].[GROUP_ROLES] CHECK CONSTRAINT [FK_GROUP_ROLES_ROLES]
GO
ALTER TABLE [dbo].[PAYMENT_TOKENS]  WITH CHECK ADD  CONSTRAINT [FK_PAYMENT_TOKENS_ACQ_STATUS] FOREIGN KEY([token_status])
REFERENCES [dbo].[ACQ_STATUS] ([status_id])
GO
ALTER TABLE [dbo].[PAYMENT_TOKENS] CHECK CONSTRAINT [FK_PAYMENT_TOKENS_ACQ_STATUS]
GO
ALTER TABLE [dbo].[PAYMENT_TOKENS]  WITH CHECK ADD  CONSTRAINT [FK_PAYMENT_TOKENS_ACQ_TERMINALS] FOREIGN KEY([terminal_id])
REFERENCES [dbo].[ACQ_TERMINALS] ([terminal_id])
GO
ALTER TABLE [dbo].[PAYMENT_TOKENS] CHECK CONSTRAINT [FK_PAYMENT_TOKENS_ACQ_TERMINALS]
GO
ALTER TABLE [dbo].[PAYMENT_TOKENS_WS]  WITH CHECK ADD  CONSTRAINT [FK_PAYMENT_TOKENS_ACQ_STATUS_WS] FOREIGN KEY([token_status])
REFERENCES [dbo].[ACQ_STATUS] ([status_id])
GO
ALTER TABLE [dbo].[PAYMENT_TOKENS_WS] CHECK CONSTRAINT [FK_PAYMENT_TOKENS_ACQ_STATUS_WS]
GO
ALTER TABLE [dbo].[REG_CITIES]  WITH CHECK ADD  CONSTRAINT [FK_REG_CITIES_REG_COUNTRIES] FOREIGN KEY([country_id])
REFERENCES [dbo].[REG_COUNTRIES] ([country_id])
GO
ALTER TABLE [dbo].[REG_CITIES] CHECK CONSTRAINT [FK_REG_CITIES_REG_COUNTRIES]
GO
ALTER TABLE [dbo].[REG_FEE_RULES]  WITH CHECK ADD  CONSTRAINT [FK_REG_FEE_RULES_PRODUCTS] FOREIGN KEY([PRODUCT_TYPE_ID])
REFERENCES [dbo].[REG_PRODUCT_TYPE] ([TYPE_ID])
GO
ALTER TABLE [dbo].[REG_FEE_RULES] CHECK CONSTRAINT [FK_REG_FEE_RULES_PRODUCTS]
GO
ALTER TABLE [dbo].[REG_FEE_RULES]  WITH CHECK ADD  CONSTRAINT [FK_REG_FEE_RULES_RECEIVERS] FOREIGN KEY([FEE_RECEIVER_ID])
REFERENCES [dbo].[REG_FEE_RECEIVER] ([RECEIVER_ID])
GO
ALTER TABLE [dbo].[REG_FEE_RULES] CHECK CONSTRAINT [FK_REG_FEE_RULES_RECEIVERS]
GO
ALTER TABLE [dbo].[REG_FEE_RULES]  WITH CHECK ADD  CONSTRAINT [FK_REG_FEE_RULES_TYPE] FOREIGN KEY([FEE_TYPE])
REFERENCES [dbo].[REG_FEE_TYPE] ([REG_FEE_TYPE_ID])
GO
ALTER TABLE [dbo].[REG_FEE_RULES] CHECK CONSTRAINT [FK_REG_FEE_RULES_TYPE]
GO
ALTER TABLE [dbo].[USER_GROUPS]  WITH CHECK ADD  CONSTRAINT [FK_USER_GROUPS_GROUPS] FOREIGN KEY([group_id])
REFERENCES [dbo].[GROUPS] ([GROUP_ID])
GO
ALTER TABLE [dbo].[USER_GROUPS] CHECK CONSTRAINT [FK_USER_GROUPS_GROUPS]
GO
ALTER TABLE [dbo].[USER_GROUPS]  WITH CHECK ADD  CONSTRAINT [FK_USER_GROUPS_USERS] FOREIGN KEY([user_id])
REFERENCES [dbo].[USERS] ([USER_ID])
GO
ALTER TABLE [dbo].[USER_GROUPS] CHECK CONSTRAINT [FK_USER_GROUPS_USERS]
GO
/****** Object:  StoredProcedure [dbo].[ACTIVATE_USER]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[ACTIVATE_USER]
	-- Add the parameters for the stored procedure here
	@USER_ID NVARCHAR(64),
	@ACTIVATION_CODE NVARCHAR(16),
	@TID NVARCHAR(8) OUT,
	@STATUS NVARCHAR(2) OUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @count int, @terminal_id int;
    -- Insert statements for procedure here
	IF EXISTS( SELECT *
	  FROM ACQ_TERMINALS
	 WHERE ACQ_TERMINALS.activation_code = @ACTIVATION_CODE
	   AND ACQ_TERMINALS.user_id = @USER_ID
	   AND ACQ_TERMINALS.terminal_status = 200)
	   BEGIN
		SET @STATUS = '00';
		SELECT @TID = ACQ_TERMINALS.acquirer_tid
			 ,  @terminal_id = ACQ_TERMINALS.terminal_id 
		  FROM ACQ_TERMINALS
		 WHERE ACQ_TERMINALS.user_id = @USER_ID;

	    UPDATE ACQ_TERMINALS 
		   SET ACQ_TERMINALS.terminal_status = 100
		 WHERE ACQ_TERMINALS.terminal_id = @terminal_id;
	   END
	   ELSE
	   BEGIN
		SET @STATUS = '05';
	   END;

END
GO
/****** Object:  StoredProcedure [dbo].[ADD_ACQ_MERCHANTS]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[ADD_ACQ_MERCHANTS]
        @merchant_id nvarchar(50) OUTPUT
      , @merchant_name nvarchar(50)
      , @merchant_address nvarchar(50)
      , @merchant_city_code nvarchar(10)
	  , @merchant_city_name nvarchar(50)
      , @merchant_status nvarchar(3)
      , @mcc nvarchar(10)
      , @merchant_personal_identity_number nvarchar(50)
      , @merchant_tax_identity_number nvarchar(50)
	  , @default_payment_method char
      , @merchant_account nvarchar(20)
	  , @merchant_payment_code nvarchar(3)
	  , @e_mail nvarchar(50)
      , @status int OUTPUT
AS
BEGIN

DECLARE @city_id int;
EXEC	[dbo].[GET_CITY_ID2]
		@city_code = @merchant_city_code,
		@city_name = @merchant_city_name,
		@city_id = @city_id OUTPUT

		IF(@merchant_id IS NULL OR @merchant_id = '')
		BEGIN
			SELECT @merchant_id = IDENT_CURRENT('ACQ_MERCHANTS') + 1;
		END;

INSERT
  INTO ACQ_MERCHANTS(
        merchant_name
      , merchant_address
      , merchant_city_id
      , merchant_setup_date
      , merchant_status
      , mcc
      , merchant_account
      , merchant_perc_fee
      , merchant_min_fee
      , default_payment_method
      , tax_identity_number
      , personal_identity_number
      , local_merchant_id
	  , payment_code
	  , e_mail
      )
 VALUES (
        @merchant_name
      , @merchant_address
      , @city_id
      , getdate()
      , @merchant_status
      , @mcc
      , @merchant_account
      , 1
      , 1
      , @default_payment_method
      , @merchant_tax_identity_number
      , @merchant_personal_identity_number
      , @merchant_id
	  , @merchant_payment_code
	  , @e_mail
      );
  SET @status = 0;
END;
GO
/****** Object:  StoredProcedure [dbo].[ADD_ACQ_POINTS_OF_SALE]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[ADD_ACQ_POINTS_OF_SALE]
        @point_of_sale_local_id nvarchar(15) OUTPUT
      , @local_merchant_id nvarchar(50)
      , @point_of_sale_name nvarchar(50)
      , @point_of_sale_address nvarchar(50)
      , @point_of_sale_status nvarchar(3)
      , @point_of_sale_city_code nvarchar(10)
	  , @point_of_sale_city_name nvarchar(50)
      , @default_payment_method nvarchar(1)
      , @point_of_sale_account nvarchar(20)
	  , @mcc nvarchar(10)
	  , @channel_type nvarchar(50)
      , @status int OUTPUT
AS
BEGIN
  DECLARE @city_id int, @merchant_id int;
  SET @status = 0;

   EXEC [dbo].[GET_CITY_ID2]
   		@city_code = @point_of_sale_city_code,
		@city_name = @point_of_sale_city_name,
		@city_id = @city_id OUTPUT;
    SET @merchant_id = [dbo].[GET_MERCHANT_ID] (@local_merchant_id);
  BEGIN TRY

	  IF(@point_of_sale_local_id IS NULL OR @point_of_sale_local_id = '')
	  BEGIN
		  SELECT @point_of_sale_local_id = IDENT_CURRENT('ACQ_POINTS_OF_SALE') + 1;
	  END;
	INSERT
	  INTO ACQ_POINTS_OF_SALE(
			point_of_sale_name
		  , point_of_sale_address
		  , point_of_sale_setup_date
		  , point_of_sale_status
		  , merchant_id
		  , point_of_sale_city_id
		  , point_of_sale_local_id
		  , default_payment_method
		  , point_of_sale_account
		  , mcc
		  , channel_type
		  )
	 VALUES (
			@point_of_sale_name
		  , @point_of_sale_address
		  , getdate()
		  , @point_of_sale_status
		  , @merchant_id
		  , @city_id
		  , @point_of_sale_local_id
		  , @default_payment_method
		  , @point_of_sale_account
		  , @mcc
		  , @channel_type
		  );
  END TRY
  BEGIN CATCH
	  SET @status = 5;
  END CATCH;
END;
GO
/****** Object:  StoredProcedure [dbo].[ADD_ACQ_TERMINALS]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[ADD_ACQ_TERMINALS]
        @acquirer_tid nvarchar(8) OUTPUT
      , @terminal_status nvarchar(3)
      , @point_of_sale_local_id nvarchar(20)
      , @default_payment_method nvarchar(1)
      , @terminal_account nvarchar(50)
      , @terminal_type nvarchar(50)
      , @user_id nvarchar(64) OUTPUT
      , @activation_code nvarchar(16) OUTPUT
	  , @mobile_phone nvarchar(20) 
      , @status int OUTPUT
AS
BEGIN
Declare @point_of_sale_id int, @terminal_id int;
SET @status = 0;
 SET @point_of_sale_id = [dbo].[GET_POINT_OF_SALE_ID] (@point_of_sale_local_id);

 BEGIN TRY
 	IF (@acquirer_tid is null OR @acquirer_tid = '')
	BEGIN
		SELECT @terminal_id = IDENT_CURRENT('ACQ_TERMINALS');
		SET @acquirer_tid = 90000000 + @terminal_id + 1;
	END;
	print '[' + @acquirer_tid + ']';

INSERT
  INTO ACQ_TERMINALS(
        terminal_setup_date
      , terminal_status
      , point_of_sale_id
      , acquirer_tid
      , activation_code
      , user_id
      , default_payment_method
      , terminal_account
      , terminal_type
	  , contact_phone_no
      )
 VALUES (
        getdate()
      , @terminal_status
      , @point_of_sale_id
      , @acquirer_tid
      , @activation_code
      , @user_id
      , @default_payment_method
      , @terminal_account
      , @terminal_type
	  , @mobile_phone
      );

 
  SELECT @user_id = user_id
       , @activation_code = activation_code
    FROM ACQ_TERMINALS
   WHERE acquirer_tid = @acquirer_tid;

END TRY
BEGIN CATCH
	print @acquirer_tid;
    print ERROR_MESSAGE();
	SET @status = 5;
END CATCH;


END;
GO
/****** Object:  StoredProcedure [dbo].[CHECK_TOKEN]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[CHECK_TOKEN]
	-- Add the parameters for the stored procedure here
	@TID NVARCHAR(8), 
	@TOKEN NVARCHAR(128),
	@STATUS NVARCHAR(2) OUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @count int, @terminal_id int;
    -- Insert statements for procedure here



		SELECT @terminal_id = terminal_id
		  FROM ACQ_TERMINALS
		 WHERE ACQ_TERMINALS.acquirer_tid = @TID
		   AND ACQ_TERMINALS.terminal_status = 100;

		IF EXISTS(SELECT * FROM PAYMENT_TOKENS 
				   WHERE terminal_id = @terminal_id
				     AND token_value = @TOKEN
					 AND expiry_time > getdate()
					 AND token_status = 100)
		BEGIN
			SET @STATUS = '00';
		END;
		ELSE
		BEGIN
			SET @STATUS = '05';
		END;
		

END
GO
/****** Object:  StoredProcedure [dbo].[CHECK_TOKEN_WS]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[CHECK_TOKEN_WS]
	-- Add the parameters for the stored procedure here
	@TOKEN NVARCHAR(128),
	@STATUS NVARCHAR(2) OUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @count int;
    -- Insert statements for procedure here

		IF EXISTS(SELECT * FROM PAYMENT_TOKENS_WS 
				   WHERE token_value = @TOKEN
					 AND expiry_time > getdate()
					 AND token_status = 100)
		BEGIN
			SET @STATUS = '00';
		END;
		ELSE
		BEGIN
			SET @STATUS = '05';
		END;
		

END
GO
/****** Object:  StoredProcedure [dbo].[GENERATE_CREDENTIALS]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[GENERATE_CREDENTIALS] 
	-- Add the parameters for the stored procedure here
	@TERMINAL_ID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @count int, @user_id nvarchar(64), @activation_code nvarchar(16);
    -- Insert statements for procedure here
	SET @count = 1;
	WHILE (@count > 0)
	BEGIN
		EXEC dbo.GENERATE_TOKEN 64 , @user_id OUT;
		SELECT @count = COUNT(*)
		  FROM dbo.ACQ_TERMINALS
		 WHERE terminal_id = @TERMINAL_ID
		   AND [user_id] = @user_id; 
	END;

	SET @count = 1;
	WHILE (@count > 0)
	BEGIN
		EXEC dbo.GENERATE_TOKEN 16 , @activation_code OUT;
		SELECT @count = COUNT(*)
		  FROM dbo.ACQ_TERMINALS
		 WHERE terminal_id = @TERMINAL_ID
		   AND activation_code = @activation_code; 
	END;

	print @user_id;
	print @activation_code;

	UPDATE dbo.ACQ_TERMINALS
	   SET [user_id] = @user_id
	     , activation_code = @activation_code
	 WHERE terminal_id = @TERMINAL_ID;
END
GO
/****** Object:  StoredProcedure [dbo].[GENERATE_TOKEN]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date, ,>
-- Description:	<Description, ,>
-- =============================================
CREATE PROCEDURE [dbo].[GENERATE_TOKEN] 
(
	-- Add the parameters for the function here
	@SIZE int,
	@RESULT NVARCHAR(250) OUTPUT
)

AS
BEGIN
	-- Declare the return variable here
	declare @counter tinyint
	declare @nextChar char(1)
	declare @rnd as float

set @counter = 1
set @RESULT = ''

while @counter <= @SIZE
begin
    -- crypt_gen_random produces a random number. We need a random    
    -- float.
    select @rnd = cast(cast(cast(crypt_gen_random(2) AS int) AS float) /    
         65535  as float)  
    select @nextChar = char(48 + convert(int, (122-48+1) * @rnd))
    if ascii(@nextChar) not in (58,59,60,61,62,63,64,91,92,93,94,95,96)
    begin
        select @RESULT = @RESULT + @nextChar
        set @counter = @counter + 1
    end
 end

END
GO
/****** Object:  StoredProcedure [dbo].[GET_APPROVAL_CODE]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[GET_APPROVAL_CODE]
	@nextval  int OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	UPDATE APPROVAL_CODE_SEQ SET NEXTVAL = NEXTVAL + 1

	SELECT @nextval = NEXTVAL FROM  APPROVAL_CODE_SEQ;

	IF (@nextval IS NULL) 
	BEGIN
		SET @nextval = 100001;
		INSERT INTO APPROVAL_CODE_SEQ ( NEXTVAL ) 
		                       VALUES ( @nextval );

	END

	IF (@nextval > 999999) 
	BEGIN
		SET @nextval = 100001;
		UPDATE APPROVAL_CODE_SEQ SET NEXTVAL = @nextval;

	END
END
GO
/****** Object:  StoredProcedure [dbo].[GET_CITY_ID]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[GET_CITY_ID] 
	-- Add the parameters for the stored procedure here
	  @city_code nvarchar(10) 
	, @city_id int OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	BEGIN TRY
	IF EXISTS (SELECT 1 FROM REG_CITIES WHERE city_code = @city_code) 
	BEGIN
	   SELECT @city_id = city_id FROM REG_CITIES WHERE city_code = @city_code
	END
	ELSE
	BEGIN
	   INSERT INTO REG_CITIES(city_code, city_name, country_id) VALUES(@city_code, '', 1)
	   SELECT @city_id = SCOPE_IDENTITY()  
	END
	END TRY
	BEGIN CATCH
		SET @city_id = NULL;
	END CATCH
    -- Insert statements for procedure here

END
GO
/****** Object:  StoredProcedure [dbo].[GET_CITY_ID2]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[GET_CITY_ID2] 
	-- Add the parameters for the stored procedure here
	  @city_code nvarchar(10) 
	, @city_name nvarchar(50)
	, @city_id int OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	BEGIN TRY
	IF EXISTS (SELECT 1 FROM REG_CITIES WHERE city_code = @city_code) 
	BEGIN
	   SELECT @city_id = city_id FROM REG_CITIES WHERE city_code = @city_code
	   
	   IF NOT EXISTS (SELECT 1 FROM REG_CITIES WHERE city_id = @city_id AND city_name = @city_name)
	   BEGIN
			UPDATE REG_CITIES
			   SET city_name = @city_name
			 WHERE city_id = @city_id;
	   END;
	END
	ELSE
	BEGIN
	   INSERT INTO REG_CITIES(city_code, city_name, country_id) VALUES(@city_code, @city_name, 1)
	   SELECT @city_id = SCOPE_IDENTITY()  
	END
	END TRY
	BEGIN CATCH
		SET @city_id = NULL;
	END CATCH
    -- Insert statements for procedure here

END
GO
/****** Object:  StoredProcedure [dbo].[GET_MERCHANT_DETAILS]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[GET_MERCHANT_DETAILS]
	-- Add the parameters for the stored procedure here
		@I_TID nvarchar(8)
      , @merchant_payment_method nvarchar(1) OUT
      , @merchant_account nvarchar(20) OUT
      , @merchant_name nvarchar(50) OUT
      , @merchant_local_id nvarchar(50) OUT
      , @merchant_payment_code nvarchar(3) OUT
	  , @merchant_place_name nvarchar(20) OUT
      , @merchant_address nvarchar(50) OUT
      , @merchannt_mcc int OUT
      , @point_of_sale_name nvarchar(50) OUT
	  , @point_of_sale_place nvarchar(20) OUT
      , @point_of_sale_address nvarchar(50) OUT
      , @point_of_sale_local_id nvarchar(15) OUT
      , @point_of_sale_payment_method nvarchar(1) OUT
      , @point_of_sale_account nvarchar(20) OUT
      , @point_of_sale_mcc int OUT
	  , @terminal_payment_method nvarchar(1) OUT
	  , @terminal_account nvarchar(20) OUT
	  , @terminal_type nvarchar(30) OUT
      , @return_enabled int OUT
	  , @ereceipt_enabled int OUT
	  , @service_amount_limit int OUT
AS
BEGIN
	SELECT 
	@merchant_payment_method = case when m.default_payment_method = 'A' THEN NULL ELSE m.default_payment_method END
  , @merchant_account = m.merchant_account
  , @merchant_name = m.merchant_name
  , @merchant_local_id = m.local_merchant_id
  , @merchant_payment_code = m.payment_code
  , @merchant_place_name = c.city_name
  , @merchant_address = m.merchant_address
  , @merchannt_mcc = m.mcc
  , @point_of_sale_name = p.point_of_sale_name
  , @point_of_sale_place = c1.city_name
  , @point_of_sale_address = p.point_of_sale_address
  , @point_of_sale_local_id = p.point_of_sale_local_id
  , @point_of_sale_payment_method = case when p.default_payment_method = 'A' THEN NULL ELSE p.default_payment_method END
  , @point_of_sale_account = p.point_of_sale_account
  , @point_of_sale_mcc = p.mcc
  , @terminal_payment_method = case when t.default_payment_method = 'A' THEN NULL ELSE t.default_payment_method END
  , @terminal_account = terminal_account
  , @terminal_type = t.terminal_type
  , @return_enabled = m.return_enabled
  , @ereceipt_enabled = m.ereceipt_enabled
  , @service_amount_limit = m.service_amount_limit
	  FROM ACQ_MERCHANTS m
	  JOIN ACQ_POINTS_OF_SALE p 
	    ON m.merchant_id = p.merchant_id
      JOIN ACQ_TERMINALS t
	    ON p.point_of_sale_id = t.point_of_sale_id
	  JOIN REG_CITIES c
	    ON m.merchant_city_id = c.city_id
	  JOIN REG_CITIES c1
	    ON p.point_of_sale_city_id = c1.city_id
	 WHERE t.acquirer_tid = @I_TID;
END
GO
/****** Object:  StoredProcedure [dbo].[GET_MERCHANT_DETAILS_WS]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[GET_MERCHANT_DETAILS_WS]
	-- Add the parameters for the stored procedure here
	@I_LOCAL_MERCHANT_ID NVARCHAR(50), 
	@O_MERCHANT_NAME NVARCHAR(50) OUTPUT,
	@O_MERCHANT_ADDRESS NVARCHAR(50) OUTPUT,
	@O_MERCHANT_CITY_CODE NVARCHAR(25) OUTPUT,
	@O_MERCHANT_STATUS NVARCHAR(3) OUTPUT,
	@O_MCC INT OUTPUT,
	@O_MERCHANT_PERSONAL_IDENTITY_NUMBER NVARCHAR(50) OUTPUT,
	@O_MERCHANT_TAX_IDENTITY_NUMBER NVARCHAR(50) OUTPUT,
	@O_DEFAULT_PAYMENT_METHOD NVARCHAR(1) OUTPUT,
	@O_MERCHANT_ACCOUNT_NUMBER NVARCHAR(20) OUTPUT,
	@O_MERCHANT_PAYMENT_CODE NVARCHAR(3) OUTPUT,
	@O_E_MAIL NVARCHAR(50) OUTPUT
AS
BEGIN
    DECLARE @MERCHANT_ID int;

	SELECT @MERCHANT_ID = [dbo].[GET_MERCHANT_ID] (@I_LOCAL_MERCHANT_ID);



	SELECT @O_MERCHANT_ACCOUNT_NUMBER = m.merchant_account
	     , @O_MERCHANT_NAME = m.merchant_name
		 , @O_MERCHANT_ADDRESS = m.merchant_address
		 , @O_MERCHANT_CITY_CODE = c.city_code
		 , @O_MERCHANT_STATUS = m.merchant_status
		 , @O_MCC = m.mcc
		 , @O_MERCHANT_PERSONAL_IDENTITY_NUMBER = m.personal_identity_number
		 , @O_MERCHANT_TAX_IDENTITY_NUMBER = m.tax_identity_number
		 , @O_DEFAULT_PAYMENT_METHOD = m.default_payment_method
		 , @O_MERCHANT_PAYMENT_CODE = m.payment_code
		 , @O_E_MAIL = m.e_mail
	  FROM ACQ_MERCHANTS m
	  JOIN REG_CITIES c
	    ON m.merchant_city_id = c.city_id
	 WHERE m.merchant_id = @MERCHANT_ID;
END
GO
/****** Object:  StoredProcedure [dbo].[GET_POINT_OF_SALE_DETAILS_WS]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[GET_POINT_OF_SALE_DETAILS_WS]
	-- Add the parameters for the stored procedure here
	  @I_POINT_OF_SALE_LOCAL_ID	NVARCHAR(15)
	, @LOCAL_MERCHANT_ID nvarchar(50) OUTPUT
	, @POINT_OF_SALE_NAME nvarchar(50) OUTPUT
	, @POINT_OF_SALE_ADDRESS nvarchar(50) OUTPUT
	, @POINT_OF_SALE_STATUS nvarchar(50) OUTPUT
	, @CITY_CODE nvarchar(10) OUTPUT
	, @CITY_NAME nvarchar(25) OUTPUT
	, @DEFAULT_PAYMENT_METHOD nvarchar(1) OUTPUT
	, @POINT_OF_SALE_ACCOUNT nvarchar(20) OUTPUT
	, @MCC nvarchar(10) OUTPUT
	, @CHANNEL_TYPE nvarchar(50) OUTPUT
AS
BEGIN

	SELECT @LOCAL_MERCHANT_ID = m.local_merchant_id
		 , @POINT_OF_SALE_NAME = p.point_of_sale_name
		 , @POINT_OF_SALE_ADDRESS = p.point_of_sale_address
		 , @POINT_OF_SALE_STATUS = p.point_of_sale_status
		 , @CITY_CODE = c.city_code
		 , @CITY_NAME = c.city_name
		 , @DEFAULT_PAYMENT_METHOD = p.default_payment_method
		 , @POINT_OF_SALE_ACCOUNT = p.point_of_sale_account
		 , @MCC = p.mcc
		 , @CHANNEL_TYPE = p.channel_type
	  FROM ACQ_MERCHANTS m
	  JOIN ACQ_POINTS_OF_SALE p
	    ON m.merchant_id = p.merchant_id
	  JOIN REG_CITIES c
	    ON p.point_of_sale_city_id = c.city_id
     WHERE p.point_of_sale_local_id = @I_POINT_OF_SALE_LOCAL_ID;
END
GO
/****** Object:  StoredProcedure [dbo].[GET_POINT_OF_SALE_LIST]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GET_POINT_OF_SALE_LIST]
          @local_merchant_id nvarchar(50)
AS
BEGIN
		SELECT apos.point_of_sale_local_id
		     , m.local_merchant_id
			 , apos.point_of_sale_name
			 , apos.point_of_sale_address
			 , apos.point_of_sale_status
			 , c.city_code
			 , c.city_name
			 , apos.default_payment_method
			 , apos.point_of_sale_account
			 , apos.mcc 
			 , apos.channel_type 
		  FROM ACQ_MERCHANTS m 
		  JOIN ACQ_POINTS_OF_SALE apos
			ON m.merchant_id = apos.merchant_id
		  JOIN REG_CITIES c
		    ON apos.point_of_sale_city_id = c.city_id
	     WHERE m.local_merchant_id = @local_merchant_id;
END;
GO
/****** Object:  StoredProcedure [dbo].[GET_POINT_OF_SALE_TERMINALS]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[GET_POINT_OF_SALE_TERMINALS]
	-- Add the parameters for the stored procedure here
	  @I_POINT_OF_SALE_LOCAL_ID	NVARCHAR(15)
AS
BEGIN
/*	INSERT INTO LOG(log_text, log_time) 
	VALUES ('GET_POINT_OF_SALE_TERMINALS ' + @I_POINT_OF_SALE_LOCAL_ID, getdate());*/
	SELECT acquirer_tid
		 , terminal_status
		 , p.point_of_sale_local_id
		 , t.default_payment_method
		 , t.terminal_account
		 , t.terminal_type
		 , t.user_id
		 , t.activation_code
		 , t.contact_phone_no
	  FROM ACQ_POINTS_OF_SALE p
	  JOIN ACQ_TERMINALS t
	    ON p.point_of_sale_id = t.point_of_sale_id
	 WHERE p.point_of_sale_local_id = @I_POINT_OF_SALE_LOCAL_ID;
END
GO
/****** Object:  StoredProcedure [dbo].[GET_TERMINAL_DETAILS]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[GET_TERMINAL_DETAILS]
	-- Add the parameters for the stored procedure here
	    @acquirer_tid	NVARCHAR(15)
      , @terminal_status nvarchar(3) OUTPUT
      , @point_of_sale_local_id nvarchar(20) OUTPUT
      , @default_payment_method nvarchar(1) OUTPUT
      , @terminal_account nvarchar(50) OUTPUT
      , @terminal_type nvarchar(50) OUTPUT
      , @user_id nvarchar(64) OUTPUT
      , @activation_code nvarchar(16) OUTPUT
	  , @mobile_phone nvarchar(20) OUTPUT
AS
BEGIN

	SELECT @terminal_status = terminal_status
		 , @point_of_sale_local_id = p.point_of_sale_local_id
		 , @default_payment_method = t.default_payment_method
		 , @terminal_account = t.terminal_account
		 , @terminal_type = t.terminal_type
		 , @user_id = t.user_id
		 , @activation_code = t.activation_code
		 , @mobile_phone = t.contact_phone_no
	  FROM ACQ_POINTS_OF_SALE p
	  JOIN ACQ_TERMINALS t
	    ON p.point_of_sale_id = t.point_of_sale_id
	 WHERE t.acquirer_tid = @acquirer_tid;
END
GO
/****** Object:  StoredProcedure [dbo].[GET_TOKEN]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[GET_TOKEN]
	-- Add the parameters for the stored procedure here
	@TID NVARCHAR(8), 
	@USER_ID NVARCHAR(64),
	@TOKEN NVARCHAR(128) OUT,
	@STATUS NVARCHAR(2) OUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @count int, @terminal_id int;
    -- Insert statements for procedure here
	IF EXISTS( SELECT *
	  FROM ACQ_TERMINALS
	 WHERE ACQ_TERMINALS.acquirer_tid = @TID
	   AND ACQ_TERMINALS.user_id = @USER_ID
	   AND ACQ_TERMINALS.terminal_status = 100)
	   BEGIN
		SET @STATUS = '00';
		SELECT @terminal_id = terminal_id
		  FROM ACQ_TERMINALS
		 WHERE ACQ_TERMINALS.acquirer_tid = @TID
		   AND ACQ_TERMINALS.user_id = @USER_ID
		   AND ACQ_TERMINALS.terminal_status = 100;
		SET @count = 1;
		WHILE (@count > 0)
		BEGIN
			EXEC dbo.GENERATE_TOKEN 64 , @TOKEN OUTPUT;
			print @token;
			SELECT @count = COUNT(*)
			  FROM dbo.PAYMENT_TOKENS
			 WHERE terminal_id = @TERMINAL_ID
			   AND token_value = @TOKEN; 
			END;
		   
		   INSERT INTO PAYMENT_TOKENS(terminal_id, token_value, expiry_time, token_status)
		   VALUES(@terminal_id, @TOKEN, DATEADD(HH, 1, GETDATE()), 100);

	   END
	   ELSE
	   BEGIN
		SET @STATUS = '05';
	   END;

END
GO
/****** Object:  StoredProcedure [dbo].[GET_TOKEN_WS]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[GET_TOKEN_WS]
	-- Add the parameters for the stored procedure here
	@USER_ID NVARCHAR(64),
	@TOKEN NVARCHAR(128) OUT,
	@STATUS NVARCHAR(2) OUT,
	@TOKEN_EXPIRATION DATETIME OUT 
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET @TOKEN_EXPIRATION = DATEADD(HH, 1, GETDATE());
	SET NOCOUNT ON;
	DECLARE @count int;
    -- Insert statements for procedure here
		SET @count = 1;
		WHILE (@count > 0)
		BEGIN
			EXEC dbo.GENERATE_TOKEN 64 , @TOKEN OUTPUT;
			print @token;
			SELECT @count = COUNT(*)
			  FROM dbo.PAYMENT_TOKENS_WS
			 WHERE token_value = @TOKEN; 
		END;
		   
		   INSERT INTO PAYMENT_TOKENS_WS( token_value, expiry_time, token_status)
		   VALUES( @TOKEN, @TOKEN_EXPIRATION, 100);
		   SET @STATUS = 0;
END;


GO
/****** Object:  StoredProcedure [dbo].[GET_TRANSACTIONS]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GET_TRANSACTIONS] 
	-- Add the parameters for the stored procedure here
	@I_TID       nvarchar(20),
    @I_DATE_FROM nvarchar(20),
    @I_DATE_TO   nvarchar(20)
AS

BEGIN
	DECLARE @DATE_FROM DATETIME
	      , @DATE_TO DATETIME
		  , @cycle BIT
		  , @cycle_records BIT
		  , @end_to_end_id nvarchar(50)
		  , @amount decimal(18,2)
		  , @date nvarchar(40)
		  , @status nvarchar(20)
		  , @status_code nvarchar(5)
		  , @tid nvarchar(20)
		  , @t_identifier nvarchar(20)
		  , @t_amount decimal(18,2)
		  , @t_date datetime
		  , @t_status nvarchar(50)
		  , @t_tid nvarchar(40);

	DECLARE @tab table (instructed_amount decimal(16,2)
	                  , end_to_end_id nvarchar(50)
					  , status_date nvarchar(30)
					  , status_code nvarchar(10)
					  , status nvarchar(20)
					  , tid nvarchar(20)
					  , transaction_id nvarchar(50));

	IF (@I_DATE_FROM IS NULL OR @I_DATE_TO IS NULL OR @I_DATE_FROM = '' OR @I_DATE_TO = '')
	BEGIN
		SET @DATE_FROM = DATEADD(hh,-24,GETDATE());
		SET @DATE_TO = GETDATE();	
	END
	ELSE
	BEGIN
	BEGIN TRY
		SET @DATE_FROM = convert(datetime, @I_DATE_FROM, 20);
		SET @DATE_TO = convert(datetime, @I_DATE_TO, 20);
	END TRY
	BEGIN CATCH
		SET @DATE_FROM = DATEADD(hh,-24,GETDATE());
		SET @DATE_TO = GETDATE();
	END CATCH
	END

	SET NOCOUNT ON

	BEGIN



	-- get distinc transactions
	DECLARE C_TRANSACTION CURSOR FOR
	 SELECT DISTINCT p.end_to_end_id
       FROM PAYMENT_REQUESTS_SERBIA p--PAYMENT_SUCCESSFUL p 
      WHERE p.end_to_end_id like @I_TID+'%'
        AND p.DATUM between @DATE_FROM AND @DATE_TO
	  ORDER BY p.end_to_end_id DESC;
	
		
		SET @cycle = 1
		
		OPEN C_TRANSACTION
		WHILE @cycle = 1
		BEGIN  
			FETCH C_TRANSACTION INTO @end_to_end_id
			IF(@@FETCH_STATUS < 0)
				BEGIN
					SET @cycle = 0
				END
			ELSE
				BEGIN
					SET @amount = 0;
					SET @date = NULL;
					SET @status = NULL;
					SET @status_code = NULL;
					SET @tid = NULL;

					DECLARE C_RECORDS CURSOR FOR
					  SELECT p.transaction_identifier, p.instructed_amount, p.datum, p.status, p.tid
					    FROM PAYMENT_REQUESTS_SERBIA p
					   WHERE p.end_to_end_id = @end_to_end_id
					   ORDER BY p.end_to_end_id DESC; 
					
					SET @cycle_records = 1;
					OPEN C_RECORDS
					WHILE @cycle_records = 1
					BEGIN
						FETCH C_RECORDS INTO @t_identifier, @t_amount, @t_date, @t_status, @t_tid;
						IF(@@FETCH_STATUS < 0)
							BEGIN
								SET @cycle_records = 0;
							END
						ELSE
							BEGIN
								
								IF(@status IS NULL AND @t_status IS NOT NULL)
								BEGIN
									IF(@t_status='incoming-credit-transfer-executed' or @t_status='executed')
										BEGIN
											SET @status = 'Izvrsena';
											SET @status_code = '00';
										END
										ELSE
										BEGIN
											SET @status = 'Odbijena';
											SET @status_code = '05';
										END
								END;

								-- storno request executed
								IF(@t_status = 'incoming-credit-transfer-executed' AND @t_identifier = '400')
								BEGIN
									SET @status = 'Stornirana';
									SET @status_code = '06';
								END

								-- storno request confirmed
								IF(@t_status = 'incoming-credit-transfer-return-executed' AND @t_identifier = '100')
								BEGIN
									SET @status = 'Stornirana';
									SET @status_code = '06';
								END


								IF(@t_amount IS NOT NULL)
								BEGIN
									IF (@t_amount > @amount)
										SET @amount = @t_amount;
								END;

								IF(@tid IS NULL AND @t_tid IS NOT NULL)
								BEGIN
									SET @tid = @t_tid;
								END;


								IF(@date IS NULL AND @t_date IS NOT NULL)
								BEGIN
									SET @date = LEFT(CONVERT(VARCHAR(50), CAST(@t_date AS DATETIMEOFFSET), 127), 19);
								END;
								
								
							END;
					END

					INSERT 
					  INTO @tab(end_to_end_id, instructed_amount, status, status_code, status_date, tid, transaction_id) 
				    VALUES     (@end_to_end_id, @amount, @status, @status_code, @date, @tid, @end_to_end_id);

					/*
					PRINT (@end_to_end_id)
					print ( @amount)
					print ( @status );
					PRINT(@date);
					*/
					CLOSE C_RECORDS
					DEALLOCATE C_RECORDS 
				END

		END

		CLOSE C_TRANSACTION
		DEALLOCATE C_TRANSACTION 
		END;

		
		SELECT instructed_amount
		     , end_to_end_id
			 , status_date
			 , status_code
			 , status
			 , tid
			 , transaction_id
		  FROM @tab
		 WHERE status_code IS NOT NULL;
		 

END
GO
/****** Object:  StoredProcedure [dbo].[GET_TRANSACTIONS_DETAILS]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GET_TRANSACTIONS_DETAILS] 
	-- Add the parameters for the stored procedure here
	@I_TID       nvarchar(20),
    @I_DATE_FROM nvarchar(20),
    @I_DATE_TO   nvarchar(20),
	@MERCHANT_NAME nvarchar(50) OUTPUT,
	@MERCHANT_PIB nvarchar(50) OUTPUT,
	@MERCHANT_MB nvarchar(50) OUTPUT,
	@TRN_SUM decimal(16,2) OUTPUT,
	@TRN_COUNT int OUTPUT
AS

BEGIN
SET NOCOUNT ON;

	DECLARE @DATE_FROM DATETIME
	      , @DATE_TO DATETIME
		  , @cycle BIT
		  , @cycle_records BIT
		  , @end_to_end_id nvarchar(50)
		  , @amount decimal(18,2)
		  , @date nvarchar(40)
		  , @status nvarchar(20)
		  , @status_code nvarchar(5)
		  , @tid nvarchar(20)
		  , @t_identifier nvarchar(20)
		  , @t_amount decimal(18,2)
		  , @t_date datetime
		  , @t_status nvarchar(50)
		  , @t_tid nvarchar(40)
		  , @l_status numeric(1); 
		  /*
			0	- izvrsena
			5	- odbijena


		  
		  */ 

	DECLARE @tab table (instructed_amount decimal(16,2)
	                  , end_to_end_id nvarchar(50)
					  , status_date nvarchar(30)
					  , status_code nvarchar(10)
					  , status nvarchar(20)
					  , tid nvarchar(20)
					  , transaction_id nvarchar(50));

	IF (@I_DATE_FROM IS NULL OR @I_DATE_TO IS NULL OR @I_DATE_FROM = '' OR @I_DATE_TO = '')
	BEGIN
		SET @DATE_FROM = DATEADD(hh,-24,GETDATE());
		SET @DATE_TO = GETDATE();	
	END
	ELSE
	BEGIN
	BEGIN TRY
		SET @DATE_FROM = convert(datetime, @I_DATE_FROM, 20);
		SET @DATE_TO = convert(datetime, @I_DATE_TO, 20);
	END TRY
	BEGIN CATCH
		SET @DATE_FROM = DATEADD(hh,-24,GETDATE());
		SET @DATE_TO = GETDATE();
	END CATCH
	END

	IF(@DATE_FROM = @DATE_TO)
	BEGIN
		SET @DATE_TO = GETDATE()
	END;

	SET NOCOUNT ON

	BEGIN



	-- get distinc transactions
	DECLARE C_TRANSACTION CURSOR FOR
	 SELECT DISTINCT p.end_to_end_id
       FROM PAYMENT_SUCCESSFUL p --PAYMENT_REQUESTS_SERBIA p
      WHERE p.tid = @I_TID
        AND p.DATUM between @DATE_FROM AND @DATE_TO
	  ORDER BY p.end_to_end_id DESC;
	
		
		SET @cycle = 1
		
		OPEN C_TRANSACTION
		WHILE @cycle = 1
		BEGIN  
			FETCH C_TRANSACTION INTO @end_to_end_id
			IF(@@FETCH_STATUS < 0)
				BEGIN
					SET @cycle = 0
				END
			ELSE
				BEGIN
					SET @amount = 0;
					SET @date = NULL;
					SET @status = NULL;
					SET @status_code = NULL;
					SET @tid = NULL;

					DECLARE C_RECORDS CURSOR FOR
					  SELECT p.transaction_identifier, p.instructed_amount, p.datum, p.status, p.tid
					    FROM PAYMENT_REQUESTS_SERBIA p
					   WHERE p.end_to_end_id = @end_to_end_id
					   ORDER BY p.instruction_id; 
					
					SET @cycle_records = 1;
					OPEN C_RECORDS
					WHILE @cycle_records = 1
					BEGIN
						FETCH C_RECORDS INTO @t_identifier, @t_amount, @t_date, @t_status, @t_tid;
						IF(@@FETCH_STATUS < 0)
							BEGIN
								SET @cycle_records = 0;
							END
						ELSE
							BEGIN
								
								IF(@status IS NULL AND @t_status IS NOT NULL)
								BEGIN
									IF(@t_status='incoming-credit-transfer-executed' or @t_status='executed')
										BEGIN
											SET @status = 'Izvrsena';
											SET @status_code = '00';
										END
										ELSE
										BEGIN
											SET @status = 'Odbijena';
											SET @status_code = '05';
										END
								END;

								-- storno request executed
								IF(@t_status = 'incoming-credit-transfer-executed' AND @t_identifier = '400')
								BEGIN
									SET @status = 'Stornirana';
									SET @status_code = '06';
								END

								-- storno request confirmed
								IF(@t_status = 'incoming-credit-transfer-return-executed' AND @t_identifier = '100')
								BEGIN
									SET @status = 'Stornirana';
									SET @status_code = '06';
								END



								IF(@t_amount IS NOT NULL)
								BEGIN
									IF (@t_amount > @amount)
										SET @amount = @t_amount;
								END;

								IF(@tid IS NULL AND @t_tid IS NOT NULL)
								BEGIN
									SET @tid = @t_tid;
								END;


								IF(@date IS NULL AND @t_date IS NOT NULL)
								BEGIN
									SET @date = LEFT(CONVERT(VARCHAR(50), CAST(@t_date AS DATETIMEOFFSET), 127), 19);
								END;
								
								
							END;
					END

					INSERT 
					  INTO @tab(end_to_end_id, instructed_amount, status, status_code, status_date, tid, transaction_id) 
				    VALUES     (@end_to_end_id, @amount, @status, @status_code, @date, @tid, @end_to_end_id);

					/*
					PRINT (@end_to_end_id)
					print ( @amount)
					print ( @status );
					PRINT(@date);
					*/
					CLOSE C_RECORDS
					DEALLOCATE C_RECORDS 
				END

		END

		CLOSE C_TRANSACTION
		DEALLOCATE C_TRANSACTION 
		END;

		
		SELECT instructed_amount
		     , end_to_end_id
			 , status_date AS STATUS_DATE
			 , status_code AS STATUS_CODE
			 , status
			 , tid
			 , transaction_id
		  FROM @tab
		 WHERE status_code = '00'
		   AND status_code IS NOT NULL;

		SELECT @TRN_SUM = CAST(SUM(ISNULL(INSTRUCTED_AMOUNT, 0)) AS DECIMAL(16,2))
	     , @TRN_COUNT = count(*)
		  FROM @tab
		 WHERE status_code = '00'
		   AND status_code IS NOT NULL;
		 

		SELECT 	@merchant_name = m.merchant_name,
				@merchant_pib = m.tax_identity_number,
				@merchant_MB = m.personal_identity_number
		  FROM ACQ_MERCHANTS m
		  JOIN ACQ_POINTS_OF_SALE p 
			ON m.merchant_id = p.merchant_id
		  JOIN ACQ_TERMINALS t
			ON p.point_of_sale_id = t.point_of_sale_id
		 WHERE t.acquirer_tid = @I_TID;

    
END
GO
/****** Object:  StoredProcedure [dbo].[GET_TRANSACTIONS_HEADER]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GET_TRANSACTIONS_HEADER] 
	-- Add the parameters for the stored procedure here
	@I_TID       nvarchar(20),
    @I_DATE_FROM nvarchar(20),
    @I_DATE_TO   nvarchar(20),
	@MERCHANT_NAME nvarchar(50) OUTPUT,
	@MERCHANT_PIB nvarchar(50) OUTPUT,
	@MERCHANT_MB nvarchar(50) OUTPUT,
	@TRN_SUM decimal(16,2) OUTPUT,
	@TRN_COUNT int OUTPUT
AS

BEGIN
SET NOCOUNT ON;

	DECLARE @DATE_FROM DATETIME
	      , @DATE_TO DATETIME
		  , @cycle BIT
		  , @cycle_records BIT
		  , @end_to_end_id nvarchar(50)
		  , @amount decimal(18,2)
		  , @date nvarchar(40)
		  , @status nvarchar(20)
		  , @status_code nvarchar(5)
		  , @tid nvarchar(20)
		  , @t_amount decimal(18,2)
		  , @t_date datetime
		  , @t_status nvarchar(50)
		  , @t_tid nvarchar(40);

	DECLARE @tab table (instructed_amount decimal(16,2)
	                  , end_to_end_id nvarchar(50)
					  , status_date nvarchar(30)
					  , status_code nvarchar(10)
					  , status nvarchar(20)
					  , tid nvarchar(20)
					  , transaction_id nvarchar(50));

	IF (@I_DATE_FROM IS NULL OR @I_DATE_TO IS NULL OR @I_DATE_FROM = '' OR @I_DATE_TO = '')
	BEGIN
		SET @DATE_FROM = DATEADD(hh,-24,GETDATE());
		SET @DATE_TO = GETDATE();	
	END
	ELSE
	BEGIN
	BEGIN TRY
		SET @DATE_FROM = convert(datetime, @I_DATE_FROM, 20);
		SET @DATE_TO = convert(datetime, @I_DATE_TO, 20);
	END TRY
	BEGIN CATCH
		SET @DATE_FROM = DATEADD(hh,-24,GETDATE());
		SET @DATE_TO = GETDATE();
	END CATCH
	END

	SET NOCOUNT ON

	BEGIN



	-- get distinc transactions
	DECLARE C_TRANSACTION CURSOR FOR
	 SELECT DISTINCT p.end_to_end_id
       FROM PAYMENT_SUCCESSFUL p --PAYMENT_REQUESTS_SERBIA p
      WHERE p.tid = @I_TID
        AND p.DATUM between @DATE_FROM AND @DATE_TO
	  ORDER BY p.end_to_end_id DESC;
	
		
		SET @cycle = 1
		
		OPEN C_TRANSACTION
		WHILE @cycle = 1
		BEGIN  
			FETCH C_TRANSACTION INTO @end_to_end_id
			IF(@@FETCH_STATUS < 0)
				BEGIN
					SET @cycle = 0
				END
			ELSE
				BEGIN
					SET @amount = 0;
					SET @date = NULL;
					SET @status = NULL;
					SET @status_code = NULL;
					SET @tid = NULL;

					DECLARE C_RECORDS CURSOR FOR
					  SELECT p.instructed_amount, p.datum, p.status, p.tid
					    FROM PAYMENT_REQUESTS_SERBIA p
					   WHERE p.end_to_end_id = @end_to_end_id; 
					
					SET @cycle_records = 1;
					OPEN C_RECORDS
					WHILE @cycle_records = 1
					BEGIN
						FETCH C_RECORDS INTO @t_amount, @t_date, @t_status, @t_tid;
						IF(@@FETCH_STATUS < 0)
							BEGIN
								SET @cycle_records = 0;
							END
						ELSE
							BEGIN
								
								IF(@status IS NULL AND @t_status IS NOT NULL)
								BEGIN
									IF(@t_status='incoming-credit-transfer-executed' or @t_status='executed')
										BEGIN
											SET @status = 'Izvrsena';
											SET @status_code = '00';
										END
										ELSE
										BEGIN
											SET @status = 'Odbijena';
											SET @status_code = '05';
										END
								END;

								IF(@t_amount IS NOT NULL)
								BEGIN
									IF (@t_amount > @amount)
										SET @amount = @t_amount;
								END;

								IF(@tid IS NULL AND @t_tid IS NOT NULL)
								BEGIN
									SET @tid = @t_tid;
								END;


								IF(@date IS NULL AND @t_date IS NOT NULL)
								BEGIN
									SET @date = LEFT(CONVERT(VARCHAR(50), CAST(@t_date AS DATETIMEOFFSET), 127), 19);
								END;
								
								
							END;
					END

					INSERT 
					  INTO @tab(end_to_end_id, instructed_amount, status, status_code, status_date, tid, transaction_id) 
				    VALUES     (@end_to_end_id, @amount, @status, @status_code, @date, @tid, @end_to_end_id);

					/*
					PRINT (@end_to_end_id)
					print ( @amount)
					print ( @status );
					PRINT(@date);
					*/
					CLOSE C_RECORDS
					DEALLOCATE C_RECORDS 
				END

		END

		CLOSE C_TRANSACTION
		DEALLOCATE C_TRANSACTION 
		END;

		
		SELECT instructed_amount
		     , end_to_end_id
			 , status_date
			 , status_code
			 , status
			 , tid
			 , transaction_id
		  FROM @tab
		 WHERE status_code = '00';

		SELECT @TRN_SUM = CAST(SUM(ISNULL(INSTRUCTED_AMOUNT, 0)) AS DECIMAL(16,2))
	     , @TRN_COUNT = count(*)
		  FROM @tab
		 WHERE status_code = '00';
		 

		SELECT 	@merchant_name = m.merchant_name,
				@merchant_pib = m.tax_identity_number,
				@merchant_MB = m.personal_identity_number
		  FROM ACQ_MERCHANTS m
		  JOIN ACQ_POINTS_OF_SALE p 
			ON m.merchant_id = p.merchant_id
		  JOIN ACQ_TERMINALS t
			ON p.point_of_sale_id = t.point_of_sale_id
		 WHERE t.acquirer_tid = @I_TID;

    
END
GO
/****** Object:  StoredProcedure [dbo].[GET_TRANSACTIONS_OLD_WITH_VIEW]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GET_TRANSACTIONS_OLD_WITH_VIEW] 
	-- Add the parameters for the stored procedure here
	@I_TID       nvarchar(20),
    @I_DATE_FROM nvarchar(20),
    @I_DATE_TO   nvarchar(20)
AS

BEGIN
DECLARE @DATE_FROM DATETIME, @DATE_TO DATETIME;

	--insert into log(log_text, log_time) values (@I_TID + ' ' + @I_DATE_FROM + ' ' + 
	
	IF (@I_DATE_FROM IS NULL OR @I_DATE_TO IS NULL OR @I_DATE_FROM = '' OR @I_DATE_TO = '')
	BEGIN
		SET @DATE_FROM = DATEADD(hh,-24,GETDATE());
		SET @DATE_TO = GETDATE();	
	END
	ELSE
	BEGIN
	BEGIN TRY
		SET @DATE_FROM = convert(datetime, @I_DATE_FROM, 20);
		SET @DATE_TO = convert(datetime, @I_DATE_TO, 20);
	END TRY
	BEGIN CATCH
		SET @DATE_FROM = DATEADD(hh,-24,GETDATE());
		SET @DATE_TO = GETDATE();
	END CATCH
	END

	print @date_from

    SELECT DISTINCT CAST(ISNULL(p.instructed_amount, 0) AS DECIMAL(16,2)) instructed_amount,
           p.end_to_end_id,
           LEFT(CONVERT(VARCHAR(50), CAST(p.DATUM AS DATETIMEOFFSET), 127), 19) STATUS_DATE,
           (CASE
             WHEN STATUS IN
                  ('incoming-credit-transfer-executed', 'executed') THEN
              '00'
             ELSE
              '05'
           END) STATUS_CODE,
          (CASE
             WHEN STATUS IN
                  ('incoming-credit-transfer-executed', 'executed') THEN
              'Izvrseno'
             ELSE
              'Odbijena'
           END) status,
           p.tid,
           p.end_to_end_id
      FROM PAYMENT_SUCCESSFUL p --PAYMENT_REQUESTS_SERBIA p
     WHERE p.tid = @I_TID
       AND p.DATUM between @DATE_FROM AND @DATE_TO
    --and (p.status='incoming-credit-transfer-executed' or p.status='executed')
     order by p.end_to_end_id desc;
	
END
GO
/****** Object:  StoredProcedure [dbo].[GET_TRANSACTIONS_TEMP]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GET_TRANSACTIONS_TEMP] 
	-- Add the parameters for the stored procedure here
	@I_TID       nvarchar(20),
    @I_DATE_FROM nvarchar(20),
    @I_DATE_TO   nvarchar(20)
AS

BEGIN


DECLARE @DATE_FROM DATETIME, @DATE_TO DATETIME;

	--insert into log(log_text, log_time) values (@I_TID + ' ' + @I_DATE_FROM + ' ' + 
	
	IF (@I_DATE_FROM IS NULL OR @I_DATE_TO IS NULL OR @I_DATE_FROM = '' OR @I_DATE_TO = '')
	BEGIN
		SET @DATE_FROM = DATEADD(hh,-24,GETDATE());
		SET @DATE_TO = GETDATE();	
	END
	ELSE
	BEGIN
		BEGIN TRY
			SET @DATE_FROM = convert(datetime, @I_DATE_FROM, 20);
			SET @DATE_TO = convert(datetime, @I_DATE_TO, 20);
		END TRY
		BEGIN CATCH
			SET @DATE_FROM = DATEADD(hh,-24,GETDATE());
			SET @DATE_TO = GETDATE();
		END CATCH
	END
SET NOCOUNT ON;
	SELECT DISTINCT CAST(ISNULL(p.amount, 0) AS DECIMAL(16,2)) instructed_amount,
           p.end_to_end_id,
          LEFT(CONVERT(VARCHAR(50), p.datum,  20), 19) STATUS_DATE,
           '00' STATUS_CODE,
           'Izvrseno' status,
           p.tid,
           p.end_to_end_id
      FROM TRANSACTIONS p --PAYMENT_REQUESTS_SERBIA p
     WHERE p.tid = @I_TID
       AND p.DATUM between @DATE_FROM AND @DATE_TO
       AND (p.status='00')
     order by p.end_to_end_id desc;
END
GO
/****** Object:  StoredProcedure [dbo].[INSERT_MESSAGES]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
	
CREATE PROCEDURE [dbo].[INSERT_MESSAGES](
        @message_identification nvarchar(35)
      , @creation_date_time date
      , @identification nvarchar(35)
      , @notification_date_time date
      , @creditor_account nvarchar(30)
      , @creditor_name nvarchar(70)
      , @amount int
      , @credit_indicator nvarchar(250)
      , @entry_type nvarchar(250)
      , @notification_type nvarchar(4)
      , @notification_family nvarchar(4)
      , @notification_subfamily nvarchar(4)
      , @proprietary_notification_code nvarchar(35)
      , @issuer nvarchar(35)
      , @message_identification_pacs nvarchar(35)
      , @instruction_identification nvarchar(35)
      , @end_to_end_identification nvarchar(35)
      , @transaction_identification nvarchar(35)
      , @transaction_amount int
      , @credit_indicator_2 nvarchar(250)
      , @payer_name nvarchar(140)
      , @payer_alias nvarchar(140)
      , @payee_name nvarchar(140)
      , @payee_alias nvarchar(140)
      , @unstructured nvarchar(140)
      , @structured nvarchar(140)) AS
BEGIN
	BEGIN TRY
	  INSERT INTO MESSAGES
		(MESSAGE_IDENTIFICATION,
		 CREATION_DATE_TIME,
		 IDENTIFICATION,
		 NOTIFICATION_DATE_TIME,
		 CREDITOR_ACCOUNT,
		 CREDITOR_NAME,
		 AMOUNT,
		 CREDIT_INDICATOR,
		 ENTRY_TYPE,
		 NOTIFICATION_TYPE,
		 NOTIFICATION_FAMILY,
		 NOTIFICATION_SUBFAMILY,
		 PROPRIETARY_NOTIFICATION_CODE,
		 ISSUER,
		 MESSAGE_IDENTIFICATION_PACS,
		 INSTRUCTION_IDENTIFICATION,
		 END_TO_END_IDENTIFICATION,
		 TRANSACTION_IDENTIFICATION,
		 TRANSACTION_AMOUNT,
		 CREDIT_INDICATOR_2,
		 PAYER_NAME,
		 PAYER_ALIAS,
		 PAYEE_NAME,
		 PAYEE_ALIAS,
		 UNSTRUCTURED,
		 STRUCTURED, 
		 STATUS)
	  VALUES
		(@message_identification,
		@creation_date_time,
		@identification,
		@notification_date_time,
		@creditor_account,
		@creditor_name,
		@amount,
		@credit_indicator,
		@entry_type,
		@notification_type,
		@notification_family,
		@notification_subfamily,
		@proprietary_notification_code,
		@issuer,
		@message_identification_pacs,
		@instruction_identification,
		@end_to_end_identification,
		@transaction_identification,
		@transaction_amount,
		@credit_indicator_2,
		@payer_name,
		@payer_alias,
		@payee_name,
		@payee_alias,
		@unstructured,
		@structured,
		 '00');
	END TRY
	BEGIN CATCH
	 
	END CATCH

END;
GO
/****** Object:  StoredProcedure [dbo].[INSERT_PAYMENT_REQUESTS]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[INSERT_PAYMENT_REQUESTS](@TRANSACTION_IDENTIFIER  nvarchar(140),
                                         @CUSTOMER_ACCOUNT_NUMBER nvarchar(20),
                                         @CUSTOMER_NAME           nvarchar(50),
                                         @AMOUNT                  int,
                                         @STATUS                  nvarchar(2) OUTPUT) AS
BEGIN
  SET @STATUS = '00';
  INSERT INTO PAYMENT_REQUESTS
    (TRANSACTION_IDENTIFIER,
     CUSTOMER_ACCOUNT_NUMBER,
     CUSTOMER_NAME,
     AMOUNT,
     DATUM,
     STATUS)
  VALUES
    (@TRANSACTION_IDENTIFIER,
     @CUSTOMER_ACCOUNT_NUMBER,
     @CUSTOMER_NAME,
     @AMOUNT,
     GETDATE(),
     @STATUS);
END;
GO
/****** Object:  StoredProcedure [dbo].[SELECT_MESSAGES]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[SELECT_MESSAGES](@CREATION_DATE_TIME_FROM DATE,
                                 @CREATION_DATE_TIME_TO DATE) AS
BEGIN
    SELECT  MESSAGE_IDENTIFICATION,
            CREATION_DATE_TIME,
            IDENTIFICATION,
            NOTIFICATION_DATE_TIME,
            CREDITOR_ACCOUNT,
            CREDITOR_NAME,
            AMOUNT,
            CREDIT_INDICATOR,
            ENTRY_TYPE,
            NOTIFICATION_TYPE,
            NOTIFICATION_FAMILY,
            NOTIFICATION_SUBFAMILY,
            PROPRIETARY_NOTIFICATION_CODE,
            ISSUER,
            MESSAGE_IDENTIFICATION_PACS,
            INSTRUCTION_IDENTIFICATION,
            END_TO_END_IDENTIFICATION,
            TRANSACTION_IDENTIFICATION,
            TRANSACTION_AMOUNT,
            CREDIT_INDICATOR_2,
            PAYER_NAME,
            PAYER_ALIAS,
            PAYEE_NAME,
            PAYEE_ALIAS,
            UNSTRUCTURED,
            STRUCTURED,
            APPROVAL_CODE,
            RRN,
            TID,
            TERMINAL_SEQUENCE,
            TERMINAL_INVOICE,
            STATUS
      FROM MESSAGES t
     WHERE (creation_date_time >= @CREATION_DATE_TIME_FROM OR
           @CREATION_DATE_TIME_FROM IS NULL)
       AND (creation_date_time <= @CREATION_DATE_TIME_TO OR
           @CREATION_DATE_TIME_TO IS NULL);
END;

GO
/****** Object:  StoredProcedure [dbo].[UPDATE_ACQ_MERCHANTS]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[UPDATE_ACQ_MERCHANTS]
        @local_merchant_id nvarchar(50)
      , @merchant_name nvarchar(50)
      , @merchant_address nvarchar(50)
      , @merchant_city_code nvarchar(10)
      , @merchant_status nvarchar(3)
      , @mcc int
      , @merchant_personal_identity_number nvarchar(50)
      , @merchant_tax_identity_number nvarchar(50)
      , @default_payment_method nvarchar(1)
      , @merchant_account nvarchar(20)
	  , @merchant_payment_code nvarchar(3)
	  , @e_mail nvarchar(50)
	  , @status int OUTPUT
AS
BEGIN
	SET @status = 0;
	DECLARE @city_id int, @merchant_id int;
	EXEC	[dbo].[GET_CITY_ID]
			@city_code = @merchant_city_code,
			@city_id = @city_id OUTPUT;



	SET @merchant_id = [dbo].[GET_MERCHANT_ID] (@local_merchant_id);

	IF(@merchant_id IS NULL) 

		SET @status = 5;
    ELSE

      UPDATE ACQ_MERCHANTS
         SET merchant_name = ISNULL(@merchant_name, merchant_name)
           , merchant_address = ISNULL(@merchant_address, merchant_address)
           , merchant_city_id = CASE WHEN @merchant_city_code IS NULL THEN merchant_city_id ELSE ISNULL(@city_id, merchant_city_id) END
           , merchant_status = ISNULL(@merchant_status, merchant_status)
           , mcc = ISNULL(@mcc, mcc)
           , merchant_account = ISNULL(@merchant_account, merchant_account)
           , default_payment_method = ISNULL(@default_payment_method, default_payment_method)
           , tax_identity_number = ISNULL(@merchant_tax_identity_number, tax_identity_number)
           , personal_identity_number = ISNULL(@merchant_personal_identity_number,personal_identity_number)
		   , payment_code = ISNULL(@merchant_payment_code, payment_code)
		   , e_mail = ISNULL(@e_mail, e_mail)
       WHERE merchant_id = @merchant_id;
END;
GO
/****** Object:  StoredProcedure [dbo].[UPDATE_ACQ_POINTS_OF_SALE]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[UPDATE_ACQ_POINTS_OF_SALE]
        @point_of_sale_local_id nvarchar(15)
      , @point_of_sale_name nvarchar(50)
      , @point_of_sale_address nvarchar(50)
      , @point_of_sale_status nvarchar(3)
      , @point_of_sale_city_code nvarchar(10)
	  , @point_of_sale_city_name nvarchar(25)
      , @default_payment_method nvarchar(1)
      , @point_of_sale_account nvarchar(20)
	  , @mcc nvarchar(10)
	  , @channel_type nvarchar(50)
	  , @status int OUTPUT
AS
BEGIN
SET @status = 0;
DECLARE @city_id int;
	EXEC	[dbo].[GET_CITY_ID2]
			@city_code = @point_of_sale_city_code,
			@city_name = @point_of_sale_city_name,
			@city_id = @city_id OUTPUT;

      UPDATE ACQ_POINTS_OF_SALE
         SET point_of_sale_name = ISNULL(@point_of_sale_name, point_of_sale_name)
           , point_of_sale_address = ISNULL(@point_of_sale_address, point_of_sale_address)
           , point_of_sale_status = ISNULL(@point_of_sale_status, point_of_sale_status)
           , point_of_sale_city_id = ISNULL(@city_id, point_of_sale_city_id)
           , default_payment_method = ISNULL(@default_payment_method, default_payment_method)
           , point_of_sale_account = ISNULL(@point_of_sale_account, point_of_sale_account)
		   , mcc = ISNULL(@mcc, mcc)
		   , channel_type = ISNULL(@channel_type, channel_type)
       WHERE point_of_sale_local_id = @point_of_sale_local_id;
END;
GO
/****** Object:  StoredProcedure [dbo].[UPDATE_ACQ_TERMINALS]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[UPDATE_ACQ_TERMINALS]
        @acquirer_tid nvarchar(8)
      , @terminal_status nvarchar(3)
      , @default_payment_method nvarchar(1)
      , @terminal_account nvarchar(50)
	  , @mobile_phone nvarchar(20)
	  , @status int OUTPUT
AS
BEGIN
	  SET @status = 0;
      UPDATE ACQ_TERMINALS
         SET terminal_status = ISNULL(@terminal_status, terminal_status)
           , default_payment_method = ISNULL(@default_payment_method, default_payment_method)
           , terminal_account = ISNULL(@terminal_account, terminal_account)
		   , contact_phone_no = ISNULL(@mobile_phone, contact_phone_no)
       WHERE acquirer_tid = @acquirer_tid;
END;
GO
/****** Object:  StoredProcedure [dbo].[UPDATE_MESSAGES]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[UPDATE_MESSAGES](@message_identification nvarchar(35),
                                 @tid nvarchar(20),
                                 @terminal_sequence nvarchar(10),
                                 @terminal_invoice nvarchar(50),
                                 @approval_code nvarchar(6) OUTPUT,
                                 @rrn nvarchar(15) OUTPUT,
                                 @creation_date_time date OUTPUT,
                                 @status nvarchar(2) OUTPUT,
                                 @creditor_account nvarchar(30) OUTPUT,
                                 @creditor_name nvarchar(70) OUTPUT
) AS
	
BEGIN
	  BEGIN 
			DECLARE @rc int;
	
			SELECT @creation_date_time = creation_date_time,
				   @creditor_account = creditor_account,
				   @creditor_name = creditor_name
			  FROM [MESSAGES]
			 WHERE message_identification = @message_identification;
  
			IF (@creation_date_time IS NOT NULL)
			BEGIN
				EXEC @rc = [dbo].[GET_APPROVAL_CODE]
				@nextval = @approval_code OUTPUT

				SET @RRN = dbo.GET_RRN(@terminal_sequence);
				SET @status = '00';

				UPDATE MESSAGES 
				   SET rrn               = @RRN,
					   tid               = @TID,
					   terminal_sequence = @TERMINAL_SEQUENCE,
					   terminal_invoice  = @TERMINAL_INVOICE,
					   status            = @STATUS,
					   approval_code     = @APPROVAL_CODE
				 WHERE message_identification = @MESSAGE_IDENTIFICATION;
			END
			ELSE
			BEGIN
				SET @status = '05';
				INSERT INTO MESSAGES
				  (MESSAGE_IDENTIFICATION,
				   CREATION_DATE_TIME,
				   TID,
				   TERMINAL_SEQUENCE,
				   TERMINAL_INVOICE,
				   STATUS)
				VALUES
				  (@MESSAGE_IDENTIFICATION,
				   GETDATE(),
				   @TID,
				   @TERMINAL_SEQUENCE,
				   @TERMINAL_INVOICE,
				   @STATUS);
			END;
	  END;
END;
GO
/****** Object:  StoredProcedure [dbo].[UPDATE_PAYMENT_REQUESTS]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[UPDATE_PAYMENT_REQUESTS](@END_TO_END_ID            nvarchar(50),
                                                @TID                      nvarchar(20),
                                                @TERMINAL_SEQUENCE        nvarchar(10),
                                                @TERMINAL_INVOICE         nvarchar(50),
												@AMOUNT					  nvarchar(20),
												@MTI					  nvarchar(4),
												@PROCESSING_CODE		  nvarchar(6),
                                                @APPROVAL_CODE            nvarchar(6) OUTPUT,
                                                @RRN                      nvarchar(15) OUTPUT,
                                                @DATUM                    date OUTPUT,
                                                @STATUS                   nvarchar(2) OUTPUT,
                                                @CUSTOMER_ACCOUNT_NUMBER  nvarchar(20) OUTPUT,
                                                @CUSTOMER_NAME            nvarchar(50) OUTPUT) AS
  
BEGIN
  BEGIN
	DECLARE @rc int;


	IF EXISTS (SELECT * 
                 FROM PAYMENT_REQUESTS_SERBIA 
			     WHERE end_to_end_id          = @END_TO_END_ID 
			       AND transaction_identifier = '100')
   BEGIN
   -- update original transaction
	   SET @STATUS = '00';
	   EXEC @rc = [dbo].[GET_APPROVAL_CODE]
			@nextval = @approval_code OUTPUT

		SET @RRN = dbo.GET_RRN(@terminal_sequence);

	     SELECT @CUSTOMER_ACCOUNT_NUMBER = debtor_account,
				@CUSTOMER_NAME = debtor_name,
				@DATUM = datum
		  FROM PAYMENT_REQUESTS_SERBIA t
		 WHERE t.end_to_end_id = @END_TO_END_ID
		   AND t.transaction_identifier = '100';
   END
   ELSE
   BEGIN
   -- original transaction not found
        SET @STATUS = '05';
	END;

        INSERT INTO PAYMENT_REQUESTS_SERBIA
          (TRANSACTION_IDENTIFIER,
		   END_TO_END_ID,
           DATUM,
           TID,
           TERMINAL_SEQUENCE,
           TERMINAL_INVOICE,
		   INSTRUCTED_AMOUNT,
           STATUS_CODE,
		   RRN,
		   APPROVAL_CODE,
		   MTI,
		   PROCESSING_CODE,
		   instruction_id,
		   DEBTOR_NAME,
		   DEBTOR_ACCOUNT)
        VALUES
          ('200',
		   @END_TO_END_ID,
           GETDATE(),
           @TID,
           @TERMINAL_SEQUENCE,
           @TERMINAL_INVOICE,
		   [dbo].[PARSE_AMOUNT]( @amount),
           @STATUS,
		   @RRN,
		   @APPROVAL_CODE,
		   @MTI,
		   @PROCESSING_CODE,
		   dbo.GET_INSTRUCTION_ID(),
		   @CUSTOMER_NAME,
		   @CUSTOMER_ACCOUNT_NUMBER);
   END;
END;

GO
/****** Object:  StoredProcedure [IPS].[AUTHORISE_MERCHANT]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [IPS].[AUTHORISE_MERCHANT]
	-- Add the parameters for the stored procedure here
		@TRANSFER_ID nvarchar (50),
		@TID nvarchar (20),
		@INSTRUCTED_AMOUNT nvarchar(20) ,
		@INSTRUCTED_CODE nvarchar (50),
		@DEBTOR_ACCOUNT nvarchar (50),
		@DEBTOR_NAME nvarchar (250),
		@DEBTOR_ADDRESS_LINE nvarchar (250),
		@DEBTOR_ADDRESS_LOCALITY nvarchar (50),
		@DEBTOR_ADDRESS_COUNTRY nvarchar (10),
		@PURPOSE_CODE int ,
		@URGENCY nvarchar (50),
		@INSTRUMENT_CODE nvarchar (50),
		@END_TO_END_ID nvarchar (50),
		@VALUE_DATE nvarchar (50),
		@INSTRUCTION_ID nvarchar (50) ,
		@CREDITOR_ACCOUNT nvarchar (50) ,
		@CREDITOR_REFERENCE nvarchar (50) ,
		@CREDITOR_REFERENCE_MODEL nvarchar (50) ,
		@CREDITOR_NAME nvarchar (250) ,
		@CREDITOR_ADDRESS_LINE nvarchar (250) ,
		@CREDITOR_ADDRESS_LOCALITY nvarchar (50) ,
		@CREDITOR_ADDRESS_COUNTRY nvarchar (10) ,
		@MCC nvarchar (50) ,
		@O_STATUS INT OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
DECLARE @RC int;
 SET @O_STATUS = 0;

  IF EXISTS (SELECT * 
               FROM PAYMENT_REQUESTS_SERBIA 
			  WHERE SUBSTRING(end_to_end_id, 1, 8) =  SUBSTRING(@END_TO_END_ID , 1, 8)
			    AND debtor_account = @DEBTOR_ACCOUNT)
  BEGIN
	SET @O_STATUS = 1;
  END;

  BEGIN
		INSERT INTO PAYMENT_REQUESTS_SERBIA
		  (transaction_identifier,
		   transfer_id,
		   tid,
		   instructed_amount,
		   instructed_code,
		   debtor_account,
		   debtor_name,
		   debtor_address_line,
		   debtor_address_locality,
		   debtor_address_country,
		   purpose_code,
		   urgency,
		   instrument_code,
		   end_to_end_id,
		   instruction_id,
		   value_date,
		   datum,
		   status_code,
		   creditor_account,
		   creditor_reference,
		   creditor_reference_model,
		   creditor_name,
		   creditor_address_line,
		   creditor_address_locality,
		   creditor_address_country,
		   mcc)
		VALUES
		  ('502',
		   @TRANSFER_ID,
		   @TID,
		   @INSTRUCTED_AMOUNT,
		   @INSTRUCTED_CODE,
		   @DEBTOR_ACCOUNT,
		   @DEBTOR_NAME,
		   @DEBTOR_ADDRESS_LINE,
		   @DEBTOR_ADDRESS_LOCALITY,
		   @DEBTOR_ADDRESS_COUNTRY,
		   @PURPOSE_CODE,
		   @URGENCY,
		   @INSTRUMENT_CODE,
		   @END_TO_END_ID,
		   @INSTRUCTION_ID,
		   @VALUE_DATE,
		   GETDATE(),
		   @O_STATUS,
		   @CREDITOR_ACCOUNT,
		   @CREDITOR_REFERENCE,
		   @CREDITOR_REFERENCE_MODEL,
		   @CREDITOR_NAME,
		   @CREDITOR_ADDRESS_LINE,
		   @CREDITOR_ADDRESS_LOCALITY,
		   @CREDITOR_ADDRESS_COUNTRY,
		   @MCC);
    END;
END
GO
/****** Object:  StoredProcedure [IPS].[CHECK_PAYMENT]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [IPS].[CHECK_PAYMENT]
	-- Add the parameters for the stored procedure here
	@TRANSACTION_IDENTIFIER  NVARCHAR(20),
    @TID                     NVARCHAR(20),
    @TERMINAL_SEQUENCE       nvarchar(10),
    @TERMINAL_INVOICE        nvarchar(50),
    @APPROVAL_CODE            nvarchar(6) OUT,
    @RRN                      nvarchar(15) OUT,
    @DATUM                    DATE OUT,
    @STATUS                   nvarchar(2) OUT,
    @CUSTOMER_ACCOUNT_NUMBER nvarchar(50) OUT,
    @CUSTOMER_NAME           nvarchar(250) OUT
AS

BEGIN
DECLARE @l_count int
      , @rc int;

	SELECT @l_count = COUNT(*)
	  FROM PAYMENT_REQUESTS_SERBIA
	 WHERE end_to_end_id = @TRANSACTION_IDENTIFIER;
	 IF (@l_count = 0) 
	 BEGIN
		SET @status = '05';
		SET @DATUM = GETDATE();
		INSERT INTO PAYMENT_REQUESTS_SERBIA
		  (end_to_end_id,
		   datum,
		   tid,
		   terminal_sequence,
		   terminal_invoice,
		   status,
		   transaction_identifier)
		VALUES
		  (@TRANSACTION_IDENTIFIER,
		   @DATUM,
		   @TID,
		   @TERMINAL_INVOICE,
		   @TERMINAL_INVOICE,
		   @STATUS,
		   '501');
	 END
	 ELSE
	 BEGIN
	 	EXEC @rc = [dbo].[GET_APPROVAL_CODE]
			 @nextval = @approval_code OUTPUT
		SET @RRN = dbo.GET_RRN(@terminal_sequence);
		SET @status = '00';

		UPDATE PAYMENT_REQUESTS_SERBIA
		   SET rrn = @rrn
		     , tid = @tid
			 , terminal_invoice = @TERMINAL_INVOICE
			 , terminal_sequence = @TERMINAL_SEQUENCE
			 , status_code = @STATUS
			 , approval_code = @APPROVAL_CODE
		 WHERE end_to_end_id = @TRANSACTION_IDENTIFIER;
	 END;
END
GO
/****** Object:  StoredProcedure [IPS].[GET_MERCHANT_DATA]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [IPS].[GET_MERCHANT_DATA]
	-- Add the parameters for the stored procedure here
	@TID NVARCHAR(8),
	@DEBTOR_ACCOUNT nvarchar (50) OUT,
	@DEBTOR_NAME nvarchar (250) OUT,
	@DEBTOR_ADDRESS_LINE nvarchar (250) OUT,
	@DEBTOR_ADDRESS_LOCALITY nvarchar (50) OUT,
	@MCC nvarchar (50) OUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	BEGIN TRY
	SELECT @DEBTOR_NAME = M.MERCHANT_NAME,
           @DEBTOR_ADDRESS_LINE =  M.MERCHANT_ADDRESS,
           @DEBTOR_ADDRESS_LOCALITY = C.CITY_NAME,
           @DEBTOR_ACCOUNT = CASE WHEN (T.terminal_account IS NULL OR LTRIM(T.terminal_account) = '')
		                          THEN ( CASE WHEN (APOS.point_of_sale_account IS NULL OR LTRIM(APOS.point_of_sale_account) = '')  
								              THEN M.MERCHANT_ACCOUNT 
											  ELSE APOS.point_of_sale_account 
										  END) 
								   ELSE t.terminal_account 
							  END,
           @MCC = M.MCC
      FROM ACQ_TERMINALS      T,
           ACQ_POINTS_OF_SALE APOS,
           ACQ_MERCHANTS      M,
           REG_CITIES         C
     WHERE T.POINT_OF_SALE_ID = APOS.POINT_OF_SALE_ID
       AND APOS.MERCHANT_ID = M.MERCHANT_ID
       AND M.MERCHANT_CITY_ID = C.CITY_ID
       AND T.ACQUIRER_TID = @TID;
	   return 0;
	 END TRY
	 BEGIN CATCH
	   return 1;
	 END CATCH
END
GO
/****** Object:  StoredProcedure [IPS].[LOG_PAYMENT_DETAILS]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [IPS].[LOG_PAYMENT_DETAILS]
	-- Add the parameters for the stored procedure here
		@TRANSFER_ID nvarchar (50),
		@TID nvarchar (20),
		@INSTRUCTED_AMOUNT nvarchar(20) ,
		@INSTRUCTED_CODE nvarchar (50),
		@DEBTOR_ACCOUNT nvarchar (50),
		@DEBTOR_NAME nvarchar (250),
		@DEBTOR_ADDRESS_LINE nvarchar (250),
		@DEBTOR_ADDRESS_LOCALITY nvarchar (50),
		@DEBTOR_ADDRESS_COUNTRY nvarchar (10),
		@PAYMENT_DESCRIPTION nvarchar (250),
		@PURPOSE_CODE int ,
		@URGENCY nvarchar (50),
		@INSTRUMENT_CODE nvarchar (50),
		@STATUS nvarchar (50),
		@STATUS_DATE nvarchar (50),
		@ORIGINATED nvarchar (50),
		@DIRECTION nvarchar (50),
		@AUTHORISATION_SYSTEM nvarchar (50),
		@INSTRUCTING_AGENT nvarchar (50),
		@END_TO_END_ID nvarchar (50),
		@CHARGE nvarchar (50),
		@VALUE_DATE nvarchar (50),
		@SYNC_TIMESTAMP nvarchar (50),
		@INSTRUCTION_ID nvarchar (50),
		@CREDITOR_ACCOUNT nvarchar (50) OUTPUT,
		@CREDITOR_REFERENCE_MODEL nvarchar (50) OUTPUT,
		@CREDITOR_REFERENCE nvarchar (50) OUTPUT,
		@CREDITOR_NAME nvarchar (250) OUTPUT,
		@CREDITOR_ADDRESS_LINE nvarchar (250) OUTPUT,
		@CREDITOR_ADDRESS_LOCALITY nvarchar (50) OUTPUT,
		@CREDITOR_ADDRESS_COUNTRY nvarchar (10) OUTPUT,
		@MCC nvarchar (50) OUTPUT,
		@UPDATE_STATUS_EXISTS INT OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
DECLARE @RC int;
	
	SET @UPDATE_STATUS_EXISTS = 0;


	EXECUTE @RC = [IPS].[GET_MERCHANT_DATA] 
	   @TID
	  ,@CREDITOR_ACCOUNT OUTPUT
	  ,@CREDITOR_NAME OUTPUT
	  ,@CREDITOR_ADDRESS_LINE OUTPUT
	  ,@CREDITOR_ADDRESS_LOCALITY OUTPUT
	  ,@MCC OUTPUT

  IF EXISTS (SELECT * 
               FROM PAYMENT_REQUESTS_SERBIA 
			  WHERE end_to_end_id          = @END_TO_END_ID 
			    AND transaction_identifier = '100'
				AND instruction_id = @INSTRUCTION_ID)
  BEGIN
	  UPDATE PAYMENT_REQUESTS_SERBIA
         SET tid = ISNULL(@tid, tid)
           , status = ISNULL(@status, status)
           , status_date = ISNULL(@status_date, status_date)
           , originated = ISNULL(@originated, originated)
           , direction = ISNULL(@direction, direction)
           , authorisation_system = ISNULL(@authorisation_system, authorisation_system)
           , transfer_id = ISNULL(@transfer_id, transfer_id)
           , instruction_id = ISNULL(@instruction_id, instruction_id)
           , instructing_agent = ISNULL(@instructing_agent, instructing_agent)
           , creditor_account = ISNULL(@creditor_account, creditor_account)
           , end_to_end_id = ISNULL(@end_to_end_id, end_to_end_id)
           , debtor_account = ISNULL(@debtor_account, debtor_account)
           , instructed_amount = ISNULL([dbo].[PARSE_AMOUNT]( @instructed_amount), instructed_amount)
           , instructed_code = ISNULL(@instructed_code, instructed_code)
           , creditor_name = ISNULL(@creditor_name, creditor_name)
           , creditor_address_line = ISNULL(@creditor_address_line, creditor_address_line)
           , creditor_address_locality = ISNULL(@creditor_address_locality, creditor_address_locality)
           , creditor_address_country = ISNULL(@creditor_address_country, creditor_address_country)
           , debtor_name = ISNULL(@debtor_name, debtor_name)
           , debtor_address_line = ISNULL(@debtor_address_line, debtor_address_line)
           , debtor_address_locality = ISNULL(@debtor_address_locality, debtor_address_locality)
           , debtor_address_country = ISNULL(SUBSTRING(@debtor_address_country, 1, 10), debtor_address_country)
           , payment_description = ISNULL(@payment_description, payment_description)
           , purpose_code = ISNULL(@purpose_code, purpose_code)
           , urgency = ISNULL(@urgency, urgency)
           , instrument_code = ISNULL(@instrument_code, instrument_code)
           , mcc = ISNULL(@mcc, mcc)
           , creditor_reference = ISNULL(@creditor_reference, creditor_reference)
           , creditor_reference_model = ISNULL(@creditor_reference_model, creditor_reference_model)
           , charge = ISNULL(@charge, charge)
           , value_date = ISNULL(@value_date, value_date)
           , sync_timestamp = ISNULL(@sync_timestamp, sync_timestamp)
     WHERE end_to_end_id = @END_TO_END_ID 
	   AND transaction_identifier = '100'
	   AND instruction_id = @INSTRUCTION_ID;
  END
  ELSE
  BEGIN
  	SELECT @INSTRUCTION_ID = [dbo].[GET_INSTRUCTION_ID] ();

		INSERT
		  INTO PAYMENT_REQUESTS_SERBIA(transaction_identifier,
			    tid
			  , status
			  , status_date
			  , originated
			  , direction
			  , authorisation_system
			  , transfer_id
			  , instruction_id
			  , instructing_agent
			  , creditor_account
			  , end_to_end_id
			  , debtor_account
			  , instructed_amount
			  , instructed_code
			  , creditor_name
			  , creditor_address_line
			  , creditor_address_locality
			  , creditor_address_country
			  , debtor_name
			  , debtor_address_line
			  , debtor_address_locality
			  , debtor_address_country
			  , payment_description
			  , purpose_code
			  , urgency
			  , instrument_code
			  , mcc
			  , creditor_reference
			  , creditor_reference_model
			  , charge
			  , value_date
			  , sync_timestamp
			  , datum
			   )
		 VALUES ('101',
				@tid
			  , @status
			  , @status_date
			  , @originated
			  , @direction
			  , @authorisation_system
			  , @transfer_id
			  , @instruction_id
			  , @instructing_agent
			  , @creditor_account
			  , @end_to_end_id
			  , @debtor_account
			  , @instructed_amount
			  , @instructed_code
			  , @creditor_name
			  , @creditor_address_line
			  , @creditor_address_locality
			  , @creditor_address_country
			  , @debtor_name
			  , @debtor_address_line
			  , @debtor_address_locality
			  , @debtor_address_country
			  , @payment_description
			  , @purpose_code
			  , @urgency
			  , @instrument_code
			  , @mcc
			  , @creditor_reference
			  , @creditor_reference_model
			  , @charge
			  , @value_date
			  , @sync_timestamp
			  , getdate()
			  );
    END;
END
GO
/****** Object:  StoredProcedure [IPS].[LOG_PAYMENT_REQUEST]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [IPS].[LOG_PAYMENT_REQUEST]
	-- Add the parameters for the stored procedure here
		@TRANSFER_ID nvarchar (50),
		@TID nvarchar (20),
		@INSTRUCTED_AMOUNT nvarchar(20) ,
		@INSTRUCTED_CODE nvarchar (50),
		@DEBTOR_ACCOUNT nvarchar (50),
		@DEBTOR_NAME nvarchar (250),
		@DEBTOR_ADDRESS_LINE nvarchar (250),
		@DEBTOR_ADDRESS_LOCALITY nvarchar (50),
		@DEBTOR_ADDRESS_COUNTRY nvarchar (10),
		@PAYMENT_DESCRIPTION nvarchar (250),
		@PURPOSE_CODE int ,
		@URGENCY nvarchar (50),
		@INSTRUMENT_CODE nvarchar (50),
		@STATUS nvarchar (50),
		@STATUS_DATE nvarchar (50),
		@ORIGINATED nvarchar (50),
		@DIRECTION nvarchar (50),
		@AUTHORISATION_SYSTEM nvarchar (50),
		@INSTRUCTING_AGENT nvarchar (50),
		@END_TO_END_ID nvarchar (50),
		@CHARGE nvarchar (50),
		@VALUE_DATE nvarchar (50),
		@SYNC_TIMESTAMP nvarchar (50),
		@INSTRUCTION_ID nvarchar (50) OUTPUT,
		@CREDITOR_ACCOUNT nvarchar (50) OUTPUT,
		@CREDITOR_REFERENCE_MODEL nvarchar (50) OUTPUT,
		@CREDITOR_REFERENCE nvarchar (50) OUTPUT,
		@CREDITOR_NAME nvarchar (250) OUTPUT,
		@CREDITOR_ADDRESS_LINE nvarchar (250) OUTPUT,
		@CREDITOR_ADDRESS_LOCALITY nvarchar (50) OUTPUT,
		@CREDITOR_ADDRESS_COUNTRY nvarchar (10) OUTPUT,
		@MCC nvarchar (50) OUTPUT,
		@UPDATE_STATUS_EXISTS INT OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
DECLARE @RC int;
	
	SET @UPDATE_STATUS_EXISTS = 0;
	SELECT @INSTRUCTION_ID = [dbo].[GET_INSTRUCTION_ID] ();

	EXECUTE @RC = [IPS].[GET_MERCHANT_DATA] 
	   @TID
	  ,@CREDITOR_ACCOUNT OUTPUT
	  ,@CREDITOR_NAME OUTPUT
	  ,@CREDITOR_ADDRESS_LINE OUTPUT
	  ,@CREDITOR_ADDRESS_LOCALITY OUTPUT
	  ,@MCC OUTPUT

  IF EXISTS (SELECT * 
               FROM PAYMENT_REQUESTS_SERBIA 
			  WHERE end_to_end_id          = @END_TO_END_ID 
			    AND transaction_identifier = '200')
  BEGIN
	SET @UPDATE_STATUS_EXISTS = 1;
  END;
/*	  UPDATE PAYMENT_REQUESTS_SERBIA
         SET tid = ISNULL(@tid, tid)
           , status = ISNULL(@status, status)
           , status_date = ISNULL(@status_date, status_date)
           , originated = ISNULL(@originated, originated)
           , direction = ISNULL(@direction, direction)
           , authorisation_system = ISNULL(@authorisation_system, authorisation_system)
           , transfer_id = ISNULL(@transfer_id, transfer_id)
           , instruction_id = ISNULL(@instruction_id, instruction_id)
           , instructing_agent = ISNULL(@instructing_agent, instructing_agent)
           , creditor_account = ISNULL(@creditor_account, creditor_account)
           , end_to_end_id = ISNULL(@end_to_end_id, end_to_end_id)
           , debtor_account = ISNULL(@debtor_account, debtor_account)
           , instructed_amount = ISNULL(@instructed_amount, instructed_amount)
           , instructed_code = ISNULL(@instructed_code, instructed_code)
           , creditor_name = ISNULL(@creditor_name, creditor_name)
           , creditor_address_line = ISNULL(@creditor_address_line, creditor_address_line)
           , creditor_address_locality = ISNULL(@creditor_address_locality, creditor_address_locality)
           , creditor_address_country = ISNULL(@creditor_address_country, creditor_address_country)
           , debtor_name = ISNULL(@debtor_name, debtor_name)
           , debtor_address_line = ISNULL(@debtor_address_line, debtor_address_line)
           , debtor_address_locality = ISNULL(@debtor_address_locality, debtor_address_locality)
           , debtor_address_country = ISNULL(@debtor_address_country, debtor_address_country)
           , payment_description = ISNULL(@payment_description, payment_description)
           , purpose_code = ISNULL(@purpose_code, purpose_code)
           , urgency = ISNULL(@urgency, urgency)
           , instrument_code = ISNULL(@instrument_code, instrument_code)
           , mcc = ISNULL(@mcc, mcc)
           , creditor_reference = ISNULL(@creditor_reference, creditor_reference)
           , creditor_reference_model = ISNULL(@creditor_reference_model, creditor_reference_model)
           , charge = ISNULL(@charge, charge)
           , value_date = ISNULL(@value_date, value_date)
           , sync_timestamp = ISNULL(@sync_timestamp, sync_timestamp)
     WHERE end_to_end_id = @END_TO_END_ID 
	   AND transaction_identifier = '100';
  END
  ELSE
  */
  BEGIN


		INSERT
		  INTO PAYMENT_REQUESTS_SERBIA(transaction_identifier,
			    tid
			  , status
			  , status_date
			  , originated
			  , direction
			  , authorisation_system
			  , transfer_id
			  , instruction_id
			  , instructing_agent
			  , creditor_account
			  , end_to_end_id
			  , debtor_account
			  , instructed_amount
			  , instructed_code
			  , creditor_name
			  , creditor_address_line
			  , creditor_address_locality
			  , creditor_address_country
			  , debtor_name
			  , debtor_address_line
			  , debtor_address_locality
			  , debtor_address_country
			  , payment_description
			  , purpose_code
			  , urgency
			  , instrument_code
			  , mcc
			  , creditor_reference
			  , creditor_reference_model
			  , charge
			  , value_date
			  , sync_timestamp
			  , datum
			   )
		 VALUES ('100',
				@tid
			  , @status
			  , @status_date
			  , @originated
			  , @direction
			  , @authorisation_system
			  , @transfer_id
			  , @instruction_id
			  , @instructing_agent
			  , @creditor_account
			  , @end_to_end_id
			  , @debtor_account
			  , [dbo].[PARSE_AMOUNT]( @instructed_amount)
			  , @instructed_code
			  , @creditor_name
			  , @creditor_address_line
			  , @creditor_address_locality
			  , @creditor_address_country
			  , @debtor_name
			  , @debtor_address_line
			  , @debtor_address_locality
			  , @debtor_address_country
			  , @payment_description
			  , @purpose_code
			  , @urgency
			  , @instrument_code
			  , @mcc
			  , @creditor_reference
			  , @creditor_reference_model
			  , @charge
			  , @value_date
			  , @sync_timestamp
			  , getdate()
			  );
    END;
END
GO
/****** Object:  StoredProcedure [IPS].[REFUND_REQUEST]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [IPS].[REFUND_REQUEST]
	-- Add the parameters for the stored procedure here
	@TID nvarchar(20), 
	@INSTRUCTED_AMOUNT nvarchar(20),
	@END_TO_END_ID nvarchar(50),
	@INSTRUCTION_ID nvarchar(50) OUT,
	@FEE	float OUT,
	@STATUS nvarchar(2) OUT,
	@TRANSFER_STATUS nvarchar(50) OUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @amount_acceptable bit;
    -- Insert statements for procedure here
	SET @STATUS = '05';

	SET @amount_acceptable = dbo.check_refund_amount(@END_TO_END_ID, [dbo].[PARSE_AMOUNT]( @instructed_amount));
	IF(@amount_acceptable = 0) 
	BEGIN
		SET @STATUS = '05';
		return;
	END;		
/**/
	SET @FEE = 0;
	DECLARE @cycle bit;
	DECLARE @transaction_identifier nvarchar(20);
	DECLARE @temp_status nvarchar(50);
	DECLARE @temp_instruction_id nvarchar(50);	
	DECLARE C_REQUESTS CURSOR FOR
	 SELECT transaction_identifier, instruction_id, status
	   FROM PAYMENT_REQUESTS_SERBIA
	  WHERE end_to_end_id = @END_TO_END_ID
	    AND (
			   (transaction_identifier = 100 AND status IN ('incoming-credit-transfer-executed', 'executed'))
			OR (transaction_identifier = 200 AND mti = '0200' AND processing_code IN ('000000', '890000'))
			OR (transaction_identifier = 300 AND status_code = '00')
			OR (transaction_identifier = 400)
		)
	  ORDER BY INSTRUCTION_ID;  
	
		SET @cycle = 1
		OPEN C_REQUESTS
		WHILE @cycle = 1
		BEGIN  
			FETCH C_REQUESTS INTO @transaction_identifier, @temp_instruction_id, @temp_status
			IF(@@FETCH_STATUS < 0)
				BEGIN
					SET @cycle = 0
				END
			ELSE
				BEGIN
					IF(@transaction_identifier = 100)
					BEGIN
						IF(@STATUS = '05')
							BEGIN
								SET @STATUS = '00';
							END;
						ELSE IF(@STATUS = '06')
							BEGIN
								SET @STATUS = '09';
							END;
						SET @TRANSFER_STATUS = @temp_status;
						SET @INSTRUCTION_ID = @temp_instruction_id;
					END;
					ELSE IF(@transaction_identifier = 200)
					BEGIN
						IF(@STATUS = '05')
							BEGIN
								SET @STATUS = '06';
							END;
					END;
					ELSE IF(@transaction_identifier = 300)
					BEGIN
						IF(@STATUS = '00')
							BEGIN
								SET @STATUS = '07';
							END;
					END;
					ELSE IF(@transaction_identifier = 400)
					BEGIN
						IF(@STATUS = '07')
							BEGIN
								SET @STATUS = '08';
							END;
						ELSE IF(@STATUS = '09')
							BEGIN
								SET @STATUS = '10';
							END;
						SET @TRANSFER_STATUS = @temp_status;
					END;
				END;
		END;
	 CLOSE C_REQUESTS
     DEALLOCATE C_REQUESTS	

	INSERT INTO PAYMENT_REQUESTS_SERBIA
	  (transaction_identifier,
	   instruction_id,
	   end_to_end_id,
	   tid,
	   instructed_amount,
	   datum,
	   status_code)
	VALUES
	  (300,
	   dbo.get_instruction_id(),
	   @END_TO_END_ID,
	   @tid,
	   @INSTRUCTED_AMOUNT,
	   getdate(),
	   @STATUS);
END
GO
/****** Object:  StoredProcedure [IPS].[REFUND_RESPONSE]    Script Date: 7/6/2020 11:17:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [IPS].[REFUND_RESPONSE]
	-- Add the parameters for the stored procedure here
		@TRANSFER_ID nvarchar (50),
		@TID nvarchar (20),
		@INSTRUCTED_AMOUNT nvarchar(20) ,
		@INSTRUCTED_CODE nvarchar (50),
		@DEBTOR_ACCOUNT nvarchar (50),
		@DEBTOR_NAME nvarchar (250),
		@DEBTOR_ADDRESS_LINE nvarchar (250),
		@DEBTOR_ADDRESS_LOCALITY nvarchar (50),
		@DEBTOR_ADDRESS_COUNTRY nvarchar (10),
		@PAYMENT_DESCRIPTION nvarchar (250),
		@PURPOSE_CODE int ,
		@URGENCY nvarchar (50),
		@INSTRUMENT_CODE nvarchar (50),
		@STATUS nvarchar (50),
		@STATUS_DATE nvarchar (50),
		@ORIGINATED nvarchar (50),
		@DIRECTION nvarchar (50),
		@AUTHORISATION_SYSTEM nvarchar (50),
		@INSTRUCTING_AGENT nvarchar (50),
		@END_TO_END_ID nvarchar (50),
		@CHARGE nvarchar (50),
		@VALUE_DATE nvarchar (50),
		@SYNC_TIMESTAMP nvarchar (50),
		@INSTRUCTION_ID nvarchar (50) OUTPUT,
		@CREDITOR_ACCOUNT nvarchar (50) OUTPUT,
		@CREDITOR_REFERENCE_MODEL nvarchar (50) OUTPUT,
		@CREDITOR_REFERENCE nvarchar (50) OUTPUT,
		@CREDITOR_NAME nvarchar (250) OUTPUT,
		@CREDITOR_ADDRESS_LINE nvarchar (250) OUTPUT,
		@CREDITOR_ADDRESS_LOCALITY nvarchar (50) OUTPUT,
		@CREDITOR_ADDRESS_COUNTRY nvarchar (10) OUTPUT,
		@MCC nvarchar (50) OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
DECLARE @RC int;
	
	SELECT @INSTRUCTION_ID = [dbo].[GET_INSTRUCTION_ID] ();

	EXECUTE @RC = [IPS].[GET_MERCHANT_DATA] 
	   @TID
	  ,@CREDITOR_ACCOUNT OUTPUT
	  ,@CREDITOR_NAME OUTPUT
	  ,@CREDITOR_ADDRESS_LINE OUTPUT
	  ,@CREDITOR_ADDRESS_LOCALITY OUTPUT
	  ,@MCC OUTPUT

  
  BEGIN


		INSERT
		  INTO PAYMENT_REQUESTS_SERBIA(transaction_identifier,
			    tid
			  , status
			  , status_date
			  , originated
			  , direction
			  , authorisation_system
			  , transfer_id
			  , instruction_id
			  , instructing_agent
			  , creditor_account
			  , end_to_end_id
			  , debtor_account
			  , instructed_amount
			  , instructed_code
			  , creditor_name
			  , creditor_address_line
			  , creditor_address_locality
			  , creditor_address_country
			  , debtor_name
			  , debtor_address_line
			  , debtor_address_locality
			  , debtor_address_country
			  , payment_description
			  , purpose_code
			  , urgency
			  , instrument_code
			  , mcc
			  , creditor_reference
			  , creditor_reference_model
			  , charge
			  , value_date
			  , sync_timestamp
			  , datum
			   )
		 VALUES ('400',
				@tid
			  , @status
			  , @status_date
			  , @originated
			  , @direction
			  , @authorisation_system
			  , @transfer_id
			  , @instruction_id
			  , @instructing_agent
			  , @creditor_account
			  , @end_to_end_id
			  , @debtor_account
			  , [dbo].[PARSE_AMOUNT]( @instructed_amount)
			  , @instructed_code
			  , @creditor_name
			  , @creditor_address_line
			  , @creditor_address_locality
			  , @creditor_address_country
			  , @debtor_name
			  , @debtor_address_line
			  , @debtor_address_locality
			  , @debtor_address_country
			  , @payment_description
			  , @purpose_code
			  , @urgency
			  , @instrument_code
			  , @mcc
			  , @creditor_reference
			  , @creditor_reference_model
			  , @charge
			  , @value_date
			  , @sync_timestamp
			  , getdate()
			  );
    END;
END
GO
EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPane1', @value=N'[0E232FF0-B466-11cf-A24F-00AA00A3EFFF, 1.00]
Begin DesignProperties = 
   Begin PaneConfigurations = 
      Begin PaneConfiguration = 0
         NumPanes = 4
         Configuration = "(H (1[27] 4[29] 2[40] 3) )"
      End
      Begin PaneConfiguration = 1
         NumPanes = 3
         Configuration = "(H (1 [50] 4 [25] 3))"
      End
      Begin PaneConfiguration = 2
         NumPanes = 3
         Configuration = "(H (1 [50] 2 [25] 3))"
      End
      Begin PaneConfiguration = 3
         NumPanes = 3
         Configuration = "(H (4 [30] 2 [40] 3))"
      End
      Begin PaneConfiguration = 4
         NumPanes = 2
         Configuration = "(H (1 [56] 3))"
      End
      Begin PaneConfiguration = 5
         NumPanes = 2
         Configuration = "(H (2 [66] 3))"
      End
      Begin PaneConfiguration = 6
         NumPanes = 2
         Configuration = "(H (4 [50] 3))"
      End
      Begin PaneConfiguration = 7
         NumPanes = 1
         Configuration = "(V (3))"
      End
      Begin PaneConfiguration = 8
         NumPanes = 3
         Configuration = "(H (1[56] 4[18] 2) )"
      End
      Begin PaneConfiguration = 9
         NumPanes = 2
         Configuration = "(H (1 [75] 4))"
      End
      Begin PaneConfiguration = 10
         NumPanes = 2
         Configuration = "(H (1[66] 2) )"
      End
      Begin PaneConfiguration = 11
         NumPanes = 2
         Configuration = "(H (4 [60] 2))"
      End
      Begin PaneConfiguration = 12
         NumPanes = 1
         Configuration = "(H (1) )"
      End
      Begin PaneConfiguration = 13
         NumPanes = 1
         Configuration = "(V (4))"
      End
      Begin PaneConfiguration = 14
         NumPanes = 1
         Configuration = "(V (2))"
      End
      ActivePaneConfig = 0
   End
   Begin DiagramPane = 
      Begin Origin = 
         Top = 0
         Left = 0
      End
      Begin Tables = 
         Begin Table = "pgw_1"
            Begin Extent = 
               Top = 6
               Left = 38
               Bottom = 136
               Right = 261
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "trm_1"
            Begin Extent = 
               Top = 138
               Left = 38
               Bottom = 268
               Right = 261
            End
            DisplayFlags = 280
            TopColumn = 0
         End
      End
   End
   Begin SQLPane = 
   End
   Begin DataPane = 
      Begin ParameterDefaults = ""
      End
      Begin ColumnWidths = 9
         Width = 284
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
      End
   End
   Begin CriteriaPane = 
      Begin ColumnWidths = 11
         Column = 1440
         Alias = 900
         Table = 1170
         Output = 720
         Append = 1400
         NewValue = 1170
         SortType = 1350
         SortOrder = 1410
         GroupBy = 1350
         Filter = 1350
         Or = 1350
         Or = 1350
         Or = 1350
      End
   End
End
' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'PAYMENT_SUCCESSFUL'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPaneCount', @value=1 , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'PAYMENT_SUCCESSFUL'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPane1', @value=N'[0E232FF0-B466-11cf-A24F-00AA00A3EFFF, 1.00]
Begin DesignProperties = 
   Begin PaneConfigurations = 
      Begin PaneConfiguration = 0
         NumPanes = 4
         Configuration = "(H (1[40] 4[20] 2[20] 3) )"
      End
      Begin PaneConfiguration = 1
         NumPanes = 3
         Configuration = "(H (1 [50] 4 [25] 3))"
      End
      Begin PaneConfiguration = 2
         NumPanes = 3
         Configuration = "(H (1 [50] 2 [25] 3))"
      End
      Begin PaneConfiguration = 3
         NumPanes = 3
         Configuration = "(H (4 [30] 2 [40] 3))"
      End
      Begin PaneConfiguration = 4
         NumPanes = 2
         Configuration = "(H (1 [56] 3))"
      End
      Begin PaneConfiguration = 5
         NumPanes = 2
         Configuration = "(H (2 [66] 3))"
      End
      Begin PaneConfiguration = 6
         NumPanes = 2
         Configuration = "(H (4 [50] 3))"
      End
      Begin PaneConfiguration = 7
         NumPanes = 1
         Configuration = "(V (3))"
      End
      Begin PaneConfiguration = 8
         NumPanes = 3
         Configuration = "(H (1[56] 4[18] 2) )"
      End
      Begin PaneConfiguration = 9
         NumPanes = 2
         Configuration = "(H (1 [75] 4))"
      End
      Begin PaneConfiguration = 10
         NumPanes = 2
         Configuration = "(H (1[66] 2) )"
      End
      Begin PaneConfiguration = 11
         NumPanes = 2
         Configuration = "(H (4 [60] 2))"
      End
      Begin PaneConfiguration = 12
         NumPanes = 1
         Configuration = "(H (1) )"
      End
      Begin PaneConfiguration = 13
         NumPanes = 1
         Configuration = "(V (4))"
      End
      Begin PaneConfiguration = 14
         NumPanes = 1
         Configuration = "(V (2))"
      End
      ActivePaneConfig = 0
   End
   Begin DiagramPane = 
      Begin Origin = 
         Top = 0
         Left = 0
      End
      Begin Tables = 
         Begin Table = "TRN_1"
            Begin Extent = 
               Top = 6
               Left = 38
               Bottom = 136
               Right = 208
            End
            DisplayFlags = 280
            TopColumn = 0
         End
      End
   End
   Begin SQLPane = 
   End
   Begin DataPane = 
      Begin ParameterDefaults = ""
      End
   End
   Begin CriteriaPane = 
      Begin ColumnWidths = 11
         Column = 1440
         Alias = 900
         Table = 1170
         Output = 720
         Append = 1400
         NewValue = 1170
         SortType = 1350
         SortOrder = 1410
         GroupBy = 1350
         Filter = 1350
         Or = 1350
         Or = 1350
         Or = 1350
      End
   End
End
' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'TRANSACTIONS'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPaneCount', @value=1 , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'TRANSACTIONS'
GO
USE [master]
GO
ALTER DATABASE [InstantPayment] SET  READ_WRITE 
GO
