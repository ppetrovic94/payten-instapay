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
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;


@Service
public class TransactionServiceImpl implements TransactionService {

    @PersistenceContext
    private EntityManager em;

    @Override
    public TerminalTransactionPage getTransactionByTerminalIdAndDateRangePaginated(String dateFrom, String dateTo, String terminalId, Integer merchantId, Integer pageNum, Integer pageSize) {
        StoredProcedureQuery procedureQuery = em.createStoredProcedureQuery("GET_TRANSACTIONS_PAGINATED", TerminalTransaction.class);

        procedureQuery.registerStoredProcedureParameter("I_DATE_FROM", String.class, ParameterMode.IN);
        procedureQuery.registerStoredProcedureParameter("I_DATE_TO", String.class, ParameterMode.IN);
        procedureQuery.registerStoredProcedureParameter("I_TID", String.class, ParameterMode.IN);
        procedureQuery.registerStoredProcedureParameter("I_MERCHANT_ID", Integer.class, ParameterMode.IN);
        procedureQuery.registerStoredProcedureParameter("I_PAGE_NUMBER", Integer.class, ParameterMode.IN);
        procedureQuery.registerStoredProcedureParameter("I_PAGE_SIZE", Integer.class, ParameterMode.IN);
        procedureQuery.registerStoredProcedureParameter("O_RECORD_COUNT", Integer.class, ParameterMode.OUT);
        procedureQuery.registerStoredProcedureParameter("O_CUR", void.class, ParameterMode.REF_CURSOR);


        procedureQuery.setParameter("I_DATE_FROM", dateFrom);
        procedureQuery.setParameter("I_DATE_TO", dateTo);
        procedureQuery.setParameter("I_TID", terminalId);
        procedureQuery.setParameter("I_MERCHANT_ID", merchantId);
        procedureQuery.setParameter("I_PAGE_NUMBER", pageNum);
        procedureQuery.setParameter("I_PAGE_SIZE", pageSize);

        boolean success = procedureQuery.execute();
        TerminalTransactionPage transactionsPage = new TerminalTransactionPage();

        if (success) {
            List<TerminalTransaction> resultList = procedureQuery.getResultList();
            Integer recordCount = (Integer) procedureQuery.getOutputParameterValue("O_RECORD_COUNT");

            transactionsPage.setContent(resultList);
            transactionsPage.setTotalElements(recordCount);
            transactionsPage.setTotalPages((int) Math.ceil((float) recordCount/pageSize));
        }

        return transactionsPage;
    }

    @Override
    public List<TerminalTransactionDetails> getTransactionDetailsByEndToEndId(String endToEndId) {
        StoredProcedureQuery procedureQuery = em.createStoredProcedureQuery("GET_TRANSACTION_DETAILS_BY_ID");

        procedureQuery.registerStoredProcedureParameter("I_END_TO_END_ID", String.class, ParameterMode.IN);
        procedureQuery.registerStoredProcedureParameter("O_RESULT", void.class, ParameterMode.REF_CURSOR);

        procedureQuery.setParameter("I_END_TO_END_ID", endToEndId);

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
                terminalTransactionDetails.setSetupDate(String.valueOf(obj[6]));
                transactionDetailsList.add(terminalTransactionDetails);
            }
        }

        return transactionDetailsList;
    }
}
