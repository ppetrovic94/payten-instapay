package com.payten.instapay.services.impl;

import com.payten.instapay.dto.Merchant.MerchantDto;
import com.payten.instapay.dto.Merchant.MerchantMetadata;
import com.payten.instapay.exceptions.handlers.RequestedResourceNotFoundException;
import com.payten.instapay.exceptions.handlers.ValidationException;
import com.payten.instapay.model.Status;
import com.payten.instapay.model.City;
import com.payten.instapay.model.Merchant;
import com.payten.instapay.model.PaymentMethod;
import com.payten.instapay.repositories.StatusRepository;
import com.payten.instapay.repositories.CityRepository;
import com.payten.instapay.repositories.MerchantRepository;
import com.payten.instapay.repositories.PaymentMethodRepository;
import com.payten.instapay.services.MerchantService;
import com.payten.instapay.services.validation.MapValidationErrorService;

import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.modelmapper.TypeMap;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;
import org.apache.commons.lang3.math.NumberUtils;

import javax.transaction.Transactional;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class MerchantServiceImpl implements MerchantService {

    private final MerchantRepository merchantRepository;
    private final MapValidationErrorService mapValidationErrorService;
    private final StatusRepository statusRepository;
    private final CityRepository cityRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final ModelMapper modelMapper;

    public MerchantServiceImpl(MerchantRepository merchantRepository, MapValidationErrorService mapValidationErrorService, StatusRepository statusRepository, CityRepository cityRepository, PaymentMethodRepository paymentMethodRepository, ModelMapper modelMapper) {
        this.merchantRepository = merchantRepository;
        this.mapValidationErrorService = mapValidationErrorService;
        this.statusRepository = statusRepository;
        this.cityRepository = cityRepository;
        this.paymentMethodRepository = paymentMethodRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public Page<Merchant> findAllMerchantsPaginated(int pageNum, String searchTerm, String sortBy, String direction) {
        Pageable page;
        Page<Merchant> merchants = null;

        if (sortBy.isEmpty()){
            page = PageRequest.of(pageNum, 10,Sort.Direction.DESC, "setupDate");
        } else {
            page = PageRequest.of(pageNum, 10, direction.equals("ascending") ? Sort.Direction.ASC : Sort.Direction.DESC, sortBy);
        }

        if (searchTerm.isEmpty()) {
            merchants = merchantRepository.findAll(page);
            return merchants;
        }

        merchants = searchByTerm(searchTerm, page);
        return merchants;
    }

    @Override
    public List<Merchant> findAll() {
        List<Merchant> merchants = merchantRepository.findAll();
        if (merchants == null || merchants.isEmpty()) {
            throw new RequestedResourceNotFoundException("Tabela ne sadrzi nijednog trgovca");
        }
        return merchants;
    }

    @Override
    public MerchantDto findById(Integer id) {
        Merchant found = merchantRepository.getByMerchantId(id);

        if (found == null) {
            throw new RequestedResourceNotFoundException("Ne postoji trgovac sa ID-em: " + id);
        }

        return convertToDto(found);

    }

    @Override
    public Merchant addMerchant(MerchantDto merchantDto, BindingResult result){
        Map<String,String> errorMap = mapValidationErrorService.validate(result);

        if (errorMap != null) {
            throw new ValidationException(errorMap);
        } else {
            errorMap = checkMerchantUniqueConstraints(merchantDto.getLocalMerchantId(), merchantDto.getPersonalIdentityNumber(), merchantDto.getTaxIdentityNumber(), null);
            if (errorMap != null) {
                throw new ValidationException(errorMap);
            }
        }

        Merchant m = convertToEntity(merchantDto, null);
        if (m.getLocalMerchantId().isEmpty()) m.setLocalMerchantId(null);
        merchantRepository.save(m);
        return m;
    }

    @Override
    public MerchantDto editMerchant(Integer id, MerchantDto merchantDto, BindingResult result) {
        Merchant found = merchantRepository.getByMerchantId(id);

        if (found == null) {
            throw new RequestedResourceNotFoundException("Ne postoji trgovac sa ID-em: " + id);
        }

        Map<String,String> errorMap = mapValidationErrorService.validate(result);
        if (errorMap != null) {
            throw new ValidationException(errorMap);
        } else {
            errorMap = checkMerchantUniqueConstraints(merchantDto.getLocalMerchantId(), merchantDto.getPersonalIdentityNumber(), merchantDto.getTaxIdentityNumber(), found);
            if (errorMap != null) {
                throw new ValidationException(errorMap);
            }
        }

        merchantRepository.save(convertToEntity(merchantDto, found));
        return convertToDto(found);
    }

    @Override
    public String getMerchantNameById(Integer merchantId) {
        String merchantName = merchantRepository.getMerchantNameById(merchantId);

        if (merchantName == null) {
            throw new RequestedResourceNotFoundException("Ne postoji trgovac sa ID-em: " + merchantId);
        }

        return merchantName;
    }

    @Override
    public void deleteMerchant(Integer id) {
        Merchant found = merchantRepository.getByMerchantId(id);

        if (found == null) {
            throw new RequestedResourceNotFoundException("Ne postoji trgovac sa ID-em: " + id);
        }

        merchantRepository.delete(found);
    }

    @Override
    public MerchantMetadata getMerchantMetadata() {
        MerchantMetadata merchantMetadata = new MerchantMetadata();

        List<Status> statuses = statusRepository.findAll();
        List<City> cities = cityRepository.findAll();
        List<PaymentMethod> paymentMethods = paymentMethodRepository.findAll();

        merchantMetadata.setStatuses(statuses);
        merchantMetadata.setCities(cities);
        merchantMetadata.setPaymentMethods(paymentMethods);

        return merchantMetadata;
    }

    private Merchant convertToEntity(MerchantDto merchantDto, Merchant merchant)  {

        Status status = statusRepository.getStatusByStatusId(merchantDto.getStatusId());
            if (status == null) { throw new RequestedResourceNotFoundException("Ne postoji status sa ID-em " + merchantDto.getStatusId()); }

        PaymentMethod paymentMethod = paymentMethodRepository.getByPaymentMethodId(merchantDto.getPaymentMethodId());
            if (paymentMethod == null) { throw new RequestedResourceNotFoundException("Ne postoji metod plaćanja sa ID-em " + merchantDto.getPaymentMethodId()); }

        City city = cityRepository.getByCityId(merchantDto.getCityId());

        if (merchant == null) {
            merchant = new Merchant();
            merchant.setPaymentMethod(paymentMethod);
            merchant.setCity(city);
            merchant.setStatus(status);
            modelMapper.map(merchantDto, merchant);
            return merchant;
        } else {
            merchant.setPaymentMethod(paymentMethod);
            merchant.setCity(city);
            merchant.setStatus(status);
            modelMapper.map(merchantDto, merchant);
            return merchant;
        }

    }

    private MerchantDto convertToDto(Merchant merchant){

        TypeMap<Merchant, MerchantDto> typeMap = modelMapper.getTypeMap(Merchant.class, MerchantDto.class);
        if (typeMap == null) {
            modelMapper.addMappings(new PropertyMap<Merchant, MerchantDto>() {
                @Override
                protected void configure() {
                    map().setPaymentMethodId(source.getPaymentMethod().getPaymentMethodId());
                    map().setStatusId(source.getStatus().getStatusId());
                    map().setCityId(source.getCity().getCityId());
                }
            });
        }

        return modelMapper.map(merchant, MerchantDto.class);
    }

    private Page<Merchant> searchByTerm(String term, Pageable page){
        Page<Merchant> filtered;

        if (NumberUtils.isParsable(term)){
            filtered = merchantRepository.findByPersonalIdentityNumberContaining(term, page);
            if(!filtered.getContent().isEmpty()) return filtered;
        }

        filtered = merchantRepository.findByMerchantNameContaining(term, page);
        if(!filtered.getContent().isEmpty()) return filtered;
        filtered = merchantRepository.findByMerchantAddressContaining(term, page);
        if(!filtered.getContent().isEmpty()) return filtered;
        filtered = merchantRepository.findByCity_cityNameContaining(term, page);
        if(!filtered.getContent().isEmpty()) return filtered;
        filtered = merchantRepository.findByLocalMerchantIdContaining(term,page);
        if(!filtered.getContent().isEmpty()) return filtered;

        return filtered;
    }

    private Map<String,String> checkMerchantUniqueConstraints(String localMerchantId, String personalIdentityNumber, String taxIdentityNumber, Merchant m){
        Map<String,String> errorMap;
        if (m != null && m.getLocalMerchantId() != null && m.getLocalMerchantId().equals(localMerchantId)) {
            errorMap = null;
        }
        else {
            if (localMerchantId != null && merchantRepository.existsByLocalMerchantId(localMerchantId)) {
                errorMap = new HashMap<>();
                errorMap.put("localMerchantId", "Trgovac sa unetim ID-em: " + localMerchantId + " već postoji u bazi");
                return errorMap;
            }
        }

        if (m != null && m.getPersonalIdentityNumber() != null && m.getPersonalIdentityNumber().equals(personalIdentityNumber)) {
            errorMap = null;
        }
        else {
            if (!personalIdentityNumber.isEmpty() && merchantRepository.existsByPersonalIdentityNumber(personalIdentityNumber)){
                errorMap = new HashMap<>();
                errorMap.put("personalIdentityNumber", "Trgovac sa unetim matičnim brojem: " + personalIdentityNumber + " već postoji u bazi");
                return errorMap;
            }
        }

        if (m != null && m.getTaxIdentityNumber() != null && m.getTaxIdentityNumber().equals(taxIdentityNumber)){
            errorMap = null;
        }
        else {
            if (!taxIdentityNumber.isEmpty() && merchantRepository.existsByTaxIdentityNumber(taxIdentityNumber)){
                errorMap = new HashMap<>();
                errorMap.put("taxIdentityNumber", "Trgovac sa unetim PIB: " + taxIdentityNumber + " već postoji u bazi");
                return errorMap;
            }
        }

        return null;
    }

}
