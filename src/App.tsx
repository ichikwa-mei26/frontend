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
};

function App() { //APPコンポーネント
  const { register, handleSubmit } = useForm<AddTodoType>();
  const [todos, setTodos] = useState<TodoTypes[]>([]);

  //awaitとはaxios.post が完了するまで、次の行の実行を一時停止します。
  const addTodo =async (event: AddTodoType) => {//新しいTodoをサーバーに追加するためにPOSTクエストを送信
    const { todo } = event;//リクエストが成功すると、新しい Todo アイテムが返され、それを todos ステートに追加します
    console.log(todo); 
    await axios
     .post("http://localhost:3000/add" ,{
      data: {
        todo,
      },
     })
     .then((response) => { //.then: Promise が解決されたときに実行されるコールバック関数を指定します。
      console.log(response.data);
      const todo = response.data;
      setTodos((preTodos) => [todo, ...preTodos]);//Reactステート更新関数で、現在のtodosステートに新しいtodoを追加します。
     })
     .catch((error) => { //エラーが発生した場合に実行されるコードを含みます。
      console.log(error);
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
        <p key={todo.id}>{todo.todo}</p>
      ))}
    </>
  );
}
//register を使って、フォームの値を管理します。
export default App;