package com.payten.instapay.services.impl;

import com.payten.instapay.dto.Terminal.TerminalDto;
import com.payten.instapay.dto.Terminal.TerminalMetadata;
import com.payten.instapay.exceptions.handlers.RequestedResourceNotFoundException;
import com.payten.instapay.exceptions.handlers.ValidationException;
import com.payten.instapay.model.*;
import com.payten.instapay.repositories.*;
import com.payten.instapay.services.TerminalService;
import com.payten.instapay.services.validation.MapValidationErrorService;
import org.apache.commons.lang3.math.NumberUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;

import javax.transaction.Transactional;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TerminalServiceImpl implements TerminalService {

    private final TerminalRepository terminalRepository;
    private final PointOfSaleRepository pointOfSaleRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final MapValidationErrorService mapValidationErrorService;
    private final TerminalTypeRepository terminalTypeRepository;
    private final StatusRepository statusRepository;

    public TerminalServiceImpl(TerminalRepository terminalRepository, PointOfSaleRepository pointOfSaleRepository, PaymentMethodRepository paymentMethodRepository, MapValidationErrorService mapValidationErrorService, TerminalTypeRepository terminalTypeRepository, StatusRepository statusRepository) {
        this.terminalRepository = terminalRepository;
        this.pointOfSaleRepository = pointOfSaleRepository;
        this.paymentMethodRepository = paymentMethodRepository;
        this.mapValidationErrorService = mapValidationErrorService;
        this.terminalTypeRepository = terminalTypeRepository;
        this.statusRepository = statusRepository;
    }

    @Override
    public Page<Terminal> findAllTerminalsPaginated(Integer pointOfSaleId, int pageNum, String searchTerm, String sortBy, String direction) {
        Pageable page;
        Page<Terminal> terminals = null;

        if(!pointOfSaleRepository.existsById(pointOfSaleId))
            throw new RequestedResourceNotFoundException("Prodajno mesto sa ID-em: " + pointOfSaleId + " ne postoji");


        if (sortBy.isEmpty()){
            page = PageRequest.of(pageNum, 10,Sort.Direction.DESC, "setupDate");
        } else {
            page = PageRequest.of(pageNum, 10, direction.equals("ascending") ? Sort.Direction.ASC : Sort.Direction.DESC, sortBy);
        }

        if (searchTerm.isEmpty()) {
            terminals = terminalRepository.findAllByPointOfSaleId(pointOfSaleId, page);
            return terminals;
        }

        terminals = searchByTerm(pointOfSaleId, searchTerm, page);

        return terminals;
    }

    @Override
    public Terminal findById(Integer terminalId) {
        Terminal found = terminalRepository.getByTerminalId(terminalId);

        if (found == null) {
            throw new RequestedResourceNotFoundException("Terminal sa ID-em: " + terminalId + " ne postoji");
        }

        return found;
    }

    @Override
    public TerminalDto findDtoById(Integer terminalId) {
        Terminal found = terminalRepository.getByTerminalId(terminalId);

        if (found == null) {
            throw new RequestedResourceNotFoundException("Terminal sa ID-em: " + terminalId + " ne postoji");
        }

        return convertToDto(found);
    }

    @Override
    public Terminal addTerminal(Integer pointOfSaleId, TerminalDto terminalDto, BindingResult result) {
        Map<String,String> errorMap = mapValidationErrorService.validate(result);

        if (pointOfSaleId == null) {
            throw new RequestedResourceNotFoundException("Prodajno mesto sa ID-em: " + pointOfSaleId + " ne postoji");
        }

        if (errorMap != null){
            throw new ValidationException(errorMap);
        } else {
            errorMap = checkTerminalUniqueConstraints(terminalDto.getAcquirerTid(), null);
            if (errorMap != null) {
                throw new ValidationException(errorMap);
            }
        }

        Terminal terminal = convertToEntity(terminalDto, null);
        terminal.setPointOfSaleId(pointOfSaleId);

        return terminalRepository.save(terminal);
    }

    @Override
    public Terminal updateTerminal(Integer terminalId, TerminalDto terminalDto, BindingResult result) {
        Terminal found = terminalRepository.getByTerminalId(terminalId);

        if (found == null) {
            throw new RequestedResourceNotFoundException("Terminal sa ID-em: " + terminalId + " ne postoji");
        }

        Map<String,String> errorMap = mapValidationErrorService.validate(result);
        if (errorMap != null){
            throw new ValidationException(errorMap);
        } else {
            errorMap = checkTerminalUniqueConstraints(terminalDto.getAcquirerTid(), found);
            if (errorMap != null) {
                throw new ValidationException(errorMap);
            }
        }

        return terminalRepository.save(convertToEntity(terminalDto,found));
    }

    @Override
    public TerminalMetadata getTerminalMetadata() {
        TerminalMetadata terminalMetadata = new TerminalMetadata();

        List<PaymentMethod> paymentMethods = paymentMethodRepository.findAll();
        List<Status> statuses = statusRepository.findAll();
        List<TerminalType> terminalTypes = terminalTypeRepository.findAll();

        terminalMetadata.setPaymentMethods(paymentMethods);
        terminalMetadata.setStatuses(statuses);
        terminalMetadata.setTerminalTypes(terminalTypes);

        return terminalMetadata;
    }

    @Override
    public String getAcquirerTidById(Integer terminalId) {
        String acquirerTid = terminalRepository.getAcquirerTidById(terminalId);

        if (acquirerTid == null) {
            throw new RequestedResourceNotFoundException("Ne postoji terminal sa ID-em: " + terminalId);
        }

        return acquirerTid;
    }


    @Override
    public void deleteTerminal(Integer terminalId) {
        Terminal found = terminalRepository.getByTerminalId(terminalId);

        if (found == null) {
            throw new RequestedResourceNotFoundException("Terminal sa ID-em: " + terminalId + " ne postoji");
        }

        terminalRepository.delete(found);
    }

    @Override
    @Transactional
    public void generateCredentials(Integer terminalId, boolean regenerate) {
        if (regenerate) {
            terminalRepository.updateTerminalStatusToInactive(terminalId, statusRepository.getStatusByStatusName("Inactive"));
        }
        terminalRepository.generateCredentials(terminalId);
    }


    private Terminal convertToEntity(TerminalDto terminalDto, Terminal terminal){

        Status status = statusRepository.getStatusByStatusId(terminalDto.getStatusId());
        if (status == null) { throw new RequestedResourceNotFoundException("Ne postoji status sa ID-em " + terminalDto.getStatusId()); }

        PaymentMethod paymentMethod = paymentMethodRepository.getByPaymentMethodId(terminalDto.getPaymentMethodId());
        TerminalType terminalType = terminalTypeRepository.getByTerminalTypeId(terminalDto.getTerminalTypeId());

        if(terminal == null) {
            Terminal newTerminal = new Terminal();
            newTerminal.setAcquirerTid(terminalDto.getAcquirerTid());
            newTerminal.setActivationCode(null);
            newTerminal.setUserId(null);
            newTerminal.setTerminalAccount(terminalDto.getTerminalAccount());
            newTerminal.setPaymentMethod(paymentMethod != null ? paymentMethod.getPaymentMethodId() : null);
            newTerminal.setStatus(status);
            newTerminal.setSetupDate(terminalDto.getSetupDate());
            newTerminal.setTerminalType(terminalType.getTerminalTypeName());
            return newTerminal;
        } else {
            terminal.setAcquirerTid(terminalDto.getAcquirerTid());
            terminal.setActivationCode(terminalDto.getActivationCode());
            terminal.setUserId(terminalDto.getUserId());
            terminal.setTerminalAccount(terminalDto.getTerminalAccount());
            terminal.setPaymentMethod(paymentMethod != null ? paymentMethod.getPaymentMethodId() : null);
            terminal.setStatus(status);
            terminal.setSetupDate(terminalDto.getSetupDate());
            terminal.setTerminalType(terminalType.getTerminalTypeName());
            return terminal;
        }
    }

    private TerminalDto convertToDto(Terminal terminal) {
        TerminalDto terminalDto = new TerminalDto();
        TerminalType terminalType = terminalTypeRepository.getByTerminalTypeName(terminal.getTerminalType());

        terminalDto.setAcquirerTid(terminal.getAcquirerTid());
        terminalDto.setActivationCode(terminal.getActivationCode());
        terminalDto.setUserId(terminal.getUserId());
        terminalDto.setTerminalAccount(terminal.getTerminalAccount());
        terminalDto.setPaymentMethodId(terminal.getPaymentMethod());
        terminalDto.setStatusId(terminal.getStatus().getStatusId());
        terminalDto.setSetupDate(terminal.getSetupDate().toString());
        terminalDto.setTerminalTypeId(terminalType.getTerminalTypeId());

        return terminalDto;
    }

    private Map<String, String> checkTerminalUniqueConstraints(String acquirerTid, Terminal terminal){
        Map<String,String> errorMap;
        if (terminal != null && terminal.getAcquirerTid().equals(acquirerTid)){
            errorMap = null;
        } else {
            if (!acquirerTid.isEmpty() && terminalRepository.existsByAcquirerTid(acquirerTid)){
                errorMap = new HashMap<>();
                errorMap.put("acquirerTid", "Terminal sa unetim TID-om: " + acquirerTid + " već postoji u bazi");
                return errorMap;
            }
        }

        return null;
    }

    private Page<Terminal> searchByTerm(Integer pointOfSaleId, String term, Pageable page) {
        Page<Terminal> filtered;

        if (NumberUtils.isParsable(term)) {
            filtered = terminalRepository.findByPointOfSaleIdAndTerminalAccountContaining(pointOfSaleId, term, page);
            if(!filtered.getContent().isEmpty()) return filtered;
        }

        filtered = terminalRepository.findByPointOfSaleIdAndAcquirerTidContaining(pointOfSaleId, term, page);
        if (!filtered.getContent().isEmpty()) return filtered;

        return filtered;
    }

}
