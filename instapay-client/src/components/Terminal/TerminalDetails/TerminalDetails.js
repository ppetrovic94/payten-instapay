import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { pdf } from '@react-pdf/renderer';
import { toast } from 'react-toastify';
import axios from '../../../utils/API';
import CustomLoader from '../../CustomLoader/CustomLoader';
import NotFound from '../../../security/NotFound/NotFound';
import CredentialsCard from '../../Cards/CredentialsCard/CredentialsCard';
import TerminalCredentialsPdf from './TerminalCredentialsPdf';
import './TerminalDetails.scss';
import { Breadcrumb } from 'semantic-ui-react';
import EmailCard from '../../Cards/EmailCard/EmailCard';

const TerminalDetails = () => {
  const [loading, setLoading] = useState(false);
  const [terminalDetails, setTerminalDetails] = useState(null);
  const [terminalUserId, setTerminalUserId] = useState(null);
  const [merchantUserId, setMerchantUserId] = useState(null);
  const [merchantEmail, setMerchantEmail] = useState('');
  const [sections, setSections] = useState(null);
  const [notFound, setNotFound] = useState(null);
  const [noCredentials, setNoCredentials] = useState(false);
  const { id } = useParams();

  const fetchCredentials = async (id) => {
    const merchantId = localStorage.getItem('merchantId');
    setLoading(true);
    try {
      const hasCredentialsOnMerchant = await axios.get(
        `/user/merchants/${merchantId}/hasCredentials`,
      );
      if (hasCredentialsOnMerchant.data) {
        const merchantCredentials = await axios.get(`/user/merchants/${merchantId}/credentials`);
        setMerchantUserId(merchantCredentials.data);
      } else {
        const userIdRes = await axios.get(`/user/terminals/${id}/userId`);
        setTerminalUserId(userIdRes.data);
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const fetchTerminalDetails = async (id) => {
    setLoading(true);
    try {
      const detailsRes = await axios.get(`/user/terminals/${id}/details`);
      setTerminalDetails(detailsRes.data);
    } catch (err) {
      setLoading(false);
      setNotFound(err.response);
    }
  };

  const fetchEmailByMerchantId = async () => {
    const merchantId = localStorage.getItem('merchantId');
    try {
      const res = await axios.get(`/user/merchants/${merchantId}/email`);
      setMerchantEmail(res.data);
    } catch (error) {
      console.error(error.response);
    }
  };

  useEffect(() => {
    if (!terminalUserId && !merchantUserId) {
      setNoCredentials(true);
    } else {
      setNoCredentials(false);
    }
  }, [terminalUserId, merchantUserId]);

  useEffect(() => {
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
            href: `/ips/merchant/${merchantId}/pos`,
          },
          {
            key: 'pointOfSaleName',
            content: posName.data,
            href: `/ips/pos/${posId}/terminals`,
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

    fetchTerminalDetails(id);
    fetchCredentials(id);
    fetchNavbarData();
    fetchEmailByMerchantId();
  }, [id]);

  const regenerateCredentials = async (terminalId) => {
    setLoading(true);
    try {
      await axios.get(`/user/credentials/generate?terminalId=${terminalId}`);
      toast.success('Uspešno ste generisali nove kredencijale');
    } catch (err) {
      toast.error('Došlo je do greške pri generisanju novih kredencijala');
      setLoading(false);
      console.error(err.response);
    }
  };

  const deleteCredentials = async (userId) => {
    try {
      await axios.delete(`/user/credentials/delete?userId=${userId}`);
      toast.success('Uspešno ste obrisali kredencijale');
      setNoCredentials(true);
      setTerminalUserId(null);
    } catch (error) {
      toast.error('Došlo je do greške pri brisanju kredencijala');
      console.error(error.response);
    }
  };

  const sendOnMail = async (receiverMail) => {
    var reader = new FileReader();
    pdf(
      <TerminalCredentialsPdf
        acquirerTid={terminalDetails.acquirerTid}
        userId={terminalUserId}
        activationCode={terminalDetails.activationCode}
      />,
    )
      .toBlob()
      .then((blob) => {
        reader.onload = function () {
          var base64result = reader.result.split(',')[1];
          const sendFile = async () => {
            setLoading(true);
            try {
              await axios.get(
                `/user/terminals/credentials/send?sendTo=${receiverMail}&terminalId=${terminalDetails.acquirerTid}&pdfFileBase64=${base64result}`,
              );
              toast.success(`Uspešno ste poslali kredencijale na ${receiverMail}`);
              setLoading(false);
            } catch (error) {
              toast.error(`Došlo je do greške pri slanju kredencijala na ${receiverMail}`);
              setLoading(false);
            }
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
            terminalUserId={terminalUserId}
            merchantUserId={merchantUserId}
            details={terminalDetails}
            regenerateCredentials={regenerateCredentials}
            fetchTerminalById={() => {
              fetchTerminalDetails(id);
              fetchCredentials(id);
            }}
            noCredentials={noCredentials}
            deleteCredentials={deleteCredentials}
          />
          {!noCredentials && (
            <EmailCard
              onSendHandler={sendOnMail}
              userId={terminalUserId}
              details={terminalDetails}
              merchantEmail={merchantEmail}
            />
          )}
        </div>
      </div>
    )
  );
};

export default TerminalDetails;
