import React from 'react';
import { Accordion, Icon, List } from 'semantic-ui-react';
import './AccordionGroup.scss';

const AccordionGroup = ({ data }) => {
  const terminalContent = (item) => (
    <List horizontal>
      <List.Item>
        <List.Content>
          <List.Header>TID</List.Header>
          {item.terminal.acquirerTid}
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>
          <List.Header>Status</List.Header>
          {item.terminal.status.statusName}
        </List.Content>
      </List.Item>
    </List>
  );

  const pointOfSalePanels = (content) => {
    return content.map((item, key) => {
      return {
        key,
        title: (
          <Accordion.Title className="accordionTitle">
            <div>
              <Icon name="dropdown" />
              {`Terminal - ${item.terminal.acquirerTid}`}
            </div>
            <div className="accordionStatus">
              {item.importStatus.messageCode == 1 && <Icon color="yellow" name="exclamation" />}
              {item.importStatus.messageCode == 2 && <Icon color="orange" name="close" />}
              {item.importStatus.messageCode == 3 && <Icon color="green" name="checkmark" />}

              <p>{item.importStatus.message}</p>
            </div>
          </Accordion.Title>
        ),
        content: { content: terminalContent(item) },
      };
    });
  };

  const pointOfSaleContent = (item) => (
    <>
      <List horizontal>
        <List.Item>
          <List.Content>
            <List.Header>Ime</List.Header>
            {item.pointOfSale.pointOfSaleName}
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Content>
            <List.Header>Adresa</List.Header>
            {item.pointOfSale.pointOfSaleAddress}
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Content>
            <List.Header>Grad</List.Header>
            {item.pointOfSale.city.cityName}
          </List.Content>
        </List.Item>
      </List>

      <Accordion.Accordion panels={pointOfSalePanels(Object.values(item.terminalMap))} />
    </>
  );

  const merchantPanels = (content) => {
    return content.map((item, key) => {
      return {
        key,
        title: (
          <Accordion.Title className="accordionTitle">
            <div>
              <Icon name="dropdown" />
              {`Prodajno mesto - ${item.pointOfSale.pointOfSaleName}`}
            </div>
            <div className="accordionStatus">
              {item.importStatus.messageCode == 1 && <Icon color="yellow" name="exclamation" />}
              {item.importStatus.messageCode == 2 && <Icon color="orange" name="close" />}
              {item.importStatus.messageCode == 3 && <Icon color="green" name="checkmark" />}

              <p>{item.importStatus.message}</p>
            </div>
          </Accordion.Title>
        ),
        content: { content: pointOfSaleContent(item) },
      };
    });
  };

  const merchantContent = (item) => (
    <>
      <List horizontal>
        <List.Item>
          <List.Content>
            <List.Header>Ime</List.Header>
            {item.merchant.merchantName}
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Content>
            <List.Header>Adresa</List.Header>
            {item.merchant.merchantAddress}
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Content>
            <List.Header>Grad</List.Header>
            {item.merchant.city.cityName}
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Content>
            <List.Header>PIB</List.Header>
            {item.merchant.taxIdentityNumber}
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Content>
            <List.Header>Racun</List.Header>
            {item.merchant.merchantAccount}
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Content>
            <List.Header>MCC</List.Header>
            {item.merchant.mcc}
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Content>
            <List.Header>Sifra placanja</List.Header>
            {item.merchant.paymentCode}
          </List.Content>
        </List.Item>
      </List>

      <Accordion.Accordion panels={merchantPanels(Object.values(item.pointOfSaleMap))} />
    </>
  );

  const rootPanels = (content) => {
    return content.map((item, key) => {
      return {
        key,
        title: (
          <Accordion.Title className="accordionTitle">
            <div>
              <Icon name="dropdown" />
              {`Trgovac - ${item.merchant.merchantName}`}
            </div>
            <div className="accordionStatus">
              {item.importStatus.messageCode == 1 && <Icon color="yellow" name="exclamation" />}
              {item.importStatus.messageCode == 2 && <Icon color="orange" name="close" />}
              {item.importStatus.messageCode == 3 && <Icon color="green" name="checkmark" />}

              <p>{item.importStatus.message}</p>
            </div>
          </Accordion.Title>
        ),
        content: { content: merchantContent(item) },
      };
    });
  };

  return (
    <Accordion
      defaultActiveIndex={0}
      panels={rootPanels(data)}
      styled
      className="accordionContainer"
    />
  );
};

export default AccordionGroup;
