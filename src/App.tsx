import React, { useState, useEffect } from 'react';
import './App.css';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

import { styled } from '@mui/material/styles';

//独自コンポーネントの設計
const Footer = styled('div')(({ theme }) => ({
  color: "#ffffff",
  background: '#1976d2',
  width: "100%",
  bottom: 0,
  padding: 15,
}));

function App() {
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [ftodos, setFtodos] = useState<Todo[]>([]);

  const tmpTime = new Date();
  const [nowTime, setNowTime] = useState<Time>({hour: tmpTime.getHours(), minutes: tmpTime.getMinutes()});

  type Todo = {
    id: number;           //ユニークキー
    inputValue: string;   //入力値
    finished: boolean;    //完了済みかどうか
  };

  type Time = {
    hour: number;
    minutes: number;
  }

  useEffect(() => {
    setTimeout(() => {
      const time = new Date();

      setNowTime({hour: time.getHours(),minutes: time.getMinutes()})
    }, 2000)
  }, [nowTime]);

  //値が入力されたら値を格納
  const handleChange = (text: string) => {
    setInputValue(text);


  };

  //完了
  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    //空なら何もしない
    if (!inputValue) {
      return;
    }

    const newTodo: Todo = {
      id: new Date().getTime(),
      inputValue: inputValue,
      finished: false,
    };

    setTodos([newTodo, ...todos]);
    setInputValue("");
  };

  const handleEdit = (id: number, inputvalue: string, which: boolean) => {
    if(which){
      const newTodos = todos.map((todo) => {
        if(todo.id === id){
          todo.inputValue = inputvalue;
        }
  
        return todo;
      });
  
      setTodos(newTodos);
    }else{
      const newTodos = ftodos.map((todo) => {
        if(todo.id === id){
          todo.inputValue = inputvalue;
        }
  
        return todo;
      });
  
      setFtodos(newTodos);
    }
  };

  //削除
  const handleDelete = (id: number) => {
    //idが正しくないのは残す。正しいと消す。
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
  };
  const handleDelete2 = (id: number) => {
    //idが正しくないのは残す。正しいと消す。
    const newTodos = ftodos.filter((todo) => todo.id !== id);
    setFtodos(newTodos);
  };

  //完了
  const handleComplete = (id: number) => {
    /* ディープコピー*/
    const deepCopy = todos.map((todo) => ({ ...todo }));
    const deepCopy2 = ftodos.map((todo) => ({ ...todo }));

    const newTodos = deepCopy.filter((todo) => todo.id === id);
    const oldTodos = deepCopy.filter((todo) => todo.id !== id);

    setFtodos(deepCopy2.concat(newTodos));
    setTodos(oldTodos);
  }

  //元に戻す
  const handleReturn = (id: number) => {
    /* ディープコピー*/
    const deepCopy = ftodos.map((todo) => ({ ...todo }));
    const deepCopy2 = todos.map((todo) => ({ ...todo }));

    const newOldtodos = deepCopy.filter((todo) => todo.id !== id);
    const newTodos = deepCopy.filter((todo) => todo.id === id);

    setFtodos(newOldtodos);
    setTodos(deepCopy2.concat(newTodos));
  }

  return (
    <div className="App">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography align="center" variant="h6" component="div" sx={{ flexGrow: 1 }}>
              React on TypeScript Todoリスト
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <Grid container alignItems='center' justifyContent='center' direction="column">
        <Grid item xs={12}>
          <Box component="span" sx={{ p: 2}}>
            <Typography variant="h2" gutterBottom>
              {("0" + nowTime.hour).slice(-2)}:{("0" + nowTime.minutes).slice(-2)}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box component="span" >
            <form onSubmit={(e) => handleSubmit(e)} >
              <Stack spacing={2} direction="row" paddingTop="10px" paddingBottom="10px">
                <TextField id="outlined-basic" sx={{width: '30ch'}}  size="small" label="タスクの入力" variant="outlined" onChange={(e)=> handleChange(e.target.value)} value={inputValue}/>
                <Button variant="contained" color="success" type="submit">作成</Button>
              </Stack>
            </form>
          </Box>
        </Grid>
      </Grid>
      <Grid container alignItems='center' justifyContent='center' direction="column">
        <Grid item xs={10}>
          <Grid container
                direction="row"
                justifyContent="center"
                spacing={1}
          >
            <Grid item xs={5} >
              <Box sx={{width: '100px'}}>
                <Typography variant="h5" style={{color: "#4fc3f7"}} gutterBottom>
                  作業中
                </Typography>
              </Box>
              {todos.map((todo, key) => (
                <Box component="span" sx={{ p: 2}}>
                  <Stack spacing={1} direction="row" key={key} paddingBottom="10px" >
                    <TextField id="outlined-basic"  sx={{width: '36ch'}} size="small" label="タスク名" variant="outlined" onChange={(e)=> handleEdit(todo.id, e.target.value, true)} value={todo.inputValue}/>
                    <Button variant="contained" sx={{width: '7ch'}} onClick={() => handleComplete(todo.id)}>完了</Button>
                    <Button variant="outlined" sx={{width: '7ch'}} onClick={() => handleDelete(todo.id)}>削除</Button>
                  </Stack>
                </Box>
              ))}
            </Grid>
            <Grid item xs={5} >
              <Box sx={{width: '100px'}}>
                <Typography variant="h5" style={{color: "#4caf50"}} gutterBottom>
                  完了
                </Typography>
              </Box>
              {ftodos.map((todo, key) => (
                <Box component="span" sx={{ p: 2}}>
                  <Stack spacing={1} direction="row" key={key} paddingBottom="10px">
                    <TextField disabled id="outlined-basic" sx={{width: '36ch'}} size="small" label="タスク名" variant="outlined" onChange={(e)=> handleEdit(todo.id, e.target.value, false)} value={todo.inputValue}/>
                    <Button variant="contained" sx={{width: '7ch'}} color="error" onClick={() => handleDelete2(todo.id)}>削除</Button>
                    <Button variant="outlined" sx={{width: '7ch'}} onClick={() => handleReturn(todo.id)}>戻す</Button>
                  </Stack>
                </Box>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <div style={{height: '350px'}}></div>
      <Footer>&copy;{new Date().getUTCFullYear()} ゆーろん All rights reserved</Footer>
    </div>
  );
}

export default App;
