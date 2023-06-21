import createElement from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`
    });
    // todo: show fighter info (image, name, health, etc.)

    if (fighter) {
        // eslint-disable-next-line no-use-before-define
        const fighterImage = createFighterImage(fighter);
        const fighterName = createElement({ tagName: 'h3' });
        const fighterDetails = createElement({
            tagName: 'div',
            className: 'fighter-details'
        });
        const fighterDetailsWrapper = createElement({
            tagName: 'div',
            className: 'fighter-details-wrapper'
        });
        fighterDetails.innerHTML = `
            <div class="fighter-detail-cell">
              <p>${fighter.attack}</p>
            </div>
            <div class="fighter-detail-cell">
              <p>${fighter.defense}</p>
            </div>
            <div class="fighter-detail-cell">
              <p>${fighter.health}</p>
            </div>
            `;
        fighterName.innerText = fighter.name;
        fighterDetailsWrapper.append(fighterName, fighterDetails);
        fighterElement.append(fighterImage, fighterDetailsWrapper);
    }
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
