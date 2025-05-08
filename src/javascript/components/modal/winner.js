import showModal from './modal';
import { createFighterImage } from '../fighterPreview';

export default function showWinnerModal(fighter) {
    // call showModal function

    const image = createFighterImage(fighter);
    const winner = {
        title: `\u{1F947} WINNER: ${fighter.name}`,
        bodyElement: image
    };
    showModal(winner);
}
