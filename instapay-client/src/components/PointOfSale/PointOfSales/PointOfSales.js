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

const PointOfSales = () => {
  const [pointOfSales, setPointOfSales] = useState(null);
  const [errors, setErrors] = useState(null);
  const [merchantTitle, setMerchantTitle] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchMerchantName = async (id) => {
      try {
        const response = await axios.get(`/user/merchants/${id}/name`);
        setMerchantTitle(response.data);
      } catch (err) {
        setErrors(err.response);
      }
    };
    const fetchPointOfSales = async (id) => {
      try {
        const response = await axios.get(`/user/merchant/${id}/pos`);
        setPointOfSales(response.data.content);
      } catch (err) {
        setErrors(err.response);
      }
    };
    fetchPointOfSales(id);
    fetchMerchantName(id);
  }, [id]);

  const onChangeSearchTerm = async (term) => {
    const filtered = await axios.get(`/user/merchant/${id}/pos?searchTerm=${term}`);
    setPointOfSales(filtered.data.content);
  };

  return (
    <div>
      <div className="pointOfSalesTable">
        <CustomTable
          tableTitle={merchantTitle ? `${merchantTitle} - Prodajna mesta` : 'Prodajna mesta'}
          tableAddItem={`/merchant/${id}/pos/add`}
          tableHeader={pointOfSaleTableHeader}
          tableActions={pointOfSaleActionConfig}
          content={pointOfSales && formatPointOfSalesData(pointOfSales)}
          tableSearchHandler={onChangeSearchTerm}
        />
      </div>
    </div>
  );
};

export default PointOfSales;
