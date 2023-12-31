import React, { useEffect, useState } from 'react';

import Seats from './Seats';

import close from '../assets/close-button.svg';

import "react-toastify/dist/ReactToastify.css"

import {toast , ToastContainer} from "react-toastify";

const SeatChart = ({event , contract , provider , setToggle}) => {
    
    const [takenSeat , setTakenSeat] = useState(false);

    const [soldSeat , setSoldSeat] = useState(false)


const getTakenSeats = async() => {

    const takenSeats = await contract.getTakenSeats(event.id);

    setTakenSeat(takenSeats);

}

const buyHandler = async(_seat) => {

  try {

    setSoldSeat(false);

    console.log(`This is our seat ${_seat}`)

    const signer  = await provider.getSigner();

    const buyTransaction = await contract.connect(signer).buyTickets(event.id , _seat , {value : event.cost});

    await buyTransaction.wait();

    toast.success(`Seat ${_seat} Of Event ${event.name} Has Been Booked Successfully`)

    setSoldSeat(true);
    
  } catch (error) {

    if(error.reason == "execution reverted: This seat is already taken"){

      toast.error("This Seat Is Already Taken");

    }
    
  }

}

useEffect(() => {

    getTakenSeats();

} , [soldSeat]);

return (

  <>



    <ToastContainer/>

    <div className="occasion">
      
      <div className="occasion__seating">
      
        <h1>{event.name} Seating Map</h1>

        <button onClick={() => setToggle(false)} className="occasion__close">
          
          <img src={close} alt="Close" />

        </button>

        <div className="occasion__stage">

          <strong>STAGE</strong>

        </div>

        {takenSeat && Array(25).fill(1).map((element, index) =>
          <Seats
            index={index}
            step={1}
            columnStart={0}
            maxColumns={5}
            rowStart={2}
            maxRows={5}
            takenSeat={takenSeat}
            buyHandler={buyHandler}
            key={index}
          />
        )}

        <div className="occasion__spacer--1 ">

          <strong>WALKWAY</strong>

        </div>

        {takenSeat && Array(Number(event.totalTickets) - 50).fill(1).map((element, index) =>

          <Seats
            index={index}
            step={26}
            columnStart={6}
            maxColumns={15}
            rowStart={2}
            maxRows={15}
            takenSeat={takenSeat}
            buyHandler={buyHandler}
            key={index}
          />
        )}

        <div className="occasion__spacer--2">
        
          <strong>WALKWAY</strong>

        </div>

        {takenSeat && Array(25).fill(1).map((element , index) =>

          <Seats
            index={Number(index)}
            step={(Number(event.totalTickets) - 24)}
            columnStart={22}
            maxColumns={5}
            rowStart={2}
            maxRows={5}
            takenSeat={takenSeat}
            buyHandler={buyHandler}
            key={index}
          />
        )}
      </div>
    </div >

  </>

  );

}

export default SeatChart