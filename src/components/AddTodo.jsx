function AddTodo({addList, list, setList, inputRef}) {
  return (
    <form onSubmit={addList}>
      <input
        type='text'
        className="form-control"
        placeholder="새로운 일정 입력"
        style={{width:'1000x'}}
        value={list}
        onChange={(e)=> setList(e.target.value)}
        ref={inputRef}
        />
      <button className='btn btn-primary mt-2'>추가</button>
    </form>
  )
}

export default AddTodo;