import React, { cloneElement, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useHistory } from "react-router-dom";
import {
  setProfile,
  updateProfile,
  deleteProfile,
} from "./../../reducers/profile";
import { decode } from "jsonwebtoken";
const Profile = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const state = useSelector((state) => {
    return {
      profile: state.profileReducers.profile,
    };
  });
  const [edit, setEdit] = useState(false);
  const [message, setMessage] = useState("");
  const [deleteProfile, setDeleteProfile] = useState(true);
  const user = decode(localStorage.getItem("token"));
  useEffect(() => {
    getProfile();
  }, []);
  const getProfile = () => {
    axios
      .get(`http://localhost:5000/users/${user.userId}`)
      .then((res) => {
        console.log(res, "respons");
        dispatch(setProfile(res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const editProfile = (e) => {
    axios
      .put(`http://localhost:5000/users/${e.target.value}`)
      .then((result) => {});
    setEdit(true);
  };

  useEffect(() => {
    getProfile();
  }, [edit]);

  const saveProfile = async (elem, firstName, lastName, image, phone, age) => {
    await axios.put(`http://localhost:5000/users/${elem.user_id}`, {
      firstName,
      lastName,
      image,
      phone,
      age,
    });
    setMessage("save  edit profile");
    setTimeout(() => {
      setEdit(false);
    }, 1000);
    setDeleteProfile(true);
  };
  const deleteProfilea = async (elem) => {
    await axios.put(`http://localhost:5000/user/${elem.user_id}`);
    setMessage("delete Profile");
    setTimeout(() => {
      history.push("/dashboard");
    }, 1000);
  };
  const popup = () => {
    setDeleteProfile(false);
    setMessage("Are you sure you want to delete your profile");
  };
  const cancel = async (elem) => {
    setDeleteProfile(true);
    setMessage("");
    await axios.get(`http://localhost:5000/user/${elem.user_id}`);
  };
  return (
    <>
      {deleteProfile ? (
        <div>
          {edit ? (
            <div>
              {state.profile.map((elem, i) => (
                <form
                  key={i}
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveProfile(
                      elem,
                      e.target.firstName.value,
                      e.target.lastName.value,
                      e.target.image.value,
                      e.target.phone.value,
                      e.target.age.value
                    );
                  }}
                >
                  <label>
                    firstName :
                    <input
                      type="text"
                      name="firstName"
                      defaultValue={elem.firstName}
                    />
                  </label>{" "}
                  <br />
                  <label>
                    lastName :
                    <input
                      type="text"
                      name="lastName"
                      defaultValue={elem.lastName}
                    />{" "}
                  </label>{" "}
                  <br />
                  <label>
                    image:
                    <input
                      type="text"
                      name="image"
                      defaultValue={elem.image}
                    />{" "}
                  </label>
                  <br />
                  <label>
                    phone:
                    <input
                      type="text"
                      name="phone"
                      defaultValue={elem.phone}
                    />{" "}
                  </label>
                  <br />
                  <label>
                    age:
                    <input
                      type="text"
                      name="age"
                      defaultValue={elem.age}
                    />{" "}
                  </label>
                  <br />
                  <button>save changes</button>
                  {message && <div> {message} </div>}
                </form>
              ))}
            </div>
          ) : (
            <div>
              {state.profile.map((elem, i) => (
                <div key={i}>
                  <p> firstName : {elem.firstName}</p>
                  <p> lastName : {elem.lastName}</p>
                  <img src={elem.image} height="100" width="100" /> <br />
                  <p> phone : {elem.phone}</p>
                  <p> age : {elem.age}</p>
                  <button onClick={editProfile} value={elem.user_id}>
                    edit profile
                  </button>
                  <button onClick={popup} value={elem.user_id}>
                    deleted profile
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          {message && <div> {message} </div>}
          {state.profile.map((elem, i) => (
            <form
              key={i}
              onSubmit={(e) => {
                e.preventDefault();
                deleteProfilea(elem);
              }}
            >
              <button>deleted Profile</button>
            </form>
          ))}
          {state.profile.map((elem, i) => (
            <form
              key={i}
              onSubmit={(e) => {
                e.preventDefault();
                cancel(elem);
              }}
            >
              <button>cancel</button>
            </form>
          ))}
        </div>
      )}
    </>
  );
};

export default Profile;
