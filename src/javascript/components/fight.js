/* eslint-disable no-use-before-define */
import controls from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
    /*     const [firstFighterHealthIndicator, secondFighterHealthIndicator] = getHealthWidthIndicators(
        firstFighter,
        secondFighter
    ); */
    const firstFightingFighter = createFigthingFigther(firstFighter);
    const secondFightingFighter = createFigthingFigther(secondFighter);
    handleFightControls(firstFightingFighter, secondFightingFighter);

    return new Promise(resolve => {
        // resolve the promise with the winner when fight is over

        if (firstFightingFighter.getHealthStatus() < 0) {
            resolve(secondFighter);
        }
        if (secondFightingFighter.getHealthStatus() < 0) {
            resolve(firstFighter);
        }
    });
}

export function getHitPower(fighterPower) {
    // return hit power
    const criticalHitChance = Math.ceil(Math.random() * 2);
    const strikeForcePower = fighterPower * criticalHitChance;
    return strikeForcePower;
}

export function getBlockPower(fighterPower) {
    // return block power
    const dodgeChance = Math.ceil(Math.random() * 2);
    const blockStrengthPower = fighterPower * dodgeChance;
    return blockStrengthPower;
}

export function getDamage(attacker, defender) {
    // return damage
    const attackResult = getHitPower(attacker) - getBlockPower(defender);
    return attackResult;
    // change width for arena___health-indicator
}

function handleFightControls(firstFightingFighter, secondFightingFighter) {
    const pressedKeys = new Set();
    function keyDownPressed(event) {
        if (!pressedKeys.has(event.code)) {
            switch (event.code) {
                case controls.PlayerOneAttack:
                    handleAttackScenario(firstFightingFighter, secondFightingFighter);
                    break;
                case controls.PlayerTwoAttack:
                    handleAttackScenario(secondFightingFighter, firstFightingFighter);
                    break;
                case controls.PlayerOneBlock:
                    firstFightingFighter.activateDefending();
                    break;
                case controls.PlayerTwoBlock:
                    secondFightingFighter.activateDefending();
                    break;
                case controls.PlayerOneCriticalHitCombination:
                    break;
                case controls.PlayerTwoCriticalHitCombination:
                    break;
                default:
                    break;
            }
        }
    }

    function deletePressedKeyOnKeyUp(event) {
        pressedKeys.delete(event.code);
    }

    // Añadimos los listeners para keydown y keyup
    window.addEventListener('keydown', keyDownPressed);
    window.addEventListener('keyup', deletePressedKeyOnKeyUp);
}

function createFigthingFigther(fighter) {
    let fighterHealth = fighter.health;
    const { defense: fighterDefensePower, attack: fighterAttackPower } = fighter;
    let defending = false;
    return {
        getHealthStatus: () => {
            return fighterHealth;
        },
        getHurt: damage => {
            fighterHealth -= damage;
        },
        getfighterDefensePower: () => {
            return fighterDefensePower;
        },
        getfighterAttackPower: () => {
            return fighterAttackPower;
        },
        activateDefending: () => {
            defending = true;
            setTimeout(() => {
                defending = false;
            }, 1000);
        },
        getDefendingStatus: () => {
            return defending;
        }
    };
}

function handleAttackScenario(attacker, defender) {
    if (defender.getDefendingStatus() === false) {
        const result = getDamage(attacker.getfighterAttackPower(), defender.getfighterDefensePower());
        if (result > 0) {
            defender.getHurt(result);
        }
    }
}
