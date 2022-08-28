import React, { useState, useEffect } from "react";
import styles from "./Classroom.module.css";
import NavBar from "../components/NavBar.js";
import Circle from "../components/Circle.js";
import { useParams } from "react-router-dom";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import axios from "axios";
import { version } from "react";
let stompClient = null;

function Room() {
  const params = useParams();
  const [username, setUsername] = useState("");
  const [mySeat, setMySeat] = useState();
  const [seats, setSeats] = useState(new Array(40).fill("empty"));
  const roomId = params.roomId;
  const colors = ["red", "orange", "yellow", "green", "blue"];

  const connect = async () => {
    let Sock = new SockJS("http://localhost:8080/ws");
    stompClient = over(Sock);
  };

  const onConnected = () => {
    stompClient.subscribe(`/topic/chat/room/${roomId}`, onMessageReceived);
    stompClient.send(
      "/app/chat/message",
      { roomId: roomId },
      JSON.stringify({ type: "ENTER", roomId: roomId, sender: username })
    );
    console.log(`=> sessionId: `, stompClient);
    // getCurrentState();
    // getMyPosition();
  };

  const onMessageReceived = (received) => {
    console.log(received);
    const parsedMsg = JSON.parse(received.body);
    if (parsedMsg.type === "TALK") color(parsedMsg.seatNum, parsedMsg.message);
  };

  const onError = (err) => {
    console.log(err);
  };

  function color(seatNum, receivedColor) {
    setSeats((oldSeats) => {
      let newSeats = [...oldSeats];
      newSeats[seatNum] = receivedColor;
      return newSeats;
    });
  }

  const selectColor = (color) => {
    console.log(stompClient.connected);
    stompClient.send(
      "/app/chat/message",
      {},
      JSON.stringify({
        type: "TALK",
        roomId: roomId,
        sender: username,
        message: color,
        seatNum: mySeat,
      })
    );
  };

  const getSeatInfo = async () => {
    axios
      .get(`/api/classroom/${roomId}/seatInfo`)
      .then((res) => {
        const seatInfo = res.data;
        console.log(seatInfo);
        setMySeat(parseInt(seatInfo.seatNum));
        // for (let seat in seatInfo.classRoomStates) {
        //   console.log(seat);
        // }
        console.log(seatInfo.classRoomStates);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const getUsername = async () => {
      axios
        .get("/api/member/username")
        .then((res) => {
          if (res.status !== 200) {
            alert("There has been some errors.");
          }
          if (username === "expired") setUsername("");
          else setUsername(res.data);
          connect().then(() => {
            getSeatInfo();
            stompClient.connect({ roomId: roomId, username: res.data }, onConnected, onError);
          });
        })
        .catch((err) => {
          console.error("There has been an error login", err);
        });
    };

    getUsername();
  }, []);

  const indicateMyself = () => {
    /**
     * TODO 내가 위치한 곳에 I 그리기
     */
  };

  return (
    <div>
      <NavBar mode="classroom" />
      <div className={styles.container}>
        <div className={styles.seats}>
          {seats.map((seat, index) => (
            <Circle key={index} size="small" state={seats[index]} emoji="" />
          ))}
        </div>
      </div>
      <div className={styles.count}>
        {colors.map((color, index) => (
          <span onClick={() => selectColor(color)} key={index}>
            <Circle key={index} size="small" state={color} />
          </span>
        ))}
      </div>
      <span onClick={() => stompClient.disconnect()}>disconnect</span>
    </div>
  );
}

export default Room;
//https://devsoyoung.github.io/posts/react-usestate-double-invoked/
