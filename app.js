
// Enhanced WebGL demo with audio-reactive controls and screenshot
const canvas = document.getElementById('glcanvas');
const gl = canvas.getContext('webgl');

if (!gl) {
	const hint = document.getElementById('hint');
	if (hint) hint.innerText = 'WebGL not supported in this browser.';
	throw new Error('WebGL not supported');
}

// Resize canvas to full window (account for devicePixelRatio)
function resize() {
	const dpr = window.devicePixelRatio || 1;
	canvas.width = Math.max(1, Math.floor(window.innerWidth * dpr));
	canvas.height = Math.max(1, Math.floor(window.innerHeight * dpr));
	canvas.style.width = window.innerWidth + 'px';
	canvas.style.height = window.innerHeight + 'px';
	gl.viewport(0, 0, canvas.width, canvas.height);
}
window.addEventListener('resize', resize);
resize();

// Vertex shader
const vsSource = `
attribute vec2 position;
void main(){ gl_Position = vec4(position, 0.0, 1.0); }
`;

// Fragment shader with audio/reactive uniforms
const fsSource = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_audio; // 0..1
uniform float u_glow; // user glow
uniform float u_speed; // user speed

mat2 rot(float a){float c=cos(a), s=sin(a); return mat2(c,-s,s,c);}
float sdSphere(vec3 p, float r){return length(p)-r;}

float map(vec3 p, float t){
	vec3 q = p;
	q.xz *= rot(t*0.2 + length(p.xy)*0.08 + u_audio*0.6);
	float s = sdSphere(q - vec3(sin(t*0.8 + u_audio*4.0)*1.2, sin(t*0.7 + u_audio*3.0)*0.6, cos(t*0.9 + u_audio*2.0)*0.8), 1.0 + u_audio*0.3);
	float s2 = sdSphere(q - vec3(cos(t*0.9)*1.1, cos(t*0.5)*0.5, sin(t*0.8 + u_audio)*0.5), 0.6 + u_audio*0.2);
	return min(s, s2);
}

vec3 calcNormal(vec3 p, float t){
	float e=0.0008;
	return normalize(vec3(
		map(p+vec3(e,0,0),t)-map(p-vec3(e,0,0),t),
		map(p+vec3(0,e,0),t)-map(p-vec3(0,e,0),t),
		map(p+vec3(0,0,e),t)-map(p-vec3(0,0,e),t)
	));
}

float raymarch(vec3 ro, vec3 rd, float t){
	float dist=0.0;
	for(int i=0;i<100;i++){
		vec3 p = ro + rd*dist;
		float d = map(p,t);
		if(d<0.001) return dist;
		dist += d*0.85;
		if(dist>60.0) break;
	}
	return 1e5;
}

void main(){
	vec2 uv = (gl_FragCoord.xy / u_res) * 2.0 - 1.0;
	uv.x *= u_res.x / u_res.y;
	float t = u_time * u_speed;

	vec3 ro = vec3(0.0, 0.0, 4.0 - u_audio*1.2);
	vec2 m = (u_mouse / u_res) * 2.0 - 1.0;
	ro.xz *= rot(m.x*1.6 + u_audio*0.6);
	ro.yz *= rot(-m.y*1.2);
	vec3 rd = normalize(vec3(uv, -1.6));
	rd.xz *= rot(m.x*1.6 + u_audio*0.4);

	float dist = raymarch(ro, rd, t);
	vec3 col = vec3(0.01, 0.006, 0.02) + 0.18*vec3(0.04,0.01,0.08)*pow(1.0 - exp(-t*0.02),2.0);

	if(dist < 1e4){
		vec3 p = ro + rd*dist;
		vec3 n = calcNormal(p,t);
		vec3 light = normalize(vec3(-0.6 + u_audio*0.3, 0.6, 1.0));
		float dif = clamp(dot(n, light), 0.0, 1.0);
		float spec = pow(max(dot(reflect(rd,n), light), 0.0), 48.0 + u_audio*30.0);
		vec3 base = mix(vec3(0.3,0.15,0.05), vec3(0.9,0.45,0.2), smoothstep(0.0,1.0,u_audio));
		col = mix(col, base * dif * (1.0 + u_audio*1.2), 0.95);
		col += vec3(1.0,0.9,1.2)*spec*0.9;
	}

	// Glow-like effect using radial blur approximation
	float r = length(uv);
	float glow = exp(-r*2.0) * u_glow * (0.6 + u_audio*1.2);
	col += vec3(0.2,0.08,0.28) * glow;

	// Color tweak
	col = pow(col, vec3(0.95, 0.98, 1.02));
	col = clamp(col, 0.0, 1.8);
	gl_FragColor = vec4(col,1.0);
}
`;

function compileShader(src, type){
	const sh = gl.createShader(type);
	gl.shaderSource(sh, src);
	gl.compileShader(sh);
	if(!gl.getShaderParameter(sh, gl.COMPILE_STATUS)){
		console.error(gl.getShaderInfoLog(sh));
		throw new Error('Shader compile failed');
	}
	return sh;
}

const vs = compileShader(vsSource, gl.VERTEX_SHADER);
const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);

const program = gl.createProgram();
gl.attachShader(program, vs);
gl.attachShader(program, fs);
gl.bindAttribLocation(program, 0, 'position');
gl.linkProgram(program);
if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
	console.error(gl.getProgramInfoLog(program));
	throw new Error('Program link failed');
}
gl.useProgram(program);

// Fullscreen quad
const quad = new Float32Array([-1,-1, 1,-1, -1,1, 1,1]);
const buf = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buf);
gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);
gl.enableVertexAttribArray(0);
gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

// Uniforms
const u_res = gl.getUniformLocation(program, 'u_res');
const u_time = gl.getUniformLocation(program, 'u_time');
const u_mouse = gl.getUniformLocation(program, 'u_mouse');
const u_audio = gl.getUniformLocation(program, 'u_audio');
const u_glow = gl.getUniformLocation(program, 'u_glow');
const u_speed = gl.getUniformLocation(program, 'u_speed');

let start = performance.now();
let mouse = [canvas.width/2, canvas.height/2];

// Audio setup
let audioCtx = null;
let analyser = null;
let dataArray = null;
let sourceNode = null;
let audioEl = null;
let isMicOn = false;

function ensureAudio(){
	if(audioCtx) return;
	const AC = window.AudioContext || window.webkitAudioContext;
	audioCtx = new AC();
	analyser = audioCtx.createAnalyser();
	analyser.fftSize = 1024;
	const bufferLength = analyser.frequencyBinCount;
	dataArray = new Uint8Array(bufferLength);
}

async function toggleMic(){
	if(isMicOn){
		// turn off
		if(sourceNode && sourceNode.mediaStream) sourceNode.mediaStream.getTracks().forEach(t=>t.stop());
		if(sourceNode) sourceNode.disconnect();
		sourceNode = null;
		isMicOn = false;
		document.getElementById('mic').innerText = 'Mic: Off';
		return;
	}
	try{
		ensureAudio();
		const stream = await navigator.mediaDevices.getUserMedia({audio:true});
		const src = audioCtx.createMediaStreamSource(stream);
		src.mediaStream = stream;
		src.connect(analyser);
		sourceNode = src;
		isMicOn = true;
		document.getElementById('mic').innerText = 'Mic: On';
	}catch(e){
		console.warn('Mic access failed', e);
	}
}

// Load audio file and play
function handleFile(file){
	if(!file) return;
	ensureAudio();
	if(audioEl){ audioEl.pause(); audioEl.src = ''; }
	audioEl = new Audio();
	audioEl.src = URL.createObjectURL(file);
	audioEl.crossOrigin = 'anonymous';
	audioEl.loop = true;
	audioEl.play();
	const src = audioCtx.createMediaElementSource(audioEl);
	src.connect(analyser);
	src.connect(audioCtx.destination);
	sourceNode = src;
	document.getElementById('mic').innerText = 'Mic: File';
}

// Get simple audio level (RMS-like)
function getAudioLevel(){
	if(!analyser) return 0.0;
	analyser.getByteFrequencyData(dataArray);
	let sum = 0;
	for(let i=0;i<dataArray.length;i++) sum += dataArray[i];
	const avg = sum / dataArray.length / 255.0;
	return avg;
}

// Animate
function animate(){
	const now = performance.now();
	const t = (now - start) * 0.001;
	gl.uniform2f(u_res, canvas.width, canvas.height);
	gl.uniform1f(u_time, t);
	gl.uniform2f(u_mouse, mouse[0], mouse[1]);
	const audioLevel = getAudioLevel();
	const sens = parseFloat(document.getElementById('sens').value || '1');
	const glowVal = parseFloat(document.getElementById('glow').value || '0.8');
	const speedVal = parseFloat(document.getElementById('speed').value || '1');
	gl.uniform1f(u_audio, Math.min(1.0, audioLevel * sens));
	gl.uniform1f(u_glow, glowVal);
	gl.uniform1f(u_speed, speedVal);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// Mouse / touch
function setMouse(e){
	if(e.touches){ const t = e.touches[0]; mouse = [t.clientX * (window.devicePixelRatio||1), t.clientY * (window.devicePixelRatio||1)]; }
	else mouse = [e.clientX * (window.devicePixelRatio||1), e.clientY * (window.devicePixelRatio||1)];
}
window.addEventListener('mousemove', setMouse);
window.addEventListener('touchmove', setMouse);

// UI: fullscreen toggle
const toggle = document.getElementById('toggle');
if(toggle){ toggle.addEventListener('click', async ()=>{ try{ if(!document.fullscreenElement) await document.documentElement.requestFullscreen(); else await document.exitFullscreen(); }catch(e){console.warn(e);} }); }

// Mic button
document.getElementById('mic').addEventListener('click', async ()=>{
	await toggleMic();
});

// File input
document.getElementById('file').addEventListener('change', (ev)=>{
	const f = ev.target.files && ev.target.files[0];
	if(f) handleFile(f);
});

// Screenshot
document.getElementById('screenshot').addEventListener('click', ()=>{
	try{
		const data = canvas.toDataURL('image/png');
		const a = document.createElement('a');
		a.href = data;
		a.download = 'shader-screenshot.png';
		document.body.appendChild(a);
		a.click();
		a.remove();
	}catch(e){console.warn('Screenshot failed', e);}
});

// Ensure canvas resize after fullscreen changes
document.addEventListener('fullscreenchange', ()=>{ setTimeout(resize, 60); });


