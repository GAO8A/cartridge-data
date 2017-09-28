let bulletD = '9.030-0.076';
let baseL = '5.08';
let bodyL = '12.70';

let caseL = '19.15-0.25',
    caseD = '9.931',
	cMax = '29.69',
	cMin = '25.40';
	
let eA = '35-10',
	eL = '0.89-0.25',
	eD = '8.81-0.51';

let hD = '10.01-0.25',
	hL = '1.27-0.25';

let nD = '9.652';

let rA = '35+20',
	rL = '0.89-0.25';

let sD = '9.680';

let catridgeLength = parseCatridgeLength(cMin, cMax);

let angles = [rA, eA];

let diameters = [hD, eD, caseD, sD, nD, bulletD];

let lengths = [hL, rL, eL, caseL, bodyL, baseL, catridgeLength];

// Array of coordinates for the cartridge casing
let cartridgeData;

// Array of coordinates for the example bullet
let bulletData;

/* For calculating the average length with tolerances.
 * Takes in a dimension with tolerances and creates a floor
 * and ceiling value with tolerances and returns its average
 * @param String: dimension with +/- tolerances or none
 * @return Number: Average value with tolerances
 */
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

/* For calculating specifically the average cartridge
 * length with the min and max string values 
 * @param String: Minimum cartridge dimension
 * @param String: Maximum cartridge dimension
 * @return Number: Average length of cartridge
 */
function parseCatridgeLength(cmin, cmax) {
	const diff = (cmax - cmin)/2;
	return "" + cmax + "-" + diff + "";

}

/* For converting angle value into radians.
 * @param Number: Degree value of angle
 * @return Number: Radian value of angle
 */
function parseAngle (ang) {
	return ang * Math.PI/180;
}

/* For building an array of coordinates for both the cartridge
 * casing and the example bullet. Takes in arrays of dimension types and
 * converts their string dimension values to numbers. Passes new number 
 * values to respective buildCase() and buildBullet() 
 * @param [String]: Array of diameter dimensions
 * @param [String]: Array of length dimensions
 * @param [String]: Array of angle dimensions
 * @param String: Minimum cartridge dimension
 * @param String: Maximum cartridge dimension
 * @return Void:
 */
function buildCartridge(d,l,a,cmin,cmax) {
	[hD, eD, caseD, sD, nD, bulletD] = d.map(parseLength).map((i)=> i/2);
	[hL, rL, eL, caseL, bodyL, baseL, catridgeLength] = l.map(parseLength);
	[rA, eA] = a.map(parseLength).map(parseAngle);

	cartridgeData = buildCase(hL,rL,rA,eD,eL,caseD,eA,bodyL,sD, caseL, nD ,baseL);
	bulletData = buildBullet(caseD, nD, caseL, bulletD, catridgeLength);
}

/* For building array of coordinates for catridge casing.
 * Takes in various dimensions and builds an array of 
 * coordinates for d3.line().curve() interpolation.
 * length with the min and max string values 
 * @param Number: Case diameter
 * @param Number: Neck diameter
 * @param Number: Case length average
 * @param Number: Bullet diameter average 
 * @param Number: Cartridge length average
 * @return [..[Number]]: Array of Coordinates for bullet
 */
function buildBullet(cd, nd, cl, bd, catridgeL) {
	const bulletMidLen = (catridgeL - cl)/0.95;
	return [
			[0, cd-nd],
			[bulletMidLen, cd-bd],
			[catridgeL-cl, cd]
	];

}

/* For building array of coordinates for example bullet.
 * Takes in various dimensions and builds an array of 
 * coordinates for d3.line() svg line generator.
 * @return [..[Number]]: Array of Coordinates for casing
 */
function buildCase(hl,rl,ra,ed,el,cd,ea, bodylength, sd, cl, nd, bl) {

	let rimAngle = calcAngleCoord(hl, rl, ra);
	let ejecAngle = calcAngleCoord(cd, ed, ea);

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

/* For calculating the y coordinate opposite of the angle
 * Takes in various dimensions and returns coordinate value.
 * @param Number: Case dimension
 * @param Number: Case dimension
 * @param Number: angle in radians
 * @return Number: Value of y coordinate
 */
function calcAngleCoord(dA,dB,a) {
	return (dA-dB)/(Math.tan(a));
}

// Generates cartridgeData and bulletData coordinate sets
let cartridge = buildCartridge(diameters,lengths, angles,cMin, cMax);

// Generates d value for the cartridge casing
let roundGenerator = d3.line();
let roundPathString = roundGenerator(cartridgeData);

// Generates d value for the example bullet
let bulletGenerator = d3.line().curve(d3.curveBundle);
let bulletPathString = bulletGenerator(bulletData);

// D3 DOM manipulation
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
