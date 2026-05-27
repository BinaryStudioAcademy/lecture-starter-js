/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createFighterPreview } from './fighterPreview';

describe('createFighterPreview', () => {
    let container;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('renders fighter image, name, and stats when fighter is provided', () => {
        const fighter = {
            _id: '1',
            name: 'Ryu',
            health: 45,
            attack: 4,
            defense: 3,
            source: 'https://example.com/ryu.gif'
        };

        const preview = createFighterPreview(fighter, 'left');
        container.append(preview);

        expect(preview.querySelector('.fighter-preview___img')?.getAttribute('src')).toBe(fighter.source);
        expect(preview.querySelector('.fighter-preview___name')?.textContent).toBe('Ryu');
        expect(preview.textContent).toContain('Health: 45');
        expect(preview.textContent).toContain('Attack: 4');
        expect(preview.textContent).toContain('Defense: 3');
    });

    it('renders placeholder when fighter is not selected', () => {
        const preview = createFighterPreview(null, 'right');

        expect(preview.textContent).toContain('Select fighter');
    });
});
