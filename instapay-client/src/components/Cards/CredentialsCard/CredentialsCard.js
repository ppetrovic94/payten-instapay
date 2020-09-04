import React from 'react';
import { Card, Button, Image } from 'semantic-ui-react';
import CustomModal from '../../CustomModal/CustomModal';
import './CredentialsCard.scss';

const CredentialsCard = ({ details, regenerateCredentials, fetchTerminalById }) => {
  const credentialsModalContent = () => (
    <>
      <h3>{`Generisanje novih kredencjiala će vratiti terminal ${details.acquirerTid} u 'Inactive' status nakon čega će terminal zahtevati ponovnu aktivaciju sa novim kredencijalima.
        `}</h3>
      <h3>{`Da li ste sigurni da želite da generišete nove kredencijale za ${details.acquirerTid} ?`}</h3>
    </>
  );

  return (
    <Card
      style={{
        width: '400px',
        marginRight: '20px',
      }}
      color="red">
      <h3 className="terminalDetailsUserId">User ID (scan)</h3>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Image
          src={`http://localhost:8080/api/user/terminals/qrcode/${details.userId}`}
          style={{
            width: '200px',
          }}
          wrapped
        />
      </div>
      <Card.Content>
        <div className="terminalDetailsCardContent">
          <h3>TID:</h3>
          <p className="terminalDetailsData">{details.acquirerTid}</p>
        </div>
        <div className="terminalDetailsCardContent">
          <h3>Status:</h3>
          <p className="terminalDetailsData">{details.status.statusName}</p>
        </div>
        <div className="terminalDetailsCardContent">
          <h3>Aktivacioni kod:</h3>
          <p className="terminalDetailsData">{details.activationCode}</p>
        </div>
        <div className="terminalRegenerate">
          <CustomModal
            content={credentialsModalContent}
            yesNoButtons
            onAcceptHandler={async () => {
              await regenerateCredentials(details.terminalId);
              await fetchTerminalById(details.terminalId);
            }}
            triggerElement={() => <Button color="teal">Generiši nove kredencijale</Button>}
          />
        </div>
      </Card.Content>
    </Card>
  );
};

export default CredentialsCard;
