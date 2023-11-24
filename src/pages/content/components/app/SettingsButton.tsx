import React, { useState } from "react";
import { Language } from "./Icons";
import Modal from "./Modal";

const SettingsButton = () => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <button
        className="fixed z-10 flex items-center justify-center rounded-full bottom-3 right-12 text-ext-secondary bg-ext-primary hover:bg-ext-primary-dark flex justify-center items-center h-[26px] w-[26px]"
        type="button"
        onClick={() => setOpenModal(true)}
      >
        {/* <div className="h-5 w-5 flex justify-center items-center"> */}
        <Language />
        {/* </div> */}
      </button>

      <Modal open={openModal} handleClose={() => setOpenModal(false)} />
    </>
  );
};

export default SettingsButton;
