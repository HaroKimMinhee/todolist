import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled  from "styled-components";

const SignUpContainer = styled.div`
  border: 1px black solid;
  border-radius: 20px;
  width: 400px;
`

function SignUp() {
  const [userId, setUserId] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const navigate = useNavigate();

  async function signUpHandle() {
  try {
    const totalResult = await axios.get('http://localhost:4000/user');
    const filteredUser = totalResult.data.filter((user) => {
      return (
        user.userId === userId
      )
    })
    if (filteredUser.length) {
      alert('이미 가입된 회원이 존재합니다.')
    } else {
      const result = await axios.post('http://localhost:4000/user', {
        userId: userId,
        userPassword: userPassword
    })
    if (result.status === 200 || result.status === 201) {
      alert('회원가입이 완료되었습니다.')
      navigator('/login')
    } else {
      alert('오류가 있습니다. 다시 시도해주세요.')
    }
  }
  } catch (error) {
    console.log(error);
  }
}
  
  return (
    <SignUpContainer className="container text-center mt-3" 
    style={{
    border: "1px, black solid", 
    borderRadius: "10px", 
    width: "400px",
    }}>
      <h2 className="mt-3">회원가입</h2>
      <div className="mt-3">
        <input 
        className="from-control" 
        placeholder="아이디 입력"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        />
      </div>
      <div className="mt-3">
        <input 
        type="password"
        className="from-control" 
        placeholder="비밀번호 입력"
        value={userPassword}
        onChange={(e) => setUserPassword(e.target.value)}/>
      </div>
      <div className="my-3">
        <button className="btn btn-primary" onClick={signUpHandle}>회원가입</button>
      </div>
    </SignUpContainer>
  )
}

export default SignUp;