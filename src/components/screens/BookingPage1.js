import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const BookingPage = () => {
 // const [studentName, setStudentName] = useState('');
  const [courtNumber, setCourtNumber] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  
  //const [status,setStatus] = useState([]);
  //const [isAvailable,setIsAvailable] = useState(true);


  //This variable represents the maximum number of courts
  //(Here)The court number should be either 1 or 2 or 3
  const numberOfCourts = 2;
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if ( !courtNumber || !timeSlot ) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    if(courtNumber>numberOfCourts || courtNumber<=0){
      setErrorMessage('please enter valid court number,courts 1 and 2  are available');
      return;
    }
    
    

    const dateObj = new Date();
const month = dateObj.getMonth() + 1; //months from 1-12
const day = dateObj.getDate();
const year = dateObj.getFullYear();

const newDate = `${year}${month}${day}`;
const bookingId = `${timeSlot}${courtNumber}${newDate}`;

console.log(bookingId)



const currentTime = new Date().getTime();
const selectedTimeStart = selectedTime.split('-')[0];

// Convert selected time to 24-hour format
const selectedTime24 = convertTo24HourFormat(selectedTimeStart);

const selectedSlotStart = new Date(`${selectedDate} ${selectedTime24}`).getTime();

const today = new Date().setHours(0, 0, 0, 0);
const maxDate = new Date(today + 7 * 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0); // Maximum date is 1 week from today
const selected = new Date(selectedDate).setHours(0, 0, 0, 0);

if (currentTime >= selectedSlotStart) {
  setErrorMessage('Booking can only be made before the slot time.');
  return;
}

if (selected > maxDate) {
  setErrorMessage('Cannot select a date more than one week in advance.');
  return;
}

function convertTo24HourFormat(time) {
  const [hour, minute] = time.split(':');
  let hourInt = parseInt(hour);
  const period = time.substr(-2).toUpperCase();

  if (period === 'PM' && hourInt < 12) {
    hourInt += 12;
  } else if (period === 'AM' && hourInt === 12) {
    hourInt = 0;
  }

  return `${hourInt.toString().padStart(2, '0')}:${minute}`;
}



const headers = {
  'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
  'Content-Type': 'application/json', // You may adjust this header based on your API requirements
};


  let obj = await axios.get(`https://backend-n806.onrender.com/bookings/${bookingId}`,{headers});


    //console.log("hi");
    if(obj.data){
      setErrorMessage('Sorry this slot is not available, please choose another slot');;
      return;
    }

    const studentEmail = JSON.parse((localStorage.getItem('user'))).email;

    let {data} = await axios.get(`https://backend-n806.onrender.com/bookingsByDate/${studentEmail}`)



    if(data.canBook == false){
      setErrorMessage('Sorry you have already booked a slot for today. try again tomorrow');;
      return;     
    }


    let slot;
    console.log(bookingId);
    
    
      if (timeSlot === "a")
      slot = "03:00-03:30";
    else if (timeSlot === "b")
      slot = "03:30-04:00";
    else if (timeSlot === "c")
      slot = "04:00-04:30";
    else if (timeSlot === "d")
      slot = "04:30-05:00";



    const newBooking = {
    //  studentName,
      courtNumber,
      timeSlot:slot,
      selectedDate,
      bookingId
    };

    console.log("hello");
    axios
      .post('https://backend-n806.onrender.com/bookings', newBooking,{headers})
      .then((response) => {
        console.log(response.data);
       // setStudentName('');
        setCourtNumber('');
        setTimeSlot('');
        setErrorMessage('');
        //setStatus([...status,slotCode]);
        //setErrorMessage("booking successful")
        toast.success("Booking successful! Wait for approval");
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage('An error occurred. Please try again later.');
      });
  };

  return (
    <div className="container">
      <h1>Booking Page</h1>
      {errorMessage && <p className="alert alert-danger">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        
        
        <div className="mb-3">
          <label className="form-label">Court Number:</label>
          <input
            type="number"
            className="form-control"
            value={courtNumber}
            onChange={(event) => {
              setErrorMessage('');
              setCourtNumber(event.target.value)}}
          />
        </div>
        <div>
        <label htmlFor="date">Select Date:</label>
        <input type="date" id="date" value={selectedDate} onChange={handleDateChange} min={new Date().toISOString().split("T")[0]} max={new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]} />
      </div>
        <div className="mb-3">
          <label className="form-label">Time Slot:</label>
          <select
            className="form-select"
            value={timeSlot}
            onChange={(event) => {
              setErrorMessage('');  
              setTimeSlot(event.target.value)}
            }
          >
            <option value="">Select a time slot</option>
            


            <option value="a">03:00-03:30</option>
            <option value="b">03:30-04:00</option>
            <option value="c">04:00-04:30</option>
            <option value="d">04:30-05:00</option>
          </select>
        </div>
        
        {/* {

          !isAvailable && 
          <div class="alert alert-warning" role="alert">
            A simple warning alert—check it out!
          </div>
        } */}

        <button type="submit" className="btn btn-primary">Book Now</button>
      </form>
      
      <ToastContainer />
    </div>
  );
};

export default BookingPage;