import { forwardRef } from 'react';

interface ConfirmationModalProps {
  message: string;
  onConfirm: () => void;
}

const ConfirmationModal = forwardRef<HTMLDialogElement, ConfirmationModalProps>(
  ({ message, onConfirm }: ConfirmationModalProps, ref) => {
    return (
      <dialog ref={ref} className="modal border-none outline-none">
        <div className="modal-box rounded border border-gray-600">
          <h3 className="font-bold text-lg mb-4">Confirmation</h3>
          <p>{message}</p>
          <div className="flex justify-end gap-4 mt-4">
            <form method="dialog" className="modal-backdrop">
              <button className="btn btn-secondary">Cancel</button>
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
