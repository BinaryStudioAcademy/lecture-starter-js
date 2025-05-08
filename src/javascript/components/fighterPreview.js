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
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`
    });

    const fighterName = createElement({
        tagName: 'h2',
        className: 'fighterName'
    });

    const fighterStats = createElement({
        tagName: 'div',
        className: 'fighterStats'
    });

    // todo: show fighter info (image, name, health, etc.)
    if (fighter) {
        const { name, health, attack, defense } = fighter;
        const image = createFighterImage(fighter);
        fighterName.innerHTML = name;
        fighterStats.innerHTML = `<p>HP: ${health}</p><p>ATK: ${attack}</p><p>DEF: ${defense}</p>`;

        fighterElement.append(image, fighterName, fighterStats);
    }

    return fighterElement;
}
