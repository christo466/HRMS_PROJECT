
import { useDispatch } from 'react-redux';
import { Button } from '@mui/material';
import { logoutUser } from '../../store/logout';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        dispatch(logoutUser()).then(() => {
            navigate('/'); 
        });
    };

    return (
        <Button
            variant="contained"
            color="secondary"
            onClick={handleLogout}
        >
            Logout
        </Button>
    );
};

export default LogoutButton;
