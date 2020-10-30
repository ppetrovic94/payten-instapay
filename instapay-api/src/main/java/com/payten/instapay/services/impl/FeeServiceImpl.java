package com.payten.instapay.services.impl;

import com.payten.instapay.dto.Fee.FeeMetadata;
import com.payten.instapay.dto.Fee.FeeRuleDto;
import com.payten.instapay.dto.Merchant.MerchantNames;
import com.payten.instapay.exceptions.handlers.RequestedResourceNotFoundException;
import com.payten.instapay.model.*;
import com.payten.instapay.repositories.*;
import com.payten.instapay.services.FeeService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;

import java.util.List;

@Service
public class FeeServiceImpl implements FeeService {

    private final FeeRuleRepository feeRuleRepository;
    private final FeeReceiverRepository feeReceiverRepository;
    private final ProductTypeRepository productTypeRepository;
    private final FeeTypeRepository feeTypeRepository;
    private final MerchantRepository merchantRepository;

    public FeeServiceImpl(FeeRuleRepository feeRuleRepository, FeeReceiverRepository feeReceiverRepository, ProductTypeRepository productTypeRepository, FeeTypeRepository feeTypeRepository, MerchantRepository merchantRepository) {
        this.feeRuleRepository = feeRuleRepository;
        this.feeReceiverRepository = feeReceiverRepository;
        this.productTypeRepository = productTypeRepository;
        this.feeTypeRepository = feeTypeRepository;
        this.merchantRepository = merchantRepository;
    }

    @Override
    public Page<FeeRule> getFeeRules(int pageNumber, String searchTerm, String sortBy, String direction) {
        Pageable page;
        Page<FeeRule> feeRules = null;

        if (sortBy.isEmpty()){
            page = PageRequest.of(pageNumber, 10,Sort.Direction.DESC, "validityDate");
        } else {
            page = PageRequest.of(pageNumber, 10, direction.equals("ascending") ? Sort.Direction.ASC : Sort.Direction.DESC, sortBy);
        }

        if (searchTerm.isEmpty()) {
            feeRules = feeRuleRepository.findAll(page);
            return feeRules;
        }

        feeRules = searchByTerm(searchTerm, page);
        return feeRules;
    }

    @Override
    public Page<FeeRule> getFeeRulesByMerchantId(Integer merchantId, int pageNumber, String searchTerm, String sortBy, String direction) {
        Pageable page;
        Page<FeeRule> feeRules = null;

        if(!merchantRepository.existsById(merchantId))
            throw new RequestedResourceNotFoundException("Trgovac sa ID-em: " + merchantId + " ne postoji u bazi");

        if (sortBy.isEmpty()) {
            page = PageRequest.of(pageNumber, 10,Sort.Direction.DESC, "validityDate");
        } else {
            page = PageRequest.of(pageNumber, 10, direction.equals("ascending") ? Sort.Direction.ASC : Sort.Direction.DESC, sortBy);
        }

        if (searchTerm.isEmpty()) {
            feeRules = feeRuleRepository.findAllByMerchant_MerchantId(merchantId, page);
            return feeRules;
        }

        feeRules = searchByTerm(merchantId, searchTerm, page);
        return feeRules;
    }


    @Override
    public FeeRuleDto getFeeRule(Integer feeRuleId) {
        FeeRule found = feeRuleRepository.getByFeeId(feeRuleId);

        if (found == null) throw new RequestedResourceNotFoundException("Provizija sa ID-em: " + feeRuleId + " ne postoji");

        return convertToDto(found);
    }

    @Override
    public FeeRule addFeeRule(FeeRuleDto feeRuleDto, BindingResult result) {
        FeeRule feeRule = convertToEntity(feeRuleDto, null);
        return feeRuleRepository.save(feeRule);
    }

    @Override
    public FeeRule updateFeeRule(Integer feeRuleId, FeeRuleDto feeRuleDto, BindingResult result) {
        FeeRule found = feeRuleRepository.getByFeeId(feeRuleId);

        if (found == null) throw new RequestedResourceNotFoundException("Provizija sa ID-em: " + feeRuleId + " ne postoji");

        found = convertToEntity(feeRuleDto, found);
        return feeRuleRepository.save(found);
    }

    @Override
    public void deleteFeeRule(Integer feeRuleId) {
        FeeRule found = feeRuleRepository.getByFeeId(feeRuleId);

        if (found == null) throw new RequestedResourceNotFoundException("Provizija sa ID-em: " + feeRuleId + " ne postoji");

        feeRuleRepository.delete(found);
    }

    @Override
    public FeeMetadata getFeeMetadata() {
        FeeMetadata feeMetadata = new FeeMetadata();

        List<FeeReceiver> feeReceivers = feeReceiverRepository.findAll();
        List<FeeType> feeTypes = feeTypeRepository.findAll();
        List<ProductType> productTypes = productTypeRepository.findAll();
        List<MerchantNames> merchantNames = merchantRepository.findMerchantNames();

        feeMetadata.setFeeReceivers(feeReceivers);
        feeMetadata.setFeeTypes(feeTypes);
        feeMetadata.setProductTypes(productTypes);
        feeMetadata.setMerchantNames(merchantNames);

        return feeMetadata;
    }

    private FeeRule convertToEntity(FeeRuleDto feeRuleDto, FeeRule feeRule) {
        FeeType feeType = feeTypeRepository.getByTypeId(feeRuleDto.getFeeTypeId());
        if (feeType == null) throw new RequestedResourceNotFoundException("Uneli ste nepostojeći tip provizije");

        FeeReceiver feeReceiver = feeReceiverRepository.getByReceiverId(feeRuleDto.getFeeReceiverId());
        if (feeReceiver == null) throw new RequestedResourceNotFoundException("Uneli ste nepostojećeg primaoca");

        ProductType productType = productTypeRepository.getByTypeId(feeRuleDto.getProductTypeId());
        if (productType == null) throw new RequestedResourceNotFoundException("Uneli ste nepostojeći tip proizvoda");

        Merchant merchant = merchantRepository.getByMerchantId(feeRuleDto.getMerchantId());

        if (feeRule == null) feeRule = new FeeRule();

        feeRule.setFeeType(feeType);
        feeRule.setFeeReceiver(feeReceiver);
        feeRule.setProductType(productType);
        feeRule.setMerchant(merchant);
        feeRule.setAmount(feeRuleDto.getAmount());
        feeRule.setCondition(feeRuleDto.getCondition());
        feeRule.setValidityDate(feeRuleDto.getValidityDate());

        return feeRule;
    }

    private FeeRuleDto convertToDto(FeeRule feeRule) {
        FeeRuleDto feeRuleDto = new FeeRuleDto();
        feeRuleDto.setFeeReceiverId(feeRule.getFeeReceiver().getReceiverId());
        feeRuleDto.setFeeTypeId(feeRule.getFeeType().getTypeId());
        feeRuleDto.setProductTypeId(feeRule.getProductType().getTypeId());
        feeRuleDto.setMerchantId(feeRule.getMerchant() != null ? feeRule.getMerchant().getMerchantId() : null);
        feeRuleDto.setAmount(feeRule.getAmount());
        feeRuleDto.setCondition(feeRule.getCondition());
        feeRuleDto.setValidityDate(feeRule.getValidityDate() != null ? feeRule.getValidityDate().toString() : null);
        return feeRuleDto;
    }

    private Page<FeeRule> searchByTerm(Integer merchantId, String searchTerm, Pageable page){
        Page<FeeRule> filtered;

        filtered = feeRuleRepository.findByMerchant_MerchantIdAndMerchant_MerchantNameContaining(merchantId, searchTerm, page);
        if (!filtered.getContent().isEmpty()) return filtered;
        filtered = feeRuleRepository.findByMerchant_MerchantIdAndFeeReceiver_ReceiverNameContaining(merchantId, searchTerm, page);
        if (!filtered.getContent().isEmpty()) return filtered;
        filtered = feeRuleRepository.findByMerchant_MerchantIdAndFeeType_TypeNameContaining(merchantId, searchTerm, page);
        if (!filtered.getContent().isEmpty()) return filtered;
        filtered = feeRuleRepository.findByMerchant_MerchantIdAndProductType_TypeNameContaining(merchantId, searchTerm, page);
        if (!filtered.getContent().isEmpty()) return filtered;

        return filtered;
    }

    private Page<FeeRule> searchByTerm(String searchTerm, Pageable page) {
        Page<FeeRule> filtered;

        filtered = feeRuleRepository.findByMerchant_MerchantNameContaining(searchTerm, page);
        if (!filtered.getContent().isEmpty()) return filtered;
        filtered = feeRuleRepository.findByFeeReceiver_ReceiverNameContaining(searchTerm, page);
        if (!filtered.getContent().isEmpty()) return filtered;
        filtered = feeRuleRepository.findByFeeType_TypeNameContaining(searchTerm, page);
        if (!filtered.getContent().isEmpty()) return filtered;
        filtered = feeRuleRepository.findByProductType_TypeNameContaining(searchTerm, page);
        if (!filtered.getContent().isEmpty()) return filtered;

        return filtered;
    }
}
