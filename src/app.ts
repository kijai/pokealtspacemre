import * as MRE from '@microsoft/mixed-reality-extension-sdk';

interface ControlDefinition {
	label: string;
	action: (incr: number) => string;
	realtime?: boolean;
	labelActor?: MRE.Actor;
}

export default class AnimationTest {
	public expectedResultDescription = "Tweak an animation";
	public videoplayer: MRE.Actor = null;
	private assets: MRE.AssetContainer;
	private timeout: NodeJS.Timeout;
	private mat: MRE.Material;
	//public model: MRE.Actor = null;
	constructor(private context: MRE.Context, private baseUrl: string) {
		this.context.onStarted(() => this.started());
	}

	public cleanup() {
		clearInterval(this.timeout);
		this.assets.unload();
	}

	public started() {
		this.assets = new MRE.AssetContainer(this.context);
		this.tracktor();
		};
		
	public async tracktor() {
		let _animState = 0;
		
		const tracktormodel = MRE.Actor.CreateFromGltf(new MRE.AssetContainer(this.context), {
			uri: `${this.baseUrl}/tracktor_transmission_inner_textured.glb`,
			
			colliderType: 'box',
			actor: {
				name: 'Tracktor_transmission',
				transform: {
					local: {
						position: { x: 0, y: 0, z: 0 },
						scale: { x: 1, y: 1, z: 1 },
						rotation: {y:180}
					}
				},
				grabbable: true
			}
		});
		this.mat = this.assets.materials[0];  
		await tracktormodel.created();
		const tracktoranim = tracktormodel.targetingAnimationsByName.get("forward");
		tracktoranim.wrapMode = MRE.AnimationWrapMode.PingPong;
		/*const flexrollclickbehavior = tracktormodel.setBehavior(MRE.ButtonBehavior);
		flexrollclickbehavior.onClick (_=>{
			if (tracktoranim.isPlaying){
				tracktoranim.stop();
			}else{
				tracktoranim.play();
			}
			
		});*/
		const buttonMesh = this.assets.createBoxMesh('button', 0.5, 0.5, 0.02);
		const AnimButton = MRE.Actor.Create(this.context, {
			actor: {
				
				name: "playanim",
				appearance: { meshId: buttonMesh.id },
				transform: {
					local: {
				position: { x: -0.4, y: 0.5, z: 0 } 
				}
			},
			collider: {
			geometry: { shape: MRE.ColliderType.Box }
				}
			}

		});
				 											
		const AnimButtonBehavior = AnimButton.setBehavior(MRE.ButtonBehavior);
		const cycleanimState = () => {
				if (_animState === 0) {
					
					
						tracktoranim.play();
					
					MRE.Animation.AnimateTo(this.context, AnimButton, {
						destination: { transform: { local: { scale: { x: 0.5, y: 0.5, z: 0.5 } } } },
						duration: 0.3,
						easing: MRE.AnimationEaseCurves.EaseOutSine
						});

				} else if (_animState === 1) {
					tracktoranim.stop();

					MRE.Animation.AnimateTo(this.context, AnimButton, {
						destination: { transform: { local: { scale: { x: 1, y: 1, z: 1 } } } },
						duration: 0.3,
						easing: MRE.AnimationEaseCurves.EaseOutSine
						});
				}
				_animState = (_animState + 1) % 2;
			};
		AnimButtonBehavior.onButton('released', cycleanimState);

	MRE.Actor.Create(this.context, {
				actor: {
					parentId: AnimButton.id,
					name: 'label',
					text: {
						contents: "play",
						height: 0.1,
						anchor: MRE.TextAnchorLocation.MiddleLeft
					},
					transform: {
						local: { position: { x: 0, y: 0.5, z: 0 } }
					}
				}
			});


	}

	
}