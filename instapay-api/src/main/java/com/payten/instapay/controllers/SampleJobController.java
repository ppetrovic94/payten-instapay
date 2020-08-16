package com.payten.instapay.controllers;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

import javax.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.innoventsolutions.birt.error.ApiError;
import com.innoventsolutions.birt.exception.BirtStarterException;
import com.innoventsolutions.birt.service.ReportRunService;
import com.innoventsolutions.birt.util.Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.innoventsolutions.birt.entity.ExecuteRequest;
import com.innoventsolutions.birt.entity.SubmitResponse;
import com.innoventsolutions.birt.service.SubmitJobService;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

@RestController
@CrossOrigin("*")
public class SampleJobController {

    @Autowired
    private SubmitJobService submitter;

    @Autowired
    private ReportRunService runner;

    @GetMapping("/test")
    public ResponseEntity<SubmitResponse> getTestSubmit(@RequestParam(required = false) Integer numToRun,
                                                        final HttpServletResponse httpResponse) {

        /* Example of using birt-engine service classes directly
         *
         * Built in REST end points exist at /runReport and /submitJob
         */

        System.out.println("testSubmit Outer:");


        if (numToRun == null)
            numToRun = 10;

        final SubmitResponse outerResponse = new SubmitResponse(new ExecuteRequest());

        final String rptDesign = "param_test.rptdesign";
        final int min = 1;
        final int max = 10;
        for (int i = 0; i < numToRun; i++) {

            final int delay = ((int) (Math.random() * (max - min))) + min;
            final String outputName = "Test_" + i + " d(" + delay + ")";
            String format = "PDF";
            if ((i % 2) == 0)
                format = "HTML";

            final Map<String, Object> params = new HashMap<String, Object>();
            params.put("paramString", "Ginger");
            params.put("paramDate", "2010-09-09");
            params.put("paramBoolean", true);
            params.put("paramDecimal", (i * 1.9) * i);
            params.put("paramInteger", i);
            params.put("delay", delay);
            final ExecuteRequest request = new ExecuteRequest(rptDesign, outputName, format, params, true);

            executeSubmitJob(request, httpResponse);

        }

        return new ResponseEntity<SubmitResponse>(outerResponse, HttpStatus.OK);

    }

    @PostMapping("/sampleSubmitJob")
    public ResponseEntity<SubmitResponse> executeSubmitJob(@RequestBody final ExecuteRequest request,
                                                           final HttpServletResponse httpResponse) {

        System.out.println("Submit Job Inner:");

        final SubmitResponse submitResponse = new SubmitResponse(request);
        @SuppressWarnings("unused")
        final CompletableFuture<SubmitResponse> submission = submitter.executeRunThenRender(submitResponse);

        return new ResponseEntity<SubmitResponse>(submitResponse, HttpStatus.OK);
    }

    @GetMapping("/exportReport")
    public ResponseEntity<StreamingResponseBody> exportReport(final HttpServletResponse response){

        final Map<String, Object> params = new HashMap<String, Object>();
        params.put("is_approved", 1);
        final ExecuteRequest request = ExecuteRequest.builder()
                .designFile("ips_report.rptdesign")
                .outputName("ipsReport")
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

}
