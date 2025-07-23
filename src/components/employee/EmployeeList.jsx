import { Avatar, Box, Button, Chip, InputAdornment, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';


import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import IDCard from './IDCard';
import { createRoot } from 'react-dom/client';
import TablePagination from '@mui/material/TablePagination';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import GppGoodOutlinedIcon from '@mui/icons-material/GppGoodOutlined';
import GppBadOutlinedIcon from '@mui/icons-material/GppBadOutlined';
import { useMediaQuery, useTheme } from '@mui/material';
import { useConfirmDialog } from '../../context/ConfirmDialogContext';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
const EmployeeList = () => {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));  //screen < 600px
  const isSmallMobile = useMediaQuery('(min-width:375px) and (max-width:500px)');


  const employees = useSelector((store) => store.employee.employees)
  // console.log("Employee data: ", employees);
  const navigate = useNavigate();
  const confirmDialog = useConfirmDialog();
  const [searchQuery, setSearchQuery] = useState('');

  const [page, setPage] = useState(0); // MUI TablePagination is 0-indexed
  const [rowsPerPage, setRowsPerPage] = useState(10);




  const filteredEmployees = employees.filter((emp) =>
    emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };

  const paginatedEmployees = filteredEmployees.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  useEffect(() => {
    setPage(0);
  }, [searchQuery])



  const handleClick = () => {
    navigate('/employees/new')
  }

  const handleEdit = async (empId) => {
    const yes = await confirmDialog("Do you really want to edit this employee ?");
    if (yes) {
      navigate(`/employee-edit/${empId}`)
    }
  }

  const generatePDF = async (emp) => {
    const yes = await confirmDialog("Do you really want to Generate ID card ?");
    if (yes) {
      const container = document.createElement('div');
      document.body.appendChild(container);
      container.style.position = 'absolute';
      container.style.top = '-10000px'; //hide from screen

      const root = createRoot(container);
      root.render(<IDCard emp={emp} />)

      setTimeout(async () => {
        const canvas = await html2canvas(container.firstChild);
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [300, 270]
        })

        pdf.addImage(imgData, 'PNG', 0, 0, 300, 270);
        pdf.save(`${emp.fullName}_IDCard.pdf`);

        root.unmount();
        document.body.removeChild(container);
      }, 500)
    }
  }

  const handleExportToExcel = async () => {
    const yes = await confirmDialog("Do you really want to export Excel file ?");

    if (yes) {
      const exportData = employees.map(emp => ({
        "Employee ID": emp.empId,
        "Full Name": emp.fullName,
        "Email": emp.email,
        "Phone Number": emp.phoneNumber,
        "Designation": emp.designation,
        "Department": emp.department,
        "Joining Date": emp.joiningDate,
        "Employee Type": emp.employeeType,
        "Work Location": emp.workLocation,
        "Status": emp.status,
        "Is Admin": emp.isAdmin ? "Yes" : "No",
        "Manager ID/Name": emp.managerNameOrId,
        "Skills": emp.skills.join(', '),
        "Date of Birth": emp.dateOfBirth,
        "Emergency Contact Name": emp.emergencyContact?.fullName || '',
        "Emergency Contact Relationship": emp.emergencyContact?.relationship || '',
        "Emergency Contact Phone": emp.emergencyContact?.phoneNumber || ''
      }));

      const workSheet = XLSX.utils.json_to_sheet(exportData);

      // Auto-width columns based on content
      const maxWidths = exportData.reduce((widths, row) => {
        return Object.keys(row).map((key, i) => {
          const valueLength = String(row[key]).length;
          return Math.max(widths[i] || key.length, valueLength);
        });
      }, []);

      workSheet['!cols'] = maxWidths.map(w => ({ wch: w + 2 })); // +2 padding
      const workBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workBook, workSheet, "Employees");

      //from video
      XLSX.writeFile(workBook, "MyExcel.xlsx");
    }
  }

  if (employees.length === 0) {
    return <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 2, mt: 3 }}>
      <Typography variant='h6' >No employees found</Typography>
      <Typography variant='body1' mt={1} sx={{ opacity: 0.6, p: 2 }}>  Overview of your employee management system </Typography>
      <Button variant='contained' onClick={handleClick}>Add First Employee</Button>
    </Box>
  }
  return (
    <Box sx={{ p: { xs: 0, sm: 2, md: 3 }, bgcolor: "#f5f9ff",minHeight:"93vh" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: { md: 1, lg: 2 }, pt: 1 }}>
        <Box>
          <Typography variant='h4' color='primary' sx={{ display: { xs: "none", md: "block" } }} >Employees</Typography>
          <Typography variant='body1' mt={1} sx={{ opacity: 0.6, display: { xs: "none", md: "block" } }} >Manage your organization's employees</Typography>
        </Box>

        <Stack
          direction="row"
          spacing={1}
          sx={{
            mr: { xs: 2, md: 0 },
            alignItems: "flex-end",

          }}
        >

          <Button
            onClick={handleExportToExcel}
            variant="outlined"
            sx={{
              color: 'inherit',
              '&:hover': { backgroundColor: '#e4eded', color: 'blueviolet' }
            }}
            startIcon={<FileDownloadOutlinedIcon />}
          >
            Export
          </Button>
          <Button variant='contained' onClick={handleClick} startIcon={<AddOutlinedIcon />}>ADD</Button>
        </Stack>
      </Box>

      <Box sx={{ p: 2, mt: 2, }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', sm: 'center' }}
          spacing={2}
          mb={2}
        >
          <Typography variant='h6' sx={{ display: { sx: "none", sm: "block" } }} fontSize={{ xs: '1.5rem', xl: '2rem' }}>Employees Directory</Typography>

          <TextField
            placeholder="Search employees"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: { xs: '80%', sm: 300 }, pr: { md: 4, lg: 0 }, borderRadius: 2,  }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              )
            }}
          />
        </Stack>



        <TableContainer sx={{ width: '100%', overflowX: 'auto' }} >
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#e3f2fd", '& th': { color: "#0d47a1", borderBottom: "#1px solid #bbdefb" } }}>
                <TableCell align='center' sx={{ fontSize: { xs: '1rem', xl: '1.15rem' } }}><strong>Sl no</strong></TableCell>
                <TableCell align='center' sx={{ fontSize: { xs: '1rem', xl: '1.15rem' } }}><strong>Fullname</strong></TableCell>
                <TableCell align='center' sx={{ display: { xs: "none", sm: "none", lg: "table-cell" }, fontSize: { xs: '1rem', xl: '1.15rem' } }}><strong>Profile photo</strong></TableCell>
                {!isSmallMobile && <TableCell align='center' sx={{ fontSize: { xs: '1rem', xl: '1.15rem' } }} ><strong>Phone number</strong></TableCell>}
                <TableCell align='center' sx={{ display: { xs: "none", sm: "none", md: "table-cell" }, fontSize: { xs: '1rem', xl: '1.15rem' } }}><strong>Emp Id</strong></TableCell>
                <TableCell align='center' sx={{ display: { xs: "none", sm: "none", md: "table-cell" }, fontSize: { xs: '1rem', xl: '1.15rem' } }}><strong>Designation</strong></TableCell>
                <TableCell align='center' sx={{ display: { xs: "none", sm: "none", lg: "table-cell" }, fontSize: { xs: '1rem', xl: '1.15rem' } }}><strong>Department</strong></TableCell>
                <TableCell align='center' sx={{ display: { xs: "none", sm: "table-cell" }, '@media (min-width:600px) and (max-width:655px)':{display:"none"}, fontSize: { xs: '1rem', xl: '1.15rem' } }}><strong>Status</strong></TableCell>
                {/* <TableCell align='center' sx={{ display: { xs: "none", sm: "none", md: "table-cell" }, fontSize: { xs: '1rem', xl: '1.15rem' } }}><strong>isAdmin</strong></TableCell> */}
                <TableCell align='center' sx={{ display: { xs: "none", sm: "none", md: "none" }, '@media(min-width: 961px)': { display: "table-cell" }, fontSize: { xs: '1rem', xl: '1.15rem' } }}><strong>isAdmin</strong></TableCell>
                <TableCell align='center' sx={{ fontSize: { xs: '1rem', xl: '1.15rem' } }}><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees.length === 0 && searchQuery.length > 0 ? (<TableCell colSpan={10} align='center'>No employee found!!</TableCell>) :
                (paginatedEmployees.map((emp, idx) => (
                  <TableRow key={emp.empId} hover sx={{'&hover':{bgcolor:'#fof7ff', transition:'0.3s'}}}>
                    <TableCell align='center'>{page * rowsPerPage + idx + 1}</TableCell>
                    <TableCell align='center'>{emp.fullName}</TableCell>


                    <TableCell align="center" sx={{ display: { xs: "none", sm: "none", lg: "table-cell", fontSize: { xs: '1rem', md: '1.5rem' } } }}>
                      <Box display="flex" justifyContent="center">
                        <Avatar
                          src={emp.profilePicture}
                          sx={{ width: 40, height: 40, borderRadius: "50%" }}
                          alt="Profile"
                        />
                      </Box>
                    </TableCell>

                    {!isSmallMobile && <TableCell align='center' >{emp.phoneNumber}</TableCell>}
                    <TableCell align='center' sx={{ display: { xs: "none", sm: "none", md: "table-cell", fontSize: { xs: '1rem', md: '1.5rem' } } }}>{emp.empId}</TableCell>
                    <TableCell align='center' sx={{ display: { xs: "none", sm: "none", md: "table-cell", fontSize: { xs: '1rem', md: '1.5rem' } } }}>{emp.designation}</TableCell>
                    <TableCell align='center' sx={{ display: { xs: "none", sm: "none", lg: "table-cell", fontSize: { xs: '1rem', md: '1.5rem' } } }}>{emp.department}</TableCell>
                    <TableCell align='center' sx={{ display: { xs: "none", sm: "table-cell",'@media (min-width:600px) and (max-width:655px)':{display:"none"}, fontSize: { xs: '1rem', md: '1.5rem' } } }}>
                      <Chip label={emp.status} color={emp.status === "Active" ? "success" : emp.status === "On Leave" ? "error" : "default"} variant="outlined"
                      />
                    </TableCell>
                    <TableCell align='center' sx={{ display: { xs: "none", sm: "none", md: "none", '@media(min-width: 961px)': { display: "table-cell" } } }}>
                      {emp.isAdmin === true ? <GppGoodOutlinedIcon color='success' /> : <GppBadOutlinedIcon color='error' />}
                    </TableCell>
                    <TableCell align='center'>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1
                      }}>
                        <Tooltip title="edit details" >
                          <EditIcon color='primary' sx={{ cursor: "pointer", }} onClick={() => handleEdit(emp.empId)} />
                        </Tooltip>
                        <Tooltip title="generate ID card">
                          <CreditCardOutlinedIcon color='primary' sx={{ cursor: "pointer", }} onClick={() => generatePDF(emp)} />
                        </Tooltip>
                        <Tooltip title="view details">
                          <InfoOutlinedIcon color='primary' sx={{ cursor: "pointer" }} onClick={() => navigate(`/employee-details/${emp.empId}`)} />
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                )))
              }
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filteredEmployees.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 15, 50]}
          sx={{ width: { xs: "100%" } }}
        />


      </Box>
    </Box>
  )
}

export default EmployeeList;