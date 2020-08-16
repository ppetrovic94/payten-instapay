package com.payten.instapay.services.impl;

import com.payten.instapay.model.TransactionReport;
import com.payten.instapay.services.TransactionReportService;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.ParameterMode;
import javax.persistence.PersistenceContext;
import javax.persistence.StoredProcedureQuery;
import javax.transaction.Transactional;
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

        procedureQuery.registerStoredProcedureParameter("I_DATE", Date.class, ParameterMode.IN);
        procedureQuery.registerStoredProcedureParameter("I_DATE_TO", Date.class, ParameterMode.IN);
        procedureQuery.registerStoredProcedureParameter("I_MERCHANT_ID", Integer.class, ParameterMode.IN);
        procedureQuery.registerStoredProcedureParameter("O_CUR", void.class, ParameterMode.REF_CURSOR);

        procedureQuery.setParameter("I_DATE", convertToDateType(dateFrom));
        procedureQuery.setParameter("I_DATE_TO", convertToDateType(dateTo));
        procedureQuery.setParameter("I_MERCHANT_ID", merchantId);

        procedureQuery.execute();
        List<TransactionReport> resultList = procedureQuery.getResultList();
        return resultList;
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
