import { useEffect, useRef } from "react";
import * as THREE from "three";

const ThreeBackground = ({ activeSkill, isLightMode, formSubmitAnimState }) => {
  const mountRef = useRef(null);
  const cubesRef = useRef([]);
  const requestRef = useRef();
  const activeSkillRef = useRef(activeSkill);
  const formStateRef = useRef(formSubmitAnimState || 'idle');
  const currentHeroSkill = useRef(null);

  const pendingHeroUpdateRef = useRef(null);
  const rendererRef = useRef(null);

  // Position Controls
  const MAIN_CUBE_SCALE = 1.6;
  const MAIN_CUBE_OFFSET_X = 6.5;
  const MAIN_CUBE_OFFSET_Y = 0;

  const HERO_POS_X = 4.0;
  const HERO_POS_Y = 0.0;
  const HERO_POS_Z = 10.0;
  const HERO_SCALE = 1.0;

  const SATELLITE_CENTER_X = 4.0;
  const SATELLITE_CENTER_Y = 0.0;
  const SATELLITE_SPREAD = 6.0;
  const SATELLITE_DEPTH = 3.0;

  const createStickerTexture = (colorHex) => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = isLightMode ? "#e5e7eb" : "#050505";
    ctx.fillRect(0, 0, 512, 512);
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(24, 24, 464, 464, 48);
    else ctx.rect(24, 24, 464, 464);
    ctx.fillStyle = colorHex;
    ctx.fill();
    return new THREE.CanvasTexture(canvas);
  };

  const createAuraTexture = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);

    if (isLightMode) {
      gradient.addColorStop(0, "rgba(249, 115, 22, 0.9)");
      gradient.addColorStop(0.4, "rgba(239, 68, 68, 0.4)");
    } else {
      gradient.addColorStop(0, "rgba(0, 212, 255, 0.9)");
      gradient.addColorStop(0.4, "rgba(0, 100, 255, 0.4)");
    }

    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(canvas);
  };

  // --- BULLETPROOF IMAGE LOADER ---
  useEffect(() => {
    activeSkillRef.current = activeSkill;

    if (activeSkill) {
      // 1. Instantly create the canvas and context
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");

      // 2. Instantly draw the background and neon border
      ctx.fillStyle = isLightMode ? "#f9fafb" : "#050505";
      ctx.fillRect(0, 0, 512, 512);

      const neonColor = isLightMode ? "#f97316" : "#00d4ff";
      ctx.shadowColor = neonColor;
      ctx.shadowBlur = 40;
      ctx.lineWidth = 14;
      ctx.strokeStyle = neonColor;

      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(16, 16, 480, 480, 24);
      else ctx.rect(16, 16, 480, 480);
      ctx.stroke();
      ctx.stroke();

      // 3. Convert to a texture and send to the 3D Engine IMMEDIATELY
      // This prevents the screen from going blank while waiting for the image to load.
      const tex = new THREE.CanvasTexture(canvas);
      tex.anisotropy = 4;
      pendingHeroUpdateRef.current = { skill: activeSkill, texture: tex };

      // 4. Asynchronously load the actual image icon
      if (activeSkill.iconUrl) {
        const img = new Image();

        // Prevent CORS blocking for external URLs
        if (activeSkill.iconUrl.startsWith("http")) {
          img.crossOrigin = "anonymous";
        }

        img.onload = () => {
          // If user clicked a different skill while this was loading, abort.
          if (activeSkillRef.current?.id !== activeSkill.id) return;

          // Paint the image onto the ALREADY EXISTING canvas
          ctx.shadowColor = isLightMode ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.2)";
          ctx.shadowBlur = 20;

          const padding = 110;
          const size = 512 - padding * 2;
          ctx.drawImage(img, padding, padding, size, size);

          // Tell the 3D Engine to refresh the GPU with the new painted canvas!
          tex.needsUpdate = true;
        };

        img.onerror = (err) => {
          console.error("Failed to load icon texture:", activeSkill.iconUrl, err);
        };

        img.src = activeSkill.iconUrl;
      }
    } else {
      pendingHeroUpdateRef.current = { skill: null, texture: null };
    }
  }, [activeSkill, isLightMode]);

  useEffect(() => {
    formStateRef.current = formSubmitAnimState;
  }, [formSubmitAnimState]);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    while (currentMount.firstChild) {
      currentMount.removeChild(currentMount.firstChild);
    }

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(5, 2, 18);
    camera.lookAt(2, 0, 0);

    const ambientLight = new THREE.AmbientLight(
      0xffffff,
      isLightMode ? 2.0 : 1.5
    );
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(
      0xffffff,
      isLightMode ? 1.2 : 1.0
    );
    directionalLight.position.set(10, 20, 15);
    scene.add(directionalLight);

    const geometry = new THREE.BoxGeometry(1, 1, 1);

    const colorMats = {
      right: new THREE.MeshStandardMaterial({
        map: createStickerTexture("#2962FF"),
        roughness: 0.1,
        metalness: 0.1,
      }),
      left: new THREE.MeshStandardMaterial({
        map: createStickerTexture("#00C853"),
        roughness: 0.1,
        metalness: 0.1,
      }),
      top: new THREE.MeshStandardMaterial({
        map: createStickerTexture(isLightMode ? "#e5e7eb" : "#F5F5F5"),
        roughness: 0.1,
        metalness: 0.1,
      }),
      bottom: new THREE.MeshStandardMaterial({
        map: createStickerTexture("#FFD600"),
        roughness: 0.1,
        metalness: 0.1,
      }),
      front: new THREE.MeshStandardMaterial({
        map: createStickerTexture("#FF3333"),
        roughness: 0.1,
        metalness: 0.1,
      }),
      back: new THREE.MeshStandardMaterial({
        map: createStickerTexture("#FF9500"),
        roughness: 0.1,
        metalness: 0.1,
      }),
      inner: new THREE.MeshStandardMaterial({
        color: isLightMode ? 0x9ca3af : 0x374151,
        roughness: 0.9,
      }),
    };

    const cubes = [];
    const gap = 1.01;

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const isHeroBlock = x === 0 && y === 0 && z === 0;

          let cubeMaterials;
          if (isHeroBlock) {
            cubeMaterials = Array(6)
              .fill(0)
              .map(
                () =>
                  new THREE.MeshStandardMaterial({
                    color: 0xffffff,
                    transparent: true,
                    roughness: 0.1,
                    metalness: 0.1,
                  })
              );
          } else {
            cubeMaterials = [
              x === 1 ? colorMats.right : colorMats.inner,
              x === -1 ? colorMats.left : colorMats.inner,
              y === 1 ? colorMats.top : colorMats.inner,
              y === -1 ? colorMats.bottom : colorMats.inner,
              z === 1 ? colorMats.front : colorMats.inner,
              z === -1 ? colorMats.back : colorMats.inner,
            ].map((m) => {
              const clone = m.clone();
              clone.transparent = true;
              return clone;
            });
          }

          const mesh = new THREE.Mesh(geometry, cubeMaterials);

          let edgeLineRefs = null;
          let auraSpriteRef = null;

          if (isHeroBlock) {
            const edges = new THREE.EdgesGeometry(geometry);

            const edgeMat1 = new THREE.LineBasicMaterial({
              color: isLightMode ? 0xf97316 : 0x00d4ff,
              transparent: true,
              opacity: 0,
            });
            const edgeLines1 = new THREE.LineSegments(edges, edgeMat1);

            const edgeMat2 = new THREE.LineBasicMaterial({
              color: isLightMode ? 0xef4444 : 0x0077ff,
              transparent: true,
              opacity: 0,
            });
            const edgeLines2 = new THREE.LineSegments(edges, edgeMat2);
            edgeLines2.scale.setScalar(1.02);

            const auraMat = new THREE.SpriteMaterial({
              map: createAuraTexture(),
              color: 0xffffff,
              transparent: true,
              opacity: 0,
              blending: THREE.AdditiveBlending,
              depthWrite: false,
            });
            const auraSprite = new THREE.Sprite(auraMat);
            auraSprite.scale.set(4, 4, 1);

            mesh.add(edgeLines1);
            mesh.add(edgeLines2);
            mesh.add(auraSprite);

            edgeLineRefs = [edgeLines1, edgeLines2];
            auraSpriteRef = auraSprite;
          }

          const initialPos = new THREE.Vector3(x * gap, y * gap, z * gap);
          mesh.position.copy(initialPos);

          const radius = 8 + Math.random() * 12;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const targetPos = new THREE.Vector3(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta),
            radius * Math.cos(phi)
          );

          const detailPos = new THREE.Vector3(
            HERO_POS_X,
            HERO_POS_Y,
            HERO_POS_Z
          );

          const satDist = 3.0 + Math.random() * SATELLITE_SPREAD;
          const satAngle = Math.random() * Math.PI * 2;
          const satellitePos = new THREE.Vector3(
            SATELLITE_CENTER_X + Math.cos(satAngle) * satDist,
            SATELLITE_CENTER_Y + Math.sin(satAngle) * satDist,
            HERO_POS_Z - SATELLITE_DEPTH - Math.random() * 4
          );

          mesh.userData = {
            homeGrid: new THREE.Vector3(x, y, z),
            grid: new THREE.Vector3(x, y, z),
            currentPos: initialPos.clone(),
            currentRot: new THREE.Quaternion(),
            initialPos,
            targetPos,
            detailPos,
            satellitePos,
            satelliteScale: 0.1 + Math.random() * 0.3,
            initialRot: new THREE.Quaternion(),
            targetRot: new THREE.Euler(
              Math.random() * Math.PI,
              Math.random() * Math.PI,
              Math.random() * Math.PI
            ),
            isHero: isHeroBlock,
            floatSpeed: 0.005 + Math.random() * 0.01,
            floatOffset: Math.random() * Math.PI * 2,
            edgeLines: edgeLineRefs,
            auraSprite: auraSpriteRef,
          };

          scene.add(mesh);
          cubes.push(mesh);
        }
      }
    }
    cubesRef.current = cubes;

    const group = new THREE.Group();
    cubes.forEach((c) => group.add(c));
    group.rotation.set(0.5, -0.6, 0);
    group.scale.set(MAIN_CUBE_SCALE, MAIN_CUBE_SCALE, MAIN_CUBE_SCALE);
    scene.add(group);

    let time = 0;
    let explosionProgress = 0;
    let detailProgress = 0;
    let currentBottomFactor = 0;
    let scrambleVal = 0;
    let solveVal = 0;
    let blastVal = 0;

    const moveHistory = [];

    const scrambleState = {
      active: false,
      axis: "x",
      layer: 0,
      direction: 1,
      progress: 0,
      targetAngle: 0,
      cubes: [],
      cubesSet: new Set(),
      axisVec: new THREE.Vector3(),
      cooldown: 0,
      speed: 0.04,
    };

    const _basePos = new THREE.Vector3();
    const _baseRot = new THREE.Quaternion();
    const _scratchPos = new THREE.Vector3();
    const _scratchQ1 = new THREE.Quaternion();
    const _scratchQ2 = new THREE.Quaternion();
    const _scratchEuler = new THREE.Euler();
    const _scrambleQ = new THREE.Quaternion();

    const animate = () => {
      time += 0.01;
      const scrollY = window.scrollY;
      const width = window.innerWidth;
      const isMobile = width < 768;
      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );

      let targetExp = Math.min(Math.max((scrollY - 10) / 500, 0), 1);
      let targetBottomFactor = 0;

      const bottomThreshold = 800;
      if (maxScroll > 0 && scrollY > maxScroll - bottomThreshold) {
        const reassembleProgress = Math.max(
          0,
          (maxScroll - scrollY) / bottomThreshold
        );
        targetExp = Math.min(targetExp, reassembleProgress);
        targetBottomFactor = 1 - reassembleProgress;
      }

      explosionProgress += (targetExp - explosionProgress) * 0.06;
      currentBottomFactor += (targetBottomFactor - currentBottomFactor) * 0.05;
      detailProgress += ((activeSkillRef.current ? 1 : 0) - detailProgress) * 0.08;

      if (pendingHeroUpdateRef.current !== null) {
        const update = pendingHeroUpdateRef.current;
        pendingHeroUpdateRef.current = null;
        currentHeroSkill.current = update.skill;

        const hero = cubesRef.current.find((c) => c.userData.isHero);
        if (hero) {
          const oldTex = hero.material[0].map;
          if (update.texture) {
            hero.material.forEach((m) => {
              m.map = update.texture;
              m.emissiveMap = update.texture;
              m.emissive = new THREE.Color(isLightMode ? 0x222222 : 0x111111);
              m.needsUpdate = true;
            });
            if (oldTex && oldTex !== update.texture) oldTex.dispose();
          } else {
            hero.material.forEach((m) => {
              m.map = null;
              m.emissiveMap = null;
              m.emissive = new THREE.Color(0x000000);
              m.needsUpdate = true;
            });
            if (oldTex) oldTex.dispose();
          }
        }
      }

      const fState = formStateRef.current;
      if (fState === 'scramble') {
        scrambleVal += (1 - scrambleVal) * 0.1;
        solveVal *= 0.8;
      } else if (fState === 'solve') {
        scrambleVal *= 0.8;
        solveVal += (1 - solveVal) * 0.1;
      } else if (fState === 'blast') {
        blastVal += (1 - blastVal) * 0.08;
      } else {
        scrambleVal *= 0.9;
        solveVal *= 0.9;
        blastVal *= 0.9;
      }

      const isZoomed = detailProgress >= 0.1 || explosionProgress >= 0.1;
      const effectiveCooldown = (fState === 'solve' || fState === 'scramble') ? 0 : scrambleState.cooldown;

      if (effectiveCooldown > 0) {
        scrambleState.cooldown--;
      } else if (!scrambleState.active) {
        if (fState === 'solve' && moveHistory.length > 0) {
          const move = moveHistory.pop();
          scrambleState.axis = move.axis;
          scrambleState.layer = move.layer;
          scrambleState.direction = -move.direction;
          scrambleState.targetAngle = (Math.PI / 2) * scrambleState.direction;
          scrambleState.progress = 0;
          scrambleState.axisVec.set(0, 0, 0);
          scrambleState.axisVec[move.axis] = 1;
          scrambleState.cubes = cubesRef.current.filter((c) => Math.round(c.userData.grid[move.axis]) === move.layer);
          scrambleState.cubesSet.clear();
          scrambleState.cubes.forEach((c) => scrambleState.cubesSet.add(c));
          scrambleState.active = true;
          scrambleState.speed = 0.15;
        } else if (fState === 'scramble' || (!isZoomed && fState === 'idle')) {
          const axes = ["x", "y", "z"];
          const axis = axes[Math.floor(Math.random() * 3)];
          const layer = Math.floor(Math.random() * 3) - 1;
          const direction = Math.random() > 0.5 ? 1 : -1;

          moveHistory.push({ axis, layer, direction });
          if (moveHistory.length > 40) moveHistory.shift();

          scrambleState.axis = axis;
          scrambleState.layer = layer;
          scrambleState.direction = direction;
          scrambleState.targetAngle = (Math.PI / 2) * direction;
          scrambleState.progress = 0;
          scrambleState.axisVec.set(0, 0, 0);
          scrambleState.axisVec[axis] = 1;
          scrambleState.cubes = cubesRef.current.filter((c) => Math.round(c.userData.grid[axis]) === layer);
          scrambleState.cubesSet.clear();
          scrambleState.cubes.forEach((c) => scrambleState.cubesSet.add(c));
          scrambleState.active = true;
          scrambleState.speed = fState === 'scramble' ? 0.15 : 0.025;
        }
      }

      if (scrambleState.active) {
        scrambleState.progress += scrambleState.speed;
        if (scrambleState.progress >= 1.0) {
          scrambleState.progress = 1.0;
          _scrambleQ.setFromAxisAngle(scrambleState.axisVec, scrambleState.targetAngle);

          scrambleState.cubes.forEach((c) => {
            c.userData.currentRot.premultiply(_scrambleQ).normalize();

            const grid = c.userData.grid;
            const oldX = grid.x, oldY = grid.y, oldZ = grid.z;
            const d = scrambleState.direction;

            if (scrambleState.axis === "x") {
              grid.y = Math.round(-d * oldZ);
              grid.z = Math.round(d * oldY);
            } else if (scrambleState.axis === "y") {
              grid.x = Math.round(d * oldZ);
              grid.z = Math.round(-d * oldX);
            } else {
              grid.x = Math.round(-d * oldY);
              grid.y = Math.round(d * oldX);
            }

            c.userData.currentPos.set(grid.x * gap, grid.y * gap, grid.z * gap);
          });

          scrambleState.active = false;
          scrambleState.cubesSet.clear();
          scrambleState.cooldown = 20 + Math.random() * 40;
        }
      }

      const baseRotY = 0.5 + time * 0.2;
      const baseRotX = -0.6 + time * 0.1;
      const bottomRotY = -0.3 + time * 0.15;
      const bottomRotX = 0.4 + time * 0.05;

      const targetRotY = THREE.MathUtils.lerp(baseRotY, bottomRotY, currentBottomFactor);
      const targetRotX = THREE.MathUtils.lerp(baseRotX, bottomRotX, currentBottomFactor);

      group.rotation.y = THREE.MathUtils.lerp(targetRotY, 0, detailProgress);
      group.rotation.x = THREE.MathUtils.lerp(targetRotX, 0, detailProgress);

      // Responsive X Offset
      const dynamicOffsetX = isMobile ? 1.2 : MAIN_CUBE_OFFSET_X;
      // At bottom, desktop moves to the left (-5.5), mobile stays offset (1.2)
      const bottomXDist = isMobile ? 0 : 11.0;
      const targetPosX = THREE.MathUtils.lerp(dynamicOffsetX, dynamicOffsetX - bottomXDist, currentBottomFactor);

      group.position.x = THREE.MathUtils.lerp(targetPosX, 0, detailProgress);
      group.position.y = THREE.MathUtils.lerp(-(scrollY * 0.001) + MAIN_CUBE_OFFSET_Y, 0, detailProgress);

      const targetCamY = activeSkillRef.current ? 0 : group.position.y + 2 - scrollY * 0.001;
      const targetCamX = activeSkillRef.current ? 0 : (isMobile ? 0 : 5);

      camera.position.y += (targetCamY - camera.position.y) * 0.1;
      camera.position.x += (targetCamX - camera.position.x) * 0.1;
      camera.lookAt(
        activeSkillRef.current ? 0 : (isMobile ? 0 : 2),
        activeSkillRef.current ? 0 : group.position.y,
        0
      );

      cubesRef.current.forEach((cube) => {
        _basePos.copy(cube.userData.currentPos);
        _baseRot.copy(cube.userData.currentRot);
        let currentScale = 1;

        if (scrambleState.active && scrambleState.cubesSet.has(cube)) {
          const p = scrambleState.progress;
          const ease = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
          _scrambleQ.setFromAxisAngle(scrambleState.axisVec, scrambleState.targetAngle * ease);
          _basePos.applyQuaternion(_scrambleQ);
          _baseRot.premultiply(_scrambleQ);
        }

        _scratchPos.copy(cube.userData.targetPos);
        _scratchPos.y += Math.sin(time * 2 + cube.userData.floatOffset) * 0.5 * explosionProgress;
        _basePos.lerp(_scratchPos, explosionProgress);

        _scratchQ1.setFromEuler(cube.userData.targetRot);
        _scratchEuler.set(Math.sin(time * 0.5) * 0.2, Math.cos(time * 0.5) * 0.2, 0);
        _scratchQ2.setFromEuler(_scratchEuler);
        _scratchQ1.multiply(_scratchQ2);
        _baseRot.slerp(_scratchQ1, explosionProgress);

        if (fState !== 'idle' || solveVal > 0.01 || blastVal > 0.01) {
          if (solveVal > 0.01 && moveHistory.length === 0 && !scrambleState.active) {
            _scratchPos.set(
              cube.userData.homeGrid.x * gap,
              cube.userData.homeGrid.y * gap,
              cube.userData.homeGrid.z * gap
            );
            _basePos.lerp(_scratchPos, solveVal);

            _scratchQ1.identity();
            _baseRot.slerp(_scratchQ1, solveVal);
          }

          if (blastVal > 0.01) {
            _scratchPos.copy(_basePos).normalize().multiplyScalar(blastVal * 40);
            _basePos.add(_scratchPos);
            _scratchEuler.set(
              cube.userData.grid.x * blastVal * 10,
              cube.userData.grid.y * blastVal * 10,
              cube.userData.grid.z * blastVal * 10
            );
            _scratchQ1.setFromEuler(_scratchEuler);
            _baseRot.multiply(_scratchQ1);
          }
        }

        if (detailProgress > 0.001) {
          if (cube.userData.isHero) {
            const heroFloatY = Math.sin(time * 2) * 0.15;
            _scratchPos.copy(cube.userData.detailPos);
            _scratchPos.y += heroFloatY;
            _basePos.lerp(_scratchPos, detailProgress);

            _scratchEuler.set(time * 0.2, time * 0.3, Math.sin(time) * 0.1);
            _scratchQ1.setFromEuler(_scratchEuler);
            _baseRot.slerp(_scratchQ1, detailProgress);

            currentScale = HERO_SCALE;

            if (cube.userData.edgeLines) {
              cube.userData.edgeLines[0].material.opacity = detailProgress * 1.0;
              cube.userData.edgeLines[1].material.opacity = detailProgress * 0.5;
            }
            if (cube.userData.auraSprite) {
              cube.userData.auraSprite.material.opacity = detailProgress * 1.0;
            }
          } else {
            const satFloatY = Math.sin(time * 1.5 + cube.userData.floatOffset) * 0.5;
            _scratchPos.copy(cube.userData.satellitePos);
            _scratchPos.y += satFloatY;
            _basePos.lerp(_scratchPos, detailProgress);

            _scratchEuler.set(
              time * cube.userData.floatSpeed * 2,
              time * cube.userData.floatSpeed * 3,
              0
            );
            _scratchQ1.setFromEuler(_scratchEuler);
            _baseRot.slerp(_scratchQ1, detailProgress);

            currentScale = THREE.MathUtils.lerp(1, cube.userData.satelliteScale, detailProgress);
          }
        } else {
          if (cube.userData.isHero) {
            if (cube.userData.edgeLines) {
              cube.userData.edgeLines[0].material.opacity = 0;
              cube.userData.edgeLines[1].material.opacity = 0;
            }
            if (cube.userData.auraSprite) {
              cube.userData.auraSprite.material.opacity = 0;
            }
          }
        }

        cube.position.copy(_basePos);
        cube.quaternion.copy(_baseRot);
        cube.scale.setScalar(currentScale);

        const baseAlpha = 1.0 - explosionProgress * 0.7;
        const detailAlpha = cube.userData.isHero
          ? 1.0
          : THREE.MathUtils.lerp(1.0, 0.2, detailProgress);
        let finalAlpha = Math.min(baseAlpha, detailAlpha);

        if (blastVal > 0.01) {
          finalAlpha = THREE.MathUtils.lerp(finalAlpha, 0, Math.min(blastVal * 1.5, 1));
        }

        cube.material.forEach((m) => {
          m.opacity = finalAlpha;
          m.transparent = true;
        });
      });

      renderer.render(scene, camera);
      requestRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(requestRef.current);
      rendererRef.current = null;
      pendingHeroUpdateRef.current = null;
      if (currentMount && renderer.domElement) {
        if (currentMount.contains(renderer.domElement)) {
          currentMount.removeChild(renderer.domElement);
        }
      }
      geometry.dispose();
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLightMode]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none transition-all duration-700 opacity-90 z-0"
    />
  );
};

export default ThreeBackground;