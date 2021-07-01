import React from "react";
import { Route, Switch } from "react-router-dom";

//component
import SignUp from "./components/auth/signUp";
import BeforeSignUp from "./components/auth/signUp/signUp";
import Login from "./components/auth/login/index";
import Navigation from "./components/navigation/index";
import Dashboard from "./components/dashboard/index";
import Members from "./components/members/members";
import Post from "./components/post/post";
import ViewPost from './components/viewPost/viewPost';
import Sport from "./components/sport/sport";
import GymAndCouch from "./components/gym&couchbyType/gymCouch";

const App = () => {
  return (
    <div className="App">
      <Navigation />
      <Route exact path="/register" component={BeforeSignUp} />
      <Route path="/register/:id" component={SignUp} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/dashboard" component={Dashboard} />
      <Route exact path="/allMembers" component={Members} />
      <Route exact path="/posts" component={Post} />
      <Route exact path="/post" component={ViewPost} />
      <Route exact path="/sports" component={Sport} />
      <Route exact path="/Gym" component={GymAndCouch} />
      <Route exact path="/Couch" component={GymAndCouch} />
    </div>
  );
};

export default App;