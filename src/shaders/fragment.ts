export const FragmentSrc = `#version 300 es
precision highp float;
in vec2 pos;
out vec4 outColor;
uniform vec3 u_mouse;
uniform vec2 u_resolution;

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

const vec3 lightSrc = vec3(4);

vec3 GetRayDir(vec2 uv, vec3 from, vec3 lookat, float fov) {
  vec3 upDir = vec3(0,1,0);
  vec3 camDir = normalize(lookat-from);
  vec3 r = normalize(cross(upDir, camDir));
  vec3 u = cross(camDir,r);
  vec3 c = camDir*fov;
  vec3 i = c + uv.x*r + uv.y*u;
  return normalize(i);
}

float circleSDF(vec3 pos, vec3 center, float r){
  return length(center - pos) - r;
}

float getDist(vec3 pos){
  float dist = pos.y+2.;
  dist = min(dist, circleSDF(pos, vec3(0), 2.));
  dist = min(dist, circleSDF(pos, vec3(2.2), 0.8));

  return dist;
}

vec3 getNormal(vec3 pos){
  float d = getDist(pos);
  
  vec3 n = d - vec3(
      getDist(vec3(pos.x - .01, pos.y,       pos.z)),
      getDist(vec3(pos.x,       pos.y - .01, pos.z)),
      getDist(vec3(pos.x,       pos.y,       pos.z - .01))
  );
  
  return normalize(n);
}

vec2 rayMarch(vec3 org, vec3 dir){
  float depth = 0.0;
  float minT = 999999.0;

  for(int i = 0; i < MAX_STEPS; i++){
    vec3 pos = org + depth * dir;
    float t = getDist(pos);
    minT = min(minT,t);
    depth += t;
    if(t < MIN_DIST || depth > MAX_DIST) break;
  }

  return vec2(depth,minT);
}

vec3 skyBox(vec3 dir){
  return mix(vec3(1), RGB(117, 165, 240), dir.y);
}

void main(){
  vec3 col = vec3(1);
  
  vec2 fragCoord = pos*u_resolution;
  vec2 uv = fragCoord/u_resolution.y;
  vec2 m = u_mouse.xy/u_resolution.xy;

  vec3 org = vec3(0, 3, -5);
  org.xz *= rot(-m.x*2.0*PI);
  
  vec3 dir = GetRayDir(uv, org, vec3(0), .8);
  
  float t = rayMarch(org, dir).x;
  if(t < MAX_DIST){
    vec3 pos = org + dir * t;

    // Direct lighting
    vec3 normal = getNormal(pos);
    col = vec3(1,0,1);
    col *= dot(normalize(lightSrc), normal)/2.0+0.4;

    // Shadow
    float shadowRadius = 5.0;
    vec3 lightDir = normalize(lightSrc-pos);
    vec2 shadowRes = rayMarch(pos + normal * 0.7, lightDir);
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