import React, { useState } from 'react';
import { Button, Form, Image, Input } from 'semantic-ui-react';
import { toast } from 'react-toastify';
import axios from '../../../utils/API';
import CustomLoader from '../../CustomLoader/CustomLoader';
import './MerchantCredentials.scss';

const MerchantCredentials = ({ userId, merchantName, merchantId, merchantRerender }) => {
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [validationErr, setValidationErr] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(userId ? userId : '');
  const nonSpecialCharaterRegex = /^[A-Za-z0-9 ]+$/;

  const onSaveOrUpdateUserId = async () => {
    let doSave = window.confirm(
      `Da li ste sigurni da želite da sačuvate USER ID: ${currentUserId} na nivou trgovca ${merchantName}`,
    );
    if (doSave) {
      try {
        if (userId) {
          await axios.put(`/user/merchants/${merchantId}/updateCredentials`, {
            userId: currentUserId,
          });
          toast.success('Uspešno ste ažurirali kredencijale');
        } else {
          await axios.post(`/user/merchants/${merchantId}/saveCredentials`, {
            userId: currentUserId,
          });
          toast.success('Uspešno ste sačuvali unete kredencijale');
        }
      } catch (error) {
        toast.error('Došlo je do greške pri upisu kredencijala');
        console.error(error.response);
      }
      merchantRerender();
    }
  };

  const onGenerateUserId = async (merchantId) => {
    let doSave = window.confirm(
      `Da li ste sigurni da želite da ${
        userId ? 'regenerišete' : 'generišete'
      } kredencijale na nivou trgovca ${merchantName}`,
    );
    if (doSave) {
      try {
        await axios.get(`/user/credentials/generate?merchantId=${merchantId}`);
        toast.success('Uspešno ste generisali nove kredencijale');
      } catch (err) {
        toast.error('Došlo je do greške pri generisanju novih kredencijala');
        console.error(err.response);
      }
      merchantRerender();
    }
  };

  const onChangeInput = (e, { value }) => {
    setCurrentUserId(value);
    if (!nonSpecialCharaterRegex.test(value) && value.length !== 0) {
      setValidationErr('USER ID ne sme da sadrži specijalne karaktere');
      setDisabled(true);
    } else if (value.length !== 0 && value.length < 20) {
      setValidationErr('USER ID mora da sadrži najmanje 20 karaktera');
      setDisabled(true);
    } else {
      setValidationErr(null);
      if (value !== userId && value.length !== 0) {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    }
  };

  return loading ? (
    <CustomLoader />
  ) : (
    <div className="merchantCredentialsCard">
      <h3 className="merchantCredentialsHeader">{`Kredencijali za ${merchantName}`}</h3>

      <div className="merchantCredentialsContainer">
        {userId && (
          <Image
            src={`http://localhost:8080/ips/api/user/terminals/qrcode/${userId}`}
            style={{
              width: '200px',
            }}
            wrapped
          />
        )}
        <div
          className={
            userId ? 'merchantUserIdUpdateInputContainer' : 'merchantUserIdAddInputContainer'
          }>
          <h3>USER ID:</h3>
          <Form>
            <Form.Field width={15}>
              <Input
                icon="key"
                iconPosition="left"
                onChange={onChangeInput}
                size="big"
                defaultValue={currentUserId}
              />
              {validationErr && <p style={{ color: 'red' }}>{validationErr}</p>}
            </Form.Field>
          </Form>
        </div>
      </div>
      <div className="merchantSaveOrGenerate">
        <Button disabled={disabled} onClick={onSaveOrUpdateUserId} color="green">
          {userId ? 'Izmeni' : 'Sačuvaj'}
        </Button>
        <Button onClick={() => onGenerateUserId(merchantId)} color="instagram">
          {userId ? 'Generiši ponovo i sačuvaj' : 'Generiši i sačuvaj'}
        </Button>
      </div>
    </div>
  );
};

export default MerchantCredentials;
