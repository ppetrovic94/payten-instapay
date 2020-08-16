import React from 'react';
import axios from 'axios';
import { Button } from 'semantic-ui-react';

const IpsReport = () => {
  const report_json = {
    designFile: 'param_test.rptdesign',
    outputName: 'test_out_1',
    format: 'pdf',
    parameters: {
      paramString: 'String Val',
      paramInteger: 1111,
      paramDate: '2010-05-05',
      paramDecimal: 999.888,
    },
    wrapError: true,
  };

  const onSubmit = async () => {
    await axios.get('http://localhost:8080/exportReport');
  };

  return (
    <div className="exportReport">
      {/* <Button onClick={onSubmit}>Generisi izvestaj</Button> */}
      <a href="http://localhost:8080/exportReport" download>
        {' '}
        Generisi izvestaj
      </a>
    </div>
  );
};

export default IpsReport;
