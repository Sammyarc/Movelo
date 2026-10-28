/* A ray-traced WebGL sphere: object-space leather and grooves rotate under fixed light.
   No image of a ball is rotated or stretched. The photograph remains the fallback. */
window.createMoveloBall = (hero, onMove) => {
  const canvas = hero.querySelector('.hero-ball-canvas');
  const gl = canvas.getContext('webgl2', { alpha: true, antialias: true, premultipliedAlpha: false, powerPreference: 'low-power' });
  if (!gl) return null;
  const vertex = `#version 300 es
    in vec2 position; out vec2 uv;
    void main(){uv=position;gl_Position=vec4(position,0.,1.);}`;
  const fragment = `#version 300 es
    precision highp float;
    in vec2 uv; out vec4 color;
    uniform vec4 orientation;
    uniform sampler2D leather;
    vec3 rotate(vec3 v, vec4 q){return v+2.*cross(q.xyz,cross(q.xyz,v)+q.w*v);}
    vec2 sphereUV(vec3 p){return vec2(atan(p.z,p.x)/6.2831853+.5,asin(clamp(p.y,-1.,1.))/3.14159265+.5);}
    float groove(vec3 p){return min(min(abs(p.x),abs(p.y)),abs(abs(p.x)-.72)*.7);}
    float surfaceHeight(vec3 p){
      p=normalize(p);
      float relief=texture(leather,sphereUV(p)).r;
      // Rounded leather nodules sit above an actual recessed channel profile.
      float channel=1.-smoothstep(.006,.018,groove(p));
      return relief*.0015-channel*.004;
    }
    void main(){
      float r2=dot(uv,uv);
      if(r2>1.)discard;
      vec3 normal=vec3(uv,sqrt(max(0.,1.-r2)));
      vec3 p=rotate(normal,vec4(-orientation.xyz,orientation.w));
      vec2 st=sphereUV(p);
      vec3 material=texture(leather,st).rgb;
      float grain=material.r;
      vec3 tangent=normalize(vec3(-p.z,0.,p.x)+vec3(.00001,0.,0.));
      vec3 bitangent=normalize(cross(p,tangent));
      float stepSize=.0018;
      float du=(surfaceHeight(p+tangent*stepSize)-surfaceHeight(p-tangent*stepSize))/(2.*stepSize);
      float dv=(surfaceHeight(p+bitangent*stepSize)-surfaceHeight(p-bitangent*stepSize))/(2.*stepSize);
      float seam=groove(p);
      vec3 bumped=rotate(normalize(p-du*tangent-dv*bitangent),orientation);
      vec3 light=normalize(vec3(.7,.9,1.4));
      vec3 view=vec3(0.,0.,1.);
      vec3 halfVector=normalize(light+view);
      float nl=max(dot(bumped,light),0.);
      float nv=max(dot(bumped,view),.001);
      float nh=max(dot(bumped,halfVector),0.);
      float vh=max(dot(view,halfVector),0.);
      float edge=smoothstep(.0065,.0125,seam);
      float roughness=mix(.83,.64,material.g)*mix(1.13,1.,edge);
      float a=roughness*roughness;
      float d=a*a/(3.14159265*pow(nh*nh*(a*a-1.)+1.,2.));
      float k=pow(roughness+1.,2.)/8.;
      float geometry=(nv/(nv*(1.-k)+k))*(nl/(nl*(1.-k)+k));
      float fresnel=.035+.965*pow(1.-vh,5.);
      float spec=d*geometry*fresnel/max(4.*nv*nl,.001);
      vec3 orange=vec3(.95,.185,.025)*(.91+material.b*.14)*( .88+grain*.16 );
      vec3 rubber=vec3(.009,.011,.012)*( .85+grain*.15 );
      vec3 albedo=mix(rubber,orange,edge);
      float ambient=.18+.075*(bumped.y*.5+.5);
      float fill=max(dot(bumped,normalize(vec3(-.8,.15,1.))),0.)*.09;
      vec3 lit=albedo*(ambient+nl*.95+fill)+spec*nl*.7;
      lit*=mix(.66,1.,smoothstep(.002,.019,seam));
      color=vec4(pow(max(lit,vec3(0.)),vec3(1./2.2)),smoothstep(0.,.006,1.-r2));
    }`;
  const shaders=[];
  const compile=(type,source)=>{
    const shader=gl.createShader(type);shaders.push(shader);
    gl.shaderSource(shader,source);gl.compileShader(shader);
    if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(shader));
    return shader;
  };
  let program,buffer,texture;
  try {
    program=gl.createProgram();
    gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex));
    gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('Ball shader link failed');
    gl.useProgram(program);
    buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
    const attribute=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(attribute);gl.vertexAttribPointer(attribute,2,gl.FLOAT,false,0,0);
    // Packed material: R = height, G = roughness variation, B = orange color variation.
    // Jittered rounded nodules avoid the regular dotted grid of the initial version.
    const material=document.createElement('canvas');material.width=2048;material.height=1024;
    const ctx=material.getContext('2d');ctx.fillStyle='#333';ctx.fillRect(0,0,2048,1024);
    let seed=41;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
    for(let row=-1;row<172;row++)for(let col=0;col<320;col++){
      const x=col*6.4+(row%2)*3.2+(random()-.5)*3.3,y=row*6+(random()-.5)*3;
      const radius=2.7+random()*.8,stretch=.78+random()*.38,angle=random()*Math.PI;
      const peak=170+Math.floor(random()*70);
      for(const wrap of [-2048,0,2048]){
        if(x+wrap+radius<0||x+wrap-radius>2048)continue;
        ctx.save();ctx.translate(x+wrap,y);ctx.rotate(angle);ctx.scale(1,stretch);
        const height=ctx.createRadialGradient(0,0,0,0,0,radius);
        height.addColorStop(0,`rgb(${peak},${peak},${peak})`);
        height.addColorStop(.55,`rgb(${peak-25},${peak-25},${peak-25})`);
        height.addColorStop(.86,'#777');height.addColorStop(1,'#333');
        ctx.fillStyle=height;ctx.beginPath();ctx.arc(0,0,radius,0,Math.PI*2);ctx.fill();ctx.restore();
      }
    }
    const pixels=ctx.getImageData(0,0,2048,1024);
    for(let y=0;y<1024;y++)for(let x=0;x<2048;x++){
      const i=(y*2048+x)*4;
      const variation=Math.sin(x/2048*Math.PI*22+Math.sin(y*.027))*Math.sin(y*.019+x/2048*Math.PI*8);
      pixels.data[i]=Math.max(0,Math.min(255,pixels.data[i]+(random()-.5)*13));
      pixels.data[i+1]=145+variation*30+(random()-.5)*25;
      pixels.data[i+2]=140+variation*25+(random()-.5)*12;
    }
    ctx.putImageData(pixels,0,0);
    texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,material);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.generateMipmap(gl.TEXTURE_2D);
  } catch(error) {
    shaders.forEach(shader=>gl.deleteShader(shader));if(program)gl.deleteProgram(program);if(buffer)gl.deleteBuffer(buffer);if(texture)gl.deleteTexture(texture);
    return null;
  }
  const multiply=(a,b)=>[
    a[3]*b[0]+a[0]*b[3]+a[1]*b[2]-a[2]*b[1],
    a[3]*b[1]-a[0]*b[2]+a[1]*b[3]+a[2]*b[0],
    a[3]*b[2]+a[0]*b[1]-a[1]*b[0]+a[2]*b[3],
    a[3]*b[3]-a[0]*b[0]-a[1]*b[1]-a[2]*b[2]
  ];
  const axisAngle=(x,y,z,angle)=>[x*Math.sin(angle/2),y*Math.sin(angle/2),z*Math.sin(angle/2),Math.cos(angle/2)];
  let target=multiply(axisAngle(0,0,1,-.52),multiply(axisAngle(1,0,0,.3),axisAngle(0,1,0,-.35)));
  let current=[...target],frame=0,lastTime=0,disposed=false,contextLost=false,lastPointer=null,dragId=null;
  let displacement={x:0,y:0};
  const uniform=gl.getUniformLocation(program,'orientation');
  const draw=()=>{gl.useProgram(program);gl.uniform4fv(uniform,current);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.drawArrays(gl.TRIANGLES,0,6);};
  const tick=time=>{
    frame=0;if(disposed||contextLost||document.hidden)return;
    const amount=1-Math.exp(-Math.min((time-lastTime)/1000,.05)*18);lastTime=time;
    let dot=current.reduce((sum,value,i)=>sum+value*target[i],0);
    const direction=dot<0?-1:1;
    current=current.map((value,i)=>value+(direction*target[i]-value)*amount);
    const length=Math.hypot(...current);current=current.map(value=>value/length);draw();
    if(Math.abs(dot)<.999999)frame=requestAnimationFrame(tick);
  };
  const wake=()=>{if(!frame&&!disposed&&!contextLost&&!document.hidden){lastTime=performance.now();frame=requestAnimationFrame(tick);}};
  const resize=()=>{
    if(contextLost||disposed)return;
    const size=Math.min(1000,Math.max(256,Math.round(canvas.getBoundingClientRect().width*Math.min(devicePixelRatio,1.5))));
    canvas.width=size;canvas.height=size;gl.viewport(0,0,size,size);draw();
  };
  const reset=()=>{lastPointer=null;displacement={x:0,y:0};onMove(0,0);canvas.classList.remove('is-dragging');};
  const move=event=>{
    if(contextLost||event.pointerType!=='mouse'||hero.querySelector(':focus-visible'))return;
    const heroBounds=hero.getBoundingClientRect();
    if(event.clientX<heroBounds.left||event.clientX>heroBounds.right||event.clientY<heroBounds.top||event.clientY>heroBounds.bottom){up();return;}
    const bounds=canvas.getBoundingClientRect(),radius=bounds.width/2;
    const inside=Math.hypot(event.clientX-bounds.left-radius,event.clientY-bounds.top-radius)<=radius+4;
    // Pick up at the ball, then keep the initial grip offset throughout the hero.
    if(!inside&&lastPointer===null)return;
    if(lastPointer){
      const dx=event.clientX-lastPointer.x;
      const dy=event.clientY-lastPointer.y;
      const distance=Math.hypot(dx,dy);
      if(distance){target=multiply(axisAngle(dy/distance,dx/distance,0,distance/radius*1.6),target);const norm=Math.hypot(...target);target=target.map(v=>v/norm);wake();}
      const unit=1100/hero.clientWidth;
      displacement.x+=dx*unit;
      displacement.y+=dy*unit;
      onMove(displacement.x,displacement.y);
    }
    lastPointer={x:event.clientX,y:event.clientY};
  };
  const down=event=>{if(event.pointerType!=='mouse'||event.button!==0)return;dragId=event.pointerId;canvas.setPointerCapture(dragId);canvas.classList.add('is-dragging');lastPointer={x:event.clientX,y:event.clientY};event.preventDefault();};
  const up=()=>{const id=dragId;dragId=null;if(id!==null&&canvas.hasPointerCapture(id))canvas.releasePointerCapture(id);reset();};
  const leave=()=>up();
  const visibility=()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;up();}else wake();};
  const lost=event=>{event.preventDefault();contextLost=true;hero.classList.remove('has-3d-ball');up();cancelAnimationFrame(frame);frame=0;};
  hero.addEventListener('pointermove',move);canvas.addEventListener('pointerdown',down);
  canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);canvas.addEventListener('lostpointercapture',up);hero.addEventListener('pointerleave',leave);
  canvas.addEventListener('webglcontextlost',lost);
  hero.addEventListener('focusin',up);window.addEventListener('blur',up);document.addEventListener('visibilitychange',visibility);
  const observer=new ResizeObserver(resize);observer.observe(canvas);resize();hero.classList.add('has-3d-ball');
  return {
    reset:up,
    dispose(){
      disposed=true;up();cancelAnimationFrame(frame);observer.disconnect();hero.classList.remove('has-3d-ball');
      hero.removeEventListener('pointermove',move);canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('pointerup',up);canvas.removeEventListener('pointercancel',up);canvas.removeEventListener('lostpointercapture',up);hero.removeEventListener('pointerleave',leave);canvas.removeEventListener('webglcontextlost',lost);
      hero.removeEventListener('focusin',up);window.removeEventListener('blur',up);document.removeEventListener('visibilitychange',visibility);
      gl.deleteTexture(texture);gl.deleteBuffer(buffer);gl.deleteProgram(program);shaders.forEach(shader=>gl.deleteShader(shader));
    }
  };
};
