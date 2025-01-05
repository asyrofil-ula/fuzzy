/* eslint-disable react/prop-types */
import Button from "../elements/Button";
// import { useState } from "react";
const Modal = (props) => {
  const { children, title, closeModal } = props;
  // const [isOpenModal, setIsOpenModal] = useState(false);

  return (
    <>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="py-4">{children}</p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button, it will close the modal */}
              <Button classname="btn" onClick={closeModal}>Close</Button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Modal;
