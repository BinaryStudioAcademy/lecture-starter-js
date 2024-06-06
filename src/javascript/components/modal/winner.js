import { createFighterImage } from '../fighterPreview';
import showModal from './modal';

export default function showWinnerModal(fighter) {
    // call showModal function
    const winnerImg = createFighterImage(fighter);
    showModal({ title: fighter.name, bodyElement: winnerImg });
}
