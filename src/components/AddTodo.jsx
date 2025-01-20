function AddTodo({addList, name, setName, inputRef}) {
  return (
    <form onSubmit={addList}>
      <input
        type='text'
        className="form-control"
        placeholder="새로운 일정 입력"
        style={{width:'1000x'}}
        value={name}
        onChange={(e)=> setName(e.target.value)}
        ref={inputRef}
        />
      <button className='btn btn-primary mt-2'>추가</button>
    </form>
  )
}

export default AddTodo;