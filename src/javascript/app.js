import createFighters from './components/fightersView';
import fighterService from './services/fightersService';

class App {
    static rootElement = document.getElementById('root');

    static loadingElement = document.getElementById('loading-overlay');

    static async startApplication() {
        try {
            App.loadingElement.style.visibility = 'visible';

            const fighters = await fighterService.getFighters();
            const fightersElement = createFighters(fighters);

            App.rootElement.appendChild(fightersElement);
        } catch (error) {
            console.warn(error);
            App.rootElement.innerText = 'Failed to load data';
        } finally {
            App.loadingElement.style.visibility = 'hidden';
        }
    }
}

export default App;
