package com.payten.instapay.services.impl;

import com.payten.instapay.dto.Merchant.MerchantDto;
import com.payten.instapay.dto.PointOfSale.PointOfSaleDto;
import com.payten.instapay.exceptions.handlers.RequestedResourceNotFoundException;
import com.payten.instapay.exceptions.handlers.ValidationException;
import com.payten.instapay.model.*;
import com.payten.instapay.repositories.AcqStatusRepository;
import com.payten.instapay.repositories.CityRepository;
import com.payten.instapay.repositories.PaymentMethodRepository;
import com.payten.instapay.repositories.PointOfSaleRepository;
import com.payten.instapay.services.PointOfSaleService;
import com.payten.instapay.services.validation.MapValidationErrorService;
import org.apache.commons.lang3.math.NumberUtils;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.modelmapper.TypeMap;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;

import java.util.HashMap;
import java.util.Map;

@Service
public class PointOfSaleServiceImpl implements PointOfSaleService {

    private final PointOfSaleRepository pointOfSaleRepository;
    private final MapValidationErrorService mapValidationErrorService;
    private final AcqStatusRepository acqStatusRepository;
    private final CityRepository cityRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final ModelMapper modelMapper;

    public PointOfSaleServiceImpl(PointOfSaleRepository pointOfSaleRepository, MapValidationErrorService mapValidationErrorService, AcqStatusRepository acqStatusRepository, CityRepository cityRepository, PaymentMethodRepository paymentMethodRepository, ModelMapper modelMapper) {
        this.pointOfSaleRepository = pointOfSaleRepository;
        this.mapValidationErrorService = mapValidationErrorService;
        this.acqStatusRepository = acqStatusRepository;
        this.cityRepository = cityRepository;
        this.paymentMethodRepository = paymentMethodRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public Page<PointOfSale> findAllPointOfSalesForMerchantPaginated(Integer merchantId, int pageNum, String searchTerm) {
        Pageable page = PageRequest.of(pageNum, 25, Sort.by("merchantId"));
        Page<PointOfSale> pointOfSales = null;

        if (searchTerm.isEmpty()) {
            pointOfSales = pointOfSaleRepository.findAllByMerchantId(merchantId, page);
            return pointOfSales;
        }

        pointOfSales = searchByTerm(searchTerm, page);
        return pointOfSales;
    }

    @Override
    public PointOfSaleDto findById(Integer id) {
        PointOfSale found = pointOfSaleRepository.getByPointOfSaleId(id);

        if (found == null) {
            throw new RequestedResourceNotFoundException("Prodajno mesto sa ID-em: " + id + " ne postoji");
        }

        return convertToDto(found);
    }

    @Override
    public PointOfSale addPointOfSale(PointOfSaleDto pointOfSaleDto, BindingResult result, Integer merchantId) {
        Map<String,String> errorMap = mapValidationErrorService.validate(result);

        if (merchantId == null) {
            throw new RequestedResourceNotFoundException("Trgovac sa ID-em: " + merchantId + " ne postoji");
        }

        if (errorMap != null){
            throw new ValidationException(errorMap);
        } else {
            errorMap = checkPointOfSaleUniqueConstraints(pointOfSaleDto.getPointOfSaleLocalId(), null);
            if (errorMap != null) {
                throw new ValidationException(errorMap);
            }
        }

        PointOfSale pointOfSale = convertToEntity(pointOfSaleDto, null);
        if (pointOfSale.getPointOfSaleLocalId().isEmpty()) pointOfSale.setPointOfSaleLocalId(null);
        pointOfSale.setMerchantId(merchantId);
        return pointOfSaleRepository.save(pointOfSale);
    }

    @Override
    public PointOfSaleDto editPointOfSale(Integer pointOfSaleId, PointOfSaleDto pointOfSaleDto, BindingResult result) {
        PointOfSale found = pointOfSaleRepository.getByPointOfSaleId(pointOfSaleId);

        if (found == null) {
            throw new RequestedResourceNotFoundException("Prodajno mesto sa ID-em: " + pointOfSaleId + " ne postoji");
        }

        Map<String,String> errorMap = mapValidationErrorService.validate(result);
        if (errorMap != null) {
            throw new ValidationException(errorMap);
        } else {
            errorMap = checkPointOfSaleUniqueConstraints(pointOfSaleDto.getPointOfSaleLocalId(), found);
            if (errorMap != null) {
                throw new ValidationException(errorMap);
            }
        }

        pointOfSaleRepository.save(convertToEntity(pointOfSaleDto, found));
        return convertToDto(found);
    }

    @Override
    public void deletePointOfSale(Integer id) {
        PointOfSale found = pointOfSaleRepository.getByPointOfSaleId(id);

        if (found == null) {
            throw new RequestedResourceNotFoundException("Prodajno mesto sa ID-em: " + id + " ne postoji");
        }

        pointOfSaleRepository.delete(found);
    }

    private PointOfSale convertToEntity(PointOfSaleDto pointOfSaleDto, PointOfSale pointOfSale) {

        AcqStatus status = acqStatusRepository.getAcqStatusByStatusId(pointOfSaleDto.getStatusId());
        if (status == null) { throw new RequestedResourceNotFoundException("Ne postoji status sa ID-em " + pointOfSaleDto.getStatusId()); }

        PaymentMethod paymentMethod = paymentMethodRepository.getByPaymentMethodId(pointOfSaleDto.getPaymentMethodId());
        if (paymentMethod == null) { throw new RequestedResourceNotFoundException("Ne postoji metod plaćanja sa ID-em " + pointOfSaleDto.getPaymentMethodId()); }

        City city = cityRepository.getByCityId(pointOfSaleDto.getCityId());

        TypeMap<PointOfSaleDto, PointOfSale> typeMap = modelMapper.getTypeMap(PointOfSaleDto.class, PointOfSale.class);
        if (typeMap == null){
            modelMapper.addMappings(new PropertyMap<PointOfSaleDto, PointOfSale>() {
                @Override
                protected void configure() {
                    map().setPaymentMethod(paymentMethod);
                    map().setStatus(status);
                    map().setCity(city);
                    map().setSetupDate(source.getSetupDate());
                }
            });
        }

        if(pointOfSale == null) {
            return modelMapper.map(pointOfSaleDto, PointOfSale.class);
        } else {
            modelMapper.map(pointOfSaleDto, pointOfSale);
            return pointOfSale;
        }
    }

    private PointOfSaleDto convertToDto(PointOfSale pointOfSale){

        TypeMap<PointOfSale, PointOfSaleDto> typeMap = modelMapper.getTypeMap(PointOfSale.class, PointOfSaleDto.class);
        if (typeMap == null) {
            modelMapper.addMappings(new PropertyMap<PointOfSale, PointOfSaleDto>() {
                @Override
                protected void configure() {
                    map().setPaymentMethodId(source.getPaymentMethod().getPaymentMethodId());
                    map().setStatusId(source.getStatus().getStatusId());
                    map().setCityId(source.getCity().getCityId());
                }
            });
        }

        return modelMapper.map(pointOfSale, PointOfSaleDto.class);
    }

    private Map<String, String> checkPointOfSaleUniqueConstraints(String pointOfSaleLocalId, PointOfSale pointOfSale){
        Map<String,String> errorMap;
        if (pointOfSale != null && pointOfSale.getPointOfSaleLocalId().equals(pointOfSaleLocalId)){
            errorMap = null;
        } else {
            if (!pointOfSaleLocalId.isEmpty() && pointOfSaleRepository.existsByPointOfSaleLocalId(pointOfSaleLocalId)) {
                errorMap = new HashMap<>();
                errorMap.put("pointOfSaleLocalId", "Prodajno mesto sa unetim ID-em: " + pointOfSaleLocalId + " već postoji u bazi");
                return errorMap;
            }
        }

        return null;
    }

    private Page<PointOfSale> searchByTerm(String term, Pageable page){
        Page<PointOfSale> filtered;

        if (NumberUtils.isParsable(term)) {
            filtered = pointOfSaleRepository.findByPointOfSaleAccountContaining(term, page);
            if (!filtered.getContent().isEmpty()) return filtered;
        }

        filtered = pointOfSaleRepository.findByPointOfSaleNameContaining(term, page);
        if (!filtered.getContent().isEmpty()) return filtered;
        filtered = pointOfSaleRepository.findByPointOfSaleLocalIdContaining(term, page);
        if (!filtered.getContent().isEmpty()) return filtered;
        filtered = pointOfSaleRepository.findByCity_cityNameContaining(term, page);
        if (!filtered.getContent().isEmpty()) return filtered;

        return filtered;
    }



}
