import React, { useEffect, useState } from 'react';
import { signInApi } from '../api/authApi';
import CommonModal from '../components/Modal/CommonModal';
import { loginSuccess } from '../store/actions/authActions';
import ResetPassword from './ResetPassword';
import { useDispatch, useSelector } from 'react-redux';
import SocialLoginButtons from '../components/Auth/SocialLoginButtons';
import './AuthModal.css';

const Login = ({ isOpen, onClose, openSignup }) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isResetOpen, setIsResetOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      setEmail('');
      setPassword('');
    }
  }, [isLoggedIn]);

  const handleLogin = async () => {
    try {
      const response = await signInApi(email, password);
      const accessToken = response.headers.authorization?.replace('Bearer ', '');

      dispatch(
        loginSuccess(
          accessToken,
          response.data
        )
      );

      onClose();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <CommonModal isOpen={isOpen} onClose={onClose}>
        <div className="auth-modal">
          <h2 className="auth-title">로그인</h2>

          <div className="auth-form">
            <input
              className="auth-input"
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="auth-input"
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleLogin();
              }}
            />

            <button className="auth-primary-button" onClick={handleLogin}>
              로그인
            </button>
          </div>

          <div className="auth-helper-row">
            <span
              className="auth-link"
              onClick={() => setIsResetOpen(true)}
            >
              비밀번호를 잊으셨나요?
            </span>
          </div>

          <SocialLoginButtons />

          <p className="auth-footer-text">
            계정이 없으신가요?{' '}
            <span
              className="auth-link"
              onClick={() => {
                onClose();
                openSignup();
              }}
            >
              회원가입
            </span>
          </p>
        </div>
      </CommonModal>

      <ResetPassword
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
      />
    </>
  );
};

export default Login;