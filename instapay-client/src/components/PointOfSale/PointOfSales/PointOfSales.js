import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
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
  const { id } = useParams();
  const { param: merchantName } = useLocation();

  useEffect(() => {
    const fetchPointOfSales = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/user/merchant/${id}/pos`);
        setPointOfSales(response.data.content);
      } catch (err) {
        setErrors(err.response);
      }
    };
    fetchPointOfSales();
  }, [id]);

  const onChangeSearchTerm = async (term) => {
    const filtered = await axios.get(
      `http://localhost:8080/user/merchant/${id}/pos?searchTerm=${term}`,
    );
    console.log(filtered, 'filtered');
    setPointOfSales(filtered.data.content);
  };

  return (
    <div className="pointOfSalesContainer">
      <h2 className="pointOfSalesTitle">Prodajna mesta</h2>
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
