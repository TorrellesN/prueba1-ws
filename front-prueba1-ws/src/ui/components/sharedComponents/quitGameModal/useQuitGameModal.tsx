import { useState } from "react";


/* type useQuitGameModalProps = {
    open: () => void,
    close: () => void,
    isOpenModal: boolean
} */

export const useQuitGameModal = () => {
      const [isOpenModal, setIsOpenModal] = useState(false);
      const open = () => {
        setIsOpenModal(true)
      }
      const close = () => {
        setIsOpenModal(false)
      }
    return {open, close, isOpenModal}
}