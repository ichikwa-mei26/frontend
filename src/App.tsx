import { useEffect, useState } from "react";//useEffectとuseStateはReactのフックで、コンポーネントのライフサイクルや状態管理に使用
import "./App.css";
import axios from "axios";//axios は HTTP リクエストを行うためのライブラリ
import { useForm } from "react-hook-form";

type TodoTypes = { //ここでTodoの型の定義
  id: string;
  todo: string;
};

type AddTodoType = { //新しく追加するTodoの構造を定義
  todo: string;
  editTodoName: string;
};

function App() { //APPコンポーネント
  const { register, handleSubmit, reset } = useForm<AddTodoType>();
  const [todos, setTodos] = useState<TodoTypes[]>([]);
  const [isEdit, setIsEdit] = useState({id: "", todo: ""});

  //awaitとはaxios.post が完了するまで、次の行の実行を一時停止します。
  const addTodo =async (event: AddTodoType) => {//新しいTodoをサーバーに追加するためにPOSTクエストを送信
    const { todo } = event;//リクエストが成功すると、新しい Todoアイテムが返され、それをtodosステートに追加します
    console.log(todo); 
    await axios
     .post("http://localhost:3000/add" ,{
      data: {
        todo,
      },
     })
     .then((response) => { //.then: Promiseが解決されたときに実行されるコールバック関数を指定します。
      console.log(response.data);
      const todo = response.data;
      setTodos((preTodos) => [todo, ...preTodos]);//Reactステート更新関数で、現在のtodosステートに新しいtodoを追加します。
     })
     .catch((error) => { //エラーが発生した場合に実行されるコードを含みます。
      console.log(error);
     });
  };

  const deleteTodo = async (id: string) => {
    console.log(id);

    await axios
    .delete("http://localhost:3000/delete", {
      data: {
        id,
      },
    })
    .then((response) => {
      console.log(response);
      const newTodos = todos.filter((todo) => todo.id !== id);
      setTodos(newTodos);
    })
    .catch((e) => {
      console.log(e.message);
      setTodos(todos);
    });
  };

  const editTodo = async ({ editTodoName }: AddTodoType) => {
    await axios
    .put("http://localhost:3000/update", {
      data: {
        id: isEdit.id,
        todo: editTodoName,
      },
    })
    .then((response) => {
      console.log(response.data);
      const newTodos = todos.map((todo) => {
        return todo.id === response.data.id ? response.data : todo;
      });
      setIsEdit({ id: "", todo: "" });
      setTodos(newTodos);
      reset();
    })
    .catch((e) => {
      console.log(e.message);
    });
  };

  useEffect(() => { //コンポーネントがマウントされたときに、サーバーから既存のTodoアイテムを取得するためにGETリクエストを送信します。
    axios.get("http://localhost:3000").then((response) => {
      console.log(response.data.todos);
      const { todos } = response.data;
      setTodos(todos);
    });
  }, []);

  //useForm<AddTodoTypeはフォームの状態管理を提供。
  //フォーム送信時の処理を管理。バリデーション成功時にコールバック関数を呼び出す関数。
  return (
    <>
    <form onSubmit={handleSubmit(addTodo)}>
      <input {...register("todo")} type="text" />
      <button type="submit">add</button>
    </form>
      {todos.map((todo) => (
        <div key={todo.id} style={{ display: "flex" }}>
          {isEdit.id === todo.id ? (
            <form onSubmit={handleSubmit(editTodo)}>
              <input {...register("editTodoName")} type="text" />
              <button>send</button>
            </form>
          ) : (
            <>
            <p>{todo.todo}</p>
            <button
            onClick={() => setIsEdit({ id: todo.id, todo: todo.todo})}
            >
              edit
            </button>
            </>
          )}

          <button onClick={() => deleteTodo(todo.id)}>delete</button>
        </div>
      ))}
    </>
  );
}
//register を使って、フォームの値を管理します。
export default App;