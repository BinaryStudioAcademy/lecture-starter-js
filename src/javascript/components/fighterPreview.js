import createElement from '../helpers/domHelper';

export function createFighterImage(fighter) {
    const { source, name } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    return createElement({
        tagName: 'img',
        className: 'fighter-preview___img',
        attributes
    });
}

export function createFighterPreview(fighter, position) {
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`
    });

    if (!fighter) {
        const placeholder = createElement({ tagName: 'div', className: 'fighter-preview___name' });
        placeholder.innerText = 'Select fighter';
        fighterElement.append(placeholder);
        return fighterElement;
    }

    const image = createFighterImage(fighter);
    const name = createElement({ tagName: 'div', className: 'fighter-preview___name' });
    const stats = createElement({ tagName: 'div', className: 'fighter-preview___stats' });
    const health = createElement({ tagName: 'div', className: 'fighter-preview___stat' });
    const attack = createElement({ tagName: 'div', className: 'fighter-preview___stat' });
    const defense = createElement({ tagName: 'div', className: 'fighter-preview___stat' });

    name.innerText = fighter.name ?? '';
    health.innerText = `Health: ${fighter.health ?? ''}`;
    attack.innerText = `Attack: ${fighter.attack ?? ''}`;
    defense.innerText = `Defense: ${fighter.defense ?? ''}`;

    stats.append(health, attack, defense);
    fighterElement.append(image, name, stats);

    return fighterElement;
}
