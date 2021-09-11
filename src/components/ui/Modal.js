import * as React from "react";
import { Dialog } from "@headlessui/react";

export default function Modal({
  title,
  description,
  isOpen,
  setIsOpen,
  actionOk,
  icon,
}) {
  const defaultActionOk = {
    text: "OK",
    action: () => setIsOpen(),
  };

  const _actionCmd = actionOk || defaultActionOk;
  return (
    <Dialog
      open={isOpen}
      onClose={setIsOpen}
      as="div"
      className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto"
    >
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Dialog.Overlay className="pointer-events-none fixed inset-0 bg-black opacity-30" />
        <div className="relative flex gap-x-6 bg-white rounded max-w-md mx-auto p-6">
          <div>{icon}</div>
          <div className="flex flex-col text-lg">
            <Dialog.Title className="font-semibold">{title}</Dialog.Title>
            <Dialog.Description className="text-gray-800">
              {description}
            </Dialog.Description>
            <div className="mt-4">
              <button
                className="justify-center btn btn-default px-8"
                onClick={() => _actionCmd.action()}
              >
                {_actionCmd.text}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
