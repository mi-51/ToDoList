//ローカルストレージ準備
let listItems = [];
const storage = localStorage;

//要素取得のための変数
const todoValue = document.getElementById("js-todo-ttl"); //入力データを取得
const todoRegister = document.getElementById("js-register-btn"); //登録するボタン取得
const todoList = document.getElementById("js-todo-list"); //未完リストのul取得
const doneList = document.getElementById("js-done-list"); //完了リストのul取得
const todoAllRemove = document.getElementById("js-allremove-btn"); //すべてのタスクを削除するボタン取得

/* ----------------------
ToDoリストを作る関数。
引数でitem（ローカルストレージに保存するデータオブジェクト）を指定
---------------------- */
const createTodoList = (item) => {
  const litag = document.createElement("li");
  const ptag = document.createElement("p");
  const todo = document.createTextNode(item.todoValue);

  //ul>li>pを作る
  ptag.appendChild(todo);
  litag.appendChild(ptag);
  if (item.isDone === false) {
    todoList.appendChild(litag);
  } else {
    doneList.appendChild(litag);
    litag.setAttribute("class", "done-item");
  }

  //ボタンを入れるdiv要素追加
  const btn_box = document.createElement("div");
  btn_box.setAttribute("class", "btn-box");
  litag.appendChild(btn_box);

  //完了<-->戻すトグルボタン要素追加
  const togglebtn = document.createElement("button");

  if (item.done === false) {
    //もし未完了タスク判定なら完了ボタン追加
    togglebtn.innerHTML = "完了";
    btn_box.appendChild(togglebtn);
  } else {
    //もし完了タスク判定なら戻すボタン追加
    togglebtn.innerHTML = "戻す";
    btn_box.appendChild(togglebtn);
  }
  //完了or戻す機能追加
  togglebtn.addEventListener("click", () => {
    toggleTodo(togglebtn);
  });

  //削除ボタン追加
  const delbtn = document.createElement("button");
  delbtn.innerHTML = "削除";
  btn_box.appendChild(delbtn);

  //削除機能追加
  delbtn.addEventListener("click", () => {
    deleteTodo(delbtn);
  });
};

/* ----------------------
リロードでローカルストレージ内のデータを呼び出す
---------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const json = storage.store;
  if (json == undefined) {
    return;
  }
  listItems = JSON.parse(json);

  for (const item of listItems) {
    createTodoList(item);
  }
});

/* ----------------------
登録ボタンを押した時のイベント
---------------------- */
todoRegister.addEventListener("click", () => {
  if (todoValue.value !== "") {
    //入力されたタスク文字列と同様のタスクがすでに登録されているか検索
    const registeredValue = listItems.find(
      (item) => item.todoValue == todoValue.value
    );

    //以下の条件分岐で登録済みのタスクと一致する文字列のタスク登録を禁止する
    if (regiValue === undefined) {
      //データをオブジェクトで保存
      let item = {};
      item.todoValue = todoValue.value; //やることの文字列
      item.done = false; //完了かどうかのプロパティ
      item.delete = false; //削除したかどうかのプロパティ

      //配列をJSONにして保存
      listItems.push(item);
      storage.store = JSON.stringify(listItems);

      //ToDoリストを作る
      createTodoList(item);

      //inputを空にする（プログラムの一番最後）
      todoValue.value = "";
    } else {
      alert(
        "タスクが重複しているため登録できません。別の名前で登録してください。"
      );
    }
  }
});

//ローカルストレージ更新の関数
const updateValue = (btnName, property, value, filter) => {
  const getParent = btnName.closest("div");
  const todoTxt = getParent.previousElementSibling;
  const changeValue = listItems.find(
    (item) => item.todoValue == todoTxt.textContent
  );
  changeValue[property] = value;

  if (filter) {
    //ToDoリストオブジェクトのdeleteプロパティがfalseだけのデータでフィルターをかける
    const newlistItems = listItems.filter((item) => item[property] !== true);
    listItems = newlistItems; //削除したデータを除いたオブジェクトを入れ直す
  }
  storage.store = JSON.stringify(listItems); //ローカルストレージに保存
};

/* ----------------------
削除ボタンを押した時の処理関数
---------------------- */
const deleteTodo = (delbtn) => {
  const delconfirm = this.confirm(
    "本当に削除しますか？この実行は取り消せません。"
  );
  if (delconfirm === true) {
    const choseTodo = delbtn.closest("li"); //押した要素に一番近いliタグを取得

    //
    if (choseTodo.classList.contains("done-item")) {
      doneList.removeChild(choseTodo);
    } else {
      todoList.removeChild(choseTodo);
    }

    //ロールストレージのオブジェクトプロパティの更新
    updateValue(delbtn, "isDeleted", true, true);
  }
};

/* ----------------------
完了or戻すボタンを押した時の処理関数
---------------------- */
const toggleTodo = (togglebtn) => {
  const toggleTodo = togglebtn.closest("li");

  //ボタンが完了だったとき
  if (togglebtn.innerHTML === "完了") {
    //完了したリストのクラス名を変更して完了ボックスへ移動
    toggleTodo.setAttribute("class", "done-item");

    //ロールストレージのオブジェクトプロパティの更新。
    updateValue(togglebtn, "isDone", true, false);

    //リストを移動させて完了を戻すに変更
    doneList.appendChild(toggleTodo);
    togglebtn.innerHTML = "戻す";
  }
  //ボタンが戻すだったとき
  else if (togglebtn.innerHTML === "戻す") {
    toggleTodo.setAttribute("class", ""); //戻すを押したリストのクラス名を取る

    //ロールストレージのオブジェクトプロパティの更新。
    updateValue(togglebtn, "isDone", false, false);

    //リストを移動させて戻すを完了に変更
    todoList.appendChild(toggleTodo);
    togglebtn.innerHTML = "完了";
  } else {
    alert("正常に処理できませんでした。リロードをお試しください。");
  }
};

/* ------------------------
全てのタスクを削除するボタン処理
--------------------------*/
todoAllRemove.addEventListener("click", () => {
  const allrmconfirm = this.confirm(
    "【重要!!】本当にすべてのタスクを削除しますか？削除したデータは復元できません。"
  );
  if (allrmconfirm) {
    delete storage.store;
    location.reload();
  }
});
