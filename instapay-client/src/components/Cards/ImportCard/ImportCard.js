import React, { useRef, useState, useEffect } from 'react';
import { Card, Button, Icon, Dropdown, List } from 'semantic-ui-react';
import { toast } from 'react-toastify';
import axios from '../../../utils/API';
import CustomLoader from '../../CustomLoader/CustomLoader';
import AccordionGroup from '../AccordionGroup/AccordionGroup';
import './ImportCard.scss';

const ImportCard = () => {
  const fileInputRef = useRef();
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [errors, setErrors] = useState(null);
  const [importFinish, setImportFinish] = useState(false);
  const [countImport, setCountImport] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getPaymentMethods = async () => {
      try {
        const res = await axios.get('/user/paymentmethods');
        setPaymentMethods(res.data);
      } catch (error) {
        console.error(error.response);
      }
    };
    if (parsedData && !importFinish) {
      getPaymentMethods();
    }
  }, [parsedData]);

  const fileChange = (file) => {
    setLoading(true);
    setErrors(null);
    if (file.target.files && !!file.target.files.length) {
      setFile(file.target.files[0]);
    }
    setLoading(false);
  };

  const onParseData = async () => {
    let formData = new FormData();

    formData.append('fileName', file);

    try {
      setLoading(true);
      const res = await axios.post('/user/parsexlsx', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const validationArr = res.data.validationMapList;

      if (validationArr && validationArr.length > 0) {
        toast.error('Došlo je do greške pri parsiranju fajla');
        setErrors(res.data.validationMapList);
        setFile(null);
      } else {
        setParsedData(res.data.parsedMerchantSet);
        setErrors(null);
      }
    } catch (error) {
      setLoading(false);
      console.error(error.response);
    }
    setLoading(false);
  };

  const onDataImport = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `/user/bulkinsert?paymentMethod=${selectedPaymentMethod}`,
        parsedData,
      );
      setParsedData(res.data.parsedMerchantList);
      setCountImport(res.data.importCount);
      setImportFinish(true);
      if (
        res.data.importCount.merchantCount ||
        res.data.importCount.pointOfSaleCount ||
        res.data.importCount.terminalCount
      ) {
        toast.success('Uspešno ste importovali podatke!');
      } else {
        toast.warning('Nije došlo do importovanja novih podataka');
      }
    } catch (error) {
      setLoading(false);
      console.error(error.response);
    }
    setLoading(false);
  };

  const onBackButtonClick = () => {
    setParsedData(null);
    setImportFinish(false);
  };

  const handleDropdown = (e, { value }) => {
    setSelectedPaymentMethod(value);
  };

  return (
    <>
      <div className="importCardContainer">
        {loading ? (
          <CustomLoader />
        ) : (
          !parsedData && (
            <Card
              style={{
                minWidth: '500px',
                minHeight: 'unset',
                height: 'unset',
                width: 'unset',
                paddingTop: '15px',
              }}>
              <h3 className="importCardTitle">Import podataka putem .xls fajla</h3>
              <Card.Content>
                <div className="uploadFileContainer">
                  <Button
                    content="Izaberi fajl"
                    labelPosition="left"
                    icon="file"
                    onClick={() => fileInputRef.current.click()}
                  />
                  <p className="p-filename">{file ? file.name : 'Ime fajla'}</p>
                </div>
                <input
                  id="fileInputSelector"
                  accept=".xls"
                  ref={fileInputRef}
                  type="file"
                  hidden
                  onChange={fileChange}
                />
                <div className="parseButtonContainer">
                  <Button
                    disabled={!file}
                    color="green"
                    onClick={onParseData}
                    className="parseButton">
                    Učitaj
                  </Button>
                </div>
              </Card.Content>
            </Card>
          )
        )}
        {parsedData && !loading ? (
          <>
            <div className="accordionHeader">
              <div className="backIcon" onClick={onBackButtonClick}>
                <Icon name="angle left" />
                Nazad
              </div>
              <p className="headerFileName">{file && file.name}</p>
            </div>
            <AccordionGroup data={parsedData} />
            {!importFinish ? (
              <div className="accordionFooter">
                <div>
                  <p className="dropdownLabel">Način plaćanja za sve trgovce: </p>
                  <Dropdown
                    className="paymentMethodDropdown"
                    selection
                    fluid
                    options={
                      paymentMethods &&
                      paymentMethods.map(({ paymentMethodId, paymentMethodName }) => {
                        return {
                          value: paymentMethodId,
                          text: paymentMethodName,
                          key: paymentMethodId,
                        };
                      })
                    }
                    name="Nacin placanja"
                    value={selectedPaymentMethod}
                    onChange={handleDropdown}
                    placeholder="Odaberi nacin placanja"
                  />
                </div>
                <Button
                  disabled={!selectedPaymentMethod}
                  className="importButton"
                  color="instagram"
                  onClick={onDataImport}>
                  Importuj podatke
                </Button>
              </div>
            ) : (
              <div className="countContainer">
                {countImport && (
                  <>
                    <p className="countLabel">
                      Broj importovanih trgovaca: {countImport.merchantCount}
                    </p>
                    <p className="countLabel">
                      Broj importovanih prodajnih mesta: {countImport.pointOfSaleCount}
                    </p>
                    <p className="countLabel">
                      Broj importovanih terminala: {countImport.terminalCount}
                    </p>
                  </>
                )}
              </div>
            )}
          </>
        ) : (
          <div>
            <ui>
              {errors &&
                errors.map((errorMsg, key) => {
                  return (
                    <li className={'errorMsgItem'} key={key}>
                      {errorMsg}
                    </li>
                  );
                })}
            </ui>
          </div>
        )}
      </div>
    </>
  );
};

export default ImportCard;
