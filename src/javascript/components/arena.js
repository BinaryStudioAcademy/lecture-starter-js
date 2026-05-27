import createElement from '../helpers/domHelper';
import { createFighterImage } from './fighterPreview';
import { fight } from './fight';
import showWinnerModal from './modal/winner';
import createFightersView from './fightersView';
import fighterService from '../services/fightersService';

function createFighter(fighter, position) {
    const imgElement = createFighterImage(fighter);
    const positionClassName = position === 'right' ? 'arena___right-fighter' : 'arena___left-fighter';
    const fighterElement = createElement({
        tagName: 'div',
        className: `arena___fighter ${positionClassName}`
    });

    fighterElement.append(imgElement);
    return fighterElement;
}

function createFighters(firstFighter, secondFighter) {
    const battleField = createElement({ tagName: 'div', className: `arena___battlefield` });
    const firstFighterElement = createFighter(firstFighter, 'left');
    const secondFighterElement = createFighter(secondFighter, 'right');

    battleField.append(firstFighterElement, secondFighterElement);
    return battleField;
}

function createHealthIndicator(fighter, position) {
    const { name } = fighter;
    const container = createElement({ tagName: 'div', className: 'arena___fighter-indicator' });
    const fighterName = createElement({ tagName: 'span', className: 'arena___fighter-name' });
    const indicator = createElement({ tagName: 'div', className: 'arena___health-indicator' });
    const bar = createElement({
        tagName: 'div',
        className: 'arena___health-bar',
        attributes: { id: `${position}-fighter-indicator` }
    });

    fighterName.innerText = name;
    indicator.append(bar);
    container.append(fighterName, indicator);

    return container;
}

function createHealthIndicators(leftFighter, rightFighter) {
    const healthIndicators = createElement({ tagName: 'div', className: 'arena___fight-status' });
    const versusSign = createElement({ tagName: 'div', className: 'arena___versus-sign' });
    const leftFighterIndicator = createHealthIndicator(leftFighter, 'left');
    const rightFighterIndicator = createHealthIndicator(rightFighter, 'right');

    healthIndicators.append(leftFighterIndicator, versusSign, rightFighterIndicator);
    return healthIndicators;
}

function createQuitButton(onQuit) {
    const quitBtn = createElement({
        tagName: 'button',
        className: 'arena___quit-btn'
    });

    quitBtn.innerText = 'Quit';
    quitBtn.addEventListener('click', onQuit, false);

    return quitBtn;
}

async function returnToFighterSelection() {
    const root = document.getElementById('root');
    const fighters = await fighterService.getFighters();
    const fightersElement = createFightersView(fighters);

    root.innerHTML = '';
    root.appendChild(fightersElement);
}

function createControlsHint() {
    const hint = createElement({ tagName: 'div', className: 'arena___controls-hint' });
    const title = createElement({ tagName: 'div', className: 'arena___controls-title' });
    const p1 = createElement({ tagName: 'div', className: 'arena___controls-row' });
    const p2 = createElement({ tagName: 'div', className: 'arena___controls-row' });

    title.innerText = 'Controls';
    p1.innerText = 'Player 1: A attack, D block, Q+W+E critical';
    p2.innerText = 'Player 2: J attack, L block, U+I+O critical';

    hint.append(title, p1, p2);
    return hint;
}

function createArena(selectedFighters, onQuit) {
    const arena = createElement({ tagName: 'div', className: 'arena___root' });
    const healthIndicators = createHealthIndicators(...selectedFighters);
    const fighters = createFighters(...selectedFighters);
    const controlsHint = createControlsHint();
    const quitBtn = createQuitButton(onQuit);

    arena.append(healthIndicators, fighters, controlsHint, quitBtn);
    return arena;
}

export default async function renderArena(selectedFighters) {
    const root = document.getElementById('root');
    const onQuit = () => {
        returnToFighterSelection();
    };
    const arena = createArena(selectedFighters, onQuit);

    root.innerHTML = '';
    root.append(arena);

    const winner = await fight(...selectedFighters);

    if (winner) {
        showWinnerModal(winner);
    }
}
