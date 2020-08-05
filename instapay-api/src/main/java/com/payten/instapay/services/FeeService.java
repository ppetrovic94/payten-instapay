package com.payten.instapay.services;

import com.payten.instapay.dto.Fee.FeeMetadata;
import com.payten.instapay.dto.Fee.FeeRuleDto;
import com.payten.instapay.model.FeeRule;
import org.springframework.data.domain.Page;
import org.springframework.validation.BindingResult;

public interface FeeService {
    Page<FeeRule> getFeeRules(int pageNumber, String searchTerm);
    FeeRule getFeeRule(Integer feeRuleId);
    FeeRule addFeeRule(FeeRuleDto feeRuleDto, BindingResult result);
    FeeRule updateFeeRule(Integer feeRuleId, FeeRuleDto feeRuleDto, BindingResult result);
    void deleteFeeRule(Integer feeRuleId);
    FeeMetadata getFeeMetadata();
}
