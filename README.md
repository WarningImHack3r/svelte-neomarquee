> [!WARNING]
> Not released yet, fixing some stuff before.

# svelte-neomarquee

An event-driven and feature-rich marquee component for Svelte.

## Motivation

Existing marquee libraries either lack of features, customization or ease of use.
Its goal is to start from [svelte-fast-marquee](https://github.com/abosch19/svelte-fast-marquee) and [svelte-marquee
](https://github.com/selemondev/svelte-marquee) and leverage the UX and customization possibilities.

## Features

- Highly customizable
- Strongly typed
- Event-driven
- TailwindCSS-compatible

## Installation

```shell
# pnpm
pnpm i -D svelte-neomarquee
# npm
npm i -D svelte-neomarquee
# bun
bun i -D svelte-neomarquee
# yarn
yarn add -D svelte-neomarquee
```

## Usage

### Props

|     Name     |                 Type                  | Description                                                | Mandatory | Default value |
| :----------: | :-----------------------------------: | :--------------------------------------------------------- | :-------: | :-----------: |
|    `play`    |                boolean                | Whether the marquee should play                            |    No     |    `true`     |
| `playsCount` |                number                 | The number of times the marquee should play (0 = infinite) |    No     |      `0`      |
|   `speed`    |                number                 | The speed of the marquee, relative to its width/height     |    No     |     `100`     |
| `direction`  | `"left" \| "right" \| "up" \| "down"` | The direction of the marquee                               |    No     |   `"right"`   |
|  `gradient`  |                boolean                | Whether to show a gradient on both ends                    |    No     |    `false`    |

You can also pass:

- `style` to add inline styles to the marquee container
- `class` to add classes to the marquee container
- any other prop, which will be passed to the marquee container

### CSS variables

You can pass the following CSS variables through the `style` prop (or through `class` with TailwindCSS) to customize the
marquee:

| Variable           |  Type  | Description                             | Mandatory |    Default value    |
| :----------------- | :----: | :-------------------------------------- | :-------: | :-----------------: |
| `--gap`            | string | The gap between elements in the marquee |    No     |         `0`         |
| `--gradient-width` | string | The width of the gradient on both sides |    No     |        `10%`        |
| `--gradient-color` | string | The color of the gradient               |    No     | `black` (`#000000`) |

### Events

| Name         | Description                                                                          | Event `detail`'s parameters                       |
| :----------- | :----------------------------------------------------------------------------------- | :------------------------------------------------ |
| `playstart`  | The marquee starts playing                                                           | None                                              |
| `playpause`  | The marquee pauses playing (`play` set to `false` but animation not ended)           | `progress`: the current progress, between 0 and 1 |
| `playend`    | The marquee ends its animation (only triggered on animation end if `playsCount` > 0) | None                                              |
| `progress`   | The current progress of the marquee, live-updated                                    | `progress`: the current progress, between 0 and 1 |
| `hoverstart` | The mouse enters the marquee                                                         | None                                              |
| `hoverend`   | The mouse leaves the marquee                                                         | None                                              |

### Slots

| Name | Description                         |
| :--: | :---------------------------------- |
|  -   | Elements to show inside the marquee |

## Examples

### Basic

```svelte
<script>
	import Marquee from "svelte-neomarquee";
</script>

<Marquee>
	{#each Array(10) as _, i}
		<span>Element {i + 1}</span>
	{/each}
</Marquee>
```

### Pause on hover

```svelte
<script>
	import Marquee from "svelte-neomarquee";

	let play = true;
</script>

<Marquee bind:play on:hoverstart={() => (play = false)} on:hoverend={() => (play = true)}>
	...
</Marquee>
```

### Custom speed

```svelte
<script>
	import Marquee from "svelte-neomarquee";
</script>

<Marquee speed={200}>...</Marquee>
```

### Custom gradient

```svelte
<script>
	import Marquee from "$lib";
</script>

<Marquee showGradient style="--gradient-color: red; --gradient-width: 200px">...</Marquee>
<!-- or with TailwindCSS -->
<Marquee showGradient class="[--gradient-color:_red] [--gradient-width:_200px]">...</Marquee>
```

## License

MIT
