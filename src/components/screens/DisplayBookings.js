import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DisplayBookings = () => {
  const [bookings, setBookings] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchData();
  }, []);

  const headers = {
    'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
    'Content-Type': 'application/json',
  };

  const fetchData = async () => {
    try {
      const response = await axios.get('/bookings', { headers });
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      // Fetch booking details
      const { data } = await axios.get(`/bookingsById/${bookingId}`, { headers });

      // Update booking status
      await axios.put(`/bookings/${bookingId}`, { status: newStatus }, { headers });

      // Compose the message with HTML content
      const message = `
      Your Slot has been ${newStatus} by ${user.email}

      Players are requested to observe sports court courtesies as well as rules of good conduct in and around the sports playing area.

      - Players must wear clean, non-marking shoes to play on the PVC mat wooden courts.
      - Shoes to be worn on the courts are to be brought into the arena, and players will change into those shoes prior to entering the court area. Regardless of the footwear type, wet, dirty, or shoes that have been worn outside will not be permitted on the courts.
      - Street shoes, slippers, flip flops, or any kind of footwear not specifically designed for badminton is not permitted.
      - Spilling water on the PVC mat floor is strictly prohibited. Any damages to the court by any individual, they should take full responsibility for repair works.
      - Do not bring water bottles near to the court as it could spill water on the court. Keep the water bottles outside the badminton arena.
      - Eating food, spitting, gum chewing, bringing animals (pets), or weapons into the facility are strictly prohibited.
      - Do not litter and keep the badminton arena clean.
      - No profanities, yelling, or screaming at any time while on court.
      - Cell phones must be silenced.
      - No skateboards/scooters allowed. Only players are allowed on the court areas.
      - Before starting play, ensure the court is free from hazards (extra cocks, balls, cans, or other debris).
      - Players agree to use the facility in accordance with all applicable public health requirements.

      Booking Details:
      - Court Number: ${data.courtNumber}
      - Time Slot: ${data.timeSlot}
      - Booked Date: ${new Date(data.selectedDate).toDateString()}
      - Booking Date: ${new Date(data.bookingDate).toDateString()}

      Please let us know if you have any further questions or concerns.

      Thank you,
      Your Badminton Court Management Team
    `;

      // Send booking status update email
      await axios.post('/bookingstatus', {
        destination: data.email,
        message: message,
        subject: "Badminton Court Booking",
      }, { headers });

      console.log("Booking status updated and notification sent");

      // Refresh bookings list
      fetchData();
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  return (
    <div>
      <h2>Bookings:</h2>
      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Student Roll no.</th>
            <th scope="col">Court Number</th>
            <th scope="col">Time Slot</th>
            <th scope="col">Booking Date</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td>{booking.rollno}</td>
              <td>{booking.courtNumber}</td>
              <td>{booking.timeSlot}</td>
              <td>{new Date(booking.bookingDate).toDateString()}</td>
              <td>{booking.status}</td>
              <td>
                {booking.status === 'Pending' && (
                  <>
                    <button
                      className="btn btn-success mr-2"
                      onClick={() => handleStatusChange(booking._id, 'Approved')}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleStatusChange(booking._id, 'Rejected')}
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DisplayBookings;
