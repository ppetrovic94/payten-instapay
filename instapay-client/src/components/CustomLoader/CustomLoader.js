import React from 'react';
import { Loader, Segment } from 'semantic-ui-react';
import './CustomLoader.scss';

const CustomLoader = () => (
  <div className="customLoader">
    <Segment>
      <Loader active size={'large'} />
    </Segment>
  </div>
);

export default CustomLoader;
