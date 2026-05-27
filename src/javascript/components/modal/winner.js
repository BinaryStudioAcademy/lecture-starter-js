import showModal from './modal';
import createElement from '../../helpers/domHelper';

export default function showWinnerModal(fighter) {
    const bodyElement = createElement({ tagName: 'div', className: 'winner-body' });
    const image = createElement({
        tagName: 'img',
        className: 'winner-image',
        attributes: {
            src: fighter?.source ?? '',
            alt: fighter?.name ?? 'Winner',
            title: fighter?.name ?? 'Winner'
        }
    });
    const name = createElement({ tagName: 'div', className: 'winner-name' });

    name.innerText = fighter?.name ?? 'Winner';
    bodyElement.append(image, name);

    showModal({
        title: 'Winner',
        bodyElement
    });
}
