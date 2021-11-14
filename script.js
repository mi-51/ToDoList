const todoValue = document.getElementById("js-todo-ttl"); //入力データを取得
const todoRegister = document.getElementById("js-register-btn"); //登録するボタン取得
const todoDelete = document.getElementById("js-del-btn");//削除ボタンのid取得
const todoDone = document.getElementById("js-done-btn");//完了ボタンのid取得
const todoList = document.getElementById("js-todo-list"); //未完リストのul取得
const doneList = document.getElementById("js-done-list"); //完了リストのul取得

todoRegister.addEventListener('click', () => {
  if (todoValue.value !== '') {
    const todo = document.createTextNode(todoValue.value);
    todoValue.value = '';
    const litag = document.createElement('li');
    const ptag = document.createElement('p');

    //ul>li>p構造を作る
    ptag.appendChild(todo);
    litag.appendChild(ptag);
    todoList.appendChild(litag);

    //ボタンを入れるdiv要素追加
    const btn_box = document.createElement('div');
    btn_box.setAttribute('class', 'btn-box');
    litag.appendChild(btn_box);

    //完了ボタン追加
    const donebtn = document.createElement('button');
    donebtn.setAttribute('id', 'js-done-btn');
    donebtn.innerHTML = '完了';
    btn_box.appendChild(donebtn);

    //削除ボタン追加
    const delbtn = document.createElement('button');
    delbtn.setAttribute('id', 'js-del-btn');
    delbtn.innerHTML = '削除';
    btn_box.appendChild(delbtn);

    //削除機能追加
    delbtn.addEventListener('click', () => {
      deleteTodo(delbtn);
    });

    //完了機能追加
    donebtn.addEventListener('click', () => {
      doneTodo(donebtn);
    });
  }
});

const deleteTodo = (delbtn) => {
  const delconfirm = this.confirm('本当に削除しますか？');
  if (delconfirm === true) {
    const choseTodo = delbtn.closest('li');
    if (choseTodo.classList.contains('done-item')) {
      doneList.removeChild(choseTodo);
    } else {
      todoList.removeChild(choseTodo);
    }
  }
};

const doneTodo = (donebtn) => {
  const doneTodo = donebtn.closest('li');
  doneTodo.setAttribute('class', 'done-item');
  doneList.appendChild(doneTodo);
  donebtn.remove();
};



