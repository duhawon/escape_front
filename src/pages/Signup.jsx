import React, { useState } from 'react';
import { signUpApi } from '../api/userApi';
import CommonModal from '../components/Modal/CommonModal';
import SocialLoginButtons from '../components/Auth/SocialLoginButtons';
import './AuthModal.css';

const Signup = ({ isOpen, onClose, openLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      await signUpApi({
        name,
        email,
        password,
      });

      setName('');
      setEmail('');
      setPassword('');
      onClose();
      alert('회원가입에 성공하였습니다.');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <CommonModal isOpen={isOpen} onClose={onClose}>
      <div className="auth-modal">
        <h2 className="auth-title">회원가입</h2>

        <div className="auth-form">
          <input
            className="auth-input"
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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
              if (e.key === 'Enter') handleSignup();
            }}
          />

          <button className="auth-primary-button" onClick={handleSignup}>
            회원가입
          </button>
        </div>

        <SocialLoginButtons />

        <p className="auth-footer-text">
          이미 가입하셨나요?{' '}
          <span
            className="auth-link"
            onClick={() => {
              onClose();
              openLogin();
            }}
          >
            로그인
          </span>
        </p>
      </div>
    </CommonModal>
  );
};

export default Signup;