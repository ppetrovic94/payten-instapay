package com.payten.instapay.services.impl;

import com.payten.instapay.model.custom.TerminalTransaction;
import com.payten.instapay.model.custom.TerminalTransactionDetails;
import com.payten.instapay.model.custom.TerminalTransactionPage;
import com.payten.instapay.services.TransactionService;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.ParameterMode;
import javax.persistence.PersistenceContext;
import javax.persistence.StoredProcedureQuery;
import javax.transaction.Transactional;
import java.sql.Date;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

@Service
public class TransactionServiceImpl implements TransactionService {

    @PersistenceContext
    private EntityManager em;

    @Override
    @Transactional
    public TerminalTransactionPage getTransactionByTerminalIdAndDateRangePaginated(String dateFrom, String dateTo, String terminalId, Integer pageNum, Integer pageSize) {
        StoredProcedureQuery procedureQuery = em.createStoredProcedureQuery("GET_TRANSACTIONS_PAGINATED", TerminalTransaction.class);

        procedureQuery.registerStoredProcedureParameter("I_DATE_FROM", Date.class, ParameterMode.IN);
        procedureQuery.registerStoredProcedureParameter("I_DATE_TO", Date.class, ParameterMode.IN);
        procedureQuery.registerStoredProcedureParameter("I_TID", String.class, ParameterMode.IN);
        procedureQuery.registerStoredProcedureParameter("I_PAGE_NUMBER", Integer.class, ParameterMode.IN);
        procedureQuery.registerStoredProcedureParameter("I_PAGE_SIZE", Integer.class, ParameterMode.IN);
        procedureQuery.registerStoredProcedureParameter("@O_RECORD_COUNT", Integer.class, ParameterMode.OUT);

        procedureQuery.setParameter("I_DATE_FROM", convertToDateType(dateFrom));
        procedureQuery.setParameter("I_DATE_TO", convertToDateType(dateTo));
        procedureQuery.setParameter("I_TID", terminalId);
        procedureQuery.setParameter("I_PAGE_NUMBER", pageNum);
        procedureQuery.setParameter("I_PAGE_SIZE", pageSize);

        boolean success = procedureQuery.execute();
        TerminalTransactionPage transactionsPage = new TerminalTransactionPage();

        if (success) {
            List<TerminalTransaction> resultList = procedureQuery.getResultList();
            Integer recordCount = (Integer) procedureQuery.getOutputParameterValue("@O_RECORD_COUNT");
            transactionsPage.setContent(resultList);
            transactionsPage.setTotalElements(recordCount);
            transactionsPage.setTotalPages((int) Math.ceil((float) recordCount/pageSize));
        }

        return transactionsPage;
    }

    @Override
    @Transactional
    public List<TerminalTransactionDetails> getTransactionDetailsByEndToEndId(String endToEndId) {
        StoredProcedureQuery procedureQuery = em.createStoredProcedureQuery("GET_TRANSACTION_DETAILS_BY_END_TO_END_ID");

        procedureQuery.registerStoredProcedureParameter("END_TO_END_ID", String.class, ParameterMode.IN);
        procedureQuery.setParameter("END_TO_END_ID", endToEndId);

        boolean success = procedureQuery.execute();
        List<TerminalTransactionDetails> transactionDetailsList = new ArrayList<>();


        if (success) {
            List<Object[]> resultList = procedureQuery.getResultList();
            for (int i = 0; i < resultList.size(); i++) {
                Object obj[] = resultList.get(i);
                TerminalTransactionDetails terminalTransactionDetails = new TerminalTransactionDetails();
                terminalTransactionDetails.setTransactionIdentifier((String) obj[0]);
                terminalTransactionDetails.setTid((String) obj[1]);
                terminalTransactionDetails.setStatus((String) obj[2]);
                terminalTransactionDetails.setStatusDate((String) obj[3]);
                terminalTransactionDetails.setEndToEndId((String) obj[4]);
                terminalTransactionDetails.setInstructionId((String) obj[5]);
                terminalTransactionDetails.setSetupDate((Timestamp) obj[6]);
                transactionDetailsList.add(terminalTransactionDetails);
            }
        }

        return transactionDetailsList;
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
