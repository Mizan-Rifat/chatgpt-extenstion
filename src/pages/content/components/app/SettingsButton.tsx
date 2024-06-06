import { useEffect, useState } from "react";
import { Cog } from "./Icons";
import SettingsModal from "./SettingsModal";
import { getStorageValue, setStorageValue } from "../../utils";

const SettingsButton = () => {
  const [openModal, setOpenModal] = useState(false);

  const handleModalClose = () => {
    setStorageValue({ first_showed: true });
    setOpenModal(false);
  };

  useEffect(() => {
    (async () => {
      const firstShowed = await getStorageValue("first_showed");
      if (!firstShowed) {
        setOpenModal(true);
      }
    })();
  }, []);

  return (
    <>
      <button
        className="fixed z-10 flex items-center justify-center rounded-full top-4 right-12 md:right-16 text-ext-secondary bg-ext-primary hover:bg-ext-primary-dark flex justify-center items-center h-[26px] px-3 mr-2"
        type="button"
        onClick={() => setOpenModal(true)}
      >
        <span className="font-bold text-sm mr-1 hidden sm:block">VoiceGPT</span>{" "}
        <Cog />
      </button>

      <SettingsModal open={openModal} handleClose={handleModalClose} />
    </>
  );
};

export default SettingsButton;
