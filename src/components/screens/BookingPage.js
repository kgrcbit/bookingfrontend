import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookingPage = () => {
  const [courtNumber, setCourtNumber] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const numberOfCourts = 2;

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Debugging logs
    console.log("courtNumber:", courtNumber);
    console.log("timeSlot:", timeSlot);
    console.log("selectedDate:", selectedDate);
    console.log("selectedTime:", selectedTime);

    if (!courtNumber || !timeSlot || !selectedDate ) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    if (courtNumber > numberOfCourts || courtNumber <= 0) {
      setErrorMessage('Please enter a valid court number, courts 1 and 2 are available');
      return;
    }

    const dateObj = new Date();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();
    const newDate = `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;
    const bookingId = `${timeSlot}${courtNumber}${newDate}`;

    const currentTime = new Date().getTime();
    const selectedTimeStart = selectedTime.split('-')[0];
    const selectedTime24 = convertTo24HourFormat(selectedTimeStart);
    const selectedSlotStart = new Date(`${selectedDate} ${selectedTime24}`).getTime();

    const today = new Date().setHours(0, 0, 0, 0);
    const maxDate = new Date(today + 7 * 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0);
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
      'Content-Type': 'application/json'
    };

    try {
      // Check if the slot is available
      const slotResponse = await axios.get(`/bookings/${bookingId}`, { headers });
      if (slotResponse.data) {
        setErrorMessage('Sorry, this slot is not available. Please choose another slot.');
        return;
      }

      const studentEmail = JSON.parse(localStorage.getItem('user')).email;
      const bookingResponse = await axios.get(`/bookings/${studentEmail}`, { headers });

      if (bookingResponse.data.canBook === false) {
        setErrorMessage('Sorry, you have already booked a slot for today. Try again tomorrow.');
        return;
      }

      const slotMapping = {
        "a": "03:00-03:30",
        "b": "03:30-04:00",
        "c": "04:00-04:30",
        "d": "04:30-05:00"
      };

      const slot = slotMapping[timeSlot];

      const newBooking = {
        courtNumber,
        timeSlot: slot,
        selectedDate,
        bookingId
      };

      await axios.post('/bookings', newBooking, { headers });

      setCourtNumber('');
      setTimeSlot('');
      setSelectedDate('');
      setSelectedTime('');
      setErrorMessage('');
      toast.success("Booking successful! Wait for approval");
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred. Please try again later.');
    }
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
              setCourtNumber(event.target.value);
            }}
          />
        </div>
        <div>
          <label htmlFor="date">Select Date:</label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={handleDateChange}
            min={new Date().toISOString().split("T")[0]}
            max={new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Time Slot:</label>
          <select
            className="form-select"
            value={timeSlot}
            onChange={(event) => {
              setErrorMessage('');
              setTimeSlot(event.target.value);
            }}
          >
            <option value="">Select a time slot</option>
            <option value="a">03:00-03:30</option>
            <option value="b">03:30-04:00</option>
            <option value="c">04:00-04:30</option>
            <option value="d">04:30-05:00</option>
          </select>
        </div>
       
        <button type="submit" className="btn btn-primary">Book Now</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default BookingPage;
