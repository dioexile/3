import React, {useEffect, useState} from 'react';
import { Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { sendMessage } from '../http/chatApi';
import jwt_decode from "jwt-decode";
import { fetchOneUser } from '../http/userApi';
import io from 'socket.io-client';


const Chat = ({user, offer}) => {
  const { TextArea } = Input;
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState('');
  const [chatMember, setChatMember] = useState([]);
  const [img, setImg] = useState('')

  let navigate = useNavigate();

  const socket = io('ws://localhost:5000')

  const get = () => {
    socket.emit('offer', {
      userId: jwt_decode(localStorage.getItem('token')).id,
      offerId: offer.userId,
    })
    socket.on('messages', (data) => {
      setMessages(data)
    })
    
    console.log(messages)
  }

  const handleUserProfile = () => {
    navigate(`/profile/${user.id}`)
  }


  useEffect(() => {
    let chatMemberId = jwt_decode(localStorage.getItem('token')).id
    fetchOneUser(chatMemberId).then(data => setChatMember(data))

    setImg(`${process.env.REACT_APP_API_URL + 'static/' + user.img}`)
    get()
  }, [])

  const send = async () => {
    socket.emit('send', {
      messageText: value,
      userId: jwt_decode(localStorage.getItem('token')).id,
      offerId: offer.userId,
    })
    get()

    setValue('')
  }



  return (
    <div className="offer-chat">
      <div className="chat-head">
        <img src={img} alt="" onClick={handleUserProfile}/>
        <div className="chat-user-info">
          <span className='chat-username' onClick={handleUserProfile}>{user.username}</span>
          <span className='chat-online' >isOnline</span>
        </div>
      </div>
      <div className="chat-space">
        {/* {messages.map(mess =>
          <h1 key={mess.id}>{mess.body}</h1>
        )} */}
      </div>
      <div className="chat-input" >
        <TextArea 
          value = {value} 
          placeholder="Write a message" 
          autoSize={{ minRows: 2, maxRows: 6 }} 
          style={{border: 'none'}} 
          onChange={e => setValue(e.target.value)} 
        />
        <button className='chat-send' onClick={send}>Send</button>
      </div>
    </div>
  )
}

export default Chat