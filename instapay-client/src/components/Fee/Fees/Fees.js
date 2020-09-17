import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../../utils/API';
import CustomTable from '../../CustomTable/CustomTable';
import { feeTableHeader, formatFeeData, feeActionConfig } from '../utils/feeTable';
import './Fees.scss';
import NotFound from '../../../security/NotFound/NotFound';
import CustomLoader from '../../CustomLoader/CustomLoader';

const Fees = () => {
  const [loading, setLoading] = useState(false);
  const [fees, setFees] = useState(null);
  const [sections, setSections] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState(null);
  const [notFound, setNotFound] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchFeesByMerchantId(id);
    } else {
      fetchFees();
    }
    return () => {
      setFees(null);
      setErrors(null);
    };
  }, [id]);

  const fetchFeesByMerchantId = async (merchantId) => {
    setLoading(true);
    try {
      const response = await axios.get(`/user/merchants/${merchantId}/fees`);
      setFees(response.data.content);
      setTotalPages(response.data.totalPages);
      if (response.data.content[0]) {
        setSections([
          {
            key: 'merchantName',
            content: response.data.content[0].merchant.merchantName,
            href: `/ips/merchant/${merchantId}/pos`,
          },
          {
            key: 'fees',
            content: 'Provizije',
          },
        ]);
      } else {
        const res = await axios.get(`/user/merchants/${merchantId}/name`);

        setSections([
          {
            key: 'merchantName',
            content: res.data,
            href: `/ips/merchant/${merchantId}/pos`,
          },
          {
            key: 'fees',
            content: 'Provizije',
          },
        ]);
      }
      setLoading(false);
    } catch (err) {
      setNotFound(err.response);
      setLoading(false);
    }
  };
  const fetchFees = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/user/fees');
      setFees(response.data.content);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (err) {
      setErrors(err.response);
      setLoading(false);
    }
  };

  const onDeleteFee = async (feeRuleId) => {
    setLoading(true);
    try {
      await axios.delete(`/user/fees/${feeRuleId}/delete`);
      toast.success('Uspešno ste obrisali proviziju');
      setLoading(false);
      if (id) {
        fetchFeesByMerchantId(id);
      } else {
        fetchFees();
      }
    } catch (error) {
      toast.error('Došlo je do greške pri brisanju provizije');
      console.error(error.response);
      setLoading(false);
    }
  };

  const onPageChange = async (e, { activePage }) => {
    setActivePage(activePage);
    let response = null;
    if (searchTerm) {
      response = id
        ? await axios.get(
            `/user/merchants/${id}/fees?searchTerm=${searchTerm}&pagenum=${activePage - 1}`,
          )
        : await axios.get(`/user/fees?searchTerm=${searchTerm}&pagenum=${activePage - 1}`);
    } else {
      response = id
        ? await axios.get(`/user/merchants/${id}/fees?pagenum=${activePage - 1}`)
        : await axios.get(`/user/fees?pagenum=${activePage - 1}`);
    }

    setFees(response.data.content);
  };

  const onChangeSearchTerm = async (term) => {
    let filtered;
    if (id) {
      filtered = await axios.get(`/user/merchants/${id}/fees?searchTerm=${term}`);
    } else {
      filtered = await axios.get(`/user/fees?searchTerm=${term}`);
    }
    setSearchTerm(term);
    setTotalPages(filtered.data.totalPages);
    setFees(filtered.data.content);
  };

  const onColumnSort = async (column, direction) => {
    let sortedFees;
    switch (column) {
      case 'merchant':
        sortedFees = id
          ? await axios.get(
              `/user/merchants/${id}/fees?sortBy=merchant.merchantName&searchTerm=${
                searchTerm ? searchTerm : ''
              }&direction=${direction}`,
            )
          : await axios.get(
              `/user/fees?sortBy=merchant.merchantName&searchTerm=${
                searchTerm ? searchTerm : ''
              }&direction=${direction}`,
            );
        setFees(sortedFees.data.content);
        break;
      case 'feeReceiver':
        sortedFees = id
          ? await axios.get(
              `/user/merchants/${id}/fees?sortBy=feeReceiver.receiverName&searchTerm=${
                searchTerm ? searchTerm : ''
              }&direction=${direction}`,
            )
          : await axios.get(
              `/user/fees?sortBy=feeReceiver.receiverName&searchTerm=${
                searchTerm ? searchTerm : ''
              }&direction=${direction}`,
            );
        setFees(sortedFees.data.content);
        break;
      case 'feeType':
        sortedFees = id
          ? await axios.get(
              `/user/merchants/${id}/fees?sortBy=feeType.typeName&searchTerm=${
                searchTerm ? searchTerm : ''
              }&direction=${direction}`,
            )
          : await axios.get(
              `/user/fees?sortBy=feeType.typeName&searchTerm=${
                searchTerm ? searchTerm : ''
              }&direction=${direction}`,
            );
        setFees(sortedFees.data.content);
        break;
      case 'productType':
        sortedFees = id
          ? await axios.get(
              `/user/merchants/${id}/fees?sortBy=productType.typeName&searchTerm=${
                searchTerm ? searchTerm : ''
              }&direction=${direction}`,
            )
          : await axios.get(
              `/user/fees?sortBy=productType.typeName&searchTerm=${
                searchTerm ? searchTerm : ''
              }&direction=${direction}`,
            );
        setFees(sortedFees.data.content);
        break;
      default:
        sortedFees = id
          ? await axios.get(
              `/user/merchants/${id}/fees?sortBy=${column}&searchTerm=${
                searchTerm ? searchTerm : ''
              }&direction=${direction}`,
            )
          : await axios.get(
              `/user/fees?sortBy=${column}&searchTerm=${
                searchTerm ? searchTerm : ''
              }&direction=${direction}`,
            );
        setFees(sortedFees.data.content);
        break;
    }
  };

  return notFound ? (
    <NotFound message={errors.data} />
  ) : loading ? (
    <CustomLoader />
  ) : (
    fees && (
      <div className="feesTable">
        <CustomTable
          tableTitle={id ? null : 'Provizije'}
          tableAddItem={'/ips/fees/add'}
          tableHeader={feeTableHeader}
          content={formatFeeData(fees)}
          tableSearchHandler={onChangeSearchTerm}
          tableActions={feeActionConfig}
          tableActivePage={activePage}
          tableHandlePageChange={onPageChange}
          tableTotalPages={totalPages}
          tableColumnSortHandler={onColumnSort}
          onDeleteHandler={onDeleteFee}
          navbarSections={sections}
        />
      </div>
    )
  );
};

export default Fees;
