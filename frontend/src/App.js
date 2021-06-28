import React from 'react';
import { Route } from 'react-router-dom';
import Login from './components/auth/login/index';

const App = () => {
	return <div className="App">App component
		<Route exact path="/login" component={Login} />
	</div>;
};

export default App;
