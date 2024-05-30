import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function OrderAdd() {
  return (
    <div className="flex justify-center mb-5">
      <form>
        <h1 className="mt-7 mb-5 text-md font-semibold"> Add Order </h1>

        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className="px-4 py-1 rounded-md bg-black text-white text-base"
          >
            {" "}
            SAVE ORDER
          </button>
        </div>
      </form>
    </div>
  );
}

export default OrderAdd;
