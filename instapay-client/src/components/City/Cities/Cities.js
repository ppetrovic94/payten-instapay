import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Form, Button } from 'semantic-ui-react';
import axios from '../../../utils/API';
import CustomTable from '../../CustomTable/CustomTable';
import CustomLoader from '../../CustomLoader/CustomLoader';
import { cityTableHeader, formatCitiesData, cityActionConfig } from '../utils/cityTable';
import './Cities.scss';

const Cities = () => {
  const [cityForm, setCityForm] = useState({ cityName: '', cityCode: '' });
  const [loading, setLoading] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [cities, setCities] = useState(null);
  const [errors, setErrors] = useState(null);

  const fetchCities = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/user/cities');
      const { content: cities, totalPages } = (response && response.data) || {};
      setCities(cities);
      setTotalPages(totalPages);
      setLoading(false);
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
      await axios.post('/user/cities/add', cityForm);
      toast.success(`Uspešno ste dodali grad ${cityForm.cityName}`);
      fetchCities();
      setErrors(null);
      setLoading(false);
    } catch (err) {
      toast.error('Došlo je do greške pri dodavanju grada');
      setLoading(false);
      setErrors(err.response.data);
    }
  };

  const onDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`/user/cities/${id}/delete`);
      toast.success(`Uspešno ste obrisali grad ${cityForm.cityName}`);
      fetchCities();
      setLoading(false);
    } catch (error) {
      toast.error('Došlo je do greške pri brisanju grada');
      setLoading(false);
      console.error(error.response);
    }
  };

  return loading ? (
    <CustomLoader />
  ) : (
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
        {cities && (
          <CustomTable
            tableTitle="Gradovi"
            tableHeader={cityTableHeader}
            content={formatCitiesData(cities)}
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
