import controls from '../../constants/controls';

const getRandomNumber = () => Math.random() + 1;

export function getHitPower(fighter) {
    // return hit power
    return fighter.attack * getRandomNumber();
}

export function getBlockPower(fighter) {
    // return block power
    return fighter.defense * getRandomNumber();
}

export function getDamage(attacker, defender) {
    // return damage
    const hitPower = getHitPower(attacker);
    const blockPower = getBlockPower(defender);
    const damage = hitPower - blockPower;
    return damage > 0 ? damage : 0;
}

export async function fight(firstFighter, secondFighter) {
    return new Promise(resolve => {
        // resolve the promise with the winner when fight is over

        const firstFighterPhase = { ...firstFighter, block: false };
        const secondFighterPhase = { ...secondFighter, block: false };

        document.addEventListener('keydown', event => {
            if (event.code === controls.PlayerOneAttack) {
                // first fighter hits second fighter
                const damage = firstFighterPhase.block ? 0 : getDamage(firstFighterPhase, secondFighterPhase);
                secondFighterPhase.health -= secondFighterPhase.block ? 0 : damage;
            } else if (event.code === controls.PlayerOneBlock) {
                firstFighterPhase.block = true;
            }

            if (event.code === controls.PlayerTwoAttack) {
                // second fighter hits first fighter
                const damage = secondFighterPhase.block ? 0 : getDamage(secondFighterPhase, firstFighterPhase);
                firstFighterPhase.health -= firstFighterPhase.block ? 0 : damage;
            } else if (event.code === controls.PlayerTwoBlock) {
                secondFighterPhase.block = true;
            }

            if (firstFighterPhase.health <= 0 || secondFighterPhase.health <= 0) {
                const winner = firstFighterPhase.health > 0 ? firstFighterPhase : secondFighterPhase;
                resolve(winner);
            }
        });

        document.addEventListener('keyup', event => {
            if (event.code === controls.PlayerOneBlock) {
                firstFighterPhase.block = !firstFighterPhase.block;
            }

            if (event.code === controls.PlayerTwoBlock) {
                secondFighterPhase.block = !secondFighterPhase.block;
            }
        });
    });
}
