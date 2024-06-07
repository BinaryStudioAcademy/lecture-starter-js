import showModal from './modal';
import createElement from '../../helpers/domHelper';
import { createFighterImage } from '../fighterPreview';

export default function showWinnerModal(fighter) {
    //call showModal function
    const winnerPreview = createElement({
        tagName: 'div',
        className: 'winner-preview',
      });
    
      let imageElement = createFighterImage(fighter, "left");
      let title = `${fighter.name} WON!! `;
    
      winnerPreview.append(imageElement);
    
      showModal({ title, bodyElement: winnerPreview, onClose: () => window.location.reload() });
}

