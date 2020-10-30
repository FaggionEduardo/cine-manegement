// este arquivo define as rotas e suas permiçoes 
import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import EditUser from './pages/EditUser';
import EditUserGer from './pages/EditUserGer';
import RelMovies from './pages/RelMovies';
import RelClientes from './pages/RelClientes';
import Rooms from './pages/Rooms';
import Users from './pages/Users';
import Movies from './pages/Movies';
import Sessions from './pages/Sessions';
import Cadastro from './pages/Cadastro';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Home from './pages/Home';
import Historico from './pages/Historico';
import AuthApi from "./AuthApi"

const Routes = () => {
  const Auth =React.useContext(AuthApi)

  return(
  <BrowserRouter>
    <Switch>
      <ProtectedLogin auth={Auth.auth} path="/" exact component={Login} />
      <ProtectedLogin auth={Auth.auth} path="/cadastro" exact component={Cadastro} />
      <ProtectedRoute auth={Auth.auth} path="/editUserGer" exact component={EditUserGer} />
      <ProtectedRoute auth={Auth.auth} path="/rooms" exact component={Rooms} />
      <ProtectedRoute auth={Auth.auth} path="/relmovies" exact component={RelMovies}/>
      <ProtectedRoute auth={Auth.auth} path="/relclientes" exact component={RelClientes}/>
      <ProtectedRoute auth={Auth.auth} path="/users" exact component={Users}/>
      <ProtectedRoute auth={Auth.auth} path="/movies" exact component={Movies}/>
      <ProtectedRoute auth={Auth.auth} path="/sessions" exact component={Sessions}/>
      <ProtectedUserRoute auth={Auth.auth} path="/home" exact component={Home}/>
      <ProtectedUserRoute auth={Auth.auth} path="/historico" exact component={Historico}/>
      <ProtectedUserRoute auth={Auth.auth} path="/editUser" exact component={EditUser}/>
      <ProtectedUserRoute auth={Auth.auth} path="/cart/:id" exact component={Cart}/>
    </Switch>
  </BrowserRouter>
)
};
// proteje rotas de gerente
const ProtectedRoute=({auth, component:Component,...rest})=>{
  return(
    <Route {...rest}
    render ={()=>auth==1 ?(
      <Component/>
    ):
    (
      auth!==2 ? <Redirect to="/"/> : <Redirect to="/home"/>
      
    )
  
  }
    />
  )
}
// proteje rotas de usuario
const ProtectedUserRoute=({auth, component:Component,...rest})=>{
  return(
    <Route {...rest}
    render ={()=>auth==2 ?(
      <Component/>
    ):
    (
      auth!==1 ? <Redirect to="/"/> : <Redirect to="/editUserGer"/>
      
    )
  
  }
    />
  )
}
// proteje rotas de login
const ProtectedLogin=({auth, component:Component,...rest})=>{
  return(
    <Route {...rest}
    render ={()=>auth!==1 ?(
      auth!==2? <Component/> : <Redirect to="/home"/>
      
    ):
    (
      <Redirect to="/editUserGer"/>
    )
  
  }
    />
  )
}

export default Routes;