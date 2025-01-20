import axios from 'axios';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AddTodo from './AddTodo';
import {useSelector} from "react-redux";

function Todo() {
  const [name, setName] = useState('');
  const [dup, setDup] = useState(false);
  const [classRoom, setClassRoom] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const limitPage = 5;
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if(!user.isLogined) {
      alert("로그인하고 접근해주시기 바랍니다😎")
      navigate('/login');
  
    }
  }, [user.isLogined])
  


  async function getTodo() {
    try {
      const result = await axios.get('http://localhost:4000/todo');
      setClassRoom(result.data.reverse());
    } catch (error) {
      toast.error('네트워크 에러가 발생했습니다.😥');
    }
  }

  useEffect(() => {
    getTodo();
  }, []);

  const filteredClassRoom = useMemo(() => {
    if (searchText) {
      return classRoom.filter((data) => {
        return data.name.includes(searchText);
      });
    }
    return classRoom;
  }, [classRoom, searchText]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredClassRoom.length / limitPage);
  }, [filteredClassRoom.length]);

  const slicedClassRoom = useMemo(() => {
    const startIndex = (currentPage - 1) * limitPage;
    const endIndex = startIndex + limitPage;
    return filteredClassRoom.slice(startIndex, endIndex);
  }, [currentPage, filteredClassRoom]);

  const totalTodo = useMemo(() => {
    return classRoom.length;
  }, [classRoom]);

  async function addList(e) {
    e.preventDefault();
    inputRef.current.focus();
    if (name.trim() === '') {
      setDup(true);
      setErrorMessage('일정은 꼭 입력하셔야 합니다.');
    } else {
      for (let i = 0; i < classRoom.length; i++) {
        if (classRoom[i].name === name) {
          setDup(true);
          setErrorMessage('이미 작성된 일정입니다.');
          setName('');
          return;
        }
      }
      try {
        await axios.post('http://localhost:4000/todo', {
          time: new Date().toLocaleString(),
          name: name,
        });
        getTodo();
        setDup(false);
        setName('');
        toast.success('일정 완료했어요~ 😃');
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function delList(dbID) {
    try {
      await axios.delete(`http://localhost:4000/todo/${dbID}`);
      getTodo();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <h2 className='fw-bold mt-2 text-center'>Todo List🤣</h2>
      <hr />
      <div>
        <p className='fw-bold text-primary' style={{ fontSize: '20px' }}>
          전체 일정 수 : {totalTodo}개
        </p>
      </div>

      <input
        className='form-control mt-2'
        placeholder='일정 검색'
        style={{ width: '1000px' }}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <hr />
      <AddTodo
        addList={addList}
        name={name}
        setName={setName}
        inputRef={inputRef}
      />
      <hr />
      {dup && <p className='text-danger fw-bold'>{errorMessage}</p>}
      {slicedClassRoom.length > 0 ? (
        <table className='table'>
          <thead>
            <tr className='text-center'>
              <th scope='col'>순번</th>
              <th scope='col'>날짜</th>
              <th scope='col'>이름</th>
              <th scope='col'>기능</th>
            </tr>
          </thead>
          <tbody className='table-group-divider'>
            {slicedClassRoom.map((todo, index) => {
              return (
                <tr className='text-center align-middle' key={index}>
                  <th>{todo.id}</th>
                  <td>{todo.time}</td>
                  <td>{todo.name}</td>
                  <td>
                    <button
                      className='btn btn-success'
                      onClick={() => navigate(`/update/${todo.id}`)}
                    >
                      수정
                    </button>
                    <button
                      className='btn btn-danger ms-2'
                      onClick={() => delList(todo.id)}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p className='text-danger fw-bold'>일정이 없습니다.</p>
      )}
      <hr />
      <nav
        className='d-flex justify-content-center'
        aria-label='Page navigation example'
      >
        <ul className='pagination'>
          <li className='page-item'>
            <button
              className={currentPage === 1 ? 'page-link disabled' : 'page-link'}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, index) => {
            return (
              <li className='page-item' key={index}>
                <button
                  className={
                    currentPage === index + 1 ? 'page-link active' : 'page-link'
                  }
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            );
          })}
          <li className='page-item'>
            <button
              className={
                currentPage === totalPages ? 'page-link disabled' : 'page-link'
              }
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Todo;
