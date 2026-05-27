import createElement from '../helpers/domHelper';
import versusImg from '../../../resources/versus.png';
import { createFighterPreview } from './fighterPreview';
import fighterService from '../services/fightersService';

const fighterDetailsMap = new Map();

export async function getFighterInfo(fighterId) {
    if (!fighterId) {
        throw Error('Fighter id is required');
    }

    if (fighterDetailsMap.has(fighterId)) {
        return fighterDetailsMap.get(fighterId);
    }

    const fighter = await fighterService.getFighterInfo(fighterId);
    fighterDetailsMap.set(fighterId, fighter);
    return fighter;
}

function startFight(selectedFighters, onFightStart) {
    onFightStart(selectedFighters);
}

function createVersusBlock(selectedFighters, onFightStart) {
    const canStartFight = selectedFighters.filter(Boolean).length === 2;
    const onClick = () => startFight(selectedFighters, onFightStart);
    const container = createElement({ tagName: 'div', className: 'preview-container___versus-block' });
    const image = createElement({
        tagName: 'img',
        className: 'preview-container___versus-img',
        attributes: { src: versusImg }
    });
    const disabledBtn = canStartFight ? '' : 'disabled';
    const fightBtn = createElement({
        tagName: 'button',
        className: `preview-container___fight-btn ${disabledBtn}`
    });

    fightBtn.addEventListener('click', onClick, false);
    fightBtn.innerText = 'Fight';
    container.append(image, fightBtn);

    return container;
}

function renderSelectedFighters(selectedFighters, onFightStart) {
    const fightersPreview = document.querySelector('.preview-container___root');
    const [playerOne, playerTwo] = selectedFighters;
    const firstPreview = createFighterPreview(playerOne, 'left');
    const secondPreview = createFighterPreview(playerTwo, 'right');
    const versusBlock = createVersusBlock(selectedFighters, onFightStart);

    fightersPreview.innerHTML = '';
    fightersPreview.append(firstPreview, versusBlock, secondPreview);
}

export function createFightersSelector(onFightStart) {
    let selectedFighters = [];

    return async (event, fighterId) => {
        const fighter = await getFighterInfo(fighterId);
        const [playerOne, playerTwo] = selectedFighters;
        const isSameAsP1 = playerOne?._id === fighterId;
        const isSameAsP2 = playerTwo?._id === fighterId;

        if (!playerOne) {
            selectedFighters = [fighter, playerTwo];
        } else if (!playerTwo) {
            selectedFighters = isSameAsP1 ? [playerOne, playerTwo] : [playerOne, fighter];
        } else if (!isSameAsP1 && !isSameAsP2) {
            // both selected: replace opponent (player two) by default
            selectedFighters = [playerOne, fighter];
        }

        renderSelectedFighters(selectedFighters, onFightStart);
    };
}
