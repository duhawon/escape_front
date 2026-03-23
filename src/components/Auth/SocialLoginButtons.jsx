import React from 'react';
import { API_BASE_URL } from '../../api-config';

const SocialLoginButtons = ({ showDivider = true }) => {
  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
  };

  return (
    <>
      {showDivider && (
        <div className="auth-divider">
          <span>또는</span>
        </div>
      )}

      <div className="social-login-group">
        <button
          type="button"
          className="social-login-button google"
          onClick={handleGoogleLogin}
        >
          <span className="social-login-icon">G</span>
          <span>Google로 계속하기</span>
        </button>

        {/*
          나중에 카카오 추가 시
          window.location.href = `${API_BASE_URL}/oauth2/authorization/kakao`;
        */}
        {/*
        <button
          type="button"
          className="social-login-button kakao"
          onClick={() => {
            window.location.href = `${API_BASE_URL}/oauth2/authorization/kakao`;
          }}
        >
          <span className="social-login-icon">K</span>
          <span>Kakao로 계속하기</span>
        </button>
        */}

        {/*
          나중에 네이버 추가 시
          window.location.href = `${API_BASE_URL}/oauth2/authorization/naver`;
        */}
        {/*
        <button
          type="button"
          className="social-login-button naver"
          onClick={() => {
            window.location.href = `${API_BASE_URL}/oauth2/authorization/naver`;
          }}
        >
          <span className="social-login-icon">N</span>
          <span>Naver로 계속하기</span>
        </button>
        */}
      </div>
    </>
  );
};

export default SocialLoginButtons;