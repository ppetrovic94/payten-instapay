package com.payten.instapay.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.innoventsolutions.birt.entity.ExecuteRequest;
import com.innoventsolutions.birt.error.ApiError;
import com.innoventsolutions.birt.exception.BirtStarterException;
import com.innoventsolutions.birt.service.ReportRunService;
import com.innoventsolutions.birt.util.Util;
import com.payten.instapay.model.TransactionReport;
import com.payten.instapay.services.TransactionReportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(path="/api/user")
public class ReportController {

    private final TransactionReportService transactionReportService;
    private final ReportRunService runner;

    public ReportController(TransactionReportService transactionReportService, ReportRunService runner) {
        this.transactionReportService = transactionReportService;
        this.runner = runner;
    }

    @GetMapping("/transactions")
    @ResponseStatus(value = HttpStatus.OK)
    public List<TransactionReport> getMerchantReportJSON(@RequestParam(name="dateFrom", required = true) String dateFrom,
                                                @RequestParam(name="dateTo", required = true) String dateTo,
                                                @RequestParam(name="merchantId", required = true) Integer merchantId){
        return transactionReportService.getMerchantReport(dateFrom, dateTo, merchantId);
    }



    @GetMapping("/exportIpsReport")
    @ResponseStatus(value = HttpStatus.OK)
    public ResponseEntity<StreamingResponseBody> exportIpsReportToXlsx(@RequestParam(name = "dateFrom") String dateFrom,
                                                                       @RequestParam(name = "dateTo") String dateTo,
                                                                       @RequestParam(name = "merchantId") Integer merchantId,
                                                                       @RequestParam(name = "merchantName") String merchantName,
                                                                       final HttpServletResponse response){

        final Map<String, Object> params = new HashMap<String, Object>();
        params.put("I_DATE", convertToDateType(dateFrom));
        params.put("I_DATE_TO", convertToDateType(dateTo));
        params.put("I_MERCHANT_ID", merchantId);
        final ExecuteRequest request = ExecuteRequest.builder()
                .designFile("ips_report_gen.rptdesign")
                .outputName("IPS-Izvestaj_" + merchantName + "_" + dateFrom + "--" + dateTo)
                .format("XLSX")
                .parameters(params)
                .build();

        final StreamingResponseBody responseBody = out -> {
            try {
                runner.execute(request, response.getOutputStream());
            } catch (final BirtStarterException e) {
                try {
                    if (request.getWrapError()) {
                        // send JSON with error code
                        response.setStatus(e.getHttpCode().value());
                        response.setContentType("application/json");
                        final ApiError apiError = new ApiError(e.getHttpCode(), e.getMessage());
                        final ObjectMapper mapper = new ObjectMapper();
                        mapper.writeValue(response.getOutputStream(), apiError);


                    } else {
                        response.sendError(e.getHttpCode().value(), e.getMessage());
                    }
                } catch (final IOException e1) {
                    e1.printStackTrace();
                }
            }
        };

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=" + request.getOutputName() + "." + request.getFormat())
                .contentType(Util.getMediaType(request.getFormat())).body(responseBody);
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
