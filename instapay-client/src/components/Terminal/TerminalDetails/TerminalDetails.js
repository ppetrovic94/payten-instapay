import React, { useState, useEffect } from 'react';
import { Image, Card } from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
import axios from '../../../utils/API';
import CustomLoader from '../../CustomLoader/CustomLoader';
import './TerminalDetails.scss';

const TerminalDetails = () => {
  const [loading, setLoading] = useState(false);
  const [terminalDetails, setTerminalDetails] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);

    const fetchTerminalById = async (id) => {
      try {
        const response = await axios.get(`/user/terminals/${id}`);
        setTerminalDetails(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err.response);
      }
    };

    fetchTerminalById(id);
    setLoading(false);
  }, [id]);

  console.log('render', terminalDetails && terminalDetails.userId);

  return loading ? (
    <CustomLoader />
  ) : (
    terminalDetails && (
      <div className="terminalDetailsContainer">
        <div className="terminalDetailsTitle">
          <h2>Terminal</h2>
        </div>
        <Card
          style={{
            width: '400px',
          }}
          color="red">
          <h3 className="terminalDetailsUserId">User ID (scan)</h3>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Image
              src={`http://localhost:8080/api/user/terminals/qrcode/${terminalDetails.userId}`}
              style={{
                width: '200px',
              }}
              wrapped
            />
          </div>
          <Card.Content>
            <div className="terminalDetailsCardContent">
              <h3>TID:</h3>
              <p className="terminalDetailsData">{terminalDetails.acquirerTid}</p>
            </div>
            <div className="terminalDetailsCardContent">
              <h3>Status:</h3>
              <p className="terminalDetailsData">{terminalDetails.statusId}</p>
            </div>
            <div className="terminalDetailsCardContent">
              <h3>Način plaćanja:</h3>
              <p className="terminalDetailsData">
                {terminalDetails.paymentMethod === 'P'
                  ? 'Present'
                  : terminalDetails.paymentMethod === 'S'
                  ? 'Scan'
                  : terminalDetails.paymentMethod}
              </p>
            </div>
            <div className="terminalDetailsCardContent">
              <h3>Tip terminala:</h3>
              <p className="terminalDetailsData">{terminalDetails.terminalTypeId}</p>
            </div>
            <div className="terminalDetailsCardContent">
              <h3>Aktivacioni kod:</h3>
              <p className="terminalDetailsData">{terminalDetails.activationCode}</p>
            </div>
            <div className="terminalDetailsCardContent">
              <h3>Datum:</h3>
              <p className="terminalDetailsData">{terminalDetails.setupDate}</p>
            </div>
            <div className="terminalDetailsCardContent">
              <h3>Račun:</h3>
              <p className="terminalDetailsData">{terminalDetails.terminalAccount}</p>
            </div>
          </Card.Content>
        </Card>
      </div>
    )
  );
};

export default TerminalDetails;
