import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Typography,
  Button,
  Modal,
  Box,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import { Alert } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function VendorList() {
  const [vendors, setVendors] = useState([]);
  const [isDeletedAlertVisible, setIsDeletedAlertVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const REACT_APP_BACKEND_ROUTE_URL = process.env.REACT_APP_BACKEND_ROUTE_URL;
  const [vendor, setVendor] = useState({});
  const [editedVendor, setEditedVendor] = useState({
    // Initialize with empty values
    vendorName: "",
    bankAccountNo: "",
    bankName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    country: "",
    zipCode: "",
  });

  const fetchVendorsData = () => {
    axios
      .get(REACT_APP_BACKEND_ROUTE_URL)
      .then((response) => {
        console.log(response.data);
        const updatedVendors = response.data
          .filter((vendor) => vendor.deleted === false)
          .map((vendor, index) => ({
            ...vendor,
            id: index + 1,
          }));
        setVendors(updatedVendors);
      })
      .catch((error) => {
        console.error("Error fetching vendors:", error);
      });
  };

  useEffect(() => {
    // Fetch vendor data from your backend API
    fetchVendorsData();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "vendorName", headerName: "Vendor Name", width: 100 },
    { field: "bankAccountNo", headerName: "Bank Account No", width: 200 },
    { field: "bankName", headerName: "Bank Name", width: 200 },
    { field: "addressLine1", headerName: "Address Line 1", width: 200 },
    { field: "addressLine2", headerName: "Address Line 2", width: 200 },
    { field: "city", headerName: "City", width: 200 },
    { field: "country", headerName: "Country", width: 150 },
    { field: "zipCode", headerName: "Zip Code", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => {
        return (
          <Stack direction="row" spacing={1}>
            <IconButton
              aria-label="Edit"
              onClick={() => handleEdit(params.row)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="Delete"
              onClick={() => confirmDelete(params.row)}
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        );
      },
    },
  ];

  const getRowId = (row) => row.id; // Use the custom id field

  // Define cell renderers to display "-" for empty values
  columns.forEach((column) => {
    if (column.field !== "actions") {
      column.renderCell = (params) => {
        const value = params.value || "-";
        return <div>{value}</div>;
      };
    }
  });

  const confirmDelete = (vendor) => {
    setShowDeleteModal(true);
    setVendor(vendor);
  };

  const handleDeleteVendor = async () => {
    setShowDeleteModal(false);
    try {
      const response = await axios.put(
        `${REACT_APP_BACKEND_ROUTE_URL}/delete/${vendor._id}`
      );
      if (response.data.message === "Vendor soft deleted successfully") {
        fetchVendorsData();
        setIsDeletedAlertVisible(true); // Show the success alert
        setTimeout(() => {
          setIsDeletedAlertVisible(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error deleting vendor:", error);
    }
  };

  const handleClose = () => {
    setShowDeleteModal(false);
  };

  const handleEdit = (vendor) => {
    // Set the editedVendor state with the vendor data for editing
    setEditedVendor({
      vendorName: vendor.vendorName !== "-" ? vendor.vendorName : "",
      bankAccountNo: vendor.bankAccountNo !== "-" ? vendor.bankAccountNo : "",
      bankName: vendor.bankName !== "-" ? vendor.bankName : "",
      addressLine1: vendor.addressLine1 !== "-" ? vendor.addressLine1 : "",
      addressLine2: vendor.addressLine2 !== "-" ? vendor.addressLine2 : "",
      city: vendor.city !== "-" ? vendor.city : "",
      country: vendor.country !== "-" ? vendor.country : "",
      zipCode: vendor.zipCode !== "-" ? vendor.zipCode : "",
    });
    setVendor(vendor);

    setIsEditModalVisible(true);
  };

  const handleEditVendor = async () => {
    if (
      editedVendor.isBankNameInvalid ||
      editedVendor.isNameInvalid ||
      editedVendor.isNoInvalid ||
      editedVendor.isNoLengthLess
    ) {
      return;
    }
    setIsEditModalVisible(false);
    try {
      const response = await axios.put(
        `${REACT_APP_BACKEND_ROUTE_URL}/update/${vendor._id}`,
        editedVendor
      );
      console.log(response);
      if (response.status === 200) {
        fetchVendorsData();
        // You can show a success message here if needed
      }
    } catch (error) {
      console.error("Error updating vendor:", error);
    }
  };
  const handleNameChange = (e) => {
    const name = e.target.value;
    if (name.length === 0) {
      setEditedVendor((prevData) => ({
        ...prevData,
        vendorName: name,
        isNameInvalid: true,
        // isNegative: false,
        // isDecimal: false
      }));
    } else {
      setEditedVendor((prevData) => ({
        ...prevData,
        vendorName: name,

        isNameInvalid: false,
      }));
    }
  };
  const handleBankNameChange = (e) => {
    const bankName = e.target.value;
    if (bankName.length === 0) {
      setEditedVendor((prevData) => ({
        ...prevData,
        bankName: bankName,
        isBankNameInvalid: true,
        // isNegative: false,
        // isDecimal: false
      }));
    } else {
      setEditedVendor((prevData) => ({
        ...prevData,
        bankName: bankName,

        isBankNameInvalid: false,
      }));
    }
  };
  const handleAccountNoChange = (e) => {
    const no = e.target.value;
    if (no.length === 0) {
      setEditedVendor((prevData) => ({
        ...prevData,
        bankAccountNo: no,
        isNoInvalid: true,
        isNoLengthLess: false,
        // isNegative: false,
        // isDecimal: false
      }));
    } else if (no.length < 10) {
      setEditedVendor((prevData) => ({
        ...prevData,
        bankAccountNo: no,
        isNoLengthLess: true,
        isNoInvalid: false,
      }));
    } else {
      setEditedVendor((prevData) => ({
        ...prevData,
        bankAccountNo: no,
        isNoLengthLess: false,
        isNoInvalid: false,
      }));
    }
  };

  return (
    <div style={{ height: 500, width: "100%" }}>
      {isDeletedAlertVisible && (
        <Alert severity="error">{vendor.vendorName} Deleted!</Alert>
      )}
      <Typography variant="h3" style={{ fontSize: 20, marginTop: "3%" }}>
        List of Vendors:
      </Typography>
      <Modal
        open={showDeleteModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            maxWidth: "400px",
            bgcolor: "white",
            borderRadius: 2,
            padding: 2,
          }}
        >
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            sx={{ position: "absolute", top: 0, right: 0 }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h4" marginTop={2} textAlign={"center"}>
            Do you want to delete
            <span style={{ color: "maroon" }}>{" " + vendor.vendorName}</span> ?
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="contained" onClick={handleDeleteVendor}>
              Confirm
            </Button>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Modal
        open={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            maxWidth: "400px",
            bgcolor: "white",
            borderRadius: 2,
            padding: 2,
          }}
        >
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => setIsEditModalVisible(false)}
            aria-label="close"
            sx={{ position: "absolute", top: 0, right: 0 }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h4" marginTop={2} textAlign={"center"}>
            Edit Vendor
          </Typography>
          <TextField
            fullWidth
            label="Vendor Name"
            margin="normal"
            variant="outlined"
            value={editedVendor.vendorName}
            required
            onChange={handleNameChange}
            error={editedVendor.isNameInvalid}
            helperText={
              editedVendor.isNameInvalid ? `Name is required field` : ""
            }
          />
          <TextField
            fullWidth
            label="Bank Account No"
            margin="normal"
            variant="outlined"
            value={editedVendor.bankAccountNo}
            required
            onChange={handleAccountNoChange}
            error={editedVendor.isNoInvalid || editedVendor.isNoLengthLess}
            helperText={
              editedVendor.isNoInvalid
                ? `Bank Account No is required field`
                : editedVendor.isNoLengthLess
                ? "Bank Account No Must be of 10 digits"
                : ""
            }
          />
          <TextField
            fullWidth
            label="Bank Name"
            margin="normal"
            variant="outlined"
            value={editedVendor.bankName}
            required
            onChange={handleBankNameChange}
            error={editedVendor.isBankNameInvalid}
            helperText={
              editedVendor.isBankNameInvalid
                ? `Bank Name is required field`
                : ""
            }
          />
          <TextField
            fullWidth
            label="Address Line 1"
            margin="normal"
            variant="outlined"
            value={editedVendor.addressLine1}
            onChange={(e) =>
              setEditedVendor({ ...editedVendor, addressLine1: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Address Line 2"
            margin="normal"
            variant="outlined"
            value={editedVendor.addressLine2}
            onChange={(e) =>
              setEditedVendor({ ...editedVendor, addressLine2: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="City"
            margin="normal"
            variant="outlined"
            value={editedVendor.city}
            onChange={(e) =>
              setEditedVendor({ ...editedVendor, city: e.target.value })
            }
          />
          {/* Add more fields for editing */}
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="contained" onClick={handleEditVendor}>
              Save
            </Button>
            <Button
              variant="outlined"
              onClick={() => setIsEditModalVisible(false)}
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      </Modal>
      <DataGrid
        rows={vendors}
        columns={columns}
        slots={{ toolbar: GridToolbar }}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10]}
        getRowId={getRowId}
      />
    </div>
  );
}

export default VendorList;
