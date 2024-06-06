import showModal from './modal';

export default function showWinnerModal(fighter) {
    // call showModal function
    showModal({ title: 'Winner', bodyElement: `${fighter.name} wins!` });
}
