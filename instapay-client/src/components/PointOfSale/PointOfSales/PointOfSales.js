import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../../utils/API';
import CustomTable from '../../CustomTable/CustomTable';
import {
  pointOfSaleTableHeader,
  formatPointOfSalesData,
  pointOfSaleActionConfig,
} from '../utils/pointOfSaleTable';
import './PointOfSales.scss';
import NotFound from '../../../security/NotFound/NotFound';
import CustomLoader from '../../CustomLoader/CustomLoader';

const PointOfSales = () => {
  const [loading, setLoading] = useState(false);
  const [pointOfSales, setPointOfSales] = useState(null);
  const [sections, setSections] = useState([]);
  const [errors, setErrors] = useState(null);
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  // const [merchantTitle, setMerchantTitle] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    localStorage.setItem('merchantId', id);
    const fetchMerchantName = async (id) => {
      try {
        const response = await axios.get(`/user/merchants/${id}/name`);
        setSections([
          { key: 'merchantName', content: response.data },
          { key: 'pointOfSales', content: 'Prodajna mesta' },
        ]);
      } catch (err) {
        setErrors(err.response);
      }
    };
    const fetchPointOfSales = async (id) => {
      setLoading(true);
      try {
        const response = await axios.get(`/user/merchant/${id}/pos`);
        setPointOfSales(response.data.content);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setErrors(err.response);
      }
    };
    fetchPointOfSales(id);
    fetchMerchantName(id);
  }, [id]);

  const onPageChange = async (e, { activePage }) => {
    setActivePage(activePage);
    let response = null;
    if (searchTerm) {
      response = await axios.get(
        `/user/merchant/${id}/pos?searchTerm=${searchTerm}&pagenum=${activePage - 1}`,
      );
    } else {
      response = await axios.get(`/user/merchant/${id}/pos?pagenum=${activePage - 1}`);
    }

    setPointOfSales(response.data.content);
  };

  const onChangeSearchTerm = async (term) => {
    const filtered = await axios.get(`/user/merchant/${id}/pos?searchTerm=${term}`);
    setSearchTerm(term);
    setTotalPages(filtered.data.totalPages);
    setPointOfSales(filtered.data.content);
  };

  const onColumnSort = async (column, direction) => {
    let sortedPointOfSales;
    switch (column) {
      case 'city':
        sortedPointOfSales = await axios.get(
          `/user/merchant/${id}/pos?sortBy=city.cityName&searchTerm=${
            searchTerm ? searchTerm : ''
          }&direction=${direction}`,
        );
        setPointOfSales(sortedPointOfSales.data.content);
        break;
      case 'status':
        sortedPointOfSales = await axios.get(
          `/user/merchant/${id}/pos?sortBy=status.statusName&searchTerm=${
            searchTerm ? searchTerm : ''
          }&direction=${direction}`,
        );
        setPointOfSales(sortedPointOfSales.data.content);
        break;
      case 'paymentMethod':
        sortedPointOfSales = await axios.get(
          `/user/merchant/${id}/pos?sortBy=paymentMethod.paymentMethodName&searchTerm=${
            searchTerm ? searchTerm : ''
          }&direction=${direction}`,
        );
        setPointOfSales(sortedPointOfSales.data.content);
        break;
      default:
        sortedPointOfSales = await axios.get(
          `/user/merchant/${id}/pos?sortBy=${column}&searchTerm=${
            searchTerm ? searchTerm : ''
          }&direction=${direction}`,
        );
        setPointOfSales(sortedPointOfSales.data.content);
        break;
    }
  };

  return errors ? (
    <NotFound message={errors.data} />
  ) : loading ? (
    <CustomLoader />
  ) : (
    pointOfSales && (
      <div className="pointOfSalesTable">
        <CustomTable
          tableAddItem={`/ips/merchant/${id}/pos/add`}
          tableHeader={pointOfSaleTableHeader}
          tableActions={pointOfSaleActionConfig}
          content={formatPointOfSalesData(pointOfSales)}
          tableSearchHandler={onChangeSearchTerm}
          tableActivePage={activePage}
          tableHandlePageChange={onPageChange}
          tableTotalPages={totalPages}
          tableColumnSortHandler={onColumnSort}
          navbarSections={sections}
        />
      </div>
    )
  );
};

export default PointOfSales;
