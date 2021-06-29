package com.payten.instapay.services.impl;

import com.payten.instapay.dto.Merchant.DataImport.*;
import com.payten.instapay.model.*;
import com.payten.instapay.repositories.*;
import com.payten.instapay.services.DataImportService;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.Date;
import java.util.*;

@Service
public class DataImportServiceImpl implements DataImportService {

    private final MerchantRepository merchantRepository;
    private final PointOfSaleRepository pointOfSaleRepository;
    private final TerminalRepository terminalRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final AcqUserRepository acqUserRepository;
    private final StatusRepository statusRepository;
    private final CityRepository cityRepository;

    public DataImportServiceImpl(MerchantRepository merchantRepository, PointOfSaleRepository pointOfSaleRepository, TerminalRepository terminalRepository, PaymentMethodRepository paymentMethodRepository, AcqUserRepository acqUserRepository, StatusRepository statusRepository, CityRepository cityRepository) {
        this.merchantRepository = merchantRepository;
        this.pointOfSaleRepository = pointOfSaleRepository;
        this.terminalRepository = terminalRepository;
        this.paymentMethodRepository = paymentMethodRepository;
        this.acqUserRepository = acqUserRepository;
        this.statusRepository = statusRepository;
        this.cityRepository = cityRepository;
    }

    @Override
    public ValidatedMerchantSet parseDataFromXlsx(MultipartFile xlsxFile) throws IOException, InvalidFormatException {

        ValidatedMerchantSet validatedMerchantSet = new ValidatedMerchantSet();
        Set<ParsedMerchant> parsedMerchantSet = new HashSet<>();
        Map<String, ParsedMerchant> parsedMerchantMap = new LinkedHashMap<String, ParsedMerchant>();
        Workbook workbook = WorkbookFactory.create(xlsxFile.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);

        Iterator<Row> rowIterator = sheet.rowIterator();

        Status activeStatus = statusRepository.getStatusByStatusName("Active");
        Date setupDate = new Date(System.currentTimeMillis());

        while (rowIterator.hasNext()) {
            Row row = rowIterator.next();
            if (row.getRowNum() == 0) continue;

            String ipsType = row.getCell(19).getStringCellValue();
            if (ipsType.isEmpty()) {
                break;
            }

            if (ipsType.equals("da")){
                String pib = row.getCell(2).getStringCellValue();
                if (!pib.isEmpty()) {

                    ParsedMerchant parsedMerchant = null;

                    String mName = row.getCell(4).getStringCellValue();
                    if (mName.isEmpty()) validatedMerchantSet.getValidationMapList().add("Polja kolone 'Naziv trgovca' ne smeju biti prazna");

                    String mAddress = row.getCell(5).getStringCellValue();
                    if (mAddress.isEmpty()) validatedMerchantSet.getValidationMapList().add("Polja kolone 'Adresa sedišta' ne smeju biti prazna");

                    int mMcc = (int) row.getCell(28).getNumericCellValue();
                    if (String.valueOf(mMcc).length() > 4) validatedMerchantSet.getValidationMapList().add("Polja kolone 'IPS MCC' moraju imati vrednost do 4 karaktera najviše");

                    String mPaymentCode = String.valueOf((int) row.getCell(29).getNumericCellValue());
                    if (mPaymentCode.length() != 3) validatedMerchantSet.getValidationMapList().add("Polja kolone 'IPS Šifra plaćanja' moraju imati vrednost tačno 3 karaktera");

                    if (!parsedMerchantMap.containsKey(pib)) {
                        parsedMerchant = new ParsedMerchant();

                        Merchant existingMerchant = merchantRepository.getByTaxIdentityNumber(pib);

                        if (existingMerchant == null) {
                            parsedMerchant.getMerchant().setTaxIdentityNumber(pib);
                            parsedMerchant.getMerchant().setMerchantName(mName);
                            parsedMerchant.getMerchant().setMerchantAddress(mAddress);
                            parsedMerchant.getMerchant().setMerchantAccount(row.getCell(3).getStringCellValue());
                            parsedMerchant.getMerchant().setCity(getOrInsertCity(row.getCell(6).getStringCellValue(), null));
                            parsedMerchant.getMerchant().setMcc(mMcc);
                            parsedMerchant.getMerchant().setPaymentCode(mPaymentCode);
                            parsedMerchant.getMerchant().setStatus(activeStatus);
                            parsedMerchant.getMerchant().setSetupDate(setupDate);
                            parsedMerchant.getImportStatus().setImported(false);
                            parsedMerchant.getImportStatus().setMessage("Moguć upis!");
                            parsedMerchant.getImportStatus().setMessageCode(1);
                        } else {
                            parsedMerchant.setMerchant(existingMerchant);
                            parsedMerchant.getImportStatus().setImported(true);
                            parsedMerchant.getImportStatus().setMessage("Zapis već postoji!");
                            parsedMerchant.getImportStatus().setMessageCode(2);
                        }

                        parsedMerchantMap.put(pib, parsedMerchant);

                    } else {
                        parsedMerchant = parsedMerchantMap.get(pib);
                    }


                    String pointOfSaleName = row.getCell(8).getStringCellValue();
                    if (pointOfSaleName.isEmpty()) validatedMerchantSet.getValidationMapList().add("Polja kolone 'Naziv lokacije' ne smeju biti prazna");

                    String pAddress = row.getCell(9).getStringCellValue();
                    if (pAddress.isEmpty()) validatedMerchantSet.getValidationMapList().add("Polja kolone 'Adresa lokacije' ne smeju biti prazna");

                    ParsedPointOfSale parsedPointOfSale = null;
                    if (!parsedMerchant.getPointOfSaleMap().containsKey(pointOfSaleName)) {
                        parsedPointOfSale = new ParsedPointOfSale();
                        if (parsedMerchant.getImportStatus().isImported()) {
                            PointOfSale pointOfSale = pointOfSaleRepository.getByPointOfSaleNameAndMerchantId(pointOfSaleName, parsedMerchant.getMerchant().getMerchantId());
                            if (pointOfSale == null) {
                                parsedPointOfSale.getPointOfSale().setPointOfSaleName(pointOfSaleName);
                                parsedPointOfSale.getPointOfSale().setPointOfSaleAddress(pAddress);
                                parsedPointOfSale.getPointOfSale().setCity(getOrInsertCity(row.getCell(10).getStringCellValue(), String.valueOf((int) row.getCell(11).getNumericCellValue())));
                                parsedPointOfSale.getPointOfSale().setStatus(activeStatus);
                                parsedPointOfSale.getPointOfSale().setSetupDate(setupDate);
                                parsedPointOfSale.getImportStatus().setImported(false);
                                parsedPointOfSale.getImportStatus().setMessage("Moguć upis!");
                                parsedPointOfSale.getImportStatus().setMessageCode(1);
                            } else {
                                parsedPointOfSale.setPointOfSale(pointOfSale);
                                parsedPointOfSale.getImportStatus().setImported(true);
                                parsedPointOfSale.getImportStatus().setMessage("Zapis već postoji!");
                                parsedPointOfSale.getImportStatus().setMessageCode(2);
                            }
                        } else {
                            parsedPointOfSale.getPointOfSale().setPointOfSaleName(pointOfSaleName);
                            parsedPointOfSale.getPointOfSale().setPointOfSaleAddress(pAddress);
                            parsedPointOfSale.getPointOfSale().setStatus(activeStatus);
                            parsedPointOfSale.getPointOfSale().setSetupDate(setupDate);
                            parsedPointOfSale.getPointOfSale().setCity(getOrInsertCity(row.getCell(10).getStringCellValue(), String.valueOf((int) row.getCell(11).getNumericCellValue())));
                            parsedPointOfSale.getImportStatus().setImported(false);
                            parsedPointOfSale.getImportStatus().setMessage("Moguć upis!");
                            parsedPointOfSale.getImportStatus().setMessageCode(1);
                        }

                        parsedMerchant.getPointOfSaleMap().put(pointOfSaleName, parsedPointOfSale);

                    } else {
                        parsedPointOfSale = parsedMerchant.getPointOfSaleMap().get(pointOfSaleName);
                    }


                    String acquirerTid = row.getCell(26).getStringCellValue();
                    if (acquirerTid.length() != 8) validatedMerchantSet.getValidationMapList().add("Polja kolone 'IPS TID' moraju imati vrednost dužine 8 karaktera");

                    ParsedTerminal parsedTerminal = null;
                    if (!parsedPointOfSale.getTerminalMap().containsKey(acquirerTid)) {
                        parsedTerminal = new ParsedTerminal();
                        Terminal terminal = terminalRepository.getByAcquirerTid(acquirerTid);
                        if (terminal == null) {
                            parsedTerminal.getTerminal().setAcquirerTid(acquirerTid);
                            parsedTerminal.getTerminal().setTerminalType("ANDROID");
                            parsedTerminal.getTerminal().setStatus(activeStatus);
                            parsedTerminal.getTerminal().setSetupDate(setupDate);
                            parsedTerminal.getImportStatus().setImported(false);
                            parsedTerminal.getImportStatus().setMessage("Moguć upis");
                            parsedTerminal.getImportStatus().setMessageCode(1);
                        } else {
                            parsedTerminal.setTerminal(terminal);
                            parsedTerminal.getImportStatus().setImported(true);
                            parsedTerminal.getImportStatus().setMessage("Zapis već postoji!");
                            parsedTerminal.getImportStatus().setMessageCode(2);
                        }

                        parsedPointOfSale.getTerminalMap().put(acquirerTid, parsedTerminal);

                    } else {
                        parsedTerminal = parsedPointOfSale.getTerminalMap().get(acquirerTid);
                    }

                    parsedMerchantSet.add(parsedMerchant);

                } else {
                    validatedMerchantSet.getValidationMapList().add("Polja kolone 'Matični broj' ne smeju biti prazna.");
                }
            }

        }

        validatedMerchantSet.setParsedMerchantSet(parsedMerchantSet);

        return validatedMerchantSet;
    }

    @Override
    public ImportResult bulkImport(Set<ParsedMerchant> parsedMerchants, String paymentMethodId) {
        ImportResult result = new ImportResult();
        Merchant insertedMerchant = null;
        PointOfSale insertedPointOfSale = null;
        int importedMerchants = 0;
        int importedPointOfSales = 0;
        int importedTerminals = 0;
        PaymentMethod paymentMethod = null;

        if (!paymentMethodId.isEmpty()) {
            paymentMethod = paymentMethodRepository.getByPaymentMethodId(paymentMethodId);
        }

        for (ParsedMerchant parsedMerchant: parsedMerchants) {
            if (!parsedMerchant.getImportStatus().isImported()) {
                if (paymentMethod != null)
                    parsedMerchant.getMerchant().setPaymentMethod(paymentMethod);

                insertedMerchant = merchantRepository.save(parsedMerchant.getMerchant());


                parsedMerchant.getImportStatus().setImported(true);
                parsedMerchant.getImportStatus().setMessage("Importovan!");
                parsedMerchant.getImportStatus().setMessageCode(3);
                importedMerchants++;
                result.getImportCount().setMerchantCount(importedMerchants);
            }

            for (ParsedPointOfSale parsedPointOfSale: parsedMerchant.getPointOfSaleMap().values()) {
                if (!parsedPointOfSale.getImportStatus().isImported()) {

                    if (parsedMerchant.getMerchant().getMerchantId() == null && insertedMerchant != null) {
                        parsedPointOfSale.getPointOfSale().setMerchantId(insertedMerchant.getMerchantId());
                    } else {
                        parsedPointOfSale.getPointOfSale().setMerchantId(parsedMerchant.getMerchant().getMerchantId());
                    }

                    insertedPointOfSale = pointOfSaleRepository.save(parsedPointOfSale.getPointOfSale());

                    parsedPointOfSale.getImportStatus().setImported(true);
                    parsedPointOfSale.getImportStatus().setMessage("Importovan!");
                    parsedPointOfSale.getImportStatus().setMessageCode(3);
                    importedPointOfSales++;
                    result.getImportCount().setPointOfSaleCount(importedPointOfSales);
                }

                for (ParsedTerminal parsedTerminal: parsedPointOfSale.getTerminalMap().values()) {
                    if (!parsedTerminal.getImportStatus().isImported()) {
                        if (parsedPointOfSale.getPointOfSale().getPointOfSaleId() == null && insertedPointOfSale != null) {
                            parsedTerminal.getTerminal().setPointOfSaleId(insertedPointOfSale.getPointOfSaleId());
                        } else {
                            parsedTerminal.getTerminal().setPointOfSaleId(parsedPointOfSale.getPointOfSale().getPointOfSaleId());
                        }

                        terminalRepository.save(parsedTerminal.getTerminal());

                        parsedTerminal.getImportStatus().setImported(true);
                        parsedTerminal.getImportStatus().setMessage("Importovan");
                        parsedTerminal.getImportStatus().setMessageCode(3);
                        importedTerminals++;
                        result.getImportCount().setTerminalCount(importedTerminals);
                    }
                }


            }

        }

        result.setParsedMerchantList(parsedMerchants);

        return result;
    }

    public City getOrInsertCity(String cityName, String cityCode) {
        City city;
        if (cityCode == null) {
            city = cityRepository.findByCityName(cityName.toLowerCase());
        } else {
            city = cityRepository.getByCityCode(cityCode);
        }

        if (city == null) {
            city = cityRepository.getByCityCode("11000");
        }

        return city;
    }

    @Override
    public List<PaymentMethod> getPaymentMethods() {
        return paymentMethodRepository.findAll();
    }


}
