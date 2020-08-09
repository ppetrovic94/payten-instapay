import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
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
        const response = await axios.get(`http://localhost:8080/user/merchants/${id}/name`);
        setMerchantTitle(response.data);
      } catch (err) {
        setErrors(err.response);
      }
    };
    const fetchPointOfSales = async (id) => {
      try {
        const response = await axios.get(`http://localhost:8080/user/merchant/${id}/pos`);
        setPointOfSales(response.data.content);
      } catch (err) {
        setErrors(err.response);
      }
    };
    fetchPointOfSales(id);
    fetchMerchantName(id);
  }, [id]);

  const onChangeSearchTerm = async (term) => {
    const filtered = await axios.get(
      `http://localhost:8080/user/merchant/${id}/pos?searchTerm=${term}`,
    );
    setPointOfSales(filtered.data.content);
  };

  return (
    <div>
      <h2 className="pointOfSalesTitle">
        {merchantTitle ? `${merchantTitle} - Prodajna mesta` : 'Prodajna mesta'}
      </h2>
      <div className="pointOfSalesTable">
        <CustomTable
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
