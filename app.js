let hD = '10.01-0.25',
	hL = '1.27-0.25';

let rA = '35+20',
	rL = '0.89-0.25';

let eA = '35-10',
	eL = '0.89-0.25',
	eD = '8.81-0.51';

let bulletD = '9.030-0.076';
let baseL = '5.08';
let bodyL = '12.70';

let sD = '9.680';

let nD = '9.652';

let caseL = '19.15-0.25',
    caseD = '9.931';

let cMin = '25.40',
	cMax = '29.69',
	catridgeLength = parseLength(parseCatridgeLength(cMin, cMax));

let diameters = [hD, eD, caseD, sD, nD, bulletD];

let lengths = [hL, rL, eL, caseL, bodyL, baseL];

let angles = [rA, eA];

///

let cartridgeData;
let bulletData;

function parseLength (length, secondLength) {
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

function parseCatridgeLength(cmin, cmax) {
	const diff = (cmax - cmin)/2;
	return "" + cmax + "-" + diff + "";

}

function parseAngle (ang) {
	return (ang / 180) * Math.PI;
}

function buildCartridge(d,l,a,cmin,cmax) {
	[hD, eD, caseD, sD, nD, bulletD] = d.map(parseLength).map((i)=> i/2);
	[hL, rL, eL, caseL, bodyL, baseL] = l.map(parseLength);
	[rA, eA] = a.map(parseLength).map(parseAngle);

	cartridgeData = buildCase(hL,hD,rL,rA,eD,eL,caseD,eA,bodyL,sD, caseL, nD ,baseL);
	bulletData = buildBullet(caseD,nD,sD,caseL, cmin, cmax, bulletD);
}

function buildBullet(cd, nd, sd, cl, cmin, cmax, bd) {
	const bulletMidLen = (catridgeLength - cl)/0.95;
	return [
			[0, cd-nd],
			[bulletMidLen, cd-bd],
			[catridgeLength-cl, cd]
	];

}

function buildCase(hl,hd,rl,ra,ed,el,cd,ea, bodylength, sd, cl, nd, bl) {

	let rimAngle = calcRimAngle(hl, rl, ra);
	let ejecAngle = calcEjecAngle(cd, ed, ea);

 return [
 			[0, cd], // rim start
 			[0, rimAngle],
 			[hl-rl,0],
 			[hl-rl,cd],
 			[hl-rl,0],
 			[hl,0],
 			[hl, cd],
 			[hl, cd-ed], // extractor start
 			[hl+el, cd-ed],
 			[hl+el, cd],
 			[hl+el, cd-ed],
 			[ejecAngle+hl+el, 0], // might be wrong
 			[ejecAngle+hl+el, cd],
 			[ejecAngle+hl+el, 0], // body start
			[bl, 0], // base length? might wrong
 			[bodylength, cd-sd],
 			[cl, cd-nd],
 			[cl , cd],
 			[cl , cd-nd] // bullet start
 		];
}

function calcRimAngle(hl,rl,ra) {
	return (hl-rl)/(Math.tan(ra));
}

function calcEjecAngle(cd, ed, ea) {
	return (cd-ed)/(Math.tan(ea));
}

let foo = buildCartridge(diameters,lengths, angles,cMin, cMax);

let roundGenerator = d3.line();
let roundPathString = roundGenerator(cartridgeData);

let bulletGenerator = d3.line().curve(d3.curveBundle);
let bulletPathString = bulletGenerator(bulletData);

let casing = d3.select('.cartridge')
			  .append('svg')
			  .attr('class', 'case1')
			  .attr('height',  ""+hD*20+"px")
			  .attr('width', ""+caseL*10+"px")
			  .append('path')
			  .attr("transform","scale(10)")
			  .attr('d', roundPathString);;

let bullet1 = d3.select('.bullet')
			  .append('svg')
			  .attr('class', 'bullet1')
			  .attr('height',  ""+caseD*20+"px")
			  .attr('width', ""+(catridgeLength-caseL)*10+"px")
			  .append('path')
			  .attr("transform","scale(10)")
			  .attr('d', bulletPathString);;
			  
let casing2 = d3.selectAll('svg')
			  .filter('.case1')
			  .append('path')
			  .attr("transform","translate(0 "+ hD*20 +") scale(10 -10)")
			  .attr('d', roundPathString);

let bullet2 = d3.selectAll('svg')
			  .filter('.bullet1')
			  .append('path')
			  .attr("transform","translate(0 "+ hD*20 +") scale(10 -10)")
			  .attr('d', bulletPathString);
