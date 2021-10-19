import {
	Actor,
	AssetContainer,
	Context,
	Guid,
	ColliderType
} from '@microsoft/mixed-reality-extension-sdk';

type ModelDescriptor = {
	kitID: string;
	scale: {
		x: number;
		y: number;
		z: number;
	};
	rotation: {
		x: number;
		y: number;
		z: number;
	};
	position: {
		x: number;
		y: number;
		z: number;
	};
	attachposition: {
		x: number;
		y: number;
		z: number;
	};
};

type ModelDatabase = {
	[key: string]: ModelDescriptor;
};
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ModelDatabase: ModelDatabase = require('../public/models.json');

export default class HelloWorld {
	private assets: AssetContainer;

	// attachedObjects is a Map that stores userIds and the attached object
	private attachedObjects = new Map<Guid, Actor>();

	constructor(private context: Context, private baseUrl: string) {
		this.assets = new AssetContainer(context);
		this.context.onStarted(() => this.started());
		
	}
	private started(){
		return Promise.all(
			Object.keys(ModelDatabase).map(modelId => {
				const modelRecord = ModelDatabase[modelId];
				if (modelRecord.kitID) {
					const attachBtn = Actor.CreateFromLibrary(this.context, {
						resourceId: modelRecord.kitID,
						actor: {
							transform: {
								local: {
							scale: modelRecord.scale,
							position: modelRecord.position
							}
				},
						collider: {
						geometry: { shape: ColliderType.Box }
				}
			}

		});	
		
				} 
				
			}));
		
	}
}