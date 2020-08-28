import React, { useState, useEffect } from 'react';
import axios from '../../../utils/API';
import CustomTable from '../../CustomTable/CustomTable';
import CustomLoader from '../../CustomLoader/CustomLoader';
import { cityTableHeader, formatCitiesData, cityActionConfig } from '../utils/cityTable';
import './Cities.scss';
import { Form, Button } from 'semantic-ui-react';

const Cities = () => {
  const [cityForm, setCityForm] = useState({ cityName: '', cityCode: '' });
  const [loading, setLoading] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [cities, setCities] = useState(null);
  const [errors, setErrors] = useState(null);

  const fetchCities = async () => {
    try {
      const response = await axios.get('/user/cities');
      const { content: cities, totalPages } = (response && response.data) || {};
      setCities(cities);
      setTotalPages(totalPages);
    } catch (error) {
      setErrors(error.response);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const onPageChange = async (e, { activePage }) => {
    setActivePage(activePage);
    let response = null;
    if (searchTerm) {
      response = await axios.get(`/user/cities?searchTerm=${searchTerm}&pagenum=${activePage - 1}`);
    } else {
      response = await axios.get(`/user/cities?pagenum=${activePage - 1}`);
    }

    setCities(response.data.content);
  };

  const onChangeSearchTerm = async (term) => {
    const filtered = await axios.get(`/user/cities?searchTerm=${term}`);
    setSearchTerm(term);
    setTotalPages(filtered.data.totalPages);
    setCities(filtered.data.content);
  };

  const onColumnSort = async (column, direction) => {
    console.log('onColumnSort');
    console.log('---- column clicked', column, direction);

    const sortedCities = await axios.get(
      `/user/cities?sortBy=${column}&searchTerm=${
        searchTerm ? searchTerm : ''
      }&direction=${direction}`,
    );
    setCities(sortedCities.data.content);
  };

  const onChange = (e) => {
    setCityForm({ ...cityForm, [e.target.name]: e.target.value });
  };

  const onSubmit = async () => {
    setLoading(true);
    try {
      await axios.post(`/user/cities/add`, cityForm);
      fetchCities();
      setErrors(null);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setErrors(err.response.data);
    }
  };

  const onDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`/user/cities/${id}/delete`);
      fetchCities();
      setLoading(false);
    } catch (error) {
      console.error(error.response);
    }
  };

  return (
    <div className="cityContainer">
      <div className="cityForm">
        <Form>
          <Form.Field>
            <label className="requiredField">Naziv grada</label>
            <input
              type="text"
              placeholder="Unesite ime grada..."
              name="cityName"
              value={cityForm.cityName}
              onChange={onChange}
            />
          </Form.Field>
          {errors && <p style={{ color: 'red' }}>{errors.cityName && errors.cityName}</p>}
          <Form.Field>
            <label className="requiredField">Poštanski broj</label>
            <input
              type="number"
              placeholder="Unesite poštanski broj..."
              name="cityCode"
              value={cityForm.cityCode}
              onChange={onChange}
            />
          </Form.Field>
          {errors && <p style={{ color: 'red' }}>{errors.cityCode && errors.cityCode}</p>}
          <Button onClick={onSubmit}>Dodaj</Button>
        </Form>
      </div>
      <div className="cityTable">
        {loading ? (
          <CustomLoader />
        ) : (
          <CustomTable
            tableTitle={'Gradovi'}
            tableHeader={cityTableHeader}
            content={cities && formatCitiesData(cities)}
            tableSearchHandler={onChangeSearchTerm}
            tableActions={cityActionConfig}
            tableActivePage={activePage}
            tableHandlePageChange={onPageChange}
            tableTotalPages={totalPages}
            tableColumnSortHandler={onColumnSort}
            onDeleteHandler={onDelete}
          />
        )}
      </div>
    </div>
  );
};

export default Cities;
