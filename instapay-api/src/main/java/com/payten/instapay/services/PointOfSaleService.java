package com.payten.instapay.services;

import com.payten.instapay.dto.PointOfSale.PointOfSaleDto;
import com.payten.instapay.model.PointOfSale;
import org.springframework.data.domain.Page;
import org.springframework.validation.BindingResult;

public interface PointOfSaleService {

    Page<PointOfSale> findAllPointOfSalesForMerchantPaginated(Integer merchantId,int pageNum,String searchTerm);
    PointOfSaleDto findById(Integer id);
    PointOfSale addPointOfSale(PointOfSaleDto p, BindingResult result, Integer merchantId);
    PointOfSaleDto editPointOfSale(Integer pointOfSaleId, PointOfSaleDto pointOfSaleDto, BindingResult result);
    void deletePointOfSale(Integer id);

}
