import { forwardRef } from 'react';

interface ConfirmationModalProps {
  message: string;
  onConfirm: () => void;
}

const ConfirmationModal = forwardRef<HTMLDialogElement, ConfirmationModalProps>(
  ({ message, onConfirm }: ConfirmationModalProps, ref) => {
    return (
      <dialog ref={ref} className="modal border-none outline-none">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Confirmation</h3>
          <p>{message}</p>
          <div className="flex justify-end gap-4 mt-6">
            <form method="dialog">
              <button className="btn bg-red-800">Cancel</button>
            </form>
            <button
              onClick={() => {
                onConfirm();
              }}
              className="btn btn-primary"
            >
              Confirm
            </button>
          </div>
        </div>
      </dialog>
    );
  }
);

export default ConfirmationModal;
