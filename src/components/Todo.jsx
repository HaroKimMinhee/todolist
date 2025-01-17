import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AddTodo from "./AddTodo";
import { useSelector } from "react-redux";

function Todo() {
  const [list, setList] = useState('');
  const [dup, setDup] = useState(false);
  const [classRoom, setClassRoom] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const limitPage = 5;
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const user = useSelector((state)=>state.user);
  
  useEffect(() => {
    if(!user.isLogined) {
      alert("로그인하고 접속해주세요.")
      navigate('/login');
    }
  }, [user.isLogined])

  async function getTodo() {
    try{
      const result=await axios.get('http://localhost:4000/todo');
      setClassRoom(result.data.reverse());
    } catch(error) {
      toast.error('네트워크 에러 발생했습니다.');
    }
  }

  useEffect(() => {
    getTodo();
  }, []);

  const filteredClassRoom = useMemo(() => {
    if(searchText) {
      return classRoom.filter((data) => {
        return data.name.includes(searchText);
      });
    }
    return classRoom;
  }, [classRoom, searchText]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredClassRoom.length/limitPage);
  }, [filteredClassRoom.length]);

  const slicedClassRoom = useMemo(() => {
    const startIndex = (currentPage -1)*limitPage;
    const endIndex = startIndex + limitPage;
    return filteredClassRoom.slice(startIndex, endIndex);
  }, [currentPage, filteredClassRoom]);

  const totalPeople = useMemo(() => {
    return classRoom.length;
  }, [classRoom]);

  async function addList(e) {
    e.preventDefault();
    inputRef.current.focus();
    if(list.trim()==='') {
      setDup(true);
      setErrorMessage('일정을 입력하셔야 합니다.');
    } else {
      for(let i = 0; i < classRoom.length; i++) {
        if(classRoom[i].list === list) {
          setDup(true);
          setErrorMessage('이미 있는 일정입니다.');
          setList('');
          return;
        }
      }

      try{
        await axios.post('http://localhost:4000/todo', {
          time:new Date().toLocaleDateString(),
          list:list,
        });
        getTodo();
        setDup(false);
        setList('');
        toast.success('일정 추가했습니다~');
      } catch(error) {
        console.log(error);
      }
    }
  }

  async function delTodo(dbId) {
    try{
      await axios.delete(`http://localhost:4000/todo/${dbId}`);
    } catch(error) {
      console.log(error);
    }
    
  }
  return (
    <div>
      <h2 className="fw-bold mt-2 text-center">🤩 To-Do List 🤡</h2>
      <hr/>
      <div>
        <p className="fw-bold" style={{fontSize:'20px'}}>
        전체 게시물 수 :
        </p>
      </div>

      <input
        className="form-control mt-2"
        placeholder="일정 검색어"
        style={{width:'1200px'}}
        value={searchText}
        onChange={(e)=> setSearchText(e.target.value)}
      />
      <hr/>
        <AddTodo
        addList={addList}
        list={list}
        setList={setList}
        inputRef={inputRef}
      />
      <hr/>
      {dup && <p className="text-danger fw-bold">{errorMessage}</p>}
      {slicedClassRoom.length > 0 ? (
        <table className="table">
          <thead>
            <tr className="text-center">
              <th scope='col'>일정 내용</th>
              <th scope="col">기능</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {slicedClassRoom.map((Todo, index) => {
              return(
                <tr className="text-center align-middle" key={index}>
                  <th>{Todo.id}</th>
                  <th>{Todo.time}</th>
                  <td>
                    <button
                      className="btn btn-danger ms-2"
                      onClick={()=> delTodo(Todo.id)}
                      >삭제</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ):(
        <p className="text-danger fw-bold">일정이 없습니다.</p>
      )}
      <hr />
      <nav
        className="d-flex justify-content-center"
        aria-label="Page navigation example"
        >
          <ul className="pagination">
            <li className="page-item">
              <button
                className={currentPage === 1 ? 'page-link disabled': 'page-link'}
                onClick={() => setCurrentPage(currentPage-1)}
                >
                  이전
                </button>
            </li>
            {Array.from({length:totalPages}, (_, index) => {
              return (
                <li className="page-item" key={index}>
                  <button
                    className={
                      currentPage === index +1 ?'page-link active':'page-link'
                    }
                    onClick={() => setCurrentPage(index+1)}
                    >
                      {index+1}
                    </button>
                </li>
              )
            })}
            <li className="page-item">
              <button
                className={
                  currentPage===totalPages? 'page-link disabled':'page-link'
                }
                onClick={()=> setCurrentPage(currentPage+1)}
                >
                  다음
                </button>
            </li>
          </ul>
        </nav>

    </div>
  )
}

export default Todo;