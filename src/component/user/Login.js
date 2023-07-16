import React, { useContext, useEffect } from 'react'
import '../bootstrap/css/sb-admin-2.min.css';
import '../user/Login.scss';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../util/AuthContext';
import { KAKAO_AUTH_URL } from './OAuth'



const Login = () => {

    const redirection = useNavigate();

    const { onLogin, isLoggedIn } = useContext(AuthContext);

    useEffect(() => {
        if (isLoggedIn) {
                setTimeout(() => {
                redirection('/');
            }, 3000);
        }
    }, [isLoggedIn, redirection]);

    const REQUEST_URL = 'http://localhost:8181/api/user/login';

    const fetchLogin = async() => {

     //사용자가 입력한 이메일, 비밀번호 입력 태그 얻어오기
     const $email = document.getElementById('email');
     const $password = document.getElementById('password');


     const res = await fetch(REQUEST_URL, {
        method: 'POST',
        headers: { 'content-type' : 'application/json' },
        body: JSON.stringify({
            email: $email.value,
            password: $password.value
         })

         
    });

    if (res.status === 400) {
        const text = await res.text();
        alert(text);
        return;
    }

    const { token, email } = await res.json();

    // Context API를 사용하여 로그인 상태를 업데이트합니다.
    onLogin(token, email);
    

     //홈으로 리다이렉트
     redirection('/');

}
   

     //로그인 요청 핸들러
     const loginHandler = e => {
        e.preventDefault();

        

        // 서버에 로그인 요청 전송
        fetchLogin();

    }

    //카카오 로그인 요청 핸들러
    const kloginHandler = e => {
        // e.preventDefault();

        

        // 서버에 로그인 요청 전송
        checkToken();

    }

    async function checkToken(code) {
       await fetch(`http://localhost:8181/api/user/callback/kakao?code=${code}`, { 
        method: "GET"
    }) 
    
       .then(res => res.json())             //json으로 받을 것을 명시
       .then(res => {      
                console.log(res);
                console.log(res.data.email);
                console.log(res.data.token);
                
                localStorage.setItem("email", res.data.email);
                localStorage.setItem("token", res.data.token);
                            
      });

          
             //홈으로 리다이렉트
             redirection('/');
        
        
    }
    
    
     

  return (
    <div className="bg-gradient-primary">

        <div className="container">

            {/* <!-- Outer Row --> */}
            <div className="row justify-content-center">

                <div className="col-xl-10 col-lg-12 col-md-9">

                    <div className="card o-hidden border-0 shadow-lg my-5">
                        <div className="card-body p-0">
                            {/* <!-- Nested Row within Card Body --> */}
                            <div className="row">
                                {/* <div className="col-lg-6 d-none d-lg-block bg-login-image"></div> */}
                                <div className="col-lg-6"> 
                                    <div className="p-5">
                                        <div className="text-center">
                                            <h1 className="h4 text-gray-900 mb-4">로그인</h1>
                                        </div>
                                        <form className="user">
                                            <div className="form-group">
                                                <input type="email" className="form-control form-control-user"
                                                    id="email" aria-describedby="emailHelp"
                                                    placeholder="이메일 주소" />
                                            </div>
                                            <div className="form-group">
                                                <input type="password" className="form-control form-control-user"
                                                    id="password" placeholder="비밀번호" />
                                            </div>
                                            <div className="form-group">
                                                <div className="custom-control custom-checkbox small">
                                                    <input type="checkbox" className="custom-control-input" id="customCheck" />
                                                    <label className="custom-control-label" htmlFor="customCheck">기억하기</label>
                                                </div>
                                            </div>
                                            <a href="#" className="btn btn-primary btn-user btn-block" onClick={loginHandler}>
                                                로그인
                                            </a>
                                            <hr />
                                            <div>
                                            <a href={KAKAO_AUTH_URL} className="kakaobtn" onClick={kloginHandler}>
                                                <img src={require('./image/kakao1.png')} alt="카카오로그인" />
                                            </a>
                                            </div>

                                                                                
                                        </form>
                                        <div className="text-center">
                                            <a className="small" href="#">아이디 찾기 </a>/<a className="small" href="#"> 비밀번호 변경</a> 
                                        
                                        <div className="text-center">
                                        <a className="small" href="/join">회원가입</a>
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            
            </div>
        
        </div>
        </div>
       
    </div>

  )
  }




export default Login;
