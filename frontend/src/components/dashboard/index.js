import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setSports, getSport } from '../../reducers/sports';
import { setToken } from '../../reducers/login';
import { useHistory } from "react-router-dom";
import jwt from 'jsonwebtoken';
import axios from 'axios';

const Dashboard = () => {
	const [type, setType] = useState("");
	const history = useHistory();
	localStorage.setItem("type", type);

	const state = useSelector(state => {
		return {
			token: state.loginReducer.token,
			user: state.loginReducer.user,
			loggedIn: state.loginReducer.loggedIn,
			sports: state.sportReducer.sports
		}
	})
	const dispatch = useDispatch();
	useEffect(() => {
		getAllSports();
		saveToken(localStorage.getItem('token'));
	}, []);

	function saveToken(token) {
		const user = jwt.decode(token);
		console.log('token decoded', user)
		if (user) {
			dispatch(setToken({ token, user, loggedIn: true }));
		}
	}

	const getAllSports = () => {
		axios.get("http://localhost:5000/sports")
			.then((result) => {
				if (result.length !== 0) {
					dispatch(setSports(result.data));
				} else {
					return 'No Sports are found'
				}
			}).catch((err) => {
				throw err;
			});
	}

	const getSportByType =  (e) => {
		axios.get(`http://localhost:5000/sport/${e.target.value}`)
		.then((result)=>{
			setType(e.target.value);
			dispatch(setSports(result.data));
			history.push(`/sports`);
			console.log("result.data....dashboard....",result.data)
		})
	}

	// you could see the state by 
	console.log('úser', state)
	return <> {state.loggedIn ?
		<div className="App">
			<h2>Dashboard  for user with Id (  {state.user.userId} )</h2>
			<h3>All sports</h3>
			<div>{state.sports.map((elem, i) => (
				<div key={i}>
					<p >Sport type:{elem.type}</p>
					<p >Sport type:{elem.description}</p>
					<img src={elem.photo} alt={elem.type} height="100" width="100" />
					<input type="button" value={elem.type} onClick={getSportByType}></input>
				</div>
			))}</div>
		</div> : <div>You Are Logged out</div>}
	</>;
};

export default Dashboard;

