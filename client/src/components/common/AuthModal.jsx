import { Box, Modal } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setAuthModalOpen } from '../../redux/slices/authModalSlice';
import Logo from './Logo';
import SignIn from './SignIn';
import SignUp from './SignUp';

const actionState = {
    signIn: "signIn",
    signUp: "signUp"
};
const AuthModal = () => {
  const { authModalOpen } = useSelector((state) => state.authModal);

  const dispatch = useDispatch();

  const [action, setAction] = useState(actionState.signIn);
  useEffect(() => {
    if (authModalOpen) setAction(actionState.signIn);
  }, [authModalOpen]);

  const close = () => dispatch(setAuthModalOpen(false));

  const switchAuthState = (state) => setAction(state);
  
  return (
    <Modal open={authModalOpen} onClose={close}>
      <Box sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        maxWidth: "600px",
        padding: 4,
        outline: "none"
      }}>
         <Box sx={{ padding: 4, boxShadow: 24, backgroundColor: "background.paper" }}>
          <Box sx={{ textAlign: "center", marginBottom: "2rem" }}>
            <Logo />
            </Box>
            {action === actionState.signIn && <SignIn switchAuthState={() => switchAuthState(actionState.signIn)} />}
            {/* {action === actionState.signUp && <SignUp switchAuthState={() => switchAuthState(actionState.signUp)} />} */}
          </Box>
      </Box>

    </Modal>
  )
}

export default AuthModal;