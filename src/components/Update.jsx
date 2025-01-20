import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Update() {
  const params = useParams();
  const [stuDate, setBeforDate] = useState({});
  const [afterName, setAfterName] = useState('');
  const Navigate = useNavigate();

  useEffect(() => {
    async function getDate() {
      try {
        const result = await axios.get(
          'http://localhost:4000/todo/' + params.id
        );
        console.log(result.data);
        setBeforDate({
          time: result.data.time,
          name: result.data.name,
        });
        setAfterName(result.data.name);
      } catch (error) {
        console.log(error);
      }
    }
    getDate();
  }, [params.id]);

  async function updateName() {
    if (afterName.trim() === '') {
      alert('빈칸으로 수정할 수 없습니다.');
      return;
    }
    const result = await axios.get('http://localhost:4000/todo');
    result.data.forEach((name) => {
      if (name.name === afterName) {
        alert('중복입니다.!');
        return;
      }
    });
    try {
      await axios.patch('http://localhost:4000/todo/' + params.id, {
        name: afterName,
      });
      Navigate('/test7');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      {}
      <h2 className='fw-bold mt-2 text-center'>Update Page</h2>
      <hr />
      <h4>날짜</h4>
      <p>{stuDate.time}</p>
      <hr />
      <h4>내용</h4>
      <input
        className='form-control'
        style={{ width: '1500px', height: '200px'}}
        value={afterName}
        onChange={(e) => setAfterName(e.target.value)}
      />
      <hr />
      <button className='btn btn-success' onClick={updateName}>
        수정
      </button>
      <button className='btn btn-dark ms-2' onClick={() => Navigate(-1)}>
        취소
      </button>
    </div>
  );
}

export default Update;
