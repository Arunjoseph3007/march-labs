export const FragmentSrc = `#version 300 es
precision highp float;
in vec2 pos;
out vec4 outColor;

struct Material {
  vec3 color;
  float bumpSize;
};

struct Circle {
  vec3 center;
  float radius;
  int materialId;
};

uniform vec3 u_mouse;
uniform vec2 u_resolution;
uniform vec3 u_lookFrom;
uniform vec3 u_lookAt;
uniform vec3 u_directLight;
uniform Circle u_circles[5];
uniform Material u_materials[5];

mat2 rot(float a){
  float c = cos(a);
  float s = sin(a);
  return mat2(c,s,-s,c);
}

#define MAX_STEPS 100
#define MAX_DIST 100.
#define MIN_DIST 0.01
#define PI 3.141592
#define RGB(X,Y,Z) vec3(X,Y,Z)/255.0

float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float rand(vec3 p){
  vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}

vec3 GetRayDir(vec2 uv, vec3 from, vec3 lookat, float fov) {
  vec3 upDir = vec3(0,1,0);
  vec3 camDir = normalize(lookat-from);
  vec3 r = normalize(cross(upDir, camDir));
  vec3 u = cross(camDir,r);
  vec3 c = camDir*fov;
  vec3 i = c + uv.x*r + uv.y*u;
  return normalize(i);
}

float circleSDF(vec3 pos, Circle cir){
  float bs = u_materials[cir.materialId].bumpSize;
  return length(cir.center - pos) - cir.radius + bs*rand(pos*10.);
}

vec3 rep(vec3 p, vec2 factor){
  return p;
	vec2 tmp = mod(p.xz, factor) - 0.5*factor;
	return vec3(tmp.x, p.y, tmp.y);
}


vec2 getDist(vec3 pos){
  float dist = pos.y+2.;
  float materialId = 0.;

  for(int i = 0; i < u_circles.length(); i++){
    Circle c = u_circles[i];
    float cDist = circleSDF(rep(pos, vec2(5)), c);
    if(cDist < dist){
      dist = cDist;
      materialId = float(c.materialId);
    }
  }

  return vec2(dist, materialId);
}

vec3 getNormal(vec3 pos){
  float d = getDist(pos).x;
  
  vec3 n = d - vec3(
      getDist(vec3(pos.x - .01, pos.y,       pos.z)).x,
      getDist(vec3(pos.x,       pos.y - .01, pos.z)).x,
      getDist(vec3(pos.x,       pos.y,       pos.z - .01)).x
  );
  
  return normalize(n);
}

vec3 rayMarch(vec3 org, vec3 dir){
  float depth = 0.0;
  float minT = 999999.0;
  float material = -1.;

  for(int i = 0; i < MAX_STEPS; i++){
    vec3 pos = org + depth * dir;
    vec2 res = getDist(pos);
    float t = res.x;
    if(t<minT){
      minT = min(minT,t);
      material = res.y;
    }
    depth += t;
    if(t < MIN_DIST || depth > MAX_DIST) break;
  }

  return vec3(depth,minT,material);
}

vec3 skyBox(vec3 dir){
  return mix(vec3(1), RGB(117, 165, 240), dir.y);
}

void main(){
  vec3 col = vec3(1);
  
  vec2 fragCoord = pos*u_resolution;
  vec2 uv = fragCoord/u_resolution.y;
  vec2 m = u_mouse.xy/u_resolution.xy;

  vec3 org = u_lookFrom;
  // org.xz *= rot(-m.x*2.0*PI);
  
  vec3 dir = GetRayDir(uv, org, u_lookAt, .8);
  
  vec3 marchRes = rayMarch(org, dir);
  float t = marchRes.x;
  int material = int(marchRes.z);
  if(t < MAX_DIST){
    col = u_materials[material].color/255.;
    vec3 pos = org + dir * t;

    // Direct lighting
    vec3 normal = getNormal(pos);
    // col = vec3(1,0,1);
    col *= dot(normalize(u_directLight), normal)/2.0+0.4;

    // Shadow
    float shadowRadius = 5.0;
    vec3 lightDir = normalize(u_directLight-pos);
    vec3 shadowRes = rayMarch(pos + normal * 0.7, lightDir);
    float distToLight = shadowRes.x;
    if(shadowRes.y < MIN_DIST){
      float shadowFactor = 0.5;
      col *= shadowFactor;
    }else if(shadowRes.y < shadowRadius*MIN_DIST){
      col *= mix(0.5,1.0,shadowRes.y/(shadowRadius*MIN_DIST));
    }

    // FOG
    col = mix(col,vec3(1), pow(t/MAX_DIST,2.)); 
  } else {
    col = skyBox(dir);
  }

  outColor.xyz = col;
  outColor.w = 1.0;
}
`;
