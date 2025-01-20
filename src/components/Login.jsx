import axios from 'axios';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { login } from '../store/userSlice';

const SignUpContainer = styled.div`
  border: 1px black solid;
  border-radius: 20px;
  width: 400px;
`;

function Login() {
  const [userId, setUserId] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function loginHandle() {
    try {
      const result = await axios.get(
        `http://localhost:4000/user/?userid=${userId}&userPassword=${userPassword}`
      );
      if (result.data.length) {
        dispatch(login(userId));
        alert(`${userId}님 환영합니다. 😀`);
        navigate('/todo');
      } else {
        alert(`입력하신 아이디와 비밀번호를 다시 한 번 확인해주세요.`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <SignUpContainer
      className='container text-center mt-3'
      style={{
        border: '1px, black solid',
        borderRadius: '10px',
        width: '400px',
      }}
    >
      <h2 className='mt-3'>로그인😍 </h2>
      <div className='mt-3'>
        <input
          className='from-control'
          placeholder='아이디 입력'
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
      </div>
      <div className='mt-3'>
        <input
          type='password'
          className='from-control'
          placeholder='비밀번호 입력'
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
        />
      </div>
      <div className='my-3'>
        <button className='btn btn-primary' onClick={loginHandle}>
          로그인😍
        </button>
      </div>
    </SignUpContainer>
  );
}

export default Login;
