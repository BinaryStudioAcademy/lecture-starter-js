import showModal from './modal';
import { createFighterImage } from '../fighterPreview';

export default function showWinnerModal(fighter) {
    // call showModal function

    const imageElement = createFighterImage(fighter);
    const modalElement = {
        title: `${fighter.name.toUpperCase()} You are the winner!!!`,
        bodyElement: imageElement,
        onClose: () => {
            location.reload();
        }
    };
    showModal(modalElement);
}
