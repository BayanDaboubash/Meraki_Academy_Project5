import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setGymOrCoach, setGymOrCoachPost } from "./../../reducers/infoGymCoch";
import { AddComment, setComment } from "./../../reducers/commints";
import { useHistory, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import io from "socket.io-client";
import jwt from "jsonwebtoken";
import './infoGymCoch.css';
let socket;
const CONNECTION_PORT = "http://localhost:5000";

socket = io(CONNECTION_PORT);
//gymInfo
const GymAndCouchInfo = ({ id }) => {
  const [comments, setAComments] = useState("");
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  // const decoratedOnClick = useAccordionToggle(eventKey, onClick);
  const history = useHistory();
  const role = useParams().id;
  const dispatch = useDispatch();
  const state = useSelector((state) => {
    return {
      token: state.loginReducer.token,
      GymOrCouch: state.infoGymCochReducer.GymOrCouch,
      allPosts: state.infoGymCochReducer.allPosts,
      comments: state.commentsReducer.comments,
    };
  });

  const getSportByType = () => {
    axios.get(`http://localhost:5000/usersInfo/${role}`).then((result) => {
      dispatch(setGymOrCoach(result.data));
    });
  };
  const getAllPosts = () => {
    axios.get(`http://localhost:5000/usersPost1/${role}`).then((result) => {
      dispatch(setGymOrCoachPost(result.data));
      result.data.map((ele) => {
        axios.get(`http://localhost:5000/comments/${ele.post_id}/`).then((result) => {
          result.data.map((elm) => {
            dispatch(setComment([{ postID: ele.post_id, comment: elm.comment, firstName: elm.firstName }]));
          });
        });
      });
    });
  };
  /////socket io
  socket.on("receive_message", (data) => {
    setMessageList([...messageList, data]);
  });

  const connectToRoom = () => {
    //role = rome number
    socket.emit("join_room", role); //raise event
  };

  const sendMessage = () => {
    const user = jwt.decode(state.token);
    const messageContent = {
      role,
      content: {
        author: user.firstName,
        message,
      },
    };

    socket.emit("send_message", messageContent); //raise event
    setMessageList([...messageList, messageContent.content]);
    setMessage("");
  };

  const addToFav = async () => {
    const postId = "";
  };

  //////////////////////////// end socket io ...
  useEffect(() => {
    getSportByType();
    getAllPosts();
    connectToRoom();
  }, []);

  return (

    <div className="GymCooch">
      <div className="hamish"></div>
      <div className="devDes">
        <div>
          <img className='ImgCoachGym' src={state.GymOrCouch && state.GymOrCouch[0].image} alt=""></img>
        </div>
        <div className="buttonLeft">
          <Button className="styleButton12" variant="outline-dark">video call</Button>
          <Button
            className="styleButton12" variant="outline-dark"
            onClick={async () => {
              const user = await jwt.decode(state.token);
              console.log("user", user);
              history.push(`/chat/${role}/${user.userId}`);
            }}
          >
            chat
          </Button>
        </div>
        <div></div>
        <div className="NameLabel">{state.GymOrCouch && state.GymOrCouch[0].firstName + `  ` + state.GymOrCouch[0].lastName}</div>
        <div className="DesLabel">{state.GymOrCouch && state.GymOrCouch[0].description}</div>
      </div>


      <div className="devPosts">

        <div>
          {state.allPosts &&
            state.allPosts.map((ele) => {
            console.log('photo............',ele.photo);
              return (
                <div className="postPhotoInfoPage">
                  <div >
                    <img alt="postPhoto" src={ele.photo} height="150" width="100%" />
                    <Button
                    className="styleButton12  favButton" variant="outline-dark"
                      onClick={async () => {
                        const user = jwt.decode(state.token);
                        console.log("user", user);
                        const userID = user.userId;
                        const postID = ele.post_id;
                        const a = await axios.post("http://localhost:5000/favorite", {
                          userID,
                          postID,
                        });
                      }}
                    >
                      Add to favorite
                    </Button>
                  </div>
                  <div className="colPostAndComments">
                    <div className="row1Post">
                      <p>{ele.post}</p>
                    </div>
                    <div className="row2Comments">
                      <p>
                        Comments :{" "}
                        {state.comments &&
                          state.comments.map((elem) => {
                            if (elem[0].postID === ele.post_id) {
                              return (
                                <div>
                                  <p>{elem[0].firstName}</p>
                                  <p>{elem[0].comment}</p>
                                </div>
                              );
                            }
                          })}
                      </p>
                    </div>
                    <input
                      onChange={(e) => {
                        setAComments(e.target.value);
                      }}
                      placeholder="comment here"
                    ></input>
                    <button
                      onClick={() => {
                        dispatch(
                          AddComment([
                            {
                              postID: ele.post_id,
                              comment: comments,
                              // firstName: elm.firstName,
                            },
                          ])
                        );
                      }}
                    >
                      add commints
                    </button>
                    All Posts :{" "}
                    
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <div className="devChat">
        {messageList.map((ele, i) => {
          return (
            <h3 key={i}>
              {ele.author} {ele.message}
            </h3>
          );
        })}
        <textarea type="text" placeholder="Write your message here ..." onChange={(e) => setMessage(e.target.value)} />
        <button onClick={sendMessage}>Send</button>

      </div>
      <div className="haish"></div>
    </div>



  );
};

export default GymAndCouchInfo;

