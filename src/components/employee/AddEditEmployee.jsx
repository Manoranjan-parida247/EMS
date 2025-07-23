import React, { useEffect, useState } from 'react'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Box, Typography, Button, Grid, TextField, MenuItem, Avatar, FormControlLabel, Checkbox, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import {addEmployee, updateEmployee } from '../../app/employeeSlice'
import { useParams } from 'react-router-dom';
import { useMediaQuery, useTheme } from '@mui/material';



const AddEditEmployee = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));  //screen < 600px
  const isSmallMobile = useMediaQuery('(min-width:390px) and (max-width:490px)');


  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  //code for edit 
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const employee = useSelector((store) => store.employee.employees.find((emp) => emp.empId === id));
  const allEmployees = useSelector((store) => store.employee.employees)

  //to track isadmin and profile photo in edit mode
  // const [initialIsAdmin, setInitialIsAdmin] = useState(false);
  // const [initialImage, setInitialImage] = useState(null);




  //validation schema
  const schema = yup.object().shape({
    fullName: yup.string()
      .required("Full Name is required!")
      .matches(/^[A-Za-z ]+$/, "Only alphabets and spaces are allowed.")
      .min(2, "Full Name must be at least 2 characters.")
      .max(50, "Full Name must be at most 50 characters."),
    email: yup.string()
      .required("Email is required")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
        "Invalid email format"
      )
      .test(
        "unique-email",
        "This email is already registered",
        function (value) {
          if (!value) return true;
          const isDuplicate = allEmployees.some((emp) => emp.email.toLowerCase() === value.toLowerCase() && (!isEditMode || emp.empId !== id));
          return !isDuplicate;

        }
      ),
    phoneNumber: yup
      .string()
      .required("Phone number is required")
      .matches(/^\+?[0-9]{10}$/, "Phone number must be 10 digits")
      .test(
        "unique-phone",
        "This phone number is already registered",
        function (value) {
          if (!value) return true;

          const isDuplicate = allEmployees.some((emp) => emp.phoneNumber === value && (!isEditMode || emp.empId !== id));
          return !isDuplicate;
        }
      ),
    dateOfBirth: yup
      .string()
      .required("Date of birth is required"),
    skills: yup
      .string()
      .required("Skills are required")
      .test(
        "valid-skills",
        "Each skill must contain only letters, numbers, spaces, or + . #",
        function (value) {
          if (!value) return true;
          const skillArray = value.split(', ').map((skill) => skill.trim()).filter((skill) => skill !== "");
          const skillRegex = /^[A-Za-z0-9+.# ]+$/;

          return skillArray.every(skill => skillRegex.test(skill));
        }
      )
      .test(
        "max-skills",
        "Maximum 10 skills are allowed",
        function (value) {
          if (!value) return true;
          const skillArray = value.split(', ').map((skill) => skill.trim()).filter((skill) => skill !== "");
          return skillArray.length <= 10;
        }
      )
      .test(
        "no-duplicate-skills",
        "Duplicate skills are not allowed",
        function (value) {
          if (!value) return true;
          const skillArray = value.split(', ').map((skill) => skill.trim()).filter((skill) => skill !== "");
          const uniqueSkills = [...new Set(skillArray)];
          return skillArray.length === uniqueSkills.length;
        }
      )
    ,
    profilePicture: yup
      .string()
      .required("Profile picture is required")
      .matches(
        /^data:image\/(png|jpe?g|webp);base64,/i,
        "Only PNG, JPG, JPEG, or WEBP base64 images are allowed"
      ),

    empId: yup.string()
      .required("Employee ID is required")
      .matches(
        /^EMP\d{3,}$/,
        "Start with 'EMP' followed by at least 3 digits"
      )
      .test(
        "unique-empId",
        "This Employee ID already taken",
        function (value) {
          if (!value) return;

          const isDuplicate = allEmployees.some((emp) => emp.empId === value && (!isEditMode || emp.empId !== id));
          return !isDuplicate;
        }
      ),
    department: yup.string()
      .required("Department  is required")
      .matches(/^[A-Za-z ]+$/, "Only alphabets  are allowed."
      ),
    designation: yup.string()
      .required("Designation is required")
      .matches(
        /^[A-Za-z0-9 ]+$/,
        "Only alphabets, numbers and spaces are allowed."
      ),
    joiningDate: yup.string()
      .required("JoiningDate is required!"),
    employeeType: yup.string().oneOf(["Intern", "Full Time"], "Either 'Intern' or 'Full Time'").required("Employee Type is required"),
    workLocation: yup.string().required("Worklocation  is required"),
    status: yup.string().oneOf(["Active", "On Leave"], "Either 'Active' or 'On Leave'").required("Status is required"),
    managerNameOrId: yup.string().required("Manager name or Id is required"),
    isAdmin: yup.boolean().required("Is Admin is required!"),
    emergencyContact: yup.object({
      fullName: yup.string()
        .required("Fullname is required")
        .matches(/^[A-Za-z ]+$/, "Only alphabets and spaces are allowed")
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be at most 50 characters"),
      relationship: yup.string()
        .required("Relationship is required")
        .matches(/^[A-Za-z ]+$/, "Only alphabets and spaces are allowed"),
      phoneNumber: yup.string()
        .required("Phone Number is required")
        .matches(
          /^\+?[0-9]{10,15}$/,
          "Phone number must contain only digits and length should be 10-15 "
        )
    })





  })

  const form = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      dateOfBirth: "",
      skills: "",
      profilePicture: "",
      empId: "",
      department: "",
      designation: "",
      joiningDate: "",
      employeeType: "",
      workLocation: "",
      status: "",
      managerNameOrId: "",
      isAdmin: false,
      emergencyContact: {
        fullName: "",
        relationship: "",
        phoneNumber: ""
      }
    },
    mode: "onSubmit",
    reValidateMode: "onChange",  //by default  value of reValidateMode
    // reValidateMode:"onSubmit",
    resolver: yupResolver(schema)
  });

  const { register, handleSubmit, formState, setValue, reset, watch } = form;
  const { errors, isDirty, isValid } = formState




  useEffect(() => {
    if (!isEditMode) {
      reset({
        fullName: "",
        email: "",
        phoneNumber: "",
        dateOfBirth: "",
        skills: "",
        profilePicture: "",
        empId: "",
        department: "",
        designation: "",
        joiningDate: "",
        employeeType: "",
        workLocation: "",
        status: "",
        managerNameOrId: "",
        isAdmin: false,
        emergencyContact: {
          fullName: "",
          relationship: "",
          phoneNumber: ""
        }
      });
      setImagePreview(null);
      setSelectedImage(null);
      setIsAdmin(false);
    }
    if (isEditMode) {
      if (employee) {
        // console.log(employee.status);
        // console.log(employee.employeeType);
        const formValues = {
          ...employee,
          skills: Array.isArray(employee.skills) ? employee.skills.join(', ') : employee.skills,

        }
        console.log(formValues)
        reset(formValues);
        setImagePreview(employee.profilePicture);
        setSelectedImage(employee.profilePicture);
        setIsAdmin(employee.isAdmin)
      }
    }
  }, [id, employee, isEditMode, reset])


  const handleclick = () => {
    navigate("/employees")
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result;
        setImagePreview(base64String); // For preview
        setSelectedImage(base64String); // Optional: update selected image state
        setValue('profilePicture', base64String, { shouldValidate: true, shouldDirty:true }); // Save to React Hook Form
      };

      reader.readAsDataURL(file); // Converts to base64
    }
  };


  const triggerFileInput = () => {
    document.getElementById('image-upload-input').click();
  };

  const handleFormSubmit = (data) => {
    // console.log("Form data : ", data);
    // console.log("photo url : ", data.profilePicture);

    const skillArray = data.skills.split(', ').map(skill => skill.trim()).filter(skill => skill !== "");
    const formatedData = { ...data, skills: skillArray }
    if (isEditMode) {
      dispatch(updateEmployee({ empId: id, ...formatedData }))
    } else {
      dispatch(addEmployee(formatedData));
    }

    // if(!isDirty && isEditMode) {
    //   setTimeout(()=>{
    //     navigate('/employees')
    //   }, 500)

    //   return;
    // }
    setSnackbarOpen(true);
    setSnackbarMessage(isEditMode ? "Employee updated successfully" : "Employee added successfully")
    setTimeout(() => {
      navigate('/employees')
    }, 1000)

  }

  const handleClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  }

  //check if id exist
  const isIdExist = Boolean(employee);

  // Watch the values to get current form state
  const watchedEmployeeType = watch("employeeType");
  const watchedStatus = watch("status");

  if (isEditMode && !isIdExist) {
    return (<Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "80vh", gap: "2" }}>
      <Typography variant='h6' color='error' sx={{ fontSize: { xs: "1rem", md: "2rem" } }}>Invalid Employee ID</Typography>
      <Button variant='contained' onClick={() => navigate('/employees')}>Go Back</Button>
    </Box>)
  }

  return (
    <Box  sx={{p:2, bgcolor:"#f5f9ff", minHeight:"93vh"}}>
      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "column" }, gap: { xs: 1, md: 2 }, mb: { xs: 1, md: 3 }, pl: 2 }}>
        <Button
          // fullWidth
          variant="text"
          disableRipple
          disableFocusRipple
          disableElevation
          sx={{
            color: 'inherit',
            '&:hover': { backgroundColor: 'transparent', color: 'blueviolet' },
            alignSelf: "flex-start",
            justifyContent: "flex-start",
            textAlign: "left",
          }}
          onClick={handleclick}
          startIcon={<KeyboardBackspaceIcon />}
        >
          Back to Employees
        </Button>
        <Box>
          {!isSmallMobile && <Typography color='primary.main' variant='h4' fontWeight={600} sx={{ '@media(max-width:389px)': { display: "none" } }}>{isEditMode ? "Update employee" : "Add New Employee"}</Typography>}
          <Typography variant='body1' mt={1} sx={{ opacity: isSmallMobile ? 1 : 0.7 }}>
            {isEditMode ? "Change the details and update employee" : "Fill in the details to add a new employee"}
          </Typography>
        </Box>
      </Box>

      <form noValidate onSubmit={handleSubmit(handleFormSubmit)}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={1}>
            <Grid size={{ md: 4 }} sx={{ p: 2, boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}>
              <Typography  variant='h6' sx={{ fontSize: { xs: "1.5rem", '@media(min-width:900px) and (max-width:915px)': { fontSize: "1.4rem" }, lg: "2rem" } }} mb={2}>  Personal Information  </Typography>

              {/* Inner Grid Container */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                  <TextField label="Full Name" type='text' fullWidth variant="outlined" {...register("fullName")} error={!!errors.fullName} helperText={errors.fullName?.message} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                  <TextField label="Email" type='email' fullWidth variant="outlined" {...register("email")} error={!!errors.email} helperText={errors.email?.message} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 12, lg: 6 }}>
                  <TextField label="Phone Number" type='text' fullWidth variant="outlined" {...register("phoneNumber")} error={!!errors.phoneNumber} helperText={errors.phoneNumber?.message} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 12, lg: 6 }}>
                  <TextField label="Date of Birth" type='date' fullWidth variant="outlined" InputLabelProps={{ shrink: true }} {...register("dateOfBirth")} error={!!errors.dateOfBirth} helperText={errors.dateOfBirth?.message} />
                </Grid>
                <Grid size={{ xs: 12, md: 12 }}>
                  <TextField label="Skills (comma-separated)" placeholder="Javascript, Node.js, React etc" type='text' fullWidth variant='outlined'  {...register("skills")} error={!!errors.skills} helperText={errors.skills?.message} />
                </Grid>

                {/* Image Upload Section */}
                <Grid size={{ md: 12 }}>
                  <Typography variant="h6" sx={{ fontSize: { xs: "1rem" } }} >Profile Picture</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                    {/* {imagePreview && (
                      <Avatar
                        src={imagePreview}
                        sx={{ width: 100, height: 100 }}
                        alt="Employee Preview"
                      />
                    )} */}
                    <Button
                      variant='outlined'
                      onClick={triggerFileInput}
                      sx={{ width: 'fit-content' }}
                    >
                      {selectedImage ? 'Change ' : 'Upload '}
                    </Button>
                    <input

                      id="image-upload-input"
                      type='file'
                      hidden
                      accept='image/*'
                      onChange={handleImageUpload}

                    />

                    {/* Register the file manually with RHF for validation */}
                    <input
                      type="hidden"
                      {...register('profilePicture')}
                    />
                    {selectedImage && (
                      <Typography variant="caption" color="textSecondary">
                        Selected
                      </Typography>
                    )}
                    {imagePreview && (
                      <Avatar
                        src={imagePreview}
                        // sx={{ width: 100, height: 100 }}
                        sx={{ '@media(max-width:400px)': { width: 50, height: 50 }, width: { xs: 100, md: 80, lg: 100 }, height: { xs: 100, md: 80, lg: 100 } }}
                        alt="Employee Preview"
                      />
                    )}
                  </Box>
                  {errors.profilePicture && (
                    <Typography color="error" variant="caption">
                      {errors.profilePicture.message}
                    </Typography>
                  )}
                </Grid>


              </Grid>
            </Grid>

            <Grid size={{ xs: 12, md: 8 }} sx={{ p: 2, boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }} spacing={2}>
              <Typography variant='h6' sx={{ fontSize: { xs: "1.5rem", lg: "2rem" } }} mb={2} >  Job Information  </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <TextField label="Employee ID" type='text' fullWidth disabled={isEditMode} variant="outlined" {...register("empId")} error={!!errors.empId} helperText={errors.empId?.message} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <TextField label="Designation" type='text' fullWidth variant="outlined"  {...register("designation")} error={!!errors.designation} helperText={errors.designation?.message} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <TextField label="Department" type='text' fullWidth variant="outlined" {...register("department")} error={!!errors.department} helperText={errors.department?.message} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <TextField label="Joining date" type='date' fullWidth variant="outlined" InputLabelProps={{ shrink: true }} {...register("joiningDate")} error={!!errors.joiningDate} helperText={errors.joiningDate?.message} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 6 }} >
                  <TextField label="Employee Type" select fullWidth variant="outlined" value={watchedEmployeeType || ""}   {...register("employeeType")} error={!!errors.employeeType} helperText={errors.employeeType?.message}>
                    <MenuItem value="">Select Employee Type</MenuItem>
                    <MenuItem value="Full Time">Full Time</MenuItem>
                    {/* <MenuItem value="Part Time">Part Time</MenuItem> */}
                    <MenuItem value="Intern">Intern</MenuItem>
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <TextField label="Work Location" type='text' fullWidth variant="outlined" {...register("workLocation")} error={!!errors.workLocation} helperText={errors.workLocation?.message} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 6 }} >
                  <TextField label="Status" select fullWidth variant="outlined" value={watchedStatus || ""}   {...register("status")} error={!!errors.status} helperText={errors.status?.message}>
                    <MenuItem value="">Select Status</MenuItem>
                    <MenuItem value="Active">Active</MenuItem>
                    {/* <MenuItem value="Inactive">Inactive</MenuItem> */}
                    <MenuItem value="On Leave">On Leave</MenuItem>
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <TextField label="Manager name or ID" type='text' fullWidth variant="outlined" {...register("managerNameOrId")} error={!!errors.managerNameOrId} helperText={errors.managerNameOrId?.message} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isAdmin}
                        onChange={(e) => {
                          setIsAdmin(e.target.checked);
                          setValue("isAdmin", e.target.checked, { shouldValidate: true, shouldDirty:true });
                        }}
                        color="primary"
                      />
                    }
                    label="Is Admin"
                  />
                  {errors.isAdmin && (
                    <Typography color="error" variant="caption">
                      {errors.isAdmin.message}
                    </Typography>
                  )}

                </Grid>
              </Grid>
            </Grid>

            <Grid size={{ md: 12 }} sx={{ p: 2, boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}>
              <Typography variant='h6' sx={{ fontSize: { xs: "1.5rem", lg: "2rem" } }} mb={2}>  Emergency Contact  </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField label=" Contact Name" type='text' fullWidth variant="outlined"  {...register("emergencyContact.fullName")} error={!!errors.emergencyContact?.fullName} helperText={errors.emergencyContact?.fullName?.message} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField label="Relationship" placeholder='e.g., Spouse, Parent' type='text' fullWidth variant="outlined" {...register("emergencyContact.relationship")} error={!!errors.emergencyContact?.relationship} helperText={errors.emergencyContact?.relationship?.message} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField label="Phone Number" type='text' fullWidth variant="outlined" {...register("emergencyContact.phoneNumber")} error={!!errors.emergencyContact?.phoneNumber} helperText={errors.emergencyContact?.phoneNumber?.message} />
                </Grid>

              </Grid>
            </Grid>

            {/* Submit Button */}
            <Grid size={{ xs: 12, md: 12 }} sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', flexWrap: "wrap" }}>
                {!isEditMode && <Button disabled={!isDirty} type='button' variant="contained" onClick={() => { reset(); setImagePreview(null); setSelectedImage(null) }} sx={{
                  px: { xs: 1, sm: 2 },
                  py: { xs: 0.5, sm: 1 },
                  fontSize: { xs: '0.7rem', sm: '0.875rem' },
                  minWidth: 0,
                }}>
                  Reset
                </Button>}
                <Button color='error' variant="contained" onClick={handleclick} sx={{
                  px: { xs: 1, sm: 2 },
                  py: { xs: 0.5, sm: 1 },
                  fontSize: { xs: '0.7rem', sm: '0.875rem' },
                  minWidth: 0,
                }}>
                  Cancel
                </Button>
                <Button disabled={(!isDirty && (isEditMode || !isEditMode))}  variant="contained" color="success" type='submit' sx={{
                  px: { xs: 1, sm: 2 },
                  py: { xs: 0.5, sm: 1 },
                  fontSize: { xs: '0.7rem', sm: '0.875rem' },
                  minWidth: 0,
                }}>
                  {isEditMode ? "Update" : "Add "}
                </Button>
                <Snackbar open={snackbarOpen} autoHideDuration={1000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                  <Alert severity='success' variant='filled' sx={{ width: "300px" }} onClose={handleClose}>
                    {snackbarMessage}
                  </Alert>
                </Snackbar>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </form>
    </Box>
  )
}


export default AddEditEmployee