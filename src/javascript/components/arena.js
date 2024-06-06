import createElement from '../helpers/domHelper';
import { createFighterImage } from './fighterPreview';
import { fight } from './fight';
import showWinnerModal from './modal/winner';

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

function createArena(selectedFighters) {
    const arena = createElement({ tagName: 'div', className: 'arena___root' });
    const healthIndicators = createHealthIndicators(...selectedFighters);
    const fighters = createFighters(...selectedFighters);

    arena.append(healthIndicators, fighters);
    return arena;
}

function createFightElement() {
    const fightElement = createElement({ tagName: 'div', className: 'arena__fight_element' });
    const imageFightElement = createElement({
        tagName: 'img',
        className: 'fight__image',
        attributes: { src: 'resources/fight.png' }
    });

    fightElement.append(imageFightElement);
    return fightElement;
}

function startFight(firstFighter, secondFighter, fightElement) {
    const FIGHT_START_DELAY = 1000;
    const FIGHT_END_DELAY = 2000;

    setTimeout(() => {
        document.getElementById('root').append(fightElement);
    }, FIGHT_START_DELAY);

    setTimeout(() => {
        fightElement.remove();
        fight(firstFighter, secondFighter).then(winner => {
            showWinnerModal(winner);
        });
    }, FIGHT_END_DELAY);
}

export default function renderArena(selectedFighters) {
    const root = document.getElementById('root');
    const arena = createArena(selectedFighters);
    const fightElement = createFightElement();

    root.innerHTML = '';
    root.append(arena);

    // todo:
    // - start the fight
    // - when fight is finished show winner

    const [firstFighter, secondFighter] = selectedFighters;

    startFight(firstFighter, secondFighter, fightElement);
}
