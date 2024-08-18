<script>
	import { createEventDispatcher, onDestroy } from "svelte";

	// MARK: Props
	/**
	 * Whether the marquee should play
	 * @type {boolean}
	 * @default true
	 */
	export let play = true;

	/**
	 * The number of times the marquee should play
	 * @type {number}
	 * @default 0 (infinite)
	 */
	export let playsCount = 0;

	/**
	 * The speed of the marquee
	 * @type {number}
	 * @default 100
	 */
	export let speed = 100;

	/**
	 * The direction of the marquee
	 * @type {"left" | "right" | "up" | "down"}
	 * @default "right"
	 */
	export let direction = "right";

	/**
	 * Whether to repeat the slot content once or multiple times
	 * @type {"single" | "multiple"}
	 * @default "multiple"
	 */
	export let mode = "multiple";

	/**
	 * Whether to show a gradient on both ends; takes precedence
	 * over {@link showLeadingGradient} and {@link showTrailingGradient}
	 * @type {boolean}
	 * @default false
	 */
	export let showGradient = false;

	/**
	 * Whether to show a gradient on the first edge; overwritten by
	 * {@link showGradient}
	 * @type {boolean}
	 * @default false
	 */
	export let showLeadingGradient = false;

	/**
	 * Whether to show a gradient on the last edge; overwritten by
	 * {@link showGradient}
	 * @type {boolean}
	 * @default false
	 */
	export let showTrailingGradient = false;

	export let clientWidth = 0;
	export let clientHeight = 0;

	/** @type {string | undefined} */
	export let style = undefined;

	/** @type {string | null | undefined} */
	let className = undefined;
	export { className as class };

	// MARK: Props validation
	$: if (playsCount < 0) throw new Error('"playsCount" must be greater than or equal to 0');
	$: if (speed <= 0) throw new Error('"speed" must be strictly greater than 0');

	// MARK: Animation logic

	const dispatch = createEventDispatcher();
	/** @type {ReturnType<typeof setInterval> | undefined} */
	let interval;

	$: if (play) {
		for (const animation of animations) {
			animation.play();
		}
		dispatch("playstart");
		stopInterval();
		interval = setInterval(() => {
			if (!animations.length) {
				stopInterval();
				return;
			}
			dispatch("progress", { progress: getProgress(animations[0]) });
		});
	} else if (animations.length && animations[0].playState === "running") {
		for (const animation of animations) {
			animation.pause();
		}
		dispatch("playpause", { progress: getProgress(animations[0]) });
		stopInterval();
	}

	/**
	 * Get the progress of the animation
	 * @param animation {Animation} The animation to get the progress of
	 * @returns {number} The progress of the animation as a number between 0 and 1
	 */
	function getProgress(animation) {
		const currentTime = animation.currentTime;
		if (!currentTime || typeof currentTime !== "number") return 0;
		const duration = animation.effect?.getComputedTiming().duration;
		if (!duration || typeof duration !== "number") return 0;
		return currentTime / duration;
	}

	function stopInterval() {
		if (interval) clearInterval(interval);
	}

	/** @type {HTMLDivElement[]} */
	let marquees = [];
	/** @type {Animation[]} */
	let animations = [];
	let marqueeWidth = 0;
	let marqueeHeight = 0;

	$: if (marquees.length) {
		animations = marquees.map((marquee, index) =>
			marquee.animate(
				[
					{
						transform: `
						translateX(${direction === "right" ? "-100%" : "0"})
						translateY(${direction === "down" ? "-100%" : "0"})
						`
					},
					{
						transform: `
						translateX(${direction === "left" ? "-100%" : "0"})
						translateY(${direction === "up" ? "-100%" : "0"})
						`
					}
				],
				{
					id: `marquee-${index}`,
					duration: (duration ?? 1) * 1000,
					iterations: playsCount || Infinity,
					easing: "linear"
				}
			)
		);
		for (const [i, animation] of animations.entries()) {
			if (i > 0) continue;
			animation.onfinish = () => {
				stopInterval();
				dispatch("playend");
				play = false;
			};
		}
	}

	$: duration =
		/** @type {number | undefined} */
		direction === "left" || direction === "right" ? marqueeWidth / speed : marqueeHeight / speed;

	// MARK: Component unmount
	onDestroy(() => {
		stopInterval();
		for (const animation of animations) {
			animation.cancel();
		}
	});
</script>

<div
	class="marquee-container {className ?? ''}"
	style:--_leading-gradient-width={showGradient || showLeadingGradient ? "10%" : undefined}
	style:--_trailing-gradient-width={showGradient || showTrailingGradient ? "10%" : undefined}
	style:--_direction={direction === "up" || direction === "down" ? "column" : "row"}
	style:--_gradient-direction={direction === "up" || direction === "down" ? "bottom" : "right"}
	{style}
	role="marquee"
	bind:clientWidth
	bind:clientHeight
	on:mouseenter={() => dispatch("hoverstart")}
	on:mouseleave={() => dispatch("hoverend")}
	{...$$restProps}
>
	<div
		bind:this={marquees[0]}
		class="marquee"
		bind:clientWidth={marqueeWidth}
		bind:clientHeight={marqueeHeight}
	>
		<slot />
	</div>
	{#if mode === "multiple"}
		<div bind:this={marquees[1]} class="marquee">
			<slot />
		</div>
	{/if}
</div>

<style>
	.marquee-container {
		position: relative;
		display: flex;
		flex-direction: var(--_direction, row);
		align-items: center;
		overflow: clip;

		&::before {
			content: "";
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: 10;
			background-image: linear-gradient(
				to var(--_gradient-direction, right),
				var(--gradient-color, black),
				transparent var(--gradient-width, var(--_leading-gradient-width, 0)),
				transparent calc(100% - var(--gradient-width, var(--_trailing-gradient-width, 0))),
				var(--gradient-color, black)
			);
		}
	}

	.marquee {
		display: flex;
		flex-direction: var(--_direction, row);
		gap: var(--gap, 0);
		align-items: center;
	}
</style>
