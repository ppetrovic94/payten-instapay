package com.payten.instapay.services.impl;

import com.payten.instapay.exceptions.handlers.RequestedResourceNotFoundException;
import com.payten.instapay.repositories.AcqUserRepository;
import com.payten.instapay.repositories.MerchantRepository;
import com.payten.instapay.repositories.PointOfSaleRepository;
import com.payten.instapay.repositories.TerminalRepository;
import com.payten.instapay.services.CredentialsService;
import org.springframework.stereotype.Service;

@Service
public class CredentialsServiceImpl implements CredentialsService {

    private final AcqUserRepository acqUserRepository;
    private final MerchantRepository merchantRepository;
    private final PointOfSaleRepository pointOfSaleRepository;
    private final TerminalRepository terminalRepository;

    public CredentialsServiceImpl(AcqUserRepository acqUserRepository, MerchantRepository merchantRepository, PointOfSaleRepository pointOfSaleRepository, TerminalRepository terminalRepository) {
        this.acqUserRepository = acqUserRepository;
        this.merchantRepository = merchantRepository;
        this.pointOfSaleRepository = pointOfSaleRepository;
        this.terminalRepository = terminalRepository;
    }

    @Override
    public void generateCredentials(Integer merchantId, Integer posId, Integer terminalId) {

        if (merchantId != null) {
            if (!merchantRepository.existsByMerchantId(merchantId)) throw new RequestedResourceNotFoundException("Ne postoji trgovac sa ID-em: " + merchantId);
            acqUserRepository.generateCredentials3(merchantId, null, null);
        } else if (posId != null) {
            if (!pointOfSaleRepository.existsById(posId)) throw new RequestedResourceNotFoundException("Ne postoji prodajno mesto sa ID-em: " + posId);
            acqUserRepository.generateCredentials3(null, posId, null);
        } else if (terminalId != null) {
            if (!terminalRepository.existsById(terminalId)) throw new RequestedResourceNotFoundException("Ne postoji terminal sa ID-em: " + terminalId);
            acqUserRepository.generateCredentials3(null, null, terminalId);
        }

    }
}
