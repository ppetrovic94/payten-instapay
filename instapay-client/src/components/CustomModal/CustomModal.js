import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Modal } from 'semantic-ui-react';

const CustomModal = ({
  content: Content,
  yesNoButtons,
  onAcceptHandler,
  triggerElement,
  onOpenHandler,
  ...others
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Modal
      {...others}
      closeIcon
      open={open}
      trigger={triggerElement && triggerElement()}
      onClose={() => setOpen(false)}
      onOpen={() => {
        setOpen(true);
        onOpenHandler && onOpenHandler();
      }}>
      <Modal.Content scrolling>
        <Content />
      </Modal.Content>
      {yesNoButtons && (
        <Modal.Actions>
          <Button color="red" onClick={() => setOpen(false)}>
            <Icon name="remove" /> Ne
          </Button>
          <Button
            color="green"
            onClick={() => {
              onAcceptHandler();
              setOpen(false);
            }}>
            <Icon name="checkmark" /> Da
          </Button>
        </Modal.Actions>
      )}
    </Modal>
  );
};

CustomModal.propTypes = {
  content: PropTypes.elementType,
  yesNoButtons: PropTypes.bool,
  onAcceptHandler: PropTypes.func,
  triggerElement: PropTypes.func,
  onOpenHandler: PropTypes.func,
};

export default CustomModal;
