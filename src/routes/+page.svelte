<script>
	import Marquee from "$lib";

	let play = true;
</script>

<Marquee
	bind:play
	speed={100}
	direction="right"
	showGradient
	on:hoverstart={() => (play = false)}
	on:hoverend={() => (play = true)}
	on:playstart={() => console.log("playstart")}
	on:playpause={() => console.log("playpause")}
	on:playend={() => console.log("playend")}
>
	<!-- eslint-disable-next-line no-unused-vars -->
	{#each Array(10) as _, i}
		<span>Element {i + 1}</span>
	{/each}
</Marquee>
