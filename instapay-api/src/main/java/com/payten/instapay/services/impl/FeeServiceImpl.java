package com.payten.instapay.services.impl;

import com.payten.instapay.dto.Fee.FeeMetadata;
import com.payten.instapay.dto.Fee.FeeRuleDto;
import com.payten.instapay.model.FeeRule;
import com.payten.instapay.services.FeeService;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;

@Service
public class FeeServiceImpl implements FeeService {

    @Override
    public Page<FeeRule> getFeeRules(int pageNumber, String searchTerm) {
        return null;
    }

    @Override
    public FeeRule getFeeRule(Integer feeRuleId) {
        return null;
    }

    @Override
    public FeeRule addFeeRule(FeeRuleDto feeRuleDto, BindingResult result) {
        return null;
    }

    @Override
    public FeeRule updateFeeRule(Integer feeRuleId, FeeRuleDto feeRuleDto, BindingResult result) {
        return null;
    }

    @Override
    public void deleteFeeRule(Integer feeRuleId) {

    }

    @Override
    public FeeMetadata getFeeMetadata() {
        return null;
    }
}
