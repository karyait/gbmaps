/*
GB Maps ギビマップ - © Karya IT (http://www.karyait.net.my/) 2012-2017. All rights reserved. 
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; 
without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

GB Maps ギビマップ by Karya IT is licensed under a Creative Commons Attribution-NonCommercial
-ShareAlike 4.0 International License. Based on a work at https://github.com/karyait/gbmaps/tree/v2. 
Permissions beyond the scope of this license may be available at 
https://developers.google.com/readme/terms. Google Maps - ©2017 Google.

Code license : Apache License 2.0

Main GB Maps ギビマップ Website : http://gbmaps.karyait.net.my/ or http://gbmaps.blogspot.com

Development : https://github.com/karyait/gbmaps/tree/v2

File : gbm-conv-bve5-v2.js
purpose : bve 5 route builder, data conversion function
type : release
version : 2.0.17.0515

*/
//bve5 list
var scenario = []; 
var structure = []; // structure[key] = ['fileXXX.x',count,'type',repeat_length]; 
var map = [];
var station = [];
var signal = [];
var sound = [];	
var sound3d = [];	
var curSta = [];

// BVE route structure

var paralellTrack = [];   // paralellTrack[0] = [RailIndex,X,Y,pid,bsti]; // data : railindex, x-distance from main track, y-height, pid (sideline pid), bsti : index on base line where sideline start (new 08-08-2014)
var teks = '';
var defaultRailIndex = 0;
var mainTrkArr = [];
var subTrkArr = [];
var noteTrkArr = []; 
var pitchRatio = 0;


var defaultrailLkey,defaultrailRkey,defaultrailbasekey,defaultPoleL,defaultPoleR,defaultohwirekey,joinkey,flangekey,defaultrailLx,defaultrailRx,defaultrailbaseX;
var lastheight = -0.45;
var lastground = '';

var sleeper1,sleeper2,sleeper3,sleeper4;
var rail1L,rail2L,rail3L,rail4L;
var rail1R,rail2R,rail3R,rail4R;

		
function generateBVE5(pid,stIdx,edIdx,routeId,routeName,gauge,railtype,train,maxspeed,bg,kmstone,stsign,devID,desc)
{
	gauge = gauge/1000; // convert mm to meters
	var halfGauge = gauge/2;
	
	teks = '<?xml version="1.0" encoding="utf-8"?>\n';
	teks += '<bve>\n';
	teks += '<gbm>\n';
	teks += '<gver>1.0.0</gver>\n';
	teks += '<bver>5.0</bver>\n';
	teks += '<route_id>' + routeId + '</route_id>\n';
	teks += '<route_name>' + routeName + '</route_name>\n';
	teks += '<train>' + train + '</train>\n';
	teks += '</gbm>\n';
	teks += '<scenario>\n';
	teks += 'BveTs Scenario 2.00:UTF-8\n';	
	teks += 'Route = ' + routeName + '\\map.txt\n';
	teks += 'Vehicle = ' + routeName + '\\' + train + '\\vehicle.txt\n';
	teks += 'Title = ' + routeId + '\n';
	teks += 'RouteTitle = ' + routeName + '\n';
	teks += 'VehicleTitle = ' + train + '\n';
	teks += 'Author = ' + devID + '\n';
	teks += 'Comment = ' + desc + '\n';
	teks += 'Image = ' + routeName + '\\train.jpg\n';
	teks += '</scenario>\n';
	
	
	
	structure['sign_m_curve'] = ['shared\\freeobj\\km_p\\m_curve.x',0,'sign',0]; //curve sign
	
	structure['sign_sloop_down-up'] = ['shared\\freeobj\\km_p\\sloop_down-up.x',0,'sign',0]; //menurun opp. mendaki
	structure['sign_sloop_level-up'] = ['shared\\freeobj\\km_p\\sloop_level-up.x',0,'sign',0]; //level opp. mendaki
	structure['sign_sloop_down-level'] = ['shared\\freeobj\\km_p\\sloop_down-level.x',0,'sign',0]; //menurun opp. level
	structure['sign_sloop_up-level'] = ['shared\\freeobj\\km_p\\sloop_up-level.x',0,'sign',0]; //mendaki opp. level
	structure['sign_sloop_level-down'] = ['shared\\freeobj\\km_p\\sloop_level-down.x',0,'sign',0]; //level opp. menurun
	structure['sign_sloop_up-down'] = ['shared\\freeobj\\km_p\\sloop_up-down.x',0,'sign',0]; //mendaki opp. menurun
	structure['sign_sloop_up-up'] = ['shared\\freeobj\\km_p\\sloop_up-up.x',0,'sign',0]; //mendaki-mendaki, lain2 ratio
	structure['sign_sloop_down-down'] = ['shared\\freeobj\\km_p\\sloop_down-down.x',0,'sign',0]; //menurun-menurun, lain2 ratio
	
	structure['sign_kmp'] = ['shared\\freeobj\\km_p\\kmp.x',0,'sign',0]; //kilometer mark
	structure['sign_500mp'] = ['shared\\freeobj\\km_p\\500mp.x',0,'sign',0]; //500 meter mark
	structure['sign_100mp'] = ['shared\\freeobj\\km_p\\100mp.x',0,'sign',0]; //100 meter mark
	
	structure['sign_s_begin'] = ['shared\\freeobj\\sign\\s_begin.x',0,'sign',0]; //S start sign
	structure['sign_s_cancel'] = ['shared\\freeobj\\sign\\s_cancel.x',0,'sign',0]; //S cancel sign
	structure['sign_stap'] = ['shared\\freeobj\\sign\\stap.x',0,'sign',0]; //station near sign
	structure['sign_start_wr'] = ['shared\\freeobj\\sign\\start_wr.x',0,'sign',0]; //
	structure['sign_stop_through'] = ['shared\\freeobj\\sign\\stop_through.x',0,'sign',0]; //
	structure['sign_whistle'] = ['shared\\freeobj\\sign\\whistle.x',0,'sign',0]; //whistle sign
	
	structure['sign_stop_01'] = ['shared\\freeobj\\stop\\stop_01.x',0,'sign',0]; //stop mark
	structure['sign_stop_02'] = ['shared\\freeobj\\stop\\stop_02.x',0,'sign',0]; //stop mark
	structure['sign_stop_03'] = ['shared\\freeobj\\stop\\stop_03.x',0,'sign',0]; //stop ballast
	
	structure['sign_stop'] = ['shared\\default\\stop.x',0,'sign',0]; //stop sign
	
	structure['sign_spl_pole'] = ['shared\\default\\SpeedLimPole.x',0,'sign',0]; //speed limit sign pole
	structure['sign_spl_back'] = ['shared\\default\\SpeedLim.x',0,'sign',0]; //speed limit sign back
	structure['sign_spl_L'] = ['shared\\default\\SpeedLimL.x',0,'sign',0]; //speed limit sign L
	structure['sign_spl_R'] = ['shared\\default\\SpeedLimR.x',0,'sign',0]; //speed limit sign R
	structure['sign_spl_End'] = ['shared\\default\\SpeedLimEnd.x',0,'sign',0]; //speed limit sign end
	structure['sign_spl_0'] = ['shared\\default\\SpeedLim0.x',0,'sign',0]; //speed limit sign 0
	structure['sign_spl_1'] = ['shared\\default\\SpeedLim1.x',0,'sign',0]; //speed limit sign 1
	structure['sign_spl_2'] = ['shared\\default\\SpeedLim2.x',0,'sign',0]; //speed limit sign 2
	structure['sign_spl_3'] = ['shared\\default\\SpeedLim3.x',0,'sign',0]; //speed limit sign 3
	structure['sign_spl_4'] = ['shared\\default\\SpeedLim4.x',0,'sign',0]; //speed limit sign 4
	structure['sign_spl_5'] = ['shared\\default\\SpeedLim5.x',0,'sign',0]; //speed limit sign 5
	structure['sign_spl_6'] = ['shared\\default\\SpeedLim6.x',0,'sign',0]; //speed limit sign 6
	structure['sign_spl_7'] = ['shared\\default\\SpeedLim7.x',0,'sign',0]; //speed limit sign 7
	structure['sign_spl_8'] = ['shared\\default\\SpeedLim8.x',0,'sign',0]; //speed limit sign 8
	structure['sign_spl_9'] = ['shared\\default\\SpeedLim9.x',0,'sign',0]; //speed limit sign 9
	
	
	
	try {
		for (i1 = 0; i1 < bvebveStrOjArr.length; i1++) {		
			if (typeof bvebveStrOjArr[i1][5] != 'undefined') { 
				if (bvebveStrOjArr[i1][5] != '') {
					if (bvebveStrOjArr[i1][4] != 'Wall') {
						var xfile = bvebveStrOjArr[i1][5].replace(/[/]/g,'\\');
						structure[bvebveStrOjArr[i1][1]] = [xfile,0,bvebveStrOjArr[i1][4],0];			
					}
				}
			}
		}			
	} catch(err) {
		teks += "[Error] : error retrieving bvebveStrOjArr list." + "\n" + err.message + ". \n";
	}	
		
	try {
		var RailS = []; 
		var RailL = []; 
		var RailR = []; 
		
		for (i2 = 0; i2 < bverailobjArr.length; i2++) {
			if (typeof bverailobjArr[i2][6] != 'undefined') { 
				if (bverailobjArr[i2][6] != '') {
					
					var RailX = parseInt(bverailobjArr[i2][21]);
					var oType = bverailobjArr[i2][4];
					var oID = bverailobjArr[i2][1];		
					
					//0
					var xs0 = bverailobjArr[i2][6].replace(/[/]/g,'\\');
					var xl0 = bverailobjArr[i2][7].replace(/[/]/g,'\\');
					var xr0 = bverailobjArr[i2][8].replace(/[/]/g,'\\');
					
					//1
					var xs1 = (bverailobjArr[i2][9] != '') ? bverailobjArr[i2][9].replace(/[/]/g,'\\') : '';
					var xl1 = (bverailobjArr[i2][10] != '') ? bverailobjArr[i2][10].replace(/[/]/g,'\\') : '';
					var xr1 = (bverailobjArr[i2][11] != '') ? bverailobjArr[i2][11].replace(/[/]/g,'\\') : '';
					
					//2
					var xs2 = (bverailobjArr[i2][12] != '') ? bverailobjArr[i2][12].replace(/[/]/g,'\\') : '';
					var xl2 = (bverailobjArr[i2][13] != '') ? bverailobjArr[i2][13].replace(/[/]/g,'\\') : '';
					var xr2 = (bverailobjArr[i2][14] != '') ? bverailobjArr[i2][14].replace(/[/]/g,'\\') : '';
					
					//3
					var xs3 = (bverailobjArr[i2][15] != '') ? bverailobjArr[i2][15].replace(/[/]/g,'\\') : '';
					var xl3 = (bverailobjArr[i2][16] != '') ? bverailobjArr[i2][16].replace(/[/]/g,'\\') : '';
					var xr3 = (bverailobjArr[i2][17] != '') ? bverailobjArr[i2][17].replace(/[/]/g,'\\') : '';
					
					//4
					var xs4 = (bverailobjArr[i2][18] != '') ? bverailobjArr[i2][18].replace(/[/]/g,'\\') : '';
					var xl4 = (bverailobjArr[i2][19] != '') ? bverailobjArr[i2][19].replace(/[/]/g,'\\') : '';
					var xr4 = (bverailobjArr[i2][20] != '') ? bverailobjArr[i2][20].replace(/[/]/g,'\\') : '';
					
					
					if (RailS.length == 0) {
						structure[oID + i2 + '_0'] = [xs0,0,'rail',RailX];
						RailS.push(xs0);
						
						if (xs1 != '') {
							var cek1 = true;
							for (j=0;j<RailS.length;j++) {
								if (RailS[j] == xs1) {
									cek1 = false;
									break;
								}
							}
							
							if (cek1) {
								structure[oID + i2 + '_1'] = [xs1,0,'rail',RailX];
								RailS.push(xs1);
							}
						}

						if (xs2 != '') {
							var cek2 = true;
							for (j=0;j<RailS.length;j++) {
								if (RailS[j] == xs2) {
									cek2 = false;
									break;
								}
							}		

							if (cek2) {
								structure[oID + i2 + '_2'] = [xs2,0,'rail',RailX];
								RailS.push(xs2);
							}							
						}

						if (xs3 != ''){
							var cek3 = true;
							for (j=0;j<RailS.length;j++) {
								if (RailS[j] == xs3) {
									cek3 = false;
									break;
								}
							}	
							
							if (cek3) {
								structure[oID + i2 + '_3'] = [xs3,0,'rail',RailX];
								RailS.push(xs3);
							}			
						}

						if (xs4 != '') {
							var cek4 = true;
							for (j=0;j<RailS.length;j++) {
								if (RailS[j] == xs4) {
									cek4 = false;
									break;
								}
							}
							
							if (cek4) {
								structure[oID + i2 + '_4'] = [xs4,0,'rail',RailX];
								RailS.push(xs4);
							}							
						}
						
					} else {
						var cek0 = true;
						for (j=0;j<RailS.length;j++) {
							if (RailS[j] == xs0) {
								cek0 = false;
								break;
							}
						}
						
						if (cek0) {
							structure[oID + i2 + '_0'] = [xs0,0,'rail',RailX];
							RailS.push(xs0);
						}
						
						if (xs1 != '') {
							var cek1 = true;
							for (j=0;j<RailS.length;j++) {
								if (RailS[j] == xs1) {
									cek1 = false;
									break;
								}
							}
							
							if (cek1) {
								structure[oID + i2 + '_1'] = [xs1,0,'rail',RailX];
								RailS.push(xs1);
							}
						}

						if (xs2 != '') {
							var cek2 = true;
							for (j=0;j<RailS.length;j++) {
								if (RailS[j] == xs2) {
									cek2 = false;
									break;
								}
							}		

							if (cek2) {
								structure[oID + i2 + '_2'] = [xs2,0,'rail',RailX];
								RailS.push(xs2);
							}							
						}

						if (xs3 != ''){
							var cek3 = true;
							for (j=0;j<RailS.length;j++) {
								if (RailS[j] == xs3) {
									cek3 = false;
									break;
								}
							}	
							
							if (cek3) {
								structure[oID + i2 + '_3'] = [xs3,0,'rail',RailX];
								RailS.push(xs3);
							}			
						}

						if (xs4 != '') {
							var cek4 = true;
							for (j=0;j<RailS.length;j++) {
								if (RailS[j] == xs4) {
									cek4 = false;
									break;
								}
							}
							
							if (cek4) {
								structure[oID + i2 + '_4'] = [xs4,0,'rail',RailX];
								RailS.push(xs4);
							}							
						}
						
					}
					
					if (RailL.length == 0) {
						structure['RailL_' + i2 + '_0'] = [xl0,0,'rail',RailX];
						RailL.push(xl0);
						
						if (xl1 != '') {
							var cek1 = true;
							for (j=0;j<RailL.length;j++) {
								if (RailL[j] == xl1) {
									cek1 = false;
									break;
								}
							}
							if (cek1) {
								structure['RailL_' + i2 + '_1'] = [xl1,0,'rail',RailX];
								RailL.push(xl1);
							}													
						}
						
						if (xl2 != '') {
							var cek2 = true;
							for (j=0;j<RailL.length;j++) {
								if (RailL[j] == xl2) {
									cek2 = false;
									break;
								}
							}
							if (cek2) {
								structure['RailL_' + i2 + '_2'] = [xl2,0,'rail',RailX];
								RailL.push(xl2);
							}								
						}

						if (xl3 != '') {
							var cek3 = true;
							for (j=0;j<RailL.length;j++) {
								if (RailL[j] == xl3) {
									cek3 = false;
									break;
								}
							}
							if (cek3) {
								structure['RailL_' + i2 + '_3'] = [xl3,0,'rail',RailX];
								RailL.push(xl3);
							}													
						}

						if (xl4 != '') {
							var cek4 = true;
							for (j=0;j<RailL.length;j++) {
								if (RailL[j] == xl4) {
									cek4 = false;
									break;
								}
							}
							if (cek4) {
								structure['RailL_' + i2 + '_4'] = [xl4,0,'rail',RailX];
								RailL.push(xl4);
							}							
						}
						
					} else {
						var cek0 = true;
						for (j=0;j<RailL.length;j++) {
							if (RailL[j] == xl0) {
								cek0 = false;
								break;
							}
						}
						
						if (cek0) {
							structure['RailL_'+ i2 + '_0'] = [xl0,0,'rail',RailX];
							RailL.push(xl0);
						}	

						if (xl1 != '') {
							var cek1 = true;
							for (j=0;j<RailL.length;j++) {
								if (RailL[j] == xl1) {
									cek1 = false;
									break;
								}
							}
							if (cek1) {
								structure['RailL_' + i2 + '_1'] = [xl1,0,'rail',RailX];
								RailL.push(xl1);
							}													
						}
						
						if (xl2 != '') {
							var cek2 = true;
							for (j=0;j<RailL.length;j++) {
								if (RailL[j] == xl2) {
									cek2 = false;
									break;
								}
							}
							if (cek2) {
								structure['RailL_' + i2 + '_2'] = [xl2,0,'rail',RailX];
								RailL.push(xl2);
							}								
						}

						if (xl3 != '') {
							var cek3 = true;
							for (j=0;j<RailL.length;j++) {
								if (RailL[j] == xl3) {
									cek3 = false;
									break;
								}
							}
							if (cek3) {
								structure['RailL_' + i2 + '_3'] = [xl3,0,'rail',RailX];
								RailL.push(xl3);
							}													
						}

						if (xl4 != '') {
							var cek4 = true;
							for (j=0;j<RailL.length;j++) {
								if (RailL[j] == xl4) {
									cek4 = false;
									break;
								}
							}
							if (cek4) {
								structure['RailL_' + i2 + '_4'] = [xl4,0,'rail',RailX];
								RailL.push(xl4);
							}							
						}						
					}
					
					if (RailR.length == 0) {
						structure['RailR_'+i2 + '_0'] = [xr0,0,'rail',RailX];
						RailR.push(xr0);

						if (xr1 != '') {
							var cek1 = true;
							for (j=0;j<RailR.length;j++) {
								if (RailR[j] == xr1) {
									cek1 = false;
									break;
								}
							}
							if (cek1) {
								structure['RailR_' + i2 + '_1'] = [xr1,0,'rail',RailX];
								RailR.push(xr1);
							}								
						}

						if (xr2 != '') {
							var cek2 = true;
							for (j=0;j<RailR.length;j++) {
								if (RailR[j] == xr2) {
									cek2 = false;
									break;
								}
							}
							if (cek2) {
								structure['RailR_' + i2 + '_2'] = [xr2,0,'rail',RailX];
								RailR.push(xr2);
							}							
						}

						if (xr3 != '') {
							var cek3 = true;
							for (j=0;j<RailR.length;j++) {
								if (RailR[j] == xr3) {
									cek3 = false;
									break;
								}
							}
							if (cek3) {
								structure['RailR_' + i2 + '_3'] = [xr3,0,'rail',RailX];
								RailR.push(xr3);
							}							
						}

						if (xr4 != '') {
							var cek4 = true;
							for (j=0;j<RailR.length;j++) {
								if (RailR[j] == xr4) {
									cek4 = false;
									break;
								}
							}
							if (cek4) {
								structure['RailR_' + i2 + '_4'] = [xr4,0,'rail',RailX];
								RailR.push(xr4);
							}							
						}
						
					} else {
						var cek0 = true;
						for (j=0;j<RailR.length;j++) {
							if (RailR[j] == xr0) {
								cek0 = false;
								break;
							}
						}			
						if (cek0) {
							structure['RailR_' + i2 + '_0'] = [xr0,0,'rail',RailX];
							RailR.push(xr0);
						}	
						
						if (xr1 != '') {
							var cek1 = true;
							for (j=0;j<RailR.length;j++) {
								if (RailR[j] == xr1) {
									cek1 = false;
									break;
								}
							}
							if (cek1) {
								structure['RailR_' + i2 + '_1'] = [xr1,0,'rail',RailX];
								RailR.push(xr1);
							}								
						}

						if (xr2 != '') {
							var cek2 = true;
							for (j=0;j<RailR.length;j++) {
								if (RailR[j] == xr2) {
									cek2 = false;
									break;
								}
							}
							if (cek2) {
								structure['RailR_' + i2 + '_2'] = [xr2,0,'rail',RailX];
								RailR.push(xr2);
							}							
						}

						if (xr3 != '') {
							var cek3 = true;
							for (j=0;j<RailR.length;j++) {
								if (RailR[j] == xr3) {
									cek3 = false;
									break;
								}
							}
							if (cek3) {
								structure['RailR_' + i2 + '_3'] = [xr3,0,'rail',RailX];
								RailR.push(xr3);
							}							
						}

						if (xr4 != '') {
							var cek4 = true;
							for (j=0;j<RailR.length;j++) {
								if (RailR[j] == xr4) {
									cek4 = false;
									break;
								}
							}
							if (cek4) {
								structure['RailR_' + i2 + '_4'] = [xr4,0,'rail',RailX];
								RailR.push(xr4);
							}							
						}	
					}
				}
			}

			if (bverailobjArr[i2][1] == railtype) {
				defaultrailbaseX = xs0;
				defaultrailLx = xl0;
				defaultrailRx = xr0;

			}			
		}
		
		for (key in structure) {
			if (structure[key][0] == defaultrailbaseX) {
				defaultrailbasekey = key;
				structure[key][1]++;
			}
			if (structure[key][0] == defaultrailLx) {
				defaultrailLkey = key;
				structure[key][1]++;
			}
			if (structure[key][0] == defaultrailRx) {
				defaultrailRkey = key;
				structure[key][1]++;
			}
		}		
	}
	catch(err) {
		teks += "[Error] : error in creating rail list." + "\n" + err.message + ". \n";
	}	
	
	try {
		//[(0)'0',(1)'DikeGrassLR1',(2)'Grass Dike LR 1',(3)'bve5/8dike_h56w9-2.jpg', (4)'shared/dike/8dike_h56w9-2l.x',(5)'shared/dike/8dike_h56w9-2r.x',(6)'5'];
		var DikeL = [];
		var DikeR = [];		
		for (var i3=0; i3 < bvedikeObjArr.length; i3++) {
			if (typeof bvedikeObjArr[i3][4] != 'undefined' && typeof bvedikeObjArr[i3][5] != 'undefined') {
				if (bvedikeObjArr[i3][4] != '' || bvedikeObjArr[i3][5] != '') {
					var xfileL = bvedikeObjArr[i3][4].replace(/[/]/g,'\\');
					var xfileR = bvedikeObjArr[i3][5].replace(/[/]/g,'\\');
					
					if (DikeL.length == 0) {
						structure['dikeL_'+i3] = [xfileL,0,'dike',bvedikeObjArr[i3][6]];
						DikeL.push(xfileL);
					} else {
						var cek = true;
						for (j=0;j<DikeL.length;j++) {
							if (DikeL[j] == xfileL) {
								cek = false;
								break;
							}
						}
						if (cek) {
							structure['dikeL_'+i3] = [xfileL,0,'dike',bvedikeObjArr[i3][6]];
							DikeL.push(xfileL);
						}
					}
					
					if (DikeR.length == 0) {
						structure['dikeR_'+i3] = [xfileR,0,'dike',bvedikeObjArr[i3][6]];
						DikeR.push(xfileR);
					} else {
						var cek = true;
						for (j=0;j<DikeR.length;j++) {
							if (DikeR[j] == xfileR) {
								cek = false;
								break;
							}
						}
						if (cek) {
							structure['dikeR_'+i3] = [xfileR,0,'dike',bvedikeObjArr[i3][6]];
							DikeR.push(xfileR);
						}
					}
										
				}									
			}
		}		
	}
	catch(err) {
		teks += "[Error] : error in creating dike list." + "\n" + err.message + ". \n";
	}	
	
	try {
		var FoO = [];
		var WallL = [];
		var WallR = [];
		//[(0)'0',(1)'TunnelD1',(2)'Tunnel Double Track 1',(3)'bve5/tunentd.jpg',(4)'shared/tunnel/tunentd1_1.x',(5)'shared/tunnel/tunextd1_1.x', (6)'shared/tunnel/tunwalldl1_1.x',(7)'shared/tunnel/tunwalldr1_1.x',(8)'25'];
		for (var i4=0; i4 < bvetunnelObjArr.length; i4++) {
	
			if (typeof bvetunnelObjArr[i4][4] != 'undefined') { //tunnel entrance
				if (bvetunnelObjArr[i4][4] != '') {
					var xfile = bvetunnelObjArr[i4][4].replace(/[/]/g,'\\');
					
					if (FoO.length == 0) {
						structure['TunS_'+bvetunnelObjArr[i4][1]] = [xfile,0,'tunnel',0];
						FoO.push(xfile);
					} else {
						var cek = true;
						for (j=0;j<FoO.length;j++) {
							if (FoO[j] == xfile) {
								cek = false;
								break;
							}
						}
						if (cek) {
							structure['TunS_'+bvetunnelObjArr[i4][1]] = [xfile,0,'tunnel',0];
							FoO.push(xfile);
						}
					} 							
				}							
			}
			if (typeof bvetunnelObjArr[i4][5] != 'undefined') { //tunnel exit
				if (bvetunnelObjArr[i4][5] != '') {
					var xfile = bvetunnelObjArr[i4][5].replace(/[/]/g,'\\');
					
					if (FoO.length == 0) {
						structure['TunE_'+bvetunnelObjArr[i4][1]] = [xfile,0,'tunnel',0];
						FoO.push(xfile);
					} else {
						var cek = true;
						for (j=0;j<FoO.length;j++) {
							if (FoO[j] == xfile) {
								cek = false;
								break;
							}
						}
						if (cek) {
							structure['TunE_'+bvetunnelObjArr[i4][1]] = [xfile,0,'tunnel',0];
							FoO.push(xfile);
						}
					}
				}							
			}
		
			if (typeof bvetunnelObjArr[i4][6] != 'undefined' && typeof bvetunnelObjArr[i4][7] != 'undefined') {
				if (bvetunnelObjArr[i4][6] != '' || bvetunnelObjArr[i4][7] != '') {
					var xfileL = bvetunnelObjArr[i4][6].replace(/[/]/g,'\\');
					var xfileR = bvetunnelObjArr[i4][7].replace(/[/]/g,'\\');
					
					if (WallL.length == 0) {
						structure['TunL1_'+i4] = [xfileL,0,'tunnel',bvetunnelObjArr[i4][8]];
						WallL.push(xfileL);
					} else {
						var cek = true;
						for (j=0;j<WallL.length;j++) {
							if (WallL[j] == xfileL) {
								cek = false;
								break;
							}
						}
						if (cek) {
							structure['TunL1_'+i4] = [xfileL,0,'tunnel',bvetunnelObjArr[i4][8]];
							WallL.push(xfileL);
						}
					}
					
					if (WallR.length == 0) {
						structure['TunR1_'+i4] = [xfileR,0,'tunnel',bvetunnelObjArr[i4][8]];
						WallR.push(xfileR);
					} else {
						var cek = true;
						for (j=0;j<WallR.length;j++) {
							if (WallR[j] == xfileR) {
								cek = false;
								break;
							}
						}
						if (cek) {
							structure['TunR1_'+i4] = [xfileR,0,'tunnel',bvetunnelObjArr[i4][8]];
							WallR.push(xfileR);
						}
					}					
				}									
			}
			
			WallL = [];
			WallR = [];
			
		}		
	}
	catch(err) {
		teks += "[Error] : error in creating tunnel list." + "\n" + err.message + ". \n";
	}	
	
	FoO = [];
	try {
		//['1','Flyover02','Flyover 2','fo02.png','seto_down/wall/walll.csv','seto_down/wall/wallr.csv','pierdbll.csv','50','']
		var FoL = [];
		var FoR = [];
		
		for (var i5=0; i5 < bveFOObjArr.length; i5++) {
			if ((typeof bveFOObjArr[i5][4] != 'undefined') && (typeof bveFOObjArr[i5][5] != 'undefined'))  { 
				if ((bveFOObjArr[i5][4] != '') || (bveFOObjArr[i5][5] != '')) {
					var xfileL = bveFOObjArr[i5][4].replace(/[/]/g,'\\');
					var xfileR = bveFOObjArr[i5][5].replace(/[/]/g,'\\');
					
					if (FoL.length == 0) {
						structure['FoL_'+i5] = [xfileL,0,'flyover',bveFOObjArr[i5][6]];
						FoL.push(xfileL);
					} else {
						var cek = true;
						for (j=0;j<FoL.length;j++) {
							if (FoL[j] == xfileL) {
								cek = false;
								break;
							}
						}
						if (cek) {
							structure['FoL_'+i5] = [xfileL,0,'flyover',bveFOObjArr[i5][6]];
							FoL.push(xfileL);
						}
					}
					
					if (FoR.length == 0) {
						structure['FoR_'+i5] = [xfileR,0,'flyover',bveFOObjArr[i5][6]];
						FoR.push(xfileR);
					} else {
						var cek = true;
						for (j=0;j<FoR.length;j++) {
							if (FoR[j] == xfileR) {
								cek = false;
								break;
							}
						}
						if (cek) {
							structure['FoR_'+i5] = [xfileR,0,'flyover',bveFOObjArr[i5][6]];
							FoR.push(xfileR);
						}
					}
					
				}
			}
			if (typeof bveFOObjArr[i5][7] != 'undefined') { //pier
				if (bveFOObjArr[i5][7] != '') {
					var xfileL = bveFOObjArr[i5][7].replace(/[/]/g,'\\');
					
					if (FoO.length == 0) {
						structure['FoP_'+bveFOObjArr[i5][1]] = [xfileL,0,'flyover',bveFOObjArr[i5][8]];
						FoO.push(xfileL);
					} else {
						var cek = true;
						for (j=0;j<FoO.length;j++) {
							if (FoO[j] == xfileL) {
								cek = false;
								break;
							}
						}
						if (cek) {
							structure['FoP_'+bveFOObjArr[i5][1]] = [xfileL,0,'flyover',bveFOObjArr[i5][8]];
							FoO.push(xfileL);
						}
					}							
				}							
			}
		} 		
	}
	catch(err) {
		teks += "[Error] : error in creating flyover list." + "\n" + err.message + ". \n";
	}	
	
	FoO = [];
	try {
		//['0','concreteB1','Concrete Bridge 1','concrete-bridge-01.png','bridgel.csv','<center>','bridger.csv','<pier>','0','type']
		//[(0)'1',(1)'ConBridgeLR',(2)'Concrete Bridge LR',(3)'bve5/bridgelr.jpg',(4)'shared/bridge/8concrete_bridgel.x',(5)'shared/bridge/8concrete_bridger.x',(6)'25',(7)'',(8)'25'];
		var bridgeL = [];
		var bridgeR = [];
		
		for (var i6=0; i6 < bvebridgeObjArr.length; i6++) { 
			if (typeof bvebridgeObjArr[i6][4] != 'undefined') { 
				if (bvebridgeObjArr[i6][4] != '') {
					var xfileL = bvebridgeObjArr[i6][4].replace(/[/]/g,'\\');						
					if (bridgeL.length == 0) {
						structure['bridgeL_'+i6] = [xfileL,0,'bridge',bvebridgeObjArr[i6][6]];
						bridgeL.push(xfileL);
					} else {
						var cek = true;
						for (j=0;j<bridgeL.length;j++) {
							if (bridgeL[j] == xfileL) {
								cek = false;
								break;
							}
						}
						if (cek) {
							structure['bridgeL_'+i6] = [xfileL,0,'bridge',bvebridgeObjArr[i6][6]];
							bridgeL.push(xfileL);
						}
					}
				}
			}	
			if (typeof bvebridgeObjArr[i6][5] != 'undefined') { 	
				if (bvebridgeObjArr[i6][5] != '') {	
					var xfileR = bvebridgeObjArr[i6][5].replace(/[/]/g,'\\');
					if (bridgeR.length == 0) {
						structure['bridgeR_'+i6] = [xfileR,0,'bridge',bvebridgeObjArr[i6][6]];
						bridgeR.push(xfileR);
					} else {
						var cek = true;
						for (j=0;j<bridgeR.length;j++) {
							if (bridgeR[j] == xfileR) {
								cek = false;
								break;
							}
						}
						if (cek) {
							structure['bridgeR_'+i6] = [xfileR,0,'bridge',bvebridgeObjArr[i6][6]];
							bridgeR.push(xfileR);
						}
					}									
				}
			}
			if (typeof bvebridgeObjArr[i6][7] != 'undefined') { //pier
				if (bvebridgeObjArr[i6][7] != '') {
					var xfileP = bvebridgeObjArr[i6][7].replace(/[/]/g,'\\');
					
					if (FoO.length == 0) {
						structure['bridgeP_'+bvebridgeObjArr[i6][1]] = [xfileP,0,'bridge',bvebridgeObjArr[i6][8]];
						FoO.push(xfileP);
					} else {
						var cek = true;
						for (j=0;j<FoO.length;j++) {
							if (FoO[j] == xfileP) {
								cek = false;
								break;
							}
						}
						if (cek) {
							structure['bridgeP_'+bvebridgeObjArr[i6][1]] = [xfileP,0,'bridge',bvebridgeObjArr[i6][8]];
							FoO.push(xfileP);
						}
					}
				}							
			}			
						
		}
	}
	catch(err) {
		teks += "[Error] : error in creating bridge list." + "\n" + err.message + ". \n";
	}	
	
	FoO = [];
	
	try {
// 0#'0',
// 1#'DTUG1',
// 2#'Double Track subway 1',
// 3#'bve5/ug1.jpg',
// 4#'shared/subway/ggl1-grass2.x',
// 5#'shared/subway/ggr1-grass2.x',
// 6#'25',
// 7#'shared/subway/uwalll-0011-concrete-bare-clean.x',
// 8#'shared/subway/uwallr-0011-concrete-bare-clean.x',
// 9#'5',
// 10#'shared/subway/entdt1_1.x',
// 11#'shared/subway/utwalll1_1.x',
// 12#'shared/subway/utwallr1_1.x',
// 13#'5',
// 14#'shared/subway/exdt1_1.x'];

		var GrnL = [];
		var GrnR = [];
		var subwayL = [];
		var subwayR = [];
		
		for (var isw=0; isw < bveUGObjArr.length; isw++) {
			if ((typeof bveUGObjArr[isw][4] != 'undefined') && (typeof bveUGObjArr[isw][5] != 'undefined'))  { 
				if ((bveUGObjArr[isw][4] != '') || (bveUGObjArr[isw][5] != '')) {
					var xfileL = bveUGObjArr[isw][4].replace(/[/]/g,'\\');
					var xfileR = bveUGObjArr[isw][5].replace(/[/]/g,'\\');
					
					if (GrnL.length == 0) {
						structure['GrnL_'+isw] = [xfileL,0,'subway',bveUGObjArr[isw][6]];
						GrnL.push(xfileL);
					} else {
						var cek = true;
						for (j=0;j<GrnL.length;j++) {
							if (GrnL[j] == xfileL) {
								cek = false;
								break;
							}
						}
						if (cek) {
							structure['GrnL_'+isw] = [xfileL,0,'subway',bveUGObjArr[isw][6]];
							GrnL.push(xfileL);
						}
					}
					
					if (GrnR.length == 0) {
						structure['GrnR_'+isw] = [xfileR,0,'subway',bveUGObjArr[isw][6]];
						GrnR.push(xfileR);
					} else {
						var cek = true;
						for (j=0;j<GrnR.length;j++) {
							if (GrnR[j] == xfileR) {
								cek = false;
								break;
							}
						}
						if (cek) {
							structure['GrnR_'+isw] = [xfileR,0,'subway',bveUGObjArr[isw][6]];
							GrnR.push(xfileR);
						}
					}									
				}
			}

			if ((typeof bveUGObjArr[isw][7] != 'undefined') && (typeof bveUGObjArr[isw][8] != 'undefined'))  { 
				if ((bveUGObjArr[isw][7] != '') || (bveUGObjArr[isw][8] != '')) {
					var xfileL = bveUGObjArr[isw][7].replace(/[/]/g,'\\');
					var xfileR = bveUGObjArr[isw][8].replace(/[/]/g,'\\');
					
					if (subwayL.length == 0) {
						structure['SwL'+isw] = [xfileL,0,'subway',bveUGObjArr[isw][9]];
						subwayL.push(xfileL);
					} else {
						var cek = true;
						for (j=0;j<subwayL.length;j++) {
							if (subwayL[j] == xfileL) {
								cek = false;
								break;
							}
						}
						if (cek) {
							structure['SwL'+isw] = [xfileL,0,'subway',bveUGObjArr[isw][9]];
							subwayL.push(xfileL);
						}
					}
					
					if (subwayR.length == 0) {
						structure['SwR'+isw] = [xfileR,0,'subway',bveUGObjArr[isw][9]];
						subwayR.push(xfileR);
					} else {
						var cek = true;
						for (j=0;j<subwayR.length;j++) {
							if (subwayR[j] == xfileR) {
								cek = false;
								break;
							}
						}
						if (cek) {
							structure['SwR'+isw] = [xfileR,0,'subway',bveUGObjArr[isw][9]];
							subwayR.push(xfileR);
						}
					}
				}
			}

			if ((typeof bveUGObjArr[isw][11] != 'undefined') && (typeof bveUGObjArr[isw][12] != 'undefined'))  { 
				if ((bveUGObjArr[isw][11] != '') || (bveUGObjArr[isw][12] != '')) {
						var xfileL = bveUGObjArr[isw][11].replace(/[/]/g,'\\');
						var xfileR = bveUGObjArr[isw][12].replace(/[/]/g,'\\');
						
						if (WallL.length == 0) {
							structure['WallL_'+isw] = [xfileL,0,'subway',bveUGObjArr[isw][13]];
							WallL.push(xfileL);
						} else {
							var cek = true;
							for (j=0;j<WallL.length;j++) {
								if (WallL[j] == xfileL) {
									cek = false;
									break;
								}
							}
							if (cek) {
								structure['WallL_'+isw] = [xfileL,0,'subway',bveUGObjArr[isw][13]];
								WallL.push(xfileL);
							}
						}
						
						if (WallR.length == 0) {
							structure['WallR_'+isw] = [xfileR,0,'subway',bveUGObjArr[isw][13]];
							WallR.push(xfileR);
						} else {
							var cek = true;
							for (j=0;j<WallR.length;j++) {
								if (WallR[j] == xfileR) {
									cek = false;
									break;
								}
							}
							if (cek) {
								structure['WallR_'+isw] = [xfileR,0,'subway',bveUGObjArr[isw][13]];
								WallR.push(xfileR);
							}
						}
										
				}
			}

			// entrance & exit
			if (typeof bveUGObjArr[isw][10] != 'undefined') {
				if (bveUGObjArr[isw][10] != '') {
					var xfileSwEt = bveUGObjArr[isw][10].replace(/[/]/g,'\\');
					
					if (FoO.length == 0) {
						structure['SWEt_'+isw] = [xfileSwEt,0,'subway',0];
						FoO.push(xfileSwEt);
					} else {
						var cek = true;
						for (j=0;j<FoO.length;j++) {
							if (FoO[j] == xfileSwEt) {
								cek = false;
								break;
							}
						}
						if (cek) {
							structure['SWEt_'+isw] = [xfileSwEt,0,'subway',0];
							FoO.push(xfileSwEt);
						}
					} 							
				}									
			}
			if (typeof bveUGObjArr[isw][14] != 'undefined') {
				if (bveUGObjArr[isw][14] != '') {
					var xfileSwEx = bveUGObjArr[isw][14].replace(/[/]/g,'\\');
					
					if (FoO.length == 0) {
						structure['SWEx_'+isw] = [xfileSwEx,0,'subway',0];
						FoO.push(xfileSwEx);
					} else {
						var cek = true;
						for (j=0;j<FoO.length;j++) {
							if (FoO[j] == xfileSwEx) {
								cek = false;
								break;
							}
						}
						if (cek) {
							structure['SWEx_'+isw] = [xfileSwEx,0,'subway',0];
							FoO.push(xfileSwEx);
						}
					} 							
				}									
			}
		} 			
	}
	catch(err) {
		teks += "[Error] : error in creating subway list." + "\n" + err.message + ". \n";
	}	
 
 	try {
		// ['2','LeftRight1','Left Right 1','cut03.png','seto_down/dike/diker.csv','seto_down/dike/dikel.csv']
		var CutL = [];
		var CutR = [];
		for (var i8=0; i8 < bvecutObjArr.length; i8++) {
			if ((typeof bvecutObjArr[i8][4] != 'undefined') && (typeof bvecutObjArr[i8][5] != 'undefined'))  { 
				if ((bvecutObjArr[i8][4] != '') || (bvecutObjArr[i8][5] != '')) {
					var xfileL = bvecutObjArr[i8][4].replace(/[/]/g,'\\');
					var xfileR = bvecutObjArr[i8][5].replace(/[/]/g,'\\');
					
					if (CutL.length == 0) {
						structure['CutL_'+i8] = [xfileL,0,'cut',bvecutObjArr[i8][8]];
						CutL.push(xfileL);
					} else {
						var cek = true;
						for (j=0;j<CutL.length;j++) {
							if (CutL[j] == xfileL) {
								cek = false;
								break;
							}
						}
						if (cek) {
							structure['CutL_'+i8] = [xfileL,0,'cut',bvecutObjArr[i8][8]];
							CutL.push(xfileL);
						}
					}
					
					if (CutR.length == 0) {
						structure['CutR_'+i8] = [xfileR,0,'cut',bvecutObjArr[i8][8]];
						CutR.push(xfileR);
					} else {
						var cek = true;
						for (j=0;j<CutR.length;j++) {
							if (CutR[j] == xfileR) {
								cek = false;
								break;
							}
						}
						if (cek) {
							structure['CutR_'+i8] = [xfileR,0,'cut',bvecutObjArr[i8][8]];
							CutR.push(xfileR);
						}
					}									
				}
			}		

		}  		
	}
	catch(err) {
		teks += "[Error] : error in creating hill cut list." + "\n" + err.message + ". \n";
	}
	
	try {
		var crackL = [];
		var crackR = [];
		//[(0)'0',(1)'BalCrk1',(2)'Ballast Crack 1',(3)'bve5/cr-ballastl1_1.jpg',(4)'shared/crack/ballast/ballastl1_1.x', (5)'shared/crack/ballast/ballastr1_1.x',(6)'25'];
		for (i9 = 0; i9 < bvecrackObjArr.length; i9++) {	
			if ((typeof bvecrackObjArr[i9][4] != 'undefined') && (typeof bvecrackObjArr[i9][5] != 'undefined'))  { 
				if ((bvecrackObjArr[i9][4] != '') || (bvecrackObjArr[i9][5] != '')) {
					var xfileL = bvecrackObjArr[i9][4].replace(/[/]/g,'\\');
					var xfileR = bvecrackObjArr[i9][5].replace(/[/]/g,'\\');
					
					if (crackL.length == 0) {
						structure['crackL_'+i9] = [xfileL,0,'crack',bvecrackObjArr[i9][6]];
						crackL.push(xfileL);
					} else {
						var cek = true;
						for (j=0;j<crackL.length;j++) {
							if (crackL[j] == xfileL) {
								cek = false;
								break;
							}
						}
						if (cek) {
							structure['crackL_'+i9] = [xfileL,0,'crack',bvecrackObjArr[i9][6]];
							crackL.push(xfileL);
						}
					}
					
					if (crackR.length == 0) {
						structure['crackR_'+i9] = [xfileR,0,'crack',bvecrackObjArr[i9][6]];
						crackR.push(xfileR);
					} else {
						var cek = true;
						for (j=0;j<crackR.length;j++) {
							if (crackR[j] == xfileR) {
								cek = false;
								break;
							}
						}
						if (cek) {
							structure['crackR_'+i9] = [xfileR,0,'crack',bvecrackObjArr[i9][6]];
							crackR.push(xfileR);
						}
					}
														
				}
			}		

		}		
	}
	catch(err) {
		teks += "[Error] : error in creating crack list." + "\n" + err.message + ". \n";
	}	
	
	try {
		var Pole5 = [];
		var OHwire = [];
		//var defaultohwireX;
		
		for (i10 = 0; i10 < bvepoleObjArr.length; i10++) {
			if ((typeof bvepoleObjArr[i10][4] != 'undefined'))  { 
				if ((bvepoleObjArr[i10][4] != '')) {
					var xfileL = bvepoleObjArr[i10][4].replace(/[/]/g,'\\');
					var xfileR = bvepoleObjArr[i10][5].replace(/[/]/g,'\\');
					var xfileOH = bvepoleObjArr[i10][6].replace(/[/]/g,'\\');
					
					if (Pole5.length == 0) {
						structure['PoleL_'+i10] = [xfileL,0,'pole',bvepoleObjArr[i10][7]];						
						Pole5.push(xfileL);
						if (xfileR != '') { 
							structure['PoleR_'+i10] = [xfileR,0,'pole',bvepoleObjArr[i10][7]];						
							Pole5.push(xfileR);
						}
					} else {
						var cek = true;
						if (xfileL != '') {
							for (j=0;j<Pole5.length;j++) {
								if (Pole5[j] == xfileL) {
									cek = false;
									break;
								}
							}
							if (cek) {
								structure['PoleL_'+i10] = [xfileL,0,'pole',bvepoleObjArr[i10][7]];
								Pole5.push(xfileL);
							}	
						}
						if (xfileR != '') {
							cek = true;
							for (j=0;j<Pole5.length;j++) {
								if (Pole5[j] == xfileR) {
									cek = false;
									break;
								}
							}
							if (cek) {
								structure['PoleR_'+i10] = [xfileR,0,'pole',bvepoleObjArr[i10][7]];
								Pole5.push(xfileR);
							}
						}
						
					}

					if (xfileOH != '') {
						if (OHwire.length == 0) {
							structure['ohw_'+i10] = [xfileOH,0,'pole',bvepoleObjArr[i10][7]]; 
							OHwire.push(xfileOH);							
						} else {
							var cek = true;
							for (j=0;j<OHwire.length;j++) {
								if (OHwire[j] == xfileOH) {
									cek = false;
									break;
								}
							}
							if (cek) {
								structure['ohw_'+i10] = [xfileOH,0,'pole',bvepoleObjArr[i10][7]];
								OHwire.push(xfileOH);
							}						
						}
					}
				}
			}
		} /*
		for (key in structure) {			
			if (structure[key][0] == defaultohwireX) {
				defaultohwirekey = key;
				structure[key][1]++;
			}
			
		}	
*/		
	}
	catch(err) {
		teks += "[Error] : error in creating pole list." + "\n" + err.message + ". \n";
	}	

	try {
		//['1','FormD2','Form Domestik 2','bve5/form2.jpg','shared/form/forml_5m.x','shared/form/formcl_5m_1.x','shared/form/formcr_5m_1.x','shared/form/formr_5m.x','5','shared/form/roofl2_1.x','shared/form/roofcl2_1.x','shared/form/roofcr2_1.x','shared/form/roofr2_1.x','25'];
		var FormL = [];
		var FormCL = [];
		var FormCR = [];
		var FormR = [];
		
		var RoofL = [];
		var RoofCL = [];
		var RoofCR = [];
		var RoofR = [];
					
		for (var i11=0; i11 < bveplatformObjArr.length; i11++) {
			if (typeof bveplatformObjArr[i11][4] != 'undefined') { 
				if (bveplatformObjArr[i11][4] != '') {
					var xfileL = bveplatformObjArr[i11][4].replace(/[/]/g,'\\');	
					if (FormL.length == 0) {
						structure['FormL_'+i11] = [xfileL,0,'form',bveplatformObjArr[i11][8]];
						FormL.push(xfileL);
					} else {
						var cek = true;
						for (j=0;j<FormL.length;j++) {
							if (FormL[j] == xfileL) {
								cek = false;
								break;
							}
						}
						if (cek) {
							structure['FormL_'+i11] = [xfileL,0,'form',bveplatformObjArr[i11][8]];
							FormL.push(xfileL);
						}
					}					
				}
			}		

			if (typeof bveplatformObjArr[i11][5] != 'undefined') { 
				if (bveplatformObjArr[i11][5] != '') {
					var xfileCL = bveplatformObjArr[i11][5].replace(/[/]/g,'\\');
					if (FormCL.length == 0) {
						structure['FormCL_'+i11] = [xfileCL,0,'form',bveplatformObjArr[i11][8]];
						FormCL.push(xfileCL);
					} else {
						var cek = true;
						for (j=0;j<FormCL.length;j++) {
							if (FormCL[j] == xfileCL) {
								cek = false;
								break;
							}
						}
						if (cek) {
							structure['FormCL_'+i11] = [xfileCL,0,'form',bveplatformObjArr[i11][8]];
							FormCL.push(xfileCL);
						}
					}									
				}
			}		

			if (typeof bveplatformObjArr[i11][6] != 'undefined') { 
				if (bveplatformObjArr[i11][6] != '') {
					var xfileCR = bveplatformObjArr[i11][6].replace(/[/]/g,'\\');
					if (FormCR.length == 0) {
						structure['FormCR_'+i11] = [xfileCR,0,'form',bveplatformObjArr[i11][8]];
						FormCR.push(xfileCR);
					} else {
						var cek = true;
						for (j=0;j<FormCR.length;j++) {
							if (FormCR[j] == xfileCR) {
								cek = false;
								break;
							}
						}
						if (cek) {
							structure['FormCR_'+i11] = [xfileCR,0,'form',bveplatformObjArr[i11][8]];
							FormCR.push(xfileCR);
						}
					}					
				}
			}		

			if (typeof bveplatformObjArr[i11][7] != 'undefined')  { 
				if (bveplatformObjArr[i11][7] != '') {
					var xfileR = bveplatformObjArr[i11][7].replace(/[/]/g,'\\');	
					if (FormR.length == 0) {
						structure['FormR_'+i11] = [xfileR,0,'form',bveplatformObjArr[i11][8]];
						FormR.push(xfileR);
					} else {
						var cek = true;
						for (j=0;j<FormR.length;j++) {
							if (FormR[j] == xfileR) {
								cek = false;
								break;
							}
						}
						if (cek) {
							structure['FormR_'+i11] = [xfileR,0,'form',bveplatformObjArr[i11][8]];
							FormR.push(xfileR);
						}
					}					
				}
			}	

			if (typeof bveplatformObjArr[i11][9] != 'undefined') { 
				if (bveplatformObjArr[i11][9] != '') {
					var xfileL = bveplatformObjArr[i11][9].replace(/[/]/g,'\\');	
					if (RoofL.length == 0) {
						structure['RoofL_'+i11] = [xfileL,0,'roof',bveplatformObjArr[i11][13]];
						RoofL.push(xfileL);
					} else {
						var cek = true;
						for (j=0;j<RoofL.length;j++) {
							if (RoofL[j] == xfileL) {
								cek = false;
								break;
							}
						}
						if (cek) {
							structure['RoofL_'+i11] = [xfileL,0,'roof',bveplatformObjArr[i11][13]];
							RoofL.push(xfileL);
						}
					}
					
				}
			}		
			
			if (typeof bveplatformObjArr[i11][10] != 'undefined') { 
				if (bveplatformObjArr[i11][10] != '') {
					var xfileCL = bveplatformObjArr[i11][10].replace(/[/]/g,'\\');
					if (RoofCL.length == 0) {
						structure['RoofCL_'+i11] = [xfileCL,0,'roof',bveplatformObjArr[i11][13]];
						RoofCL.push(xfileCL);
					} else {
						var cek = true;
						for (j=0;j<RoofCL.length;j++) {
							if (RoofCL[j] == xfileCL) {
								cek = false;
								break;
							}
						}
						if (cek) {
							structure['RoofCL_'+i11] = [xfileCL,0,'roof',bveplatformObjArr[i11][13]];
							RoofCL.push(xfileCL);
						}
					}
					
				}
			}		
			
			if (typeof bveplatformObjArr[i11][11] != 'undefined') { 
				if (bveplatformObjArr[i11][11] != '') {
					var xfileCR = bveplatformObjArr[i11][11].replace(/[/]/g,'\\');		
					if (RoofCR.length == 0) {
						structure['RoofCR_'+i11] = [xfileCR,0,'roof',bveplatformObjArr[i11][13]];
						RoofCR.push(xfileCR);
					} else {
						var cek = true;
						for (j=0;j<RoofCR.length;j++) {
							if (RoofCR[j] == xfileCR) {
								cek = false;
								break;
							}
						}
						if (cek) {
							structure['RoofCR_'+i11] = [xfileCR,0,'roof',bveplatformObjArr[i11][13]];
							RoofCR.push(xfileCR);
						}
					}					
				}
			}		
			
			if (typeof bveplatformObjArr[i11][12] != 'undefined')  { 
				if (bveplatformObjArr[i11][12] != '') {
					var xfileR = bveplatformObjArr[i11][12].replace(/[/]/g,'\\');
					if (RoofR.length == 0) {
						structure['RoofR_'+i11] = [xfileR,0,'roof',bveplatformObjArr[i11][13]];
						RoofR.push(xfileR);
					} else {
						var cek = true;
						for (j=0;j<RoofR.length;j++) {
							if (RoofR[j] == xfileR) {
								cek = false;
								break;
							}
						}
						if (cek) {
							structure['RoofR_'+i11] = [xfileR,0,'roof',bveplatformObjArr[i11][13]];
							RoofR.push(xfileR);
						}
					}					
				}
			}		
			
		}	
		
	}
	catch(err) {
		teks += "[Error] : error in creating platform list." + "\n" + err.message + ". \n";
	}

			
	
	try {
		for (i12 = 0; i12 < bvebveStrOjArr.length; i12++) {
			if (bvebveStrOjArr[i12][4] == 'Wall') {
				if ((typeof bvebveStrOjArr[i12][6] != 'undefined') && (typeof bvebveStrOjArr[i12][7] != 'undefined'))  { 
					if ((bvebveStrOjArr[i12][6] != '') || bvebveStrOjArr([i12][7] != '')) {
						var xfileL = bvebveStrOjArr[i12][6].replace(/[/]/g,'\\');
						var xfileR = bvebveStrOjArr[i12][7].replace(/[/]/g,'\\');
						
						if (WallL.length == 0) {
							structure['WallL_'+i12] = [xfileL,0,bvebveStrOjArr[i12][4],0];
							WallL.push(xfileL);
						} else {
							var cek = true;
							for (j=0;j<WallL.length;j++) {
								if (WallL[j] == xfileL) {
									cek = false;
									break;
								}
							}
							if (cek) {
								structure['WallL_'+i12] = [xfileL,0,bvebveStrOjArr[i12][4],0];
								WallL.push(xfileL);
							}
						}
						
						if (WallR.length == 0) {
							structure['WallR_'+i12] = [xfileR,0,bvebveStrOjArr[i12][4],0];
							WallR.push(xfileR);
						} else {
							var cek = true;
							for (j=0;j<WallR.length;j++) {
								if (WallR[j] == xfileR) {
									cek = false;
									break;
								}
							}
							if (cek) {
								structure['WallR_'+i12] = [xfileR,0,bvebveStrOjArr[i12][4],0];
								WallR.push(xfileR);
							}
						}									
					}
				}
			}		
		}		
	}
	catch(err) {
		teks += "[Error] : error in creating wallL and wallR list." + "\n" + err.message + ". \n";
	}	
	FoO = [];
	var snd3d = [];
	try {
		//['1','rcD1','Road crossing D 1','toolbar.png','tollbardl.csv','crossingd.csv','tollbardr.csv']
		for (var i13=0; i13 < bveRCObjArr.length; i13++) {
			if (typeof bveRCObjArr[i13][4] != 'undefined') {
				if (bveRCObjArr[i13][4] != '') {
					var xfile = bveRCObjArr[i13][4].replace(/[/]/g,'\\');
					
					if (FoO.length == 0) {
						structure['Rc0_'+i13] = [xfile,0,'rc',0];
						FoO.push(xfile);
					} else {
						var cek = true;
						for (j=0;j<FoO.length;j++) {
							if (FoO[j] == xfile) {
								cek = false;
								break;
							}
						}
						if (cek) {
							structure['Rc0_'+i13] = [xfile,0,'rc',0];
							FoO.push(xfile);
						}
					} 							
				}									
			}
			if (typeof bveRCObjArr[i13][5] != 'undefined') {
				if (bveRCObjArr[i13][5] != '') {
					var xfile = bveRCObjArr[i13][5].replace(/[/]/g,'\\');
					
					if (FoO.length == 0) {
						structure['Rc1_'+i13] = [xfile,0,'rc',0];
						FoO.push(xfile);
					} else {
						var cek = true;
						for (j=0;j<FoO.length;j++) {
							if (FoO[j] == xfile) {
								cek = false;
								break;
							}
						}
						if (cek) {
							structure['Rc1_'+i13] = [xfile,0,'rc',0];
							FoO.push(xfile);
						}
					} 							
				}									
			}
			if (typeof bveRCObjArr[i13][6] != 'undefined') {
				if (bveRCObjArr[i13][6] != '') {
					var xfile = bveRCObjArr[i13][6].replace(/[/]/g,'\\');
					
					if (FoO.length == 0) {
						structure['Rc2_'+i13] = [xfile,0,'rc',0];
						FoO.push(xfile);
					} else {
						var cek = true;
						for (j=0;j<FoO.length;j++) {
							if (FoO[j] == xfile) {
								cek = false;
								break;
							}
						}
						if (cek) {
							structure['Rc2_'+i13] = [xfile,0,'rc',0];
							FoO.push(xfile);
						}
					} 							
							
				}									
			}		
			if (typeof bveRCObjArr[i13][7] != 'undefined') {
				if (bveRCObjArr[i13][7] != '') {
					var xfile = bveRCObjArr[i13][7].replace(/[/]/g,'\\');
					
					if (snd3d.length == 0) {
						sound3d['Rc4_'+i13] = [xfile,0,'rc',0];
						snd3d.push(xfile);
					} else {
						var cek = true;
						for (j=0;j<snd3d.length;j++) {
							if (snd3d[j] == xfile) {
								cek = false;
								break;
							}
						}
						if (cek) {
							sound3d['Rc4_'+i13] = [xfile,0,'rc',0];
							snd3d.push(xfile);
						}
					} 							
							
				}									
			}		
		}		
	}
	catch(err) {
		teks += "[Error] : error in creating road crossing list." + "\n" + err.message + ". \n";
	} 
  	FoO = [];
	try {
		for (i14 = 0; i14 < bvefreeObjArr.length; i14++) {
			if (typeof bvefreeObjArr[i14][5] != 'undefined') {
				if (bvefreeObjArr[i14][5] != '') {
					var xfile = bvefreeObjArr[i14][5].replace(/[/]/g,'\\');
					
					if (FoO.length == 0) {
						structure[bvefreeObjArr[i14][1]] = [xfile,0,bvefreeObjArr[i14][4],0];
						FoO.push(xfile);
					} else {
						var cek = true;
						for (j=0;j<FoO.length;j++) {
							if (FoO[j] == xfile) {
								cek = false;
								break;
							}
						}
						if (cek) {
							structure[bvefreeObjArr[i14][1]] = [xfile,0,bvefreeObjArr[i14][4],0];
							FoO.push(xfile);
						}
					}							
				}									
			}		
		}		
	}
	catch(err) {
		teks += "[Error] : error in creating FreeObj list." + "\n" + err.message + ". \n";
	}
	
	var snd = [];
	try {
		for (i15 = 0; i15 < bveaudioObjArr.length; i15++) {
			if (typeof bveaudioObjArr[i15][4] != 'undefined') {
				if (bveaudioObjArr[i15][4] != '') {
					var xfile = bveaudioObjArr[i15][4].replace(/[/]/g,'\\');
					
					if (bveaudioObjArr[i15][3] == 'Dopler') {
						if (snd3d.length == 0) {
							sound3d['Wav_'+i15] = [xfile,0,'wav',0];
							snd3d.push(xfile);
						} else {
							var cek = true;
							for (j=0;j<snd3d.length;j++) {
								if (snd3d[j] == xfile) {
									cek = false;
									break;
								}
							}
							if (cek) {
								sound3d['Wav_'+i15] = [xfile,0,'wav',0];
								snd3d.push(xfile);
							}
						} 					
					} else {
					
						if (snd.length == 0) {
							sound['Wav_'+i15] = [xfile,0,'wav',0];
							snd.push(xfile);
							//if (bveaudioObjArr[i15][3] == 'JointNoise' && typeof joinkey =='undefined') {
							//	joinkey ='Wav_'+i15;
							//}					
							//if (bveaudioObjArr[i15][3] == 'FlangeNoise' && typeof flangekey =='undefined') {
							//	flangekey ='Wav_'+i15;
							//}							
						} else {
							var cek = true;
							for (j=0;j<snd.length;j++) {
								if (snd[j] == xfile) {
									cek = false;
									break;
								}
							}
							if (cek) {
								sound['Wav_'+i15] = [xfile,0,'wav',0];
								snd.push(xfile);
								//if (bveaudioObjArr[i15][3] == 'JointNoise' && typeof joinkey =='undefined') {
								//	joinkey ='Wav_'+i15;
								//}					
								//if (bveaudioObjArr[i15][3] == 'FlangeNoise' && typeof flangekey =='undefined') {
								//	flangekey ='Wav_'+i15;
								//}								
							}
						} 					
					
					}
							
				}									
			}		
		}		
	}
	catch(err) {
		teks += "[Error] : error in creating Audio list." + "\n" + err.message + ". \n";
	}
	
	
	var polyL = MapToolbar.features['lineTab'][pid];
	var allPoints = polyL.getPath().getArray();

	if (typeof polyL == 'undefined') {
		alert('unknown line (' + pid + '). BVE route building terminated by system');
		return false;
	}

	var persen = 0;
	var distance = 0;

	//main data conversion logic
	for (var i = 0; i < allPoints.length; i++)   { 
		var x = getTrackDistanceFromStart(pid,i);  //distance { 'Lpoly' : Lpoly, 'LwCurve' : LwCurve, 'LwPitch' : LwPitch}	
		var currX = x.LwPitch; 
		var PoleCycle;
		
		/* ++++ overhead wire on start correction 14/3/2017 ++++ */
		// 4 setting defaultohwirekey value onstart
		if (i == 0) {
			if (polyL.markers.getAt(0).kdata.pole != '') {

				var arrK0 = polyL.markers.getAt(0).kdata.pole.split('¤');
				
				for (k = 0; k < arrK0.length; k++) {
					var arrK0_1 = arrK0[k].split(':');
					if (arrK0_1[1] == '0') {		
						var poleWkey,poleWx;

						for (p = 0; p < bvepoleObjArr.length; p++) {
							if (bvepoleObjArr[p][1] == arrK0_1[0]) {
								poleLx = bvepoleObjArr[p][4].replace(/[/]/g,'\\');
								poleRx = bvepoleObjArr[p][5].replace(/[/]/g,'\\');	

								poleWx = bvepoleObjArr[p][6].replace(/[/]/g,'\\');						
								PoleCycle = parseInt(bvepoleObjArr[p][7]);	
						
								for (key in structure) {
									//alert(structure[key][0] + ' : ' + poleWx);
									if (structure[key][0] == poleWx && poleWx!='') {
										poleWkey = key;
										defaultohwirekey = key; // 2test 13/3/2017
										structure[key][1]++;
										break;
									}
								}
							
								break;
							}
						}			
					} 
				}
			}
		}
		/* ---- overhead wire on start correction 14/3/2017 ---- */
		
		//bdata: {height:'',railindex:'',pitch:'',curve:'',tcurve:''},	
		if (polyL.markers.getAt(i).sline != '') {
			ProcessSLine5(polyL.markers.getAt(i).sline, Math.round(currX),stIdx,edIdx,i,gauge);		
		}	
				
		//try {
			if (polyL.markers.getAt(i).bdata.tcurve != '') {
				if (i >= stIdx && i <= edIdx) {
					var tPoly = MapToolbar.features['tcurveTab'][polyL.markers.getAt(i).bdata.tcurve];			
					var tL = tPoly.TL;
					var cL = tPoly.Lc + 2*tPoly.Ls;
					var Rc = tPoly.Rc;
					var dir = (Rc < 0)? -1 : 1;
					var cant = dir * (tPoly.cant/1000);
					var Vd = tPoly.Vd;
					var forceSL = tPoly.forceSL;

					currX -= tL;
				
					for (var ci=0; ci < tPoly.markers.getLength(); ci++) {
						if (ci != 2) {
							var cX = currX + tPoly.markers.getAt(ci).ld;
						
							if (ci == 0) { //transition start
						
								var tmpTxt = '\tCurve.BeginTransition();\n\tStructure[\'sign_m_curve\'].Put(, -2.4, 0.5, 0, 0, 0, 0, 0, 0);\n';
								structure['sign_m_curve'][1]++;
								
								if (forceSL == true) {
									tmpTxt += '\tSpeedLimit.Begin(' + Vd + ');\n';
									
									tmpTxt += speedlimitSign(Vd); //speedlimit sign
									
								}

								mainTrkArr.push([Math.round(cX),tmpTxt]);
								
							} else if (ci == 1) {	//transition end			
								var tmpTxt = '\tCurve.End();\n';
							
								if (forceSL == true) {
									tmpTxt += '\tSpeedLimit.End();\n';
									tmpTxt += '\tStructure[\'sign_spl_pole\'].Put(, -2.5, -0.2, 0, 0, 0, 0, 0, 0);\n'; //speedlimit end sign
									tmpTxt += '\tStructure[\'sign_spl_End\'].Put(, -2.5, -0.2, 0, 0, 0, 0, 0, 0);\n'; //speedlimit end sign
									structure['sign_spl_pole'][1]++;
									structure['sign_spl_End'][1]++;									
								}

								mainTrkArr.push([Math.round(cX),tmpTxt]);
							
							} else if (ci == 3) { // circular start
								var tmpTxt = '\tCurve.Begin(' + Rc + ',' + cant+');\n';

								mainTrkArr.push([Math.round(cX),tmpTxt]);
								
							} else if (ci == 4) { // circular end
								var tmpTxt = '\tCurve.BeginTransition();\n ';

								mainTrkArr.push([Math.round(cX),tmpTxt]);
								//Rail[Crailindex][1]++;
							}
						
							// ######### data on point start ##########

							if ($.isNumeric(tPoly.markers.getAt(ci).bdata.height) || tPoly.markers.getAt(ci).bdata.pitch!=''){
								ProcessbData5(tPoly.markers.getAt(ci).bdata, Math.round(cX),halfGauge);
							}	
				
							if (tPoly.markers.getAt(ci).note != ''){
								noteTrkArr.push([ Math.round(cX),tPoly.markers.getAt(ci).note]);
							}
				
							//kdata: {bridge:'',overbridge:'',river:'',ground:'',flyover:'',tunnel:'',pole:'',dike:'',cut:'',subway:'',form:'',roadcross:'',crack:'',beacon:''},
							if (tPoly.markers.getAt(ci).kdata.bridge != '' || tPoly.markers.getAt(ci).kdata.overbridge != '' || tPoly.markers.getAt(ci).kdata.river != '' || tPoly.markers.getAt(ci).kdata.ground != '' || tPoly.markers.getAt(ci).kdata.flyover != '' || tPoly.markers.getAt(ci).kdata.tunnel != '' || tPoly.markers.getAt(ci).kdata.pole != '' || tPoly.markers.getAt(ci).kdata.dike != '' || tPoly.markers.getAt(ci).kdata.cut != '' || tPoly.markers.getAt(ci).kdata.subway != '' || tPoly.markers.getAt(ci).kdata.form != '' || tPoly.markers.getAt(ci).kdata.roadcross != '' || tPoly.markers.getAt(ci).kdata.crack != '' || tPoly.markers.getAt(ci).kdata.beacon != ''){  			
								ProcesskData5(tPoly.markers.getAt(ci).kdata,Math.round(cX),polyL.markers.getAt(i).bdata.curve,ci,stsign,maxspeed); 
								
							}			
							// ######### data on point end ##########					
						}
					}					
				}					
			} else if (polyL.markers.getAt(i).bdata.curve != '') {
			// ************ on curve section ************
				if (i >= stIdx && i <= edIdx) {
					var cPoly = MapToolbar.features['curveTab'][polyL.markers.getAt(i).bdata.curve];			
					var tL = cPoly.Lt;
					var cL = cPoly.Lc;
					var Rc = cPoly.Rc;
					var dir = (Rc < 0)? -1 : 1;
					var cant = dir * (cPoly.cant/1000);
					var Vd = cPoly.Vd;
					var forceSL = cPoly.forceSL;

					currX -= tL;
				
					for (var ci=0; ci < cPoly.markers.getLength(); ci++) {
						if (ci != 2) {
							var cX = currX + cPoly.markers.getAt(ci).ld;
						
							if (ci == 0) {
						
								var tmpTxt = '\tLegacy.Curve(' + Rc + ',' + cant+');\n\tStructure[\'sign_m_curve\'].Put(, -2.4, 0.5, 0, 0, 0, 0, 0, 0);\n';
								structure['sign_m_curve'][1]++;
							
								if (forceSL == true) {
									tmpTxt += '\tSpeedLimit.Begin(' + Vd + ');\n';
									
									tmpTxt += speedlimitSign(Vd); //speedlimit sign
								}

								mainTrkArr.push([Math.round(cX),tmpTxt]);
								//Rail[Crailindex][1]++;
								
							} else if (ci == 1) {					
								var tmpTxt = 'Legacy.Curve(0,0);\n';
							
								if (forceSL == true) {
									tmpTxt += '\tSpeedLimit.End();\n';
									tmpTxt += '\tStructure[\'sign_spl_pole\'].Put(, -2.5, -0.2, 0, 0, 0, 0, 0, 0);\n'; //speedlimit end sign
									tmpTxt += '\tStructure[\'sign_spl_End\'].Put(, -2.5, -0.2, 0, 0, 0, 0, 0, 0);\n'; //speedlimit end sign
									structure['sign_spl_pole'][1]++;
									structure['sign_spl_End'][1]++;
								}

								mainTrkArr.push([Math.round(cX),tmpTxt]);
							
							} else {
								//
							}
						
							// ######### data on point start ##########

							if ($.isNumeric(cPoly.markers.getAt(ci).bdata.height) || cPoly.markers.getAt(ci).bdata.pitch!=''){
								ProcessbData5(cPoly.markers.getAt(ci).bdata, Math.round(cX),halfGauge);
							}	
				
							if (cPoly.markers.getAt(ci).note != ''){
								noteTrkArr.push([ Math.round(cX),cPoly.markers.getAt(ci).note]);
							}
				
							//kdata: {bridge:'',overbridge:'',river:'',ground:'',flyover:'',tunnel:'',pole:'',dike:'',cut:'',subway:'',form:'',roadcross:'',crack:'',beacon:''},
							if (cPoly.markers.getAt(ci).kdata.bridge != '' || cPoly.markers.getAt(ci).kdata.overbridge != '' || cPoly.markers.getAt(ci).kdata.river != '' || cPoly.markers.getAt(ci).kdata.ground != '' || cPoly.markers.getAt(ci).kdata.flyover != '' || cPoly.markers.getAt(ci).kdata.tunnel != '' || cPoly.markers.getAt(ci).kdata.pole != '' || cPoly.markers.getAt(ci).kdata.dike != '' || cPoly.markers.getAt(ci).kdata.cut != '' || cPoly.markers.getAt(ci).kdata.subway != '' || cPoly.markers.getAt(ci).kdata.form != '' || cPoly.markers.getAt(ci).kdata.roadcross != '' || cPoly.markers.getAt(ci).kdata.crack != '' || cPoly.markers.getAt(ci).kdata.beacon != ''){  			
								ProcesskData5(cPoly.markers.getAt(ci).kdata,Math.round(cX),polyL.markers.getAt(i).bdata.curve,ci,stsign,maxspeed);
								
							}			
							// ######### data on point end ##########					
						}
					}		
				}
			} else {
				// ************ on straight line section ************	
				if (i > 0 && i < allPoints.length-1) {
					var m0 = polyL.markers.getAt(i-1).getPosition();
					var m1 = polyL.markers.getAt(i).getPosition();
					var m2 = polyL.markers.getAt(i+1).getPosition();
					var h1 = google.maps.geometry.spherical.computeHeading(m0,m1);
					var h2 = google.maps.geometry.spherical.computeHeading(m1,m2);
					var fic = intersection_angle(h1,h2);
					var intAngleDeg = fic.angle;
					var dir = fic.direction;
					var delta = 180 - intAngleDeg;
					var ratio = dir * Math.tan(delta.toRad());
					turnTxt5(ratio,currX);
				}


				if (i >= stIdx && i <= edIdx) {
					if (i == stIdx) {
						var tmpTxt = '\tCurve.SetGauge('+gauge+');\n';
						tmpTxt += '\tIrregularity.Change(0.002009509, 0.001255943, 0.0007912442, 50, 50, 50);\n';
						
						//2do 7/12/2016 - get key pair
						
						for (a = 0; a < bverailobjArr.length; a++) {
							if (bverailobjArr[a][6].replace(/[/]/g,'\\') == defaultrailbaseX) {
								//1
								var xs1a = (bverailobjArr[a][9] != '') ? bverailobjArr[a][9].replace(/[/]/g,'\\') : '';
								var xl1a = (bverailobjArr[a][10] != '') ? bverailobjArr[a][10].replace(/[/]/g,'\\') : '';
								var xr1a = (bverailobjArr[a][11] != '') ? bverailobjArr[a][11].replace(/[/]/g,'\\') : '';
								
								//2
								var xs2a = (bverailobjArr[a][12] != '') ? bverailobjArr[a][12].replace(/[/]/g,'\\') : '';
								var xl2a = (bverailobjArr[a][13] != '') ? bverailobjArr[a][13].replace(/[/]/g,'\\') : '';
								var xr2a = (bverailobjArr[a][14] != '') ? bverailobjArr[a][14].replace(/[/]/g,'\\') : '';
								
								//3
								var xs3a = (bverailobjArr[a][15] != '') ? bverailobjArr[a][15].replace(/[/]/g,'\\') : '';
								var xl3a = (bverailobjArr[a][16] != '') ? bverailobjArr[a][16].replace(/[/]/g,'\\') : '';
								var xr3a = (bverailobjArr[a][17] != '') ? bverailobjArr[a][17].replace(/[/]/g,'\\') : '';
								
								//4
								var xs4a = (bverailobjArr[a][18] != '') ? bverailobjArr[a][18].replace(/[/]/g,'\\') : '';
								var xl4a = (bverailobjArr[a][19] != '') ? bverailobjArr[a][19].replace(/[/]/g,'\\') : '';
								var xr4a = (bverailobjArr[a][20] != '') ? bverailobjArr[a][20].replace(/[/]/g,'\\') : '';	

								for (key in structure) {
									//console.log(structure[key][0]);
									if (structure[key][0] == xs1a && xs1a !='') {
										sleeper1 = key;
										structure[key][1]++;
									}
									if (structure[key][0] == xl1a && xl1a !='') {
										rail1L = key;
										structure[key][1]++;
									}
									if (structure[key][0] == xr1a && xr1a !='') {
										rail1R = key;
										structure[key][1]++;
									}
									
									if (structure[key][0] == xs2a && xs2a !='') {
										sleeper2 = key;
										structure[key][1]++;
									}
									if (structure[key][0] == xl2a && xl2a !='') {
										rail2L = key;
										structure[key][1]++;
									}
									if (structure[key][0] == xr2a && xr2a !='') {
										rail2R = key;
										structure[key][1]++;
									}
									
									if (structure[key][0] == xs3a && xs3a !='') {
										sleeper3 = key;
										structure[key][1]++;
									}
									if (structure[key][0] == xl3a && xl3a !='') {
										rail3L = key;
										structure[key][1]++;
									}
									if (structure[key][0] == xr3a && xr3a !='') {
										rail3R = key;
										structure[key][1]++;
									}
									
									if (structure[key][0] == xs4a && xs4a !='') {
										sleeper4 = key;
										structure[key][1]++;
									}
									if (structure[key][0] == xl4a && xl4a !='') {
										rail4L = key;
										structure[key][1]++;
									}
									if (structure[key][0] == xr4a && xr4a !='') {
										rail4R = key;
										structure[key][1]++;
									}

								}								
								break;
							}
						}
						
						if ( !(sleeper1 === undefined) && !(sleeper2 === undefined) && !(sleeper3 === undefined) && !(sleeper4 === undefined) ) {
							tmpTxt += '\tRepeater[\'sleeper_0\'].Begin(, 0, 0, 0, 0, 0, 0, 3, 5, 5,\'' + defaultrailbasekey +'\', \''+ sleeper1 +'\', \''+ sleeper2 +'\', \''+ sleeper3 +'\', \''+ sleeper4 + '\');#2129\n';
						} else {
							tmpTxt += '\tRepeater[\'sleeper_0\'].Begin(, 0, 0, 0, 0, 0, 0, 3, 5, 5,\'' + defaultrailbasekey + '\');#2131\n'; //ballast@slab		
						}
						//Repeater['Ballast'].Begin(, 0, 0, 0, 0, 0, 0, 3, 5, 5, 'Ballast0', 'Ballast1', 'Ballast2', 'Ballast3', 'Ballast4');
							
						if ( rail1L !== undefined && rail2L !== undefined && rail3L !== undefined && rail4L !== undefined ) {
							tmpTxt += '\tRepeater[\'railL_0\'].Begin(, -' + halfGauge + ', 0, 0, 0, 0, 0, 3, 5, 5,\'' + defaultrailLkey + '\', \''+ rail1L +'\', \''+ rail2L +'\', \''+ rail3L +'\', \''+ rail4L + '\');#2136\n';
						} else {
							tmpTxt += '\tRepeater[\'railL_0\'].Begin(, -' + halfGauge + ', 0, 0, 0, 0, 0, 3, 5, 5,\'' + defaultrailLkey + '\');#2138\n';
						}		
						//Repeater['RailL'].Begin(, -0.5335, 0, 0, 0, 0, 0, 3, 5, 5, 'RailL0', 'RailL1', 'RailL2', 'RailL3', 'RailL4');

						if ( rail1R !== undefined && rail2R !== undefined && rail3R !== undefined && rail4R !== undefined ) {
							tmpTxt += '\tRepeater[\'railR_0\'].Begin(, ' + halfGauge + ', 0, 0, 0, 0, 0, 3, 5, 5,\'' + defaultrailRkey + '\', \''+ rail1R +'\', \''+ rail2R +'\', \''+ rail3R +'\', \''+ rail4R + '\');#2143\n';
						} else {
							tmpTxt += '\tRepeater[\'railR_0\'].Begin(, ' + halfGauge + ', 0, 0, 0, 0, 0, 3, 5, 5,\'' + defaultrailRkey + '\');#2145\n';
						}
						//Repeater['RailR'].Begin(, 0.5335, 0, 0, 0, 0, 0, 3, 5, 5, 'RailR0', 'RailR1', 'RailR2', 'RailR3', 'RailR4');
						/*
						if (defaultohwirekey !== undefined) {
							tmpTxt += '\tRepeater[\'ohwire_0\'].Begin0(, 1, '+PoleCycle+', '+PoleCycle+',\'' + defaultohwirekey + '\');\n';
							//defaultohwirekey = poleWkey;
						}
						*/
						tmpTxt += '\tAdhesion.Change (0.351, 0, 0.009496677);\n';
						tmpTxt += '\tFog.Interpolate(0.0004, 0.875, 0.9375, 1);\n';
						
						var bGkey;
						
						if (bg != '') { 
							bGkey = bg; 
							structure[bGkey][1]++;
						}
						if (typeof bGkey != 'undefined') {
							tmpTxt += '\tBackground.Change(\'' + bGkey + '\');\n';
						}
						
						var iGx,iGkey;
						//choose 1st ground
						for (b = 0; b < bvebveStrOjArr.length; b++) {
							if (bvebveStrOjArr[b][4] == 'Ground') {
								iGx = bvebveStrOjArr[b][5].replace(/[/]/g,'\\');
								break;
							}
						}
						
						for (key in structure) {
							if (structure[key][0] == iGx) {
								iGkey = key;
								structure[key][1]++;
								break;
							}
						}	

						if (typeof iGkey != 'undefined') {
							tmpTxt += '\tTrack[\'Ground\'].Position(0, '+lastheight+');\n';
							tmpTxt += '\tRepeater[\'Ground\'].Begin0(\'Ground\', 1, 25, 25,\'' + iGkey + '\');\n';
							lastground = iGkey;
						}	
						
						noteTrkArr.push([Math.round(currX),' Irregularity.Change(0.0008, 0.0005, 0.000315, 50, 50, 50); # Track.Accuracy(0) perfect accuracy (no inaccuracy at all)\n']);						
						noteTrkArr.push([Math.round(currX),' Irregularity.Change(0.001267915, 0.0007924467, 0.0004992414, 50, 50, 50); # Track.Accuracy(1) very good accuracy (high speed lines)\n']);						
						noteTrkArr.push([Math.round(currX),' Irregularity.Change(0.002009509, 0.001255943, 0.0007912442, 50, 50, 50); # Track.Accuracy(2) means good accuracy (default for conventional line)\n']);						
						noteTrkArr.push([Math.round(currX),' Irregularity.Change(0.003184857, 0.001990536, 0.001254038, 50, 50, 50); # Track.Accuracy(3) mediocre accuracy\n']);						
						noteTrkArr.push([Math.round(currX),' Irregularity.Change(0.005047659, 0.003154787, 0.001987516, 50, 50, 50); # Track.Accuracy(4) poor accuracy\n']);						
						noteTrkArr.push([Math.round(currX),' Adhesion.Change (0.35, 0, 0.01); # the train will not be able to move at all\n']);						
						noteTrkArr.push([Math.round(currX),' Adhesion.Change (0.351, 0, 0.009496677); # Track.Adhesion(135) Drying\n']);						
						noteTrkArr.push([Math.round(currX),' Adhesion.Change (0.2418, 0, 0.0137855); # Track.Adhesion(93) Wet\n']);						
						noteTrkArr.push([Math.round(currX),' Adhesion.Change (0.221, 0, 0.01508296); # Track.Adhesion(85) Frost\n']);						
						noteTrkArr.push([Math.round(currX),' Adhesion.Change (0.13, 0, 0.02564103); # Track.Adhesion(50) Snow\n']);						

						//mainTrkArr.push([Math.round(currX),';']);
						mainTrkArr.push([Math.round(currX),tmpTxt]);

				
					} else if (i == edIdx) {
						var crX = Math.round(currX/25)*25;
						mainTrkArr.push([crX,'']);
						if (kmstone) { stoneMark5(crX); }
						noteTrkArr.push([crX,'************ End of Track ************']);
				
					} else {
			
					}	
					
					// ######### data on point start ##########

					if ($.isNumeric(polyL.markers.getAt(i).bdata.height) || polyL.markers.getAt(i).bdata.railindex != '' || polyL.markers.getAt(i).bdata.pitch!=''){
						ProcessbData5(polyL.markers.getAt(i).bdata, Math.round(currX),halfGauge);
					}	
				
					if (polyL.markers.getAt(i).note != ''){
						noteTrkArr.push([ Math.round(currX),polyL.markers.getAt(i).note]);
					}
				
					//kdata: {bridge:'',overbridge:'',river:'',ground:'',flyover:'',tunnel:'',pole:'',dike:'',cut:'',subway:'',form:'',roadcross:'',crack:'',beacon:''},
					if (polyL.markers.getAt(i).kdata.bridge != '' || polyL.markers.getAt(i).kdata.overbridge != '' || polyL.markers.getAt(i).kdata.river != '' || polyL.markers.getAt(i).kdata.ground != '' || polyL.markers.getAt(i).kdata.flyover != '' || polyL.markers.getAt(i).kdata.tunnel != '' || polyL.markers.getAt(i).kdata.pole != '' || polyL.markers.getAt(i).kdata.dike != '' || polyL.markers.getAt(i).kdata.cut != '' || polyL.markers.getAt(i).kdata.subway != '' || polyL.markers.getAt(i).kdata.form != '' || polyL.markers.getAt(i).kdata.roadcross != '' || polyL.markers.getAt(i).kdata.crack != '' || polyL.markers.getAt(i).kdata.beacon != ''){ 		
						ProcesskData5(polyL.markers.getAt(i).kdata,Math.round(currX),pid,i,stsign,maxspeed); 
						
					}			
					// ######### data on point end ##########
					
					
				}
			
			}
			
		//}
		//catch(err) {
		//	teks += "[Error] : error in creating track at distance " + Math.round(currX) + "\n" + err.message + ". \n";
		//}		
 	    
		persen = Math.round(((i+1)/allPoints.length)*100);
		$( "#progressbarBuildBVE4O" ).progressbar({
			value: persen
		});
  	
	} 


	var tmpTrkStrArr = [];
	//array sorting by first key
	for (m = 0; m < mainTrkArr.length; m++) {
		try {
			if (tmpTrkStrArr.length == 0) {
				tmpTrkStrArr.push(mainTrkArr[m]);
			} else {
				if (parseInt(mainTrkArr[m][0]) > parseInt(tmpTrkStrArr[tmpTrkStrArr.length-1][0])) {
					tmpTrkStrArr.push(mainTrkArr[m]);
				} else {
					var inArr = false;
					for (t=0; t < tmpTrkStrArr.length; t++) {
						if (parseInt(mainTrkArr[m][0]) == parseInt(tmpTrkStrArr[t][0])) {
							//.Rail .RailEnd / .Pole .PoleEnd / .Dike  .DikeEnd / .Wall .WallEnd
							/*
							if (((mainTrkArr[m][1].indexOf('.RailEnd') > -1) && (tmpTrkStrArr[t][1].indexOf('.Rail') > -1)) || ((mainTrkArr[m][1].indexOf('.PoleEnd') > -1) && (tmpTrkStrArr[t][1].indexOf('.Pole') > -1)) || ((mainTrkArr[m][1].indexOf('.DikeEnd') > -1) && (tmpTrkStrArr[t][1].indexOf('.Dike') > -1)) || ((mainTrkArr[m][1].indexOf('.WallEnd') > -1) && (tmpTrkStrArr[t][1].indexOf('.Wall') > -1))) {
								tmpTrkStrArr[t][1] = mainTrkArr[m][1] + ';\n' + tmpTrkStrArr[t][1];							
							} else {
								tmpTrkStrArr[t][1] += mainTrkArr[m][1];
							} */	
							tmpTrkStrArr[t][1] += mainTrkArr[m][1];
							inArr = true;
							break;
						}					
					}
					if (!inArr) {
						for (t=1; t < tmpTrkStrArr.length; t++) {
							if ((parseInt(mainTrkArr[m][0]) > parseInt(tmpTrkStrArr[t-1][0])) && (parseInt(mainTrkArr[m][0]) < parseInt(tmpTrkStrArr[t][0]))) {
								tmpTrkStrArr.splice(t-1,0,mainTrkArr[m]);
								break;
							} else if (parseInt(mainTrkArr[m][0]) < parseInt(tmpTrkStrArr[t-1][0])) {
								if (t == 1) {
									tmpTrkStrArr.unshift(mainTrkArr[m]);
									break;
								} else {
									tmpTrkStrArr.splice(t-2,0,mainTrkArr[m]);
									break;
								}							
							}
						}
					}
				}
			}
			
		}
		catch(err) {
			teks += "[Error] : error updating main track item." + "\n" + err.message + ". \n";
		}	
		persen = Math.round((m/mainTrkArr.length-1)*100);
		$( "#progressbarBuildBVE4O" ).progressbar({
		  value: persen
		});
	}
	
	for (s = 0; s < subTrkArr.length; s++) {
		try {
			if (parseInt(subTrkArr[s][0]) > parseInt(tmpTrkStrArr[tmpTrkStrArr.length-1][0])) {
				tmpTrkStrArr.push(subTrkArr[s]);
			} else {
				var inArr = false;
				for (t=0; t < tmpTrkStrArr.length; t++) {
					if (parseInt(subTrkArr[s][0]) == parseInt(tmpTrkStrArr[t][0])) {
						//.Rail .RailEnd / .Pole .PoleEnd / .Dike  .DikeEnd / .Wall .WallEnd
						/*
						if (((subTrkArr[s][1].indexOf('.RailEnd') > -1) && (tmpTrkStrArr[t][1].indexOf('.Rail') > -1)) || ((subTrkArr[s][1].indexOf('.PoleEnd') > -1) && (tmpTrkStrArr[t][1].indexOf('.Pole') > -1)) || ((subTrkArr[s][1].indexOf('.DikeEnd') > -1) && (tmpTrkStrArr[t][1].indexOf('.Dike') > -1)) || ((subTrkArr[s][1].indexOf('.WallEnd') > -1) && (tmpTrkStrArr[t][1].indexOf('.Wall') > -1))) {
							tmpTrkStrArr[t][1] = subTrkArr[s][1] + ';\n' + tmpTrkStrArr[t][1];							
						} else {
							tmpTrkStrArr[t][1] += subTrkArr[s][1];
						} */
						tmpTrkStrArr[t][1] += subTrkArr[s][1];
						inArr = true;
						break;
					}					
				}
				if (!inArr) {
					for (t=1; t < tmpTrkStrArr.length; t++) {
						if ((parseInt(subTrkArr[s][0]) > parseInt(tmpTrkStrArr[t-1][0])) && (parseInt(subTrkArr[s][0]) < parseInt(tmpTrkStrArr[t][0]))) {
							tmpTrkStrArr.splice(t-1,0,subTrkArr[s]);
							break;
						} else if (parseInt(subTrkArr[s][0]) < parseInt(tmpTrkStrArr[t-1][0])) {
							if (t == 1) {
								tmpTrkStrArr.unshift(subTrkArr[s]);
								break;
							} else {
								tmpTrkStrArr.splice(t-2,0,subTrkArr[s]);
								break;
							}							
						}
					}
				}
			}			
		}
		catch(err) {
			teks += "[Error] : error in pre sorting main track." + "\n" + err.message + ". \n";
		}	

		persen = Math.round((s/subTrkArr.length-1)*100);
		$( "#progressbarBuildBVE4O" ).progressbar({
		  value: persen
		});
	}

	try {
		for (n = 0; n < noteTrkArr.length; n++) {
			if (parseInt(noteTrkArr[n][0]) > parseInt(tmpTrkStrArr[tmpTrkStrArr.length-1][0])) {
				tmpTrkStrArr.push([noteTrkArr[n][0], '\t# ' + noteTrkArr[n][1]]);
			} else {
				var inArr = false;
				for (t=0; t < tmpTrkStrArr.length; t++) {
					if (parseInt(noteTrkArr[n][0]) == parseInt(tmpTrkStrArr[t][0])) {
						tmpTrkStrArr[t][1] += '\t# ' + noteTrkArr[n][1];
						inArr = true;
						break;
					}					
				}
				if (!inArr) {
					for (t=1; t < tmpTrkStrArr.length; t++) {
						if ((parseInt(noteTrkArr[n][0]) > parseInt(tmpTrkStrArr[t-1][0])) && (parseInt(noteTrkArr[n][0]) < parseInt(tmpTrkStrArr[t][0]))) {
							tmpTrkStrArr.splice(t-1,0,[noteTrkArr[n][0], '\t# ' + noteTrkArr[n][1]]);
							break;
						} else if (parseInt(noteTrkArr[n][0]) < parseInt(tmpTrkStrArr[t-1][0])) {
							if (t == 1) {
								tmpTrkStrArr.unshift([noteTrkArr[n][0], '\t# ' + noteTrkArr[n][1]]);
								break;
							} else {
								tmpTrkStrArr.splice(t-2,0,[noteTrkArr[n][0], '\t# ' + noteTrkArr[n][1]]);
								break;
							}							
						}
					}
				}
			}
			persen = Math.round((s/subTrkArr.length-1)*100);
			$( "#progressbarBuildBVE4O" ).progressbar({
			  value: persen
			});
		}
		
	}
	catch(err) {
		teks += "[Error] : error in inserting note to distance." + "\n" + err.message + ". \n";
	}	
	
	//final sort if above failed
	var sorted;
	try {
		do {
			sorted = 0;
			for (d = 1; d < tmpTrkStrArr.length; d++) {
				if (parseInt(tmpTrkStrArr[d][0]) < parseInt(tmpTrkStrArr[d-1][0])) {
					var tar0 = tmpTrkStrArr[d];
					tmpTrkStrArr.splice(d,1);
					tmpTrkStrArr.splice(d-1,0,tar0);
				} else {
					sorted++;
				}
			}
			persen = Math.round((sorted/tmpTrkStrArr.length-1)*100);
			$( "#progressbarBuildBVE4O" ).progressbar({
			  value: persen
			});
		} while (sorted < tmpTrkStrArr.length -1);		
	}
	catch(err) {
		teks += "[Error] : error in sorting track section." + "\n" + err.message + ". \n";
	}	

							
	var maptxt = '';
	
	if (tmpTrkStrArr.length > 0) {
		for (t = 0; t < tmpTrkStrArr.length; t++){
			maptxt += tmpTrkStrArr[t][0] + ';\n' + tmpTrkStrArr[t][1] + '\n';
			persen = Math.round((t/tmpTrkStrArr.length-1)*100);
			$( "#progressbarBuildBVE4O" ).progressbar({
			value: persen
			});
		}
	} 

	teks += '<map>\n';
	teks += 'BveTs Map 2.02:utf-8\n\n';
	teks += 'Structure.Load(\'structures\\structures.txt\');\n';

	teks += 'Signal.Load(\'Signals.txt\');\n';
	teks += 'Signal.SpeedLimit(0, 25, 40, 70, 100, );\n';

	teks += 'Sound.Load(\'sounds.txt\');\n';

	teks += 'Sound3D.Load(\'sounds3d.txt\');\n';

	teks += 'Station.Load(\'stations.txt\');\n';
	
	teks += '#Gauge.Set(' + gauge + ');\n\n\n';
	
	teks += maptxt;
	teks += '</map>\n';
	

	var strtxt = '';
	for (key in structure) {
		if (structure[key] != '') {
			if (structure[key][1] > 0) {
				strtxt += key + ',' + structure[key][0] + '\n';
			}
		}
	}

	var s3dtxt = '';
	for (key in sound3d) {
		if (sound3d[key] != '') {
			if (sound3d[key][1] > 0) {
				s3dtxt += key + ',' + sound3d[key][0] + ',5\n';
			}
		}
	}

	var sndtxt = '';
	for (key in sound) {
		if (sound[key] != '') {
			if (sound[key][1] > 0) {
				sndtxt += key + ',' + sound[key][0] + '\n';
			}
		}
	}

	var statxt = '';
	for (key in station) {
		if (station[key] != '') {
			if (station[key][1] > 0) {
				statxt += key + ',' + station[key][0] + '\n';
			}
		}
	}

	var sgntxt = '';
	for (key in signal) {
		if (signal[key] != '') {
			if (signal[key][1] > 0) {
				sgntxt += key + ',' + signal[key][0] + '\n';
			}
		}
	}

	teks += '<structure>\n';
	teks += 'BveTs Structure List 2.00:UTF-8\n';
	teks += strtxt;
	teks += '</structure>\n';
	
	teks += '<sound3d>\n';
	teks += 'BveTs Sound List 2.00:UTF-8\n';
	teks += s3dtxt;
	teks += '</sound3d>\n';
	
	teks += '<sound>\n';
	teks += 'BveTs Sound List 2.00:UTF-8\n';
	teks += sndtxt;
	teks += '</sound>\n';
	
	teks += '<station>\n';
	teks += 'BveTs Station List 2.00:UTF-8\n';
	teks += statxt;
	teks += '</station>\n';
	
	teks += '<signal>\n';
	teks += 'BveTs Signal Aspects List 2.00:UTF-8\n';
	teks += sgntxt;
	teks += '</signal>\n';
	
	

	teks += '</bve>\n';
	
	$('#fileext').text('.xml');
	$('#buildBVE').val(teks);
}


function ProcessbData5(bdata,currX,halfGauge) {
//bdata: {height:'',railindex:'',pitch:'',curve:''},	
	if ($.isNumeric(bdata.height)) {
		
		lastheight = (-1*bdata.height);

		subTrkArr.push([ currX, '\tTrack[\'Ground\'].Position(0, ' + lastheight + ');\n']);
		//subTrkArr.push([ currX, '\tRepeater[\'Ground\'].Begin0(\'Ground\', 1, 25, 25,\'' + iGkey + '\');\n']);			
		
	} 
	
	if (bdata.pitch!='') {
		var pArr = bdata.pitch.split('¤');
		
		var rpit = parseFloat(pArr[0]);
		if (isNaN(rpit)) { alert(bdata.pitch);}

		var t = (pArr[2] != '')? parseFloat(pArr[2]) : 0;
		var Lvc = (pArr[3] != '')? parseFloat(pArr[3]) : 0;

		var tmpTxt = '';
				
		if (pitchRatio == 0)  { 
			if (rpit < pitchRatio)  { 
				tmpTxt += '\tStructure[\'sign_sloop_down-level\'].Put(, -2, -0.3, 0, 0, 0, 0, 0, 0);\n'; 	//menurun opp. level 
				structure['sign_sloop_down-level'][1]++;
			} else if (rpit > pitchRatio) { 
				tmpTxt += '\tStructure[\'sign_sloop_up-level\'].Put(, -2, -0.3, 0, 0, 0, 0, 0, 0);\n';	//mendaki opp. level
				structure['sign_sloop_up-level'][1]++;
			} else {
				// line level ... (^x^)
			}
		} else if (pitchRatio > 0)  {
			if (rpit == 0) {
				tmpTxt += '\tStructure[\'sign_sloop_level-up\'].Put(, -2, -0.3, 0, 0, 0, 0, 0, 0);\n'; 	//level opp. mendaki
				structure['sign_sloop_level-up'][1]++;
			} else if (rpit > 0) {
				//tmpTxt += '\tStructure[\'sign_sloop_up-up\'].Put(, -2, -0.3, 0, 0, 0, 0, 0, 0);\n';		//mendaki-mendaki, lain ratio
				//structure['sign_sloop_up-up'][1]++;
				tmpTxt += '\tStructure[\'sign_sloop_up-down\'].Put(, -2, -0.3, 0, 0, 0, 0, 0, 0);\n';		//mendaki opp. menurun
				structure['sign_sloop_up-down'][1]++;
			} else {
				tmpTxt += '\tStructure[\'sign_sloop_down-up\'].Put(, -2, -0.3, 0, 0, 0, 0, 0, 0);\n';    //menurun opp. mendaki	
				structure['sign_sloop_down-up'][1]++;
			}
		} else {
			if (rpit == 0) { 
				tmpTxt += '\tStructure[\'sign_sloop_level-down\'].Put(, -2, -0.3, 0, 0, 0, 0, 0, 0);\n';	//level opp. menurun
				structure['sign_sloop_level-down'][1]++;
			} else if (rpit < 0) {
				//tmpTxt += '\tStructure[\'sign_sloop_down-down\'].Put(, -2, -0.3, 0, 0, 0, 0, 0, 0);\n';		//menurun-menurun, lain ratio
				//structure['sign_sloop_down-down'][1]++;
				tmpTxt += '\tStructure[\'sign_sloop_down-up\'].Put(, -2, -0.3, 0, 0, 0, 0, 0, 0);\n';    //menurun opp. mendaki	
				structure['sign_sloop_down-up'][1]++;				
			} else {
				tmpTxt += '\tStructure[\'sign_sloop_up-down\'].Put(, -2, -0.3, 0, 0, 0, 0, 0, 0);\n';		//mendaki opp. menurun
				structure['sign_sloop_up-down'][1]++;
			}
		}	
		
		pitchRatio = rpit; 
		
		if (t != 0 && Lvc !=0) {
			if (currX > 0) {
				subTrkArr.push([Math.round(currX-t),'\tGradient.BeginTransition();\n']);			
				subTrkArr.push([Math.round(currX-t+Lvc), tmpTxt]);
				if (rpit !=0) {
					subTrkArr.push([Math.round(currX-t+Lvc),'\tGradient.Begin(' + rpit + ');\n']);	
				} else {
					subTrkArr.push([Math.round(currX-t+Lvc),'\tGradient.End();\n']);	
				}				
			} else {
				if (rpit !=0) {
					subTrkArr.push([Math.round(currX),'\tLegacy.Pitch(' + rpit + ');\n']);	
				}
			}

			
		} else {
			tmpTxt = '\tLegacy.Pitch(' + rpit + ');\n';
			subTrkArr.push([currX, tmpTxt]);
		}		

		
		
	}

	if (typeof bdata.railindex != 'undefined') {
		if (bdata.railindex !== '') {
			var sleeper0c,sleeper1c,sleeper2c,sleeper3c,sleeper4c;
			var rail0Lc,rail1Lc,rail2Lc,rail3Lc,rail4Lc;
			var rail0Rc,rail1Rc,rail2Rc,rail3Rc,rail4Rc;
						
			for (i2556 = 0; i2556 < bverailobjArr.length; i2556++) {
				if (bverailobjArr[i2556][1] == bdata.railindex) {
					//#0
					var xs0a = (bverailobjArr[i2556][6] != '') ? bverailobjArr[i2556][6].replace(/[/]/g,'\\') : '';
					var xl0a = (bverailobjArr[i2556][7] != '') ? bverailobjArr[i2556][7].replace(/[/]/g,'\\') : '';
					var xr0a = (bverailobjArr[i2556][8] != '') ? bverailobjArr[i2556][8].replace(/[/]/g,'\\') : '';
					
					//#1
					var xs1a = (bverailobjArr[i2556][9] != '') ? bverailobjArr[i2556][9].replace(/[/]/g,'\\') : '';
					var xl1a = (bverailobjArr[i2556][10] != '') ? bverailobjArr[i2556][10].replace(/[/]/g,'\\') : '';
					var xr1a = (bverailobjArr[i2556][11] != '') ? bverailobjArr[i2556][11].replace(/[/]/g,'\\') : '';
					
					//#2
					var xs2a = (bverailobjArr[i2556][12] != '') ? bverailobjArr[i2556][12].replace(/[/]/g,'\\') : '';
					var xl2a = (bverailobjArr[i2556][13] != '') ? bverailobjArr[i2556][13].replace(/[/]/g,'\\') : '';
					var xr2a = (bverailobjArr[i2556][14] != '') ? bverailobjArr[i2556][14].replace(/[/]/g,'\\') : '';
					
					//#3
					var xs3a = (bverailobjArr[i2556][15] != '') ? bverailobjArr[i2556][15].replace(/[/]/g,'\\') : '';
					var xl3a = (bverailobjArr[i2556][16] != '') ? bverailobjArr[i2556][16].replace(/[/]/g,'\\') : '';
					var xr3a = (bverailobjArr[i2556][17] != '') ? bverailobjArr[i2556][17].replace(/[/]/g,'\\') : '';
					
					//#4
					var xs4a = (bverailobjArr[i2556][18] != '') ? bverailobjArr[i2556][18].replace(/[/]/g,'\\') : '';
					var xl4a = (bverailobjArr[i2556][19] != '') ? bverailobjArr[i2556][19].replace(/[/]/g,'\\') : '';
					var xr4a = (bverailobjArr[i2556][20] != '') ? bverailobjArr[i2556][20].replace(/[/]/g,'\\') : '';	

					for (key in structure) {
						//console.log(structure[key][0]);
						if (structure[key][0] == xs0a && xs0a !='') {
							sleeper0c = key;
							structure[key][1]++;
						}
						if (structure[key][0] == xl0a && xl0a !='') {
							rail0Lc = key;
							structure[key][1]++;
						}
						if (structure[key][0] == xr0a && xr0a !='') {
							rail0Rc = key;
							structure[key][1]++;
						}
						
						if (structure[key][0] == xs1a && xs1a !='') {
							sleeper1c = key;
							structure[key][1]++;
						}
						if (structure[key][0] == xl1a && xl1a !='') {
							rail1Lc = key;
							structure[key][1]++;
						}
						if (structure[key][0] == xr1a && xr1a !='') {
							rail1Rc = key;
							structure[key][1]++;
						}
						
						if (structure[key][0] == xs2a && xs2a !='') {
							sleeper2c = key;
							structure[key][1]++;
						}
						if (structure[key][0] == xl2a && xl2a !='') {
							rail2Lc = key;
							structure[key][1]++;
						}
						if (structure[key][0] == xr2a && xr2a !='') {
							rail2Rc = key;
							structure[key][1]++;
						}
						
						if (structure[key][0] == xs3a && xs3a !='') {
							sleeper3c = key;
							structure[key][1]++;
						}
						if (structure[key][0] == xl3a && xl3a !='') {
							rail3Lc = key;
							structure[key][1]++;
						}
						if (structure[key][0] == xr3a && xr3a !='') {
							rail3Rc = key;
							structure[key][1]++;
						}
						
						if (structure[key][0] == xs4a && xs4a !='') {
							sleeper4c = key;
							structure[key][1]++;
						}
						if (structure[key][0] == xl4a && xl4a !='') {
							rail4Lc = key;
							structure[key][1]++;
						}
						if (structure[key][0] == xr4a && xr4a !='') {
							rail4Rc = key;
							structure[key][1]++;
						}

					}								
					break;
				}
			}

			var tmpTxt = '';
			
			if ( sleeper1c === undefined && sleeper2c === undefined && sleeper3c === undefined && sleeper4c === undefined ) {
				tmpTxt += '\tRepeater[\'sleeper_0\'].Begin(, 0, 0, 0, 0, 0, 0, 3, 5, 5,\'' + sleeper0c + '\');\n';
			} else {
				tmpTxt += '\tRepeater[\'sleeper_0\'].Begin(, 0, 0, 0, 0, 0, 0, 3, 5, 5,\'' + sleeper0c + '\',\'' + sleeper1c + '\',\'' + sleeper2c + '\',\'' + sleeper3c + '\',\'' + sleeper4c + '\');\n';
			}

			if (rail0Lc != defaultrailLkey) {
				if ( rail1Lc === undefined && rail2Lc === undefined && rail3Lc === undefined && rail4Lc === undefined ) {	
					tmpTxt += '\tRepeater[\'railL_0\'].Begin(, -' + halfGauge + ', 0, 0, 0, 0, 0, 3, 5, 5,\'' + rail0Lc + '\');\n';
				} else {
					tmpTxt += '\tRepeater[\'railL_0\'].Begin(, -' + halfGauge + ', 0, 0, 0, 0, 0, 3, 5, 5,\'' + rail0Lc + '\',\'' + rail1Lc + '\',\'' + rail2Lc + '\',\'' + rail3Lc + '\',\'' + rail4Lc + '\');\n';
				}		
			}
			
			if (rail0Rc != defaultrailRkey) {
				if ( rail1Rc === undefined && rail2Rc === undefined && rail3Rc === undefined && rail4Rc === undefined ) {
					tmpTxt += '\tRepeater[\'railR_0\'].Begin(, '+ halfGauge + ', 0, 0, 0, 0, 0, 3, 5, 5,\'' + rail0Rc + '\');\n';
				} else {
					tmpTxt += '\tRepeater[\'railR_0\'].Begin(, '+ halfGauge + ', 0, 0, 0, 0, 0, 3, 5, 5,\'' + rail0Rc + '\',\'' + rail1Rc + '\',\'' + rail2Rc + '\',\'' + rail3Rc + '\',\'' + rail4Rc + '\');\n';
				}				
			}

			for (p = 0; p < paralellTrack.length; p++) {
				//tmpTxt += '\tRepeater[\'railL_' + paralellTrack[p][0] + '\'].Begin0(' + paralellTrack[p][0] + ', 3, 5, 5,\''+railLkey+'\');\n';
				//tmpTxt += '\tRepeater[\'railR_' + paralellTrack[p][0] + '\'].Begin0(' + paralellTrack[p][0] + ', 3, 5, 5,\''+railRkey+'\');\n';
				//tmpTxt += '\tRepeater[\'sleeper_' + paralellTrack[p][0] + '\'].Begin0(' + paralellTrack[p][0] + ', 3, 5, 5,\''+railbasekey+'\');\n';
				
				if ( sleeper1c === undefined && sleeper2c === undefined && sleeper3c === undefined && sleeper4c === undefined ) {
					tmpTxt += '\tRepeater[\'sleeper_' + paralellTrack[p][0] + '\'].Begin(\'' + paralellTrack[p][0] + '\', 0, 0, 0, 0, 0, 0, 3, 5, 5,\'' + sleeper0c  + '\');\n';
				} else {
					tmpTxt += '\tRepeater[\'sleeper_' + paralellTrack[p][0] + '\'].Begin(\'' + paralellTrack[p][0] + '\', 0, 0, 0, 0, 0, 0, 3, 5, 5,\'' + sleeper0c + '\',\'' + sleeper1c + '\',\'' + sleeper2c + '\',\'' + sleeper3c + '\',\'' + sleeper4c + '\');\n';
				}

				if (rail0Lc != defaultrailLkey) {
					if ( rail1Lc === undefined && rail2Lc === undefined && rail3Lc === undefined && rail4Lc === undefined ) {	
						tmpTxt += '\tRepeater[\'railL_' + paralellTrack[p][0] + '\'].Begin(\'' + paralellTrack[p][0] + '\', -' + halfGauge + ', 0, 0, 0, 0, 0, 3, 5, 5,\'' + rail0Lc + '\');\n';
					} else {
						tmpTxt += '\tRepeater[\'railL_' + paralellTrack[p][0] + '\'].Begin(\'' + paralellTrack[p][0] + '\', -' + halfGauge + ', 0, 0, 0, 0, 0, 3, 5, 5,\'' + rail0Lc + '\',\'' + rail1Lc + '\',\'' + rail2Lc + '\',\'' + rail3Lc + '\',\'' + rail4Lc + '\');\n';
					}		
				}
				
				if (rail0Rc != defaultrailRkey) {
					if ( rail1Rc === undefined && rail2Rc === undefined && rail3Rc === undefined && rail4Rc === undefined ) {
						tmpTxt += '\tRepeater[\'railR_' + paralellTrack[p][0] + '\'].Begin(\'' + paralellTrack[p][0] + '\', '+ halfGauge + ', 0, 0, 0, 0, 0, 3, 5, 5,\'' + rail0Rc + '\');\n';
					} else {
						tmpTxt += '\tRepeater[\'railR_' + paralellTrack[p][0] + '\'].Begin(\'' + paralellTrack[p][0] + '\', '+ halfGauge + ', 0, 0, 0, 0, 0, 3, 5, 5,\'' + rail0Rc + '\',\'' + rail1Rc + '\',\'' + rail2Rc + '\',\'' + rail3Rc + '\',\'' + rail4Rc + '\');\n';
					}
				}

			}
	
			subTrkArr.push([ currX, tmpTxt]);
				
		}	
	}
	
}

function ProcesskData5(kdata,currX,pid,idx,stsign,maxspeed) {
//kdata: {bridge:'',overbridge:'',river:'',ground:'',flyover:'',tunnel:'',pole:'',dike:'',cut:'',subway:'',form:'',roadcross:'',crack:'',beacon:''},
	var crX = Math.round(currX/5)*5;

	if ( kdata.bridge != '' ) {
		noteTrkArr.push([ crX,'bridge']);
		var arrK = kdata.bridge.split('¤');
		for (k = 0; k < arrK.length; k++) {
			var arrK_1 = arrK[k].split(':');
			if (arrK_1[1] == '0') {
				for (g = 0; g < bvebridgeObjArr.length; g++) {
					if (bvebridgeObjArr[g][1] == arrK_1[0]) {
					
						var bridgeLkey,bridgeRkey,bridgePkey;
						
						var bridgeLx = bvebridgeObjArr[g][4].replace(/[/]/g,'\\');
						var bridgeRx = bvebridgeObjArr[g][5].replace(/[/]/g,'\\');
						var bridgePX = bvebridgeObjArr[g][6].replace(/[/]/g,'\\');
						var pRpt = (parseInt(bvebridgeObjArr[g][7]) > 0)? parseInt(bvebridgeObjArr[g][7]) : 50;			
						var bLen = (parseInt(bvebridgeObjArr[g][8]) > 0)? parseInt(bvebridgeObjArr[g][8]) : 25;
						
						for (key in structure) {
							if (structure[key][0] == bridgeLx) {
								bridgeLkey = key;
								structure[key][1]++;
							}
							if (structure[key][0] == bridgeRx) {
								bridgeRkey = key;
								structure[key][1]++;
							}
							if (structure[key][0] == bridgePX) {
								bridgePkey = key;
								structure[key][1]++;
							}
						}
						
						var tmpTxt = '';

						//algoritma utk wall type
						if (paralellTrack.length == 0) {
							
							if (typeof bridgeLkey != 'undefined') {
								tmpTxt += '\tRepeater[\''+bridgeLkey+'\'].Begin0(, 1, '+bLen+', '+bLen+',\''+bridgeLkey+'\');\n';
																
							}
							if (typeof bridgeRkey != 'undefined') {
								tmpTxt += '\tRepeater[\''+bridgeRkey+'\'].Begin0(, 1, '+bLen+', '+bLen+',\''+bridgeRkey+'\');\n';
								
							}
							
						} else {
							//parallel track, cek trek terkanan atau terkiri
							var leftestIndex = 0; var rightestIndex = 0;
							var leftestX = 0; var rightestX = 0;
							for (pTi = 0; pTi < paralellTrack.length; pTi++) {
								if (paralellTrack[pTi][1] <= leftestX) {
									leftestX = paralellTrack[pTi][1];
									leftestIndex = paralellTrack[pTi][0];
								}
								if (paralellTrack[pTi][1] >= rightestX) {
									rightestX = paralellTrack[pTi][1];
									rightestIndex = paralellTrack[pTi][0];
								}
							}
					
							if (typeof bridgeLkey != 'undefined') {
								tmpTxt += '\tRepeater[\''+bridgeLkey+'\'].Begin0(' + leftestIndex + ', 1, '+bLen+', '+bLen+',\''+bridgeLkey+'\');\n';
																
							}
							if (typeof bridgeRkey != 'undefined') {
								tmpTxt += '\tRepeater[\''+bridgeRkey+'\'].Begin0(' + rightestIndex + ', 1, '+bLen+', '+bLen+',\''+bridgeRkey+'\');\n';
								
							}								
						}
						
						if (typeof bridgePkey != 'undefined') {
							tmpTxt += '\tRepeater[\''+bridgePkey+'\'].Begin0(, 0, 0, '+pRpt+',\''+bridgePkey+'\');\n';
							
						}	

						tmpTxt += '\tRollingNoise.Change(2);\n';

						subTrkArr.push([crX, tmpTxt]);
						
						break;	
					
					}
				}
  			} else {
				for (g = 0; g < bvebridgeObjArr.length; g++) {
					if (bvebridgeObjArr[g][1] == arrK_1[0]) {
					
						var bridgeLkey,bridgeRkey,bridgePkey;
						
						var bridgeLx = bvebridgeObjArr[g][4].replace(/[/]/g,'\\');
						var bridgeRx = bvebridgeObjArr[g][5].replace(/[/]/g,'\\');
						var bridgePX = bvebridgeObjArr[g][6].replace(/[/]/g,'\\');
						var pRpt = parseInt(bvebridgeObjArr[g][7]);			
						var bLen = parseInt(bvebridgeObjArr[g][8]);
						
						for (key in structure) {
							if (structure[key][0] == bridgeLx) {
								bridgeLkey = key;
								structure[key][1]++;
							}
							if (structure[key][0] == bridgeRx) {
								bridgeRkey = key;
								structure[key][1]++;
							}
							if (structure[key][0] == bridgePX) {
								bridgePkey = key;
								structure[key][1]++;
							}
						}

						var tmpTxt = '';
						
						if (typeof bridgeLkey != 'undefined') {
							tmpTxt += '\tRepeater[\''+bridgeLkey+'\'].End();\n';
															
						}
						if (typeof bridgeRkey != 'undefined') {
							tmpTxt += '\tRepeater[\''+bridgeRkey+'\'].End();\n';
							
						}						
						if (typeof bridgePkey != 'undefined') {
							tmpTxt += '\tRepeater[\''+bridgePkey+'\'].End();\n';
							
						}
						
						tmpTxt += '\tRollingNoise.Change(0);\n';
						
						subTrkArr.push([crX, tmpTxt]);
						
						break;						
					}
				}
			}
		}			
	}
	
	if (kdata.overbridge != '') {
		var obname = kdata.overbridge.split('¤');
		noteTrkArr.push([ currX,'overbridge']);
		
		subTrkArr.push([currX, '\tStructure[\'' + obname[0] + '\'].Put(,'+ obname[1]+','+obname[2]+', 0, '+obname[3]+', 0, 0, 0, 0);\n']);	
		structure[obname[0]][1]++;			
		subTrkArr.push([ currX-1, '\tCabIlluminance.Interpolate(1);\n']);		
		subTrkArr.push([ currX, '\tCabIlluminance.Interpolate(0.875);\n']);		
		subTrkArr.push([ currX+12, '\tCabIlluminance.Interpolate(0.875);\n']);		
		subTrkArr.push([ currX+13, '\tCabIlluminance.Interpolate(1);\n']);		
		
	}
	
	if (kdata.ground != '') {		
		for (g1 = 0; g1 < bvebveStrOjArr.length; g1++) {
  			if (bvebveStrOjArr[g1][1] == kdata.ground) {
				var iGx,iGkey;
				iGx = bvebveStrOjArr[g1][5].replace(/[/]/g,'\\');
				var xGrn = parseInt(bvebveStrOjArr[g1][8]);
				
				for (key in structure) {
					if (structure[key][0] == iGx) {
						iGkey = key;
						structure[key][1]++;
						break;
					}
				}	

				if (typeof iGkey != 'undefined') {
					//subTrkArr.push([ crX, '\tTrack[\'Ground\'].Position(0,  ' + lastheight + ');\n']);
					subTrkArr.push([ crX, '\tRepeater[\'Ground\'].Begin0(\'Ground\', 1, ' + xGrn + ', ' + xGrn + ',\'' + iGkey + '\');\n']);
					lastground = iGkey;
				}			
			
  			}
		}
	}
	
	if (kdata.flyover != '') {
		var arrK = kdata.flyover.split('¤');
		noteTrkArr.push([ crX,'flyover']);
		
		for (k = 0; k < arrK.length; k++) {
			var arrK_1 = arrK[k].split(':');
			if (arrK_1[1] == '0') {
				for (g = 0; g < bveFOObjArr.length; g++) {
					if (bveFOObjArr[g][1] == arrK_1[0]) {
					
						var FoLkey,FoRkey,FoPkey;
						
						var FoLx = bveFOObjArr[g][4].replace(/[/]/g,'\\');
						var FoRx = bveFOObjArr[g][5].replace(/[/]/g,'\\');
						var FoPX = bveFOObjArr[g][7].replace(/[/]/g,'\\');
						var pRpt = parseInt(bveFOObjArr[g][6]);			
						var bLen = parseInt(bveFOObjArr[g][8]);
						
						for (key in structure) {
							if (structure[key][0] == FoLx) {
								FoLkey = key;
								structure[key][1]++;
							}
							if (structure[key][0] == FoRx) {
								FoRkey = key;
								structure[key][1]++;
							}
							if (structure[key][0] == FoPX) {
								FoPkey = key;
								structure[key][1]++;
							}
						}
						
						var tmpTxt = '';
						
						if (paralellTrack.length == 0) {
							
							if (typeof FoLkey != 'undefined') {
								tmpTxt += '\tRepeater[\''+FoLkey+'\'].Begin0(, 1, '+bLen+', '+bLen+',\''+FoLkey+'\');\n';
																
							}
							if (typeof FoRkey != 'undefined') {
								tmpTxt += '\tRepeater[\''+FoRkey+'\'].Begin0(, 1, '+bLen+', '+bLen+',\''+FoRkey+'\');\n';
								
							}
							
						} else {
							//parallel track, cek trek terkanan atau terkiri
							var leftestIndex = 0; var rightestIndex = 0;
							var leftestX = 0; var rightestX = 0;
							for (pTi = 0; pTi < paralellTrack.length; pTi++) {
								if (paralellTrack[pTi][1] <= leftestX) {
									leftestX = paralellTrack[pTi][1];
									leftestIndex = paralellTrack[pTi][0];
								}
								if (paralellTrack[pTi][1] >= rightestX) {
									rightestX = paralellTrack[pTi][1];
									rightestIndex = paralellTrack[pTi][0];
								}
							}
					
							if (typeof FoLkey != 'undefined') {								
								if (leftestIndex == 0) {
									tmpTxt += '\tRepeater[\''+FoLkey+'\'].Begin0(, 1, '+bLen+', '+bLen+',\''+FoLkey+'\');\n';
								} else {
									tmpTxt += '\tRepeater[\''+FoLkey+'\'].Begin0(\'' + leftestIndex + '\', 1, '+bLen+', '+bLen+',\''+FoLkey+'\');\n';
								}
							}
							if (typeof FoRkey != 'undefined') {
								if (rightestIndex == 0) {
									tmpTxt += '\tRepeater[\''+FoRkey+'\'].Begin0(, 1, '+bLen+', '+bLen+',\''+FoRkey+'\');\n';
								} else {
									tmpTxt += '\tRepeater[\''+FoRkey+'\'].Begin0(\'' + rightestIndex + '\', 1, '+bLen+', '+bLen+',\''+FoRkey+'\');\n';
								}
							}								
						}
						
						if (typeof FoPkey != 'undefined') {
							tmpTxt += '\tRepeater[\''+FoPkey+'\'].Begin0(, 0, 0, '+pRpt+',\''+FoPkey+'\');\n';
							
						}		

						subTrkArr.push([crX, tmpTxt]);
						
						break;	
					
					}
				}
  			} else {
				for (g = 0; g < bveFOObjArr.length; g++) {
					if (bveFOObjArr[g][1] == arrK_1[0]) {
					
						var FoLkey,FoRkey,FoPkey;
						
						var FoLx = bveFOObjArr[g][4].replace(/[/]/g,'\\');
						var FoRx = bveFOObjArr[g][5].replace(/[/]/g,'\\');
						var FoPX = bveFOObjArr[g][7].replace(/[/]/g,'\\');
						var pRpt = parseInt(bveFOObjArr[g][6]);			
						var bLen = parseInt(bveFOObjArr[g][8]);
						
						for (key in structure) {
							if (structure[key][0] == FoLx) {
								FoLkey = key;
								structure[key][1]++;
							}
							if (structure[key][0] == FoRx) {
								FoRkey = key;
								structure[key][1]++;
							}
							if (structure[key][0] == FoPX) {
								FoPkey = key;
								structure[key][1]++;
							}
						}

						var tmpTxt = '';
						
						if (typeof FoLkey != 'undefined') {
							tmpTxt += '\tRepeater[\''+FoLkey+'\'].End();\n';
															
						}
						if (typeof FoRkey != 'undefined') {
							tmpTxt += '\tRepeater[\''+FoRkey+'\'].End();\n';
							
						}						
						if (typeof FoPkey != 'undefined') {
							tmpTxt += '\tRepeater[\''+FoPkey+'\'].End();\n';
							
						}
						
						subTrkArr.push([crX, tmpTxt]);
						
						break;
					}
				}
			}
		}
 	}
	
	if (kdata.tunnel != '') {
		var arrK = kdata.tunnel.split('¤');
		noteTrkArr.push([ crX,'tunnel']);
		
		for (k = 0; k < arrK.length; k++) {
			var arrK_1 = arrK[k].split(':');
			if (arrK_1[1] == '0') {
				for (g = 0; g < bvetunnelObjArr.length; g++) {
					if (bvetunnelObjArr[g][1] == arrK_1[0]) {
					
						var tunStkey,tunEdkey,tunWLkey,tunWRkey; //,tunM1Lkey,tunM1Rkey,tunM2Lkey,tunM2Rkey,tunELkey,tunERkey;
						
						var tunStx = bvetunnelObjArr[g][4].replace(/[/]/g,'\\');
						var tunEdx = bvetunnelObjArr[g][5].replace(/[/]/g,'\\');
						
						var tunSLx = bvetunnelObjArr[g][6].replace(/[/]/g,'\\');
						var tunSRx = bvetunnelObjArr[g][7].replace(/[/]/g,'\\');
						
						//var tunM1Lx = bvetunnelObjArr[g][8].replace(/[/]/g,'\\');
						//var tunM1Rx = bvetunnelObjArr[g][9].replace(/[/]/g,'\\');
						var tunWcycle = (parseInt(bvetunnelObjArr[g][8])>0)? bvetunnelObjArr[g][8] : '5';
						/*
						var tunM2Lx = bvetunnelObjArr[g][11].replace(/[/]/g,'\\');
						var tunM2Rx = bvetunnelObjArr[g][12].replace(/[/]/g,'\\');
						var tunM2Rp = (parseInt(bvetunnelObjArr[g][13])>0)? bvetunnelObjArr[g][13] : '25';
						
						var tunELx = bvetunnelObjArr[g][14].replace(/[/]/g,'\\');
						var tunERx = bvetunnelObjArr[g][15].replace(/[/]/g,'\\'); */
					
						for (key in structure) {
							if (structure[key][0] == tunStx) {
								tunStkey = key;
								structure[key][1]++;
							}
							if (structure[key][0] == tunEdx) {
								tunEdkey = key;
								structure[key][1]++;
							}
							if (structure[key][0] == tunSLx) {
								tunWLkey = key;
								structure[key][1]++;
							}
							if (structure[key][0] == tunSRx) {
								tunWRkey = key;
								structure[key][1]++;
							} /*
							if (structure[key][0] == tunM1Lx) {
								tunM1Lkey = key;
								structure[key][1]++;
							}
							if (structure[key][0] == tunM1Rx) {
								tunM1Rkey = key;
								structure[key][1]++;
							}
							if (structure[key][0] == tunM2Lx) {
								tunM2Lkey = key;
								structure[key][1]++;
							}
							if (structure[key][0] == tunM2Rx) {
								tunM2Rkey = key;
								structure[key][1]++;
							}
							if (structure[key][0] == tunELx) {
								tunELkey = key;
								structure[key][1]++;
							}
							if (structure[key][0] == tunERx) {
								tunERkey = key;
								structure[key][1]++;
							} */
						}
												
						subTrkArr.push([crX, '\tCabIlluminance.Interpolate(1);\n']);
						subTrkArr.push([crX+5, '\tCabIlluminance.Interpolate(0);\n']);

						//algoritma utk wall type
						if (paralellTrack.length == 0) {
							if (typeof tunStkey != 'undefined') { // tunnel entrance
								subTrkArr.push([crX, '\tStructure[\''+tunStkey+'\'].Put(, 0, 0, 0, 0, 0, 0, 0, 0);\n']);							
							} 							
							if (typeof tunWLkey != 'undefined' && typeof tunWRkey != 'undefined' ) {
								//subTrkArr.push([crX, '\tStructure[\''+tunWLkey+'\'].Put(, 0, 0, 0, 0, 0, 0, 0, 0);\n']);
								//subTrkArr.push([crX, '\tStructure[\''+tunWRkey+'\'].Put(, 0, 0, 0, 0, 0, 0, 0, 0);\n']);
								subTrkArr.push([crX+5, '\tRepeater[\''+tunWLkey+'\'].Begin0(, 1, '+tunWcycle+', '+tunWcycle+',\''+tunWLkey+'\');\n']);
								subTrkArr.push([crX+5, '\tRepeater[\''+tunWRkey+'\'].Begin0(, 1, '+tunWcycle+', '+tunWcycle+',\''+tunWRkey+'\');\n']);	
								/*
								if (typeof tunM2Lkey != 'undefined') {
									subTrkArr.push([crX+25, '\tRepeater[\''+tunM1Lkey+'\'].Begin0(0, 1, '+tunWcycle+', '+(tunWcycle+tunM2Rp)+',\''+tunM1Lkey+'\');\n']);
									subTrkArr.push([crX+25, '\tRepeater[\''+tunM1Rkey+'\'].Begin0(0, 1, '+tunWcycle+', '+(tunWcycle+tunM2Rp)+',\''+tunM1Rkey+'\');\n']);								
									subTrkArr.push([crX+tunM2Rp+25, '\tRepeater[\''+tunM2Lkey+'\'].Begin0(0, 1, '+tunM2Rp+', '+(tunWcycle+tunM2Rp)+',\''+tunM2Lkey+'\');\n']);
									subTrkArr.push([crX+tunM2Rp+25, '\tRepeater[\''+tunM2Rkey+'\'].Begin0(0, 1, '+tunM2Rp+', '+(tunWcycle+tunM2Rp)+',\''+tunM2Rkey+'\');\n']);								
								} else {
									subTrkArr.push([crX+25, '\tRepeater[\''+tunM1Lkey+'\'].Begin0(0, 1, '+tunWcycle+', '+tunWcycle+',\''+tunM1Lkey+'\');\n']);
									subTrkArr.push([crX+25, '\tRepeater[\''+tunM1Rkey+'\'].Begin0(0, 1, '+tunWcycle+', '+tunWcycle+',\''+tunM1Rkey+'\');\n']);								
								} */								
							} else {
								subTrkArr.push([crX+5, '\tRepeater[\''+tunWLkey+'\'].Begin0(, 1, '+tunWcycle+', '+tunWcycle+',\''+tunWLkey+'\');\n']);
								/*
								if (typeof tunM2Lkey != 'undefined') {
									subTrkArr.push([crX, '\tRepeater[\''+tunM1Lkey+'\'].Begin0(0, 1, '+tunWcycle+', '+(tunWcycle+tunM2Rp)+',\''+tunM1Lkey+'\');\n']);
									subTrkArr.push([crX, '\tRepeater[\''+tunM1Rkey+'\'].Begin0(0, 1, '+tunWcycle+', '+(tunWcycle+tunM2Rp)+',\''+tunM1Rkey+'\');\n']);								
									subTrkArr.push([crX+tunM2Rp, '\tRepeater[\''+tunM2Lkey+'\'].Begin0(0, 1, '+tunM2Rp+', '+(tunWcycle+tunM2Rp)+',\''+tunM2Lkey+'\');\n']);
									subTrkArr.push([crX+tunM2Rp, '\tRepeater[\''+tunM2Rkey+'\'].Begin0(0, 1, '+tunM2Rp+', '+(tunWcycle+tunM2Rp)+',\''+tunM2Rkey+'\');\n']);								
								} else {
									subTrkArr.push([crX, '\tRepeater[\''+tunM1Lkey+'\'].Begin0(0, 1, '+tunWcycle+', '+tunWcycle+',\''+tunM1Lkey+'\');\n']);
									subTrkArr.push([crX, '\tRepeater[\''+tunM1Rkey+'\'].Begin0(0, 1, '+tunWcycle+', '+tunWcycle+',\''+tunM1Rkey+'\');\n']);								
								} */
							} 
							
							
						} else if (paralellTrack.length == 1) {
						
							var leftestIndex = 0; var rightestIndex = 0;
							var leftestX = 0; var rightestX = 0;
							for (pTi = 0; pTi < paralellTrack.length; pTi++) {
								if (paralellTrack[pTi][1] <= leftestX) {
									leftestX = paralellTrack[pTi][1];
									leftestIndex = paralellTrack[pTi][0];
								}
								if (paralellTrack[pTi][1] >= rightestX) {
									rightestX = paralellTrack[pTi][1];
									rightestIndex = paralellTrack[pTi][0];
								}
							}
							
							if (typeof tunStkey != 'undefined') { // tunnel entrance
								subTrkArr.push([crX, '\tStructure[\''+tunStkey+'\'].Put(, 0, 0, 0, 0, 0, 0, 0, 0);\n']);							
							} 							
							
							if (typeof tunWLkey != 'undefined' && typeof tunWRkey != 'undefined' ) {
								//subTrkArr.push([crX+5, '\tStructure[\''+tunWLkey+'\'].Put('+leftestIndex+', 0, 0, 0, 0, 0, 0, 0, 0);\n']);
								//subTrkArr.push([crX+5, '\tStructure[\''+tunWRkey+'\'].Put('+rightestIndex+', 0, 0, 0, 0, 0, 0, 0, 0);\n']);
								subTrkArr.push([crX+5, '\tRepeater[\''+tunWLkey+'\'].Begin0('+leftestIndex+', 1, '+tunWcycle+', '+tunWcycle+',\''+tunWLkey+'\');\n']);
								subTrkArr.push([crX+5, '\tRepeater[\''+tunWRkey+'\'].Begin0('+rightestIndex+', 1, '+tunWcycle+', '+tunWcycle+',\''+tunWRkey+'\');\n']);
							}
							/*
							if (rightestX > defaultOffset || (leftestX < -1*defaultOffset)) {
							
							
								if (typeof tunWLkey != 'undefined' && typeof tunWRkey != 'undefined' ) {
									subTrkArr.push([crX+5, '\tStructure[\''+tunWLkey+'\'].Put('+leftestIndex+', 0, 0, 0, 0, 0, 0, 0, 0);\n']);
									subTrkArr.push([crX+5, '\tStructure[\''+tunWRkey+'\'].Put('+rightestIndex+', 0, 0, 0, 0, 0, 0, 0, 0);\n']);								
									if (typeof tunM2Lkey != 'undefined') {
										subTrkArr.push([crX+25, '\tRepeater[\''+tunM1Lkey+'\'].Begin0(0, 1, '+tunWcycle+', '+(tunWcycle+tunM2Rp)+',\''+tunM1Lkey+'\');\n']);
										subTrkArr.push([crX+25, '\tRepeater[\''+tunM1Rkey+'\'].Begin0(0, 1, '+tunWcycle+', '+(tunWcycle+tunM2Rp)+',\''+tunM1Rkey+'\');\n']);								
										subTrkArr.push([crX+tunM2Rp+25, '\tRepeater[\''+tunM2Lkey+'\'].Begin0(0, 1, '+tunM2Rp+', '+(tunWcycle+tunM2Rp)+',\''+tunM2Lkey+'\');\n']);
										subTrkArr.push([crX+tunM2Rp+25, '\tRepeater[\''+tunM2Rkey+'\'].Begin0(0, 1, '+tunM2Rp+', '+(tunWcycle+tunM2Rp)+',\''+tunM2Rkey+'\');\n']);								
									} else {
										subTrkArr.push([crX+25, '\tRepeater[\''+tunM1Lkey+'\'].Begin0(0, 1, '+tunWcycle+', '+tunWcycle+',\''+tunM1Lkey+'\');\n']);
										subTrkArr.push([crX+25, '\tRepeater[\''+tunM1Rkey+'\'].Begin0(0, 1, '+tunWcycle+', '+tunWcycle+',\''+tunM1Rkey+'\');\n']);								
									} 								
								} else {
									if (typeof tunM2Lkey != 'undefined') {
										subTrkArr.push([crX, '\tRepeater[\''+tunM1Lkey+'\'].Begin0(0, 1, '+tunWcycle+', '+(tunWcycle+tunM2Rp)+',\''+tunM1Lkey+'\');\n']);
										subTrkArr.push([crX, '\tRepeater[\''+tunM1Rkey+'\'].Begin0(0, 1, '+tunWcycle+', '+(tunWcycle+tunM2Rp)+',\''+tunM1Rkey+'\');\n']);								
										subTrkArr.push([crX+tunM2Rp, '\tRepeater[\''+tunM2Lkey+'\'].Begin0(0, 1, '+tunM2Rp+', '+(tunWcycle+tunM2Rp)+',\''+tunM2Lkey+'\');\n']);
										subTrkArr.push([crX+tunM2Rp, '\tRepeater[\''+tunM2Rkey+'\'].Begin0(0, 1, '+tunM2Rp+', '+(tunWcycle+tunM2Rp)+',\''+tunM2Rkey+'\');\n']);								
									} else {
										subTrkArr.push([crX, '\tRepeater[\''+tunM1Lkey+'\'].Begin0(0, 1, '+tunWcycle+', '+tunWcycle+',\''+tunM1Lkey+'\');\n']);
										subTrkArr.push([crX, '\tRepeater[\''+tunM1Rkey+'\'].Begin0(0, 1, '+tunWcycle+', '+tunWcycle+',\''+tunM1Rkey+'\');\n']);								
									}
								}							
							} else {
								if (typeof tunStkey != 'undefined') { // tunnel entrance
									subTrkArr.push([crX, '\tStructure[\''+tunStkey+'\'].Put(' + leftestIndex + ', 0, 0, 0, 0, 0, 0, 0, 0);\n']);							
								} 							
							
								if (typeof tunWLkey != 'undefined') {
									subTrkArr.push([crX, '\tStructure[\''+tunWLkey+'\'].Put(' + leftestIndex + ', 0, 0, 0, 0, 0, 0, 0, 0);\n']);
									subTrkArr.push([crX, '\tStructure[\''+tunWRkey+'\'].Put(' + rightestIndex + ', 0, 0, 0, 0, 0, 0, 0, 0);\n']);
									if (typeof tunM2Lkey != 'undefined') {
										subTrkArr.push([crX+25, '\tRepeater[\''+tunM1Lkey+'\'].Begin0('+leftestIndex+', 1, '+tunWcycle+', '+(tunWcycle+tunM2Rp)+',\''+tunM1Lkey+'\');\n']);
										subTrkArr.push([crX+25, '\tRepeater[\''+tunM1Rkey+'\'].Begin0('+rightestIndex+', 1, '+tunWcycle+', '+(tunWcycle+tunM2Rp)+',\''+tunM1Rkey+'\');\n']);								
										subTrkArr.push([crX+tunM2Rp+25, '\tRepeater[\''+tunM2Lkey+'\'].Begin0('+leftestIndex+', 1, '+tunM2Rp+', '+(tunWcycle+tunM2Rp)+',\''+tunM2Lkey+'\');\n']);
										subTrkArr.push([crX+tunM2Rp+25, '\tRepeater[\''+tunM2Rkey+'\'].Begin0('+rightestIndex+', 1, '+tunM2Rp+', '+(tunWcycle+tunM2Rp)+',\''+tunM2Rkey+'\');\n']);								
									} else {
										subTrkArr.push([crX+25, '\tRepeater[\''+tunM1Lkey+'\'].Begin0('+leftestIndex+', 1, '+tunWcycle+', '+tunWcycle+',\''+tunM1Lkey+'\');\n']);
										subTrkArr.push([crX+25, '\tRepeater[\''+tunM1Rkey+'\'].Begin0('+rightestIndex+', 1, '+tunWcycle+', '+tunWcycle+',\''+tunM1Rkey+'\');\n']);								
									}								
								} else {
									if (typeof tunM2Lkey != 'undefined') {
										subTrkArr.push([crX, '\tRepeater[\''+tunM1Lkey+'\'].Begin0('+leftestIndex+', 1, '+tunWcycle+', '+(tunWcycle+tunM2Rp)+',\''+tunM1Lkey+'\');\n']);
										subTrkArr.push([crX, '\tRepeater[\''+tunM1Rkey+'\'].Begin0('+rightestIndex+', 1, '+tunWcycle+', '+(tunWcycle+tunM2Rp)+',\''+tunM1Rkey+'\');\n']);								
										subTrkArr.push([crX+tunM2Rp, '\tRepeater[\''+tunM2Lkey+'\'].Begin0('+leftestIndex+', 1, '+tunM2Rp+', '+(tunWcycle+tunM2Rp)+',\''+tunM2Lkey+'\');\n']);
										subTrkArr.push([crX+tunM2Rp, '\tRepeater[\''+tunM2Rkey+'\'].Begin0('+rightestIndex+', 1, '+tunM2Rp+', '+(tunWcycle+tunM2Rp)+',\''+tunM2Rkey+'\');\n']);								
									} else {
										subTrkArr.push([crX, '\tRepeater[\''+tunM1Lkey+'\'].Begin0('+leftestIndex+', 1, '+tunWcycle+', '+tunWcycle+',\''+tunM1Lkey+'\');\n']);
										subTrkArr.push([crX, '\tRepeater[\''+tunM1Rkey+'\'].Begin0('+rightestIndex+', 1, '+tunWcycle+', '+tunWcycle+',\''+tunM1Rkey+'\');\n']);								
									}
								}							
							} */
								
						} else {
							//not supported, please create manually
							console.log('Multi track tunnel not supported. Min 1, max 2.');
						}
						
						subTrkArr.push([crX, '\tRollingNoise.Change(4);\n']);
						break;	
					}
				}
  			} else {
				for (g = 0; g < bvetunnelObjArr.length; g++) {
					if (bvetunnelObjArr[g][1] == arrK_1[0]) {
						if (bvetunnelObjArr[g][1] == arrK_1[0]) {
						
							var tunStkey,tunEdkey,tunWLkey,tunWRkey; //,tunM1Lkey,tunM1Rkey,tunM2Lkey,tunM2Rkey,tunELkey,tunERkey;
							
							var tunStx = bvetunnelObjArr[g][4].replace(/[/]/g,'\\');
							var tunEdx = bvetunnelObjArr[g][5].replace(/[/]/g,'\\');
							
							var tunSLx = bvetunnelObjArr[g][6].replace(/[/]/g,'\\');
							var tunSRx = bvetunnelObjArr[g][7].replace(/[/]/g,'\\');
							
							//var tunM1Lx = bvetunnelObjArr[g][8].replace(/[/]/g,'\\');
							//var tunM1Rx = bvetunnelObjArr[g][9].replace(/[/]/g,'\\');
							var tunWcycle = (parseInt(bvetunnelObjArr[g][10])>0)? bvetunnelObjArr[g][10] : '5';
							/*
							var tunM2Lx = bvetunnelObjArr[g][11].replace(/[/]/g,'\\');
							var tunM2Rx = bvetunnelObjArr[g][12].replace(/[/]/g,'\\');
							var tunM2Rp = (parseInt(bvetunnelObjArr[g][13])>0)? bvetunnelObjArr[g][13] : '25';
							
							var tunELx = bvetunnelObjArr[g][14].replace(/[/]/g,'\\');
							var tunERx = bvetunnelObjArr[g][15].replace(/[/]/g,'\\');
						*/
							for (key in structure) {
								if (structure[key][0] == tunStx) {
									tunStkey = key;
									structure[key][1]++;
								}
								if (structure[key][0] == tunEdx) {
									tunEdkey = key;
									structure[key][1]++;
								}
								if (structure[key][0] == tunSLx) {
									tunWLkey = key;
									structure[key][1]++;
								}
								if (structure[key][0] == tunSRx) {
									tunWRkey = key;
									structure[key][1]++;
								} /*
								if (structure[key][0] == tunM1Lx) {
									tunM1Lkey = key;
									structure[key][1]++;
								}
								if (structure[key][0] == tunM1Rx) {
									tunM1Rkey = key;
									structure[key][1]++;
								}
								if (structure[key][0] == tunM2Lx) {
									tunM2Lkey = key;
									structure[key][1]++;
								}
								if (structure[key][0] == tunM2Rx) {
									tunM2Rkey = key;
									structure[key][1]++;
								}
								if (structure[key][0] == tunELx) {
									tunELkey = key;
									structure[key][1]++;
								}
								if (structure[key][0] == tunERx) {
									tunERkey = key;
									structure[key][1]++;
								} */
							}
													
							subTrkArr.push([crX-5, '\tCabIlluminance.Interpolate(0);\n']);
							subTrkArr.push([crX, '\tCabIlluminance.Interpolate(1);\n']);

							//algoritma utk wall type
							if (paralellTrack.length == 0) {
								if (typeof tunEdkey != 'undefined') { // tunnel exit
									subTrkArr.push([crX-5, '\tStructure[\''+tunEdkey+'\'].Put(, 0, 0, 0, 0, 0, 0, 0, 0);\n']);							
								}
								if (typeof tunELkey != 'undefined') {
									//subTrkArr.push([crX, '\tStructure[\''+tunELkey+'\'].Put(, 0, 0, 0, 0, 0, 0, 0, 0);\n']);
									//subTrkArr.push([crX, '\tStructure[\''+tunERkey+'\'].Put(, 0, 0, 0, 0, 0, 0, 0, 0);\n']);

									subTrkArr.push([crX-5, '\tRepeater[\''+tunWLkey+'\'].End();\n']);
									subTrkArr.push([crX-5, '\tRepeater[\''+tunWRkey+'\'].End();\n']);	
									/*
									if (typeof tunM2Lkey != 'undefined') {
										subTrkArr.push([crX-25, '\tRepeater[\''+tunM1Lkey+'\'].End();\n']);
										subTrkArr.push([crX-25, '\tRepeater[\''+tunM1Rkey+'\'].End();\n']);								
										subTrkArr.push([crX-25, '\tRepeater[\''+tunM2Lkey+'\'].End();\n']);
										subTrkArr.push([crX-25, '\tRepeater[\''+tunM2Rkey+'\'].End();\n']);								
									} else {
										subTrkArr.push([crX-25, '\tRepeater[\''+tunM1Lkey+'\'].End();\n']);
										subTrkArr.push([crX-25, '\tRepeater[\''+tunM1Rkey+'\'].End();\n']);								
									}	*/							
								} else {
									subTrkArr.push([crX-5, '\tRepeater[\''+tunWLkey+'\'].End();\n']);
									/*
									if (typeof tunM2Lkey != 'undefined') {
										subTrkArr.push([crX, '\tRepeater[\''+tunM1Lkey+'\'].End();\n']);
										subTrkArr.push([crX, '\tRepeater[\''+tunM1Rkey+'\'].End();\n']);								
										subTrkArr.push([crX, '\tRepeater[\''+tunM2Lkey+'\'].End();\n']);
										subTrkArr.push([crX, '\tRepeater[\''+tunM2Rkey+'\'].End();\n']);								
									} else {
										subTrkArr.push([crX, '\tRepeater[\''+tunM1Lkey+'\'].End();\n']);
										subTrkArr.push([crX, '\tRepeater[\''+tunM1Rkey+'\'].End();\n']);								
									} */
								}
								
								
							} else if (paralellTrack.length == 1) {
							
								var leftestIndex = 0; var rightestIndex = 0;
								var leftestX = 0; var rightestX = 0;
								for (pTi = 0; pTi < paralellTrack.length; pTi++) {
									if (paralellTrack[pTi][1] <= leftestX) {
										leftestX = paralellTrack[pTi][1];
										leftestIndex = paralellTrack[pTi][0];
									}
									if (paralellTrack[pTi][1] >= rightestX) {
										rightestX = paralellTrack[pTi][1];
										rightestIndex = paralellTrack[pTi][0];
									}
								}
								
								if (typeof tunEdkey != 'undefined') { // tunnel exit
									subTrkArr.push([crX-5, '\tStructure[\''+tunEdkey+'\'].Put(, 0, 0, 0, 0, 0, 0, 0, 0);\n']);							
								}	

								subTrkArr.push([crX-5, '\tRepeater[\''+tunWLkey+'\'].End();\n']);
								subTrkArr.push([crX-5, '\tRepeater[\''+tunWRkey+'\'].End();\n']);
								
								/*	
								if (rightestX > defaultOffset || (leftestX < -1*defaultOffset)) {

									if (typeof tunELkey != 'undefined') {
										subTrkArr.push([crX, '\tStructure[\''+tunELkey+'\'].Put(, 0, 0, 0, 0, 0, 0, 0, 0);\n']);
										subTrkArr.push([crX, '\tStructure[\''+tunERkey+'\'].Put(, 0, 0, 0, 0, 0, 0, 0, 0);\n']);								
										if (typeof tunM2Lkey != 'undefined') {
											subTrkArr.push([crX-25, '\tRepeater[\''+tunM1Lkey+'\'].End();\n']);
											subTrkArr.push([crX-25, '\tRepeater[\''+tunM1Rkey+'\'].End();\n']);								
											subTrkArr.push([crX-25, '\tRepeater[\''+tunM2Lkey+'\'].End();\n']);
											subTrkArr.push([crX-25, '\tRepeater[\''+tunM2Rkey+'\'].End();\n']);								
										} else {
											subTrkArr.push([crX-25, '\tRepeater[\''+tunM1Lkey+'\'].End();\n']);
											subTrkArr.push([crX-25, '\tRepeater[\''+tunM1Rkey+'\'].End();\n']);								
										}								
									} else {
										if (typeof tunM2Lkey != 'undefined') {
											subTrkArr.push([crX, '\tRepeater[\''+tunM1Lkey+'\'].End();\n']);
											subTrkArr.push([crX, '\tRepeater[\''+tunM1Rkey+'\'].End();\n']);								
											subTrkArr.push([crX, '\tRepeater[\''+tunM2Lkey+'\'].End();\n']);
											subTrkArr.push([crX, '\tRepeater[\''+tunM2Rkey+'\'].End();\n']);								
										} else {
											subTrkArr.push([crX, '\tRepeater[\''+tunM1Lkey+'\'].End();\n']);
											subTrkArr.push([crX, '\tRepeater[\''+tunM1Rkey+'\'].End();\n']);								
										}
									}							
								} else {
									if (typeof tunEdkey != 'undefined') { // tunnel exit
										subTrkArr.push([crX, '\tStructure[\''+tunEdkey+'\'].Put(' + leftestIndex + ', 0, 0, 0, 0, 0, 0, 0, 0);\n']);							
									}
								
									if (typeof tunELkey != 'undefined') {
										subTrkArr.push([crX, '\tStructure[\''+tunELkey+'\'].Put(' + leftestIndex + ', 0, 0, 0, 0, 0, 0, 0, 0);\n']);
										subTrkArr.push([crX, '\tStructure[\''+tunWRkey+'\'].Put(' + rightestIndex + ', 0, 0, 0, 0, 0, 0, 0, 0);\n']);
										if (typeof tunM2Lkey != 'undefined') {
											subTrkArr.push([crX-25, '\tRepeater[\''+tunM1Lkey+'\'].End();\n']);
											subTrkArr.push([crX-25, '\tRepeater[\''+tunM1Rkey+'\'].End();\n']);								
											subTrkArr.push([crX-25, '\tRepeater[\''+tunM2Lkey+'\'].End();\n']);
											subTrkArr.push([crX-25, '\tRepeater[\''+tunM2Rkey+'\'].End();\n']);								
										} else {
											subTrkArr.push([crX-25, '\tRepeater[\''+tunM1Lkey+'\'].End();\n']);
											subTrkArr.push([crX-25, '\tRepeater[\''+tunM1Rkey+'\'].End();\n']);								
										}								
									} else {
										if (typeof tunM2Lkey != 'undefined') {
											subTrkArr.push([crX, '\tRepeater[\''+tunM1Lkey+'\'].End();\n']);
											subTrkArr.push([crX, '\tRepeater[\''+tunM1Rkey+'\'].End();\n']);								
											subTrkArr.push([crX, '\tRepeater[\''+tunM2Lkey+'\'].End();\n']);
											subTrkArr.push([crX, '\tRepeater[\''+tunM2Rkey+'\'].End();\n']);								
										} else {
											subTrkArr.push([crX, '\tRepeater[\''+tunM1Lkey+'\'].End();\n']);
											subTrkArr.push([crX, '\tRepeater[\''+tunM1Rkey+'\'].End();\n']);								
										}
									}							
								}
									*/
							} else {
								//not supported, please create manually
							}
							subTrkArr.push([crX, '\tRollingNoise.Change(0);\n']);					
							break;	
						}
					}
				}
			}

		}
	}
		
	if (kdata.dike != '') {
		var arrK = kdata.dike.split('¤');
		//[(0)'0',(1)'DikeGrassLR1',(2)'Grass Dike LR 1',(3)'bve5/8dike_h56w9-2.jpg',(4)'shared/dike/8dike_h56w9-2l.x', (5)'shared/dike/8dike_h56w9-2r.x',(6)'5'];	
		for (k = 0; k < arrK.length; k++) {
			var arrK_1 = arrK[k].split(':');
			if (arrK_1[1] == '0') {
				for (g = 0; g < bvedikeObjArr.length; g++) {
					if (bvedikeObjArr[g][1] == arrK_1[0]) {
					
						var dikeLkey,dikeRkey;
						
						var dikeLx = bvedikeObjArr[g][4].replace(/[/]/g,'\\');
						var dikeRx = bvedikeObjArr[g][5].replace(/[/]/g,'\\');
						var dikeCycle = bvedikeObjArr[g][6];
						
						for (key in structure) {
							if (structure[key][0] == dikeLx) {
								dikeLkey = key;
								structure[key][1]++;
							}
							if (structure[key][0] == dikeRx) {
								dikeRkey = key;
								structure[key][1]++;
							}
						}
						
						var tmpTxt = '';

						if (paralellTrack.length == 0) {
							
							if (typeof dikeLkey != 'undefined') {
								tmpTxt += '\tRepeater[\''+dikeLkey+'\'].Begin0(, 1, '+dikeCycle+', '+dikeCycle+',\''+dikeLkey+'\');\n';
																
							}
							if (typeof dikeRkey != 'undefined') {
								tmpTxt += '\tRepeater[\''+dikeRkey+'\'].Begin0(, 1, '+dikeCycle+', '+dikeCycle+',\''+dikeRkey+'\');\n';
								
							}
							
						} else {
							//parallel track, cek trek terkanan atau terkiri
							var leftestIndex = 0; var rightestIndex = 0;
							var leftestX = 0; var rightestX = 0;
							for (pTi = 0; pTi < paralellTrack.length; pTi++) {
								if (paralellTrack[pTi][1] <= leftestX) {
									leftestX = paralellTrack[pTi][1];
									leftestIndex = paralellTrack[pTi][0];
								}
								if (paralellTrack[pTi][1] >= rightestX) {
									rightestX = paralellTrack[pTi][1];
									rightestIndex = paralellTrack[pTi][0];
								}
							}
					
							if (typeof dikeLkey != 'undefined') {
								tmpTxt += '\tRepeater[\''+dikeLkey+'\'].Begin0(' + leftestIndex + ', 1, '+dikeCycle+', '+dikeCycle+',\''+dikeLkey+'\');\n';
																
							}
							if (typeof dikeRkey != 'undefined') {
								tmpTxt += '\tRepeater[\''+dikeRkey+'\'].Begin0(' + rightestIndex + ', 1, '+dikeCycle+', '+dikeCycle+',\''+dikeRkey+'\');\n';
								
							}								
						}

						subTrkArr.push([crX, tmpTxt]);
						
						break;	
					
					}
				}
  			} else {
				for (g = 0; g < bvedikeObjArr.length; g++) {
					if (bvedikeObjArr[g][1] == arrK_1[0]) {
					
						var dikeLkey,dikeRkey;
						
						var dikeLx = bvedikeObjArr[g][4].replace(/[/]/g,'\\');
						var dikeRx = bvedikeObjArr[g][5].replace(/[/]/g,'\\');
						
						for (key in structure) {
							if (structure[key][0] == dikeLx) {
								dikeLkey = key;
								structure[key][1]++;
							}
							if (structure[key][0] == dikeRx) {
								dikeRkey = key;
								structure[key][1]++;
							}
						}

						var tmpTxt = '';
						
						if (typeof dikeLkey != 'undefined') {
							tmpTxt += '\tRepeater[\''+dikeLkey+'\'].End();\n';
															
						}
						if (typeof dikeRkey != 'undefined') {
							tmpTxt += '\tRepeater[\''+dikeRkey+'\'].End();\n';
							
						}						

						subTrkArr.push([crX, tmpTxt]);
						
						break;
					}
				}
			}		
		}		
	}
	
	if (kdata.cut != '') {
		var arrK = kdata.cut.split('¤');
		noteTrkArr.push([ crX,'hillcut']);
		//[(0)'0',(1)'HCh2_9d45gr',(2)'Grass Hill Cut 2.9mH',(3)'bve5/hillcut2_9h45d.jpg', (4)'shared/hillcut/hillcut2_9h45dl.x',(5)'shared/hillcut/hillcut2_9h45dr.x',(6)'5'];
		
		for (k = 0; k < arrK.length; k++) {
			var arrK_1 = arrK[k].split(':');
			if (arrK_1[1] == '0') {
				for (g = 0; g < bvecutObjArr.length; g++) {
					if (bvecutObjArr[g][1] == arrK_1[0]) {
					
						var cutLkey,cutRkey;
						
						var cutLx = bvecutObjArr[g][4].replace(/[/]/g,'\\');
						var cutRx = bvecutObjArr[g][5].replace(/[/]/g,'\\');
						var hillcutCycle = bvecutObjArr[g][6];
						
						for (key in structure) {
							if (structure[key][0] == cutLx) {
								cutLkey = key;
								structure[key][1]++;
							}
							if (structure[key][0] == cutRx) {
								cutRkey = key;
								structure[key][1]++;
							}
						}
						
						var tmpTxt = '';

						//algoritma utk wall type
						if (paralellTrack.length == 0) {
							
							if (typeof cutLkey != 'undefined') {
								tmpTxt += '\tRepeater[\''+cutLkey+'\'].Begin0(, 1, '+hillcutCycle+', '+hillcutCycle+',\''+cutLkey+'\');\n';
																
							}
							if (typeof cutRkey != 'undefined') {
								tmpTxt += '\tRepeater[\''+cutRkey+'\'].Begin0(, 1, '+hillcutCycle+', '+hillcutCycle+',\''+cutRkey+'\');\n';
								
							}
							
						} else {
							//parallel track, cek trek terkanan atau terkiri
							var leftestIndex = 0; var rightestIndex = 0;
							var leftestX = 0; var rightestX = 0;
							for (pTi = 0; pTi < paralellTrack.length; pTi++) {
								if (paralellTrack[pTi][1] <= leftestX) {
									leftestX = paralellTrack[pTi][1];
									leftestIndex = paralellTrack[pTi][0];
								}
								if (paralellTrack[pTi][1] >= rightestX) {
									rightestX = paralellTrack[pTi][1];
									rightestIndex = paralellTrack[pTi][0];
								}
							}
					
							if (typeof cutLkey != 'undefined') {
								tmpTxt += '\tRepeater[\''+cutLkey+'\'].Begin0(' + leftestIndex + ', 1, '+hillcutCycle+', '+hillcutCycle+',\''+cutLkey+'\');\n';
																
							}
							if (typeof cutRkey != 'undefined') {
								tmpTxt += '\tRepeater[\''+cutRkey+'\'].Begin0(' + rightestIndex + ', 1, '+hillcutCycle+', '+hillcutCycle+',\''+cutRkey+'\');\n';
								
							}								
						}

						subTrkArr.push([crX, tmpTxt]);
						
						break;	
					
					}
				}
  			} else {
				for (g = 0; g < bvecutObjArr.length; g++) {
					if (bvecutObjArr[g][1] == arrK_1[0]) {
					
						var cutLkey,cutRkey;
						
						var cutLx = bvecutObjArr[g][4].replace(/[/]/g,'\\');
						var cutRx = bvecutObjArr[g][5].replace(/[/]/g,'\\');
						
						for (key in structure) {
							if (structure[key][0] == cutLx) {
								cutLkey = key;
								structure[key][1]++;
							}
							if (structure[key][0] == cutRx) {
								cutRkey = key;
								structure[key][1]++;
							}
						}

						var tmpTxt = '';
						
						if (typeof cutLkey != 'undefined') {
							tmpTxt += '\tRepeater[\''+cutLkey+'\'].End();\n';
															
						}
						if (typeof cutRkey != 'undefined') {
							tmpTxt += '\tRepeater[\''+cutRkey+'\'].End();\n';
							
						}						

						subTrkArr.push([crX, tmpTxt]);
						
						break;
					}
				}
			}		
		}
	}
	
	if (kdata.subway != '') {
	//0-3 = ['0','DTUG1','Double Track subway 1','bve5/ug1.jpg',
    //4-6 = 'shared/subway/ggl1-grass2.x','shared/subway/ggr1-grass2.x','25',
	//7-9 = 'shared/subway/uwalll-0011-concrete-bare-clean.x','shared/subway/uwallr-0011-concrete-bare-clean.x','5',
	//10-12 = 'shared/subway/entdt1_1.x','shared/subway/utwalll1_1.x','shared/subway/utwallr1_1.x',
	//13-14 = '5','shared/subway/exdt1_1.x'];

		var arrK = kdata.subway.split('¤');

		var tab = pid.split('_')[0]+ 'Tab';
		var uheight = -1 * parseFloat(MapToolbar.features[tab][pid].markers.getAt(idx).bdata.height);
		
		for (k = 0; k < arrK.length; k++) {
			var arrK_1 = arrK[k].split(':');
			
			if (arrK_1[1] == '0') {
			// #0 subway start, down-slope
				noteTrkArr.push([ crX,'subway start']);
				for (swg = 0; swg < bveUGObjArr.length; swg++) {
					
					if (bveUGObjArr[swg][1] == arrK_1[0]) {
					
						var SwGLkey, SwGRkey, SwOWLkey, SwOWRkey;
						
						var SwGLx = bveUGObjArr[swg][4].replace(/[/]/g,'\\');
						var SwGRx = bveUGObjArr[swg][5].replace(/[/]/g,'\\');
						var SwOWLx = bveUGObjArr[swg][7].replace(/[/]/g,'\\');
						var SwOWRx = bveUGObjArr[swg][8].replace(/[/]/g,'\\');

						var gRpt = parseFloat(bveUGObjArr[swg][6]);			
						var oRpt = parseFloat(bveUGObjArr[swg][9]);			
						
						for (key in structure) {
							if (structure[key][2] == 'subway') {
								if (structure[key][0] == SwGLx) {
									SwGLkey = key;
									structure[key][1]++;
								}
								if (structure[key][0] == SwGRx) {
									SwGRkey = key;
									structure[key][1]++;
								}
								if (structure[key][0] == SwOWLx) {
									SwOWLkey = key;
									structure[key][1]++;
								}
								if (structure[key][0] == SwOWRx) {
									SwOWRkey = key;
									structure[key][1]++;
								}								
							}

						}
						
						var tmpTxt = '';
						subTrkArr.push([ crX, '\tTrack[\'Ground\'].Position(0,'+lastheight+');\n']);
						subTrkArr.push([ crX, '\tRepeater[\'Ground\'].End();\n']);						
						
						if (paralellTrack.length == 0) {
							subTrkArr.push([ crX, '\tTrack[\'groundL\'].Position(-'+stOffset + ','+lastheight+');\n']);
							subTrkArr.push([ crX, '\tTrack[\'groundR\'].Position('+ stOffset + ','+lastheight+');\n']);

							
							if (typeof SwGLkey != 'undefined') {
								tmpTxt += '\tRepeater[\''+SwGLkey+'\'].Begin0(\'groundL\', 1, '+gRpt+', '+gRpt+',\''+SwGLkey+'\');\n';
							}
							if (typeof SwOWLkey != 'undefined') {
								tmpTxt += '\tRepeater[\''+SwOWLkey+'\'].Begin0(\'groundL\', 1, '+oRpt+', '+oRpt+',\''+SwOWLkey+'\');\n';
							}
							
							if (typeof SwGRkey != 'undefined') {
								tmpTxt += '\tRepeater[\''+SwGRkey+'\'].Begin0(\'groundR\', 1, '+gRpt+', '+gRpt+',\''+SwGRkey+'\');\n';
							}
							if (typeof SwOWRkey != 'undefined') {
								tmpTxt += '\tRepeater[\''+SwOWRkey+'\'].Begin0(\'groundR\', 1, '+oRpt+', '+oRpt+',\''+SwOWRkey+'\');\n';
							}
							
							
						} else {
							//parallel track, cek trek terkanan atau terkiri
							var leftestIndex = 0; var rightestIndex = 0;
							var leftestX = 0; var rightestX = 0;
							for (pTi = 0; pTi < paralellTrack.length; pTi++) {
								if (paralellTrack[pTi][1] <= leftestX) {
									leftestX = paralellTrack[pTi][1];
									leftestIndex = paralellTrack[pTi][0];
								}
								if (paralellTrack[pTi][1] >= rightestX) {
									rightestX = paralellTrack[pTi][1];
									rightestIndex = paralellTrack[pTi][0];
								}
							}
							
							subTrkArr.push([ crX, '\tTrack[\'groundL\'].Position('+ leftestX + ','+lastheight+');\n']);
							subTrkArr.push([ crX, '\tTrack[\'groundR\'].Position('+ rightestX + ','+lastheight+');\n']);
					
							if (typeof SwGLkey != 'undefined') {
								tmpTxt += '\tRepeater[\''+SwGLkey+'\'].Begin0(\'groundL\', 1, '+gRpt+', '+gRpt+',\''+SwGLkey+'\');\n';
							}
							if (typeof SwOWLkey != 'undefined') {
								tmpTxt += '\tRepeater[\''+SwOWLkey+'\'].Begin0(\'groundL\', 1, '+oRpt+', '+oRpt+',\''+SwOWLkey+'\');\n';
							}
							
							if (typeof SwGRkey != 'undefined') {
								tmpTxt += '\tRepeater[\''+SwGRkey+'\'].Begin0(\'groundR\', 1, '+gRpt+', '+gRpt+',\''+SwGRkey+'\');\n';
							}
							if (typeof SwOWRkey != 'undefined') {
								tmpTxt += '\tRepeater[\''+SwOWRkey+'\'].Begin0(\'groundR\', 1, '+oRpt+', '+oRpt+',\''+SwOWRkey+'\');\n';
							}								
						}

						subTrkArr.push([crX, tmpTxt]);
						
						break;	
					
					}
				}
				
  			} else if (arrK_1[1] == '1') {
				for (swg = 0; swg < bveUGObjArr.length; swg++) {
					// #0 subway start, down-slope
					if (bveUGObjArr[swg][1] == arrK_1[0]) {
					
						var SwGLkey, SwGRkey, SwOWLkey, SwOWRkey;
						var SwEntkey, SeIWLkey, SeIWRkey;
						
						var SwGLx = bveUGObjArr[swg][4].replace(/[/]/g,'\\');
						var SwGRx = bveUGObjArr[swg][5].replace(/[/]/g,'\\');
						var SwOWLx = bveUGObjArr[swg][7].replace(/[/]/g,'\\');
						var SwOWRx = bveUGObjArr[swg][8].replace(/[/]/g,'\\');

						var SwEntx = bveUGObjArr[swg][10].replace(/[/]/g,'\\');
						var SeIWLx = bveUGObjArr[swg][11].replace(/[/]/g,'\\');
						var SeIWRx = bveUGObjArr[swg][12].replace(/[/]/g,'\\');

						var gRpt = parseFloat(bveUGObjArr[swg][6]);			
						var oRpt = parseFloat(bveUGObjArr[swg][9]);			
						var iRpt = parseFloat(bveUGObjArr[swg][13]);
						
						
						for (key in structure) {
							if (structure[key][2] == 'subway') {
								if (structure[key][0] == SwGLx) {
									SwGLkey = key;
									structure[key][1]++;
								}
								if (structure[key][0] == SwGRx) {
									SwGRkey = key;
									structure[key][1]++;
								}
								if (structure[key][0] == SwOWLx) {
									SwOWLkey = key;
									structure[key][1]++;
								}
								if (structure[key][0] == SwOWRx) {
									SwOWRkey = key;
									structure[key][1]++;
								}
								
								if (structure[key][0] == SwEntx) {
									SwEntkey = key;
									structure[key][1]++;
								}
								if (structure[key][0] == SeIWLx) {
									SeIWLkey = key;
									structure[key][1]++;
								}
								if (structure[key][0] == SeIWRx) {
									SeIWRkey = key;
									structure[key][1]++;
								}
								
							}
						}
						
						var tmpTxt = '';
						var tmpTxt2 = '';
						var tmpTxt1 = '';
						
						if (paralellTrack.length == 0) {
							subTrkArr.push([ crX, '\tTrack[\'groundL\'].Position(-'+stOffset + ','+uheight+');\n']);
							subTrkArr.push([ crX, '\tTrack[\'groundR\'].Position('+ stOffset + ','+uheight+');\n']);
							//subTrkArr.push([ crX, '\tTrack[\'Ground\'].Position(0,'+uheight+');\n']);
							
							if (typeof SwGLkey != 'undefined') {
								tmpTxt1 += '\tRepeater[\''+SwGLkey+'\'].End();\n';
							}
							if (typeof SwOWLkey != 'undefined') {
								tmpTxt1 += '\tRepeater[\''+SwOWLkey+'\'].End();\n';
							}
							
							if (typeof SwGRkey != 'undefined') {
								tmpTxt1 += '\tRepeater[\''+SwGRkey+'\'].End();\n';
							}
							if (typeof SwOWRkey != 'undefined') {
								tmpTxt1 += '\tRepeater[\''+SwOWRkey+'\'].End();\n';
							}

							if (typeof SwEntkey != 'undefined') {
								tmpTxt += '\tStructure[\''+SwEntkey+'\'].Put0(, 1, 5);\n';
							}
							
							tmpTxt += '\tCabIlluminance.Interpolate(1);\n';
							tmpTxt += '\tRollingNoise.Change(4);\n';
							
							if (typeof SeIWLkey != 'undefined') {
								tmpTxt2 += '\tRepeater[\''+SeIWLkey+'\'].Begin0(, 1, '+iRpt+', '+iRpt+',\''+SeIWLkey+'\');\n';
							}
							if (typeof SeIWRkey != 'undefined') {
								tmpTxt2 += '\tRepeater[\''+SeIWRkey+'\'].Begin0(, 1, '+iRpt+', '+iRpt+',\''+SeIWRkey+'\');\n';
							}								
							tmpTxt2 += '\tCabIlluminance.Interpolate(0);\n';
							
							subTrkArr.push([crX-iRpt, tmpTxt1]);	
							subTrkArr.push([crX, tmpTxt]);	
							subTrkArr.push([crX+iRpt, tmpTxt2]);	
							
							
						} else {
							//parallel track, cek trek terkanan atau terkiri
							var leftestIndex = 0; var rightestIndex = 0;
							var leftestX = 0; var rightestX = 0;
							for (pTi = 0; pTi < paralellTrack.length; pTi++) {
								if (paralellTrack[pTi][1] <= leftestX) {
									leftestX = paralellTrack[pTi][1];
									leftestIndex = paralellTrack[pTi][0];
								}
								if (paralellTrack[pTi][1] >= rightestX) {
									rightestX = paralellTrack[pTi][1];
									rightestIndex = paralellTrack[pTi][0];
								}
							}
							
							subTrkArr.push([ crX, '\tTrack[\'groundL\'].Position('+ leftestX + ','+uheight+');\n']);
							subTrkArr.push([ crX, '\tTrack[\'groundR\'].Position('+ rightestX + ','+uheight+');\n']);
							//subTrkArr.push([ crX, '\tTrack[\'Ground\'].Position(0,'+uheight+');\n']);
					
							if (typeof SwGLkey != 'undefined') {
								tmpTxt1 += '\tRepeater[\''+SwGLkey+'\'].End();\n';
							}
							if (typeof SwOWLkey != 'undefined') {
								tmpTxt1 += '\tRepeater[\''+SwOWLkey+'\'].End();\n';
							}
							
							if (typeof SwGRkey != 'undefined') {
								tmpTxt1 += '\tRepeater[\''+SwGRkey+'\'].End();\n';
							}
							if (typeof SwOWRkey != 'undefined') {
								tmpTxt1 += '\tRepeater[\''+SwOWRkey+'\'].End();\n';
							}

							if (typeof SwEntkey != 'undefined') {
								tmpTxt += '\tStructure[\''+SwEntkey+'\'].Put0(, 1, 5);\n';
							}
							
							tmpTxt += '\tCabIlluminance.Interpolate(1);\n';
							tmpTxt += '\tRollingNoise.Change(4);\n';
							
							if (typeof SeIWLkey != 'undefined') {
								if (leftestIndex == 0) {
									tmpTxt2 += '\tRepeater[\''+SeIWLkey+'\'].Begin0(, 1, '+iRpt+', '+iRpt+',\''+SeIWLkey+'\');\n';
								} else {
									tmpTxt2 += '\tRepeater[\''+SeIWLkey+'\'].Begin0(\'' + leftestIndex + '\', 1, '+iRpt+', '+iRpt+',\''+SeIWLkey+'\');\n';
								}
							}
							if (typeof SeIWRkey != 'undefined') {
								if (rightestIndex == 0) {
									tmpTxt2 += '\tRepeater[\''+SeIWRkey+'\'].Begin0(, 1, '+iRpt+', '+iRpt+',\''+SeIWRkey+'\');\n';
								} else {
									tmpTxt2 += '\tRepeater[\''+SeIWRkey+'\'].Begin0(\'' + rightestIndex + '\', 1, '+iRpt+', '+iRpt+',\''+SeIWRkey+'\');\n';
								}								
							}								
							tmpTxt2 += '\tCabIlluminance.Interpolate(0);\n';
							
							subTrkArr.push([crX-iRpt, tmpTxt1]);
							subTrkArr.push([crX, tmpTxt]);	
							subTrkArr.push([crX+iRpt, tmpTxt2]);	
						}
						
						break;	
					
					}
				}
				
  			} else if (arrK_1[1] == '2') {
				for (swg = 0; swg < bveUGObjArr.length; swg++) {
					// #0 subway start, down-slope
					if (bveUGObjArr[swg][1] == arrK_1[0]) {
					
						var SwGLkey, SwGRkey, SwOWLkey, SwOWRkey;
						var SeIWLkey, SeIWRkey, SwExtkey;
						
						var SwGLx = bveUGObjArr[swg][4].replace(/[/]/g,'\\');
						var SwGRx = bveUGObjArr[swg][5].replace(/[/]/g,'\\');
						var SwOWLx = bveUGObjArr[swg][7].replace(/[/]/g,'\\');
						var SwOWRx = bveUGObjArr[swg][8].replace(/[/]/g,'\\');

						var SeIWLx = bveUGObjArr[swg][11].replace(/[/]/g,'\\');
						var SeIWRx = bveUGObjArr[swg][12].replace(/[/]/g,'\\');
						var SwExtx = bveUGObjArr[swg][14].replace(/[/]/g,'\\');

						var gRpt = parseFloat(bveUGObjArr[swg][6]);			
						var oRpt = parseFloat(bveUGObjArr[swg][9]);			
						var iRpt = parseFloat(bveUGObjArr[swg][13]);
						
						
						for (key in structure) {
							if (structure[key][2] == 'subway') {
								if (structure[key][0] == SwGLx) {
									SwGLkey = key;
									structure[key][1]++;
								}
								if (structure[key][0] == SwGRx) {
									SwGRkey = key;
									structure[key][1]++;
								}
								if (structure[key][0] == SwOWLx) {
									SwOWLkey = key;
									structure[key][1]++;
								}
								if (structure[key][0] == SwOWRx) {
									SwOWRkey = key;
									structure[key][1]++;
								}
								
								if (structure[key][0] == SeIWLx) {
									SeIWLkey = key;
									structure[key][1]++;
								}
								if (structure[key][0] == SeIWRx) {
									SeIWRkey = key;
									structure[key][1]++;
								}
								if (structure[key][0] == SwExtx) {
									SwExtkey = key;
									structure[key][1]++;
								}
								
							}
						}
						
						var tmpTxt = '';
						var tmpTxt2 = '';
						//var tmpTxt1 = '';
						
						if (paralellTrack.length == 0) {
							subTrkArr.push([ crX, '\tTrack[\'groundL\'].Position(-'+stOffset + ','+uheight+');\n']);
							subTrkArr.push([ crX, '\tTrack[\'groundR\'].Position('+ stOffset + ','+uheight+');\n']);
							//subTrkArr.push([ crX, '\tTrack[\'Ground\'].Position(0,'+uheight+');\n']);

							if (typeof SeIWLkey != 'undefined') {
								tmpTxt += '\tRepeater[\''+SeIWLkey+'\'].End();\n';
							}
							if (typeof SeIWRkey != 'undefined') {
								tmpTxt += '\tRepeater[\''+SeIWRkey+'\'].End();\n';
							}
							tmpTxt += '\tCabIlluminance.Interpolate(0);\n';
							
							if (typeof SwExtkey != 'undefined') {
								tmpTxt += '\tStructure[\''+SwExtkey+'\'].Put0(, 1, 5);\n';
							}							
							if (typeof SwGLkey != 'undefined') {
								tmpTxt2 += '\tRepeater[\''+SwGLkey+'\'].Begin0(\'groundL\', 1, '+gRpt+', '+gRpt+',\''+SwGLkey+'\');\n';
							}
							if (typeof SwOWLkey != 'undefined') {
								tmpTxt2 += '\tRepeater[\''+SwOWLkey+'\'].Begin0(\'groundL\', 1, '+oRpt+', '+oRpt+',\''+SwOWLkey+'\');\n';
							}
							
							if (typeof SwGRkey != 'undefined') {
								tmpTxt2 += '\tRepeater[\''+SwGRkey+'\'].Begin0(\'groundR\', 1, '+gRpt+', '+gRpt+',\''+SwGRkey+'\');\n';
							}
							if (typeof SwOWRkey != 'undefined') {
								tmpTxt2 += '\tRepeater[\''+SwOWRkey+'\'].Begin0(\'groundR\', 1, '+oRpt+', '+oRpt+',\''+SwOWRkey+'\');\n';
							}

							tmpTxt2 += '\tRollingNoise.Change(0);\n';
							tmpTxt2 += '\tCabIlluminance.Interpolate(1);\n';
							
							subTrkArr.push([crX-iRpt, tmpTxt]);	
							subTrkArr.push([crX, tmpTxt2]);	
							//subTrkArr.push([crX+iRpt, tmpTxt1]);	
							
						} else {
							//parallel track, cek trek terkanan atau terkiri
							var leftestIndex = 0; var rightestIndex = 0;
							var leftestX = 0; var rightestX = 0;
							for (pTi = 0; pTi < paralellTrack.length; pTi++) {
								if (paralellTrack[pTi][1] <= leftestX) {
									leftestX = paralellTrack[pTi][1];
									leftestIndex = paralellTrack[pTi][0];
								}
								if (paralellTrack[pTi][1] >= rightestX) {
									rightestX = paralellTrack[pTi][1];
									rightestIndex = paralellTrack[pTi][0];
								}
							}
							
							subTrkArr.push([ crX, '\tTrack[\'groundL\'].Position('+ leftestX + ','+uheight+');\n']);
							subTrkArr.push([ crX, '\tTrack[\'groundR\'].Position('+ rightestX + ','+uheight+');\n']);
							//subTrkArr.push([ crX, '\tTrack[\'Ground\'].Position(0,'+uheight+');\n']);
					
							if (typeof SeIWLkey != 'undefined') {
								tmpTxt += '\tRepeater[\''+SeIWLkey+'\'].End();\n';
							}
							if (typeof SeIWRkey != 'undefined') {
								tmpTxt += '\tRepeater[\''+SeIWRkey+'\'].End();\n';
							}
							tmpTxt += '\tCabIlluminance.Interpolate(0);\n';
							
							if (typeof SwExtkey != 'undefined') {
								tmpTxt += '\tStructure[\''+SwExtkey+'\'].Put0(, 1, 5);\n';
							}		
							
							if (typeof SwGLkey != 'undefined') {
								tmpTxt2 += '\tRepeater[\''+SwGLkey+'\'].Begin0(\'groundL\', 1, '+gRpt+', '+gRpt+',\''+SwGLkey+'\');\n';
							}
							if (typeof SwOWLkey != 'undefined') {
								tmpTxt2 += '\tRepeater[\''+SwOWLkey+'\'].Begin0(\'groundL\', 1, '+oRpt+', '+oRpt+',\''+SwOWLkey+'\');\n';
							}
							
							if (typeof SwGRkey != 'undefined') {
								tmpTxt2 += '\tRepeater[\''+SwGRkey+'\'].Begin0(\'groundR\', 1, '+gRpt+', '+gRpt+',\''+SwGRkey+'\');\n';
							}
							if (typeof SwOWRkey != 'undefined') {
								tmpTxt2 += '\tRepeater[\''+SwOWRkey+'\'].Begin0(\'groundR\', 1, '+oRpt+', '+oRpt+',\''+SwOWRkey+'\');\n';
							}

							tmpTxt2 += '\tRollingNoise.Change(0);\n';
							tmpTxt2 += '\tCabIlluminance.Interpolate(1);\n';
							
							subTrkArr.push([crX-iRpt, tmpTxt]);	
							subTrkArr.push([crX, tmpTxt2]);	
							//subTrkArr.push([crX+iRpt, tmpTxt1]);	
						}
						
						break;	
					
					}
				}
				
  			} else if (arrK_1[1] == '3') {
				noteTrkArr.push([ crX,'subway end']);
				for (swg = 0; swg < bveUGObjArr.length; swg++) {
					// #0 subway start, down-slope
					if (bveUGObjArr[swg][1] == arrK_1[0]) {
					
						var SwGLkey, SwGRkey, SwOWLkey, SwOWRkey;
						
						var SwGLx = bveUGObjArr[swg][4].replace(/[/]/g,'\\');
						var SwGRx = bveUGObjArr[swg][5].replace(/[/]/g,'\\');
						var SwOWLx = bveUGObjArr[swg][7].replace(/[/]/g,'\\');
						var SwOWRx = bveUGObjArr[swg][8].replace(/[/]/g,'\\');

						var gRpt = parseFloat(bveUGObjArr[swg][6]);			
						var oRpt = parseFloat(bveUGObjArr[swg][9]);			
						
						
						for (key in structure) {
							if (structure[key][2] == 'subway') {
								if (structure[key][0] == SwGLx) {
									SwGLkey = key;
									structure[key][1]++;
								}
								if (structure[key][0] == SwGRx) {
									SwGRkey = key;
									structure[key][1]++;
								}
								if (structure[key][0] == SwOWLx) {
									SwOWLkey = key;
									structure[key][1]++;
								}
								if (structure[key][0] == SwOWRx) {
									SwOWRkey = key;
									structure[key][1]++;
								}
								
							}							
							
						}
						
						var tmpTxt = '';
						
						if (paralellTrack.length == 0) {
							subTrkArr.push([ crX, '\tTrack[\'groundL\'].Position(-'+stOffset + ','+lastheight+');\n']);
							subTrkArr.push([ crX, '\tTrack[\'groundR\'].Position('+ stOffset + ','+lastheight+');\n']);
							
							if (typeof SwGLkey != 'undefined') {
								tmpTxt += '\tRepeater[\''+SwGLkey+'\'].End();\n';
							}
							if (typeof SwOWLkey != 'undefined') {
								tmpTxt += '\tRepeater[\''+SwOWLkey+'\'].End();\n';
							}
							
							if (typeof SwGRkey != 'undefined') {
								tmpTxt += '\tRepeater[\''+SwGRkey+'\'].End();\n';
							}
							if (typeof SwOWRkey != 'undefined') {
								tmpTxt += '\tRepeater[\''+SwOWRkey+'\'].End();\n';
							}
							
						} else {
							//parallel track, cek trek terkanan atau terkiri
							var leftestIndex = 0; var rightestIndex = 0;
							var leftestX = 0; var rightestX = 0;
							for (pTi = 0; pTi < paralellTrack.length; pTi++) {
								if (paralellTrack[pTi][1] <= leftestX) {
									leftestX = paralellTrack[pTi][1];
									leftestIndex = paralellTrack[pTi][0];
								}
								if (paralellTrack[pTi][1] >= rightestX) {
									rightestX = paralellTrack[pTi][1];
									rightestIndex = paralellTrack[pTi][0];
								}
							}
							
							subTrkArr.push([ crX, '\tTrack[\'groundL\'].Position('+ leftestX + ','+lastheight+');\n']);
							subTrkArr.push([ crX, '\tTrack[\'groundR\'].Position('+ rightestX + ','+lastheight+');\n']);
							
							if (typeof SwGLkey != 'undefined') {
								tmpTxt += '\tRepeater[\''+SwGLkey+'\'].End();\n';
							}
							if (typeof SwOWLkey != 'undefined') {
								tmpTxt += '\tRepeater[\''+SwOWLkey+'\'].End();\n';
							}
							
							if (typeof SwGRkey != 'undefined') {
								tmpTxt += '\tRepeater[\''+SwGRkey+'\'].End();\n';
							}
							if (typeof SwOWRkey != 'undefined') {
								tmpTxt += '\tRepeater[\''+SwOWRkey+'\'].End();\n';
							}
						}

						subTrkArr.push([crX, tmpTxt]);
						//subTrkArr.push([ crX, '\tTrack[\'Ground\'].Position(0,'+lastheight+');\n']);
						subTrkArr.push([ crX, '\tRepeater[\'Ground\'].Begin0(\'Ground\', 1, 25, 25,\'' + lastground + '\');\n']);
						
						break;	
					
					}
				}
				
  			} else {
				alert('4testing: bugs drop');
			}
		}
 
	}
	
	if (kdata.form != '') {
		var formArr = kdata.form.split('¤');
		
		if (formArr.length >2) {
			//['1','FormD2','Form Domestik 2','bve5/form2.jpg','shared/form/forml_5m.x','shared/form/formcl_5m_1.x','shared/form/formcr_5m_1.x','shared/form/formr_5m.x','5','shared/form/roofl2_1.x','shared/form/roofcl2_1.x','shared/form/roofcr2_1.x','shared/form/roofr2_1.x','25'];
			
			for (f1 = 0; f1 < bveplatformObjArr.length; f1++) {			
				if (bveplatformObjArr[f1][1] == formArr[0]) {
					
					var FrLkey,FrCLkey,FrCRkey,FrRkey;
					var RfLkey,RfCLkey,RfCRkey,RfRkey;
					
					var FrLx = bveplatformObjArr[f1][4].replace(/[/]/g,'\\');
					var FrCLx = bveplatformObjArr[f1][5].replace(/[/]/g,'\\');
					var FrCRX = bveplatformObjArr[f1][6].replace(/[/]/g,'\\');
					var FrRX = bveplatformObjArr[f1][7].replace(/[/]/g,'\\');
					var RfLX = bveplatformObjArr[f1][9].replace(/[/]/g,'\\');
					var RfCLX = bveplatformObjArr[f1][10].replace(/[/]/g,'\\');
					var RfCRX = bveplatformObjArr[f1][11].replace(/[/]/g,'\\');
					var RfRX = bveplatformObjArr[f1][12].replace(/[/]/g,'\\');
						
					var fX = parseInt(bveplatformObjArr[f1][8]);			
					var Rpt = parseInt(bveplatformObjArr[f1][13]);			
					
					for (key in structure) {
						if (structure[key][0] == FrLx) {
							FrLkey = key;
							structure[key][1]++;
						}
						if (structure[key][0] == FrCLx) {
							FrCLkey = key;
							structure[key][1]++;
						}
						if (structure[key][0] == FrCRX) {
							FrCRkey = key;
							structure[key][1]++;
						}
						if (structure[key][0] == FrRX) {
							FrRkey = key;
							structure[key][1]++;
						}
						if (structure[key][0] == RfLX) {
							RfLkey = key;
							structure[key][1]++;
						}
						if (structure[key][0] == RfCLX) {
							RfCLkey = key;
							structure[key][1]++;
						}
						if (structure[key][0] == RfCRX) {
							RfCRkey = key;
							structure[key][1]++;
						}
						if (structure[key][0] == RfRX) {
							RfRkey = key;
							structure[key][1]++;
						}
					}
					
					//get default melody
					var xDepMkey,xDepMx;
										
					for (i = 0; i < bveaudioObjArr.length; i++) {
						if (bveaudioObjArr[i][3] == 'Melody') {
							xDepMx = bveaudioObjArr[i][4].replace(/[/]/g,'\\');
							break;
						}
					}
					
					for (key in sound) {
						if (sound[key][0] == xDepMx) {
							xDepMkey = key;
							sound[key][1]++;
							break;
						}
					}	

					//	MapToolbar.features["lineTab"][pid].markers.getAt(idx).kdata.form = formstr + ',' + staName + ',' + staID + ',' + stopD + ',' + stopT + ',' + fcar + ',' + formSide;
					var stop = (formArr[4] == '1')? 'S' : 'B';
					var passAlarm = (formArr[4] == '1')? '1' : '0';
					var door = '0';
					var formSideArr = formArr[6].split('/');
					var fLen = parseInt(formArr[7]);

					for (fs = 0; fs < formSideArr.length; fs++) {
						var formSide = formSideArr[fs].split(':');				
						if (formSide[0] == pid && formSide[1] == 'L') {
							door = '-1';
							break;
						} else if (formSide[0] == pid && formSide[1] == 'R') {
							door = '1';
							break;
						} else {					
							if (formSide[0] == pid) {
								door = '1';
								break;
							} 
							if (formSide[1] == pid) {
								door = '-1';
								break;
							}					
						}
					}
					var stacount = 0;
					for (key in station) {
						if (station[key] != '') {
							if (station[key][1] > 0) {
								stacount++;
							}
						}
					}					
					//stationKey1, stationName1, arrivalTime1, depertureTime1, stoppageTime1, defaultTime1, signalFlag1, alightingTime1, passengers1, arrivalSoundKey1, depertureSoundKey1, doorReopen1, stuckInDoor1
					if (stacount == 0) {
						station[formArr[2]] = [formArr[1] + ',8:00:00,8:00:'+formArr[3]+',' + formArr[3] + ',,1,0,0.4,,' + xDepMkey + ',0.1,0',1,'sta',0];
					} else{
						station[formArr[2]] = [formArr[1] + ',,,' + formArr[3] + ',,1,0,0.4,,' + xDepMkey + ',0.1,0',1,'sta',0];
					}
					curSta = [formArr[2],door];
										
					var formTxt = '';
					// paralellTrack[0] = [RailIndex,X,Y,pid]; // data : railindex, x-distance from main track, y-height --- 2 study
					for (fs = 0; fs < formSideArr.length; fs++) {
					
						var formSide = formSideArr[fs].split(':');
																					
						for (pTi = 0; pTi < paralellTrack.length; pTi++) {
							if (formSide[0] == paralellTrack[pTi][3]) {
								formSide[0] = formSide[0].replace(paralellTrack[pTi][3],paralellTrack[pTi][0]);
							}					
							if (formSide[1] == paralellTrack[pTi][3]) {
								formSide[1] = formSide[1].replace(paralellTrack[pTi][3],paralellTrack[pTi][0]);
							}					
						}
						
					
						if (formSide[0] == pid) { 
							formSide[0] = '0';
						}
						if (formSide[1] == pid) { 
							formSide[1] = '0';
						}
						
						if (formSide[1] == 'L') {
							if (typeof FrLkey != 'undefined') {
								if (formSide[0] == '0') {
									subTrkArr.push([crX, '\tRepeater[\''+FrLkey+'_'+formSide[0]+'\'].Begin0(, 1, '+fX+', '+fX+',\''+FrLkey+'\');\n']);
								} else {
									subTrkArr.push([crX, '\tRepeater[\''+FrLkey+'_'+formSide[0]+'\'].Begin0(\''+formSide[0]+'\', 1, '+fX+', '+fX+',\''+FrLkey+'\');\n']);
								}
								
								subTrkArr.push([crX+fLen, '\tRepeater[\''+FrLkey+'_'+formSide[0]+'\'].End();\n']);									
							}
							if (typeof FrCLkey != 'undefined') {
								if (formSide[0] == '0') {
									subTrkArr.push([crX, '\tRepeater[\''+FrCLkey+'_'+formSide[0]+'\'].Begin0(, 1, '+fX+', '+fX+',\''+FrCLkey+'\');\n']);
								} else {
									subTrkArr.push([crX, '\tRepeater[\''+FrCLkey+'_'+formSide[0]+'\'].Begin0(\''+formSide[0]+'\', 1, '+fX+', '+fX+',\''+FrCLkey+'\');\n']);
								}
								
								subTrkArr.push([crX+fLen, '\tRepeater[\''+FrCLkey+'_'+formSide[0]+'\'].End();\n']);	
							}
							if (typeof RfLkey != 'undefined') {
								if (formSide[0] == '0') {
									subTrkArr.push([crX, '\tRepeater[\''+RfLkey+'_'+formSide[0]+'\'].Begin0(, 1, '+Rpt+', '+Rpt+',\''+RfLkey+'\');\n']);
								} else {
									subTrkArr.push([crX, '\tRepeater[\''+RfLkey+'_'+formSide[0]+'\'].Begin0(\''+formSide[0]+'\', 1, '+Rpt+', '+Rpt+',\''+RfLkey+'\');\n']);
								}
								
								subTrkArr.push([crX+fLen, '\tRepeater[\''+RfLkey+'_'+formSide[0]+'\'].End();\n']);									
							}
							if (typeof RfCLkey != 'undefined') {
								if (formSide[0] == '0') {
									subTrkArr.push([crX, '\tRepeater[\''+RfCLkey+'_'+formSide[0]+'\'].Begin0(, 1, '+Rpt+', '+Rpt+',\''+RfCLkey+'\');\n']);
								} else {
									subTrkArr.push([crX, '\tRepeater[\''+RfCLkey+'_'+formSide[0]+'\'].Begin0(\''+formSide[0]+'\', 1, '+Rpt+', '+Rpt+',\''+RfCLkey+'\');\n']);
								}
								
								subTrkArr.push([crX+fLen, '\tRepeater[\''+RfCLkey+'_'+formSide[0]+'\'].End();\n']);									
							}

						} else if (formSide[1] == 'R') {
							if (typeof FrCRkey != 'undefined') {
								if (formSide[0] == '0') {
									subTrkArr.push([crX, '\tRepeater[\''+FrCRkey+'_'+formSide[0]+'\'].Begin0(, 1, '+fX+', '+fX+',\''+FrCRkey+'\');\n']);
								} else {
									subTrkArr.push([crX, '\tRepeater[\''+FrCRkey+'_'+formSide[0]+'\'].Begin0(\''+formSide[0]+'\', 1, '+fX+', '+fX+',\''+FrCRkey+'\');\n']);
								}
								
								subTrkArr.push([crX+fLen, '\tRepeater[\''+FrCRkey+'_'+formSide[0]+'\'].End();\n']);									
							}
							if (typeof FrRkey != 'undefined') {
								if (formSide[0] == '0') {
									subTrkArr.push([crX, '\tRepeater[\''+FrRkey+'_'+formSide[0]+'\'].Begin0(, 1, '+fX+', '+fX+',\''+FrRkey+'\');\n']);
								} else {
									subTrkArr.push([crX, '\tRepeater[\''+FrRkey+'_'+formSide[0]+'\'].Begin0(\''+formSide[0]+'\', 1, '+fX+', '+fX+',\''+FrRkey+'\');\n']);
								}
								
								subTrkArr.push([crX+fLen, '\tRepeater[\''+FrRkey+'_'+formSide[0]+'\'].End();\n']);									
							}
							if (typeof RfCRkey != 'undefined') {
								if (formSide[0] == '0') {
									subTrkArr.push([crX, '\tRepeater[\''+RfCRkey+'_'+formSide[0]+'\'].Begin0(, 1, '+Rpt+', '+Rpt+',\''+RfCRkey+'\');\n']);
								} else {
									subTrkArr.push([crX, '\tRepeater[\''+RfCRkey+'_'+formSide[0]+'\'].Begin0(\''+formSide[0]+'\', 1, '+Rpt+', '+Rpt+',\''+RfCRkey+'\');\n']);
								}
								
								subTrkArr.push([crX+fLen, '\tRepeater[\''+RfCRkey+'_'+formSide[0]+'\'].End();\n']);									
							}
							if (typeof RfRkey != 'undefined') {
								if (formSide[0] == '0') {
									subTrkArr.push([crX, '\tRepeater[\''+RfRkey+'_'+formSide[0]+'\'].Begin0(, 1, '+Rpt+', '+Rpt+',\''+RfRkey+'\');\n']);
								} else {
									subTrkArr.push([crX, '\tRepeater[\''+RfRkey+'_'+formSide[0]+'\'].Begin0(\''+formSide[0]+'\', 1, '+Rpt+', '+Rpt+',\''+RfRkey+'\');\n']);
								}
								
								subTrkArr.push([crX+fLen, '\tRepeater[\''+RfRkey+'_'+formSide[0]+'\'].End();\n']);									
							}							
						
						} else {
							if (typeof FrLkey != 'undefined') {
								if (formSide[1] == '0') {
									subTrkArr.push([crX, '\tRepeater[\''+FrLkey+'_'+formSide[1]+'\'].Begin0(, 1, '+fX+', '+fX+',\''+FrLkey+'\');\n']);
								} else {
									subTrkArr.push([crX, '\tRepeater[\''+FrLkey+'_'+formSide[1]+'\'].Begin0(\''+formSide[1]+'\', 1, '+fX+', '+fX+',\''+FrLkey+'\');\n']);
								}
								
								subTrkArr.push([crX+fLen, '\tRepeater[\''+FrLkey+'_'+formSide[1]+'\'].End();\n']);
							}
							//2do 2/4/2017 : ambil salah satu sahaja
							/*
							if (typeof FrCLkey != 'undefined') {
								var Xd = 0;
								while (Xd < fLen) {
									subTrkArr.push([(crX+Xd), '\tStructure[\''+FrCLkey+'\'].PutBetween(' + formSide[0] + ',' + formSide[1] + ');\n']);
									Xd += fX;
								}									
							} */
							if (typeof FrCRkey != 'undefined') {
								var Xd = 0;
								while (Xd < fLen) {
									if (formSide[0] == '0') {
										subTrkArr.push([(crX+Xd), '\tStructure[\''+FrCRkey+'\'].PutBetween(,\'' + formSide[1] + '\');\n']);
									} else if (formSide[1] == '0') {
										subTrkArr.push([(crX+Xd), '\tStructure[\''+FrCRkey+'\'].PutBetween(\'' + formSide[0] + '\',);\n']);
									} else {
										subTrkArr.push([(crX+Xd), '\tStructure[\''+FrCRkey+'\'].PutBetween(\'' + formSide[0] + '\',\'' + formSide[1] + '\');\n']);
									}

									
									Xd += fX;
								}
							}
							if (typeof FrRkey != 'undefined') {
								if (formSide[0] == '0') {
									subTrkArr.push([crX, '\tRepeater[\''+FrRkey+'_'+formSide[0]+'\'].Begin0(, 1, '+fX+', '+fX+',\''+FrRkey+'\');\n']);
								} else {
									subTrkArr.push([crX, '\tRepeater[\''+FrRkey+'_'+formSide[0]+'\'].Begin0(\''+formSide[0]+'\', 1, '+fX+', '+fX+',\''+FrRkey+'\');\n']);
								}
								
								subTrkArr.push([crX+fLen, '\tRepeater[\''+FrRkey+'_'+formSide[0]+'\'].End();\n']);									
							}
							if (typeof RfLkey != 'undefined') {
								if (formSide[1] == '0') {
									subTrkArr.push([crX, '\tRepeater[\''+RfLkey+'_'+formSide[1]+'\'].Begin0(, 1, '+Rpt+', '+Rpt+',\''+RfLkey+'\');\n']);
								} else {
									subTrkArr.push([crX, '\tRepeater[\''+RfLkey+'_'+formSide[1]+'\'].Begin0(\''+formSide[1]+'\', 1, '+Rpt+', '+Rpt+',\''+RfLkey+'\');\n']);
								}
								
								subTrkArr.push([crX+fLen, '\tRepeater[\''+RfLkey+'_'+formSide[1]+'\'].End();\n']);									
								
							}
							//2do 2/4/2017 : ambil salah satu sahaja
							/*
							if (typeof RfCLkey != 'undefined') {
								var Xd = 0;
								while (Xd < fLen) {
									subTrkArr.push([(crX+Xd), '\tStructure[\''+RfCLkey+'\'].PutBetween(' + formSide[0] + ',' + formSide[1] + ');\n']);
									Xd += Rpt;
								}
							} */
							if (typeof RfCRkey != 'undefined') {
								var Xd = 0;
								while (Xd < fLen) {
									if (formSide[0] == '0') {
										subTrkArr.push([(crX+Xd), '\tStructure[\''+RfCRkey+'\'].PutBetween(,\'' + formSide[1] + '\');\n']);
									} else if (formSide[1] == '0') {
										subTrkArr.push([(crX+Xd), '\tStructure[\''+RfCRkey+'\'].PutBetween(\'' + formSide[0] + '\',);\n']);
									} else {
										subTrkArr.push([(crX+Xd), '\tStructure[\''+RfCRkey+'\'].PutBetween(\'' + formSide[0] + '\',\'' + formSide[1] + '\');\n']);
									}
								
									Xd += Rpt;
								}									
							}
							if (typeof RfRkey != 'undefined') {
								if (formSide[0] == '0') {
									subTrkArr.push([crX, '\tRepeater[\''+RfRkey+'_'+formSide[0]+'\'].Begin0(, 1, '+Rpt+', '+Rpt+',\''+RfRkey+'\');\n']);
								} else {
									subTrkArr.push([crX, '\tRepeater[\''+RfRkey+'_'+formSide[0]+'\'].Begin0(\''+formSide[0]+'\', 1, '+Rpt+', '+Rpt+',\''+RfRkey+'\');\n']);
								}
								
								subTrkArr.push([crX+fLen, '\tRepeater[\''+RfRkey+'_'+formSide[0]+'\'].End();\n']);
							}						
						}						
						
					}
					
					if (stsign) { 
						//subTrkArr.push([ crX-1000, '.FreeObj 0;14;-2;0;0,;st near sign,']); 
						if (parseInt(maxspeed) >150) {
							if (crX-1500 >=0) { 
								subTrkArr.push([ crX-1500, '\tStructure[\'sign_stap\'].Put(, -2, -0.3, 0, 0, 0, 0, 0, 0);\n']); 
								noteTrkArr.push([ crX-1500,'st near sign']);								
								structure['sign_stap'][1]++;
							}
						} else if (parseInt(maxspeed) >100) {
							if (crX-1000 >=0) { 
								subTrkArr.push([ crX-1000, '\tStructure[\'sign_stap\'].Put(, -2, -0.3, 0, 0, 0, 0, 0, 0);\n']); 
								noteTrkArr.push([ crX-1000,'st near sign']);								
								structure['sign_stap'][1]++;
							}
						} else if (parseInt(maxspeed) >75) {
							if (crX-600 >=0) { 
								subTrkArr.push([ crX-600, '\tStructure[\'sign_stap\'].Put(, -2, -0.3, 0, 0, 0, 0, 0, 0);\n']); 
								noteTrkArr.push([ crX-600,'st near sign']);								
								structure['sign_stap'][1]++;
							}
						} else {
							if (crX-200 >=0) { 
								subTrkArr.push([ crX-200, '\tStructure[\'sign_stap\'].Put(, -2, -0.3, 0, 0, 0, 0, 0, 0);\n']); 
								noteTrkArr.push([ crX-200,'st near sign']);								
								structure['sign_stap'][1]++;
							}
						}				
					}	
						
					break;
					
				}		
			}

				
			
		} else {
			//	MapToolbar.features["lineTab"][pid].markers.getAt(idx+1).kdata.form = stopS + ',' + stopO;
			if (formArr[0] == '1') {
				var stopPoint = crX - parseInt(formArr[1]);
				var dor = parseInt(curSta[1]);
				
				//curSta = [formArr[2],door];
				subTrkArr.push([ stopPoint, '\tStation[\''+curSta[0]+'\'].Put('+dor+', -2, 2);\n']);
				subTrkArr.push([ stopPoint, '\tStructure[\'sign_stop\'].Put(, '+(-2*dor)+', -0.3, 0, 0, 0, 0, 0, 0);\n']); 
				structure['sign_stop'][1]++;				
			}

			curSta = [];
			
		}

	}

	//proses pole hendaklah selepas form, bergantung pada GBForm
	if (kdata.pole != '') {
		crX = Math.round(currX/25)*25;
		
		var arrK = kdata.pole.split('¤');
		
		for (k = 0; k < arrK.length; k++) {
			var arrK_1 = arrK[k].split(':');
			if (arrK_1[1] == '0') {		
			
				for (p = 0; p < bvepoleObjArr.length; p++) {
					if (bvepoleObjArr[p][1] == arrK_1[0]) {
						var poleLkey,poleRkey,poleWkey;
						var poleLx = bvepoleObjArr[p][4].replace(/[/]/g,'\\');
						var poleRx = bvepoleObjArr[p][5].replace(/[/]/g,'\\');						
						var poleWx = bvepoleObjArr[p][6].replace(/[/]/g,'\\');						
						var PoleCycle = parseInt(bvepoleObjArr[p][7]);
						
						for (key in structure) {
							if (structure[key][0] == poleLx && poleLx!='') {
								poleLkey = key;
								structure[key][1]++;
								break;
							}
						}
						
						for (key in structure) {
							if (structure[key][0] == poleRx && poleRx!='') {
								poleRkey = key;
								structure[key][1]++;
								break;
							}
						}
						
						for (key in structure) {
							if (structure[key][0] == poleWx && poleWx!='') {
								poleWkey = key;
								structure[key][1]++;
								break;
							}
						}
						
						var tmpTxt = '';
						// ********* new *********
						if (paralellTrack.length == 0) {
							if (poleLkey !== undefined) {
								tmpTxt += '\tRepeater[\''+poleLkey+'\'].Begin0(, 1, '+PoleCycle+', '+PoleCycle+',\''+poleLkey+'\');\n';
								defaultPoleL = poleLkey;
							} else {
								if (poleRkey !== undefined) {
									tmpTxt += '\tRepeater[\''+poleRkey+'\'].Begin0(, 1, '+PoleCycle+', '+PoleCycle+',\''+poleRkey+'\');\n';
									defaultPoleR = poleRkey;
								}
							} 
							if (poleWkey !== undefined) {
								tmpTxt += '\tRepeater[\'ohwire_0\'].Begin0(, 1, '+PoleCycle+', '+PoleCycle+',\'' + poleWkey + '\');\n';
								//defaultohwirekey = poleWkey;
							}					
						} else {
							//parallel track, cek trek terkanan atau terkiri
							var leftestIndex = 0; var rightestIndex = 0;
							var leftestX = 0; var rightestX = 0;
							for (pTi = 0; pTi < paralellTrack.length; pTi++) {
								if (paralellTrack[pTi][1] <= leftestX) {
									leftestX = paralellTrack[pTi][1];
									leftestIndex = paralellTrack[pTi][0];
								}
								if (paralellTrack[pTi][1] >= rightestX) {
									rightestX = paralellTrack[pTi][1];
									rightestIndex = paralellTrack[pTi][0];
								}
								
								if (poleWkey !== undefined) {
									if (pTi>0) {
										tmpTxt += '\tRepeater[\'ohwire_'+pTi+'\'].Begin0(\'' + pTi + '\', 1, '+PoleCycle+', '+PoleCycle+',\'' + poleWkey + '\'); \n';
									} else {
										tmpTxt += '\tRepeater[\'ohwire_'+pTi+'\'].Begin0(, 1, '+PoleCycle+', '+PoleCycle+',\'' + poleWkey + '\'); \n';
									}	
								}														
								
							}

							if (poleLkey !== undefined) {
								tmpTxt += '\tRepeater[\''+poleLkey+'\'].Begin0(\'' + leftestIndex + '\', 1, '+PoleCycle+', '+PoleCycle+',\''+poleLkey+'\');\n';
							}
							if (poleRkey !== undefined) {
								tmpTxt += '\tRepeater[\''+poleRkey+'\'].Begin0(\'' + rightestIndex + '\', 1, '+PoleCycle+', '+PoleCycle+',\''+poleRkey+'\');\n';
							}
							
						}
						
						subTrkArr.push([crX, tmpTxt]);
						
						break;
					}
				}			
			} else {
				for (p = 0; p < bvepoleObjArr.length; p++) {
					if (bvepoleObjArr[p][1] == arrK_1[0]) {
						var poleLkey,poleRkey,poleWkey;
						var poleLx = bvepoleObjArr[p][4].replace(/[/]/g,'\\');
						var poleRx = bvepoleObjArr[p][5].replace(/[/]/g,'\\');						
						var poleWx = bvepoleObjArr[p][6].replace(/[/]/g,'\\');	
						
						for (key in structure) {
							if (structure[key][0] == poleLx && poleLx!='') {
								if (structure[key][1] > 0) {
									poleLkey = key;
								}
								break;
							}
						}

						for (key in structure) {
							if (structure[key][0] == poleRx && poleRx!='') {
								if (structure[key][1] > 0) {
									poleRkey = key;
								}
								break;
							}
						}
						
						for (key in structure) {
							if (structure[key][0] == poleWx && poleWx!='') {
								if (structure[key][1] > 0) {
									poleWkey = key;								
								}
								break;
							}
						}
						
						var tmpTxt = '';
						if (poleLkey !== undefined) {
							tmpTxt += '\tRepeater[\''+poleLkey+'\'].End();\n';
																
						}
						if (poleRkey !== undefined) {
							tmpTxt += '\tRepeater[\''+poleRkey+'\'].End();\n';
																
						}
						for (pTi = 0; pTi < paralellTrack.length; pTi++) {
							if (poleWkey !== undefined) {
								tmpTxt += '\tRepeater[\'ohwire_'+pTi+'\'].End();\n';
							}								
						}
//2do 29/4/2017 : retest ohwire end. replace poleOWx with poleWx
						subTrkArr.push([crX, tmpTxt]);
						
						break;					
					}					
				}
				
			}
		}
		
		//.Pole RailIndex; NumberOfAdditionalRails; Location; Interval; PoleStructureIndex
		
	}
	
	if (kdata.roadcross != '') {
		//[(0)'0',(1)'RC1067D',(2)'Road Crossing D 1067mm',(3)'bve5/crossingd.jpg',(4)'1067/crossing/tollbardl.x', (5)'1067/crossing/crossingd.x',(6)'1067/crossing/tollbardr.x',(7)'sounds/Crossing.wav'];
		var rcname = kdata.roadcross.split('¤') ;
		noteTrkArr.push([ crX,'roadcross']);
		var leftestIndex = 0; var rightestIndex = 0;
		var leftestX = 0; var rightestX = 0;
		for (pTi = 0; pTi < paralellTrack.length; pTi++) {
			if (paralellTrack[pTi][1] <= leftestX) {
				leftestX = paralellTrack[pTi][1];
				leftestIndex = paralellTrack[pTi][0];
			}
			if (paralellTrack[pTi][1] >= rightestX) {
				rightestX = paralellTrack[pTi][1];
				rightestIndex = paralellTrack[pTi][0];
			}
		}

		
  		for (g = 0; g < bveRCObjArr.length; g++) {
			if (bveRCObjArr[g][1] == rcname[0]) {
				
				var RCLkey,RCCkey,RCRkey,RCSkey;
				
				var RCLx = bveRCObjArr[g][4].replace(/[/]/g,'\\');
				var RCCx = bveRCObjArr[g][5].replace(/[/]/g,'\\');
				var RCRx = bveRCObjArr[g][6].replace(/[/]/g,'\\');
				var RCSx = bveRCObjArr[g][7].replace(/[/]/g,'\\');
				
				for (key in structure) {
					if (structure[key][0] == RCLx && RCLx !='') {
						RCLkey = key;
						structure[key][1]++;
					}
					if (structure[key][0] == RCCx && RCCx !='') {
						RCCkey = key;
						structure[key][1]++;
					}
					if (structure[key][0] == RCRx && RCRx !='') {
						RCRkey = key;
						structure[key][1]++;
					}
				}
				
				for (key in sound3d) {
					if (sound3d[key][0] == RCSx && RCSx !='') {
						RCSkey = key;
						sound3d[key][1]++;
					}
				}						
				
				var tmpTxt = '';

				if (typeof RCLkey != 'undefined') {
					tmpTxt += '\tStructure[\''+RCLkey+'\'].Put(' + leftestIndex + ', 0, 0, 0, 0, 0, 0, 0, 0);\n';								
				}
				if (typeof RCCkey != 'undefined') {							
					if (paralellTrack.length == 0) {
						tmpTxt += '\tStructure[\''+RCCkey+'\'].Put(, 0, 0, 0, 0, 0, 0, 0, 0);\n';
					} else {
						tmpTxt += '\tStructure[\''+RCCkey+'\'].Put(, 0, 0, 0, 0, 0, 0, 0, 0);\n';
						for (pTi = 0; pTi < paralellTrack.length; pTi++) {
							tmpTxt += '\tStructure[\''+RCCkey+'\'].Put(' + paralellTrack[pTi][0] + ', 0, 0, 0, 0, 0, 0, 0, 0);\n';
						}
					}							
				}
				if (typeof RCRkey != 'undefined') {
					tmpTxt += '\tStructure[\''+RCRkey+'\'].Put(' + rightestIndex + ', 0, 0, 0, 0, 0, 0, 0, 0);\n';
				}
				if (typeof RCSkey != 'undefined') {
					var xOffset  = -3.2;
					for (pTi = 0; pTi < paralellTrack.length; pTi++) {
						if (paralellTrack[pTi][0] == leftestIndex) {
							xOffset += paralellTrack[pTi][1];
							break;
						}
					}
					tmpTxt += '\tSound3D[\''+RCSkey+'\'].Put(' + xOffset + ', 2.7);\n';							
				}

				subTrkArr.push([currX, tmpTxt]);					
				break;	
			}
		}		
	}
	
	if (kdata.crack != '') {
		//[(0)'0',(1)'BalCrk1',(2)'Ballast Crack 1',(3)'bve5/cr-ballastl1_1.jpg',(4)'shared/crack/ballast/ballastl1_1.x', (5)'shared/crack/ballast/ballastr1_1.x',(6)'25'];
		/*
			polyBaseLine.markers.getAt(wst).kdata.crack = crack + ':0:[' + pid1 + '//' + pid2 + ']'; 
			polyBaseLine.markers.getAt(wed).kdata.crack = crack + ':1:[' + pid1 + '//' + pid2 + ']'; 		
		*/
		var crkArr = kdata.crack.split(':');
		var crkID = crkArr[0];
		var crkType = parseInt(crkArr[1]);
		
		if (crkType === 0) {
			var crkPairArr = crkArr[2].split('][');
			crkPairArr[0] = crkPairArr[0].replace('[','');
			if (crkPairArr.length > 0) { crkPairArr[crkPairArr.length - 1] = crkPairArr[crkPairArr.length -1].replace(']',''); }
			
			for (csi = 0; csi < bvecrackObjArr.length; csi++) {
				if (bvecrackObjArr[csi][1] == crkID) {
					// for (ci = 0; ci < Crack.length; ci++) {
						var CrLkey,CrRkey;
					
						var CrLx = bvecrackObjArr[csi][4].replace(/[/]/g,'\\');
						var CrRx = bvecrackObjArr[csi][5].replace(/[/]/g,'\\');
						var crackCycle = parseInt(bvecrackObjArr[csi][6]);
						
						for (key in structure) {
							if (structure[key][0] == CrLx && CrLx !='') {
								CrLkey = key;
								structure[key][1]++;
							}
							if (structure[key][0] == CrRx && CrRx !='') {
								CrRkey = key;
								structure[key][1]++;
							}
						}
						/*
						if (Crack[ci][0] == CrLx) {
							Crack[ci][1]++;
							GBcrack[0] = ci;
							break;
						} */
						if (paralellTrack.length > 0) {
							var tmpTxt = '';		
							for (pTi = 0; pTi < paralellTrack.length; pTi++) {
								for (cPi = 0; cPi < crkPairArr.length; cPi++) {								
									crkPairArr[cPi] = crkPairArr[cPi].replace(paralellTrack[pTi][3],paralellTrack[pTi][0]);
								}
							}
							
							//#4 main line @ line_1
							for (cPi0 = 0; cPi0 < crkPairArr.length; cPi0++) {								
								crkPairArr[cPi0] = crkPairArr[cPi0].replace(pid,'');
							}
							
							var cPair = [];
							
							for (cPi2 = 0; cPi2 < crkPairArr.length; cPi2++) {								
								var crkPair = crkPairArr[cPi2].split('//');
								cPair.push([crkPair[0],crkPair[1],0,0,0]);
								
							}
							for (pTi2 = 0; pTi2 < paralellTrack.length; pTi2++) {
								for (cPi3 = 0; cPi3 < cPair.length; cPi3++) {								
									if (cPair[cPi3][0] == paralellTrack[pTi2][0]) {
										cPair[cPi3][2] = paralellTrack[pTi2][1];
									}
									if (cPair[cPi3][1] == paralellTrack[pTi2][0]) {
										cPair[cPi3][3] = paralellTrack[pTi2][1];
									}								
								}
							}
							
							for (cPi4 = 0; cPi4 < cPair.length; cPi4++) {
								if (parseFloat(cPair[cPi4][2]) <= parseFloat(cPair[cPi4][3])) {
									tmpTxt += '\tStructure[\''+CrRkey+'\'].PutBetween(' + cPair[cPi4][0] + ',' + cPair[cPi4][1] + ');\n';	
								} else {
									tmpTxt += '\tStructure[\''+CrLkey+'\'].PutBetween(' + cPair[cPi4][0] + ',' + cPair[cPi4][1] + ');\n';	
								}
							}
							
							
							//ProcesskData5(kdata,currX,pid,idx,stsign,maxspeed) 
							//2do 1/1/2017
							var testPoly = MapToolbar.features['lineTab'][pid];
							var poins = testPoly.getPath().getArray();
							var Xstop = 0;
							
							
							for (var tpi = idx; tpi < poins.length; tpi++)   { 
								if (testPoly.markers.getAt(tpi).kdata.crack != '') {
									var crkArr2 = testPoly.markers.getAt(tpi).kdata.crack.split(':');
									var crkID2 = crkArr2[0];
									var crkType2 = parseInt(crkArr2[1]);
									
									if (crkID2 == crkID) {
										if (crkArr2[2] == crkArr[2]) {
											if (crkType2 === 1) {
												var xC = getTrackDistanceFromStart(pid,tpi);  //distance { 'Lpoly' : Lpoly, 'LwCurve' : LwCurve, 'LwPitch' : LwPitch}	
												var Xstop = xC.LwPitch;
												
												break;
											}
										}
									}
									
								}
							}

							//2do
							var Xdc = currX;
							while (Xdc <= Xstop) {
								subTrkArr.push([Xdc, tmpTxt]);
								Xdc += crackCycle;
							}
								
						}
						
					// }
					break;
				}
			}			
		}
		
	
		//.Crack RailIndex1; RailIndex2; CrackStructureIndex
  		//subTrkArr.push([ currX, '.Crack ' + gr ]);

		//GBcrack
		//subTrkArr.push([ currX, '.Height ' + kdata.height]);
		// paralellTrack[0] = [RailIndex,X,Y,pid]; // data : railindex, x-distance from main track, y-height --- 2 study
	}
	
	if (kdata.beacon != '') {
		//subTrkArr.push([ currX, '.Height ' + kdata.height]);
	}
	
	
}

function ProcessSLine5(sline,currX,stIdx,edIdx,cIdx,gauge) {
//2do : create others map
	var linesArr = sline.split('¤');
	crX = Math.round(currX/5)*5;
	
	//2do 7/12/2016 - get key pair
	var halfGauge = gauge/2;
	/*
	for (a = 0; a < bverailobjArr.length; a++) {
		if (bverailobjArr[a][6].replace(/[/]/g,'\\') == defaultrailbaseX) {
			//1
			var xs1a = (bverailobjArr[a][9] != '') ? bverailobjArr[a][9].replace(/[/]/g,'\\') : '';
			var xl1a = (bverailobjArr[a][10] != '') ? bverailobjArr[a][10].replace(/[/]/g,'\\') : '';
			var xr1a = (bverailobjArr[a][11] != '') ? bverailobjArr[a][11].replace(/[/]/g,'\\') : '';
			
			//2
			var xs2a = (bverailobjArr[a][12] != '') ? bverailobjArr[a][12].replace(/[/]/g,'\\') : '';
			var xl2a = (bverailobjArr[a][13] != '') ? bverailobjArr[a][13].replace(/[/]/g,'\\') : '';
			var xr2a = (bverailobjArr[a][14] != '') ? bverailobjArr[a][14].replace(/[/]/g,'\\') : '';
			
			//3
			var xs3a = (bverailobjArr[a][15] != '') ? bverailobjArr[a][15].replace(/[/]/g,'\\') : '';
			var xl3a = (bverailobjArr[a][16] != '') ? bverailobjArr[a][16].replace(/[/]/g,'\\') : '';
			var xr3a = (bverailobjArr[a][17] != '') ? bverailobjArr[a][17].replace(/[/]/g,'\\') : '';
			
			//4
			var xs4a = (bverailobjArr[a][18] != '') ? bverailobjArr[a][18].replace(/[/]/g,'\\') : '';
			var xl4a = (bverailobjArr[a][19] != '') ? bverailobjArr[a][19].replace(/[/]/g,'\\') : '';
			var xr4a = (bverailobjArr[a][20] != '') ? bverailobjArr[a][20].replace(/[/]/g,'\\') : '';	

			for (key in structure) {
				if (structure[key][0] == xs1a) {
					sleeper1 = key;
					structure[key][1]++;
				}
				if (structure[key][0] == xl1a) {
					rail1L = key;
					structure[key][1]++;
				}
				if (structure[key][0] == xr1a) {
					rail1R = key;
					structure[key][1]++;
				}
				
				if (structure[key][0] == xs2a) {
					sleeper2 = key;
					structure[key][1]++;
				}
				if (structure[key][0] == xl2a) {
					rail2L = key;
					structure[key][1]++;
				}
				if (structure[key][0] == xr2a) {
					rail2R = key;
					structure[key][1]++;
				}
				
				if (structure[key][0] == xs3a) {
					sleeper3 = key;
					structure[key][1]++;
				}
				if (structure[key][0] == xl3a) {
					rail3L = key;
					structure[key][1]++;
				}
				if (structure[key][0] == xr3a) {
					rail3R = key;
					structure[key][1]++;
				}
				
				if (structure[key][0] == xs4a) {
					sleeper4 = key;
					structure[key][1]++;
				}
				if (structure[key][0] == xl4a) {
					rail4L = key;
					structure[key][1]++;
				}
				if (structure[key][0] == xr4a) {
					rail4R = key;
					structure[key][1]++;
				}

			}								
			break;
		}
	} */
	
	for (li = 0; li < linesArr.length; li++) {
		var sArr = linesArr[li].split(':');
		//sline = '(side line 1 id):(0=start,>0 end):index:sideline_uid,(side line 2 id):(0=start,>0 end):index:sideline_uid,,,,....';
		//newPoly.markers.getAt(0).lineX = baseline_id + ':' + side + ':' + startOffset + ':' + stSwlength + ':' + baseline_uid;
		//newPoly.markers.getAt(newPoly.markers.length-1).lineX = baseline_id + ':' + side + ':' + endOffset + ':' + edSwlength + ':' + baseline_uid;
		try {
			if (typeof MapToolbar.features['lineTab'][sArr[0]] != 'undefined') {
				var s_polyL = MapToolbar.features['lineTab'][sArr[0]];
				var lXarr = s_polyL.markers.getAt(parseInt(sArr[2])).lineX.split(':'); //.getAt(0).lineX = pid1 + ':' + (-1*side) + ':0:' + ti3;
			
				if (sArr[1] == '0') { //side line start
				
					var stOffset = parseFloat(lXarr[2]);
					var stSwlength = (lXarr[3] != '') ? parseFloat(lXarr[3]) : 0; 
					var side = (parseFloat(lXarr[1]) < 0) ? -1 : 1;
			
					//alert(stOffset + ' / ' + stSwlength);
				
					if (stSwlength != 0) {
						var lXarr2 = s_polyL.markers.getAt(1).lineX.split(':'); // .getAt(1).lineX = pid1 + ':' + (-1*side) + ':' + wi3 + ':';
						var n = 0;
						var currOffset = side*stOffset;					 
						var turnoutratio = (parseFloat(lXarr2[2])-stOffset) / stSwlength;
						var railIdx = 1;  
						var offs2 = side*parseFloat(lXarr2[2]);
						
						for (p = 0; p < paralellTrack.length; p++) {
							if (paralellTrack[p][0] == railIdx) {
								railIdx ++;  																			
							} else {
								break;
							}
						}

						
						if (cIdx >= stIdx && cIdx <= edIdx) { 
							subTrkArr.push([ crX, '\tTrack[\'' + railIdx + '\'].Cant.SetGauge('+ gauge +');\n']); 
							subTrkArr.push([ crX, '\tTrack[\'' + railIdx + '\'].Position('+ side*stOffset + ',0);\n']); 
							
							if ( sleeper1 === undefined && sleeper2 === undefined && sleeper3 === undefined && sleeper4 === undefined ) {
								subTrkArr.push([ crX, '\tRepeater[\'sleeper_' + railIdx + '\'].Begin(\'' + railIdx + '\', 0, 0, 0, 0, 0, 0, 3, 5, 5,\'' +  defaultrailbasekey + '\');\n']);								
							} else {
								//tmpTxt += '\tRepeater[\'sleeper_0\'].Begin(, 0, 0, 0, 0, 0, 0, 3, 5, 5,\'' + defaultrailbasekey +'\', \''+ sleeper1 +'\', \''+ sleeper2 +'\', \''+ sleeper3 +'\', \''+ sleeper4 + '\');\n';
								subTrkArr.push([ crX, '\tRepeater[\'sleeper_' + railIdx + '\'].Begin(\'' + railIdx + '\', 0, 0, 0, 0, 0, 0, 3, 5, 5,\'' + defaultrailbasekey + '\',\'' + sleeper1 + '\',\'' + sleeper2 + '\',\'' + sleeper3 + '\',\'' + sleeper4 + '\');\n']);
							}

							if ( rail1L === undefined && rail2L === undefined && rail3L === undefined && rail4L === undefined ) {	
								//tmpTxt += '\tRepeater[\'railL_0\'].Begin(, -' + halfGauge + ', 0, 0, 0, 0, 0, 3, 5, 5,\'' + defaultrailLkey + '\');\n';
								subTrkArr.push([ crX, '\tRepeater[\'railL_' + railIdx + '\'].Begin(\'' + railIdx + '\', -' + halfGauge + ', 0, 0, 0, 0, 0, 3, 5, 5,\'' + defaultrailLkey + '\');\n']);
							} else {
								//tmpTxt += '\tRepeater[\'railL_0\'].Begin(, -' + halfGauge + ', 0, 0, 0, 0, 0, 3, 5, 5,\'' + defaultrailLkey + '\', \''+ rail1L +'\', \''+ rail2L +'\', \''+ rail3L +'\', \''+ rail4L + '\');\n
								subTrkArr.push([ crX, '\tRepeater[\'railL_' + railIdx + '\'].Begin(\'' + railIdx + '\', -' + halfGauge + ', 0, 0, 0, 0, 0, 3, 5, 5,\'' + defaultrailLkey + '\',\'' + rail1L + '\',\'' + rail2L + '\',\'' + rail3L + '\',\'' + rail4L + '\');\n']);
							}		
							
							if ( rail1R === undefined && rail2R === undefined && rail3R === undefined && rail4R === undefined ) {
								//tmpTxt += '\tRepeater[\'railR_0\'].Begin(, ' + halfGauge + ', 0, 0, 0, 0, 0, 3, 5, 5,\'' + defaultrailRkey + '\');\n';
								subTrkArr.push([ crX, '\tRepeater[\'railR_' + railIdx + '\'].Begin(\'' + railIdx + '\', '+ halfGauge + ', 0, 0, 0, 0, 0, 3, 5, 5,\'' + defaultrailRkey + '\');\n']);
							} else {
								//tmpTxt += '\tRepeater[\'railR_0\'].Begin(, ' + halfGauge + ', 0, 0, 0, 0, 0, 3, 5, 5,\'' + defaultrailRkey + '\', \''+ rail1R +'\', \''+ rail2R +'\', \''+ rail3R +'\', \''+ rail4R + '\');\n';
								subTrkArr.push([ crX, '\tRepeater[\'railR_' + railIdx + '\'].Begin(\'' + railIdx + '\', '+ halfGauge + ', 0, 0, 0, 0, 0, 3, 5, 5,\'' + defaultrailRkey + '\',\'' + rail1R + '\',\'' + rail2R + '\',\'' + rail3R + '\',\'' + rail4R + '\');\n']);
							}
							//subTrkArr.push([ crX, '\tRepeater[\'railR_' + railIdx + '\'].Begin(\'' + railIdx + '\', 0, 0, 0, 0, 0, 0, 3, 5, 5,\'' + defaultrailRkey + '\',\'' + defaultrailRkey + '\',\'' + defaultrailRkey + '\',\'' + defaultrailRkey + '\',\'' + defaultrailRkey + '\');\n']);
							//alert('defaultohwirekey : ' + defaultohwirekey);
							if (defaultohwirekey !== undefined) {
								subTrkArr.push([ crX, '\tRepeater[\'ohwire_' + railIdx + '\'].Begin(\'' + railIdx + '\', 0, 0, 0, 0, 0, 0, 1, 25, 25,\'' + defaultohwirekey + '\');\n']); 
							} 
							if (stOffset == 0) {
								subTrkArr.push([ crX, '\tJointNoise.Play(0);\n']);
							}
						}
						n++;
						
						while ( n*25 < stSwlength ) {
							currOffset = Math.round((side*stOffset + side * turnoutratio * n * 25)* 1000) / 1000;
							if (cIdx >= stIdx && cIdx <= edIdx) { 
								//subTrkArr.push([(crX + n*5), '.Rail ' + railIdx + ';' + currOffset + ';0;' + defaultRailIndex]); 
								subTrkArr.push([(crX + n*25) , '\tTrack[\'' + railIdx + '\'].Position('+ currOffset + ',0);\n']);
							}
							n ++;
						}
						//if (cIdx >= stIdx && cIdx <= edIdx) { subTrkArr.push([(crX + n*25),'.Rail ' + railIdx + ';' + offs2 + ';0;' + defaultRailIndex]); }
						paralellTrack.push([railIdx,offs2,0,sArr[0],parseInt(sArr[2])]);
									
					} else {
						var railIdx = 1;  											
						for (p = 0; p < paralellTrack.length; p++) {
							if (paralellTrack[p][0] == railIdx) {
								railIdx ++;  																			
							} else {
								break;
							}
						}
			

						if (cIdx >= stIdx && cIdx <= edIdx) { 
							subTrkArr.push([ crX, '\tTrack[\'' + railIdx + '\'].Cant.SetGauge('+ gauge +');\n']); 
							subTrkArr.push([ crX, '\tTrack[\'' + railIdx + '\'].Position('+ side*stOffset + ',0);\n']); 
							
							if ( sleeper1 !== undefined && sleeper2 !== undefined && sleeper3 !== undefined && sleeper4 !== undefined ) {
								subTrkArr.push([ crX, '\tRepeater[\'sleeper_' + railIdx + '\'].Begin(\'' + railIdx + '\', 0, 0, 0, 0, 0, 0, 3, 5, 5,\'' + defaultrailbasekey + '\',\'' + sleeper1 + '\',\'' + sleeper2 + '\',\'' + sleeper3 + '\',\'' + sleeper4 + '\');\n']);
							} else {
								subTrkArr.push([ crX, '\tRepeater[\'sleeper_' + railIdx + '\'].Begin(\'' + railIdx + '\', 0, 0, 0, 0, 0, 0, 3, 5, 5,\'' +  defaultrailbasekey + '\');\n']);
							}

							if ( rail1L !== undefined && rail2L !== undefined && rail3L !== undefined && rail4L !== undefined ) {
								subTrkArr.push([ crX, '\tRepeater[\'railL_' + railIdx + '\'].Begin(\'' + railIdx + '\', -' + halfGauge + ', 0, 0, 0, 0, 0, 3, 5, 5,\'' + defaultrailLkey + '\',\'' + rail1L + '\',\'' + rail2L + '\',\'' + rail3L + '\',\'' + rail4L + '\');\n']);
							} else {
								subTrkArr.push([ crX, '\tRepeater[\'railL_' + railIdx + '\'].Begin(\'' + railIdx + '\', -' + halfGauge + ', 0, 0, 0, 0, 0, 3, 5, 5,\'' + defaultrailLkey + '\');\n']);
							}		
							
							if ( rail1R !== undefined && rail2R !== undefined && rail3R !== undefined && rail4R !== undefined ) {
								subTrkArr.push([ crX, '\tRepeater[\'railR_' + railIdx + '\'].Begin(\'' + railIdx + '\','+ halfGauge + ', 0, 0, 0, 0, 0, 3, 5, 5,\'' + defaultrailRkey + '\',\'' + rail1R + '\',\'' + rail2R + '\',\'' + rail3R + '\',\'' + rail4R + '\');\n']);
							} else {
								subTrkArr.push([ crX, '\tRepeater[\'railR_' + railIdx + '\'].Begin(\'' + railIdx + '\','+ halfGauge + ', 0, 0, 0, 0, 0, 3, 5, 5,\'' + defaultrailRkey + '\');\n']);
							}
							
							if (defaultohwirekey !== undefined) {
								subTrkArr.push([ crX, '\tRepeater[\'ohwire_' + railIdx + '\'].Begin(\'' + railIdx + '\', 0, 0, 0, 0, 0, 0, 1, 25, 25,\'' + defaultohwirekey + '\');\n']); 
							}

						}
						paralellTrack.push([railIdx,side*stOffset,0,sArr[0],parseInt(sArr[2])]);
					}
					
				} else {
					var endOffset = parseFloat(lXarr[2]);
					//var edSwlength = (lXarr[3] != '') ? parseFloat(lXarr[3]) : 0;
					var side0 = (parseFloat(lXarr[1]) < 0) ? -1 : 1;
					var si0 = 0;
					var si1 = parseInt(sArr[2]);	
					
					for (p = 0; p < paralellTrack.length; p++) {
						if (paralellTrack[p][3] == sArr[0]) {
							railIdx = paralellTrack[p][0];
							si0 = paralellTrack[p][4] + 1;
							paralellTrack.splice(p, 1);
							break;						
						}
					}
						
					//sline = '(side line 1 id):(0=start,>0 end):index:sideline_uid,   (side line 2 id):(0=start,>0 end):index:sideline_uid,,,,....';
					//newPoly.markers.getAt(0).lineX = baseline_id + ':' + side + ':' + startOffset + ':' + stSwlength + ':' + baseline_uid;
					//newPoly.markers.getAt(newPoly.markers.length-1).lineX = baseline_id + ':' + side + ':' + endOffset + ':' + edSwlength + ':' + baseline_uid;	
												
					for (i = si0; i < si1; i++) {
						var sLxD = 0;
						if (s_polyL.markers.getAt(i).lineX != '') {							
							var slDarr = s_polyL.markers.getAt(i).lineX.split(':');
							
							if (slDarr[4] != '') {
								for (j=0;j< MapToolbar.features['lineTab'][lXarr[0]].markers.getLength();j++) {
									if (slDarr[4] == MapToolbar.features['lineTab'][lXarr[0]].markers.getAt(j).uid) {
										sLxD = getTrackDistanceFromStart(lXarr[0],j).LwPitch;
										sLxD = Math.round(sLxD/25)*25;
										break;
									}
								}
							} else {
								var e1 = s_polyL.markers.getAt(i).getPosition();
								var j = formLineWidenAddAt(lXarr[0], e1);
								var preD = getTrackDistanceFromStart(lXarr[0],j).LwPitch;

								var Hca = google.maps.geometry.spherical.computeHeading(e1,MapToolbar.features['lineTab'][lXarr[0]].markers.getAt(j+1).getPosition());
								var Hab = google.maps.geometry.spherical.computeHeading(MapToolbar.features['lineTab'][lXarr[0]].markers.getAt(j).getPosition(),MapToolbar.features['lineTab'][lXarr[0]].markers.getAt(j+1).getPosition());
								var Hcb = google.maps.geometry.spherical.computeHeading(e1,MapToolbar.features['lineTab'][lXarr[0]].markers.getAt(j+1).getPosition());
								var Hba = google.maps.geometry.spherical.computeHeading(MapToolbar.features['lineTab'][lXarr[0]].markers.getAt(j+1).getPosition(),MapToolbar.features['lineTab'][lXarr[0]].markers.getAt(j).getPosition());
					
								var Xac = google.maps.geometry.spherical.computeDistanceBetween(MapToolbar.features['lineTab'][lXarr[0]].markers.getAt(j).getPosition(),e1);
								var Xbc = google.maps.geometry.spherical.computeDistanceBetween(MapToolbar.features['lineTab'][lXarr[0]].markers.getAt(j+1).getPosition(),e1);
								var Xab = google.maps.geometry.spherical.computeDistanceBetween(MapToolbar.features['lineTab'][lXarr[0]].markers.getAt(j).getPosition(),MapToolbar.features['lineTab'][lXarr[0]].markers.getAt(j+1).getPosition());
					
								var angleA = intersection_angle(Hca,Hab).angle ;
								var angleB = intersection_angle(Hcb,Hba).angle ; 
					
								var Xcc2a = Xac * Math.sin(angleA.toRad());
								var Xcc2b = Xbc * Math.sin(angleB.toRad()); 
					
								var Xac2 = Math.abs(Xac * Math.cos(angleA.toRad()));
								var Xbc2 = Math.abs(Xbc * Math.cos(angleB.toRad()));
								
								sLxD = preD + Xac2;
								sLxD = Math.round(sLxD/25)*25;
							}
							

							var stOffset = parseFloat(s_polyL.markers.getAt(i).lineX.split(':')[2]);
							var stSwlength = (slDarr[3] != '') ? parseFloat(slDarr[3]) : 0; 
							var side = (parseFloat(slDarr[1]) < 0) ? -1 : 1;
								
							if (stSwlength != 0) {
								var lXarr2 = s_polyL.markers.getAt(i+1).lineX.split(':'); // .getAt(1).lineX = pid1 + ':' + (-1*side) + ':' + wi3 + ':';
								var n = 0;
								var currOffset = side*stOffset;					 
								var turnoutratio = (parseFloat(lXarr2[2])-stOffset) / stSwlength;
									
								while ( n*25 < stSwlength ) {
									//currOffset = side*stOffset + side*(Math.round(turnoutratio * n * 25 * 100) / 100);
									currOffset = Math.round((side*stOffset + side * turnoutratio * n * 25)* 1000) / 1000;
									if (cIdx >= stIdx && cIdx <= edIdx) {
										//subTrkArr.push([(sLxD + n*5), '.Rail ' + railIdx + ';' + currOffset + ';0;' + defaultRailIndex]); 
										subTrkArr.push([(sLxD + n*25), '\tTrack[\'' + railIdx + '\'].Position('+ currOffset + ',0);\n']);
									}
									n ++;
								}								
							} else {
								if (cIdx >= stIdx && cIdx <= edIdx) { 
									//subTrkArr.push([ sLxD, '.Rail ' + railIdx + ';' + side*stOffset + ';0;' + defaultRailIndex ]); 
									subTrkArr.push([ sLxD, '\tTrack[\'' + railIdx + '\'].Position('+ side*stOffset+ ',0);\n']);
								}
							}	
							
								
						} else {
								
						}	
						
						//if (s_polyL.markers.getAt(i).curve != '') {
							
						//} else {

						//} 
					}
					
					//2do extent side line processing
					//setTimeout(function(){ code 2 run }, milliseconds);
						
					if (cIdx >= stIdx && cIdx <= edIdx) { 
						//subTrkArr.push([ crX, '.RailEnd ' + railIdx + ';' + side0*endOffset + ';0']); 
						subTrkArr.push([ crX, '\tTrack[\'' + railIdx + '\'].Position('+ side0*endOffset + ',0);\n']);
						subTrkArr.push([ crX, '\tRepeater[\'sleeper_' + railIdx + '\'].End();\n']);
						subTrkArr.push([ crX, '\tRepeater[\'railL_' + railIdx + '\'].End();\n']);
						subTrkArr.push([ crX, '\tRepeater[\'railR_' + railIdx + '\'].End();\n']);
						if (defaultohwirekey !== undefined) {
							subTrkArr.push([ crX, '\tRepeater[\'ohwire_' + railIdx + '\'].End();\n']);
						}
						if (endOffset == 0) {
							subTrkArr.push([ crX, '\tJointNoise.Play(0);\n']);
						}
					}				
				}
			} else {
				alert(sArr[0] + ' not defined.');
			}
			
		}
		catch(err) {
			teks += "[Error] : error in processing side line, on line " + sArr[0] + ' at distance ' + crX + ". \n" + err.message + ". \n";
		}		
	}	
}


function turnTxt5(turn,currX) {
	var slope = Math.round(turn * 1000) / 1000;
	//if (isNaN(slope)) { alert(turn); return false; }
	var crX = Math.round(currX/5)*5;
  
	var tmpTxt = '\tLegacy.Turn(' + slope + ');\n';
	if (slope == 0 || (slope > 0 && slope >= 1) || (slope < 0 && slope <= -1)) { return false; }
	
	subTrkArr.push([crX, tmpTxt]);	
}

function stoneMark5(maxlength) {
	var crX = 0;
	
	while ( crX <= maxlength ) {
		if (crX % 1000 == 0) { //every 1000m
			subTrkArr.push([ crX, '\tStructure[\'sign_kmp\'].Put(, 2, -0.4, 0, 0, 0, 0, 0, 0);\n']);
			structure['sign_kmp'][1]++;
		} else if (crX % 500 == 0) { //every 500m
			subTrkArr.push([ crX, '\tStructure[\'sign_500mp\'].Put(, 2, -0.4, 0, 0, 0, 0, 0, 0);\n']);
			structure['sign_500mp'][1]++;
		} else { //every 100m
			subTrkArr.push([ crX, '\tStructure[\'sign_100mp\'].Put(, 2, -0.4, 0, 0, 0, 0, 0, 0);\n']); 
			structure['sign_100mp'][1]++;
		}
		crX += 100;
	}
}

function speedlimitSign(V) {
	var txtStr = '';
	var r = Math.floor(V / 100);
	var p = Math.floor((V - (100 * r))/ 10);
	var s = V - (100*r) - (10*p);
	
	txtStr += '\tStructure[\'sign_spl_pole\'].Put(, -2.5, -0.2, 0, 0, 0, 0, 0, 0);\n'; //speedlimit sign
	txtStr += '\tStructure[\'sign_spl_back\'].Put(, -2.5, -0.2, 0, 0, 0, 0, 0, 0);\n'; //speedlimit sign
	structure['sign_spl_pole'][1]++;
	structure['sign_spl_back'][1]++;	
	
	//100 part
	if (r > 0) {
		txtStr += '\tStructure[\'sign_spl_' + r + '\'].Put(, -2.66, -0.2, 0, 0, 0, 0, 0, 0);\n'; //speedlimit sign
		structure['sign_spl_'+ r][1]++;
	}
	
	//10 part
	txtStr += '\tStructure[\'sign_spl_' + p + '\'].Put(, -2.48, -0.2, 0, 0, 0, 0, 0, 0);\n'; //speedlimit sign
	structure['sign_spl_'+ p][1]++;
	
	//1 part
	txtStr += '\tStructure[\'sign_spl_' + s + '\'].Put(, -2.3, -0.2, 0, 0, 0, 0, 0, 0);\n'; //speedlimit sign
	structure['sign_spl_'+ s][1]++;
	
	return txtStr;
}
