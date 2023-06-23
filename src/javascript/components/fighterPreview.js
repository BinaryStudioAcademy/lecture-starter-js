import createElement from '../helpers/domHelper';

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

export function createFighterPreview(fighter, position) {
    if (!fighter) {
        return ' ';
    }
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
        innerText: `Name: ${fighter.name}`
    });

    const fighterHealth = createElement({
        tagName: 'span',
        className: 'fighter-preview___health',
        innerText: `Health: ${fighter.health}`
    });
    fighterElement.append(fighterImage, fighterName, fighterHealth);
    return fighterElement;
}
