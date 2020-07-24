package com.payten.instapay.services;

import com.payten.instapay.dto.Merchant.MerchantDto;
import com.payten.instapay.dto.Merchant.MerchantMetadata;
import com.payten.instapay.model.Merchant;
import org.springframework.data.domain.Page;
import org.springframework.validation.BindingResult;

import java.util.List;

public interface MerchantService {

    List<Merchant> findAll();
    Page<Merchant> findAllMerchantsPaginated(int pageNum, String searchTerm, String sortBy, String direction);
    MerchantDto findById(Integer id);
    Merchant addMerchant(MerchantDto m, BindingResult result);
    void deleteMerchant(Integer id);
    MerchantMetadata getMerchantMetadata();
    MerchantDto editMerchant(Integer id, MerchantDto merchant, BindingResult result);

}
