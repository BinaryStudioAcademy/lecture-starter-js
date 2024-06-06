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

function criticalAttack(attacker, defender) {
    const criticalHit = attacker.attack * 2;
    const blockPower = getBlockPower(defender);
    const damage = criticalHit - blockPower;
    return damage;
}

export async function fight(firstFighter, secondFighter) {
    return new Promise(resolve => {
        // resolve the promise with the winner when fight is over

        const playerOne = { ...firstFighter, block: false };
        const playerTwo = { ...secondFighter, block: false };
        let lastCriticalPlayerOneStrikeTime = 0;
        let lastCriticalPlayerTwoStrikeTime = 0;
        const playerOneCriticalStrikeKeys = Object.fromEntries(
            controls.PlayerOneCriticalHitCombination.map(key => [key, false])
        );
        const playerTwoCriticalStrikeKeys = Object.fromEntries(
            controls.PlayerTwoCriticalHitCombination.map(key => [key, false])
        );

        document.addEventListener('keydown', event => {
            if (event.code === controls.PlayerOneAttack) {
                // first fighter hits second fighter
                const damage = playerOne.block ? 0 : getDamage(playerOne, playerTwo);
                playerTwo.health -= playerTwo.block ? 0 : damage;
            } else if (event.code in playerOneCriticalStrikeKeys) {
                playerOneCriticalStrikeKeys[event.code] = true;

                const isCriticalStrike = Object.values(playerOneCriticalStrikeKeys).every(Boolean);
                const timeNow = new Date().getTime();

                if (isCriticalStrike && timeNow - lastCriticalPlayerOneStrikeTime > 10000) {
                    const damage = criticalAttack(playerOne, playerTwo);
                    playerTwo.health -= playerTwo.block ? 0 : damage;
                    lastCriticalPlayerOneStrikeTime = timeNow;
                }
            } else if (event.code === controls.PlayerOneBlock) {
                playerOne.block = true;
            }

            if (event.code === controls.PlayerTwoAttack) {
                // second fighter hits first fighter
                const damage = playerTwo.block ? 0 : getDamage(playerTwo, playerOne);
                playerOne.health -= playerOne.block ? 0 : damage;
            } else if (event.code in playerTwoCriticalStrikeKeys) {
                playerTwoCriticalStrikeKeys[event.code] = true;

                const isCriticalStrike = Object.values(playerTwoCriticalStrikeKeys).every(Boolean);
                const timeNow = new Date().getTime();

                if (isCriticalStrike && timeNow - lastCriticalPlayerTwoStrikeTime > 10000) {
                    const damage = criticalAttack(playerOne, playerTwo);
                    playerTwo.health -= playerTwo.block ? 0 : damage;
                    lastCriticalPlayerTwoStrikeTime = timeNow;
                }
            } else if (event.code === controls.PlayerTwoBlock) {
                playerTwo.block = true;
            }

            if (playerOne.health <= 0 || playerTwo.health <= 0) {
                const winner = playerOne.health > 0 ? playerOne : playerTwo;
                resolve(winner);
            }
        });

        document.addEventListener('keyup', event => {
            if (event.code === controls.PlayerOneBlock) {
                playerOne.block = !playerOne.block;
            }

            if (event.code === controls.PlayerTwoBlock) {
                playerTwo.block = !playerTwo.block;
            }

            if (event.code in playerOneCriticalStrikeKeys) {
                playerOneCriticalStrikeKeys[event.code] = false;
            }

            if (event.code in playerTwoCriticalStrikeKeys) {
                playerTwoCriticalStrikeKeys[event.code] = false;
            }
        });
    });
}
