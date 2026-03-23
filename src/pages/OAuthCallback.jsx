import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { exchangeOAuthCodeApi } from '../api/authApi';
import { loginSuccess } from '../store/actions/authActions';

const OAuthCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const code = searchParams.get('code');

      if (!code) {
        alert('OAuth 로그인 코드가 없습니다.');
        navigate('/');
        return;
      }

      try {
        const response = await exchangeOAuthCodeApi(code);

        const accessToken = response.headers.authorization?.replace('Bearer ', '');

        if (!accessToken) {
          throw new Error('access token이 없습니다.');
        }

        dispatch(
          loginSuccess(
            accessToken,
            response.data
          )
        );

        navigate('/');
      } catch (error) {
        console.error(error);
        alert('소셜 로그인 처리에 실패했습니다.');
        navigate('/');
      }
    };

    handleOAuthCallback();
  }, [dispatch, navigate, searchParams]);

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      로그인 처리 중...
    </div>
  );
};

export default OAuthCallback;