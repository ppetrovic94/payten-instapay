package com.payten.instapay.services.impl;

import com.payten.instapay.model.TransactionReport;
import com.payten.instapay.model.TransactionReportCumulative;
import com.payten.instapay.services.TransactionReportService;
import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.ParameterMode;
import javax.persistence.PersistenceContext;
import javax.persistence.StoredProcedureQuery;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;
import java.io.IOException;
import java.io.OutputStream;
import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;

@Service
public class TransactionReportServiceImpl implements TransactionReportService {

    @PersistenceContext
    private EntityManager em;

    @Override
    @Transactional
    public List<TransactionReport> getMerchantReport(String dateFrom, String dateTo, Integer merchantId) {
        StoredProcedureQuery procedureQuery = em.createStoredProcedureQuery("PERIOD_IPS_REPORT", TransactionReport.class);

        procedureQuery.registerStoredProcedureParameter("I_DATE_FROM", Date.class, ParameterMode.IN);
        procedureQuery.registerStoredProcedureParameter("I_DATE_TO", Date.class, ParameterMode.IN);
        procedureQuery.registerStoredProcedureParameter("I_MERCHANT_ID", Integer.class, ParameterMode.IN);

        procedureQuery.setParameter("I_DATE_FROM", convertToDateType(dateFrom));
        procedureQuery.setParameter("I_DATE_TO", convertToDateType(dateTo));
        procedureQuery.setParameter("I_MERCHANT_ID", merchantId);

        procedureQuery.execute();
        List<TransactionReport> resultList = procedureQuery.getResultList();
        return resultList;
    }

    @Override
    public List<TransactionReportCumulative> getMerchantReportCumulative(String dateFrom, String dateTo, Integer merchantId) {
        StoredProcedureQuery procedureQuery = em.createStoredProcedureQuery("PERIOD_IPS_CUMULATIVE_REPORT", TransactionReportCumulative.class);

        procedureQuery.registerStoredProcedureParameter("I_DATE_FROM", Date.class, ParameterMode.IN);
        procedureQuery.registerStoredProcedureParameter("I_DATE_TO", Date.class, ParameterMode.IN);
        procedureQuery.registerStoredProcedureParameter("I_MERCHANT_ID", Integer.class, ParameterMode.IN);

        procedureQuery.setParameter("I_DATE_FROM", convertToDateType(dateFrom));
        procedureQuery.setParameter("I_DATE_TO", convertToDateType(dateTo));
        procedureQuery.setParameter("I_MERCHANT_ID", merchantId);

        procedureQuery.execute();
        List<TransactionReportCumulative> resultList = procedureQuery.getResultList();
        return resultList;
    }

    @Override
    public void exportIpsReport(String dateFrom, String dateTo, Integer merchantId, String merchantName, HttpServletResponse response) throws IOException {

        String reportFileName = "IPS-Izvestaj_" + merchantName + "_" + dateFrom + "--" + dateTo + ".xls";

        response.setContentType("application/vnd.ms-excel");
        response.setHeader("Content-Disposition", "attachment; filename="+ reportFileName);

        HSSFWorkbook workbook;
        workbook = new HSSFWorkbook();

        List<TransactionReport> rows = getMerchantReport(dateFrom, dateTo, merchantId);
        System.out.println(rows.size());
        WriteData(rows, dateFrom, workbook);

        List<TransactionReportCumulative> rowsCumulative = getMerchantReportCumulative(dateFrom, dateTo,
                merchantId);
        WriteDataCumulative(rowsCumulative, workbook);

        OutputStream outputStream = response.getOutputStream();
        workbook.write(outputStream);
        outputStream.flush();
        outputStream.close();

    }

    private void WriteDataCumulative(List<TransactionReportCumulative> rowsCumulative, HSSFWorkbook workbook) {
        // TODO Auto-generated method stub
        HSSFSheet worksheet = workbook.createSheet("Kumulativ");

        CellStyle style = workbook.createCellStyle();// Create style
        Font font = workbook.createFont();// Create font
        font.setBoldweight(Font.BOLDWEIGHT_BOLD);// Make font bold
        style.setFont(font);// set it to bold

        CellStyle backgroundStyle = workbook.createCellStyle();

        // backgroundStyle.setFillBackgroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        backgroundStyle.setFillPattern(CellStyle.SOLID_FOREGROUND);
        backgroundStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        backgroundStyle.setFont(font);

        CellStyle amountStyle = workbook.createCellStyle();
        amountStyle.setDataFormat(HSSFDataFormat.getBuiltinFormat("#,##0.00"));

        CellStyle backgroundAmountStyle = workbook.createCellStyle();
        backgroundAmountStyle.setDataFormat(HSSFDataFormat.getBuiltinFormat("#,##0.00"));
        backgroundAmountStyle.setFillPattern(CellStyle.SOLID_FOREGROUND);
        backgroundAmountStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        backgroundAmountStyle.setFont(font);

        HSSFRow header = worksheet.createRow((short) 0);

        HSSFCell h0 = header.createCell(0);
        HSSFCell h1 = header.createCell(1);
        HSSFCell h2 = header.createCell(2);
        HSSFCell h3 = header.createCell(3);
        HSSFCell h4 = header.createCell(4);
        HSSFCell h5 = header.createCell(5);
        HSSFCell h6 = header.createCell(6);
        HSSFCell h7 = header.createCell(7);
        HSSFCell h8 = header.createCell(8);
        HSSFCell h9 = header.createCell(9);
        HSSFCell h10 = header.createCell(10);

        h0.setCellValue("Šifra PM");
        h1.setCellValue("Naziv lokacije");
        h2.setCellValue("Vrsta plaćanja");
        h3.setCellValue("Vrsta proizvoda");
        h4.setCellValue("Bruto iznos");
        h5.setCellValue("Procenat provizije");
        h6.setCellValue("Iznos provizije");
        h7.setCellValue("Neto iznos");
        h8.setCellValue("Broj Transakcija");
        h9.setCellValue("Međubankarska \nnaknada");
        h10.setCellValue("Naknada IPS \nNBS sistem");

        header.getCell(0).setCellStyle(backgroundStyle);
        header.getCell(1).setCellStyle(backgroundStyle);
        header.getCell(2).setCellStyle(backgroundStyle);
        header.getCell(3).setCellStyle(backgroundStyle);
        header.getCell(4).setCellStyle(backgroundStyle);
        header.getCell(5).setCellStyle(backgroundStyle);
        header.getCell(6).setCellStyle(backgroundStyle);
        header.getCell(7).setCellStyle(backgroundStyle);
        header.getCell(8).setCellStyle(backgroundStyle);
        header.getCell(9).setCellStyle(backgroundStyle);
        header.getCell(10).setCellStyle(backgroundStyle);

        worksheet.setColumnWidth(0, 1800);
        worksheet.setColumnWidth(1, 5400);
        worksheet.setColumnWidth(2, 5300);
        worksheet.setColumnWidth(3, 2600);
        worksheet.setColumnWidth(4, 2600);
        worksheet.setColumnWidth(5, 2600);
        worksheet.setColumnWidth(6, 2600);
        worksheet.setColumnWidth(7, 2600);
        worksheet.setColumnWidth(8, 2600);
        worksheet.setColumnWidth(9, 2600);
        worksheet.setColumnWidth(10, 2600);

        int i = 1;
        for (TransactionReportCumulative row : rowsCumulative) {
            HSSFRow row1 = worksheet.createRow((short) i);

            HSSFCell cellA1 = row1.createCell((short) 0);
            cellA1.setCellValue(row.getPointOfSaleCode());
            HSSFCell cellA2 = row1.createCell((short) 1);
            cellA2.setCellValue(row.getLocationName());
            HSSFCell cellA3 = row1.createCell((short) 2);
            cellA3.setCellValue(row.getPaymentType());
            HSSFCell cellA4 = row1.createCell((short) 3);
            cellA4.setCellValue(row.getProductType());
            HSSFCell cellA5 = row1.createCell((short) 4);
            cellA5.setCellStyle(amountStyle);
            cellA5.setCellValue(row.getTrnSum());
            HSSFCell cellA6 = row1.createCell((short) 5);
            if (row.getFee_percentage() == null) {
                cellA6.setCellValue("");
            } else {
                cellA6.setCellValue(row.getFee_percentage());
                cellA6.setCellStyle(amountStyle);
            }
            HSSFCell cellA7 = row1.createCell((short) 6);
            cellA7.setCellValue(row.getFee_amount());
            cellA7.setCellStyle(amountStyle);
            HSSFCell cellA8 = row1.createCell((short) 7);
            cellA8.setCellValue(row.getTrnSum() - row.getFee_amount());
            cellA8.setCellStyle(amountStyle);
            HSSFCell cellA9 = row1.createCell((short) 8);
            cellA9.setCellValue(row.getTrnCount());
            HSSFCell cellA10 = row1.createCell((short) 9);
            cellA10.setCellStyle(amountStyle);
            cellA10.setCellValue(row.getInterBankFee());
            HSSFCell cellA11 = row1.createCell((short) 10);
            cellA11.setCellStyle(amountStyle);
            cellA11.setCellValue(row.getIpsFee());

            if (row.getPaymentType() == null) {
                cellA1.setCellStyle(backgroundStyle);
                cellA2.setCellStyle(backgroundStyle);
                cellA3.setCellStyle(backgroundStyle);
                cellA4.setCellStyle(backgroundStyle);
                cellA5.setCellStyle(backgroundAmountStyle);
                cellA6.setCellStyle(backgroundAmountStyle);
                cellA7.setCellStyle(backgroundAmountStyle);
                cellA8.setCellStyle(backgroundAmountStyle);
                cellA9.setCellStyle(backgroundAmountStyle);
                cellA10.setCellStyle(backgroundAmountStyle);
                cellA11.setCellStyle(backgroundAmountStyle);
            }

            i = i + 1;
        }

    }

    @SuppressWarnings("deprecation")
    private void WriteData(List<TransactionReport> rows, String date, HSSFWorkbook workbook) {

        // create .xls and create a worksheet.

        HSSFSheet worksheet = workbook.createSheet("Analitika");

        CellStyle style = workbook.createCellStyle();// Create style
        Font font = workbook.createFont();// Create font
        font.setBoldweight(Font.BOLDWEIGHT_BOLD);// Make font bold
        style.setFont(font);// set it to bold

        CellStyle amountStyle = workbook.createCellStyle();
        amountStyle.setDataFormat(HSSFDataFormat.getBuiltinFormat("#,##0.00"));

        HSSFRow header = worksheet.createRow((short) 0);
        HSSFCell h0 = header.createCell(0);
        HSSFCell h1 = header.createCell(1);
        HSSFCell h2 = header.createCell(2);
        HSSFCell h3 = header.createCell(3);
        HSSFCell h4 = header.createCell(4);
        HSSFCell h5 = header.createCell(5);
        HSSFCell h6 = header.createCell(6);
        HSSFCell h7 = header.createCell(7);
        HSSFCell h8 = header.createCell(8);
        HSSFCell h9 = header.createCell(9);
        HSSFCell h10 = header.createCell(10);
        HSSFCell h11 = header.createCell(11);
        HSSFCell h12 = header.createCell(12);
        HSSFCell h13 = header.createCell(13);
        HSSFCell h14 = header.createCell(14);
        HSSFCell h15 = header.createCell(15);
        HSSFCell h16 = header.createCell(16);

        h0.setCellValue("Šifra PM");
        h1.setCellValue("Mbtrgovca");
        h2.setCellValue("Naziv lokacije");
        h3.setCellValue("Datum transakcije");
        h4.setCellValue("Vreme transkacije");
        h5.setCellValue("ID naplatnog mesta");
        h6.setCellValue("RP tag Referenca plaćanja");
        h7.setCellValue("Banka izdavaoc");
        h8.setCellValue("Vrsta plaćanja");
        h9.setCellValue("Vrsta proizvoda");
        h10.setCellValue("Iznos");
        h11.setCellValue("Procenat provizije");
        h12.setCellValue("Iznos provizije (u RSD)");
        h13.setCellValue("Neto iznos");
        h14.setCellValue("Broj odobrenja");
        h15.setCellValue("Međubankarska naknada");
        h16.setCellValue("Naknada IPS NBS sistem");

        header.getCell(0).setCellStyle(style);
        header.getCell(1).setCellStyle(style);
        header.getCell(2).setCellStyle(style);
        header.getCell(3).setCellStyle(style);
        header.getCell(4).setCellStyle(style);
        header.getCell(5).setCellStyle(style);
        header.getCell(6).setCellStyle(style);
        header.getCell(7).setCellStyle(style);
        header.getCell(8).setCellStyle(style);
        header.getCell(9).setCellStyle(style);
        header.getCell(10).setCellStyle(style);
        header.getCell(11).setCellStyle(style);
        header.getCell(12).setCellStyle(style);
        header.getCell(13).setCellStyle(style);
        header.getCell(14).setCellStyle(style);
        header.getCell(15).setCellStyle(style);
        header.getCell(16).setCellStyle(style);

        worksheet.setColumnWidth(0, 1800);
        worksheet.setColumnWidth(1, 5400);
        worksheet.setColumnWidth(2, 5300);
        worksheet.setColumnWidth(3, 2600);
        worksheet.setColumnWidth(4, 2600);
        worksheet.setColumnWidth(5, 2600);
        worksheet.setColumnWidth(6, 5000);
        worksheet.setColumnWidth(7, 4000);
        worksheet.setColumnWidth(8, 4000);
        worksheet.setColumnWidth(9, 4000);
        worksheet.setColumnWidth(10, 4000);
        worksheet.setColumnWidth(11, 5300);
        worksheet.setColumnWidth(12, 5300);
        worksheet.setColumnWidth(13, 5300);
        worksheet.setColumnWidth(14, 5300);
        worksheet.setColumnWidth(15, 5300);
        worksheet.setColumnWidth(16, 5300);

        int i = 1;
        for (TransactionReport row : rows) {
            HSSFRow row1 = worksheet.createRow((short) i);

            HSSFCell cellA1 = row1.createCell((short) 0);
            cellA1.setCellValue(row.getPointOfSaleCode());
            HSSFCell cellA2 = row1.createCell((short) 1);
            cellA2.setCellValue(row.getMerchantNumber());
            HSSFCell cellA3 = row1.createCell((short) 2);
            cellA3.setCellValue(row.getLocationName());
            HSSFCell cellA4 = row1.createCell((short) 3);
            cellA4.setCellValue(row.getTransactionDate());
            HSSFCell cellA5 = row1.createCell((short) 4);
            cellA5.setCellValue(row.getTransactionTime());
            HSSFCell cellA6 = row1.createCell((short) 5);
            cellA6.setCellValue(row.getTid());
            HSSFCell cellA7 = row1.createCell((short) 6);
            cellA7.setCellValue(row.getEndToEndId());
            HSSFCell cellA8 = row1.createCell((short) 7);
            cellA8.setCellValue(row.getMerchantAccount());
            HSSFCell cellA9 = row1.createCell((short) 8);
            cellA9.setCellValue(row.getPaymentType());
            HSSFCell cellA10 = row1.createCell((short) 9);
            cellA10.setCellValue(row.getProductType());
            HSSFCell cellA11 = row1.createCell((short) 10);
            cellA11.setCellValue(row.getAmount());
            cellA11.setCellStyle(amountStyle);
            HSSFCell cellA12 = row1.createCell((short) 11);
            cellA12.setCellValue(row.getFeePercentage());
            cellA12.setCellStyle(amountStyle);
            HSSFCell cellA13 = row1.createCell((short) 12);
            cellA13.setCellValue(row.getFeeAmount());
            cellA13.setCellStyle(amountStyle);
            HSSFCell cellA14 = row1.createCell((short) 13);
            cellA14.setCellValue(row.getNetAmount());
            cellA14.setCellStyle(amountStyle);

            String approvalNumber = row.getPointOfSaleCode() + "-" + row.getPaymentType() + "-"
                    + row.getProductType().substring(0, 2);
            HSSFCell cellA15 = row1.createCell((short) 14);
            cellA15.setCellValue(approvalNumber);

            HSSFCell cellA16 = row1.createCell((short) 15);
            cellA16.setCellValue(row.getInterBankFee());
            cellA16.setCellStyle(amountStyle);
            HSSFCell cellA17 = row1.createCell((short) 16);
            cellA17.setCellValue(row.getIpsFee());
            cellA17.setCellStyle(amountStyle);

            i = i + 1;
        }

    }

    public Date convertToDateType(String date){
        Date parsedDate = null;
        try {
            java.util.Date formatedDate = new SimpleDateFormat("yyyy-MM-dd").parse(date);
            parsedDate = new Date(formatedDate.getTime());
            return parsedDate;
        } catch(ParseException e){
            e.printStackTrace();
        }
        return parsedDate;
    }

}
