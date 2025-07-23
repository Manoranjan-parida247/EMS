// src/components/LoginPage.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Box, Button, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import { Visibility, VisibilityOff } from "@mui/icons-material";


const schema = yup.object().shape({
    email: yup.string().email("Invalid Email").required("Email is required"),
    password: yup.string().min(6).required("Password is required"),
});

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const handleTogglePassword = () => {
        setShowPassword((prevState) => !prevState);
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,

    } = useForm({
        defaultValues: ({
            email: "admin@example.com",
            password: "Admin@123"
        }),
        resolver: yupResolver(schema),
    });

    const onSubmit = (data) => {
        const result = login(data.email, data.password);
        if (result.success) {
            navigate("/employees");
        } else {
            setError("root", { message: result.message });
        }
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
            <Box
                display="flex"
                flexDirection="column"
                maxWidth={450}
                padding={4}
                boxShadow={3}
                borderRadius={2}
                className="login-page"
                sx={{
                    '@media (max-width:450px)': {
                        boxShadow:0
                    }
                }}

            >
                <Box sx={{
                    width: 48, height: 48, mx: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1,
                }} > <PeopleAltOutlinedIcon color="primary" fontSize="large" /> </Box>
                <Typography variant="h4" marginBottom={1} component='div' sx={{ display: "flex", justifyContent: "center", fontWeight: "bold", fontSize: { xs: "1.5rem", sm: "2rem" } }}>
                    Welcome Back
                </Typography>

                <Typography variant="body2" color="text.secondary" marginBottom={1} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    Sign in to your Employee Management System
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        label="Email "
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        {...register("email")}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        placeholder="email address"
                    />

                    <TextField
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        {...register("password")}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        placeholder="* * * * * * * * *"
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleTogglePassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    {errors.root && (
                        <Typography color="error" fontSize="0.875rem">
                            {errors.root.message}
                        </Typography>
                    )}

                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        type="submit"
                        sx={{ marginTop: 2 }}
                    >
                        Login
                    </Button>
                </form>
            </Box>
        </Box>
    );
};

export default LoginPage;
