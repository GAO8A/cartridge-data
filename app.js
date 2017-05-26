let hD = '10.01-0.25',
	hL = '1.27-0.25';

let rA = '35+20',
	rL = '0.89-0.25';

let eA = '35-10',
	eL = '0.89-0.25',
	eD = '8.81-0.51';

let bD = '9.931',
	bL = '5.08';

let bodyLength = '12.70';

let sD = '9.680';

let nD = '9.652';

let cL = '19.15-0.25';

let diameters = [hD, eD, bD, sD, nD];

let lengths = [hL, rL, eL, cL, bodyLength];

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
	[hL, rL, eL, cL, bodyLength] = l.map(parseLength);
	[rA, eA] = a.map(parseLength).map(parseAngle);

	return buildHead(hL,hD,rL,rA,eD,eL,bD,eA,bodyLength,sD, cL, nD);
}

function buildHead(hl,hd,rl,ra,ed,el,bd,ea, bodylength, sD, cL, nD) {

	let rimAngle = calcRimAngle(hl, rl, ra);
	let ejecAngle = calcEjecAngle(bd, ed, ea);

 return [
 			[0, bd], // rim start
 			[0, rimAngle],
 			[hl-rl,0],
 			[hl-rl,bd],
 			[hl-rl,0],
 			[hl,0],
 			[hl, bd],
 			[hl, bd-ed], // extractor start
 			[hl+el, bd-ed],
 			[hl+el, bd],
 			[hl+el, bd-ed],
 			[ejecAngle+hl+el, 0], // might be wrong
 			[ejecAngle+hl+el, bd],
 			[ejecAngle+hl+el, 0], // body start
 			[bodylength, bd-sD],
 			[cL, bd-nD],
 			[cL , bd],
 			[cL , bd-nD] // bullet start
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
			  .attr('height',  "100%")
			  .attr('width', "100%")
			  .append('path')
			  .attr('class', 'round1')
			  .attr("transform","scale(10)");

let round2 = d3.select('svg')
			  .append('path')
			  .attr('class', 'round2')
			  .attr("transform","translate(0 "+ hD*20 +") scale(10 -10)");

let lineGenerator = d3.line();
let pathString = lineGenerator(data);

d3.select('.round1')
	.attr('d', pathString);

d3.select('.round2')
	.attr('d', pathString);
