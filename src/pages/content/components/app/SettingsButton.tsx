import React, { useState } from "react";
import { Language } from "./Icons";
import Modal from "./Modal";

const SettingsButton = () => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <button
        className="fixed bottom-5 z-10 flex items-center justify-center rounded-full border border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-white/10 dark:text-gray-200 "
        id="headlessui-menu-button-:rg:"
        type="button"
        style={{ right: 48 }}
        onClick={() => setOpenModal(true)}
      >
        <div className="h-6 w-6 flex justify-center items-center">
          <Language />
        </div>
      </button>

      <Modal open={openModal} handleClose={() => setOpenModal(false)} />
    </>
  );
};

export default SettingsButton;
