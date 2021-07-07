import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSports, getSport } from "../../reducers/sports";
import { setToken } from "../../reducers/login";
import { useHistory } from "react-router-dom";
import { Carousel, Card, Button, Row, Col } from "react-bootstrap";
import jwt from "jsonwebtoken";
import axios from "axios";
import "./dashboard.css";

const Dashboard = () => {
  const [type, setType] = useState("");
  const history = useHistory();
  localStorage.setItem("type", type);

  const state = useSelector((state) => {
    return {
      token: state.loginReducer.token,
      user: state.loginReducer.user,
      loggedIn: state.loginReducer.loggedIn,
      sports: state.sportReducer.sports,
    };
  });
  const dispatch = useDispatch();
  useEffect(() => {
    getAllSports();
    saveToken(localStorage.getItem("token"));
  }, []);

  function saveToken(token) {
    const user = jwt.decode(token);
    console.log("token decoded", user);
    if (user) {
      dispatch(setToken({ token, user, loggedIn: true }));
    }
  }

  const getAllSports = () => {
    axios
      .get("http://localhost:5000/sports")
      .then((result) => {
        if (result.length !== 0) {
          dispatch(setSports(result.data));
        } else {
          return "No Sports are found";
        }
      })
      .catch((err) => {
        throw err;
      });
  };

  const getSportByType = (e) => {
    axios.get(`http://localhost:5000/sport/${e.target.id}`).then((result) => {
      setType(e.target.id);
      dispatch(setSports(result.data));
      history.push(`/sports`);
      console.log("result.data....dashboard....", result.data);
    });
  };

  const getSportByTypeImage = (e) => {
    axios.get(`http://localhost:5000/sport/${e.target.alt}`).then((result) => {
      setType(e.target.alt);
      dispatch(setSports(result.data));
      history.push(`/sports`);
      console.log("result.data....dashboard....", result.data);
    });
  };

  // you could see the state by
  console.log("úser", state);
  return (
    <>
      <Carousel fade>
        <Carousel.Item>
          <img
            className="d-block w-100 imgH"
            src="https://www.davidlloyd.co.uk/cms/images/softwire-david-lloyd/image/upload/f_auto/v1/Tennis/tennis-hero.jpg"
            alt="Tennis"
          />
          <Carousel.Caption>
            <h3>Tennis</h3>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100 imgH"
            src="https://www.tributeboxing.com.au/uploads/slideshow/1536301415qkedwof37eb8x3o8qejg0s80h2s4kd.jpg"
            alt="Boxing"
          />
          <Carousel.Caption>
            <h3>Boxing</h3>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100 imgH"
            src="https://www.runtastic.com/blog/wp-content/uploads/2018/05/thumbnail_1200x800-1-1024x683.jpg"
            alt="Running"
          />
          <Carousel.Caption>
            <h3>Running</h3>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100 imgH"
            src="https://www1.health.gov.au/internet/main/publishing.nsf/AttachmentsByTitle/sport-national-integrity-of-sport-unit-carousel-images/$FILE/10612%20Sport%20images19.jpg"
            alt="Swimming"
          />
          <Carousel.Caption>
            <h3>Swimming</h3>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100 imgH"
            src="https://www.polar.com/sites/default/files/static/categories/team_sports-desktop.jpg"
            alt="Football"
          />
          <Carousel.Caption>
            <h3>Football</h3>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100 imgH"
            src="https://cdn.workgreat.orchardroad.org/wp-content/uploads/2018/04/Battle-Ropes-900x450.jpg"
            alt="Gym"
          />
          <Carousel.Caption>
            <h3>Gym</h3>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      <div className="padd">
        <Row md={3} className="g-4">
          {state.sports.map((elem, i) => (
            <Col>
              <Card
                style={{ width: "28rem", margin: "2erm" }}
                className="newMarg"
              >
                <Card.Img
                  variant="top"
                  src={elem.photo}
                  alt={elem.type}
                  className="imageCard pointer"
                  onClick={getSportByTypeImage}
                />
                <Card.Body>
                  <Card.Title id={elem.type} onClick={getSportByType} className="pointer centerText boldStyle">
                    {elem.type}
                  </Card.Title>
                  <Card.Text className="centerText descriptionStyle">{elem.description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
};

export default Dashboard;
