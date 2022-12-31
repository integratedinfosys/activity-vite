import ReactDom from "react-dom";
import React, { FC } from "react";

type IModal = {
    openModal: boolean;
    setOpenModal: (open: boolean) => void;
    children: React.ReactNode;
    isDismissable?: boolean;
};

const Modal: FC<IModal> = ({
    openModal,
    setOpenModal,
    children,
    isDismissable = true
}) => {
    if (!openModal) return null;
    return ReactDom.createPortal(
        <>
            <div
                className="fixed inset-0 bg-[rgba(0,0,0,.5)] z-[1000]"
                onClick={() => { if (isDismissable) setOpenModal(false) }}
            ></div>
            <div className="max-w-lg w-full rounded-md fixed top-[5%] xl:top-[6%] left-1/2 -translate-x-1/2 bg-white z-[1001] p-6 max-h-[90%] overflow-auto">
                {/* <div className="max-w-lg w-full rounded-md fixed top-[5%] xl:top-[10%] left-1/2 -translate-x-1/2 z-[1001] p-6"> */}
                {children}
            </div>
        </>,
        document.getElementById("modal") as HTMLElement
    );
};

export default Modal;
