import React, { useState } from 'react';
import { Card, Button, Form } from 'semantic-ui-react';
import './EmailCard.scss';
import TerminalCredentialsPdf from '../Terminal/TerminalDetails/TerminalCredentialsPdf';
import { PDFDownloadLink } from '@react-pdf/renderer';

const EmailCard = ({ onSendHandler, details }) => {
  const [merchantEmail, setMerchantEmail] = useState(null);

  const onChangeEmail = (e) => {
    console.log(merchantEmail);
    setMerchantEmail(e.target.value);
  };

  const onEmailSend = () => {
    onSendHandler(merchantEmail);
  };

  return (
    <Card
      style={{
        width: '400px',
        height: '170px',
        marginTop: 0,
      }}>
      <Card.Content className="cardContent">
        <Form>
          {/* <Form.Field> */}
          <label>Pošalji na: </label>
          <input
            type="email"
            placeholder={'Unesite email adresu...'}
            name={merchantEmail}
            defaultValue={merchantEmail ? merchantEmail : ''}
            onChange={onChangeEmail}
          />
          <p>Nije dobar email</p>
          {/* </Form.Field> */}
        </Form>
        <div>
          <Button onClick={onEmailSend} className="sendButton" color="teal">
            Posalji PDF
          </Button>
          <PDFDownloadLink
            document={
              <TerminalCredentialsPdf
                acquirerTid={details.acquirerTid}
                activationCode={details.activationCode}
                userId={details.userId}
              />
            }
            fileName={`kredencijali-${details.acquirerTid}`}>
            {({ blob, url, loading, error }) =>
              loading ? 'Loading document...' : <Button color="instagram">Skini PDF</Button>
            }
          </PDFDownloadLink>
        </div>
      </Card.Content>
    </Card>
  );
};

export default EmailCard;
