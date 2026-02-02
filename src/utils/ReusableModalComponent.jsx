// components/CustomModal.jsx
import React from 'react';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ReusableModalComponent = ({
  open,
  onClose,
  title,
  children,
  maxWidth = 500,
  showCloseButton = true,
}) => {
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    maxWidth: maxWidth,
    maxHeight: '90vh',
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    outline: 'none',
    overflow: 'hidden',
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="custom-modal-title"
    >
      <Box sx={modalStyle}>
        {/* Header */}
        {title && (
          <>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 3,
                py: 2,
              }}
            >
              <Typography
                id="custom-modal-title"
                variant="h6"
                component="h2"
                fontWeight={600}
              >
                {title}
              </Typography>
              {showCloseButton && (
                <IconButton
                  onClick={onClose}
                  size="small"
                  sx={{
                    color: 'grey.500',
                    '&:hover': {
                      color: 'grey.700',
                    },
                  }}
                >
                  <CloseIcon />
                </IconButton>
              )}
            </Box>
            <Divider />
          </>
        )}

        {/* Content */}
        <Box
          sx={{
            p: 3,
            maxHeight: 'calc(90vh - 120px)',
            overflowY: 'auto',
          }}
        >
          {children}
        </Box>
      </Box>
    </Modal>
  );
};

export default ReusableModalComponent;