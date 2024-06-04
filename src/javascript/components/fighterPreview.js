import createElement from '../helpers/domHelper';

export function createFighterImage(fighter, position = null) {
    const { source, name } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    const imgElement = createElement({
        tagName: 'img',
        className: position > 0 ? 'fighter-preview___img fighter-preview__mirror-img' : 'fighter-preview___img',
        attributes
    });

    return imgElement;
}

function displayFighterInfo(fighters, container) {
    fighters.forEach((fighter, index) => {
        if (!fighter) return;
        const { name, health, attack, defense } = fighter;
        const imageElement = createFighterImage(fighter, index);
        const dataContainer = createElement({
            tagName: 'div',
            className: 'fighter-preview___data-container'
        });
        const nameElement = createElement({
            tagName: 'span',
            className: 'fighter-preview___name',
            attributes: { title: name }
        });
        const healthElement = createElement({
            tagName: 'span',
            className: 'fighter-preview___health'
        });
        const attackElement = createElement({
            tagName: 'span',
            className: 'fighter-preview___attack'
        });
        const defenseElement = createElement({
            tagName: 'span',
            className: 'fighter-preview___defense'
        });

        nameElement.innerText = `Name: ${name}`;
        healthElement.innerText = `Health: ${health}`;
        attackElement.innerText = `Attack: ${attack}`;
        defenseElement.innerText = `Defense: ${defense}`;

        dataContainer.append(nameElement, healthElement, attackElement, defenseElement);

        container.append(imageElement, dataContainer);
    });
}

export function createFighterPreview(fighter, position) {
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`
    });

    // todo: show fighter info (image, name, health, etc.)

    const fighterOne = position === 'left' ? fighter : undefined;
    const fighterTwo = position === 'right' ? fighter : undefined;
    const fighters = [fighterOne, fighterTwo];

    displayFighterInfo(fighters, fighterElement);

    return fighterElement;
}
