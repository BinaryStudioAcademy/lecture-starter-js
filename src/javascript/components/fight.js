import controls from '../../constants/controls';

const {
    PlayerOneAttack,
    PlayerOneBlock,
    PlayerTwoAttack,
    PlayerTwoBlock,
    PlayerOneCriticalHitCombination,
    PlayerTwoCriticalHitCombination
} = controls;

export function criticalHitChance() {
    return Math.random() + 1;
}

export function dodgeChance() {
    return Math.random() + 1;
}
export function getHitPower(fighter) {
    return fighter.attack * criticalHitChance();
}

export function getBlockPower(fighter) {
    return fighter.defense * dodgeChance();
}

export function criticalHit(fighter) {
    return fighter.attack * 2;
}

export function getDamage(attacker, defender, isBlocked) {
    let damage;
    if (isBlocked) {
        damage = getHitPower(attacker) - getBlockPower(defender);
    } else {
        damage = getHitPower(attacker);
    }

    return Math.max(0, damage);
}

let firstFighterBlockActive = false;
let secondFighterBlockActive = false;

let criticalAttackDelayOneEnd = true;
let criticalAttackDelayTwoEnd = true;

function isCriticalAttackReady() {
    const keysStatuses = Object.values(this);
    const isCombinationNotReady = keysStatuses.includes(false);
    if (isCombinationNotReady) {
        return false;
    }
    return true;
}

const firstFighterCriticalAttackKeys = {
    [PlayerOneCriticalHitCombination[0]]: false,
    [PlayerOneCriticalHitCombination[1]]: false,
    [PlayerOneCriticalHitCombination[2]]: false
};

const secondFighterCriticalAttackKeys = {
    [PlayerTwoCriticalHitCombination[0]]: false,
    [PlayerTwoCriticalHitCombination[1]]: false,
    [PlayerTwoCriticalHitCombination[2]]: false
};

const fighterOneCriticalAttackReady = isCriticalAttackReady.bind(firstFighterCriticalAttackKeys);
const fighterTwoCriticalAttackReady = isCriticalAttackReady.bind(secondFighterCriticalAttackKeys);

export async function fight(firstFighter, secondFighter) {
    let firstFighterHealth = firstFighter.health;
    let secondFighterHealth = secondFighter.health;

    const leftFighterIndicator = document.getElementById('left-fighter-indicator');
    const rightFighterIndicator = document.getElementById('right-fighter-indicator');

    return new Promise(resolve => {
        document.addEventListener('keydown', e => {
            switch (e.code) {
                case PlayerOneAttack:
                    if (!secondFighterBlockActive && !e.repeat) {
                        const damage = getDamage(firstFighter, secondFighter, secondFighterBlockActive);

                        secondFighterHealth = Math.max(0, secondFighterHealth - damage);
                    }

                    break;
                case PlayerTwoAttack:
                    if (!firstFighterBlockActive && !e.repeat) {
                        const damage = getDamage(secondFighter, firstFighter, firstFighterBlockActive);

                        firstFighterHealth = Math.max(0, firstFighterHealth - damage);
                    }
                    break;

                case PlayerOneBlock:
                    firstFighterBlockActive = true;
                    break;

                case PlayerTwoBlock:
                    secondFighterBlockActive = true;
                    break;

                case PlayerOneCriticalHitCombination[0]:
                case PlayerOneCriticalHitCombination[1]:
                case PlayerOneCriticalHitCombination[2]:
                    firstFighterCriticalAttackKeys[e.code] = true;

                    if (fighterOneCriticalAttackReady() && !e.repeat && criticalAttackDelayOneEnd) {
                        const damage = criticalHit(firstFighter);
                        secondFighterHealth -= damage;
                        criticalAttackDelayOneEnd = false;
                        setTimeout(() => {
                            criticalAttackDelayOneEnd = true;
                        }, 10000);
                    }
                    break;

                case PlayerTwoCriticalHitCombination[0]:
                case PlayerTwoCriticalHitCombination[1]:
                case PlayerTwoCriticalHitCombination[2]:
                    secondFighterCriticalAttackKeys[e.code] = true;
                    if (fighterTwoCriticalAttackReady() && !e.repeat && criticalAttackDelayTwoEnd) {
                        const damage = criticalHit(secondFighter);
                        firstFighterHealth -= damage;
                        criticalAttackDelayTwoEnd = false;
                        setTimeout(() => {
                            criticalAttackDelayTwoEnd = true;
                        }, 10000);
                    }
                    break;
                default:
                    break;
            }
            const leftHealthBarWidth = (firstFighterHealth / firstFighter.health) * 100;
            const rightHealhBarWidth = (secondFighterHealth / secondFighter.health) * 100;

            leftFighterIndicator.style.width = `${leftHealthBarWidth}%`;
            rightFighterIndicator.style.width = `${rightHealhBarWidth}%`;

            if (firstFighterHealth <= 0) {
                leftFighterIndicator.style.width = '0px';
                resolve(secondFighter);
            } else if (secondFighterHealth <= 0) {
                rightFighterIndicator.style.width = '0px';
                resolve(firstFighter);
            }
        });

        document.addEventListener('keyup', e => {
            switch (e.code) {
                case PlayerOneBlock:
                    firstFighterBlockActive = false;
                    break;

                case PlayerTwoBlock:
                    secondFighterBlockActive = false;
                    break;

                case PlayerOneCriticalHitCombination[0]:
                case PlayerOneCriticalHitCombination[1]:
                case PlayerOneCriticalHitCombination[2]:
                    firstFighterCriticalAttackKeys[e.code] = false;
                    break;

                case PlayerTwoCriticalHitCombination[0]:
                case PlayerTwoCriticalHitCombination[1]:
                case PlayerTwoCriticalHitCombination[2]:
                    secondFighterCriticalAttackKeys[e.code] = false;
                    break;
                default:
                    break;
            }
        });
    });
}
