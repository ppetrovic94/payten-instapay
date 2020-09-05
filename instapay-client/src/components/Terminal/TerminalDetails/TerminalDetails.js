import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { pdf } from '@react-pdf/renderer';
import axios from '../../../utils/API';
import CustomLoader from '../../CustomLoader/CustomLoader';
import NotFound from '../../../security/NotFound/NotFound';
import EmailCard from '../../EmailCard/EmailCard';
import CredentialsCard from '../../Cards/CredentialsCard/CredentialsCard';
import TerminalCredentialsPdf from './TerminalCredentialsPdf';
import './TerminalDetails.scss';
import { Breadcrumb } from 'semantic-ui-react';

const TerminalDetails = () => {
  const [loading, setLoading] = useState(false);
  const [terminalDetails, setTerminalDetails] = useState(null);
  const [sections, setSections] = useState(null);
  const [notFound, setNotFound] = useState(null);
  const { id } = useParams();

  const fetchTerminalById = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`/user/terminals/${id}/details`);
      setTerminalDetails(response.data);
      setLoading(false);
    } catch (err) {
      setNotFound(err.response);
      setLoading(false);
    }
  };

  const fetchNavbarData = async () => {
    const merchantId = localStorage.getItem('merchantId');
    const posId = localStorage.getItem('pointOfSaleId');

    try {
      const posName = await axios.get(`/user/pos/${posId}/name`);
      const merchantName = await axios.get(`/user/merchants/${merchantId}/name`);
      const terminalName = await axios.get(`/user/terminals/${id}/acquirerTid`);
      setSections([
        {
          key: 'merchantName',
          content: merchantName.data,
          href: `/merchant/${merchantId}/pos`,
        },
        {
          key: 'pointOfSaleName',
          content: posName.data,
          href: `/pos/${posId}/terminals`,
        },
        {
          key: 'terminalName',
          content: terminalName.data,
        },
        { key: 'credentials', content: 'Kredencijali' },
      ]);
    } catch (err) {
      console.error(err.response);
    }
  };

  useEffect(() => {
    fetchTerminalById(id);
    fetchNavbarData();
  }, [id]);

  const regenerateCredentials = async (terminalId) => {
    setLoading(true);
    try {
      await axios.get(`/user/terminals/${terminalId}/generateCredentials?regenerate=true`);
    } catch (err) {
      setLoading(false);
      console.error(err.response);
    }
  };

  const sendOnMail = async (receiverMail) => {
    var reader = new FileReader();
    pdf(
      <TerminalCredentialsPdf
        acquirerTid={terminalDetails.acquirerTid}
        userId={terminalDetails.userId}
        activationCode={terminalDetails.activationCode}
      />,
    )
      .toBlob()
      .then((blob) => {
        reader.onload = function () {
          var base64result = reader.result.split(',')[1];
          const sendFile = async () => {
            await axios.get(
              `/user/terminals/credentials/send?sendTo=${receiverMail}&terminalId=${terminalDetails.acquirerTid}&pdfFileBase64=${base64result}`,
            );
          };
          sendFile();
        };
        reader.readAsDataURL(blob);
      });
  };

  return loading ? (
    <CustomLoader />
  ) : notFound ? (
    <NotFound message={notFound.data} />
  ) : (
    terminalDetails &&
    sections && (
      <div className="terminalDetailsContainer">
        <div className="terminalDetailsTitle">
          <Breadcrumb
            className="detailsNavbar"
            icon="right angle"
            sections={sections}
            size="large"
          />
        </div>
        <div className="terminalDetailsCards">
          <CredentialsCard
            details={terminalDetails}
            regenerateCredentials={regenerateCredentials}
            fetchTerminalById={fetchTerminalById}
          />
          <EmailCard onSendHandler={sendOnMail} details={terminalDetails} />
        </div>
      </div>
    )
  );
};

export default TerminalDetails;
