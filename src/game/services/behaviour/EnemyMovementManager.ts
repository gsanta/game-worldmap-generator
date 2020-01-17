import { IBehaviour } from "./IBehaviour";
import { IEventListener } from "../listeners/IEventListener";
import { GameEvent } from "../GameEventManager";
import { GameFacade } from "../../GameFacade";

export class EnemyMovementManager  implements IEventListener {
    events: GameEvent[];
    private behaviours: IBehaviour[];
    private gameFacade: GameFacade;

    constructor(gameFacade: GameFacade, behaviours: IBehaviour[]) {
        this.gameFacade = gameFacade;
        this.behaviours = behaviours;
        this.updateBehaviours = this.updateBehaviours.bind(this);

        this.events = [
            new GameEvent({isAfterRender: true}, this.updateBehaviours)
        ]
    }
    
    private updateBehaviours() {
        this.gameFacade.gameObjectStore.getEnemies().forEach(enemy => {
            const behaviour = this.behaviours.find(behaviour => behaviour.type === enemy.activeBehaviour);

            behaviour && behaviour.update(enemy);
        });
    }
}