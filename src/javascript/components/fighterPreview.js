import createElement from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`
    });

    // todo: show fighter info (image, name, health, etc.)
    const fighterImage = createFighterImage(fighter);
    const fighterName = createElement({
        tagName: 'span',
        className: 'fighter-preview___name',
    });
    fighterName.innerText = fighter.name;

    const fighterHealth = createElement({
        tagName: 'span',
        className: 'fighter-preview___health',
    });
    fighterHealth.innerText = `Health: ${fighter.health}`;

    const fighterAttack = createElement({
        tagName: 'span',
        className: 'fighter-preview___attack',
    });

    fighterAttack.innerText = `Attack: ${fighter.attack}`;  

    const fighterDefense = createElement({
        tagName: 'span',
        className: 'fighter-preview___defense',
    });
    fighterDefense.innerText = `Defense: ${fighter.defense}`;

    fighterElement.append(fighterImage, fighterName, fighterHealth, fighterAttack, fighterDefense);

    return fighterElement;
}

export function createFighterImage(fighter) {
    const { source, name } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    const imgElement = createElement({
        tagName: 'img',
        className: 'fighter-preview___img',
        attributes
    });

    return imgElement;
}
