let height = 1000,
	width = 1000;

let hD = '10.01-0.25',
	hL = '1.27-0.25';

let rA = '35+20',
	rL = '0.89-0.25';

let eA = '35-10',
	eL = '0.89-0.25',
	eD = '8.81-0.51';

let bD = '9.931';

let sD = '9.680';

let nD = '9.652';

let cL = '19.15-0.25';

let diameters = [hD, eD, sD, nD];

let lengths = [hL, rL, eL, cL];

let angles = [rA, eA];

//console.log(foo);
function parseLength (length) {
	let range;
	let value;
	if (length.includes('-')) {
		range = length.split('-').map(Number);
		value = (range[0] + (range[0] - range[1]))/2;
	} else if (length.includes('+')) {
		range = length.split('+').map(Number);
		value = (range[0] + (range[0] + range[1]))/2;
	} else {
		value = Number(length);
	}

	return value;
}

function parseAngle (ang) {
	
	return (ang / 180) * Math.PI;
}

function buildCartridge(d,l,a){

	[hD, eD, sD, nD] = d.map(parseLength).map((i)=> i/2);
	[hL, rL, eL, cL] = l.map(parseLength);
	[rA, eA] = a.map(parseLength).map(parseAngle);

	return buildHead(hL,hD,rL,rA);
}

function buildHead(hl,hd,rl,ra) {
	let rValue = rimAngle(hl, rl, ra);
	console.log('hl-rl: ', hl-rl);
 return [
 		 [hl*10, hd*10],
 		 [hl*10,2], 
 		 [(hl-rl)*10,2], 
 		 [2, rValue*10], 
 		 [2, hd*10]
 		];
}

function rimAngle(hl,rl,ra) {
	return (hl-rl)/(Math.tan(ra));
}

let data = buildCartridge(diameters,lengths, angles);

// let data = [
//             [0, 20], 
//             [0, 80], 
//             [200, 40], 
//             [300, 60], 
//             [400, 30]
//             ];

console.log(data);

let round = d3.select('.cartridge')
			  .append('svg')
			  .attr('height', height)
			  .attr('width', width)
			  .append('path')
			  .attr('class', 'round1');

let round2 = d3.select('svg')
			  .append('path')
			  .attr('class', 'round2')
			  .attr("transform","translate(0 "+ hD*20 +") scale(1 -1)");

let lineGenerator = d3.line();
let pathString = lineGenerator(data);

d3.select('.round1')
	.attr('d', pathString);

d3.select('.round2')
	.attr('d', pathString);
