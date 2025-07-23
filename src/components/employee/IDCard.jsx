// IDCard.js
import React from 'react';
import {
    Card,
    CardContent,
    Avatar,
    Typography,
    Divider,
    Box,
} from '@mui/material';

const IDCard = React.forwardRef(({ emp }, ref) => {
    return (
        <Card
            ref={ref}
            sx={{
                width: 300,
                height: 270,


                boxShadow: 3,
                padding: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                fontFamily: 'Arial',
                bgcolor: "#afd6e0"
            }}
        >
            <CardContent sx={{ padding: '8px !important', width: '100%' }}>
                <Box display="flex" flexDirection="column" alignItems="center" >
                    <Avatar
                        src={emp.profilePicture}
                        sx={{ width: 80, height: 80, marginBottom: 1, border:"3px solid yellow", borderRadius:1 }}
                    />
                    <Typography variant="h6" fontWeight="bold">
                        {emp.fullName}
                    </Typography>

                </Box>

                <Divider sx={{ my: 1 }} />

                <Box sx={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"flex-start", pl:"2.5rem"}}>
                    <Typography variant="body2" color="text.secondary">
                        ID: {emp.empId}
                    </Typography>
                    <Typography variant="body2">
                        Department: <strong>{emp.department}</strong>
                    </Typography>
                    <Typography variant="body2">
                        Designation: <strong>{emp.designation}</strong>
                    </Typography>
                    <Typography variant="body2">
                        Phone number: <strong>{emp.phoneNumber}</strong>
                    </Typography>
                    <Typography variant="body2">
                        email: <strong>{emp.email}</strong>
                    </Typography>
                    
                </Box>
            </CardContent>
        </Card>
    );
});

export default IDCard;
