/* eslint-disable react/prop-types */
import Button from "../elements/Button";
// import { useState } from "react";
const Modal = (props) => {
  const { children, title, closeModal,  } = props;
  // const [isOpenModal, setIsOpenModal] = useState(false);

  return (
    <>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <Button type="button" classname="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 " onClick={closeModal}>
              ✕
            </Button>
          </form>
          <h3 className="font-bold text-lg">{title}</h3>
         {children}
        </div>
      </dialog>
    </>
  );
};

export default Modal;
