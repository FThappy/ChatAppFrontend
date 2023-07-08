import React, { useContext, useEffect } from 'react'
import { ListGroup,Row,Col } from 'react-bootstrap'
import { useDispatch, useSelector } from "react-redux";
import { AppContext } from '../context/appContext'
import { addNotifications, resetNotifications } from "../features/userSlice";
import "./Sidebar.css";

function Sidebar() {
    const user = useSelector((state)=> state.user)
    const dispatch = useDispatch();

    const {socket ,setMembers,members,setCurrentRoom,setRooms,privateMemberMsg,rooms,setPrivateMemberMsg,currentRoom} = useContext(AppContext)
     
    function joinRoom(room,isPublic = true) {
      if(!user){
        return alert('Please login');
      }
      socket.emit("join-room",room,currentRoom);
      setCurrentRoom(room);
      if(isPublic){
        setPrivateMemberMsg(null);
      }

      dispatch(resetNotifications(room))

    
    }
    socket.off("notifications").on("notifications", (room) => {
      if(currentRoom !==room)
      dispatch(addNotifications(room));
    });
    useEffect(() => {
      if (user) {
        setCurrentRoom("general")
        getRooms();
        socket.emit("join-room", "general");
        socket.emit("new-user");
      }
    }, []);
    
    
    socket.off("new-user").on("new-user",(payload)=>{
      console.log(payload)
      setMembers(payload);
    })
    
    function getRooms() {
      fetch("http://localhost:5001/rooms")
        .then((res) => res.json())
        .then((data) => {
          const updatedRooms = [{name : "general",quantity : "1000"}, ...data];
          setRooms(updatedRooms);
        });
    }
    

    function orderIds(id1,id2){
      if(id1 > id2){
        return id1+ '-'+id2
      } else{
        return id2 + "-" + id1;
      }
    }

    function handlePrivateMemberMsg(member){
      setPrivateMemberMsg(member)
      const roomId = orderIds(user._id,member._id);
      joinRoom(roomId,false)
    }
    if (!user) {
      return <></>;
    }
    return (
      <>
        <h2>Available rooms</h2>
        <ListGroup className="rooms">
          {rooms.map((room, id) => (
            <ListGroup.Item
              className="room-child"
              key={id}
              onClick={() => joinRoom(room.name)}
              active={room.name === currentRoom}
              style={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                border: "none",
                borderRadius: "0.2rem",
                backgroundColor: "#FCF6F5",
                color: "#333333",
              }}
            >
              {room.name}
              {currentRoom !== room.name && (
                <span className="badge rounded-pill bg-primary">
                  {user.newMessages[room.name]}
                </span>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
        <h2>Members</h2>
        <ListGroup>
          {members.map((member) => (
            <ListGroup.Item
              className="members"
              key={member._id}
              active={privateMemberMsg?._id === member?._id}
              onClick={() => handlePrivateMemberMsg(member)}
              hidden={member._id === user._id}
              style={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                border: "none",
                borderRadius: "0.2rem",
                backgroundColor: "#FCF6F5",
                color: "#333333",
              }}
            >
              <Row>
                <Col xs={2} className="member-status">
                  <img src={member.picture} className="member-status-img" />
                  {member.status === "online" ? (
                    <i className="fas fa-circle sidebar-online-status"></i>
                  ) : (
                    <i className="fas fa-circle sidebar-offline-status"></i>
                  )}
                </Col>
                <Col xs={9} className="member-info">
                    {member.name}
                    {member.id === user?._id && "you"}
                    {member.status === "offline" && " (Offline)"}
                </Col>
                <Col xs={1}>
                  <span className="badge rounded-pill bg-primary">
                    {user.newMessages[orderIds(member._id, user._id)]}
                  </span>
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </>
    );
}

export default Sidebar