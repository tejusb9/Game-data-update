<script>
	import { onMount } from 'svelte';
	import YardsaleYSMIntro from "$components/yardsale/Yardsale.YSMIntro.svelte";
	import Scrolly from "$components/helpers/Scrolly.svelte";
	import { fade } from 'svelte/transition';
	export let words; // words from google doc
	
	export let container; // container name, ie "scrolly3"
	let currentStageNumber = 0; // stage number
	let currentStage; // full stage name, ie "scrolly3-1"

	let value = 0; // current step, binded to scroll 
	let containerHeight;
	let stepHeight;
	let stepWidth;
	let panelHeight = stepWidth * 0.8;
	let bgColor = "#000"
	let bgOpacity = 1;
	let r = 0;
	let currentText;
	let currentLocation = 0;
	let progress;
	let loaded = 0;

	// Keyframes for each stage
	const stageLookup = {
		"scrolly1-0": [
			{"image":"pawnshop", "xmetric":"left", "x":0, "ymetric": "top", "y":0, "width": 105, "opacity": 1},
			{"image":"watch-zoom", "xmetric":"left", "x":0, "ymetric": "top","y":0, "width": 105, "opacity": 0},
			{"image":"phone", "xmetric":"left","x":-50, "ymetric": "top", "y":20, "width": 30, "opacity": 0},
			{"image":"plus-minus1", "xmetric":"left","x":0, "ymetric": "top", "y":0, "width": 105, "opacity": 0},
			{"image":"watch-zoom2", "xmetric":"left","x":-20, "ymetric": "top", "y":-20, "width": 140, "opacity": 0}
			],
		"scrolly1-1": [
			{"image":"pawnshop", "xmetric":"left","x":-20, "ymetric": "top", "y":-20, "width": 140, "opacity": 0},
			{"image":"watch-zoom", "xmetric":"left","x":50, "ymetric": "top", "y":25, "width": 45, "opacity": 1},
			{"image":"phone", "xmetric":"left","x":2, "ymetric": "top", "y":25, "width": 50, "opacity": 1},
			{"image":"plus-minus1", "xmetric":"left","x":-20, "ymetric": "top", "y":-20, "width": 140, "opacity": 0},
			{"image":"watch-zoom2", "xmetric":"left","x":-100, "ymetric": "top", "y":-20, "width": 140, "opacity": 0}
			],
		"scrolly1-2": [
			{"image":"pawnshop", "xmetric":"left","x":-20, "ymetric": "top", "y":-20, "width": 140, "opacity": 0},
			{"image":"watch-zoom", "xmetric":"left","x":50, "ymetric": "top", "y":25, "width": 45, "opacity": 1},
			{"image":"phone", "xmetric":"left","x":-50, "ymetric": "top", "y":20, "width": 30, "opacity": 0},
			{"image":"plus-minus1", "xmetric":"left","x":-20, "ymetric": "top", "y":-20, "width": 140, "opacity": 0},
			{"image":"watch-zoom2", "xmetric":"left","x":10, "ymetric": "top", "y":25, "width": 40, "opacity": 1},
			{"image":"plus-minus2", "xmetric":"left","x":-20, "ymetric": "top", "y":-20, "width": 140, "opacity": 0}
			],
		"scrolly1-3": [
			{"image":"pawnshop", "xmetric":"left","x":0, "ymetric": "top", "y":0, "width": 100, "opacity": 0},
			{"image":"watch-zoom", "xmetric":"left","x":5, "ymetric": "top", "y":5, "width": 90, "opacity": 0},
			{"image":"phone", "xmetric":"left","x":-50, "ymetric": "top", "y":20, "width": 30, "opacity": 0},
			{"image":"plus-minus1", "xmetric":"left","x":0, "ymetric": "top", "y":0, "width": 100, "opacity": 1},
			{"image":"watch-zoom2", "xmetric":"left","x":5, "ymetric": "top", "y":5, "width": 90, "opacity": 0},
			{"image":"plus-minus2", "xmetric":"left","x":5, "ymetric": "top", "y":5, "width": 90, "opacity": 0}
			],
		"scrolly1-4": [
			{"image":"pawnshop", "xmetric":"left","x":0, "ymetric": "top", "y":0, "width": 100, "opacity": 0},
			{"image":"watch-zoom", "xmetric":"left","x":0, "ymetric": "top", "y":0, "width": 100, "opacity": 0},
			{"image":"phone", "xmetric":"left","x":-50, "ymetric": "top", "y":20, "width": 30, "opacity": 0},
			{"image":"plus-minus1", "xmetric":"left","x":0, "ymetric": "top", "y":0, "width": 100, "opacity": 1},
			{"image":"watch-zoom2", "xmetric":"left","x":-50, "ymetric": "top", "y":20, "width": 100, "opacity": 0},
			{"image":"plus-minus2", "xmetric":"left","x":0, "ymetric": "top", "y":0, "width": 100, "opacity": 1}
			],
		"scrolly1-5": [
			{"image":"pawnshop", "xmetric":"left","x":0, "ymetric": "top", "y":0, "width": 100, "opacity": 0},
			{"image":"watch-zoom", "xmetric":"left","x":0, "ymetric": "top", "y":0, "width": 100, "opacity": 0},
			{"image":"phone", "xmetric":"left","x":-50, "ymetric": "top", "y":20, "width": 30, "opacity": 0},
			{"image":"plus-minus1", "xmetric":"left","x":-10, "ymetric": "top", "y":-10, "width": 120, "opacity": 0},
			{"image":"watch-zoom2", "xmetric":"left","x":-50, "ymetric": "top", "y":20, "width": 100, "opacity": 0},
			{"image":"plus-minus2", "xmetric":"left","x":-10, "ymetric": "top", "y":-10, "width": 120, "opacity": 1},
			{"image":"oligarch", "xmetric":"left","x":-10, "ymetric": "top", "y":-10, "width": 120, "opacity": 0}
		],
		"scrolly1-6": [
			{"image":"pawnshop", "xmetric":"left","x":0, "ymetric": "top", "y":0, "width": 100, "opacity": 0},
			{"image":"watch-zoom", "xmetric":"left","x":0, "ymetric": "top", "y":0, "width": 100, "opacity": 0},
			{"image":"phone", "xmetric":"left","x":-50, "ymetric": "top", "y":20, "width": 30, "opacity": 0},
			{"image":"plus-minus1", "xmetric":"left","x":0, "ymetric": "top", "y":0, "width": 100, "opacity": 1},
			{"image":"watch-zoom2", "xmetric":"left","x":-50, "ymetric": "top", "y":20, "width": 100, "opacity": 0},
			{"image":"plus-minus2", "xmetric":"left","x":0, "ymetric": "top", "y":0, "width": 100, "opacity": 1},
			{"image":"oligarch", "xmetric":"left","x":0, "ymetric": "top", "y":0, "width": 100, "opacity": 1}
		],
		"scrolly2-0": [
			{"image":"the-100", "xmetric":"left","x":0, "ymetric": "top", "y":0, "width": 100, "opacity": 1},
			{"image":"player1-full", "xmetric":"left","x":-30, "ymetric": "bottom", "y":5, "width": 30, "opacity": 0},
			{"image":"player2-full", "xmetric":"right","x":-30, "ymetric": "bottom", "y":5, "width": 30, "opacity": 0}
			],
		"scrolly2-1": [
			{"image":"the-100", "xmetric":"left","x":0, "ymetric": "top", "y":0, "width": 100, "opacity": 0.3},
			{"image":"player1-full", "xmetric":"left","x":0, "ymetric": "bottom", "y":0, "width": 100, "opacity": 1},
			{"image":"player2-full", "xmetric":"right","x": 5, "ymetric": "bottom", "y":5, "width": 30, "opacity": 1},
			{"image":"player1-happy", "xmetric":"left","x":-20, "ymetric": "top", "y":33, "width": 30, "opacity": 0},
			{"image":"player2-happy", "xmetric":"right","x": -20, "ymetric": "top", "y":33, "width": 30, "opacity": 0},
			{"image":"player1-sad", "xmetric":"left","x":5, "ymetric": "top", "y":33, "width": 30, "opacity": 0},
			{"image":"coin-flipping", "xmetric":"left","x":50, "ymetric": "top", "y":200, "width": 10, "opacity": 1},
			{"image":"coin-tails", "xmetric":"left","x":50, "ymetric": "top", "y":200, "width": 10, "opacity": 0}
		],
		"scrolly2-2": [
			{"image":"the-100", "xmetric":"left","x":0, "ymetric": "top", "y":0, "width": 100, "opacity": 0.3},
			{"image":"player1-full", "xmetric":"left","x":0, "ymetric": "bottom", "y":0, "width": 100, "opacity": 1},
			{"image":"player2-full", "xmetric":"right","x": 5, "ymetric": "bottom", "y":5, "width": 30, "opacity": 1},
			{"image":"player1-happy", "xmetric":"left","x":-20, "ymetric": "top", "y":33, "width": 30, "opacity": 0},
			{"image":"player2-happy", "xmetric":"right","x": -20, "ymetric": "top", "y":33, "width": 30, "opacity": 0},
			{"image":"player1-sad", "xmetric":"left","x":5, "ymetric": "top", "y":33, "width": 30, "opacity": 0},
			{"image":"coin-flipping", "xmetric":"left","x":50, "ymetric": "top", "y":200, "width": 10, "opacity": 1},
			{"image":"coin-tails", "xmetric":"left","x":50, "ymetric": "top", "y":200, "width": 10, "opacity": 0}
			],
		"scrolly2-3": [
			{"image":"the-100", "xmetric":"left","x":-50, "ymetric": "top", "y":-50, "width": 200, "opacity": 0.1},
			{"image":"player1-full", "xmetric":"left","x":5, "ymetric": "bottom", "y":5, "width": 30, "opacity": 0},
			{"image":"player2-full", "xmetric":"right","x": 5, "ymetric": "bottom", "y":5, "width": 30, "opacity": 0},
			{"image":"player1-happy", "xmetric":"left","x":5, "ymetric": "top", "y":33, "width": 30, "opacity": 1},
			{"image":"player2-happy", "xmetric":"right","x": 5, "ymetric": "top", "y":33, "width": 30, "opacity": 1},
			{"image":"player1-sad", "xmetric":"left","x":5, "ymetric": "top", "y":33, "width": 30, "opacity": 0},
			{"image":"coin-flipping", "xmetric":"left","x":50, "ymetric": "top", "y":200, "width": 10, "opacity": 1},
			{"image":"coin-tails", "xmetric":"left","x":50, "ymetric": "top", "y":33, "width": 10, "opacity": 0}
			],
		"scrolly2-4": [
			{"image":"the-100", "xmetric":"left","x":-50, "ymetric": "top", "y":-50, "width": 200, "opacity": 0.1},
			{"image":"player1-full", "xmetric":"left","x":5, "ymetric": "bottom", "y":5, "width": 30, "opacity": 0},
			{"image":"player2-full", "xmetric":"right","x": 5, "ymetric": "bottom", "y":5, "width": 30, "opacity": 0},
			{"image":"player1-happy", "xmetric":"left","x":5, "ymetric": "top", "y":33, "width": 30, "opacity": 1},
			{"image":"player2-happy", "xmetric":"right","x": 5, "ymetric": "top", "y":33, "width": 30, "opacity": 1},
			{"image":"player1-sad", "xmetric":"left","x":5, "ymetric": "top", "y":33, "width": 30, "opacity": 0},
			{"image":"coin-flipping", "xmetric":"left","x":45, "ymetric": "top", "y":33, "width": 10, "opacity": 1},
			{"image":"coin-tails", "xmetric":"left","x":44, "ymetric": "top", "y":33, "width": 12, "opacity": 0}
			],
		"scrolly2-5": [
			{"image":"the-100", "xmetric":"left","x":-50, "ymetric": "top", "y":-50, "width": 200, "opacity": 0.1},
			{"image":"player1-full", "xmetric":"left","x":5, "ymetric": "bottom", "y":5, "width": 30, "opacity": 0},
			{"image":"player3-full", "xmetric":"right","x": 5, "ymetric": "bottom", "y":5, "width": 30, "opacity": 0},
			{"image":"player1-happy", "xmetric":"left","x":5, "ymetric": "top", "y":33, "width": 30, "opacity": 0},
			{"image":"player2-happy", "xmetric":"right","x": 5, "ymetric": "top", "y":33, "width": 30, "opacity": 1},
			{"image":"player1-sad", "xmetric":"left","x":5, "ymetric": "top", "y":33, "width": 30, "opacity": 1},
			{"image":"coin-flipping", "xmetric":"left","x":45, "ymetric": "top", "y":40, "width":10, "opacity": 0},
			{"image":"coin-tails", "xmetric":"left","x":44, "ymetric": "top", "y":40, "width":12, "opacity": 1}
			],
		"scrolly2-6": [
			{"image":"the-100", "xmetric":"left","x":-50, "ymetric": "top", "y":-50, "width": 200, "opacity": 0.1},
			{"image":"player1-full", "xmetric":"left","x":-60, "ymetric": "bottom", "y":5, "width": 30, "opacity": 0},
			{"image":"player3-full", "xmetric":"right","x": -60, "ymetric": "bottom", "y":5, "width": 30, "opacity": 0},
			{"image":"player1-happy", "xmetric":"left","x":5, "ymetric": "top", "y":33, "width": 30, "opacity": 0},
			{"image":"player2-happy", "xmetric":"right","x": 5, "ymetric": "top", "y":33, "width": 30, "opacity": 1},
			{"image":"player1-sad", "xmetric":"left","x":5, "ymetric": "top", "y":33, "width": 30, "opacity": 1},
			{"image":"coin-flipping", "xmetric":"left","x":45, "ymetric": "top", "y":40, "width": 10, "opacity": 0},
			{"image":"coin-tails", "xmetric":"left","x":44, "ymetric": "top", "y":40, "width": 12, "opacity": 1}
			],
		"scrolly2-7": [
			{"image":"the-100", "xmetric":"left","x":0, "ymetric": "top", "y":0, "width": 100, "opacity": 0.3},
			{"image":"player1-full", "xmetric":"left","x":5, "ymetric": "bottom", "y":5, "width": 30, "opacity": 1},
			{"image":"player3-full", "xmetric":"right","x":5, "ymetric": "bottom", "y":5, "width": 30, "opacity": 1},
			{"image":"player1-happy", "xmetric":"left","x":5, "ymetric": "top", "y":33, "width": 30, "opacity": 0},
			{"image":"player2-happy", "xmetric":"right","x": 5, "ymetric": "top", "y":33, "width": 30, "opacity": 0},
			{"image":"player1-sad", "xmetric":"left","x":5, "ymetric": "top", "y":33, "width": 30, "opacity": 0},
			{"image":"coin-flipping", "xmetric":"left","x":45, "ymetric": "top", "y":40, "width": 10, "opacity": 0},
			{"image":"coin-tails", "xmetric":"left","x":44, "ymetric": "top", "y":33, "width": 12, "opacity": 0}
		],
		"scrolly2-8": [
			{"image":"the-100", "xmetric":"left","x":0, "ymetric": "top", "y":0, "width": 100, "opacity": 0.3},
			{"image":"player1-full", "xmetric":"left","x":5, "ymetric": "bottom", "y":5, "width": 30, "opacity": 1},
			{"image":"player3-full", "xmetric":"right","x": 5, "ymetric": "bottom", "y":5, "width": 30, "opacity": 1},
			{"image":"player1-happy", "xmetric":"left","x":5, "ymetric": "top", "y":33, "width": 30, "opacity": 0},
			{"image":"player2-happy", "xmetric":"right","x": 5, "ymetric": "top", "y":33, "width": 30, "opacity": 0},
			{"image":"player1-sad", "xmetric":"left","x":5, "ymetric": "top", "y":33, "width": 30, "opacity": 0},
			{"image":"coin-flipping", "xmetric":"left","x":45, "ymetric": "top", "y":40, "width": 10, "opacity": 0},
			{"image":"coin-tails", "xmetric":"left","x":44, "ymetric": "top", "y":33, "width": 12, "opacity": 0}
			],
		"scrolly2-9": [
			{"image":"the-100", "xmetric":"left","x":-20, "ymetric": "top", "y":-50, "width": 200, "opacity": 0.1},
			{"image":"player1-full", "xmetric":"left","x":5, "ymetric": "bottom", "y":5, "width": 30, "opacity": 0},
			{"image":"player3-full", "xmetric":"right","x": 5, "ymetric": "bottom", "y":5, "width": 30, "opacity": 0},
			{"image":"player1-happy", "xmetric":"left","x":5, "ymetric": "top", "y":33, "width": 30, "opacity": 1},
			{"image":"player2-happy", "xmetric":"right","x": 5, "ymetric": "top", "y":33, "width": 30, "opacity": 0},
			{"image":"player3-happy", "xmetric":"right","x": 5, "ymetric": "top", "y":33, "width": 30, "opacity": 1},
			{"image":"player1-sad", "xmetric":"left","x":5, "ymetric": "top", "y":33, "width": 30, "opacity": 0},
			{"image":"coin-flipping", "xmetric":"left","x":45, "ymetric": "top", "y":40, "width": 10, "opacity": 0},
			{"image":"coin-tails", "xmetric":"left","x":44, "ymetric": "top", "y":33, "width": 12, "opacity": 0}
			],
		"scrolly2-10": [
			{"image":"the-100", "xmetric":"left","x":-20, "ymetric": "top", "y":-50, "width": 200, "opacity": 0.1},
			{"image":"player1-full", "xmetric":"left","x":5, "ymetric": "bottom", "y":5, "width": 30, "opacity": 0},
			{"image":"player3-full", "xmetric":"right","x": 5, "ymetric": "bottom", "y":5, "width": 30, "opacity": 0},
			{"image":"player1-happy", "xmetric":"left","x":5, "ymetric": "top", "y":33, "width": 30, "opacity": 1},
			{"image":"player2-happy", "xmetric":"right","x": 5, "ymetric": "top", "y":33, "width": 30, "opacity": 0},
			{"image":"player3-sad", "xmetric":"right","x": 5, "ymetric": "top", "y":33, "width": 30, "opacity": 1},
			{"image":"player1-sad", "xmetric":"left","x":5, "ymetric": "top", "y":33, "width": 30, "opacity": 0},
			{"image":"coin-flipping", "xmetric":"left","x":45, "ymetric": "top", "y":200, "width": 10, "opacity": 0},
			{"image":"coin-tails", "xmetric":"left","x":44, "ymetric": "top", "y":33, "width": 10, "opacity": 0}
			],
		"scrolly2-11": [
			{"image":"the-100", "xmetric":"left","x":-20, "ymetric": "top", "y":-50, "width": 200, "opacity": 0.1},
			{"image":"player1-full", "xmetric":"left","x":5, "ymetric": "bottom", "y":5, "width": 30, "opacity": 0},
			{"image":"player2-full", "xmetric":"right","x": 5, "ymetric": "bottom", "y":5, "width": 30, "opacity": 0},
			{"image":"player1-happy", "xmetric":"left","x":5, "ymetric": "top", "y":33, "width": 30, "opacity": 1},
			{"image":"player2-happy", "xmetric":"right","x": 5, "ymetric": "top", "y":33, "width": 30, "opacity": 0},
			{"image":"player3-sad", "xmetric":"right","x": 5, "ymetric": "top", "y":33, "width": 30, "opacity": 1},
			{"image":"player1-sad", "xmetric":"left","x":5, "ymetric": "top", "y":33, "width": 30, "opacity": 0},
			{"image":"coin-flipping", "xmetric":"left","x":45, "ymetric": "top", "y":33, "width": 10, "opacity": 1},
			{"image":"coin-tails", "xmetric":"left","x":44, "ymetric": "top", "y":33, "width": 12, "opacity": 0}
			],
		"scrolly2-12": [
			{"image":"the-100", "xmetric":"left","x":-20, "ymetric": "top", "y":-50, "width": 200, "opacity": 0.1},
			{"image":"player1-full", "xmetric":"left","x":5, "ymetric": "bottom", "y":5, "width": 30, "opacity": 0},
			{"image":"player3-full", "xmetric":"right","x": 5, "ymetric": "bottom", "y":5, "width": 30, "opacity": 0},
			{"image":"player1-happy", "xmetric":"left","x":5, "ymetric": "top", "y":33, "width": 30, "opacity": 1},
			{"image":"player2-happy", "xmetric":"right","x": 5, "ymetric": "top", "y":33, "width": 30, "opacity": 0},
			{"image":"player3-sad", "xmetric":"right","x": 5, "ymetric": "top", "y":33, "width": 30, "opacity": 1},
			{"image":"player1-sad", "xmetric":"left","x":5, "ymetric": "top", "y":33, "width": 30, "opacity": 0},
			{"image":"coin-flipping", "xmetric":"left","x":45, "ymetric": "top", "y":40, "width": 10, "opacity": 0},
			{"image":"coin-tails", "xmetric":"left","x":44, "ymetric": "top", "y":40, "width": 12, "opacity": 1}
			],
		"scrolly2-13": [
			{"image":"the-100", "xmetric":"left","x":-20, "ymetric": "top", "y":-50, "width": 200, "opacity": 0.1},
			{"image":"player1-full", "xmetric":"left","x":5, "ymetric": "bottom", "y":5, "width": 30, "opacity": 0},
			{"image":"player2-full", "xmetric":"right","x": 5, "ymetric": "bottom", "y":5, "width": 30, "opacity": 0},
			{"image":"player1-sad", "xmetric":"left","x":5, "ymetric": "top", "y":33, "width": 30, "opacity": 1},
			{"image":"player2-happy", "xmetric":"right","x": 5, "ymetric": "top", "y":33, "width": 30, "opacity": 0},
			{"image":"player3-sad", "xmetric":"right","x": 5, "ymetric": "top", "y":33, "width": 30, "opacity": 1},
			{"image":"player1-sad", "xmetric":"left","x":5, "ymetric": "top", "y":33, "width": 30, "opacity": 0},
			{"image":"coin-flipping", "xmetric":"left","x":45, "ymetric": "top", "y":40, "width": 10, "opacity": 0},
			{"image":"coin-tails", "xmetric":"left","x":44, "ymetric": "top", "y":40, "width": 12, "opacity": 1}
			],
		"scrolly3-0": {"roundLimit":2, "increment":1},
		"scrolly3-1": {"roundLimit":2, "increment":1},
		"scrolly3-2": {"roundLimit":10000, "increment":4}
	}

	// Game info for each stage
	const wealthLookup = {
		"0": {
			"player1": 1000,
			"player2": 1000,
			"player8": 1000,
			"player9": 1000,
			"wager": 0,
			"player1Words": "",
			"player2Words": "",
			"player1Record": "0 - 0",
			"player2Record": "0 - 0",
			"player8Record": "0 - 0"
		},
		"1": {
			"player1": 600,
			"player2": 600,
			"wager": 0,
			"player1Words": "",
			"player2Words": "",
			"player1Record": "0 - 0",
			"player2Record": "0 - 0"
		},
		"2": {
			"player1": 1000,
			"player2": 1000,
			"wager": 0,
			"player1Words": "",
			"player2Words": "",
			"player1Record": "0 - 0",
			"player2Record": "0 - 0"
		},
		"3": {
			"player1": 1000,
			"player2": 1000,
			"wager": 200,
			"player1Words": "I can only wager 20% of my money.",
			"player2Words": "",
			"player1Record": "0 - 0",
			"player2Record": "0 - 0"
		},
		"4": {
			"player1": 1000,
			"player2": 1000,
			"wager": 200,
			"player1Words": "Heads!",
			"player2Words": "",
			"player1Record": "0 - 0",
			"player2Record": "0 - 0"
		},
		"5": {
			"player1": 800,
			"player2": 1200,
			"wager": 200,
			"player1Words": "Ugh.",
			"player2Words": "I won $200!",
			"player1Record": "0 - 1",
			"player2Record": "1 - 0"
		},
		"6": {
			"player1": 400,
			"player2": 400,
			"wager": 200,
			"player1Words": "",
			"player2Words": "",
			"player1Record": "0 - 1",
			"player2Record": "1 - 0"
		},
		"7": {
			"player1": 400,
			"player2": 600,
			"wager": 200,
			"player1Words": "",
			"player2Words": "",
			"player1Record": "0 - 1",
			"player2Record": "1 - 0"
		},
		"8": {
			"player1": 800,
			"player2": 1200,
			"wager": 240,
			"player1Words": "",
			"player2Words": "",
			"player1Record": "0 - 1",
			"player2Record": "1 - 0"
		},
		"9": {
			"player1": 800,
			"player2": 1200,
			"wager": 240,
			"player1Words": "",
			"player2Words": "I can bet $240.",
			"player1Record": "0 - 1",
			"player2Record": "1 - 0"
		},
		"10": {
			"player1": 800,
			"player2": 1200,
			"wager": 160,
			"player1Words": "I can only bet $160.",
			"player2Words": "Fine.",
			"player1Record": "0 - 1",
			"player2Record": "1 - 0"
		},
		"11": {
			"player1": 800,
			"player2": 1200,
			"wager": 160,
			"player1Words": "Tails!",
			"player2Words": "",
			"player1Record": "0 - 1",
			"player2Record": "1 - 0"
		},
		"12": {
			"player1": 960,
			"player2": 1040,
			"wager": 160,
			"player1Words": "I won!",
			"player2Words": "Ugh.",
			"player1Record": "1 - 1",
			"player2Record": "1 - 1"
		},
		"13": {
			"player1": 960,
			"player2": 1040,
			"wager": 160,
			"player1Words": "!!!!!",
			"player2Words": "",
			"player1Record": "1 - 1",
			"player2Record": "1 - 1"
		},
		"14": {
			"player1": 960,
			"player2": 1040,
			"wager": 160,
			"player1Words": "",
			"player2Words": "",
			"player1Record": "1 - 1",
			"player2Record": "1 - 1"
		}
	}

	
	// Runs on new stage
	function newScroll(v) {
		v = v == undefined ? currentStageNumber : v;
		currentStageNumber = v;
		currentStage = v == undefined ? stageLookup[container + "-0"] : stageLookup[container + "-" + v];

		// sets backgroudn colors for scrolly
		if (container == "scrolly1" && currentStageNumber == 0) {
			bgColor = "#000";
			bgOpacity = 0.5;
		} else if (container == "scrolly3") {
			bgColor = "#c8becf";
			bgOpacity = 0.3;
		}  else {
			bgColor = "#5f7bf6";
			bgOpacity = 0.5;
		}
	}


	// Keeping track + ticking up numbers in the comic's game info section
	let gameinfo = {
		"player1": 26,
		"player2": 23,
		"player8": 7,
		"player9": 4,
		"player10": 33,
		"player11": 29,
		"wager": 200
	}
	setInterval(function() {
		for (var key in gameinfo) {
			updateWealth(key);
		}
	},5);

	function updateWealth(item) {
		if (gameinfo[item] < wealthLookup[currentStageNumber][item]) {
			gameinfo[item] = gameinfo[item] + 1;
		} else if (gameinfo[item] > wealthLookup[currentStageNumber][item]) {
			gameinfo[item] = gameinfo[item] - 1;
		}
	}

	// Utility functions
	function comma(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	function convertToHTML(text) {
		let finalText = [];
		let textArray = text.split("\n");
		textArray.forEach(function(line) {
			if (line.indexOf("Component|") != -1) {
				let compName = line.split("|")[1];
				line = `<svelte:component this=${compName}></svelte:component>`
			}
			finalText.push(line);
		})
		return "<p>" + finalText.join("</p><p>") + "</p>";
	}

	let currentProgress = 0;
	function getProgress() {
		try {
			currentProgress = (currentStageNumber + (progress[currentStageNumber]/2) ) / words.length;
		} catch {
			currentProgress = 0;
		}	
		if (currentProgress > 1) { currentProgress = 1; }
	}
	
	let marginTop = 0;
	setInterval(function() {
		if (stepWidth != undefined) {
			loaded = 1;
		}
	},100);
	$: {
		newScroll(value)
		currentStage = currentStage;
		stepWidth = stepWidth;
		stepHeight = stepHeight;
		containerHeight = containerHeight;
		panelHeight = stepWidth;
		currentText = words[currentStageNumber];
		progress = progress;
		getProgress();
	}
	
</script>
<svelte:window bind:innerHeight={containerHeight} />
<div class="interactive_container" >
	<section class="scrolly" id={container}>
		<div class="scrollyBackground" bind:clientHeight={stepHeight} bind:clientWidth={stepWidth} style="background:{bgColor}; max-height:{panelHeight}px; opacity: {loaded};">
			
			<div class="scrollyImageContainer">
				<!-- If it's not the third scrolly, display the comic -->
				{#if container != "scrolly3"}
				{#each currentStage as { image, xmetric, x, ymetric, y, width, opacity }, i}
				{#if image.indexOf("happy") != -1 && [5,6,12,13].indexOf(currentStageNumber) != -1}
					<img class="{image} happy" src="assets/yardsale/art/{image}.png" alt="stageImage" style="{xmetric}: {x}%; {ymetric}: {y}%; width: {width}%; opacity:{opacity};" in:fade={{ delay: 0 }} out:fade/>
				{:else}
					<img class="{image}" src="assets/yardsale/art/{image}.png" alt="stageImage" style="{xmetric}: {x}%; {ymetric}: {y}%; width: {width}%; opacity:{opacity};" in:fade={{ delay: 0 }} out:fade/>
				{/if}
								{/each}

				<!-- Speech bubbles -->
				{#if container == "scrolly2" && wealthLookup[currentStageNumber].player1Words != "" }
				<div class="speechBubble player1bubble" in:fade={{ delay: 0 }} out:fade>{wealthLookup[currentStageNumber].player1Words}</div>
				{/if}
				{#if container == "scrolly2" && wealthLookup[currentStageNumber].player2Words != "" }
				<div class="speechBubble player2bubble" in:fade={{ delay: 600 }} out:fade>{wealthLookup[currentStageNumber].player2Words}</div>
				{/if}
				{:else}
				<!-- YSM simulation -->
				<YardsaleYSMIntro roundLimit={currentStage.roundLimit} increment={currentStage.increment} bind:round={r}/>
				{/if}

				<!-- Comic coin flip overlay data -->
				<div class="gameContainer">
					{#if container == "scrolly2" && [3,4,5,8,9,10,11,12,13].indexOf(currentStageNumber) != -1 }
					<div class="player1 wealthNumber" in:fade={{ delay: 400 }} out:fade>
						<div class="gameInfoItem">Day 1 retention</div>
						<div class="gameInfoItem">
							<div class="gameInfoFullbar">
								<div class="gameInfoBar" style="width:26%"></div>
								<span class="percentageInside">26%</span>
								<div class="logoContainer"></div>
									<img src="docs/assets/yardsale/art/apple.png" class="logoEnd" alt="Apple Logo"/>
							</div>
						</div>
					</div>
					<div class="player2 wealthNumber" in:fade={{ delay: 400 }} out:fade>

						<div class="gameInfoItem">Day 7 retention</div>
						<div class="gameInfoItem">
							<div class="gameInfoFullbar">
								<div class="gameInfoBar" style="width:7%"></div>
								<span class="percentageInside">7%</span>
								<div class="logoContainerLeft"></div>
									<img src="docs/assets/yardsale/art/apple.png" class="logoEndLeft" alt="Apple Logo"/>
							</div>
						</div>
					</div>
					<div class="player8 wealthNumber" in:fade={{ delay: 400 }} out:fade>
						<div class="gameInfoItem">
							<div class="gameInfoFullbar">
								<div class="gameInfoBar" style="width:23%"></div>
								<span class="percentageInside">23%</span>
								<div class="logoContainer"></div>
									<img src="docs/assets/yardsale/art/android.png" class="logoEnd" alt="Android Logo"/>
							</div>
						</div>
					</div>
					<!-- New progress bar for player9 -->
					<div class="player9 wealthNumber" in:fade={{ delay: 400 }} out:fade>
						<div class="gameInfoItem">
							<div class="gameInfoFullbar">
								<div class="gameInfoBar" style="width:4%"></div>
								<span class="percentageInside">4%</span>
								<div class="logoContainerLeft"></div>
									<img src="docs/assets/yardsale/art/android.png" class="logoEndLeft" alt="Android Logo"/>
							</div>
						</div>
					</div>
					<div class="player10 wealthNumber" in:fade={{ delay: 400 }} out:fade>
						<div class="gameInfoItem">Day 1 retention</div>
						<div class="gameInfoItem">
							<div class="gameInfoFullbar">
								<div class="gameInfoBar" style="width:33%"></div>
								<span class="percentageInside">33%</span>
								<div class="logoContainer"></div>
									<img src="docs/assets/yardsale/art/apple.png" class="logoEnd" alt="Apple Logo"/>
							</div>
						</div>
					</div>
					<!-- New progress bar for player9 -->
					<div class="player11 wealthNumber" in:fade={{ delay: 400 }} out:fade>
						<div class="gameInfoItem">Day 7 retention</div>
						<div class="gameInfoItem">
							<div class="gameInfoFullbar">
								<div class="gameInfoBar" style="width:9%"></div>
								<span class="percentageInside">9%</span>
								<div class="logoContainerLeft"></div>
									<img src="docs/assets/yardsale/art/apple.png" class="logoEndLeft" alt="Apple Logo"/>
							</div>
						</div>
					</div>	
					<div class="player12 wealthNumber" in:fade={{ delay: 400 }} out:fade>
						<div class="gameInfoItem">
							<div class="gameInfoFullbar">
								<div class="gameInfoBar" style="width:29%"></div>
								<span class="percentageInside">29%</span>
								<div class="logoContainer"></div>
									<img src="docs/assets/yardsale/art/android.png" class="logoEnd" alt="Android Logo"/>
							</div>
						</div>
					</div>
					<!-- New progress bar for player9 -->
					<div class="player13 wealthNumber" in:fade={{ delay: 400 }} out:fade>
						<div class="gameInfoItem">
							<div class="gameInfoFullbar">
								<div class="gameInfoBar" style="width:6%"></div>
								<span class="percentageInside">6%</span>
								<div class="logoContainerLeft"></div>
									<img src="docs/assets/yardsale/art/android.png" class="logoEndLeft" alt="Android Logo"/>
							</div>
						</div>
					</div>
					<div class="player14 wealthNumber" in:fade={{ delay: 400 }} out:fade>
						<div class="gameInfoItem">Day 1 retention</div>
						<div class="gameInfoItem">
							<div class="gameInfoFullbar">
								<div class="gameInfoBar" style="width:45%"></div>
								<span class="percentageInside">45%</span>
								<div class="logoContainer"></div>
									<img src="docs/assets/yardsale/art/apple.png" class="logoEnd" alt="Apple Logo"/>
							</div>
						</div>
					</div>
					<!-- New progress bar for player9 -->
					<div class="player15 wealthNumber" in:fade={{ delay: 400 }} out:fade>
						<div class="gameInfoItem">Day 7 retention</div>
						<div class="gameInfoItem">
							<div class="gameInfoFullbar">
								<div class="gameInfoBar" style="width:17%"></div>
								<span class="percentageInside">17%</span>
								<div class="logoContainerLeft"></div>
									<img src="docs/assets/yardsale/art/apple.png" class="logoEndLeft" alt="Apple Logo"/>
							</div>
						</div>
					</div>
					<div class="player16 wealthNumber" in:fade={{ delay: 400 }} out:fade>
						<div class="gameInfoItem">
							<div class="gameInfoFullbar">
								<div class="gameInfoBar" style="width:40%"></div>
								<span class="percentageInside">40%</span>
								<div class="logoContainer"></div>
									<img src="docs/assets/yardsale/art/android.png" class="logoEnd" alt="Android Logo"/>
							</div>
						</div>
					</div>
					<!-- New progress bar for player9 -->
					<div class="player17 wealthNumber" in:fade={{ delay: 400 }} out:fade>
						<div class="gameInfoItem">
							<div class="gameInfoFullbar">
								<div class="gameInfoBar" style="width:13%"></div>
								<span class="percentageInside">13%</span>
								<div class="logoContainerLeft"></div>
									<img src="docs/assets/yardsale/art/android.png" class="logoEndLeft" alt="Android Logo"/>
							</div>
						</div>
					</div>								
					{/if}
					{#if container == "scrolly2" && [3,4,5,8,9,10,11,12,13].indexOf(currentStageNumber) != -1 }
					<div class="wager" in:fade={{ delay: 0 }} out:fade>
						<div class="gameInfoItem brighter">Median of all games</div> 
					</div>
					<div class="wager" in:fade={{ delay: 0 }} out:fade>
						<div class="top25 brighter">Top 25% of all games</div> 
					</div>
					<div class="wager" in:fade={{ delay: 0 }} out:fade>
						<div class="top2 brighter">Top 2% of all games</div> 
					</div>
					{/if}
				</div>

				<div class="fuzzy" style="opacity:{bgOpacity}; background-image: url('assets/yardsale/grain.png');"></div>
			</div>
			<!-- Scroll down hint on stage 1 -->
			{#if container == "scrolly1" && currentStageNumber < 1}
			<div class="scrolldown_hint" out:fade>
				<div class="scrolldown_words">Scroll down</div>
			</div>
			{/if}
		</div>


		<div class="scrollyContainer">
			<Scrolly bind:value bind:progress={progress}>
				{#each words as text, i}
				{@const active = value === i}
				{#if text != ""}
				<div class="step step{i}" class:active style="opacity: {loaded};" >
					{#if container == "scrolly3" && currentStageNumber == 2 && r > 1500 && r < 4500}
					<p>Still simulating 10,000 rounds...</p>
					{:else if container == "scrolly3" && currentStageNumber == 2 && r > 4500 && r < 10000}
					<p>Seriously, just wait...</p>
					{:else if container == "scrolly3" && currentStageNumber == 2 && r == 10000}
					<p>Whoa, you lost all your money. Meanwhile, one person ended up with nearly all of the wealth!</p>
					{:else}
					<p>{text}</p>
					{/if}
				</div>
				{:else}
				<div class="step step{i} stepHidden" class:active>
					<p>{text}</p>
				</div>
				{/if}
				{/each}
			</Scrolly>
		</div>
	</section>
</div>

<style>
	.interactive_container {
		padding: 10px 0;
		font-family: "National 2 Web", sans-serif;
	}

	.gameContainer {
		display: block;
		position: absolute;
		top: 40px;
		width: 100%;
		color: white;
		font-size: 22px;
		line-height: 1.3em;
		font-family: "National 2 Web", sans-serif;
	}
	.gameContainer .brighter {
		color: var(--category-purple);
		font-weight: bold;
		text-transform: uppercase;
		letter-spacing: 2px;
	}
	.gameContainer .wealthNumber {
		position: absolute;
		top: 0px;
		width: 50%;
	}

	.gameContainer .wager {
		position: absolute;
		text-align: center;
		width: 100%;
		left: 0%;
	}
	.top25 {
		text-align: center;
		width: 100%;
		position: absolute;
		top: calc(50% + 130px); /* Adjust this value to position the label at the correct Y-offset */
		transform: translateY(-50%);
		font-size: 1em; /* Adjust font size as needed */
		color: #fff; /* Adjust text color as needed */

	}
	.top2 {
		text-align: center;
		width: 100%;
		position: absolute;
		top: calc(50% + 230px); /* Adjust this value to position the label at the correct Y-offset */
		transform: translateY(-50%);
		font-size: 1em; /* Adjust font size as needed */
		color: #fff; /* Adjust text color as needed */

	}
	@media only screen and (max-width: 640px) { 
		.gameContainer {
			top: 20px;
			font-size: 15px;
			line-height: 18px;
		}
	}
	.gameContainer .player1 {
		left: 5%;
		top: 29px;
		text-align: left;
	}
	.gameContainer .player2 {
		right: 5%;
		top: 29px;
		text-align: right;
	}
	.gameContainer .player8 {
		left: 5%;
		top: 80px;
		text-align: left;
	}
	.gameContainer .player9 {
		top: 80px;
		right: 5%;
		text-align: right;
	}
	.gameContainer .player10 {
		left: 5%;
		top: 135px;
		text-align: left;
	}
	.gameContainer .player11 {
		top: 135px;
		right: 5%;
		text-align: right;
	}
	.gameContainer .player12 {
		left: 5%;
		top: 186px;
		text-align: left;
	}
	.gameContainer .player13 {
		top: 186px;
		right: 5%;
		text-align: right;
	}
	.gameContainer .player14 {
		left: 5%;
		top: 235px;
		text-align: left;
	}
	.gameContainer .player15 {
		top: 235px;
		right: 5%;
		text-align: right;
	}
	.gameContainer .player16 {
		left: 5%;
		top: 285px;
		text-align: left;
	}
	.gameContainer .player17 {
		top: 285px;
		right: 5%;
		text-align: right;
	}
	.gameContainer .player3 {
		left: 5%;
		text-align: left;
		top: 40;
	}
	.gameInfoItem {
		width: 100%;
		position: relative;
	}
	.gameInfoFullbar {
		width: 70%;
		position: absolute;
		height: 20px;
		border: 2px solid var(--category-bg-purple);
		background: var(--category-purple2);
		left: 0;
		top: 0;
		margin-top: 4px;
	}
	@media only screen and (max-width: 640px) { 
		.gameInfoFullbar {
			height: 10px;
		}
	}
	.gameInfoBar {
		height: 100%;
		background: var(--category-bg-purple);	
		position: absolute;
		left: 0;
		top: 0;
	}
	.player2 .gameInfoFullbar, .player2 .gameInfoBar  {
		left: auto;
		right: 0;

		
	}
	.player9 .gameInfoFullbar, .player9 .gameInfoBar  {
		left: auto;
		right: 0;

	}
	.player11 .gameInfoFullbar, .player11 .gameInfoBar  {
		left: auto;
		right: 0;

	}
	.player13 .gameInfoFullbar, .player13 .gameInfoBar  {
		left: auto;
		right: 0;

	}
	.player15 .gameInfoFullbar, .player15 .gameInfoBar  {
		left: auto;
		right: 0;

	}
	.player17 .gameInfoFullbar, .player17 .gameInfoBar  {
		left: auto;
		right: 0;

	}
	.scrolly {
		max-width:  1100px;
		margin: 0px auto;
		min-height: 100vh;
	}
	.scrollyContainer {
		width: 100%;
		margin-top: -200px;
		z-index: 3;
		pointer-events: none;
	}
	.scrollyBackground {
		position: sticky;
		top:  2.5vh;
		width:  90%;
		margin: auto auto;
		height:  95vh;
		border: 3px solid #000;
		max-width: 95vh;
		z-index: -1;
		transition: opacity 500ms cubic-bezier(0.250, 0.250, 0.750, 0.750);
	}
	.scrollyImageContainer {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		overflow: hidden;
	}

	.fuzzy {
		animation: grain 20s steps(10) infinite;
		content: "";
		height: 500%;
		width: 500%;
		opacity: 1;
		position: absolute;
		left: -125%;
		top: -125%;
		pointer-events: none;
	}
	@keyframes grain {
		0%, 100% { transform:translate(0, 0) }
		10% { transform:translate(-5%, -10%) }
		20% { transform:translate(8%, 5%) }
		30% { transform:translate(-7%, -5%) }
		40% { transform:translate(5%, 20%) }
		50% { transform:translate(-15%, -10%) }
		60% { transform:translate(0%, 0%) }
		70% { transform:translate(0%, -12%) }
		80% { transform:translate(-10%, 12%) }
		90% { transform:translate(10%, -10%) }
	}
	.scrolldown_hint {
		position: absolute;
		width: 0; 
		height: 0; 
		border-left: 20px solid transparent;
		border-right: 20px solid transparent;
		border-top: 20px solid black;
		right: 50%;
		margin-right: -10px;
		top: calc(100% + 50px);
		margin-left: -5px;
		opacity: 0.4;
		z-index: 1000;
		animation: bounce 1s ease infinite;
	}
	.scrolldown_words {
		position: absolute;
		width: 120px;
		left: 50%;
		margin-left: -60px;
		font-weight: bold;
		text-align: center;
		bottom: 22px;
		color: black;
		text-transform: uppercase;
	}
	.scrollyBackground img {
		position: absolute;
		max-width: none !important;
		transition: all 800ms cubic-bezier(0.250, 0.100, 0.250, 1.000); 
		transition-timing-function: cubic-bezier(0.250, 0.100, 0.250, 1.000);
	}
	
	.player1-happy, .player2-happy, .player3-happy, .player1-sad, .player2-sad, .player3-sad {
		background: #c5b3c7;
	}
	.player1-happy.happy, .player2-happy.happy, .player3-happy.happy {
		background: #f5cd49;
	} 

	.scrollyBackground .hidden {
		opacity:  0;
	}
	.step {
		display: block;
		height: 100vh;
		text-align: left;
		width: 100%;
		min-width: 200px;
		box-sizing: border-box;
		transition: opacity 500ms cubic-bezier(0.250, 0.250, 0.750, 0.750);
	}
	.step.stepHidden {
		opacity: 0;
		pointer-events: none;
	}
	.step > p {
		font-family: "National 2 Web";
		max-width: 500px;
		margin: 0 auto;
		background:  rgba(0,0,0,0.8);
		font-size:  1.4em;
		padding:  10px;
		box-sizing: border-box;
		color: white;
		text-shadow: -1px -1px 6px rgba(0, 0, 0, 0.5);
		text-align: center;
	}

	@media only screen and (max-width: 640px) {
		.scrollyBackground {
			margin: 0% auto;
			min-height: none;
			float: none;
			width:  96%;
			top: 10vh;
		}
		.step > p {
			width: 90%;
		}
	}
	.percentageInside {
		position: absolute;
		left: 50%; /* Center horizontally */
		top: 50%; /* Center vertically */
		transform: translate(-50%, -50%); /* Adjust for text size */
		color: #ffffff; /* Make text color readable over the bar */
		font-weight: bold; /* Make text bold */
	}
	.logoContainer {
		position: absolute;
		right: 0;
		top: 0;
		bottom: 0;
		display: flex;
		align-items: center; /* This will vertically center the logo inside the bar */
		justify-content: flex-end; /* This will place the logo at the far right */
		padding-right: 10px; /* Adjust padding to not overlap the percentage text */
		z-index: 10;
	}

	.logoEnd {
		height: 100%; /* Adjust height to fit the bar height */
		width: auto; /* Auto width to maintain aspect ratio */
		object-fit: contain; /* To prevent the logo from stretching */
		right: 0;
	}
	.logoContainerLeft {
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		display: flex;
		align-items: center; /* This will vertically center the logo inside the bar */
		justify-content: flex-end; /* This will place the logo at the far right */
		padding-right: 10px; /* Adjust padding to not overlap the percentage text */
		z-index: 10;
	}

	.logoEndLeft {
		height: 100%; /* Adjust height to fit the bar height */
		width: auto; /* Auto width to maintain aspect ratio */
		object-fit: contain; /* To prevent the logo from stretching */
		left: 0;
	}

</style>
