import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Form } from 'semantic-ui-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import TerminalCredentialsPdf from '../../Terminal/TerminalDetails/TerminalCredentialsPdf';
import './EmailCard.scss';
import CustomModal from '../../CustomModal/CustomModal';

const EmailCard = ({ onSendHandler, details, merchantEmail, userId }) => {
  const [email, setEmail] = useState(merchantEmail);
  const [disabled, setDisabled] = useState(merchantEmail ? false : true);
  const [validationErr, setValidationErr] = useState(null);

  function validateEmail(email) {
    // eslint-disable-next-line no-useless-escape
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
    if (validateEmail(e.target.value)) {
      setDisabled(false);
      setValidationErr(null);
    } else {
      setDisabled(true);
      setValidationErr('Niste uneli odgovarajući format za email');
    }
  };

  const sendEmailModalContent = () => (
    <h3>{`Da li ste sigurni da želite da pošaljete kredencijale (PDF) na adresi ${email} ?`}</h3>
  );

  return (
    <Card
      style={{
        width: '400px',
        height: '170px',
        marginTop: 0,
      }}>
      <Card.Content className="cardContent">
        <Form>
          <Form.Field>
            <label>Pošalji na: </label>
            <input
              type="email"
              placeholder={'Unesite email adresu...'}
              name={merchantEmail}
              defaultValue={email ? email : ''}
              onChange={onChangeEmail}
            />
            {validationErr && <p style={{ color: 'red' }}>{validationErr}</p>}
          </Form.Field>
        </Form>
        <div>
          <CustomModal
            content={sendEmailModalContent}
            yesNoButtons
            onAcceptHandler={() => {
              onSendHandler(email);
            }}
            triggerElement={() => (
              <Button disabled={disabled} className="sendButton" color="teal">
                Posalji PDF
              </Button>
            )}
          />
          <PDFDownloadLink
            document={
              <TerminalCredentialsPdf
                acquirerTid={details.acquirerTid}
                activationCode={details.activationCode}
                userId={userId}
              />
            }
            fileName={`kredencijali-${details.acquirerTid}`}>
            {({ loading }) =>
              loading ? 'Loading document...' : <Button color="instagram">Skini PDF</Button>
            }
          </PDFDownloadLink>
        </div>
      </Card.Content>
    </Card>
  );
};

EmailCard.propTypes = {
  userId: PropTypes.string,
  onSendHandler: PropTypes.func,
  details: PropTypes.object,
  merchantEmail: PropTypes.string,
};

export default EmailCard;
