let height = 1000,
	width = 1000;

let hD = '10.01-0.25',
	hL = '1.27-0.25';

let rA = '35+20',
	rL = '0.89-0.25';

let eA = '35',
	eL = '0.89-0.25',
	eD = '8.81-0.51';

let bD = '9.931';
let bL = '5.08'

let sD = '9.680';

let nD = '9.652';

let cL = '19.15-0.25';

let diameters = [hD, eD, bD, sD, nD];

let lengths = [hL, rL, eL, cL];

let angles = [rA, eA];

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

function buildCartridge(d,l,a) {
	[hD, eD, bD, sD, nD] = d.map(parseLength).map((i)=> i/2);
	[hL, rL, eL, cL] = l.map(parseLength);
	[rA, eA] = a.map(parseLength).map(parseAngle);

	return buildHead(hL,hD,rL,rA,eD,eL,bD,eA);
}

function buildHead(hl,hd,rl,ra,ed,el,bd,ea) {

	let rimAngle = calcRimAngle(hl, rl, ra);
	let ejecAngle = calcEjecAngle(bd, ed, ea);

 return [
 			[2, bd*10], // rim start
 			[2, rimAngle*10],
 			[(hl-rl)*10,2],
 			[(hl-rl)*10,bd*10],
 			[(hl-rl)*10,2],
 			[hl*10,2],
 			[hl*10, bd*10],
 			[hl*10, (bd-ed)*10], // extractor start
 			[(hl+el)*10, (bd-ed)*10],
 			[(hl+el)*10, bd*10],
 			[(hl+el)*10, (bd-ed)*10],
 			[(ejecAngle+hl+el)*10, 2], // might be wrong
 			[(ejecAngle+hl+el)*10, bd*10]
 		];
}


function calcRimAngle(hl,rl,ra) {
	// console.log('ra: ', (hl-rl)/(Math.tan(ra)));
	return (hl-rl)/(Math.tan(ra));
}

function calcEjecAngle(bd, ed, ea) {
	let foo = (bd-ed)/(Math.tan(ea));
	console.log(foo);
	return foo;
}

let data = buildCartridge(diameters,lengths, angles);

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
