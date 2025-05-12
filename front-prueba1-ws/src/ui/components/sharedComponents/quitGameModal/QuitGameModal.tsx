import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useNavigate } from "react-router-dom";

type quitGameModalProps = {
    isOpenModal: boolean,
    close: () => void,
    handleQuit: () => void
}

export default function QuitGameModal({ isOpenModal, close, handleQuit }: quitGameModalProps) {
    const navigate = useNavigate();
    return (
        <Dialog open={isOpenModal} as="div" className="relative z-10 focus:outline-none" onClose={close}>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel
                        transition
                        className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
                    >
                        <DialogTitle as="h3" className="text-base/7 font-medium text-white">
                            Abandonar partida
                        </DialogTitle>
                        <p className="mt-2 text-sm/6 text-white/50">
                            ¿Estás seguro de que quieres abandonar la partida? No podrás volver a ella.
                        </p>
                        <div className="mt-4">
                            <Button
                                className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                                onClick={() => {
                                    handleQuit();
                                    navigate('/');
                                }
                                }
                            >
                                Aceptar
                            </Button>
                            <Button
                                className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                                onClick={ close }
                            >
                                Cancelar
                            </Button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}
